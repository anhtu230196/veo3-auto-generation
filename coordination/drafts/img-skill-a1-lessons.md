# Bản nháp: luật mới cho skill `nano-banana-image-prompts`, rút từ 8 góp ý của Tú trên case A1

**Trạng thái:** bản nháp **v3**, đang qua luồng `img-skill-a1-lessons`. v2 sửa theo 5 điểm D01–D05 của Codex ở vòng 1; v3 chốt tiêu chí chọn ảnh neo cho câu mention theo D06 của Gemini ở vòng 2 (xem `r2-00-response-claude.md`). **Chưa** chép vào skill —
skill là thứ các việc khác đang dùng, sửa trước khi review là đúng cái lớp phối hợp này sinh
ra để chặn. Khi luồng `settled`, các mục dưới đây chép vào `.claude/skills/nano-banana-image-prompts/SKILL.md`
tại vị trí ghi ở cuối file, rồi đồng bộ sang `.agents/`.

**Bằng chứng:** 8 góp ý của Tú ngày 2026-09-13 trên bộ ảnh A1 đã chạy (`output/a1-full/`,
project `reles-a1-final`). **Ví dụ áp dụng:** `image-prompts/A1.shots.json` — mỗi luật dưới đây
chỉ ra shot nào trong đó là minh hoạ.

---

## 0. Nguyên lý chung — vì sao cả 8 góp ý cùng một hướng

Đọc liền 8 góp ý thì thấy **không cái nào chê nét vẽ hay chê một ảnh xấu**. Cả 8 đều nói cùng một
việc: **thiếu phần tử để dựng**.

- thiếu người để đặt vật lên (A1-04)
- thiếu trạng thái nối giữa hai cảnh (bị bắt, đu dây)
- thiếu vật ở trạng thái gốc để kéo mũi tên (tấm ga)
- thiếu chỗ nối giữa hai vật (dây buộc vào lò sưởi)
- thiếu người đang nói điều mà lời kể nói (Luciano khoe)
- thiếu nhân vật có thật được nhắc tên (Anastasia)

Tú dựng video bằng **chồng lớp phần tử rời ở hậu kỳ**. Skill hiện tại vẫn nghĩ theo **một khung hình
hoàn chỉnh cho mỗi câu** (mục 4 "PHÂN SHOT" và mục 8 "cảnh ghép" đều giả định vậy).

👉 **Luật gốc:** mỗi đoạn lời kể sinh ra một **bộ phần tử + các trạng thái nối**, không phải một
bức tranh. Trước khi viết prompt, hỏi: *hậu kỳ cần những mảnh nào để dựng được đoạn này, kể cả
những mảnh lời kể không nói ra?*

Tám luật dưới là tám hệ quả cụ thể của câu đó.

🔴 **Điều kiện chặn chung cho mọi luật thêm phần tử (1, 2, 3, 7, 8)** — thêm từ D01: chỉ thêm một phần tử khi nó mang **thông tin hoặc thao tác dựng mà bộ phần tử HIỆN CÓ chưa đảm nhiệm**. Xét **lời kể cùng bộ hình đang có**, không xét từng ảnh riêng lẻ. Góp ý cụ thể của Tú trên A1 là yêu cầu của Tú; phần tổng quát hoá dưới đây thì phải qua được điều kiện này. Không có nó thì A1 tăng 19 → 30 shot sẽ lặp lại ở mọi segment mà không ai hỏi có cần không.

---

## 1. VẬT TÁC ĐỘNG LÊN CƠ THỂ → TẠO NGƯỜI RIÊNG, VẬT RIÊNG

**Góp ý:** A1-04 — *"nên tạo thêm một người nữa để ở hậu kỳ tôi sẽ để cái dùi đá kế bên tai của người này"*.

**Luật:** khi lời kể nói một vật tác động lên **một bộ phận cơ thể** (đâm vào tai, đeo vào cổ, kề
vào thái dương), **và hậu kỳ cần đặt, dời hoặc làm chuyển động vật đó**, thì tạo **hai ảnh rời**: người **để lộ rõ đúng bộ phận đó**, và vật. Đây **không phải** lệnh cấm mọi ảnh vật chạm người (D01) — hậu kỳ không cần tách thì một ảnh là đủ.

**Vì sao:** vật chạm người trong một ảnh là thứ hậu kỳ không tách ra được, không đổi được góc,
không làm chuyển động được. Và với vật gây thương tích thì ảnh chạm vào cơ thể đi thẳng vào vùng
máu me — ảnh rời thì người chỉ là một chân dung nghiêng bình thường.

**Viết thế nào:**
- Góc chụp chọn **theo bộ phận**: tai → nhìn nghiêng hẳn; thái dương → ba phần tư; cổ tay → thấy
  mặt trong.
- Câu cấm tường minh: *"no weapon, no object touching him, no wound, no blood"*.
- Người đó là **ai trong lời kể** thì phải chọn đúng: ở A1 cái tai là của **nạn nhân**, không phải
  của Reles. Vẽ Reles vào đó là đổi nghĩa câu.

**Ví dụ:** `A1-04b` (người vô danh nghiêng, lộ tai) đi cặp với `A1-03` (dùi đá).

**Không áp khi:** hai thứ **dính liền về nghĩa** — tay đang cầm vật (người cầm dùi đá thì sinh
chung được, cầm là tư thế), quần áo đang mặc.

---

## 2. NHÂN VẬT ĐỔI TRẠNG THÁI → PHẢI CÓ CẢNH NHÂN VẬT ĐANG Ở TRẠNG THÁI ĐÓ

**Góp ý:** A1-07 thêm — *"nhân vật bị còng tay và bị áp giải bởi nhân vật cảnh sát"*.

**Luật:** lời kể nói nhân vật **chuyển trạng thái** — bị bắt, bị kết án, ra tù, bỏ trốn, chết — thì
phải có một ảnh **chính nhân vật đó** ở trạng thái mới. Vật tượng trưng (ghế điện, khoá tay nằm
trên bàn) **không thay được**, chỉ đi kèm.

**Vì sao:** bộ A1 đầu có ghế điện cho câu *"Arrested in 1940 and facing the electric chair"* nhưng
không có Reles bị bắt. Người xem thấy cái ghế, không thấy **ai** ngồi vào nó — mạch nhân vật đứt
đúng ở bước ngoặt.

**Viết thế nào:** sinh **từ asset nhân vật** bằng chip `@` (RUNBOOK mục 0: đó là cách duy nhất đo được
là giữ mặt và cho tỷ lệ đúng). Người phụ trong cảnh (cảnh sát áp giải) mô tả bằng chữ trong cùng câu.

**Ví dụ:** `A1-07a` — Reles bị còng, cảnh sát áp giải; đứng **trước** `A1-07` (ghế điện) vì mốc VTT
là 0:19 so với 0:20.

**Không áp khi:** qua điều kiện chặn chung ở §0. Phép thử (sửa theo D01): *đọc lời kể **cùng bộ hình hiện có** — người xem đã biết nhân vật chuyển trạng thái chưa?* Biết rồi (có cảnh khác nói lên điều đó) thì không thêm. Ở A1, trước khi thêm `A1-07a`, bộ hình có ghế điện nhưng không có ai bị bắt — người xem không biết Reles đã bị bắt, nên thêm.

---

## 3. NGƯỜI CÓ THẬT ĐƯỢC NHẮC TÊN → CẦN ASSET, KỂ CẢ CHỈ MỘT CÂU

**Góp ý:** 0:26 thêm — *"prompt nhân vật Albert Anastasia"*.

**Luật:** người có thật được **gọi tên** trong lời kể **và** lời kể nói họ làm gì / bị gì thì cần
một asset `character` riêng, dù chỉ xuất hiện một lần. Gom ảnh tư liệu **trước** (skill
`case-reference-images`).

**Vì sao:** bộ A1 đầu bỏ qua Anastasia vì "chỉ là một cái tên trong câu". Nhưng câu đó là **hệ quả
lớn nhất** của lời khai — bỏ mặt người thì câu chỉ còn là chữ.

**Viết thế nào:**
- Chọn ảnh tư liệu **đúng tuổi của thời điểm câu chuyện**, không lấy ảnh nổi tiếng nhất. Ca A1:
  Anastasia có ảnh 1950s nổi tiếng hơn nhưng lúc đó ông đã già, hói, béo — câu chuyện là năm 1940.
  Dùng ảnh căn cước **1936**.
- Chỉ lấy **nét nhận ra được** vào mô tả (SPEC-v2 §4a): Anastasia là mũi to sống cao + lông mày
  rậm; Luciano là mí mắt phải sụp + sẹo má phải.
- **Giữ mức chắc chắn của lời kể** (review Codex điểm 4): câu ghi *"was said to bring down"*, và thực
  tế Reles chết trước khi kịp làm chứng. Nên vẽ **chân dung trung tính**, **không** vẽ Anastasia bị
  bắt hay ngồi toà.

**Ví dụ:** `A1-09b` (Anastasia), `A1-18a` (Luciano).

**Không áp khi:** qua điều kiện chặn chung ở §0.

**Ví dụ tên bị bỏ qua theo cùng tiêu chí** (thêm từ D01): *César Gaviria* ở A2 được gọi tên và là mục tiêu ám sát — thoả vế *"bị gì"*. Nhưng thông tin lời kể cần ở câu đó là *"mục tiêu không có trên máy bay"*, và ghế trống `A2-08` đã đảm nhiệm; lời kể không quay lại ông ta. Nên **không bắt buộc** asset. Đây là phán đoán theo tiêu chí, không phải kết quả đo. (Ví dụ cũ *"police, judges, journalists"* không kiểm được ranh giới này vì đó không phải tên riêng — Codex chỉ ra.)

---

## 4. TÊN TỔ CHỨC TRONG LỜI KỂ → KIỂM NIÊN ĐẠI CỦA CHÍNH CÁI TÊN

**Góp ý:** 0:28 thêm — *"tìm kiếm ảnh tài liệu cho Gambino family, nếu không có thì tạo prompt"*.

**Kết quả tra:** có ảnh — nhưng **sai thời kỳ**. Các ảnh tìm được trong **4 truy vấn Commons đã chạy** (không phải kiểm kê toàn kho — D02) là ảnh FBI
1979–1981, sơ đồ tổ chức 1963, ảnh căn cước 1993–2004. Khoảng trống đã biết: chưa tra `Mangano crime family 1940`. Vì **năm 1940 chưa có cái tên đó**: lúc ấy
là gia đình **Mangano**; Anastasia lên trùm 1951, tên Gambino có từ 1957. Chữ *"the future boss"*
trong lời kể đã ngầm thừa nhận.

**Mốc niên đại — đã kiểm nguồn ở vòng 2:**

| Mốc | Nguồn |
| --- | --- |
| Vincent Mangano cầm đầu tới 1951 | Britannica, *Gambino crime family* |
| Anastasia nắm quyền từ 1951 | Britannica; The Mob Museum, *Carlo Gambino* |
| Tên Gambino từ 1957, khi Carlo Gambino nắm quyền | như trên |
| Reles có lịch làm chứng chống Anastasia **sáng 12-11-1941**; cái chết chặn vụ truy tố | Wikipedia, *Abe Reles*; The Mob Museum |

Mốc cuối cho thấy câu transcript 0:27 *"was said to bring down Albert Anastasia"* **ngược với sự thật** — lời khai không hạ được Anastasia, cái chết của Reles cứu ông ta. Không sửa lời kể (việc của Tú), nhưng là thêm một lý do để chân dung `A1-09b` giữ trung tính.

**Luật:** lời kể gọi một tổ chức, quốc gia, thành phố hay đơn vị bằng **tên của thời kỳ khác** thì
kiểm tên đó có từ bao giờ **trước khi** lấy ảnh tư liệu mang tên đó làm căn cứ. Ảnh đúng tên mà sai
thời kỳ **nguy hiểm hơn** không có ảnh — nó trông như bằng chứng.

**Viết thế nào** (sửa theo D02): không có ảnh đúng thời kỳ → **chọn hình theo loại chủ thể và thông tin cần diễn đạt**, không mặc định một loại:

| Chủ thể mang tên sai thời kỳ | Hình thay thế |
| --- | --- |
| tổ chức của người (gia đình mafia, băng nhóm) | `group` theo trang phục năm câu chuyện — cách của ca A1 |
| thành phố, công trình | `place` theo ảnh tư liệu **đúng năm**, không theo tên |
| đơn vị, cơ quan | `figure` (người của đơn vị) hoặc `symbol` trơn không chữ |

Ghi vào manifest tên đúng thời kỳ và lý do.

**Ví dụ:** `A1-09c`; manifest khoá `gambinoName`.

**Không áp khi:** tên không đổi qua thời gian. Đừng biến luật này thành "tra lịch sử mọi danh từ".

---

## 5. VẬT BỊ BIẾN THÀNH VẬT KHÁC → TẠO CẢ TRẠNG THÁI GỐC

**Góp ý:** 0:49 thêm — *"hình tấm ga trải giường (để tôi hậu kỳ thêm mũi tên sang cho A1-14)"*.

**Luật:** lời kể nói vật A được **làm thành** vật B (ga → dây, gỗ → bè, thư → mảnh xé) thì tạo **cả
A nguyên trạng lẫn B**, hai ảnh rời, **giữ những thuộc tính không đổi trong quá trình biến đổi** (D03 — một biến đổi có thể đổi màu; ga → dây thì giữ chất vải và màu, gỗ → than thì không). Hậu kỳ nối bằng mũi tên.

**Vì sao:** chỉ có B thì người xem không thấy **đã có sự biến đổi** — mà sự biến đổi đó chính là điều
câu nói. ⚠️ Bản v1 viết thêm *"tả B mà không có A làm neo thì model trôi về vật quen hơn"*. **Câu đó không có căn cứ** (D03): RUNBOOK chỉ ghi lỗi *"rope"* lấn *"bed sheets"* và cách đã sửa được là **tả trạng thái của vải** (phẳng, rộng giữa các nút) — không chứng minh lỗi xảy ra vì thiếu ảnh A.

**Viết thế nào:**
- ✅ **Có căn cứ:** tả **trạng thái của vật liệu** ở cả A lẫn B (cách đã sửa được lỗi dây bện).
- 🧪 **Chưa đo:** sinh B **từ A** bằng chip `@` để giữ chất liệu. Có thể tốt hơn, nhưng chưa có ảnh nào chứng minh — không đưa vào skill như luật.

**Ví dụ:** `A1-14a` (tấm ga gấp) → `A1-14` (dây ga nối nút). Hai ảnh **sinh độc lập**, cùng mô tả chất vải — đúng như JSON hiện tại (v1 ghi nhầm là B sinh từ A).

**Không áp khi:** B là vật quen thuộc tự đứng được và lời kể không nhấn vào việc chế tạo.

---

## 6. HAI VẬT TƯƠNG TÁC → ẢNH PHẢI CÓ CHỖ NỐI, SINH TỪ ASSET VẬT TRƯỚC

**Góp ý:** A1-15 — *"có sợi dây ở A1-14 buộc vào lò sưởi"*.

**Luật:** lời kể nói hai vật **gắn vào nhau** (buộc vào, cắm vào, treo lên, xích vào) thì ảnh phải
thể hiện **đúng chỗ nối** — và vật đã có asset thì sinh từ asset đó, không tả lại.

**Vì sao:** A1-15 cũ là một cái lò sưởi trơ trọi. Câu *"tied one end to a radiator"* nói về **cái nút
buộc**, không nói về lò sưởi.

**Quan hệ với luật cũ:** SHOT-LIST luật 2 và SPEC-v2 §3 **cấm định vị tương đối giữa hai vật rời**.
Luật này **không** mở lại cái cấm đó. Phân biệt:

| Cấm (luật cũ giữ nguyên) | Được (luật mới) |
| --- | --- |
| hai vật **rời** đặt cạnh nhau: *"a pistol next to a hat"* | hai vật **đã nối thành một**: *"the rope tied around the radiator pipe"* |
| bố cục phụ thuộc khoảng cách giữa hai thứ | cái nút buộc là **chủ thể** của ảnh |

Đây đúng là ranh giới hẹp tôi đã đặt khi thẩm điểm 3 trong review của Codex: một ảnh = một chủ thể
đang ở một trạng thái.

**Ví dụ:** `A1-15` giờ là `@Knotted Bed Sheet Rope` buộc vào lò sưởi.

---

## 7. ĐỪNG NHẢY CÓC TỪ NGUYÊN NHÂN SANG KẾT QUẢ

**Góp ý:** giữa A1-15 và A1-16 — *"phải thêm hành động của nhân vật đu trên sợi dây A1-14"*.

**Luật:** lời kể đi **nguyên nhân → kết quả** mà bỏ qua hành động ở giữa (*buộc dây → … → rơi*) thì
**thêm ảnh hành động nối**, dù lời kể không có câu riêng cho nó. Ở đây lời kể nói *"trying to
escape"* — một cụm tóm tắt, không phải một cảnh.

**Vì sao:** bộ A1 đầu đi thẳng từ cái lò sưởi sang người đang rơi. Người xem không thấy hắn **đã leo
ra ngoài** — mà việc leo ra ngoài bằng dây ga mới là điều giả thuyết chính thức khẳng định, và là
điều câu *"his body was found 20 feet away"* **đặt nghi vấn** (D04 — transcript đặt chi tiết đó sau chữ *"but"*; đó là nghi vấn, không phải kết luận loại trừ).

**Cách tìm chỗ nhảy cóc:** đọc liền hai shot kề nhau, hỏi *"nhân vật đã làm gì để đi từ ảnh trước sang
ảnh sau?"*. Trả lời được bằng một động từ mà không có ảnh nào cho động từ đó → **có thể** thiếu shot.

🔴 **Giới hạn bằng chứng (thêm từ D04, bắt buộc):** chỉ bổ sung hành động **được nguồn xác nhận**, hoặc **nằm trong một giả thuyết / lời khai mà lời kể đã nêu rõ**. **Không** lấp một khoảng trống thật sự chưa biết. Với chuyện mất tích hay án chưa giải, chính khoảng trống đó thường là điều câu chuyện muốn giữ — vẽ nó ra là bịa.

Ca A1 qua được giới hạn nhờ chính lời kể: *"**Officially**, he had knotted bed sheets…"* — việc leo ra bằng dây là **giả thuyết chính thức đã được nêu**. Ảnh `A1-15b` vì thế là ảnh minh hoạ giả thuyết, hậu kỳ dùng kèm ngữ cảnh đó.

**Viết thế nào:** hai chip trong một câu — nhân vật và vật:
*"draw the same man as in @Reles… climbing down @Knotted Bed Sheet Rope…"*

**Ví dụ:** `A1-15b`.

---

## 8. HÀNH VI NÓI (khoe, khai, thú nhận, đe doạ) → VẼ NGƯỜI ĐANG NÓI, CÓ NGƯỜI NGHE, VÀ NHIỀU TƯ THẾ

**Góp ý:** A1-18 — *"Lucky Luciano ngồi trên giường trong nhà tù nói chuyện với các tù nhân khác như
đang khoe khoang (có thể thêm 3-4 shot nhân vật Lucky Luciano chuyển động cho hấp dẫn)"*.

**Luật, ba phần:**

1. Lời kể thuật lại **một người đã nói gì** thì ảnh là **người đó đang nói**, không phải vật được nói
   tới. A1-18 cũ là bó tiền — nó minh hoạ *"$50,000"* nhưng mất hẳn *"boasted"*.
2. Động từ nói có hàm ý **người nghe** (*boasted to*, *confessed to*, *told*) thì vẽ người nghe. Khoe
   mà không ai nghe thì không còn là khoe.
3. 🧪 **TUỲ CHỌN, THỬ NGHIỆM** (D01 + D05): cảnh nói dễ đứng yên, **có thể** thêm 3-4 khung tư thế nối tiếp — cùng nhân vật, cùng trang phục, cùng hướng máy, chỉ đổi cử chỉ — để hậu kỳ cắt thành chuyển động. Chữ của Tú là *"có thể thêm"*; v1 đã nâng thành bắt buộc, sai.

**Viết thế nào cho chuỗi tư thế** — **chưa đo, không vào skill như luật cho tới khi đo** (D05). Tách hai khâu, theo phương án Codex đề xuất:
- **Khâu 1 — khung gốc từ asset:** một khung nhân vật **một mình** sinh từ asset nhân vật.
- **Khâu 2 — biến thể từ khung gốc:** các tư thế sau gọi chip **chính khung gốc**, chỉ đổi cử chỉ. Không sinh từ asset (asset giữ được mặt nhưng đã đo là khung hình đổi giữa hai lần sinh), cũng không sinh từ ảnh nhóm (kéo người khác sang).
- **Tái dùng nhân vật và giữ nguyên khung là hai yêu cầu khác nhau.** RUNBOOK mục 0 chứng minh cái thứ nhất, chưa gì chứng minh cái thứ hai.
- Vật được nói tới (bó tiền) giữ làm **phần tử rời** để hậu kỳ đặt vào, không nhét vào tay nhân vật.

**Giữ mức chắc chắn:** vẽ Luciano **đang khoe** là vẽ **hành vi nói** — lời kể xác nhận việc khoe. Vẽ
**nội dung lời khoe** (cảnh trao tiền, cảnh ra lệnh) thì không được: đó là điều chỉ có trong lời
khoe.

**Ví dụ:** `A1-18a` (asset Luciano) → `A1-18b` (ngồi giường tù khoe với bạn tù) · `A1-18c` (khung gốc, từ asset) → `A1-18d`, `A1-18e` (biến thể, từ `A1-18c`) · `A1-18` (bó tiền) giữ làm phần tử rời.

---

## 9. Hai thay đổi cơ chế đi kèm (đã làm, cần review cùng)

**9a. Shot `mention` giờ nhận luật theo `kind`.** Trước đây câu mention được coi là nguyên văn nên
**bỏ qua `styleByKind`**. Đúng khi câu chỉ nhắc lại nhân vật đã có asset; **sai** khi câu đưa thêm
người mới (cảnh sát ở `A1-07a`, bạn tù ở `A1-18b`) — những người đó không có asset nào mang luật
mặt đơn giản, nên sẽ ra mặt vẽ chì tả thực. Builder giờ nối phần theo `kind` vào cuối câu mention.

**9b. Người nghe / người phụ trong cảnh sinh từ asset** thì `kind` của shot là `group`, không phải
`character` — vì luật `character` có câu *"Only one person in the image"*, và nối vào cảnh áp giải
là mâu thuẫn trực tiếp.

**9c. Câu "mặt đơn giản" không được khoá miệng thành một nét.** Bản trước ghi *"a simple line for
the mouth"*. Nối vào tư thế *"laughing with his mouth open"* (A1-18c) là hai chỉ dẫn chỏi thẳng
nhau trong cùng một prompt. Tú chỉ chốt miệng **đơn giản**; chữ "một nét" là do tôi thêm. Sửa thành
*"a simple mouth drawn with a single line, or a simple open shape when he is talking or laughing"*.

**9d. Gọi tên ảnh neo trong câu mention — phương án chưa đo.** `noAnchors` chỉ chặn runner **tự đính** ảnh không phân vai; nó **không chặn gọi tên** ảnh neo trong câu — `A1-11` đang làm đúng thế, và đó là cách Tú tự prompt. Nên shot mention đưa người/vật **mới** vào (`A1-07a`, `A1-15`, `A1-18b`) **có thể** thêm *"in the same drawing style as @<ảnh neo>"*. **🧪 Tiêu chí chọn ảnh neo — thử nghiệm, chốt ở v3 theo D06 (Gemini):** chọn theo **loại của phần tử
MỚI** được đưa vào câu, **không** theo `kind` của cả shot. Lý do: phần tử mới là thứ không có asset nào
mang phong cách; nhân vật đã có asset thì phong cách đã đi theo chip của chính nó. Ảnh neo tra theo đúng
khoá của `input/style-ref/_anchors/by-kind.json` — builder đã tra được tên `{{...}}` trong thư mục ảnh
neo, không cần sửa code:

| Phần tử MỚI trong câu | Ảnh neo gọi tên trong câu |
| --- | --- |
| đồ vật, công trình, biểu tượng | `01-pyramid-place.png` |
| một người | `02-doctor-figure.png` |
| nhiều người | `03-five-men-group.png` |

**Chỗ đo** khi chạy mẻ ảnh kế tiếp: `A1-07a` (cảnh sát mới → `02`), `A1-15` (lò sưởi mới → `01`),
`A1-18b` (hai bạn tù mới → `03`). Prompt trong `A1.shots.json` **chưa đổi** — ví dụ vẫn đúng bản đã
qua review; áp tiêu chí này là việc của mẻ đo.

⚠️ Hai rủi ro **đã đo được** phải soi ở mẻ đó: ảnh neo **lẫn nội dung** sang ảnh ra (tia nắng của
`01-pyramid-place.png` từng xuất hiện trong ảnh khách sạn), và `03-five-men-group.png` đính vào shot
một người từng ra **ba bản sao** cùng một người (RUNBOOK mục 0). Câu có nhiều loại phần tử mới cùng lúc
thì chưa có quy ước — ghi là khoảng trống, đừng tự chọn.

👉 Bài học tổng quát cho mọi khối style theo `kind`: **khối style tả HÌNH THỨC, không được tả TRẠNG
THÁI**. "Mặt đơn giản" là hình thức; "miệng khép" là trạng thái — và trạng thái thuộc về từng cảnh.

---

## 10. Đối chiếu với luật đã có — chỗ nào đụng nhau

| Luật mới | Đụng | Xử lý |
| --- | --- | --- |
| §6 hai vật nối | SHOT-LIST luật 2, SPEC-v2 §3 cấm định vị tương đối | không mở lại — xem bảng trong §6 |
| §2, §7, §8 sinh từ asset | RUNBOOK mục 0: sinh từ asset là cách duy nhất đo được giữ mặt + tỷ lệ | cùng chiều, dùng lại |
| §3 ảnh đúng tuổi | SPEC-v2 §4a mô tả phải rút từ ảnh đã mở | cùng chiều, thêm tiêu chí tuổi |
| §1 người vô danh lộ tai | skill §5a rải râu/tóc cho người vô danh | cùng chiều (review Codex điểm 5 chỉ cấm rải cho người **có thật**) |
| §8.3 chuỗi tư thế | skill §6b "biến thể dùng `editFrom`" | **cùng chiều sau D05**: biến thể sinh từ khung gốc, đúng tinh thần §6b; vẫn chưa đo |
| §0 bộ phần tử | skill §8 "cảnh ghép `scenes.json`" giả định khung hình hoàn chỉnh | §8 skill không sai, chỉ không còn là mặc định cho luồng `.shots.json` |

---

## 11. Sẽ chép vào skill ở đâu (khi luồng `settled`)

- §0 → mục mới **"4d. BỘ PHẦN TỬ, KHÔNG PHẢI KHUNG HÌNH"**, ngay sau 4c (bảng tra nội dung → hình).
- §1, §5, §6 → mục **7 Prop**, thành 7c, 7d, 7e.
- §2, §7 → mục **4**, thành 4e "trạng thái nối", 4f "nhảy cóc".
- §3 → mục **5**, bổ sung vào 5d-bis.
- §4 → skill `case-reference-images`, mục mới 4d (kiểm niên đại của tên).
- §8 → mục **8**, thành 8e.
- §9 → SPEC-v2 §5d.
