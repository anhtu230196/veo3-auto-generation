Người viết: Claude Opus 5.5 (claude-opus-5-5), Claude Code, 2026-10-09

# r1 · đề xuất — img-pipeline-datao (bước 6, code pipeline ảnh)

Artifact `coordination/drafts/img-pipeline-datao.md` chứa toàn bộ diff (so với `master`) của 4 file đã có và nội dung
đầy đủ 2 file mới. Codex hết hạn nên luồng này chỉ có **Gemini** review (Tú quyết 2026-10-09).

Thay đổi chia hai nhóm, cả hai sinh ra từ sự cố thật khi chạy tập `lam-gia-va-mao-danh-bi-vach-tran`.

## Nhóm A — `src/veo3bot/imageAsset.ts`: chèn chip `@`, xoá ô prompt, nhận ra ảnh mới

Sự cố case 1 (project `lam-gia-c1-shots`, ~85 media, 2026-09-25):

| # | Triệu chứng đo được | Sửa |
| --- | --- | --- |
| A1 | "Gõ `@` không mở bảng chọn": ảnh debug cho thấy prompt sạch `… as in [chip] and` mà `@` không hiện trong ô — cú bấm **giữa** ô trúng một chip (`contenteditable=false`) nên con trỏ không ở cuối. Và chữ gõ ngay sau một chip **mất 15-25 ký tự đầu**, cả 3 lượt gõ lại — ô prompt chưa nhận lại focus. | `focusPromptEnd`: bấm **góc dưới phải** ô, `Ctrl+End`, `End`. Không mở bảng thì thử lại **một** lần (Escape, bỏ `@` lạc, gõ ` @`). Sau khi chèn chip: chờ `document.activeElement.isContentEditable` (≤3s) + 500ms. Lỗi văng ra **giữa** lúc chèn chip giờ cũng vào vòng gõ lại (trước chỉ lỗi phát hiện lúc đọc lại mới vào). |
| A2 | Vòng gõ lại **không xoá sạch** lượt trước: C1-38b, C1-39, C1-51b được gửi với tiền tố lặp `draw the same man as in draw the same man as in …`. Bộ kiểm cũ ("đủ chữ, đủ chip" — `chipCount >= wantChips`) cho qua. | `clearPromptBox`: xoá rồi **đọc lại** tới khi không còn chữ, không còn chip (≤5 lần); không sạch sau 3 vòng thì ném lỗi, **không gửi**. Kiểm **khớp đúng**: chữ + nhãn chip (bỏ mọi ký tự không phải chữ/số) phải bằng đúng câu muốn gõ, và số chip phải **bằng** (không còn `>=`). |
| A3 | **Đặt tên đè lên thẻ cũ.** 5 thẻ cũ bị đổi tên (chân dung Gardner thành "Stack Of Folded Newspapers…", ảnh neo `03-five-men-group.png` thành "Society Member Holding Glass Plate…"); ảnh mới thật nằm vô danh với chú thích Flow tự sinh. Đời 3 của `findNewImageSrc` = "`src` đầu tiên trong cả lưới chưa có trong baseline". Ở project ~90 media lưới ảo hoá chỉ render ~18-25 thẻ: thẻ cũ ngoài vùng render lúc chụp baseline có thể hiện lại sau, hoặc `src` đổi token — trông như "chưa từng thấy". | Đời 4: ảnh mới = **thẻ đầu tiên có ảnh** (Flow xếp Recent), và **cả** `src` **lẫn** nhãn (`aria-label` của `flow-grid-tile-container`) đều chưa có lúc chụp baseline. Thẻ cũ mang tên đã đặt, ảnh mới mang chú thích Flow tự sinh. Mơ hồ → không nhận → hết giờ → **báo lỗi, không đặt tên đè**. Nhãn rỗng không tính là "đã có". |
| A4 | (cho nhóm B) | `createImageIngredient` trả `"created" \| "existing"` thay vì `void`. Mọi chỗ gọi khác (`createImageAssets.ts`, `createSceneComposites.ts`, `props.ts`, `settings.ts`, các `scripts/test-*.ts`) đều `await` mà bỏ qua giá trị — không vỡ. |

10 thẻ bị đặt nhầm của case 1 đã được đổi tên lại bằng tay (script tạm, đã bỏ); audit sau đó 85/85.

## Nhóm B — trường `daTao` trong `.shots.json` (Tú yêu cầu 2026-09-28)

"Thêm tham số trong json để xác nhận được ảnh đó tạo được chưa." Thiết kế:

- `scripts/lib/shotsStatus.ts`: kiểu `DaTao`, `promptHash` (cùng công thức `prompt_hash` của `review_shots.py`), `shotsFileFor`, `writeDaTao` (đọc–sửa–ghi, **giữ định dạng file**: thụt 2, kiểu xuống dòng, có/không dòng trống cuối).
- `scripts/run-shots.ts` ghi **ngay sau mỗi shot** (`nguon: "run-shots"`): `created` → ghi dấu prompt vừa gửi, luôn ghi đè; `existing` → `daTao` đã xác nhận cùng tên thì **để nguyên**, chưa có thì lấy prompt hiện tại; lỗi → đã xác nhận cùng tên thì để nguyên, chưa thì `ok: false` + `loi`.
- `scripts/audit-shots.ts` (bản chính thức của script audit tạm) tra ô "Search assets", đếm card mang **đúng nguyên tên** (`nguon: "audit-flow"`, có `soCard`), tải ảnh từng shot để xem bằng mắt; giữ `promptHash` cũ khi đã xác nhận cùng tên. Chặn khoá project lạ (không có `state/project-<khoá>.json`) vì `ensureProject` sẽ **tạo project rỗng** và báo mọi shot "chưa có".
- `scripts/review_shots.py` lấy cột trạng thái từ `daTao` trước log: `✅ có trên Flow` (audit) · `✅ đã tạo (runner báo, chưa audit)` · `🔁 tên cũ` · `⚠️ prompt đã đổi sau khi tạo` · `⚠️ trùng N card` · `⏸ chưa có` · `❌ lần chạy trước rơi`.
- `image-prompts/SPEC-v2.md` mục 5e + một dòng bảng 5c.

Vì sao dấu prompt phải giữ ở nhánh `existing`: chạy lại cả file sau khi sửa prompt một shot mà **không** đổi `outName` → runner thấy ảnh có sẵn, bỏ qua; nếu ghi dấu prompt mới vào thì cảnh báo "prompt đã đổi" biến mất trong khi ảnh trên Flow vẫn là prompt cũ — đúng loại lỗi D08.

## Bằng chứng chạy thật

| Lần chạy | Kết quả |
| --- | --- |
| Case 1, sau A1 (log `run-lamgia-c1-e`) | 20/21 |
| Case 1, sau A2+A3: C1-42b (3 chip), C1-04c | cả hai ✅, tên đúng ảnh; audit cả case **85/85** khớp đúng 1 card; soi bằng mắt từng tên ↔ ảnh |
| Case 2 Piltdown, 2026-10-09, project mới `lam-gia-c2-shots` (`output/run-lamgia-c2-a.log`) | **77/77 ✅ ngay lượt đầu**; 54 shot mention (có shot **4 chip**: C2-08b) — **0 lần gõ lại**; runner ghi `daTao` 77 shot, `promptHash == anhSeRaHash` **77/77** (lần đầu nhánh `created` chạy thật); audit **77/77**; soi bằng mắt 77 ảnh ↔ tên: không thẻ nào nhầm |
| Test nhánh `daTao` trên bản sao scratchpad (không tốn lượt tạo) | `existing` chưa xác nhận → ghi `ok:true`; lỗi + đã xác nhận → để nguyên; lỗi + chưa xác nhận → `ok:false` + `loi`; `review_shots.py` ra đúng 5 trạng thái |
| `npx tsc --noEmit -p .` | sạch |

## Chỗ tôi tự thấy yếu nhất

1. **A3 dựa trên hai giả định về UI Flow:** lưới xếp mới nhất lên đầu, và ảnh mới mang chú thích tự sinh khác mọi nhãn đang có. Giả định thứ hai hỏng khi Flow sinh trùng chú thích với một thẻ vô danh cũ (case 1 có thẻ mồ côi "Three people talking and listening") → hết giờ → lỗi → chạy lại sẽ tạo **thêm một ảnh** (ảnh trước nằm vô danh). Tôi chọn lỗi an toàn (trùng ảnh) hơn lỗi nguy hiểm (đặt tên đè). Case 2 là project **mới, ít media** — điều kiện "~90 media, lưới ảo hoá" chỉ được thử lại ở **2 shot** của case 1.
2. **Nhánh reload khi hết giờ** (`RELOAD_RECHECK`) dùng lại `baselineLabels` chụp trước khi bấm tạo — sau reload, thứ tự và nhãn có giữ nguyên không, chưa đo.
3. `clearPromptBox` coi ô là sạch khi `innerText` rỗng và 0 chip. Nếu Flow có placeholder nằm trong `innerText` thì sẽ báo "không sạch" oan và ném lỗi sau 3 vòng — chưa gặp trong 54+ shot, nhưng chưa kiểm DOM placeholder.
4. `writeDaTao` đọc–sửa–ghi không khoá: ai sửa `.shots.json` trong trình soạn thảo **trong lúc** mẻ chạy rồi lưu sau thì đè mất `daTao` (hoặc ngược lại trong khe vài ms). Chấp nhận, ghi vào SPEC "máy ghi, đừng gõ tay".
5. `writeDaTao` ghi lại bằng `JSON.stringify(…, 2)` — chỉ kiểm định dạng giống hệt trên 2 file (case 1 CRLF không dòng trống cuối, case 2 LF có dòng trống cuối). File viết tay kiểu khác (mảng một dòng) sẽ bị định dạng lại ở lần ghi đầu.
6. `assetAlreadyExists` / `assertAssetNamed` **vẫn khớp chuỗi con** (`hasText`) — không đổi ở đây; runner có thể báo `existing` oan khi tên này là phần của tên kia. Audit khớp nguyên tên nên bắt được về sau.

## Câu hỏi muốn người review trả lời

- **Q1.** Logic "thẻ đầu + `src` mới + nhãn mới" còn đường nào **đặt tên đè lên thẻ cũ** không — nhất là nhánh reload khi hết giờ (yếu điểm 2)?
- **Q2.** Luật giữ `promptHash` (runner nhánh `existing`, audit khi đã xác nhận) còn đường nào cho ra `✅` trong khi ảnh trên Flow là của prompt cũ?
- **Q3.** SPEC-v2 mục 5e có chỗ nào nói khác code không?
- **Q4.** Có đường gọi nào của `createImageIngredient` / `typeMentionPrompt` mà thay đổi A1-A2 làm vỡ (vd đường `reference` không qua mention)?

## Cố ý chưa làm

- `scripts/tomtat_shots.py` chưa đọc `daTao` (vẫn theo `--flow-status`).
- Chưa đổi `assetAlreadyExists` / `assertAssetNamed` sang khớp nguyên tên — việc riêng, đụng đường chống tạo trùng.
- Chưa ghi RUNBOOK: bài học cổng 9222 bị Chrome cá nhân giữ (dùng 9223), bài học chip/đặt tên. Làm sau khi luồng chốt.
- Không có test tự động (repo không có khung test cho Playwright/Flow); bằng chứng là log chạy thật + audit.

```points
```
