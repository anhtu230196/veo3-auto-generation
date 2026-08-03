/**
 * Script KHẢO SÁT (chỉ đọc, không tạo gì) — mở Google Flow bằng đúng session Playwright
 * đã lưu (`.auth/chrome-profile`), vào 1 project, chuyển sang chế độ Image, rồi in ra
 * toàn bộ các nút/tab/điều khiển đang có.
 *
 * MỤC ĐÍCH: trả lời câu hỏi chặn kiến trúc automation — chế độ Image của Flow có cho
 * ĐÍNH ẢNH REFERENCE không, và nếu có thì qua đường nào (upload trực tiếp / Ingredient +
 * @mention). Xem RUNBOOK mục 8 + narration-scripts/.../case-01-reichelt/assets.md.
 *
 * KHÔNG bấm Generate, KHÔNG tạo media, KHÔNG tốn credit. Chạy:
 *   npx tsx scripts/inspect-flow-image-ui.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
// ensureProject KHÔNG dùng — xem ghi chú trong main()

async function dumpControls(page: import("playwright").Page, label: string) {
  console.log(`\n=================== ${label} ===================`);
  for (const role of ["button", "tab", "menuitem"] as const) {
    const items = page.getByRole(role);
    const n = await items.count();
    const names: string[] = [];
    for (let i = 0; i < Math.min(n, 60); i++) {
      const el = items.nth(i);
      if (!(await el.isVisible().catch(() => false))) continue;
      const name = (await el.getAttribute("aria-label")) || (await el.innerText().catch(() => ""));
      const clean = name.replace(/\s+/g, " ").trim();
      if (clean) names.push(clean);
    }
    console.log(`\n[${role}] (${names.length} hiện):`);
    console.log(names.map((s) => `  - ${s}`).join("\n") || "  (không có)");
  }
  // Ô upload file ẩn là dấu hiệu rõ nhất cho khả năng đính ảnh reference.
  const fileInputs = page.locator('input[type="file"]');
  console.log(`\n[input[type=file]] số lượng: ${await fileInputs.count()}`);
  for (let i = 0; i < (await fileInputs.count()); i++) {
    const inp = fileInputs.nth(i);
    console.log(
      `  #${i} accept=${await inp.getAttribute("accept")} multiple=${await inp.getAttribute("multiple")}`
    );
  }
}

/**
 * Flow hiện 1 modal changelog (iframe gstatic .../changelogs/...) đè lên trang và CHẶN
 * mọi click ("subtree intercepts pointer events") — chưa có trong RUNBOOK, phát hiện
 * 2026-08-02. Phải đóng trước khi thao tác bất cứ thứ gì.
 */
async function dismissChangelogModal(page: import("playwright").Page) {
  const dialog = page.locator('[role="dialog"][data-state="open"]');
  if (!(await dialog.count())) return false;

  // In ra nội dung dialog 1 lần để biết chắc đang đóng cái gì + tìm được selector đúng.
  const btns = dialog.first().getByRole("button");
  const btnNames: string[] = [];
  for (let i = 0; i < (await btns.count()); i++) {
    const n =
      (await btns.nth(i).getAttribute("aria-label")) ||
      (await btns.nth(i).innerText().catch(() => ""));
    if (n?.trim()) btnNames.push(n.replace(/\s+/g, " ").trim());
  }
  console.log(`Phát hiện dialog chặn click. Nút bên trong: ${JSON.stringify(btnNames)}`);

  for (const attempt of [
    // XÁC NHẬN 2026-08-02: dialog onboarding của Flow có đúng 1 nút tên "Get started".
    // Bấm đúng nút này là cách sạch nhất — gỡ DOM bằng tay làm trang crash sau đó.
    async () => page.getByRole("button", { name: /get started/i }).first().click({ timeout: 4000 }),
    async () => page.keyboard.press("Escape"),
    async () => dialog.first().getByRole("button").first().click({ timeout: 3000 }),
    async () =>
      page
        .getByRole("button", { name: /close|dismiss|got it|continue|skip|later/i })
        .first()
        .click({ timeout: 3000 }),
    // Cuối cùng: gỡ thẳng dialog + lớp overlay khỏi DOM.
    async () =>
      page.evaluate(() => {
        document.querySelectorAll('[role="dialog"]').forEach((d) => d.remove());
        document
          .querySelectorAll('[data-radix-popper-content-wrapper], [data-state="open"][aria-hidden]')
          .forEach((d) => d.remove());
        document.body.style.pointerEvents = "auto";
      }),
  ]) {
    await attempt().catch(() => {});
    await page.waitForTimeout(800);
    if (!(await dialog.count())) {
      console.log("Đã đóng dialog.");
      return true;
    }
  }
  console.log("!! Không đóng được dialog.");
  return false;
}

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());

  // KHÔNG dùng ensureProject() ở đây: nó tự goto() lại trang, làm modal changelog hiện
  // lại NGAY TRƯỚC lúc bấm "New project" → click bị chặn. Tự điều hướng để kiểm soát
  // đúng thứ tự: goto → đóng modal → mới bấm.
  await page.goto("https://labs.google/fx/tools/flow", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(4000);
  await dismissChangelogModal(page);

  if (!/\/project\//.test(page.url())) {
    const newProjectButton = page.locator('button:has-text("New project")').first();
    if (await newProjectButton.count()) {
      await newProjectButton.click({ timeout: 15000 });
      await page.waitForURL((u) => /\/project\//.test(u.pathname), { timeout: 45000 });
    }
  }
  await dismissChangelogModal(page);
  const projectUrl = page.url();
  console.log(`Project: ${projectUrl}`);
  await page.waitForTimeout(3000);

  await dumpControls(page, "TRẠNG THÁI MẶC ĐỊNH (chưa đổi chế độ)");

  // Mở bảng cài đặt (pill crop_16_9) rồi chọn tab Image — đúng luồng đã xác nhận ở
  // imageAsset.ts / RUNBOOK 4.10.
  const settingsPill = page.locator('button:has-text("crop_16_9")').first();
  if (await settingsPill.count()) {
    await settingsPill.click();
    await page.waitForTimeout(1500);
    await dumpControls(page, "SAU KHI MỞ BẢNG CÀI ĐẶT");

    const imageTab = page.getByRole("tab", { name: /image/i }).first();
    if (await imageTab.count()) {
      await imageTab.click();
      await page.waitForTimeout(1500);
      await page.keyboard.press("Escape"); // RUNBOOK 4.13 — không Escape thì bảng che ô prompt
      await page.waitForTimeout(1000);
      await dumpControls(page, "SAU KHI CHỌN CHẾ ĐỘ IMAGE (đã Escape)");
    } else {
      console.log("\n!! Không tìm thấy tab Image");
    }
  } else {
    console.log("\n!! Không tìm thấy pill cài đặt (crop_16_9)");
  }

  await page.screenshot({ path: "scripts/flow-image-mode.png", fullPage: false });

  // --- Khảo sát đường ĐÍNH ẢNH REFERENCE (câu hỏi chính) ---
  const addMedia = page.locator('button:has-text("Add Media")').first();
  if (await addMedia.count()) {
    await addMedia.click();
    await page.waitForTimeout(1500);
    await dumpControls(page, "MENU 'ADD MEDIA' (ở chế độ Image)");
    await page.screenshot({ path: "scripts/flow-addmedia-menu.png" });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(800);
  }

  // Tab "Ingredients" nằm cùng hàng với Image/Video/Frames trong bảng cài đặt.
  const pill = page.locator('button:has-text("crop_16_9")').first();
  if (await pill.count()) {
    await pill.click();
    await page.waitForTimeout(1200);
    const ing = page.getByRole("tab", { name: /ingredients/i }).first();
    if (await ing.count()) {
      await ing.click();
      await page.waitForTimeout(1500);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(800);
      await dumpControls(page, "CHẾ ĐỘ 'INGREDIENTS'");
      await page.screenshot({ path: "scripts/flow-ingredients-mode.png" });
    }
  }

  console.log("\nĐã lưu ảnh chụp màn hình vào scripts/.");
  await page.waitForTimeout(5000);
  await context.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
