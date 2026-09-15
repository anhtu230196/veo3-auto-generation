# Review prompt ảnh — A Whole Group Vanished Without a Trace

Sinh bằng `scripts/review_shots.py` từ `case-1.shots.json` + `case-1.jobs.json`. Prompt dưới đây là **nguyên văn** gửi Flow. Cột *Lời kể* là trường `at`; chữ in đậm là `cue`.

**Trạng thái:** 5/46 ảnh đã tạo (theo log: tra thẳng Flow lúc 2026-09-13T05:28:07.181Z (output/c1-flow-status.json)).

**Mọi ảnh trong file này:** Mọi ảnh vẽ theo nét của ba ảnh neo phong cách Tú gửi — viền mực đen dày không đều, tô màu phẳng, gạch chì thấy nét, nền trắng trơn — khổ 16:9. Người trong ảnh có MẶT ĐƠN GIẢN: mắt là chấm nhỏ, mũi ngắn, miệng một nét (hoặc một hình mở khi đang nói/cười), không đổ bóng trên mặt. Ảnh nhóm có thêm câu tỷ lệ người lớn cao khoảng 6,5 đầu. Shot vẽ bằng CHỮ thì runner tự đính một ảnh neo theo loại: một người → 02-doctor-figure.png, nhóm → 03-five-men-group.png, đồ vật/nơi chốn → 01-pyramid-place.png. Shot @MENTION không tự đính ảnh neo — chỉ ảnh được gọi tên trong câu mới được dùng.

## Bảng tổng

| Mã | Lời kể (`at`) | Loại | Tên card | Sinh bằng | Trạng thái |
|---|---|---|---|---|---|
| C1-01 | In 1587, nearly a hundred and fifteen **English men, women, and children landed** on a small island in what would later become North Carolina, led by governor John White. | `group` | Colonists Walking Ashore With Bundles | chữ + ảnh neo | ✅ có trên Flow |
| C1-01b | In 1587, nearly a hundred and fifteen English men, women, and children **landed on a small island** in what would later become North Carolina, led by governor John White. | `object` | Rowing Boat Ref Pulled Up On Sand | chữ + ảnh neo · **tạo asset** | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-01c | In 1587, nearly a hundred and fifteen English men, women, and children landed on a small island in what **would later become North Carolina**, led by governor John White. | `place` | East Coast Map With One State Filled Red | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-01d | In 1587, nearly a hundred and fifteen English men, women, and children landed on **a small island** in what would later become North Carolina, led by governor John White. | `place` | Low Wooded Island Seen From The Water | chữ + ảnh neo | ⏸ chưa tạo |
| C1-02 | In 1587, nearly a hundred and fifteen English men, women, and children landed on a small island in what would later become North Carolina, **led by governor John White**. | `character` | Bearded Governor Ref Wide Brim Hat | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-03a | **It was England's** second attempt at a lasting colony in the New World. | `symbol` | Red Cross Flag On Wooden Pole | chữ + ảnh neo | ⏸ chưa tạo |
| C1-03 | It was England's **second attempt at a lasting colony** in the New World. | `place` | Timber Settlement Ref Three Cottages | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-03b | It was England's second attempt at a lasting colony **in the New World**. | `object` | Old Globe Turned Toward The Americas | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-04 | On August 18th that year, White's daughter Eleanor **gave birth to a girl named Virginia Dare**, the first English child ever born on American soil. | `group` | Young Mother Holding Swaddled Baby | chữ + ảnh neo | 🔁 ảnh cũ trên Flow mang tên cũ — cần tạo lại |
| C1-05 | The colony was **running desperately short on food**. | `object` | Empty Provision Barrel | chữ + ảnh neo | ✅ có trên Flow |
| C1-06 | **The settlers begged White** to sail back to England for more supplies. | `group` | Colonists Pleading Before The Governor | chip @ | 🔁 ảnh cũ trên Flow mang tên cũ — cần tạo lại |
| C1-06b | The settlers begged White to sail back to England **for more supplies**. | `object` | Stack Of Barrels And Sacks | chữ + ảnh neo | ⏸ chưa tạo |
| C1-06c | The settlers begged White to **sail back to England** for more supplies. | `place` | Ocean Map Between Two Coasts | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-07 | **He left on August 27th**, 1587, promising to return quickly. | `object` | Sailing Ship Ref Three Masts | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-08 | He left on August 27th, 1587, **promising to return quickly**. | `character` | Governor Promising With Hand On Chest | chip @ | ⏸ chưa có trên Flow |
| C1-09 | **The Spanish Armada was threatening England**, and Queen Elizabeth banned any seaworthy ship from leaving port. | `object` | Fleet Of Spanish Galleons | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-09b | The Spanish Armada was **threatening England**, and Queen Elizabeth banned any seaworthy ship from leaving port. | `place` | Sea Map Of Western Europe | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-10 | The Spanish Armada was threatening England, and **Queen Elizabeth banned** any seaworthy ship from leaving port. | `character` | Pale Queen With Lace Ruff | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-11 | The Spanish Armada was threatening England, and Queen Elizabeth banned any seaworthy ship **from leaving port**. | `object` | Ship Moored With Sails Furled | chip @ | ⏸ chưa có trên Flow |
| C1-12 | Before he'd left, he and the colonists had **agreed on a signal**. | `group` | Governor Explaining The Signal | chip @ | ⏸ chưa có trên Flow |
| C1-13 | If they were forced to relocate, they would **carve the name of their destination** into a tree or post. | `object` | Pointed Post Ref Blank Carved Panel | chữ + ảnh neo · **tạo asset** | ⏸ chưa có trên Flow |
| C1-13b | If they were forced to relocate, **they would carve** the name of their destination into a tree or post. | `object` | Small Carving Knife With Wooden Handle | chữ + ảnh neo | ⏸ chưa tạo |
| C1-14 | If they left under distress, they'd **carve a cross beside it**. | `object` | Post With A Carved Cross | chip @ | ⏸ chưa có trên Flow |
| C1-15 | On August 18th, 1590, his granddaughter's third birthday, **White landed again**. | `character` | Governor Wading Ashore | chip @ | ⏸ chưa có trên Flow |
| C1-15b | On August 18th, 1590, his granddaughter's third birthday, White **landed again**. | `object` | Ship Riding At Anchor Offshore | chip @ | ⏸ chưa tạo |
| C1-16 | **The colony was empty**. | `place` | Settlement Taken Apart | chip @ | ⏸ chưa có trên Flow |
| C1-17 | The houses had been carefully taken apart, their **belongings dug up and rifled through**. | `object` | Chest Dug Up And Rifled | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-18 | **Not a single boat remained** on the shore. | `object` | Small Wooden Rowing Boat | chip @ | ⏸ chưa có trên Flow |
| C1-19 | And **carved into a post of the fence**, one word. CROATOAN. | `character` | Governor Staring At Something | chip @ | ⏸ chưa có trên Flow |
| C1-20 | And carved into a post of the fence, **one word. CROATOAN**. | `object` | Blank Post Standing In Palisade | chip @ | ⏸ chưa có trên Flow |
| C1-21 | To White, **that looked like good news**. | `character` | Governor With A Hopeful Look | chip @ | ⏸ chưa có trên Flow |
| C1-22 | It meant everyone had **relocated safely to nearby Croatoan Island**. | `place` | Low Sandy Island With Pines | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-22b | It meant everyone had relocated safely to **nearby Croatoan Island**. | `place` | Coastal Map With Two Islands Marked | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-23 | But just as he prepared to sail there and check, **a hurricane tore through the area**. | `object` | Ship Tossed In A Storm | chip @ | ⏸ chưa có trên Flow |
| C1-24 | His ship's **anchor cable snapped** in the storm, leaving only a spare anchor in waters full of hidden rocks, and the crew refused to risk a wreck. | `object` | Snapped Anchor Cable | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-25 | His ship's anchor cable snapped in the storm, **leaving only a spare anchor** in waters full of hidden rocks, and the crew refused to risk a wreck. | `object` | Single Iron Anchor | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-25b | His ship's anchor cable snapped in the storm, leaving only a spare anchor in **waters full of hidden rocks**, and the crew refused to risk a wreck. | `place` | Jagged Rocks Under Calm Water | chữ + ảnh neo | ⏸ chưa tạo |
| C1-26 | His ship's anchor cable snapped in the storm, leaving only a spare anchor in waters full of hidden rocks, and **the crew refused to risk a wreck**. | `group` | Sailors Refusing The Governor | chip @ | ⏸ chưa có trên Flow |
| C1-26b | The storm blew them completely off course, and by the time they spotted land again, they were **near the Azores**, off the coast of Spain. | `place` | Open Ocean Map With Island Group | chữ + ảnh neo | ⏸ chưa tạo · ⏳ chờ tư liệu |
| C1-27 | They had **no choice but to turn back** for England. | `character` | Governor Looking Back From Ship Rail | chip @ | ⏸ chưa có trên Flow |
| C1-28 | He died years later, **never learning what happened** to his own family. | `character` | Governor Grown Old Sitting Alone | chip @ | ⏸ chưa có trên Flow |
| C1-29 | Centuries afterward, **one explorer wrote** that the native people on nearby Hatteras Island had ancestors described as having pale skin and gray eyes. | `figure` | Explorer Writing In A Journal | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-30 | Centuries afterward, one explorer wrote that **the native people on nearby Hatteras Island** had ancestors described as having pale skin and gray eyes. | `figure` | Algonquian Woman In Deerskin Mantle | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-31 | But not one skeleton, **one grave**, or one piece of solid archaeological proof of those hundred and fifteen people has ever turned up. | `object` | Grave Mound With Wooden Cross | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-32 | But not one skeleton, one grave, or one piece of **solid archaeological proof** of those hundred and fifteen people has ever turned up. | `place` | Empty Excavation Pit | chữ + ảnh neo | ⏸ chưa có trên Flow |
| C1-32b | **Not to this day**. | `place` | Grassy Earthwork Ramparts Under Pines | chữ + ảnh neo | ⏸ chưa tạo |

## Các quyết định theo skill 4d (rà 10 câu hỏi)

- **1_vatTacDongCoThe** — Khong co trong case nay.
- **2_trangThaiNhanVat** — White tro lai (C1-15), White buoc quay ve (C1-27), White gia di khong bao gio biet (C1-28). Tau bi giu o cang (C1-11). 'He died years later' KHONG ve canh chet: noi va cach ong chet khong ro, ve ra la bia (gioi han bang chung luat 7) — hau ky gan chu/icon.
- **3_nguoiCoThatDuocGoiTen** — John White (C1-02, KHONG co chan dung that — hu cau co co so theo cho hoi tu cua cac ban khac, xem refs/case-1/README.md). Eleanor + Virginia Dare (C1-04, cung khong co chan dung). Nu hoang Elizabeth (C1-10, anh chan dung 1585-90 dung tuoi luc cam tau 1588).
- **4_tenSaiThoiKy** — 'North Carolina' — loi ke da tu noi 'what would later become'. 'Croatoan Island' dung ten thoi ky. 'near the Azores, off the coast of Spain': Azores thuoc Bo Dao Nha (1580-1640 chung vuong mien Tay Ban Nha) va nam giua Dai Tay Duong, hon 1.300 km ve phia tay ban dao Iberia — ban do C1-26b dat Azores DUNG vi tri giua Dai Tay Duong va khong ghi nhan SPAIN. Khong sua loi ke.
- **5_trangThaiGoc** — Lang con nguyen (C1-03) -> lang bi thao do (C1-16). Cot tron (C1-13) -> cot co dau thap (C1-14, trang thai 'roi di vi nguy') va cot trong hang rao khong co dau thap (C1-20, trang thai tim thay).
- **6_choNoi** — Cot la MOT cot cua hang rao (C1-20, 'a post of the fence'). Tau buoc day vao cau cang (C1-11).
- **7_nhayCoc** — CO Y KHONG THEM hanh dong noi nao ve so phan dan thuoc dia (roi lang, di thuyen sang Croatoan, bi tan cong, hoa nhap voi nguoi ban dia): day la khoang trong THAT cua ca vu, loi ke giu no. Dao Croatoan ve KHONG nguoi (C1-22) — 'It meant everyone had relocated safely' la suy doan cua White, loi ke dat sau 'To White'. Ruong bi dao len (C1-17) khong ve AI dao. Hanh dong White nhin thay chu khac (C1-19) thi co: loi ke va ban khac cung thoi xac nhan.
- **8_hanhViNoi** — Dan van nai (C1-06: nguoi noi + White nghe). White hua (C1-08: nguoi nghe da co o C1-06 ke ben -> khong ve lai). Thoa thuan am hieu (C1-12). Thuy thu tu choi (C1-26: nguoi noi + White nghe). Nha tham hiem VIET (C1-29): ve hanh vi viet, KHONG ve noi dung 'da nhat mat xam' thanh su that — nguoi ban dia o C1-30 ve trung tinh.
- **9_mucChacChan** — C1-22 (dao khong nguoi), C1-28 (khong ve cai chet), C1-30 (khong ve mat xam). C1-17 (khong ve ke dao). C1-22b (ban do chi vi tri, khong ve duong di cua dan thuoc dia). C1-32b (luy dat hom nay khong ghi la lang 1587).
- **10_trungChucNang_dungLai** — Skill 4d-bis phan 3. Dung lai (xem _dungLai): 8 cau. BO vi trung chuc nang: bao luong thuc rong (trung C1-05), than cay boc vo (trung C1-13), bai cat trong (trung C1-18), sach bia trong (trung C1-29), may bao (trung C1-23), dao Azores rieng (trung ban do C1-26b), can canh em be (trung C1-04), ban do Hatteras rieng (trung C1-22b). BO vi gioi han Dan dung: White buc boi nhin bien, thu niem sap + White cam thu, dan chia khau phan, dan vay theo tau, go nha xep dong, White chuan bi ra thuyen, thuy thu chi tay thay dat, White gia nhin bien, nha khao co dang dao. BO vi thieu mau co xac nhan: co Tay Ban Nha 1588. GIU dao Roanoke C1-01d rieng vi khac dao Croatoan.
- **11_netMat** — Net mat trung tinh mac dinh (skill 4d-bis phan 2). Da bo cam xuc khong nguon o C1-04, C1-06, C1-08, C1-10, C1-15, C1-19, C1-26, C1-27, C1-28; giu C1-21 (loi ke 'looked like good news'). 10 shot moi khong co nguoi.

**Thử nghiệm chưa đo:** Cac shot mention dua phan tu MOI vao cau co goi ten anh neo (skill muc 4d-9d, CHUA DO): C1-06, C1-11, C1-12, C1-15b, C1-20, C1-23, C1-26. Ra anh lech/lan noi dung anh neo thi xoa cum 'in the same drawing style as {{...}}' roi chay lai. C1-16 sinh lang bi thao do TU asset lang (luat 5 phan 'sinh B tu A', CHUA DO) — lech bo cuc thi viet lai bang `draw` doc lap.

## Từng shot

### C1-01 · `group` · ✅ có trên Flow

**Tên card:** Colonists Walking Ashore With Bundles

**Lời kể (`at`):** In 1587, nearly a hundred and fifteen **English men, women, and children landed** on a small island in what would later become North Carolina, led by governor John White.

**Ý đồ:** Ca mot doan nguoi thuong — dan ong, phu nu, tre em — den dinh cu. Con so 115 la chu hau ky

**🖼️ Ảnh sẽ ra:** Sáu người dân thuộc địa Anh thập niên 1580 cùng bước về phía trước, vẽ nguyên người từ đầu tới giày: ba đàn ông, hai phụ nữ và một đứa trẻ nhỏ đang nắm tay một người phụ nữ. Đàn ông mặc áo chẽn (doublet) sẫm cổ trắng nhỏ, quần ống túm tới gối, tất, giày bệt; một người đội mũ nồi dẹt, một người đội mũ phớt vành rộng, một người vác bọc vải trên vai. Phụ nữ mặc váy dài sẫm, tạp dề trắng, khăn trùm đầu trắng. Không tàu, không thuyền, không vũ khí, không chữ.

**🔍 Cần soi khi ra ảnh:** Đếm đủ 6 người và có đứa trẻ. Ảnh neo 03 là năm đàn ông đứng nghiêm thành hàng — model có thể bắt chước thành hàng đứng yên thay vì đang bước.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `03-five-men-group.png`

**Prompt gửi Flow:**

```text
Six English colonists of the 1580s walking forward together, seen full length from head to shoes: three men, two women and one small child holding a woman's hand. The men wear plain dark doublets with small white collars, baggy knee-length breeches, stockings and flat shoes, one in a flat cap and one in a wide-brimmed felt hat, one carrying a cloth bundle on his shoulder. The women wear long plain dark gowns with white aprons and white linen coifs on their heads. No ship, no boat, no weapons, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `08-white-depictions-01.jpeg`, `07-croatoan-03.jpg`

**Ghi chú:** Trang phuc thuong dan theo ban khac le rua toi Virginia Dare (khan coif trang, tap de, co ao nho) — README: nhom 05-elizabethan-dress la chan dung quy toc, KHONG dung.

### C1-01b · `object` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Rowing Boat Ref Pulled Up On Sand

**Lời kể (`at`):** In 1587, nearly a hundred and fifteen English men, women, and children **landed on a small island** in what would later become North Carolina, led by governor John White.

**Ý đồ:** Tu yeu cau 2026-09-13: 'landed' ngam co chiec thuyen cap bo (o anh 3 — vat ngam trong dong tu). Tao ASSET thuyen de C1-18 dung lai

**🖼️ Ảnh sẽ ra:** Một chiếc thuyền gỗ nhỏ không mui thế kỷ 16 nhìn ngang, mũi thuyền đã kéo lên bãi cát nhạt, đuôi còn chạm mép nước nông phẳng lặng; hai mái chèo gác ngang ghế, một cuộn dây thừng ở mũi, thuyền trống. Không người, không tàu lớn, không chữ, không mặt trời. Là ASSET GỐC cho C1-18 ("không còn một chiếc thuyền nào").

**🔍 Cần soi khi ra ảnh:** Model có vẽ thêm người đang bước xuống hay tàu lớn ngoài khơi không. Thuyền phải nằm TRÊN cát, không trôi giữa nước.

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co anh tu lieu thuyen nho (ship's boat / pinnace) the ky 16 trong refs/case-1 — gom anh roi doi chieu dang than, mui, mai cheo truoc khi chay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Rowing Boat Ref Pulled Up On Sand` — dùng lại ở: C1-18

**Prompt gửi Flow:**

```text
A small open wooden ship's boat of the 1580s seen from the side, its bow pulled up onto a pale sandy beach and its stern still touching the edge of shallow flat water, two oars resting across its seats and a coil of rope in the bow, empty. No people, no ship, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Luong img-skill-nhieu-anh-moi-cau, o anh 3. Thuyen NHO cap bai — tau lon khong len duoc bai cat, tau da co asset C1-07. Chua co anh tu lieu thuyen nho the ky 16 trong refs/case-1 (stillMissing). Mui thuyen nam tren cat la TRANG THAI cua thuyen, khong phai dinh vi tuong doi hai vat roi.

### C1-01c · `place` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** East Coast Map With One State Filled Red

**Lời kể (`at`):** In 1587, nearly a hundred and fifteen English men, women, and children landed on a small island in what **would later become North Carolina**, led by governor John White.

**Ý đồ:** Tu yeu cau 2026-09-13: ban do the hien North Carolina (o anh 6 — dia ly). Loi ke noi 'would LATER become' nen ve ranh gioi hien dai duoc; ten bang ghi thang trong anh (Tu chap nhan chu tren ban do), cham Roanoke la hau ky. Ban do DINH VI cho nguoi xem hom nay, KHONG phai ban do duong thoi 1587 (Codex r1)

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng nhìn thẳng từ trên xuống, dải bờ biển Đại Tây Dương của nước Mỹ từ Virginia xuống Georgia: bang North Carolina tô một màu đỏ phẳng, có chữ "NORTH CAROLINA" in hoa đơn giản nằm trên bang; biển xanh nhạt phẳng có chữ "ATLANTIC OCEAN"; các bang khác màu be nhạt trơn, đường ranh giới bang mảnh màu sẫm; dọc bờ North Carolina có dải đảo chắn dài và mảnh (Outer Banks). Không tiêu đề, không số, không la bàn, không thước tỷ lệ, không lưới, không mũi tên. Chấm đảo Roanoke và mũi tên Tú gắn ở hậu kỳ.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ hai dòng chữ "NORTH CAROLINA" và "ATLANTIC OCEAN" (model hay viết sai — Tú đã chấp nhận chữ trong ảnh bản đồ); model có tự thêm tiêu đề hay tên bang khác không. HÌNH DẠNG bang và bờ biển có đúng không (tả bằng chữ — rủi ro giống khách sạn A1-11). Sai hình thì chuyển sang chip @ với bản đồ tham chiếu.

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co BAN DO THAM CHIEU hinh dang bo bien Dai Tay Duong cua My / North Carolina trong refs/case-1 (co chu cung duoc — Tu chap nhan chu trong anh ban do 2026-09-13; tranh ban do chu viet tay co). Gom ban do roi doi shot sang chip @ (skill 4d-bis phan 4a); chua co thi KHONG chay shot nay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple flat map seen straight from above of the Atlantic coast of the United States from Virginia down to Georgia. The state of North Carolina is filled with one flat red colour and labelled "NORTH CAROLINA" in plain capital letters, the ocean is one flat pale blue labelled "ATLANTIC OCEAN" in plain capital letters, every other state is plain pale beige, with thin dark state border lines and the long thin barrier islands drawn along the North Carolina coast. Spell every name exactly as written here. No title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Luong img-skill-nhieu-anh-moi-cau, muc 5a. outName KHONG chua ten bang vi duong draw go outName vao prompt. Chua co ban do ranh gioi NC trong refs/case-1; ban do John White 1585 (01-john-white-02) day chu viet tay nen khong dung lam chip. | Tu chot 2026-09-13 (sau khi luong settled): CHAP NHAN chu trong anh ban do — ghi nguyen van ten can hien (NORTH CAROLINA, ATLANTIC OCEAN) trong prompt, cam tieu de. outName van KHONG chua ten bang vi duong draw go outName vao prompt.

### C1-01d · `place` · ⏸ chưa tạo

**Tên card:** Low Wooded Island Seen From The Water

**Lời kể (`at`):** In 1587, nearly a hundred and fifteen English men, women, and children landed on **a small island** in what would later become North Carolina, led by governor John White.

**Ý đồ:** Hon dao nho noi doan do bo — Roanoke (o anh 5, noi chon). Phai KHAC hinh dao Croatoan C1-22 (gioi han dung lai, skill 4d-bis phan 3)

**🖼️ Ảnh sẽ ra:** Một hòn đảo nhỏ, thấp và phẳng nhìn từ mặt nước qua một vùng vịnh nông lặng: rừng thông và sồi xanh sẫm dày phủ kín tới sát mép nước, viền cát nhạt hẹp và lau sậy đầm lầy cao dọc bờ; mặt nước phẳng lặng chiếm phần dưới khung. Không người, không nhà, không thuyền, không tàu, không khói, không mặt trời, không chữ.

**🔍 Cần soi khi ra ảnh:** Phải KHÁC hẳn hình C1-22 (đảo Croatoan: đụn cát, thông thưa cong vì gió) — ở đây rừng dày, lau sậy, nước lặng. Model có tự thêm thuyền, tàu không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small low flat island seen from the water across a calm shallow sound: dense dark green pine and oak woods cover it right down to a narrow edge of pale sand and tall marsh reeds along the waterline, and flat calm water fills the lower part of the picture. No people, no houses, no boats, no ships, no smoke, no sun, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `04-roanoke-coast-06.jpg`, `03-fort-raleigh-01.jpg`

**Ghi chú:** Theo anh 04-roanoke-coast-06 (bo dam lay Roanoke hom nay: lau say, rung thong thap day sat mep nuoc, nuoc lang) va 03-fort-raleigh-01 (rung thong soi cao). Canh quan HOM NAY — dung cho hinh dang chung cua dao, khong phai anh 1587.

### C1-02 · `character` · ✅ có trên Flow

**Tên card:** Bearded Governor Ref Wide Brim Hat

**Lời kể (`at`):** In 1587, nearly a hundred and fifteen English men, women, and children landed on a small island in what would later become North Carolina, **led by governor John White**.

**Ý đồ:** Nhan vat chinh cua ca vu — nguoi dan doan va la nguoi se quay lai tim

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI (từ ngực trở lên) một người đàn ông khoảng năm mươi tuổi: mặt dài, râu cằm nhọn ngắn và ria mép rậm, tóc và râu sẫm lốm đốm bạc; đội mũ phớt sẫm vành rộng, chóp tròn thấp, có dải băng mũ; mặc áo chẽn sẫm cài cúc, cổ áo trắng nhỏ bẻ phẳng. Chỉ một người. Đây là ASSET GỐC của John White — 9 shot sau vẽ lại ông từ chính ảnh này.

**🔍 Cần soi khi ra ảnh:** Ảnh cần duyệt KỸ NHẤT case: mặt, râu, mũ sai chỗ nào thì cả 9 shot sau sai theo.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Bearded Governor Ref Wide Brim Hat` — dùng lại ở: C1-06, C1-08, C1-12, C1-15, C1-19, C1-21, C1-26, C1-27, C1-28

**Prompt gửi Flow:**

```text
A man of about fifty seen from the chest up. A long face with a short pointed beard and a full moustache, his dark hair and beard streaked with grey. Dark hair showing below a wide-brimmed dark felt hat with a low rounded crown and a plain hat band. He wears a dark buttoned doublet with a small plain white collar lying flat around the neck. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `07-croatoan-03.jpg`, `08-white-depictions-07.jpg`, `08-white-depictions-08.jpg`, `08-white-depictions-09.jpg`

**Ghi chú:** SHOT TAO ASSET, nua than tren + mat don gian (skill 5d-bis). KHONG TON TAI chan dung John White — mo ta theo cho hoi tu cua ban khac Sheppard (07-croatoan-03, White dung giua: ria + rau nhon, mu vanh rong chop tron, doublet co co trang be) va ba minh hoa sach 1890/1906/1979. Hu cau co co so: dung ghi trong video day la chan dung ong. Ten rieng khong vao outName vi duong `draw` go outName vao prompt.

### C1-03a · `symbol` · ⏸ chưa tạo

**Tên card:** Red Cross Flag On Wooden Pole

**Lời kể (`at`):** **It was England's** second attempt at a lasting colony in the New World.

**Ý đồ:** Tu yeu cau 2026-09-13: la co nuoc Anh (o anh 7 — quoc gia). Nam 1587 la CHU THAP ST GEORGE, KHONG phai Union Jack (co tu 1606)

**🖼️ Ảnh sẽ ra:** Một lá cờ trắng trơn có một chữ thập đỏ thẳng chạy hết chiều cao và chiều ngang tấm vải (cờ chữ thập St George của nước Anh thời đó), treo trên cán gỗ thẳng, vải hơi gợn sóng. Trên vải không có màu nào khác, không huy hiệu, không vương miện, không chữ, không mặt trời.

**🔍 Cần soi khi ra ảnh:** KHÔNG được ra cờ Union Jack (có chữ thập chéo, nền xanh). Chữ thập phải chạy hết mép vải.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A plain white flag with one straight red cross running the full height and the full width of the cloth, hanging from a straight wooden pole and rippling slightly. No other colours on the cloth, no crest, no crown, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Luong img-skill-nhieu-anh-moi-cau, muc 5b: ta HINH HOC, khong goi 'English flag' (de keo ve Union Jack). Moc 1606 DA DOI CHIEU: Flag Institute, 'Union Flag history' — tuyen cao 1606 cua James I; truoc do tau Anh treo 'the Red Cross only as they were wont'. Truoc day co nay bi BO theo dieu kien chan cu (_raSoatSkill4d.10) — Tu yeu cau them lai.

### C1-03 · `place` · ✅ có trên Flow

**Tên card:** Timber Settlement Ref Three Cottages

**Lời kể (`at`):** It was England's **second attempt at a lasting colony** in the New World.

**Ý đồ:** Thuoc dia luc CON NGUYEN — trang thai goc de cap voi C1-16 (luat 5 + cap dau-cuoi skill 4b)

**🖼️ Ảnh sẽ ra:** Một khu định cư nhỏ nhìn thẳng chính diện: đúng BA ngôi nhà khung gỗ mái rạ dốc đứng cạnh nhau trên nền cát nhạt, mỗi nhà một cửa ra vào và một cửa sổ nhỏ; phía SAU dãy nhà là hàng rào cọc gỗ cao đầu vót nhọn chạy hết chiều ngang, vài cây thông cao nhô lên sau hàng rào. Không người, không vật nuôi, không khói, không cờ, không mặt trời, không chữ. Là ASSET GỐC cho C1-16 (làng bị tháo dỡ).

**🔍 Cần soi khi ra ảnh:** Đúng 3 nhà. Hàng rào phải nằm sau nhà (để C1-16 còn thấy móng). Ảnh neo 01 từng lẫn tia nắng sang ảnh ra.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Timber Settlement Ref Three Cottages` — dùng lại ở: C1-16

**Prompt gửi Flow:**

```text
A small English settlement of 1587 seen straight on: exactly three small timber-framed cottages with steep thatched roofs standing side by side on pale sandy ground, each with one plain doorway and one small window. Behind the cottages a straight palisade fence of tall wooden posts cut to points at the top runs across the whole width, and a few tall pine trees rise above the fence. No people, no animals, no smoke, no flags, no sun, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `07-croatoan-03.jpg`, `08-white-depictions-01.jpeg`, `03-fort-raleigh-04.jpg`

**Ghi chú:** Hang rao DAT PHIA SAU nha (khac assets.json cu dat phia truoc) de C1-16 con thay mong nha. Ca hai dieu co y ve khac khao co: cong trinh that o Roanoke la luy dat, va hang rao nam 1587 chua chac da co (README refs/case-1). Giu hang rao vi loi ke 'a post of the fence'.

### C1-03b · `object` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Old Globe Turned Toward The Americas

**Lời kể (`at`):** It was England's second attempt at a lasting colony **in the New World**.

**Ý đồ:** Tu yeu cau 2026-09-13: anh cho cum 'in the New World' (o anh 8 — cum khai niem). VAT TUONG TRUNG cho cum do, KHONG phai do vat cua doan thuoc dia (D07). Muc tieu 'nguoi xem doc ra chau My' la dieu CAN KIEM khi ra anh, chua do (D05)

**🖼️ Ảnh sẽ ra:** Một quả địa cầu cổ thế kỷ 16 trên chân đế gỗ, có vòng kinh tuyến bằng đồng ôm nửa quả cầu, xoay sao cho Bắc Mỹ và Nam Mỹ nằm chính giữa mặt cầu hướng về người xem, chỉ một mép mỏng châu Âu và châu Phi lộ ở rìa phải; đất liền nâu nhạt phẳng, biển xanh nhạt phẳng. Không chữ, không tên, không nhãn, không hình tàu hay thuỷ quái, không lưới kinh vĩ, không người, không mặt trời. Là VẬT TƯỢNG TRƯNG cho cụm "Tân Thế Giới", không phải đồ vật của đoàn thuộc địa.

**🔍 Cần soi khi ra ảnh:** Châu Mỹ có nằm chính giữa và nhận ra được không — mục tiêu cần kiểm, chưa đo. Địa cầu cổ thật thường có chữ và hình trang trí — model có thể tự thêm.

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co anh dia cau the ky 16 trong refs/case-1 — gom anh dia cau thoi ky roi doi chieu dang chan de, vong dong truoc khi chay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An old globe from the 1500s on a wooden stand with a brass half ring around it, turned so that North America and South America face the viewer in the middle of the globe, with only a thin edge of Europe and Africa showing at the right edge, the land in flat pale brown and the sea in flat pale blue. No lettering, no names, no labels, no drawings of ships or sea creatures, no grid lines, no people, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Luong img-skill-nhieu-anh-moi-cau, muc 5c. Chon vat cu the thay bieu tuong mo ho. | D07: VAT TUONG TRUNG — hau ky phai dat vat nay TACH khoi canh co nhan vat (khung hoac nhan minh hoa) de khong doc thanh do vat nhan vat mang theo. D05: doi huong — chau My chinh giua (v1 dat Dai Tay Duong o giua, choi voi tieu chi duyet).

### C1-04 · `group` · 🔁 ảnh cũ trên Flow mang tên cũ — cần tạo lại

**Tên card:** Young Mother Holding Swaddled Baby

**Lời kể (`at`):** On August 18th that year, White's daughter Eleanor **gave birth to a girl named Virginia Dare**, the first English child ever born on American soil.

**Ý đồ:** Dua tre Anh dau tien sinh o chau My — va la chau ngoai cua White, se duoc nhac lai o cuoi

**🖼️ Ảnh sẽ ra:** Một phụ nữ trẻ khoảng hai mươi tư tuổi ngồi trên ghế đẩu gỗ, vẽ nguyên người, ôm đứa bé sơ sinh quấn chặt trong vải trắng áp vào ngực, cúi nhìn con. Cô mặc váy dài xanh lá sẫm có thân áo thắt dây, cổ xếp nếp trắng nhỏ, tạp dề trắng, khăn trùm trắng trên tóc nâu. Em bé chỉ lộ khuôn mặt nhỏ. Không giường, không người khác, không chữ. (Eleanor Dare và Virginia Dare — prompt không gọi tên.)

**🔍 Cần soi khi ra ảnh:** Ảnh neo 03 (năm đàn ông) có thể kéo thêm người vào khung. Câu tỷ lệ 'người lớn cao 6,5 đầu' có thể làm em bé ra như người lớn thu nhỏ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `03-five-men-group.png`

**Prompt gửi Flow:**

```text
A young woman of about twenty-four sitting on a plain wooden stool, seen full length from head to shoes, holding a newborn baby wrapped snugly in white cloth against her chest and looking down at it. She wears a long plain dark green gown with a laced bodice, a small white ruff at her neck, a white apron, and a white linen coif over brown hair. The baby is swaddled so that only its small face shows. No bed, no other people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `08-white-depictions-01.jpeg`

**Ghi chú:** Luat 3: Eleanor duoc goi ten + sinh con. Kind GROUP chu khong phai character: me + con la hai nguoi, cau 'Only one person' cua character se chien voi dua be (skill 4d-9b). Khong co chan dung Eleanor/Virginia — trang phuc theo nguoi phu nu dung giua ban khac le rua toi. Khong tao asset vi khong co canh nao sinh lai tu co; cau 'his own family' o cuoi dung lai CHINH anh nay o hau ky. | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh. Anh cu da tao tren Flow ten 'Young Mother Holding Swaddled Newborn' (co 'gentle smile') — doi outName de tao lai.

### C1-05 · `object` · ✅ có trên Flow

**Tên card:** Empty Provision Barrel

**Lời kể (`at`):** The colony was **running desperately short on food**.

**Ý đồ:** Het luong — ly do White phai ve Anh

**🖼️ Ảnh sẽ ra:** Một thùng gỗ đựng lương thực thế kỷ 16 đứng thẳng, đai sắt trơn, nắp tròn đã nhấc ra dựng nghiêng vào thân thùng, bên trong trống rỗng. Không chữ, không dấu.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An empty wooden provision barrel from the 1500s standing upright, bound with plain iron hoops, its round lid lifted off and leaning against its side, nothing at all inside. No lettering, no marks. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-06 · `group` · 🔁 ảnh cũ trên Flow mang tên cũ — cần tạo lại

**Tên card:** Colonists Pleading Before The Governor

**Lời kể (`at`):** **The settlers begged White** to sail back to England for more supplies.

**Ý đồ:** Dan thuoc dia VAN NAI — nguoi noi la dan, nguoi nghe la White (luat 8)

**🖼️ Ảnh sẽ ra:** Vẽ lại CHÍNH ông White từ asset C1-02 (giữ nguyên mặt), giờ đứng nguyên người: cùng mũ và áo chẽn, thêm quần ống túm sẫm tới gối và ủng da nâu cao, đang lắng nghe. Đối diện ông là ba người dân chắp tay trước ngực van nài: một phụ nữ váy dài sẫm, tạp dề trắng, khăn trùm trắng; một thanh niên gầy áo chẽn nâu, mũ nồi dẹt; một ông già hói áo chẽn xám. Cả bốn nguyên người. Nét vẽ gọi theo ảnh neo 03. Không chữ.

**🔍 Cần soi khi ra ảnh:** Mặt White có giống C1-02 không. Bốn người có bị xếp thành hàng ngang như ảnh neo 03 (mất quan hệ đối diện) không. Ảnh cũ ĐÃ TẠO trên Flow dưới tên "Colonists Pleading With The Governor" (White có vẻ mặt lo lắng) — bản này đổi tên để tạo lại.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02), `@03-five-men-group.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, now standing and seen full length from head to shoes, wearing the same hat and doublet with dark knee-length breeches and tall brown leather boots, listening, while three English colonists of the 1580s stand facing him and plead with their hands clasped in front of them: a woman in a long dark gown with a white apron and a white coif, a thin young man in a plain brown doublet and flat cap, and a bald older man in a grey doublet, all seen full length from head to shoes, in the same drawing style as @03-five-men-group.png, no lettering anywhere, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `08-white-depictions-01.jpeg`

**Ghi chú:** Luat 8 + skill 4d-9b (nhieu nguoi -> group). Anh neo 03 vi phan tu moi la BA NGUOI (4d-9d, thu nghiem). | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh. Van nai giu nguyen vi loi ke noi 'begged'.

### C1-06b · `object` · ⏸ chưa tạo

**Tên card:** Stack Of Barrels And Sacks

**Lời kể (`at`):** The settlers begged White to sail back to England **for more supplies**.

**Ý đồ:** Thu ho can — hang tiep te White phai ve Anh lay (o anh 4, vat duoc goi ten). Chi la thu duoc noi toi, KHONG khang dinh hang da co

**🖼️ Ảnh sẽ ra:** Một đống hàng tiếp tế thế kỷ 16 xếp chung thành một khối: ba thùng gỗ đai sắt, hai bao vải đầy buộc miệng, một hòm gỗ đóng kín. Không chữ, không dấu, không nhãn, không người, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Model hay vẽ chữ hoặc dấu nung lên thùng, bao — soi chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small pile of supplies from the 1500s: three wooden barrels bound with iron hoops, two plump tied cloth sacks of grain and one closed wooden crate, stacked together as one heap. No lettering, no marks, no labels, no people, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Chua co anh tu lieu hang hoa the ky 16 trong refs/case-1 — vat chung, cung muc voi thung rong C1-05.

### C1-06c · `place` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Ocean Map Between Two Coasts

**Lời kể (`at`):** The settlers begged White to **sail back to England** for more supplies.

**Ý đồ:** Hai trinh ve Anh — quang duong White phai vuot (o anh 6, dia ly). Su kien nam 1587 nen CHI ve duong bo, KHONG ranh gioi quoc gia doi sau (skill 4d-bis 4a)

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng nhìn từ trên xuống, Bắc Đại Tây Dương: bờ đông Bắc Mỹ dọc mép trái, bờ biển Anh, Ireland và Tây Âu dọc mép phải, biển rộng ở giữa. Chỉ vẽ đường bờ biển, không vẽ ranh giới quốc gia. Nước Anh (phần phía nam đảo Anh) tô đỏ phẳng, có chữ "ENGLAND"; biển xanh nhạt có chữ "ATLANTIC OCEAN"; đất liền khác màu be nhạt. Không tiêu đề, không tên khác, không số, không la bàn, không thước tỷ lệ, không lưới, không mũi tên, không tàu. Mũi tên hải trình và chấm Roanoke Tú gắn ở hậu kỳ.

**🔍 Cần soi khi ra ảnh:** Chính tả "ENGLAND", "ATLANTIC OCEAN"; model có tự thêm tên nước hay tiêu đề không; hình bờ biển Anh và Bắc Mỹ có đọc ra không; không được có ranh giới quốc gia hiện đại (sự kiện năm 1587).

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co BAN DO THAM CHIEU Bac Dai Tay Duong (bo dong Bac My + Anh, Tay Au) trong refs/case-1 — gom roi doi shot sang chip @ (skill 4d-bis 4a); chua co thi KHONG chay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple flat map seen straight from above of the North Atlantic Ocean: the east coast of North America along the left edge and the coasts of Britain, Ireland and western Europe along the right edge, with open ocean between them. Draw only coastlines, with no country borders. England, the southern part of the island of Great Britain, is filled with one flat red colour and labelled "ENGLAND" in plain capital letters, the ocean is flat pale blue labelled "ATLANTIC OCEAN" in plain capital letters, and the rest of the land is plain pale beige. Spell every name exactly as written here. No title, no other names, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no ships, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Tu chap nhan chu trong anh ban do (2026-09-13). outName khong chua ten dia danh vi duong draw go outName vao prompt.

### C1-07 · `object` · ✅ có trên Flow

**Tên card:** Sailing Ship Ref Three Masts

**Lời kể (`at`):** **He left on August 27th**, 1587, promising to return quickly.

**Ý đồ:** Con tau cua White ra di — asset tau dung lai cho canh bi giu o cang va canh bao

**🖼️ Ảnh sẽ ra:** Một con tàu buồm Anh thập niên 1580 nhìn ngang: thân gỗ nâu sẫm, lâu đuôi cao, mũi tàu nhô thấp hơn, một dải viền đỏ-vàng dọc mép trên thân, đúng BA cột buồm căng buồm vuông no gió, chỉ vài dây chằng đơn giản. Không cờ, không chữ, không huy hiệu, không người, không nước. Là ASSET GỐC cho C1-11 (tàu bị giữ ở cảng) và C1-23 (tàu trong bão).

**🔍 Cần soi khi ra ảnh:** Đúng 3 cột buồm, không có chữ/huy hiệu trên thân (bản dựng lại Golden Hind có chữ ER và huy hiệu con nai).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Sailing Ship Ref Three Masts` — dùng lại ở: C1-11, C1-15b, C1-23

**Prompt gửi Flow:**

```text
An English sailing ship of the 1580s seen from the side: a dark brown wooden hull with a high raised stern castle and a lower raised bow, a thin band of plain red and yellow trim along the top edge of the hull, exactly three masts with square sails set and filled with wind, and only a few simple rigging lines. No flags, no lettering, no crest, no people, no water. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `06-elizabethan-ship-01.jpg`, `06-elizabethan-ship-02.jpg`

**Ghi chú:** Theo ban dung lai tau Golden Hind (than toi, vien soc do-vang, lau duoi cao). Tau cua White nam 1587 khong phai Golden Hind — day la hinh dang tau cung thoi, khong phai tau that cua doan. Ra so cot buom (skill 6c).

### C1-08 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor Promising With Hand On Chest

**Lời kể (`at`):** He left on August 27th, 1587, **promising to return quickly**.

**Ý đồ:** White HUA quay lai som — loi hua ma ca vu se pha vo

**🖼️ Ảnh sẽ ra:** Vẽ lại White từ asset C1-02, chân dung ngang ngực, tay phải áp phẳng lên ngực như đang hứa sẽ quay lại. Cùng mũ và áo chẽn. Chỉ một người.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, seen from the chest up with his right hand pressed flat against his chest as he makes a promise, wearing the same hat and doublet, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Luat 8, NHUNG khong ve nguoi nghe: dan thuoc dia da co o C1-06 ngay truoc (dieu kien chan chung). | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh.

### C1-09 · `object` · ⏸ chưa có trên Flow

**Tên card:** Fleet Of Spanish Galleons

**Lời kể (`at`):** **The Spanish Armada was threatening England**, and Queen Elizabeth banned any seaworthy ship from leaving port.

**Ý đồ:** Ly do tau khong duoc di: ham doi Tay Ban Nha dang doe doa nuoc Anh

**🖼️ Ảnh sẽ ra:** Hạm đội năm chiến thuyền galleon Tây Ban Nha năm 1588 cùng giong buồm theo một đường cong rộng, nhìn ngang; mỗi chiếc có lâu đuôi cao chạm trổ và buồm vuông trơn. Không cờ có chữ, không chữ, không pháo nổ, không khói, không nước, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Năm chiếc có chồng lấp nhau tới mức hậu kỳ khó dùng không. Chưa có ảnh tư liệu hạm đội Armada — hình tàu đang dựa theo tàu Anh cùng thời.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A fleet of five large Spanish galleons of 1588 sailing together in a wide curved line, seen from the side, each with a tall ornate stern castle and plain square sails. No flags with writing, no lettering, no cannon fire, no smoke, no water, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** D04 (luong img-skill-nhieu-anh-moi-cau): bo dau thap do tren buom — chua co tai lieu xac nhan mau co/buom dai dien cho Armada 1588. Chua co anh tu lieu ham doi Armada.

### C1-09b · `place` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Sea Map Of Western Europe

**Lời kể (`at`):** The Spanish Armada was **threatening England**, and Queen Elizabeth banned any seaworthy ship from leaving port.

**Ý đồ:** Ham doi Tay Ban Nha de doa nuoc Anh — dat hai nuoc len cung mot ban do (o anh 6). Thay cho o co Tay Ban Nha da bo vi khong co mau co xac nhan dung vai tro

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng vùng Tây Âu quanh eo biển Anh: nửa nam đảo Anh ở trên, bờ biển Pháp bên dưới bên kia eo biển hẹp, bán đảo Iberia ở góc dưới trái, Đại Tây Dương bên trái. Chỉ vẽ đường bờ biển, không ranh giới quốc gia. Nước Anh tô đỏ phẳng có chữ "ENGLAND"; bán đảo Iberia tô vàng sẫm có chữ "SPAIN"; biển xanh nhạt; đất liền khác màu be. Không tiêu đề, không tên khác, không số, không la bàn, không thước tỷ lệ, không lưới, không mũi tên, không tàu. Mũi tên hướng hạm đội Tú gắn ở hậu kỳ.

**🔍 Cần soi khi ra ảnh:** Chính tả "ENGLAND", "SPAIN"; hình eo biển Anh và bán đảo Iberia; model có tự thêm FRANCE, PORTUGAL hay ranh giới hiện đại không.

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co BAN DO THAM CHIEU Tay Au (eo bien Anh, ban dao Iberia) trong refs/case-1 — gom roi doi sang chip @; chua co thi KHONG chay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple flat map seen straight from above of western Europe around the English Channel: the southern half of Great Britain at the top, the coast of France below it across the narrow channel, and the Iberian Peninsula at the bottom left, with the Atlantic Ocean on the left. Draw only coastlines, with no country borders. England is filled with one flat red colour and labelled "ENGLAND", and the Iberian Peninsula is filled with one flat dark yellow colour and labelled "SPAIN" in its middle, both in plain capital letters. The sea is flat pale blue and the rest of the land plain pale beige. Spell every name exactly as written here. No title, no other names, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no ships, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Ca ban dao Iberia to mau 'SPAIN' vi nam 1588 vua Tay Ban Nha Philip II cung cai tri Bo Dao Nha (lien minh Iberia 1580-1640) — hieu biet chung, chua dan nguon.

### C1-10 · `character` · ⏸ chưa có trên Flow

**Tên card:** Pale Queen With Lace Ruff

**Lời kể (`at`):** The Spanish Armada was threatening England, and **Queen Elizabeth banned** any seaworthy ship from leaving port.

**Ý đồ:** Nguoi ra lenh cam tau — mot nguoi co that duoc goi ten va lam mot viec quyet dinh ca vu (luat 3)

**🖼️ Ảnh sẽ ra:** Chân dung ngang ngực một phụ nữ ngoài năm mươi: mặt trắng bệch như phủ phấn, trán cao, lông mày mảnh cong, mũi dài hẹp, môi mỏng nhỏ; tóc xoăn tít màu cam đỏ búi cao quanh mặt, cài chuỗi ngọc trai và đá quý nhỏ. Cổ ren trắng rất lớn dựng xoè quanh cổ, váy đen phủ chuỗi ngọc trai và dây chuyền vàng nạm đá, sau vai là đôi cánh voan mỏng nhạt. Một tay chìa ra tờ văn bản gấp có niêm sáp đỏ, trống chữ. (Nữ hoàng Elizabeth I — prompt không gọi tên.)

**🔍 Cần soi khi ra ảnh:** Nhận ra được là Elizabeth I không (tóc đỏ + cổ ren + mặt trắng). Model có tự thêm vương miện hay chữ lên văn bản không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A woman in her mid fifties seen from the chest up. A very pale, white-powdered face with a high forehead, thin arched eyebrows, a long narrow nose and small thin lips. Tightly curled reddish-orange hair dressed high around the face and set with strings of pearls and small jewels. A very large stiff white lace ruff standing open around her neck, a black gown covered in ropes of pearls and gold jewelled chains, and sheer pale gauze wings rising behind her shoulders. In one hand she holds out a folded document closed with a red wax seal, completely blank: no writing, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `05-elizabethan-dress-01.jpg`, `05-elizabethan-dress-03.jpg`

**Ghi chú:** Luat 3: anh DUNG TUOI — hai chan dung c.1585-90 (Ermine portrait va ban Hever), ba luc cam tau 1588 khoang 55 tuoi. Khong goi ten trong prompt (SPEC-v2 muc 1). Van ban cam tay thay cho tu the gio tay: 'raising his right hand' tung bi bo loc Flow chan (SHOT-LIST luat 9). | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh.

### C1-11 · `object` · ⏸ chưa có trên Flow

**Tên card:** Ship Moored With Sails Furled

**Lời kể (`at`):** The Spanish Armada was threatening England, and Queen Elizabeth banned any seaworthy ship **from leaving port**.

**Ý đồ:** Tau BI GIU o cang — trang thai moi cua chinh con tau C1-08

**🖼️ Ảnh sẽ ra:** Vẽ lại CHÍNH con tàu C1-07, giờ buộc cập sát một cầu cảng gỗ trơn: dây neo to chạy từ thân tàu tới hai cọc gỗ trên cầu cảng, toàn bộ buồm đã cuộn gọn buộc vào xà. Nét theo ảnh neo 01. Không người, không chữ, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Tàu có còn giống C1-07 (viền đỏ-vàng, 3 cột) không. Thử nghiệm gọi tên ảnh neo 01 — soi có lẫn hình kim tự tháp/tia nắng không.

**Sinh bằng:** câu @mention — chip `@Sailing Ship Ref Three Masts` (asset từ C1-07), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same ship as in @Sailing Ship Ref Three Masts, now tied up alongside a plain wooden quay with thick mooring ropes running from the hull to two wooden posts on the quay, all of its sails furled and bound up on the yards, in the same drawing style as @01-pyramid-place.png, no people, no lettering, no sun, plain white background
```

**Ghi chú:** Luat 6: day buoc tau vao coc cau cang la cho noi, khong phai hai vat roi. Anh neo 01 vi phan tu moi la cau cang (thu nghiem).

### C1-12 · `group` · ⏸ chưa có trên Flow

**Tên card:** Governor Explaining The Signal

**Lời kể (`at`):** Before he'd left, he and the colonists had **agreed on a signal**.

**Ý đồ:** Hai ben THOA THUAN am hieu truoc khi White di — chia khoa de hieu canh cuoi

**🖼️ Ảnh sẽ ra:** Vẽ lại White nguyên người (mũ, áo chẽn, quần tới gối, ủng da nâu cao), đang gõ một ngón tay vào lòng bàn tay kia như đang giải thích cẩn thận. Đối diện là hai người dân gật đầu: một người đàn ông vạm vỡ râu đen, áo chẽn xanh xám; một phụ nữ váy dài vàng mù tạt, tạp dề trắng, khăn trùm trắng. Cả ba nguyên người. Nét theo ảnh neo 03. Không chữ.

**🔍 Cần soi khi ra ảnh:** Cố ý khác ba người dân ở C1-06. Soi như C1-06: mặt White, bố cục đối diện.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02), `@03-five-men-group.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, now standing and seen full length from head to shoes, wearing the same hat and doublet with dark knee-length breeches and tall brown leather boots, tapping one finger on the palm of his other hand as he explains something carefully, while two English colonists of the 1580s stand facing him and nod: a broad man with a black beard in a slate-blue doublet and a woman in a long mustard-brown gown with a white apron and a white coif, all seen full length from head to shoes, in the same drawing style as @03-five-men-group.png, no lettering anywhere, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Luat 8. Dan thuoc dia o day co y KHAC nguoi o C1-06 (115 nguoi vo danh, khong ai can nhan ra la cung mot nguoi). Anh neo 03, thu nghiem.

### C1-13 · `object` · ⏸ chưa có trên Flow

**Tên card:** Pointed Post Ref Blank Carved Panel

**Lời kể (`at`):** If they were forced to relocate, they would **carve the name of their destination** into a tree or post.

**Ý đồ:** Cho khac ten noi den — de hau ky dien chu. Asset cot dung lai cho C1-14 va C1-20

**🖼️ Ảnh sẽ ra:** Một cây cột gỗ cao to làm từ thân cây, dựng đứng, đầu vót nhọn. Ở tầm đầu người có một mảng nhẵn màu nhạt chỗ vỏ cây bị bóc đi — mảng đó TRỐNG TRƠN: không chữ, không vết khắc, không vết cào, không dấu thập. Không dây, không đinh, không gì khác. Là ASSET GỐC cho C1-14 và C1-20; chữ CROATOAN Tú điền vào mảng trống ở hậu kỳ.

**🔍 Cần soi khi ra ảnh:** Model hay tự bịa chữ hoặc nét khắc nguệch ngoạc vào chỗ trống.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Pointed Post Ref Blank Carved Panel` — dùng lại ở: C1-14, C1-20

**Prompt gửi Flow:**

```text
A single tall thick wooden post made from a tree trunk, standing upright, its top cut to a point. At about head height a smooth pale patch has been cut into the post where the bark was peeled away. The patch is completely blank: no letters, no words, no carving marks, no scratches, no cross. No rope, no nails, nothing else in the frame. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `07-croatoan-03.jpg`

**Ghi chú:** Chu CROATOAN PHAI de trong (skill 6i). Cho boc vo o tam dau nguoi theo ban khac Sheppard; ban tuong thuat 1590 cua White (Hakluyt) ghi cot bi boc vo va chu khac cach dat khoang 5 feet — DA DOI CHIEU 2026-09-13 (Encyclopedia Virginia, ban in 1600): 'one of the chiefe trees or postes at the right side of the entrance had the barke taken off, and 5. foote from the ground ... was graven CROATOAN'.

### C1-13b · `object` · ⏸ chưa tạo

**Tên card:** Small Carving Knife With Wooden Handle

**Lời kể (`at`):** If they were forced to relocate, **they would carve** the name of their destination into a tree or post.

**Ý đồ:** Vat ngam trong dong tu 'carve' (o anh 3) — cong cu de khac ten. Nguon khong noi cong cu gi: ve dao don gian, khong gan nhan vat, khong khang dinh do la dao cua dan thuoc dia

**🖼️ Ảnh sẽ ra:** Một con dao khắc nhỏ thế kỷ 16 nằm phẳng: lưỡi thép ngắn đầu nhọn trơn, cán gỗ trơn quấn một vòng dây. Không máu, không chữ, không dấu, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Dao đứng riêng, không có tay người, không máu. Bộ lọc Flow có thể nhạy với dao — bị chặn thì đổi thành "a small wood-carving chisel".

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small carving knife from the 1500s lying flat: a short pointed plain steel blade and a plain wooden handle bound with a band of cord. No blood, no lettering, no marks, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Vat chung, chua co anh tu lieu dao thoi ky trong refs/case-1.

### C1-14 · `object` · ⏸ chưa có trên Flow

**Tên card:** Post With A Carved Cross

**Lời kể (`at`):** If they left under distress, they'd **carve a cross beside it**.

**Ý đồ:** Trang thai 'roi di vi nguy' cua am hieu. Hau ky dung lai o cau 'There was no cross beside it' kem dau X do

**🖼️ Ảnh sẽ ra:** Vẽ lại ĐÚNG cây cột C1-13, thêm một dấu thập khắc sâu vào gỗ ngay cạnh mảng bóc vỏ (hai rãnh thẳng cắt nhau vuông góc); mảng bóc vỏ vẫn trống chữ. Đây là ám hiệu 'rời đi vì gặp nguy' — hậu kỳ dùng lại ở câu 'There was no cross beside it' kèm dấu X đỏ.

**🔍 Cần soi khi ra ảnh:** Cột phải giống C1-13, chỉ thêm dấu thập.

**Sinh bằng:** câu @mention — chip `@Pointed Post Ref Blank Carved Panel` (asset từ C1-13). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same post as in @Pointed Post Ref Blank Carved Panel, keep everything about it the same, and add one plain cross cut deep into the wood right beside the blank pale patch, two straight grooves crossing at right angles, the patch itself still completely blank with no letters, plain white background
```

**Ghi chú:** Luat 5 (hai trang thai cua cung mot vat). Khong goi anh neo: dau thap la bien doi tren chinh vat da co, khong phai phan tu moi.

### C1-15 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor Wading Ashore

**Lời kể (`at`):** On August 18th, 1590, his granddaughter's third birthday, **White landed again**.

**Ý đồ:** White TRO LAI sau ba nam — trang thai moi cua nhan vat (luat 2)

**🖼️ Ảnh sẽ ra:** Vẽ lại White nguyên người, đang bước từ vùng nước nông lên bãi cát, mắt nhìn về phía trước; cùng mũ, áo chẽn, quần tới gối, ủng da nâu cao ướt tới đầu gối. Cảnh White quay lại sau ba năm.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, now seen full length from head to shoes stepping out of shallow water onto a sandy beach and looking ahead, wearing the same hat and doublet with dark knee-length breeches and tall brown leather boots wet to the knee, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** 'his granddaughter's third birthday' KHONG ve Virginia 3 tuoi: khong ai biet em con song (luat 7, gioi han bang chung) — hau ky gan chu. | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh.

### C1-15b · `object` · ⏸ chưa tạo

**Tên card:** Ship Riding At Anchor Offshore

**Lời kể (`at`):** On August 18th, 1590, his granddaughter's third birthday, White **landed again**.

**Ý đồ:** White tro lai 1590: tau lon tha neo ngoai khoi (o anh 3, vat ngam trong 'landed'). Khac C1-11 (tau bi giu o cang Anh)

**🖼️ Ảnh sẽ ra:** Vẽ lại con tàu C1-07, giờ thả neo: toàn bộ buồm cuộn gọn trên xà, một sợi dây neo thẳng chạy từ mũi tàu xuống mặt nước phẳng lặng. Nét theo ảnh neo 01. Không người, không chữ, không mặt trời. Người lên bờ bằng thuyền nhỏ — hậu kỳ dùng lại hình C1-01b.

**🔍 Cần soi khi ra ảnh:** Tàu có giữ đặc điểm C1-07 (viền đỏ-vàng, 3 cột) không; phải KHÁC C1-11 (tàu buộc ở cầu cảng) — ở đây không có cầu cảng.

**Sinh bằng:** câu @mention — chip `@Sailing Ship Ref Three Masts` (asset từ C1-07), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same ship as in @Sailing Ship Ref Three Masts, now lying at anchor with all of its sails furled on the yards and one straight anchor rope running down from its bow into flat calm water, in the same drawing style as @01-pyramid-place.png, no people, no lettering, no sun, plain white background
```

**Ghi chú:** Asset tau la hinh dung chung, khong phai tau that cua chuyen 1590. Anh neo 01 goi ten vi phan tu moi la mat nuoc (thu nghiem, skill 4d-9d).

### C1-16 · `place` · ⏸ chưa có trên Flow

**Tên card:** Settlement Taken Apart

**Lời kể (`at`):** **The colony was empty**.

**Ý đồ:** Nha bi THAO DO CAN THAN — khong bi dot, khong bi pha. Cung khung voi C1-03, chi khac cho nha

**🖼️ Ảnh sẽ ra:** Vẽ lại ĐÚNG khu làng C1-03, cùng góc nhìn, nhưng ba ngôi nhà không còn: chỗ nhà từng đứng chỉ còn nền cát trống phẳng — không tường, không mái, không đổ nát, không gỗ vụn, không vết cháy; hàng rào cọc và hàng thông phía sau vẫn đứng nguyên. Không người, không thuyền, không chữ, không mặt trời. Đặt cạnh C1-03 là thấy chỉ khác đúng chỗ nhà.

**🔍 Cần soi khi ra ảnh:** THỬ NGHIỆM sinh B từ A: bố cục có khớp C1-03 không. Lệch thì viết lại bằng prompt chữ độc lập.

**Sinh bằng:** câu @mention — chip `@Timber Settlement Ref Three Cottages` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same settlement as in @Timber Settlement Ref Three Cottages from exactly the same viewpoint, but the three cottages are gone: the pale sandy ground where each cottage stood is left bare and flat, with no walls, no roofs, no rubble, no broken timbers and no burn marks, while the same palisade fence and the same pine trees still stand behind, no people, no boats, no lettering, no sun, plain white background
```

**Ghi chú:** Luat 5 + skill 4b cap dau-cuoi. DA DOI CHIEU tuong thuat White 1590 (Encyclopedia Virginia, ban in 1600): 'the houses taken downe' va 'the place very strongly enclosed with a high palisado of great trees' -> hang rao VAN DUNG. v1 ve 'khung mong go chu nhat' — tuong thuat KHONG nhac mong/go (cung tieu chi Codex D02) nen bo, chi de nen trong. Sinh B TU A la phuong an CHUA DO.

### C1-17 · `object` · ⏸ chưa có trên Flow

**Tên card:** Chest Dug Up And Rifled

**Lời kể (`at`):** The houses had been carefully taken apart, their **belongings dug up and rifled through**.

**Ý đồ:** Do dac bi dao len va luc tung — KHONG ve ai dao (khong ai biet)

**🖼️ Ảnh sẽ ra:** Một cái rương gỗ thế kỷ 16 bị đào lên được một nửa, nằm trong hố đất cát vừa đào, nắp bị phá bật ngửa ra sau; vài mảnh vải nhàu và mấy tờ giấy trắng rời vương ra cát. Giấy trống trơn. Không người, không dụng cụ, không chữ. (Cố ý không vẽ ai đào — không ai biết.)

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A wooden storage chest from the 1500s half dug out of a freshly dug hole in pale sandy soil, its lid broken open and thrown back, a few plain crumpled cloths and loose blank pages spilling out onto the loose sand. The pages are completely blank: no writing, no drawings. No people, no tools, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `07-croatoan-03.jpg`

**Ghi chú:** Ban khac Sheppard co nguoi dang quy ben ruong mo nap. Luat 7: khong them nguoi dao — ai dao la khoang trong cua ca vu. | DA DOI CHIEU tuong thuat 1590: 'five Chests ... digged up againe and broken up'; sach cua White bi xe khoi bia — trang giay roi vuong ra khop nguon.

### C1-18 · `object` · ⏸ chưa có trên Flow

**Tên card:** Small Wooden Rowing Boat

**Lời kể (`at`):** **Not a single boat remained** on the shore.

**Ý đồ:** Thu KHONG CON — hau ky dat dau X do len (skill 4c). Dung chung HINH VE thuyen C1-01b de thong nhat, KHONG khang dinh cung chiec thuyen lich su (D02)

**🖼️ Ảnh sẽ ra:** Vẽ lại chiếc thuyền theo đúng hình C1-01b (cùng dáng, cùng màu) để thống nhất hình vẽ trong video, giờ đứng một mình, trống, không bãi cát, không nước, hai mái chèo gác ngang. Không người, không chữ, nền trắng. Hậu kỳ đè dấu X đỏ cho câu "không còn một chiếc thuyền nào". KHÔNG khẳng định đây là cùng chiếc thuyền năm 1587 — chỉ dùng chung hình vẽ.

**🔍 Cần soi khi ra ảnh:** Có giống thuyền C1-01b không.

**Sinh bằng:** câu @mention — chip `@Rowing Boat Ref Pulled Up On Sand` (asset từ C1-01b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same boat as in @Rowing Boat Ref Pulled Up On Sand, keep its shape and colours exactly the same, now shown on its own and empty with no sand and no water around it, the two oars resting across it, no people, no lettering, plain white background
```

**Ghi chú:** Doi 2026-09-13 (luong img-skill-nhieu-anh-moi-cau): sinh tu asset thuyen C1-01b de THONG NHAT HINH VE, khong khang dinh cung hien vat lich su (Codex D02). Tuong thuat White 1590 chi ghi khong thay dau vet thuyen. Chua tao anh nen giu outName.

### C1-19 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor Staring At Something

**Lời kể (`at`):** And **carved into a post of the fence**, one word. CROATOAN.

**Ý đồ:** White NHIN THAY chu khac — hau ky dat cot C1-20 ben phai

**🖼️ Ảnh sẽ ra:** Vẽ lại White nguyên người, xoay người sang phải, nhìn chằm chằm vào một thứ ngang tầm mắt ngay ngoài mép khung, một tay giơ về phía đó với lòng bàn tay mở. Cùng mũ, áo chẽn, quần tới gối, ủng. Hậu kỳ đặt cây cột C1-20 vào chỗ ông đang nhìn.

**🔍 Cần soi khi ra ảnh:** Động tác giơ tay từng bị bộ lọc Flow chặn (A1-08 giơ tay tuyên thệ). Nếu bị từ chối thì đổi thành tay chỉ về phía trước.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, now seen full length from head to shoes, turned to his right and staring at something at eye level just out of the picture, one hand raised toward it with the palm open, wearing the same hat and doublet with dark knee-length breeches and tall brown leather boots, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Tu the theo ban khac Sheppard (White giua tranh, tay mo huong ve chu khac). Nguoi va cot la hai phan tu roi, khong dinh vi tuong doi (SHOT-LIST luat 2). | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh. Ban khac Sheppard chi can cu cho TU THE; tuong thuat White 1590 khong xac nhan 'sung so' (Codex r2). Sua `at` thieu chu CROATOAN cho khop C1-20.

### C1-20 · `object` · ⏸ chưa có trên Flow

**Tên card:** Blank Post Standing In Palisade

**Lời kể (`at`):** And carved into a post of the fence, **one word. CROATOAN**.

**Ý đồ:** Cot tim thay la MOT COT CUA HANG RAO, cho khac trong de hau ky dien CROATOAN, va KHONG co dau thap

**🖼️ Ảnh sẽ ra:** Vẽ lại ĐÚNG cây cột C1-13 (mảng bóc vỏ vẫn trống), giờ đứng làm một cây trong một đoạn hàng rào cọc nhọn cao thẳng hàng, ngay cạnh một khoảng hở làm lối vào; mảng trống quay ra phía người xem. Không dấu thập, không chữ, không người, không mặt trời. Nét theo ảnh neo 01. Hậu kỳ điền chữ CROATOAN.

**🔍 Cần soi khi ra ảnh:** Cây cột chính phải nổi bật giữa các cọc khác (mảng bóc vỏ thấy rõ). Thử nghiệm gọi tên ảnh neo 01.

**Sinh bằng:** câu @mention — chip `@Pointed Post Ref Blank Carved Panel` (asset từ C1-13), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same post as in @Pointed Post Ref Blank Carved Panel, keep it exactly the same with its pale patch still completely blank, now standing as one post in a short straight row of tall pointed palisade posts, right beside an open gap in the fence, the blank patch facing the viewer, no cross anywhere, no letters, no carving marks, in the same drawing style as @01-pyramid-place.png, no people, no sun, plain white background
```

**Ghi chú:** Luat 6: 'a post of the fence' — cot la mot phan cua hang rao. Canh loi vao: ban tuong thuat 1590 ghi cot o ben phai loi vao (da doi chieu tuong thuat White 1590, Encyclopedia Virginia). Anh neo 01, thu nghiem.

### C1-21 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor With A Hopeful Look

**Lời kể (`at`):** To White, **that looked like good news**.

**Ý đồ:** White TIN la tin tot — cam xuc cua nhan vat, khong phai su that ve so phan dan thuoc dia

**🖼️ Ảnh sẽ ra:** Vẽ lại White chân dung ngang ngực, vai thả lỏng, lông mày nhướng lên, cười nhẹ đầy hy vọng. Cùng mũ và áo chẽn. Chỉ một người.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, seen from the chest up, his shoulders relaxing and his eyebrows lifted with a small hopeful smile, wearing the same hat and doublet, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** D09 (vong 3): GIU nu cuoi hy vong — loi ke noi 'To White, that looked like good news'; Codex r2 dan tuong thuat White 1590 ghi ong vui khi thay dau hieu.

### C1-22 · `place` · ⏸ chưa có trên Flow

**Tên card:** Low Sandy Island With Pines

**Lời kể (`at`):** It meant everyone had **relocated safely to nearby Croatoan Island**.

**Ý đồ:** Dao Croatoan — noi White TIN ho da toi. Ve KHONG nguoi

**🖼️ Ảnh sẽ ra:** Một hòn đảo cát dài và thấp nhìn ngang qua vùng nước nông: đụn cát màu nhạt, vài cây thông cong vẹo vì gió, bụi cây thấp rải rác dọc đảo. Không người, không nhà, không thuyền, không khói, không hải đăng, không mặt trời, không chữ. (Đảo Croatoan — CỐ Ý không có dân thuộc địa.)

**🔍 Cần soi khi ra ảnh:** Model có tự thêm người hoặc thuyền không. Prompt ghi 'nền trắng' mà có vùng nước — xem nước có tràn kín khung không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A long low sandy island seen from the side across shallow water: pale dunes, a few scattered wind-bent pine trees and patches of low scrub along its length. No people, no houses, no boats, no smoke, no lighthouse, no sun, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `04-roanoke-coast-06.jpg`, `07-croatoan-01.jpg`

**Ghi chú:** Luat 7 + cau ra soat 9: 'It meant everyone had relocated safely' la suy doan cua White. Ve dan thuoc dia tren dao la bien suy doan thanh su that. 07-croatoan-01 la Cape Hatteras hom nay co ngon hai dang hien dai — cam tuong minh.

### C1-22b · `place` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Coastal Map With Two Islands Marked

**Lời kể (`at`):** It meant everyone had relocated safely to **nearby Croatoan Island**.

**Ý đồ:** Noi White TIN dan thuoc dia da chuyen toi — dat dao Roanoke va Croatoan len cung ban do (o anh 6). Dung lai cho cau 'nearby Hatteras Island' (NPS: Croatoan la Hatteras ngay nay)

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng một đoạn bờ biển North Carolina: đất liền dọc mép trái, vùng vịnh nông rộng ở giữa có một đảo nhỏ nằm gần đất liền, bên phải là chuỗi đảo chắn dài và mảnh ngăn vịnh với biển. Đảo nhỏ trong vịnh tô đỏ phẳng có chữ "ROANOKE"; phần phía nam của đảo chắn dài, chỗ đảo gập thành mũi nhọn, tô cam phẳng có chữ "CROATOAN"; vịnh và biển xanh nhạt; đất khác màu be. Chỉ vẽ đường bờ, không ranh giới bang, không đường sá. Không tiêu đề, không tên khác, không số, không la bàn, không thước tỷ lệ, không lưới, không mũi tên.

**🔍 Cần soi khi ra ảnh:** Chính tả "ROANOKE", "CROATOAN"; vị trí: Roanoke nằm TRONG vịnh gần đất liền, Croatoan là phần nam đảo chắn gần mũi Hatteras. Đường bờ năm 1590 khác ngày nay (các cửa lạch đã đổi) — chấp nhận làm bản đồ định vị.

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co BAN DO THAM CHIEU vung Outer Banks (dao Roanoke, dao Hatteras) trong refs/case-1 — gom roi doi sang chip @. Ban do John White 1585 (01-john-white-02) co Roanoac va Croatoan nhung chu viet tay co -> khong dung lam chip.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple flat map seen straight from above of a stretch of the North Carolina coast: the mainland along the left, a wide shallow sound in the middle with a small island inside it near the mainland, and a long thin chain of barrier islands along the right side separating the sound from the open ocean. The small island in the sound is filled with one flat red colour and labelled "ROANOKE", and the southern part of the long barrier island, where it bends at a sharp cape, is filled with one flat orange colour and labelled "CROATOAN", both in plain capital letters. The sound and the ocean are flat pale blue and the rest of the land plain pale beige. Draw only coastlines, with no state borders and no roads. Spell every name exactly as written here. No title, no other names, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no ships, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** NPS (brochure Fort Raleigh) xac dinh Croatoan la dao Hatteras ngay nay — nguon Codex dan o luong img-skill-nhieu-anh-moi-cau r3. Pham vi 'phan nam' la uoc luong. Loi ke 'It meant everyone had relocated safely' la suy doan cua White: ban do chi ve VI TRI, khong ve nguoi hay duong di.

### C1-23 · `object` · ⏸ chưa có trên Flow

**Tên card:** Ship Tossed In A Storm

**Lời kể (`at`):** But just as he prepared to sail there and check, **a hurricane tore through the area**.

**Ý đồ:** Bao pha ke hoach — chinh con tau cua White o trang thai nguy

**🖼️ Ảnh sẽ ra:** Vẽ lại con tàu C1-07, giờ nghiêng hẳn sang một bên trên những con sóng dốc cao màu sẫm, buồm rách bay phần phật. Nét theo ảnh neo 01. Không người, không sét, không mặt trời, không chữ.

**🔍 Cần soi khi ra ảnh:** Tàu có giữ đặc điểm C1-07 không. Sóng trên nền trắng có đọc ra là bão không.

**Sinh bằng:** câu @mention — chip `@Sailing Ship Ref Three Masts` (asset từ C1-07), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same ship as in @Sailing Ship Ref Three Masts, now heeled far over to one side on huge steep dark waves, its sails torn and flapping, in the same drawing style as @01-pyramid-place.png, no people, no lightning, no sun, no lettering, plain white background
```

**Ghi chú:** Anh neo 01 vi phan tu moi la song bien (thu nghiem).

### C1-24 · `object` · ⏸ chưa có trên Flow

**Tên card:** Snapped Anchor Cable

**Lời kể (`at`):** His ship's **anchor cable snapped** in the storm, leaving only a spare anchor in waters full of hidden rocks, and the crew refused to risk a wreck.

**Ý đồ:** Day neo DUT — chi tiet cu the khien tau khong the o lai

**🖼️ Ảnh sẽ ra:** Một đoạn dây neo gai thô, to, thế kỷ 16 bị đứt đôi; đầu đứt tưa ra thành các sợi rời. Chỉ có đoạn dây và đầu đứt — không mỏ neo, không tàu, không nước, không chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A length of thick hemp anchor cable from the 1500s snapped in two, its broken end frayed apart into loose unravelled strands. Only the rope and its broken end, no anchor, no ship, no water, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-25 · `object` · ⏸ chưa có trên Flow

**Tên card:** Single Iron Anchor

**Lời kể (`at`):** His ship's anchor cable snapped in the storm, **leaving only a spare anchor** in waters full of hidden rocks, and the crew refused to risk a wreck.

**Ý đồ:** Chi con MOT cai neo du phong — hau ky co the gan so 1

**🖼️ Ảnh sẽ ra:** Một mỏ neo sắt thế kỷ 16 nằm phẳng: thân dài thẳng, hai cánh cong đầu nhọn, vòng khuyên trên đỉnh, một thanh ngang bằng gỗ ngay dưới vòng khuyên. Không dây, không xích, không nước, không chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A single iron ship's anchor of the 1500s lying flat: a long straight shank, two curved arms ending in pointed flukes, a ring at the top and a wooden crossbar just below the ring. No rope, no chain, no water, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-25b · `place` · ⏸ chưa tạo

**Tên card:** Jagged Rocks Under Calm Water

**Lời kể (`at`):** His ship's anchor cable snapped in the storm, leaving only a spare anchor in **waters full of hidden rocks**, and the crew refused to risk a wreck.

**Ý đồ:** Vung nuoc day da ngam — ly do thuy thu khong dam o lai voi mot neo du phong (o anh 5). Hinh cat ngang de doc ra chu 'hidden'

**🖼️ Ảnh sẽ ra:** Hình cắt ngang vùng nước nông nhìn từ bên hông: một đường mặt nước thẳng phẳng chạy ngang cả khung, bên dưới là mấy khối đá ngầm sẫm lởm chởm mọc từ đáy lên sát mặt nước, đỉnh đá nằm ngay dưới mép nước; nước xanh xám nhạt phẳng. Không tàu, không thuyền, không người, không cá, không chữ, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Đá phải nằm DƯỚI mặt nước (đọc ra "ngầm"); model có tự thêm tàu hay sóng không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A cut-away side view of shallow sea water: one straight flat water surface line runs across the whole picture, and below it several jagged dark rocks rise from the sea floor to just under the surface, their tops hidden a little below the waterline, the water drawn in flat pale grey-green. No ship, no boat, no people, no fish, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Vung bien Outer Banks noi tieng bai can — loi ke goi la 'hidden rocks', ve theo loi ke.

### C1-26 · `group` · ⏸ chưa có trên Flow

**Tên card:** Sailors Refusing The Governor

**Lời kể (`at`):** His ship's anchor cable snapped in the storm, leaving only a spare anchor in waters full of hidden rocks, and **the crew refused to risk a wreck**.

**Ý đồ:** Thuy thu TU CHOI — nguoi noi la thuy thu, nguoi nghe la White (luat 8)

**🖼️ Ảnh sẽ ra:** Vẽ lại White nguyên người (mũ, áo chẽn, quần tới gối, ủng) đang đứng nghe. Đối diện là hai thuỷ thủ thế kỷ 16 mặc áo vải buồm trắng ngà rộng, quần vải bạt ống túm, mũ len đan, khoanh tay và lắc đầu từ chối. Cả ba nguyên người. Nét theo ảnh neo 03. Không chữ.

**🔍 Cần soi khi ra ảnh:** Chưa có ảnh tư liệu thuỷ thủ thế kỷ 16 — trang phục đang tả theo hiểu biết chung.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02), `@03-five-men-group.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, now standing and seen full length from head to shoes, wearing the same hat and doublet with dark knee-length breeches and tall brown leather boots, listening, while two sailors of the 1500s in loose off-white canvas shirts, baggy canvas breeches and knitted wool caps stand facing him with their arms folded, shaking their heads, all seen full length from head to shoes, in the same drawing style as @03-five-men-group.png, no lettering anywhere, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Chua co anh tu lieu thuy thu the ky 16 — trang phuc thuy thu ta theo hieu biet chung (stillMissing). Anh neo 03, thu nghiem. | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh. Loi ke khong noi White cau xin — chi noi thuy thu tu choi.

### C1-26b · `place` · ⏸ chưa tạo · ⏳ chờ tư liệu

**Tên card:** Open Ocean Map With Island Group

**Lời kể (`at`):** The storm blew them completely off course, and by the time they spotted land again, they were **near the Azores**, off the coast of Spain.

**Ý đồ:** Bao day tau dat toi Azores (o anh 6). Dat Azores DUNG vi tri giua Dai Tay Duong, khong theo cach noi long 'off the coast of Spain' cua loi ke

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng Bắc Đại Tây Dương: bờ đông Bắc Mỹ dọc mép trái, bờ châu Âu và tây bắc châu Phi dọc mép phải, và một cụm chín hòn đảo nhỏ nằm giữa biển, cách châu Âu khoảng một phần tư quãng đường sang châu Mỹ. Cụm đảo tô đỏ phẳng có chữ "AZORES"; biển xanh nhạt có chữ "ATLANTIC OCEAN"; đất liền màu be. Chỉ vẽ đường bờ, không ranh giới quốc gia. Không tiêu đề, không tên khác, không số, không la bàn, không thước tỷ lệ, không lưới, không mũi tên, không tàu. Mũi tên tàu dạt Tú gắn ở hậu kỳ.

**🔍 Cần soi khi ra ảnh:** Chính tả "AZORES", "ATLANTIC OCEAN"; cụm Azores phải nằm GIỮA biển, xa bờ châu Âu — KHÔNG sát bờ Tây Ban Nha như lời kể nói lỏng ("off the coast of Spain").

**⏳ Chờ tư liệu — chưa chạy shot này:** Chua co BAN DO THAM CHIEU Bac Dai Tay Duong co quan dao Azores trong refs/case-1 — gom roi doi sang chip @; chua co thi KHONG chay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple flat map seen straight from above of the North Atlantic Ocean: the east coast of North America along the left edge, the coasts of Europe and north-west Africa along the right edge, and a small group of nine islands far out in the ocean, about a quarter of the way across from Portugal towards America. The small island group is filled with one flat red colour and labelled "AZORES", and the ocean is flat pale blue labelled "ATLANTIC OCEAN", both in plain capital letters. Draw only coastlines, with no country borders. The land is plain pale beige. Spell every name exactly as written here. No title, no other names, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no ships, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Azores co 9 dao, cach bo Bo Dao Nha hon 1.300 km — hieu biet chung, chua dan nguon. KHONG ghi nhan SPAIN de ban do khong dat Azores thanh 'sat bo Tay Ban Nha'.

### C1-27 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor Looking Back From Ship Rail

**Lời kể (`at`):** They had **no choice but to turn back** for England.

**Ý đồ:** White BUOC bo cuoc — trang thai moi cua nhan vat (luat 2). Duong tau dat toi Azores la ban do hau ky

**🖼️ Ảnh sẽ ra:** Vẽ lại White từ thắt lưng trở lên, đứng ở lan can gỗ của con tàu, ngoái nhìn qua vai. Cùng mũ và áo chẽn. Cảnh White buộc phải bỏ cuộc quay về Anh.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face exactly the same, seen from the waist up standing at the wooden rail of a ship and looking back over his shoulder, wearing the same hat and doublet, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Lan can tau chi la cho dung cua nguoi -> khong goi anh neo (4d-9d). | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh.

### C1-28 · `character` · ⏸ chưa có trên Flow

**Tên card:** Governor Grown Old Sitting Alone

**Lời kể (`at`):** He died years later, **never learning what happened** to his own family.

**Ý đồ:** Nhieu nam sau, White van khong biet gia dinh minh ra sao — trang thai cuoi cua nhan vat

**🖼️ Ảnh sẽ ra:** White nhiều năm sau: mặt vẫn nhận ra được nhưng già hơn hẳn, tóc và râu bạc trắng, má hóp; ngồi một mình trên ghế gỗ trơn, vẽ nguyên người, đầu trần, chiếc mũ vành rộng đặt trên đầu gối; mặc áo chẽn sẫm, quần tới gối, tất, giày bệt. Chỉ một người. (Cho câu 'không bao giờ biết chuyện gì đã xảy ra với gia đình' — CỐ Ý không vẽ cái chết.)

**🔍 Cần soi khi ra ảnh:** Bảo model vừa 'giữ mặt' vừa 'già đi' — xem có còn nhận ra là White không.

**Sinh bằng:** câu @mention — chip `@Bearded Governor Ref Wide Brim Hat` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Bearded Governor Ref Wide Brim Hat, keep his face recognisably the same but now many years older, his hair and beard turned white and his cheeks thinner, sitting alone on a plain wooden chair and seen full length from head to shoes, bareheaded with the same wide-brimmed hat resting on his knee, wearing a plain dark doublet, dark knee-length breeches, stockings and flat shoes, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Luat 2 ap cho trang thai 'song ma khong biet'. KHONG ve cai chet (noi, cach chet khong ro — luat 7). Gia dinh: hau ky dung lai C1-04. | D09 (luong img-skill-nhieu-anh-moi-cau vong 3): bo net mat/dang nguoi truyen tam trang khong co nguon — net mat trung tinh la mac dinh.

### C1-29 · `figure` · ⏸ chưa có trên Flow

**Tên card:** Explorer Writing In A Journal

**Lời kể (`at`):** Centuries afterward, **one explorer wrote** that the native people on nearby Hatteras Island had ancestors described as having pale skin and gray eyes.

**Ý đồ:** Day la dieu mot nguoi VIET LAI, khong phai dieu da duoc chung minh — ve hanh vi viet (luat 8)

**🖼️ Ảnh sẽ ra:** Chân dung ngang ngực một nhà thám hiểm người Anh đầu thế kỷ 18 đang viết vào cuốn nhật ký mở bằng bút lông ngỗng; mặc áo khoác dài màu nâu, khăn quàng cổ trắng, đội mũ ba góc, tóc dài ngang vai buộc ra sau. Trang giấy trống trơn: không chữ, không dòng kẻ, không hình vẽ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Chưa có ảnh tư liệu trang phục đầu thế kỷ 18. Model hay vẽ chữ lên trang nhật ký.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
An English explorer of the early 1700s seen from the chest up, writing in an open journal with a quill pen, wearing a long brown coat, a plain white neckcloth and a three-cornered hat over shoulder-length hair tied back. The pages are completely blank: no lettering, no lines, no drawings. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Loi ke khong goi ten nguoi nay nen khong thuoc luat 3. CHUA CO anh tu lieu trang phuc dau the ky 18 trong refs/case-1 — ta theo hieu biet chung (stillMissing).

### C1-30 · `figure` · ⏸ chưa có trên Flow

**Tên card:** Algonquian Woman In Deerskin Mantle

**Lời kể (`at`):** Centuries afterward, one explorer wrote that **the native people on nearby Hatteras Island** had ancestors described as having pale skin and gray eyes.

**Ý đồ:** Nguoi ban dia vung Hatteras — ve TRUNG TINH, khong ve 'da nhat mat xam' thanh su that

**🖼️ Ảnh sẽ ra:** Chân dung từ thắt lưng trở lên một phụ nữ Algonquian vùng Carolina thập niên 1580, đứng điềm tĩnh, hai tay buông xuôi: tóc sẫm cắt mái bằng ngang trán, búi thấp sau gáy; khoác áo choàng da hươu có tua, quấn qua hai vai và khép kín trước ngực; nhiều chuỗi hạt sẫm dài quanh cổ. Không chữ. Chỉ một người. (Theo tranh màu nước John White vẽ năm 1585, CỐ Ý thêm áo choàng che kín ngực.)

**🔍 Cần soi khi ra ảnh:** Vẽ trang nghiêm, không kỳ dị hoá. Không có chi tiết 'mắt xám/da nhạt' — cố ý.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A Carolina Algonquian woman of the 1580s seen from the waist up, standing calmly with her arms at her sides. Her dark hair is cut in a straight fringe across the forehead and tied in a low knot at the back of her head. She wears a fringed deerskin mantle wrapped over both shoulders and closed across her chest, and long strings of dark beads around her neck. No lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-john-white-07.jpg`

**Ghi chú:** Toc mai bang, bui thap sau gay, chuoi hat theo tranh mau nuoc CHINH John White ve 1585 (vo mot thu linh o Pomeiooc). CO Y VE KHAC: ban goc de tran phan tren — them ao choang da huou kin nguc cho cong kiem tien YouTube (skill muc 11e). Cau ra soat 9: mau mat/da la dieu nha tham hiem VIET, khong ve.

### C1-31 · `object` · ⏸ chưa có trên Flow

**Tên card:** Grave Mound With Wooden Cross

**Lời kể (`at`):** But not one skeleton, **one grave**, or one piece of solid archaeological proof of those hundred and fifteen people has ever turned up.

**Ý đồ:** Thu KHONG BAO GIO tim thay — hau ky dat dau X do

**🖼️ Ảnh sẽ ra:** Một nấm mộ đất cát thấp, trơn, một đầu cắm cây thập tự làm từ hai que buộc vào nhau. Không chữ, không xương, không hoa, không mặt trời. Hậu kỳ đè dấu X đỏ cho câu 'không một ngôi mộ nào'.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A plain low mound of sandy earth with a simple cross made of two sticks tied together pushed into the soil at one end. No lettering, no bones, no flowers, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-32 · `place` · ⏸ chưa có trên Flow

**Tên card:** Empty Excavation Pit

**Lời kể (`at`):** But not one skeleton, one grave, or one piece of **solid archaeological proof** of those hundred and fifteen people has ever turned up.

**Ý đồ:** Tim kiem khao co hang the ky ma khong ra gi — hau ky dat dau X do hoac de trong

**🖼️ Ảnh sẽ ra:** Một hố khai quật khảo cổ hình vuông đào trong đất cát nhạt, bốn mép căng dây buộc vào cọc gỗ ở bốn góc, đáy hố phẳng và trống trơn; một chiếc bay thợ nề nhỏ đầu nhọn cắm đứng trong đất tơi ở một góc. Không người, không xương, không đồ vật trong hố, không chữ, không mặt trời. Hậu kỳ đè dấu X đỏ hoặc để trống cho câu 'không một bằng chứng khảo cổ nào'.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A square archaeological excavation pit dug into pale sandy soil, its four edges marked out with taut string tied to wooden pegs at the corners, the bottom of the pit flat and completely empty, and a small pointed mason's trowel stuck upright in the loose soil at one corner. No people, no bones, no objects in the pit, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-32b · `place` · ⏸ chưa tạo

**Tên card:** Grassy Earthwork Ramparts Under Pines

**Lời kể (`at`):** **Not to this day**.

**Ý đồ:** 'Den tan hom nay' — noi dat thuoc dia hom nay chi con luy dat va rung, khong loi giai (o anh 5)

**🖼️ Ảnh sẽ ra:** Di tích Fort Raleigh ngày nay nhìn từ lối vào: hai gờ luỹ đất thấp tròn phủ cỏ và lá khô nâu hai bên khoảng trống lối vào, bên trong là khoảng đất cỏ phẳng được bao bởi một gờ đất cỏ thấp, xung quanh là rừng thông và sồi cao. Không người, không biển báo, không hàng rào, không nhà, không chữ, không mặt trời.

**🔍 Cần soi khi ra ảnh:** Model có tự thêm biển báo có chữ, người tham quan, hàng rào không. Đây là cảnh HÔM NAY, không được trộn với làng 1587 (C1-03).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
The low grass-covered earth ramparts of an old earthwork fort today, seen from its entrance: two rounded earth banks covered in grass and fallen brown leaves frame a gap, beyond them a flat grassy clearing enclosed by a low grassy bank, and tall pine and oak trees rise all around the clearing. No people, no signs, no fences, no buildings, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `03-fort-raleigh-01.jpg`, `03-fort-raleigh-04.jpg`

**Ghi chú:** Theo anh 03-fort-raleigh-01 (loi vao giua hai go luy phu la kho, khoang co ben trong, rung thong soi). Bo hai coc go va cay cot o giua anh (hien vat trung bay hom nay). Cong su dat nay thuong duoc cho la cua doan 1585, khong chac cua doan 1587 — hau ky KHONG ghi day la lang thuoc dia (hieu biet chung, chua dan nguon).
