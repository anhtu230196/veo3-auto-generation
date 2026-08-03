/**
 * THỬ `HAND_DRAWN_LINE_BLOCK` trên ĐÚNG 1 cảnh đã có, để so sánh trực tiếp nét máy vs nét tay
 * mà KHÔNG phải tạo lại toàn bộ asset.
 *
 * Dùng lại nguyên văn description của "Tower Winter Dawn Flat" (cảnh người dùng đã duyệt về
 * bố cục) — chỉ thêm block nét tay. Nếu bố cục dải ngang GIỮ NGUYÊN mà nét thành nguệch ngoạc
 * thì block đạt; nếu layout bị vẽ lệch thì phải siết thêm câu bảo vệ bố cục.
 *
 * ⚠️ CÓ tạo media thật (tốn credit): 1 ảnh.
 *   npx tsx scripts/test-handdrawn.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";
import { createImageIngredient } from "../src/veo3bot/imageAsset.js";
import {
  BASE_STYLE_BLOCK,
  BACKGROUND_STYLE_BLOCK,
  NO_PERSPECTIVE_BLOCK,
  HAND_DRAWN_LINE_BLOCK,
} from "../src/nanoBanana/styleDNA.js";

const NAME = "Tower Winter Dawn Sketch";

// Nguyên văn description của "Tower Winter Dawn Flat" trong assets.json — giữ y hệt để phép
// so sánh chỉ khác đúng 1 biến: block nét tay.
const DESCRIPTION =
  "Flat side-on elevation of the base of a giant wrought-iron lattice tower standing on level " +
  "ground, drawn like a theatre backdrop. The picture is built from horizontal bands stacked " +
  "top to bottom: a pale grey-blue winter dawn sky band, one thin flat band of cold pale " +
  "yellow low near the horizon, a row of bare leafless trees and low dark hedges running " +
  "straight across the frame all at the same height, a flat pale gravel ground strip running " +
  "edge to edge, and a plain frost-white ground band across the bottom. The tower's two front " +
  "legs and the wide arch between them rise from that ground strip, both legs drawn at exactly " +
  "the same width and the same angle as each other, and the ground line beneath them is " +
  "perfectly horizontal and unbroken from the left edge to the right edge. Freezing early " +
  "morning palette of blue-greys, charcoal and pale cream";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);
  console.log(`Đang tạo "${NAME}" (nét tay)...`);

  const t0 = Date.now();
  await createImageIngredient(
    page,
    NAME,
    DESCRIPTION,
    // Đặt HAND_DRAWN_LINE_BLOCK CUỐI CÙNG: nó phải "ghi đè" cụm "vector / uniform-width" nằm
    // trong BASE_STYLE_BLOCK ở đầu, nên để sau cho model đọc được sau cùng.
    `${BASE_STYLE_BLOCK} ${BACKGROUND_STYLE_BLOCK} ${NO_PERSPECTIVE_BLOCK} ${HAND_DRAWN_LINE_BLOCK}`,
    projectUrl
  );
  console.log(`✅ Xong sau ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  await page.screenshot({ path: "scripts/test-handdrawn.png" });
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
