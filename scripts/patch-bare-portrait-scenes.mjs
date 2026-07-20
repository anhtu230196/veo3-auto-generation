// Vá lại videoPrompt cho 3 cảnh chân dung "trần" (#3, #6, #239) bị Veo3 tự bịa thêm tàu/thuyền
// vào phông nền (do PERIOD_ANCHOR liệt kê "wooden sail-and-steam ships" làm ví dụ đồ vật thời
// đại — cảnh không hề mô tả bối cảnh nào nên Veo3 lấy luôn ví dụ đó làm nội dung thật).
// KHÔNG dùng build-arctic-prompts.mjs (sẽ RESET toàn bộ status về "waiting", mất tiến độ đã
// generate) — patch TRỰC TIẾP đúng 3 index cần sửa, giữ nguyên mọi cảnh khác.
// Chạy: node scripts/patch-bare-portrait-scenes.mjs

import fs from "node:fs";

const OUTLINE_BLOCK =
  "Every character, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery shape (rocks, trees, clouds, waves) must have a clean, bold, uniform-width black " +
  "outline drawn around its entire silhouette — apply the SAME bold outline treatment to " +
  "foreground characters AND background objects/scenery alike, with no exceptions. No " +
  "outline-less soft-edge shapes, no faint/thin/broken outlines, no gaps in the outline where " +
  "two shapes overlap or meet.";

const MOTION_SUFFIX =
  "Maintain the exact 2D flat vector illustration style and color palette from the reference. Simple " +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no light " +
  "flares, no particle effects, no shine bursts or radiance around objects — flat matte " +
  "surfaces only, even on metal, gold, or gemstones. " + OUTLINE_BLOCK;

const PERIOD_ANCHOR =
  "turn-of-the-20th-century golden age of polar exploration (roughly 1880s–1910s) setting — " +
  "period-accurate heavy fur parkas and hooded anoraks, wool coats, leather and sealskin boots, " +
  "fur mittens; wooden dog sledges, wooden sail-and-steam ships with tall masts and a single " +
  "smokestack, oil lamps and brass navigation instruments; in city scenes, early-1900s formal " +
  "suits, waistcoats, high collars, long dresses, horse-drawn carriages and brick or stone " +
  "architecture. NO modern clothing, NO snowmobiles, motorboats, aircraft, cars or trucks, NO " +
  "plastic or synthetic materials, NO modern buildings or equipment of any kind.";

const patches = {
  3: "Medium portrait shot of Frederick standing confidently in his fur anorak with a slight proud smile, warm golden celebratory light, against a plain softly blurred warm-toned background with no distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any kind. Frederick looks steadily ahead.",
  6: "Medium portrait shot of Robert standing stern and defiant in his fur parka, his large mustache set and arms crossed, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any kind. Cold steel-blue tone.",
  239: "Medium portrait shot of Robert standing in a formal rear-admiral's dress uniform with medals, dignified and honored, warm formal light, against a plain softly blurred warm-toned background with no distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any kind. Robert stands at attention.",
};

const prompts = JSON.parse(fs.readFileSync("./state/prompts.json", "utf-8"));

for (const [idxStr, content] of Object.entries(patches)) {
  const idx = Number(idxStr);
  const p = prompts.find((x) => x.index === idx);
  if (!p) throw new Error(`Không tìm thấy cảnh #${idx}`);
  const era = p.era ?? "period";
  const parts = [content.trim()];
  if (era !== "modern") parts.push(PERIOD_ANCHOR);
  parts.push(MOTION_SUFFIX);
  p.videoPrompt = parts.join(" ");
  p.status = "waiting";
  p.isDownloaded = false;
  console.log(`Đã vá cảnh #${idx}, reset status -> "waiting"`);
}

const tmp = `./state/prompts.json.tmp-${process.pid}-${Date.now()}`;
fs.writeFileSync(tmp, JSON.stringify(prompts, null, 2));
fs.renameSync(tmp, "./state/prompts.json");
console.log(`Đã ghi lại state/prompts.json (${prompts.length} cảnh, chỉ sửa ${Object.keys(patches).length} cảnh).`);
