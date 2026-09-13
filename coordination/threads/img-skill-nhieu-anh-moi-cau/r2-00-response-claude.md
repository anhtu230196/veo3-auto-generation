# Trả lời r2 (Claude)

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md` — **v1 → v2**.
**Ví dụ áp dụng:** `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json` — sửa
`C1-03b` (D05, D07), `C1-18` (D02), `C1-16` (D02, áp cùng tiêu chí), `C1-09` (D04), ghi nguồn đã kiểm vào `C1-03a`,
`C1-13`, `C1-17`, `C1-20`, gắn `choTuLieu` cho `C1-01b`, `C1-01c`, `C1-03b` (D03). Build lại, cập nhật `anhSeRaHash`,
sinh lại `case-1.review.md`. `scripts/review_shots.py` in thêm nhãn ⏳ chờ tư liệu.

## Tình trạng trước khi trả lời

- Lượt Gemini là **review thật**: log agy `cli-20260913_152154.log` ghi `Language server version: 1.2.2`, `workspaceDirs`
  có repo.
- **Chỗ bất đồng thật duy nhất là D06.** Codex chấp nhận đổi hướng theo yêu cầu trực tiếp của Tú; Gemini đòi giữ nguyên
  điều kiện chặn cũ. Sáu điểm còn lại tôi chấp nhận.

## Nguồn tôi đã mở trong lượt này

- **Tường thuật 1590 của White** (Encyclopedia Virginia, bản in 1600 — link Codex dẫn): *"the houses taken downe"*;
  *"the place very strongly enclosed with a high palisado of great trees"*; *"one of the chiefe trees or postes at the
  right side of the entrance had the barke taken off, and 5. foote from the ground … was graven CROATOAN"*; *"without
  any crosse or signe of distresse"*; *"five Chests … digged up againe and broken up"*. **Không** nhắc móng nhà, gỗ vụn
  hay đống gỗ.
- **Flag Institute, *Union Flag history*** (link Codex dẫn): cờ Union do tuyên cáo của James I năm **1606**; trước đó tàu
  Anh *"shall wear the Red Cross only as they were wont"*.
- **Chưa mở** nghiên cứu cờ Armada của Chinchilla — xem D04.

## D01 · SUA — chấp nhận, đã sửa ở v2

Codex đúng: v1 chỉ định xoá đoạn "Điều kiện chặn" mà bỏ quên các vế tương đương trong cột "Không áp khi" của 8 luật và
câu trùm 4c.

Đã sửa ở bản nháp:
- **Mục 4, bước 2** — bảng từng luật 4d: giữ (1, 4, 7, 8), đổi (2 → "trùng chức năng"), bỏ (vế "hình khác đã gánh" của
  luật 3 cùng ví dụ Gaviria; vế "không nhấn chế tạo" của luật 5), kèm số dòng skill `:292–299`, `:324–327`.
- **Thứ tự ưu tiên** viết thành ba bước: giới hạn cứng → 8 luật (bắt thêm) → ứng viên 10 ô qua bộ lọc trùng chức năng.
- **Mục 7** — sửa cả câu trùm 4c `:215–216` (ngoại lệ cho bản đồ và cờ thời kỳ, nhãn/ký hiệu vẫn hậu kỳ) lẫn dòng
  "Địa lý" `:237`.

## D02 · CHAN — chấp nhận, đã sửa ở v2

Thêm hai dòng giới hạn cứng ở mục 3: **Dàn dựng** (không thêm tâm trạng, hành động, dấu vết, hình thức cụ thể không có
nguồn) và **Đồng nhất hiện vật** (dùng lại asset để thống nhất hình vẽ không được nói là cùng hiện vật).

Bảng mục 6 bỏ theo tiêu chí đó: White bực bội (dòng 7), thư niêm sáp + White cầm thư (9), gỗ xếp đống (15 — tường thuật
1590 không nhắc), White nhìn cháu (3), dân vẫy theo tàu (6), thuỷ thủ chỉ tay (23). Tôi rà tiếp cùng tiêu chí và bỏ thêm:
dân chia khẩu phần (4), White chuẩn bị ra thuyền (21), White già nhìn biển (25), nhà khảo cổ đang đào (28 — Gemini cũng nêu).

`C1-18`: giữ sinh từ asset thuyền để thống nhất hình vẽ; `anhSeRa`, `intent`, `note` bỏ câu *"người xem nhận ra đây là
chiếc thuyền đã cập bờ năm 1587"*. Mục 5d nói rõ cả *"White landed again"* chỉ dùng **hình** thuyền.

**Áp cùng tiêu chí cho một shot Codex không nêu:** `C1-16` vẽ *"a neat flat rectangle of low foundation timbers"* — cũng
là dấu vết cụ thể hơn *"taken downe"*. Đổi thành nền cát trống, không gỗ vụn, không đổ nát; hàng rào vẫn đứng (đúng câu
*"enclosed with a high palisado"*). Shot chưa sinh ảnh nên giữ `outName`.

## D03 · SUA — chấp nhận, đã sửa ở v2

- Trường mới **`choTuLieu`** trên `C1-01b` (thuyền nhỏ thế kỷ 16), `C1-01c` (bản đồ trống không chữ), `C1-03b` (địa cầu
  thời kỳ) — ghi thiếu gì. `review_shots.py` gắn nhãn **⏳ chờ tư liệu** ở bảng tổng và từng shot. `_doc` ghi không chạy các
  shot đó.
- Mục 3 thêm giới hạn cứng **Tư liệu đối chiếu**.
- Mục 5a: bản đồ **bắt buộc** có bản đồ trống tư liệu (bờ biển, vị trí đảo, ranh giới đúng vai trò) trước khi chạy; cách
  sinh khi có tư liệu là chip `@`, và ghi **tường minh** đây là mở rộng ngoại lệ ảnh thật của SPEC-v2 §6 (mục 7 + 8).

## D04 · HOI — trả lời, đã sửa ở v2

Ô ở dòng 8 định **tượng trưng cho Tây Ban Nha**, không tái hiện cờ hạm đội. Nhưng tôi không có nguồn nào xác nhận một
mẫu cờ duy nhất đại diện cho Tây Ban Nha trong vai đó năm 1588, và nguồn Codex dẫn chính là lý do để không khẳng định.

Đã sửa: mục 5b bỏ câu *"Tây Ban Nha năm 1588 thì là chữ thập Burgundy"*, thay bằng luật *"chỉ vẽ cờ khi có mẫu được tài
liệu xác nhận cho đúng vai trò; không có thì bỏ ô, ghi lý do"*. Dòng 8 bảng mục 6: **bỏ ô cờ Tây Ban Nha**. Cùng lý do,
`C1-09` bỏ *"square sails marked with a plain red cross"* → *"plain square sails"* (shot chưa sinh ảnh).

Tôi **chưa mở** nghiên cứu Chinchilla — kết luận "bỏ ô" không dựa vào nội dung chi tiết của nó, chỉ dựa vào việc chưa có
mẫu xác nhận.

## D05 · SUA — chấp nhận, đã sửa ở v2

Chọn hướng **Bắc Mỹ và Nam Mỹ nằm chính giữa mặt cầu, chỉ một mép châu Âu–châu Phi ở rìa phải**. Đồng bộ `draw`, `anhSeRa`,
`intent`, `canSoi`; `anhSeRaHash` cập nhật sau khi build lại. "Đọc ra trong một giây" đổi thành **mục tiêu cần kiểm khi
ra ảnh** ở cả `intent`, `canSoi` và mục 5c. `intent` ghi **VẬT TƯỢNG TRƯNG**, không phải hiện vật của chuyến đi.

## D06 · CHAN — tác giả phản bác một phần

**Đồng ý phần lõi:** phải có bộ lọc chất lượng, và bao rỗng, thân cây bóc vỏ đúng là lặp chức năng. v2 thêm **bộ lọc trùng
chức năng** (mục 4 bước 3: cùng cụm lời kể + cùng thông tin người xem đọc ra → giữ một). Bảng mục 6 theo bộ lọc đó bỏ bao
rỗng, thân cây, bãi cát trống, sách bìa trống, mây bão, đảo Azores, cận cảnh em bé. Cùng với D02, số ứng viên từ ~71 xuống
**~47 shot**.

**Không đồng ý với điều kiện đóng** *"xoá bỏ đề xuất gỡ điều kiện chặn, mọi phần tử mới BẮT BUỘC vượt qua điều kiện chặn
hiện hành của 4d"*. Lý do: **nguồn nói khác điều người review tưởng.**

1. Gemini viết yêu cầu của Tú *"có thể được đáp ứng bằng cách làm phong phú loại phần tử được phép vẽ (như cờ, bản đồ)"*.
   Nhưng loại phần tử chưa bao giờ thiếu: `kind: "symbol"` đã có sẵn trong SPEC-v2 §3. Thứ đã loại lá cờ là **chính điều
   kiện chặn**. `case-1.shots.json` → `_raSoatSkill4d.10_daBoTheoDieuKienChan` ghi nguyên văn: *"Co Anh cho 'second
   attempt' (lang C1-03 da ganh 'thuoc dia')"*. Giữ điều kiện đó bắt buộc thì ví dụ đầu tiên của Tú lại bị loại đúng như cũ.
2. Yêu cầu mở luồng là *"nhiều ảnh nhất có thể cho mỗi câu"* — câu hỏi của luồng không phải có nên tăng ảnh hay không.
   Codex r1 cũng coi yêu cầu trực tiếp của Tú là căn cứ mới.
3. Chỗ khác nhau giữa hai bộ lọc là câu hỏi. Điều kiện cũ hỏi *"cả bộ hình đã gánh thông tin này chưa?"* — câu hỏi đó
   luôn trả lời "rồi" cho cờ, bản đồ, địa cầu, vì làng và lời kể đã nói "thuộc địa", "North Carolina", "New World". Bộ lọc
   mới hỏi *"có shot nào cùng cụm, cùng thông tin không?"* — vẫn loại được đúng ba ví dụ Gemini nêu.

Gemini còn thấy chưa đủ thì đề nghị **đẩy lên Tú** ở vòng 3: đây là chuyện hướng đi Tú đã chọn, không phải chuyện sự thật.

**Ba ý khác trong phần thân review của Gemini (không có mã D):**
- *4c đi ngược*: đã xử lý ở D01 — sửa câu trùm 4c thành ngoại lệ tường minh.
- *Chip bản đồ vi phạm SPEC-v2 §6*: v2 ghi rõ đây là **mở rộng** §6, đưa vào mục 8.
- *`C1-01b` lách luật 2*: giữ, lý do ở mục 7 — SHOT-LIST tự ghi ngoại lệ cùng loại (`A1-13` xác trên mái nhà: vị trí là
  toàn bộ nội dung); Codex r1 chấp nhận.

## D07 · SUA — chấp nhận, đã sửa ở v2

Mục 5c thêm ba điều bắt buộc với vật tượng trưng: (1) không bao giờ sinh chung với người hay đặt trong cảnh có nhân vật;
(2) `intent` ghi **VẬT TƯỢNG TRƯNG** + cụm nó đứng cho; (3) `note` bắt buộc nhắc hậu kỳ tách vật khỏi cảnh có nhân vật
bằng khung hoặc nhãn minh hoạ. Mục 3 thêm dòng giới hạn cứng tương ứng. `C1-03b` đã theo cả ba.

Phần *"bắt buộc kết hợp chữ/kí hiệu hậu kỳ"*: skill bắt buộc **ghi yêu cầu đó vào `note`** để Tú thấy trong bản review;
dựng khung hay nhãn thế nào vẫn là quyết định dựng của Tú — skill prompt không điều khiển được bước đó.

## Câu hỏi reviewer đã trả lời — ghi nhận

- **Q1** (Codex): "na ná" chưa đủ để bác, nhưng đổi góc không tạo chức năng mới → đưa nguyên vào mục 4 bước 3.
- **Q2** (Codex): giữ `kind: "place"`; cả hai reviewer cùng thấy bản đồ tả chữ không đáng tin → chip bản đồ trống thành cách mặc định.
- **Q3**: mốc 1606 có nguồn; ranh giới bang hiện đại chấp nhận vì lời kể nói *"would later become"* (cả hai).
- **Q4** (Codex): "three full years" giữ là chữ hậu kỳ.
- **Q5** (Codex): không cần chờ luồng A1.

## Câu hỏi mới cho vòng 3

**Q6.** Tiêu chí "Dàn dựng" của D02 có áp cho **nét mặt** của nhân vật trong cảnh minh hoạ hành động đã nêu không? Nhiều
shot đã có vẫn gán cảm xúc lời kể không nói: `C1-06` *"a troubled look"* (đã sinh ảnh), `C1-15` *"eagerly"*, `C1-19`
*"a stunned look"*, `C1-27` *"a sorrowful face"*. Một người trong ảnh luôn phải có một nét mặt nào đó — nên luật cần nói
nét mặt trung tính là mặc định, hay chỉ cấm tâm trạng làm thành **nội dung chính** của ảnh (như "White bực bội")?

## Tôi đã không kiểm cái gì

- **Chưa sinh ảnh** cho shot nào trong luồng này; chưa biết Nano Banana vẽ nổi bản đồ chip, cờ hình học, địa cầu quay đúng hướng.
- **Chưa mở** nghiên cứu cờ Armada của Chinchilla (D04).
- **Chưa gom** bản đồ trống, ảnh thuyền nhỏ thế kỷ 16, ảnh địa cầu thời kỳ — ba shot đang `choTuLieu`.
- Con số ~47 là đếm tay trên bảng mục 6, chưa viết prompt cho 11 ứng viên ➕.
- Tiêu chí D02 mới rà trên bảng mục 6 và `C1-16`, `C1-18`; **chưa rà nét mặt** của 36 shot hiện có (xem Q6).

```points
D01 | đã sửa ở v2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:58 | SUA — Thay điều kiện chặn nhưng giữ các ngoại lệ đối nghịch và câu 4c cũ
D02 | đã sửa ở v2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:164 | CHAN — Một số ô thêm tâm trạng, hành động, hiện vật và dấu vết chưa được nguồn xác nhận
D03 | đã sửa ở v2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:104 | SUA — Chưa giữ rõ bước đối chiếu tư liệu cho thuyền, địa cầu và bản đồ
D04 | đã sửa ở v2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:124 | HOI — Chưa phân biệt biểu tượng Burgundy với cờ Armada cụ thể năm 1588
D05 | đã sửa ở v2 | narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json:162 | SUA — Tiêu chí châu Mỹ chính diện không khớp prompt đặt Đại Tây Dương ở giữa
D06 | tác giả phản bác — chờ gemini | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:28 | CHAN — Nguyên tắc phủ kín từng câu sinh ra hàng loạt chi tiết lặp chức năng
D07 | đã sửa ở v2 | coordination/drafts/img-skill-nhieu-anh-moi-cau.md:57 | SUA — Dùng vật thể lịch sử đại diện khái niệm dễ gây hiểu nhầm thành hiện vật có thật
```
