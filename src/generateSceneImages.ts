import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import type { VeoPrompt } from "./splitter/prompt-writer.js";
import { ensureSceneImagesInFlow } from "./veo3bot/sceneImages.js";
import { ensureProject } from "./veo3bot/project.js";
import { launchVeo3Browser } from "./veo3bot/browser.js";

const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const CHROME_PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * Lệnh RIÊNG (`npm run generate-images`) chỉ sinh 4 ảnh candidate cho MỌI cảnh có
 * `needsAngleLock: true` trong `state/prompts.json` — KHÔNG generate video. Chạy TRƯỚC
 * `npm run generate` cho các cảnh này: sau khi chạy xong, tự mở project Flow, soi 4 ảnh
 * `{index}_1`..`_4` của từng cảnh, rồi tự tay điền `chosenImageIndex` vào `state/prompts.json`
 * (giống cách viết tay `videoPrompt`/`characterNames` từ trước tới nay — không có UI review
 * riêng). `npm run generate` sau đó tự "Animate" đúng ảnh đã chọn cho các cảnh này (xem
 * `veo3bot/animateImage.ts`), cảnh không đánh dấu vẫn generate text-to-video như cũ.
 */
async function loadPrompts(): Promise<VeoPrompt[]> {
  const cached = await fs.readFile(PROMPTS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    throw new Error(`Thiếu state/prompts.json. Chạy lệnh này SAU khi đã viết đủ prompt cho toàn bộ cảnh.`);
  }
  return JSON.parse(cached) as VeoPrompt[];
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

async function main() {
  const prompts = await loadPrompts();
  const flagged = prompts.filter((p) => p.needsAngleLock);
  if (flagged.length === 0) {
    console.log("[generate-images] không có cảnh nào needsAngleLock trong state/prompts.json — không có gì để làm.");
    return;
  }

  const profileExists = await fs.access(CHROME_PROFILE_DIR).then(() => true).catch(() => false);
  if (!profileExists) {
    throw new Error(`Chưa có session Veo3. Chạy "npm run login:veo3" trước.`);
  }

  const context = await launchVeo3Browser();
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    const projectUrl = await ensureProject(page);
    await ensureSceneImagesInFlow(page, prompts, projectUrl, savePromptsProgress);
  } finally {
    await context.close().catch(() => {});
  }

  const failed = flagged.filter((p) => p.imageStatus === "failed");
  if (failed.length > 0) {
    console.error(
      `\n⚠️ ${failed.length} cảnh lỗi sinh ảnh: ${failed.map((p) => `#${p.index}`).join(", ")}.` +
        `\nChạy lại "npm run generate-images" để thử lại (đã lưu imageStatus "failed", chỉ cảnh này sẽ thử lại).`
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Đã sinh đủ 4 ảnh candidate cho ${flagged.length} cảnh needsAngleLock.` +
      `\nMở project Flow, soi ảnh "{index}_1".."{index}_4" của từng cảnh, rồi tự điền chosenImageIndex ` +
      `vào state/prompts.json trước khi chạy "npm run generate".`
  );
}

main().catch((err) => {
  console.error("[generate-images] lỗi:", err);
  process.exit(1);
});
