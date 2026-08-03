/**
 * Sinh 4 PHƯƠNG ÁN ảnh master reference nhân vật theo phong cách MỚI (2026-08-03) — nhân vật
 * dạng que, đầu tròn trắng to, 2 chấm mắt, miệng 1 nét ngang.
 *
 * VÌ SAO 4 PHƯƠNG ÁN: ảnh này sẽ KHOÁ CỨNG phong cách của MỌI nhân vật về sau (bài học
 * MASTER_REFERENCE_NOTE: mọi khiếm khuyết của ảnh gốc đều bị kế thừa y nguyên). Chọn kỹ 1 lần
 * rẻ hơn nhiều so với phát hiện lỗi sau khi đã tạo hàng chục nhân vật.
 *
 * KHÔNG đính ảnh reference nào — đây chính là ảnh sẽ TRỞ THÀNH reference, phải sinh từ chữ
 * thuần (đúng cách ảnh master cũ được tạo). Cũng KHÔNG dùng ảnh người dùng gửi làm
 * image-to-image: đó là khung hình từ video của kênh khác, dùng vậy là sao chép nét vẽ của họ.
 *
 * ⚠️ CÓ tạo media thật: 4 ảnh.
 *   npx tsx scripts/make-master-reference.ts
 */
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject } from "../src/veo3bot/project.js";

// Test theo yêu cầu người dùng 2026-08-03: thử lại style block CŨ (CHARACTER_STYLE_BLOCK
// trong styleDNA.ts, trước đây đánh dấu "chỉ còn giá trị lịch sử") + 1 ví dụ mô tả nhân vật
// tuỳ biến cụ thể do người dùng đưa, để xem có ra kết quả tốt hơn cách viết prompt cực chi
// tiết đang làm không. KHÔNG đính ảnh reference — test riêng bản thân đoạn text này.
const PROMPT_OLD_STYLE =
  "Minimalist character design, flat 2D vector art style, bold black outlines, completely " +
  "flat colors, no shading, no gradients. Round simple head, two black dot eyes, no nose or " +
  "mouth detail, square flat-colored torso, thin stick-line arms and legs with no hands or " +
  "feet detail, simple flat dark hair shape on top of head, slight sideburns. " +
  "Receding hairline with a bald patch on top of the head, short dark hair remaining only on " +
  "the sides, simple round glasses. Middle-aged man, wearing a plain dark suit and tie, " +
  "neutral standing pose, three-quarter angle. Plain solid color background for easy cutout.";

const PROMPT =
  "Minimalist stick-figure character in a flat 2D cartoon style. One single adult person " +
  "standing upright and facing straight forward, full body visible from head to feet, on a " +
  "plain solid single-colour light background with no scenery and no shadow. " +
  "HEAD: a very large white head taking up roughly one third of the whole body height, with a " +
  "bold black outline, drawn in a three-quarter turned pose. The head is mostly a large round " +
  "shape, but NOT a perfect circle: on the left side, add one small, gentle, rounded jut where " +
  "the jaw and chin would be, making that left side stick out slightly further and lower than " +
  "the smooth, simple, uninterrupted curve of the right side. This one small jaw bump is the " +
  "only sign that the head is turned — the rest of the outline is still a plain simple curve, " +
  "no other bumps. " +
  "FACE: two small solid black oval eyes, both clearly visible and separate from each other, " +
  "placed side by side within the left half of the face, near that jaw side, with a small gap " +
  "of plain white space between them and a wider gap of plain white space on the right half of " +
  "the face. Directly beneath the eyes, one short straight horizontal black line for the mouth, " +
  "also within that same left half. NO nose, NO eyebrows, NO ears, no cheeks, no other facial " +
  "detail, neutral expression. " +
  "HAIR: a small, compact, rounded cap of hair sitting ONLY on the very top of the head, like a " +
  "short cropped haircut. Its bottom edge is mostly a level, roughly horizontal curve that ends " +
  "well ABOVE eye height on both the left and right side of the head equally — the hair must " +
  "NOT extend down past the level of the eyes, must NOT drape down over the temples, ears, " +
  "cheeks or jaw, and the LEFT and RIGHT sides must end at the exact same height as each other. " +
  "The only exception: right at the horizontal centre of the forehead, add one small, gentle, " +
  "narrow triangular tuft that dips slightly lower than the rest of that level edge, like a " +
  "small centred cowlick or peak — this tuft is centred and small, it does not affect how low " +
  "the hair sits on the left side versus the right side. Below that edge, the sides and lower " +
  "two-thirds of the round head are bare white skin with no hair at all. One single flat dark " +
  "colour, no individual strands, no texture. " +
  "NECK: there is NO neck at all. The bottom of the head sits directly on the top of the " +
  "garment, touching it, with no gap and no visible neck line between them. " +
  "BODY: the torso is drawn only as a garment — one plain flat-coloured shape that reads as a " +
  "simple jacket or coat, narrow and roughly rectangular with softly rounded corners, filled " +
  "with a single flat colour and nothing else. " +
  "ARMS: two thin plain black lines that begin at the very top outer corners of the garment, " +
  "at shoulder height, and hang straight down close along the sides of the body. They must NOT " +
  "start up near the head and must NOT curve outward away from the body. NO hands are drawn, " +
  "each arm simply ends as a blunt line. " +
  "LEGS: two thin plain black lines dropping straight down from the bottom of the garment, " +
  "ending bluntly as bare lines with NO feet, NO shoes and no bend or hook at the bottom. " +
  "PROPORTIONS: the torso and limbs are small and thin compared with the oversized head. " +
  "Bold black outlines drawn freehand with a slightly wobbly marker line, completely flat " +
  "colour fills, no shading, no gradients, no drop shadows, no highlights.";

async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  const projectUrl = await ensureProject(page);
  console.log(`Project: ${projectUrl}`);

  // Chế độ Image + số lượng x4 (tab tên "x4", xem RUNBOOK 8.1 mục 3b về đổi tên "1x"→"x1").
  await page.locator('button:has-text("crop_16_9")').first().click({ timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.getByRole("tab", { name: "image Image" }).click();
  await page.getByRole("tab", { name: /^(x1|1x)$/ }).click({ timeout: 15000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(PROMPT_OLD_STYLE);

  console.log("Đang sinh 1 phương án đã siết prompt...");
  const t0 = Date.now();
  await page.locator('button:has-text("arrow_forward")').last().click();
  await page.waitForTimeout(90000);
  console.log(`Đã chờ ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  await page.screenshot({ path: "scripts/master-ref-oldstyle.png" });
  console.log("Đã lưu: scripts/master-ref-oldstyle.png");
  await context.close();
}

main().catch((e) => {
  console.error("❌ THẤT BẠI:", e.message);
  process.exit(1);
});
