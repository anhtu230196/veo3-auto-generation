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
 * Đảm bảo mỗi đạo cụ trong danh sách đã có Prop asset trong Flow — dựa trên field `status`
 * (xem assetStatus.ts, PropProfile.status), cùng cơ chế với ensureCharactersInFlow
 * (characters.ts, đọc comment ở đó để hiểu đầy đủ lý do): status "success" bỏ qua hẳn không
 * query Flow; status khác vẫn tra tên 1 lần làm lưới an toàn trước khi tạo mới; lỗi tạo asset
 * KHÔNG làm crash pipeline (đúng bug vừa gặp: "Spanish Royal Banner" timeout làm crash cả
 * orchestrator) — đánh dấu "failed" rồi tiếp tục đạo cụ kế tiếp; `onProgress` lưu tiến độ ngay
 * sau mỗi thay đổi status.
 */
export async function ensurePropsInFlow(
  page: Page,
  props: PropProfile[],
  projectUrl: string,
  onProgress?: (props: PropProfile[]) => Promise<void> | void
): Promise<void> {
  for (const prop of props) {
    if (prop.status === "success") {
      console.log(`[props] "${prop.name}" status=success, bỏ qua (không query lại Flow).`);
      continue;
    }

    const exists = await propAlreadyExists(page, prop.name);
    if (exists) {
      console.log(`[props] "${prop.name}" đã có sẵn trong Flow (tra tên), đánh dấu success.`);
      prop.status = "success";
      await onProgress?.(props);
      continue;
    }

    console.log(`[props] đang tạo Prop "${prop.name}" trong Flow...`);
    try {
      await createImageIngredient(page, prop.name, prop.description, CHARACTER_SHEET_STYLE_BLOCK, projectUrl);
      prop.status = "success";
      console.log(`[props] đã tạo "${prop.name}"`);
    } catch (err) {
      prop.status = "failed";
      console.error(
        `[props] LỖI tạo "${prop.name}", đánh dấu failed để thử lại lần chạy sau: ${(err as Error).message}`
      );
    }
    await onProgress?.(props);
  }

  const failed = props.filter((p) => p.status === "failed");
  if (failed.length > 0) {
    console.warn(`[props] còn ${failed.length} đạo cụ lỗi, cần chạy lại "npm run run": ${failed.map((p) => p.name).join(", ")}`);
  }
}
