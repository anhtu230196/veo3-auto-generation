# Đánh giá v2 luồng img-skill-nhieu-anh-moi-cau

### Đánh giá các yêu cầu bắt buộc (Yêu cầu của Tú)

1. **Việc thay điều kiện chặn ở skill mục 4d có hợp lý không?**
   Rất hợp lý. Bản nháp thay thế điều kiện chặn cũ bằng "Thứ tự quyết định" 3 bước, đưa "trùng chức năng" thành một bộ lọc hệ thống thay vì cảm tính. Việc này giải quyết triệt để sự mâu thuẫn giữa việc muốn sinh nhiều ảnh nhất có thể (để tận dụng Nano Banana) nhưng không tạo ra các shot lặp lại nội dung (như "bao rỗng" và "thùng rỗng"). Nó trực tiếp giải quyết và đóng lại điểm D06 vòng 1 của tôi.

2. **Có ô ảnh nào tạo ảnh sai sự thật / sai niên đại không?**
   Không phát hiện lỗi sự thật hay niên đại trong các thiết kế ảnh mới. 
   - **Cờ 1587 (`C1-03a`):** Chọn đúng cờ thập đỏ St George (cờ Union Jack năm 1606 mới có), và dứt khoát bỏ cờ Tây Ban Nha 1588 vì không có tài liệu mẫu cờ chuẩn xác cho đúng vai trò hạm đội.
   - **Bản đồ (`C1-01c`):** Cho phép biên giới hiện đại của North Carolina vì lời kể dùng định vị tương lai ("what would *later* become"), nhưng giữ đúng mốc thời gian cho các sự kiện khác (bản đồ Azores 1590).
   - **Vật ngầm (`C1-18`):** Tái sử dụng hình thuyền `C1-01b` để đồng nhất thẩm mỹ mà không khẳng định đó là cùng một chiếc thuyền lịch sử, bám sát tường thuật năm 1590 của White.
   - **Địa cầu (`C1-03b`):** Đặt châu Mỹ ở chính diện phản ánh đúng khái niệm "Tân Thế Giới" của thế kỷ 16.

3. **Bản đồ và cờ vẽ bằng Nano Banana có khả thi không?**
   Hoàn toàn khả thi. Tác giả đã loại bỏ rủi ro lớn nhất (model vẽ chữ sai) bằng lệnh cấm tường minh `no lettering, no names, no labels` và yêu cầu dùng **bản đồ trống (blank outline map)** làm tư liệu đối chiếu. Model chỉ việc tô màu/phủ khối lên một hình dáng đã có sẵn, phù hợp với năng lực của Nano Banana. 

4. **Mâu thuẫn với skill 4c, SPEC-v2, SHOT-LIST luật 2?**
   Bản nháp đã nhận diện và sửa đổi trực tiếp các văn bản này để tạo hành lang pháp lý hợp lệ:
   - **Skill 4c & SPEC-v2:** Mở rộng ngoại lệ tường minh cho phép Nano Banana vẽ "bản đồ và cờ", chỉ đẩy phần nhãn/chữ về hậu kỳ. Khai báo thêm trường `choTuLieu`.
   - **SHOT-LIST luật 2:** Lập luận "thuyền cập bờ" (`C1-01b`) là một khối nội dung/vị trí duy nhất (tiền lệ tương tự như vụ cái xác trên mái nhà) chứ không phải hai phần tử rời rạc, do đó không vi phạm luật cấm định vị tương đối.

---

### Tôi đã không kiểm cái gì

- Tôi đã không kiểm tra giới hạn token/chi phí API hay quota của tài khoản PRO khi số lượng ảnh tăng lên 40-50 shot/case, do chưa có luồng chạy thực tế diện rộng.
- Tôi đã không đối chiếu độ chính xác của các chi tiết nhỏ về trang phục trong prompt của ảnh nhân vật (`C1-04`, `C1-19`) với các ảnh neo trong thư mục tư liệu, vì việc này thuộc khâu thẩm định tư liệu ảnh trước khi chạy.

```points
D06 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:114 | Tác giả đã thêm bộ lọc trùng chức năng giải quyết triệt để vấn đề
D07 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:172 | Đã quy định rõ vật tượng trưng không được đứng chung với người và phải đứng tách biệt
```
