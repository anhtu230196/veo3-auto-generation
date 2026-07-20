// Chẩn đoán: kiểm tra 1 tập clip đã được đổi tên "clip_NNN" trong Flow HAY CHƯA, bằng cách
// search tên trong ô tìm kiếm media (KHÔNG download/upscale — nhanh). Nếu search ra card video
// => đã đổi tên đúng; nếu 0 card => chưa đổi tên (rename báo thành công giả).
// Chạy: npx tsx scripts/check-clip-names.ts 59 60 61
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
  const indices = process.argv.slice(2).map(Number);
  if (indices.length === 0 || indices.some((n) => Number.isNaN(n))) {
    console.error("Dùng: npx tsx scripts/check-clip-names.ts 59 60 61");
    process.exit(1);
  }

  const projJson = await readJson<{ projectUrl: string } | null>(
    path.join(config.stateDir, "project.json"),
    null
  );
  const projList = await readJson<string[]>(path.join(config.stateDir, "projects.json"), []);
  const projectUrls = projList.length > 0 ? projList : projJson ? [projJson.projectUrl] : [];
  if (projectUrls.length === 0) throw new Error("Không có project Flow nào trong state.");

  const context = await launchVeo3Browser();
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    for (const projectUrl of projectUrls) {
      console.log(`\n=== Project: ${projectUrl} ===`);
      await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await waitForProjectReady(page);

      const searchBox = page.locator('[data-testid="search-input"]').first();
      for (const i of indices) {
        const clipName = `clip_${String(i).padStart(3, "0")}`;
        let count = 0;
        if (await searchBox.count()) {
          await searchBox.fill(clipName);
          await page.waitForTimeout(1200);
          count = await page.getByRole("link", { name: "Video thumbnail" }).count();
          await searchBox.fill("").catch(() => {});
          await page.waitForTimeout(300);
        }
        console.log(`  ${clipName}: ${count > 0 ? "✅ TÌM THẤY (đã đổi tên)" : "❌ KHÔNG thấy (chưa đổi tên đúng)"} — ${count} card`);
      }
    }
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("[check-clip-names] lỗi:", err);
  process.exit(1);
});
