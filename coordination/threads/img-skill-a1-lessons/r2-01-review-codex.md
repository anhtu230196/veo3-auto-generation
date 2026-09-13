# r2-01-review-codex

**Artifact:** `coordination/drafts/img-skill-a1-lessons.md`, v2.  
**Kết luận:** Chốt D01–D05: đã sửa. Không mở điểm mới. Chấp nhận bản v2 trong phạm vi luật chuẩn bị phần tử dựng; không coi các phương án ghi “chưa đo” là cơ chế đã được kiểm chứng. Luồng vẫn cần lượt review thực chất của Gemini.

## Đối chiếu bắt buộc: tám góp ý, RUNBOOK mục 0 và SPEC-v2

Đã đối chiếu tám góp ý được trích trong bản nháp với cách áp dụng trong A1, các kết quả đo liên quan trong RUNBOOK mục 0 và SPEC-v2. Chưa có bản ghi độc lập của tám góp ý để xác minh tính đầy đủ của phần trích dẫn.

| Luật | Kết quả review v2 |
| --- | --- |
| 1 — Người và vật riêng | Đúng yêu cầu chuẩn bị người lộ tai để Tú ghép đùi đá. Điều kiện cần di chuyển vật ở hậu kỳ đã thay lệnh cấm tuyệt đối ảnh vật chạm người. |
| 2 — Trạng thái nhân vật | Cảnh bắt giữ đúng góp ý A1. Điều kiện chung §0 giới hạn việc thêm ảnh; tái dùng asset phù hợp kết quả đo giữ nhân vật trong RUNBOOK. |
| 3 — Người được gọi tên | Anastasia và Luciano đúng yêu cầu A1. Ví dụ Gaviria làm rõ rằng tên riêng không tự động bắt buộc thêm asset. Chọn tư liệu theo thời điểm phù hợp SPEC-v2. |
| 4 — Niên đại tên gọi | Đúng yêu cầu tìm tư liệu Gambino; đã giới hạn kết quả tìm kiếm và chọn hình theo loại chủ thể. Không còn mặc định mọi chủ thể đều thành `group`. |
| 5 — Trạng thái gốc | Đúng yêu cầu thêm tấm ga để nối bằng mũi tên hậu kỳ. Đã phân biệt cách mô tả vải có kết quả với giả thuyết sinh B từ A chưa đo; ví dụ khớp JSON. |
| 6 — Chỗ nối | Đúng yêu cầu dây ga buộc vào lò sưởi. Chỗ buộc là nội dung cần thể hiện; không mở lại việc định vị hai vật rời bị SPEC-v2 §3 cấm. |
| 7 — Hành động nối | Đúng yêu cầu thêm cảnh đu dây. Giới hạn bằng chứng mới ngăn tự lấp khoảng trống chưa biết; A1-15b đã được ghi là minh họa giả thuyết chính thức. |
| 8 — Người nói và chuỗi tư thế | Đúng yêu cầu cảnh Luciano khoe với bạn tù. Chuỗi tư thế đã trở thành tùy chọn, thử nghiệm; tách khung đầu từ asset và biến thể từ khung đầu, không hứa giữ khung khi chưa đo. |

Phần 9b phân loại cảnh nhiều người thành `group` giải quyết xung đột với “Only one person”. Phần 9d hiểu đúng `noAnchors`: ngăn tự đính ảnh ngoài câu, không cấm gọi ảnh neo có vai rõ trong câu. Không đánh giá phong cách nét vẽ.

Nguồn The Mob Museum xác nhận Reles được dự kiến làm chứng chống Anastasia sáng 12-11-1941 và việc ông chết khiến vụ án chống Anastasia mất nhân chứng then chốt. Điều này hỗ trợ ghi chú lịch sử mới và lựa chọn chân dung trung tính trong bản v2. [The Mob Museum](https://themobmuseum.org/blog/eighty-two-years-ago-this-month-murder-inc-s-abe-reles-took-a-mysterious-fall/)

## D01 — OK — Chốt: đã sửa

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:35`, `:44`, `:82`, `:111`, `:237`.

**VẤN ĐỀ GÌ:** Điểm cũ về tổng quát hóa yêu cầu A1 đã được xử lý bằng điều kiện chung, ngoại lệ ghép người/vật, ví dụ Gaviria và việc giữ chuỗi tư thế là tùy chọn.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đủ. Trả lời câu hỏi của tác giả: không cần thêm phép thử định lượng để đóng D01; tiêu chí thông tin hoặc thao tác dựng chưa được đảm nhiệm phù hợp quyết định này.

## D02 — OK — Chốt: đã sửa

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:119`, `:139`.

**VẤN ĐỀ GÌ:** Đã bỏ khẳng định kiểm kê toàn Commons và thay phương án `group` chung bằng lựa chọn theo loại chủ thể. Khoảng trống tìm kiếm dưới tên Mangano vẫn được công khai.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đủ cho lỗi phạm vi của luật mà D02 nêu.

## D03 — OK — Chốt: đã sửa

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:160`, `:163`, `:167`, `:169`; `image-prompts/A1.shots.json:239`, `:249`.

**VẤN ĐỀ GÌ:** Đã rút nhận định thiếu căn cứ về nguyên nhân lỗi dây bện. Sinh B từ A được ghi chưa đo; hai trạng thái ga trong JSON thực sự sinh độc lập. Yêu cầu giữ thuộc tính đã loại trừ thuộc tính bị biến đổi.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đủ; không cần sinh ảnh để đóng lỗi diễn đạt cơ chế này.

## D04 — OK — Chốt: đã sửa

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:210`, `:215`, `:217`; `image-prompts/A1.shots.json:269`, `:274`, `:294`.

**VẤN ĐỀ GÌ:** Đã thêm giới hạn bằng chứng, bảo toàn nhãn giả thuyết và đổi “phủ nhận” thành “đặt nghi vấn”. A1-16b cũng đã bỏ kết luận vật lý không được chứng minh.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đủ. Không còn điểm CHẶN của Codex về luật bổ sung hành động.

## D05 — OK — Chốt: đã sửa

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:237`, `:239`, `:249`; `image-prompts/A1.shots.json:352`, `:361`.

**VẤN ĐỀ GÌ:** Đã tách tạo khung đầu từ asset và tạo biến thể từ khung đầu. JSON khai `frame-luciano-base`, các biến thể gọi đúng khung Luciano riêng. Bản nháp phân biệt giữ nhân vật với giữ khung và ghi rõ chưa đo.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đủ vì cơ chế chưa kiểm chứng không còn được đưa thành luật bắt buộc.

## Tôi đã không kiểm cái gì

- Chưa xác minh độc lập nguyên văn tám góp ý ngoài các trích dẫn trong repo.
- Không mở ảnh để kiểm dung mạo, phía sẹo Luciano, trang phục tù hoặc nét vẽ.
- Không sinh ảnh, chạy Flow, chạy builder hay xác nhận chuỗi tư thế cắt nối được.
- Không kiểm toán toàn bộ lịch sử A1. Trang Britannica mở trực tiếp trả lỗi; chưa xác minh độc lập toàn bộ bảng niên đại mới.
- Đầu ra đọc toàn RUNBOOK và một số lần đọc gộp bị cắt; đã đọc bổ sung phần liên quan, không nhận là đã đọc trọn RUNBOOK.
- PowerShell chặn cả tạo đối tượng mã hóa lẫn gán `Console.OutputEncoding`; đọc UTF-8 vẫn mất một số dấu tiếng Việt. Không lấy riêng phần chữ không rõ làm căn cứ kết luận lỗi.
- Không tạo hoặc sửa file, kể cả `THREAD.md`.

```points
D01 | chốt: đã sửa | coordination/drafts/img-skill-a1-lessons.md:35 | OK — Điều kiện thêm phần tử và các ngoại lệ đủ đóng lỗi tổng quát hóa
D02 | chốt: đã sửa | coordination/drafts/img-skill-a1-lessons.md:139 | OK — Chọn hình theo chủ thể, giới hạn khẳng định về kết quả tìm kiếm
D03 | chốt: đã sửa | coordination/drafts/img-skill-a1-lessons.md:167 | OK — Tách mô tả vải có căn cứ khỏi sinh B từ A chưa đo
D04 | chốt: đã sửa | coordination/drafts/img-skill-a1-lessons.md:215 | OK — Giữ giới hạn bằng chứng và mức chắc chắn trong bản nháp cùng JSON
D05 | chốt: đã sửa | coordination/drafts/img-skill-a1-lessons.md:239 | OK — Biến thể từ khung đầu, chuỗi tư thế vẫn là tùy chọn thử nghiệm
```