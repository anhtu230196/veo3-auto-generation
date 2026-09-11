# r1-02-review-gemini

Artifact: `image-prompts/SHOT-LIST.md`, v1.

**Chưa thông qua.** Bổ sung thêm các điểm vi phạm nguyên tắc cấm chữ và giẫm chân lên khâu hậu kỳ mà bản review trước chưa nhắc tới. Không cần viết lại toàn bộ bảng, chỉ cần sửa các dòng vi phạm.

## D10 — CHAN — Yêu cầu model vẽ ký hiệu và mũi tên trái với quy trình hậu kỳ

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:78` (A3-06), `:313` (B1-05), `:434` (B8-06). Đối chiếu Luật 1 tại `:9`.

**VẤN ĐỀ GÌ:** Luật 1 quy định rõ: "Tú ghép, canh vị trí, thêm mũi tên và nhãn chữ ở hậu kỳ". Tuy nhiên, các dòng này bắt model ảnh sinh ra các đồ họa biểu tượng như "a question mark" (A3-06), "rising vapour arrows" (B1-05), và "cold blue arrows and warm red arrows" (B8-06). Việc bắt AI tạo ảnh vẽ mũi tên/dấu chấm hỏi vừa giẫm chân lên khâu hậu kỳ, vừa có nguy cơ cao model sẽ vẽ méo mó, không đồng nhất với các vector tĩnh mà phần mềm dựng phim sử dụng.

**CẦN GÌ ĐỂ ĐÓNG:** Loại bỏ yếu tố dấu chấm hỏi và mũi tên khỏi các prompt này. Chỉ yêu cầu vẽ đối tượng chính (wall clock, vapour, ocean) để có phôi trắng, Tú sẽ tự ghép mũi tên và ký hiệu đè lên trên ở bước hậu kỳ.

## D11 — SUA — Yêu cầu vẽ ấn phẩm/tài liệu chắc chắn sinh chữ rác

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md:148` (A7-12), `:213` (A11-11), `:320` (B1-12), `:417` (B7-03), `:438` (B8-10), `:502` (B12-09), `:516` (B13-09), `:519` (B13-12).

**VẤN ĐỀ GÌ:** Dù có Luật 3 cấm chữ, các prompt này lại gọi trực tiếp các vật phẩm mà đặc trưng nhận diện là văn bản và con số như wall calendar, accounting ledger, price tag, valentine card, lecture poster, brochure. Nếu không có lệnh hãm, model gần như 100% sẽ tự điền chữ và số rác (sai chính tả, vô nghĩa) vào bề mặt các vật phẩm này. Đặc biệt B7-03 còn yêu cầu "a large figure" khiến model bắt buộc phải vẽ một con số rác.

**CẦN GÌ ĐỂ ĐÓNG:** Bổ sung các từ khóa như "blank", "unlabeled", hoặc "without text" vào các ấn phẩm này (giống cách đã làm tốt ở A7-06 "blank headline area"). Đối với B7-03, cần thay đổi cách tả để không trực tiếp yêu cầu vẽ một con số cụ thể ra.

## D12 — SUA — Bản đồ để trống dễ sinh ra chữ rác

**CHỖ NÀO:** Tất cả các prompt chứa từ "map": `image-prompts/SHOT-LIST.md:74` (A3-02), `:108` (A5-02), `:193` (A10-08), `:204` (A11-02), `:310` (B1-02), `:415` (B7-01), `:464` (B10-03).

**VẤN ĐỀ GÌ:** Tương tự D11, bản đồ là loại hình ảnh có xác suất sinh chữ rác (tên quốc gia, thành phố, đại dương) rất cao nếu để mở. Cụm từ "a map of [địa danh]" sẽ đánh thức cơ chế tự điền nhãn địa lý bằng các font chữ lộn xộn của model AI.

**CẦN GÌ ĐỂ ĐÓNG:** Thêm từ khóa "blank, no text" hoặc "unlabeled" vào tất cả các prompt yêu cầu vẽ bản đồ để đảm bảo model sinh ra bản đồ câm.

## Toi da khong kiem cai gi

- **Không đối chiếu trực tiếp với video gốc:** Tôi chưa tự mở video hay toàn bộ contact sheets để so sánh góc nhìn phối cảnh; kết luận về phần tử rời phụ thuộc vào việc tác giả mô tả đúng tính chất của `nRiezhIOHH0`.
- **Không kiểm chứng độ chính xác nội dung lịch sử (ngoại trừ các lỗi rành rành):** Mặc định các thông tin chi tiết lịch sử (ví dụ: Locusta, Hashashin, Atlantropa) đã được tác giả trích xuất chuẩn xác từ transcript.
- **Không chạy thử model ảnh:** Các phán đoán về rủi ro chữ rác dựa trên hành vi phổ biến của các model sinh ảnh, không đến từ thực nghiệm. Không dùng việc chưa chạy model làm lý do chặn luồng.

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
D10 | mở | image-prompts/SHOT-LIST.md:78 | Yêu cầu model vẽ ký hiệu và mũi tên trái với quy trình hậu kỳ
D11 | mở | image-prompts/SHOT-LIST.md:213 | Yêu cầu vẽ ấn phẩm/tài liệu chắc chắn sinh chữ rác
D12 | mở | image-prompts/SHOT-LIST.md:74 | Bản đồ để trống dễ sinh ra chữ rác
```
