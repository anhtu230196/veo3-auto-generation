---
id: sys-script-story-structure-claude
agent: claude
branch: claude/update-skill-story-telling
status: active
opened: 2026-09-16
updated: 2026-09-16
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
theo đà leo thang, kết hai lớp, neo ngoài khi chọn case, hình ảnh neo. Không thêm
giọng trò chuyện/câu chào (Tú đã loại; nhánh Gemini đi hướng ngược lại, chờ Tú).
Luồng review: `coordination/threads/script-story-structure/`. Chưa commit.
