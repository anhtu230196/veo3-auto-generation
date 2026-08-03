/**
 * THỬ THẬT 1 ẢNH CHARACTER cho case 1 (Reichelt) — kiểm chứng bước ĐÍNH ẢNH REFERENCE
 * (`attachReferenceImage`) vừa viết, thứ mà pipeline trước đây hoàn toàn chưa có.
 *
 * Prompt ghép theo đúng quy trình chuẩn của Nano Banana:
 *   CHARACTER_PROMPT_PREFIX + mô tả ngắn (chỉ trang phục/tóc/mũ/râu — xem
 *   CHARACTER_DESCRIPTION_CHECKLIST), kèm ảnh master reference.
 * KHÔNG dùng tên người thật (bộ lọc "prominent people" — RUNBOOK 4.28/4.40).
 *
 * ⚠️ Script này CÓ tạo media thật trong Flow (tốn credit) — đúng 1 ảnh.
 *   npx tsx scripts/test-one-character.ts
 */
import path from "node:path";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient } from "../src/veo3bot/imageAsset.js";
import { CHARACTER_PROMPT_PREFIX } from "../src/nanoBanana/styleDNA.js";

const REFERENCE = path.resolve("src/nanoBanana/reference-character.jpeg");

const NAME = "Tailor Inventor";
const DESCRIPTION =
  "a bulky dark grey-brown padded suit with a large folded fabric hood bunched up over the " +
  "shoulders and upper back, wide baggy trousers gathered below the knee, glossy black " +
  "leather gaiters over the shins, short black leather boots, dark brown hair parted at the " +
  "side and combed back, a soft dark flat cloth cap, a very large thick handlebar moustache " +
  "curling upward at both ends";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);
  console.log(`Đang tạo character "${NAME}" (có đính ảnh reference)...`);

  const t0 = Date.now();
  // styleBlock để rỗng: CHARACTER_PROMPT_PREFIX đã tự mang toàn bộ chỉ dẫn phong cách,
  // và ảnh reference mới là thứ neo chính (ảnh thắng text — MASTER_REFERENCE_NOTE).
  await createImageIngredient(
    page,
    NAME,
    `${CHARACTER_PROMPT_PREFIX} ${DESCRIPTION}`,
    "",
    projectUrl,
    REFERENCE
  );
  console.log(`✅ Xong sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  await page.screenshot({ path: "scripts/test-character-result.png" });
  console.log("Đã lưu: scripts/test-character-result.png");
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
