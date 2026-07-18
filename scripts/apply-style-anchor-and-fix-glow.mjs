// Script một lần:
// 1. Thay MOTION_SUFFIX cũ bằng bản mới (cấm glow/sparkle rõ ràng hơn) trong toàn bộ prompts.
// 2. Gắn "Style Anchor" (settingNames) + câu tường minh cho MỌI cảnh "mồ côi" — không có
//    characterNames, settingNames, propNames nào (chưa có Ingredient nào neo giữ style).
//
// Chạy: node scripts/apply-style-anchor-and-fix-glow.mjs

import fs from "node:fs";

const PROMPTS_PATH = "./state/prompts.json";

const OLD_MOTION_SUFFIX =
  "Maintain the exact 2D flat vector illustration style and color palette from the reference. " +
  "Simple grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift.";

const NEW_MOTION_SUFFIX =
  "Maintain the exact 2D flat vector illustration style and color palette from the reference. " +
  "Simple grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no light " +
  "flares, no particle effects, no shine bursts or radiance around objects — flat matte " +
  "surfaces only, even on metal, gold, or gemstones.";

const STYLE_ANCHOR_NAME = "Style Anchor";
// KHÔNG có "@" trước tên — xem RUNBOOK mục 4.25 (gõ "@" dạng chữ thật tự mở dialog Flow giữa
// chừng, làm hỏng text gõ sau đó). Khớp đúng styleDNA.ts sau khi sửa 2026-07-18.
const STYLE_ANCHOR_SENTENCE = "Maintain the exact same illustration style as Style Anchor.";

const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf-8"));

let suffixReplaced = 0;
let anchorTagged = 0;
let alreadyAnchored = 0;

for (const p of prompts) {
  // 1. Thay MOTION_SUFFIX cũ -> mới (nếu chưa thay)
  if (p.videoPrompt.includes(OLD_MOTION_SUFFIX) && !p.videoPrompt.includes(NEW_MOTION_SUFFIX)) {
    p.videoPrompt = p.videoPrompt.replace(OLD_MOTION_SUFFIX, NEW_MOTION_SUFFIX);
    suffixReplaced++;
  }

  const isOrphan =
    (p.characterNames ?? []).length === 0 &&
    (p.settingNames ?? []).length === 0 &&
    (p.propNames ?? []).length === 0;

  if (!isOrphan) continue;

  if (p.videoPrompt.includes(STYLE_ANCHOR_SENTENCE)) {
    alreadyAnchored++;
    continue;
  }

  p.settingNames = [STYLE_ANCHOR_NAME];

  // Chèn câu tường minh ngay TRƯỚC vị trí MOTION_SUFFIX (mới), giống cách code làm trong
  // prompt-writer.ts::writeVeoPrompts.
  const markerIdx = p.videoPrompt.indexOf(NEW_MOTION_SUFFIX);
  if (markerIdx === -1) {
    console.warn(`[!] Cảnh #${p.index}: không tìm thấy vị trí MOTION_SUFFIX để chèn, bỏ qua.`);
    continue;
  }
  p.videoPrompt =
    p.videoPrompt.slice(0, markerIdx) + STYLE_ANCHOR_SENTENCE + " " + p.videoPrompt.slice(markerIdx);
  anchorTagged++;
}

fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2) + "\n");

console.log(`Đã thay MOTION_SUFFIX (chặn glow) cho ${suffixReplaced} cảnh.`);
console.log(`Đã gắn Style Anchor cho ${anchorTagged} cảnh mồ côi (mới).`);
console.log(`${alreadyAnchored} cảnh đã gắn Style Anchor từ trước (không đổi).`);
