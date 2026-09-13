# r1-01-review-codex

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`, v1.  
**Kết luận:** Chấp nhận hướng tăng số ảnh theo yêu cầu mới của Tú; chưa chốt bản nháp vì còn mâu thuẫn quy tắc và một số ô biến suy diễn thành cảnh cụ thể.

## Kiểm tra bắt buộc mỗi lượt: luật mới và áp thử case 1

Đã đọc bản đề xuất r1, bản nháp v1, bảng mục 6 đủ 29 dòng; đối chiếu năm shot được giao với skill 4c–4d, SPEC-v2 và SHOT-LIST luật 2.

1. **Thay điều kiện chặn:** Có căn cứ mới để thay: Tú trực tiếp yêu cầu thêm cờ và bản đồ. Không yêu cầu khôi phục D01 của luồng A1. Tuy nhiên, bản nháp chưa xử lý các điều kiện chặn còn nằm trong tám luật mà nó tuyên bố giữ nguyên; xem D01 dưới đây. Với Q1, “na ná” tự nó chưa đủ để bác một ảnh; nhưng đổi góc không chứng minh ảnh có chức năng riêng. Cờ Anh và làng thuộc địa thể hiện hai thông tin khác nhau, nên không phải ví dụ tốt cho việc trùng chức năng.

2. **Sự thật và niên đại:** Cờ St George là lựa chọn phù hợp để tượng trưng nước Anh; mốc Union Flag đầu tiên năm 1606 có nguồn xác nhận. [Sắc lệnh được Flag Institute chép lại](https://www.flaginstitute.org/wp/uk-flags/union-flag-history/) cũng phân biệt cờ kết hợp mới với chữ thập đỏ người Anh đã dùng trước đó. Ranh giới North Carolina hiện đại có thể dùng làm bản đồ định vị của người kể vì câu đã nói “would later become”; cần giữ rõ vai trò này, không coi đó là bản đồ đương thời năm 1587. Cờ Armada và các cảnh suy diễn trong bảng còn cần xử lý ở D02, D04.

3. **Khả thi bằng Nano Banana:** Prompt cờ đơn giản, bản đồ không chữ và địa cầu đều có thể đưa vào đường tạo ảnh hiện có; **chưa có bằng chứng đầu ra đạt yêu cầu**. Cờ hình học là phép thử hợp lý. Bản đồ chỉ có mô tả chữ và ảnh neo phong cách chưa bảo đảm đúng bờ biển, ranh giới, đảo. Chọn `kind: "map"` cũng không tự giải quyết độ chính xác. Q2 nên giữ `place` trong phép thử hiện tại, xác định rõ đường tham chiếu hình khối và tiêu chí đối chiếu trước khi coi đây là cách làm đã kiểm chứng; xem D03.

4. **Tương thích quy tắc:** Thuyền tiếp xúc bãi cát có thể được xem là một phần tử mang trạng thái “cập bờ”, theo phần giải thích ranh giới luật 2 của SHOT-LIST; không cần bác C1-01b chỉ vì có cát và nước. Bản đồ vẽ cần ngoại lệ rõ trong câu bao trùm của skill 4c, không chỉ sửa một dòng bảng. Nhiều shot cùng `at` hợp lệ với ngoại lệ dành cho `narration-scripts/`, nhưng không được tổng quát sang video có VTT. Giữ số năm và “three full years” ở hậu kỳ là phù hợp với ô 10; chưa có lý do bắt thêm lịch hay đồng hồ cát.

**Q5:** Không cần dừng review luồng này để chờ luồng A1. Phạm vi D07 đang mở ở luồng A1 là chọn ảnh neo, khác với thay điều kiện thêm ảnh. Khi chép bản nháp cần bảo toàn kết quả review phần ảnh neo.

## D01 — SUA — Tuyên bố thay điều kiện chặn nhưng giữ lại các điều kiện đối nghịch

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:58`, `:196`, `:208`.

**VẤN ĐỀ GÌ:** Bản nháp giữ nguyên tám luật 4d, nhưng chỉ dự kiến xóa đoạn “Điều kiện chặn” và sửa câu rà 10. Các ngoại lệ tương đương vẫn còn tại `.claude/skills/nano-banana-image-prompts/SKILL.md:293` và `:294`: không thêm trạng thái/người nếu bộ hình đã gánh thông tin; phần giải thích tại `:324` cũng giữ cách quyết định ấy. Vì vậy cùng một câu có thể vừa bắt thêm theo bảng mười ô, vừa được miễn theo bảng tám luật.

Tương tự, sửa dòng “Địa lý” chưa xử lý câu tại skill `:215`–`:216` vẫn xếp toàn bộ bản đồ vào hậu kỳ. Đây là mâu thuẫn trong kế hoạch sửa, không phải phản đối hướng Tú chọn.

**CẦN GÌ ĐỂ ĐÓNG:** Liệt kê các ngoại lệ nào được giữ, sửa hoặc bỏ; viết rõ thứ tự ưu tiên giữa bảng mười ô và tám luật. Bổ sung sửa câu bao trùm 4c thành ngoại lệ cho bản đồ/cờ vẽ, giữ nhãn và ký hiệu ở hậu kỳ.

## D02 — CHAN — Một số ô mới cụ thể hóa điều nguồn chưa xác nhận

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:164`, `:166`, `:172`; `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:393`.

**VẤN ĐỀ GÌ:** Các ô đang được trình bày như ảnh diễn biến:

- “He couldn't” thành White **bực bội nhìn ra biển**: thêm cả tâm trạng lẫn hành động.
- “got permission” thành **thư niêm sáp đỏ và White cầm thư**: lời kể chưa xác nhận hình thức cấp phép này.
- Nhà được tháo thành **gỗ xếp gọn thành đống**: đây là một dấu vết cụ thể hơn câu “taken apart”.
- C1-18 muốn người xem nhận ra **chính chiếc thuyền cập bờ năm 1587** đã không còn năm 1590: tái sử dụng hình vẽ đang bị chuyển thành khẳng định đồng nhất hiện vật.

Nguồn sơ cấp White kể nhà đã tháo và không tìm thấy thuyền/pinnace, nhưng đoạn đó không xác nhận đống gỗ xếp gọn hay nhận dạng chiếc thuyền C1-01b. [Tường thuật White, bản in 1600](https://encyclopediavirginia.org/primary-documents/john-white-returns-to-roanoke-an-excerpt-from-the-fift-voyage-of-master-john-white-into-the-west-indies-and-parts-of-america-called-virginia-in-the-yeere-1590-1600/).

**CẦN GÌ ĐỂ ĐÓNG:** Với từng ô, dẫn nguồn xác nhận chi tiết hoặc chuyển thành phần tử minh họa trung tính, không dựng hành động/tâm trạng chưa biết. C1-18 có thể giữ asset để thống nhất hình thức nhưng phải bỏ khẳng định đó là cùng một hiện vật lịch sử. Rà cùng tiêu chí cho các ô White nhìn cháu, dân vẫy tàu và thủy thủ chỉ đất tại dòng 160, 163, 180; không cần viết lại cả bảng.

## D03 — SUA — Quy trình mới chưa giữ rõ yêu cầu tư liệu cho vật và địa danh cụ thể

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:104`, `:111`, `:138`; `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:87`, `:100`, `:164`.

**VẤN ĐỀ GÌ:** SPEC-v2 §5c yêu cầu `refs` cho vật/nơi thuộc thời kỳ cụ thể. C1-01b, C1-01c và C1-03b chưa khai tư liệu tương ứng; hai shot đầu thừa nhận thiếu, địa cầu chưa ghi khoảng thiếu đó. Bản nháp chuyển thẳng từ ô ảnh sang shot nhưng chưa nói rõ đây là prompt nháp đang chờ đối chiếu. “Build sạch” không kiểm chứng hình dáng thuyền, địa cầu hay địa lý.

Đối với bản đồ, phương án dự phòng mới nhắc đến hình tham chiếu khi ảnh sai, trong khi chưa có bản đồ chuẩn để xác định đúng/sai.

**CẦN GÌ ĐỂ ĐÓNG:** Bổ sung bước đối chiếu tư liệu trước khi coi prompt sẵn sàng; đánh dấu ba shot còn chờ tư liệu. Trong bản nháp, quy định bản đồ phải có nguồn đối chiếu hình dạng, vị trí đảo và ranh giới phù hợp khung thời gian. Nêu rõ mở rộng ngoại lệ tham chiếu ở SPEC-v2 nếu chọn chip bản đồ. Không bắt tạo ảnh hay tải tư liệu trong lượt review này.

## D04 — HOI — “Cờ Tây Ban Nha 1588” đang bị đồng nhất với một mẫu cờ

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:124`, `:165`.

**VẤN ĐỀ GÌ:** Việc chữ thập Burgundy tồn tại đúng thời kỳ chưa đủ chứng minh nó là mẫu cờ đại diện chính xác cho Armada trong câu này. [Nghiên cứu về cờ Armada năm 1588 của Pedro Luis Chinchilla](https://www.armadainvencible.org/la-bandera-de-1588/) phân biệt cờ chỉ huy, cờ chiến đấu và các mẫu khác; bài dẫn tài liệu về cờ trắng–vàng–đỏ, còn việc dùng dấu thánh Andrew ở một số trường hợp được trình bày như suy luận.

Đây là căn cứ để yêu cầu phân biệt **biểu tượng quân chủ/quân đội** với **cờ hạm đội cụ thể**, chưa đủ để kết luận Burgundy tuyệt đối không được dùng.

**CẦN GÌ ĐỂ ĐÓNG:** Xác định ô này tượng trưng cho Tây Ban Nha hay tái hiện cờ Armada. Nếu là biểu tượng, ghi đúng vai trò và dẫn nguồn phù hợp; nếu là cờ hạm đội, chọn mẫu có tài liệu xác nhận. Không giữ khẳng định đơn nhất “1588 thì là Burgundy”.

## D05 — SUA — Prompt địa cầu không khớp tiêu chí duyệt vị trí châu Mỹ

**CHỖ NÀO:** `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:160`, `:162`, `:164`.

**VẤN ĐỀ GÌ:** `intent` và `canSoi` yêu cầu châu Mỹ chính diện, nhận ra ngay; `draw` lại đặt Đại Tây Dương ở giữa, châu Mỹ bên trái và Âu–Phi ở mép phải. Model làm đúng prompt vẫn có thể bị đánh trượt theo chính tiêu chí duyệt. Đồng thời, bản nháp tuyên bố “đọc ra trong một giây” khi chưa có ảnh hay kiểm tra nhận diện.

**CẦN GÌ ĐỂ ĐÓNG:** Chọn một hướng địa cầu và đồng bộ `draw`, `anhSeRa`, `intent`, `canSoi`; cập nhật hash tương ứng. Chuyển khẳng định nhận diện trong một giây thành mục tiêu cần kiểm tra. Ghi rõ địa cầu là vật tượng trưng, không phải hiện vật được xác nhận thuộc chuyến đi.

## Tôi đã không kiểm cái gì

- Chưa sinh hoặc xem ảnh đầu ra của năm shot mới/đổi; chưa xác nhận Nano Banana vẽ đúng bản đồ, cờ, địa cầu hay giữ hình thuyền.
- Chưa kiểm toàn bộ sự thật của lời kể và toàn bộ 36 prompt; review tập trung vào luật mới, bảng 29 câu và năm shot được giao.
- Chưa đối chiếu trực quan ảnh tư liệu địa cầu, thuyền và cờ Armada; nguồn Armada nêu trên là nghiên cứu thứ cấp, chưa kiểm bản chứng từ gốc.
- Chưa chạy builder, kiểm cue hoặc hash. `python` và `rg` không có trong PATH; `claims.py check` không chạy được. Đã đọc trực tiếp claim của luồng.
- Đầu ra đọc RUNBOOK và một lượt đọc JSON bị cắt; các phần skill và năm shot liên quan đã đọc riêng. PowerShell chặn đổi encoding, nên tiếng Việt từ công cụ bị lỗi dấu; không coi các lỗi hiển thị này là lỗi của file.
- Không kiểm quota, chi phí thực tế, phong cách nét vẽ hay chính sách kiếm tiền hiện hành.

```points
D01 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:58 | SUA — Thay điều kiện chặn nhưng giữ các ngoại lệ đối nghịch và câu 4c cũ
D02 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:164 | CHAN — Một số ô thêm tâm trạng, hành động, hiện vật và dấu vết chưa được nguồn xác nhận
D03 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:104 | SUA — Chưa giữ rõ bước đối chiếu tư liệu cho thuyền, địa cầu và bản đồ
D04 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:124 | HOI — Chưa phân biệt biểu tượng Burgundy với cờ Armada cụ thể năm 1588
D05 | mở | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:162 | SUA — Tiêu chí châu Mỹ chính diện không khớp prompt đặt Đại Tây Dương ở giữa
```