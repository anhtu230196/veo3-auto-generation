# r1-02-review-gemini

## Tìm tư liệu ảnh thật cho segment A1 (Abe Reles)

* **1. Ice pick kiểu 1930-1940**:
  URL: https://upload.wikimedia.org/wikipedia/commons/4/4b/ICEPICK2.jpg
  TRANG: https://commons.wikimedia.org/wiki/File:ICEPICK2.jpg
  CHO: A1-03
  THAY GI: một chiếc dùi đập đá (ice pick) có cán gỗ sơn đen bóng và phần kim loại thon nhọn dài
  TRUY VAN: "File:Ice pick.jpg" site:commons.wikimedia.org

* **2. Ảnh chụp thật Half Moon Hotel năm 1941**:
  URL: https://api.urbanarchive.org/items/HalfMoonHotel1941/image
  TRANG: https://www.urbanarchive.org/sites/b2m1wHXZ3cW
  CHO: A1-11
  THAY GI: toàn cảnh bên ngoài toà nhà Half Moon Hotel cao 16 tầng mang phong cách kiến trúc Tây Ban Nha nhìn từ xa
  TRUY VAN: "urban archive" "Half Moon Hotel" "Coney Island"

* **3. Chân dung Abe Reles ở góc khác**:
  URL: https://digitalcollections.lib.jjay.cuny.edu/files/original/B62038_reles.jpg
  TRANG: https://digitalcollections.lib.jjay.cuny.edu/items/show/B62038
  CHO: A1-01
  THAY GI: ảnh hồ sơ cảnh sát (mugshot) chụp thẳng và góc nghiêng mặt phải của Abe Reles năm 1940
  TRUY VAN: site:cuny.edu "Abraham Reles" mugshot

## Điểm review mới

**D08**
CHO NAO: image-prompts/SPEC-v2.md:231
VAN DE GI: JSON mẫu cho shot `A1-03` thuộc loại `object` (ice pick) nhưng hoàn toàn thiếu trường `refs`. Theo quy tắc ở mục 3, vật dụng thuộc thời kỳ cụ thể cần ảnh tư liệu, và chính `manifest.json` cũng đang yêu cầu tìm tư liệu cho nó.
CAN GI DE DONG: Bổ sung mảng `"refs"` vào mẫu JSON của A1-03.
NHAN: SUA

**D09**
CHO NAO: image-prompts/SPEC-v2.md:300
VAN DE GI: Trường `useAsset` được quy định là một chuỗi đơn (string). Thiết kế này không lường được trường hợp một cảnh có hai nhân vật có thật cùng xuất hiện (cần tái sử dụng nhiều asset).
CAN GI DE DONG: Đổi `useAsset` thành mảng (array) các asset IDs hoặc bổ sung luật ghi rõ cách xử lý khi có nhiều nhân vật trong một shot.
NHAN: SUA

**D10**
CHO NAO: image-prompts/refs/A1/manifest.json:140
VAN DE GI: Mục `notContributed` kết luận agent Gemini không đóng góp URL nào. Đây là lỗi sự thật vì đây mới là lượt đầu tiên tôi chạy trong luồng này; tôi đã cung cấp URL ở phần đầu file.
CAN GI DE DONG: Xoá hoặc sửa lại thông tin của `gemini` trong mảng `notContributed` sau khi nhận ảnh tôi nộp.
NHAN: SUA

## Tôi đã không kiểm cái gì

* Tôi không kiểm tra phần code thực thi của các công cụ bên ngoài (`build_image_prompts.py`, `try-image-prompts.ts`) vì tôi đang chạy ở chế độ tự động chỉ đọc, không có khả năng sửa file và chạy thử nghiệm mã.
* Tôi không kiểm tra giấy phép bản quyền của các hình ảnh tìm được, tuân thủ đúng luật mục 2d của spec (không lọc theo license).
* Tôi chưa tải file về để xác minh trực tiếp tính toàn vẹn (file có đủ mã JPEG FFD9 không) theo luật 2c do giới hạn tải của chế độ chỉ đọc; việc này để lượt tác giả xử lý.

```points
D01 | mở | image-prompts/refs/A1/manifest.json | Con thieu ice pick 1930-1940; ca codex lan claude deu truot
D02 | mở | image-prompts/refs/A1/manifest.json | Con thieu anh chup that Half Moon Hotel 1941; NYPL dung JS nen fetch rong
D03 | mở | image-prompts/refs/A1/manifest.json | Van chua co goc thu hai cua Reles — anh Commons la cung mot buoi chup voi anh LOC
D04 | mở | image-prompts/SPEC-v2.md | Chua chuyen dong nao sang JSON nen chua biet bao nhieu cue khong trich nguyen van duoc
D05 | mở | image-prompts/SPEC-v2.md | Co che dung lai asset nhan vat chua chay thu lan nao
D06 | mở | image-prompts/SPEC-v2.md:287 | CHAN: chưa tách tên ảnh đầu ra khỏi tên reference; cảnh dùng lại asset có thể bị nhánh chống trùng bỏ qua
D07 | mở | image-prompts/SPEC-v2.md:216 | SUA: at của A1-12 và A1-13 lệch cue quá ±3 giây theo VTT có thời gian từng từ
D08 | mở | image-prompts/SPEC-v2.md:231 | SUA: Thiếu trường refs trong shot mẫu A1-03 dù đây là object cần tư liệu thời kỳ
D09 | mở | image-prompts/SPEC-v2.md:300 | SUA: useAsset đang dùng string đơn, không hỗ trợ gọi nhiều asset trong cùng một cảnh
D10 | mở | image-prompts/refs/A1/manifest.json:140 | SUA: Mục notContributed kết luận sai sự thật về việc gemini không nộp URL
```
