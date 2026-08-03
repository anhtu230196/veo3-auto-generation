/**
 * THỬ THẬT 1 ẢNH PROP cho case 1 (Reichelt) bằng code sẵn có
 * `imageAsset.ts::createImageIngredient` + `PROP_STYLE_BLOCK` mới.
 *
 * Mục đích kép:
 *  1. Trả lời "tạo ảnh được chưa" bằng bằng chứng thật, không phải suy đoán.
 *  2. Kiểm chứng 2 thứ CHƯA TỪNG chạy thật:
 *     - `PROP_STYLE_BLOCK` (mới viết 2026-08-02, chưa có ảnh nào để đối chiếu).
 *     - Bản sửa detection ở RUNBOOK 4.45 (`firstImageSrc` thay cho đếm số lượng) —
 *       ghi rõ "CHƯA CHẠY THỬ THẬT sau khi sửa".
 *
 * ⚠️ Script này CÓ tạo media thật trong Flow (tốn credit) — đúng 1 ảnh.
 *   npx tsx scripts/test-one-prop.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient } from "../src/veo3bot/imageAsset.js";
import { PROP_STYLE_BLOCK } from "../src/nanoBanana/styleDNA.js";

const NAME = "Newsreel Camera";
const DESCRIPTION =
  "An early 1900s hand-cranked motion picture camera mounted on a wooden tripod: a plain " +
  "dark wooden box body, one short black cylindrical lens on the front face, a round crank " +
  "handle on the side, one flat circular film magazine sitting on top, and three straight " +
  "tapered wooden tripod legs splayed evenly below.";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);
  console.log(`Đang tạo prop "${NAME}"...`);

  const t0 = Date.now();
  await createImageIngredient(page, NAME, DESCRIPTION, PROP_STYLE_BLOCK, projectUrl);
  console.log(`✅ Xong sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  await page.screenshot({ path: "scripts/test-prop-result.png" });
  console.log("Đã lưu: scripts/test-prop-result.png");
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
