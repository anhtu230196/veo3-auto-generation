/**
 * Trạng thái tạo asset (Character/Setting/Prop) hoặc clip video trong Flow — dùng chung cho
 * CharacterProfile/SettingProfile/PropProfile (characters|settings|props/extract.ts) và
 * VeoPrompt (splitter/prompt-writer.ts).
 *
 * "success": đã xác nhận tạo xong (VÀ đổi tên xong với Character/Setting/Prop) — các lần chạy
 * sau BỎ QUA hẳn, không query lại Flow (khác cơ chế cũ luôn tra tên qua UI mỗi lần chạy).
 * "waiting": chưa từng thử, hoặc dữ liệu cũ từ trước khi có field này (coi như chưa làm).
 * "failed": lần thử gần nhất lỗi/timeout — thử tạo lại ở lần chạy sau.
 *
 * "waiting" và "failed" được xử lý GIỐNG NHAU (đều thử lại) — tách riêng 2 giá trị chỉ để có
 * thể phân biệt "chưa từng đụng tới" với "đã thử và lỗi" khi đọc lại state/*.json bằng mắt.
 */
export type AssetStatus = "waiting" | "failed" | "success";
