import type { Page } from "playwright";
import type { PropProfile } from "../props/extract.js";
import { createImageIngredient } from "./imageAsset.js";
import { CHARACTER_SHEET_STYLE_BLOCK } from "../styleDNA.js";

/**
 * XÁC NHẬN TRỰC TIẾP bằng codegen thật do người dùng cung cấp (2026-07-16): Prop asset tạo
 * qua chế độ Image trên canvas chính (số lượng 1) rồi đổi tên — xem
 * imageAsset.ts::createImageIngredient. KHÔNG dùng menu "Create Character" như suy đoán ban
 * đầu.
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
    await createImageIngredient(page, prop.name, prop.description, CHARACTER_SHEET_STYLE_BLOCK, projectUrl);
    console.log(`[props] đã tạo "${prop.name}"`);
  }
}
