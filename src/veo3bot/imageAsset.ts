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
const GENERATE_TIMEOUT_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;
const RELOAD_RECHECK_TIMEOUT_MS = 90 * 1000;

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

  // Baseline-diff giống hệt cơ chế chống trùng lặp trong generate.ts::generateOneClip — đếm
  // số ảnh "Generated image" TRƯỚC khi bấm Create, chỉ coi là xong khi số lượng TĂNG (tránh
  // nhầm sang ảnh cũ đã có sẵn trong lưới media của project).
  const imageLinksAll = page.getByRole("link", { name: "Generated image" });
  const baselineCount = await imageLinksAll.count();
  debugLog("baseline", `ingredient "${name}": baselineCount=${baselineCount}`);

  await page.locator('button:has-text("arrow_forward")').last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let done = false;
  while (Date.now() < deadline) {
    if ((await imageLinksAll.count()) > baselineCount) {
      done = true;
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
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Chờ trang THẬT SỰ sẵn sàng (lưới media đã render) trước khi đếm lại — "Add Media" luôn
    // xuất hiện khi trang tương tác được thật sự (xem mục 4.14 RUNBOOK), đáng tin hơn 1 mốc
    // thời gian cố định vốn có thể quá ngắn khi project đã tích luỹ nhiều media.
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    let foundAfterReload = (await imageLinksAll.count()) > baselineCount;
    while (!foundAfterReload && Date.now() < recheckDeadline) {
      await page.waitForTimeout(POLL_INTERVAL_MS);
      foundAfterReload = (await imageLinksAll.count()) > baselineCount;
    }
    if (!foundAfterReload) {
      await debugCapture(page, `timeout-ingredient-${name}`);
      throw new Error(`Hết thời gian chờ tạo ảnh cho "${name}" — kiểm tra thủ công trong Flow.`);
    }
    console.log(`[imageAsset] ảnh cho "${name}" thực ra ĐÃ tạo xong — reload phát hiện được, tiếp tục đổi tên.`);
  }

  // Ảnh mới nhất xuất hiện ĐẦU danh sách (media grid sort "Recent") — cùng giả định đã dùng
  // cho video trong generate.ts (.first() sau baseline-diff luôn lấy đúng video mới nhất).
  const newImage = imageLinksAll.first();
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
