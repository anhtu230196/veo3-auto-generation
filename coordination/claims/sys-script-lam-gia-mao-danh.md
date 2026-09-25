---
id: sys-script-lam-gia-mao-danh
agent: claude
branch: master
status: done
opened: 2026-09-17
updated: 2026-09-25
scope:
  - narration-scripts/lam-gia-va-mao-danh-bi-vach-tran/
---

# sys-script-lam-gia-mao-danh — Tap Lam gia va mao danh bi vach tran: tra cuu 6 case, viet ban Viet cho Tu duyet

**Làm gì:** Tap Lam gia va mao danh bi vach tran: tra cuu 6 case, viet ban Viet cho Tu duyet

**Không đụng tới:** `src/`, `image-prompts/`, các tập khác trong `narration-scripts/`,
các skill (ngoài `used-topics.md` đã cập nhật riêng).

**Ghi chú:** Chủ đề 1 Tú chọn 2026-09-17. 6 case: Cottingley, Piltdown, Demara, Nhật ký
Hitler, Anna Anderson, Van Meegeren. Bản Việt `claude-opus-5/vi.md` + `claude-opus-5/notes.md`
(thư mục con theo người viết) đã viết, CHỜ TÚ DUYỆT (bước 4). Chưa có luồng review. Chưa commit.
2026-09-17 (Sonnet): thêm `claude-sonnet-5/vi.md` + `claude-sonnet-5/notes.md` —
viết lại cùng 6 case bằng câu chữ độc lập, DÙNG LẠI nguyên nghiên cứu/nguồn của
`claude-opus-5/notes.md` (không tra cứu mới). Mục đích: Tú so cách kể giữa hai
model trên cùng dữ liệu. Cả hai bản đều đang chờ Tú chọn/duyệt, chưa commit.
2026-09-25 (Opus 5.5): thêm `claude-opus-5-5/vi.md` + `claude-opus-5-5/notes.md` — tra
cứu lại từ đầu, không đọc các bản khác. Thứ tự: Cottingley, Piltdown, Demara, Nhật ký
Hitler, Anna Anderson, Van Meegeren. Chờ Tú duyệt, chưa commit. (Thư mục
`claude-haiku-4-5/` cũng có một bản, có nhiều lỗi dữ kiện, vd Anna Anderson mất 1984 chứ
không phải 1994.)
2026-09-25: Tú chọn bản Opus 5.5. Đã viết `claude-opus-5-5/en.md`, chép `vi.md` + `en.md`
ra thư mục tập, ghi `used-topics.md` (.claude + .agents). Claim → `done`. Chưa commit.
