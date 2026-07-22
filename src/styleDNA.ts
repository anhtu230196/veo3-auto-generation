/**
 * "Style DNA" cho phong cách photorealistic cinematic (phim tài liệu/phim truyện người thật) —
 * nguồn duy nhất cho cả bước tạo Character asset (veo3bot/characters.ts) và viết prompt cảnh
 * (splitter/prompt-writer.ts), để đảm bảo nhất quán hình ảnh xuyên suốt video.
 * Đổi các hằng số này nếu sau này muốn chuyển sang phong cách khác.
 *
 * ĐỔI TỪ 2D FLAT VECTOR SANG PHOTOREALISTIC (2026-07-22): theo yêu cầu người dùng, chuyển hẳn
 * sang 1 project Flow MỚI (không tái dùng 31 Ingredient 2D cũ — xem RUNBOOK mục 0). Nguyên tắc
 * OUTLINE_BLOCK cũ (ép outline đậm nhất quán trên MỌI vật thể) được thay bằng PHOTOREAL_BLOCK
 * bên dưới — vai trò tương đương: chặn mô hình "trôi" sang illustration/CGI-render thay vì ảnh
 * thật, giống cách OUTLINE_BLOCK từng chặn trôi outline không nhất quán.
 */

export const STYLE_NAME = "photorealistic cinematic";

const STYLE_DESCRIPTOR =
  "photorealistic cinematic style, shot on 35mm film, natural realistic lighting and color " +
  "grading, lifelike skin texture and pores, realistic fabric weave and material texture, " +
  "authentic period film/documentary-drama aesthetic, natural color palette";

/**
 * Chặn mô hình "trôi" sang illustration/painting/CGI-render/cartoon — bắt buộc trên MỌI đối
 * tượng trong khung hình — TRÊN CẢ ảnh Ingredient neo (Character/Prop, xem
 * CHARACTER_SHEET_STYLE_BLOCK/SCENE_STILL_STYLE_BLOCK bên dưới) VÀ MỌI video prompt (append
 * bằng CODE trong prompt-writer.ts, giống cách làm với MOTION_SUFFIX/PERIOD_ANCHOR — không phụ
 * thuộc LLM có tuân thủ hay không). ĐÂY LÀ PHIÊN BẢN THAY THẾ OUTLINE_BLOCK cũ (2D flat vector)
 * — vai trò tương đương, chặn style drift, chỉ khác chiều: ép RA khỏi trông giống vẽ/render thay
 * vì ép outline nhất quán.
 */
export const PHOTOREAL_BLOCK =
  "Every person, animal, object, prop, piece of furniture, building, ship, and background " +
  "scenery element must look like it was captured by a real camera — natural photographic " +
  "detail, realistic texture, accurate light falloff and shadow. NO cartoon, NO illustration, " +
  "NO painting, NO flat color fills, NO cel-shading, NO 3D-CGI-render look, NO outlines around " +
  "objects or characters, NO stylization of any kind — everything must read as an authentic " +
  "photograph or live-action film frame, apply the SAME photorealistic treatment to foreground " +
  "characters AND background objects/scenery alike, with no exceptions.";

/** Dùng khi gửi prompt tạo Character asset (ảnh nền xanh, có turnaround) trong Flow. */
export const CHARACTER_SHEET_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, solid chroma-key green background (#00FF00), soft even studio ` +
  `lighting, full body character reference photo, front view and 3/4 view, 16:9 aspect ratio. ${PHOTOREAL_BLOCK}`;

/**
 * Dùng khi gửi prompt tạo Prop asset (ảnh nền xanh) trong Flow — TÁCH RIÊNG khỏi
 * CHARACTER_SHEET_STYLE_BLOCK. XÁC NHẬN TRỰC TIẾP (2026-07-22, người dùng cung cấp ảnh chụp
 * màn hình "The Brass Sextant"): dùng chung block Character cho Prop khiến model tự thêm TAY
 * NGƯỜI vào khung hình cầm vật thể — nghi ngờ nguyên nhân là cụm "full body character reference
 * photo, front view and 3/4 view" (ngôn ngữ dành cho chụp NGƯỜI) khiến model cố lấp đầy khung
 * bằng 1 chủ thể có thân/tay. Cùng lớp bài học đã gặp ở mục 4.11 (Setting dùng chung block
 * Character cũng ra kết quả sai) — mỗi loại Ingredient cần style block ĐÚNG NGỮ CẢNH của nó,
 * không tái dùng mù quáng.
 */
export const PROP_SHEET_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, solid chroma-key green background (#00FF00), soft even studio ` +
  "lighting, product/object reference photo, the object fully visible and isolated, straight-on " +
  "and three-quarter angle, no other context or scenery. NO people, NO human hands, NO human " +
  `body parts, NO human presence of any kind in the frame — the object alone. 16:9 aspect ratio. ${PHOTOREAL_BLOCK}`;

/**
 * Dùng khi sinh 4 ảnh still candidate cho 1 cảnh cụ thể có `needsAngleLock: true` (xem
 * `sceneImages.ts`) — THAY THẾ SETTING_SHEET_STYLE_BLOCK cũ (bỏ hẳn cơ chế tạo sẵn 1 ảnh bối
 * cảnh trống cho mọi địa điểm, xem RUNBOOK mục 0/4.11). KHÁC CHARACTER_SHEET_STYLE_BLOCK: đây
 * là ảnh still của ĐÚNG NỘI DUNG cảnh đó (có thể có người/hành động, không phải khung hình
 * trống) — KHÔNG nền xanh, KHÔNG turnaround, để sau này "Animate" trực tiếp thành video.
 */
export const SCENE_STILL_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, single still frame composition (not a turnaround, not a character ` +
  "sheet), natural environment/background — NOT a solid color backdrop, NOT a chroma-key green " +
  `screen. Full-bleed image filling the entire frame edge to edge, 16:9 aspect ratio. ${PHOTOREAL_BLOCK}`;

/** Chèn vào system prompt viết video prompt — mô tả tông màu/không khí theo mood cảnh. */
export const SCENE_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, single dominant color-grading shift per scene mood (warm amber for ` +
  "daylight interiors and calm negotiation scenes, cool blue-grey for tension or conflict " +
  "scenes, saturated warm tones for outdoor or festive/exploration scenes, deep desaturated " +
  "indigo with stars for night scenes), naturalistic atmospheric depth, 16:9 aspect ratio.";

/**
 * XÁC NHẬN TRỰC TIẾP (2026-07-20, cảnh #75 — "Robert standing in a doorway as a distressed family
 * ... plead with him"): Robert (có Character Ingredient, ảnh reference là 1 người đứng chiếm gần
 * hết khung hình để rõ mặt/trang phục) bị vẽ TO HƠN HẲN cả gia đình quần chúng đứng cạnh (không có
 * Ingredient, Veo3 tự vẽ tươi) — lệch tỉ lệ nghiêm trọng, gia đình trông như trẻ em/người tí hon
 * đứng cạnh Robert dù kịch bản không hề mô tả vậy. Nghi ngờ nguyên nhân: Veo3 giữ nguyên tỉ lệ
 * "nhân vật chiếm khung" từ chính ảnh Character reference (vốn được tạo để rõ chi tiết, không phải
 * để đúng tỉ lệ người thật) khi ghép vào cảnh mới, thay vì co lại đúng theo tỉ lệ người thật tương
 * đối với các nhân vật khác trong cùng khung hình.
 */
export const SCALE_CONSISTENCY_BLOCK =
  "All characters and figures in the frame — whether a named character referenced by an " +
  "Ingredient image or an unnamed background figure — must be drawn at the SAME consistent, " +
  "realistic human scale relative to each other, exactly as real people of similar age/height " +
  "would appear standing near one another. NO character should appear unnaturally larger or " +
  "smaller than the others just because of their own separate reference image's framing — adult " +
  "figures are all roughly the same height unless the scene explicitly describes a size " +
  "difference (child vs adult, distance from camera).";

/**
 * Suffix bắt buộc, append vào CUỐI mọi video prompt bằng code (không phụ thuộc LLM có
 * tuân thủ hay không) — giữ đúng style xuyên suốt và hạn chế lỗi Veo3 (camera động, hiệu
 * ứng lạ làm trôi phong cách). Gồm cả PHOTOREAL_BLOCK để đảm bảo MỌI cảnh (kể cả cảnh không có
 * Ingredient nào neo) đều được nhắc "phải trông như ảnh/phim thật" tường minh, không chỉ dựa vào
 * ảnh Character/Setting tham chiếu (cảnh mồ côi không có gì để "học" style từ đó). Gồm cả
 * SCALE_CONSISTENCY_BLOCK để chặn lỗi lệch tỉ lệ giữa nhân vật có Ingredient và nhân vật quần
 * chúng tự vẽ (mục 4.51 RUNBOOK).
 */
export const MOTION_SUFFIX =
  `Maintain the exact ${STYLE_NAME} style and color grading from the reference. Simple ` +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift. No glow, no sparkle, no lens " +
  "flares, no particle effects, no unnatural shine bursts or radiance around objects — " +
  `natural film lighting only, even on metal, gold, or gemstones. ${PHOTOREAL_BLOCK} ${SCALE_CONSISTENCY_BLOCK}`;

/**
 * Mốc thời đại của câu chuyện — đổi hằng số này nếu dự án khác dùng bối cảnh khác.
 * LÝ DO CẦN CÓ: những nhân vật/bối cảnh KHÔNG có Character asset (@mention) — vd thủy thủ
 * quần chúng, cảng, khu chợ — không có gì neo giữ hình ảnh, nên Veo3 mặc định vẽ theo nghĩa
 * HIỆN ĐẠI của các danh từ chung ("sailor", "harbor", "ship", "settler"...). Đã xác nhận
 * trực tiếp: prompt "a young unnamed sailor... merchant ship's deck" ra hình thủy thủ áo kẻ
 * sọc thời nay đứng cạnh container/cần cẩu cảng hiện đại, dù style đã là flat vector.
 */
export const ERA_DESCRIPTOR =
  "turn-of-the-20th-century golden age of polar exploration (roughly 1880s–1910s)";

/**
 * Append vào MỌI cảnh KHÔNG cố ý hiện đại (xem VeoPrompt.era trong prompt-writer.ts) — bằng
 * CODE, không phụ thuộc LLM tuân thủ, giống cách làm với MOTION_SUFFIX.
 */
export const PERIOD_ANCHOR =
  `${ERA_DESCRIPTOR} setting — period-accurate heavy fur parkas and hooded anoraks, wool ` +
  "coats, leather and sealskin boots, fur mittens; wooden dog sledges, wooden sail-and-steam " +
  "ships with tall masts and a single smokestack, oil lamps and brass navigation instruments; " +
  "in city scenes, early-1900s formal suits, waistcoats, high collars, long dresses, " +
  "horse-drawn carriages and brick or stone architecture. NO modern clothing, NO snowmobiles, " +
  "motorboats, aircraft, cars or trucks, NO plastic or synthetic materials, NO modern " +
  "buildings or equipment of any kind.";

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
  "A generic empty coastal landscape at dusk, photographed in a cinematic, photorealistic " +
  "documentary style — distant rocky cliffs, calm open sea, soft clouds, a few gulls in the " +
  "sky, no buildings, no landmarks. Full-bleed image filling the entire frame edge to edge: " +
  "NO decorative border, NO ornamental frame, NO vignette. NO people, NO figures, NO " +
  "characters, nothing living in the image.";

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
export const STYLE_ANCHOR_MENTION_SENTENCE = `Maintain the exact same photographic style as ${STYLE_ANCHOR_NAME}.`;
