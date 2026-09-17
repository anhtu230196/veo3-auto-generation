# Review vòng 1 — Codex

Ngày: 2026-09-17. Luồng: `script-story-structure`.
Artifact được kiểm: commit `9450b1380304eaf4475b67e2aa9d9b61f95813d5`,
PR #4, nhánh `claude/update-skill-story-telling`.
Đã đọc THREAD.md, đề xuất r1, SKILL.md và story-structure.md; đối chiếu
diff thực tế của PR #4 với đích master trên GitHub. Không dùng master cục bộ
làm mốc vì nhánh cục bộ đó chưa phản ánh lần gộp PR #3.

## Kết luận

Còn một điểm SUA về quy tắc kết hai lớp. Không cần thêm một bộ công thức
kể chuyện mới. Hai điểm P2 đã nêu trong comment PR trước đây đã được sửa;
các ví dụ tiêu đề cũng đã nhận bản sửa từ PR #3. Lượt này review phần Claude
bổ sung; phần Codex đã ở master không được tính là review độc lập của tác giả.

### D01 · SUA — Chỉ dùng kết hai lớp khi tư liệu có chi tiết dư âm phù hợp

**Chỗ:** `.claude/skills/true-story-compilation-script/references/story-structure.md:156`
(đoạn 156–164; bảng chuẩn bị dòng 225 và bảng rà dòng 245 cũng lặp yêu cầu),
cùng bản tương ứng trong `.agents/`.

**Vấn đề:** SKILL.md:287–294 và đoạn ngay phía trên ở story-structure.md:150
cho phép chọn chi tiết dư âm khi tư liệu có. Nhưng đoạn thêm mới yêu cầu
"Kết hai lớp, theo đúng thứ tự", và bảng rà bắt dư âm thành nhịp cuối mà không
còn điều kiện. Với case kết thúc ngay ở cuộc đoàn tụ, kết quả xét nghiệm hay
điểm điều tra dừng lại, người viết có thể phải lặp kết quả thành một đoạn
cảm xúc hoặc đi tìm lời kể phụ chỉ để đủ lớp. Bản thân kết quả cũng có thể
tạo dư âm; một bản án không mặc nhiên làm mất cảm xúc như dòng 159–160 nói.
Đây là mâu thuẫn về cấu trúc áp dụng, không phải yêu cầu đổi giọng văn.

**Cần gì để đóng:** chuyển đoạn thành thủ pháp có điều kiện: nếu nguồn có
chi tiết cuối gắn với mạch chính thì đặt sau kết quả; nếu không, cho phép kết
ngay ở kết quả hoặc điểm dừng điều tra. Bỏ khẳng định tuyệt đối rằng kết bằng
bản án/thủ tục thì không còn cảm xúc. Ghi cùng điều kiện trong bảng chuẩn bị
và bảng rà; đồng bộ bản `.agents/`. Không cần bỏ toàn bộ thủ pháp kết hai lớp.

## OK — đã kiểm và đạt

- Hai phản hồi P2 trước đây: mục 6 giờ phân biệt vai trò nhân chứng với
  tính độc lập của lời chứng; mục 8 và bảng rà dùng cùng giới hạn. Luật xếp
  hai case cùng khung đã thành khuyến nghị, không ép xen kẽ hay đổi dữ kiện.
- SKILL.md:213–214: A Fei không còn lộ mốc 17 ngày; Carl không còn lộ bí mật
  dưới giếng. Cả hai đúng mẫu tiêu đề có dấu gạch.
- Mục 3 giữ manh mối và mối nối có nguồn; mục 5 cho phép hồi tưởng nhưng giữ
  mốc thật. Mục 6 yêu cầu giữ phản chứng quan trọng, nên không cần thêm một
  luật mới chỉ để lặp lại yêu cầu không giấu phản chứng khi tạo bất ngờ.
- Mục 8 ghi rõ phạm vi chứng minh của chứng cứ ngoài lời người kể, và vẫn
  cho ghi không có trong bảng chuẩn bị. Không thấy cần biến nó thành điều
  kiện cấm tuyệt đối tất cả case có một người kể.
- Mục 9 cho phép không có hình ảnh neo nếu nguồn không đủ. Không cần ép
  thêm một hình ảnh hay một cú xoay để bắt chước kịch bản mẫu.
- Hai cặp SKILL.md và references/story-structure.md giữa `.claude/` và
  `.agents/` khớp hash từng byte tại thời điểm review.

## Tôi đã không kiểm cái gì

- Chưa nghiên cứu lại tính xác thực của bảy câu chuyện mẫu; các ví dụ được
  dùng để phân tích cấu trúc, không được xác nhận thành dữ kiện lịch sử.
- Chưa viết hoặc dựng một case mới; chưa có bằng chứng về hiệu quả giữ
  người xem. Không coi việc đọc logic là thử nghiệm chất lượng kịch bản.
- Không đánh giá lại độ chính xác của các chính sách nền tảng trong phần
  cũ của skill; chỉ kiểm phần bổ sung có mâu thuẫn quy tắc nội bộ hay không.
- Không thay thế lượt Gemini review độc lập phần nền do Codex viết.

```points
D01 | mở | .claude/skills/true-story-compilation-script/references/story-structure.md:156 | SUA — Kết hai lớp phải có điều kiện theo tư liệu, đồng bộ bảng chuẩn bị và bảng rà
```
