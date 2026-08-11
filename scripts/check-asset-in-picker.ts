/**
 * CHẨN ĐOÁN CHỈ-ĐỌC: mở bảng chọn media của Flow, gõ 1 chuỗi vào ô "Search assets", rồi
 * in ra TÊN THẬT của mọi card hiện lên. Không bấm Generate, không đổi tên — không tốn credit.
 *
 * VÌ SAO CẦN: `attachExistingAssets` báo `Không tìm thấy asset tên "X"` chỉ nói được là
 * không khớp, KHÔNG nói được asset đang mang tên gì thật sự (đã tạo nhưng rename hỏng? tên
 * bị cắt bớt? search trả về chậm?). Script này trả lời đúng câu đó.
 *
 *   npx tsx scripts/check-asset-in-picker.ts "Don Decker"
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

const query = process.argv[2] ?? "";

const context = await launchVeo3Browser();
const page = context.pages()[0] ?? (await context.newPage());
await ensureProject(page);
await page.waitForTimeout(4000);

await page.locator('button:has-text("add_2")').first().click({ timeout: 20000 });
await page.waitForTimeout(1500);

const search = page.getByRole("textbox", { name: /search assets/i }).first();
if (await search.count()) {
  await search.fill(query);
  console.log(`Đã gõ "${query}" vào ô Search assets`);
} else {
  console.log("⚠️  KHÔNG thấy ô Search assets — bảng chọn media có thể chưa mở đúng");
}

// Chờ lâu hơn hẳn 1500ms của attachExistingAssets, để biết có phải chỉ là chậm hay không.
for (const wait of [1500, 3000, 5000]) {
  await page.waitForTimeout(wait === 1500 ? 1500 : 1500);
  const cards = page.locator('div[role="option"]');
  const n = await cards.count();
  console.log(`\n--- sau ~${wait}ms: ${n} card ---`);
  for (let i = 0; i < Math.min(n, 25); i++) {
    const raw = (await cards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    console.log(`  [${i}] ${raw.slice(0, 90)}`);
  }
}

await page.screenshot({ path: "scripts/picker-diagnose.png", fullPage: false });
console.log("\nẢnh màn hình: scripts/picker-diagnose.png");
await context.close();
