import type { AssetStatus } from "../assetStatus.js";

export interface CharacterProfile {
  name: string;
  /** Mô tả ngoại hình/trang phục cố định, dùng để tạo Character asset trong Flow. */
  description: string;
  /** Trạng thái tạo Character asset trong Flow — xem assetStatus.ts. Cập nhật + lưu lại trong veo3bot/characters.ts::ensureCharactersInFlow. */
  status?: AssetStatus;
}

/**
 * Quy tắc viết mô tả nhân vật cho `state/characters.json` — KHÔNG còn gọi Gemini tự động
 * (đã bỏ, xem RUNBOOK.md mục 4.20); giữ lại làm SPEC để Claude đọc và tự viết
 * `state/characters.json` bằng tay trong hội thoại, đúng tinh thần đã xây dựng từ đầu project.
 */
export const CHARACTER_EXTRACTION_GUIDE = `Đọc 1 truyện và liệt kê các nhân vật CHÍNH xuất hiện lặp lại (bỏ qua nhân vật phụ thoáng qua).
Với mỗi nhân vật, viết mô tả ngoại hình cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION
(KHÔNG mô tả chi tiết kết cấu da/tóc như ảnh chụp thật) — tập trung vào: dáng người/tỉ lệ cơ thể, kiểu tóc
(hình khối + màu), trang phục (màu sắc cụ thể, kiểu dáng đặc trưng dễ nhận diện qua silhouette), và 1-2 đặc
điểm nhận dạng nổi bật (màu áo đặc trưng, phụ kiện, kiểu dáng cơ thể...). Mô tả này dùng làm ảnh tham chiếu
nhân vật xuyên suốt video, nên phải chi tiết và KHÔNG được đổi giữa các cảnh.

NHÂN VẬT CÓ THẬT/NỔI TIẾNG: nếu nhân vật là người thật trong lịch sử hoặc nhân vật công chúng được biết đến
rộng rãi, dùng kiến thức đã có sẵn về ngoại hình được ghi nhận/mô tả phổ biến nhất của người đó (kiểu tóc,
màu tóc, đặc điểm khuôn mặt đặc trưng) làm cơ sở viết mô tả — KHÔNG tự bịa ra một ngoại hình hoàn toàn
không liên quan. Nếu không có chân dung xác thực nào (thường gặp ở nhân vật thời trước khi có ảnh chụp),
dùng hình dung phổ biến/quen thuộc nhất được biết đến rộng rãi về người đó.

NHIỀU MỐC TUỔI CỦA CÙNG 1 NGƯỜI: nếu truyện mô tả rõ cùng 1 nhân vật ở các giai đoạn cuộc đời khác biệt rõ
rệt (trẻ em/thiếu niên/trưởng thành/già), trả về NHIỀU entry riêng cho người đó (mỗi entry 1 mốc tuổi, tên
phân biệt rõ mốc tuổi, vd "Young Columbus" và "Christopher Columbus" và "Older Columbus"). Ở TẤT CẢ các
mốc tuổi, PHẢI giữ nguyên cùng 1 khuôn mặt và kiểu tóc cốt lõi (hình dáng tóc, màu tóc gốc, cấu trúc khuôn
mặt) — chỉ được đổi: mốc trẻ em → tỉ lệ cơ thể/khuôn mặt nhỏ hơn, tròn hơn (giữ nguyên hình dáng tóc, thu
nhỏ theo tỉ lệ); mốc già → giữ nguyên hình dáng tóc nhưng đổi màu tóc sang bạc/trắng, thêm nếp nhăn, dáng
đi khom. TUYỆT ĐỐI không viết lại khuôn mặt/kiểu tóc khác hẳn cho từng mốc tuổi — đó phải là CÙNG 1 người.

NGƯỜI THÂN CỦA NHÂN VẬT NỔI TIẾNG (RẤT QUAN TRỌNG — lỗi đã xác nhận trực tiếp qua render thật): Google
Flow có bộ lọc chặn nội dung "prominent people" — KHÔNG chỉ chặn chính nhân vật nổi tiếng, mà dường như còn
quét trúng TÊN THẬT của bất kỳ ai gắn với 1 nhân vật lịch sử/công chúng đã biết, kể cả người thân ít nổi
tiếng hơn nhiều (vd anh trai/cha của người đó) — xác nhận trực tiếp: cảnh dùng Character "Bartholomew
Columbus" (em trai Christopher Columbus) vẫn bị Flow từ chối với lỗi "might violate our policies about
generating prominent people", dù bản thân Bartholomew không phải nhân vật nổi tiếng độc lập. Vì vậy: nếu 1
nhân vật là NGƯỜI THÂN (cha/mẹ/anh/chị/em/con/vợ/chồng...) của 1 nhân vật ĐÃ nổi tiếng khác trong cùng câu
chuyện, TUYỆT ĐỐI KHÔNG đặt tên riêng lịch sử thật của họ làm tên Character (vd KHÔNG dùng "Bartholomew
Columbus") — thay vào đó đặt tên theo QUAN HỆ SỞ HỮU với nhân vật nổi tiếng đó, ví dụ "Columbus's Brother",
"Columbus's Father". Dùng tên quan hệ này làm CẢ tên field \`name\` của Character asset LẪN tên nhắc trong
videoPrompt ở mọi cảnh có mặt họ — KHÔNG dùng tên lịch sử thật của họ ở bất kỳ đâu trong pipeline (kể cả
mô tả ngoại hình vẫn viết bình thường theo NHÂN VẬT CÓ THẬT/NỔI TIẾNG ở trên nếu có thông tin, chỉ riêng
FIELD TÊN là đổi sang dạng quan hệ). CHỈ áp dụng quy tắc này cho người thân của nhân vật THỰC SỰ nổi tiếng
(rủi ro cao) — không cần áp dụng máy móc cho người thân của nhân vật lịch sử ít người biết đến.`;
