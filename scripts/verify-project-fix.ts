/**
 * Xác minh bản sửa modal onboarding (RUNBOOK 8.1): gọi ensureProject() THẬT — chính hàm
 * trước đây timeout 30s vì bị dialog chặn click "New project".
 *
 * Chỉ điều hướng + đọc, KHÔNG tạo media, KHÔNG tốn credit.
 *   npx tsx scripts/verify-project-fix.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  const t0 = Date.now();
  const projectUrl = await ensureProject(page);
  console.log(`✅ ensureProject() OK sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`   project: ${projectUrl}`);

  // Chứng minh trang thật sự click được (thứ mà dialog từng chặn).
  const addMedia = page.locator('button:has-text("Add Media")').first();
  await addMedia.click({ timeout: 15000 });
  console.log('✅ Click được nút "Add Media" — không còn bị dialog chặn.');
  await page.keyboard.press("Escape");

  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
