# Đề xuất r1 (Claude)

**Artifact:** `coordination/drafts/img-skill-a1-lessons.md` — bản nháp 8 luật mới + 1 nguyên lý chung
cho skill `nano-banana-image-prompts`.
**Ví dụ áp dụng:** `image-prompts/A1.shots.json` (19 → 30 shot). Build sạch, cue khớp nguyên văn,
mốc suy từ VTT, thứ tự phụ thuộc asset đã kiểm bằng script.
**Tư liệu mới:** `image-prompts/refs/A1/` ảnh 10–15, manifest đã ghi đủ `shows`/`evidenceFor`/`stillMissing`.

## Chỗ tôi tự thấy yếu nhất — đọc trước

**W1. Chuỗi 3 tư thế của Luciano (luật 8 phần 3) CHƯA ĐO, và có bằng chứng ngược.** Hôm qua đo được:
ảnh sinh từ asset **giữ được mặt** nhưng **khung hình đổi** giữa hai lần sinh (asset nửa thân →
ảnh toàn thân, `output/reuse-compare.png`). Viết phần khung hình giống hệt nhau trong ba câu
(`A1-18c/d/e`) **không bảo đảm** ra ba khung giống nhau. Nếu khung nhảy, ba ảnh không cắt nối thành
chuyển động được, và luật 8.3 là luật sai. Đây là luật dễ sai nhất trong bản nháp.

**W2. Người/vật MỚI trong câu mention không có ảnh neo phong cách nào.** Shot mention mang cờ
`noAnchors` (quyết từ hôm qua: ảnh không được gọi tên trong câu là ảnh không rõ vai). Hệ quả tôi mới
thấy hôm nay: cảnh sát ở `A1-07a`, lò sưởi ở `A1-15`, hai bạn tù ở `A1-18b` **chỉ nhận phong cách
gián tiếp** qua chip của asset kia. Trong khi chính cách Tú prompt là **gọi tên ảnh neo trong câu**:
*"with the same style as @01-pyramid-place.png"*. Tôi chưa sửa — xem Q3.

**W3. Ranh giới của luật 2 và luật 3 còn mờ, và nó quyết định số shot.** A1 tăng từ 19 lên 30 shot
(+58%). Nếu áp y nguyên cho mọi segment thì mẻ ảnh dài gấp rưỡi và tốn quota gấp rưỡi. Tôi đã viết
mục "Không áp khi" cho từng luật, nhưng chưa thử trên một segment khác.

**W4. Ba mệnh đề lịch sử đỡ luật 4 và shot A1-09b/c là từ hiểu biết chung, không có nguồn tải về
trong lượt này:** gia đình năm 1940 mang tên Mangano; Anastasia làm trùm từ 1951; tên Gambino có từ
1957; Reles chết trước khi kịp làm chứng chống Anastasia. Nếu sai thì luật 4 mất ví dụ và `A1-09b`
có thể đang giữ trung tính một cách không cần thiết.

**W5. Quần áo tù của Luciano là tự tả.** Ba ảnh tư liệu đều là ảnh căn cước mặc vest. Đã ghi
`stillMissing`.

## Đã quyết định gì và vì sao

1. **Artifact là bản nháp, không sửa skill.** Skill đang được các việc khác dùng; sửa trước review là
   đúng thứ lớp phối hợp này chặn. Mục 11 bản nháp ghi rõ sẽ chép vào đâu khi `settled`.
2. **Một nguyên lý chung (§0) thay vì 8 luật rời.** Cả 8 góp ý không cái nào chê nét vẽ; cả 8 đều nói
   **thiếu phần tử để dựng**. Tú dựng bằng chồng lớp ở hậu kỳ, trong khi skill vẫn nghĩ theo một khung
   hình hoàn chỉnh cho mỗi câu. Tám luật là tám hệ quả của câu đó — và mỗi luật có mục **"Không áp
   khi"** để chặn tổng quát hoá quá đà.
3. **Gambino (góp ý 0:28):** đã tra. **Có ảnh, nhưng sai thời kỳ** — ảnh FBI 1979–1981, sơ đồ 1963.
   Tên đó chưa tồn tại năm 1940. Tạo `group` theo trang phục 1940 (`A1-09c`), ghi lý do vào manifest
   khoá `gambinoName`, và tổng quát thành luật 4.
4. **Anastasia (góp ý 0:26):** dùng ảnh căn cước **1936**, bỏ ảnh 1950s nổi tiếng hơn — lúc đó ông đã
   già, hói, béo; câu chuyện là năm 1940. Chân dung **trung tính** vì lời kể ghi *"was said to bring
   down"* (review Codex điểm 4).
5. **A1-04b là người vô danh, không phải Reles.** Cái tai trong câu *"Driven through the ear"* là tai
   nạn nhân. Vẽ Reles vào là đổi nghĩa.
6. **`A1-07a` và `A1-18b` khai `group`, không phải `character`.** Luật `character` nối câu *"Only one
   person in the image"* — mâu thuẫn trực tiếp với cảnh áp giải và cảnh có người nghe.
7. **Chuỗi tư thế `A1-18c/d/e` sinh từ ASSET Luciano, không từ cảnh nhóm `A1-18b`.** Tách để mỗi khung
   là một người, hậu kỳ cắt xen vào cảnh nhóm được. Đổi lại là rủi ro W1.
8. **Vá builder (§9a bản nháp):** shot mention giờ nhận phần theo `kind`. Không vá thì người mới trong
   câu mention ra mặt vẽ chì tả thực — đúng lỗi đã thấy ở `A1-06` mẻ đầu.
9. **Sửa câu mặt đơn giản (§9c):** bản cũ khoá miệng thành *"a single line"* — chỏi thẳng với
   *"laughing with his mouth open"* ở `A1-18c`. Tú chỉ chốt miệng **đơn giản**; chữ "một nét" là tôi
   thêm. Bài học tổng quát: khối style theo `kind` tả **hình thức**, không được tả **trạng thái**.

## Câu hỏi muốn người review trả lời

**Q1 (quan trọng nhất).** Chuỗi tư thế: sinh từ **asset nhân vật** (hiện tại) hay từ **ảnh cảnh đầu
tiên** của chuỗi? Skill §6b nói *"biến thể của cùng một bối cảnh → dùng `editFrom`, đừng sinh mới từ
chữ"* — nghiêng về sinh từ ảnh cảnh. Nhưng ảnh cảnh `A1-18b` có ba người, sinh từ nó dễ kéo cả hai
bạn tù sang. Có lập luận hay bằng chứng nào quyết được, hay phải đo?

**Q2.** Luật 2 — trạng thái nào đáng một cảnh nhân vật riêng? Tôi đề xuất phép thử: *"bỏ cảnh này đi
thì người xem có còn biết nhân vật đã chuyển trạng thái không?"*. Phép thử đó có đủ chặt không?

**Q3.** Shot mention có nên **gọi tên ảnh neo phong cách trong câu** (đúng cách Tú prompt) thay vì
`noAnchors`? Nếu có: gọi ảnh neo theo `kind` của shot, hay theo loại của phần tử MỚI được đưa vào
(cảnh sát → ảnh neo người, lò sưởi → ảnh neo vật)?

**Q4.** Áp luật 3 thử lên `image-prompts/A2.shots.json`: tên nào trong A2 thành asset? Tôi đọc là chỉ
Popeye (tên + hành động), còn *"police, judges, journalists, politicians"* và *"César Gaviria"*
không (Gaviria được nhắc là **mục tiêu vắng mặt**). Ngưỡng *"được gọi tên VÀ lời kể nói họ làm gì"*
có đúng không, hay Gaviria cũng phải có?

## Cố ý chưa làm

- **Chưa sửa skill** (cả `.claude/` lẫn `.agents/`) — sau khi `settled`.
- **Chưa sinh ảnh nào cho 11 shot mới.** Q1 và Q3 có thể đổi prompt; đốt quota trước khi chốt là phí.
  Riêng W1 thì cuối cùng **phải đo** mới biết — đề nghị đo 3 khung Luciano trước, sau khi luồng chốt.
- **Chưa áp các luật lên A2** — segment khác, sau khi chốt.
- Chưa tra ảnh `Mangano crime family 1940`; chưa tải lại ảnh căn cước Carlo Gambino và sơ đồ 1963
  (Wikimedia trả trang lỗi hai lần liền do bị bóp tốc độ — file hỏng đã xoá, không ghi vào `images`);
  chưa tra quần áo tù bang New York 1936–1946.
- **Không động vào hai luồng A1 cũ** đang `blocked`/`open` (`img-a1-newstyle` D11–D14,
  `img-a1-anchor` D15–D16). Artifact của chúng là `A1.newstyle.shots.json` của Gemini, đã bị
  `A1.shots.json` thay thế. Đề nghị Tú đóng hai luồng đó thay vì tranh luận tiếp trên file cũ.

## Tôi đã không kiểm cái gì

- **Không có ảnh sinh ra nào kiểm chứng 8 luật mới.** Mọi luật suy từ góp ý của Tú, không từ ảnh đã đo
  — trừ các phần dẫn số đo hôm qua (sinh từ asset giữ mặt, cho tỷ lệ 5,8 đầu).
- **Chưa chạy thật `typeMentionPrompt` với 2 chip + đuôi dài** (`A1-15b`). Lớp đọc-lại-prompt bắt được
  lỗi mất chữ, nhưng mới được thử trên prompt 1–2 chip ngắn.
- **Bốn mệnh đề lịch sử ở W4** chưa đối chiếu nguồn trong lượt này.
- **Phía sẹo của Luciano** tôi đọc là má phải từ ảnh 15. Ảnh căn cước không bị lật, nhưng một bản sao
  trên Commons có thể đã bị lật — chưa đối chiếu với nguồn độc lập thứ hai.
- Không review phong cách nét vẽ (ngoài phạm vi luồng).

```points
```
