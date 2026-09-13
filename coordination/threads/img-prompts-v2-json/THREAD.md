---
id: img-prompts-v2-json
step: 5
artifact: image-prompts/SPEC-v2.md
artifact_version: 3
author: claude
reviewers:
  - codex
  - gemini
round: 3
turn: codex
turn_role: reviewer
status: open
opened: 2026-09-11
updated: 2026-09-11
---

# img-prompts-v2-json

**Sản phẩm đang review:** `image-prompts/SPEC-v2.md`

## Câu hỏi luồng này phải trả lời

Thiet ke lai he prompt anh: JSON neo theo doan noi dung, anh tu lieu ghi ro agent nao tim ra, va luat viet prompt rieng cho nhan vat co that

## Việc mọi lượt phải làm

TIM TU LIEU ANH THAT cho segment A1 (Abe Reles, 0:00-1:19, video nRiezhIOHH0). Viec nay lam TRUOC khi ban ve spec, va MOI LUOT deu phai lam — ke ca luot tac gia.

Con thieu (xem image-prompts/refs/A1/manifest.json muc stillMissing):
  1. ice pick kieu 1930-1940 — URL cu tra ve HTML, khong phai anh
  2. anh chup THAT Half Moon Hotel, Coney Island, nam 1941 (ho so Getty 2265487109 dung ngay 12-11-1941 nhung Getty chan tai)
  3. them chan dung Abe Reles o goc khac, cang net cang tot

Moi anh ghi dung khuon nay:
  URL: <link anh truc tiep>
  TRANG: <link bai viet chua no>
  CHO: <ma shot, vi du A1-03>
  THAY GI: <mot dong ta trong anh co gi>
  TRUY VAN: <nguyen van cau ban da tra>

GHI CA TRUY VAN TRA KHONG RA GI — khong ghi thi luot sau cay lai dung luong da cay.
Ban KHONG can tai file ve: luot review chay che do chi doc. Chi nop URL, luot tac gia se tai va kiem.

## Điểm tranh luận

| ID | Nêu bởi | Vòng | Nội dung | Trạng thái |
| --- | --- | --- | --- | --- |
| D01 | claude | r1 | image-prompts/refs/A1/manifest.json · Con thieu ice pick 1930-1940; ca codex lan claude deu truot | chốt: đã sửa |
| D02 | claude | r1 | image-prompts/refs/A1/manifest.json · Con thieu anh chup that Half Moon Hotel 1941; NYPL dung JS nen fetch rong | chốt: đã sửa |
| D03 | claude | r1 | image-prompts/refs/A1/manifest.json · Van chua co goc thu hai cua Reles — anh Commons la cung mot buoi chup voi anh LOC | chốt: đã sửa |
| D04 | claude | r1 | image-prompts/SPEC-v2.md · Chua chuyen dong nao sang JSON nen chua biet bao nhieu cue khong trich nguyen van duoc | đẩy lên Tú |
| D05 | claude | r1 | image-prompts/SPEC-v2.md · Co che dung lai asset nhan vat chua chay thu lan nao | đẩy lên Tú |
| D06 | codex | r1 | image-prompts/SPEC-v2.md:287 · CHAN: chưa tách tên ảnh đầu ra khỏi tên reference; cảnh dùng lại asset có thể bị nhánh chống trùng bỏ qua | chốt: đã sửa |
| D07 | codex | r1 | image-prompts/SPEC-v2.md:216 · SUA: at của A1-12 và A1-13 lệch cue quá ±3 giây theo VTT có thời gian từng từ | chốt: đã sửa |
| D08 | gemini | r1 | image-prompts/SPEC-v2.md:231 · SUA: Thiếu trường refs trong shot mẫu A1-03 dù đây là object cần tư liệu thời kỳ | chốt: đã sửa |
| D09 | gemini | r1 | image-prompts/SPEC-v2.md:300 · SUA: useAsset đang dùng string đơn, không hỗ trợ gọi nhiều asset trong cùng một cảnh | chốt: đã sửa |
| D10 | gemini | r1 | image-prompts/refs/A1/manifest.json:140 · SUA: Mục notContributed kết luận sai sự thật về việc gemini không nộp URL | chốt: đã sửa |
| D11 | codex | r2 | image-prompts/SPEC-v2.md:369 · CHAN: mục 6 vẫn yêu cầu đặt tên card bằng flowAssetName, trái với outName đã chốt tại mục 5a-bis | chốt: đã sửa |
| D12 | codex | r2 | image-prompts/SPEC-v2.md:356 · SUA: refs bắt buộc với mọi character nhưng mẫu A1-13 thiếu refs và chưa có luật kế thừa qua useAsset | chốt: đã sửa |
| D13 | gemini | r2 | image-prompts/SPEC-v2.md:384 · HOI: Mục 6 chưa ghi rõ cách truyền mảng refs (file local) cho runner so với refNames từ useAsset | chốt: đã sửa |

## Nhật ký vòng

- r1 · claude (tác giả) · **đang chờ**

## Ngoài lượt

Việc gấp phát hiện khi chưa tới lượt mình thì ghi một dòng ở đây, không viết file vòng.

- **2026-09-11 — TÚ QUYẾT D02: dùng ảnh 1927.** Không mua giấy phép Getty cho tấm
  12-11-1941. Căn cứ vẽ cho A1-11 là `09-half-moon-hotel-1927-cihp__claude.jpg`
  (ảnh chụp thật, Coney Island History Project). Bưu thiếp tô màu
  `02-half-moon-hotel__codex.jpg` hạ xuống làm tư liệu phụ. Điểm này sẽ được
  đóng chính thức ở lượt tác giả kế tiếp — người review đừng nêu lại.
