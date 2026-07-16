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

/** Dùng khi gửi prompt tạo Character asset (ảnh nhân vật nền xanh) trong Flow. */
export const CHARACTER_SHEET_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, solid chroma-key green background (#00FF00), flat even lighting, ` +
  "full body character turnaround, front view and 3/4 view, 16:9 aspect ratio.";

/** Chèn vào system prompt viết video prompt — mô tả tông màu/không khí theo mood cảnh. */
export const SCENE_STYLE_BLOCK =
  `${STYLE_DESCRIPTOR}, single dominant color palette shift per scene mood (warm amber for ` +
  "daylight interiors and calm negotiation scenes, cool blue-grey for tension or conflict " +
  "scenes, saturated warm tones for outdoor or festive/exploration scenes, deep indigo with " +
  "stars for night scenes), flat atmospheric background shapes, 16:9 aspect ratio.";

/**
 * Suffix bắt buộc, append vào CUỐI mọi video prompt bằng code (không phụ thuộc LLM có
 * tuân thủ hay không) — giữ đúng style xuyên suốt và hạn chế lỗi Veo3 (camera động, hiệu
 * ứng lạ làm trôi phong cách).
 */
export const MOTION_SUFFIX =
  `Maintain the exact ${STYLE_NAME} style and color palette from the reference. Simple ` +
  "grounded movement only — natural gestures, subtle idle motion, gentle parallax. No " +
  "camera pans, no zoom, no visual effects, no style drift.";

/**
 * Mốc thời đại của câu chuyện — đổi hằng số này nếu dự án khác dùng bối cảnh khác.
 * LÝ DO CẦN CÓ: những nhân vật/bối cảnh KHÔNG có Character asset (@mention) — vd thủy thủ
 * quần chúng, cảng, khu chợ — không có gì neo giữ hình ảnh, nên Veo3 mặc định vẽ theo nghĩa
 * HIỆN ĐẠI của các danh từ chung ("sailor", "harbor", "ship", "settler"...). Đã xác nhận
 * trực tiếp: prompt "a young unnamed sailor... merchant ship's deck" ra hình thủy thủ áo kẻ
 * sọc thời nay đứng cạnh container/cần cẩu cảng hiện đại, dù style đã là flat vector.
 */
export const ERA_DESCRIPTOR = "15th-century Age of Discovery (Spain/Portugal, late 1400s)";

/**
 * Append vào MỌI cảnh KHÔNG cố ý hiện đại (xem VeoPrompt.era trong prompt-writer.ts) — bằng
 * CODE, không phụ thuộc LLM tuân thủ, giống cách làm với MOTION_SUFFIX.
 */
export const PERIOD_ANCHOR =
  `${ERA_DESCRIPTOR} setting — period-accurate wool, linen, and leather clothing, wooden ` +
  "sailing ships with canvas sails and rope rigging, cobblestone streets and stone " +
  "architecture. NO modern clothing, NO modern ports/harbors/cranes/shipping containers, " +
  "NO modern equipment of any kind.";
