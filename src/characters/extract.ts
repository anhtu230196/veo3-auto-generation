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
phân biệt rõ mốc tuổi, vd "Young Elias" và "Elias" và "Older Elias" — xem quy tắc TÊN
NGẮN CHO NHÂN VẬT NỔI TIẾNG ngay dưới đây để biết vì sao KHÔNG dùng họ đầy đủ trong tên). Ở TẤT CẢ các
mốc tuổi, PHẢI giữ nguyên cùng 1 khuôn mặt và kiểu tóc cốt lõi (hình dáng tóc, màu tóc gốc, cấu trúc khuôn
mặt) — chỉ được đổi: mốc trẻ em → tỉ lệ cơ thể/khuôn mặt nhỏ hơn, tròn hơn (giữ nguyên hình dáng tóc, thu
nhỏ theo tỉ lệ); mốc già → giữ nguyên hình dáng tóc nhưng đổi màu tóc sang bạc/trắng, thêm nếp nhăn, dáng
đi khom. TUYỆT ĐỐI không viết lại khuôn mặt/kiểu tóc khác hẳn cho từng mốc tuổi — đó phải là CÙNG 1 người.

QUY TẮC CHUNG — TÊN NGẮN/ĐỊNH DANH LẠI CHO CẢ DÀN NHÂN VẬT CÓ THẬT, KHÔNG CHỈ NHÂN VẬT CHÍNH (RẤT QUAN
TRỌNG, cập nhật 2026-07-19 sau khi xác nhận lỗi vẫn tái diễn rải rác suốt 1 project dù đã sửa riêng nhân
vật chính): Google Flow có bộ lọc chặn nội dung "prominent people", quét theo CHUỖI TÊN ĐẦY ĐỦ khớp 1 người
thật/lịch sử đã biết (không phải chỉ tên riêng đứng một mình — tên riêng một mình quá chung chung để định
danh 1 người cụ thể), và ÁP DỤNG CHO BẤT KỲ AI trong cả dàn nhân vật, KHÔNG giới hạn ở nhân vật chính hay
người thân của họ. Một project xác nhận trực tiếp: dù đã đổi tên đúng cho nhân vật chính, vẫn liên tục gặp
lỗi "might violate our policies about generating prominent people" vì DÀN NHÂN VẬT PHỤ còn nhiều người
thật/lịch sử KHÁC (vua/hoàng hậu, nhà tài trợ, đồng đội thám hiểm, nhân chứng...) vẫn đang dùng tên đầy đủ
— đây mới là nguồn lỗi rải rác khó bắt hết nếu chỉ kiểm tra "có phải nhân vật chính không". Vì vậy: khi
liệt kê TOÀN BỘ nhân vật CHÍNH xuất hiện lặp lại (bước đầu tiên của guide này), kiểm tra NGAY LÚC ĐÓ cho
TỪNG người một xem có phải người thật/lịch sử/công chúng có thể định danh được không — không chỉ nhân vật
được coi là "chính" của câu chuyện — rồi áp dụng ĐÚNG 1 trong 3 cách đổi tên field \`name\` dưới đây, KHÔNG
đợi đến lúc bị Flow từ chối mới sửa từng trường hợp một.

CÁCH 1 — nhân vật CHÍNH của câu chuyện (protagonist): đặt tên Character asset CHỈ bằng tên riêng, bỏ hẳn họ
(vd "Elias" — không có họ đầy đủ). Xác nhận trực tiếp qua render thật: đổi CÙNG 1 Character asset
(cùng mô tả ngoại hình, cùng người) từ tên đầy đủ sang tên riêng đơn lẻ là đủ để hết bị chặn. Áp dụng nhất
quán cho MỌI mốc tuổi: "Young Elias"/"Elias"/"Older Elias", không phải tên đầy đủ kèm họ ở bất kỳ mốc nào
(xem mục NHIỀU MỐC TUỔI ở trên).

CÁCH 2 — NGƯỜI THÂN (cha/mẹ/anh/chị/em/con/vợ/chồng...) của nhân vật CHÍNH: đặt tên theo QUAN HỆ SỞ HỮU với
nhân vật chính, vd "Elias's Brother", "Elias's Father" — TUYỆT ĐỐI KHÔNG dùng tên lịch sử thật của họ (đã
xác nhận trực tiếp: dùng họ đầy đủ của người thân vẫn bị chặn dù bản thân người đó không nổi tiếng độc
lập). Nếu nhân vật chính đã đổi sang tên ngắn (Cách 1), dùng tên ngắn đó trong cụm quan hệ sở hữu để nhất
quán (vd "Elias's Brother").

CÁCH 3 — BẤT KỲ nhân vật lịch sử/công chúng có thật KHÁC trong dàn nhân vật, KHÔNG PHẢI nhân vật chính LẪN
KHÔNG PHẢI người thân của họ (vd vua, hoàng hậu, nhà tài trợ/quan chức, đồng đội/đối thủ, nhân chứng độc
lập...) — đây là trường hợp DỄ BỊ BỎ SÓT NHẤT vì không khớp rõ Cách 1 hay Cách 2. Đặt tên theo VAI TRÒ/CHỨC
DANH trong câu chuyện thay vì tên lịch sử thật (vd "The Queen", "The Royal Treasurer", "The Fleet Captain")
— hoặc chỉ tên riêng đơn lẻ nếu tên đó không đủ định danh cụ thể 1 người (áp dụng cùng nguyên tắc Cách 1).

Ở CẢ 3 cách trên: dùng tên đã đổi làm CẢ field \`name\` của Character asset LẪN tên nhắc trong videoPrompt
ở MỌI cảnh có mặt họ — KHÔNG bao giờ dùng tên lịch sử thật ở bất kỳ đâu trong pipeline. Mô tả ngoại hình
(field \`description\`) vẫn viết đầy đủ/chính xác theo NHÂN VẬT CÓ THẬT/NỔI TIẾNG ở trên — CHỈ riêng field
tên là bị đổi, không phải mô tả.`;
