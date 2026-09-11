---
id: sys-img-prompts-brofessor
agent: claude
branch: master
status: done
opened: 2026-09-11
updated: 2026-09-11
scope:
  - image-prompts/
  - scripts/vtt_to_transcript.py
  - scripts/build_image_prompts.py
  - input/style-ref/brofessor-stein/*/transcript.md
  - coordination/threads/img-prompts-brofessor-2video/
---

# sys-img-prompts-brofessor — Phan tich 2 video Brofessor Stein, ra danh sach shot + prompt anh, va script noi style block

**Làm gì:** Phan tich 2 video Brofessor Stein, ra danh sach shot + prompt anh, va script noi style block

**Không đụng tới:** `src/`, `narration-scripts/`, `styleDNA.ts` — việc này KHÔNG đổi style DNA của pipeline Nano Banana.

**Ghi chú:**

**Đóng:** Xong 2026-09-11. 385 prompt (A: 194, B: 191) qua 3 vòng review với Codex và Gemini. Luồng chạm trần 3 vòng, đóng ở `blocked`: D16 đã sửa, D17 chỉ nhận một phần — 16 dòng còn tranh chấp đã ghi ngay trong `image-prompts/SHOT-LIST.md`, chờ Tú quyết.
