// Chụp screenshot lưới media SAU KHI search đúng tên clip — dùng để soi bằng mắt (tỉ lệ nhân
// vật, style...) mà không cần ffmpeg trích khung hình từ file mp4.
// Chạy: npx tsx scripts/screenshot-clip.ts 75
import path from "node:path";
import fs from "node:fs/promises";
import { config } from "../src/config.js";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { waitForProjectReady } from "../src/veo3bot/project.js";

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

async function main() {
  const idx = Number(process.argv[2]);
  const projJson = await readJson<{ projectUrl: string } | null>(
    path.join(config.stateDir, "project.json"),
    null
  );
  if (!projJson) throw new Error("Không có project.json");

  const context = await launchVeo3Browser();
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(projJson.projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(page);

    const clipName = `clip_${String(idx).padStart(3, "0")}`;
    const searchBox = page.locator('[data-testid="search-input"]').first();
    await searchBox.fill(clipName);
    await page.waitForTimeout(1500);

    const card = page.getByRole("link", { name: "Video thumbnail" }).first();
    await card.waitFor({ state: "visible", timeout: 10000 });
    // Click play/hover để đảm bảo thumbnail hiện đúng khung hình (không phải placeholder đen)
    await card.hover();
    await page.waitForTimeout(500);

    const outPath = path.join(config.outputDir, "debug", `visual-check-${clipName}.png`);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Đã chụp: ${outPath}`);
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("lỗi:", err);
  process.exit(1);
});
