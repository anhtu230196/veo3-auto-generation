/**
 * Khảo sát (chỉ đọc) bảng chọn media: vì sao click card xong mà "Add to Prompt" vẫn
 * không bấm được. In ra cấu trúc card + trạng thái disabled của nút.
 *   npx tsx scripts/inspect-picker.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

const FILE = "reference-character.jpeg";

async function dumpButtons(page: import("playwright").Page, label: string) {
  console.log(`\n--- ${label} ---`);
  const btns = page.getByRole("button");
  for (let i = 0; i < (await btns.count()); i++) {
    const b = btns.nth(i);
    if (!(await b.isVisible().catch(() => false))) continue;
    const name = ((await b.getAttribute("aria-label")) || (await b.innerText().catch(() => "")))
      .replace(/\s+/g, " ")
      .trim();
    if (!name) continue;
    if (!/add to prompt|prompt|select|use|done|insert/i.test(name)) continue;
    console.log(
      `  "${name}" disabled=${await b.isDisabled().catch(() => "?")} aria-disabled=${await b.getAttribute("aria-disabled")}`
    );
  }
}

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  await ensureProject(page);

  // Vào chế độ Image rồi mở bảng chọn media.
  await page.locator('button:has-text("crop_16_9")').first().click();
  await page.waitForTimeout(1000);
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);

  await page.locator('button:has-text("add_2")').first().click();
  await page.waitForTimeout(2000);

  await dumpButtons(page, "TRƯỚC KHI CHỌN CARD");

  // Cấu trúc quanh text tên file — tìm phần tử THẬT SỰ click được.
  const textNode = page.locator(`text=${FILE}`).first();
  console.log(`\nSố node khớp text "${FILE}": ${await page.locator(`text=${FILE}`).count()}`);
  const html = await textNode
    .evaluate((el) => {
      const chain: string[] = [];
      let cur: Element | null = el;
      for (let i = 0; i < 6 && cur; i++) {
        chain.push(
          `${cur.tagName.toLowerCase()}` +
            `${cur.getAttribute("role") ? `[role=${cur.getAttribute("role")}]` : ""}` +
            `${cur.className ? `.${String(cur.className).split(" ")[0]}` : ""}` +
            `${cur.hasAttribute("data-state") ? `[data-state=${cur.getAttribute("data-state")}]` : ""}`
        );
        cur = cur.parentElement;
      }
      return chain.join("  <  ");
    })
    .catch((e) => `lỗi: ${e.message}`);
  console.log(`Chuỗi tổ tiên: ${html}`);

  await textNode.click();
  await page.waitForTimeout(1500);
  await dumpButtons(page, "SAU KHI CLICK VÀO TEXT TÊN FILE");
  await page.screenshot({ path: "scripts/picker-after-click.png" });

  console.log("\nĐã lưu scripts/picker-after-click.png");
  await page.waitForTimeout(2000);
  await context.close();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
