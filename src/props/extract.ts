import type { AssetStatus } from "../assetStatus.js";

export interface PropProfile {
  name: string;
  /** Mô tả cố định của đạo cụ/vật dụng (hình dáng, chất liệu, màu sắc), dùng tạo Prop asset trong Flow. */
  description: string;
  /** Trạng thái tạo Prop asset trong Flow — xem assetStatus.ts. Cập nhật + lưu lại trong veo3bot/props.ts::ensurePropsInFlow. */
  status?: AssetStatus;
}

/**
 * Quy tắc viết mô tả đạo cụ cho `state/props.json` — KHÔNG còn gọi Gemini tự động (đã bỏ,
 * xem RUNBOOK.md mục 4.20); giữ lại làm SPEC để Claude đọc và tự viết `state/props.json`
 * bằng tay trong hội thoại, đúng tinh thần đã xây dựng từ đầu project.
 */
export const PROP_EXTRACTION_GUIDE = `Đọc 1 truyện và liệt kê các ĐẠO CỤ/VẬT DỤNG cố định xuất hiện LẶP LẠI ở nhiều
cảnh khác nhau và cần giữ ĐÚNG HÌNH DẠNG xuyên suốt (vd 1 con tàu cụ thể xuất hiện nhiều cảnh, 1 bản đồ/
hợp đồng cụ thể được nhắc lại, 1 vũ khí/vật biểu tượng quan trọng). BỎ QUA vật dụng chỉ xuất hiện đúng 1
lần hoặc không cần nhất quán hình ảnh giữa các cảnh (đồ vật nền chung chung).
Với mỗi đạo cụ, viết mô tả cố định bằng tiếng Anh, PHÙ HỢP PHONG CÁCH 2D FLAT VECTOR ILLUSTRATION — tập
trung vào: hình dáng/kích thước tổng thể, màu sắc chủ đạo, chất liệu, 1-2 chi tiết nhận dạng đặc trưng dễ
phân biệt qua silhouette. Mô tả này dùng làm ảnh tham chiếu đạo cụ xuyên suốt video (Prop asset trong
Flow), nên phải chi tiết và KHÔNG được đổi giữa các cảnh dùng lại đạo cụ này.`;
