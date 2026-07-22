import type { Page } from "playwright";
import type { VeoPrompt } from "../splitter/prompt-writer.js";
import { debugCapture, debugLog } from "./debug.js";
import { ensureModelAndDuration, firstVideoSrc, renameLatestVideo } from "./generate.js";

const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 5000;
const RELOAD_RECHECK_TIMEOUT_MS = 90 * 1000;

/**
 * ⚠️ CHƯA XÁC NHẬN TRỰC TIẾP (chưa chạy thử thật, xem RUNBOOK mục 0/kế hoạch triển khai) — mọi
 * selector dưới đây là SUY ĐOÁN dựa trên pattern đã dùng ổn định ở nơi khác trong codebase này
 * (right-click + menuitem như `imageAsset.ts::createImageIngredient` rename, tìm ảnh bằng ô
 * search như `download.ts::downloadClip`, chờ video mới bằng `firstVideoSrc` baseline-diff như
 * `generate.ts::generateOneClip`). Người dùng xác nhận Flow CÓ tính năng "Animate" khi right-
 * click 1 ảnh, nhưng chưa rõ UI CHÍNH XÁC mở ra sau đó (modal tại chỗ hay điều hướng trang khác,
 * có cần gõ lại prompt/chọn duration hay không). PHẢI chạy thử tay trên 2-3 cảnh thật, sửa lại
 * theo debug capture thực tế trước khi tin tưởng chạy đại trà — xem các điểm `debugCapture` bên
 * dưới, đó chính là nơi sẽ soi ra UI thật khi lỗi.
 */

/** Tìm đúng ảnh candidate đã chọn theo tên đã đổi lúc `sceneImages.ts` tạo (vd "017_2"). */
async function findSceneImage(page: Page, name: string) {
  const searchBox = page.locator('[data-testid="search-input"]').first();
  const hasSearchBox = (await searchBox.count()) > 0;
  if (hasSearchBox) {
    await searchBox.fill(name);
    await page.waitForTimeout(800);
  }
  const card = page.getByRole("link", { name: "Generated image" }).first();
  return { card, hasSearchBox, searchBox };
}

/**
 * "Animate" đúng ảnh candidate đã chọn (`{index}_{chosenImageIndex}`) thành video, thay vì
 * text-to-video thường — dùng cho cảnh có `needsAngleLock: true` đã có `chosenImageIndex` (xem
 * `generate.ts::processQueue`, gọi thay `generateOneClip` cho các cảnh này). Trả về "ok"/
 * "skipped" cùng contract với `generateOneClip` để `processQueue` xử lý thống nhất.
 */
export async function animateChosenImage(
  page: Page,
  prompt: VeoPrompt,
  clipName: string,
  projectUrl: string
): Promise<"ok" | "skipped"> {
  const imageName = `${String(prompt.index).padStart(3, "0")}_${prompt.chosenImageIndex}`;

  const { card, hasSearchBox, searchBox } = await findSceneImage(page, imageName);
  if (!(await card.count())) {
    await debugCapture(page, `animate-image-missing-scene${prompt.index}`);
    console.warn(`[animateImage] không tìm thấy ảnh "${imageName}" cho cảnh #${prompt.index} — bỏ qua.`);
    if (hasSearchBox) await searchBox.fill("").catch(() => {});
    return "skipped";
  }

  const baselineFirstSrc = await firstVideoSrc(page);
  debugLog("baseline", `animate cảnh #${prompt.index}: baselineFirstSrc=${baselineFirstSrc ?? "(none)"}`);

  await card.click({ button: "right" });
  const animateMenuItem = page.getByRole("menuitem", { name: /animate/i });
  try {
    await animateMenuItem.waitFor({ state: "visible", timeout: 8000 });
  } catch {
    await debugCapture(page, `animate-menuitem-missing-scene${prompt.index}`);
    throw new Error(`Không thấy menuitem "Animate" cho ảnh "${imageName}" (cảnh #${prompt.index}) — kiểm tra debug capture, selector có thể sai.`);
  }
  await animateMenuItem.click();
  if (hasSearchBox) await searchBox.fill("").catch(() => {});

  // SUY ĐOÁN: sau "Animate" có thể mở lại đúng bảng cài đặt Video (model/duration) như
  // ensureModelAndDuration đã xử lý cho text-to-video — gọi lại NGUYÊN hàm đó, best-effort
  // (không throw nếu pill "crop_16_9" không xuất hiện, coi như Animate không cần bước này).
  await page.waitForTimeout(1000);
  const settingsPill = page.locator('button:has-text("crop_16_9")').first();
  if (await settingsPill.count()) {
    try {
      await ensureModelAndDuration(page);
    } catch (err) {
      await debugCapture(page, `animate-settings-fail-scene${prompt.index}`);
      debugLog("animate", `cảnh #${prompt.index}: ensureModelAndDuration sau Animate lỗi (best-effort, tiếp tục): ${(err as Error).message}`);
    }
  }

  // SUY ĐOÁN: có thể cần gõ lại videoPrompt (mô tả hành động/chuyển động cho ảnh tĩnh) vào 1 ô
  // prompt xuất hiện sau "Animate" — chỉ gõ nếu THẤY ô contenteditable, bỏ qua nếu không (có
  // thể Animate tự dùng mô tả cảnh gốc, không cần gõ lại).
  const promptBox = page.locator('div[contenteditable="true"]').first();
  if (await promptBox.count()) {
    await promptBox.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(prompt.videoPrompt);
  }

  const generateButton = page.locator('button:has-text("arrow_forward")').last();
  try {
    await generateButton.waitFor({ state: "visible", timeout: 8000 });
    await generateButton.click();
  } catch {
    await debugCapture(page, `animate-generate-button-missing-scene${prompt.index}`);
    throw new Error(`Không thấy/bấm được nút generate sau "Animate" cho cảnh #${prompt.index} — kiểm tra debug capture.`);
  }

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let newVideoSrc: string | undefined;
  while (Date.now() < deadline) {
    const current = await firstVideoSrc(page);
    if (current !== undefined && current !== baselineFirstSrc) {
      newVideoSrc = current;
      break;
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!newVideoSrc) {
    console.log(`[animateImage] cảnh #${prompt.index} chưa thấy video sau ${GENERATE_TIMEOUT_MS / 60000} phút, reload để kiểm tra lại...`);
    await debugCapture(page, `animate-pre-reload-timeout-scene${prompt.index}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    while (!newVideoSrc && Date.now() < recheckDeadline) {
      const current = await firstVideoSrc(page);
      if (current !== undefined && current !== baselineFirstSrc) {
        newVideoSrc = current;
        break;
      }
      await page.waitForTimeout(POLL_INTERVAL_MS);
    }
    if (!newVideoSrc) {
      await debugCapture(page, `animate-timeout-scene${prompt.index}`);
      throw new Error(`Hết thời gian chờ "Animate" cho cảnh #${prompt.index} — kiểm tra thủ công trong Flow.`);
    }
  }

  await renameLatestVideo(page, clipName, newVideoSrc, prompt.index, projectUrl);
  return "ok";
}
