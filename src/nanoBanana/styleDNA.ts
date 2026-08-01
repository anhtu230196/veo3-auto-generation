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
 * CHARACTER — đã xác nhận qua test tay (2026-08-01): mô tả NGẮN GỌN, cụ thể từng bộ phận hiệu
 * quả hơn hẳn mô tả dài dòng mơ hồ (vd "limbs drawn as simple lines" bị bỏ qua, còn "thin
 * stick-line arms and legs with no hands or feet detail" thì được tuân theo đúng).
 *
 * BÀI HỌC QUAN TRỌNG NHẤT: khi tạo nhân vật MỚI, ảnh tham chiếu (image-to-image) THẮNG text —
 * nếu ảnh mẫu gốc có tay chân vẽ đầy đủ, nhân vật mới dùng ảnh đó làm reference cũng ra tay
 * chân đầy đủ dù prompt chữ ghi khác đi (cùng bài học đã có ở mục 4.12 RUNBOOK cho Veo3
 * Ingredient). Vì vậy: LUÔN đính kèm 1 ảnh nhân vật mẫu đã đúng style khi tạo nhân vật mới,
 * KHÔNG chỉ dựa vào riêng đoạn text này.
 */
export const CHARACTER_STYLE_BLOCK =
  "Minimalist character design, flat 2D vector art style, bold black outlines, completely " +
  "flat colors, no shading, no gradients. Round simple head, two black dot eyes, no nose or " +
  "mouth detail, square flat-colored torso, thin stick-line arms and legs with no hands or " +
  "feet detail, simple flat hair shape on top of head. same style with reference image";

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
