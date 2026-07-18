import type { Page } from "playwright";
import { debugCapture } from "./debug.js";

/**
 * Tìm 1 clip đã được đổi tên lúc generate (xem generate.ts::renameLatestVideo, tên dạng
 * "clip_017") trong lưới media của project hiện tại, rồi tải về ở chất lượng 1080p.
 *
 * CHƯA XÁC NHẬN TRỰC TIẾP (2026-07-19, chưa chạy thử thật) — toàn bộ selector dưới đây (ô tìm
 * kiếm trên lưới media chính, menu/nút "Download", tuỳ chọn chất lượng "1080p") đều SUY ĐOÁN
 * theo mẫu đã xác nhận ở nơi khác trong codebase (ô search giống hệt @mention picker trong
 * generate.ts, icon dạng Material Symbols ligature giống các nút khác đã dùng: "arrow_forward",
 * "whiteboard Rename", "done Done"). Nếu bước nào sai, `debugCapture` sẽ lưu bằng chứng thật
 * (screenshot + HTML) để sửa đúng theo cùng quy trình đã dùng cho MỌI bug UI khác trong project
 * này (xem RUNBOOK.md mục 4) — không cần đoán lại từ đầu, chỉ cần soi debug capture.
 *
 * Trả về `false` (không throw) nếu KHÔNG tìm thấy clip tên này trong project hiện tại — cho
 * phép gọi nơi khác thử tìm ở project KHÁC (mỗi project Flow có lưới media riêng biệt, xem
 * RUNBOOK mục 4.4) trước khi kết luận thật sự không tìm thấy ở đâu cả.
 */
export async function downloadClip(page: Page, clipName: string, outFile: string): Promise<boolean> {
  const searchBox = page.locator('input[placeholder="Search assets"], input[type="search"]').first();
  const hasSearchBox = (await searchBox.count()) > 0;
  if (hasSearchBox) {
    await searchBox.fill(clipName);
    await page.waitForTimeout(800);
  }

  const card = page.getByText(clipName, { exact: true }).locator(":visible").first();
  if (!(await card.count())) {
    if (hasSearchBox) await searchBox.fill("").catch(() => {});
    return false;
  }

  // Đăng ký chờ sự kiện download NGAY TRƯỚC khi bắt đầu chuỗi click — an toàn dù chưa biết
  // chính xác thao tác nào (menuitem "Download" hay chọn "1080p" sau đó) mới thực sự kích hoạt
  // tải file, Playwright vẫn bắt được sự kiện miễn listener đã đăng ký trước khi nó xảy ra.
  const downloadPromise = page.waitForEvent("download", { timeout: 45000 });

  await card.click({ button: "right" });
  const downloadMenuItem = page.getByRole("menuitem", { name: /download/i }).first();
  if (await downloadMenuItem.count()) {
    await downloadMenuItem.click();
  } else {
    await page.keyboard.press("Escape").catch(() => {});
    await debugCapture(page, `download-menu-missing-${clipName}`);
    throw new Error(`Không thấy menu "Download" cho "${clipName}" — kiểm tra debug capture, có thể selector sai.`);
  }

  // Nếu Flow hiện thêm 1 bước chọn chất lượng (submenu/dialog), chọn "1080p" — best-effort, im
  // lặng bỏ qua nếu không có bước này (có thể chất lượng đã cố định theo cài đặt tài khoản/
  // project, giống cơ chế bật/tắt audio đã gặp — xem RUNBOOK).
  try {
    await page.getByRole("menuitem", { name: /1080/ }).first().click({ timeout: 3000 });
  } catch {
    try {
      await page.getByRole("button", { name: /1080/ }).first().click({ timeout: 1500 });
    } catch {
      // Không có bước chọn chất lượng — coi như thao tác "Download" ở trên đã tự tải đúng.
    }
  }

  let download;
  try {
    download = await downloadPromise;
  } catch (err) {
    await debugCapture(page, `download-fail-${clipName}`);
    throw new Error(`Tải "${clipName}" thất bại (không thấy sự kiện download) — kiểm tra debug capture. Lỗi gốc: ${(err as Error).message}`);
  }
  await download.saveAs(outFile);

  if (hasSearchBox) await searchBox.fill("").catch(() => {});
  return true;
}
