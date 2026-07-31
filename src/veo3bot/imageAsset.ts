import type { Page } from "playwright";
import { debugCapture, debugLog } from "./debug.js";

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
export async function createImageIngredient(
  page: Page,
  name: string,
  description: string,
  styleBlock: string,
  projectUrl: string
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
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
    await pill.click({ timeout: 15000 });
  }
  await page.waitForTimeout(500);

  // Chuyển sang tab Image, số lượng 1 — XÁC NHẬN TRỰC TIẾP qua codegen thật.
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.getByRole("tab", { name: "1x" }).click();

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
  await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
}
