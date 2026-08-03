import type { Page } from "playwright";
import path from "node:path";
import { debugCapture, debugLog } from "./debug.js";
import { dismissOnboardingDialog } from "./project.js";

// XÁC NHẬN TRỰC TIẾP (2026-07-18): "Spanish Royal Banner" (Prop quốc kỳ/biểu tượng) vẫn CHƯA
// xong sau đủ 3 phút + reload-recheck cũ (chỉ chờ thêm 3 giây cố định) — throw oan dù người
// dùng tự kiểm tra thấy ảnh ĐÃ tạo xong trong Flow (chỉ chưa đổi tên, vì code throw trước khi
// chạy tới bước rename). Ảnh có nội dung biểu tượng/quốc kỳ có vẻ cần thời gian kiểm duyệt lâu
// hơn ảnh thường — tăng timeout chính lên 5 phút, và quan trọng hơn: đổi cơ chế reload-recheck
// từ "chờ cố định 3 giây rồi chốt" sang "chờ trang thật sự sẵn sàng (Add Media hiện ra, giống
// mục 4.14) rồi POLL thêm 1 khoảng đủ dài" — 3 giây là quá ngắn để trang tải lại lưới media đã
// tích luỹ nhiều (168 cảnh + nhiều Character/Setting/Prop khác) trước khi kết luận lỗi thật.
const GENERATE_TIMEOUT_MS = 2 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;
const RELOAD_RECHECK_TIMEOUT_MS = 90 * 1000;

/**
 * XÁC NHẬN TRỰC TIẾP (project ~20+ asset) — cùng lớp bug đã xác nhận cho
 * video trong generate.ts::firstVideoSrc (mục 4.33 RUNBOOK): lưới media ảo hoá (`react-virtuoso`)
 * chỉ render 1 SỐ LƯỢNG CỐ ĐỊNH phần tử trong viewport (quan sát thực tế: luôn đúng 5), bất kể
 * project có bao nhiêu ảnh — thêm 1 ảnh mới ở ĐẦU danh sách thì 1 ảnh cũ bị đẩy khỏi vùng render
 * ở cuối, nên `imageLinksAll.count()` KHÔNG BAO GIỜ tăng một khi project vượt ngưỡng render ban
 * đầu (~17 asset trở lên, đúng lúc gặp trực tiếp: 12 Character + 5 Setting đầu thành công, rồi
 * 14 asset SAU ĐÓ liên tục "timeout" dù ảnh đã tạo đúng, thấy rõ trong debug capture). Đếm kiểu
 * "chờ tăng so với baseline" (như cũ) khiến mọi lần chạy lại tạo THÊM 1 bản trùng cho asset đó.
 *
 * SỬA giống hệt tinh thần `firstVideoSrc`: không đếm nữa — theo dõi ĐÚNG 1 VỊ TRÍ (item đầu tiên,
 * dựa vào sort "Recent" mặc định của Flow, đã dùng nhất quán ở `.first()` trong toàn bộ file này)
 * và coi là "có ảnh mới" CHỈ KHI `src` ở vị trí 0 đổi khác so với lúc trước khi bấm Create — không
 * phụ thuộc số lượng phần tử render được.
 */
async function firstImageSrc(page: Page): Promise<string | undefined> {
  const first = page.getByRole("link", { name: "Generated image" }).first().locator("img").first();
  if (!(await first.count())) return undefined;
  return (await first.getAttribute("src")) ?? undefined;
}

/**
 * Tạo 1 ảnh Ingredient dùng chung cho Setting/Prop (bối cảnh/đạo cụ) — luồng "Image mode, số
 * lượng 1" ngay trên canvas chính, rồi đổi tên (right-click → Rename) để tìm lại được qua
 * @mention. XÁC NHẬN TRỰC TIẾP bằng codegen thật do người dùng cung cấp (2026-07-16) — khác
 * hẳn với Character (dùng menu "Add Media" → "Create Character", ra asset type "Character").
 * Luồng này ra asset type "Image" thường, KHÔNG PHẢI "Character"/"Scene" — nhưng vẫn @mention
 * được bình thường sau khi đổi tên (đã xác nhận trực tiếp bởi người dùng: gõ "@", tìm theo
 * tên, chọn kết quả khớp).
 *
 * `styleBlock` do NGƯỜI GỌI truyền vào (settings.ts dùng SETTING_SHEET_STYLE_BLOCK, props.ts
 * dùng CHARACTER_SHEET_STYLE_BLOCK) — KHÔNG hard-code trong hàm này. Xác nhận trực tiếp
 * (2026-07-17): dùng chung 1 style block cho cả Setting lẫn Prop ra kết quả SAI cho Setting
 * (nền xanh + tự chèn người vào ảnh bối cảnh).
 */
/**
 * Đính 1 ảnh reference vào prompt hiện tại (image-to-image) — BẮT BUỘC cho luồng Character
 * của Nano Banana, nơi `reference-character.jpeg` là thứ neo toàn bộ phong cách nhân vật
 * (xem `src/nanoBanana/styleDNA.ts::MASTER_REFERENCE_NOTE`).
 *
 * Đường đi đã khảo sát trực tiếp trên UI thật (2026-08-02, RUNBOOK 8.1):
 *   nút `+` trong THANH PROMPT (accessible name "add_2 Create" — KHÔNG phải nút
 *   "add Add Media" ở sidebar) → bảng chọn media → **CLICK VÀO CARD LÀ ĐÍNH XONG LUÔN**.
 *
 * ⚠️ BẪY ĐÃ DÍNH: bảng có nút "Add to Prompt" ở góc dưới phải, rất dễ tưởng đó là bước
 * xác nhận bắt buộc. THỰC TẾ (xác nhận bằng scripts/inspect-picker.ts): ngay khi click vào
 * card (`div[role="option"]`), Flow đính ảnh vào prompt và ĐÓNG LUÔN bảng — nút "Add to
 * Prompt" BIẾN MẤT. Code bản đầu click card rồi mới đi tìm "Add to Prompt" nên timeout 15s
 * dù thao tác đã thành công. Vẫn giữ nhánh bấm nút đó làm dự phòng, phòng biến thể UI khác.
 *
 * Tối ưu: TRA THEO TÊN FILE TRƯỚC khi upload. Ảnh reference dùng lại cho MỌI nhân vật, nên
 * từ nhân vật thứ 2 trở đi nó đã nằm sẵn trong Uploads của project — upload lại mỗi lần sẽ
 * đẻ ra hàng loạt bản trùng (đúng lớp lỗi đã gặp ở mục 4.15/4.45).
 */
export async function attachReferenceImage(page: Page, referenceImagePath: string): Promise<void> {
  const fileName = path.basename(referenceImagePath);

  await page.locator('button:has-text("add_2")').first().click({ timeout: 15000 });
  await page.waitForTimeout(1500);

  const card = page.locator(`text=${fileName}`).first();
  if (await card.count()) {
    debugLog("reference", `"${fileName}" đã có sẵn trong project — dùng lại, không upload nữa`);
  } else {
    debugLog("reference", `chưa có "${fileName}" trong project — đang upload`);
    await page.locator('input[type="file"]').first().setInputFiles(referenceImagePath);
    await card.waitFor({ state: "visible", timeout: 90000 });
    await page.waitForTimeout(2000); // chờ Flow xử lý xong file vừa nạp
  }

  await card.click();
  await page.waitForTimeout(1500);

  // Dự phòng: nếu biến thể UI nào đó VẪN còn nút "Add to Prompt" sau khi chọn card thì bấm.
  const addToPrompt = page.getByRole("button", { name: /add to prompt/i }).first();
  if (await addToPrompt.count()) {
    await addToPrompt.click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }

  // XÁC MINH THẬT SỰ ĐÃ ĐÍNH — cùng tinh thần mục 4.1 (đếm chip @mention): nếu ảnh reference
  // không đính được mà vẫn chạy tiếp, Nano Banana sẽ vẽ nhân vật KHÔNG theo phong cách gốc,
  // và ta chỉ phát hiện khi soi ảnh bằng mắt (tốn credit + rất dễ lọt).
  // Tín hiệu dùng: nút "Clear prompt" chỉ xuất hiện khi prompt CÓ nội dung. Vì hàm này LUÔN
  // chạy TRƯỚC bước gõ chữ, lúc này prompt chưa có text — nên nút đó xuất hiện đồng nghĩa
  // với "đã có ảnh đính vào".
  const clearPrompt = page.getByRole("button", { name: /clear prompt/i }).first();
  await clearPrompt.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  if (!(await clearPrompt.count())) {
    await debugCapture(page, `reference-attach-failed-${fileName}`);
    throw new Error(
      `Đính ảnh reference "${fileName}" thất bại — không thấy dấu hiệu prompt có nội dung ` +
        `sau khi chọn card. Kiểm tra ảnh debug.`
    );
  }
  debugLog("reference", `đã đính "${fileName}" vào prompt`);
}

/**
 * Đính 1 hoặc NHIỀU asset ĐÃ CÓ SẴN trong Flow vào prompt, tra theo TÊN (khác
 * `attachReferenceImage` vốn upload 1 file từ đĩa lên).
 *
 * Dùng khi cần ghép nhiều asset đã tạo vào 1 ảnh mới — ví dụ cho nhân vật đã có mặc bộ đồ
 * đã có: đính cả "Tailor Inventor" lẫn "Parachute Suit" rồi mô tả tư thế mong muốn.
 *
 * ⚠️ PHẢI MỞ LẠI BẢNG CHỌN CHO TỪNG ASSET: click vào 1 card là Flow đính xong và ĐÓNG LUÔN
 * bảng (xem docstring `attachReferenceImage`) — không chọn được nhiều card trong 1 lần mở.
 *
 * ⚠️ Ô "Search assets" là BẮT BUỘC khi project đã nhiều media: lưới media dùng virtualized
 * list (mục 4.25/4.33/4.45), asset cần tìm có thể chưa được render nếu chỉ cuộn/tìm mù.
 */
export async function attachExistingAssets(page: Page, names: string[]): Promise<void> {
  for (const assetName of names) {
    await page.locator('button:has-text("add_2")').first().click({ timeout: 15000 });
    await page.waitForTimeout(1200);

    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    if (await search.count()) {
      await search.fill(assetName);
      await page.waitForTimeout(1500);
    }

    const card = page.locator('div[role="option"]', { hasText: assetName }).first();
    if (!(await card.count())) {
      await debugCapture(page, `attach-asset-not-found-${assetName}`);
      throw new Error(
        `Không tìm thấy asset tên "${assetName}" trong bảng chọn media của Flow — kiểm tra ` +
          `đã tạo và đổi tên đúng chưa.`
      );
    }
    await card.click();
    await page.waitForTimeout(1500);

    // Bảng phải đóng lại = đã đính. Còn thấy card nghĩa là click không ăn.
    if (await page.locator('div[role="option"]').first().count()) {
      await debugCapture(page, `attach-asset-panel-still-open-${assetName}`);
      throw new Error(`Đính asset "${assetName}" thất bại — bảng chọn media vẫn mở.`);
    }
    debugLog("reference", `đã đính asset "${assetName}"`);
  }
}

export async function createImageIngredient(
  page: Page,
  name: string,
  description: string,
  styleBlock: string,
  projectUrl: string,
  /**
   * Đường dẫn ảnh reference (image-to-image). Bỏ trống = tạo từ prompt CHỮ thuần (đúng
   * cho Prop/Setting/động vật — xem ghi chú trong styleDNA.ts: KHÔNG đính ảnh nhân vật
   * vào prop/động vật, rủi ro model kéo tỉ lệ người vào vật thể).
   */
  referenceImagePath?: string
): Promise<void> {
  // Pill hiển thị mode/tỷ lệ khung hình hiện tại — cùng selector đã xác nhận trong
  // generate.ts::ensureModelAndDuration (icon "crop_16_9" luôn xuất hiện, duy nhất TRƯỚC khi
  // bảng cài đặt mở ra). Có fallback reload nếu trang đang ở trạng thái lag/kẹt.
  const pill = page.locator('button:has-text("crop_16_9")').first();
  try {
    await pill.click({ timeout: 15000 });
  } catch {
    console.log("[imageAsset] pill cài đặt không phản hồi, reload trang và thử lại...");
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19, xem generate.ts cùng bug) —
    // reload xoá mất trạng thái lỗi thật trước khi kịp chụp nếu chụp SAU.
    await debugCapture(page, `pre-reload-pill-stuck-${name}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Modal onboarding hiện lại sau reload và chặn mọi click (RUNBOOK 8.1).
    await dismissOnboardingDialog(page);
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
    await pill.click({ timeout: 15000 });
  }
  await page.waitForTimeout(500);

  // Chuyển sang tab Image, số lượng 1.
  // ⚠️ UI ĐÃ ĐỔI TÊN TAB SỐ LƯỢNG (xác nhận trực tiếp 2026-08-02 qua
  // scripts/inspect-flow-image-ui.ts): danh sách tab thật hiện là
  //   image Image · videocam Video · crop_free Frames · chrome_extension Ingredients
  //   crop_9_16 9:16 · crop_16_9 16:9 · 4s · 6s · 8s · 10s · x1 · x2 · x3 · x4
  // Tức là tab số lượng tên **"x1"**, KHÔNG phải "1x" như codegen cũ ghi (và như RUNBOOK
  // 4.10 vẫn chép lại). Tên cũ làm click timeout 30s ngay lần chạy đầu.
  // Chấp nhận CẢ HAI tên để không vỡ nếu Google đổi lại — regex khớp cả "x1" lẫn "1x".
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.getByRole("tab", { name: /^(x1|1x)$/ }).click({ timeout: 15000 });

  // THIẾU SÓT ĐÃ SỬA: quên đóng bảng cài đặt (Radix popper) sau khi chọn xong — bảng còn mở
  // che mất ô nhập prompt bên dưới, khiến click bị chặn (pointer-events intercepted), giống
  // hệt cách ensureModelAndDuration trong generate.ts đã xử lý bằng "Escape".
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // Điền prompt — gõ bằng keyboard.type (không dùng .fill() trên contenteditable, đã xác
  // nhận .fill() gây đảo thứ tự text ở generate.ts::fillPromptWithMentions).
  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  // THỨ TỰ QUAN TRỌNG — đính ảnh SAU khi đã xoá sạch ô prompt, TRƯỚC khi gõ chữ:
  // - Đính TRƯỚC bước xoá: `Ctrl+A` + `Backspace` có nguy cơ xoá luôn ảnh vừa đính (ảnh là
  //   một phần nội dung prompt — chính vì thế nút "Clear prompt" mới hiện ra khi đính xong).
  // - Đính SAU khi gõ chữ: mở/đóng bảng chọn media có nguy cơ làm rớt text đã gõ, đúng lớp
  //   bug 4.42/4.49 (chèn chip @mention sau khi gõ làm mất câu).
  // Kẹp vào giữa là vị trí duy nhất an toàn cho cả hai phía.
  if (referenceImagePath) {
    await attachReferenceImage(page, referenceImagePath);
    // Bảng chọn media lấy mất focus — phải click lại vào ô prompt trước khi gõ.
    await promptBox.click();
    await page.waitForTimeout(300);
  }

  await page.keyboard.type(`${name}: ${description}. ${styleBlock}`);

  // Baseline-diff theo SRC vị trí đầu tiên (KHÔNG đếm số lượng nữa — xem docstring firstImageSrc
  // ở trên, lưới ảo hoá khiến đếm số lượng sai khi project đã tích luỹ nhiều media).
  const baselineFirstSrc = await firstImageSrc(page);
  debugLog("baseline", `ingredient "${name}": baselineFirstSrc=${baselineFirstSrc ?? "(none)"}`);

  await page.locator('button:has-text("arrow_forward")').last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let done = false;
  let newImageSrc: string | undefined;
  while (Date.now() < deadline) {
    const current = await firstImageSrc(page);
    if (current !== undefined && current !== baselineFirstSrc) {
      done = true;
      newImageSrc = current;
      break;
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!done) {
    // XÁC NHẬN TRỰC TIẾP (2026-07-17): cùng lỗi đã gặp với video trong generate.ts — ảnh THẬT
    // RA đã tạo xong (thấy rõ trong media grid, đúng nền xanh + đúng prompt) nhưng bot không
    // phát hiện kịp trong lúc poll trực tiếp. Trước khi kết luận lỗi thật, reload lại trang 1
    // lần và kiểm tra lại — nếu ảnh đã có thì coi là thành công, KHÔNG throw oan.
    console.log(
      `[imageAsset] chưa thấy ảnh cho "${name}" sau ${GENERATE_TIMEOUT_MS / 60000} phút, reload để kiểm tra lại trước khi kết luận lỗi...`
    );
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19, xem generate.ts cùng bug) —
    // reload xoá mất trạng thái lỗi thật trước khi kịp chụp nếu chụp SAU.
    await debugCapture(page, `pre-reload-timeout-ingredient-${name}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Modal onboarding hiện lại sau reload và chặn mọi click (RUNBOOK 8.1).
    await dismissOnboardingDialog(page);
    // Chờ trang THẬT SỰ sẵn sàng (lưới media đã render) trước khi đếm lại — "Add Media" luôn
    // xuất hiện khi trang tương tác được thật sự (xem mục 4.14 RUNBOOK), đáng tin hơn 1 mốc
    // thời gian cố định vốn có thể quá ngắn khi project đã tích luỹ nhiều media.
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    let currentAfterReload = await firstImageSrc(page);
    let foundAfterReload = currentAfterReload !== undefined && currentAfterReload !== baselineFirstSrc;
    while (!foundAfterReload && Date.now() < recheckDeadline) {
      await page.waitForTimeout(POLL_INTERVAL_MS);
      currentAfterReload = await firstImageSrc(page);
      foundAfterReload = currentAfterReload !== undefined && currentAfterReload !== baselineFirstSrc;
    }
    if (!foundAfterReload) {
      await debugCapture(page, `timeout-ingredient-${name}`);
      throw new Error(`Hết thời gian chờ tạo ảnh cho "${name}" — kiểm tra thủ công trong Flow.`);
    }
    newImageSrc = currentAfterReload;
    console.log(`[imageAsset] ảnh cho "${name}" thực ra ĐÃ tạo xong — reload phát hiện được, tiếp tục đổi tên.`);
  }

  // Tìm ĐÚNG ảnh vừa tạo bằng src đã biết chắc chắn (newImageSrc) — KHÔNG dùng .first() mù
  // (xem docstring firstImageSrc: vị trí 0 có thể lệch nếu có thao tác khác chen giữa lúc poll
  // và lúc rename). Giống hệt cách renameLatestVideo tìm video trong generate.ts.
  if (!newImageSrc) {
    await debugCapture(page, `new-image-src-missing-${name}`);
    throw new Error(`Không xác định được src ảnh vừa tạo cho "${name}" — thử lại.`);
  }
  const newImage = page.locator(`img[src="${newImageSrc}"]`).locator("xpath=ancestor::a[1]").first();
  if (!(await newImage.count())) {
    await debugCapture(page, `rename-card-missing-${name}`);
    throw new Error(`Không thấy item ảnh vừa tạo (src="${newImageSrc}") trong lưới media để đổi tên "${name}" — thử lại.`);
  }
  await newImage.click({ button: "right" });
  await page.getByRole("menuitem", { name: "whiteboard Rename" }).click();

  const nameInput = page.getByRole("textbox", { name: "Editable text" });
  await nameInput.press("ControlOrMeta+a");
  await nameInput.fill(name);
  await page.getByRole("button", { name: "done Done" }).click();

  // "networkidle" KHÔNG bao giờ fire ổn định khi project đã có nhiều media (xem ghi chú
  // tương tự trong characters.ts/generate.ts) — dùng "domcontentloaded" + chờ phần tử cụ thể.
  await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await dismissOnboardingDialog(page);
  await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
}
