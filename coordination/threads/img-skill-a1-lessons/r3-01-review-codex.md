# r3-01-review-codex

**Artifact:** `coordination/drafts/img-skill-a1-lessons.md`, v3.

**Kết luận:** Giữ nguyên kết quả chốt D01–D05. Phần 9d đã tiếp nhận D06 dưới dạng thử nghiệm, nhưng ví dụ chọn neo còn vướng chính ngoại lệ mới thêm. Mở D07 — SUA; cần làm rõ phạm vi “phần tử mới” trước khi đưa hướng dẫn này vào skill.

## Đối chiếu bắt buộc: tám góp ý, RUNBOOK mục 0 và SPEC-v2

Đã đối chiếu tám góp ý được trích trong bản nháp với các shot A1 liên quan, phần ghi kết quả đo trong RUNBOOK mục 0 và SPEC-v2. Việc đối chiếu dựa trên trích dẫn trong repo; chưa xác minh được nguyên văn tám góp ý từ bản ghi độc lập.

| Luật | Kết quả |
| --- | --- |
| 1 — Người và vật riêng | Khớp yêu cầu thêm người lộ tai để ghép dùi đá. Điều kiện cần thao tác riêng ở hậu kỳ giới hạn việc tách ảnh, không cấm mọi ảnh người chạm vật. |
| 2 — Trạng thái nhân vật | Khớp yêu cầu Reles bị còng và áp giải. Điều kiện chung §0 cùng ngoại lệ §2 giữ giới hạn đã được chấp nhận ở D01. Tái dùng nhân vật phù hợp kết quả đo trong RUNBOOK. |
| 3 — Người được gọi tên | Khớp yêu cầu Anastasia và Luciano. Ví dụ Gaviria giữ ranh giới: tên riêng không tự động buộc thêm asset. Chọn tư liệu theo thời điểm phù hợp nguyên tắc bằng chứng của SPEC-v2. |
| 4 — Niên đại tên gọi | Khớp yêu cầu tìm tư liệu Gambino. Đã giới hạn phạm vi kết quả tìm kiếm và chọn hình thay thế theo chủ thể, không áp `group` cho mọi loại nội dung. |
| 5 — Trạng thái gốc | Khớp yêu cầu tấm ga để nối bằng mũi tên hậu kỳ. A1-14a và A1-14 sinh độc lập đúng mô tả. Sinh B từ A vẫn được ghi chưa đo, không thay thế bài học mô tả vải đã có kết quả. |
| 6 — Chỗ nối | Khớp yêu cầu dây ga buộc vào lò sưởi. Nút buộc là nội dung cần thể hiện; không mở lại việc đặt hai vật rời cạnh nhau bị SPEC-v2 §3 cấm. |
| 7 — Hành động nối | Khớp yêu cầu thêm cảnh du dây. Giới hạn bằng chứng và ghi chú minh họa giả thuyết tại A1-15b vẫn còn; không biến khoảng trống chưa biết thành sự kiện. |
| 8 — Người nói và chuỗi tư thế | Khớp yêu cầu Luciano khoe với bạn tù. Chuỗi tư thế vẫn tùy chọn, thử nghiệm; các biến thể tham chiếu khung Luciano riêng, không tuyên bố đã bảo đảm nối chuyển động. |

Không có bằng chứng mới để mở lại D01–D05.

Với phần bổ sung 9d, cách gọi neo có vai rõ trong câu phù hợp SPEC-v2 §5d và cơ chế `noAnchors` được RUNBOOK ghi nhận. Bảng tên ảnh khớp `by-kind.json`. Bản v3 cũng giữ đúng phân biệt giữa tiêu chí thử nghiệm và kết quả đã đo, đồng thời nhắc lại nguy cơ lẫn nội dung từ neo. Vướng mắc mới nằm ở cách áp tiêu chí cho cảnh có nhiều loại phần tử mới, nêu tại D07. Không đánh giá phong cách nét vẽ.

## D07 — SUA — Ví dụ thử nghiệm chưa qua được ngoại lệ “nhiều loại phần tử mới”

**CHỖ NÀO:** `coordination/drafts/img-skill-a1-lessons.md:281`, `:287`; `image-prompts/A1.shots.json:334`.

**VẤN ĐỀ GÌ:** Phần 9d chọn neo theo loại của phần tử **mới**, rồi quy định câu có **nhiều loại phần tử mới** thì chưa có quy ước, “đừng tự chọn”. Tuy nhiên, ví dụ A1-18b được chỉ định neo `03` vì có hai bạn tù mới, trong khi chính câu prompt còn đưa vào giường tù và cửa sổ song sắt. Asset được gọi chỉ là chân dung Luciano; những đồ vật đó cũng được thêm bằng chữ.

Theo cách viết hiện tại, A1-18b vừa được chỉ định neo `03`, vừa thuộc trường hợp chưa được chọn neo. Người áp dụng không biết phải tính mọi phần tử mới hay chỉ phần tử cần ưu tiên giữ phong cách. Đây là sự chưa nhất quán trong sửa đổi v3, không phải yêu cầu chứng minh trước hiệu quả của phương án thử nghiệm.

**CẦN GÌ ĐỂ ĐÓNG:** Làm rõ ngay tại 9d một trong hai cách:

- Nếu chọn theo **phần tử mới ưu tiên**, định nghĩa phạm vi đó và giải thích vì sao ở A1-18b hai bạn tù được ưu tiên, còn giường/cửa sổ không quyết định neo; tiếp tục ghi đây là giả thuyết thử nghiệm.
- Nếu tính **mọi phần tử mới**, chuyển A1-18b sang nhóm chưa có quy ước và bỏ chỉ định sẵn `03`.

Chỉ cần sửa hướng dẫn và ví dụ trong bản nháp; không cần đổi JSON hoặc sinh ảnh để đóng điểm này.

## Tôi đã không kiểm cái gì

- Chưa xác minh độc lập nguyên văn tám góp ý ngoài các trích dẫn trong repo.
- Không kiểm chứng lại các mốc lịch sử Mangano–Anastasia–Gambino, dung mạo Luciano hoặc trang phục tù; không đưa ra kết luận lịch sử mới.
- Không mở ảnh, sinh ảnh, chạy Flow hoặc chạy builder. Chưa xác nhận hiệu quả chọn neo theo phần tử mới hay khả năng nối chuỗi tư thế.
- Không kiểm toán toàn bộ code và toàn bộ RUNBOOK. Một số đầu ra đọc gộp bị cắt; đã đọc bổ sung bản nháp và các đoạn A1 liên quan.
- `exec_command` trả lỗi `CannotCreateTypeConstrainedLanguage` khi thử tạo đối tượng mã hóa UTF-8 trong PowerShell. Đọc bằng `Get-Content -Encoding utf8` vẫn mất một số dấu tiếng Việt; không dùng riêng phần chữ không rõ làm căn cứ kết luận. D07 dựa vào tên ảnh, cấu trúc quy tắc và prompt tiếng Anh đọc được.
- Không tạo hoặc sửa file, kể cả `THREAD.md`.

```points
D07 | mở | coordination/drafts/img-skill-a1-lessons.md:281 | SUA — A1-18b có cả người và đồ vật mới nhưng được chỉ định neo 03, trái ngoại lệ nhiều loại phần tử mới; cần làm rõ phạm vi hoặc bỏ chỉ định
```