/**
 * "Style DNA" cho phong cách 2D flat vector / motion graphic — nguồn duy nhất cho cả
 * bước tạo Character asset (veo3bot/characters.ts) và viết prompt cảnh
 * (splitter/prompt-writer.ts), để đảm bảo nhất quán hình ảnh xuyên suốt video.
 * Đổi các hằng số này nếu sau này muốn chuyển sang phong cách khác.
 */

export const STYLE_NAME = "2D flat vector illustration";

const STYLE_DESCRIPTOR =
  "2D flat vector illustration style, clean bold outlines, flat solid color fills with " +
  "minimal to no gradient shading, simplified geometric shapes and proportions, modern " +
  "motion-graphic aesthetic, limited flat color palette";

/**
 * Outline bắt buộc trên MỌI đối tượng trong khung hình — TRÊN CẢ ảnh Ingredient neo
 * (Character/Prop/Setting/Style Anchor, xem CHARACTER_SHEET_STYLE_BLOCK/SETTING_SHEET_STYLE_
 * BLOCK bên dưới) VÀ MỌI video prompt (append bằng CODE trong prompt-writer.ts, giống cách
 * làm với MOTION_SUFFIX/PERIOD_ANCHOR — không phụ thuộc LLM có tuân thủ hay không).
 * LÝ DO PHẢI LIỆT KÊ TƯỜNG MINH CỤ THỂ (không chỉ nói "outlines" chung chung như trong
 * STYLE_DESCRIPTOR ở trên): cùng bài học đã xác nhận ở mục 4.16 RUNBOOK (glow/sparkle) — mô tả
 * chung chung không đủ để mô hình áp dụng NHẤT QUÁN cho MỌI loại vật thể (nhân vật, đạo cụ,
 * kiến trúc, cây cối, bầu trời...), phải liệt kê rõ từng nhóm đối tượng cần outline.
 */
export const OUTLINE_BLOCK =
  "Every character, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery shape (rocks, trees, clouds, waves) must have a clean, bold, uniform-width black " +
  "outline drawn around its entire silhouette — apply the SAME bold outline treatment to " +
  "foreground characters AND background objects/scenery alike, with no exceptions. No " +
  "outline-less soft-edge shapes, no faint/thin/broken outlines, no gaps in the outline where " +
  "two shapes overlap or meet.";

/** Dùng khi gửi prompt tạo Character/Prop asset (ảnh nền xanh, có turnaround) trong Flow. */
export const CHARACTER_SHEET_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, solid chroma-key green background (#00FF00), flat even lighting, ` +
  `full body character turnaround, front view and 3/4 view, 16:9 aspect ratio. ${OUTLINE_BLOCK}`;

/**
 * Dùng khi gửi prompt tạo Setting asset — KHÁC HẲN Character/Prop: xác nhận trực tiếp qua
 * ảnh render thật (2026-07-17), dùng chung CHARACTER_SHEET_STYLE_BLOCK cho Setting ra kết quả
 * SAI — nền xanh (đáng lẽ Setting phải LÀ nền thật) và tự chèn thêm người/turnaround vào ảnh
 * bối cảnh (vd "Pinta Deck" ra kèm 2 người "Front View"/"3/4 View" như đang tạo nhân vật).
 * Setting cần: ảnh nền THẬT (không nền xanh), KHÔNG có người/nhân vật nào trong khung.
 */
export const SETTING_SHEET_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, wide establishing-shot composition showing the full space, ` +
  "historically accurate architecture and interior/exterior details, natural environment " +
  "background — NOT a solid color backdrop, NOT a chroma-key green screen. Full-bleed image " +
  "filling the entire frame edge to edge: NO decorative border, NO ornamental frame, NO " +
  "vignette around the edges. NO people, NO characters, NO figures of any kind in the shot " +
  `— empty space only, 16:9 aspect ratio. ${OUTLINE_BLOCK}`;

/** Chèn vào system prompt viết video prompt — mô tả tông màu/không khí theo mood cảnh. */
export const SCENE_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, single dominant color palette shift per scene mood (warm amber for ` +
  "daylight interiors and calm negotiation scenes, cool blue-grey for tension or conflict " +
  "scenes, saturated warm tones for outdoor or festive/exploration scenes, deep indigo with " +
  "stars for night scenes), flat atmospheric background shapes, 16:9 aspect ratio.";

/**
 * Suffix bắt buộc, append vào CUỐI mọi video prompt bằng code (không phụ thuộc LLM có
 * tuân thủ hay không) — giữ đúng style xuyên suốt và hạn chế lỗi Veo3 (camera động, hiệu
 * ứng lạ làm trôi phong cách). Gồm cả OUTLINE_BLOCK để đảm bảo MỌI cảnh (kể cả cảnh không có
 * Ingredient nào neo) đều được nhắc outline tường minh, không chỉ dựa vào ảnh Character/Setting
 * tham chiếu (cảnh mồ côi không có gì để "học" outline từ đó).
 */
export const MOTION_SUFFIX =
  `Maintain the exact ${STYLE_NAME} style and color palette from the reference. Simple ` +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no light " +
  "flares, no particle effects, no shine bursts or radiance around objects — flat matte " +
  `surfaces only, even on metal, gold, or gemstones. ${OUTLINE_BLOCK}`;

/**
 * Mốc thời đại của câu chuyện — đổi hằng số này khi bắt đầu 1 project mới.
 * LÝ DO CẦN CÓ: những nhân vật/bối cảnh KHÔNG có Character asset (@mention) — vd thủy thủ
 * quần chúng, cảng, khu chợ — không có gì neo giữ hình ảnh, nên Veo3 mặc định vẽ theo nghĩa
 * HIỆN ĐẠI của các danh từ chung ("sailor", "harbor", "ship", "settler"...). Đã xác nhận
 * trực tiếp: prompt "a young unnamed sailor... merchant ship's deck" ra hình thủy thủ áo kẻ
 * sọc thời nay đứng cạnh container/cần cẩu cảng hiện đại, dù style đã là flat vector.
 *
 * (2026-07-31) Cả 2 project trước đó (Columbus, Bắc Cực) đã bị xoá — để trống, PHẢI điền lại
 * đúng thời đại/trang phục/phương tiện của câu chuyện mới trước khi viết prompts.json.
 */
export const ERA_DESCRIPTOR = "";

/**
 * Append vào MỌI cảnh KHÔNG cố ý hiện đại (xem VeoPrompt.era trong prompt-writer.ts) — bằng
 * CODE, không phụ thuộc LLM tuân thủ, giống cách làm với MOTION_SUFFIX. Để trống cho tới khi
 * ERA_DESCRIPTOR ở trên được điền lại cho project mới (xem ghi chú 2026-07-31 ở trên).
 */
export const PERIOD_ANCHOR = "";

/**
 * LẦN 1 ĐÃ THỬ VÀ BỎ (2026-07-16) — "Style Anchor" tạo qua "Create Character": công cụ này
 * luôn ra 1 NHÂN VẬT NGƯỜI cụ thể dù mô tả là vật thể/khung trừu tượng. Gắn vào mọi cảnh khiến
 * nhân vật đó đè lên bất kỳ người vô danh nào trong cảnh — xác nhận trực tiếp: cảnh "a young
 * unnamed mapmaker" ra đúng hình người của Style Anchor (áo hoodie cam) thay vì người chung
 * chung đúng thời đại. KHÔNG dùng "Create Character" cho việc này nữa.
 *
 * LẦN 2 ĐÃ THỬ VÀ SỬA (2026-07-17) — mô tả ban đầu là "khung viền trang trí" (ornate corner
 * ornament, filigree border) — XÁC NHẬN TRỰC TIẾP: chính vì mô tả nội dung ảnh neo LÀ 1 khung
 * viền, nên khi tham chiếu style, Veo3 kéo luôn khung viền đó vào video (viền vàng trang trí
 * hiện quanh khung hình). Sửa: đổi hẳn nội dung ảnh neo thành 1 BỨC PHONG CẢNH thường (full-
 * bleed, không khung/viền) — ảnh tham chiếu phải LÀ đúng loại nội dung ta muốn Veo3 học theo
 * (phong cảnh), không phải 1 vật trang trí có hình dạng khung.
 *
 * Vẫn dùng CHUNG cơ chế: tạo qua imageAsset.ts::createImageIngredient (chế độ Image — KHÔNG
 * qua "Create Character"), và thêm câu tường minh trong text prompt (STYLE_ANCHOR_MENTION_
 * SENTENCE) bên cạnh chip @mention thật.
 */
export const STYLE_ANCHOR_NAME = "Style Anchor";

export const STYLE_ANCHOR_DESCRIPTION =
  "A generic empty coastal landscape at dusk — distant rocky cliffs, calm open sea, soft " +
  "clouds, a few gulls in the sky, no buildings, no landmarks, every shape (cliffs, waves, " +
  "clouds, gulls) drawn with a clean bold black outline. Full-bleed image filling the " +
  "entire frame edge to edge: NO decorative border, NO ornamental frame, NO vignette. NO " +
  "people, NO figures, NO characters, nothing living in the image.";

/**
 * Câu tường minh nhắc tới Style Anchor NGAY TRONG TEXT của video prompt — mục đích: giúp mô
 * hình hiểu đây là tham chiếu phong cách, không phải lệnh chèn vật thể cụ thể vào khung hình.
 *
 * KHÔNG viết sẵn dấu "@" trước tên (XÁC NHẬN TRỰC TIẾP 2026-07-18, RUNBOOK mục 4.25): gõ "@"
 * dạng CHỮ THẬT vào ô prompt (qua `page.keyboard.type`, không phải qua picker có kiểm soát) tự
 * mở luôn dialog chọn asset của Flow giữa chừng — làm hỏng cả đoạn text gõ sau đó. Để tên
 * "Style Anchor" xuất hiện TRẦN (không "@"), `findMentionOccurrences`/`fillPromptWithMentions`
 * (`generate.ts`) tự tìm đúng vị trí này trong câu và thay bằng chip @mention THẬT tại đó —
 * cùng kết quả cuối cùng (chip đứng đúng ngữ pháp câu), không cần bake "@" vào text nguồn.
 */
export const STYLE_ANCHOR_MENTION_SENTENCE = `Maintain the exact same illustration style as ${STYLE_ANCHOR_NAME}.`;
