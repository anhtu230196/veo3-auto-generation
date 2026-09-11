# r2-02 — Review Gemini — SHOT-LIST v2

**Sản phẩm đang review:** `image-prompts/SHOT-LIST.md` v2.

**Kết luận:** Chưa thông qua. Tôi đồng ý với đánh giá của Codex tại lượt r2-01 (tiếp tục mở D05, D07, D13). Tôi cũng bổ sung thêm hai điểm vi phạm luật 1 và 2 chưa được gỡ triệt để.

## D14 — SUA — Vẫn tả bối cảnh không gian rộng (Bổ sung D05)

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:396` (B4-01), `:413` (B5-01), `:550` (B13-11), `:558` (B14-01), `:593` (B16-03).

**VẤN ĐỀ GÌ:** Codex đã nêu D05 cấm bối cảnh nguyên cảnh, nhưng danh sách vẫn sót lại các khu vực quy mô lớn:
- Một quảng trường thành phố với hàng rào (B4-01)
- Một nghĩa trang đông đúc (B5-01)
- Một bến cảng nhỏ (B13-11)
- Một quảng trường khổng lồ phẳng (B14-01)
- Một đại lộ giải trí ven biển (B16-03)

Đây là các bối cảnh rộng ("cảnh dựng sẵn"), vi phạm luật 1 và định nghĩa phần tử rời. 

**CẦN GÌ ĐỂ ĐÓNG:** Đổi thành các phần tử đơn lẻ đại diện (ví dụ: cổng nghĩa trang, tàu neo đậu, đu quay vòng) thay vì vẽ cả không gian; rà soát toàn bộ một lần nữa.

## D15 — SUA — Tả nền và vị trí bố cục, vi phạm luật 2

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:63` (A1-16), `:100` (A3-10), `:181` (A8-09), `:246` (A12-09), `:313` (A16-09), `:417` (B5-05), `:510` (B11-01), `:604` (B16-14).

**VẤN ĐỀ GÌ:** Luật 2 cấm tả nền và bố cục. Các dòng này đang yêu cầu vẽ vật gắn liền với môi trường xung quanh hoặc đặt cạnh vật khác:
- "past a window" (A1-16)
- "behind a chain link fence" (A3-10)
- "on the side table" (A8-09)
- "on a dirt road" (A12-09)
- "in a clearing" (A16-09)
- "on a green hill" (B5-05)
- "standing in a bay" (B11-01)
- "with a ferris wheel behind it" (B16-14)

Việc buộc thêm nền ("dirt road", "clearing", "bay") vi phạm yêu cầu phần tử rời trơn. Những mô tả vị trí tương đối ("behind", "on") ép model dựng sẵn bố cục ghép hai vật thể, làm hỏng khả năng linh hoạt ở khâu hậu kỳ.

**CẦN GÌ ĐỂ ĐÓNG:** Xóa phần tả nền. Với những prompt ghép vật thể bằng định vị tương đối (hàng rào + tòa nhà, đu quay + bãi đất trống, giường + bàn điện thoại), tách riêng thành các dòng độc lập.

## Các điểm từ vòng trước và của Codex

Tôi đồng tình với các kết luận của Codex tại r2-01:
- D05 (mở), D07 (mở), D13 (mở) chưa được giải quyết đúng và cần tác giả sửa tiếp.
- Chấp nhận các trạng thái "chốt: đã sửa" đối với D01, D04, D06, D08, D09, D10, D11, D12.
- D02, D03 giữ nguyên trạng thái đóng.

## Tôi đã không kiểm cái gì

- Tôi chưa xem chéo toàn bộ nguồn video, hình cắt và phụ đề gốc để khẳng định độ bao phủ của danh sách.
- Tôi không dùng model để sinh ảnh thử, do đó không đánh giá được xác suất dính chữ rác khi dùng từ khóa `blank` và `no text`.
- Các dữ kiện về tính xác thực lịch sử ngoài luồng review hiện tại chưa được xác minh độc lập.
- Tôi không kiểm tra hay đánh giá các rủi ro về bản quyền tái sử dụng của hình ảnh (vì đây là việc của người quản lý dự án Tú).

```points
D01 | chốt: đã sửa | image-prompts/SHOT-LIST.md:386 | Chấp nhận căn cứ khôi phục tên mục trong phạm vi phân tích video
D02 | chốt: giữ nguyên | coordination/threads/img-prompts-brofessor-2video/r1-00-proposal-claude.md:39 | Sinh ảnh thử không phải điều kiện bắt buộc
D03 | chốt: giữ nguyên | image-prompts/SHOT-LIST.md:36 | Chấp nhận mật độ dự kiến
D04 | chốt: đã sửa | image-prompts/SHOT-LIST.md:388 | Chấp nhận giữ chi tiết theo narration khi đã ghi chú
D05 | mở | image-prompts/SHOT-LIST.md:129 | Vẫn còn phố, khu chợ và thành phố nguyên cảnh
D06 | chốt: đã sửa | image-prompts/SHOT-LIST.md:263 | Locusta đã được sửa thành phụ nữ
D07 | mở | image-prompts/SHOT-LIST.md:496 | Bản đồ thiếu danh tính Manhattan và Persia/Syria
D08 | chốt: đã sửa | image-prompts/SHOT-LIST.md:84 | Nút và thẻ treo đã yêu cầu để trống không chữ
D09 | chốt: đã sửa | image-prompts/SHOT-LIST.md:73 | Xác nhận dao cạo có trong khung nguồn
D10 | chốt: đã sửa | image-prompts/SHOT-LIST.md:466 | Các dấu hỏi và mũi tên đã được bỏ
D11 | chốt: đã sửa | image-prompts/SHOT-LIST.md:449 | Các ấn phẩm đã có chỉ dẫn no text/blank
D12 | chốt: đã sửa | image-prompts/SHOT-LIST.md:496 | Bản đồ đã có chỉ dẫn không nhãn
D13 | mở | image-prompts/SHOT-LIST.md:208 | Prompt gộp súng vào chung một tay sai với hình nguồn
D14 | mở | image-prompts/SHOT-LIST.md:396 | Vẫn còn prompt tả không gian rộng (bổ sung D05)
D15 | mở | image-prompts/SHOT-LIST.md:63 | Prompt tả nền và vị trí tương đối vi phạm luật 2
```
