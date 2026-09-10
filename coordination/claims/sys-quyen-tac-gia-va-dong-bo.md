---
id: sys-quyen-tac-gia-va-dong-bo
agent: claude
branch: master
status: done
opened: 2026-09-11
updated: 2026-09-11
scope:
  - CLAUDE.md
  - coordination/RULES.md
  - coordination/README.md
  - coordination/agents.json
  - scripts/orchestrate.py
  - scripts/claims.py
---

# sys-quyen-tac-gia-va-dong-bo — Va 4 cho lech: CLAUDE.md, model codex/gemini, quyen tac gia cho gemini+codex, dong claim cu

**Làm gì:** Va 4 cho lech: CLAUDE.md, model codex/gemini, quyen tac gia cho gemini+codex, dong claim cu

**Không đụng tới:** `scripts/thread.py`, `scripts/thread_view.py`, `src/`, `narration-scripts/`.

**Ghi chú:**

**Đóng:** Xong 2026-09-11. Đã đo lại quyền ghi của cả ba CLI bằng subprocess, chạy thử ghế tác giả thật cho Gemini và Codex (cả hai ghi được artifact), `doctor --probe` cả ba OK. Đã vào `master`.
