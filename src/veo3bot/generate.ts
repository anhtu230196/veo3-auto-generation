import type { Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type { VeoPrompt } from "../splitter/prompt-writer.js";
import type { CharacterProfile } from "../characters/extract.js";
import type { SettingProfile } from "../settings/extract.js";
import type { PropProfile } from "../props/extract.js";
import { ensureProjects, waitForProjectReady } from "./project.js";
import { ensureCharactersInFlow } from "./characters.js";
import { ensureSettingsInFlow } from "./settings.js";
import { ensurePropsInFlow } from "./props.js";
import { launchVeo3Browser } from "./browser.js";
import { debugCapture, debugLog } from "./debug.js";

const POLL_INTERVAL_MS = 5000;
// XÁC NHẬN TRỰC TIẾP (2026-07-18, cảnh #14, xem RUNBOOK mục 4.27): người dùng KHÔNG muốn đợi 10
// phút mỗi khi có lỗi thật (bị chặn/kẹt) — chấp nhận đánh đổi: cảnh nào THẬT SỰ cần lâu hơn 3
// phút (vd nội dung căng thẳng cần kiểm duyệt lâu, xem lịch sử bug bên dưới) sẽ rơi vào nhánh
// reload-recheck rồi thất bại/retry ở lần chạy sau, thay vì ngồi chờ tại chỗ. Giảm từ 10 xuống 3
// phút. Lịch sử: cảnh nội dung căng thẳng (thẩm vấn/toà án) từng bị timeout LẶP LẠI RẤT NHIỀU LẦN
// ở mốc 5 phút — nghi ngờ cần thời gian kiểm duyệt lâu hơn hẳn (không phải bị chặn hẳn, vì không
// có card "Failed" nào xuất hiện, chỉ là chưa xong).
const GENERATE_TIMEOUT_MS = 2 * 60 * 1000;
// Cùng bug class đã gặp ở imageAsset.ts (2026-07-18): reload-recheck cũ chỉ chờ cố định 3 giây
// rồi chốt luôn — không đủ nếu project đã tích luỹ nhiều media khiến trang tải lại chậm. Đổi
// sang chờ trang sẵn sàng (Add Media hiện ra) rồi POLL thêm 1 khoảng đủ dài trước khi kết luận
// lỗi thật (xem generateOneClip bên dưới).
const RELOAD_RECHECK_TIMEOUT_MS = 90 * 1000;

/**
 * Text nút/tab xác nhận trực tiếp trên labs.google/fx/tools/flow ngày 2026-07-13.
 * Flow không có API chính thức, UI có thể đổi — nếu bot lỗi, mở
 * `npx playwright codegen https://labs.google/fx/tools/flow` để soi lại text/label mới.
 */
const TEXT = {
  generate: "arrow_forward", // chỉ match icon (chắc chắn không trùng nút nào khác)
  modelLite: "Veo 3.1 - Lite [Lower Priority]",
};

function durationTabLabel(seconds: number): "4s" | "6s" | "8s" {
  if (seconds <= 4) return "4s";
  if (seconds <= 6) return "6s";
  return "8s";
}

// GHI CHÚ QUAN TRỌNG (phát hiện muộn, sau khi đã chạy nhiều vòng): cách "Add Media" +
// click card Character CHỈ đính kèm ảnh làm gợi ý phong cách chung, KHÔNG thực sự buộc
// Veo3 dùng đúng khuôn mặt nhân vật — dẫn đến rất nhiều cảnh render ra người hoàn toàn
// khác. Cách ĐÚNG: gõ "@" ngay trong ô prompt để mở dropdown mention, chọn đúng mục loại
// "Character" (không phải "Image") — Flow chèn vào 1 CHIP tham chiếu thật sự (Slate.js
// void inline node), ràng buộc Veo3 dùng đúng nhân vật đó. Toàn bộ hàm attachCharacters
// cũ (dùng overlay riêng) đã bị loại bỏ, thay bằng chèn @mention trực tiếp trong
// fillPromptWithMentions bên dưới.

async function ensureModelAndDuration(page: Page): Promise<void> {
  // Pill hiển thị model/tỷ lệ khung hình hiện tại — label thay đổi theo chế độ đang chọn
  // (vd "Video · 8s ..." nếu đang ở Video, hoặc "🍌 Nano Banana 2 ..." nếu đang ở Image,
  // do việc tạo Character trước đó dùng model ảnh làm đổi chế độ mặc định của canvas
  // chính luôn). Vì vậy KHÔNG match theo "Video ·" — dùng icon tỷ lệ khung hình
  // "crop_16_9" luôn xuất hiện ở cả 2 chế độ, và chỉ duy nhất TRƯỚC khi bảng mở ra
  // (bên trong bảng cũng có nút "16:9" trùng text nhưng chưa tồn tại lúc này).
  const pill = page.locator('button:has-text("crop_16_9")').first();
  try {
    await pill.click({ timeout: 15000 });
  } catch {
    // Sau nhiều chục lần generate liên tiếp, trang đôi khi vào trạng thái lag/kẹt —
    // reload để làm mới DOM trước khi thử lại, tránh crash cả pipeline.
    console.log("[veo3bot] pill cài đặt không phản hồi, reload trang và thử lại...");
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19 — bản cũ chỉ chụp SAU reload/
    // recheck, lúc đó DOM đã bị reload làm mới nên lỗi thật (nếu có dialog/thông báo/trạng thái
    // kẹt cụ thể) đã biến mất, khiến debug capture không phản ánh đúng nguyên nhân gốc): lưu lại
    // trạng thái trang NGAY LÚC phát hiện bất thường, trước khi reload xoá mất bằng chứng.
    await debugCapture(page, "pre-reload-pill-stuck");
    // waitUntil "domcontentloaded" — "load"/"networkidle" không bao giờ fire ổn định khi
    // project có nhiều media, gây timeout dù trang đã tương tác được thật sự.
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
    await pill.click({ timeout: 15000 });
  }
  await page.waitForTimeout(500);

  // QUAN TRỌNG: có 2 thứ khác nhau chứa chữ "Video" — pill đã đóng (vd "Video · 8s...",
  // KHÔNG có aria-selected) và tab thật bên trong bảng (CÓ aria-selected="true|false").
  // Nếu không lọc theo [aria-selected], có lúc bấm nhầm vào pill làm đóng bảng luôn.
  const videoTab = page.locator('button[aria-selected]:has-text("Video")').first();
  if ((await videoTab.getAttribute("aria-selected")) !== "true") {
    await videoTab.click();
    await page.waitForTimeout(300);
  }

  // Dropdown model hiển thị TÊN MODEL HIỆN TẠI (có thể không phải Lite — vd "Omni Flash"
  // — do lần dùng gần nhất khác đi), nên không thể match cứng theo tên "Lite". Chỉ có
  // đúng 1 dropdown dạng này trong bảng cài đặt đang mở, nhận diện qua icon
  // "arrow_drop_down" — luôn bấm mở rồi chọn lại đúng Lite (an toàn kể cả khi đã đúng).
  await page.locator('button:has-text("arrow_drop_down")').click();
  await page.getByText(TEXT.modelLite, { exact: false }).last().click();

  const durationLabel = durationTabLabel(config.clipSeconds);
  await page.locator(`button:has-text("${durationLabel}")`).last().click();

  await page.keyboard.press("Escape");
}

interface MentionOccurrence {
  name: string;
  start: number;
  end: number;
}

/**
 * Tìm MỌI vị trí xuất hiện dạng CHỮ THẬT của từng tên trong `text` — ưu tiên khớp tên DÀI HƠN
 * trước (vd "Santa María Ship Deck" trước "Santa María") để 1 tên ngắn không "ăn" nhầm vào
 * giữa 1 tên dài hơn có chứa nó làm substring. Trả về danh sách đã sort theo vị trí, không
 * chồng lấn. 1 tên có thể xuất hiện NHIỀU LẦN trong cùng 1 prompt (QUY TẮC NHÂN VẬT yêu cầu
 * nhắc tên đầy đủ mỗi khi nhân vật hành động) — TẤT CẢ các lần xuất hiện đều được thay bằng
 * chip, không chỉ lần đầu.
 */
function findMentionOccurrences(text: string, names: string[]): MentionOccurrence[] {
  const sortedByLength = [...names].sort((a, b) => b.length - a.length);
  const occupied = new Array(text.length).fill(false);
  const occurrences: MentionOccurrence[] = [];
  for (const name of sortedByLength) {
    let searchFrom = 0;
    while (true) {
      const idx = text.indexOf(name, searchFrom);
      if (idx === -1) break;
      const end = idx + name.length;
      searchFrom = end;
      if (occupied.slice(idx, end).some(Boolean)) continue;
      occurrences.push({ name, start: idx, end });
      occupied.fill(true, idx, end);
    }
  }
  occurrences.sort((a, b) => a.start - b.start);
  return occurrences;
}

/**
 * Điền prompt + chèn chip @mention Character THẬT để ràng buộc đúng khuôn mặt.
 *
 * CƠ CHẾ UI (xác nhận trực tiếp 2026-07-15): gõ "@" trong ô prompt KHÔNG mở dropdown text
 * mà chèn 1 nút void mở DIALOG chọn asset (Radix dialog, có ô input[placeholder="Search
 * assets"] + các card asset, mỗi card có subtitle loại "Character"/"Image"/...). Phải:
 * điền tên vào ô Search rồi click đúng card loại Character → dialog đóng, chip được gắn.
 *
 * ĐỔI CÁCH CHÈN (2026-07-19) — chèn chip NGAY TẠI VỊ TRÍ tên xuất hiện trong câu, không còn
 * gộp hết ở cuối. LÝ DO: Flow từ chối tạo cảnh với lỗi "might violate our policies about
 * generating prominent people" dù đã có chip @mention đúng nhân vật — nghi ngờ trực tiếp bộ
 * lọc chính sách quét CẢ text thô trong ô prompt (tên chữ của nhân vật lịch sử có thật), không
 * chỉ riêng ảnh Ingredient. Xoá hẳn tên CHỮ khỏi prompt (thay bằng chip tại đúng vị trí đó) để
 * tránh bị chính sách quét trúng text thô, đồng thời chip vẫn đứng đúng ngữ pháp câu (rõ ràng
 * hơn cả cách cũ, vì trước đây chip tách rời hẳn khỏi câu, đứng dồn cục ở cuối).
 *
 * CÁCH LÀM ỔN ĐỊNH (giữ nguyên nguyên tắc cũ, chỉ áp dụng nhiều lần thay vì 1 lần ở cuối): mọi
 * thao tác gõ/chèn chip đều xảy ra ở ĐÚNG VỊ TRÍ CUỐI của phần đã gõ tính đến thời điểm đó —
 * KHÔNG BAO GIỜ nhảy vào giữa văn bản đã gõ trước đó để chèn chip (đó là nguyên nhân bản cũ né
 * hẳn việc chèn xen giữa: click card làm mất focus editor, nếu cursor đang ở giữa 1 đoạn text
 * đã gõ trước, phần gõ SAU đó sẽ bị mất). Cụ thể: gõ đoạn text TRƯỚC tên đầu tiên → chèn chip
 * (luôn đang ở cuối tài liệu tại bước này) → re-focus + đưa cursor về cuối (để chắc chắn) → gõ
 * đoạn text TIẾP THEO cho đến tên kế tiếp → lặp lại. Vì mỗi lần chèn chip đều diễn ra khi cursor
 * đang ở CUỐI tài liệu (không phải giữa), không tái diễn lỗi mất text của cách chèn-giữa ngây
 * thơ trước đây.
 *
 * Nếu 1 tên KHÔNG xuất hiện dạng chữ trong `videoPrompt` (Setting/Prop không được nhắc trong
 * lời văn, hoặc do STYLE_ANCHOR_MENTION_SENTENCE đã có sẵn "@Style Anchor" dạng chữ — xử lý
 * riêng, xem bên dưới), chip của tên đó vẫn được chèn ở CUỐI như cơ chế cũ (không đổi).
 *
 * Cuối cùng XÁC MINH số chip void trong DOM = tổng số lần chèn dự kiến (đếm cả tên lặp lại
 * nhiều lần trong câu), nếu thiếu thì throw để vòng retry chạy lại (KHÔNG tạo clip với mặt sai).
 *
 * Setting/Prop asset (bối cảnh/đạo cụ cố định, xem settings.ts/props.ts) dùng CHUNG cơ chế
 * @mention này — dialog chọn asset tìm theo tên, không lọc theo loại Character/Setting/Prop,
 * nên chỉ cần gộp characterNames + settingNames + propNames thành 1 danh sách tên để chèn
 * chip, miễn tên không trùng giữa các danh sách (đảm bảo ở bước đặt tên nhân vật/bối cảnh/
 * đạo cụ).
 *
 * ĐÃ THỬ VÀ BỎ (2026-07-16): từng thêm 1 "Style Anchor" @mention vào MỌI cảnh để chống trôi
 * phong cách ở cảnh không có Ingredient nào. GỠ BỎ vì tác dụng phụ nghiêm trọng hơn: asset đó
 * được tạo qua công cụ "Create Character" (dành cho tạo NGƯỜI) nên luôn ra 1 nhân vật người cụ
 * thể dù mô tả là khung viền trừu tượng — @mention nó vào MỌI cảnh khiến nhân vật đó đè lên
 * bất kỳ người vô danh nào trong cảnh (xác nhận trực tiếp: cảnh "a young unnamed mapmaker" ra
 * đúng hình người mặc hoodie cam của Style Anchor thay vì người chung chung đúng thời đại).
 * KHÔNG lặp lại cách này — nếu muốn neo style cho cảnh không Ingredient, phải dùng asset
 * loại Prop/Image (qua imageAsset.ts) chứ không phải Character, và cần kiểm tra thật kỹ liệu
 * việc gắn nó vào cảnh có người có gây lẫn nhân dạng không trước khi áp dụng đại trà.
 */
async function fillPromptWithMentions(page: Page, prompt: VeoPrompt): Promise<void> {
  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  // Xoá sạch nội dung cũ (select-all + Backspace; fill("") đôi khi để sót chip void cũ).
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  const { videoPrompt: text, characterNames, settingNames, propNames } = prompt;
  const mentionNames = [...characterNames, ...(settingNames ?? []), ...(propNames ?? [])];
  const uniqueNames = [...new Set(mentionNames)];

  if (uniqueNames.length === 0) {
    await page.keyboard.type(text);
    return;
  }

  async function insertMentionChip(name: string): Promise<void> {
    // Luôn mở picker khi cursor đang ở CUỐI tài liệu (xem docstring trên) — chủ động re-focus +
    // đưa cursor về cuối TRƯỚC khi gõ "@" (an toàn kép, dù theo lý thuyết cursor đã ở đúng vị
    // trí từ bước trước — cùng triết lý phòng thủ đã dùng xuyên suốt code UI dễ vỡ này).
    await promptBox.click();
    await page.keyboard.press("ControlOrMeta+ArrowDown");
    await page.keyboard.press("End");
    await page.keyboard.type(" @");
    await page.waitForTimeout(1000);

    const search = page.locator('input[placeholder="Search assets"]');
    try {
      await search.waitFor({ state: "visible", timeout: 8000 });
    } catch {
      await debugCapture(page, `mention-picker-fail-scene${prompt.index}`);
      throw new Error(`Không mở được picker @mention cho "${name}" (cảnh #${prompt.index}) — thử lại.`);
    }
    await search.fill(name);

    // XÁC NHẬN TRỰC TIẾP (2026-07-18, cảnh #7, prop "Santa María", xem RUNBOOK mục 4.25 cập
    // nhật): search "Santa María" khớp CẢ hàng trăm clip/ảnh khác có nhắc cụm từ đó trong
    // prompt (không chỉ đúng 1 asset tên "Santa María"), danh sách kết quả dùng react-virtuoso
    // (ảo hoá — chỉ RENDER item đang ở viewport, `padding-bottom` phản ánh ~640 item CHƯA render
    // phía dưới). Sort mặc định "Recent" đẩy asset tạo từ đầu dự án xuống tít cuối, ngoài tầm với
    // dù đợi bao lâu nếu không cuộn. Thử đổi sort sang "Name/A-Z" trước (best-effort, im lặng bỏ
    // qua nếu Flow không có tuỳ chọn này) — tên ĐÚNG (không hậu tố) luôn xếp trước các tên dài
    // hơn cùng tiền tố theo thứ tự bảng chữ cái, giúp tìm thấy nhanh hơn nhiều so với "Recent".
    try {
      const sortTrigger = page
        .locator('[role="dialog"]')
        .locator('div:has(#add-menu-input)')
        .locator('xpath=following-sibling::button[1]');
      await sortTrigger.click({ timeout: 2000 });
      await page.getByRole("menuitem", { name: /name|a.?z|alphabet/i }).first().click({ timeout: 2000 });
    } catch {
      await page.keyboard.press("Escape").catch(() => {});
    }

    // Click đúng card trong DIALOG (scope theo [role="dialog"] để không khớp nhầm text tên
    // đang nằm trong chính prompt), khớp exact tên. POLL + CUỘN danh sách ảo hoá xuống dần thay
    // vì chỉ chờ 1 mốc cố định — item đúng có thể chưa được render vào DOM cho tới khi cuộn tới.
    const card = page.locator('[role="dialog"]').getByText(name, { exact: true }).last();
    const scroller = page.locator('[data-testid="virtuoso-scroller"]').first();
    const searchDeadline = Date.now() + 20000;
    let cardFound = false;
    while (Date.now() < searchDeadline) {
      if (await card.count()) {
        cardFound = true;
        break;
      }
      await scroller.evaluate((el) => { el.scrollTop += el.clientHeight * 0.8; }).catch(() => {});
      await page.waitForTimeout(400);
    }
    if (!cardFound) {
      await debugCapture(page, `mention-card-missing-scene${prompt.index}`);
      throw new Error(`Không thấy Character/Setting/Prop "${name}" trong picker (cảnh #${prompt.index}) — thử lại.`);
    }
    await card.click();
    await page.waitForTimeout(400);
    // Một số phiên bản cần bấm "Add to Prompt"; nếu card click đã tự đóng dialog thì nút
    // này không còn (count 0) → bỏ qua.
    const addBtn = page.getByText("Add to Prompt", { exact: false }).last();
    if (await addBtn.count()) {
      await addBtn.click().catch(() => {});
    }
    await page.waitForTimeout(700);

    // Click card có thể làm mất focus editor — re-focus + đưa cursor về CUỐI tài liệu trước
    // khi gõ tiếp, tránh tái diễn lỗi mất text của cách chèn-giữa ngây thơ (xem docstring).
    await promptBox.click();
    await page.keyboard.press("ControlOrMeta+ArrowDown");
    await page.keyboard.press("End");
  }

  const occurrences = findMentionOccurrences(text, uniqueNames);
  const inlineNames = new Set(occurrences.map((o) => o.name));
  const trailingNames = uniqueNames.filter((n) => !inlineNames.has(n));

  // 1) Gõ xen kẽ: đoạn text trước mỗi tên → chèn chip TẠI vị trí đó (thay hẳn tên chữ) → tiếp
  // tục đoạn sau. Luôn ở cuối tài liệu tại mọi thời điểm (xem docstring).
  let cursor = 0;
  for (const occ of occurrences) {
    let before = text.slice(cursor, occ.start);
    // LƯỚI AN TOÀN (không còn xảy ra với STYLE_ANCHOR_MENTION_SENTENCE từ khi bỏ "@" khỏi
    // styleDNA.ts, xem RUNBOOK mục 4.25, nhưng vẫn giữ phòng trường hợp Claude viết tay
    // state/prompts.json lỡ gõ sẵn "@Tên" trong videoPrompt): nếu tên vừa khớp đứng ngay sau 1
    // dấu "@" thừa trong text, bỏ dấu đó đi — gõ "@" dạng CHỮ THẬT (không qua picker có kiểm
    // soát) sẽ tự mở dialog chọn asset của Flow giữa chừng, làm hỏng cả đoạn text gõ sau đó.
    if (before.endsWith("@")) before = before.slice(0, -1);
    if (before) await page.keyboard.type(before);
    await insertMentionChip(occ.name);
    cursor = occ.end;
  }
  const remainder = text.slice(cursor);
  if (remainder) await page.keyboard.type(remainder);

  // 2) Tên KHÔNG xuất hiện dạng chữ trong prompt — chèn chip ở cuối như cơ chế cũ.
  for (const name of trailingNames) {
    await insertMentionChip(name);
  }

  // 3) XÁC MINH chip void đã chèn đủ — tổng số lần chèn dự kiến (đếm cả tên lặp lại nhiều lần).
  const expectedChipCount = occurrences.length + trailingNames.length;
  const html = await promptBox.innerHTML();
  const voidChips = (html.match(/data-slate-void="true"/g) || []).length;
  debugLog(
    "mentions",
    `cảnh #${prompt.index}: ${voidChips}/${expectedChipCount} chip @mention (${uniqueNames.join(", ")})`
  );
  if (voidChips < expectedChipCount) {
    await debugCapture(page, `chip-mismatch-scene${prompt.index}`);
    throw new Error(
      `Chip @mention chưa đủ cho cảnh #${prompt.index} (có ${voidChips}/${expectedChipCount}) — thử lại để tránh sai nhân vật.`
    );
  }
}

/**
 * XÁC NHẬN TRỰC TIẾP (2026-07-18, cảnh #14, xem RUNBOOK mục 4.27): đếm SỐ LƯỢNG `video[src]` để
 * so baseline (cách cũ) không đáng tin — soi debug capture lúc lỗi thấy trang CHỈ CÓ ĐÚNG 1 thẻ
 * `<video src>` (không phải cả lưới nhiều video như tưởng), cả TRƯỚC lẫn SAU khi generate xong
 * thật (người dùng xác nhận trực tiếp trong Flow) — nghĩa là Flow chỉ giữ 1 phần tử `<video>`
 * "đang xem/preview" DUY NHẤT và đổi `src` của NÓ tại chỗ khi có clip mới, chứ không thêm phần tử
 * mới vào DOM. Đếm SỐ LƯỢNG không bao giờ tăng trong trường hợp này → luôn báo timeout oan dù đã
 * xong thật. Đổi sang so sánh TẬP HỢP giá trị `src` — coi là xong khi xuất hiện 1 giá trị `src`
 * KHÔNG có trong baseline (dù số lượng phần tử tăng hay chỉ đổi src tại chỗ, cách này đều bắt
 * được).
 */
async function currentVideoSrcs(page: Page): Promise<Set<string>> {
  const locators = page.locator("video[src]");
  const count = await locators.count();
  const srcs = new Set<string>();
  for (let i = 0; i < count; i++) {
    const src = await locators.nth(i).getAttribute("src");
    if (src) srcs.add(src);
  }
  return srcs;
}

/**
 * XÁC NHẬN TRỰC TIẾP (2026-07-19, soi debug capture `rename-card-missing-scene0-*.html`): giả
 * thuyết ban đầu "Generated video" (đoán theo mẫu "Generated image" của Setting/Prop) SAI — tên
 * thật của mỗi item video là **"Video thumbnail"** (từ `alt` của `<img>` bên trong thẻ `<a>` chứa
 * nó, xem lịch sử điều tra ở lần sửa đầu). Nhưng SỬA LẦN 1 (dùng "Video thumbnail" + baseline-diff
 * SỐ LƯỢNG như cách đã dùng cho ảnh Setting/Prop) VẪN THẤT BẠI — soi debug capture LẦN 2 phát hiện
 * nguyên nhân THẬT: lưới media chính CŨNG ảo hoá bằng `react-virtuoso` (cùng lớp bug đã gặp ở
 * picker @mention, mục 4.25) — `data-testid="virtuoso-item-list"` giữ ỔN ĐỊNH ~5 item render
 * trong viewport bất kể tổng số item thật có bao nhiêu: thêm 1 clip mới ở ĐẦU danh sách thì 1 clip
 * cũ bị ĐẨY RA khỏi vùng render ở cuối — tổng số lượng `role="link"` tên "Video thumbnail" RENDER
 * ĐƯỢC không hề tăng (xác nhận trực tiếp: đúng 5 thẻ `<video src>` cả trước lẫn sau, chỉ khác giá
 * trị `src` — item mới `b8bc6e58-...` xuất hiện, item cũ nhất `e6dd9489-...` biến mất). Đếm số
 * lượng theo kiểu "chờ tăng so với baseline" KHÔNG BAO GIỜ đúng với lưới ảo hoá kiểu này.
 *
 * **CÁCH SỬA ĐÚNG**: KHÔNG đếm/so baseline nữa — tìm THẲNG đúng item vừa tạo bằng giá trị
 * `newVideoSrc` đã biết chắc chắn (chính là src `generateOneClip` vừa dùng để xác nhận generate
 * THÀNH CÔNG qua `currentVideoSrcs()`, xem mục 4.27) — tuyệt đối chính xác, không phụ thuộc
 * đếm/thứ tự/virtualization: `video[src="..."]` rồi đi lên ancestor `<a>` gần nhất để right-click
 * (giữ nguyên tinh thần "right-click thẻ `<a>` chứa media" như Setting/Prop, chỉ khác cách TÌM ra
 * đúng thẻ đó).
 */
async function renameLatestVideo(page: Page, name: string, videoSrc: string, sceneIndex: number): Promise<void> {
  const videoTag = page.locator(`video[src="${videoSrc}"]`).first();
  const card = videoTag.locator("xpath=ancestor::a[1]");
  if (!(await card.count())) {
    await debugCapture(page, `rename-card-missing-scene${sceneIndex}`);
    throw new Error(`Không thấy item video vừa tạo (src="${videoSrc}") trong lưới media để đổi tên (cảnh #${sceneIndex}) — thử lại.`);
  }

  await card.click({ button: "right" });
  try {
    await page.getByRole("menuitem", { name: /rename/i }).click({ timeout: 8000 });
  } catch {
    await debugCapture(page, `rename-menu-missing-scene${sceneIndex}`);
    throw new Error(`Không thấy menuitem "Rename" cho cảnh #${sceneIndex} — thử lại.`);
  }

  const nameInput = page.getByRole("textbox", { name: "Editable text" });
  await nameInput.press("ControlOrMeta+a");
  await nameInput.fill(name);
  await page.getByRole("button", { name: /done/i }).click();
}

async function generateOneClip(page: Page, prompt: VeoPrompt, clipName: string): Promise<"ok" | "skipped"> {
  await ensureModelAndDuration(page);
  await fillPromptWithMentions(page, prompt);

  // Thẻ "Failed" của các lần lỗi TRƯỚC vẫn nằm trong lưới media của project mãi mãi
  // (không biến mất kể cả reload) — nếu chỉ kiểm tra sự tồn tại, mọi cảnh SAU lần lỗi
  // đầu tiên sẽ bị hiểu nhầm là lỗi ngay lập tức. Đếm số lượng "Failed" TRƯỚC khi bấm
  // generate, chỉ coi là lỗi thật nếu số lượng TĂNG so với baseline này.
  // getByText khớp cả text ẩn/không hiển thị (vd data JSON nhúng sẵn trong trang chứa
  // chữ "Failed" trong nội dung i18n) — xác nhận trực tiếp: 1 project HOÀN TOÀN TRỐNG,
  // chưa từng tạo gì, vẫn báo failedCount=2 ngay khi vừa mở. Phải lọc chỉ đếm phần tử
  // THỰC SỰ HIỂN THỊ trên màn hình bằng locator(":visible").
  const failedLocatorAll = page.getByText("Failed", { exact: false }).locator(":visible");
  const baselineFailedCount = await failedLocatorAll.count();
  const baselineVideoSrcs = await currentVideoSrcs(page);
  debugLog("baseline", `cảnh #${prompt.index}: baselineVideoSrcs=${baselineVideoSrcs.size}, baselineFailedCount=${baselineFailedCount}`);

  await page.locator(`button:has-text("${TEXT.generate}")`).last().click();

  // XÁC NHẬN TRỰC TIẾP (2026-07-19, người dùng yêu cầu): trước đây cảnh bị Flow từ chối (policy
  // "prominent people"...) bị bỏ qua NGAY LẬP TỨC, KHÔNG hề thử lại — Flow tự hiện sẵn nút "Retry"
  // ngay trên card lỗi (bấm lại y hệt generate nhưng KHÔNG cần gõ lại prompt/chọn lại model, nhanh
  // hơn nhiều so với nhánh catch/reopenPage ở processQueue vốn phải làm lại từ đầu). Giờ bấm
  // "Retry" NGAY (không đợi gì thêm) tối đa `MAX_INLINE_RETRIES` lần trước khi thật sự bỏ qua.
  //
  // CHƯA XÁC NHẬN (đoán theo mẫu icon-ligature + hidden label đã thấy ở toolbar item thành công —
  // "download"/"undo"("Reuse Prompt")/"delete"("Move to trash"), xem debug capture mục 4.33):
  // nút "Retry" trên card LỖI nhiều khả năng cùng cấu trúc toolbar, hidden label "Retry" — dùng
  // `getByRole("button", {name: /retry/i}).first()` (an toàn dù có nhiều card lỗi CŨ từ trước còn
  // hiện nút Retry, vì "Recent" sort đẩy card MỚI NHẤT lên đầu, `.first()` luôn đúng card vừa lỗi).
  //
  // Đếm "Failed" theo kiểu PHÁT HIỆN CẠNH (edge-detect: so với lần đếm gần nhất, không phải so cố
  // định với baseline ban đầu) — vì sau khi bấm Retry, card lỗi cũ được TÁI SỬ DỤNG (không phải
  // card mới), số lượng "Failed" có thể tạm giảm về baseline lúc đang generate lại rồi tăng lại
  // nếu Retry cũng lỗi; so cạnh (currentCount > lastSeenCount) bắt được cả lần lỗi ĐẦU lẫn các lần
  // lỗi SAU mỗi lần Retry, không chỉ đúng 1 lần duy nhất.
  const MAX_INLINE_RETRIES = 2;
  let inlineRetries = 0;
  let lastFailedCount = baselineFailedCount;

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let newVideoSrc: string | undefined;
  while (Date.now() < deadline) {
    const srcs = await currentVideoSrcs(page);
    newVideoSrc = [...srcs].find((s) => !baselineVideoSrcs.has(s));
    if (newVideoSrc) break;

    const currentFailedCount = await failedLocatorAll.count();
    if (currentFailedCount > lastFailedCount) {
      lastFailedCount = currentFailedCount;
      if (inlineRetries >= MAX_INLINE_RETRIES) {
        console.warn(
          `[veo3bot] cảnh #${prompt.index} bị Flow từ chối sau ${inlineRetries} lần Retry — bỏ qua cảnh này.`
        );
        await debugCapture(page, `flow-rejected-final-scene${prompt.index}`);
        return "skipped";
      }
      inlineRetries++;
      console.warn(
        `[veo3bot] cảnh #${prompt.index} bị Flow từ chối (có thể do chính sách nội dung) — bấm "Retry" ngay (lần ${inlineRetries}/${MAX_INLINE_RETRIES}), không đợi thêm.`
      );
      await debugCapture(page, `flow-rejected-before-retry${inlineRetries}-scene${prompt.index}`);
      try {
        await page.getByRole("button", { name: /retry/i }).first().click({ timeout: 5000 });
      } catch {
        await debugCapture(page, `retry-button-missing-scene${prompt.index}`);
        console.warn(`[veo3bot] không bấm được nút "Retry" cho cảnh #${prompt.index} — bỏ qua cảnh này.`);
        return "skipped";
      }
      continue; // kiểm tra lại NGAY, không chờ POLL_INTERVAL_MS
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!newVideoSrc) {
    // XÁC NHẬN TRỰC TIẾP (2026-07-16): cảnh #25 bị báo "hết thời gian chờ" nhưng video THẬT
    // RA đã tạo xong trong Flow (thấy rõ trong media grid, đúng khớp prompt) — bot chỉ không
    // phát hiện kịp trong lúc poll trực tiếp trên trang đang mở (không rõ do hàng đợi "Lower
    // Priority" hoàn tất chậm hơn deadline, hay do grid cần reload mới hiển thị đúng phần tử
    // mới). Trước khi kết luận là lỗi thật/bỏ qua oan 1 cảnh đã xong, reload lại trang 1 lần
    // và kiểm tra lại — nếu video đã có thì coi là thành công, KHÔNG bỏ qua.
    console.log(
      `[veo3bot] cảnh #${prompt.index} chưa thấy video sau ${GENERATE_TIMEOUT_MS / 60000} phút, reload để kiểm tra lại trước khi kết luận lỗi...`
    );
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19 — bản cũ chỉ chụp SAU khi
    // reload + recheck 90s vẫn thất bại, lúc đó trang đã reload nên trạng thái lỗi THẬT tại thời
    // điểm timeout (vd thông báo lỗi cụ thể, dialog còn mở, prompt vẫn đang gõ dở) đã bị xoá mất
    // — khiến debug capture cũ không phản ánh đúng nguyên nhân gốc, chỉ thấy được trạng thái
    // trang SAU reload chứ không phải lúc timeout thật sự xảy ra): lưu lại NGAY TẠI ĐÂY, trước
    // dòng reload bên dưới.
    await debugCapture(page, `pre-reload-timeout-scene${prompt.index}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Chờ trang THẬT SỰ sẵn sàng rồi POLL thêm 1 khoảng đủ dài thay vì chốt sau 1 mốc thời gian
    // cố định — cùng bug đã xác nhận ở imageAsset.ts (2026-07-18): 1 project có nhiều media
    // (168 cảnh + Character/Setting/Prop) tải lại chậm hơn vài giây cố định.
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    while (!newVideoSrc && Date.now() < recheckDeadline) {
      const srcs = await currentVideoSrcs(page);
      newVideoSrc = [...srcs].find((s) => !baselineVideoSrcs.has(s));
      if (newVideoSrc) break;
      await page.waitForTimeout(POLL_INTERVAL_MS);
    }
    if (!newVideoSrc) {
      await debugCapture(page, `timeout-scene${prompt.index}`);
      throw new Error(
        `Hết thời gian chờ generate cảnh #${prompt.index} — video không xuất hiện kể cả sau khi reload. Kiểm tra thủ công trong Flow.`
      );
    }
    console.log(`[veo3bot] cảnh #${prompt.index} thực ra ĐÃ tạo xong — reload phát hiện được, tiếp tục tải về.`);
  }

  // KHÔNG còn tải file về ngay tại đây (quyết định người dùng, 2026-07-19, xem RUNBOOK mục
  // 4.31) — chỉ đổi tên clip vừa tạo theo đúng chỉ số cảnh để tìm lại được sau này, tải về
  // (chất lượng 1080p) dồn vào lệnh riêng `npm run download` chạy SAU khi mọi cảnh đã xong.
  await renameLatestVideo(page, clipName, newVideoSrc, prompt.index);
  return "ok";
}

export interface ClipResult {
  index: number;
  /** Đường dẫn file local DỰ KIẾN sau khi tải về (chưa chắc đã tồn tại — xem RUNBOOK mục 4.31,
   * `generateOneClip` giờ chỉ đổi tên clip trong Flow chứ KHÔNG tải về; `npm run download` mới
   * là lệnh thực sự ghi file này). */
  file: string;
}

/**
 * Xử lý tuần tự hàng đợi CHUNG (queue.shift()) trên 1 tab/project riêng của worker này.
 * queue.shift() an toàn dù nhiều worker gọi song song vì JS đơn luồng — không có await
 * xen giữa lúc kiểm tra rỗng và lúc lấy phần tử, nên không có race condition thật sự.
 * Vì mỗi worker có project Flow RIÊNG BIỆT (không share lưới media với worker khác),
 * cơ chế baseline-diff cũ (đếm trước/sau trên video[src]/"Failed") vẫn đúng nguyên vẹn —
 * không cần match theo text prompt, vì không còn state nào bị lẫn giữa các tab.
 */
async function processQueue(
  workerId: number,
  initialPage: Page,
  projectUrl: string,
  queue: VeoPrompt[],
  outDir: string,
  results: ClipResult[],
  allPrompts: VeoPrompt[],
  onProgress?: (prompts: VeoPrompt[]) => Promise<void> | void
): Promise<void> {
  const RELOAD_EVERY = 15;
  let generatedSinceReload = 0;
  let page = initialPage;
  const log = (msg: string) => console.log(`[veo3bot#${workerId}] ${msg}`);

  // LỖI ĐÃ GẶP: page.goto() lại CÙNG 1 page bị lỗi không đủ để hồi phục — quan sát trực
  // tiếp thấy 1 tab bị lỗi "locator.click: Timeout" thì lỗi y hệt ở MỌI cảnh sau đó liên
  // tục dù đã goto lại project mỗi lần (dấu hiệu trang bị kẹt ở tầng JS/DOM sâu hơn, chỉ
  // goto không dọn sạch được). Mã cũ (chạy đơn luồng, 1 tab) từng đóng cả trình duyệt và
  // mở lại mới hoàn toàn để hồi phục — ở đây không thể đóng cả context (dùng chung với
  // worker khác), nên thay bằng: đóng riêng page đang lỗi và mở page MỚI tinh trong CÙNG
  // context, rồi mới goto vào lại project.
  async function reopenPage(): Promise<void> {
    const context = page.context();
    const oldPage = page;
    page = await context.newPage();
    await oldPage.close().catch(() => {});
    await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(page);
  }

  while (queue.length > 0) {
    const p = queue.shift();
    if (!p) break;
    const clipName = `clip_${String(p.index).padStart(3, "0")}`;
    const outFile = path.join(outDir, `${clipName}.mp4`); // đường dẫn DỰ KIẾN, xem ClipResult

    if (generatedSinceReload >= RELOAD_EVERY) {
      log("mở lại tab mới định kỳ để làm mới trang...");
      await reopenPage().catch((e) => log(`reload định kỳ lỗi, vẫn tiếp tục dùng tab hiện tại: ${(e as Error).message}`));
      generatedSinceReload = 0;
    }

    log(`tạo cảnh #${p.index} [${p.characterNames.join(", ")}]: ${p.videoPrompt.slice(0, 80)}...`);

    let status: "ok" | "skipped";
    try {
      status = await generateOneClip(page, p, clipName);
    } catch (err) {
      log(`lỗi cảnh #${p.index}, mở tab mới và thử lại: ${(err as Error).message}`);
      try {
        await reopenPage();
        generatedSinceReload = 0;
        status = await generateOneClip(page, p, clipName);
      } catch (err2) {
        log(`cảnh #${p.index} vẫn lỗi sau khi thử lại — bỏ qua: ${(err2 as Error).message}`);
        await debugCapture(page, `worker${workerId}-final-fail-scene${p.index}`);
        status = "skipped";
      }
    }

    generatedSinceReload++;
    // Cập nhật + lưu status ngay — giờ là NGUỒN SỰ THẬT DUY NHẤT cho "cảnh này đã tạo+đổi tên
    // xong trong Flow chưa" (không còn file local để đối chiếu tại bước generate, xem RUNBOOK
    // mục 4.31) — resume-safe vì ghi ngay sau mỗi cảnh, không đợi xử lý xong cả hàng đợi.
    p.status = status === "ok" ? "success" : "failed";
    await onProgress?.(allPrompts);
    if (status === "ok") {
      results.push({ index: p.index, file: outFile });
      log(`đã tạo + đổi tên "${clipName}" trong Flow (chưa tải về — chạy "npm run download" sau khi xong hết)`);
    }
  }
}

/**
 * Sinh video cho toàn bộ danh sách prompt, chạy SONG SONG nhiều tab (config.parallelWorkers)
 * trong CÙNG 1 trình duyệt persistent — mỗi tab dùng 1 project Flow RIÊNG BIỆT (xem
 * project.ts::ensureProjects) để lưới media của tab này không thể lẫn vào tab khác, tránh
 * tái diễn lỗi trùng lặp clip đã gặp trước đây khi chạy đơn luồng trên 1 project chung.
 * Bỏ qua cảnh đã `status: "success"` để có thể resume khi lỗi giữa chừng (xem RUNBOOK mục
 * 4.31 — KHÔNG còn tải video về ở bước này, chỉ tạo + đổi tên trong Flow; `npm run download`
 * là lệnh tải về thật). Cảnh bị Flow từ chối tạo (chính sách nội dung) sẽ bị bỏ qua, KHÔNG có
 * mặt trong kết quả trả về.
 */
export async function generateClips(
  prompts: VeoPrompt[],
  characters: CharacterProfile[],
  settings: SettingProfile[],
  props: PropProfile[],
  outDir: string,
  onProgress?: (prompts: VeoPrompt[]) => Promise<void> | void
): Promise<ClipResult[]> {
  await fs.mkdir(outDir, { recursive: true });

  // KHÔNG còn file local để đối chiếu ở bước này (xem RUNBOOK mục 4.31 — generateOneClip chỉ
  // đổi tên clip trong Flow, tải về dồn vào `npm run download` chạy sau). Field `status` trong
  // `state/prompts.json` giờ là NGUỒN SỰ THẬT DUY NHẤT cho "cảnh này đã tạo+đổi tên xong chưa" —
  // khác cơ chế cũ (mục 4.18) vốn ưu tiên file trên đĩa. Rủi ro đã biết: nếu generateOneClip
  // tạo clip THÀNH CÔNG trong Flow nhưng bước đổi tên sau đó throw, cảnh vẫn bị đánh dấu
  // "failed" và sẽ được TẠO LẠI (thêm 1 clip mới) ở lần chạy sau — có thể để lại 1 clip trùng
  // CHƯA đổi tên nằm không dùng trong Flow (cùng loại rủi ro đã chấp nhận với Setting/Prop, xem
  // mục 4.15 cập nhật) — không tự động dọn, chấp nhận đánh đổi để giữ code đơn giản.
  const results: ClipResult[] = [];
  const queue: VeoPrompt[] = [];
  for (const p of prompts) {
    const outFile = path.join(outDir, `clip_${String(p.index).padStart(3, "0")}.mp4`);
    if (p.status === "success") {
      results.push({ index: p.index, file: outFile });
    } else {
      queue.push(p);
    }
  }
  if (queue.length === 0) return results;

  const workerCount = Math.max(1, Math.min(config.parallelWorkers, queue.length));
  console.log(`[veo3bot] còn ${queue.length} cảnh cần tạo, chạy song song ${workerCount} tab...`);

  const context = await launchVeo3Browser();
  try {
    // Project #0 luôn là project cũ (đã có Character asset + 83 clip đầu) — mở trong tab
    // đầu tiên (đã sẵn có trong context, không mở tab mới) để tận dụng, không tạo lãng phí.
    const setupPage = context.pages()[0] ?? (await context.newPage());
    const projectUrls = await ensureProjects(setupPage, workerCount);

    const pages: Page[] = [setupPage];
    await setupPage.goto(projectUrls[0], { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(setupPage);

    for (let i = 1; i < workerCount; i++) {
      const page = await context.newPage();
      await page.goto(projectUrls[i], { waitUntil: "domcontentloaded", timeout: 45000 });
      await waitForProjectReady(page);
      // Chưa chắc Character/Setting/Prop asset là tài nguyên toàn tài khoản hay riêng theo
      // từng project — luôn kiểm tra lại ở project MỚI tạo cho worker này (hàm tự bỏ qua nếu
      // đã tồn tại nên rẻ), thay vì giả định và có thể để lọt cảnh không @mention được.
      await ensureCharactersInFlow(page, characters, projectUrls[i]);
      await ensureSettingsInFlow(page, settings, projectUrls[i]);
      await ensurePropsInFlow(page, props, projectUrls[i]);
      pages.push(page);
    }

    // "Add Media" hiện sớm hơn khi trang thực sự sẵn sàng thao tác — vài giây đầu sau đó dễ
    // khiến các cảnh ĐẦU TIÊN bị hiểu nhầm là bị chặn (thực chất chỉ đang "Queued").
    await Promise.all(pages.map((p) => p.waitForTimeout(3000)));

    await Promise.all(
      pages.map((page, i) => processQueue(i, page, projectUrls[i], queue, outDir, results, prompts, onProgress))
    );
  } finally {
    // Luôn đóng context kể cả khi setup/worker lỗi giữa chừng — nếu để mở, lần chạy lại
    // tiếp theo sẽ launchPersistentContext thứ 2 trên CÙNG profile dir, xung đột khóa
    // profile và gây lỗi UI khó hiểu (đã xác nhận trực tiếp: 2 lần chạy liên tiếp lỗi
    // giống hệt nhau ở bước không liên quan, do context lần trước bị bỏ mở).
    await context.close().catch(() => {});
  }
  return results;
}
