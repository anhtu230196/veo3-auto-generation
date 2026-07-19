import type { Page } from "playwright";
import { debugCapture } from "./debug.js";

// XÁC NHẬN TRỰC TIẾP (2026-07-19, debug capture `download-fail-clip_000-*.png`): bấm "Download"
// KHÔNG tải file ngay — Flow hiện toast "Upscaling your video. This may take several minutes.
// Refrain from starting multiple upscaling jobs for the best results." rồi mới thực sự tải sau
// khi upscale (lên 1080p) xong. Timeout cũ (45s) quá ngắn, luôn timeout trước khi upscale kịp
// xong. Tăng lên đủ dài (nhiều phút/clip — nghĩa là tải 168 cảnh CÓ THỂ mất NHIỀU GIỜ nếu chạy
// hết trong 1 lần, xem RUNBOOK mục 4.37) — KHÔNG chạy song song nhiều lệnh tải cùng lúc (đúng lời
// cảnh báo của Flow "refrain from starting multiple upscaling jobs").
const UPSCALE_DOWNLOAD_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Tìm 1 clip đã được đổi tên lúc generate (xem generate.ts::renameLatestVideo, tên dạng
 * "clip_017") trong lưới media của project hiện tại, rồi tải về ở chất lượng 1080p.
 *
 * XÁC NHẬN TRỰC TIẾP (2026-07-19, soi debug capture của `rename-card-missing-scene0-*.html`) —
 * sửa 2 chỗ ĐOÁN SAI ở bản đầu:
 * 1. Ô search KHÔNG phải `input[placeholder="Search assets"]` — chuỗi "Search assets" đó chỉ là
 *    i18n key `add_menu_search_placeholder` (dành cho DIALOG @mention "Add Media", KHÔNG PHẢI
 *    trang lưới media chính) nhúng sẵn trong trang, không phải placeholder thật render ra. Trang
 *    lưới media chính dùng `<input data-testid="search-input" type="text">` (KHÔNG có
 *    `type="search"`, KHÔNG có placeholder) — xác nhận trực tiếp qua liệt kê mọi `<input>` thật
 *    trong dump.
 * 2. Tìm card bằng `getByText(clipName, {exact:true})` khả năng SAI — chưa có bằng chứng caption
 *    hiển thị trên card có đổi theo tên đã rename hay không (mọi card đã soi đều hiện TEXT PROMPT
 *    gốc làm caption, không phải tên rename). Đổi sang: gõ tên vào ô search rồi LẤY THẲNG kết quả
 *    ĐẦU TIÊN dạng "Video thumbnail" (tin tưởng search đã lọc đúng, giống cách baseline-diff +
 *    `.first()` đã dùng ở nơi khác) thay vì cố tìm text hiển thị đúng tên.
 *
 * Trả về `false` (không throw) nếu KHÔNG tìm thấy clip tên này trong project hiện tại — cho
 * phép gọi nơi khác thử tìm ở project KHÁC (mỗi project Flow có lưới media riêng biệt, xem
 * RUNBOOK mục 4.4) trước khi kết luận thật sự không tìm thấy ở đâu cả. CHƯA XÁC NHẬN TRỰC TIẾP
 * (chưa chạy thử thật) toàn bộ phần menu "Download"/tuỳ chọn "1080p" bên dưới — nếu sai,
 * `debugCapture` lưu bằng chứng thật để sửa tiếp, cùng quy trình đã dùng cho mọi bug UI khác
 * (RUNBOOK mục 4).
 */
export async function downloadClip(page: Page, clipName: string, outFile: string): Promise<boolean> {
  const searchBox = page.locator('[data-testid="search-input"]').first();
  const hasSearchBox = (await searchBox.count()) > 0;
  if (hasSearchBox) {
    await searchBox.fill(clipName);
    await page.waitForTimeout(800);
  }

  const card = page.getByRole("link", { name: "Video thumbnail" }).first();
  if (!(await card.count())) {
    await debugCapture(page, `download-card-missing-${clipName}`);
    if (hasSearchBox) await searchBox.fill("").catch(() => {});
    return false;
  }

  // Đăng ký chờ sự kiện download NGAY TRƯỚC khi bắt đầu chuỗi click — an toàn dù chưa biết
  // chính xác thao tác nào (menuitem "Download" hay chọn "1080p" sau đó) mới thực sự kích hoạt
  // tải file, Playwright vẫn bắt được sự kiện miễn listener đã đăng ký trước khi nó xảy ra.
  const downloadPromise = page.waitForEvent("download", { timeout: UPSCALE_DOWNLOAD_TIMEOUT_MS });

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

  // XÁC NHẬN TRỰC TIẾP (2026-07-19): sau bước trên, Flow hiện toast "Upscaling your video..." —
  // chỉ log cho người dùng biết đang chờ upscale (KHÔNG bị kẹt), không cần thao tác gì thêm vì
  // download tự bắn ra sau khi Flow upscale xong.
  const upscalingToast = await page
    .getByText("Upscaling your video", { exact: false })
    .first()
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  if (upscalingToast) {
    console.log(`[download] "${clipName}" đang được Flow upscale lên 1080p — có thể mất vài phút, đợi...`);
  }

  let download;
  try {
    download = await downloadPromise;
  } catch (err) {
    await debugCapture(page, `download-fail-${clipName}`);
    throw new Error(`Tải "${clipName}" thất bại (không thấy sự kiện download sau ${UPSCALE_DOWNLOAD_TIMEOUT_MS / 60000} phút) — kiểm tra debug capture. Lỗi gốc: ${(err as Error).message}`);
  }
  await download.saveAs(outFile);

  if (hasSearchBox) await searchBox.fill("").catch(() => {});
  return true;
}
