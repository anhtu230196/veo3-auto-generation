/**
 * Ghép 2 asset đã có thành 1 ảnh mới: nhân vật "Tailor Inventor" MẶC bộ "Parachute Suit"
 * đã bung, ở góc 3/4.
 *
 * Cách làm: đính CẢ HAI asset đã có trong Flow làm reference (attachExistingAssets), rồi
 * mô tả tư thế. Nguyên tắc "ảnh thắng text" (MASTER_REFERENCE_NOTE) hoạt động có lợi ở đây —
 * mặt/phong cách nhân vật và hình dạng bộ dù đều đã bị KHOÁ bởi 2 ảnh gốc, phần chữ chỉ còn
 * việc mô tả tư thế và góc nhìn.
 *
 * KHÔNG dùng tên người thật trong prompt (RUNBOOK 4.28/4.40).
 *
 * ⚠️ CÓ tạo media thật (tốn credit): 1 ảnh.
 *   npx tsx scripts/make-character-wearing-suit.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { attachExistingAssets } from "../src/veo3bot/imageAsset.js";

const OUTPUT_NAME = "Inventor Wearing Suit 3Q";

// ⚠️ BÀI HỌC (xác nhận trực tiếp 2026-08-02): bản prompt đầu tiên có câu "Three-quarter view,
// turned slightly to one side" đặt ở GIỮA đoạn — model BỎ QUA HOÀN TOÀN, ra ảnh chính diện.
// Nguyên nhân: cả 2 ảnh reference đều chụp chính diện, và "ảnh thắng text"
// (MASTER_REFERENCE_NOTE / RUNBOOK 4.12) nên góc nhìn bị 2 ảnh đó khoá cứng.
// Bản này: đưa yêu cầu góc lên ĐẦU, nói bằng ngôn ngữ HÌNH HỌC cụ thể (xoay bao nhiêu độ,
// thấy gì/không thấy gì) thay vì thuật ngữ "three-quarter view", và nhắc lại ở cuối.
const PROMPT =
  "IMPORTANT CHANGE OF CAMERA ANGLE: the body must be rotated about 45 degrees away from " +
  "the camera, NOT facing straight forward. The reference images are front-facing but this " +
  "new image must NOT be. Turn the whole figure so one shoulder is closer to the viewer than " +
  "the other, the nose points off to one side, and one of the two spread fabric wings appears " +
  "clearly shorter and foreshortened compared to the other. " +
  "Now the content: draw the same man from the first reference image, with the exact same " +
  "face, moustache, cap and illustration style, wearing the parachute garment from the second " +
  "reference image. Both arms extended straight out sideways so the wide fabric wings are " +
  "spread fully open, the tall rectangular hood frame rising behind his head, full body " +
  "visible, standing upright. " +
  "Keep the exact same flat 2D vector style as the references: bold uniform-width black " +
  "outlines, completely flat color fills, no shading, no gradients. Plain solid single-color " +
  "background, no scenery. " +
  "Remember: three-quarter turned body, asymmetric wings, NOT a symmetrical front view.";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);

  // Vào chế độ Image, số lượng 1.
  await page.locator('button:has-text("crop_16_9")').first().click({ timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.getByRole("tab", { name: /^(x1|1x)$/ }).click({ timeout: 15000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Xoá ô prompt TRƯỚC, đính ảnh SAU, gõ chữ CUỐI — thứ tự bắt buộc, xem ghi chú trong
  // createImageIngredient (ảnh đính là một phần nội dung prompt).
  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  console.log("Đang đính 2 asset reference...");
  await attachExistingAssets(page, ["Tailor Inventor", "Parachute Suit"]);

  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(PROMPT);

  console.log("Đang tạo ảnh...");
  const t0 = Date.now();
  await page.locator('button:has-text("arrow_forward")').last().click();
  await page.waitForTimeout(60000);
  console.log(`Đã chờ ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  await page.screenshot({ path: "scripts/character-wearing-suit.png" });
  console.log(`Đã lưu: scripts/character-wearing-suit.png (đặt tên thủ công: "${OUTPUT_NAME}")`);
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
