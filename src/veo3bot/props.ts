import type { Page } from "playwright";
import type { PropProfile } from "../props/extract.js";

const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;

/**
 * ⚠️ Flow KHÔNG có mục "Create Object"/"Create Prop" riêng trong menu "Add Media" (menu quan
 * sát được chỉ có: Upload media/Create Collection/Create Character/Create Scene — xem comment
 * trong characters.ts). Vì vậy file này TÁI SỬ DỤNG nguyên luồng "Create Character" (đã xác
 * nhận hoạt động ổn định, giữ đúng hình ảnh qua @mention) để tạo asset cho đạo cụ/vật dụng —
 * "Character" ở đây chỉ là tên gọi UI, cơ chế bên dưới (ảnh tham chiếu + chip @mention) không
 * quan tâm chủ thể là người hay vật. Nếu Flow sau này có mục tạo riêng cho object/prop, đổi
 * `getByText("Create Character", ...)` bên dưới cho đúng, dùng
 *   npx playwright codegen https://labs.google/fx/tools/flow
 * để soi lại menu thật trước khi sửa.
 */

async function propAlreadyExists(page: Page, name: string): Promise<boolean> {
  const attachMediaButton = page.locator('button:has-text("add_2")');
  await attachMediaButton.click();

  const searchBox = page.locator('input[placeholder="Search assets"]');
  await searchBox.fill(name);
  await page.waitForTimeout(1000);
  const exists = (await page.getByText(name, { exact: false }).count()) > 0;

  await page.keyboard.press("Escape");
  return exists;
}

async function createProp(page: Page, prop: PropProfile, projectUrl: string): Promise<void> {
  await page.locator('button:has-text("Add Media")').click();
  await page.getByText("Create Character", { exact: false }).click();

  const describeBox = page.locator('div[contenteditable="true"]').first();
  await describeBox.click();
  await describeBox.fill(`${prop.name}: ${prop.description}`);

  await page.locator('button:has-text("arrow_forward")').last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let done = false;
  while (Date.now() < deadline) {
    if ((await page.locator("img[src], video[src]").count()) > 0) {
      done = true;
      break;
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!done) {
    throw new Error(
      `Hết thời gian chờ tạo Prop "${prop.name}" — kiểm tra thủ công trong Flow.`
    );
  }

  const nameInput = page.locator('input[placeholder="Character Name"]');
  await nameInput.fill(prop.name);
  await page.keyboard.press("Enter");

  await page.locator('button:has-text("Done")').click();

  await page.goto(projectUrl);
  await page.waitForLoadState("networkidle");
}

/**
 * Đảm bảo mỗi đạo cụ trong danh sách đã có Prop asset trong Flow. Bỏ qua đạo cụ đã tồn tại
 * (tra theo tên) để resume-safe và tránh tốn credit tạo lại — cùng logic với
 * ensureCharactersInFlow (xem characters.ts).
 */
export async function ensurePropsInFlow(
  page: Page,
  props: PropProfile[],
  projectUrl: string
): Promise<void> {
  for (const prop of props) {
    const exists = await propAlreadyExists(page, prop.name);
    if (exists) {
      console.log(`[props] "${prop.name}" đã có sẵn trong Flow, bỏ qua`);
      continue;
    }
    console.log(`[props] đang tạo Prop "${prop.name}" trong Flow...`);
    await createProp(page, prop, projectUrl);
    console.log(`[props] đã tạo "${prop.name}"`);
  }
}
