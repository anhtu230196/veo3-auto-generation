# Đọc RUNBOOK.md TRƯỚC KHI làm bất kỳ việc gì trong repo này

File này (`CLAUDE.md`) được nạp tự động — chỉ có 1 việc: nhắc bạn đọc
[RUNBOOK.md](RUNBOOK.md) ngay từ đầu phiên. RUNBOOK.md có:

- Mục 0: trạng thái hiện tại của project (bao nhiêu clip đã tạo, kịch bản nào
  đang dùng, việc gì còn dang dở).
- Mục 4: các bug/hành vi ngầm của Google Flow đã tốn nhiều giờ mới tìm ra —
  BẮT BUỘC đọc trước khi sửa bất kỳ file nào trong `src/veo3bot/`, để không
  lặp lại đúng lỗi đã sửa.

Đừng tự suy luận lại kiến trúc/bug từ code — RUNBOOK.md đã ghi lại đầy đủ lý do
đằng sau từng quyết định (vì sao dùng `domcontentloaded` thay vì `networkidle`,
vì sao Setting/Prop không dùng chung style block với Character, vì sao
`PARALLEL_WORKERS` mặc định là 1...).

Sau khi đọc RUNBOOK.md, dùng `git status`/`git diff`/`git log` để xem thay đổi
gần nhất thay vì hỏi lại người dùng.
