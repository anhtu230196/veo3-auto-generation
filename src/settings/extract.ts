import { generateText } from "../llm/gemini.js";

export interface SettingProfile {
  name: string;
  /** Mô tả bối cảnh cố định (không gian, nội thất, ánh sáng đặc trưng), dùng tạo Setting asset trong Flow. */
  description: string;
}

const SYSTEM_PROMPT = `Bạn đọc 1 truyện và liệt kê các BỐI CẢNH/ĐỊA ĐIỂM cố định xuất hiện LẶP LẠI ở nhiều
cảnh khác nhau (vd 1 căn phòng được quay từ toàn cảnh rồi lại cận cảnh ở 1 câu sau, 1 boong tàu xuất hiện
xuyên suốt nhiều cảnh, 1 quảng trường...). BỎ QUA địa điểm chỉ xuất hiện đúng 1 lần và không cần dựng lại
nhất quán.
Với mỗi bối cảnh, viết mô tả cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION — tập
trung vào: loại không gian, bố cục/nội thất đặc trưng (vị trí cửa sổ, đồ vật cố định, chất liệu tường/sàn),
tông màu/ánh sáng đặc trưng của không gian đó. Mô tả này dùng làm ảnh tham chiếu bối cảnh xuyên suốt video
(Setting asset trong Flow), nên phải chi tiết và KHÔNG được đổi giữa các cảnh dùng lại bối cảnh này.
Trả về JSON thuần dạng: [{"name": "...", "description": "..."}], không thêm chữ nào khác.`;

export async function extractSettings(storyText: string): Promise<SettingProfile[]> {
  const text = await generateText(SYSTEM_PROMPT, storyText);

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`Không parse được danh sách bối cảnh từ LLM: ${text}`);

  const settings = JSON.parse(jsonMatch[0]) as SettingProfile[];
  console.log(`[settings] tìm thấy ${settings.length} bối cảnh tái diễn: ${settings.map((s) => s.name).join(", ")}`);
  return settings;
}
