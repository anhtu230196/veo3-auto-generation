---
id: sys-script-story-structure
agent: codex
branch: master
status: done
opened: 2026-09-16
updated: 2026-09-16
scope:
  - .claude/skills/true-story-compilation-script/
  - .agents/skills/true-story-compilation-script/
  - RUNBOOK.md
---

# sys-script-story-structure — Cap nhat skill ke chuyen theo phan tich mau, bo muc giong tro chuyen

**Làm gì:** Cap nhat skill ke chuyen theo phan tich mau, bo muc giong tro chuyen

**Không đụng tới:** `src/`, `image-prompts/`, `narration-scripts/`, các skill
ảnh, `used-topics.md`, các luồng review đang mở.

**Ghi chú:** Đã cập nhật skill và thêm `references/story-structure.md` ở cả
`.claude/` và `.agents/`, theo điểm 2–8 của phân tích mẫu; không thêm điểm 1.
Đã có lượt đọc phản biện độc lập của sub-agent Codex và lượt áp thử riêng với
hai hồ sơ giả định. Đây không phải review của Claude/Gemini trong luồng phối
hợp; chưa commit. Bước review theo `coordination/RULES.md` vẫn cần trước khi
commit nội dung. Claim đóng vì phần cập nhật tại máy theo yêu cầu đã xong.
