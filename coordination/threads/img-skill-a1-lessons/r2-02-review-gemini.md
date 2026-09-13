# r2-02-review-gemini

**Sản phẩm đang review:** `coordination/drafts/img-skill-a1-lessons.md` (v2) và `image-prompts/A1.shots.json`.

## Đánh giá 8 luật mới (Nhiệm vụ bắt buộc)

Đã kiểm tra đối chiếu 8 luật mới đề xuất với 8 góp ý của Tú trên case A1, cũng như kết quả đo trong RUNBOOK và SPEC-v2:
1. **Có đúng với bằng chứng từ 8 góp ý không?** Có. Tất cả 8 luật đều xuất phát trực tiếp từ các yêu cầu thực tế (như bổ sung cảnh đu dây, thêm ảnh người lộ tai riêng, ảnh Anastasia, cảnh sát áp giải). Việc định hướng sinh bộ phần tử + trạng thái nối thay vì một khung hình tĩnh đáp ứng đúng workflow dựng hình bằng chồng lớp ở hậu kỳ của Tú.
2. **Có mâu thuẫn với luật đã đo được trong RUNBOOK mục 0 hay SPEC-v2 không?** Không mâu thuẫn. Bản v2 xử lý tốt các ranh giới xung đột: Luật 6 (Hai vật nối) không vi phạm lệnh cấm định vị tương đối (SPEC-v2 §3) vì cái nút buộc mới là chủ thể chính; Luật 2, 7, 8 tận dụng khả năng giữ khuôn mặt và tỷ lệ chuẩn xác khi sinh từ asset (đã đo trong RUNBOOK mục 0).
3. **Có tổng quát hóa quá đà (áp sai cho chủ đề khác) không?** Không. Việc bổ sung "Điều kiện chặn chung" ở mục §0 và mục "Không áp khi" ở mỗi luật là rào cản xuất sắc để chống áp dụng máy móc. Phân tích loại trừ với trường hợp nhân vật Gaviria ở luật 3 là một dẫn chứng thuyết phục cho sự cẩn trọng này, đảm bảo không sinh shot bừa phứa làm tốn quota.

## Trả lời các câu hỏi Q1-Q4 của tác giả

- **Q1 (Chuỗi tư thế):** Đồng ý với phương án hiện tại (theo Codex đề nghị): tách khung gốc từ asset, sau đó tạo biến thể từ chính khung gốc đó. Dù chưa được đo lường thực tế, đây là cách duy nhất tránh việc model lôi các chi tiết (như bạn tù) từ cảnh nhóm sang cảnh đơn. Đánh dấu nó là "thử nghiệm" là quyết định chính xác.
- **Q2 (Phép thử luật 2):** Phép thử *"Đọc lời kể cùng bộ hình hiện có — người xem đã biết nhân vật chuyển trạng thái chưa?"* là tiêu chí định lượng đủ chặt, đảm bảo chỉ thêm ảnh khi thông tin thực sự bị đứt đoạn.
- **Q3 (Ảnh neo trong mention):** Đồng ý gọi tên ảnh neo trong câu mention vì nó sát với cách Tú tự prompt và đã cho ra kết quả tốt. Về tiêu chí chọn, nên chốt chọn ảnh neo theo `kind` của **phần tử MỚI** được đưa vào. (Ví dụ: đưa lò sưởi vào thì lấy ảnh neo vật, cảnh sát thì lấy ảnh neo người).
- **Q4 (Luật 3 cho A2):** Ranh giới *"được gọi tên VÀ lời kể nói họ làm gì / bị gì"* là hợp lý. César Gaviria chỉ là mục tiêu vắng mặt (thông tin cần thiết đã được ghế trống đảm nhiệm). Nếu vẽ thêm Gaviria, người xem có thể hiểu lầm ông ta đã lên máy bay. Giữ nguyên ranh giới này.

## D06 — HOI — Chọn ảnh neo cho câu mention

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:269`
**VẤN ĐỀ GÌ:** Mục 9d đề cập phương án gọi tên ảnh neo trong câu mention nhưng chưa chốt tiêu chí chọn ảnh neo ("Chưa có căn cứ chọn neo theo kind của shot hay theo loại phần tử mới"). Đề nghị chốt việc chọn ảnh neo theo `kind` của phần tử MỚI được đưa vào cảnh (như đã phân tích ở Q3).
**CẦN GÌ ĐỂ ĐÓNG:** Tác giả cập nhật đề xuất hoặc chốt ghi nhận vào bản nháp làm phương án thử nghiệm cho các mẻ sau.

## Tôi đã không kiểm cái gì

- Không tự chạy lệnh sinh ảnh để kiểm chứng số liệu đo lường thực tế hay khả năng cắt nối của chuỗi tư thế Luciano.
- Không mở file ảnh gốc từ Commons hay file ảnh do Flow sinh ra để kiểm tra phong cách nét vẽ (do nằm ngoài phạm vi yêu cầu review).
- Không đối chiếu độc lập các tài liệu lịch sử (về băng Gambino hay cái chết của Reles) mà dựa vào kết quả đã đối chiếu của tác giả (Claude) và người review trước (Codex).
- Chạy ở chế độ tự động không quyền thực thi (bị chặn lệnh shell), nên chỉ đánh giá dựa trên việc đọc nội dung file trong repo.

```points
D06 | mở | coordination/drafts/img-skill-a1-lessons.md:269 | Gợi ý chọn ảnh neo theo loại phần tử mới cho câu mention
```
