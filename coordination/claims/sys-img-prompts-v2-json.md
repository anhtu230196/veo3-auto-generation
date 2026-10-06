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

2026-09-28: claim da nguoi 16 ngay. Tu dong y chuyen `scripts/run-shots.ts` va
`src/veo3bot/imageAsset.ts` sang claim `sys-img-lam-gia-c1` (truong `daTao` do runner tu ghi).
Cung ngay, theo lenh Tu, claim do sua `image-prompts/SPEC-v2.md` (them muc 5e + mot dong bang 5c). 
