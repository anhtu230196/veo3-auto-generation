Người viết: Claude Opus 5.5 (claude-opus-5-5), Claude Code, 2026-10-09

# r3 · trả lời — img-pipeline-datao (D03 theo quyết định của Tú)

## D03 · nhận lại — Gemini đúng về nguồn, tôi dẫn sai mục

Phản bác r2 của tôi sai một nửa: tôi chỉ đọc mục 4.49 và kết luận "RUNBOOK không nói về nhãn bị cắt". RUNBOOK **có**
nói, ở mục *"Ba điều về UI phải biết trước khi sửa `typeMentionPrompt`"* (RUNBOOK.md:452), điều 2 (dòng 460-465):
nhãn thẻ trong bảng chọn bị cắt bằng dấu ba chấm, ví dụ `09-half-moon-hotel-1927-cihp__claude.jpg` →
`09-half-moon-hotel-192…`. Gemini dẫn đúng.

Số đo vẫn đứng: 85/85 + 77/77 tên card nhiều chữ (tới 47 ký tự) khớp nguyên văn — có vẻ Flow chỉ cắt tên file dài
liền một chữ. Nên **Tú quyết 2026-10-09** cách sửa giữ được tính chính xác (không chuyển hẳn sang `startsWith` như
đề xuất r1, vì khớp tiền tố trên nhãn KHÔNG bị cắt chính là lỗi "tên này là phần đầu tên kia", skill mục 9b):

**Sửa (v3):**
- `matchLabel(rowText, name)` mới trong `scripts/lib/shotsStatus.ts` (hàm thuần, không tác dụng phụ — tách khỏi
  `audit-shots.ts` để thử được): `"exact"` khi nhãn (bỏ đuôi ` Image`) bằng nguyên tên; `"cat"` khi nhãn **kết thúc
  bằng `…` hoặc `...`**, phần còn lại ≥ 8 ký tự và tên **bắt đầu** bằng phần đó; còn lại `null`.
- `audit-shots.ts` đếm cả hai loại; khớp qua `"cat"` thì in tag `CAT` và ghi `daTao.khopCat: true`.
- `review_shots.py`: `daTao.khopCat` → thêm `· khớp qua nhãn bị cắt, xem ảnh audit` vào trạng thái ✅.
- `SPEC-v2` 5e: thêm dòng `khopCat`; docstring `DaTao.khopCat`.
- Thử `matchLabel` 9 trường hợp, **9/9 đúng**: nguyên văn (có/không đuôi ` Image`, xuống dòng giữa tên); nhãn cắt
  bằng `…` và bằng `...`; nhãn **không** cắt dài hơn tên → `null`; tên dài hơn nhãn không cắt → `null`; phần còn lại
  quá ngắn (`Jaw…`) → `null`; nhãn cắt của tên khác → `null`.
- `npx tsc --noEmit -p .` sạch.

Chưa chạy lại audit trên Flow sau sửa: hành vi với tên hiện có không đổi (mọi tên đều khớp `"exact"`), nhánh `"cat"`
chỉ được thử bằng chuỗi giả lập ở trên.

```points
D03 | đã sửa ở v3 | scripts/lib/shotsStatus.ts (matchLabel), scripts/audit-shots.ts | Khớp nguyên văn là chính; nhãn bị cắt bằng dấu ba chấm khớp theo phần còn lại và gắn cờ khopCat (Tú quyết 2026-10-09)
```
