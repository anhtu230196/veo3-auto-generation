import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { splitIntoScenes } from "./splitter/scenes.js";
import { warnInconsistentSettingLighting, type VeoPrompt } from "./splitter/prompt-writer.js";
import type { CharacterProfile } from "./characters/extract.js";
import type { SettingProfile } from "./settings/extract.js";
import type { PropProfile } from "./props/extract.js";
import { ensureCharactersInFlow } from "./veo3bot/characters.js";
import { ensureSettingsInFlow } from "./veo3bot/settings.js";
import { ensurePropsInFlow } from "./veo3bot/props.js";
import { ensureProject } from "./veo3bot/project.js";
import { launchVeo3Browser } from "./veo3bot/browser.js";
import { generateClips } from "./veo3bot/generate.js";
import { assembleFinalVideo, type ScenePair } from "./assembler/ffmpeg.js";

const CHARACTERS_STATE_FILE = path.join(config.stateDir, "characters.json");
const SETTINGS_STATE_FILE = path.join(config.stateDir, "settings.json");
const PROPS_STATE_FILE = path.join(config.stateDir, "props.json");
const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const CHROME_PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * `state/characters|settings|props|prompts.json` đều do Claude viết tay trực tiếp trong hội
 * thoại (xem RUNBOOK.md mục 0/1/4.20, và các *_EXTRACTION_GUIDE/buildPromptWritingGuide làm
 * spec tham khảo) — pipeline KHÔNG còn tự trích xuất/sinh nội dung qua Gemini nữa (đã bỏ cùng
 * ElevenLabs). Các hàm load* dưới đây chỉ ĐỌC cache, báo lỗi rõ nếu thiếu.
 */
async function loadCharacters(): Promise<CharacterProfile[]> {
  const cached = await fs.readFile(CHARACTERS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    throw new Error(
      `Thiếu state/characters.json. Nhờ Claude viết file này (danh sách nhân vật + mô tả ngoại hình cố định) dựa trên kịch bản trước khi chạy pipeline.`
    );
  }
  console.log("[orchestrator] dùng danh sách nhân vật đã viết sẵn (state/characters.json)");
  return JSON.parse(cached) as CharacterProfile[];
}

/**
 * Bối cảnh cố định (Setting asset) — KHÔNG BẮT BUỘC như characters, để state/settings.json
 * trống hoặc không tồn tại vẫn chạy bình thường (không có bối cảnh nào cần giữ nhất quán).
 */
async function loadSettings(): Promise<SettingProfile[]> {
  const cached = await fs.readFile(SETTINGS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    console.log(
      "[orchestrator] chưa có state/settings.json — bỏ qua Setting asset (nhờ Claude viết file này nếu muốn giữ nhất quán 1 địa điểm qua nhiều cảnh)."
    );
    return [];
  }
  console.log("[orchestrator] dùng danh sách bối cảnh đã viết sẵn (state/settings.json)");
  return JSON.parse(cached) as SettingProfile[];
}

/**
 * Đạo cụ/vật dụng cố định (Prop asset) — KHÔNG BẮT BUỘC như characters, để state/props.json
 * trống hoặc không tồn tại vẫn chạy bình thường (không có đạo cụ nào cần giữ nhất quán).
 */
async function loadProps(): Promise<PropProfile[]> {
  const cached = await fs.readFile(PROPS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    console.log(
      "[orchestrator] chưa có state/props.json — bỏ qua Prop asset (nhờ Claude viết file này nếu muốn giữ nhất quán 1 đạo cụ qua nhiều cảnh)."
    );
    return [];
  }
  console.log("[orchestrator] dùng danh sách đạo cụ đã viết sẵn (state/props.json)");
  return JSON.parse(cached) as PropProfile[];
}

/**
 * XÁC NHẬN TRỰC TIẾP (2026-07-19) — `state/prompts.json` bị phát hiện RỖNG HOÀN TOÀN (0 byte),
 * mất sạch dữ liệu 168 cảnh. Nghi ngờ trực tiếp: `fs.writeFile` KHÔNG atomic — nó truncate file
 * về 0 byte TRƯỚC khi ghi nội dung mới; nếu process bị crash/kill đúng lúc giữa 2 bước đó (rất
 * có thể do process cũ còn chạy từ trước khi các fix trong phiên này được áp dụng, xem RUNBOOK
 * mục 4.23), file bị bỏ lại ở trạng thái 0 byte vĩnh viễn — không có git backup nào cho
 * `state/` (đã .gitignore) để khôi phục. Sửa bằng ghi ATOMIC: ghi ra file TẠM trước, rồi
 * `rename` đè lên file đích — `rename` trên cùng ổ đĩa là 1 thao tác nguyên tử ở tầng hệ điều
 * hành (không có trạng thái "nửa vời" giữa chừng), nên dù crash bất cứ lúc nào, file đích hoặc
 * giữ nguyên nội dung CŨ hoàn toàn, hoặc có nội dung MỚI hoàn toàn — không bao giờ rỗng/hỏng.
 */
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
 * Lưu lại state/characters|settings|props.json ngay sau MỖI lần status thay đổi (xem
 * ensureCharactersInFlow/ensureSettingsInFlow/ensurePropsInFlow trong veo3bot/) — không mất
 * tiến độ nếu pipeline crash giữa chừng lúc đang tạo asset thứ N/M.
 */
async function saveCharactersProgress(characters: CharacterProfile[]): Promise<void> {
  await atomicWriteJson(CHARACTERS_STATE_FILE, characters);
}
async function saveSettingsProgress(settings: SettingProfile[]): Promise<void> {
  await atomicWriteJson(SETTINGS_STATE_FILE, settings);
}
async function savePropsProgress(props: PropProfile[]): Promise<void> {
  await atomicWriteJson(PROPS_STATE_FILE, props);
}

/**
 * Đọc `state/prompts.json` (viết tay bởi Claude, xem RUNBOOK.md mục 0) — báo lỗi rõ nếu
 * chưa đủ số cảnh so với `input/story.txt` thay vì tự sinh tiếp bằng LLM. Chạy
 * `warnInconsistentSettingLighting` ngay sau khi load để bắt sớm lỗi ánh sáng ngày/đêm
 * (RUNBOOK mục 4.19) trước khi tốn credit generate video.
 */
async function loadPrompts(storyText: string): Promise<VeoPrompt[]> {
  let scenes = splitIntoScenes(storyText);
  console.log(`[orchestrator] đã chia truyện thành ${scenes.length} cảnh`);
  if (config.testSceneLimit) {
    scenes = scenes.slice(0, config.testSceneLimit);
    console.log(`[orchestrator] TEST MODE: chỉ xử lý ${scenes.length} cảnh đầu tiên`);
  }

  const cached = await fs.readFile(PROMPTS_STATE_FILE, "utf-8").catch(() => null);
  const prompts: VeoPrompt[] = cached ? JSON.parse(cached) : [];

  if (prompts.length < scenes.length) {
    throw new Error(
      `state/prompts.json chỉ có ${prompts.length}/${scenes.length} cảnh. Nhờ Claude viết đủ prompt cho toàn bộ ${scenes.length} cảnh vào state/prompts.json trước khi chạy pipeline.`
    );
  }

  console.log("[orchestrator] dùng prompt đã viết sẵn (state/prompts.json)");
  warnInconsistentSettingLighting(prompts);
  return prompts;
}

async function main() {
  const storyText = await fs.readFile(config.storyInputPath, "utf-8");
  await fs.mkdir(config.outputDir, { recursive: true });

  // 1. Đọc nhân vật chính + bối cảnh cố định + đạo cụ (đã viết tay sẵn trong state/*.json)
  const characters = await loadCharacters();
  const settings = await loadSettings();
  const props = await loadProps();

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

  // 3. Đọc prompt Veo3 (mỗi cảnh gắn tên nhân vật/bối cảnh/đạo cụ xuất hiện)
  const prompts = await loadPrompts(storyText);

  // 4. Generate video từng cảnh qua Veo3, đính kèm đúng Character/Setting/Prop asset theo cảnh.
  // Cảnh bị Flow từ chối tạo (chính sách nội dung) sẽ bị bỏ qua khỏi kết quả.
  const clipDir = path.join(config.outputDir, "clips");
  const clipResults = await generateClips(prompts, characters, settings, props, clipDir, savePromptsProgress);

  // Dùng index THẬT của từng cảnh (không phải vị trí mảng) khi ghép — tránh lệch khi
  // mảng bị "nén" do có cảnh bị bỏ qua (xem chi tiết trong assembler/ffmpeg.ts). Không có
  // audio (TTS/ElevenLabs đã bỏ, xem RUNBOOK mục 4.20) — audioFile luôn undefined, assembler
  // dùng thẳng clip gốc.
  const scenePairs: ScenePair[] = clipResults.map((r) => ({
    index: r.index,
    clipFile: r.file,
    audioFile: undefined,
  }));

  // 5. Ghép clip thành video hoàn chỉnh
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
