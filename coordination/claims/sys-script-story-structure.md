---
id: sys-script-story-structure
agent: codex
branch: master
status: active
opened: 2026-09-16
updated: 2026-09-17
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
hợp. Bản đầu đã commit tại `0c97659`, đang review trên PR #3.
Ngày 2026-09-17: mở lại claim để xử lý C1–C3 của Claude theo yêu cầu Tú.
C1 đổi ví dụ tiêu đề ở cả hai bản skill; C2 mở lại trạng thái claim;
C3 cập nhật RUNBOOK. C4 vẫn mở: chưa hoàn tất review độc lập trước khi gộp.
Phần sửa chỉ thuộc nhánh PR #3, không sửa artifact trên nhánh Claude.
Nhánh làm việc thực tế: `chatgpt/update-skill-story-telling`; đích gộp: `master`.
Trường `branch` giữ `master` vì claims.py chỉ chấp nhận nhánh mặc định hoặc
tiền tố codex/, claude/, gemini/; tên nhánh PR hiện hữu không qua bộ kiểm tra.
