---
id: sys-img-lam-gia-c1
agent: claude
branch: master
status: active
opened: 2026-09-25
updated: 2026-10-06
scope:
  - narration-scripts/lam-gia-va-mao-danh-bi-vach-tran/refs/case-1/
  - narration-scripts/lam-gia-va-mao-danh-bi-vach-tran/case-1/
  - scripts/audit-shots.ts
  - scripts/review_shots.py
  - scripts/lib/shotsStatus.ts
  - scripts/run-shots.ts
  - src/veo3bot/imageAsset.ts
  - image-prompts/SPEC-v2.md
---

# sys-img-lam-gia-c1 — Tap Lam gia va mao danh, case 1 Cottingley: anh tu lieu, case-1.shots.json, chay Flow; kem truong `daTao` (code cho review)

**Làm gì:** Tap Lam gia va mao danh, case 1 Cottingley: gom anh tu lieu, viet case-1.shots.json, chay Flow du 85/85; them truong `daTao` (runner + audit ghi trang thai anh vao .shots.json)

**Không đụng tới:** `src/` ngoài `src/veo3bot/imageAsset.ts`, các skill, `vi.md`/`en.md` của tập, các case 2–6 (làm sau, claim riêng).

**Ghi chú:** 2026-09-25: Tú cho phép tải; đã tải 32 ảnh tư liệu vào `refs/case-1/`
(manifest `refs/case-1/README.md`). Viết `case-1/case-1.shots.json`: 85 shot mới + 41 câu
dùng lại, phủ đủ 95 câu; build sạch; sinh `case-1.review.md` + `case-1.tomtat.md`. Tú đã
duyệt, đã chạy Flow cho 84/85 shot (mọi shot trừ C1-04c). Re-audit tên↔ảnh lần cuối xác
nhận 83/84 khớp đúng 1-1 trước khi chạy C1-42b; C1-42b vừa chạy lại bằng code
`imageAsset.ts` đã vá (retry xoá sạch prompt + nhận diện ảnh mới theo tile đầu + tên mới),
ảnh ra đúng nội dung; audit 2026-09-25 xác nhận 84/85 khớp 1-1.
2026-09-28: Tú cho tải ảnh nhà số 31 Main Street (`refs/case-1/08-cottingley-03.jpg`), viết lại
C1-04c theo ảnh thật (tên card mới "Stone End Terrace House With Tall Gable Chimney"), bỏ
`choTuLieu`, build lại (chỉ C1-04c đổi), chạy Flow ✅. Audit tên↔ảnh trên Flow: **85/85 khớp
đúng 1-1** (`output/lamgia-c1-audit/report.json`). Case 1 XONG phần ảnh.
2026-09-28 (Tú yêu cầu): trường `daTao` trong từng shot của `.shots.json` — `scripts/audit-shots.ts`
(bản chính thức của `.tmp-audit-names.ts`) tra thẳng Flow rồi ghi; `review_shots.py` đọc nó làm
trạng thái. Sau đó Tú đồng ý tiếp quản `run-shots.ts` + `imageAsset.ts` từ claim nguội
`sys-img-prompts-v2-json`: runner tự ghi `daTao` ngay sau mỗi shot (`nguon: run-shots`),
`createImageIngredient` trả `"created" | "existing"`, module chung `scripts/lib/shotsStatus.ts`.
Đã test trên bản sao scratchpad: nhánh existing, nhánh lỗi, nhánh giữ nguyên. Nhánh `created`
chưa chạy thật (tốn lượt tạo ảnh) — lần tạo ảnh kế tiếp sẽ thử. SPEC-v2 đã ghi trường `daTao`
(mục 5e + dòng bảng 5c). 6 file `scripts/.tmp-*.ts` đã chuyển vào Thùng rác Windows (khôi phục được).
2026-10-06: Tú cho commit + push RIÊNG phần nội dung case 1 (`case-1/`, manifest `refs/`, state
project, hai claim). Phần CODE (`imageAsset.ts`, `run-shots.ts`, `review_shots.py`, `audit-shots.ts`,
`scripts/lib/`, SPEC-v2) CHƯA commit — còn cần qua luồng review theo CLAUDE.md. `case-1.shots.json`
đã mang trường `daTao` dù code ghi nó chưa lên master (builder bỏ qua trường lạ, không vỡ gì).
