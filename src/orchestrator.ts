import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { splitIntoScenes } from "./splitter/scenes.js";
import { writeVeoPrompts, type VeoPrompt } from "./splitter/prompt-writer.js";
import { extractCharacters, type CharacterProfile } from "./characters/extract.js";
import { extractSettings, type SettingProfile } from "./settings/extract.js";
import { extractProps, type PropProfile } from "./props/extract.js";
import { ensureCharactersInFlow } from "./veo3bot/characters.js";
import { ensureSettingsInFlow } from "./veo3bot/settings.js";
import { ensurePropsInFlow } from "./veo3bot/props.js";
import { ensureProject } from "./veo3bot/project.js";
import { launchVeo3Browser } from "./veo3bot/browser.js";
import { synthesizeScenes } from "./tts/elevenlabs.js";
import { generateClips } from "./veo3bot/generate.js";
import { assembleFinalVideo, type ScenePair } from "./assembler/ffmpeg.js";

const CHARACTERS_STATE_FILE = path.join(config.stateDir, "characters.json");
const SETTINGS_STATE_FILE = path.join(config.stateDir, "settings.json");
const PROPS_STATE_FILE = path.join(config.stateDir, "props.json");
const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const CHROME_PROFILE_DIR = path.join(config.authDir, "chrome-profile");

async function loadOrExtractCharacters(storyText: string): Promise<CharacterProfile[]> {
  const cached = await fs.readFile(CHARACTERS_STATE_FILE, "utf-8").catch(() => null);
  if (cached) {
    console.log("[orchestrator] dùng danh sách nhân vật đã trích xuất trước đó (state/characters.json)");
    return JSON.parse(cached) as CharacterProfile[];
  }

  if (!config.hasGemini) {
    throw new Error(
      `Chưa có state/characters.json và chưa cấu hình GEMINI_API_KEY. Nhờ Claude viết file ` +
        `state/characters.json trước (dựa trên kịch bản), hoặc điền GEMINI_API_KEY vào .env để tự sinh.`
    );
  }

  const characters = await extractCharacters(storyText);
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(CHARACTERS_STATE_FILE, JSON.stringify(characters, null, 2));
  return characters;
}

/**
 * Bối cảnh cố định (Setting asset) — KHÔNG BẮT BUỘC như characters, để state/settings.json
 * trống hoặc không tồn tại vẫn chạy bình thường (không có bối cảnh nào cần giữ nhất quán).
 */
async function loadOrExtractSettings(storyText: string): Promise<SettingProfile[]> {
  const cached = await fs.readFile(SETTINGS_STATE_FILE, "utf-8").catch(() => null);
  if (cached) {
    console.log("[orchestrator] dùng danh sách bối cảnh đã trích xuất trước đó (state/settings.json)");
    return JSON.parse(cached) as SettingProfile[];
  }

  if (!config.hasGemini) {
    console.log(
      "[orchestrator] chưa có state/settings.json và chưa cấu hình GEMINI_API_KEY — bỏ qua Setting asset " +
        "(nhờ Claude viết state/settings.json nếu muốn giữ nhất quán 1 địa điểm qua nhiều cảnh)."
    );
    return [];
  }

  const settings = await extractSettings(storyText);
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(SETTINGS_STATE_FILE, JSON.stringify(settings, null, 2));
  return settings;
}

/**
 * Đạo cụ/vật dụng cố định (Prop asset) — KHÔNG BẮT BUỘC như characters, để state/props.json
 * trống hoặc không tồn tại vẫn chạy bình thường (không có đạo cụ nào cần giữ nhất quán).
 */
async function loadOrExtractProps(storyText: string): Promise<PropProfile[]> {
  const cached = await fs.readFile(PROPS_STATE_FILE, "utf-8").catch(() => null);
  if (cached) {
    console.log("[orchestrator] dùng danh sách đạo cụ đã trích xuất trước đó (state/props.json)");
    return JSON.parse(cached) as PropProfile[];
  }

  if (!config.hasGemini) {
    console.log(
      "[orchestrator] chưa có state/props.json và chưa cấu hình GEMINI_API_KEY — bỏ qua Prop asset " +
        "(nhờ Claude viết state/props.json nếu muốn giữ nhất quán 1 đạo cụ qua nhiều cảnh)."
    );
    return [];
  }

  const props = await extractProps(storyText);
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(PROPS_STATE_FILE, JSON.stringify(props, null, 2));
  return props;
}

async function savePromptsProgress(prompts: VeoPrompt[]): Promise<void> {
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(PROMPTS_STATE_FILE, JSON.stringify(prompts, null, 2));
}

/**
 * Lưu lại state/characters|settings|props.json ngay sau MỖI lần status thay đổi (xem
 * ensureCharactersInFlow/ensureSettingsInFlow/ensurePropsInFlow trong veo3bot/) — không mất
 * tiến độ nếu pipeline crash giữa chừng lúc đang tạo asset thứ N/M.
 */
async function saveCharactersProgress(characters: CharacterProfile[]): Promise<void> {
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(CHARACTERS_STATE_FILE, JSON.stringify(characters, null, 2));
}
async function saveSettingsProgress(settings: SettingProfile[]): Promise<void> {
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(SETTINGS_STATE_FILE, JSON.stringify(settings, null, 2));
}
async function savePropsProgress(props: PropProfile[]): Promise<void> {
  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(PROPS_STATE_FILE, JSON.stringify(props, null, 2));
}

/**
 * Sinh prompt theo lô (xem prompt-writer.ts), lưu tiến độ sau MỖI LÔ — nếu bị gián đoạn
 * giữa chừng (vd hết quota Gemini theo ngày), lần chạy lại chỉ cần xử lý tiếp các cảnh
 * còn thiếu thay vì làm lại từ đầu.
 */
async function loadOrWritePrompts(
  storyText: string,
  characters: CharacterProfile[],
  settings: SettingProfile[],
  props: PropProfile[]
): Promise<VeoPrompt[]> {
  let scenes = splitIntoScenes(storyText);
  console.log(`[orchestrator] đã chia truyện thành ${scenes.length} cảnh`);
  if (config.testSceneLimit) {
    scenes = scenes.slice(0, config.testSceneLimit);
    console.log(`[orchestrator] TEST MODE: chỉ xử lý ${scenes.length} cảnh đầu tiên`);
  }

  const cached = await fs.readFile(PROMPTS_STATE_FILE, "utf-8").catch(() => null);
  const existingPrompts: VeoPrompt[] = cached ? JSON.parse(cached) : [];

  if (existingPrompts.length >= scenes.length) {
    console.log("[orchestrator] dùng prompt đã sinh trước đó (state/prompts.json)");
    return existingPrompts;
  }

  if (existingPrompts.length > 0) {
    console.log(
      `[orchestrator] tiếp tục sinh prompt từ cảnh #${existingPrompts.length} (đã có ${existingPrompts.length}/${scenes.length})`
    );
  }

  if (!config.hasGemini) {
    throw new Error(
      `state/prompts.json chỉ có ${existingPrompts.length}/${scenes.length} cảnh và chưa cấu hình GEMINI_API_KEY. ` +
        `Nhờ Claude viết đủ prompt cho toàn bộ ${scenes.length} cảnh vào state/prompts.json, hoặc điền GEMINI_API_KEY vào .env để tự sinh.`
    );
  }

  const remainingScenes = scenes.slice(existingPrompts.length);
  const newPrompts = await writeVeoPrompts(remainingScenes, characters, settings, props, async (soFar) => {
    await savePromptsProgress([...existingPrompts, ...soFar]);
  });

  const allPrompts = [...existingPrompts, ...newPrompts];
  await savePromptsProgress(allPrompts);
  return allPrompts;
}

async function main() {
  const storyText = await fs.readFile(config.storyInputPath, "utf-8");
  await fs.mkdir(config.outputDir, { recursive: true });

  // 1. Trích xuất nhân vật chính + bối cảnh cố định + đạo cụ (cache lại để resume không gọi LLM lại)
  const characters = await loadOrExtractCharacters(storyText);
  const settings = await loadOrExtractSettings(storyText);
  const props = await loadOrExtractProps(storyText);

  // 2. Đảm bảo mỗi nhân vật/bối cảnh/đạo cụ có Character/Setting/Prop asset trong Flow (giữ nhất quán)
  const profileExists = await fs.access(CHROME_PROFILE_DIR).then(() => true).catch(() => false);
  if (!profileExists) {
    throw new Error(`Chưa có session Veo3. Chạy "npm run login:veo3" trước.`);
  }
  const charContext = await launchVeo3Browser();
  try {
    const charPage = charContext.pages()[0] ?? (await charContext.newPage());
    const projectUrl = await ensureProject(charPage);
    await ensureCharactersInFlow(charPage, characters, projectUrl, saveCharactersProgress);
    await ensureSettingsInFlow(charPage, settings, projectUrl, saveSettingsProgress);
    await ensurePropsInFlow(charPage, props, projectUrl, savePropsProgress);
  } finally {
    // Persistent context KHÔNG được để mở nếu bước trên lỗi — vẫn giữ khóa profile dir,
    // khiến lần chạy lại tiếp theo mở context thứ 2 trên CÙNG profile bị xung đột (2 cửa
    // sổ Chrome tranh nhau cùng 1 profile), gây lỗi UI khó hiểu ở lần chạy lại.
    await charContext.close().catch(() => {});
  }

  // 3. Chia cảnh + sinh prompt Veo3 (mỗi cảnh gắn tên nhân vật/bối cảnh/đạo cụ xuất hiện)
  const prompts = await loadOrWritePrompts(storyText, characters, settings, props);
  const scenes = prompts.map((p) => ({ index: p.index, text: p.sceneText }));

  // 4. TTS từng cảnh (bỏ qua file đã tồn tại — resume-safe). Bỏ hẳn bước này nếu chưa
  // cấu hình ElevenLabs — video ra sẽ không có giọng đọc, ghép thẳng clip Veo3.
  let audioFiles: (string | undefined)[] = [];
  if (config.hasAudio) {
    const audioDir = path.join(config.outputDir, "audio");
    audioFiles = await synthesizeScenes(scenes, audioDir);
  } else {
    console.log("[orchestrator] bỏ qua bước TTS (chưa cấu hình ELEVENLABS_API_KEY) — video sẽ không có giọng đọc.");
  }

  // 5. Generate video từng cảnh qua Veo3, đính kèm đúng Character/Setting/Prop asset theo cảnh.
  // Cảnh bị Flow từ chối tạo (chính sách nội dung) sẽ bị bỏ qua khỏi kết quả — lọc lại
  // audio tương ứng theo index để giữ đồng bộ khi ghép, thay vì để lệch cặp clip/audio.
  const clipDir = path.join(config.outputDir, "clips");
  const clipResults = await generateClips(prompts, characters, settings, props, clipDir, savePromptsProgress);

  // Dùng index THẬT của từng cảnh (không phải vị trí mảng) khi ghép — tránh lệch khi
  // mảng bị "nén" do có cảnh bị bỏ qua (xem chi tiết trong assembler/ffmpeg.ts).
  const scenePairs: ScenePair[] = clipResults.map((r) => ({
    index: r.index,
    clipFile: r.file,
    audioFile: audioFiles[r.index],
  }));

  // 6. Ghép clip + audio theo từng cảnh, rồi nối thành video hoàn chỉnh
  const finalVideo = await assembleFinalVideo(scenePairs, config.outputDir);

  // QUAN TRỌNG: không được coi là "hoàn tất" nếu còn thiếu cảnh — thiếu cảnh nghĩa là
  // mạch truyện bị mất nội dung thật (không chỉ là vấn đề kỹ thuật), phải chạy lại (có
  // thể cần viết lại prompt cho cảnh bị chặn) cho đến khi đủ 111/111, không được im
  // lặng hoàn thành với video ngắn hơn.
  if (clipResults.length < prompts.length) {
    const missingIndices = prompts.map((p) => p.index).filter((i) => !clipResults.some((r) => r.index === i));
    console.error(
      `\n❌ CHƯA HOÀN TẤT: thiếu ${prompts.length - clipResults.length}/${prompts.length} cảnh: [${missingIndices.join(", ")}].` +
        `\nVideo tạm thời: ${finalVideo} (KHÔNG đầy đủ). Cần viết lại prompt cho các cảnh trên rồi chạy lại "npm run run".`
    );
    process.exit(1);
  }

  console.log(`\n✅ Hoàn tất đầy đủ ${prompts.length}/${prompts.length} cảnh: ${finalVideo}`);
}

main().catch((err) => {
  console.error("[orchestrator] lỗi:", err);
  process.exit(1);
});
