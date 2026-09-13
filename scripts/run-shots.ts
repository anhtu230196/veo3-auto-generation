/**
 * Chay mot <id>.jobs.json (do scripts/build_image_prompts.py --shots sinh ra) len Flow.
 *
 * Khac scripts/try-image-prompts.ts: file .tsv kia khong mang duoc quan he "anh nay dinh
 * asset kia lam reference". Runner nay doc dung hai truong ma SPEC-v2 muc 6 chot:
 *
 *   outName   -> ten card tao ra tren Flow
 *   refNames  -> mang flowAssetName cua asset DA CO trong Flow, dinh lam reference
 *
 * 🔴 HAI TEN DO PHAI KHAC NHAU. `createImageIngredient` mo dau bang nhanh chong tao trung
 * (`imageAsset.ts`): thay ten da ton tai la `return` NGAY, truoc ca buoc tao anh lan buoc
 * dinh reference. Lay ten asset lam ten dau ra thi Flow bo qua ca shot ma runner van bao
 * thanh cong — mat trang mot canh, khong mot dong loi. Builder da chan viec nay tu phia
 * JSON; day chi la lop thu hai.
 *
 *   npx tsx scripts/run-shots.ts --jobs image-prompts/nRiezhIOHH0.jobs.json --project asset-reuse-test
 *
 * --anchors <thu-muc>: ẢNH NEO PHONG CÁCH Tú gửi (mặc định input/style-ref/_anchors, xem
 * README ở đó). Ảnh neo được đính vào TRƯỚC refNames của từng shot — lần đầu là upload, các
 * shot sau Flow đã có nên `attachReferenceImage` dùng lại. Có `by-kind.json` trong thư mục thì
 * đính theo `kind` của shot, không thì đính hết. Truyền `none` để tắt.
 *
 * --aspect <ty-le>: mặc định `16:9`, nhận `9:16` / `1:1`, `none` = giữ cài đặt của project.
 * Đừng bỏ mặc: Flow LƯU tỷ lệ theo project, xem ghi chú trong `main()`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient, GenerationRejectedError } from "../src/veo3bot/imageAsset.js";

type Job = {
  id: string;
  segment: string;
  at: string;
  kind: string;
  outName: string;
  prompt: string;
  refNames: string[];
  /**
   * Ảnh neo phong cách đính SAU cùng thay vì trước. Builder bật cờ này cho shot
   * có `refImages` (ảnh chụp thật của nơi chốn đặc biệt): ảnh đính sau cùng có
   * vẻ là tín hiệu mạnh nhất, mà với shot đó thì thứ PHẢI thắng là nét vẽ tay,
   * không phải độ chính xác của ảnh chụp.
   */
  anchorsLast?: boolean;
  /**
   * Prompt dạng chip `@` xen giữa câu (cách Tú prompt) — xem `typeMentionPrompt` trong
   * imageAsset.ts. Khai trường này thì `prompt` không được gõ ra, câu mention thay hẳn nó.
   */
  promptParts?: Array<{ text: string } | { asset: string }>;
  /**
   * Shot mention tự mang ảnh của nó trong câu, nên runner KHÔNG đính thêm ảnh neo: ảnh nào
   * không được nhắc tên trong câu là ảnh không rõ vai, đúng cái mà cách này sinh ra để tránh.
   */
  noAnchors?: boolean;
};

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const ANCHOR_DIR_DEFAULT = "input/style-ref/_anchors";
const IMG_RE = /\.(png|jpe?g|webp)$/i;
const BY_KIND_FILE = "by-kind.json";

/**
 * Ảnh neo cho từng `kind`.
 *
 * Có `by-kind.json` trong thư mục ảnh neo thì đi theo nó (khoá `default` dùng cho `kind` không
 * khai riêng); không có thì đính HẾT ảnh trong thư mục — hành vi cũ.
 *
 * Vì sao cần tách theo loại: xem `_doc` trong chính file đó. Tóm một câu — shot một người đính
 * ảnh neo 5-người thì ra ba bản sao cùng một người, và ra sai tỷ lệ cơ thể vì không có ảnh neo
 * nào cùng bố cục để bắt chước.
 */
async function anchorResolver(dir: string): Promise<(kind: string) => string[]> {
  const all = (await fs.readdir(dir)).filter((n) => IMG_RE.test(n)).sort();
  const abs = (names: string[]) => names.map((n) => path.resolve(dir, n));

  const raw = await fs.readFile(path.join(dir, BY_KIND_FILE), "utf-8").catch(() => null);
  if (!raw) return () => abs(all);

  const map = JSON.parse(raw) as Record<string, string[] | unknown>;
  // Khoá bắt đầu bằng `_` là ghi chú cho người đọc (`_doc`), không phải một `kind`.
  const isKind = (k: string) => !k.startsWith("_");
  const pick = (k: string): string[] | undefined =>
    isKind(k) && Array.isArray(map[k]) ? (map[k] as string[]) : undefined;

  // Khai tên file không tồn tại thì DỪNG, đừng âm thầm đính thiếu: ảnh neo rớt là cả mẻ ra
  // sai phong cách mà không có một dòng lỗi nào.
  for (const [k, v] of Object.entries(map)) {
    if (!isKind(k) || !Array.isArray(v)) continue;
    const missing = (v as string[]).filter((n) => !all.includes(n));
    if (missing.length) {
      throw new Error(`${BY_KIND_FILE}: khoa "${k}" tro toi file khong co trong ${dir}: ${missing.join(", ")}`);
    }
  }

  return (kind: string) => abs(pick(kind) ?? pick("default") ?? all);
}

async function main() {
  const jobsFile = arg("--jobs");
  const projectKey = arg("--project") ?? "shots-run";
  const only = arg("--only");
  const anchorArg = arg("--anchors") ?? ANCHOR_DIR_DEFAULT;
  // 🔴 LUON CHOT TY LE, mac dinh 16:9 (`--aspect none` de giu cai dat cua project).
  //
  // Vi sao khong de trong: ty le duoc LUU THEO PROJECT tren Flow. Chay mot me voi
  // `--aspect 1:1` la project do nam o 1:1, va me sau KHONG truyen co gi se lang le ra
  // 512x512 vuong — dinh dang sai ma khong mot dong canh bao. Da dinh that vao project
  // reles-a1-fix ngay 2026-09-12.
  const aspectArg = arg("--aspect") ?? "16:9";
  const aspect = aspectArg === "none" ? undefined : aspectArg;
  if (!jobsFile) {
    console.error("Thieu --jobs <file.jobs.json>");
    process.exit(1);
  }

  let jobs: Job[] = JSON.parse(await fs.readFile(jobsFile, "utf-8"));
  if (only) jobs = jobs.filter((j) => only.split(",").includes(j.id));

  // Ảnh neo đi TRƯỚC asset nội dung — quy ước ở docstring `attachReferences`.
  // Ngoại lệ: job bật `anchorsLast` thì đẩy xuống cuối (xem type Job).
  const anchorsFor = anchorArg === "none" ? () => [] : await anchorResolver(anchorArg);
  for (const job of jobs) {
    if (job.noAnchors) continue;
    const anchors = anchorsFor(job.kind);
    if (!anchors.length) continue;
    job.refNames = job.anchorsLast
      ? [...job.refNames, ...anchors]
      : [...anchors, ...job.refNames];
  }

  console.log(`${jobs.length} shot tu ${jobsFile}`);
  console.log(`Project Flow: ${projectKey}`);
  console.log(`Ty le khung: ${aspect ?? "(giu cai dat cua project)"}`);
  console.log(
    anchorArg === "none"
      ? "Anh neo: KHONG (--anchors none)\n"
      : `Anh neo: theo ${anchorArg}\n`
  );

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page, projectKey);
  console.log(`Project: ${projectUrl}\n`);

  const log: Array<Job & { ok: boolean; secs: number; error?: string }> = [];
  let quotaStop = false;

  for (const job of jobs) {
    // Lop chan thu hai — xem docstring dau file.
    if (job.refNames.includes(job.outName)) {
      const error = `outName trung refNames (${job.outName}) — bo qua de khong mat canh im lang`;
      console.error(`→ ${job.id}  ❌ ${error}`);
      log.push({ ...job, ok: false, secs: 0, error });
      continue;
    }

    const ref = job.promptParts
      ? ` <- @mention ${job.promptParts
          .flatMap((p) => ("asset" in p ? [path.basename(p.asset)] : []))
          .join(", ")}`
      : job.refNames.length
        ? ` <- dinh ${job.refNames.map((r) => (IMG_RE.test(r) ? path.basename(r) : r)).join(", ")}`
        : "";
    console.log(`→ ${job.id} [${job.at}] "${job.outName}"${ref}`);
    const t0 = Date.now();
    try {
      await createImageIngredient(
        page,
        job.outName,
        job.prompt,
        "", // khoi style da nam san trong job.prompt
        projectUrl,
        job.refNames.length ? job.refNames : undefined,
        aspect,
        job.promptParts,
      );
      const secs = (Date.now() - t0) / 1000;
      log.push({ ...job, ok: true, secs });
      console.log(`  ✅ ${secs.toFixed(1)}s`);
    } catch (e) {
      const secs = (Date.now() - t0) / 1000;
      const error = (e as Error).message;
      log.push({ ...job, ok: false, secs, error });
      console.error(`  ❌ ${error}`);
      if (e instanceof GenerationRejectedError && e.quotaExhausted) quotaStop = true;
    }
    if (quotaStop) {
      console.error("\n⛔ Flow bao het han muc — dung tai day.");
      break;
    }
  }

  const outFile = path.resolve("output/run-shots-log.json");
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify({ jobsFile, projectKey, log }, null, 2), "utf-8");

  const ok = log.filter((l) => l.ok).length;
  console.log(`\nXong: ${ok}/${log.length}. Nhat ky: ${outFile}`);
  console.log(`Tai anh ve xem:\n  npx tsx scripts/download-flow-images.ts --project ${projectKey} --limit ${jobs.length} --out output/asset-reuse`);
  await context.close();
  // Che do CDP: context.close() la no-op nen phai exit tuong minh, neu khong node treo.
  process.exit(ok === log.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
