# r3-01 — Review Codex — SHOT-LIST v3

Artifact: `image-prompts/SHOT-LIST.md`, v3. Đếm trực tiếp: **385 dòng**, gồm A: 194 và B: 191; không trùng mã.

**Chưa thông qua.** D07 và D13 đã đáp ứng. Vẫn còn bằng chứng cụ thể cho lỗi cảnh dựng sẵn và ghép nền, tập hợp tại D16.

## D16 — CHAN — Vẫn còn cảnh và bố cục ghép sẵn sau lượt rà v3

**CHỖ NÀO:**

| Vị trí | Nội dung còn lại |
| --- | --- |
| `image-prompts/SHOT-LIST.md:183` — A8-07 | `two groups of men facing each other on a street` |
| `image-prompts/SHOT-LIST.md:219` — A10-11 | `a rubbish dump with gulls over it` |
| `image-prompts/SHOT-LIST.md:297` — A15-07 | `a crowded royal court hall` |
| `image-prompts/SHOT-LIST.md:345` — B1-09 | `a dry empty canal between two old buildings` |
| `image-prompts/SHOT-LIST.md:549` — B13-06 | `a park with trees and benches` |
| `image-prompts/SHOT-LIST.md:550` — B13-07 | `a shopping mall interior` |

**VẤN ĐỀ GÌ:** Các prompt này vẫn yêu cầu bối cảnh cả khu vực hoặc ghép nhiều vật theo vị trí cố định, trái luật tại `image-prompts/SHOT-LIST.md:8` và `:12`.

B1-09 là bằng chứng ngay trong phần vừa sửa: thành phố có kênh được thu thành kênh **giữa hai nhà**, nhưng bố cục ghép vẫn còn. A8-07 vẫn chứa `on a street`, nên kết luận của tác giả rằng không còn dòng khớp `street` cũng chưa đúng.

Chấp nhận ngoại lệ nhóm người cùng hành động. Vấn đề ở A8-07 là nền đường phố; ở A15-07 là cả đại sảnh. Các sửa trước đã có tác dụng, nhưng chưa đủ căn cứ kết luận D05/D14/D15 đã được xử lý hết toàn bảng. D16 gom phần còn sót bằng những dòng cụ thể trên.

**CẦN GÌ ĐỂ ĐÓNG:**

- A8-07 bỏ nền đường phố, giữ hai nhóm người.
- A10-11 dùng một đống rác độc lập; chim tách riêng nếu cần.
- A15-07 dùng nhóm người trong triều phục, bỏ đại sảnh.
- B1-09 giữ đoạn kênh cạn; nhà cần dùng thì tách riêng.
- B13-06 và B13-07 thay bằng phần tử đại diện, chẳng hạn cây, ghế công viên và quầy hàng độc lập.

Rà phần còn lại theo cùng ranh giới; không cần viết lại toàn bộ bảng hoặc tách các bộ phận vốn thuộc cùng một vật.

## Xác nhận các sửa đã đáp ứng

| Điểm | Nhãn | Chỗ nào | Nhận định và điều kiện đóng |
| --- | --- | --- | --- |
| D07 | OK | `image-prompts/SHOT-LIST.md:293`, `:500` | Đã ghi Persia/Syria và Manhattan, vẫn giữ yêu cầu không nhãn. Đủ khắc phục việc mất danh tính vùng bản đồ; không yêu cầu bổ sung để đóng. |
| D13 | OK | `image-prompts/SHOT-LIST.md:212` | Đã thành `a man aiming two pistols, one in each hand`, đúng sửa đổi yêu cầu ở r2. Không còn điều kiện bổ sung. |

Giữ các kết luận đã chốt về D02/D03 và các phản bác D04/D09; không có bằng chứng mới để tranh luận lại.

## Toi da khong kiem cai gi

- Đã đọc toàn bộ SHOT-LIST v3 và các file vòng trước. Tôi đối chiếu transcript A; agent phụ đọc toàn bộ prompt B và transcript B.
- Lượt này không xem khung hình hoặc phát hai video. Chưa xác nhận danh sách bao phủ đầy đủ các phần tử trên màn hình.
- Không kiểm chứng độc lập dữ kiện lịch sử, kỹ thuật; không đánh giá bản quyền hoặc khả năng bật quảng cáo.
- Không sinh ảnh, thử tách nền hoặc kiểm nhịp dựng chính xác.
- Không chạy `build_image_prompts.py --check`; đã đọc script và đếm dòng bằng Node. PowerShell chặn việc đổi `Console.OutputEncoding`; đọc UTF-8 bằng Node đã khắc phục, không còn giới hạn đọc văn bản do lỗi này.

```points
D07 | chốt: đã sửa | image-prompts/SHOT-LIST.md:293 | Bản đồ đã xác định Persia/Syria và Manhattan, giữ yêu cầu không nhãn
D13 | chốt: đã sửa | image-prompts/SHOT-LIST.md:212 | Solonik đã cầm mỗi tay một khẩu súng
D16 | mở | image-prompts/SHOT-LIST.md:345 | Vẫn còn cảnh cả khu vực và bố cục ghép nền; có bằng chứng cụ thể ở cả A và B
```