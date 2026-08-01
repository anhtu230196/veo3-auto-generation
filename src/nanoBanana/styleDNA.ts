/**
 * "Style DNA" cho hướng pipeline MỚI đang thử nghiệm: tạo ảnh (Character/Background) TRƯỚC
 * bằng Nano Banana (Gemini 2.5 Flash Image), rồi mới đưa vào bước image-to-video sau — khác
 * hẳn pipeline hiện tại (`src/styleDNA.ts`, `src/veo3bot/*`) là text-to-video thẳng qua Veo3/
 * Flow. Xem RUNBOOK.md mục 8 để biết bối cảnh đầy đủ.
 *
 * TRẠNG THÁI (2026-08-01): CHƯA có code automation nào gọi Nano Banana — mọi block dưới đây
 * chỉ mới được test TAY (dán prompt vào Gemini/Nano Banana ngoài repo, soi ảnh trả về bằng
 * mắt) và ĐÃ ĐƯỢC NGƯỜI DÙNG XÁC NHẬN HÀI LÒNG với kết quả. File này chỉ đúc kết lại các
 * block prompt đã xác nhận, CHƯA có hàm nào lắp ráp/gọi API/automation — bước tiếp theo (khi
 * làm automation Playwright thật) là viết file cùng cấp `generate.ts`/`imageAsset.ts` tương tự
 * `src/veo3bot/`, dùng lại các block ở đây.
 */

export const STYLE_NAME = "Nano Banana flat 2D vector (geometric-primitive, no-shading)";

/**
 * Áp dụng cho MỌI ảnh (Character lẫn Background) — phần lõi chung của phong cách.
 */
export const BASE_STYLE_BLOCK =
  "Flat 2D vector illustration style, bold uniform-width black outlines around every shape. " +
  "Completely flat color fills, no shading, no gradients, no drop shadows.";

/**
 * CHARACTER — đã dùng để tạo ra ảnh MASTER REFERENCE ban đầu (2026-08-01, mô tả NGẮN GỌN, cụ
 * thể từng bộ phận hiệu quả hơn hẳn mô tả dài dòng mơ hồ). CHỈ CÒN GIÁ TRỊ LỊCH SỬ/tài liệu
 * tham khảo — KHÔNG dùng lại để tạo nhân vật MỚI nữa, xem `CHARACTER_PROMPT_PREFIX` +
 * `MASTER_REFERENCE_NOTE` bên dưới cho quy trình chuẩn hiện tại.
 */
export const CHARACTER_STYLE_BLOCK =
  "Minimalist character design, flat 2D vector art style, bold black outlines, completely " +
  "flat colors, no shading, no gradients. Round simple head, two black dot eyes, no nose or " +
  "mouth detail, square flat-colored torso, thin stick-line arms and legs with no hands or " +
  "feet detail, simple flat hair shape on top of head. same style with reference image";

/**
 * ẢNH MASTER REFERENCE CHO NHÂN VẬT — QUYẾT ĐỊNH CUỐI CÙNG (2026-08-01): người dùng đã chốt
 * dùng ảnh nhân vật lính gác (mũ sắt, ria mép, áo khoác xanh lá, cầm giáo) làm ẢNH THAM CHIẾU
 * CỐ ĐỊNH cho MỌI nhân vật người sau này — CHẤP NHẬN LUÔN 2 điểm chưa hoàn hảo của chính ảnh
 * đó thay vì tiếp tục sửa (đã thử sửa bằng text 2 lần, model vẫn tự vẽ lại y hệt — quyết định
 * dừng lại, ưu tiên NHẤT QUÁN hơn hoàn hảo):
 * - Tay có 1 hình cùm/bàn tay đơn giản ở đầu que (không phải chỉ 1 đường thẳng trơn).
 * - Áo khoác có vạt loe nhẹ ở gấu (không phải hình chữ nhật phẳng tuyệt đối).
 * MỌI nhân vật tạo SAU NÀY sẽ tự động thừa hưởng ĐÚNG 2 đặc điểm này (vì dùng ảnh làm
 * reference) — đây là ĐÚNG Ý ĐỒ, không phải lỗi cần sửa tiếp mỗi lần.
 *
 * ✅ Đã lưu file thật (2026-08-01): `src/nanoBanana/reference-character.jpeg` — dùng đường dẫn
 * này khi automation hoá bước gọi Nano Banana sau này (đính kèm file này làm ảnh reference).
 */
export const MASTER_REFERENCE_NOTE =
  "Reference image: reference-character (soldier with helmet, moustache, green jacket, " +
  "holding a spear) — the single fixed visual anchor for ALL human characters going forward. " +
  "Its slightly-imperfect hand stump and jacket hem are INTENTIONALLY kept, not bugs to fix.";

/**
 * PREFIX CHUẨN để ghép trước mô tả nhân vật mới — dùng CHUNG cho MỌI nhân vật từ giờ trở đi,
 * LUÔN đính kèm ảnh master reference (xem MASTER_REFERENCE_NOTE) khi gửi prompt này. Đã bỏ hẳn
 * phần mô tả tư thế/biểu cảm/nền mặc định ("standing pose", "gentle expression", "same plain
 * background as reference"...) khỏi phần MÔ TẢ NHÂN VẬT — để trống cho người viết prompt tự
 * thêm tư thế/biểu cảm CỤ THỂ theo từng cảnh nếu cần, tránh lặp lại boilerplate không cần thiết.
 *
 * Cách dùng: `${CHARACTER_PROMPT_PREFIX} <mô tả nhân vật mới, càng ngắn gọn càng tốt>`
 */
export const CHARACTER_PROMPT_PREFIX =
  "Using the exact same illustration style as the attached reference image — same bold " +
  "uniform-width black outlines, same flat color fill with zero shading, same stick-line limb " +
  "treatment, same simplified head/eyes, no background:";

/**
 * CHECKLIST MÔ TẢ NHÂN VẬT — xác nhận 2026-08-01 sau khi test nhân vật lịch sử (Napoleon,
 * Thành Cát Tư Hãn, Cleopatra, Lincoln): mô tả CÀNG NGẮN, CÀNG ĐÚNG TRỌNG TÂM thì kết quả càng
 * ổn định. CHỈ mô tả đúng các mục sau khi viết phần nối sau `CHARACTER_PROMPT_PREFIX`:
 * - Trang phục (quần áo, phụ kiện đặc trưng cầm/đeo trên người).
 * - Tóc (kiểu dáng, màu sắc).
 * - Nón/mũ/khăn trùm đầu (NẾU nhân vật có đội gì đó).
 * - Râu (NẾU nhân vật nam có râu).
 * - Mắt (CHỈ mô tả khi nhân vật là NỮ — vd kẻ mắt, hình dáng mắt).
 *
 * TUYỆT ĐỐI KHÔNG mô tả:
 * - Dáng người/tỉ lệ cơ thể (chiều cao, gầy/béo...) — ảnh MASTER REFERENCE đã cố định cấu trúc
 *   thân hình + tay chân dạng que rồi, mô tả thêm dễ xung đột hoặc bị model tự vẽ lại thân hình
 *   sai khác đi.
 * - Biểu cảm khuôn mặt (vui/nghiêm nghị/tự tin...) — đây là lựa chọn RIÊNG theo từng cảnh cụ
 *   thể sau này, không phải đặc điểm NHẬN DẠNG cố định của nhân vật, không thuộc về bước tạo
 *   Character asset.
 *
 * KHÔNG dùng tên riêng người thật/nổi tiếng trong prompt (dù chỉ để mô tả, không cần đúng như
 * bộ lọc "prominent people" của Flow) — người dùng xác nhận trực tiếp: Nano Banana/Gemini
 * cũng chặn theo chính sách Google nếu gõ thẳng tên thật, dùng mô tả ngoại hình/trang phục để
 * thay thế (đúng tinh thần mục 4.28/4.40 RUNBOOK, nay áp dụng luôn cho Nano Banana).
 */
export const CHARACTER_DESCRIPTION_CHECKLIST = [
  "clothing (outfit + distinctive accessories worn/held)",
  "hair (style + color)",
  "headwear (hat/hood/headdress, only if the character wears one)",
  "facial hair (only if male character has a beard/moustache)",
  "eyes (only if the character is female — eyeliner, eye shape, etc.)",
] as const;

/**
 * ANIMAL — KHÁC nhân vật người: chân/đuôi dùng KHỐI PHẲNG CÓ ĐỘ DÀY thật, KHÔNG phải dạng que.
 * XÁC NHẬN qua test tay (2026-08-01, chó/chim/ngựa/gấu): thử chân dạng que (giống người) trước,
 * nhưng trông không tự nhiên với cấu trúc 4 chân/2 chân của động vật — người dùng quyết định
 * đổi sang khối phẳng có độ dày (vẫn đơn giản hoá, không chi tiết móng/ngón/lông) cho MỌI động
 * vật thay vì áp nguyên xi kiểu stick-limb của người.
 *
 * KHÔNG dùng ảnh `reference-character.jpeg` (người) làm reference khi tạo động vật — rủi ro
 * model kéo theo tỉ lệ/dáng đứng giống người vào con vật (cùng bài học "ảnh thắng text" ở
 * MASTER_REFERENCE_NOTE). Mỗi con vật MỚI dùng thẳng `ANIMAL_STYLE_BLOCK` bằng text (không kèm
 * ảnh reference) — giống cách đã tạo ra ảnh master reference người ban đầu. CHƯA chốt 1 ảnh
 * động vật cụ thể nào làm master reference cố định (khác với người) — vì mỗi loài có cấu trúc
 * cơ thể khác nhau (4 chân/2 chân+cánh...), nên hiện dùng chung 1 block text tái sử dụng được
 * cho MỌI loài, không neo theo 1 ảnh cụ thể. Nếu sau này phát hiện lệch phong cách giữa các
 * loài, cân nhắc chốt thêm ảnh reference riêng theo TỪNG NHÓM cấu trúc cơ thể (vd 1 ảnh chuẩn
 * cho nhóm 4 chân, 1 ảnh chuẩn cho nhóm chim/2 chân+cánh).
 */
export const ANIMAL_STYLE_BLOCK =
  "Minimalist animal character design, flat 2D vector art style, bold uniform-width black " +
  "outlines, completely flat colors, no shading, no gradients, no textures. Plain solid " +
  "single-color background, no scenery. Simplified head built from basic geometric shapes " +
  "(species-appropriate snout/beak shape, simple flat ear shapes if any, one or two black dot " +
  "eyes, no other facial detail). Flat-colored simplified body shape. Legs drawn as simple " +
  "flat-colored solid shapes (short rounded cylinders/rectangles with real width and volume — " +
  "NOT thin stick lines), each ending in a small simple rounded flat paw/hoof shape with no " +
  "toe or claw detail. Tail matching the same solid-shape treatment (not a thin line). " +
  "Standing pose, side profile view, full body visible.";

/**
 * BACKGROUND — quy tắc chung cho MỌI ảnh bối cảnh (Setting), áp dụng cùng với BASE_STYLE_BLOCK.
 * Đã xác nhận qua nhiều cảnh test (phố gỗ, bến tàu, nội thất cung điện, làng adobe, quảng
 * trường thị trấn, hội trường nghị viện) — 2026-08-01.
 */
export const BACKGROUND_STYLE_BLOCK =
  "Full-bleed composition filling the entire frame edge to edge — no decorative border, no " +
  "vignette. NO people, NO characters, NO figures of any kind — empty environment only. " +
  "Keep all decorative detail extremely minimal and simplified — every detail must be built " +
  "from basic geometric primitives only (rectangles, simple arcs/half-circles, circles, plain " +
  "spiral/volute shapes). Avoid intricate repeating ornamental patterns, filigree, carved " +
  "relief, or fine linework — plain flat-colored panels and simple trim only.";

/**
 * CHỐNG PHỐI CẢNH HỘI TỤ — bắt buộc cho cảnh có kiến trúc thẳng hàng (phố, mặt tiền nhà, dãy
 * cột...). XÁC NHẬN: model mặc định vẽ phối cảnh điểm tụ thật (đường phố hút về xa) nếu không
 * cấm rõ — phải nói rõ đây là bố cục "phẳng kiểu sân khấu", không phải ảnh chụp 3D thật.
 * KHÔNG áp dụng cứng nhắc cho cảnh phong cảnh thiên nhiên rộng — xem
 * LAYERED_DEPTH_LANDSCAPE_NOTE bên dưới cho trường hợp đó.
 */
export const NO_PERSPECTIVE_BLOCK =
  "Flat orthographic composition with NO perspective and NO vanishing point — camera looking " +
  "straight at the scene, not down a receding street or into a converging corner. Elements " +
  "arranged as flat parallel planes across the frame, like a theater backdrop or paper cutout " +
  "diorama, all at the same flat depth layer. No 3D depth, no diminishing scale toward a " +
  "horizon point.";

/**
 * Ghi chú (không phải block để nối trực tiếp vào prompt) — cho cảnh phong cảnh thiên nhiên
 * rộng (đồng ruộng, núi, làng xa...): KHÔNG cần ép "zero depth" như NO_PERSPECTIVE_BLOCK ở
 * trên — chiều sâu kiểu XẾP LỚP (núi xa → làng giữa → ruộng gần, to nhỏ theo lớp) vẫn giữ được
 * cảm giác phẳng đặc trưng, KHÔNG cần cấm. Chỉ cấm đường thẳng hội tụ kiểu phối cảnh kiến trúc
 * thật (không có "đường ray" hội tụ về 1 điểm). Khi viết prompt cho cảnh loại này, mô tả trực
 * tiếp từng lớp (background/midground/foreground) thay vì dùng NO_PERSPECTIVE_BLOCK.
 */
export const LAYERED_DEPTH_LANDSCAPE_NOTE =
  "Layered flat-depth landscape composition (background/midground/foreground layers stacked " +
  "by simple scale and position — NOT single-point converging perspective, no receding " +
  "parallel lines).";

/**
 * CHỪA CHỖ ĐẶT NHÂN VẬT — bắt buộc cho MỌI background dự định ghép nhân vật vào sau (đúng vai
 * trò Setting cũ trong pipeline Flow). Không có block này, model có xu hướng lấp đầy khung
 * hình bằng chi tiết (như ảnh cột/rèm cung điện lần đầu, không còn chỗ trống).
 */
export const RESERVE_CHARACTER_SPACE_BLOCK =
  "Leave a clear, mostly empty flat-colored floor/ground area occupying roughly the bottom " +
  "third of the frame, kept visually simple and uncluttered — this space is reserved for a " +
  "character to be placed into later, so avoid objects, furniture, or patterned flooring " +
  "directly in this zone.";

/**
 * GÓC MÁY NGANG TẦM MẮT — bắt buộc cho MỌI background dự định ghép nhân vật đứng vào sau.
 * XÁC NHẬN (2026-08-01, cảnh hội trường nghị viện): không có block này, model có xu hướng đặt
 * camera hơi từ trên chéo xuống (nhìn thấy mặt bàn/sàn từ trên) để "khoe" được nhiều chi tiết
 * phòng hơn — khiến sàn trước không còn ở góc nhìn tự nhiên để đặt 1 nhân vật đứng vào.
 */
export const EYE_LEVEL_CAMERA_BLOCK =
  "Camera positioned at human standing eye-level, looking straight ahead or very slightly " +
  "upward — NOT a high-angle or bird's-eye downward-looking shot. The foreground floor must " +
  "be viewed nearly edge-on at a shallow, almost horizontal angle (like a normal human " +
  "viewpoint), not seen from above as a wide flat surface. A standing character placed in the " +
  "foreground should read as being viewed straight at their own eye level, not looked down " +
  "upon.";

/**
 * Ví dụ dùng ANIMAL_STYLE_BLOCK (không ráp thêm gì khác, không kèm ảnh reference):
 *
 *   [ANIMAL_STYLE_BLOCK]
 *   <mô tả loài + đặc điểm riêng, vd: "Simplified bear head... stockier and rounder body...">
 *
 * Ví dụ ráp 1 prompt Background hoàn chỉnh (kiến trúc, có chỗ đặt nhân vật):
 *
 *   [BASE_STYLE_BLOCK]
 *   [BACKGROUND_STYLE_BLOCK]
 *   [NO_PERSPECTIVE_BLOCK]
 *   [RESERVE_CHARACTER_SPACE_BLOCK]
 *   [EYE_LEVEL_CAMERA_BLOCK]
 *   Scene: <mô tả cảnh cụ thể + bảng màu>
 *
 * Với cảnh phong cảnh thiên nhiên rộng, thay NO_PERSPECTIVE_BLOCK bằng
 * LAYERED_DEPTH_LANDSCAPE_NOTE (chỉ là ghi chú định hướng, mô tả layer trực tiếp trong phần
 * Scene, xem ví dụ cảnh đồng ruộng đã test).
 */
