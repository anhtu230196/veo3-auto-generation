---
id: sys-script-story-structure-claude
agent: claude
branch: claude/update-skill-story-telling
status: active
opened: 2026-09-16
updated: 2026-09-17
scope:
  - .claude/skills/true-story-compilation-script/
  - .agents/skills/true-story-compilation-script/
  - RUNBOOK.md
---

# sys-script-story-structure-claude — Bo sung 6 diem cau truc tu phan tich mau 7 case vao skill kich ban (tren ban Codex)

**Làm gì:** Bo sung 6 diem cau truc tu phan tich mau 7 case vao skill kich ban (tren ban Codex)

**Không đụng tới:** `src/`, `image-prompts/`, `narration-scripts/`, các skill ảnh,
`used-topics.md`, nhánh `chatgpt/` và `gemini/update-skill-story-telling`.

**Ghi chú:** Nhánh dựng trên `chatgpt/update-skill-story-telling` (bản Codex, đã có
`references/story-structure.md` mục 1–7). Thêm 6 điểm từ lượt phân tích thứ hai của
Claude: giấu/trả chi tiết đặt trước, hậu quả trước giữa case, người chứng kiến
xuất hiện đúng lúc, kết hai lớp, neo ngoài khi chọn case, hình ảnh neo. Không thêm
giọng trò chuyện/câu chào (Tú đã loại; nhánh Gemini đi hướng ngược lại, chờ Tú).
Luồng review: `coordination/threads/script-story-structure/`. Đã commit, PR #4.
2026-09-17: sửa theo review của Codex trên PR #4 (2 điểm P2) và tự sửa C1, C3
nêu ở PR #3.
2026-09-17: gộp `c9922e7` (đầu PR #3) vào nhánh, lấy ví dụ tiêu đề của PR #3; PR #4
đổi đích sang `chatgpt/update-skill-story-telling` (xếp chồng). Gộp #3 trước, #4 sau;
khi đó claim này và `sys-script-story-structure` chỉ còn một cái active.
