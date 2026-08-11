/**
 * Tải ẢNH GỐC của 1 asset theo TÊN về đĩa để soi bằng mắt. Chỉ đọc, không tốn credit.
 *
 * Khác `grab-latest.ts` (chụp màn hình cả lưới media, ảnh nhỏ và lẫn nhiều thứ) — script này
 * tra đúng asset trong bảng chọn media rồi lấy thẳng URL ảnh, nên xem được chi tiết thật.
 *
 *   npx tsx scripts/grab-asset.ts "Bob Bathroom V3" [đường-dẫn-lưu.png]
 */
import fs from "node:fs/promises";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

const name = process.argv[2];
const out = process.argv[3] ?? `scripts/grab-${(name ?? "asset").replace(/[^\w.-]+/g, "-")}.png`;
if (!name) {
  console.error('Thiếu tên. Ví dụ: npx tsx scripts/grab-asset.ts "Bob Bathroom V3"');
  process.exit(1);
}

const context = await launchVeo3Browser();
const page = context.pages()[0] ?? (await context.newPage());
await ensureProject(page);
await page.waitForTimeout(4000);

await page.locator('button:has-text("add_2")').first().click({ timeout: 20000 });
await page.waitForTimeout(1500);
const search = page.getByRole("textbox", { name: /search assets/i }).first();
if (await search.count()) await search.fill(name);

// Khớp TÊN CHÍNH XÁC (không dùng hasText — xem RUNBOOK 8.1.3l).
const cards = page.locator('div[role="option"]');
let src: string | null = null;
for (let i = 0; i < 12 && !src; i++) {
  await page.waitForTimeout(800);
  const n = await cards.count();
  for (let k = 0; k < n; k++) {
    const raw = (await cards.nth(k).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    const label = raw.replace(/\s+(Image|Video|Voice|Character|Avatar)$/i, "").trim();
    if (label.toLowerCase() === name.trim().toLowerCase()) {
      src = await cards.nth(k).locator("img").first().getAttribute("src");
      break;
    }
  }
}

if (!src) {
  console.error(`Không tìm thấy asset tên chính xác "${name}".`);
  await context.close();
  process.exit(1);
}

console.log(`src thô: ${src.slice(0, 120)}${src.length > 120 ? "…" : ""}`);

if (src.startsWith("data:")) {
  // Ảnh nhúng thẳng base64 — ghi ra luôn, không cần gọi mạng.
  const b64 = src.slice(src.indexOf(",") + 1);
  await fs.writeFile(out, Buffer.from(b64, "base64"));
} else {
  // Ảnh trong lưới là bản thu nhỏ — nâng tham số resize để lấy bản lớn hơn.
  let full = src.replace(/=w\d+(-h\d+)?(-[a-z]+)*$/i, "=w1600");
  if (full.startsWith("//")) full = `https:${full}`;
  else if (full.startsWith("/")) full = new URL(full, page.url()).toString();
  const res = await page.request.get(full);
  await fs.writeFile(out, await res.body());
}
console.log(`Đã lưu: ${out} (${Math.round((await fs.stat(out)).size / 1024)}KB)`);
await context.close();
