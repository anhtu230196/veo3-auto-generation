import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import type { VeoPrompt } from "./splitter/prompt-writer.js";
import { launchVeo3Browser } from "./veo3bot/browser.js";
import { waitForProjectReady } from "./veo3bot/project.js";
import { downloadClip } from "./veo3bot/download.js";
import { assembleFinalVideo, type ScenePair } from "./assembler/ffmpeg.js";

const PROMPTS_STATE_FILE = path.join(config.stateDir, "prompts.json");
const PROJECTS_STATE_FILE = path.join(config.stateDir, "projects.json");
const PROJECT_STATE_FILE = path.join(config.stateDir, "project.json");

/**
 * Lệnh RIÊNG chỉ tải video (chất lượng 1080p) + ghép video cuối — KHÔNG tạo Ingredient
 * (`npm run assets`), KHÔNG generate cảnh (`npm run generate`). Tách ra vì `npm run generate`
 * giờ CHỈ tạo + đổi tên clip trong Flow, KHÔNG tải về nữa (xem RUNBOOK mục 4.31) — chạy lệnh
 * này SAU KHI `npm run generate` đã xong (hoặc xong một phần, resume-safe) để tải toàn bộ clip
 * đã `status: "success"` về `output/clips/`, rồi ghép thành `output/video_final.mp4`.
 */
async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

/** Ghi ATOMIC (file tạm rồi rename) — xem RUNBOOK mục 4.23 vì sao bắt buộc. */
async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, filePath);
}

async function savePromptsProgress(prompts: VeoPrompt[]): Promise<void> {
  await atomicWriteJson(PROMPTS_STATE_FILE, prompts);
}

/** Project #0 (`state/project.json`) LUÔN được tạo trước, `state/projects.json` là danh sách
 * đầy đủ khi có chạy song song (`PARALLEL_WORKERS > 1`) — đọc cả 2, ưu tiên danh sách đầy đủ. */
async function loadKnownProjectUrls(): Promise<string[]> {
  const projects = await readJson<string[]>(PROJECTS_STATE_FILE, []);
  if (projects.length > 0) return projects;
  const legacy = await readJson<{ projectUrl: string } | null>(PROJECT_STATE_FILE, null);
  return legacy ? [legacy.projectUrl] : [];
}

function clipFilePath(clipDir: string, index: number): string {
  return path.join(clipDir, `clip_${String(index).padStart(3, "0")}.mp4`);
}

async function main() {
  const prompts = await readJson<VeoPrompt[]>(PROMPTS_STATE_FILE, []);
  if (prompts.length === 0) {
    throw new Error(`state/prompts.json rỗng — chạy "npm run generate" trước khi tải video.`);
  }

  const clipDir = path.join(config.outputDir, "clips");
  await fs.mkdir(clipDir, { recursive: true });

  // Nguồn sự thật để resume giờ là field `isDownloaded` (xem RUNBOOK mục 4.35, theo yêu cầu
  // người dùng) — nhanh hơn hẳn so với việc phải kiểm tra sự tồn tại file mỗi lần chạy. Vẫn ĐỐI
  // CHIẾU với file thật trên đĩa để tự đồng bộ lại cờ (cùng cơ chế status↔file mục 4.18): file có
  // → đánh dấu `isDownloaded = true` dù cờ cũ nói khác (vd tải bằng tay); file mất (xoá nhầm/dọn
  // ổ đĩa) → đánh dấu lại `false` để tải lại, KHÔNG tin mù cờ cũ.
  const needed: VeoPrompt[] = [];
  let flagsChanged = false;
  for (const p of prompts) {
    if (p.status !== "success") continue; // chưa tạo+đổi tên xong trong Flow, chưa tải được
    const outFile = clipFilePath(clipDir, p.index);
    const fileExists = await fs.access(outFile).then(() => true).catch(() => false);
    if (fileExists) {
      if (!p.isDownloaded) {
        p.isDownloaded = true;
        flagsChanged = true;
      }
    } else {
      if (p.isDownloaded) {
        p.isDownloaded = false; // cờ nói đã tải nhưng file không còn — coi như chưa tải, tải lại
        flagsChanged = true;
      }
      needed.push(p);
    }
  }
  if (flagsChanged) await savePromptsProgress(prompts);

  console.log(`[download] ${needed.length} cảnh đã "success" trong Flow nhưng chưa tải (isDownloaded !== true).`);

  if (needed.length > 0) {
    const projectUrls = await loadKnownProjectUrls();
    if (projectUrls.length === 0) {
      throw new Error(`Không tìm thấy project Flow nào (state/projects.json / project.json trống) — chạy "npm run generate" trước.`);
    }

    const context = await launchVeo3Browser();
    try {
      const page = context.pages()[0] ?? (await context.newPage());
      const stillNeeded = new Map(needed.map((p) => [p.index, p]));

      // Mỗi project Flow có lưới media RIÊNG BIỆT (xem RUNBOOK mục 4.4) — 1 clip chỉ có thể
      // nằm ở ĐÚNG 1 project (tuỳ worker nào đã tạo nó lúc `npm run generate`), nên phải thử
      // lần lượt từng project đã biết cho đến khi tìm đủ, không giả định trước clip nào ở đâu.
      for (const projectUrl of projectUrls) {
        if (stillNeeded.size === 0) break;

        // XÁC NHẬN TRỰC TIẾP (2026-07-19): `state/projects.json` có thể chứa project ĐÃ HỎNG/
        // không truy cập được nữa (Flow báo "Something went wrong. Back to projects") — trước đây
        // `page.goto` + `waitForProjectReady` không có try/catch ở tầng NÀY, nên 1 project hỏng
        // làm crash TOÀN BỘ lệnh (throw thoát khỏi cả vòng lặp), dù project khác trong danh sách
        // vẫn còn dùng được và có thể chứa đủ clip cần tìm. Bọc try/catch để bỏ qua project hỏng,
        // thử tiếp project khác — không được để 1 project chết chặn cả lệnh.
        try {
          await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
          // Phát hiện NHANH trang báo lỗi ("Something went wrong. Back to projects" — xác nhận
          // trực tiếp 2026-07-19, project bị xoá/hỏng) thay vì để `waitForProjectReady` chờ hết
          // toàn bộ chuỗi timeout/reload (hàng chục giây tới vài phút) rồi mới throw.
          const brokenProject = await page
            .getByText("Something went wrong", { exact: false })
            .first()
            .isVisible({ timeout: 3000 })
            .catch(() => false);
          if (brokenProject) {
            console.warn(`[download] project "${projectUrl}" báo lỗi ("Something went wrong") — bỏ qua, thử project khác.`);
            continue;
          }
          await waitForProjectReady(page);
        } catch (err) {
          console.warn(`[download] project "${projectUrl}" không mở được (có thể đã hỏng/xoá) — bỏ qua, thử project khác: ${(err as Error).message}`);
          continue;
        }

        for (const p of [...stillNeeded.values()]) {
          const clipName = `clip_${String(p.index).padStart(3, "0")}`;
          const outFile = clipFilePath(clipDir, p.index);
          try {
            const found = await downloadClip(page, clipName, outFile);
            if (found) {
              console.log(`[download] đã tải cảnh #${p.index} (1080p): ${outFile}`);
              stillNeeded.delete(p.index);
              // Ghi ngay sau MỖI cảnh (không đợi xử lý xong cả hàng đợi) — resume-safe nếu lệnh
              // bị gián đoạn giữa chừng (mất mạng, đóng nhầm cửa sổ...), giống pattern đã dùng
              // cho `status` trong generate.ts::processQueue.
              p.isDownloaded = true;
              await savePromptsProgress(prompts);
            }
          } catch (err) {
            console.warn(`[download] lỗi tải cảnh #${p.index}, sẽ thử lại ở project khác/lần chạy sau: ${(err as Error).message}`);
          }
        }
      }

      if (stillNeeded.size > 0) {
        console.warn(
          `[download] KHÔNG tìm thấy ${stillNeeded.size} cảnh trong bất kỳ project nào đã biết: ` +
            `[#${[...stillNeeded.keys()].join(", #")}] — kiểm tra thủ công trong Flow (đã đổi tên đúng "clip_NNN" chưa), ` +
            `hoặc chạy lại "npm run download" sau.`
        );
      }
    } finally {
      await context.close().catch(() => {});
    }
  }

  // Ghép video cuối từ MỌI cảnh đã có file local (không chỉ cảnh vừa tải lần này) — cho phép
  // chạy "npm run download" nhiều lần, mỗi lần ghép lại đúng với những gì đã tải được tới lúc đó.
  const scenePairs: ScenePair[] = [];
  for (const p of prompts) {
    const outFile = clipFilePath(clipDir, p.index);
    const exists = await fs.access(outFile).then(() => true).catch(() => false);
    if (exists) scenePairs.push({ index: p.index, clipFile: outFile, audioFile: undefined });
  }

  if (scenePairs.length < prompts.length) {
    const missing = prompts.map((p) => p.index).filter((i) => !scenePairs.some((s) => s.index === i));
    console.error(
      `\n❌ CHƯA ĐỦ: mới có ${scenePairs.length}/${prompts.length} cảnh có file local. Thiếu: [#${missing.join(", #")}].` +
        `\nCảnh chưa "success" cần chạy lại "npm run generate"; cảnh đã "success" nhưng chưa tải được cần chạy lại "npm run download".`
    );
    process.exit(1);
  }

  const finalVideo = await assembleFinalVideo(scenePairs, config.outputDir);
  console.log(`\n✅ Hoàn tất đầy đủ ${scenePairs.length}/${prompts.length} cảnh: ${finalVideo}`);
}

main().catch((err) => {
  console.error("[download] lỗi:", err);
  process.exit(1);
});
