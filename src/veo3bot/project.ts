import type { Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

const VEO3_BASE_URL = "https://labs.google/fx/tools/flow";
const PROJECT_STATE_FILE = path.join(config.stateDir, "project.json");
const PROJECTS_STATE_FILE = path.join(config.stateDir, "projects.json");

/**
 * Đóng modal onboarding của Flow — BẮT BUỘC gọi sau MỌI `page.goto()`/`page.reload()`.
 *
 * XÁC NHẬN TRỰC TIẾP (2026-08-02, xem RUNBOOK mục 8.1): Flow hiện 1 Radix dialog
 * (`[role="dialog"][data-state="open"]`, bên trong là iframe
 * `gstatic.com/.../flow/changelogs/...`) đè lên trang ngay sau khi tải. Nó chặn TOÀN BỘ
 * click — kể cả nút "New project" — với log Playwright `subtree intercepts pointer
 * events`, khiến mọi thao tác timeout 30s mà không có dấu hiệu nào cho thấy nguyên nhân
 * là 1 modal.
 *
 * Các điểm đã thử và kết luận:
 * - Dialog HIỆN LẠI sau mỗi lần điều hướng → không đóng 1 lần rồi thôi được.
 * - `Escape` KHÔNG đóng được dialog này.
 * - Dialog có đúng 1 nút, accessible name **"Get started"** → bấm nút này là cách sạch.
 * - TUYỆT ĐỐI KHÔNG gỡ dialog khỏi DOM bằng `page.evaluate()`: có đóng được thật, nhưng
 *   thao tác NGAY SAU ĐÓ làm trang crash (`Page crashed`) — đã dính 1 lần khi khảo sát.
 *
 * Hàm này im lặng khi không có dialog (trường hợp thường gặp sau lần đầu), và chỉ CẢNH
 * BÁO chứ không throw nếu không đóng được — để lần timeout sau đó có manh mối rõ ràng
 * thay vì lỗi khó hiểu.
 */
export async function dismissOnboardingDialog(page: Page): Promise<void> {
  const dialog = page.locator('[role="dialog"][data-state="open"]').first();
  // Dialog render TRỄ vài trăm ms sau domcontentloaded — check ngay lập tức sẽ trượt.
  await dialog.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
  if (!(await dialog.count())) return;

  for (let attempt = 0; attempt < 3; attempt++) {
    await page
      .getByRole("button", { name: /get started/i })
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
    await page.waitForTimeout(600);
    if (!(await dialog.count())) {
      console.log("[project] đã đóng modal onboarding của Flow");
      return;
    }
  }

  console.warn(
    '[project] ⚠️ KHÔNG đóng được modal onboarding (nút "Get started"). Mọi click sau đây ' +
      "nhiều khả năng sẽ timeout với 'subtree intercepts pointer events' — xem RUNBOOK mục 8.1."
  );
}

/**
 * Phải chờ tường minh nút "Add Media" (luôn có mặt bên trong 1 project đã load xong)
 * trước khi coi là sẵn sàng, vì "networkidle" bắn xong trước khi Flow hydrate xong.
 * LƯU Ý: textContent thật của nút là "addAdd Media" (icon ligature "add" dính liền
 * label, KHÔNG có khoảng trắng) — selector chỉ nên match phần label "Add Media"
 * (has-text làm substring match nên vẫn khớp đúng phần này bên trong chuỗi dính liền).
 */
export async function waitForProjectReady(page: Page): Promise<void> {
  const addMediaButton = page.locator('button:has-text("Add Media")');
  try {
    await addMediaButton.waitFor({ state: "visible", timeout: 45000 });
  } catch {
    console.log("[project] tải chậm hơn dự kiến, reload và thử lại...");
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19, cùng bug đã sửa ở
    // generate.ts/imageAsset.ts) — bản cũ chỉ chụp SAU reload+recheck thất bại, lúc đó trạng
    // thái lỗi thật (lý do "Add Media" không xuất hiện lần đầu) đã bị reload xoá mất.
    await fs.mkdir(config.stateDir, { recursive: true });
    await page.screenshot({ path: path.join(config.stateDir, `pre-reload-project-ready-${Date.now()}.png`) }).catch(() => {});
    // Không chờ "load"/"networkidle" đầy đủ — project nhiều media khiến 2 sự kiện này
    // không bao giờ fire ổn định (xác nhận trực tiếp qua debug). Chỉ cần DOM parse xong
    // rồi tự chờ đúng tín hiệu sẵn sàng thật (nút "Add Media").
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Modal onboarding hiện lại sau reload y như sau goto (RUNBOOK 8.1).
    await dismissOnboardingDialog(page);
    try {
      await addMediaButton.waitFor({ state: "visible", timeout: 45000 });
    } catch (err) {
      await fs.mkdir(config.stateDir, { recursive: true });
      const debugPath = path.join(config.stateDir, `project-ready-timeout-${Date.now()}.png`);
      await page.screenshot({ path: debugPath }).catch(() => {});
      console.log(`[project] vẫn lỗi sau reload, đã lưu ảnh debug: ${debugPath}`);
      throw err;
    }
  }
}

/**
 * labs.google/fx/tools/flow trả về trang landing "Create characters and cast
 * them anywhere" nếu chưa có project nào đang mở — sidebar "All Media"/"Characters"
 * và ô prompt tạo video chỉ tồn tại BÊN TRONG 1 project. Hàm này đảm bảo luôn có
 * 1 project để làm việc, và cache lại project đã tạo để các lần chạy (characters
 * step + generate step, hoặc resume) đều dùng chung 1 project thay vì tạo mới liên tục.
 */
export async function ensureProject(page: Page): Promise<string> {
  const cached = await fs.readFile(PROJECT_STATE_FILE, "utf-8").catch(() => null);
  // waitUntil "domcontentloaded" thay vì mặc định "load" — project nhiều media (audio/
  // video đã tạo) khiến sự kiện "load" không bao giờ fire ổn định, gây goto() timeout
  // dù trang thực chất đã tương tác được (xác nhận trực tiếp qua debug).
  if (cached) {
    const { projectUrl } = JSON.parse(cached) as { projectUrl: string };
    await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await dismissOnboardingDialog(page);
    await waitForProjectReady(page);
    return projectUrl;
  }

  await page.goto(VEO3_BASE_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  // PHẢI đóng modal TRƯỚC khi bấm "New project" — chính chỗ này là nơi bug lộ ra đầu
  // tiên: click bị dialog chặn, timeout 30s (RUNBOOK 8.1).
  await dismissOnboardingDialog(page);

  const newProjectButton = page.locator('button:has-text("New project")').first();
  if (await newProjectButton.count()) {
    await newProjectButton.click();
    await page.waitForURL((url) => /\/project\//.test(url.pathname), { timeout: 30000 });
    // Điều hướng sang trang project = 1 lần tải mới → modal hiện lại.
    await dismissOnboardingDialog(page);
  }
  // Nếu Flow tự redirect thẳng vào project có sẵn (không có nút "New project"),
  // page.url() bên dưới sẽ tự phản ánh đúng project đó.

  const projectUrl = page.url();
  if (!/\/project\//.test(projectUrl)) {
    throw new Error(
      `Không vào được project nào trong Flow (vẫn ở landing page: ${projectUrl}). Kiểm tra thủ công UI.`
    );
  }

  await waitForProjectReady(page);

  await fs.mkdir(config.stateDir, { recursive: true });
  await fs.writeFile(PROJECT_STATE_FILE, JSON.stringify({ projectUrl }, null, 2));
  console.log(`[project] dùng project: ${projectUrl}`);
  return projectUrl;
}

/**
 * Đảm bảo có đủ `count` project Flow riêng biệt để chạy N tab song song, mỗi tab 1
 * project — tránh hoàn toàn việc lưới media (video[src]/"Failed") của tab này lẫn vào
 * tab khác. Project #0 LUÔN là project cũ (state/project.json, đã dùng để tạo Character
 * asset + 83 clip đầu) để giữ lịch sử, không tạo lãng phí. Cache danh sách vào
 * state/projects.json để lần chạy sau resume đúng các project đã tạo.
 */
export async function ensureProjects(page: Page, count: number): Promise<string[]> {
  const cached = await fs.readFile(PROJECTS_STATE_FILE, "utf-8").catch(() => null);
  let urls: string[] = cached ? JSON.parse(cached) : [];

  if (urls.length === 0) {
    const legacyUrl = await ensureProject(page);
    urls = [legacyUrl];
  }

  while (urls.length < count) {
    await page.goto(VEO3_BASE_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await dismissOnboardingDialog(page);

    const newProjectButton = page.locator('button:has-text("New project")').first();
    if (await newProjectButton.count()) {
      await newProjectButton.click();
      await page.waitForURL((url) => /\/project\//.test(url.pathname), { timeout: 30000 });
      await dismissOnboardingDialog(page);
    }

    const projectUrl = page.url();
    if (!/\/project\//.test(projectUrl)) {
      throw new Error(
        `Không tạo được project mới trong Flow để chạy song song (vẫn ở landing page: ${projectUrl}).`
      );
    }
    await waitForProjectReady(page);

    urls.push(projectUrl);
    console.log(`[project] đã tạo project song song #${urls.length}: ${projectUrl}`);

    await fs.mkdir(config.stateDir, { recursive: true });
    await fs.writeFile(PROJECTS_STATE_FILE, JSON.stringify(urls, null, 2));
  }

  return urls.slice(0, count);
}
