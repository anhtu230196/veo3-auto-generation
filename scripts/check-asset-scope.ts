/**
 * THÍ NGHIỆM CHỈ-ĐỌC: asset trong Flow là của RIÊNG từng project, hay dùng chung cả tài khoản?
 *
 * VÌ SAO CẦN: RUNBOOK 4.18 ghi đây là GIẢ ĐỊNH CHƯA KIỂM CHỨNG, và câu trả lời quyết định
 * việc "mỗi case một project" đáng giá tới đâu:
 * - Nếu asset THEO PROJECT: tách project = mỗi case chỉ thấy asset của mình → ô search sạch,
 *   hết hẳn lớp lỗi trùng tên/khớp nhầm đã tốn cả phiên để sửa. Nhưng KHÔNG dùng lại được
 *   asset giữa các case.
 * - Nếu asset DÙNG CHUNG tài khoản: tách project chỉ gọn canvas, còn ô search vẫn đầy ắp
 *   asset của mọi case → phải tiếp tục dựa vào khớp tên chính xác.
 *
 * Cách làm: mở 1 project TRỐNG mới, gõ tên 1 asset đã tạo ở project cũ vào ô "Search assets".
 * Thấy = dùng chung tài khoản. Không thấy = theo project.
 *
 *   npx tsx scripts/check-asset-scope.ts "A Fei V2"
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { dismissOnboardingDialog } from "../src/veo3bot/project.js";

const probe = process.argv[2] ?? "A Fei V2";
const BASE = "https://labs.google/fx/tools/flow";

const context = await launchVeo3Browser();
const page = context.pages()[0] ?? (await context.newPage());

// Tạo project MỚI, KHÔNG dùng ensureProject (nó trả về project đã cache).
await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await dismissOnboardingDialog(page);

const newBtn = page.locator('button:has-text("New project")').first();
if (!(await newBtn.count())) {
  console.error("Không thấy nút 'New project' — Flow có thể đã tự vào 1 project sẵn.");
  await context.close();
  process.exit(1);
}
await newBtn.click();
await page.waitForURL((u) => /\/project\//.test(u.pathname), { timeout: 30000 });
await dismissOnboardingDialog(page);
await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
console.log(`Project TRỐNG vừa tạo: ${page.url()}`);

await page.locator('button:has-text("add_2")').first().click({ timeout: 20000 });
await page.waitForTimeout(1500);
const search = page.getByRole("textbox", { name: /search assets/i }).first();
if (await search.count()) await search.fill(probe);

const cards = page.locator('div[role="option"]');
let seen: string[] = [];
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(1000);
  const n = await cards.count();
  seen = [];
  for (let k = 0; k < Math.min(n, 10); k++) {
    const raw = (await cards.nth(k).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    seen.push(raw.replace(/\s+(Image|Video|Voice|Character|Avatar)$/i, "").trim());
  }
  if (seen.length) break;
}

console.log(`\nTra "${probe}" trong project TRỐNG:`);
console.log(seen.length ? `  thấy: ${seen.map((s) => `"${s}"`).join(", ")}` : "  (không có card nào)");
console.log(
  seen.some((s) => s.toLowerCase() === probe.trim().toLowerCase())
    ? "\n=> ASSET DÙNG CHUNG CẢ TÀI KHOẢN (project mới vẫn tra được asset của project cũ)"
    : "\n=> ASSET THEO TỪNG PROJECT (project mới không thấy asset của project cũ)"
);
await page.screenshot({ path: "scripts/asset-scope-probe.png" });
await context.close();
