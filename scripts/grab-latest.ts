/** Chụp lại lưới media hiện tại của project để soi kết quả bằng mắt. Chỉ đọc. */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
const c = await launchVeo3Browser();
const p = c.pages()[0] ?? (await c.newPage());
await ensureProject(p);
await p.waitForTimeout(4000);
await p.screenshot({ path: "scripts/latest-grid.png" });
await c.close();
