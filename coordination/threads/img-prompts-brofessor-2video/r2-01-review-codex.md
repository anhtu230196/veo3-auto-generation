# r2-01 — Review Codex — SHOT-LIST v2

Artifact: `image-prompts/SHOT-LIST.md`, v2. Đếm trực tiếp: **385 dòng**, gồm A: 194 và B: 191.

**Chưa thông qua.** D05 và D07 chưa sửa hết. Có một điểm mới D13. Chấp nhận phản bác D04 và D09; không yêu cầu viết lại toàn bộ bảng.

## D05 — CHAN — Vẫn còn prompt yêu cầu cả khu vực

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:129` (A5-05), `:209` (A10-05), `:273` (A14-04), `:341` (B1-09), `:472` (B8-12).

**VẤN ĐỀ GÌ:** Các dòng này vẫn yêu cầu:

- Một con phố châu Âu với ban công.
- Một con phố mùa đông gồm các khối nhà cao tầng.
- Cả khu chợ cổ đông người.
- Một thành phố có hệ thống kênh cạn.
- Một con phố châu Âu đóng băng.

Đây là bối cảnh cả khu vực, đúng loại vẫn bị cấm tại `image-prompts/SHOT-LIST.md:31`. Việc tách các tổ hợp A2-04, B2-05 và B16-06 đã giải quyết những ví dụ cụ thể ở vòng trước, nhưng chưa giải quyết hết cùng loại lỗi.

Chấp nhận ngoại lệ nhóm người cùng thực hiện một hành động tại luật 7. Những ví dụ trên không thuộc ngoại lệ đó.

**CẦN GÌ ĐỂ ĐÓNG:** Thay các bối cảnh còn lại bằng phần tử cụ thể phục vụ đoạn kể, chẳng hạn một đoạn kênh cạn hoặc một tòa nhà đóng băng; tách các vật cần đặt độc lập. Rà những dòng còn cùng loại theo chính luật 1 và luật 7 của bảng.

## D07 — SUA — Vẫn có prompt mất danh tính địa lý

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:289` (A15-03), `:496` (B10-03).

**VẤN ĐỀ GÌ:** Có thêm hai bằng chứng cụ thể ngoài ví dụ tòa nhà ở vòng trước:

- A15-03 chỉ yêu cầu `a blank unlabeled map with small fortress markers on it`. Nguồn xác định mạng lưới pháo đài tại **Persia và Syria**: `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:105`. Prompt không xác định vùng bản đồ.
- B10-03 chỉ yêu cầu `a blank unlabeled city map between two rivers`. Nguồn xác định **Manhattan**, khu Midtown giữa **East River và Hudson**: `input/style-ref/brofessor-stein/_jT8g9SjUN8/transcript.md:75` và `:77`. Prompt không xác định thành phố hoặc hai con sông.

`build_image_prompts.py:107` chỉ lấy prompt thô rồi nối style; tiêu đề mục không được truyền vào để khôi phục các danh tính này. A3-02 đã sửa đúng thành New Jersey, nhưng chưa thể chốt D07 cho cả bảng.

**CẦN GÌ ĐỂ ĐÓNG:** Ghi rõ vùng Persia/Syria và Manhattan/Midtown cùng hai sông tương ứng trong các prompt trên; giữ `unlabeled` hoặc `no text`. Rà những prompt địa lý/công trình còn dùng mô tả chung thay cho đối tượng được narration xác định. Tên dùng để chọn đối tượng không phải yêu cầu in tên lên ảnh.

## D13 — SUA — Solonik bị đổi thành cầm hai súng bằng một bàn tay

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:208` (A10-04).

**VẤN ĐỀ GÌ:** Prompt là `a hand holding two pistols at once`, tức một bàn tay cầm cả hai súng. Narration nói Solonik thường bắn hai súng cùng lúc tại `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:67`. Khung nguồn `input/style-ref/brofessor-stein/nRiezhIOHH0/frames/f_0068.jpg` cho thấy rõ **mỗi tay cầm một súng**. Prompt làm sai động tác đang được minh họa.

**CẦN GÌ ĐỂ ĐÓNG:** Đổi thành nhân vật cầm một súng trong mỗi tay, chẳng hạn `a man aiming two pistols, one in each hand`.

## D04 — OK — Chấp nhận phản bác trong phạm vi phân tích video

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:386`–`:404`.

**VẤN ĐỀ GÌ:** Tiêu đề đã đổi thành con voi ở Bastille. Ghi chú phân biệt hai dự án và quy rõ các chi tiết phòng khiêu vũ, tai làm loa là lời của video gốc. Transcript B tại `:31` và `:33` thực sự có các chi tiết ấy.

Chấp nhận giữ B4-08/B4-09 để minh họa narration theo phạm vi luồng này. Yêu cầu loại chúng khỏi danh sách ở vòng trước vượt quá việc đối chiếu với video khi bảng đã công khai giới hạn nguồn.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đáp ứng bằng tiêu đề và ghi chú v2. Chốt đã sửa; việc này không xác nhận các chi tiết ấy đúng về lịch sử.

## D09 — OK — Huy hiệu dao cạo có trong hình nguồn

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:73` (A2-03).

**VẤN ĐỀ GÌ:** Kiểm lại `input/style-ref/brofessor-stein/nRiezhIOHH0/sheets/sheet_01.jpg` thấy huy hiệu vuông nền đen, giữa có lưỡi dao cạo, dưới mũi tên từ biểu tượng Popeye. Nhận định vòng trước rằng khung nguồn không có dao cạo là sai.

V2 đã đổi từ lưỡi dao riêng lẻ thành huy hiệu có lưỡi dao ở giữa, kèm `no text`, phù hợp bằng chứng này.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đáp ứng. Chấp nhận phản bác và chốt đã sửa.

## Các điểm còn lại

| Điểm | Nhãn | Chỗ nào | Nhận định | Cần gì để đóng |
| --- | --- | --- | --- | --- |
| D01 | OK | `image-prompts/SHOT-LIST.md:386`; `coordination/threads/img-prompts-brofessor-2video/r2-00-response-claude.md:15` | B4 đã đổi tên; bảng giải trình cung cấp căn cứ nhận diện các mục còn lại từ transcript. | Chốt đã sửa trong phạm vi khôi phục tên mục video; không giữ một yêu cầu kiểm chứng chung chung. |
| D06 | OK | `image-prompts/SHOT-LIST.md:263` | Locusta đã trở lại là phụ nữ mặc trang phục La Mã, bị xiềng xích. | Đã đáp ứng; chốt đã sửa. |
| D08 | OK | `image-prompts/SHOT-LIST.md:84`, `:162` | Nút và thẻ treo cửa đã có yêu cầu để trống, không chữ. | Đã đáp ứng ở mức prompt; chốt đã sửa. |
| D10 | OK | `image-prompts/SHOT-LIST.md:96`, `:337`, `:466` | Các ví dụ bị nêu đã bỏ dấu hỏi và mũi tên. | Đã đáp ứng; chốt đã sửa. |
| D11 | OK | `image-prompts/SHOT-LIST.md:167`, `:232`, `:449`, `:470`, `:534`, `:552` | Các ấn phẩm liên quan đã có chỉ dẫn để trống hoặc không chữ; sổ cái không còn yêu cầu một con số. | Đã đáp ứng ở mức prompt; chốt đã sửa. |
| D12 | OK | `image-prompts/SHOT-LIST.md:92`, `:126`, `:212`, `:223`, `:334`, `:447`, `:496` | Các bản đồ đã có chỉ dẫn không nhãn. Việc thiếu danh tính địa lý được xử lý riêng tại D07. | Chốt đã sửa phần cấm chữ. |

D02 và D03 giữ trạng thái đã chốt; không đặt thêm điều kiện sinh ảnh thử hoặc đổi mật độ.

## Toi da khong kiem cai gi

- Đã đọc toàn bộ SHOT-LIST v2 và bốn file vòng trước. Đối chiếu văn bản với transcript; phần video B có một lượt rà độc lập bằng agent phụ.
- Chỉ xem `sheet_01.jpg`, `sheet_04.jpg` và `frames/f_0068.jpg` của video A. Chưa xem toàn bộ hai video hoặc hình video B, nên chưa xác nhận danh sách bao phủ đầy đủ mọi phần tử trên màn hình.
- Chưa kiểm chứng độc lập toàn bộ dữ kiện lịch sử, kỹ thuật hoặc tên riêng. Việc đóng D01/D04 không phải chứng nhận sử liệu.
- Chưa sinh ảnh, thử tách nền hoặc kiểm nhịp dựng chính xác. Đóng các điểm cấm chữ chỉ xác nhận nội dung prompt đã sửa.
- Chưa chạy `build_image_prompts.py --check` vì lệnh `python` không khả dụng; đã đọc script và đếm dòng bằng Node. PowerShell chặn thao tác đổi mã hóa console; đọc UTF-8 bằng Node đã khắc phục phần đọc văn bản.
- Chưa đánh giá bản quyền hoặc khả năng bật quảng cáo.

```points
D01 | chốt: đã sửa | image-prompts/SHOT-LIST.md:386 | B4 đã đổi tên; chấp nhận căn cứ khôi phục tên mục trong phạm vi phân tích video
D02 | chốt: giữ nguyên | coordination/threads/img-prompts-brofessor-2video/r1-00-proposal-claude.md:39 | Sinh ảnh thử không phải điều kiện đóng bước danh sách
D03 | chốt: giữ nguyên | image-prompts/SHOT-LIST.md:36 | Giữ mục tiêu mật độ; chưa xác nhận nhịp thay hình thực tế
D04 | chốt: đã sửa | image-prompts/SHOT-LIST.md:388 | Chấp nhận giữ chi tiết theo narration sau khi đổi tên và ghi rõ giới hạn nguồn
D05 | mở | image-prompts/SHOT-LIST.md:129 | Vẫn còn phố, khu chợ và thành phố nguyên cảnh trái luật phần tử rời
D06 | chốt: đã sửa | image-prompts/SHOT-LIST.md:263 | Locusta đã trở lại là phụ nữ mặc trang phục La Mã
D07 | mở | image-prompts/SHOT-LIST.md:496 | Bản đồ còn thiếu danh tính Manhattan và vùng Persia/Syria trong prompt
D08 | chốt: đã sửa | image-prompts/SHOT-LIST.md:84 | Nút và thẻ treo đã yêu cầu để trống không chữ
D09 | chốt: đã sửa | image-prompts/SHOT-LIST.md:73 | Xác nhận huy hiệu dao cạo có trong hình nguồn và prompt đã sửa đúng đối tượng
D10 | chốt: đã sửa | image-prompts/SHOT-LIST.md:466 | Các dấu hỏi và mũi tên bị nêu đã bỏ khỏi prompt
D11 | chốt: đã sửa | image-prompts/SHOT-LIST.md:449 | Các ấn phẩm bị nêu đã có chỉ dẫn để trống hoặc không chữ
D12 | chốt: đã sửa | image-prompts/SHOT-LIST.md:496 | Các bản đồ đã có chỉ dẫn không nhãn
D13 | mở | image-prompts/SHOT-LIST.md:208 | Prompt gộp hai súng vào một bàn tay trong khi hình nguồn cho mỗi tay cầm một súng
```