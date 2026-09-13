/**
 * Tải ảnh của một mẻ về theo ĐÚNG TÊN CARD, mỗi file mang mã shot.
 *
 * Vì sao cần, chứ không dùng `download-flow-images.ts` chế độ lưới: lưới Flow xếp theo thời
 * gian, và **file upload nằm LẪN vào giữa loạt ảnh tạo ra** (ảnh neo upload ở shot đầu, ảnh tư
 * liệu của shot @mention upload ở giữa mẻ). Suy mã shot theo thứ tự lưới vì thế SAI — đã dính
 * thật 2026-09-12: tờ contact sheet 19 ảnh có 2 ô là ảnh upload và lệch nhãn từ đó trở đi.
 *
 * Chế độ `--name` của script kia tra đúng theo tên nhưng mỗi lần gọi lại mở browser + vào
 * project lại, 19 lần là ~10 phút. Script này mở một lần rồi tra lần lượt.
 *
 *   npx tsx scripts/download-by-names.ts --project reles-a1-final \
 *     --names output/a1/names.txt --out output/a1
 *
 * `--names`: mỗi dòng `<mã shot>|<tên card trên Flow>`.
 */
import path from "node:path";
import fs from "node:fs/promises";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject, dismissOverlays, ASSET_PICKER_SELECTOR } from "../src/veo3bot/project.js";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const projectKey = arg("--project");
  const namesFile = arg("--names");
  const outDir = path.resolve(arg("--out") ?? "output/by-names");
  if (!projectKey || !namesFile) {
    console.error("Thieu --project hoac --names");
    process.exit(1);
  }

  const rows = (await fs.readFile(namesFile, "utf-8"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf("|");
      return { id: l.slice(0, i), name: l.slice(i + 1) };
    });

  await fs.mkdir(outDir, { recursive: true });
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page, projectKey);
  console.log(`Project: ${projectUrl}\n${rows.length} ten can tai\n`);

  // Mở bảng chọn media MỘT LẦN rồi chỉ đổi nội dung ô search cho từng tên.
  // Dùng ĐÚNG selector mà `imageAsset.ts` vẫn mở bảng chọn bằng (`ASSET_PICKER_SELECTOR` =
  // nút "Add ingredients to the prompt box"). Selector `button[aria-label="Add media menu"]`
  // chép từ `download-flow-images.ts` KHÔNG còn khớp — mở không ra ô search.
  await page.waitForTimeout(3000);
  await dismissOverlays(page);
  await page.locator(ASSET_PICKER_SELECTOR).first().click({ timeout: 20000 });
  await page.waitForTimeout(1500);
  const search = page.getByRole("textbox", { name: /search assets/i }).first();
  if (!(await search.count())) throw new Error('Khong mo duoc o "Search assets".');

  let ok = 0;
  const missing: string[] = [];
  for (const { id, name } of rows) {
    await search.fill("");
    await page.waitForTimeout(400);
    await search.fill(name);
    await page.waitForTimeout(2500);

    // Nhãn thẻ bị cắt bằng dấu ba chấm với tên dài, nên khớp theo chiều "tên mình muốn
    // startsWith nhãn đang hiện" — cùng cách `typeMentionPrompt` dùng, cùng lý do.
    const cards = page.locator('[role="option"]');
    const n = await cards.count();
    let src: string | null = null;
    let best = -1;
    for (let i = 0; i < n; i++) {
      const raw = (await cards.nth(i).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
      const label = raw
        .replace(/\s+(Image|Video|Voice|Character|Avatar)$/i, "")
        .replace(/[…]|\.\.\.$/g, "")
        .trim();
      if (label.length < 6) continue;
      if (name.toLowerCase().startsWith(label.toLowerCase()) && label.length > best) {
        const s = await cards.nth(i).locator("img").first().getAttribute("src").catch(() => null);
        if (s) {
          src = s;
          best = label.length;
        }
      }
    }
    if (!src) {
      console.log(`  ✗ ${id} "${name}": khong thay card`);
      missing.push(`${id} (${name})`);
      continue;
    }

    const url = new URL(src, new URL(page.url()).origin).toString();
    const res = await page.request.get(url);
    if (!res.ok()) {
      console.log(`  ✗ ${id}: HTTP ${res.status()}`);
      missing.push(`${id} (HTTP ${res.status()})`);
      continue;
    }
    // Flow phục vụ ảnh dạng WebP — đừng hardcode .png (ffmpeg gãy ngay ở bước ghép sheet).
    const type = res.headers()["content-type"] ?? "";
    const ext = type.includes("webp") ? "webp" : type.includes("jpeg") ? "jpg" : "png";
    const file = path.join(outDir, `${id}.${ext}`);
    await fs.writeFile(file, await res.body());
    console.log(`  ✓ ${path.basename(file)}`);
    ok++;
  }

  console.log(`\nXong ${ok}/${rows.length} vao ${outDir}`);
  if (missing.length) console.log(`Thieu: ${missing.join(", ")}`);
  await context.close().catch(() => {});
  process.exit(missing.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
