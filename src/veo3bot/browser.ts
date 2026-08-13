import { chromium, type BrowserContext } from "playwright";
import path from "node:path";
import { config } from "../config.js";

const PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * Nếu set (ví dụ `http://127.0.0.1:9222`), Playwright sẽ ATTACH vào một Chrome đang chạy
 * sẵn thay vì tự spawn browser. Dùng khi máy công ty chặn Playwright khởi động Chrome
 * (EDR/AV chặn process con của node.exe, hoặc Chrome policy chặn --user-data-dir lạ) —
 * user tự mở Chrome bằng tay thì không bị chặn. Xem RUNBOOK mục "Chạy qua CDP".
 * Lưu ý: headless KHÔNG giải quyết được vấn đề đó, vì vẫn spawn đúng chrome.exe.
 */
const CDP_URL = process.env.CHROME_CDP_URL?.trim();

/**
 * Dùng 1 Chrome profile cố định (persistent) thay vì tạo context ẩn danh mới mỗi lần.
 * Lý do: context ẩn danh không có cache, khiến Flow (SPA nặng JS) hydrate rất chậm và
 * thất thường giữa các lần chạy — quan sát trực tiếp thấy nút UI có lúc mất hơn 60s
 * mới sẵn sàng. Persistent profile giữ cache/service worker qua các lần chạy, đồng thời
 * tự lưu đăng nhập Google (không cần export/import storageState.json thủ công nữa).
 */
export async function launchVeo3Browser(): Promise<BrowserContext> {
  if (CDP_URL) {
    const browser = await chromium.connectOverCDP(CDP_URL);
    // Chrome mở bằng tay luôn có sẵn 1 context mặc định (chính là profile đang đăng nhập).
    // browser.newContext() ở đây sẽ tạo context trống không có session Google -> không dùng.
    const context = browser.contexts()[0];
    if (!context) {
      await browser.close().catch(() => {});
      throw new Error(
        `Nối được tới ${CDP_URL} nhưng Chrome không có context nào. ` +
          `Mở ít nhất 1 tab trong cửa sổ Chrome đó rồi chạy lại.`,
      );
    }

    // Mọi script đều gọi context.close() ở cuối. Ở chế độ launch đó là đúng (Playwright
    // sở hữu browser), nhưng ở chế độ CDP thì Chrome là của user tự mở — đóng nó đi
    // nghĩa là mỗi lần chạy lại phải mở tay lại từ đầu, và mất luôn session đang warm.
    // Vô hiệu hoá close() để Chrome sống xuyên suốt; mọi script đều tự process.exit()
    // nên websocket còn treo cũng không giữ event loop lại.
    context.close = async () => {};

    return context;
  }

  return chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: "chrome",
    acceptDownloads: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      // Không set window-size sẽ mở full màn hình ảo, tràn ra ngoài màn hình Mac thật.
      "--window-size=1280,800",
      "--window-position=40,40",
    ],
    viewport: { width: 1280, height: 800 },
  });
}
