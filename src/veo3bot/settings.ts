import type { Page } from "playwright";
import type { SettingProfile } from "../settings/extract.js";
import { createImageIngredient } from "./imageAsset.js";
import { SETTING_SHEET_STYLE_BLOCK } from "../styleDNA.js";

/**
 * XÁC NHẬN TRỰC TIẾP bằng codegen thật do người dùng cung cấp (2026-07-16): Setting asset
 * KHÔNG tạo qua "Create Scene" (suy đoán ban đầu, đã SAI — ra asset "Untitled" không đặt tên
 * được, không tìm lại được qua @mention). Cách ĐÚNG: tạo qua chế độ Image trên canvas chính
 * (số lượng 1) rồi đổi tên — xem imageAsset.ts::createImageIngredient.
 */

async function settingAlreadyExists(page: Page, name: string): Promise<boolean> {
  const attachMediaButton = page.locator('button:has-text("add_2")');
  await attachMediaButton.click();

  const searchBox = page.locator('input[placeholder="Search assets"]');
  await searchBox.fill(name);
  await page.waitForTimeout(1000);
  const exists = (await page.getByText(name, { exact: false }).count()) > 0;

  await page.keyboard.press("Escape");
  return exists;
}

/**
 * Đảm bảo mỗi bối cảnh trong danh sách đã có Setting asset trong Flow — dựa trên field
 * `status` (xem assetStatus.ts, SettingProfile.status), cùng cơ chế với
 * ensureCharactersInFlow (characters.ts, đọc comment ở đó để hiểu đầy đủ lý do): status
 * "success" bỏ qua hẳn không query Flow; status khác vẫn tra tên 1 lần làm lưới an toàn trước
 * khi tạo mới; lỗi tạo asset KHÔNG làm crash pipeline — đánh dấu "failed" rồi tiếp tục bối
 * cảnh kế tiếp; `onProgress` lưu tiến độ ngay sau mỗi thay đổi status.
 */
export async function ensureSettingsInFlow(
  page: Page,
  settings: SettingProfile[],
  projectUrl: string,
  onProgress?: (settings: SettingProfile[]) => Promise<void> | void
): Promise<void> {
  for (const setting of settings) {
    if (setting.status === "success") {
      console.log(`[settings] "${setting.name}" status=success, bỏ qua (không query lại Flow).`);
      continue;
    }

    const exists = await settingAlreadyExists(page, setting.name);
    if (exists) {
      console.log(`[settings] "${setting.name}" đã có sẵn trong Flow (tra tên), đánh dấu success.`);
      setting.status = "success";
      await onProgress?.(settings);
      continue;
    }

    console.log(`[settings] đang tạo Setting "${setting.name}" trong Flow...`);
    try {
      await createImageIngredient(page, setting.name, setting.description, SETTING_SHEET_STYLE_BLOCK, projectUrl);
      setting.status = "success";
      console.log(`[settings] đã tạo "${setting.name}"`);
    } catch (err) {
      setting.status = "failed";
      console.error(
        `[settings] LỖI tạo "${setting.name}", đánh dấu failed để thử lại lần chạy sau: ${(err as Error).message}`
      );
    }
    await onProgress?.(settings);
  }

  const failed = settings.filter((s) => s.status === "failed");
  if (failed.length > 0) {
    console.warn(`[settings] còn ${failed.length} bối cảnh lỗi, cần chạy lại "npm run run": ${failed.map((s) => s.name).join(", ")}`);
  }
}
