// Build state/prompts.json cho project "Cuộc đua Bắc Cực" (Cook vs Peary) — 264 cảnh.
// Giữ phần NỘI DUNG sáng tạo từng cảnh + gán asset ở đây; PERIOD_ANCHOR + MOTION_SUFFIX
// được BAKE bằng code (khớp đúng styleDNA.ts) để mọi videoPrompt kết thúc bằng MOTION_SUFFIX
// (generate.ts kiểm tra 60 ký tự đuôi). Chạy: node scripts/build-arctic-prompts.mjs
//
// Chạy lại AN TOÀN (idempotent) — luôn ghi đè state/prompts.json bằng nội dung dưới đây, đặt
// status "waiting" + isDownloaded false cho mọi cảnh. KHÔNG chạy khi npm run generate đang chạy.

import fs from "node:fs";

// ---- Các hằng số style, COPY CHÍNH XÁC từ src/styleDNA.ts (giữ đồng bộ nếu sửa styleDNA) ----
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

// Mỗi cảnh: [content, characterNames, settingNames, propNames, era?]  (era mặc định "period")
const scenes = [];
export default scenes; // (không bắt buộc) — cho phép import nếu cần

// Batch được nạp từ các file riêng để giữ file này gọn — xem build-arctic-scenes-*.mjs
import { part1 } from "./arctic-scenes-part1.mjs";
import { part2 } from "./arctic-scenes-part2.mjs";
import { part3 } from "./arctic-scenes-part3.mjs";
import { part4 } from "./arctic-scenes-part4.mjs";
scenes.push(...part1, ...part2, ...part3, ...part4);

// ---- Lắp ráp ----
const sceneMeta = JSON.parse(fs.readFileSync("./state/scenes.json", "utf-8"));
if (scenes.length !== sceneMeta.length) {
  throw new Error(
    `Số cảnh không khớp: có ${scenes.length} entry nội dung nhưng state/scenes.json có ${sceneMeta.length} cảnh.`
  );
}

const prompts = scenes.map((entry, i) => {
  const [content, characterNames = [], settingNames = [], propNames = [], era = "period"] = entry;
  const parts = [content.trim()];
  if (era !== "modern") parts.push(PERIOD_ANCHOR);
  parts.push(MOTION_SUFFIX);
  const videoPrompt = parts.join(" ");
  const out = {
    index: i,
    sceneText: sceneMeta[i].text,
    videoPrompt,
    characterNames,
    settingNames,
    propNames,
    era,
    status: "waiting",
    isDownloaded: false,
  };
  return out;
});

// Ghi atomic (file tạm rồi rename) — xem RUNBOOK mục 4.23.
const tmp = `./state/prompts.json.tmp-${process.pid}-${Date.now()}`;
fs.writeFileSync(tmp, JSON.stringify(prompts, null, 2));
fs.renameSync(tmp, "./state/prompts.json");
console.log(`Đã ghi ${prompts.length} cảnh -> state/prompts.json`);
