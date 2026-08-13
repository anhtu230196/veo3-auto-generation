/**
 * Runner tạo hàng loạt CẢNH GHÉP từ `scenes.json` — thay cho việc viết riêng 1 file .ts cho
 * mỗi cảnh (cách làm cũ: `scripts/make-a-fei-*.ts`, `scripts/test-character-in-background.ts`).
 * Dùng lại nguyên `createImageIngredient` (đã hỗ trợ `reference: string[]` để đính nhiều asset
 * có sẵn qua `attachExistingAssets`) — không viết lại logic generate/poll/reload-recheck/rename
 * đã test kỹ (RUNBOOK mục 4.14/4.15/4.18), chỉ khác nguồn dữ liệu.
 *
 * Chạy:
 *   npx tsx src/nanoBanana/createSceneComposites.ts <đường-dẫn-scenes.json> [--case N]
 *
 * Cùng đặc tính resume-safe/atomic-write/lỗi-1-cảnh-không-giết-cả-mẻ như `createImageAssets.ts`.
 *
 * ⚠️ Scene có `references` trỏ tới 1 scene KHÁC trong cùng file (kỹ thuật "sửa nhỏ trên ảnh đã
 * ghép sẵn", mục 8.2g) — scene đó PHẢI `status: "success"` (đã tồn tại thật trong Flow) trước
 * khi chạy scene phụ thuộc nó. Thứ tự các entry trong mảng `scenes` phải phản ánh đúng phụ
 * thuộc này; runner KHÔNG tự sắp xếp lại.
 */
import { launchVeo3Browser } from "../veo3bot/browser.js";
import { ensureProject } from "../veo3bot/project.js";
import { createImageIngredient } from "../veo3bot/imageAsset.js";
import { atomicWriteJson, loadSceneFile } from "./scenes.js";
import {
  SCENE_CHARACTER_VIEW_BLOCK,
  SCENE_CHARACTER_VIEW_REMINDER,
} from "./styleDNA.js";

async function main() {
  const [sceneFilePath, ...rest] = process.argv.slice(2);
  if (!sceneFilePath) {
    console.error("Thiếu tham số: đường dẫn tới scenes.json");
    process.exit(1);
  }
  const caseFlagIndex = rest.indexOf("--case");
  const onlyCase = caseFlagIndex >= 0 ? Number(rest[caseFlagIndex + 1]) : undefined;

  const file = await loadSceneFile(sceneFilePath);
  const todo = file.scenes.filter(
    (s) => s.status !== "success" && (onlyCase === undefined || s.case === onlyCase)
  );

  const skipped = file.scenes.filter((s) => s.status === "success").length;
  console.log(`Tập: ${file.episode}`);
  console.log(`Tổng ${file.scenes.length} cảnh — đã xong ${skipped}, cần tạo ${todo.length}`);
  if (onlyCase !== undefined) console.log(`(chỉ chạy case ${onlyCase})`);
  if (todo.length === 0) {
    console.log("Không còn gì để tạo.");
    return;
  }

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page, file.flowProject);
  console.log(`Project: ${projectUrl}\n`);

  let ok = 0;
  const failed: string[] = [];
  for (const scene of todo) {
    console.log(`→ "${scene.name}" (case ${scene.case}) — refs: ${scene.references.join(", ")}`);
    const t0 = Date.now();
    try {
      // KHOÁ góc 3/4 ở CẢ ĐẦU LẪN CUỐI prompt (công thức chống "ảnh thắng chữ", RUNBOOK
      // 8.1.3f). `styleBlock` được createImageIngredient nối vào cuối, nên đó đúng là chỗ
      // "nhắc lại". Không để scene tự viết tay 2 đoạn này — dễ quên, mà quên thì nhân vật bị
      // nắn thẳng về chính diện và chỉ phát hiện được bằng mắt.
      await createImageIngredient(
        page,
        scene.name,
        `${SCENE_CHARACTER_VIEW_BLOCK} ${scene.prompt}`,
        SCENE_CHARACTER_VIEW_REMINDER,
        projectUrl,
        scene.references
      );
      scene.status = "success";
      delete scene.lastError;
      ok++;
      console.log(`  ✅ ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } catch (e) {
      scene.status = "failed";
      scene.lastError = (e as Error).message;
      failed.push(scene.name);
      console.error(`  ❌ ${scene.lastError}`);
    }
    // Ghi ngay sau MỖI cảnh — crash ở cảnh sau không làm mất tiến độ đã có.
    await atomicWriteJson(sceneFilePath, file);
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
