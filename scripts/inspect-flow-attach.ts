/**
 * Khảo sát (chỉ đọc) — trả lời chính xác: ĐÍNH ẢNH REFERENCE vào prompt ở chế độ Image
 * của Flow bằng cách nào. Kiểm tra nút "+" (add_2) ngay trong thanh prompt.
 *
 * KHÔNG bấm Create, KHÔNG tạo media, KHÔNG tốn credit.
 *   npx tsx scripts/inspect-flow-attach.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import path from "node:path";

const REFERENCE_IMAGE = path.resolve("src/nanoBanana/reference-character.jpeg");

async function dismissDialog(page: import("playwright").Page) {
  const dialog = page.locator('[role="dialog"][data-state="open"]');
  if (!(await dialog.count())) return;
  await page
    .getByRole("button", { name: /get started/i })
    .first()
    .click({ timeout: 4000 })
    .catch(() => {});
  await page.waitForTimeout(800);
}

async function listVisible(page: import("playwright").Page, role: "button" | "menuitem" | "tab") {
  const items = page.getByRole(role);
  const out: string[] = [];
  for (let i = 0; i < (await items.count()); i++) {
    const el = items.nth(i);
    if (!(await el.isVisible().catch(() => false))) continue;
    const n = (await el.getAttribute("aria-label")) || (await el.innerText().catch(() => ""));
    if (n?.trim()) out.push(n.replace(/\s+/g, " ").trim());
  }
  return out;
}

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  await page.goto("https://labs.google/fx/tools/flow", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(4000);
  await dismissDialog(page);

  if (!/\/project\//.test(page.url())) {
    await page.locator('button:has-text("New project")').first().click({ timeout: 15000 });
    await page.waitForURL((u) => /\/project\//.test(u.pathname), { timeout: 45000 });
  }
  await dismissDialog(page);
  await page.waitForTimeout(2500);
  console.log(`Project: ${page.url()}`);

  // 1) Chuyển sang chế độ Image (pill cài đặt → tab Image → Escape).
  await page.locator('button:has-text("crop_16_9")').first().click();
  await page.waitForTimeout(1200);
  await page.getByRole("tab", { name: /image/i }).first().click();
  await page.waitForTimeout(1200);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  console.log("Đã vào chế độ Image.");

  // 2) Bấm nút "+" trong thanh prompt (accessible name "add_2 Create").
  const plus = page.locator('button:has-text("add_2")').first();
  console.log(`Nút "+" tìm thấy: ${await plus.count()}`);
  if (await plus.count()) {
    await plus.click();
    await page.waitForTimeout(1500);
    console.log(`\n[menuitem sau khi bấm +]:\n  ${(await listVisible(page, "menuitem")).join("\n  ")}`);
    console.log(`\n[button sau khi bấm +]:\n  ${(await listVisible(page, "button")).join("\n  ")}`);
    await page.screenshot({ path: "scripts/flow-plus-menu.png" });
  }

  // 3) Thử nạp thật ảnh reference vào input[type=file] và xem prompt bar đổi thế nào.
  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    console.log(`\nĐang nạp ảnh reference: ${REFERENCE_IMAGE}`);
    await fileInput.setInputFiles(REFERENCE_IMAGE).catch((e) => console.log(`  !! lỗi: ${e.message}`));
    await page.waitForTimeout(6000);
    await page.screenshot({ path: "scripts/flow-after-upload.png" });
    console.log(`\n[button sau khi nạp ảnh]:\n  ${(await listVisible(page, "button")).join("\n  ")}`);
    const imgs = page.locator('img[src^="blob:"], img[src^="data:"]');
    console.log(`\nSố ảnh preview (blob/data) trên trang: ${await imgs.count()}`);
  }

  console.log("\nĐã lưu ảnh chụp màn hình vào scripts/.");
  await page.waitForTimeout(3000);
  await context.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
