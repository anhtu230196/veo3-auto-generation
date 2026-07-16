import "dotenv/config";
import path from "node:path";

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export const config = {
  /** Không bắt buộc — nếu để trống, pipeline bỏ qua bước TTS, video ra không có giọng đọc. */
  elevenLabsApiKey: optional("ELEVENLABS_API_KEY"),
  elevenLabsVoiceId: optional("ELEVENLABS_VOICE_ID"),
  /**
   * Danh sách key Gemini, cách nhau bằng dấu phẩy — tự động chuyển key kế tiếp khi hết quota/ngày.
   * Không bắt buộc — nếu để trống, orchestrator CHỈ dùng characters/prompts đã có sẵn trong
   * state/*.json (do Claude viết thẳng thay vì gọi Gemini); sẽ báo lỗi rõ nếu thiếu cache mà
   * không có key.
   */
  geminiApiKeys: (optional("GEMINI_API_KEY") ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean),
  storyInputPath: path.resolve(process.env.STORY_INPUT_PATH ?? "./input/story.txt"),
  outputDir: path.resolve(process.env.OUTPUT_DIR ?? "./output"),
  stateDir: path.resolve(process.env.STATE_DIR ?? "./state"),
  authDir: path.resolve("./.auth"),
  clipSeconds: Number(process.env.CLIP_SECONDS ?? 7),
  /** Nếu đặt, chỉ xử lý N cảnh đầu tiên — dùng để test pipeline trước khi chạy full truyện. */
  testSceneLimit: process.env.TEST_SCENE_LIMIT ? Number(process.env.TEST_SCENE_LIMIT) : undefined,
  /** Số tab Flow chạy song song khi generate video — mỗi tab dùng 1 project riêng biệt. */
  parallelWorkers: Number(process.env.PARALLEL_WORKERS ?? 1),
  get hasAudio(): boolean {
    return Boolean(this.elevenLabsApiKey && this.elevenLabsVoiceId);
  },
  get hasGemini(): boolean {
    return this.geminiApiKeys.length > 0;
  },
};
