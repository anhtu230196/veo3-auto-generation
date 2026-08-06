/**
 * THỬ THẬT: ghép 1 Character VÀO 1 Background thành 1 ảnh mới (RUNBOOK mục 8.1 "Việc còn
 * chưa làm" #2 — "Test ghép nhân vật VÀO bối cảnh cùng 1 ảnh, dùng reserveCharacterSpace đã
 * có sẵn ở background — CHƯA làm"). Khác mục 3f (Character + Prop) ở chỗ: Background đã có
 * sẵn `RESERVE_CHARACTER_SPACE_BLOCK` (chừa sàn trống) + `EYE_LEVEL_CAMERA_BLOCK` (góc máy
 * ngang tầm mắt) từ lúc tạo, nên câu hỏi cần trả lời là: nhân vật có được ĐẶT ĐÚNG vào đúng
 * chỗ trống đó, đúng tỉ lệ, đúng góc máy đã chừa sẵn hay không.
 *
 * Dùng "A Fei V2" (case 1, đã tạo) + "Forest Clearing With Boulder" (case 1, đã tạo) — đúng
 * cảnh "ngồi xuống tảng đá lớn" trong kịch bản, nên kết quả có giá trị dùng thật luôn nếu ổn.
 *
 * ⚠️ CÓ tạo media thật trong Flow (tốn credit): 1 ảnh.
 *   npx tsx scripts/test-character-in-background.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { attachExistingAssets } from "../src/veo3bot/imageAsset.js";

const CHARACTER_NAME = "A Fei V2";
const BACKGROUND_NAME = "Forest Clearing With Boulder";
const OUTPUT_NAME = "A Fei In Forest Clearing Test";

const PROMPT =
  "Draw the exact same woman from the first reference image (same face, short black hair, " +
  "red puffer jacket with fur-trimmed hood down, white face mask, same flat 2D vector " +
  "illustration style), now standing inside the forest clearing scene from the second " +
  "reference image. Keep the clearing, the boulders, the trees and the ground exactly as " +
  "shown in the second reference image, unchanged. " +
  "Place her standing upright on the open dirt clearing floor, both feet planted on the " +
  "ground, facing toward the viewer, positioned in the empty open area of the clearing away " +
  "from the boulders. She must be scaled to a normal human size relative to the boulders and " +
  "trees behind her, viewed at the same straight-ahead eye-level camera angle as the second " +
  "reference image, not from above and not from below. " +
  "Keep the exact same flat 2D vector style as both references: bold uniform-width black " +
  "outlines, completely flat color fills, no shading, no gradients, no perspective.";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);

  await page.locator('button:has-text("crop_16_9")').first().click({ timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.getByRole("tab", { name: /^(x1|1x)$/ }).click({ timeout: 15000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  console.log(`Đang đính 2 asset reference: "${CHARACTER_NAME}" + "${BACKGROUND_NAME}"...`);
  await attachExistingAssets(page, [CHARACTER_NAME, BACKGROUND_NAME]);

  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(PROMPT);

  console.log("Đang tạo ảnh...");
  const t0 = Date.now();
  await page.locator('button:has-text("arrow_forward")').last().click();
  await page.waitForTimeout(60000);
  console.log(`Đã chờ ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  await page.screenshot({ path: "scripts/test-character-in-background-result.png" });
  console.log(
    `Đã lưu: scripts/test-character-in-background-result.png (đặt tên thủ công trong Flow: "${OUTPUT_NAME}" nếu muốn giữ lại)`
  );
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
