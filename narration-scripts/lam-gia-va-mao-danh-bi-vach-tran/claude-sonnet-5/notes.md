# Ghi chú làm việc — Làm Giả Và Mạo Danh Bị Vạch Trần (bản Claude Sonnet 5)

**Người viết:** Claude Sonnet 5 (`claude-sonnet-5`), Claude Code, 2026-09-17.

Không đưa vào lời thu âm.

## Đây KHÔNG phải một lượt nghiên cứu độc lập

Tú yêu cầu thử viết lại cùng bộ case bằng Sonnet để so sánh với bản Opus. Sonnet
**không tra cứu lại** — toàn bộ nguồn, bảng chuẩn bị, mức neo ngoài, cổng kiếm
tiền và các chỗ `[CHƯA XÁC MINH: ...]` dùng lại nguyên từ
`../claude-opus-5/notes.md`. Xem file đó để có đủ:

- bảng cổng kiếm tiền cho 6 case;
- bảng chuẩn bị (kiểu mở, neo ngoài, chi tiết nối trước–sau, hình ảnh neo, kết
  quả → dư âm);
- danh sách nguồn đầy đủ theo case;
- ba chỗ cần Tú quyết (Anna Anderson — cổng 1 và cảnh ở kênh; Demara — ca cắt
  cụt chân).

**Chỉ phần câu chữ trong `vi.md` là viết độc lập** — không chép câu của Opus,
nhưng dùng chung dữ kiện đã tra, nên hai bản đôi khi chọn cùng một chi tiết để
kể (vd cùng nhắc chữ "FH" trên bìa sổ Hitler) vì bảng chuẩn bị đã chỉ ra đó là
chi tiết nối trước–sau. Đây là điểm khác với việc hai agent tra cứu độc lập rồi
so sánh — mục đích lượt này hẹp hơn: so cách kể trên cùng một dữ liệu, không so
khả năng tra cứu.

## Khác biệt cách viết so với bản Opus (để Tú so sánh)

- Đổi thứ tự một vài chi tiết mở mỗi case (vd Piltdown mở bằng bối cảnh cuộc đua
  "mắt xích thất lạc" trước khi vào tên Dawson, thay vì mở thẳng bằng Dawson).
  Story 4 đổi tên thành "Sáu Mươi Cuốn Sổ Và Một Chữ Cái Sai" để gọi tên sớm chi
  tiết nối trước–sau (chữ "FH") mà không lộ ý nghĩa của nó.
- Một vài câu diễn giải thêm không đổi sự kiện (vd tả lại vì sao bộ hàm/bộ não
  của Piltdown "ngược" với các hoá thạch khác) — cần Tú/người review kiểm lại có
  vượt quá mức "giữ khối giải thích ngắn" của skill hay không.
- Giữ nguyên toàn bộ số liệu, ngày tháng, tên riêng và các đánh dấu
  `[CHƯA XÁC MINH: ...]` như bản Opus; không tự đổi hay bỏ bớt.

## Việc còn thiếu

- Chưa có review chéo. Muốn dùng bản này thay bản Opus thì vẫn cần qua bước 4
  (Tú duyệt nội dung) và luồng review như quy trình bình thường.
- Chưa kiểm tra ảnh tư liệu cho case nào (bước `case-reference-images`).
