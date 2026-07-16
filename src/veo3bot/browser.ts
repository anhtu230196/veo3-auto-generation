import { chromium, type BrowserContext } from "playwright";
import path from "node:path";
import { config } from "../config.js";

const PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * Dùng 1 Chrome profile cố định (persistent) thay vì tạo context ẩn danh mới mỗi lần.
 * Lý do: context ẩn danh không có cache, khiến Flow (SPA nặng JS) hydrate rất chậm và
 * thất thường giữa các lần chạy — quan sát trực tiếp thấy nút UI có lúc mất hơn 60s
 * mới sẵn sàng. Persistent profile giữ cache/service worker qua các lần chạy, đồng thời
 * tự lưu đăng nhập Google (không cần export/import storageState.json thủ công nữa).
 */
export async function launchVeo3Browser(): Promise<BrowserContext> {
  return chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: "chrome",
    args: [
      "--disable-blink-features=AutomationControlled",
      // Không set window-size sẽ mở full màn hình ảo, tràn ra ngoài màn hình Mac thật.
      "--window-size=1280,800",
      "--window-position=40,40",
    ],
    viewport: { width: 1280, height: 800 },
  });
}
