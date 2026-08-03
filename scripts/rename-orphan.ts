/**
 * Đổi tên ảnh MỚI NHẤT trong Flow — dùng khi bot tạo ảnh xong nhưng crash/timeout TRƯỚC bước
 * rename, để lại 1 ảnh vô danh (đúng kịch bản RUNBOOK mục 4.15).
 *
 * VÌ SAO CẦN: chạy lại runner sẽ KHÔNG sửa được — nó tạo THÊM 1 ảnh trùng nội dung (tốn
 * credit, lẫn lộn 2 bản). Phải đặt tên cho ảnh đã có rồi mới đánh dấu success.
 *
 *   npx tsx scripts/rename-orphan.ts "Tên Asset"
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

const newName = process.argv[2];
if (!newName) {
  console.error('Thiếu tham số tên. Ví dụ: npx tsx scripts/rename-orphan.ts "Tower Base Esplanade Flat"');
  process.exit(1);
}

const context = await launchVeo3Browser();
const page = context.pages()[0] ?? (await context.newPage());
await ensureProject(page);
await page.waitForTimeout(5000);

// Ảnh mới nhất nằm ở vị trí 0 nhờ sort "Recent" mặc định của Flow (cùng giả định đã dùng ở
// imageAsset.ts::firstImageSrc).
const newest = page.locator('img[src*="getMediaUrlRedirect"]').first();
const src = await newest.getAttribute("src");
console.log(`Ảnh mới nhất: ${src}`);

const card = newest.locator("xpath=ancestor::a[1]");
await card.click({ button: "right" });
await page.getByRole("menuitem", { name: "whiteboard Rename" }).click();

const nameInput = page.getByRole("textbox", { name: "Editable text" });
await nameInput.press("ControlOrMeta+a");
await nameInput.fill(newName);
await page.getByRole("button", { name: "done Done" }).click();
await page.waitForTimeout(2500);

console.log(`✅ Đã đổi tên thành "${newName}"`);
await context.close();
