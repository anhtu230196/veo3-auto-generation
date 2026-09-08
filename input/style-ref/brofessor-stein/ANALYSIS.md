# Phong cách hình ảnh kênh Brofessor Stein — phân tích từ 2 video

Tư liệu: 2 video tải ngày 2026-09-08, cắt frame mỗi 10 giây.

| Video | ID | Dài | Số mục | Frame |
| --- | --- | --- | --- | --- |
| How History's Deadliest Warriors Died | `Cq1HTs36ics` | 21 phút | 23 | 129 |
| The Most Dangerous Cursed Artifacts | `DIKlWNm0sH8` | 20 phút | 15 | 119 |

Video `.mp4`, thư mục `frames/`, `sheets/` và `.info.json` đã cho vào `.gitignore`.
Phụ đề `.srt` (có mốc thời gian) thì giữ lại vì nhẹ và là tư liệu đối chiếu.

23 mục trong 21 phút ≈ **dưới 1 phút mỗi mục** — nhanh hơn nhiều so với format
hiện tại của kênh mình (5-6 case cho 16-25 phút, tức 3-4 phút mỗi case).

---

## Hệ thống hình ảnh — 8 luật cốt lõi

**1. KHÔNG có bối cảnh vẽ. Nền là một mảng phẳng.**
Video 1 dùng nền xanh da trời nhạt đồng nhất. Video 2 dùng nền giấy có vân, và
**đổi màu nền theo từng mục** (kem cho Hope Diamond, xám nhạt cho The Crying
Boy...) — màu nền chính là dấu phân đoạn. Bối cảnh vẽ đầy đủ (phòng ngai vàng,
cổng thành, túp lều) có xuất hiện nhưng hiếm, khoảng 1 trên 15 khung.

**2. Nhân vật là cutout thả lên nền, không có phối cảnh.**
Không có mặt đất, không có đường chân trời, không có đổ bóng. Người đứng lơ lửng
trên mảng màu. Nhiều nhân vật trong cùng khung thì xếp cạnh nhau theo chiều
ngang, không có xa-gần.

**3. Hai hạng nhân vật, phân biệt rõ.**
- **Người có tên thật** → chân dung vẽ riêng, dùng đi dùng lại suốt cả mục
  (Louis XIV, Harry Winston, Konrad Spindler, Shaka Zulu, Hongi Hika).
- **Người vô danh** → hình doodle viền trắng, **mặt để trống hoặc gần như trống**.
  Đám đông = một hàng 8-9 hình doodle y hệt nhau xếp ngang. Có lúc dùng người
  que màu đen đặc cho nhóm vô danh, nhưng là hình que đơn giản, không phải bóng
  đổ chi tiết.

**4. Một khung hình được DỰNG DẦN, không vẽ mới.**
Đây là điểm quan trọng nhất và dễ bỏ sót. Cùng một bố cục gốc xuất hiện liên tiếp
3-5 khung, mỗi khung chỉ **thêm một phần tử** theo đúng câu đang đọc. Ví dụ mục
The Crying Boy: nền xám + nhãn "SEPTEMBER 1985" → thêm tờ báo cáo → thêm số 50 →
thêm ngôi nhà cháy → thêm lính cứu hoả → thêm bóng thoại → thêm dấu X đỏ → thêm
"2.500 PRINTS". Bảy khung, một hình gốc.

**5. Chữ nằm thẳng trong khung.**
Tên nhân vật in hoa nhỏ phía trên đầu, năm và số liệu in đậm cỡ lớn
(`45 wounds`, `1827`, `IN 1958`, `300,000`, `63`), bóng thoại có lời viết tay.
Mỗi mục mở bằng một **thẻ tiêu đề**: đúng một biểu tượng lớn ở giữa nền trống,
tên viết hoa bên dưới (`BASANO VASE`, `BLACK ORLOV`).

**6. Biểu tượng thay cho cảnh.**
Đầu lâu xương chéo = chết. Cúp = thắng. Hai thanh kiếm bắt chéo = đánh nhau.
Virus = dịch bệnh. Dấu X đỏ = thất bại/phủ định. Mũi tên đỏ = hướng đi. Cờ, bản
đồ, ký hiệu tiền. Chiến thuật "sừng trâu" của Shaka Zulu được vẽ thành **sơ đồ
mũi tên xanh lá**, không phải cảnh chiến trận.

**7. Ảnh thật và tranh gốc được thả thẳng vào khung.**
Ảnh chụp chiếc ghế thật, bảo tàng Smithsonian, bức tranh The Crying Boy gốc,
tranh khắc gỗ Nhật, cờ Māori, ảnh chân dung người Zulu. Họ **không vẽ lại** —
đặt luôn ảnh tư liệu cạnh hình vẽ, hai chất liệu đứng chung khung thoải mái.

**8. Huy hiệu góc phải trên.**
Một biểu tượng tròn nhỏ ở góc, đổi theo từng mục — chân dung nhân vật đang kể
hoặc biểu tượng cổ vật đang kể. Đóng vai trò "đang nói về ai" xuyên suốt.

---

## Hai mức độ trau chuốt

Hai video KHÔNG cùng một mức, dù cùng hệ thống:

- **Video chiến binh**: nhân vật vẽ đủ màu, có trang phục giáp trụ chi tiết, nét
  gọn. Gần với style hiện tại của kênh mình hơn.
- **Video cổ vật**: người doodle thô, mặt trống, nét run tay, gần whiteboard
  animation. Rẻ và nhanh hơn hẳn.

Nếu đi theo hướng này thì phải chọn mức, vì chi phí sản xuất chênh nhau nhiều.

---

## Đối chiếu với pipeline hiện tại

| | Pipeline hiện tại | Brofessor Stein |
| --- | --- | --- |
| Nền | Background asset vẽ đủ cho từng địa điểm | một mảng màu phẳng, đổi màu theo mục |
| Cảnh | ghép Character + Background thành cảnh có không gian thật | cutout thả lên nền, không phối cảnh |
| Quần chúng | phải có asset riêng, hoặc bóng đen đặc | doodle trắng vô danh mặt trống, hoặc người que đen |
| Chữ trong hình | **CẤM TUYỆT ĐỐI** (skill ảnh mục 6i) | chữ ở khắp nơi |
| Ảnh tư liệu thật | chỉ dùng làm reference để VẼ LẠI | thả thẳng ảnh thật vào khung |
| Một cảnh = | một hình hoàn chỉnh, sinh một lần | một hình gốc + phần tử thêm dần |
| Nhịp | ~1 hình cho vài chục giây kể | thêm/đổi phần tử vài giây một lần |

---

## Ý nghĩa thực tế nếu đổi theo hướng này

**Phần lớn công việc RỜI KHỎI Nano Banana và chuyển sang khâu dựng phim.**

- Luật "mọi thứ có chữ đều để trống" (mục 6i) **không cần bỏ**. Chữ của
  Brofessor Stein phải làm bằng overlay trong phần mềm dựng, không phải sinh
  bằng AI — Nano Banana viết chữ vẫn sai. Giữ nguyên luật cũ, thêm khâu overlay.
- "Dựng dần" (luật 4) cũng là việc của khâu dựng, không phải của Nano Banana.
  Sinh **một** hình gốc rồi cho các phần tử bay vào theo timeline.
- Cái Nano Banana cần sinh sẽ đổi từ "cảnh hoàn chỉnh" sang **"cutout nền trong
  suốt"**: từng nhân vật, từng đồ vật, từng biểu tượng, mỗi thứ một file rời.
- Background asset gần như biến mất — thay bằng một mảng màu đặt trong phần mềm
  dựng. Đây là chỗ tiết kiệm quota lớn nhất.

**Cái sẽ mất**: những cảnh dựng công phu mà pipeline hiện tại làm tốt — chênh
cao cầu thang, nhân vật tác động lên vật thể, bố cục có chiều sâu. Style này
không có chỗ cho chúng.

**Cái sẽ được**: rẻ hơn nhiều, nhanh hơn nhiều, và asset dùng lại được vô hạn
(một chân dung dùng cho cả mục thay vì vẽ lại mỗi cảnh).

---

## Chưa quyết

1. Chọn mức trau chuốt nào — kiểu video chiến binh hay kiểu video cổ vật?
2. Có thật sự bỏ background vẽ không, hay giữ lại cho vài cảnh trọng điểm?
3. Toàn bộ asset đã vẽ theo style cũ (case 1 Roanoke 4/17, 5 case tập tâm linh)
   sẽ bỏ hay giữ?
4. Khâu dựng phim hiện đang làm bằng gì? Luật 4 và 5 phụ thuộc hoàn toàn vào
   việc công cụ dựng có làm được overlay theo timeline hay không.
