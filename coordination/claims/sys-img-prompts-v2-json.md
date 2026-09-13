---
id: sys-img-prompts-v2-json
agent: claude
branch: master
status: active
opened: 2026-09-11
updated: 2026-09-12
scope:
  - image-prompts/
  - input/style-ref/_anchors/
  - scripts/build_image_prompts.py
  - scripts/run-shots.ts
  - src/veo3bot/imageAsset.ts
---

# sys-img-prompts-v2-json — Chuyen prompt anh sang JSON co neo doan noi dung, quy uoc luu anh tu lieu co ghi ai tim ra, va luat viet prompt theo tung loai noi dung

**Làm gì:** Chuyen prompt anh sang JSON co neo doan noi dung, quy uoc luu anh tu lieu co ghi ai tim ra, va luat viet prompt theo tung loai noi dung

**Không đụng tới:** `image-prompts/A1.newstyle.shots.json` va
`image-prompts/A1.anchor.shots.json` — artifact NOI DUNG cua Gemini (claim
`sys-img-gemini-newstyle`). Ban dung anh neo cua Tu la file rieng
`image-prompts/A1.tu-anchors.shots.json`.

**Ghi chú:** 2026-09-12 mo rong sang lop CO CHE cua anh neo phong cach Tu gui
(`--anchors` cua run-shots.ts, `attachReferences` trong imageAsset.ts) — day la
buoc 6 (co che), khac buoc 5 (noi dung) ma Gemini dang giu. 
