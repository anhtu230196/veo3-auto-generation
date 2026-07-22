// Vá 16 cảnh "chân dung/cận cảnh trần" phát hiện đợt 2 (RUNBOOK mục 4.46 mở rộng — quét lần đầu
// chỉ bắt mẫu "portrait shot", bỏ sót mẫu "Close-up of X's face"/"Medium shot of X doing Y" không
// mô tả bối cảnh). Người dùng phát hiện clip_078 giữ nguyên phông xanh chroma-key gốc của Character
// Ingredient thay vì vẽ cảnh mới — vì cảnh không mô tả bối cảnh nào để Veo3 bám vào.
// KHÔNG dùng build-arctic-prompts.mjs (sẽ RESET toàn bộ status). Patch TRỰC TIẾP đúng 16 index.
// Chạy: node scripts/patch-bare-closeup-scenes.mjs

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
  39: "Close-up of Young Robert's face lit with sudden fierce ambition as he looks up from the book, determination igniting, against a plain softly blurred warm-toned background with no distinct objects, furniture, or setting visible. Warm dramatic light.",
  47: "Medium shot of Robert pausing over his letter and looking up with quiet burning resolve, against a plain softly blurred warm-toned background with no distinct objects, furniture, or setting visible. Warm lamplight on his face.",
  67: "Medium shot of Robert holding out a signed contract with a firm forbidding gesture, stern and unyielding, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible. Cool tone. Robert raises the contract.",
  78: "Close-up of Young Frederick's face hardening with wounded pride and fierce determination, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible. Cold blue light. Young Frederick sets his jaw.",
  125: "Close-up of Robert's eyes narrowing with cold resolve, against a plain softly blurred dim cold-toned background with no distinct objects, furniture, or setting visible, rivalry hardening. Robert stares fixedly ahead.",
  160: "Close-up of Robert's face twisting with resentment, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible, his rival's shadow looming in his mind, cold blue shadow. Robert glares.",
  191: "Close-up of Robert's tight guarded face, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible, holding his own secret, cold shadow. Robert presses his lips shut.",
  193: "Close-up of Robert's eyes narrowing as a cold idea takes shape, calculating, against a plain softly blurred cool blue-toned background with no distinct objects, furniture, or setting visible. Robert's expression sharpens with a plan.",
  198: "Close-up of Robert's hand writing a curt telegram line, his cold confident face above, against a plain softly blurred cool-toned background with no distinct objects, furniture, or setting visible. Cool lamplight. Robert pens the message.",
  205: "Medium shot of Frederick reading a telegram slip, his confident face falling, dread creeping in, against a plain softly blurred cool-toned background with no distinct objects, furniture, or setting visible. Cool shadow. Frederick's expression drops.",
  207: "Close-up of Frederick's stricken face as he grasps the catastrophe, hope draining away, against a plain softly blurred cold blue-toned background with no distinct objects, furniture, or setting visible. Frederick stares in dismay.",
  217: "Medium shot of The Blacksmith counting banknotes alone with a guilty glance, against a plain softly blurred cool dim-toned background with no distinct objects, furniture, or setting visible. The Blacksmith counts the cash.",
  218: "Medium two-shot of The Older Hunter and The Younger Hunter seated before officials giving a statement, uneasy, against a plain softly blurred cool-toned background with no distinct objects, furniture, or setting visible. The Older Hunter speaks while The Younger Hunter looks down.",
  219: "Medium shot of The Older Hunter gesturing a short distance with his hands before officials, indicating a brief journey, against a plain softly blurred cool-toned background with no distinct objects, furniture, or setting visible. The Older Hunter shows a small distance.",
  240: "Medium shot of Robert placing his Arctic diary into a drawer and closing it, sealing away his secrets, against a plain softly blurred cool dim-toned background with no distinct objects, furniture, or setting visible (except the drawer itself). Robert shuts the drawer.",
  249: "Medium shot of Robert accepting funding from dark-suited backers with a knowing look, ambition over truth, against a plain softly blurred cool-toned background with no distinct objects, furniture, or setting visible. Robert takes the backing.",
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
  const oldStatus = p.status;
  p.videoPrompt = parts.join(" ");
  p.status = "waiting";
  p.isDownloaded = false;
  console.log(`Đã vá cảnh #${idx} (status cũ: ${oldStatus} -> waiting)`);
}

const tmp = `./state/prompts.json.tmp-${process.pid}-${Date.now()}`;
fs.writeFileSync(tmp, JSON.stringify(prompts, null, 2));
fs.renameSync(tmp, "./state/prompts.json");
console.log(`Đã ghi lại state/prompts.json (${prompts.length} cảnh, chỉ sửa ${Object.keys(patches).length} cảnh).`);
