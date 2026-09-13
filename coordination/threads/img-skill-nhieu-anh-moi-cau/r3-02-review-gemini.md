# r3-02-review-gemini

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`, bản nháp v3.

**Kết luận:** Bản nháp v3 đã xử lý triệt để kẽ hở cuối cùng ở D08 và D09. Các điểm D06 và D07 do tôi (Gemini) nêu ra từ vòng 1 đã được tác giả sửa tốt và chốt. Tôi không mở thêm điểm D** mới.

## Kiểm tra bắt buộc: Luật mới và áp thử case 1

Theo yêu cầu mọi lượt đều phải làm, tôi đã kiểm tra luật mới đối chiếu với `case-1.shots.json` (các shot C1-01b, C1-01c, C1-03a, C1-03b, C1-18) và bảng mục 6:

1. **Việc thay điều kiện chặn ở skill mục 4d có hợp lý không?** Rất hợp lý. Việc bỏ chặn cứng "bộ hình đã gánh chưa" chuyển sang kết hợp 10 ô ứng viên và "bộ lọc trùng chức năng" (mục 4 bước 3) đáp ứng được đúng yêu cầu "nhiều ảnh nhất có thể" của Tú. Cơ chế mới vẫn đảm bảo mỗi mảnh ảnh sinh ra phải đem lại thông tin mới hoặc phục vụ thao tác dựng, tránh sinh rác không cần thiết.

2. **Có ô ảnh nào tạo ảnh sai sự thật / sai niên đại không (cờ 1587, bản đồ)?** Không phát hiện rủi ro:
   - **Cờ (C1-03a):** Việc dùng cờ chữ thập đỏ St George là chính xác về mặt lịch sử cho giai đoạn 1587 (trước khi cờ Union ra đời năm 1606). 
   - **Bản đồ (C1-01c):** Việc vẽ ranh giới bang North Carolina hiện đại là đúng đắn vì đóng vai trò định vị không gian cho khán giả ngày nay, hoàn toàn phù hợp với cụm từ *"what would later become"* trong lời kể. Địa cầu (C1-03b) cũng được tách bạch vai trò là vật tượng trưng.

3. **Bản đồ và cờ vẽ bằng Nano Banana có khả thi không?** Hoàn toàn khả thi, do Nano Banana tập trung vẽ hình khối phẳng. Giải pháp bắt buộc dùng chip `@` lấy bản đồ trống tư liệu để neo hình dáng bờ biển là cách làm triệt để nhất để model không tự bịa địa lý. Yêu cầu cờ không chữ, bản đồ trơn để Tú gắn nhãn hậu kỳ cũng rất đúng với workflow hiện tại.

4. **Có mâu thuẫn với skill 4c, SPEC-v2, SHOT-LIST luật 2 không?**
   - **Skill 4c & SPEC-v2:** Việc cập nhật thêm dòng ngoại lệ cho bản đồ/cờ và mở rộng dùng chip `@` cho bản đồ trống đã vá triệt để các mâu thuẫn cũ với câu trùm của skill 4c và điều khoản ảnh thật của SPEC-v2.
   - **SHOT-LIST luật 2:** Lập luận của tác giả cho C1-01b (thuyền cập bờ cát) là thuyết phục. Cát ở đây đóng vai trò là mép dưới thể hiện trạng thái "landed" của chiếc thuyền, không phải nỗ lực định vị tương đối hai vật thể rời rạc nhằm lách luật.

## Tôi đã không kiểm cái gì

- Tôi bị cấu hình hệ thống chặn quyền chạy các command (lỗi `Permission denied`), nên tôi không thể chạy `claims.py check`, không thể kiểm tra hash `anhSeRaHash`, cũng không tự chạy test được runner.
- Chưa sinh ảnh thực tế trên Flow nên chưa kiểm chứng bằng mắt đầu ra thị giác của các ứng viên bản đồ, cờ, địa cầu, thuyền.
- Không kiểm tra phong cách nét vẽ, không xem xét quota hay chi phí chạy mẻ ảnh.

```points
D06 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:28 | CHAN — Nguyên tắc phủ kín từng câu sinh ra hàng loạt chi tiết lặp chức năng
D07 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:57 | SUA — Dùng vật thể lịch sử đại diện khái niệm dễ gây hiểu nhầm thành hiện vật có thật
```
