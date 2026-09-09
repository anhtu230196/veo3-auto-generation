# coordination/

Nơi ba agent — Codex (ChatGPT), Claude Code, Gemini — nói cho nhau biết ai đang làm gì và tranh luận trên một sản phẩm trước khi bước sau bắt đầu.

Luật đầy đủ: [`RULES.md`](RULES.md). Quy trình nhận một lượt: [`../.claude/skills/deliberation/SKILL.md`](../.claude/skills/deliberation/SKILL.md).

Lớp này chép từ repo `youtube-research-system` và giữ y nguyên cách dùng. Sửa luật một bên thì chép sang bên kia.

| Thư mục | Dùng để |
| --- | --- |
| `threads/` | Luồng review nhiều vòng trên một sản phẩm. Nơi ba agent thật sự tranh luận. |
| `claims/` | Một file cho một việc đang giữ. Chống hai agent làm trùng. |
| `drafts/` | Artifact mặc định của một luồng mở bằng `orchestrate.py start`. |
| `reviews/` | Báo cáo review dài, khi comment không đủ chỗ. |
| `handoffs/` | Ghi chú bàn giao khi việc chuyển từ agent này sang agent khác. |

## Bắt đầu một việc mới

```bash
python scripts/orchestrate.py start "Chọn 6 case cho tập chủ đề mất tích không lời giải"
```

Một câu tiếng Việt là đủ. Lệnh này suy slug, mở luồng với `codex` viết bản đầu và `claude` + `gemini` review, đặt artifact ở `coordination/drafts/<slug>.md`, rồi chạy tới khi hội tụ hoặc chạm trần 3 vòng.

Sản phẩm đã có sẵn đường dẫn thì trỏ thẳng vào nó:

```bash
python scripts/orchestrate.py start "Doi chieu prompt anh case 2 voi anh tu lieu" \
  --author claude \
  --artifact narration-scripts/tap-tam-linh/assets.json
```

## Xem và chạy tiếp

```bash
python scripts/thread.py status          # luong nao dang mo, toi luot ai
python scripts/thread.py next <slug>     # in cau can dan tay cho agent ke tiep
python scripts/orchestrate.py turn <slug>  # chay dung mot luot
python scripts/orchestrate.py run <slug>   # chay den khi hoi tu
python scripts/thread.py check           # kiem tra tinh nhat quan
```

`THREAD.md` trong mỗi luồng là thứ **duy nhất** cần đọc để biết làm gì tiếp: đang vòng mấy, tới lượt ai, điểm `D**` nào còn mở.

Lượt review chạy chế độ chỉ đọc; chỉ lượt tác giả mới được sửa artifact. Cấu hình lệnh CLI ở [`agents.json`](agents.json) — kiểm bằng:

```bash
python scripts/orchestrate.py doctor --probe
```

## claims/

Trước khi bắt tay vào việc nặng:

```bash
python scripts/claims.py check
python scripts/claims.py new tap-tam-linh --agent codex --branch codex/tap-tam-linh --task "Viet ban tieng Viet"
```

Vòng đời: `active` → `done` (xong) hoặc `released` (bỏ giữa chừng, ghi rõ còn dở gì). Claim `active` quá 7 ngày không cập nhật coi như nguội. Claim phải có mặt trên `master` trước khi làm việc nặng, nếu không nó không khóa được gì.

## Nhãn dùng trong file review

`CHAN:` (không đi tiếp được) · `SUA:` (nên sửa, không chặn) · `HOI:` (cần tác giả trả lời) · `OK:` (đã kiểm và đạt — ghi rõ kiểm bằng cách nào).
