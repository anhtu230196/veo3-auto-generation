import type { Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

const debugDir = path.join(config.outputDir, "debug");

/** Log chi tiết — chỉ in ra khi `DEBUG=1` (xem config.ts::debug), im lặng khi tắt. */
export function debugLog(tag: string, msg: string): void {
  if (!config.debug) return;
  console.log(`[debug:${tag}] ${msg}`);
}

/**
 * Lưu screenshot toàn trang + HTML dump vào `output/debug/<tag>-<timestamp>.{png,html}` —
 * chỉ chạy khi `DEBUG=1`. Dùng ở các điểm throw/timeout để soi lại nguyên nhân mà không cần
 * chạy lại cả pipeline (đúng tinh thần mục 5 RUNBOOK: bug nghiêm trọng chỉ lộ ra khi soi bằng
 * mắt). Không bao giờ throw — lỗi khi chụp debug không được làm hỏng luồng chính.
 */
export async function debugCapture(page: Page, tag: string): Promise<void> {
  if (!config.debug) return;
  try {
    await fs.mkdir(debugDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const base = path.join(debugDir, `${tag}-${stamp}`);
    await page.screenshot({ path: `${base}.png`, fullPage: true }).catch(() => {});
    const html = await page.content().catch(() => "");
    if (html) await fs.writeFile(`${base}.html`, html);
    // XÁC NHẬN TRỰC TIẾP (2026-07-19): thiếu URL hiện tại từng làm khó xác định nguyên nhân 1
    // bug (trang bị "mắc kẹt" ở URL edit riêng của 1 clip, xem RUNBOOK mục 4.39) — page.content()
    // không phản ánh URL (đó là địa chỉ THANH URL, không nằm trong DOM), phải lưu riêng.
    await fs.writeFile(`${base}.url.txt`, page.url()).catch(() => {});
    console.log(`[debug:${tag}] đã lưu ${base}.png / .html / .url.txt (url=${page.url()})`);
  } catch (err) {
    console.warn(`[debug:${tag}] lưu debug capture thất bại (bỏ qua, không ảnh hưởng luồng chính): ${(err as Error).message}`);
  }
}
