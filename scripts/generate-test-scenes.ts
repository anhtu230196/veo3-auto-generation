// Script test: generate CHỈ 1 tập con cảnh cụ thể (theo index), không chạy toàn bộ pipeline.
// Khác `TEST_SCENE_LIMIT` trong config.ts — biến đó CHỈ giới hạn khi *sinh mới* prompts.json,
// KHÔNG áp dụng khi generate clip một khi prompts.json đã có đủ (xem RUNBOOK mục 4.23, ghi chú
// khi thử "generate thử cảnh 5-9").
//
// Chạy: npx tsx scripts/generate-test-scenes.ts 5 6 7 8 9
// Yêu cầu: đã `npm run login:veo3` trước, và state/characters|settings|props.json đã có asset
// (status "success") — script này KHÔNG tự tạo Character/Setting/Prop asset, chỉ generate clip.

import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../src/config.js";
import type { VeoPrompt } from "../src/splitter/prompt-writer.js";
import type { CharacterProfile } from "../src/characters/extract.js";
import type { SettingProfile } from "../src/settings/extract.js";
import type { PropProfile } from "../src/props/extract.js";
import { generateClips } from "../src/veo3bot/generate.js";

const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const CHARACTERS_STATE_FILE = path.join(config.stateDir, "characters.json");
const SETTINGS_STATE_FILE = path.join(config.stateDir, "settings.json");
const PROPS_STATE_FILE = path.join(config.stateDir, "props.json");

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

// Ghi atomic — cùng lý do đã sửa trong orchestrator.ts (mục 4.23 RUNBOOK): fs.writeFile
// truncate trước khi ghi, crash giữa chừng để lại file 0 byte. Ghi file tạm rồi rename.
async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, filePath);
}

async function main() {
  const indices = process.argv.slice(2).map(Number);
  if (indices.length === 0 || indices.some((n) => Number.isNaN(n))) {
    console.error("Dùng: npx tsx scripts/generate-test-scenes.ts <index1> <index2> ...");
    console.error("Vd: npx tsx scripts/generate-test-scenes.ts 5 6 7 8 9");
    process.exit(1);
  }

  const allPrompts = await readJson<VeoPrompt[]>(PROMPTS_STATE_FILE, []);
  if (allPrompts.length === 0) throw new Error("state/prompts.json rỗng hoặc không tồn tại.");

  const testPrompts = indices.map((i) => {
    const p = allPrompts.find((x) => x.index === i);
    if (!p) throw new Error(`Không tìm thấy cảnh #${i} trong state/prompts.json.`);
    return p;
  });

  const characters = await readJson<CharacterProfile[]>(CHARACTERS_STATE_FILE, []);
  const settings = await readJson<SettingProfile[]>(SETTINGS_STATE_FILE, []);
  const props = await readJson<PropProfile[]>(PROPS_STATE_FILE, []);

  const clipDir = path.join(config.outputDir, "clips");

  // onProgress chỉ nhận testPrompts (tập con) — merge ngược vào TOÀN BỘ allPrompts trước khi
  // ghi, để không làm mất/ghi đè status của 163 cảnh KHÔNG nằm trong lần test này.
  async function saveProgress(updatedSubset: VeoPrompt[]): Promise<void> {
    const byIndex = new Map(allPrompts.map((p) => [p.index, p]));
    for (const p of updatedSubset) byIndex.set(p.index, p);
    const merged = [...byIndex.values()].sort((a, b) => a.index - b.index);
    await atomicWriteJson(PROMPTS_STATE_FILE, merged);
  }

  console.log(`[test] generate thử ${testPrompts.length} cảnh: #${indices.join(", #")}`);
  const results = await generateClips(testPrompts, characters, settings, props, clipDir, saveProgress);

  console.log(`\n[test] Đã tạo ${results.length}/${testPrompts.length} cảnh test.`);
  if (results.length < testPrompts.length) {
    const missing = indices.filter((i) => !results.some((r) => r.index === i));
    console.log(`[test] Cảnh chưa tạo được (bị Flow từ chối hoặc lỗi): #${missing.join(", #")}`);
  }
  console.log(`[test] Xem file: ${results.map((r) => r.file).join(", ")}`);
}

main().catch((err) => {
  console.error("[test] lỗi:", err);
  process.exit(1);
});
