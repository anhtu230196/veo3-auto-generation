/**
 * Tải ảnh của 1 project Flow về máy — pipeline vốn CHỈ tạo ảnh trên Flow, không có bước nào
 * mang ảnh về local (khác `src/downloadVideos.ts`, cái đó chỉ tải VIDEO).
 *
 * Vì sao cần: khi người dùng muốn XEM ảnh vừa tạo mà không tự mở Flow — ví dụ duyệt một mẻ
 * thử phong cách. Trước đây chỉ có ảnh chụp màn hình debug của runner, vốn chụp cả lưới nên
 * nhìn nhỏ và lẫn lộn.
 *
 * Chỉ ĐỌC: không tạo, không đổi tên, không xoá gì trong Flow. Không tốn credit.
 *
 * Cách dùng:
 *   npx tsx scripts/download-flow-images.ts --project <flowProject> [--limit N] [--out <thư mục>]
 *
 * `--project` lấy đúng giá trị `flowProject` trong assets.json/scenes.json của case. Bỏ trống
 * thì dùng project mặc định (`state/project.json`) — gần như luôn là điều bạn KHÔNG muốn, xem
 * skill `nano-banana-image-prompts` mục 11b.
 *
 * Ảnh lấy theo thứ tự Flow đang hiển thị (mới nhất trước), đặt tên `NN-<tên card>.png`.
 */
import path from "node:path";
import fs from "node:fs/promises";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const projectKey = arg("--project");
const limit = Number(arg("--limit") ?? "50");
const outDir = path.resolve(arg("--out") ?? "output/flow-images");
/**
 * Tra ảnh THEO TÊN thay vì lấy các ảnh mới nhất trên lưới.
 *
 * VÌ SAO CẦN: lưới media của Flow ảo hoá và chỉ giữ ~18 thẻ trong DOM bất kể cuộn thế nào (đã
 * thử `mouse.wheel` và đẩy `scrollTop` của khối cuộn cha, cả hai đều không làm tăng số thẻ).
 * Nên chế độ lưới CHỈ lấy được vài ảnh gần nhất — không tới được asset tạo từ trước.
 *
 * Bảng chọn media thì có ô "Search assets" lọc theo tên, đúng cơ chế mà `attachExistingAssets`
 * và `check-asset-in-picker.ts` đang dùng — đây là đường DUY NHẤT tới ảnh cũ.
 */
const nameQuery = arg("--name");

/** Bỏ ký tự không hợp lệ trong tên file Windows. */
const safe = (s: string) => s.replace(/[<>:"/\\|?*\x00-\x1f]/g, "").trim().slice(0, 60) || "untitled";

async function main() {
  if (!projectKey) {
    console.warn(
      "⚠️  Không truyền --project: sẽ mở project MẶC ĐỊNH, gần như chắc chắn không phải project bạn muốn.",
    );
  }

  const context = await launchVeo3Browser();
  const page = await context.newPage();
  const projectUrl = await ensureProject(page, projectKey);
  console.log("Project:", projectUrl);

  await fs.mkdir(outDir, { recursive: true });

  /** Tải 1 URL ảnh về file. Dùng request context của page nên đi kèm cookie đăng nhập. */
  const fetchTo = async (src: string, file: string) => {
    const url = new URL(src, "https://labs.google").toString();
    const res = await page.request.get(url);
    if (!res.ok()) {
      console.log(`  ✗ ${path.basename(file)}: HTTP ${res.status()}`);
      return false;
    }
    await fs.writeFile(file, await res.body());
    console.log(`  ✓ ${path.basename(file)}`);
    return true;
  };

  // ---- CHẾ ĐỘ TRA THEO TÊN (xem docstring của `nameQuery`) ----
  if (nameQuery) {
    await page.waitForTimeout(4000);
    await page.locator('button:has-text("add_2")').first().click({ timeout: 20_000 });
    await page.waitForTimeout(1500);
    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    if (!(await search.count())) throw new Error('Không mở được ô "Search assets".');
    await search.fill(nameQuery);
    await page.waitForTimeout(3000);

    const cards = page.locator('div[role="option"]');
    const n = await cards.count();
    console.log(`Tra "${nameQuery}": ${n} card.`);
    let ok = 0;
    for (let i = 0; i < Math.min(n, limit); i++) {
      const card = cards.nth(i);
      const label = (await card.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
      const src = await card.locator("img").first().getAttribute("src").catch(() => null);
      if (!src) continue;
      if (await fetchTo(src, path.join(outDir, `${String(i + 1).padStart(2, "0")}-${safe(label)}.png`))) ok++;
    }
    console.log(`\nĐã lưu ${ok} ảnh vào ${outDir}`);
    await context.close().catch(() => {});
    process.exit(0);
  }

  // Cùng selector mà imageAsset.ts dùng để dò ảnh mới (`firstImageSrc`).
  const links = page.getByRole("link", { name: "Generated image" });
  await links.first().waitFor({ timeout: 30_000 }).catch(() => {});

  // ⚠️ Lưới media của Flow ẢO HOÁ: chỉ render những thẻ đang lọt khung nhìn, nên đếm ngay lúc
  // mới mở chỉ ra ~18 ảnh dù project có hàng chục. Phải cuộn dần xuống đáy, mỗi vòng chờ thẻ
  // mới render rồi đếm lại, dừng khi số lượng không tăng nữa (hoặc đã đủ `limit`).
  // `page.mouse.wheel` KHÔNG ăn ở đây (đã thử): lưới nằm trong một khối cuộn riêng, không phải
  // window. Phải tìm đúng phần tử cha có overflow rồi đẩy scrollTop của chính nó.
  const scrollGrid = () =>
    page.evaluate(() => {
      const img = document.querySelector('a[aria-label="Generated image"], a[title="Generated image"]');
      let el: HTMLElement | null = (img as HTMLElement) ?? document.body;
      while (el && el !== document.body) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) {
          el.scrollTop = el.scrollHeight;
          return true;
        }
        el = el.parentElement;
      }
      window.scrollTo(0, document.body.scrollHeight);
      return false;
    });

  let seen = await links.count();
  for (let stable = 0; stable < 3 && seen < limit; ) {
    await scrollGrid();
    await page.waitForTimeout(900);
    const now = await links.count();
    if (now > seen) {
      seen = now;
      stable = 0;
    } else {
      stable++;
    }
  }
  // Cuộn lại lên đầu: các thẻ đầu tiên có thể đã bị gỡ khỏi DOM khi cuộn xuống.
  await page.keyboard.press("Home").catch(() => {});
  await page.waitForTimeout(800);

  const total = await links.count();
  console.log(`Thấy ${total} ảnh, tải ${Math.min(total, limit)} ảnh.`);


  const saved: string[] = [];
  for (let i = 0; i < Math.min(total, limit); i++) {
    const link = links.nth(i);
    const src = await link.locator("img").first().getAttribute("src");
    if (!src) continue;

    // Tên card nằm ở text trong chính thẻ link (Flow hiển thị tên dưới ảnh).
    const label = (await link.innerText().catch(() => "")) || "";
    const name = safe(label.split("\n").find((l) => l.trim() && l !== "Generated image") ?? `image-${i}`);

    const url = new URL(src, "https://labs.google").toString();
    // Dùng request context của chính page nên đi kèm cookie đăng nhập.
    const res = await page.request.get(url);
    if (!res.ok()) {
      console.log(`  ✗ ${name}: HTTP ${res.status()}`);
      continue;
    }
    const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}-${name}.png`);
    await fs.writeFile(file, await res.body());
    saved.push(file);
    console.log(`  ✓ ${path.basename(file)}`);
  }

  console.log(`\nĐã lưu ${saved.length} ảnh vào ${outDir}`);
  await context.close().catch(() => {});
  // Bắt buộc: ở chế độ CDP context.close() là no-op nên websocket giữ event loop sống mãi
  // (RUNBOOK mục 2 — "runner PHẢI process.exit() tường minh ở nhánh THÀNH CÔNG").
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
