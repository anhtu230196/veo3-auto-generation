// Script khôi phục state/prompts.json sau sự cố mất dữ liệu (2026-07-19, xem RUNBOOK mục 4.23).
// KHÔNG dùng npm install — chỉ Node core. Chạy: node scripts/rebuild-prompts.mjs
//
// Đọc state/scenes.json (còn nguyên) làm nền, ghép với nội dung Claude viết tay ở BATCHES bên
// dưới (mỗi lô 1 file batch riêng import vào đây), áp suffix (PERIOD_ANCHOR/STYLE_ANCHOR_MENTION_
// SENTENCE/MOTION_SUFFIX) giống hệt logic cũ của prompt-writer.ts::writeVeoPrompts (đã bỏ), rồi
// ghi ATOMIC ra state/prompts.json (ghi file tạm rồi rename — không tái diễn bug file 0 byte).
//
// Cảnh 0-4 đã có clip thật trong output/clips/ — đánh dấu status "success" (không có prompt text
// gốc chính xác, nhưng file clip đã tồn tại nên không cần generate lại; nếu muốn xác nhận khớp
// nội dung, soi lại clip bằng mắt riêng).

import fs from "node:fs";
import path from "node:path";

const STYLE_NAME = "2D flat vector illustration";
const ERA_DESCRIPTOR = "15th-century Age of Discovery (Spain/Portugal, late 1400s)";
const STYLE_ANCHOR_NAME = "Style Anchor";

const OUTLINE_BLOCK =
  "Every character, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery shape (rocks, trees, clouds, waves) must have a clean, bold, uniform-width black " +
  "outline drawn around its entire silhouette — apply the SAME bold outline treatment to " +
  "foreground characters AND background objects/scenery alike, with no exceptions. No " +
  "outline-less soft-edge shapes, no faint/thin/broken outlines, no gaps in the outline where " +
  "two shapes overlap or meet.";

const MOTION_SUFFIX =
  `Maintain the exact ${STYLE_NAME} style and color palette from the reference. Simple ` +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no light " +
  "flares, no particle effects, no shine bursts or radiance around objects — flat matte " +
  `surfaces only, even on metal, gold, or gemstones. ${OUTLINE_BLOCK}`;

const PERIOD_ANCHOR =
  `${ERA_DESCRIPTOR} setting — period-accurate wool, linen, and leather clothing, wooden ` +
  "sailing ships with canvas sails and rope rigging, cobblestone streets and stone " +
  "architecture. NO modern clothing, NO modern ports/harbors/cranes/shipping containers, " +
  "NO modern equipment of any kind.";

const STYLE_ANCHOR_MENTION_SENTENCE = `Maintain the exact same illustration style as @${STYLE_ANCHOR_NAME}.`;

const stateDir = path.resolve("./state");
const scenesPath = path.join(stateDir, "scenes.json");
const promptsPath = path.join(stateDir, "prompts.json");

const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf-8"));
const sceneByIndex = new Map(scenes.map((s) => [s.index, s.text]));

// Cảnh 0-4 đã có clip thật (output/clips/clip_000-004.mp4) — không có prompt gốc chính xác
// (đã mất), nhưng KHÔNG cần generate lại vì file đã tồn tại. Đánh dấu success để pipeline bỏ
// qua, không tốn credit tạo lại clip đã có.
const ALREADY_DONE_INDICES = new Set([0, 1, 2, 3, 4]);

function buildEntry(raw) {
  const { index, core, characterNames = [], settingNames = [], propNames = [], era = "period" } = raw;
  const sceneText = sceneByIndex.get(index);
  if (sceneText === undefined) throw new Error(`Không tìm thấy cảnh #${index} trong state/scenes.json`);

  const anchoredPrompt = era === "modern" ? core : `${core} ${PERIOD_ANCHOR}`;
  const styleAnchorSentence = settingNames.includes(STYLE_ANCHOR_NAME) ? ` ${STYLE_ANCHOR_MENTION_SENTENCE}` : "";
  const videoPrompt = `${anchoredPrompt}${styleAnchorSentence} ${MOTION_SUFFIX}`;

  return {
    index,
    sceneText,
    videoPrompt,
    characterNames,
    settingNames,
    propNames,
    era,
    status: ALREADY_DONE_INDICES.has(index) ? "success" : "waiting",
  };
}

export function writeBatch(batchRaw) {
  const cached = fs.existsSync(promptsPath) ? fs.readFileSync(promptsPath, "utf-8") : "";
  const existing = cached.trim() ? JSON.parse(cached) : [];
  const byIndex = new Map(existing.map((p) => [p.index, p]));

  for (const raw of batchRaw) {
    const entry = buildEntry(raw);
    byIndex.set(entry.index, entry);
  }

  const merged = [...byIndex.values()].sort((a, b) => a.index - b.index);

  const tmpPath = `${promptsPath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(merged, null, 2));
  fs.renameSync(tmpPath, promptsPath);

  console.log(`Đã ghi ${merged.length}/${scenes.length} cảnh vào state/prompts.json (lô vừa thêm: ${batchRaw.length} cảnh).`);
}
