/**
 * Runner tạo hàng loạt asset ảnh trong Google Flow (chế độ Image = Nano Banana 2),
 * resume-safe — tương đương `src/createAssets.ts` của pipeline video, nhưng cho kênh
 * kịch bản tuyển tập.
 *
 * Chạy:
 *   npx tsx src/nanoBanana/createImageAssets.ts <đường-dẫn-assets.json> [--case N]
 *
 * Ví dụ:
 *   npx tsx src/nanoBanana/createImageAssets.ts narration-scripts/chet-boi-phat-minh-cua-minh/assets.json --case 1
 *
 * ĐẶC TÍNH (bám đúng bài học đã có trong RUNBOOK):
 * - `status: "success"` → BỎ QUA hẳn ở lần chạy sau, không tra lại Flow (mục 4.18).
 * - Lỗi 1 asset KHÔNG làm chết cả mẻ: bắt try/catch NGAY TRONG vòng lặp, đánh dấu
 *   "failed" + ghi lastError, rồi đi tiếp (mục 4.18).
 * - Ghi lại file assets.json NGAY sau mỗi asset (atomic) — không đợi xong cả danh sách,
 *   để crash giữa chừng không mất tiến độ (mục 4.18/4.23).
 */
import path from "node:path";
import { launchVeo3Browser } from "../veo3bot/browser.js";
import { ensureProject } from "../veo3bot/project.js";
import { createImageIngredient } from "../veo3bot/imageAsset.js";
import { atomicWriteJson, loadAssetFile, type ImageAsset } from "./assets.js";
import {
  CHARACTER_PROMPT_PREFIX,
  PROP_STYLE_BLOCK,
  BASE_STYLE_BLOCK,
  BACKGROUND_STYLE_BLOCK,
  RESERVE_CHARACTER_SPACE_BLOCK,
  EYE_LEVEL_CAMERA_BLOCK,
  NO_PERSPECTIVE_BLOCK,
  LAYERED_DEPTH_LANDSCAPE_NOTE,
  INTERIOR_CORNER_NOTE,
  SIMPLIFY_DETAIL_BLOCK,
  HAND_DRAWN_LINE_BLOCK,
} from "./styleDNA.js";

const REFERENCE_CHARACTER = path.resolve("src/nanoBanana/reference-character.jpeg");

/**
 * Ghép prompt + quyết định có đính ảnh reference hay không, theo TỪNG LOẠI asset.
 *
 * QUAN TRỌNG (styleDNA.ts): CHỈ `character` mới đính `reference-character.jpeg`. Prop và
 * background KHÔNG đính — ảnh người làm reference sẽ kéo tỉ lệ/dáng người vào vật thể
 * (cùng bài học "ảnh thắng text" ở MASTER_REFERENCE_NOTE / ANIMAL_STYLE_BLOCK).
 */
function buildPrompt(asset: ImageAsset): { description: string; styleBlock: string; reference?: string } {
  switch (asset.type) {
    case "character":
      // CHARACTER_PROMPT_PREFIX đã mang toàn bộ chỉ dẫn phong cách, và ảnh reference mới là
      // thứ neo chính — nên styleBlock để rỗng, tránh nhồi thêm chữ mâu thuẫn với ảnh.
      return {
        description: `${CHARACTER_PROMPT_PREFIX} ${asset.description}`,
        styleBlock: "",
        reference: REFERENCE_CHARACTER,
      };
    case "prop":
      return { description: asset.description, styleBlock: PROP_STYLE_BLOCK };
    case "background": {
      // ⚠️ MẶC ĐỊNH LÀ "flat" — BÀI HỌC 2026-08-02: bản đầu của runner BỎ QUÊN
      // NO_PERSPECTIVE_BLOCK, khiến 2 cảnh tháp Eiffel đầu tiên ra phối cảnh 1 điểm tụ hút
      // sâu (vườn thu về phía cung điện, chân tháp hội tụ) — sai hẳn phong cách người dùng
      // định hướng (dải ngang phẳng kiểu phông sân khấu) và bị loại. `styleDNA.ts` đã có sẵn
      // block chống việc này từ đầu, chỉ là runner không dùng.
      const perspective =
        asset.composition === "layered"
          ? LAYERED_DEPTH_LANDSCAPE_NOTE
          : asset.composition === "corner"
            ? INTERIOR_CORNER_NOTE
            : NO_PERSPECTIVE_BLOCK;
      // 2 block dưới CHỈ thêm khi cảnh sẽ ghép nhân vật vào (xem ImageAsset.reserveCharacterSpace).
      const forCharacters = asset.reserveCharacterSpace
        ? ` ${RESERVE_CHARACTER_SPACE_BLOCK} ${EYE_LEVEL_CAMERA_BLOCK}`
        : "";
      // THỨ TỰ CÓ CHỦ ĐÍCH — HAND_DRAWN_LINE_BLOCK phải nằm CUỐI CÙNG: nó mâu thuẫn trực tiếp
      // với cụm "vector illustration" + "uniform-width outlines" trong BASE_STYLE_BLOCK ở đầu,
      // và cụm đứng sau mới thắng (xác nhận qua test 2026-08-02).
      return {
        description: asset.description,
        styleBlock:
          `${BASE_STYLE_BLOCK} ${BACKGROUND_STYLE_BLOCK} ${perspective}${forCharacters} ` +
          `${SIMPLIFY_DETAIL_BLOCK} ${HAND_DRAWN_LINE_BLOCK}`,
      };
    }
  }
}

async function main() {
  const [assetFilePath, ...rest] = process.argv.slice(2);
  if (!assetFilePath) {
    console.error("Thiếu tham số: đường dẫn tới assets.json");
    process.exit(1);
  }
  const caseFlagIndex = rest.indexOf("--case");
  const onlyCase = caseFlagIndex >= 0 ? Number(rest[caseFlagIndex + 1]) : undefined;

  const file = await loadAssetFile(assetFilePath);
  const todo = file.assets.filter(
    (a) => a.status !== "success" && (onlyCase === undefined || a.case === onlyCase)
  );

  const skipped = file.assets.filter((a) => a.status === "success").length;
  console.log(`Tập: ${file.episode}`);
  console.log(`Tổng ${file.assets.length} asset — đã xong ${skipped}, cần tạo ${todo.length}`);
  if (onlyCase !== undefined) console.log(`(chỉ chạy case ${onlyCase})`);
  if (todo.length === 0) {
    console.log("Không còn gì để tạo.");
    return;
  }

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}\n`);

  let ok = 0;
  const failed: string[] = [];
  for (const asset of todo) {
    const { description, styleBlock, reference } = buildPrompt(asset);
    console.log(`→ [${asset.type}] "${asset.name}" (case ${asset.case})`);
    const t0 = Date.now();
    try {
      await createImageIngredient(page, asset.name, description, styleBlock, projectUrl, reference);
      asset.status = "success";
      delete asset.lastError;
      ok++;
      console.log(`  ✅ ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } catch (e) {
      asset.status = "failed";
      asset.lastError = (e as Error).message;
      failed.push(asset.name);
      console.error(`  ❌ ${asset.lastError}`);
    }
    // Ghi ngay sau MỖI asset — crash ở asset sau không làm mất tiến độ đã có.
    await atomicWriteJson(assetFilePath, file);
  }

  console.log(`\nXong: ${ok} thành công, ${failed.length} lỗi.`);
  if (failed.length) {
    console.log(`Lỗi: ${failed.join(", ")}`);
    console.log("Chạy lại chính lệnh này để thử lại đúng những cái lỗi (cái đã xong sẽ bỏ qua).");
  }
  await context.close();
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
