// Cập nhật MOTION_SUFFIX (đã bake cứng vào cuối MỌI videoPrompt) sang bản MỚI có thêm
// SCALE_CONSISTENCY_BLOCK (mục 4.51 RUNBOOK — chặn lỗi lệch tỉ lệ giữa nhân vật có Ingredient
// và nhân vật quần chúng tự vẽ). CHỈ thay đúng đoạn suffix cũ bằng suffix mới trong TOÀN BỘ 264
// cảnh — KHÔNG đụng phần nội dung riêng từng cảnh, KHÔNG reset status (suffix cũ vẫn đúng style,
// chỉ thiếu 1 câu — không phải lỗi nghiêm trọng bắt buộc phải generate lại TẤT CẢ; xem script
// patch riêng để reset đúng các cảnh THẬT SỰ có rủi ro lệch tỉ lệ).
// Chạy: node scripts/update-motion-suffix.mjs

import fs from "node:fs";

const OLD_SUFFIX =
  "Maintain the exact 2D flat vector illustration style and color palette from the reference. Simple " +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no light " +
  "flares, no particle effects, no shine bursts or radiance around objects — flat matte " +
  "surfaces only, even on metal, gold, or gemstones. " +
  "Every character, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery shape (rocks, trees, clouds, waves) must have a clean, bold, uniform-width black " +
  "outline drawn around its entire silhouette — apply the SAME bold outline treatment to " +
  "foreground characters AND background objects/scenery alike, with no exceptions. No " +
  "outline-less soft-edge shapes, no faint/thin/broken outlines, no gaps in the outline where " +
  "two shapes overlap or meet.";

const SCALE_CONSISTENCY_BLOCK =
  "All characters and figures in the frame — whether a named character referenced by an " +
  "Ingredient image or an unnamed background figure — must be drawn at the SAME consistent, " +
  "realistic human scale relative to each other, exactly as real people of similar age/height " +
  "would appear standing near one another. NO character should appear unnaturally larger or " +
  "smaller than the others just because of their own separate reference image's framing — adult " +
  "figures are all roughly the same height unless the scene explicitly describes a size " +
  "difference (child vs adult, distance from camera).";

const NEW_SUFFIX = `${OLD_SUFFIX} ${SCALE_CONSISTENCY_BLOCK}`;

const prompts = JSON.parse(fs.readFileSync("./state/prompts.json", "utf-8"));
let updated = 0;
let alreadyNew = 0;
let noMatch = 0;

for (const p of prompts) {
  if (p.videoPrompt.includes(SCALE_CONSISTENCY_BLOCK)) {
    alreadyNew++;
    continue;
  }
  if (p.videoPrompt.trimEnd().endsWith(OLD_SUFFIX)) {
    p.videoPrompt = p.videoPrompt.trimEnd().slice(0, -OLD_SUFFIX.length) + NEW_SUFFIX;
    updated++;
  } else {
    noMatch++;
    console.warn(`Cảnh #${p.index}: KHÔNG khớp suffix cũ y hệt — bỏ qua, kiểm tra tay.`);
  }
}

console.log(`Đã cập nhật ${updated} cảnh, ${alreadyNew} đã có sẵn suffix mới, ${noMatch} không khớp.`);

const tmp = `./state/prompts.json.tmp-${process.pid}-${Date.now()}`;
fs.writeFileSync(tmp, JSON.stringify(prompts, null, 2));
fs.renameSync(tmp, "./state/prompts.json");
console.log(`Đã ghi lại state/prompts.json (${prompts.length} cảnh).`);
