# r2-02-review-gemini.md

## TÌM TƯ LIỆU ẢNH THẬT CHO A1

1. ice pick kiểu 1930-1940
URL: TRUY VẤN TRẢ KHÔNG RA GÌ
TRANG: TRUY VẤN TRẢ KHÔNG RA GÌ
CHO: A1-03
THAY GI: Không tìm được ảnh trực tiếp có niên đại rõ ràng 1930-1940 từ các bảo tàng khác (URL cũ trả về HTML, chưa tìm được URL mới thay thế).
TRUY VAN: "ice pick" 1930s photograph museum -pinterest

2. ảnh chụp THẬT Half Moon Hotel, Coney Island, năm 1941
URL: TRUY VẤN TRẢ KHÔNG RA GÌ
TRANG: TRUY VẤN TRẢ KHÔNG RA GÌ
CHO: A1-11
THAY GI: Không tìm được ảnh ngoại thất kiến trúc đúng năm 1941 mà lấy được link trực tiếp. Kho ảnh Getty Images có ảnh chụp ngày 12-11-1941 nhưng chặn tải trực tiếp/trả về trang đăng nhập.
TRUY VAN: "Half Moon Hotel" 1941 photograph exterior -getty

3. thêm chân dung Abe Reles ở góc khác
URL: TRUY VẤN TRẢ KHÔNG RA GÌ
TRANG: TRUY VẤN TRẢ KHÔNG RA GÌ
CHO: A1-01
THAY GI: Các nguồn ảnh báo chí khác đều trùng (cùng buổi chụp) hoặc không nét bằng mugshot (John Jay) và ảnh LOC đã có. Không thu được góc chân dung nào mới.
TRUY VAN: "Abe Reles" alternate portrait 1940 -johnjay -loc

## ĐIỂM REVIEW

### D13 · HOI
**CHO NAO:** image-prompts/SPEC-v2.md:384
**VAN DE GI:** Mục 6 ghi `build_image_prompts.py` xuất `refNames` (mảng flowAssetName đã tra sẵn từ `useAsset`). Tuy nhiên, với shot TẠO asset (như A1-01) hoặc shot object (như A1-03), chúng không có `useAsset` mà có `refs` (mảng chứa tên file local). Mục 6 chưa nói rõ các file local trong `refs` sẽ được truyền và xử lý như thế nào bởi runner. Nếu script chỉ xuất `refNames` dựa vào `useAsset`, các tư liệu gốc dạng file có thể bị sót và không được đính vào ảnh lúc tạo.
**CAN GI DE DONG:** Cập nhật mục 6 làm rõ cách runner tiếp nhận và xử lý `refs` (ví dụ: `build_image_prompts.py` gom tên file local xuất ra một trường riêng để runner upload, hoặc xác nhận việc tải file local lên Flow thuộc trách nhiệm của bước khác).

*Ghi chú ngoài lề về r2-01:*
D11 và D12 do Codex nêu lên là đánh giá sai đối với bản v2. Mục 6 (dòng 385) đã ghi rõ runner đặt tên card bằng `outName`, và mục 5c-bis đã quy định shot dùng lại asset thì kế thừa `refs`. Tôi không có quyền tự đổi trạng thái của D11/D12 do không phải tác giả, nhưng ghi nhận ở đây để tác giả (Claude) dễ dàng phản bác ở lượt sau.

## Tôi đã không kiểm cái gì

- Không chạy công cụ tìm kiếm với các nguồn phải trả phí hoặc cần đăng nhập (như Getty Images) do chạy ở chế độ tự động không quyền duyệt web sâu.
- Không tải ảnh thật về ổ cứng để kiểm tra tính toàn vẹn (header FFD9) do chạy ở chế độ chỉ đọc, chỉ quan sát URL và nội dung HTML trả về.
- Không parse JSON bằng code hay chạy script kiểm tra tính hợp lệ của schema, chỉ rà soát logic của bản đặc tả bằng mắt.
- Không mở file transcript gốc để xác minh lại sự chênh lệch thời gian `at` trong VTT so với spec.

```points
D13 | mở | image-prompts/SPEC-v2.md:384 | HOI: Mục 6 chưa ghi rõ cách truyền mảng refs (file local) cho runner so với refNames từ useAsset
```
