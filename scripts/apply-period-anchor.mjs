// Script một lần: chèn PERIOD_ANCHOR vào state/prompts.json đã viết sẵn (168 cảnh), vì các
// cảnh đó được viết TRƯỚC KHI phát hiện lỗi Veo3 vẽ nhân vật/cảnh quần chúng theo nghĩa hiện
// đại. Không cần npm install — chỉ dùng Node core.
//
// Chạy: node scripts/apply-period-anchor.mjs

import fs from "node:fs";

const PROMPTS_PATH = "./state/prompts.json";

// Phải khớp CHÍNH XÁC với styleDNA.ts
const PERIOD_ANCHOR =
  "15th-century Age of Discovery (Spain/Portugal, late 1400s) setting — period-accurate " +
  "wool, linen, and leather clothing, wooden sailing ships with canvas sails and rope " +
  "rigging, cobblestone streets and stone architecture. NO modern clothing, NO modern " +
  "ports/harbors/cranes/shipping containers, NO modern equipment of any kind.";

const MOTION_MARKER = "Maintain the exact 2D flat vector illustration style";

// Cảnh cố ý đặt trong hiện tại (vệ tinh NASA, biển đường phố, tượng đài...) — KHÔNG chèn anchor.
const MODERN_INDICES = new Set([145, 147, 148, 149, 150, 151, 152, 160]);

const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf-8"));

let patched = 0;
let skippedModern = 0;
let alreadyHadAnchor = 0;

for (const p of prompts) {
  if (MODERN_INDICES.has(p.index)) {
    p.era = "modern";
    skippedModern++;
    continue;
  }

  p.era = "period";

  if (p.videoPrompt.includes(PERIOD_ANCHOR)) {
    alreadyHadAnchor++;
    continue;
  }

  const markerIdx = p.videoPrompt.indexOf(MOTION_MARKER);
  if (markerIdx === -1) {
    console.warn(`[!] Cảnh #${p.index}: không tìm thấy motion marker, bỏ qua.`);
    continue;
  }

  p.videoPrompt =
    p.videoPrompt.slice(0, markerIdx) + PERIOD_ANCHOR + " " + p.videoPrompt.slice(markerIdx);
  patched++;
}

fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2) + "\n");

console.log(`Đã chèn PERIOD_ANCHOR cho ${patched} cảnh.`);
console.log(`Bỏ qua ${skippedModern} cảnh hiện đại (era=modern).`);
console.log(`${alreadyHadAnchor} cảnh đã có anchor sẵn (không đổi).`);
