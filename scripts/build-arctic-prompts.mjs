// Build state/prompts.json cho project "Cuộc đua Bắc Cực" (Cook vs Peary) — 264 cảnh.
// Giữ phần NỘI DUNG sáng tạo từng cảnh + gán asset ở đây; PERIOD_ANCHOR + MOTION_SUFFIX
// được BAKE bằng code (khớp đúng styleDNA.ts) để mọi videoPrompt kết thúc bằng MOTION_SUFFIX
// (generate.ts kiểm tra 60 ký tự đuôi). Chạy: node scripts/build-arctic-prompts.mjs
//
// Chạy lại AN TOÀN (idempotent) — luôn ghi đè state/prompts.json bằng nội dung dưới đây, đặt
// status "waiting" + isDownloaded false cho mọi cảnh. KHÔNG chạy khi npm run generate đang chạy.

import fs from "node:fs";

// ---- Các hằng số style, COPY CHÍNH XÁC từ src/styleDNA.ts (giữ đồng bộ nếu sửa styleDNA) ----
const PHOTOREAL_BLOCK =
  "Every person, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery element must look like it was captured by a real camera — natural photographic " +
  "detail, realistic texture, accurate light falloff and shadow. NO cartoon, NO illustration, " +
  "NO painting, NO flat color fills, NO cel-shading, NO 3D-CGI-render look, NO outlines around " +
  "objects or characters, NO stylization of any kind — everything must read as an authentic " +
  "photograph or live-action film frame, apply the SAME photorealistic treatment to foreground " +
  "characters AND background objects/scenery alike, with no exceptions.";

const SCALE_CONSISTENCY_BLOCK =
  "All characters and figures in the frame — whether a named character referenced by an " +
  "Ingredient image or an unnamed background figure — must be drawn at the SAME consistent, " +
  "realistic human scale relative to each other, exactly as real people of similar age/height " +
  "would appear standing near one another. NO character should appear unnaturally larger or " +
  "smaller than the others just because of their own separate reference image's framing — adult " +
  "figures are all roughly the same height unless the scene explicitly describes a size " +
  "difference (child vs adult, distance from camera).";

const MOTION_SUFFIX =
  "Maintain the exact photorealistic cinematic style and color grading from the reference. Simple " +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no lens " +
  "flares, no particle effects, no unnatural shine bursts or radiance around objects — " +
  "natural film lighting only, even on metal, gold, or gemstones. " + PHOTOREAL_BLOCK + " " + SCALE_CONSISTENCY_BLOCK;

const PERIOD_ANCHOR =
  "turn-of-the-20th-century golden age of polar exploration (roughly 1880s–1910s) setting — " +
  "period-accurate heavy fur parkas and hooded anoraks, wool coats, leather and sealskin boots, " +
  "fur mittens; wooden dog sledges, wooden sail-and-steam ships with tall masts and a single " +
  "smokestack, oil lamps and brass navigation instruments; in city scenes, early-1900s formal " +
  "suits, waistcoats, high collars, long dresses, horse-drawn carriages and brick or stone " +
  "architecture. NO modern clothing, NO snowmobiles, motorboats, aircraft, cars or trucks, NO " +
  "plastic or synthetic materials, NO modern buildings or equipment of any kind.";

// Mỗi cảnh: [content, characterNames, propNames, era?]  (era mặc định "period")
// ĐÃ BỎ settingNames (2026-07-22) — soát lại toàn bộ 146 cảnh từng dùng Setting: mọi cảnh đều
// đã có mô tả hình ảnh đầy đủ tự thân trong `content` (kể cả tên địa điểm được nhắc thẳng trong
// câu), không cần Setting Ingredient để neo bối cảnh nữa (xem RUNBOOK mục 0). Không cảnh nào
// được đánh dấu needsAngleLock trong đợt di trú này — không tìm thấy cặp cắt cảnh rộng→cận
// CÙNG 1 khoảnh khắc nào đủ rõ ràng để cần soi ảnh trước; có thể thêm tay sau nếu phát sinh.
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
  const [content, characterNames = [], propNames = [], era = "period"] = entry;
  const parts = [content.trim()];
  if (era !== "modern") parts.push(PERIOD_ANCHOR);
  parts.push(MOTION_SUFFIX);
  const videoPrompt = parts.join(" ");
  const out = {
    index: i,
    sceneText: sceneMeta[i].text,
    videoPrompt,
    characterNames,
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
