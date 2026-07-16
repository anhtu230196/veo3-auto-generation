import type { Page } from "playwright";
import type { SettingProfile } from "../settings/extract.js";

const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;

/**
 * ⚠️ CHƯA XÁC NHẬN TRỰC TIẾP trên UI Flow thật (khác với characters.ts, nơi mọi selector đã
 * được xác nhận trực tiếp ngày 2026-07-13/14/15 — xem RUNBOOK.md mục 3). File này viết theo
 * SUY ĐOÁN dựa trên 1 chi tiết đã quan sát được: menu "Add Media" có mục "Create Scene" riêng
 * biệt với "Create Character" (xem comment trong characters.ts::createCharacter). Cấu trúc bên
 * dưới MIRROR lại đúng luồng createCharacter (cùng kiểu describe box → generate → đặt tên →
 * Done), vì Flow có vẻ dùng chung 1 khung UI cho các loại "Create X". NẾU SAI, dùng:
 *   npx playwright codegen https://labs.google/fx/tools/flow
 * để soi lại đúng luồng "Create Scene" thật rồi sửa lại các selector bên dưới.
 *
 * Điểm chưa rõ cụ thể cần kiểm tra:
 * 1. Setting asset sau khi tạo có xuất hiện trong dialog đính kèm (@mention) hay không, và nếu
 *    có thì thuộc tab/loại nào (RUNBOOK chỉ xác nhận các tab All/Images/Videos/Voices/
 *    Characters/Avatar/Uploads — KHÔNG có tab "Scenes" nào được ghi nhận). Vì vậy hàm dưới đây
 *    KHÔNG chuyển tab lọc nào cả trước khi tìm kiếm (dùng nguyên trạng thái "All" mặc định) —
 *    khác với characters.ts luôn bấm tab "Characters" trước.
 * 2. Input đặt tên có placeholder "Character Name" hay tên khác (vd "Scene Name") sau khi tạo
 *    Scene — bên dưới đang thử placeholder rỗng bất kỳ input text nào trong form làm fallback.
 */

async function settingAlreadyExists(page: Page, name: string): Promise<boolean> {
  const attachMediaButton = page.locator('button:has-text("add_2")');
  await attachMediaButton.click();
  // Không bấm tab lọc nào — xem ghi chú điểm (1) ở trên.

  const searchBox = page.locator('input[placeholder="Search assets"]');
  await searchBox.fill(name);
  await page.waitForTimeout(1000);
  const exists = (await page.getByText(name, { exact: false }).count()) > 0;

  await page.keyboard.press("Escape");
  return exists;
}

async function createSetting(page: Page, setting: SettingProfile, projectUrl: string): Promise<void> {
  await page.locator('button:has-text("Add Media")').click();
  await page.getByText("Create Scene", { exact: false }).click();

  const describeBox = page.locator('div[contenteditable="true"]').first();
  await describeBox.click();
  await describeBox.fill(`${setting.name}: ${setting.description}`);

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
      `Hết thời gian chờ tạo Setting "${setting.name}" — kiểm tra thủ công trong Flow (luồng "Create Scene" có thể khác "Create Character", xem ghi chú đầu file).`
    );
  }

  // "Character Name" là placeholder đã xác nhận cho luồng Character — Scene có thể dùng
  // placeholder khác. Thử "Character Name" trước, fallback sang input text đầu tiên trong form.
  let nameInput = page.locator('input[placeholder="Character Name"]');
  if ((await nameInput.count()) === 0) {
    nameInput = page.locator("input[type='text']").first();
  }
  await nameInput.fill(setting.name);
  await page.keyboard.press("Enter");

  await page.locator('button:has-text("Done")').click();

  await page.goto(projectUrl);
  await page.waitForLoadState("networkidle");
}

/**
 * Đảm bảo mỗi bối cảnh trong danh sách đã có Setting asset trong Flow. Bỏ qua bối cảnh đã tồn
 * tại (tra theo tên) để resume-safe và tránh tốn credit tạo lại — cùng logic với
 * ensureCharactersInFlow (xem characters.ts).
 */
export async function ensureSettingsInFlow(
  page: Page,
  settings: SettingProfile[],
  projectUrl: string
): Promise<void> {
  for (const setting of settings) {
    const exists = await settingAlreadyExists(page, setting.name);
    if (exists) {
      console.log(`[settings] "${setting.name}" đã có sẵn trong Flow, bỏ qua`);
      continue;
    }
    console.log(`[settings] đang tạo Setting "${setting.name}" trong Flow...`);
    await createSetting(page, setting, projectUrl);
    console.log(`[settings] đã tạo "${setting.name}"`);
  }
}
