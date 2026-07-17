import "dotenv/config";
import path from "node:path";

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export const config = {
  storyInputPath: path.resolve(process.env.STORY_INPUT_PATH ?? "./input/story.txt"),
  outputDir: path.resolve(process.env.OUTPUT_DIR ?? "./output"),
  stateDir: path.resolve(process.env.STATE_DIR ?? "./state"),
  authDir: path.resolve("./.auth"),
  clipSeconds: Number(process.env.CLIP_SECONDS ?? 7),
  /** Nếu đặt, chỉ xử lý N cảnh đầu tiên — dùng để test pipeline trước khi chạy full truyện. */
  testSceneLimit: process.env.TEST_SCENE_LIMIT ? Number(process.env.TEST_SCENE_LIMIT) : undefined,
  /** Số tab Flow chạy song song khi generate video — mỗi tab dùng 1 project riêng biệt. */
  parallelWorkers: Number(process.env.PARALLEL_WORKERS ?? 1),
  /**
   * Bật qua `DEBUG=1` trong `.env` — khi bật: log chi tiết từng bước trung gian (baseline
   * count, số chip @mention đã chèn, trạng thái reload...) VÀ lưu screenshot + HTML dump vào
   * `output/debug/` mỗi khi generateOneClip/createImageIngredient gặp lỗi hoặc timeout. Mặc
   * định TẮT để không tốn dung lượng/thời gian khi chạy production 168 cảnh.
   */
  debug: optional("DEBUG") === "1",
};
