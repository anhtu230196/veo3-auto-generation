import type { Page } from "playwright";
import type { VeoPrompt } from "../splitter/prompt-writer.js";
import { createImageIngredient } from "./imageAsset.js";
import { SCENE_STILL_STYLE_BLOCK } from "../styleDNA.js";

const CANDIDATES_PER_SCENE = 4;

function sceneImageName(index: number, candidate: number): string {
  return `${String(index).padStart(3, "0")}_${candidate}`;
}

/**
 * Sinh CANDIDATES_PER_SCENE (4) ảnh still RIÊNG cho mỗi cảnh có `needsAngleLock: true` — THAY
 * THẾ cơ chế Setting Ingredient cũ (tạo sẵn 1 ảnh mù cho mọi địa điểm, xem RUNBOOK mục 0/4.11).
 * Đặt tên `{index đệm 3 số}_1`..`_4` để tìm lại được qua tên khi "Animate" (xem
 * `animateImage.ts`). Dùng lại NGUYÊN VẸN `createImageIngredient` (imageAsset.ts) — gọi 4 LẦN
 * ĐƠN thay vì tìm tab "4x" (nếu Flow có sẵn) để tái dùng 100% cơ chế baseline-diff+rename ĐÃ
 * CHỨNG MINH ổn định, không phát sinh rủi ro UI mới chưa xác nhận.
 *
 * KHÔNG có bước "đã tồn tại chưa" như Character/Prop — mỗi cảnh luôn sinh ảnh MỚI (tên theo
 * index nên không bao giờ trùng/cần tái sử dụng), chỉ dựa vào `imageStatus` để resume.
 *
 * RỦI RO ĐÃ BIẾT (chấp nhận, cùng đánh đổi đã dùng cho Character/Setting/Prop/clip video — xem
 * `generate.ts::generateClips`): nếu lỗi xảy ra GIỮA CHỪNG vòng lặp 4 ảnh (vd ảnh 3/4 lỗi), 2
 * ảnh đã tạo trước đó KHÔNG bị xoá — lần chạy lại (do `imageStatus` vẫn "failed"/"waiting") sẽ
 * tạo lại từ ảnh 1, để lại vài ảnh trùng không dùng trong Flow. Không tự động dọn, ưu tiên giữ
 * code đơn giản.
 */
export async function ensureSceneImagesInFlow(
  page: Page,
  prompts: VeoPrompt[],
  projectUrl: string,
  onProgress?: (prompts: VeoPrompt[]) => Promise<void> | void
): Promise<void> {
  const flagged = prompts.filter((p) => p.needsAngleLock);
  if (flagged.length === 0) {
    console.log("[sceneImages] không có cảnh nào needsAngleLock — bỏ qua.");
    return;
  }

  for (const prompt of flagged) {
    if (prompt.imageStatus === "success") {
      console.log(`[sceneImages] cảnh #${prompt.index} imageStatus=success, bỏ qua.`);
      continue;
    }

    console.log(`[sceneImages] đang sinh ${CANDIDATES_PER_SCENE} ảnh candidate cho cảnh #${prompt.index}...`);
    try {
      for (let candidate = 1; candidate <= CANDIDATES_PER_SCENE; candidate++) {
        const name = sceneImageName(prompt.index, candidate);
        // Mô tả = nguyên văn videoPrompt (đã gồm PERIOD_ANCHOR, giữ đúng thời đại) — MOTION_SUFFIX
        // đi kèm vô hại với ảnh tĩnh (chỉ là chỉ dẫn chuyển động, không áp dụng cho 1 khung hình),
        // KHÔNG cần tách riêng để giữ pipeline đơn giản (không có field nào lưu content-trước-suffix).
        await createImageIngredient(page, name, prompt.videoPrompt, SCENE_STILL_STYLE_BLOCK, projectUrl);
      }
      prompt.imageStatus = "success";
      console.log(
        `[sceneImages] đã sinh đủ ${CANDIDATES_PER_SCENE} ảnh cho cảnh #${prompt.index} — soi trong Flow rồi điền chosenImageIndex vào state/prompts.json.`
      );
    } catch (err) {
      prompt.imageStatus = "failed";
      console.error(
        `[sceneImages] LỖI sinh ảnh cho cảnh #${prompt.index}, đánh dấu failed để thử lại lần chạy sau: ${(err as Error).message}`
      );
    }
    await onProgress?.(prompts);
  }

  const failed = flagged.filter((p) => p.imageStatus === "failed");
  if (failed.length > 0) {
    console.warn(
      `[sceneImages] còn ${failed.length} cảnh lỗi sinh ảnh, cần chạy lại "npm run generate-images": ${failed
        .map((p) => `#${p.index}`)
        .join(", ")}`
    );
  }
}
