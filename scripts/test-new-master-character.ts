/**
 * THỬ NHÂN VẬT MỚI với reference-character.jpeg VỪA ĐỔI (2026-08-03, người dùng tự thay file).
 *
 * MỤC ĐÍCH KÉP:
 * 1. Xác nhận ảnh reference mới dùng được qua đúng luồng `attachReferenceImage` +
 *    `createImageIngredient` (chưa từng chạy thật với ảnh này).
 * 2. Kiểm tra CHÍNH RỦI RO vừa ghi trong `MASTER_REFERENCE_NOTE`/`CHARACTER_DESCRIPTION_CHECKLIST`
 *    (styleDNA.ts): ảnh gốc có tóc dài buông 2 bên + áo có lớp (khoác ngoài lộ sơ mi/cà vạt) —
 *    liệu MÔ TẢ CHỮ nói rõ "tóc ngắn"/"trang phục 1 lớp" có ghi đè được không, hay ảnh vẫn thắng.
 *
 * Chọn nhân vật khác hẳn (phụ nữ lớn tuổi, tóc búi bạc, váy xanh lá đơn giản) để dễ nhận ra
 * ngay nếu có đặc điểm nào của ảnh gốc bị lẫn vào ngoài ý muốn.
 *
 * ⚠️ CÓ tạo media thật (tốn credit): 1 ảnh.
 *   npx tsx scripts/test-new-master-character.ts
 */
import path from "node:path";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient } from "../src/veo3bot/imageAsset.js";
import { CHARACTER_PROMPT_PREFIX } from "../src/nanoBanana/styleDNA.js";

const REFERENCE = path.resolve("src/nanoBanana/reference-character.jpeg");

const NAME = "Elderly Woman Test";
// Cố tình ghi RÕ tóc ngắn/gọn và trang phục 1 lớp — đúng khuyến nghị mới trong
// CHARACTER_DESCRIPTION_CHECKLIST, để kiểm tra text có ghi đè được đặc điểm ảnh gốc không.
const DESCRIPTION =
  "an elderly woman, grey hair tied back into a small tight bun with no loose strands and no " +
  "hair hanging past the ears, wearing one single plain simple green dress with no jacket or " +
  "layered clothing over it, small round glasses, gentle wrinkle lines near the eyes";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);
  console.log(`Đang tạo character "${NAME}" (reference mới)...`);

  const t0 = Date.now();
  await createImageIngredient(
    page,
    NAME,
    `${CHARACTER_PROMPT_PREFIX} ${DESCRIPTION}`,
    "",
    projectUrl,
    REFERENCE
  );
  console.log(`✅ Xong sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  await page.screenshot({ path: "scripts/test-new-master-result.png" });
  console.log("Đã lưu: scripts/test-new-master-result.png");
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
