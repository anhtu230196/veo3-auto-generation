# Review r1 - gemini

## Các điểm phát hiện mới

### D10: Lặp thông tin hai chiều giữa `assets` và `produces`
**CHAN**
- **CHỖ NÀO**: `image-prompts/SPEC-v2.md:163` (mảng `assets`) và `187` (trường `produces` trong shot)
- **VẤN ĐỀ GÌ**: Spec đang thiết kế lặp thông tin hai chiều dễ gây bất đồng bộ. Mảng `assets` ở cấp video chỉ định rõ `createdBy: "A1-01"` (dòng 168), trong khi bên trong shot `A1-01` lại có trường `produces: "char-reles"` (dòng 187). Nếu ai đó sửa ID shot hoặc xóa shot mà quên cập nhật mảng `assets` (hoặc ngược lại), dữ liệu JSON sẽ mâu thuẫn. Điều này vi phạm nguyên tắc thiết kế schema không dư thừa (SSOT).
- **CẦN GÌ ĐỂ ĐÓNG**: Tác giả chọn giữ lại một trong hai chiều: HOẶC bỏ trường `produces` ở `shots` (để mảng `assets` quyết định shot nào sinh ra nó), HOẶC bỏ mảng `assets` (để script tự gom danh sách asset từ các shot có `produces`). Cập nhật lại bảng "Từng trường" (dòng 212) tương ứng.

### D11: Xung đột logic khi hạ cấp nhân vật không có ảnh thật
**CHAN**
- **CHỖ NÀO**: `image-prompts/SPEC-v2.md:141`
- **VẤN ĐỀ GÌ**: Mục 4c yêu cầu: nếu nhân vật không có ảnh tư liệu thì "hạ xuống kind: group hoặc object". Tuy nhiên, điều này mâu thuẫn trực tiếp với định nghĩa của hai kind này ở mục 3:
  + `group`: quy định là "nhiều người cùng một hành động" (dòng 97), không thể dùng cho người đơn lẻ.
  + `object`: quy định là "vật đơn, dụng cụ, phương tiện" (dòng 95), ép một con người vào kind này là sai ngữ nghĩa.
- **CẦN GÌ ĐỂ ĐÓNG**: Tác giả làm rõ cách xử lý cho người đơn lẻ nhưng không có ảnh thật. Ví dụ: bổ sung kind mới (vd: `generic-character`), hoặc sửa định nghĩa của `group`/`object` ở mục 3 để bao hàm được trường hợp một người vô danh.

## Tôi đã không kiểm cái gì

- Tôi không mở file `RUNBOOK.md` và skill `case-reference-images` để kiểm chứng các trích dẫn luật được nhắc tới (dòng 20, 31, 83), do phải tuân thủ giới hạn đọc file.
- Tôi không đối chiếu xem `image-prompts/SHOT-LIST.md` hiện tại có đúng 385 dòng như dòng 4 tuyên bố hay không.
- Tôi chưa kiểm chứng script `vtt_to_transcript.py` có thực sự dùng tham số `--block` như dòng 225 giải thích hay không. Mọi kết luận ở trên chỉ dựa trên logic nội bộ của file SPEC-v2.md.

```points
D01 | mở | image-prompts/SPEC-v2.md:1 | Ca muc 4 dua tren cau trong RUNBOOK ve chan ten nguoi that, chua tu do lai
D02 | mở | image-prompts/refs/ | Quy uoc luu anh chua duoc file that nao kiem chung
D03 | mở | image-prompts/SPEC-v2.md:5 | Schema JSON moi lam mau A1, chua gap ca khong co anh chup
D04 | mở | image-prompts/SPEC-v2.md | Nguoi review can nop URL anh that cho A1 theo dung dang da neu
D05 | mở | image-prompts/SPEC-v2.md:129 | CHAN: assetId khác flowAssetName; chưa chốt đường truyền ánh xạ và tên ảnh được tạo tới runner
D06 | mở | image-prompts/SPEC-v2.md:93 | CHAN: năm kind không biểu diễn được người đơn lẻ vô danh đã có trong A1
D07 | mở | image-prompts/SPEC-v2.md:199 | SUA: cue A1-13 không khớp transcript kể cả sau chuẩn hóa khoảng trắng
D08 | mở | image-prompts/SPEC-v2.md:140 | SUA: tư liệu thay thế chưa bắt buộc phân biệt niên đại và mức xác nhận ngoại hình
D09 | mở | image-prompts/SPEC-v2.md:19 | SUA: bằng chứng bổ sung cho D01 chưa hỗ trợ kết luận mọi tên người thật bị chặn trong chế độ ảnh hiện tại
D10 | mở | image-prompts/SPEC-v2.md:163 | CHAN: Lặp thông tin hai chiều giữa assets và produces gây rủi ro bất đồng bộ
D11 | mở | image-prompts/SPEC-v2.md:141 | CHAN: Xung đột logic khi hạ cấp nhân vật không ảnh thành group hoặc object
```
