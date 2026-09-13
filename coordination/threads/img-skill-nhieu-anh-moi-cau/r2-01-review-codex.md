# r2-01-review-codex

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`, v2.

**Kết luận:** Chốt D01–D05 trong phạm vi yêu cầu vòng trước. Còn hai điểm cần sửa: bộ lọc trùng chức năng đang miễn kiểm tra khi khác cụm lời kể; quy tắc cấm thêm tâm trạng chưa thống nhất với ví dụ áp dụng.

## Kiểm tra bắt buộc mỗi lượt: luật mới và áp thử case 1

Đã đọc THREAD, toàn bộ bốn file vòng trước, bản nháp v2 đủ 29 dòng bảng mục 6; đối chiếu năm shot được giao với skill 4c–4d, SPEC-v2 và SHOT-LIST luật 2.

1. **Thay điều kiện chặn:** Hợp lý theo yêu cầu trực tiếp của Tú. V2 đã chuyển mười ô thành danh mục ứng viên, đặt giới hạn bằng chứng trước việc thêm shot và xử lý các ngoại lệ cũ. Không yêu cầu khôi phục điều kiện chặn của luồng A1. Tuy nhiên, điều kiện “khác cụm → giữ cả hai” còn cho phép sinh ảnh lặp; xem D08. Đây là vấn đề trong cách viết bộ lọc v2, không phải yêu cầu quay lại hướng cũ của D06.

2. **Sự thật và niên đại:** C1-03a dùng chữ thập St George phù hợp với vai trò tượng trưng nước Anh. Tuyên cáo năm 1606 được [Flag Institute chép lại](https://www.flaginstitute.org/wp/uk-flags/union-flag-history/) phân biệt cờ kết hợp mới với chữ thập đỏ người Anh đã dùng. C1-01c có thể dùng ranh giới hiện đại vì được xác định là bản đồ định vị của người kể, gắn với “would later become”. Cờ Tây Ban Nha thiếu mẫu xác nhận đã được bỏ. C1-03b đã ghi rõ vật tượng trưng; C1-18 đã bỏ khẳng định cùng chiếc thuyền lịch sử. Những ô dàn dựng bị nêu ở D02 đã được loại khỏi bảng.

3. **Khả thi bằng Nano Banana:** Cờ có mô tả hình học rõ để thử; chưa có ảnh chứng minh thành công. Bản đồ đã chuyển sang phương án lấy hình khối từ bản đồ trắng qua chip `@`, kèm nguồn đối chiếu trước khi chạy. Đây là phương án thử hợp lý, chưa phải bằng chứng model giữ đúng địa lý. C1-01b, C1-01c và C1-03b đều có `choTuLieu`. Prompt chữ của C1-01c hiện vẫn là bản nháp; trường chờ đã ghi rõ phải chuyển sang chip trước khi chạy. Không coi việc build thành công là xác nhận bản đồ, thuyền hoặc địa cầu đúng hình.

4. **Tương thích quy tắc:** Mục 7–8 đã nêu rõ sửa câu bao trùm 4c, dòng địa lý và mở rộng ngoại lệ ảnh tham chiếu trong SPEC-v2 §6. Nhãn, mũi tên, dấu X vẫn thuộc hậu kỳ. Nhiều shot chung `at` được giới hạn đúng cho `narration-scripts/`. Giữ nhận định vòng trước về C1-01b: mép cát và nước thể hiện trạng thái cập bờ, phù hợp cách giải thích ranh giới luật 2 trong SHOT-LIST. Không phát hiện lý do mới để bác riêng shot này.

Đếm trực tiếp bảng mục 6 có **11 ứng viên thêm**, gồm **5 bản đồ mới**; cộng C1-01c thành sáu bản đồ. Tổng khoảng 47 shot khớp phép tính của bản nháp, chưa phải số prompt đã hoàn thiện.

## Đóng các điểm vòng trước

| Điểm | Nhãn | Chỗ đã kiểm trong v2 | Kết quả |
|---|---|---|---|
| D01 | OK | Bản nháp:97, :111, :246, :257 | Đã xử lý ngoại lệ trong tám luật, đoạn Gaviria, câu rà 10 và câu bao trùm 4c. Chốt phạm vi mâu thuẫn đã nêu. |
| D02 | OK | Bản nháp:80, :81, :208–233; shots JSON:396 | Các ô dàn dựng được chỉ ra đã bỏ; C1-18 phân biệt dùng chung hình với đồng nhất hiện vật. Chốt phạm vi D02 cũ. |
| D03 | OK | Bản nháp:85, :142; shots JSON:84, :99, :165 | Ba shot đã đánh dấu chờ tư liệu; bản đồ phải có nguồn hình khối trước khi chạy. Đủ đóng yêu cầu về quy trình nháp. |
| D04 | OK | Bản nháp:161, :164, :213 | Bỏ ô cờ Tây Ban Nha khi chưa xác nhận đúng vai trò. Không còn khẳng định mặc định Burgundy. |
| D05 | OK | Bản nháp:170, :178; shots JSON:162–168 | Hướng châu Mỹ đã thống nhất giữa prompt và tiêu chí; khả năng nhận diện chuyển thành mục tiêu cần kiểm. |

**D06:** Để Gemini trả lời phản bác của tác giả. Codex không yêu cầu giữ nguyên điều kiện chặn cũ.

**D07:** Cách sửa có đủ ba lớp: vật đứng riêng, `intent` ghi tượng trưng, `note` nhắc cách tách khỏi cảnh nhân vật. Đồng ý về nội dung; để Gemini chốt điểm do mình nêu.

## D08 — SUA — Khác cụm lời kể đang tự động vượt bộ lọc trùng chức năng

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:114`, `:116`, `:229`.

**VẤN ĐỀ GÌ:** V2 định nghĩa trùng bằng hai điều kiện đồng thời: cùng cụm lời kể và cùng thông tin. Sau đó quy định “Khác cụm … → giữ cả hai”. Như vậy, chỉ đổi câu chứa cùng thông tin cũng đủ sinh thêm ảnh.

Chính bảng áp thử đã làm khác quy tắc này: dòng 24 dùng lại cờ C1-03a cho “turn back for England”, mặc dù cue ban đầu của cờ là “It was England's”. Hai cụm khác nhau nhưng vẫn có thể dùng cùng phần tử chỉ nước Anh. Các dòng 25–26 cũng dùng lại ảnh qua câu khác.

Đây là kẽ hở mới của bộ lọc v2. Không cần bỏ cờ hay giảm số loại phần tử Tú yêu cầu để sửa nó.

**CẦN GÌ ĐỂ ĐÓNG:** Bỏ điều kiện “cùng cụm” như một điều kiện bắt buộc để nhận diện trùng. Quy định: khác cụm không tự động cần ảnh mới; nếu ảnh sẵn có thể đảm nhiệm cùng thông tin và thao tác dựng thì ghi dùng lại. Giữ ảnh mới khi cần thêm nội dung hoặc trạng thái chưa có. Cờ và làng vẫn được giữ vì thể hiện hai thông tin khác nhau.

## D09 — SUA — Câu hỏi về nét mặt chưa có quy tắc nhất quán trong bản áp dụng

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:80`; `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:413`, `:416`.

**VẤN ĐỀ GÌ:** Giới hạn mới cấm thêm tâm trạng không được lời kể hoặc nguồn xác nhận. C1-19 vẫn yêu cầu White “sững sờ” / `a stunned look` khi thấy chữ khắc. `note` viện bản khắc Sheppard cho tư thế, không xác nhận tâm trạng tại thời điểm ấy.

[Tường thuật của White](https://encyclopediavirginia.org/primary-documents/john-white-returns-to-roanoke-an-excerpt-from-the-fift-voyage-of-master-john-white-into-the-west-indies-and-parts-of-america-called-virginia-in-the-yeere-1590-1600/) có nói ông vui vì tìm được dấu hiệu mà ông hiểu là người thân an toàn; nguồn không xác nhận phản ứng “sững sờ” được thêm trong shot này. Không suy ngược rằng ông tuyệt đối không từng ngạc nhiên; vấn đề là prompt đang chọn một cảm xúc cụ thể chưa có căn cứ.

**Trả lời Q6:** Nét mặt trung tính nên là mặc định khi chưa có nguồn. Không cần nguồn cho mọi nét vẽ của mắt, miệng; cần nguồn khi lựa chọn ấy truyền một tâm trạng cụ thể. Việc tâm trạng chỉ là chi tiết phụ không làm mất yêu cầu bằng chứng.

**CẦN GÌ ĐỂ ĐÓNG:** Ghi nguyên tắc này vào giới hạn “Dàn dựng”. Với C1-19, bỏ “sững sờ”/`stunned`, giữ hành động nhìn chữ; hoặc dẫn nguồn xác nhận đúng cảm xúc đó. Rà riêng các từ cảm xúc tác giả đã liệt kê ở Q6 theo cùng tiêu chí, cập nhật mô tả và hash nếu đổi prompt. Không cần viết lại cả bộ shot hay sinh lại ảnh trong lượt sửa bản nháp.

## Tôi đã không kiểm cái gì

- Chưa sinh hoặc xem ảnh đầu ra của năm shot được giao; chưa xác nhận bản đồ, cờ, địa cầu và thuyền đạt yêu cầu thị giác.
- Chưa kiểm toàn bộ sự thật lời kể, toàn bộ 36 prompt, hay đối chiếu trực quan toàn bộ ảnh tư liệu. Các đoạn đọc thêm ngoài năm shot phục vụ kiểm sửa D02 và trả lời Q6.
- Chưa chạy builder, kiểm cue/hash hoặc kiểm cơ chế runner xử lý `choTuLieu` và phụ thuộc asset.
- Chưa mở nghiên cứu Armada của Chinchilla; D04 được đóng vì ô thiếu căn cứ đã bỏ.
- Không kiểm phong cách nét vẽ, quota, thời gian chạy thực tế hay chính sách kiếm tiền hiện hành.
- Công cụ đọc RUNBOOK và một lượt đọc gộp bị cắt đầu ra; đã đọc riêng lại các đoạn shot và quy tắc dùng để kết luận. PowerShell chặn thao tác đổi encoding; tiếng Việt trong đầu ra có lỗi dấu. `rg` không có trong PATH; dùng `Get-Content` và `Select-String` thay thế. Không coi lỗi hiển thị là lỗi nội dung file.

```points
D01 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:97 | OK — Đã xử lý ngoại lệ cũ và câu bao trùm 4c
D02 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:80 | OK — Đã bỏ các ô dàn dựng bị nêu và khẳng định đồng nhất chiếc thuyền
D03 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:142 | OK — Đã đặt bước đối chiếu và đánh dấu ba shot chờ tư liệu
D04 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:164 | OK — Đã bỏ cờ Tây Ban Nha thiếu mẫu xác nhận đúng vai trò
D05 | chốt: đã sửa | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:162 | OK — Đã thống nhất hướng địa cầu và ghi nhận diện là mục tiêu cần kiểm
D08 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:114 | SUA — Khác cụm lời kể không được tự động vượt bộ lọc trùng chức năng
D09 | mở | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:416 | SUA — Nét mặt truyền tâm trạng cụ thể vẫn cần căn cứ dù chỉ là chi tiết phụ
```