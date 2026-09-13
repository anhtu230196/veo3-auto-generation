# Đề xuất r1 (Claude)

**Artifact:** `coordination/drafts/img-skill-nhieu-anh-moi-cau.md` — bản nháp v1: mỗi câu lời kể tách thành **10 ô ảnh**, mỗi ô một shot.
**Ví dụ áp dụng:** `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json` — thêm đúng 4 ảnh Tú nêu (`C1-01b` thuyền cập bờ cát, `C1-01c` bản đồ North Carolina, `C1-03a` cờ Anh, `C1-03b` quả địa cầu cho *"in the New World"*), `C1-18` đổi sang sinh từ asset thuyền. Build sạch: **36 shot**, cue khớp. Bản đọc được có mục "Ảnh sẽ ra": `case-1.review.md` cùng thư mục. **Chưa sinh ảnh nào** cho 5 shot này.

## Chỗ tôi tự thấy yếu nhất — đọc trước

**W1. Luồng này đi NGƯỢC một điểm đã chốt.** Skill mục 4d có "Điều kiện chặn" (D01, Codex chốt ở luồng `img-skill-a1-lessons`). Lá cờ Anh là đúng thứ tôi đã **bỏ** ở case 1 theo điều kiện đó. Bản nháp đề xuất **thay** hẳn điều kiện chặn bằng "phủ kín từng câu, chỉ bỏ khi trùng ảnh". Tôi đọc yêu cầu *"nhiều ảnh nhất có thể cho mỗi câu"* là lệnh đổi hướng rõ ràng, nhưng người review nên soi xem còn chỗ nào của D01 đáng giữ.

**W2. Bản đồ tả bằng chữ có thể sai hình dạng.** Cùng lớp lỗi `A1-11`: khách sạn tả rất đúng mà ra toà nhà khác hẳn. Bờ biển North Carolina sai thì ai biết cũng nhận ra. Phương án dự phòng là chip `@` với bản đồ thật, nhưng như vậy là mở rộng ngoại lệ `refImages` của SPEC-v2 §6, và `refs/case-1/` chưa có bản đồ ranh giới nào.

**W3. Phủ kín dễ đẻ ảnh na ná nhau.** Bảng mục 6 có 35 ô ➕. Vài ô yếu, ví dụ *"He couldn't."* → *"White bực bội nhìn ra biển"*, hay mấy tư thế White đứng nhìn biển ở câu 21, 25, 27. Chúng lặp một nhân vật, một tư thế gần giống nhau. Mục 4 chỉ chặn **trùng hẳn**, không chặn **na ná**.

**W4. Hai mốc niên đại của cờ theo hiểu biết chung, chưa có nguồn tải về:** Anh năm 1587 dùng chữ thập St George; Union Jack có từ 1606; Tây Ban Nha năm 1588 dùng chữ thập Burgundy.

**W5. Chi phí chưa đo trần.** Khoảng 70 shot/case, ~75–97 giây/shot → ~1,5 giờ/case. Trần lượt tạo mỗi ngày của tài khoản PRO chưa đo.

## Đã quyết định gì và vì sao

1. **Artifact là bản nháp, chưa sửa skill** — skill đang được việc khác dùng; luật chép sau khi luồng chốt.
2. **Chỉ viết prompt cho đúng 4 ảnh Tú nêu.** 35 ô còn lại để ở dạng bảng, vì viết 35 prompt trước khi bảng 10 ô được chốt là đốt công khi luật còn đổi.
3. **Thay điều kiện chặn, không giữ song song.** Giữ cả hai thì mọi ô mới đều phải cãi nhau với D01, và chính ví dụ của Tú (cờ) sẽ lại bị chặn.
4. **Bản đồ và cờ do Nano Banana vẽ trơn, không chữ** — sửa dòng "Địa lý" của bảng 4c. Nhãn, mũi tên, chấm đỏ vẫn là hậu kỳ.
5. **Cờ tả bằng hình học, không gọi tên cờ** — *"the English flag"* dễ kéo về Union Jack, sai niên đại.
6. **Ranh giới bang hiện đại được phép ở `C1-01c`**, vì lời kể tự đặt khung hiện đại (*"would later become"*). Bản đồ minh hoạ sự kiện trong năm câu chuyện thì không.
7. **"Landed" → thuyền nhỏ cập bãi, không phải tàu lớn** — tàu lớn không lên được bãi cát; tàu đã có asset `C1-07`. Thuyền được tạo làm asset vì quay lại ở *"Not a single boat remained"* (`C1-18`).
8. ***"in the New World"* → quả địa cầu thế kỷ 16 quay về châu Mỹ.** Bản đồ Âu–Mỹ xếp sau vì trùng loại với bản đồ ngay câu trước.

## Câu hỏi muốn người review trả lời

**Q1 (quan trọng nhất).** Thay điều kiện chặn bằng "chỉ bỏ khi trùng ảnh" có đủ không, hay cần thêm một chặn cho ảnh **na ná** (W3)? Nếu có, chặn thế nào mà không quay lại đúng D01?

**Q2.** Bản đồ nên là `kind: "place"` tả bằng chữ (hiện tại), hay `kind: "map"` riêng + chip `@` với bản đồ thật (mở rộng `refImages` của SPEC-v2 §6)?

**Q3.** Mốc cờ ở W4 có đúng không? Và vẽ ranh giới bang hiện đại cho câu *"would later become North Carolina"* có vi phạm luật niên đại (skill 4d luật 4) không?

**Q4.** Ô 10 (con số, ngày tháng): *"three full years later"* có nên thành một ảnh (lịch, đồng hồ cát) không, hay giữ là chữ hậu kỳ?

**Q5.** Luồng `img-skill-a1-lessons` chưa `settled` (lượt Gemini r3 chưa chạy, D07 còn mở) mà luồng này sửa đúng đoạn "Điều kiện chặn" của nó. Có cần đóng luồng kia trước không?

## Cố ý chưa làm

- Chưa viết prompt cho 35 ô ➕ ở bảng mục 6.
- Chưa sửa skill, SPEC-v2, builder (kind `map` nếu Q2 chốt).
- Chưa gom bản đồ ranh giới North Carolina, ảnh thuyền nhỏ thế kỷ 16, ảnh cờ thời kỳ (skill `case-reference-images`).
- Chưa sinh ảnh cho 5 shot mới/đổi.

## Tôi đã không kiểm cái gì

- Mốc niên đại cờ (W4) — chưa dẫn nguồn.
- Hình dạng bờ biển North Carolina so với bản đồ thật — chưa có ảnh.
- Nano Banana có vẽ nổi bản đồ không chữ, cờ đúng hình học, địa cầu quay đúng hướng không — chưa sinh ảnh nào.
- Trần quota tài khoản PRO.

```points
```
