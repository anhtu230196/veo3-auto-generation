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
// XÁC NHẬN TRỰC TIẾP (2026-07-19, cảnh #6): giá trị 2 phút (không rõ ai/khi nào đổi từ 3 phút ghi
// trong comment trên xuống 2 phút, không khớp nữa) tạo ra 1 RACE THẬT: card "Failed - prominent
// people" của Flow xuất hiện RẤT SÁT mốc 2 phút — vòng poll luôn vừa kịp thoát do hết giờ TRƯỚC KHI
// kịp phát hiện (lần kiểm tra cuối cùng luôn rơi vào đúng khoảng vài giây trước khi Failed xuất
// hiện). Tệ hơn: `page.reload()` sau đó XOÁ MẤT dấu hiệu "Failed" (xác nhận trực tiếp: card không
// còn tồn tại — kể cả ẩn — trong DOM sau reload, khác giả định ban đầu ở mục 4.43 rằng nó "vẫn còn
// nguyên" — giả định đó SAI, dựa trên nhầm lẫn khớp phải 1 chuỗi i18n ẩn giống hệt câu lỗi, không
// phải card thật), nên vòng reload-recheck (dù đã thêm `checkFailedAndRetry` ở mục 4.43) không còn
// gì để phát hiện nữa — "Failed" là trạng thái TẠM THỜI trong phiên hiện tại, không phải asset lưu
// trữ vĩnh viễn như video/ảnh thành công. Tăng lại lên 3 phút để có đủ khoảng đệm cho vòng poll bắt
// được "Failed" NHIỀU LẦN (mỗi 5s) trước khi chạm mốc timeout, thay vì đúng lúc chạm mốc.
const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
// Cùng bug class đã gặp ở imageAsset.ts (2026-07-18): reload-recheck cũ chỉ chờ cố định 3 giây
// rồi chốt luôn — không đủ nếu project đã tích luỹ nhiều media khiến trang tải lại chậm. Đổi
// sang chờ trang sẵn sàng (Add Media hiện ra) rồi POLL thêm 1 khoảng đủ dài trước khi kết luận
// lỗi thật (xem generateOneClip bên dưới).
// RÚT NGẮN (theo yêu cầu người dùng sau khi quan sát trực tiếp reload-recheck quá lâu) — từ 90s
// xuống 20s. Đánh đổi CÓ CHỦ Ý: chấp nhận rủi ro bỏ lỡ 1 số trường hợp video/Failed xuất hiện
// muộn hơn 20s sau khi trang sẵn sàng (rơi vào nhánh retry toàn bộ ở processQueue thay vì được
// cứu ở đây), đổi lấy tổng thời gian generate nhanh hơn đáng kể cho project nhiều cảnh. Nếu sau
// này thấy tỉ lệ retry-toàn-bộ quá cao, cân nhắc tăng lại.
const RELOAD_RECHECK_TIMEOUT_MS = 20 * 1000;
// Thời gian chờ "Add Media" xuất hiện lại sau reload — cùng lý do rút ngắn ở trên, từ 90s xuống 30s.
const RELOAD_READY_TIMEOUT_MS = 30 * 1000;

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

// GHI CHÚ (2026-07-20): trước đây có `findMentionOccurrences()` để tìm vị trí tên trong câu phục
// vụ chèn chip INLINE. Đã BỎ HẲN inline (quá dễ vỡ — xem RUNBOOK mục 4.49 + docstring
// fillPromptWithMentions), chuyển sang gõ trọn text 1 lần rồi append chip ở cuối, nên hàm đó không
// còn cần nữa và đã được gỡ bỏ.

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

    // XÁC NHẬN TRỰC TIẾP (1 Prop có tên là cụm từ phổ biến, xem RUNBOOK mục 4.25): search
    // 1 tên phổ biến khớp CẢ hàng trăm clip/ảnh khác có nhắc cụm từ đó trong
    // prompt (không chỉ đúng 1 asset trùng tên), danh sách kết quả dùng react-virtuoso
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

    // CHỜ DIALOG @mention ĐÓNG HẲN (ô search biến mất) TRƯỚC KHI cho gõ text tiếp — nếu dialog
    // chưa đóng, MỌI text gõ sau (before/remainder của bước kế) rơi vào Ô SEARCH thay vì promptBox,
    // mất sạch (bug mục 4.42/4.47/4.49). XÁC NHẬN TRỰC TIẾP (2026-07-20, cảnh #57 — two-shot 2 nhân
    // vật): soi debug capture `prompt-text-truncated-scene57` thấy ô search chứa đúng đuôi
    // MOTION_SUFFIX ("...no gaps in the outline where two shapes overlap or meet."), prompt thiếu
    // hẳn phần đó — remainder bị gõ vào dialog chưa đóng sau chip inline cuối. Chờ tường minh
    // state "hidden" (Playwright coi detached = hidden) thay cho `waitForTimeout(700)` mù; nếu quá
    // hạn vẫn chưa đóng thì chủ động Escape rồi chờ tiếp.
    const searchAfter = page.locator('input[placeholder="Search assets"]');
    try {
      await searchAfter.waitFor({ state: "hidden", timeout: 4000 });
    } catch {
      await page.keyboard.press("Escape").catch(() => {});
      await searchAfter.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(300);

    // Click card có thể làm mất focus editor — re-focus + đưa cursor về CUỐI tài liệu trước
    // khi gõ tiếp, tránh tái diễn lỗi mất text của cách chèn-giữa ngây thơ (xem docstring).
    await promptBox.click();
    await page.keyboard.press("ControlOrMeta+ArrowDown");
    await page.keyboard.press("End");
  }

  // GÕ TRỌN VẸN TEXT 1 LẦN rồi mới APPEND MỌI CHIP Ở CUỐI (trailing) — KHÔNG chèn xen giữa câu.
  // XÁC NHẬN TRỰC TIẾP (2026-07-20, cảnh #57 two-shot 2 nhân vật, xem RUNBOOK mục 4.49): cơ chế
  // chèn inline (thay tên chữ bằng chip tại đúng vị trí) BẢN CHẤT dễ vỡ — mỗi lần chèn chip phải mở
  // dialog @mention giữa chừng lúc đang gõ text; nếu dialog chưa đóng hẳn trước bước gõ tiếp, phần
  // text sau bị gõ NHẦM vào ô search dialog và mất sạch (soi DOM dump: ô search chứa nguyên cả
  // remainder + MOTION_SUFFIX, prompt thiếu hẳn phần đó). Đã thử vá bằng "chờ ô search biến mất sau
  // khi chọn card" nhưng VẪN vỡ (dialog thỉnh thoảng không đóng kịp/không đóng khi chèn lại cùng 1
  // tên). Cách bền vững tuyệt đối: gõ hết text TRƯỚC (không dialog nào mở → không thể mất text), rồi
  // mở picker append chip ở cuối — nếu 1 chip lỗi thì TEXT vẫn còn nguyên, chỉ thiếu chip (bước xác
  // minh chip bên dưới bắt được để retry), không bao giờ gửi Flow prompt thiếu nội dung.
  //
  // VÌ SAO BỎ ĐƯỢC INLINE (cơ chế inline vốn sinh ra để tránh bộ lọc "prominent people" quét tên
  // nhân vật lịch sử THẬT trong text thô): quy trình viết prompt HIỆN NAY (skill flow-historical +
  // CHARACTER_EXTRACTION_GUIDE) đã BẮT BUỘC khử-định-danh MỌI tên nhân vật thành tên riêng đơn/nhãn
  // vai trò (xem mục 4.28/4.40) CHÍNH XÁC để tên thô không kích hoạt bộ
  // lọc. Khi thực hành này được tuân thủ (nó là BẮT BUỘC), tên thô trong text luôn an toàn → inline
  // trở nên thừa. Nếu 1 project tương lai lỡ dùng tên lịch sử ĐẦY ĐỦ, sửa ở KHÂU ĐẶT TÊN (khử định
  // danh) chứ KHÔNG quay lại inline dễ vỡ.
  await page.keyboard.type(text.replace(/@/g, "")); // bỏ "@" thừa (gõ "@" chữ thật tự mở dialog)
  for (const name of uniqueNames) {
    await insertMentionChip(name);
  }

  // 3) XÁC MINH chip void đã chèn đủ — mỗi tên duy nhất đúng 1 chip ở cuối.
  const expectedChipCount = uniqueNames.length;
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

  // XÁC NHẬN TRỰC TIẾP (2026-07-19, cảnh #41): đếm chip ĐỦ vẫn có thể lọt 1 lỗi khác NGHIÊM
  // TRỌNG HƠN — phần VĂN BẢN THUẦN (không phải chip) bị RỚT MẤT phần lớn giữa chừng (soi debug
  // capture thật: prompt gửi lên Flow chỉ còn "Medium shot, Luis speaking urgently to Spanish
  // Royal Banner Spanish Royal Court Hall Queen" — mất toàn bộ phần sau "Queen" gồm cả
  // PERIOD_ANCHOR/MOTION_SUFFIX, dù số chip vẫn có thể đã đủ). Nghi ngờ nguyên nhân: 1 bước gõ
  // "before"/"remainder" nào đó bị gõ NHẦM vào nơi khác (vd ô search của 1 dialog @mention chưa
  // đóng hẳn) thay vì vào promptBox thật, nên hoàn toàn không xuất hiện trong nội dung cuối cùng
  // dù luồng code vẫn tưởng đã gõ xong. Kiểm tra thêm: đoạn ĐUÔI của `text` gốc (KHÔNG chứa tên
  // @mention nào, luôn là 1 phần của MOTION_SUFFIX — xem styleDNA.ts) phải xuất hiện trong nội
  // dung promptBox hiện tại; nếu thiếu, coi như prompt đã bị hỏng giữa chừng, throw để retry thay
  // vì âm thầm generate video với prompt sai/thiếu.
  const expectedTail = text.slice(-60);
  const actualText = (await promptBox.innerText()).replace(/\s+/g, " ").trim();
  if (!actualText.includes(expectedTail.replace(/\s+/g, " ").trim())) {
    await debugCapture(page, `prompt-text-truncated-scene${prompt.index}`);
    throw new Error(
      `Prompt cảnh #${prompt.index} bị mất văn bản giữa chừng (đủ chip nhưng thiếu đoạn cuối MOTION_SUFFIX) — thử lại.`
    );
  }
}

/**
 * XÁC NHẬN TRỰC TIẾP (2026-07-19, cảnh #41 bị gán NHẦM đúng nội dung của cảnh #0) — cách so TẬP
 * HỢP mọi giá trị `src` đang render (bản trước, mục 4.27) có LỖ HỔNG NGHIÊM TRỌNG với lưới media
 * ẢO HOÁ (`react-virtuoso`, xác nhận ở mục 4.33): lưới chỉ render ~5 item trong viewport tại 1
 * thời điểm, KHÔNG PHẢI toàn bộ lịch sử clip. 1 clip CŨ (vd bản duplicate CHƯA đổi tên còn sót lại
 * của cảnh #0 do lỗi rename trước đây, xem mục 4.33/4.37) có thể "trôi vào" vùng render đúng lúc
 * đang xử lý 1 cảnh KHÁC (không phải do cảnh đó vừa generate xong) — src của nó chưa từng có
 * trong baseline (baseline chỉ chụp đúng lúc đó, không phải toàn bộ lịch sử), nên bị hiểu NHẦM là
 * "video mới của cảnh đang xử lý". Hậu quả: `renameLatestVideo` gán tên cảnh SAI vào ĐÚNG clip của
 * 1 cảnh khác — lỗi HOÀN TOÀN ÂM THẦM, không log/exception nào báo hiệu, chỉ lộ ra khi người dùng
 * tự soi lại nội dung trong Flow.
 *
 * **SỬA**: không so TẬP HỢP nữa — chỉ theo dõi ĐÚNG 1 VỊ TRÍ: item ĐẦU TIÊN trong lưới (dựa vào
 * sort "Recent" mặc định của Flow, item mới nhất luôn ở vị trí 0 — cùng giả định `.first()` đã
 * dùng nhất quán ở mọi nơi khác trong codebase, vd `renameLatestVideo`/`imageAsset.ts`). Coi là
 * "có video mới" CHỈ KHI src ở vị trí 0 đổi khác so với lúc trước khi bấm generate — đúng cho CẢ
 * 2 trường hợp đã gặp: Flow chỉ có 1 thẻ `<video>` "preview" duy nhất (mục 4.27 — vị trí 0 = phần
 * tử duy nhất, đổi src tại chỗ) LẪN lưới nhiều item ảo hoá (mục 4.33 — vị trí 0 luôn đúng là item
 * MỚI NHẤT thật sự, không bị nhiễu bởi item cũ trôi vào/ra vùng render ở các vị trí SAU vị trí 0).
 */
async function firstVideoSrc(page: Page): Promise<string | undefined> {
  const first = page.locator("video[src]").first();
  if (!(await first.count())) return undefined;
  return (await first.getAttribute("src")) ?? undefined;
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
 * THÀNH CÔNG qua `firstVideoSrc()`, xem mục 4.27/4.38) — tuyệt đối chính xác, không phụ thuộc
 * đếm/thứ tự/virtualization: `video[src="..."]` rồi đi lên ancestor `<a>` gần nhất để right-click
 * (giữ nguyên tinh thần "right-click thẻ `<a>` chứa media" như Setting/Prop, chỉ khác cách TÌM ra
 * đúng thẻ đó).
 *
 * XÁC NHẬN TRỰC TIẾP (2026-07-19, RUNBOOK mục 4.39) — menuitem "Rename" cho VIDEO (khác Setting/
 * Prop, `imageAsset.ts`) rất có thể KHÔNG mở modal tại chỗ mà ĐIỀU HƯỚNG SANG TRANG "Edit" RIÊNG
 * của clip đó (soi debug capture `pre-reload-pill-stuck-*`: trang kế tiếp bị kẹt hiện đúng UI
 * editor timeline của 1 clip cũ, tiêu đề clip nằm trong ô `aria-label="Editable text"` + có nút
 * "Done" ở navbar — TRÙNG HỆT tên 2 phần tử code này đang tìm, nên code "tưởng" đã xong nhưng thực
 * ra vừa gõ tên vào Ô TIÊU ĐỀ TRANG EDIT rồi bấm "Done" thoát editor, để lại trang KẸT ở URL edit
 * này thay vì quay về lưới media chính — cảnh SAU đó không tìm thấy pill "crop_16_9" vì đang ở
 * sai trang). Fix: LUÔN điều hướng THẲNG về `projectUrl` (biết chắc chắn, không đoán link "Back")
 * ngay sau khi rename xong, bất kể rename thực chất là modal tại chỗ hay điều hướng sang trang
 * khác — đảm bảo KHÔNG BAO GIỜ để lại trang ở trạng thái không xác định cho cảnh sau.
 */
async function renameLatestVideo(page: Page, name: string, videoSrc: string, sceneIndex: number, projectUrl: string): Promise<void> {
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

  // LUÔN quay về ĐÚNG project canvas sau khi rename — không tin "Done" đã tự đưa mình về đúng chỗ
  // (xem docstring trên: rất có thể vừa thoát khỏi trang Edit riêng, không phải đóng modal).
  await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
}

async function generateOneClip(page: Page, prompt: VeoPrompt, clipName: string, projectUrl: string): Promise<"ok" | "skipped"> {
  await ensureModelAndDuration(page);
  await fillPromptWithMentions(page, prompt);

  // PHÁT HIỆN CẢNH BỊ TỪ CHỐI/LỖI qua chính NÚT "Retry" trên card lỗi (KHÔNG dùng chữ "Failed" nữa).
  // XÁC NHẬN TRỰC TIẾP (2026-07-20, cảnh #58 — soi DOM dump `pre-reload-timeout-scene58.html`):
  // detection CŨ `getByText("Failed").locator(":visible")` SAI HOÀN TOÀN — card lỗi là
  // `<div>Failed</div>` (KHÔNG có phần tử con), mà `.locator(":visible")` tìm phần tử con HIỂN THỊ
  // BÊN TRONG các element khớp "Failed" → 1 div text thuần không có con nào → LUÔN đếm được 0, nên
  // `checkFailedAndRetry` LUÔN trả "no-failure" và KHÔNG BAO GIỜ chạm tới bước bấm Retry. Đây mới là
  // nguyên nhân thật của "card Failed + nút Retry hiện rõ nhưng bot không bấm" (mục 4.44 kết luận
  // NHẦM là do timing). Nút Retry thật có cấu trúc `<button><i>refresh</i><span sr-only>Retry</span>
  // </button>` — accessible name "Retry" (từ span ẩn clip-rect, vẫn trong accessibility tree), khớp
  // đúng `getByRole("button", {name:/retry/i})` (chính selector code vẫn dùng để CLICK — nên click
  // luôn đúng, chỉ detection sai). Đếm SỐ nút Retry theo phát hiện cạnh (edge-detect như cũ): nút
  // Retry chỉ xuất hiện trên card lỗi, card mới nhất ở đầu (Recent sort) nên tăng số nút = có lỗi mới.
  const retryButtonLocator = page.getByRole("button", { name: /retry/i });
  const baselineRetryCount = await retryButtonLocator.count();
  const baselineFirstSrc = await firstVideoSrc(page);
  debugLog("baseline", `cảnh #${prompt.index}: baselineFirstSrc=${baselineFirstSrc}, baselineRetryCount=${baselineRetryCount}`);

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
  //
  // XÁC NHẬN TRỰC TIẾP (2026-07-19, cảnh #6) — bản đầu CHỈ kiểm tra "Failed" trong vòng poll
  // CHÍNH, KHÔNG kiểm tra lại trong vòng reload-recheck bên dưới (vốn chỉ tìm video mới) — nếu
  // Flow từ chối MUỘN (gần/sau mốc GENERATE_TIMEOUT_MS, card "Failed" xuất hiện đúng lúc vòng
  // poll chính vừa thoát do hết giờ), toàn bộ thời gian reload-recheck (90s) bị lãng phí chờ 1
  // video sẽ KHÔNG BAO GIỜ xuất hiện (vì đã bị từ chối, không phải đang xử lý chậm), rồi mới throw
  // timeout chung chung — không bao giờ tận dụng được cơ chế bấm Retry nhanh. Gộp logic kiểm
  // tra+Retry vào 1 hàm dùng chung `checkFailedAndRetry()`, gọi ở CẢ vòng poll chính LẪN vòng
  // reload-recheck, để phát hiện đúng ngay cả khi từ chối xảy ra muộn/sau khi đã reload.
  const MAX_INLINE_RETRIES = 2;
  const retryState = { lastRetryCount: baselineRetryCount, inlineRetries: 0 };

  async function checkFailedAndRetry(): Promise<"gave-up" | "retried" | "no-failure"> {
    const currentRetryCount = await retryButtonLocator.count();
    if (currentRetryCount <= retryState.lastRetryCount) return "no-failure";
    retryState.lastRetryCount = currentRetryCount;
    if (retryState.inlineRetries >= MAX_INLINE_RETRIES) {
      console.warn(
        `[veo3bot] cảnh #${prompt.index} bị Flow từ chối sau ${retryState.inlineRetries} lần Retry — bỏ qua cảnh này.`
      );
      await debugCapture(page, `flow-rejected-final-scene${prompt.index}`);
      return "gave-up";
    }
    retryState.inlineRetries++;
    console.warn(
      `[veo3bot] cảnh #${prompt.index} bị Flow từ chối (có thể do chính sách nội dung) — bấm "Retry" ngay (lần ${retryState.inlineRetries}/${MAX_INLINE_RETRIES}), không đợi thêm.`
    );
    await debugCapture(page, `flow-rejected-before-retry${retryState.inlineRetries}-scene${prompt.index}`);
    try {
      await page.getByRole("button", { name: /retry/i }).first().click({ timeout: 5000 });
    } catch {
      await debugCapture(page, `retry-button-missing-scene${prompt.index}`);
      console.warn(`[veo3bot] không bấm được nút "Retry" cho cảnh #${prompt.index} — bỏ qua cảnh này.`);
      return "gave-up";
    }
    // XÁC NHẬN TRỰC TIẾP (2026-07-19, người dùng quan sát trực tiếp): bấm "Retry" làm trang RELOAD
    // LẠI (không phải regenerate tại chỗ trong DOM hiện có như giả định ban đầu) — chờ trang THẬT
    // SỰ sẵn sàng (nút "Add Media" xuất hiện) trước khi tiếp tục vòng lặp kiểm tra, tránh đọc nhầm
    // trạng thái khi DOM đang giữa chừng load lại.
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 45000 }).catch(() => {});
    // Bấm "Retry" làm trang RELOAD → số nút Retry trong DOM reset. Re-baseline `lastRetryCount` theo
    // số nút SAU reload, để nếu lần Retry NÀY cũng bị chặn (card lỗi mới xuất hiện), phát-hiện-cạnh
    // ở vòng poll sau vẫn bắt được (currentRetryCount > lastRetryCount mới) — nếu không, lastRetryCount
    // giữ giá trị cũ trước reload sẽ khiến lần chặn tiếp theo bị bỏ lỡ (đúng hiện tượng cảnh #58: lần
    // Retry 2/2 trong cùng tab không kích hoạt vì count sau reload = count cũ).
    retryState.lastRetryCount = await retryButtonLocator.count();
    return "retried";
  }

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let newVideoSrc: string | undefined;
  while (Date.now() < deadline) {
    const currentFirstSrc = await firstVideoSrc(page);
    if (currentFirstSrc && currentFirstSrc !== baselineFirstSrc) {
      newVideoSrc = currentFirstSrc;
      break;
    }

    const failedResult = await checkFailedAndRetry();
    if (failedResult === "gave-up") return "skipped";
    if (failedResult === "retried") continue; // kiểm tra lại NGAY, không chờ POLL_INTERVAL_MS
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  // VÒNG "GRACE POLL" NGẮN sau khi hết GENERATE_TIMEOUT_MS, TRƯỚC KHI reload (xác nhận trực tiếp
  // 2026-07-20, người dùng quan sát: cảnh bị chặn "prominent people"/"Failed" thường hiện card lỗi
  // + nút "Retry" NGAY QUANH mốc timeout, nhưng vòng poll chính vừa thoát do hết giờ nên bỏ lỡ —
  // rồi reload XOÁ MẤT card "Failed" (mục 4.44), khiến không bao giờ bấm được Retry mà chờ vô ích).
  // Thay vì chỉ kiểm tra 1 lần rồi reload, poll thêm tối đa GRACE_POLL_MS (mỗi 2s) tìm CẢ video mới
  // LẪN "Failed"/Retry — bắt được lỗi hiện muộn mà KHÔNG tốn cả chu kỳ reload đắt đỏ.
  const GRACE_POLL_MS = 16 * 1000;
  const GRACE_INTERVAL_MS = 2000;
  if (!newVideoSrc) {
    const graceDeadline = Date.now() + GRACE_POLL_MS;
    while (!newVideoSrc && Date.now() < graceDeadline) {
      const currentFirstSrc = await firstVideoSrc(page);
      if (currentFirstSrc && currentFirstSrc !== baselineFirstSrc) {
        newVideoSrc = currentFirstSrc;
        break;
      }
      const failedResult = await checkFailedAndRetry();
      if (failedResult === "gave-up") return "skipped";
      if (failedResult === "retried") break; // đã bấm Retry (trang tự reload) — để nhánh dưới poll tiếp
      await page.waitForTimeout(GRACE_INTERVAL_MS);
    }
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

    // KIỂM TRA "Failed" LẦN CHÓT NGAY TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-20, cảnh #58 bị
    // chặn "prominent people"): card "Failed" + nút "Retry" của hàng LOWER PRIORITY thường xuất hiện
    // MUỘN (~3 phút, đúng sau khi vòng poll chính + grace poll vừa kết thúc) — chính debug capture
    // `pre-reload-timeout` ở trên ĐÃ CHỤP ĐƯỢC card + nút Retry đang hiện rõ tại đây, nhưng code cũ đi
    // thẳng vào reload, mà reload XOÁ MẤT card (mục 4.44) nên vòng recheck sau đó không còn gì để bấm
    // → lãng phí, không bao giờ bấm Retry. Bấm NGAY tại thời điểm card được xác nhận đang hiện, TRƯỚC
    // khi reload xoá nó. Nếu bấm được Retry (trang tự reload) thì BỎ QUA bước reload thủ công bên dưới.
    const preReloadFailed = await checkFailedAndRetry();
    if (preReloadFailed === "gave-up") return "skipped";
    if (preReloadFailed !== "retried") {
      await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    }
    // Chờ trang THẬT SỰ sẵn sàng rồi POLL thêm 1 khoảng đủ dài thay vì chốt sau 1 mốc thời gian
    // cố định — cùng bug đã xác nhận ở imageAsset.ts (2026-07-18): 1 project có nhiều media
    // (168 cảnh + Character/Setting/Prop) tải lại chậm hơn vài giây cố định.
    // Thời lượng rút ngắn theo yêu cầu người dùng (2026-07-20) — xem RELOAD_READY_TIMEOUT_MS.
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: RELOAD_READY_TIMEOUT_MS }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    while (!newVideoSrc && Date.now() < recheckDeadline) {
      const currentFirstSrc = await firstVideoSrc(page);
      if (currentFirstSrc && currentFirstSrc !== baselineFirstSrc) {
        newVideoSrc = currentFirstSrc;
        break;
      }
      // XÁC NHẬN TRỰC TIẾP (2026-07-19, cảnh #6, xem ghi chú ở khai báo checkFailedAndRetry phía
      // trên): PHẢI kiểm tra "Failed" ở đây nữa — thẻ lỗi vẫn còn nguyên sau reload (đã xác nhận
      // trực tiếp qua debug capture), nếu không kiểm tra lại thì cảnh bị từ chối MUỘN sẽ lãng phí
      // hết 90s recheck rồi throw timeout chung chung, không bao giờ bấm Retry.
      const failedResult = await checkFailedAndRetry();
      if (failedResult === "gave-up") return "skipped";
      if (failedResult === "retried") continue; // kiểm tra lại NGAY, không chờ POLL_INTERVAL_MS
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
  await renameLatestVideo(page, clipName, newVideoSrc, prompt.index, projectUrl);
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
      status = await generateOneClip(page, p, clipName, projectUrl);
    } catch (err) {
      log(`lỗi cảnh #${p.index}, mở tab mới và thử lại: ${(err as Error).message}`);
      try {
        await reopenPage();
        generatedSinceReload = 0;
        status = await generateOneClip(page, p, clipName, projectUrl);
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
