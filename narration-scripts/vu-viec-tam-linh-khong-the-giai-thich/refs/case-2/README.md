# Case 2 — Don Decker, "người làm ra mưa" (Stroudsburg, Pennsylvania, **tháng 2/1983**)

187 ảnh, gom 2026-09-06. Ảnh nằm trong `.gitignore`, chỉ commit file này — URL nguồn ghi
theo nhóm ở dưới, tải lại được bất cứ lúc nào.

⚠️ Gom tư liệu **SAU KHI** cả 52 asset + 61 cảnh của case 2 đã tạo xong. Nghĩa là phần ảnh
hiện có được viết theo phỏng đoán — xem mục "Sai lệch so với ảnh thật" bên dưới, có ít nhất
một chỗ sai rõ.

## Nhóm ảnh ↔ asset

| Nhóm | Dùng cho | Số ảnh |
|---|---|---|
| `36-real-people` | **Don Decker** (ảnh thật, xem mục dưới) | 1 |
| `37-stroudsburg-pa` | không khí thị trấn, nhà gạch đỏ, phố chính | 34 |
| `38-jail-cell` | `Prison Cell 1983`, `Prison Cell Interior Facing Bars` | 29 |
| `39-cell-corridor` | `Prison Cell Block Corridor` (+ bản mở cửa) | 10 |
| `40-warden-office` | `Warden Office` | 5 |
| `41-living-room-1980s` | `Bob Living Room` (+ bản đêm, V2) | 5 |
| `42-kitchen-1980s` | `Bob Kitchen` (+ V2) | 2 |
| `43-bathroom-1980s` | `Bob Bathroom` (+ V2, V3) — gương + bồn rửa | 9 |
| `44-house-exterior-pa` | `Bob House Exterior` (+ V2) | 10 |
| `45-funeral-home` | `Funeral Home Interior` (+ bản có người viếng) | 21 |
| `46-cemetery-funeral` | `Cemetery Funeral Ground` | 11 |
| `47-police-uniform-1980s` | `Patrol Officer` | 11 |
| `48-corrections-officer` | `Prison Guard` — **mỏng, xem mục thiếu** | 1 |
| `49-clergy-crucifix` | `Priest` + thánh giá cầm tay | 17 |
| `50-basement-pipes` | `Bob Basement Pipes` | 18 |
| `51-reenact-phenomenon` | hiện tượng nước/thánh giá — **KHÔNG dùng cho tạo hình người** | 3 |

`titles.json` giữ tên file gốc trên Commons của từng ảnh — rà rác bằng tên, khỏi phải mở
từng cái.

## Nguồn

- Nhóm `36` và `51`: <https://unsolved.com/gallery/don-decker/> (cần header `Referer` mới tải được).
- Mọi nhóm còn lại: Wikimedia Commons, lấy qua API `generator=categorymembers`.
  Category đã dùng ghi trong `titles.json` từng ảnh.

⚠️ **Dùng CATEGORY, đừng dùng search.** Vòng đầu tra bằng cụm chung
(`"American living room 1985"`) trả về **ảnh cầu thủ bóng chày Yankees** — đúng bẫy skill mục 5.
⚠️ **Wikimedia trả HTTP 429 nếu bắn nhanh.** Phải nghỉ ~2s/ảnh và lùi dần khi gặp 429; chạy
nhanh thì 429 gần như toàn bộ, trông y hệt như Commons không có tư liệu.

## 🔑 Người thật — chi tiết đã trích ra

Vụ này **có thật và tra được dễ**, tên trong kịch bản đã đúng. Danh sách nhân chứng đầy đủ ở
<https://unsolved.com/gallery/don-decker/>.

**`36-real-people-01.jpg` — Don Decker thật**, khung hình phỏng vấn trên *Unsolved Mysteries*:

- **Tóc nâu sẫm dài trung bình**, rẽ ngôi, phủ kín tai, hất ra sau ở hai bên — KHÔNG phải tóc
  ngắn cắt sát.
- **RIA MÉP ĐẦY, không có râu cằm.** Cằm và má cạo nhẵn.
- Mặt tròn đầy, người đậm.
- Áo sơ mi kẻ ca-rô (đỏ + sẫm), có cổ.

⚠️ Ảnh này chụp lúc phát sóng (≈1993), tức **muộn hơn sự kiện khoảng 10 năm** — lúc 1983 Don
mới 21 tuổi. Kiểu tóc/ria có thể khác, nhưng ria mép là dấu hiệu mạnh và hợp thời kỳ.

Người thật khác trong vụ (chưa tìm được ảnh): grandfather **James Kishaugh** (63 tuổi),
**Bob và Jeannie Kieffer**, chủ nhà **Ron Van Why** và vợ **Romayne**, cảnh sát **Richard
Wolbert** / **John Baujan** / **Bill Davies**, trung uý **John Rundle**, cảnh sát trưởng
**Gary Roberts**, chủ tiệm pizza **Pam Scrofano**, giám thị **Dave Keenhold**, mục sư
**William Blackburn**.

## 🔴 Sai lệch so với ảnh thật — CẦN SỬA

**`Don Decker` và `Don Decker 3Q` đang tả *"clean-shaven with no beard and no moustache"* và
*"short dark brown hair combed flat with no parting"*. Cả hai đều SAI** — Don thật có ria mép
rõ và tóc dài trung bình rẽ ngôi. Trớ trêu là asset `Bob` lại được cho ria mép.

Chưa sửa: 52 asset case 2 đều `status: "success"`, sửa là phải tạo lại ảnh và ghép lại các
cảnh có Don. Ghi ra đây để quyết định sau.

Chỗ lệch nhỏ hơn: asset ghi *"in his late twenties"*, Don thật **21 tuổi** lúc xảy ra vụ.

## Kịch bản vs sự thật (không tự sửa kịch bản — chỉ ghi lại)

| Kịch bản | Sự thật |
|---|---|
| "a priest" làm lễ trừ tà | **Mục sư Tin Lành William Blackburn**, không phải linh mục Công giáo. Asset `Priest` đang mặc áo chùng đen + cổ cồn trắng kiểu Công giáo. |
| "his friend Bob's house" | Nhà **thuê** trên **Ann Street**, Stroudsburg, của **Bob và Jeannie Kieffer** |
| "the landlord" | **Ron Van Why** (và vợ Romayne) |
| "the chief warden" | Giám thị **Dave Keenhold**, Monroe County Correctional Facility |
| ông ngoại/nội không tên | **James Kishaugh**, 63 tuổi |
| "One day" | **Tháng 2/1983** |
| Don đang thụ án (không nói tội gì) | Nhận tài sản trộm cắp, án 4–12 tháng |

Kịch bản **lược bỏ**: quán pizza của Pam Scrofano (mưa xảy ra cả ở đó), việc Don bị **nhấc
bổng** ném vào cửa, ba vết cào trên cổ, và chuyện cảnh sát trùm túi giấy lên đầu Don để thử.
Đây là chi tiết còn dùng được nếu sau này muốn mở rộng case.

## Tìm KHÔNG RA (đừng tra lại từ đầu)

- **Ảnh nhà Kieffer trên Ann Street** — không có. Dùng nhóm `44-house-exterior-pa` (nhà gỗ/gạch
  Pennsylvania) thay thế.
- **Ảnh Monroe County Correctional Facility thời 1983** — không có. Nhà tù hiện nay ở
  4250 Manor Dr có thể xây sau 1983, nên đừng lấy ảnh hiện tại làm chuẩn niên đại. Dùng nhóm
  `38-jail-cell` (buồng giam quận ở Mỹ nói chung).
- **Ảnh bất kỳ nhân chứng nào ngoài Don** — không có.
- **Nội thất gia đình Mỹ thập niên 1980** (phòng khách/bếp/văn phòng): Commons **rất yếu** mảng
  này. Đã thử cả search lẫn 4 category khác nhau, kết quả gần như toàn ảnh thế kỷ 19, quảng cáo
  cũ, hoặc bếp công nghiệp. Nhóm `41`/`42`/`40` vì thế chỉ còn 5/2/5 ảnh và **không đúng niên
  đại**. Muốn đúng 1980s thì phải tìm ngoài Commons (rao vặt bất động sản, Flickr, ảnh gia đình).
- **Quản giáo Mỹ** (`48`): chỉ còn 1 ảnh dùng được (`1971securityMSP`), phần còn lại của mọi
  category đều là nhà tù Đức/Nhật/Indonesia/Áo/Úc. Đồng phục quản giáo Mỹ nên tra ngoài Commons.

## Chưa làm

Chưa soi từng ảnh bằng mắt — mới soi `36-real-people-01`, `37-stroudsburg-pa-01`,
`41-living-room-1980s-02` (ảnh cuối là rác, đã xoá) và 3 ảnh nhóm `51`. Trước khi viết lại bất
kỳ `description` nào, phải mở ảnh chủ chốt của nhóm đó ra xem thật (skill mục 9).
