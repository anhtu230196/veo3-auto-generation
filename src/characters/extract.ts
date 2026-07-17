import { generateText } from "../llm/gemini.js";
import type { AssetStatus } from "../assetStatus.js";

export interface CharacterProfile {
  name: string;
  /** Mô tả ngoại hình/trang phục cố định, dùng để tạo Character asset trong Flow. */
  description: string;
  /** Trạng thái tạo Character asset trong Flow — xem assetStatus.ts. Cập nhật + lưu lại trong veo3bot/characters.ts::ensureCharactersInFlow. */
  status?: AssetStatus;
}

const SYSTEM_PROMPT = `Bạn đọc 1 truyện và liệt kê các nhân vật CHÍNH xuất hiện lặp lại (bỏ qua nhân vật phụ thoáng qua).
Với mỗi nhân vật, viết mô tả ngoại hình cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION
(KHÔNG mô tả chi tiết kết cấu da/tóc như ảnh chụp thật) — tập trung vào: dáng người/tỉ lệ cơ thể, kiểu tóc
(hình khối + màu), trang phục (màu sắc cụ thể, kiểu dáng đặc trưng dễ nhận diện qua silhouette), và 1-2 đặc
điểm nhận dạng nổi bật (màu áo đặc trưng, phụ kiện, kiểu dáng cơ thể...). Mô tả này dùng làm ảnh tham chiếu
nhân vật xuyên suốt video, nên phải chi tiết và KHÔNG được đổi giữa các cảnh.

NHÂN VẬT CÓ THẬT/NỔI TIẾNG: nếu nhân vật là người thật trong lịch sử hoặc nhân vật công chúng được biết đến
rộng rãi, hãy dùng kiến thức đã có sẵn của bạn về ngoại hình được ghi nhận/mô tả phổ biến nhất của người đó
(kiểu tóc, màu tóc, đặc điểm khuôn mặt đặc trưng) làm cơ sở viết mô tả — KHÔNG tự bịa ra một ngoại hình
hoàn toàn không liên quan. Nếu không có chân dung xác thực nào (thường gặp ở nhân vật thời trước khi có
ảnh chụp), dùng hình dung phổ biến/quen thuộc nhất được biết đến rộng rãi về người đó.

NHIỀU MỐC TUỔI CỦA CÙNG 1 NGƯỜI: nếu truyện mô tả rõ cùng 1 nhân vật ở các giai đoạn cuộc đời khác biệt rõ
rệt (trẻ em/thiếu niên/trưởng thành/già), hãy trả về NHIỀU entry riêng cho người đó (mỗi entry 1 mốc tuổi,
tên phân biệt rõ mốc tuổi, vd "Young Columbus" và "Christopher Columbus" và "Older Columbus"). Ở TẤT CẢ các
mốc tuổi, PHẢI giữ nguyên cùng 1 khuôn mặt và kiểu tóc cốt lõi (hình dáng tóc, màu tóc gốc, cấu trúc khuôn
mặt) — chỉ được đổi: mốc trẻ em → tỉ lệ cơ thể/khuôn mặt nhỏ hơn, tròn hơn (giữ nguyên hình dáng tóc, thu
nhỏ theo tỉ lệ); mốc già → giữ nguyên hình dáng tóc nhưng đổi màu tóc sang bạc/trắng, thêm nếp nhăn, dáng
đi khom. TUYỆT ĐỐI không viết lại khuôn mặt/kiểu tóc khác hẳn cho từng mốc tuổi — đó phải là CÙNG 1 người.

Trả về JSON thuần dạng: [{"name": "...", "description": "..."}], không thêm chữ nào khác.`;

export async function extractCharacters(storyText: string): Promise<CharacterProfile[]> {
  const text = await generateText(SYSTEM_PROMPT, storyText);

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`Không parse được danh sách nhân vật từ LLM: ${text}`);

  const characters = JSON.parse(jsonMatch[0]) as CharacterProfile[];
  console.log(`[characters] tìm thấy ${characters.length} nhân vật chính: ${characters.map((c) => c.name).join(", ")}`);
  return characters;
}
