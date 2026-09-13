# r1-01-review-codex

**Artifact:** `coordination/drafts/img-skill-a1-lessons.md`, v1.  
**Kết luận:** Cần sửa phạm vi áp dụng và phân biệt yêu cầu dựng với cơ chế chưa được kiểm chứng trước khi chép vào skill.

## Đối chiếu bắt buộc: tám góp ý, RUNBOOK mục 0 và SPEC-v2

Đã đối chiếu tám trích dẫn góp ý trong bản nháp với ví dụ A1, các kết quả đo liên quan trong RUNBOOK và SPEC-v2. Chưa có bản ghi độc lập của tám góp ý để kiểm tra việc trích dẫn có đầy đủ ngữ cảnh hay không.

| Luật | Kết quả |
| --- | --- |
| 1 — Người và vật riêng | Đúng yêu cầu A1-04. Việc tách phục vụ ghép hậu kỳ có căn cứ; chưa có căn cứ biến thành lệnh cấm mọi ảnh vật chạm người. |
| 2 — Trạng thái nhân vật | Đúng yêu cầu thêm cảnh bắt giữ. Ngưỡng bắt buộc còn rộng; cần xét phần tử và lời kể đã có cùng nhau. |
| 3 — Người được gọi tên | Đúng với Anastasia và Luciano. Điều kiện hiện tại chưa giải quyết được trường hợp Gaviria mà tác giả hỏi. |
| 4 — Niên đại tên gọi | Hợp nguyên tắc `dated`/`evidenceFor` của SPEC-v2. Cách xử lý khi thiếu ảnh lại áp một phương án của nhóm mafia cho cả thành phố, quốc gia và đơn vị. |
| 5 — Trạng thái gốc | Đúng yêu cầu thêm tấm ga. Việc bắt buộc sinh B từ A không được chứng minh bằng lỗi dây bện; ví dụ A1 cũng chưa làm như luật viết. |
| 6 — Chỗ nối | Phân biệt vật rời với vật đã nối là hợp lý, không mở lại lệnh cấm định vị hai vật rời của SPEC-v2 §3. |
| 7 — Hành động nối | Đúng yêu cầu thêm Reles đu dây. Phép tìm shot thiếu cần giới hạn bằng bằng chứng và mức chắc chắn. |
| 8 — Người nói và chuỗi tư thế | Đúng yêu cầu cảnh Luciano khoe với bạn tù. “Có thể thêm” đang thành bắt buộc; cách giữ khung chưa được kiểm chứng. |

Phần 9b phân loại cảnh nhiều người thành `group` giải quyết đúng xung đột với “Only one person”. Nguyên tắc 9c tách hình thức khỏi trạng thái phù hợp việc cho mỗi cảnh quyết định biểu cảm. Không đánh giá chất lượng nét vẽ.

## D01 — SUA — Điều kiện bắt buộc thêm ảnh đang rộng hơn bằng chứng

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:41`, `:67`, `:90`, `:210`.

**VẤN ĐỀ GÌ:** Bốn yêu cầu cụ thể được nâng thành quy tắc bắt buộc theo loại câu. Rõ nhất, góp ý Luciano ghi “có thể thêm 3-4 shot”, nhưng dòng 214 yêu cầu thêm 3–4 khung cho cảnh nói nói chung.

Luật 3 cũng chưa trả lời được Q4: Gaviria được gọi tên và là người bị nhắm ám sát, nên vẫn thỏa “làm gì / bị gì”. Ví dụ loại trừ “police, judges, journalists” không kiểm tra được ranh giới này vì đó không phải tên riêng. A2-08 hiện dùng ghế trống để diễn đạt sự vắng mặt; thêm chân dung có thể hữu ích nhưng chưa được chứng minh là bắt buộc.

**CẦN GÌ ĐỂ ĐÓNG:** Giữ yêu cầu cụ thể của Tú cho A1; với luật chung, thêm điều kiện phần tử đó thực sự cần cho thông tin hoặc thao tác dựng chưa được phần tử hiện có đảm nhiệm. Giữ chuỗi 3–4 tư thế là tùy chọn. Bổ sung một ví dụ tên riêng được bỏ qua và giải thích theo cùng tiêu chí.

Phép thử Q2 nên xét **lời kể cùng bộ hình hiện có**, không chỉ hỏi bỏ một ảnh thì người xem còn biết trạng thái hay không.

## D02 — SUA — Phương án thiếu ảnh không phù hợp toàn bộ phạm vi luật 4

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:123`, `:127`.

**VẤN ĐỀ GÌ:** Luật bao gồm tổ chức, quốc gia, thành phố và đơn vị, nhưng hướng dẫn chung khi thiếu ảnh là tạo `group` theo trang phục năm câu chuyện. Cách này không phù hợp với thành phố hoặc công trình; cũng không bảo đảm đúng loại nội dung theo SPEC-v2 §3.

Ngoài ra, “mọi ảnh … trên Commons” ở dòng 118 vượt quá bằng chứng manifest: đó là kết quả truy vấn đã thực hiện, không phải kiểm kê toàn bộ kho ảnh.

**CẦN GÌ ĐỂ ĐÓNG:** Giới hạn `group` thành phương án minh họa tổ chức bằng người trong ca A1. Quy tắc chung phải chọn hình theo chủ thể và thông tin cần diễn đạt. Đổi khẳng định toàn bộ Commons thành “các ảnh tìm được trong lượt tra này”; giữ việc chưa tra tên đúng thời kỳ là khoảng trống đã biết.

## D03 — SUA — Luật sinh B từ A chưa có bằng chứng và không khớp ví dụ

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:140`, `:144`, `:147`.

**VẤN ĐỀ GÌ:** RUNBOOK ghi lỗi “rope” lấn “bedsheets” và cách sửa bằng mô tả vải phẳng, rộng. Kết quả đó không chứng minh lỗi xảy ra vì thiếu ảnh A làm neo, cũng không chứng minh bắt buộc sinh B từ A sẽ sửa được.

`image-prompts/A1.shots.json:245` vẫn sinh dây ga bằng `draw`, không tham chiếu ảnh tấm ga A1-14a. Vì vậy ví dụ được dẫn không thực hiện phần cơ chế của luật.

Yêu cầu giữ cùng màu cũng không đúng cho mọi biến đổi vật liệu; một biến đổi có thể làm đổi màu.

**CẦN GÌ ĐỂ ĐÓNG:** Tách yêu cầu đã có căn cứ — chuẩn bị trạng thái trước và sau khi cần minh họa biến đổi — khỏi phương án thử sinh B từ A. Ghi phương án này là chưa đo, giữ cách mô tả vải đã có kết quả. Chỉ yêu cầu giữ những thuộc tính không thay đổi trong quá trình biến đổi; sửa mô tả ví dụ cho đúng JSON hiện tại.

## D04 — CHAN — Luật bổ sung hành động thiếu chốt bảo toàn mức chắc chắn

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:185`, `:191`, `:193`.

**VẤN ĐỀ GÌ:** Phép thử “trả lời được bằng một động từ … → thiếu shot” cho phép tự bổ sung một hành động hợp lý nhưng không có bằng chứng. Trong chuyện mất tích hoặc án chưa giải quyết, chính khoảng trống đó có thể là điều chưa biết.

A1 có căn cứ minh họa đu dây **trong giả thuyết chính thức**. Tuy nhiên, câu khoảng cách thi thể “phủ nhận” việc leo ra bằng dây nâng chi tiết gây nghi vấn thành kết luận loại trừ. Transcript chỉ đặt khoảng cách ấy sau “but”; bản nháp không đưa chứng minh đủ để kết luận phủ nhận.

**CẦN GÌ ĐỂ ĐÓNG:** Thêm giới hạn: chỉ bổ sung hành động được nguồn xác nhận hoặc nằm trong giả thuyết/lời khai đã được nêu rõ; không tự lấp phần chưa biết. Giữ nhãn giả thuyết trong ghi chú dùng hình A1-15b. Đổi “phủ nhận” thành “đặt nghi vấn”, kể cả `intent` tương ứng tại `image-prompts/A1.shots.json:265`, hoặc cung cấp bằng chứng đủ cho kết luận mạnh hơn.

Không yêu cầu bỏ cảnh Tú đã đề nghị.

## D05 — SUA — Giữ nhân vật và giữ khung là hai yêu cầu khác nhau

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:217`, `:218`, `:260`.

**VẤN ĐỀ GÌ:** Tác giả đã công khai W1, nhưng phần hướng dẫn vẫn quy định mỗi khung sinh từ asset nhân vật. RUNBOOK mục 0 chứng minh tái sử dụng nhân vật khi chuyển khung; không chứng minh giữ nguyên khung giữa nhiều lần sinh.

Q1 đang đặt hai lựa chọn: asset Luciano hoặc ảnh nhóm A1-18b. Còn phương án thứ ba: tạo một khung Luciano riêng từ asset, rồi dùng chính khung riêng đó làm tham chiếu cho các biến thể. Phương án này không kéo bạn tù vào và phù hợp nguyên tắc chỉnh từ ảnh đã ghép tại RUNBOOK §8.2g.

**CẦN GÌ ĐỂ ĐÓNG:** Tách khâu tạo khung đầu từ asset và khâu tạo biến thể từ khung đầu. Không chốt phương án nào là đã bảo đảm nối chuyển động khi chưa đo. Có thể đóng điểm bằng cách giữ hướng dẫn chuỗi tư thế ở trạng thái thử nghiệm, không đưa cơ chế chưa đo thành luật bắt buộc.

## Trả lời thêm Q3

`noAnchors` không ngăn gọi ảnh neo ngay trong câu `mention`; SPEC-v2 §5d dùng đồng thời cả hai. Cờ này ngăn runner tự đính thêm ảnh không được phân vai.

Vì vậy, gọi neo có vai rõ trong câu vẫn giữ đúng cơ chế đã chốt. Chưa có bằng chứng trong lượt này để quyết định chọn neo theo `kind` toàn cảnh hay theo phần tử mới; không nên ghi một lựa chọn thành kết quả đã đo.

## Tôi đã không kiểm cái gì

- Chưa kiểm chứng độc lập nguyên văn tám góp ý ngoài các trích dẫn của tác giả.
- Không mở ảnh để xác minh dung mạo, phía sẹo Luciano, trang phục tù hoặc chất lượng nét vẽ.
- Không tra web để xác minh các mốc Mangano–Anastasia–Gambino; không kết luận những mốc đó sai.
- Không sinh ảnh, chạy Flow, kiểm thử builder hay kiểm tra khả năng nối chuỗi tư thế.
- Lệnh đọc toàn bộ RUNBOOK bị cắt đầu ra; đã đọc lại phần đầu mục 0 và phần liên quan được trả về. Không khẳng định đã đọc trọn RUNBOOK.
- PowerShell chặn thao tác tạo kiểu để đổi mã hóa; `python` và `rg` không có trên PATH. Đã dùng `Get-Content -Encoding utf8` thay thế, nhưng dấu tiếng Việt trong đầu ra vẫn lỗi. Không dùng phần chữ không đọc rõ làm căn cứ riêng cho điểm lỗi.
- Không tạo hay sửa file; không sửa `THREAD.md`.

```points
D01 | mở | coordination/drafts/img-skill-a1-lessons.md:41 | SUA — Yêu cầu cụ thể bị nâng thành luật bắt buộc; ngưỡng thêm phần tử chưa rõ
D02 | mở | coordination/drafts/img-skill-a1-lessons.md:127 | SUA — Phương án group không phù hợp toàn bộ phạm vi luật kiểm niên đại
D03 | mở | coordination/drafts/img-skill-a1-lessons.md:147 | SUA — Bắt buộc sinh B từ A chưa có bằng chứng và không khớp ví dụ JSON
D04 | mở | coordination/drafts/img-skill-a1-lessons.md:185 | CHAN — Bổ sung hành động thiếu giới hạn bằng chứng và nâng nghi vấn thành phủ nhận
D05 | mở | coordination/drafts/img-skill-a1-lessons.md:218 | SUA — Tái dùng asset nhân vật chưa chứng minh giữ khung cho chuỗi tư thế
```