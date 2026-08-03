/**
 * Tạo nốt các Prop còn lại của case 1 (Reichelt) — prompt lấy từ
 * `narration-scripts/chet-boi-phat-minh-cua-minh/refs/case-01-reichelt/assets.md`.
 *
 * Mục đích: xem `PROP_STYLE_BLOCK` có cho ra phong cách NHẤT QUÁN giữa các đồ vật có cấu
 * trúc rất khác nhau không (máy móc có chân đế / đồ vải mặc được / hình nộm) — đây chính
 * là câu hỏi để ngỏ trong docstring của block đó.
 *
 * Chạy tuần tự, mỗi prop lỗi thì log rồi ĐI TIẾP (không làm hỏng cả mẻ) — cùng tinh thần
 * mục 4.18 RUNBOOK.
 *
 * ⚠️ CÓ tạo media thật (tốn credit): 2 ảnh.
 *   npx tsx scripts/test-props.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient } from "../src/veo3bot/imageAsset.js";
import { PROP_STYLE_BLOCK } from "../src/nanoBanana/styleDNA.js";

const PROPS: { name: string; description: string }[] = [
  {
    name: "Parachute Suit",
    description:
      "A dark charcoal fabric parachute garment displayed spread wide open and completely " +
      "empty with no wearer, two very wide cape-like fabric wings extended straight out " +
      "horizontally to their full span reaching down to the bottom of the frame, a tall " +
      "upright rectangular fabric hood panel held open by four straight rigid rods rising " +
      "above the top edge of the garment, a dark buttoned tunic front at the centre with one " +
      "horizontal chest strap and one waist belt closed by a plain square buckle, and several " +
      "loose pale webbing straps hanging down",
  },
  {
    name: "Tailor Dummy",
    description:
      "A headless tailor's dress form mannequin, a plain cream-coloured armless torso shape " +
      "mounted on a single straight central post rising from a small round flat base",
  },
];

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}\n`);

  const failed: string[] = [];
  for (const prop of PROPS) {
    console.log(`→ Đang tạo prop "${prop.name}"...`);
    const t0 = Date.now();
    try {
      await createImageIngredient(page, prop.name, prop.description, PROP_STYLE_BLOCK, projectUrl);
      console.log(`  ✅ xong sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } catch (e) {
      failed.push(prop.name);
      console.error(`  ❌ lỗi: ${(e as Error).message}`);
    }
  }

  await page.screenshot({ path: "scripts/test-props-result.png" });
  console.log("\nĐã lưu: scripts/test-props-result.png");
  if (failed.length) console.log(`⚠️ Prop lỗi: ${failed.join(", ")}`);
  await context.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
