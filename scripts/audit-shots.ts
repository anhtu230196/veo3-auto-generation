/**
 * TRA THẲNG FLOW xem mỗi shot đã có ảnh chưa, rồi GHI KẾT QUẢ vào trường `daTao` của từng shot
 * trong `.shots.json` (Tú yêu cầu 2026-09-28: "thêm tham số trong json để xác nhận được ảnh đó
 * tạo được chưa").
 *
 *   npx tsx scripts/audit-shots.ts --jobs narration-scripts/<tap>/case-N/case-N.jobs.json --project <khoa>
 *   ... --only C1-04c,C1-42b     chỉ kiểm vài shot (các shot khác giữ nguyên `daTao` cũ)
 *   ... --out output/audit-x     thư mục lưu ảnh từng shot (mặc định output/audit-<khoa>/)
 *
 * VÌ SAO KHÔNG TIN LOG CỦA run-shots.ts: log chỉ nói "lần chạy đó báo ✅". Nó không biết ảnh tạo
 * tay trên Flow, card bị đổi tên về sau, hay tên đặt nhầm lên ảnh khác (sự cố thật 2026-09-25:
 * runner báo ✅ nhưng 5 card cũ bị đổi tên nhầm). Script này tra đúng bằng ô "Search assets" —
 * cơ chế mà chip `@` của shot sau sẽ dùng — và đếm card mang ĐÚNG NGUYÊN tên (không khớp chuỗi
 * con như `assertAssetNamed`, nên tên là tiền tố của tên khác không lọt). Ngoại lệ duy nhất: nhãn
 * bị Flow CẮT bằng dấu ba chấm thì khớp theo phần còn lại và gắn cờ `khopCat` — xem `matchLabel`
 * trong scripts/lib/shotsStatus.ts (luồng img-pipeline-datao D03).
 *
 * Trường ghi vào mỗi shot (kiểu `DaTao` trong scripts/lib/shotsStatus.ts):
 *   "daTao": {
 *     "ok": true,              // true CHỈ KHI có đúng 1 card mang đúng nguyên tên `ten`
 *     "soCard": 1,             // 0 = chưa có; >1 = trùng tên, chip `@` sẽ đính nhầm được
 *     "ten": "<outName lúc kiểm>",
 *     "promptHash": "<sha1[:12] prompt đã sinh ra ảnh>",   // CHỈ khi runner đã ghi lúc tạo; audit không tự đặt
 *     "khopCat": true,         // chỉ có khi khớp qua nhãn bị cắt — không chắc chắn
 *     "kiemLuc": "<ISO>",
 *     "nguon": "audit-flow"
 *   }
 * `run-shots.ts` cũng ghi trường này ngay sau mỗi shot (`nguon: "run-shots"`); script này ghi đè
 * bằng kết quả tra thẳng Flow. `review_shots.py` đọc nó: `ten` lệch `outName` hiện tại → cần tạo
 * lại; `promptHash` lệch prompt hiện tại → ảnh trên Flow là của prompt cũ.
 *
 * ⚠️ `ok: true` chỉ chứng minh TÊN có trên Flow, không chứng minh ảnh đúng nội dung. Ảnh của
 * từng shot được lưu vào `--out` — vẫn phải xem bằng mắt.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "../src/config.js";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject, ASSET_PICKER_SELECTOR, dismissOverlays } from "../src/veo3bot/project.js";
import { matchLabel, shotsFileFor, writeDaTao, type DaTao } from "./lib/shotsStatus.js";

type Job = { id: string; outName: string; prompt: string };

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const jobsFile = arg("--jobs");
  const projectKey = arg("--project");
  if (!jobsFile || !projectKey) {
    console.error("Cần --jobs <.jobs.json> và --project <khoá project Flow>.");
    process.exit(2);
  }
  // ensureProject TẠO PROJECT MỚI khi khoá lạ — gõ sai khoá sẽ ra một project rỗng và báo mọi
  // shot "chưa có". Chỉ kiểm project đã có state.
  const stateFile = path.join(config.stateDir, `project-${projectKey.replace(/[^\w.-]+/g, "-")}.json`);
  if (!fs.existsSync(stateFile)) {
    console.error(`Không có ${stateFile} — khoá project "${projectKey}" chưa từng chạy. Kiểm lại khoá.`);
    process.exit(2);
  }
  const shotsFile = shotsFileFor(jobsFile);
  if (!shotsFile) {
    console.error(`Không thấy .shots.json cạnh ${jobsFile} — không có chỗ ghi \`daTao\`.`);
    process.exit(2);
  }

  const only = arg("--only")?.split(",").map((s) => s.trim()).filter(Boolean);
  let jobs: Job[] = JSON.parse(fs.readFileSync(jobsFile, "utf-8"));
  if (only) {
    const missing = only.filter((id) => !jobs.some((j) => j.id === id));
    if (missing.length) {
      console.error(`--only có id không nằm trong ${jobsFile}: ${missing.join(", ")}`);
      process.exit(2);
    }
    jobs = jobs.filter((j) => only.includes(j.id));
  }
  const outDir = arg("--out") ?? path.join("output", `audit-${projectKey}`);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  await ensureProject(page, projectKey);
  await page.waitForTimeout(3000);

  const kiemLuc = new Date().toISOString();
  const found = new Map<string, { soCard: number; saved: boolean; cat: boolean }>();
  for (const j of jobs) {
    await dismissOverlays(page);
    await page.locator(ASSET_PICKER_SELECTOR).first().click({ timeout: 15000 });
    await page.waitForTimeout(1000);
    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    await search.fill(j.outName);
    await page.waitForTimeout(2500);
    const rows = page.locator('.cdk-overlay-container [role="option"]');
    const n = await rows.count();
    const hits: number[] = [];
    let cat = false;
    for (let i = 0; i < n; i++) {
      const kind = matchLabel(await rows.nth(i).innerText(), j.outName);
      if (!kind) continue;
      hits.push(i);
      if (kind === "cat") cat = true;
    }
    let saved = false;
    if (hits.length) {
      const src = await rows.nth(hits[0]).locator("img").first().getAttribute("src").catch(() => null);
      if (src) {
        const res = await page.request.get(new URL(src, new URL(page.url()).origin).toString());
        if (res.ok()) {
          fs.writeFileSync(path.join(outDir, `${j.id}.png`), await res.body());
          saved = true;
        }
      }
    }
    found.set(j.id, { soCard: hits.length, saved, cat });
    const tag = hits.length === 1 ? (cat ? "CAT  " : "OK   ") : hits.length ? "TRUNG" : "MAT  ";
    console.log(
      `${tag} ${j.id} x${hits.length} ${j.outName}${cat ? " (khớp qua nhãn bị cắt — không chắc chắn)" : ""}` +
        `${hits.length && !saved ? " (không tải được ảnh)" : ""}`
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }
  await context.close();

  const updates = new Map<string, (prev: DaTao | undefined) => DaTao>();
  for (const j of jobs) {
    const r = found.get(j.id)!;
    const ok = r.soCard === 1;
    updates.set(j.id, (prev) => {
      // `promptHash` = prompt đã sinh ra ảnh — chỉ runner biết (nhánh `created`). Audit KHÔNG BAO
      // GIỜ tự đặt dấu: lần kiểm này thấy vẫn cùng card thì giữ dấu cũ; chưa có dấu thì để trống.
      // Lấy prompt hiện tại thế vào sẽ lặng lẽ "hợp thức hoá" ảnh vẽ từ prompt cũ (luồng
      // img-pipeline-datao D04).
      const keepHash = ok && prev?.ok && prev.ten === j.outName ? prev.promptHash : undefined;
      return {
        ok,
        soCard: r.soCard,
        ten: j.outName,
        ...(keepHash ? { promptHash: keepHash } : {}),
        ...(r.cat ? { khopCat: true as const } : {}),
        kiemLuc,
        nguon: "audit-flow",
      };
    });
  }
  const written = writeDaTao(shotsFile, updates);

  const ok = [...found.values()].filter((r) => r.soCard === 1).length;
  console.log(`\nKhớp đúng 1 card: ${ok}/${found.size}. Đã ghi \`daTao\` cho ${written} shot vào ${shotsFile}`);
  console.log(`Ảnh từng shot (xem bằng mắt): ${outDir}`);
  process.exit(ok === found.size ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
