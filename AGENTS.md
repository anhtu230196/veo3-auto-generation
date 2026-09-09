# Đọc RUNBOOK.md TRƯỚC KHI làm bất kỳ việc gì trong repo này

File này (`AGENTS.md`) được nạp tự động — chỉ có 1 việc: nhắc bạn đọc
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

## Nhiều agent cùng làm repo này

Repo này dùng chung lớp phối hợp với `youtube-research-system`: ba agent (Codex,
Claude Code, Gemini) tranh luận nhiều vòng trên một sản phẩm trung gian trước khi
bước sau bắt đầu, thay vì chỉ review một lần ở cuối.

- Luật đầy đủ: [`coordination/RULES.md`](coordination/RULES.md).
- Cách dùng hằng ngày: [`coordination/README.md`](coordination/README.md).
- Quy trình nhận một lượt: [`.claude/skills/deliberation/SKILL.md`](.claude/skills/deliberation/SKILL.md).

Script phối hợp chép nguyên từ `youtube-research-system`, nên prompt của nó có
chỗ nói **"AGENTS.md mục 8"** — repo này không đánh số mục, câu đó trỏ về đúng
mục này và về `coordination/RULES.md`.

Ba điểm dễ bỏ sót:

- **Claim trước khi làm việc nặng** — `python scripts/claims.py check`. Không đụng
  vào việc đang có claim `active` của agent khác.
- **Không commit thẳng lên `master`** trừ file claim. Nhánh đặt tên
  `codex/<slug>`, `claude/<slug>`, `gemini/<slug>`.
- **Người viết không phải người review.** Không agent nào tự merge nhánh của mình.

Mở một việc mới bằng một câu:

```bash
python scripts/orchestrate.py start "Chọn 6 case cho tập chủ đề mất tích không lời giải"
```

Lệnh này chạy CLI của cả ba agent bằng subscription (`claude -p`, `codex exec`,
`gemini -p`), không gọi API. Chạy nó từ terminal thật, đừng chạy bên trong một
phiên agent — sẽ lồng phiên và ăn hai lần quota.
