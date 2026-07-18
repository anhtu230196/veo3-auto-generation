import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { splitIntoScenes } from "./splitter/scenes.js";
import { warnInconsistentSettingLighting, type VeoPrompt } from "./splitter/prompt-writer.js";
import type { CharacterProfile } from "./characters/extract.js";
import type { SettingProfile } from "./settings/extract.js";
import type { PropProfile } from "./props/extract.js";
import { generateClips } from "./veo3bot/generate.js";

const CHARACTERS_STATE_FILE = path.join(config.stateDir, "characters.json");
const SETTINGS_STATE_FILE = path.join(config.stateDir, "settings.json");
const PROPS_STATE_FILE = path.join(config.stateDir, "props.json");
const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const CHROME_PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * Lệnh RIÊNG chỉ generate video từng cảnh (tạo + đổi tên trong Flow) — KHÔNG tạo Character/
 * Setting/Prop Ingredient (chạy `npm run assets` trước), và KHÔNG tải video về/ghép video cuối
 * nữa (xem RUNBOOK mục 4.31 — 2 việc đó dồn vào lệnh riêng `npm run download`, chạy SAU khi
 * lệnh này xong). Tách khỏi `assets` để có thể chạy lại generate nhiều lần (vd retry cảnh bị
 * Flow chặn, viết lại prompt) mà không phải tra lại toàn bộ tài sản trong Flow mỗi lần —
 * `ensureCharactersInFlow`/`ensureSettingsInFlow`/`ensurePropsInFlow` chỉ chạy trong
 * `createAssets.ts`.
 */
async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

/** Ghi ATOMIC (file tạm rồi rename) — xem RUNBOOK mục 4.23 vì sao bắt buộc. */
async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, filePath);
}

async function savePromptsProgress(prompts: VeoPrompt[]): Promise<void> {
  await atomicWriteJson(PROMPTS_STATE_FILE, prompts);
}

/**
 * Đọc `state/prompts.json` (viết tay bởi Claude, xem RUNBOOK.md mục 0) — báo lỗi rõ nếu chưa
 * đủ số cảnh so với `input/story.txt`. Chạy `warnInconsistentSettingLighting` ngay sau khi load
 * để bắt sớm lỗi ánh sáng ngày/đêm (RUNBOOK mục 4.19) trước khi tốn credit generate video.
 */
async function loadPrompts(storyText: string): Promise<VeoPrompt[]> {
  let scenes = splitIntoScenes(storyText);
  console.log(`[generate] đã chia truyện thành ${scenes.length} cảnh`);
  if (config.testSceneLimit) {
    scenes = scenes.slice(0, config.testSceneLimit);
    console.log(`[generate] TEST MODE: chỉ xử lý ${scenes.length} cảnh đầu tiên`);
  }

  const prompts = await readJson<VeoPrompt[]>(PROMPTS_STATE_FILE, []);
  if (prompts.length < scenes.length) {
    throw new Error(
      `state/prompts.json chỉ có ${prompts.length}/${scenes.length} cảnh. Nhờ Claude viết đủ prompt cho toàn bộ ${scenes.length} cảnh vào state/prompts.json trước khi chạy lệnh này.`
    );
  }

  console.log("[generate] dùng prompt đã viết sẵn (state/prompts.json)");
  warnInconsistentSettingLighting(prompts);
  return prompts;
}

async function main() {
  const storyText = await fs.readFile(config.storyInputPath, "utf-8");
  await fs.mkdir(config.outputDir, { recursive: true });

  const profileExists = await fs.access(CHROME_PROFILE_DIR).then(() => true).catch(() => false);
  if (!profileExists) {
    throw new Error(`Chưa có session Veo3. Chạy "npm run login:veo3" trước.`);
  }

  const characters = await readJson<CharacterProfile[]>(CHARACTERS_STATE_FILE, []);
  const settings = await readJson<SettingProfile[]>(SETTINGS_STATE_FILE, []);
  const props = await readJson<PropProfile[]>(PROPS_STATE_FILE, []);
  if (characters.some((c) => c.status !== "success")) {
    console.warn(
      `[generate] ⚠️ có Character chưa "success" trong state/characters.json — chạy "npm run assets" trước nếu chưa tạo xong.`
    );
  }

  const prompts = await loadPrompts(storyText);

  // Generate video từng cảnh qua Veo3, đính kèm đúng Character/Setting/Prop asset theo cảnh, rồi
  // đổi tên trong Flow theo chỉ số cảnh (xem generate.ts::renameLatestVideo) — KHÔNG tải video
  // về/ghép video cuối ở đây nữa (xem RUNBOOK mục 4.31). Cảnh bị Flow từ chối tạo (chính sách nội
  // dung) sẽ bị bỏ qua khỏi kết quả.
  const clipDir = path.join(config.outputDir, "clips");
  const clipResults = await generateClips(prompts, characters, settings, props, clipDir, savePromptsProgress);

  if (clipResults.length < prompts.length) {
    const missingIndices = prompts.map((p) => p.index).filter((i) => !clipResults.some((r) => r.index === i));
    console.error(
      `\n❌ CHƯA HOÀN TẤT: thiếu ${prompts.length - clipResults.length}/${prompts.length} cảnh: [${missingIndices.join(", ")}].` +
        `\nCần viết lại prompt cho các cảnh trên rồi chạy lại "npm run generate".`
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Đã tạo + đổi tên xong ${prompts.length}/${prompts.length} cảnh trong Flow.` +
      `\nChạy "npm run download" để tải toàn bộ về (1080p) và ghép thành video cuối.`
  );
}

main().catch((err) => {
  console.error("[generate] lỗi:", err);
  process.exit(1);
});
