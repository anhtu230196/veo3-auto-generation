import type { AssetStatus } from "../assetStatus.js";

export interface SettingProfile {
  name: string;
  /** Mô tả bối cảnh cố định (không gian, nội thất, ánh sáng đặc trưng), dùng tạo Setting asset trong Flow. */
  description: string;
  /** Trạng thái tạo Setting asset trong Flow — xem assetStatus.ts. Cập nhật + lưu lại trong veo3bot/settings.ts::ensureSettingsInFlow. */
  status?: AssetStatus;
}

/**
 * Quy tắc viết mô tả bối cảnh cho `state/settings.json` — KHÔNG còn gọi Gemini tự động (đã
 * bỏ, xem RUNBOOK.md mục 4.20); giữ lại làm SPEC để Claude đọc và tự viết
 * `state/settings.json` bằng tay trong hội thoại, đúng tinh thần đã xây dựng từ đầu project.
 * XEM THÊM RUNBOOK mục 4.19: mô tả KHÔNG được khoá cứng 1 điều kiện ánh sáng (ngày/đêm) nếu
 * bối cảnh đó sẽ được dùng ở cả 2 điều kiện khác nhau qua nhiều cảnh.
 */
export const SETTING_EXTRACTION_GUIDE = `Đọc 1 truyện và liệt kê các BỐI CẢNH/ĐỊA ĐIỂM cố định xuất hiện LẶP LẠI ở nhiều
cảnh khác nhau (vd 1 căn phòng được quay từ toàn cảnh rồi lại cận cảnh ở 1 câu sau, 1 boong tàu xuất hiện
xuyên suốt nhiều cảnh, 1 quảng trường...). BỎ QUA địa điểm chỉ xuất hiện đúng 1 lần và không cần dựng lại
nhất quán.
Với mỗi bối cảnh, viết mô tả cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION — tập
trung vào: loại không gian, bố cục/nội thất đặc trưng (vị trí cửa sổ, đồ vật cố định, chất liệu tường/sàn).
Mô tả này dùng làm ảnh tham chiếu bối cảnh xuyên suốt video (Setting asset trong Flow), nên phải chi tiết
và KHÔNG được đổi giữa các cảnh dùng lại bối cảnh này.
CHỈ định rõ tông màu/ánh sáng cố định (vd "at night", "under moonlight") NẾU bối cảnh đó CHỈ xuất hiện ở
1 điều kiện ánh sáng xuyên suốt câu chuyện — nếu bối cảnh dùng ở CẢ ngày lẫn đêm, để mô tả TRUNG LẬP ánh
sáng, không chỉ định thời điểm cụ thể (xem RUNBOOK.md mục 4.19, bug Setting "Pinta Deck").`;
