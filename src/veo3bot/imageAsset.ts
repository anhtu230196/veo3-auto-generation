import type { Page } from "playwright";

const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;

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
    await page.waitForTimeout(3000);
    if ((await imageLinksAll.count()) <= baselineCount) {
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
