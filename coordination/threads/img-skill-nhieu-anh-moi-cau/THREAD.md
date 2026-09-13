---
id: img-skill-nhieu-anh-moi-cau
step: 5
artifact: coordination/drafts/img-skill-nhieu-anh-moi-cau.md
artifact_version: 3
author: claude
reviewers:
  - codex
  - gemini
round: 3
turn: claude
turn_role: author
status: settled
opened: 2026-09-13
updated: 2026-09-13
---

# img-skill-nhieu-anh-moi-cau

**Sản phẩm đang review:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md`

## Câu hỏi luồng này phải trả lời

Cap nhat skill nano-banana-image-prompts de moi cau loi ke ra NHIEU ANH NHAT co the (Tu yeu cau 2026-09-13): bang 10 o anh co dung, co pha gioi han cung (bang chung, nien dai, chu trong anh, cong kiem tien) khong?

## Việc mọi lượt phải làm

Artifact la BAN NHAP luat moi cho skill nano-banana-image-prompts: moi cau loi ke tach thanh O ANH (nguoi, hanh dong, vat ngam trong dong tu, vat, noi chon, dia ly -> ban do ve tron, quoc gia -> co dung nam, cum khai niem -> vat cu the, trang thai noi, con so). Vi du Tu dua: cau 1587 them thuyen cap bo cat + ban do North Carolina; cau 'second attempt' them co nuoc Anh + anh 'in the New World'. Ap thu: narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json (C1-01b, C1-01c, C1-03a, C1-03b, C1-18) va bang muc 6 cho ca case 1. Review: (1) viec THAY dieu kien chan o skill muc 4d co hop ly khong, (2) co o anh nao tao anh sai su that / sai nien dai (co 1587, ban do), (3) ban do va co ve bang Nano Banana co kha thi khong, (4) mau thuan voi skill 4c, SPEC-v2, SHOT-LIST luat 2. Khong review phong cach net ve.

## Điểm tranh luận

| ID | Nêu bởi | Vòng | Nội dung | Trạng thái |
| --- | --- | --- | --- | --- |
| D01 | codex | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:58 · SUA — Thay điều kiện chặn nhưng giữ các ngoại lệ đối nghịch và câu 4c cũ | chốt: đã sửa |
| D02 | codex | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:164 · CHAN — Một số ô thêm tâm trạng, hành động, hiện vật và dấu vết chưa được nguồn xác nhận | chốt: đã sửa |
| D03 | codex | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:104 · SUA — Chưa giữ rõ bước đối chiếu tư liệu cho thuyền, địa cầu và bản đồ | chốt: đã sửa |
| D04 | codex | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:124 · HOI — Chưa phân biệt biểu tượng Burgundy với cờ Armada cụ thể năm 1588 | chốt: đã sửa |
| D05 | codex | r1 | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:162 · SUA — Tiêu chí châu Mỹ chính diện không khớp prompt đặt Đại Tây Dương ở giữa | chốt: đã sửa |
| D06 | gemini | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:28 · CHAN — Nguyên tắc phủ kín từng câu sinh ra hàng loạt chi tiết lặp chức năng | chốt: đã sửa |
| D07 | gemini | r1 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:57 · SUA — Dùng vật thể lịch sử đại diện khái niệm dễ gây hiểu nhầm thành hiện vật có thật | chốt: đã sửa |
| D08 | codex | r2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:114 · SUA — Khác cụm lời kể không được tự động vượt bộ lọc trùng chức năng | chốt: đã sửa |
| D09 | codex | r2 | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:416 · SUA — Nét mặt truyền tâm trạng cụ thể vẫn cần căn cứ dù chỉ là chi tiết phụ | chốt: đã sửa |

## Nhật ký vòng

- r1 · claude (tác giả) · **đang chờ**

## Ngoài lượt

Việc gấp phát hiện khi chưa tới lượt mình thì ghi một dòng ở đây, không viết file vòng.

- 2026-09-13 · claude · **Tú quyết sau khi luồng `settled`: chấp nhận chữ trong ảnh bản đồ** (*"Chấp nhận bản đồ và chữ nằm trong ảnh luôn"*). Ghi đè mục 4a bản nháp v3 ("vẽ trơn, không chữ, nhãn hậu kỳ" và "chỉ bản đồ trống"). Đã sửa skill 4d-bis 4a, 4c, 6i, SPEC-v2 §3/§6, `case-reference-images` §2, shot `C1-01c`. Chỉ áp cho bản đồ — cờ, địa cầu, vật khác vẫn không chữ.
