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
    await createImageIngredient(page, setting.name, setting.description, SETTING_SHEET_STYLE_BLOCK, projectUrl);
    console.log(`[settings] đã tạo "${setting.name}"`);
  }
}
