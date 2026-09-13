---
id: sys-img-skill-a1-lessons
agent: claude
branch: master
status: active
opened: 2026-09-13
updated: 2026-09-13
scope:
  - coordination/drafts/img-skill-a1-lessons.md
  - coordination/threads/img-skill-a1-lessons/
  - image-prompts/A1.shots.json
  - image-prompts/refs/A1/
  - scripts/build_image_prompts.py
---

# sys-img-skill-a1-lessons — Nang cap skill prompt anh tu 8 gop y cua Tu tren case Abe Reles, qua luong review 3 agent

**Làm gì:** Nang cap skill prompt anh tu 8 gop y cua Tu tren case Abe Reles, qua luong review 3 agent

**Không đụng tới:** skill `nano-banana-image-prompts` (ca `.claude/` va `.agents/`) — chi sua SAU khi luong settled; `image-prompts/A1.newstyle.shots.json` va `A1.anchor.shots.json` (artifact cua Gemini); `image-prompts/A2.shots.json`.

**Ghi chú:** 2026-09-13 — Tú yêu cầu chép vào skill trước khi luồng `settled`; việc chép và việc áp skill cho tập `ca-mot-nhom-nguoi-bien-mat-khong-dau-vet` nằm ở claim `sys-img-shots-nhom-bien-mat`. Dòng "Không đụng tới skill" ở trên hết hiệu lực từ lúc đó.
