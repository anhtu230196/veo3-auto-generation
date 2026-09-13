---
id: img-skill-a1-lessons
step: 5
artifact: coordination/drafts/img-skill-a1-lessons.md
artifact_version: 3
author: claude
reviewers:
  - codex
  - gemini
round: 3
turn: gemini
turn_role: reviewer
status: open
opened: 2026-09-13
updated: 2026-09-13
---

# img-skill-a1-lessons

**Sản phẩm đang review:** `coordination/drafts/img-skill-a1-lessons.md`

## Câu hỏi luồng này phải trả lời

Nang cap skill viet prompt anh tu 8 gop y cua Tu tren case Abe Reles

## Việc mọi lượt phải làm

Artifact la BAN NHAP cac luat moi cho skill nano-banana-image-prompts, rut tu 8 gop y cua Tu tren case A1 (Abe Reles). Vi du ap dung cu the nam o image-prompts/A1.shots.json. Review: moi luat moi co dung voi bang chung tu 8 gop y khong, co mau thuan voi luat da do duoc trong RUNBOOK muc 0 hay SPEC-v2 khong, co tong quat hoa qua da (ap sai cho chu de khac) khong. Khong review phong cach net ve.

## Điểm tranh luận

| ID | Nêu bởi | Vòng | Nội dung | Trạng thái |
| --- | --- | --- | --- | --- |
| D01 | codex | r1 | coordination/drafts/img-skill-a1-lessons.md:41 · SUA — Yêu cầu cụ thể bị nâng thành luật bắt buộc; ngưỡng thêm phần tử chưa rõ | chốt: đã sửa |
| D02 | codex | r1 | coordination/drafts/img-skill-a1-lessons.md:127 · SUA — Phương án group không phù hợp toàn bộ phạm vi luật kiểm niên đại | chốt: đã sửa |
| D03 | codex | r1 | coordination/drafts/img-skill-a1-lessons.md:147 · SUA — Bắt buộc sinh B từ A chưa có bằng chứng và không khớp ví dụ JSON | chốt: đã sửa |
| D04 | codex | r1 | coordination/drafts/img-skill-a1-lessons.md:185 · CHAN — Bổ sung hành động thiếu giới hạn bằng chứng và nâng nghi vấn thành phủ nhận | chốt: đã sửa |
| D05 | codex | r1 | coordination/drafts/img-skill-a1-lessons.md:218 · SUA — Tái dùng asset nhân vật chưa chứng minh giữ khung cho chuỗi tư thế | chốt: đã sửa |
| D06 | gemini | r2 | coordination/drafts/img-skill-a1-lessons.md:269 · Gợi ý chọn ảnh neo theo loại phần tử mới cho câu mention | đã sửa ở v3 |
| D07 | codex | r3 | coordination/drafts/img-skill-a1-lessons.md:281 · SUA — A1-18b có cả người và đồ vật mới nhưng được chỉ định neo 03, trái ngoại lệ nhiều loại phần tử mới; cần làm rõ phạm vi hoặc bỏ chỉ định | mở |

## Nhật ký vòng

- r1 · claude (tác giả) · **đang chờ**

## Ngoài lượt

Việc gấp phát hiện khi chưa tới lượt mình thì ghi một dòng ở đây, không viết file vòng.

- 2026-09-13 · claude · **Tú yêu cầu chép bản nháp vào skill ngay, trước khi luồng `settled`.** Đã chép bản v3 (rút gọn) vào `.claude/skills/nano-banana-image-prompts/SKILL.md` mục 4d (+ `.agents/`), luật 4 vào `case-reference-images` mục 4d. **D07 chưa đóng trong luồng**: skill mục 4d-9d xử lý theo phương án 1 của Codex (tính người trước, vật chỉ là khung cảnh thì không quyết định neo; `A1-18b` giữ `03`), ghi rõ "chưa review". Bản nháp artifact KHÔNG sửa ngoài lượt. Lượt Gemini r3 vẫn nên chạy; điểm nào lật thì sửa thẳng skill.
