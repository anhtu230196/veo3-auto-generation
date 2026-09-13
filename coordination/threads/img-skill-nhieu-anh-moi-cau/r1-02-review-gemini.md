# r1-02-review-gemini

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`, v1.

## Đánh giá các yêu cầu bắt buộc (Áp thử case 1 & Luật mới)

1. **Việc THAY điều kiện chặn ở skill mục 4d có hợp lý không?**
Việc thay thế hoàn toàn điều kiện chặn bằng nguyên tắc "phủ kín từng câu" (mục 1) và "chỉ không thêm khi trùng ảnh" (mục 4) là **không hợp lý**. Điều kiện chặn của 4d (đã chốt ở luồng A1) là chốt chặn cốt lõi nhằm ngăn việc sinh ảnh dư thừa không có chức năng kể chuyện. Nếu gỡ bỏ, số lượng shot sẽ tăng vô tội vạ (từ 32 lên 70 shot cho case 1) với những chi tiết lặp lại trực tiếp lời kể mà không cung cấp thêm giá trị hình ảnh (ví dụ: cái bao rỗng xẹp, thân cây bóc vỏ). Yêu cầu "nhiều ảnh nhất có thể" của Tú có thể được đáp ứng bằng cách làm phong phú loại phần tử được phép vẽ (như cờ, bản đồ), chứ không phải là xoá bỏ bộ lọc chất lượng rà soát sự thừa thãi. (Chi tiết tại D06)

2. **Có ô ảnh nào tạo ảnh sai sự thật / sai niên đại không?**
- **Cờ 1587:** Đề xuất cờ chữ thập St George là chính xác đối với nước Anh năm 1587. Tuy nhiên, việc tự động gán cờ Armada là chữ thập Burgundy (dòng 165) cần có nguồn sử liệu cụ thể xác nhận thay vì mặc định, vì Tây Ban Nha có nhiều mẫu cờ hải quân. (Trùng quan điểm với D04 của Codex).
- **Bản đồ:** Bản đồ North Carolina (C1-01c) vẽ ranh giới hiện đại là chấp nhận được do lời kể định hình khung thời gian tương lai: "what would later become".
- **Hành động sai sự thật:** Hàng loạt ô ảnh ➕ thêm vào bảng mục 6 (như White bực bội nhìn ra biển, thủy thủ trên cột buồm chỉ tay, nhà khảo cổ đang đào) biến những khoảng trống lịch sử hoặc những khái niệm trừu tượng thành các cảnh hành động có thật cụ thể. Điều này vi phạm nghiêm trọng luật cấm dựng hành động/cảnh không ai chứng kiến thành sự thật. (Trùng quan điểm với D02 của Codex).

3. **Bản đồ và cờ vẽ bằng Nano Banana có khả thi không?**
- **Cờ:** Khả thi do cấu trúc hình học đơn giản.
- **Bản đồ:** Thiếu khả thi nếu chỉ dựa vào mô tả văn bản. Nano Banana rất dễ vẽ sai lệch hình dáng địa lý (đường bờ biển, các hòn đảo) và cực kỳ dễ tự ý điền chữ (hallucinate text) dù đã bị cấm tường minh trong prompt. Phương án dự phòng dùng chip `@` với bản đồ thật làm gốc (mục 5a) là bắt buộc nếu muốn giữ độ chính xác hình khối.

4. **Mâu thuẫn với skill 4c, SPEC-v2, SHOT-LIST luật 2:**
- **Skill 4c:** Đề xuất dùng model AI để vẽ bản đồ/cờ đi ngược hoàn toàn quy định ở mục 4c hiện hành (quy định bản đồ và logo là hiện vật thật ghép ở hậu kỳ).
- **SPEC-v2:** Việc dùng ảnh thật làm chip cho bản đồ sẽ vi phạm SPEC-v2 mục 6 (hiện tại chỉ cho phép dùng `refImages` với nơi chốn đặc biệt).
- **SHOT-LIST luật 2:** Lập luận cho rằng "mũi thuyền nằm trên cát là trạng thái của chiếc thuyền" (C1-01b) thực chất là nỗ lực lách luật cấm định vị tương đối hai vật rời (thuyền và bãi biển).

## Các điểm review mới

### D06 — CHAN — Nguyên tắc phủ kín từng câu sinh ra hàng loạt chi tiết lặp chức năng
**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:28`, `:89`
**VẤN ĐỀ GÌ:** Đề xuất thay thế hoàn toàn điều kiện chặn bằng nguyên tắc "phủ kín từng câu" và "chỉ không thêm khi trùng ảnh" sẽ tự động sinh ra hàng loạt ảnh chỉ để lấp chỗ trống của văn bản. Bằng chứng là trong bảng mục 6, tác giả đã thêm các phần tử như bao lương thực rỗng xẹp (dòng 161), đống thùng hàng (dòng 162), hay thân cây bóc vỏ (dòng 168). Các chi tiết tĩnh này không mang lại thông tin mới mà chỉ lặp lại trực quan các từ ngữ đã có mặt trong lời kể, vi phạm luật "chi tiết không phục vụ câu chuyện hoặc lặp chức năng". Đồng thời, việc ép phủ kín khiến số lượng shot phình to mất kiểm soát (70 shot/case), đe dọa trực tiếp đến tính khả thi về thời gian chạy và giới hạn tài khoản.
**CẦN GÌ ĐỂ ĐÓNG:** Xoá bỏ đề xuất gỡ điều kiện chặn. Chỉnh sửa bảng 10 ô ảnh thành một "danh mục ý tưởng phần tử", trong đó mọi phần tử mới được khởi tạo từ bảng này vẫn BẮT BUỘC phải vượt qua điều kiện chặn hiện hành của mục 4d (chỉ thêm khi phần tử mang thông tin mà bộ hình hiện có chưa gánh) để trở thành một shot chính thức.

### D07 — SUA — Dùng vật thể lịch sử đại diện khái niệm dễ gây hiểu nhầm thành hiện vật có thật
**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:57`, `:131`, `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:158`
**VẤN ĐỀ GÌ:** Việc dùng một quả địa cầu cổ thế kỷ 16 (C1-03b) để đại diện cho khái niệm trừu tượng "Tân Thế Giới" rất dễ khiến người xem lầm tưởng đây là một hiện vật lịch sử có thật (một quả địa cầu vật lý) mà nhân vật sở hữu hoặc mang theo trên tàu. Trong khi đó, lời kể chỉ đang tóm tắt một khái niệm địa chính trị. Việc nhét một đạo cụ vật lý cụ thể vào khung hình để minh họa cho một khái niệm trừu tượng mà không có định hướng rõ ràng sẽ vi phạm luật "suy diễn trình bày như sự thật".
**CẦN GÌ ĐỂ ĐÓNG:** Bổ sung vào hướng dẫn của ô số 8 (Cụm khái niệm): khi dùng vật thể cụ thể đại diện cho khái niệm, cấm dùng các vật thể dễ bị nhầm là đạo cụ lịch sử trực tiếp của vụ án. Phải đi kèm quy định bắt buộc kết hợp chữ/kí hiệu hậu kỳ để xác nhận đây chỉ là vật minh hoạ ý tưởng, không phải hiện vật thực tế của câu chuyện.

## Tôi đã không kiểm cái gì
- Tôi chưa chạy thử quá trình tạo ảnh trên Nano Banana để đánh giá trực tiếp tính khả thi và chất lượng hình khối của các shot cờ, bản đồ và địa cầu.
- Tôi không tự đối chiếu các nguồn sử liệu thứ cấp/sơ cấp để xác thực lá cờ Burgundy năm 1588 hay các chi tiết thời trang thế kỷ 16; chỉ dựa vào phân tích lý luận của luồng.
- Tôi không chạy thử các script build prompt để xác nhận tính hợp lệ của cú pháp JSON mới.

```points
D06 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:28 | CHAN — Nguyên tắc phủ kín từng câu sinh ra hàng loạt chi tiết lặp chức năng
D07 | mở | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:57 | SUA — Dùng vật thể lịch sử đại diện khái niệm dễ gây hiểu nhầm thành hiện vật có thật
```
