import { generateText } from "../llm/gemini.js";

export interface CharacterProfile {
  name: string;
  /** Mô tả ngoại hình/trang phục cố định, dùng để tạo Character asset trong Flow. */
  description: string;
}

const SYSTEM_PROMPT = `Bạn đọc 1 truyện và liệt kê các nhân vật CHÍNH xuất hiện lặp lại (bỏ qua nhân vật phụ thoáng qua).
Với mỗi nhân vật, viết mô tả ngoại hình cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION
(KHÔNG mô tả chi tiết kết cấu da/tóc như ảnh chụp thật) — tập trung vào: dáng người/tỉ lệ cơ thể, kiểu tóc
(hình khối + màu), trang phục (màu sắc cụ thể, kiểu dáng đặc trưng dễ nhận diện qua silhouette), và 1-2 đặc
điểm nhận dạng nổi bật (màu áo đặc trưng, phụ kiện, kiểu dáng cơ thể...). Mô tả này dùng làm ảnh tham chiếu
nhân vật xuyên suốt video, nên phải chi tiết và KHÔNG được đổi giữa các cảnh.
Trả về JSON thuần dạng: [{"name": "...", "description": "..."}], không thêm chữ nào khác.`;

export async function extractCharacters(storyText: string): Promise<CharacterProfile[]> {
  const text = await generateText(SYSTEM_PROMPT, storyText);

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`Không parse được danh sách nhân vật từ LLM: ${text}`);

  const characters = JSON.parse(jsonMatch[0]) as CharacterProfile[];
  console.log(`[characters] tìm thấy ${characters.length} nhân vật chính: ${characters.map((c) => c.name).join(", ")}`);
  return characters;
}
