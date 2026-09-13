# r3-01-review-codex

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`, v3.

**Kết luận:** Chốt D08 và D09 trong phạm vi yêu cầu sửa vòng 2. Không mở điểm mới. D01–D07 giữ trạng thái đã chốt; kết luận này duyệt bản nháp quy tắc, chưa xác nhận chất lượng ảnh đầu ra.

## Kiểm tra bắt buộc mỗi lượt: luật mới và áp thử case 1

Đã đọc THREAD, các file vòng trước, bản nháp v3 và đủ 29 dòng bảng mục 6; đối chiếu năm shot được giao, các prompt sửa theo D09, skill 4c–4d, SPEC-v2 và SHOT-LIST luật 2.

1. **Thay điều kiện chặn:** Hợp lý theo yêu cầu trực tiếp của Tú. Mười ô là danh mục ứng viên, không phải mười ảnh bắt buộc. V3 đặt giới hạn bằng chứng trước việc thêm ảnh và xét trùng theo thông tin cùng thao tác dựng, bất kể câu chứa nó. Cờ và làng giữ được chức năng riêng; khác câu không còn tự động tạo thêm ảnh.

2. **Sự thật và niên đại:** C1-03a dùng chữ thập St George, phù hợp vai trò biểu tượng nước Anh trước cờ Union năm 1606. [Flag Institute](https://www.flaginstitute.org/wp/uk-flags/union-flag-history/) chép tuyên cáo phân biệt cờ kết hợp mới với chữ thập đỏ người Anh đã dùng. C1-01c ghi rõ bản đồ định vị hiện đại theo “would later become”, không tự nhận là bản đồ năm 1587. C1-03b giữ vai trò vật tượng trưng; C1-18 phân biệt dùng chung hình vẽ với khẳng định cùng hiện vật. Ba shot C1-01b, C1-01c, C1-03b vẫn chờ tư liệu.

   Việc dùng lại bản đồ vùng Roanoke–Croatoan để định vị Hatteras có cơ sở: [NPS xác định Croatoan là Hatteras ngày nay](https://www.nps.gov/fora/planyourvisit/brochure.htm). Điều này hỗ trợ dùng lại bản đồ định vị vùng, chưa chứng minh đường bờ của hai thời kỳ giống hệt nhau.

3. **Khả thi bằng Nano Banana:** Cờ mô tả bằng hình học và bản đồ lấy hình khối từ chip bản đồ trống là phương án thử hợp lý. Chưa có ảnh để xác nhận thành công. Lệnh cấm chữ và ảnh tham chiếu không tự bảo đảm đúng hình học, địa lý hoặc sạch chữ. C1-01c vẫn là prompt nháp bằng chữ; `choTuLieu` yêu cầu chuyển sang chip trước khi chạy.

4. **Tương thích quy tắc:** Mục 7–8 xác định rõ phần phải sửa trong câu bao trùm 4c và ngoại lệ tham chiếu của SPEC-v2. Đây là thay đổi dự kiến, chưa phải các văn bản hiện hành đã được đồng bộ. Nhãn, mũi tên và dấu X vẫn ở hậu kỳ. C1-01b phù hợp cách giải thích ranh giới luật 2: mép cát/nước thể hiện trạng thái cập bờ của thuyền. Ngoại lệ nhiều shot chung `at` vẫn giới hạn cho `narration-scripts/`.

Bảng mục 6 có **10 ứng viên thêm**, gồm **4 bản đồ mới**; cộng 36 shot hiện có thành khoảng **46 shot**, tổng **5 bản đồ**. Không coi số này là 46 prompt đã hoàn thiện.

## D08 — OK — Chốt bộ lọc trùng chức năng

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:117`, `:139`, `:242`.

**VẤN ĐỀ GÌ:** Kẽ hở vòng 2 đã được sửa: khác cụm hoặc câu không còn miễn kiểm tra trùng. Quy tắc yêu cầu dùng lại khi ảnh cũ đảm nhiệm cùng thông tin và thao tác dựng; chỉ tạo mới khi cần nội dung hoặc trạng thái chưa có. Ví dụ cờ Anh và bản đồ Hatteras đã theo quy tắc này. Giới hạn không đồng nhất hai đảo khác nhau cũng được ghi rõ.

**CẦN GÌ ĐỂ ĐÓNG:** Đã đáp ứng yêu cầu D08; chốt: đã sửa. Không yêu cầu khôi phục điều kiện chặn cũ.

## D09 — OK — Chốt quy tắc nét mặt và sửa prompt

**CHỖ NÀO:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md:83`; `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:407`.

**VẤN ĐỀ GÌ:** V3 quy định nét mặt trung tính là mặc định; tâm trạng cụ thể cần căn cứ kể cả khi chỉ là chi tiết phụ. C1-19 đã bỏ `stunned`. Đối chiếu chín prompt tác giả liệt kê cho thấy các cụm cảm xúc bị nêu đã bỏ; C1-04 và C1-06 có tên đầu ra mới.

Giữ C1-21 có căn cứ: White kể mình vui khi tìm được dấu hiệu mà ông hiểu là người thân an toàn. Đây là cảm nhận của White, không xác nhận số phận dân thuộc địa. [Tường thuật White, bản in 1600](https://encyclopediavirginia.org/primary-documents/john-white-returns-to-roanoke-an-excerpt-from-the-fift-voyage-of-master-john-white-into-the-west-indies-and-parts-of-america-called-virginia-in-the-yeere-1590-1600/).

**CẦN GÌ ĐỂ ĐÓNG:** Đã đáp ứng yêu cầu D09; chốt: đã sửa. Không cần sinh ảnh để đóng điểm sửa văn bản này.

## Tôi đã không kiểm cái gì

- Chưa sinh hoặc xem ảnh đầu ra; chưa xác nhận bản đồ, cờ, địa cầu và thuyền đạt yêu cầu thị giác.
- Chưa kiểm toàn bộ sự thật lời kể, toàn bộ 36 prompt hoặc toàn bộ ảnh tư liệu. Phần mở rộng ngoài năm shot tập trung vào sửa D09.
- Chưa xác minh chính xác phạm vi “phần nam đảo Hatteras” và biến đổi đường bờ. Trang UNC Press liên quan trả lỗi 403; nguồn NPS chỉ đủ hỗ trợ quan hệ Croatoan–Hatteras ở mức định vị vùng.
- Chưa chạy builder, kiểm hash/cue, kiểm runner xử lý `choTuLieu` hay xác minh card trên Flow. `python` và `rg` không có trong PATH; vì vậy cũng chưa chạy `claims.py check`. Đã đọc trực tiếp claim của luồng.
- PowerShell chặn đổi encoding; một số lượt đọc gộp bị cắt và tiếng Việt lỗi dấu. Đã đọc riêng lại các phần dùng để chốt D08–D09; không coi lỗi hiển thị là lỗi file.
- Không kiểm phong cách nét vẽ, quota, chi phí thực tế hoặc chính sách kiếm tiền hiện hành.

```points
D08 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:117 | OK — Khác câu không còn tự động vượt bộ lọc trùng chức năng
D09 | chốt: đã sửa | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:83 | OK — Đã quy định nét mặt trung tính và bỏ các cụm cảm xúc thiếu căn cứ được yêu cầu
```