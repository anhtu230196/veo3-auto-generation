# r1 · Review Codex — SHOT-LIST v1

Artifact: `image-prompts/SHOT-LIST.md`, v1.

**Chưa thông qua.** Bảng đủ 376 dòng, gồm A: 190 và B: 186, nhưng còn nhiều prompt yêu cầu cả cảnh dựng sẵn, trái với đầu ra phần tử rời đã thống nhất. Có thêm các lỗi cục bộ dưới đây; không cần viết lại toàn bộ bảng.

## Các điểm đang mở từ bản đề xuất

| Điểm | Chỗ nào | Nhận định | Cần gì để đóng |
| --- | --- | --- | --- |
| D01 — HOI | `image-prompts/SHOT-LIST.md:360` | Chưa thể xác nhận cả 16 tên mục B đều đúng. B4 có dấu hiệu lẫn hai dự án; bằng chứng mới ở D04. | Giải quyết D04 rồi cập nhật kết luận về tên B4. |
| D02 — OK | `coordination/threads/img-prompts-brofessor-2video/r1-00-proposal-claude.md:39` | Chưa chạy model không phải lỗi chặn bước danh sách ảnh. Bản đề xuất đã công khai giới hạn này. | Chốt giữ nguyên ở bước hiện tại; không yêu cầu sinh ảnh để đóng vòng review này. |
| D03 — OK | `image-prompts/SHOT-LIST.md:21` | Có thể giữ mục tiêu 5–8 giây. Chưa có căn cứ buộc giãn toàn bộ bảng. Tuy nhiên, 123 frame lấy mẫu không tự chứng minh số lần thay hình của video gốc. | Chốt giữ nguyên mục tiêu mật độ; không coi đây là nhịp dựng đã được xác minh. |

## D04 — HOI — B4 có dấu hiệu lẫn danh tính hai dự án voi

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:360`, `:365`, `:371`, `:372`.

**VẤN ĐỀ GÌ:** Tiêu đề dùng “The Triumphal Elephant”, nhưng chuỗi Napoleon, đại bác và mô hình thạch cao đang kể dự án Elephant of the Bastille. Library of Congress ghi *L’éléphant triomphal* là công trình của Charles François Ribart xuất bản năm 1758. [Hồ sơ Library of Congress](https://www.loc.gov/pictures/item/64058298/).

Nguồn Fondation Napoléon mô tả dự án Bastille với tháp trên lưng voi và cầu thang trong chân để phục vụ thiết bị cấp nước. Nguồn này chưa xác nhận ballroom hoặc tai dạng megaphone như B4-08 và B4-09. Đây là dấu hiệu cần kiểm tra việc trộn dự án, chưa đủ để khẳng định hai chi tiết ấy chắc chắn thuộc Ribart. [Fondation Napoléon](https://www.napoleon.org/jeunes-historiens/napodoc/monuments-napoleoniens-le-mysterieux-elephant-de-la-place-de-la-bastille/).

**CẦN GÌ ĐỂ ĐÓNG:** Xác định rõ B4 đang minh họa Elephant of the Bastille, ghi tên chuẩn bên cạnh tên chương video nếu cần. Với ballroom và megaphone ears, bổ sung nguồn đúng dự án hoặc bỏ hai chi tiết chưa xác minh khỏi danh sách cần vẽ. Không cần đổi các mục B khác.

## D05 — CHAN — Nhiều dòng vẫn yêu cầu cảnh và bố cục dựng sẵn

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:59`, `:101`, `:209`, `:332`, `:563`; đối chiếu luật tại `:8`.

**VẤN ĐỀ GÌ:** Các ví dụ rõ nhất:

- A2-04 ghép mũ cảnh sát, búa thẩm phán, máy ảnh và micro thành một hàng.
- A4-12 yêu cầu cả bãi đỗ xe phủ tuyết.
- A11-07 yêu cầu cả thị trấn nghỉ dưỡng ven biển ban đêm.
- B2-05 đặt hai tòa nhà cạnh nhau để so kích thước.
- B16-06 ghép ballroom, đường bowling và sân trượt thành một hàng.

Đây là các bối cảnh hoặc tổ hợp đã khóa cách đặt phần tử, trong khi bảng quy định Tú sẽ tự ghép và canh vị trí. Khối style trong `scripts/build_image_prompts.py:22` chỉ thêm cách vẽ và nền trắng, không chuyển những yêu cầu này thành asset độc lập.

**CẦN GÌ ĐỂ ĐÓNG:** Rà các dòng cùng loại: tách những đối tượng cần đặt hoặc chỉnh kích thước độc lập thành các dòng riêng; thay cảnh toàn khu vực bằng phần tử cụ thể phục vụ câu kể. Không cần tách các bộ phận vốn thuộc cùng một vật, như thân và cánh máy bay.

## D06 — SUA — Locusta bị đổi thành đàn ông

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:244`, A13-11.

**VẤN ĐỀ GÌ:** Prompt là “a man in chains led through a street”. Đoạn này đang minh họa Locusta bị dẫn đi trong xiềng xích. Chính A13-01 tại dòng 234 xác định nhân vật là phụ nữ; nguồn tương ứng là `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:93` và `:95`. Đây là đổi nhầm nhân vật ngay trong cùng mục.

**CẦN GÌ ĐỂ ĐÓNG:** Đổi thành người phụ nữ mặc trang phục La Mã, nhất quán với A13-01; giữ hành động bị xiềng xích.

## D07 — SUA — Prompt bỏ mất danh tính địa lý và công trình cần minh họa

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:74`, A3-02; `:450`, B9-04.

**VẤN ĐỀ GÌ:** A3-02 yêu cầu bản đồ Mỹ với “one small state shaded” nhưng không chỉ định bang nào. Transcript nói New Jersey tại `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:17`.

B9-04 yêu cầu một “shorter famous skyscraper”, trong khi công trình được dùng để so sánh là Empire State Building tại `input/style-ref/brofessor-stein/_jT8g9SjUN8/transcript.md:71`.

Hàm xuất prompt chỉ lấy nội dung cột `vẽ gì` rồi nối style (`scripts/build_image_prompts.py:107`). Model không nhận đoạn narration để tự khôi phục những danh tính bị bỏ mất.

**CẦN GÌ ĐỂ ĐÓNG:** Ghi rõ New Jersey và Empire State Building trong prompt liên quan; rà những chỗ tương tự đang dùng “famous”, “one small state” hoặc địa danh không xác định. Tên dùng để xác định vật cần vẽ không đồng nghĩa với yêu cầu in tên lên ảnh.

## D08 — SUA — Một số prompt vẫn yêu cầu chữ dù bảng cấm chữ

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:66`, A2-11; `:143`, A7-07.

**VẤN ĐỀ GÌ:** “a subscribe button” và “a do not disturb sign” gọi trực tiếp các thành phần thường được nhận diện bằng chữ, nhưng không yêu cầu để trống. Điều này trái với luật tại dòng 13–14. Khối style được nối vào cũng không có chỉ dẫn cấm chữ, nên luật trong phần đầu Markdown chưa đi vào những prompt thực sự được xuất.

**CẦN GÌ ĐỂ ĐÓNG:** Cho các nút và biển này thành hình dạng trống, không ký tự; phần chữ đã thuộc hậu kỳ theo quy ước hiện có. Kiểm tra các prompt tương tự để không còn yêu cầu nhãn chữ trái luật.

## D09 — SUA — Lưỡi dao cạo trong đoạn Popeye chưa có căn cứ

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:58`, A2-03.

**VẤN ĐỀ GÌ:** Ở mốc này, narration nói số người Popeye giết và những nhóm bị nhắm tới; không nói dao cạo hoặc phương thức dùng dao cạo. Nguồn: `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:11`. Khung 1:28 trong `input/style-ref/brofessor-stein/nRiezhIOHH0/sheets/sheet_01.jpg` cũng minh họa số nạn nhân và các nhóm người, không có lưỡi dao này.

Asset thêm một hung khí chưa được nguồn gắn với đoạn kể, thay vì minh họa thông tin đang được nói tới.

**CẦN GÌ ĐỂ ĐÓNG:** Chỉ ra câu hoặc khung nguồn làm căn cứ cho dao cạo; nếu không có, bỏ dòng này hoặc thay bằng phần tử phục vụ thông tin về số lượng/nhóm nạn nhân.

## Toi da khong kiem cai gi

- Đã đọc toàn bộ SHOT-LIST v1, bản đề xuất r1 và hai transcript. Chỉ xem `sheet_01.jpg` của video A; chưa xem toàn bộ video A hoặc các sheet còn lại.
- Chưa xem hình/video B. Thư mục B được kiểm tra chỉ có transcript, phụ đề và metadata, nên chưa thể xác nhận bảng bao phủ đầy đủ các phần tử xuất hiện trên màn hình video gốc.
- Chưa kiểm chứng độc lập toàn bộ dữ kiện lịch sử, kỹ thuật hoặc cả 16 tên mục B. Việc tra cứu ngoài transcript trong review này tập trung vào nghi vấn B4.
- Chưa chạy model ảnh, thử tách nền hoặc kiểm nhịp dựng chính xác. Không dùng những việc thuộc bước sau này làm điều kiện thông qua danh sách.
- Chưa chạy `build_image_prompts.py --check` vì lệnh `python` không khả dụng. Đã đọc script và đếm trực tiếp các dòng bằng Node: 376, gồm A: 190 và B: 186.
- Chưa đánh giá bản quyền hoặc khả năng bật quảng cáo; review này không xác nhận hai mặt đó.

```points
D01 | mở | image-prompts/SHOT-LIST.md:360 | Chưa chốt tên B4; xem bằng chứng mới tại D04
D02 | chốt: giữ nguyên | coordination/threads/img-prompts-brofessor-2video/r1-00-proposal-claude.md:39 | Chạy thử model không phải điều kiện đóng bước danh sách ảnh
D03 | chốt: giữ nguyên | image-prompts/SHOT-LIST.md:21 | Giữ mục tiêu 5–8 giây; chưa xác nhận đây là nhịp thay hình thực tế
D04 | mở | image-prompts/SHOT-LIST.md:360 | B4 có dấu hiệu lẫn Triumphal Elephant của Ribart với Elephant of the Bastille
D05 | mở | image-prompts/SHOT-LIST.md:59 | Nhiều prompt vẫn yêu cầu cảnh hoặc bố cục ghép sẵn thay vì phần tử rời
D06 | mở | image-prompts/SHOT-LIST.md:244 | Locusta bị đổi thành đàn ông trong hình bị xiềng xích
D07 | mở | image-prompts/SHOT-LIST.md:74 | Prompt bỏ mất danh tính bang và công trình cần minh họa
D08 | mở | image-prompts/SHOT-LIST.md:66 | Nút và biển còn yêu cầu chữ trái với quy ước của bảng
D09 | mở | image-prompts/SHOT-LIST.md:58 | Dao cạo trong đoạn Popeye chưa có căn cứ từ narration hoặc khung đã kiểm
```