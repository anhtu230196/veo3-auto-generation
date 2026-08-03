/** Mở ảnh mới nhất ở kích thước thật để soi chất nét. Chỉ đọc. */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
const c = await launchVeo3Browser();
const p = c.pages()[0] ?? (await c.newPage());
await ensureProject(p);
await p.waitForTimeout(4000);
const src = await p.locator('a[aria-label="Generated image"] img, img[src*="getMediaUrlRedirect"]').first().getAttribute("src");
if (!src) throw new Error("không tìm thấy ảnh");
const url = src.startsWith("http") ? src : new URL(src, p.url()).toString();
console.log(`Ảnh: ${url}`);
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForTimeout(2500);
await p.screenshot({ path: "scripts/full-image.png", fullPage: false });
await c.close();
