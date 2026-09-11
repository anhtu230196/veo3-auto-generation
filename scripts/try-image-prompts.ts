/**
 * Chạy thử một mẻ nhỏ prompt từ `image-prompts/<id>.prompts.tsv` lên Flow (chế độ Image),
 * để soi xem prompt viết ra có dùng được không TRƯỚC khi chạy cả lô mấy trăm cái.
 *
 * Khác `src/nanoBanana/createImageAssets.ts` ở đúng một điểm: runner kia ghép style block
 * của `styleDNA.ts` (phong cách Brofessor Stein) vào mô tả, còn ở đây prompt đã có sẵn khối
 * style riêng do `scripts/build_image_prompts.py` nối vào, nên truyền NGUYÊN VĂN và để
 * styleBlock rỗng. Trộn hai bộ style vào nhau là hỏng cả phép thử.
 *
 * Cách dùng:
 *   npx tsx scripts/try-image-prompts.ts --prompts image-prompts/nRiezhIOHH0.prompts.tsv \
 *     --limit 10 --project style-test-mspaint
 *
 * ⚠️ TỐN CREDIT THẬT. Mặc định `--limit 10`, đừng bỏ cờ đó đi.
 *
 * Lưu ý: `createImageIngredient` gõ vào Flow theo dạng `${name}: ${description}. ${styleBlock}`
 * — tức tên asset LÀ một phần prompt. Nên tên ở đây đặt bằng chính vài chữ đầu của mô tả để
 * không chèn chữ lạ (mã "A1-01" mà lọt vào prompt thì model sẽ vẽ luôn chữ đó ra ảnh).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient, GenerationRejectedError } from "../src/veo3bot/imageAsset.js";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

type Row = { code: string; stamp: string; prompt: string };

async function readRows(file: string, limit: number): Promise<Row[]> {
  const text = await fs.readFile(file, "utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const out: Row[] = [];
  for (const line of lines.slice(1)) {
    const [code, stamp, prompt] = line.split("\t");
    if (!code || !prompt) continue;
    out.push({ code, stamp, prompt });
    if (out.length >= limit) break;
  }
  return out;
}

/** Vài chữ đầu của mô tả, Title Case — dùng làm tên card trong Flow. */
function nameFor(prompt: string): string {
  const subject = prompt.split(". Use a white background")[0] ?? prompt;
  return subject
    .replace(/^(a|an|the)\s+/i, "")
    .split(/\s+/)
    .slice(0, 5)
    .join(" ")
    .replace(/[^\w\s-]/g, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const promptsFile = arg("--prompts");
  const limit = Number(arg("--limit") ?? "10");
  const projectKey = arg("--project") ?? "style-test";
  if (!promptsFile) {
    console.error("Thiếu --prompts <file.tsv>");
    process.exit(1);
  }

  const rows = await readRows(promptsFile, limit);
  console.log(`${rows.length} prompt từ ${promptsFile}`);
  console.log(`Project Flow: ${projectKey}\n`);

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page, projectKey);
  console.log(`Project: ${projectUrl}\n`);

  const log: Array<Row & { name: string; ok: boolean; secs: number; error?: string }> = [];
  let quotaStop = false;

  for (const row of rows) {
    const name = nameFor(row.prompt);
    console.log(`→ ${row.code} [${row.stamp}] "${name}"`);
    const t0 = Date.now();
    try {
      // styleBlock rỗng: khối style đã nằm sẵn trong row.prompt.
      await createImageIngredient(page, name, row.prompt, "", projectUrl);
      const secs = (Date.now() - t0) / 1000;
      log.push({ ...row, name, ok: true, secs });
      console.log(`  ✅ ${secs.toFixed(1)}s`);
    } catch (e) {
      const secs = (Date.now() - t0) / 1000;
      const error = (e as Error).message;
      log.push({ ...row, name, ok: false, secs, error });
      console.error(`  ❌ ${error}`);
      if (e instanceof GenerationRejectedError && e.quotaExhausted) quotaStop = true;
    }
    if (quotaStop) {
      console.error("\n⛔ Flow báo hết hạn mức — dừng mẻ tại đây.");
      break;
    }
  }

  const outFile = path.resolve("output/style-test-log.json");
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify({ promptsFile, projectKey, log }, null, 2), "utf-8");

  const ok = log.filter((l) => l.ok).length;
  console.log(`\nXong: ${ok}/${log.length} thành công. Nhật ký: ${outFile}`);
  console.log(`Tải ảnh về xem:\n  npx tsx scripts/download-flow-images.ts --project ${projectKey} --limit ${limit} --out output/style-test`);
  await context.close();
  // Ở chế độ CDP, context.close() bị vô hiệu hoá nên websocket giữ event loop sống — phải
  // exit tường minh, nếu không tiến trình treo sau khi đã chạy xong (xem createImageAssets.ts).
  process.exit(ok === log.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
