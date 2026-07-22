// Tải NHANH 1 vài clip cụ thể để soi bằng mắt (không chạy toàn bộ npm run download qua 80+ cảnh
// đang chờ). KHÔNG cập nhật state/prompts.json isDownloaded (chỉ để xem, không phải luồng chính
// thức) — chạy lại "npm run download" bình thường sau để đồng bộ state.
// Chạy: npx tsx scripts/download-one.ts 67 78
import path from "node:path";
import fs from "node:fs/promises";
import { config } from "../src/config.js";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { waitForProjectReady } from "../src/veo3bot/project.js";
import { downloadClip } from "../src/veo3bot/download.js";

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

async function main() {
  const indices = process.argv.slice(2).map(Number);
  const projJson = await readJson<{ projectUrl: string } | null>(
    path.join(config.stateDir, "project.json"),
    null
  );
  if (!projJson) throw new Error("Không có project.json");

  const clipDir = path.join(config.outputDir, "clips");
  await fs.mkdir(clipDir, { recursive: true });

  const context = await launchVeo3Browser();
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(projJson.projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(page);

    for (const i of indices) {
      const clipName = `clip_${String(i).padStart(3, "0")}`;
      const outFile = path.join(clipDir, `${clipName}.mp4`);
      console.log(`Đang tải ${clipName}...`);
      const found = await downloadClip(page, clipName, outFile);
      console.log(found ? `  -> OK: ${outFile}` : `  -> KHÔNG tìm thấy`);
    }
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("lỗi:", err);
  process.exit(1);
});
