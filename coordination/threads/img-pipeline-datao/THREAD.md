---
id: img-pipeline-datao
step: 6
artifact: coordination/drafts/img-pipeline-datao.md
artifact_version: 3
author: claude
reviewers:
  - gemini
round: 2
turn: claude
turn_role: author
status: settled
opened: 2026-10-09
updated: 2026-10-09
---

# img-pipeline-datao

**Sản phẩm đang review:** `coordination/drafts/img-pipeline-datao.md`

## Câu hỏi luồng này phải trả lời

Thay doi code pipeline anh (imageAsset.ts: chen chip @, xoa o prompt, nhan anh moi; run-shots.ts + audit-shots.ts + shotsStatus.ts + review_shots.py: truong daTao) co dung, an toan, khong lam vo duong cu, va khong lap lai bug da biet trong RUNBOOK muc 4 khong?

## Việc mọi lượt phải làm

Bước 6 (code). Artifact coordination/drafts/img-pipeline-datao.md chứa TOÀN BỘ diff + nội dung 2 file mới — bạn không chạy được shell nên đọc diff ở đó, đọc mã nguồn đầy đủ ở đường dẫn trong repo. BẮT BUỘC đọc RUNBOOK.md mục 4 trước khi nêu điểm về src/veo3bot/ (nhiều hành vi lạ là bug Google Flow đã biết). Đọc đề xuất r1-00-proposal-claude.md (lý do, bằng chứng chạy thật, chỗ yếu, câu hỏi). Nêu: lỗi logic, nhánh có thể đặt tên ĐÈ lên ảnh cũ hoặc tạo ảnh TRÙNG, đường gọi cũ bị vỡ, ghi JSON hỏng định dạng, chỗ SPEC-v2 nói khác code. Không nêu gu đặt tên hay cách viết khác.

## Điểm tranh luận

| ID | Nêu bởi | Vòng | Nội dung | Trạng thái |
| --- | --- | --- | --- | --- |
| D01 | gemini | r1 | src/veo3bot/imageAsset.ts (findNewImageSrc) · CHẶN: Nhánh reload nhận nhầm thẻ cũ vô danh thành ảnh mới (do token src đổi và label rỗng lọt qua bộ lọc), gây đặt tên đè lên ảnh cũ. Cần sửa logic không nhận thẻ rỗng nhãn khi reload. | chốt: đã sửa |
| D02 | gemini | r1 | src/veo3bot/imageAsset.ts (focusPromptEnd) · CHẶN: Bấm tọa độ góc dưới phải (width-4, height-4) sẽ trúng thanh cuộn khi prompt dài, ô text mất focus và phím gõ rơi ra ngoài. Cần đổi cách cấp focus không dính thanh cuộn. | chốt: đã sửa |
| D03 | gemini | r1 | scripts/audit-shots.ts (khớp tên) · CHẶN: Khớp tên bằng `t === j.outName` trượt 100% với tên dài do Flow cắt chuỗi bằng dấu ba chấm (bài học RUNBOOK 4.49). Cần chuyển sang so khớp startsWith sau khi cắt đuôi như cũ. | chốt: đã sửa |
| D04 | gemini | r1 | scripts/run-shots.ts (recordDaTao) · CHẶN: Tự động gán promptHash mới cho ảnh existing cũ chưa có dấu, che đậy việc ảnh vốn vẽ bằng prompt cũ và báo ✅ sai sự thật. Cần bỏ logic tự gán hash này ở cả run-shots và audit-shots. | chốt: đã sửa |
| D05 | gemini | r1 | scripts/audit-shots.ts · SỬA: Code ép `ok = false` khi `soCard > 1`, mâu thuẫn với SPEC-v2 (quy định ok=true nghĩa là ảnh đã có trên Flow). Cần sửa code để ok=true hoặc cập nhật SPEC ghi rõ ngoại lệ này. | chốt: đã sửa |

## Nhật ký vòng

- r1 · claude (tác giả) · **đang chờ**

## Ngoài lượt

Việc gấp phát hiện khi chưa tới lượt mình thì ghi một dòng ở đây, không viết file vòng.
