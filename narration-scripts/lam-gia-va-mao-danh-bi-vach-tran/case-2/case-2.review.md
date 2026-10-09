# Review prompt ảnh — Forgeries and Impostors Exposed

Sinh bằng `scripts/review_shots.py` từ `case-2.shots.json` + `case-2.jobs.json`. Prompt dưới đây là **nguyên văn** gửi Flow. Cột *Lời kể* là trường `at`; chữ in đậm là `cue`.

**Trạng thái:** 77/77 ảnh đã tạo (theo log: output/run-lamgia-c2-a.log, trường `daTao` trong case-2.shots.json, kiểm Flow lúc 2026-10-09 04:27 UTC).

**Mọi ảnh trong file này:** Mọi ảnh vẽ theo nét của ba ảnh neo phong cách Tú gửi — viền mực đen dày không đều, tô màu phẳng, gạch chì thấy nét, nền trắng trơn — khổ 16:9. Người có MẶT ĐƠN GIẢN: mắt chấm nhỏ, mũi ngắn, miệng một nét (hoặc hình mở khi đang nói/cười), không đổ bóng trên mặt. Shot vẽ bằng CHỮ thì runner tự đính một ảnh neo theo loại (một người → 02, nhóm → 03, đồ vật/nơi chốn → 01). Shot @MENTION chỉ dùng ảnh được gọi tên trong câu. HIỆN VẬT THẬT (hàm, mảnh sọ, sọ Taung) có ảnh chụp trong refs/case-2 — lúc dựng có thể chèn ảnh thật cạnh bản vẽ. Hộp sọ và sọ hoá thạch KHÔNG dùng làm thumbnail.

## Bảng tổng

| Mã | Lời kể (`at`) | Loại | Tên card | Sinh bằng | Trạng thái |
|---|---|---|---|---|---|
| C2-01 | **Charles Dawson was a lawyer** in the small town of Uckfield, in Sussex, in the south of England. | `character` | Collector Ref Bald Dome Big Moustache | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-01b | Charles Dawson was a lawyer in the small town of Uckfield, in Sussex, **in the south of England**. | `place` | England Map With Southern County In Red | chip @ | ✅ có trên Flow |
| C2-01c | Charles Dawson was a lawyer in **the small town of Uckfield**, in Sussex, in the south of England. | `character` | Lawyer Reading Ribboned Documents At Desk | chip @ | ✅ có trên Flow |
| C2-02 | In his spare time, he was a well-known **amateur collector of antiquities**. | `character` | Collector Studying Flint Tool Through Magnifier | chip @ | ✅ có trên Flow |
| C2-03 | He found **Roman figurines**, Stone Age hand axes, and ancient wooden boats, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex." | `object` | Small Green Bronze Robed Figurine | chữ + ảnh neo | ✅ có trên Flow |
| C2-03b | He found Roman figurines, **Stone Age hand axes**, and ancient wooden boats, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex." | `object` | Pear Shaped Flint Hand Axe | chữ + ảnh neo | ✅ có trên Flow |
| C2-03c | He found Roman figurines, Stone Age hand axes, and **ancient wooden boats**, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex." | `object` | Long Dugout Canoe From One Tree Trunk | chữ + ảnh neo | ✅ có trên Flow |
| C2-03d | He found Roman figurines, Stone Age hand axes, and ancient wooden boats, so many remarkable things that **the newspapers nicknamed him** "the Wizard of Sussex." | `object` | Three Folded Old Newspapers Blank Front Page | chữ + ảnh neo | ✅ có trên Flow |
| C2-04 | According to Dawson, sometime around 1908, a workman digging gravel on **the grounds of Barkham Manor**, near the village of Piltdown, handed him a piece of a skull. | `place` | Red Brick Georgian Manor With Pond | chữ + ảnh neo | ✅ có trên Flow |
| C2-04b | According to Dawson, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, **near the village of Piltdown**, handed him a piece of a skull. | `place` | Gravel Trench Ref Hedge Edge | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-04c | According to Dawson, sometime around 1908, **a workman digging gravel** on the grounds of Barkham Manor, near the village of Piltdown, handed him a piece of a skull. | `figure` | Farm Labourer Digging Gravel With Spade | chip @ | ✅ có trên Flow |
| C2-04d | **According to Dawson**, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, near the village of Piltdown, handed him a piece of a skull. | `character` | Collector Talking With Open Hand | chip @ | ✅ có trên Flow |
| C2-04e | According to Dawson, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, near the village of Piltdown, **handed him a piece of a skull**. | `object` | Skull Fragment Ref Reddish Brown | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-05 | Dawson said the workmen had smashed an entire skull, thinking it was **a fossilized coconut**. | `object` | Whole Brown Coconut In Husk | chữ + ảnh neo | ✅ có trên Flow |
| C2-06 | Over the following years, he **picked up a few more fragments**. | `object` | Four Reddish Brown Skull Pieces Apart | chip @ | ✅ có trên Flow |
| C2-07 | In February 1912, **Dawson wrote to Arthur Smith Woodward**, the Keeper of Geology at the Natural History Museum in London. | `character` | Collector Writing Letter With Dip Pen | chip @ | ✅ có trên Flow |
| C2-07b | In February 1912, Dawson wrote to Arthur Smith Woodward, **the Keeper of Geology** at the Natural History Museum in London. | `character` | Keeper Ref Beard Pince Nez | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-07c | In February 1912, Dawson wrote to Arthur Smith Woodward, the Keeper of Geology at **the Natural History Museum in London**. | `place` | Victorian Museum Front Two Spired Towers | chữ + ảnh neo | ✅ có trên Flow |
| C2-08 | That summer, the 2 men went digging in the gravel pit, along with **a young French Jesuit priest**. | `figure` | Young Priest Ref Black Cassock | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-08b | That summer, the 2 men **went digging in the gravel pit**, along with a young French Jesuit priest. | `group` | Three Men Sifting Gravel By Hedge | chip @ | ✅ có trên Flow |
| C2-09 | They found more pieces of skull, teeth, **stone tools, and the bones of ancient animals**. | `object` | Wooden Tray Of Brown Finds | chữ + ảnh neo | ✅ có trên Flow |
| C2-10 | The most important pieces, more of the skull and **half of a lower jaw**, were all found by Dawson alone. | `object` | Jaw Ref Two Flat Molars | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-10b | The most important pieces, more of the skull and half of a lower jaw, were all **found by Dawson alone**. | `character` | Collector Crouching Alone Holding Bone Piece | chip @ | ✅ có trên Flow |
| C2-12 | At first glance, it looked almost exactly like **the jaw of a young chimpanzee**. | `object` | Young Chimpanzee Sitting In Profile | chữ + ảnh neo | ✅ có trên Flow |
| C2-13 | But **its 2 molars were worn flat**, the way human teeth wear down from chewing. | `object` | Close View Two Flat Topped Molars | chip @ | ✅ có trên Flow |
| C2-13b | But its 2 molars were worn flat, **the way human teeth wear down from chewing**. | `figure` | Man Biting Into Slice Of Bread | chữ + ảnh neo | ✅ có trên Flow |
| C2-14 | On December 18th, 1912, at a meeting of the Geological Society of London, **Woodward announced a new species** of early human. | `group` | Keeper At Lectern Before Five Gentlemen | chip @ | ✅ có trên Flow |
| C2-16 | **His reconstruction showed a skull** much like a modern human's, with a brain about two-thirds the size of ours, attached to the jaw of an ape. | `object` | Reconstructed Skull Ref Plaster Patches | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-16b | His reconstruction showed a skull much like a modern human's, with a brain about **two-thirds the size of ours**, attached to the jaw of an ape. | `object` | Two Simple Brains Small And Large | chữ + ảnh neo | ✅ có trên Flow |
| C2-17 | It fit perfectly with what **many experts in England believed** at the time, that as our ancestors became human, the brain grew large first and everything else followed. | `group` | Three Edwardian Scientists Talking | chữ + ảnh neo | ✅ có trên Flow |
| C2-18 | The newspapers called it **the missing link between apes and humans**. | `object` | Iron Chain With One Link Missing | chữ + ảnh neo | ✅ có trên Flow |
| C2-19 | In 1913, **the young priest found** a canine tooth in the same gravel pit, and Woodward said it fit the jaw perfectly. | `figure` | Young Priest Holding Up A Small Tooth | chip @ | ✅ có trên Flow |
| C2-19b | In 1913, the young priest found **a canine tooth** in the same gravel pit, and Woodward said it fit the jaw perfectly. | `object` | Single Pointed Canine Tooth Grey Brown | chữ + ảnh neo | ✅ có trên Flow |
| C2-19c | In 1913, the young priest found a canine tooth in the same gravel pit, and **Woodward said it fit the jaw perfectly**. | `character` | Keeper Talking With Open Hands | chip @ | ✅ có trên Flow |
| C2-20 | That same year, **an anatomy professor at King's College London** argued in the journal Nature that this was simply an ape's jaw lying next to a human skull. | `figure` | Lecturer With Wire Spectacles Raising Finger | chữ + ảnh neo | ✅ có trên Flow |
| C2-20b | That same year, an anatomy professor at King's College London **argued in the journal Nature** that this was simply an ape's jaw lying next to a human skull. | `object` | Thin Science Journal With Blank Cover | chữ + ảnh neo | ✅ có trên Flow |
| C2-21 | A few **scientists in France and America** thought the same. | `place` | World Map Two Countries In Red | chip @ | ✅ có trên Flow |
| C2-23 | In 1915, Dawson reported finding **a second skull**, which became known as Piltdown 2, at another site about 2 miles away. | `object` | Two Skull Pieces And One Molar | chip @ | ✅ có trên Flow |
| C2-23b | In 1915, Dawson reported finding a second skull, which became known as Piltdown 2, at **another site about 2 miles away**. | `place` | Open Field With Hedgerows And Gate | chữ + ảnh neo | ✅ có trên Flow |
| C2-28 | For decades afterward, Piltdown Man **appeared in textbooks**, in museums, and in more than 250 scientific papers. | `object` | Open Textbook With Skull Drawing | chữ + ảnh neo | ✅ có trên Flow |
| C2-28b | For decades afterward, Piltdown Man appeared in textbooks, **in museums**, and in more than 250 scientific papers. | `object` | Glass Museum Case With Skull On Stand | chip @ | ✅ có trên Flow |
| C2-28c | For decades afterward, Piltdown Man appeared in textbooks, in museums, and in **more than 250 scientific papers**. | `object` | Tall Stack Of Scientific Papers | chữ + ảnh neo | ✅ có trên Flow |
| C2-29 | In 1924, **an anatomist in South Africa** announced the fossil of a young ancient ape-human with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown. | `place` | Southern Africa Map With Country In Red | chip @ | ✅ có trên Flow |
| C2-29c | In 1924, an anatomist in South Africa announced the fossil of **a young ancient ape-human** with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown. | `object` | Small Fossil Skull Ref Pale Face | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-29b | In 1924, an anatomist in South Africa **announced the fossil** of a young ancient ape-human with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown. | `figure` | Young Anatomist Holding Small Fossil Skull | chip @ | ✅ có trên Flow |
| C2-31 | In the late 1940s, **Kenneth Oakley**, a geologist at the Natural History Museum, tried out a new technique. | `character` | Geologist Ref Long Face Tweed | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-31b | In the late 1940s, Kenneth Oakley, a geologist at the Natural History Museum, **tried out a new technique**. | `character` | Geologist Holding Up Test Tube At Bench | chip @ | ✅ có trên Flow |
| C2-32 | He measured **how much fluorine** the bones had absorbed from the soil over time. | `object` | Glass Vials Of Powder Beside Bone Sample | chữ + ảnh neo | ✅ có trên Flow |
| C2-32b | He measured how much fluorine the bones had **absorbed from the soil over time**. | `object` | Ground Cut Away With Buried Bone | chữ + ảnh neo | ✅ có trên Flow |
| C2-34 | In 1953, **Joseph Weiner**, an anthropologist at Oxford University, began talking over the Piltdown puzzle with Oakley. | `character` | Anthropologist Ref Thick Dark Glasses | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-34b | In 1953, Joseph Weiner, an anthropologist at Oxford University, began **talking over the Piltdown puzzle** with Oakley. | `group` | Two Scholars Talking Face To Face | chip @ | ✅ có trên Flow |
| C2-34c | In 1953, Joseph Weiner, **an anthropologist at Oxford University**, began talking over the Piltdown puzzle with Oakley. | `place` | Round Domed Stone Library Building | chữ + ảnh neo | ✅ có trên Flow |
| C2-35 | Weiner **went back through the reports** and the casts of the fossils, and he noticed that the 2 molars were worn down just a little too evenly, as if someone had ground them with something. | `character` | Scholar Studying Plaster Jaw Cast | chip @ | ✅ có trên Flow |
| C2-36 | His team took some chimpanzee teeth, **filed them down**, and stained them. | `character` | Scholar Filing A White Tooth At Bench | chip @ | ✅ có trên Flow |
| C2-36b | His team **took some chimpanzee teeth**, filed them down, and stained them. | `object` | Four Loose Pale Ape Teeth | chữ + ảnh neo | ✅ có trên Flow |
| C2-36c | His team took some chimpanzee teeth, filed them down, **and stained them**. | `object` | Tooth Soaking In Dish Of Brown Stain | chữ + ảnh neo | ✅ có trên Flow |
| C2-37 | The result looked **almost identical to Piltdown**. | `object` | Two Matching Brown Flat Topped Teeth | chữ + ảnh neo | ✅ có trên Flow |
| C2-38 | Then they put the real Piltdown teeth **under a microscope**, and the file marks were plain to see. | `character` | Geologist Looking Into Microscope | chip @ | ✅ có trên Flow |
| C2-38b | Then they put the real Piltdown teeth under a microscope, and **the file marks were plain to see**. | `object` | Round Microscope View Of Scratched Tooth | chữ + ảnh neo | ✅ có trên Flow |
| C2-39 | **X-rays showed** that no new dentin had grown in beneath the worn surface, which meant the wear hadn't happened while the owner of those teeth was alive. | `object` | Dark X-Ray Film Of One Molar | chữ + ảnh neo | ✅ có trên Flow |
| C2-41 | **Piltdown Man was a patchwork**. | `object` | Skull Parts Pulled Apart | chip @ | ✅ có trên Flow |
| C2-42 | The skull came from a human who had **lived in the Middle Ages**. | `figure` | Medieval Man In Brown Hooded Tunic | chữ + ảnh neo | ✅ có trên Flow |
| C2-43 | **The jaw came from an orangutan** that had died about 500 years earlier. | `object` | Sitting Orangutan Reddish Hair | chữ + ảnh neo | ✅ có trên Flow |
| C2-44 | There were also **a few fossil chimpanzee teeth**. | `object` | Three Dark Brown Fossil Ape Teeth | chữ + ảnh neo | ✅ có trên Flow |
| C2-45 | Everything had been stained with **an iron solution and chromic acid** to make it look ancient. | `object` | Two Glass Bottles Of Brown Stain | chữ + ảnh neo | ✅ có trên Flow |
| C2-46 | And the 2 flat, humanlike molars that had turned an ape's jaw into the missing link had been **filed down by hand**. | `object` | Hands Filing Teeth Of Jaw | chip @ | ✅ có trên Flow |
| C2-47 | For decades, **the list of suspects kept growing**. | `symbol` | Row Of Six Grey Silhouettes Of Men | chữ + ảnh neo | ✅ có trên Flow |
| C2-48 | Then in 2016, after 8 years of research, **a team from the Natural History Museum** and Liverpool John Moores University published their conclusion. | `group` | Three Modern Scientists Studying Bone Fragments | chữ + ảnh neo | ✅ có trên Flow |
| C2-49 | There had been **only one forger**. | `symbol` | One Grey Silhouette Of A Man In Bowler | chữ + ảnh neo | ✅ có trên Flow |
| C2-50b | The methods used on Piltdown 1 and Piltdown 2 were the same, from the way the bones were stained, to **the gravel packed into their cracks**, to the dental putty used to fix the teeth in place. | `object` | Bone Crack Packed With Gravel Grains | chip @ | ✅ có trên Flow |
| C2-50c | The methods used on Piltdown 1 and Piltdown 2 were the same, from the way the bones were stained, to the gravel packed into their cracks, to **the dental putty used to fix the teeth in place**. | `object` | Tooth Held In Socket With Grey Putty | chữ + ảnh neo | ✅ có trên Flow |
| C2-51 | **DNA analysis** even showed that the teeth from both sites came from the same orangutan. | `symbol` | Twisted Ladder Double Helix | chữ + ảnh neo | ✅ có trên Flow |
| C2-53 | Another archaeologist went back through **Dawson's lifelong collection** and counted at least 38 fakes. | `object` | Wooden Cabinet Crowded With Antiquities | chữ + ảnh neo | ✅ có trên Flow |
| C2-53b | **Another archaeologist** went back through Dawson's lifelong collection and counted at least 38 fakes. | `figure` | Modern Archaeologist With Magnifying Glass | chữ + ảnh neo | ✅ có trên Flow |
| C2-55 | **When he retired in 1924**, he bought a house near Piltdown, and for the next 20 years he kept digging in that same gravel pit, the one that hadn't given up a single bone since the day Dawson died. | `character` | Retired Scholar Ref White Beard Homburg | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C2-55c | When he retired in 1924, he bought a house near Piltdown, and for the next 20 years **he kept digging in that same gravel pit**, the one that hadn't given up a single bone since the day Dawson died. | `character` | Old Man Sifting Gravel Alone By Hedge | chip @ | ✅ có trên Flow |
| C2-57 | **He never found anything else**. | `object` | Garden Sieve Holding Only Pebbles | chữ + ảnh neo | ✅ có trên Flow |

## Các quyết định theo skill 4d (rà 10 câu hỏi)

- **1_vatTacDongCoThe** — Khong co vat tac dong len nguoi. Cai dua tac dong len RANG cua ham (C2-46) — ve ban tay + ham, khong lo mat.
- **2_trangThaiNhanVat** — Woodward hai moc: 1912 (C2-07b) va ve huu 1924-44 (C2-55) — hai asset rieng (skill 5b). Dawson chet 1916 va Woodward chet 1944: KHONG ve canh chet, dung lai chan dung, nam la chu hau ky.
- **3_nguoiCoThatDuocGoiTen** — Charles Dawson (anh studio + tranh 1915), Arthur Smith Woodward (anh ~1900s + tranh 1915 + anh luc gia), Kenneth Oakley (anh 1949, 1953, 1957), Joseph Weiner (chi co anh luc ~55-60 -> ve tre lai, giu kinh gong sung). Nguoi KHONG duoc loi ke goi ten -> figure minh hoa: linh muc tre (Teilhard), nguoi lam cong (Hargreaves), giao su King's College (Waterston), nha giai phau Nam Phi (Dart), nhom 2016, nha khao co (Miles Russell).
- **4_tenSaiThoiKy** — Khong co ten doi theo thoi ky can doi hinh. 'Natural History Museum' — nam 1912 ten chinh thuc la British Museum (Natural History), cung toa nha 1881; ve toa nha, khong ghi chu. Ban do the gioi dung bien gioi 1898 (giong 1913) vi Phap 1913 chua co Alsace-Lorraine.
- **5_trangThaiGoc** — Manh so (C2-04e) -> nhieu manh (C2-06) -> bo Piltdown 2 (C2-23) -> manh nut co soi (C2-50b). Ban phuc dung (C2-16) -> trong tu kinh (C2-28b) -> tach roi (C2-41). Rang trang tinh tinh (C2-36b) -> dua (C2-36) -> nhuom (C2-36c) -> giong het Piltdown (C2-37).
- **6_choNoi** — Rang gan vao ho bang chat tram (C2-50c); soi nhet vao ke nut (C2-50b) — cho noi la chu the.
- **7_nhayCoc** — Them C2-10b (Dawson mot minh nhat manh xuong — loi ke khang dinh 'found by Dawson alone'). KHONG them canh Dawson dua/nhuom ham truoc khi loi ke tiet lo (lo loi giai som); hanh vi gia mao chi o C2-46 sau tiet lo, va chi ve ban tay.
- **8_hanhViNoi** — Dawson ke (C2-04d, dung lai cho 'Dawson said', 'Dawson reported'), Woodward cong bo (C2-14) va phat bieu (C2-19c), giao su lap luan (C2-20), Weiner noi voi Oakley (C2-34b, co nguoi nghe). Noi dung loi noi (ham dat canh so) KHONG ve thanh canh — ham va manh so la phan tu roi.
- **9_mucChacChan** — 'According to Dawson' / 'Dawson said' / 'Dawson reported': KHONG ve canh nguoi lam cong trao manh so, khong ve canh dap so, khong ve canh Dawson tim ra Piltdown 2 — chi ve Dawson dang noi + hien vat. Qua dua (C2-05) chi la vat minh hoa cum tu. 'as if someone had ground them' la gia thuyet cua Weiner — dung lai can canh rang (C2-13), khong ve canh mai.
- **10_trungChucNang_dungLai** — Xem _dungLai. BO: ngoi nha Woodward mua gan Piltdown (khong co anh that), canh hoi nghi 1953 (bao chi C2-03d da ganh), co Phap/My (ban do C2-21 da ganh), toa nha Liverpool John Moores (nhom C2-48 da ganh), so do nga rang (X-quang C2-39 da ganh).
- **11_netMat** — Net mat trung tinh mac dinh o moi shot. Khong gan tam trang dac y cho Dawson o C2-10b, khong gan ve phan khich cho Woodward.

**Thử nghiệm chưa đo:** C2-08b la shot mention BON chip (3 nguoi + 1 noi chon) — nhieu nhat tu truoc toi gio; soi mat co lan nhau khong. C2-47, C2-49, C2-51 dung kind 'symbol' (khong co styleByKind) de khoi bi noi luat mat don gian vao bong nguoi.

## Từng shot

### C2-01 · `character` · ✅ có trên Flow

**Tên card:** Collector Ref Bald Dome Big Moustache

**Lời kể (`at`):** **Charles Dawson was a lawyer** in the small town of Uckfield, in Sussex, in the south of England.

**Ý đồ:** Asset Charles Dawson ~1912 (48 tuoi) — dung o ~10 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông to béo khoảng bốn mươi tám tuổi: mặt rộng má đầy; đỉnh đầu hói nhẵn thành vòm cao, chỉ còn tóc ngắn sẫm hai bên trên tai; bộ ria mép sẫm rất to, hai đầu vểnh lên, cằm cạo nhẵn; com-lê ba mảnh sẫm có gi-lê, sơ mi trắng cổ cồn cao, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Đầu hói + ria lớn, KHÔNG râu cằm — để khác hẳn Woodward (râu quai nón + kính kẹp mũi). Không gọi tên trong prompt.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Collector Ref Bald Dome Big Moustache` — dùng lại ở: C2-01c, C2-02, C2-04d, C2-07, C2-08b, C2-10b

**Prompt gửi Flow:**

```text
A heavy-set man of about forty-eight seen from the chest up. A broad face with full cheeks. Completely bald on top with a smooth high dome, only short dark hair at the sides above the ears. A large thick dark moustache whose ends curl upward, and a clean-shaven chin. He wears a dark three-piece suit with a waistcoat, a white shirt with a high stiff white collar and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `14-dawson-01.jpg`, `23-meeting-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh studio Maull & Fox (14-dawson-01: hoi dinh, ria lon vuot, nguoi to) va tranh John Cooke 1915 (23-meeting-01, hang sau thu ba tu trai: Dawson, o tranh co deo kinh — BO kinh vi anh chup khong co, va de khac Woodward).

### C2-01b · `place` · ✅ có trên Flow

**Tên card:** England Map With Southern County In Red

**Lời kể (`at`):** Charles Dawson was a lawyer in the small town of Uckfield, in Sussex, **in the south of England**.

**Ý đồ:** Dinh vi Sussex o mien nam nuoc Anh (o anh 6). Uckfield/Piltdown qua nho — cham va chu la hau ky

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng nước Anh theo đúng hình bản đồ tham chiếu (30-maps-03): nước Anh tô một màu xanh lá nhạt phẳng có chữ "ENGLAND" in hoa; hạt Sussex trên bờ biển phía nam tô đỏ phẳng có chữ "SUSSEX" in hoa. Không tiêu đề, không số, không la bàn, không mũi tên, không tên nơi nào khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ "ENGLAND" và "SUSSEX". Vùng đỏ phải nằm ở bờ biển phía nam, phía đông nam London — không trôi lên phía bắc.

**Sinh bằng:** câu @mention — chip `@30-maps-03.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a map shaped like @30-maps-03.png with the same style as @01-pyramid-place.png, fill England with one flat pale green colour and label it "ENGLAND" in plain capital letters, fill the county of Sussex on the south coast of England with one flat red colour and label it "SUSSEX" in plain capital letters, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `30-maps-03.png`, `30-maps-02.jpg`

**Ghi chú:** Skill 4d-bis 4a. 30-maps-03 = England location map (chep tu refs/case-1/13-maps-01). Ban do DINH VI hom nay. Cham Uckfield/Piltdown la hau ky.

### C2-01c · `character` · ✅ có trên Flow

**Tên card:** Lawyer Reading Ribboned Documents At Desk

**Lời kể (`at`):** Charles Dawson was a lawyer in **the small town of Uckfield**, in Sussex, in the south of England.

**Ý đồ:** Dawson lam luat su (o anh 2: hanh dong / vai tro)

**🖼️ Ảnh sẽ ra:** Vẽ lại Dawson (C2-01, giữ nguyên mặt) nửa người ngồi sau bàn giấy gỗ, đọc một xấp giấy tờ pháp lý buộc dây ruy băng hồng; trên bàn có bút và lọ mực. Giấy không có chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Giấy tờ phải trống chữ.

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, seen from the waist up sitting at a plain wooden office desk in the same dark suit, reading a legal document of several pages tied with a pink ribbon, a dip pen and an inkwell on the desk, the papers show only faint grey lines with no readable letters, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-02 · `character` · ✅ có trên Flow

**Tên card:** Collector Studying Flint Tool Through Magnifier

**Lời kể (`at`):** In his spare time, he was a well-known **amateur collector of antiquities**.

**Ý đồ:** Dawson suu tam do co

**🖼️ Ảnh sẽ ra:** Vẽ lại Dawson (C2-01, giữ nguyên mặt) nửa người ngồi bên bàn, một tay cầm kính lúp tròn soi một công cụ đá lửa nhỏ; trên bàn có thêm một mảnh gốm, một đồng xu cổ, một tượng đồng nhỏ. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Mặt trung tính, không hào hứng.

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, seen from the waist up in the same dark suit, sitting at a table and looking closely at a small old flint stone tool through a round magnifying glass held in his other hand, a few more small old objects on the table: a pottery shard, an old coin and a small bronze figure, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-03 · `object` · ✅ có trên Flow

**Tên card:** Small Green Bronze Robed Figurine

**Lời kể (`at`):** He found **Roman figurines**, Stone Age hand axes, and ancient wooden boats, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex."

**Ý đồ:** Do co Dawson tim: tuong nho La Ma (o anh 4)

**🖼️ Ảnh sẽ ra:** Một bức tượng đồng La Mã nhỏ cỡ bàn tay, hình người đứng mặc áo choàng dài rủ nếp tới chân, một cẳng tay đưa ra phía trước, phủ lớp gỉ xanh lam, mép mòn nhám. Đứng thẳng một mình. Không chữ.

**🔍 Cần soi khi ra ảnh:** Phải đọc ra là TƯỢNG đồng cổ, không phải người thật.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small ancient Roman bronze figurine, about the height of a hand, of a standing figure in a long robe that falls in simple folds to its feet, one forearm held out in front, the whole statuette covered in a green-blue bronze patina with rough worn edges. It stands upright on its own. No lettering, no labels, no real people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `28-antiquities-02.jpg`

### C2-03b · `object` · ✅ có trên Flow

**Tên card:** Pear Shaped Flint Hand Axe

**Lời kể (`at`):** He found Roman figurines, **Stone Age hand axes**, and ancient wooden boats, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex."

**Ý đồ:** Do co Dawson tim: riu tay thoi da (o anh 4)

**🖼️ Ảnh sẽ ra:** Một chiếc rìu tay đá lửa thời đồ đá nằm phẳng: hình quả lê dài cỡ bàn tay, nhọn ở đầu trên, tròn ở dưới, mặt đá phủ những vết ghè lõm nông, màu xám nâu loang, một mép còn lớp vỏ màu kem. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hình quả lê có vết ghè — không vẽ thành rìu có cán.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A Stone Age flint hand axe lying flat: a pear-shaped stone tool about the length of a hand, pointed at the top and rounded at the bottom, its surface covered in shallow scooped facets where flakes were knocked off, mottled grey-brown flint with a pale cream crust along one edge, and no handle. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `28-antiquities-01.jpg`

### C2-03c · `object` · ✅ có trên Flow

**Tên card:** Long Dugout Canoe From One Tree Trunk

**Lời kể (`at`):** He found Roman figurines, Stone Age hand axes, and **ancient wooden boats**, so many remarkable things that the newspapers nicknamed him "the Wizard of Sussex."

**Ý đồ:** Do co Dawson tim: thuyen go co (o anh 4)

**🖼️ Ảnh sẽ ra:** Một chiếc thuyền độc mộc cổ: thân dài hẹp khoét từ một khúc thân cây, gỗ nâu sẫm ngấm nước có vết nứt dọc, hai đầu tù tròn, nhìn ngang hơi từ trên xuống, trống. Không nước, không chữ.

**🔍 Cần soi khi ra ảnh:** KHÔNG có ảnh đối chiếu (tra Commons 'logboat dugout canoe prehistoric' ra 0). Soi xem có ra xuồng hiện đại (sơn, mái chèo, ghế) không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An ancient wooden dugout boat: a long narrow canoe hollowed out of a single tree trunk, dark brown waterlogged wood with long cracks along its length, blunt rounded ends, no seats, no paint and no oars, shown from the side and slightly above, empty. No lettering, no people, no water. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Lech luat 'tu lieu doi chieu' (skill 4d-bis phan 2): khong co anh doi chieu. Chay theo lenh Tu 'tai xong roi chay tao anh luon'; thuyen doc moc la hinh pho bien, rui ro thap. Sai thi tao lai.

### C2-03d · `object` · ✅ có trên Flow

**Tên card:** Three Folded Old Newspapers Blank Front Page

**Lời kể (`at`):** He found Roman figurines, Stone Age hand axes, and ancient wooden boats, so many remarkable things that **the newspapers nicknamed him** "the Wizard of Sussex."

**Ý đồ:** Bao chi dat biet danh — chu 'the Wizard of Sussex' la hau ky

**🖼️ Ảnh sẽ ra:** Một chồng ba tờ báo cũ khoảng năm 1910 gấp đôi, tờ trên cùng lộ trang nhất: các cột hẹp chỉ là đường kẻ xám, chỗ tít báo để trống, một ô chữ nhật trống thay cho ảnh. Tuyệt đối không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Model rất hay điền chữ vào báo — phải trống hoàn toàn.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small stack of three folded old newspapers from about 1910, the top one showing its front page with narrow columns of plain grey lines instead of text, a large blank space where a headline would be, and one plain blank rectangle where a picture would be. Absolutely no letters, no words and no numbers anywhere. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Dung lai cho 'The newspapers called it' (1912) va 'made public' (1953) — bao chi chung chung, khong khang dinh cung mot to.

### C2-04 · `place` · ✅ có trên Flow

**Tên card:** Red Brick Georgian Manor With Pond

**Lời kể (`at`):** According to Dawson, sometime around 1908, a workman digging gravel on **the grounds of Barkham Manor**, near the village of Piltdown, handed him a piece of a skull.

**Ý đồ:** Barkham Manor (o anh 5 noi chon) — dien trang co that

**🖼️ Ảnh sẽ ra:** Một trang viên kiểu Georgian bằng gạch đỏ cam hai tầng, mái ngói đá phiến xám dốc thấp, ba ống khói gạch cao, các hàng cửa sổ khung trượt trắng cao, giữa mặt tiền có một cửa sổ vòm cao; bãi cỏ xanh phía trước và một cái ao phẳng lặng ở tiền cảnh. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Hình khối phải gần ảnh thật 20-barkham-01: khối vuông vức hai tầng, cửa sổ vòm giữa.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A large Georgian country house of red-orange brick, two storeys high and square in shape, with a low hipped grey slate roof and three tall brick chimney stacks, rows of tall white sash windows, one tall round-arched window in the middle of the front, a smooth green lawn in front and a calm pond in the foreground, a few trees beside the house. No people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `20-barkham-01.jpg`

### C2-04b · `place` · ✅ có trên Flow

**Tên card:** Gravel Trench Ref Hedge Edge

**Lời kể (`at`):** According to Dawson, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, **near the village of Piltdown**, handed him a piece of a skull.

**Ý đồ:** Asset ho soi — ranh nong doc chan hang rao (KHONG phai mo da). Dung lai 1908, 1912, 1924-44

**🖼️ Ảnh sẽ ra:** Mép một cánh đồng cỏ phẳng cạnh hàng rào bụi cây và cây cao rậm; dọc chân hàng rào là một rãnh đào nông lộ sỏi nâu và đất, cạnh rãnh có mấy đống sỏi đào lên, một cái thùng gỗ kiểu nửa thùng rượu, một cái sàng tròn và một cây xẻng cắm thẳng vào đống sỏi. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Phải là RÃNH NÔNG dọc hàng rào như ảnh 1913 (19-dig-01), không vẽ thành hố sâu hay mỏ đá.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Gravel Trench Ref Hedge Edge` — dùng lại ở: C2-04c, C2-08b, C2-10b, C2-19, C2-55c

**Prompt gửi Flow:**

```text
The edge of a flat grassy farm field beside a tall thick hedge of bushes and trees, with a long shallow trench dug along the foot of the hedge exposing brown gravel and earth, a few low heaps of dug gravel on the ground next to it, a wooden half-barrel tub and a round garden sieve standing by the trench, and a spade stuck upright in one gravel heap. No people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `19-dig-01.jpg`, `19-dig-02.jpg`, `19-dig-03.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh 1913 (19-dig-01): Dawson va Woodward sang soi ben thung go, Hargreaves dung o ranh nong canh bo rao. Cap canh doi xung (skill 4b): C2-08b (1912, ba nguoi) <-> C2-55c (Woodward gia mot minh).

### C2-04c · `figure` · ✅ có trên Flow

**Tên card:** Farm Labourer Digging Gravel With Spade

**Lời kể (`at`):** According to Dawson, sometime around 1908, **a workman digging gravel** on the grounds of Barkham Manor, near the village of Piltdown, handed him a piece of a skull.

**Ý đồ:** Nguoi lam cong dao soi (o anh 1+2). KHONG ve canh trao manh so — do la loi Dawson ke

**🖼️ Ảnh sẽ ra:** Một người làm công khoảng năm 1908 nguyên người từ đầu tới ủng: ông già râu xám ngắn, mũ vải lưỡi trai dẹt, áo sơ mi không cổ xắn tay, gi-lê sẫm, quần lao động có dây đeo, ủng nặng, đang xúc sỏi bằng xẻng trong rãnh sỏi (C2-04b, giữ nguyên nơi chốn). Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không vẽ ông ta cầm mảnh sọ (mức chắc chắn: 'According to Dawson').

**Sinh bằng:** câu @mention — chip `@02-doctor-figure.png` (file ảnh), `@Gravel Trench Ref Hedge Edge` (asset từ C2-04b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a farm labourer of about 1908 in the same drawing style as @02-doctor-figure.png, seen full length from head to boots: an older man with a short grey beard, a flat cloth cap, a collarless shirt with the sleeves rolled up, a dark waistcoat, dark work trousers held up by braces and heavy boots, digging gravel with a spade at @Gravel Trench Ref Hedge Edge, keep the place exactly the same, nothing in his other hand, no lettering. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `19-dig-01.jpg`

**Ghi chú:** Trang phuc theo nguoi lam cong Venus Hargreaves trong anh 1913; loi ke khong goi ten -> figure.

### C2-04d · `character` · ✅ có trên Flow

**Tên card:** Collector Talking With Open Hand

**Lời kể (`at`):** **According to Dawson**, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, near the village of Piltdown, handed him a piece of a skull.

**Ý đồ:** Hanh vi noi (luat 8): Dawson ke lai. Giu muc chac chan — chuyen nhan manh so la LOI DAWSON

**🖼️ Ảnh sẽ ra:** Vẽ lại Dawson (C2-01, giữ nguyên mặt) nửa người, miệng mở đang nói, một bàn tay giơ lên mở ra như đang giải thích, tay không cầm gì. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Tay không cầm mảnh sọ (vật được nói tới để rời).

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, seen from the waist up in the same dark suit, talking with his mouth open and one hand raised in an open gesture as he explains something, nothing in his hands, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Dung lai cho 'Dawson said the workmen had smashed' va 'Dawson reported finding'.

### C2-04e · `object` · ✅ có trên Flow

**Tên card:** Skull Fragment Ref Reddish Brown

**Lời kể (`at`):** According to Dawson, sometime around 1908, a workman digging gravel on the grounds of Barkham Manor, near the village of Piltdown, **handed him a piece of a skull**.

**Ý đồ:** Asset manh so — mau do nau nhuom sat. Sinh cac nhom manh khac tu chip nay

**🖼️ Ảnh sẽ ra:** Một mảnh xương sọ cũ cong cỡ lòng bàn tay, như mảnh vỡ của một cái bát, mặt nhuộm nâu đỏ sẫm như gỉ sắt, mặt ngoài nhẵn hơi bóng, mép vỡ nhám có vết nứt nhỏ. Một mình. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Màu nâu đỏ như ảnh 22-skull-01. Không vẽ thành sọ nguyên.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Skull Fragment Ref Reddish Brown` — dùng lại ở: C2-06, C2-23, C2-50b

**Prompt gửi Flow:**

```text
One single curved fragment of an old skull bone about the size of a palm, shaped roughly like a broken piece of a bowl, its surface stained a deep reddish brown like rusty iron, smooth and slightly shiny on the outside, with rough broken edges and fine cracks. Shown alone. No lettering, no labels, no scale bar, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `22-skull-01.png`, `21-jaw-05.jpg`

### C2-05 · `object` · ✅ có trên Flow

**Tên card:** Whole Brown Coconut In Husk

**Lời kể (`at`):** Dawson said the workmen had smashed an entire skull, thinking it was **a fossilized coconut**.

**Ý đồ:** Thu nguoi lam cong TUONG la (theo loi Dawson) — vat minh hoa cum tu, khong phai dao cu

**🖼️ Ảnh sẽ ra:** Một quả dừa nâu nguyên vỏ xơ, tròn hơi bầu dục, xơ dừa thành những nét mảnh. Một mình. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hậu kỳ đặt cạnh mảnh sọ nếu muốn.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One whole brown coconut still in its hairy husk, round and slightly oval, the fibres showing as fine lines, shown alone. No lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-06 · `object` · ✅ có trên Flow

**Tên card:** Four Reddish Brown Skull Pieces Apart

**Lời kể (`at`):** Over the following years, he **picked up a few more fragments**.

**Ý đồ:** Them manh so (trang thai noi tu C2-04e)

**🖼️ Ảnh sẽ ra:** Bốn mảnh xương sọ cong to nhỏ khác nhau, cùng chất xương nâu đỏ như mảnh C2-04e, nằm rời nhau trên nền trắng. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Cùng màu và chất với C2-04e.

**Sinh bằng:** câu @mention — chip `@Skull Fragment Ref Reddish Brown` (asset từ C2-04e). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw four separate curved fragments of old skull bone of different sizes and shapes, made of exactly the same reddish brown stained bone as @Skull Fragment Ref Reddish Brown, lying apart from one another, no labels, no lettering, plain white background
```

**Ảnh tư liệu đã soi (không gửi Flow):** `22-skull-01.png`

**Ghi chú:** Dung lai lam 'Piltdown 1' o cau 2 phat hien / 2 dia diem.

### C2-07 · `character` · ✅ có trên Flow

**Tên card:** Collector Writing Letter With Dip Pen

**Lời kể (`at`):** In February 1912, **Dawson wrote to Arthur Smith Woodward**, the Keeper of Geology at the Natural History Museum in London.

**Ý đồ:** Dawson viet thu (thang 2/1912)

**🖼️ Ảnh sẽ ra:** Vẽ lại Dawson (C2-01, giữ nguyên mặt) nửa người ngồi bàn gỗ viết thư bằng bút chấm mực, cạnh tờ giấy có phong bì và lọ mực; chữ trên giấy chỉ là nét lượn mờ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không chữ đọc được.

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, seen from the waist up in the same dark suit, sitting at a wooden desk writing a letter with a dip pen, an envelope and an inkwell beside the paper, the writing on the paper is only faint wavy lines with no readable letters, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `24-letter-01.png`

### C2-07b · `character` · ✅ có trên Flow

**Tên card:** Keeper Ref Beard Pince Nez

**Lời kể (`at`):** In February 1912, Dawson wrote to Arthur Smith Woodward, **the Keeper of Geology** at the Natural History Museum in London.

**Ý đồ:** Asset Arthur Smith Woodward ~1912 (48 tuoi)

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông khoảng bốn mươi tám tuổi: mặt dài, đỉnh đầu hói, tóc hai bên ngắn sẫm điểm bạc; râu quai nón và ria tỉa gọn màu nâu sẫm lẫn sợi bạc; cặp kính kẹp mũi bầu dục nhỏ không gọng tai, có sợi dây đen thả xuống; áo vest sẫm, gi-lê sẫm, sơ mi trắng cổ bẻ, nơ đen. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Râu + kính kẹp mũi là dấu nhận diện — khác Dawson (không râu cằm, ria lớn).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Keeper Ref Beard Pince Nez` — dùng lại ở: C2-08b, C2-14, C2-19c

**Prompt gửi Flow:**

```text
A man of about forty-eight seen from the chest up. A long face, bald on top with short dark hair streaked with grey at the sides. A full short beard and moustache, dark brown streaked with grey, neatly trimmed. Small oval pince-nez spectacles without arms clipped on his nose, with a thin black cord hanging down from them. He wears a dark suit jacket over a dark waistcoat, a white shirt with a turned-down collar and a black bow tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `15-woodward-01.jpg`, `23-meeting-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh 15-woodward-01 (rau day sam, kinh kep mui co day, no); tranh 1915 (hang sau ngoai cung phai: rau da bac).

### C2-07c · `place` · ✅ có trên Flow

**Tên card:** Victorian Museum Front Two Spired Towers

**Lời kể (`at`):** In February 1912, Dawson wrote to Arthur Smith Woodward, the Keeper of Geology at **the Natural History Museum in London**.

**Ý đồ:** Bao tang Lich su Tu nhien London (toa nha 1881, giong nam 1912)

**🖼️ Ảnh sẽ ra:** Mặt tiền một toà bảo tàng thời Victoria lớn, những dải đất nung màu vàng nhạt và xám xanh, kiểu nhà thờ Romanesque: hai tháp vuông cao có chóp đá phiến nhọn hai bên một cổng vòm tròn sâu, hàng cửa sổ vòm nhỏ chạy ngang, nhiều chi tiết chạm nhỏ. Nhìn từ đường hơi xéo. Không người, không xe, không chữ, không cờ.

**🔍 Cần soi khi ra ảnh:** Hai tháp + cổng vòm giữa như ảnh 25-nhm-01.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
The front of a large Victorian museum building made of pale buff and soft blue-grey terracotta bands, in a Romanesque cathedral style: two tall square towers with pointed slate spires on either side of a deep round-arched main entrance, rows of small round-arched windows across the front and many small carved decorations. Seen from the street at a slight angle. No people, no cars, no lettering, no flags, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `25-nhm-01.jpg`

**Ghi chú:** Dung lai cho 'a geologist at the Natural History Museum' (Oakley).

### C2-08 · `figure` · ✅ có trên Flow

**Tên card:** Young Priest Ref Black Cassock

**Lời kể (`at`):** That summer, the 2 men went digging in the gravel pit, along with **a young French Jesuit priest**.

**Ý đồ:** Asset linh muc tre (Teilhard de Chardin, 31 tuoi; loi ke khong goi ten -> figure)

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông trẻ gầy khoảng ba mươi: mặt trái xoan gầy, mũi thẳng dài, tóc sẫm ngắn chải ngược để lộ trán cao, mặt cạo nhẵn; áo chùng đen cài khuy tới cổ, dải cổ cồn trắng hẹp của linh mục. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Phải đọc ra là LINH MỤC (áo chùng + cổ cồn trắng).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Young Priest Ref Black Cassock` — dùng lại ở: C2-08b, C2-19

**Prompt gửi Flow:**

```text
A slim young man of about thirty seen from the chest up. A thin oval face with a long straight nose, short dark hair combed back from a high forehead, clean-shaven. He wears a plain black cassock buttoned up to the neck, with a narrow white clerical collar band at the throat. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `18-priest-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh 18-priest-01 la Teilhard nam 1935 (54 tuoi) — chi soi ao chung va co con, ve tre lai. Khi di dao ong co the mac thuong phuc (anh 19-dig-02) — co y giu ao chung de nguoi xem doc ra 'linh muc'.

### C2-08b · `group` · ✅ có trên Flow

**Tên card:** Three Men Sifting Gravel By Hedge

**Lời kể (`at`):** That summer, the 2 men **went digging in the gravel pit**, along with a young French Jesuit priest.

**Ý đồ:** Dao o ho soi mua he 1912 — canh GAI cua cap doi xung voi C2-55c

**🖼️ Ảnh sẽ ra:** Dawson (C2-01) mặc sơ mi có dây đeo quần và gi-lê, cầm sàng tròn trên thùng gỗ; Woodward (C2-07b) mặc gi-lê xắn tay áo cúi bên cùng thùng nhặt sỏi; linh mục (C2-08) áo chùng đen đứng trong rãnh cầm bay nhỏ; cả ba nguyên người ở rãnh sỏi (C2-04b, giữ nguyên nơi chốn). Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Bốn chip trong một câu (nhiều nhất từ trước tới giờ) — soi ba mặt có lẫn nhau không, và nơi chốn có giữ không.

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01), `@Keeper Ref Beard Pince Nez` (asset từ C2-07b), `@Young Priest Ref Black Cassock` (asset từ C2-08), `@Gravel Trench Ref Hedge Edge` (asset từ C2-04b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, in shirtsleeves with braces and a waistcoat, dark trousers and boots, holding a round garden sieve over a wooden half-barrel tub, and the same man as in @Keeper Ref Beard Pince Nez, keep his face, beard and pince-nez exactly the same, in a waistcoat with his sleeves rolled up, dark trousers and boots, bending over the same tub and sorting gravel with his hands, and the same young man as in @Young Priest Ref Black Cassock, keep his face exactly the same, in the same black cassock, standing in the shallow trench holding a small trowel, all three seen full length at @Gravel Trench Ref Hedge Edge, keep the place exactly the same, do not mix their features, no lettering. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `19-dig-01.jpg`, `19-dig-02.jpg`

**Ghi chú:** Tu the theo anh 1913 (Dawson cam sang tren thung, Woodward cui ben thung).

### C2-09 · `object` · ✅ có trên Flow

**Tên card:** Wooden Tray Of Brown Finds

**Lời kể (`at`):** They found more pieces of skull, teeth, **stone tools, and the bones of ancient animals**.

**Ý đồ:** Nhung thu tim thay (o anh 4) — manh so, rang, cong cu da, xuong thu

**🖼️ Ảnh sẽ ra:** Một khay gỗ nông nhìn hơi từ trên xuống, bày thành hàng: ba mảnh sọ cong nâu đỏ, bốn cái răng rời màu nâu, hai công cụ đá lửa có vết ghè, và mấy mẩu xương thú cổ đủ hình dạng, tất cả nhuộm nâu. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Không vẽ sọ nguyên.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A shallow wooden tray seen from slightly above, holding a small collection of finds laid out in rows: three curved reddish brown skull pieces, four loose brown teeth, two chipped flint stone tools, and several pieces of old animal bone of different shapes, all stained brown. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-10 · `object` · ✅ có trên Flow

**Tên card:** Jaw Ref Two Flat Molars

**Lời kể (`at`):** The most important pieces, more of the skull and **half of a lower jaw**, were all found by Dawson alone.

**Ý đồ:** Asset ham duoi — hien vat trung tam cua case

**🖼️ Ảnh sẽ ra:** Nửa xương hàm dưới nhìn ngang: thân xương dài thấp, gãy cụt ở đầu trước chỗ lẽ ra là cằm, phía sau vươn lên một tấm xương đứng cao có đỉnh gãy; giữa hàm có hai răng hàm lớn đứng cạnh nhau, mặt trên mòn phẳng. Xương nhuộm nâu đỏ sẫm như gỉ sắt, răng màu vàng nâu nhạt hơn. Không chữ, không nhãn, không thước.

**🔍 Cần soi khi ra ảnh:** Hình khối như ảnh 21-jaw-01: không cằm, hai răng hàm ở giữa. Không vẽ thêm răng cửa.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Jaw Ref Two Flat Molars` — dùng lại ở: C2-13, C2-46

**Prompt gửi Flow:**

```text
Half of an old lower jaw bone seen from the side: a long low body of bone, broken off at the front end where the chin should be, rising at the back into a tall upright plate of bone with a broken top, and exactly two large back teeth, molars, standing side by side in the middle of the jaw with flat worn tops. The bone is stained a deep reddish brown like rusty iron and the two teeth are a paler yellow-brown. Shown alone. No other teeth, no lettering, no labels, no scale bar, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `21-jaw-01.jpg`, `21-jaw-05.jpg`, `21-jaw-06.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh NHM (21-jaw-01): ham phai, khong cam, hai rang ham giua; nhan '1912' va 'E 594' dan tren xuong — KHONG ve.

### C2-10b · `character` · ✅ có trên Flow

**Tên card:** Collector Crouching Alone Holding Bone Piece

**Lời kể (`at`):** The most important pieces, more of the skull and half of a lower jaw, were all **found by Dawson alone**.

**Ý đồ:** Dawson mot minh tim ra cac manh quan trong (loi ke khang dinh, khong phai 'according to')

**🖼️ Ảnh sẽ ra:** Vẽ lại Dawson (C2-01, giữ nguyên mặt) mặc sơ mi có dây đeo quần và gi-lê, ngồi xổm MỘT MÌNH trong rãnh sỏi (C2-04b, giữ nguyên nơi chốn), giơ lên một mảnh xương nhỏ nâu đỏ vừa nhặt từ sỏi. Không ai khác. Không chữ.

**🔍 Cần soi khi ra ảnh:** Mặt trung tính, không vẻ đắc ý (không có nguồn).

**Sinh bằng:** câu @mention — chip `@Collector Ref Bald Dome Big Moustache` (asset từ C2-01), `@Gravel Trench Ref Hedge Edge` (asset từ C2-04b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Collector Ref Bald Dome Big Moustache, keep his face exactly the same, in shirtsleeves with braces and a waistcoat, dark trousers and boots, crouching alone at @Gravel Trench Ref Hedge Edge, keep the place exactly the same, holding up a small reddish brown piece of bone that he has just picked out of the gravel, nobody else anywhere in the picture, no lettering. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-12 · `object` · ✅ có trên Flow

**Tên card:** Young Chimpanzee Sitting In Profile

**Lời kể (`at`):** At first glance, it looked almost exactly like **the jaw of a young chimpanzee**.

**Ý đồ:** Ham trong giong ham tinh tinh non (o anh 4: vat duoc goi ten)

**🖼️ Ảnh sẽ ra:** Một con tinh tinh non ngồi nhìn ngang, đầu quay nghiêng để thấy rõ hàm và mõm nhô ra, lông sẫm, mặt trần màu nhạt, tai to, tay dài đặt trên gối, vẻ bình thản. Chỉ con vật.

**🔍 Cần soi khi ra ảnh:** Hàm nhô, nhìn nghiêng.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A young chimpanzee sitting on the ground seen from the side, its head turned in profile so the jutting jaw and muzzle are clear, dark fur, a pale bare face, large ears, long arms resting on its knees, a calm expression. Only the animal, no people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-13 · `object` · ✅ có trên Flow

**Tên card:** Close View Two Flat Topped Molars

**Lời kể (`at`):** But **its 2 molars were worn flat**, the way human teeth wear down from chewing.

**Ý đồ:** Can canh hai rang ham mon phang (sinh tu asset ham) — dung lai o 'too evenly'

**🖼️ Ảnh sẽ ra:** Cận cảnh hai răng hàm của chính cái hàm C2-10, nhìn từ trên xuống hơi chếch để thấy rõ mặt răng, cả hai mòn phẳng nhẵn như bậc thang cũ, cắm trong xương nâu đỏ. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Mặt răng phải PHẲNG.

**Sinh bằng:** câu @mention — chip `@Jaw Ref Two Flat Molars` (asset từ C2-10). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a close-up of the two back teeth of the same jaw as in @Jaw Ref Two Flat Molars, seen from above and slightly to the side so their tops are clearly visible, both molars ground perfectly flat and smooth on top like a worn step, set in the reddish brown bone, no labels, no lettering, plain white background
```

**Ảnh tư liệu đã soi (không gửi Flow):** `21-jaw-04.jpg`, `21-jaw-03.jpg`

### C2-13b · `figure` · ✅ có trên Flow

**Tên card:** Man Biting Into Slice Of Bread

**Lời kể (`at`):** But its 2 molars were worn flat, **the way human teeth wear down from chewing**.

**Ý đồ:** Giai thich co che: rang nguoi mon do nhai (o anh 2) — minh hoa chung, khong phai nhan vat

**🖼️ Ảnh sẽ ra:** Một người đàn ông khoảng năm 1910 nửa người đang cắn một lát bánh mì dày, sơ mi không cổ, gi-lê sẫm, tóc nâu ngắn, mặt cạo nhẵn. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Đọc ra là ĐANG NHAI. Không giống Dawson/Woodward.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A man of about 1910 seen from the chest up, biting into a thick slice of bread and chewing, wearing a plain collarless shirt and a dark waistcoat, short brown hair, clean-shaven. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-14 · `group` · ✅ có trên Flow

**Tên card:** Keeper At Lectern Before Five Gentlemen

**Lời kể (`at`):** On December 18th, 1912, at a meeting of the Geological Society of London, **Woodward announced a new species** of early human.

**Ý đồ:** Cong bo tai Hoi Dia chat London 18/12/1912 (o anh 2 + 5)

**🖼️ Ảnh sẽ ra:** Woodward (C2-07b, giữ nguyên mặt, râu, kính kẹp mũi) nguyên người mặc áo đuôi tôm đen đứng sau bục gỗ, một tay giơ lên đang nói; phía trước đúng năm quý ông năm 1912 mặc com-lê sẫm cổ cồn cao ngồi ghế gỗ nhìn về phía ông. Không chữ.

**🔍 Cần soi khi ra ảnh:** Năm người nghe có na ná nhau không; không biểu ngữ.

**Sinh bằng:** câu @mention — chip `@Keeper Ref Beard Pince Nez` (asset từ C2-07b), `@03-five-men-group.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Keeper Ref Beard Pince Nez, keep his face, beard and pince-nez exactly the same, seen full length in a long black frock coat, dark trousers and black shoes, standing behind a plain wooden lectern with one hand raised as he speaks, and in front of him exactly five gentlemen of 1912 in dark suits and high white collars seated on wooden chairs facing him, in the same drawing style as @03-five-men-group.png, no banners, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `23-meeting-01.jpg`

**Ghi chú:** Nguoi moi la nhom -> goi anh neo 03 (skill 4d-9d). Dung lai cho 'He gave it the scientific name' (ten la chu hau ky).

### C2-16 · `object` · ✅ có trên Flow

**Tên card:** Reconstructed Skull Ref Plaster Patches

**Lời kể (`at`):** **His reconstruction showed a skull** much like a modern human's, with a brain about two-thirds the size of ours, attached to the jaw of an ape.

**Ý đồ:** Asset ban phuc dung cua Woodward: vom so cao kieu nguoi + ham vuon

**🖼️ Ảnh sẽ ra:** Một hộp sọ phục dựng nhìn từ bên trái: vòm sọ cao tròn giống người, phần lớn bằng thạch cao màu kem nhẵn, gắn vài mảng xương thật nâu đỏ sẫm không đều như miếng vá; bên dưới là một hàm dưới dài nhô ra kiểu vượn, một phần cũng nâu đỏ, có một hàng răng. Một mình. Không chữ.

**🔍 Cần soi khi ra ảnh:** Vật bảo tàng — KHÔNG dùng làm thumbnail. Phải thấy rõ hai màu (thạch cao + xương).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Reconstructed Skull Ref Plaster Patches` — dùng lại ở: C2-28b, C2-41

**Prompt gửi Flow:**

```text
A reconstructed old skull seen from the left side: a high, rounded, human-like dome built mostly of smooth pale cream plaster, with several irregular dark reddish brown pieces of real bone set into the plaster like patches, and attached below it a long jutting ape-like lower jaw, also partly reddish brown, with a row of teeth. Shown alone. No lettering, no labels, no stand, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `22-skull-04.jpg`, `22-skull-05.jpg`, `22-skull-02.jpg`, `22-skull-03.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi 22-skull-04 (ve phuc dung: manh nau sam tren so trang, ham vuon nho) va 22-skull-05 (khuon thach cao Wellcome).

### C2-16b · `object` · ✅ có trên Flow

**Tên card:** Two Simple Brains Small And Large

**Lời kể (`at`):** His reconstruction showed a skull much like a modern human's, with a brain about **two-thirds the size of ours**, attached to the jaw of an ape.

**Ý đồ:** Nao bang hai phan ba nao nguoi nay (o anh 10: con so co hinh)

**🖼️ Ảnh sẽ ra:** Hai hình bộ não người màu hồng vẽ đơn giản nhìn nghiêng đặt cạnh nhau: cái bên trái nhỏ rõ, khoảng hai phần ba cái bên phải; cả hai cùng những nếp gợn đơn giản. Không chữ, không số, không sọ.

**🔍 Cần soi khi ra ảnh:** Tỉ lệ khoảng 2/3. Vẽ đơn giản như hình minh hoạ, không giải phẫu tả thực.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Two simple pink drawings of a human brain seen from the side, placed side by side: the one on the left is clearly smaller, about two thirds the size of the one on the right, and both have the same simple wavy folds. No lettering, no numbers, no skulls, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Dung lai cho 'the brain grew large first'.

### C2-17 · `group` · ✅ có trên Flow

**Tên card:** Three Edwardian Scientists Talking

**Lời kể (`at`):** It fit perfectly with what **many experts in England believed** at the time, that as our ancestors became human, the brain grew large first and everything else followed.

**Ý đồ:** Gioi chuyen gia Anh thoi do (o anh 1 nhom) — dung lai cho 'voices were drowned out'

**🖼️ Ảnh sẽ ra:** Ba nhà khoa học người Anh năm 1912 nguyên người đứng trò chuyện: áo đuôi tôm hoặc com-lê ba mảnh sẫm, cổ cồn cao trắng; một người râu bạc, một người mặt nhẵn đeo kính, một người ria sẫm; một người đưa tay mở đang nói, hai người kia nghe và gật. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không ai được giống Dawson (hói + ria lớn) hay Woodward (râu + kính kẹp mũi).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `03-five-men-group.png`

**Prompt gửi Flow:**

```text
Three English scientists of 1912 standing together and talking, seen full length: older men in dark frock coats or dark three-piece suits with high white collars, one with a short grey beard and a full head of grey hair, one clean-shaven with round spectacles, one with a dark moustache and dark hair; one of them gestures with an open hand while the other two listen and nod. No lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C2-18 · `object` · ✅ có trên Flow

**Tên card:** Iron Chain With One Link Missing

**Lời kể (`at`):** The newspapers called it **the missing link between apes and humans**.

**Ý đồ:** VAT TUONG TRUNG cho 'missing link' (o anh 8)

**🖼️ Ảnh sẽ ra:** Một đoạn xích sắt nằm ngang gồm các mắt xích bầu dục trơn, ở giữa có một khoảng hở đúng bằng một mắt bị thiếu, chia sợi xích thành nửa trái và nửa phải. Kim loại xám sẫm. Một mình. Không chữ.

**🔍 Cần soi khi ra ảnh:** Phải thấy rõ CHỖ THIẾU một mắt.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A short horizontal iron chain of plain oval links lying flat, with a clear empty gap in the middle where exactly one link is missing, so the chain is broken into a left part and a right part. Dark grey metal. Shown alone. No lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Vat tuong trung — hau ky dat rieng, khong ghep chung khung voi nhan vat (skill 4d-bis 4c).

### C2-19 · `figure` · ✅ có trên Flow

**Tên card:** Young Priest Holding Up A Small Tooth

**Lời kể (`at`):** In 1913, **the young priest found** a canine tooth in the same gravel pit, and Woodward said it fit the jaw perfectly.

**Ý đồ:** Linh muc tim ra rang nanh nam 1913 (su that co nguon)

**🖼️ Ảnh sẽ ra:** Vẽ lại linh mục (C2-08, giữ nguyên mặt) trong áo chùng đen, ngồi xổm ở rãnh sỏi (C2-04b, giữ nguyên nơi chốn), hai ngón tay giơ lên một chiếc răng nhọn nhỏ vừa tìm thấy và nhìn nó. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Mặt trung tính.

**Sinh bằng:** câu @mention — chip `@Young Priest Ref Black Cassock` (asset từ C2-08), `@Gravel Trench Ref Hedge Edge` (asset từ C2-04b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same young man as in @Young Priest Ref Black Cassock, keep his face exactly the same, in the same black cassock, crouching at @Gravel Trench Ref Hedge Edge, keep the place exactly the same, holding up between two fingers a small pointed tooth he has just found in the gravel and looking at it, no lettering. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-19b · `object` · ✅ có trên Flow

**Tên card:** Single Pointed Canine Tooth Grey Brown

**Lời kể (`at`):** In 1913, the young priest found **a canine tooth** in the same gravel pit, and Woodward said it fit the jaw perfectly.

**Ý đồ:** Rang nanh 1913 (o anh 4)

**🖼️ Ảnh sẽ ra:** Một chiếc răng nanh nhìn ngang: răng hẹp hơi cong, đầu nhọn có một mặt mòn phẳng, chân răng dài, nhuộm xám nâu loang sẫm. Một mình. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Hình như răng bên phải ảnh 21-jaw-02.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One single canine tooth seen from the side: a narrow, slightly curved pointed tooth with a long root, worn flat along one side of its point, stained grey-brown with darker patches. Shown alone. No lettering, no labels, no scale bar, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `21-jaw-02.jpg`

### C2-19c · `character` · ✅ có trên Flow

**Tên card:** Keeper Talking With Open Hands

**Lời kể (`at`):** In 1913, the young priest found a canine tooth in the same gravel pit, and **Woodward said it fit the jaw perfectly**.

**Ý đồ:** Hanh vi noi (luat 8): Woodward phat bieu. Rang va ham la phan tu roi

**🖼️ Ảnh sẽ ra:** Vẽ lại Woodward (C2-07b, giữ nguyên mặt, râu, kính kẹp mũi) nửa người, miệng mở đang nói, hai bàn tay mở ra trước người, tay không cầm gì. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không cầm hàm hay răng.

**Sinh bằng:** câu @mention — chip `@Keeper Ref Beard Pince Nez` (asset từ C2-07b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Keeper Ref Beard Pince Nez, keep his face, beard and pince-nez exactly the same, seen from the waist up in the same dark suit, talking with his mouth open and both hands held open in front of him, nothing in his hands, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-20 · `figure` · ✅ có trên Flow

**Tên card:** Lecturer With Wire Spectacles Raising Finger

**Lời kể (`at`):** That same year, **an anatomy professor at King's College London** argued in the journal Nature that this was simply an ape's jaw lying next to a human skull.

**Ý đồ:** Giao su giai phau King's College (David Waterston, loi ke khong goi ten -> figure) dang lap luan

**🖼️ Ảnh sẽ ra:** Một người đàn ông khoảng ba mươi lăm nửa người: mặt gầy, tóc sẫm ngắn rẽ ngôi một bên, ria sẫm gọn, kính tròn gọng kim loại mảnh, com-lê sẫm cổ cồn cao trắng, cà vạt sẫm; đang nói, một ngón tay giơ lên như đang nêu ý. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không giống Dawson/Woodward.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A man of about thirty-five seen from the chest up: a lean face, short dark hair parted on one side, a neat dark moustache, round wire-rimmed spectacles, a dark suit with a high white collar and a dark tie, talking with one finger raised as if making a point. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-20b · `object` · ✅ có trên Flow

**Tên card:** Thin Science Journal With Blank Cover

**Lời kể (`at`):** That same year, an anatomy professor at King's College London **argued in the journal Nature** that this was simply an ape's jaw lying next to a human skull.

**Ý đồ:** Tap chi khoa hoc (ten 'Nature' la chu hau ky)

**🖼️ Ảnh sẽ ra:** Một cuốn tạp chí khoa học mỏng khoảng năm 1913 nằm phẳng, bìa màu nhạt chỉ có đường viền mảnh và một ô chữ nhật trống chỗ tên báo, vài trang hơi hé. Tuyệt đối không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Bìa phải trống chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A thin scientific journal from about 1913 lying flat, with a plain pale cover that has only a simple thin border line and an empty blank rectangle where the title would be, a few pages slightly open. Absolutely no letters, no words and no numbers anywhere. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-21 · `place` · ✅ có trên Flow

**Tên card:** World Map Two Countries In Red

**Lời kể (`at`):** A few **scientists in France and America** thought the same.

**Ý đồ:** Dia ly (o anh 6): Phap va My. Ban do the gioi nam 1898 — bien gioi Phap va My dung nhu 1913

**🖼️ Ảnh sẽ ra:** Bản đồ thế giới phẳng theo hình bản đồ tham chiếu (30-maps-01, biên giới năm 1898): mọi lục địa một màu xanh lá nhạt; nước Pháp tô đỏ có chữ "FRANCE" in hoa; nước Mỹ tô đỏ có chữ "AMERICA" in hoa. Không tiêu đề, không số, không la bàn, không tên nơi nào khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ "FRANCE", "AMERICA". Vùng đỏ đúng chỗ: Pháp ở Tây Âu, Mỹ ở giữa Bắc Mỹ (không tô cả Canada).

**Sinh bằng:** câu @mention — chip `@30-maps-01.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a world map shaped like @30-maps-01.png with the same style as @01-pyramid-place.png, all land in one flat pale green colour, fill France with one flat red colour and label it "FRANCE" in plain capital letters, fill the United States with one flat red colour and label it "AMERICA" in plain capital letters, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `30-maps-01.png`

**Ghi chú:** Luat nien dai (skill 4d-bis 2): ban do minh hoa su kien 1913 -> dung BlankMap-World-1898 (Phap chua co Alsace-Lorraine, My lien luc dia nhu 1913).

### C2-23 · `object` · ✅ có trên Flow

**Tên card:** Two Skull Pieces And One Molar

**Lời kể (`at`):** In 1915, Dawson reported finding **a second skull**, which became known as Piltdown 2, at another site about 2 miles away.

**Ý đồ:** Piltdown 2 (1915): hai manh so + mot rang ham — dung bo phan that

**🖼️ Ảnh sẽ ra:** Hai mảnh xương sọ nhỏ và một chiếc răng hàm nằm rời nhau, cùng chất xương nâu đỏ như mảnh C2-04e, chiếc răng vàng nâu nhạt hơn. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Phải khác bộ bốn mảnh C2-06 (đây là hai mảnh + một răng).

**Sinh bằng:** câu @mention — chip `@Skull Fragment Ref Reddish Brown` (asset từ C2-04e). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw two small pieces of old skull bone and one single back tooth, lying apart from one another, made of exactly the same reddish brown stained bone as @Skull Fragment Ref Reddish Brown, the tooth a paler yellow-brown, no labels, no lettering, plain white background
```

**Ghi chú:** Piltdown 2 gom manh xuong tran, manh xuong cham va mot rang ham. Loi ke 'Dawson reported finding' — anh la HIEN VAT, khong ve canh tim thay.

### C2-23b · `place` · ✅ có trên Flow

**Tên card:** Open Field With Hedgerows And Gate

**Lời kể (`at`):** In 1915, Dawson reported finding a second skull, which became known as Piltdown 2, at **another site about 2 miles away**.

**Ý đồ:** Dia diem thu hai — chung chung vi 'exact location was never recorded'

**🖼️ Ảnh sẽ ra:** Một cánh đồng thoải ở Sussex cỏ xanh thấp, viền hàng rào cây bụi và vài cây cao, một cổng gỗ trên hàng rào, trống trơn. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Không vẽ hố đào (không ai biết chỗ đào).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An open, gently rolling farm field in Sussex with low green grass, bordered by hedgerows and a few tall trees, a wooden field gate in one hedge, empty, with no digging anywhere. No people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Dung lai cho 'The exact location was never recorded' — hau ky them dau hoi.

### C2-28 · `object` · ✅ có trên Flow

**Tên card:** Open Textbook With Skull Drawing

**Lời kể (`at`):** For decades afterward, Piltdown Man **appeared in textbooks**, in museums, and in more than 250 scientific papers.

**Ý đồ:** Sach giao khoa (o anh 4)

**🖼️ Ảnh sẽ ra:** Một cuốn sách giáo khoa cũ mở: trang trái chỉ có đường kẻ xám thay chữ, trang phải in một hình vẽ hộp sọ phục dựng nhìn nghiêng với vòm cao tròn và hàm nhô. Tuyệt đối không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Không chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An old school textbook lying open: its left page filled with plain grey lines instead of text, its right page showing a simple printed drawing of a reconstructed skull seen from the side with a high round dome and a jutting jaw. Absolutely no letters, no words and no numbers anywhere. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-28b · `object` · ✅ có trên Flow

**Tên card:** Glass Museum Case With Skull On Stand

**Lời kể (`at`):** For decades afterward, Piltdown Man appeared in textbooks, **in museums**, and in more than 250 scientific papers.

**Ý đồ:** Trung bay bao tang (sinh tu asset phuc dung)

**🖼️ Ảnh sẽ ra:** Chính hộp sọ C2-16 (giữ nguyên) đặt trên một chân đế gỗ nhỏ sẫm bên trong một tủ kính bảo tàng cao khung gỗ sẫm, tủ đứng một mình. Không nhãn, không chữ, không người.

**🔍 Cần soi khi ra ảnh:** Không có nhãn chữ trong tủ.

**Sinh bằng:** câu @mention — chip `@Reconstructed Skull Ref Plaster Patches` (asset từ C2-16). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same skull as in @Reconstructed Skull Ref Plaster Patches, keep it exactly the same, standing on a small dark wooden stand inside a tall glass museum display case with a dark wooden frame, the case standing on its own, no label text, no people, no lettering, plain white background
```

### C2-28c · `object` · ✅ có trên Flow

**Tên card:** Tall Stack Of Scientific Papers

**Lời kể (`at`):** For decades afterward, Piltdown Man appeared in textbooks, in museums, and in **more than 250 scientific papers**.

**Ý đồ:** Hon 250 bai bao (con so la chu hau ky)

**🖼️ Ảnh sẽ ra:** Một chồng cao lộn xộn gồm nhiều bài báo khoa học và tạp chí mỏng chất lên nhau, vài cuốn bìa màu trơn, vài tờ rời thò ra, chồng cao hơn bề ngang. Tuyệt đối không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Không chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A tall untidy stack of many scientific papers and thin journals piled on top of one another, some with plain coloured covers and some loose sheets sticking out, the stack taller than it is wide. Absolutely no letters, no words and no numbers. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-29 · `place` · ✅ có trên Flow

**Tên card:** Southern Africa Map With Country In Red

**Lời kể (`at`):** In 1924, **an anatomist in South Africa** announced the fossil of a young ancient ape-human with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown.

**Ý đồ:** Dia ly (o anh 6): Nam Phi

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng theo hình bản đồ tham chiếu (30-maps-04): nước Nam Phi tô đỏ phẳng có chữ "SOUTH AFRICA" in hoa. Không tiêu đề, không số, không la bàn, không tên nơi nào khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ "SOUTH AFRICA".

**Sinh bằng:** câu @mention — chip `@30-maps-04.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a map shaped like @30-maps-04.png with the same style as @01-pyramid-place.png, fill South Africa with one flat red colour and label it "SOUTH AFRICA" in plain capital letters, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `30-maps-04.png`

**Ghi chú:** 30-maps-04 chep tu refs/case-1/13-maps-02 (South Africa location map). Lien bang Nam Phi 1924 — duong vien ngoai giong nay.

### C2-29c · `object` · ✅ có trên Flow

**Tên card:** Small Fossil Skull Ref Pale Face

**Lời kể (`at`):** In 1924, an anatomist in South Africa announced the fossil of **a young ancient ape-human** with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown.

**Ý đồ:** Asset so Taung (hoa thach, KHONG phai hai cot tre em ngay nay)

**🖼️ Ảnh sẽ ra:** Một hộp sọ hoá thạch nhỏ của một con vượn-người non cổ đại nhìn chếch trước trái: khuôn mặt nhỏ tròn bằng xương như đá màu xám kem nhạt, hai hốc mắt to tròn, lỗ mũi ngắn dẹt, hàm dưới nhỏ với một hàng răng nhỏ đều giống răng người; phía sau mặt là một khối đá nâu sần hình phần sau đầu. Một mình. Không chữ.

**🔍 Cần soi khi ra ảnh:** Vật bảo tàng — KHÔNG dùng làm thumbnail. Răng nhỏ đều giống người là điểm then chốt.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Small Fossil Skull Ref Pale Face` — dùng lại ở: C2-29b

**Prompt gửi Flow:**

```text
A small fossil skull of a young ancient ape-like child seen from the front-left: a small rounded face of pale grey-cream stony bone with two large round eye sockets, a short flat nose opening, a small lower jaw with a row of small, even, human-like teeth, and behind the face a rough lumpy brown stone mass shaped like the back of the head. Shown alone. No lettering, no labels, no stand, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `27-taung-01.jpg`

**Ghi chú:** SHOT TAO ASSET. So Taung (Raymond Dart 1924-25). Khoi da nau phia sau la khuon nao tu nhien.

### C2-29b · `figure` · ✅ có trên Flow

**Tên card:** Young Anatomist Holding Small Fossil Skull

**Lời kể (`at`):** In 1924, an anatomist in South Africa **announced the fossil** of a young ancient ape-human with a small skull but a very humanlike jaw and teeth, the exact opposite of Piltdown.

**Ý đồ:** Nha giai phau Nam Phi (Raymond Dart, loi ke khong goi ten -> figure) cong bo hoa thach

**🖼️ Ảnh sẽ ra:** Một người đàn ông khoảng ba mươi nửa người, tóc sẫm chải gọn rẽ ngôi giữa, mặt cạo nhẵn, com-lê sẫm sơ mi trắng cà vạt sẫm, một tay giơ chính hộp sọ hoá thạch C2-29c (giữ nguyên) và nhìn nó. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hộp sọ đúng asset C2-29c.

**Sinh bằng:** câu @mention — chip `@02-doctor-figure.png` (file ảnh), `@Small Fossil Skull Ref Pale Face` (asset từ C2-29c). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a man of about thirty in the same drawing style as @02-doctor-figure.png, seen from the chest up, with neatly combed dark hair parted in the middle, clean-shaven, in a dark suit with a white shirt and a dark tie, holding up in one hand the same small fossil skull as in @Small Fossil Skull Ref Pale Face, keep the skull exactly the same, and looking at it, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-31 · `character` · ✅ có trên Flow

**Tên card:** Geologist Ref Long Face Tweed

**Lời kể (`at`):** In the late 1940s, **Kenneth Oakley**, a geologist at the Natural History Museum, tried out a new technique.

**Ý đồ:** Asset Kenneth Oakley ~1949-53 (38-42 tuoi)

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông cao gầy khoảng bốn mươi: mặt dài hẹp, mũi thẳng dài, trán cao, tóc sẫm hói vào hai bên thái dương chải thẳng ra sau, mặt cạo nhẵn, tai hơi vểnh; áo khoác tweed xám sọc mảnh, sơ mi trắng, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Mặt dài + tai vểnh + áo tweed; không kính (khác Weiner).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Geologist Ref Long Face Tweed` — dùng lại ở: C2-31b, C2-34b, C2-38

**Prompt gửi Flow:**

```text
A tall lean man of about forty seen from the chest up. A long narrow face with a long straight nose and a high forehead, dark hair receding at the temples and combed straight back, clean-shaven, ears that stick out slightly. He wears a grey tweed jacket with faint pinstripes, a white shirt and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `16-oakley-02.jpg`, `16-oakley-01.jpg`, `16-oakley-03.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh NPG 1957 (16-oakley-02) + anh phong thi nghiem 1953 (16-oakley-01, Oakley dung ben trai, ao tweed) + 1949 (16-oakley-03).

### C2-31b · `character` · ✅ có trên Flow

**Tên card:** Geologist Holding Up Test Tube At Bench

**Lời kể (`at`):** In the late 1940s, Kenneth Oakley, a geologist at the Natural History Museum, **tried out a new technique**.

**Ý đồ:** Oakley thu ky thuat moi trong phong thi nghiem

**🖼️ Ảnh sẽ ra:** Vẽ lại Oakley (C2-31, giữ nguyên mặt) nửa người trong áo tweed, đứng bên bàn thí nghiệm giơ một ống nghiệm thuỷ tinh lên nhìn; trên bàn có giá ống nghiệm và vài bình thuỷ tinh. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Mặt trung tính.

**Sinh bằng:** câu @mention — chip `@Geologist Ref Long Face Tweed` (asset từ C2-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Geologist Ref Long Face Tweed, keep his face exactly the same, seen from the waist up in the same tweed jacket, standing at a laboratory bench and holding up a glass test tube to look at it, a rack of test tubes and a few glass flasks on the bench, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Dung lai cho 'far younger than the age everyone had given them'.

### C2-32 · `object` · ✅ có trên Flow

**Tên card:** Glass Vials Of Powder Beside Bone Sample

**Lời kể (`at`):** He measured **how much fluorine** the bones had absorbed from the soil over time.

**Ý đồ:** Do flo trong xuong: mau bot xuong trong lo

**🖼️ Ảnh sẽ ra:** Năm lọ thuỷ tinh nhỏ đứng trong giá gỗ, mỗi lọ chứa ít bột nhạt màu, cạnh đó là một mẩu xương nâu đỏ có một lỗ khoan nhỏ và một đĩa thuỷ tinh nhỏ. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Không nhãn chữ trên lọ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A row of five small glass vials standing in a wooden rack, each holding a little pale powder, next to a small piece of reddish brown bone with a tiny drilled hole in it and a small glass dish. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `16-oakley-03.jpg`

**Ghi chú:** Anh 1949: Oakley va Parsons ban viec lay mau ham de do flo.

### C2-32b · `object` · ✅ có trên Flow

**Tên card:** Ground Cut Away With Buried Bone

**Lời kể (`at`):** He measured how much fluorine the bones had **absorbed from the soil over time**.

**Ý đồ:** Giai thich co che: xuong nam trong dat hut flo theo thoi gian (o anh 8)

**🖼️ Ảnh sẽ ra:** Một lát cắt thẳng xuống lòng đất như lát bánh: trên cùng là dải cỏ xanh mỏng, rồi các lớp đất nâu, rồi một lớp sỏi cuội; trong lớp sỏi có một khúc xương cũ nằm nghiêng. Không chữ.

**🔍 Cần soi khi ra ảnh:** Xương chung chung, không phải xương người nhận ra được.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A cross-section of the ground cut straight down like a slice of cake: a thin strip of green grass on top, then layers of brown earth, then a layer of pebbly gravel, and buried in the gravel layer a single old animal bone lying on its side. No lettering, no people, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-34 · `character` · ✅ có trên Flow

**Tên card:** Anthropologist Ref Thick Dark Glasses

**Lời kể (`at`):** In 1953, **Joseph Weiner**, an anthropologist at Oxford University, began talking over the Piltdown puzzle with Oakley.

**Ý đồ:** Asset Joseph Weiner 1953 (38 tuoi)

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông khoảng ba mươi tám: mặt tròn đầy, má mềm, tóc sẫm đã hói ở trán và thưa trên đỉnh, mặt cạo nhẵn; kính gọng sừng chữ nhật dày màu sẫm; áo vest sẫm, sơ mi trắng, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Kính gọng sừng dày là dấu nhận diện số 1.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Anthropologist Ref Thick Dark Glasses` — dùng lại ở: C2-34b, C2-35, C2-36

**Prompt gửi Flow:**

```text
A man of about thirty-eight seen from the chest up. A round, full face with soft cheeks, dark hair already receding at the front and thin on top, clean-shaven. Thick dark rectangular horn-rimmed spectacles. He wears a dark suit jacket, a white shirt and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `17-weiner-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Anh duy nhat tim duoc (17-weiner-01, NHM) chup luc ong ~55-60: hoi, toc bac. Ve tre lai cho 1953, giu mat tron + kinh gong sung day. Nguon them: anh tap the Khoa Giai phau Oxford ~1951-53 ta 'horn-rimmed glasses'.

### C2-34b · `group` · ✅ có trên Flow

**Tên card:** Two Scholars Talking Face To Face

**Lời kể (`at`):** In 1953, Joseph Weiner, an anthropologist at Oxford University, began **talking over the Piltdown puzzle** with Oakley.

**Ý đồ:** Weiner noi chuyen voi Oakley (luat 8: nguoi noi + nguoi nghe)

**🖼️ Ảnh sẽ ra:** Weiner (C2-34, giữ nguyên mặt và kính) nguyên người trong com-lê sẫm, một tay giơ lên đang nói; Oakley (C2-31, giữ nguyên mặt) đứng đối diện nguyên người trong áo tweed quần xám giày nâu, đang nghe. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hai mặt không lẫn (kính chỉ ở Weiner).

**Sinh bằng:** câu @mention — chip `@Anthropologist Ref Thick Dark Glasses` (asset từ C2-34), `@Geologist Ref Long Face Tweed` (asset từ C2-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Anthropologist Ref Thick Dark Glasses, keep his face and glasses exactly the same, seen full length in the same dark suit with dark trousers and black shoes, talking with one hand raised, and the same man as in @Geologist Ref Long Face Tweed, keep his face exactly the same, standing facing him full length in the same tweed jacket with grey trousers and brown shoes, listening, do not mix their features, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C2-34c · `place` · ✅ có trên Flow

**Tên card:** Round Domed Stone Library Building

**Lời kể (`at`):** In 1953, Joseph Weiner, **an anthropologist at Oxford University**, began talking over the Piltdown puzzle with Oakley.

**Ý đồ:** Bieu tuong Dai hoc Oxford (Radcliffe Camera) — Weiner lam o Khoa Giai phau, KHONG phai toa nha nay

**🖼️ Ảnh sẽ ra:** Một toà thư viện tròn lớn bằng đá màu mật ong nhạt: thân tròn rộng có các cặp cột cao bao quanh và cửa sổ cao xen giữa, chân đế đá thô có cửa vòm, lan can đá quanh mép trên, mái vòm lớn màu xám chì có cửa sổ tròn nhỏ, trên đỉnh là một chòi đèn nhỏ. Nhìn hơi từ trên xuống, đứng trên bãi cỏ. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Hình khối tròn + mái vòm như ảnh 26-oxford-01.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A large round domed library building of pale honey-coloured stone: a wide circular drum with pairs of tall columns all around it and tall windows between them, a rough stone base with arched doorways, a stone balustrade around the top, and a big lead-grey dome with small round windows, topped by a small lantern. Seen from a little above, standing on a green lawn. No people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `26-oxford-01.jpg`

### C2-35 · `character` · ✅ có trên Flow

**Tên card:** Scholar Studying Plaster Jaw Cast

**Lời kể (`at`):** Weiner **went back through the reports** and the casts of the fossils, and he noticed that the 2 molars were worn down just a little too evenly, as if someone had ground them with something.

**Ý đồ:** Weiner xem lai bao cao va ban duc

**🖼️ Ảnh sẽ ra:** Vẽ lại Weiner (C2-34, giữ nguyên mặt và kính) nửa người ngồi bên bàn, một tay cầm khuôn thạch cao trắng của một hàm dưới và nhìn kỹ; trên bàn có một bìa hồ sơ mở và hai khuôn thạch cao khác; giấy chỉ có đường xám mờ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không chữ đọc được.

**Sinh bằng:** câu @mention — chip `@Anthropologist Ref Thick Dark Glasses` (asset từ C2-34). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Anthropologist Ref Thick Dark Glasses, keep his face and glasses exactly the same, seen from the waist up in the same dark suit, sitting at a table and looking closely at a pale plaster cast of a lower jaw that he holds in one hand, an open folder of papers and two more pale plaster casts on the table, the papers show only faint grey lines with no readable letters, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-36 · `character` · ✅ có trên Flow

**Tên card:** Scholar Filing A White Tooth At Bench

**Lời kể (`at`):** His team took some chimpanzee teeth, **filed them down**, and stained them.

**Ý đồ:** Nhom Weiner dua rang tinh tinh (thi nghiem — su that co nguon)

**🖼️ Ảnh sẽ ra:** Vẽ lại Weiner (C2-34, giữ nguyên mặt và kính) nửa người mặc áo blouse trắng phòng thí nghiệm, ngồi bên bàn dùng một cây dũa kim loại nhỏ chà lên mặt một chiếc răng trắng cầm ở tay kia; trên bàn có thêm vài chiếc răng trắng. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Đọc ra là ĐANG DŨA răng.

**Sinh bằng:** câu @mention — chip `@Anthropologist Ref Thick Dark Glasses` (asset từ C2-34). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Anthropologist Ref Thick Dark Glasses, keep his face and glasses exactly the same, seen from the waist up in a white laboratory coat, sitting at a lab bench and rubbing a small metal file across the top of a single white tooth held in his other hand, a few more white teeth lying on the bench, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** 'His team' — ve Weiner dai dien nhom.

### C2-36b · `object` · ✅ có trên Flow

**Tên card:** Four Loose Pale Ape Teeth

**Lời kể (`at`):** His team **took some chimpanzee teeth**, filed them down, and stained them.

**Ý đồ:** Rang tinh tinh hien dai (TRANG) — khac rang hoa thach nau o C2-44

**🖼️ Ảnh sẽ ra:** Bốn chiếc răng vượn rời màu kem nhạt nằm cách nhau trên nền trắng: hai răng hàm rộng mặt trên lồi lõm có chân dài, và hai răng nhỏ hơn. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Phải TRẮNG sạch (chưa nhuộm).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Four loose ape teeth lying apart on a plain white background: two broad back teeth with bumpy tops and long roots, and two smaller teeth, all clean and pale cream in colour. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-36c · `object` · ✅ có trên Flow

**Tên card:** Tooth Soaking In Dish Of Brown Stain

**Lời kể (`at`):** His team took some chimpanzee teeth, filed them down, **and stained them**.

**Ý đồ:** Nhuom rang (buoc thu ba cua thi nghiem)

**🖼️ Ảnh sẽ ra:** Một đĩa sứ trắng nhỏ đựng dung dịch nâu sẫm, một chiếc răng nằm trong đó, nửa đã nhuốm nâu, nửa còn trắng; một cái nhíp kim loại gác trên mép đĩa. Không chữ, không tay người.

**🔍 Cần soi khi ra ảnh:** Không vẽ tay.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small white porcelain dish filled with a dark brown liquid, one tooth lying in it with the half under the liquid stained brown and the rest still white, and a pair of metal tweezers resting on the rim of the dish. No lettering, no hands, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-37 · `object` · ✅ có trên Flow

**Tên card:** Two Matching Brown Flat Topped Teeth

**Lời kể (`at`):** The result looked **almost identical to Piltdown**.

**Ý đồ:** Ket qua: rang gia trong giong het Piltdown

**🖼️ Ảnh sẽ ra:** Hai chiếc răng hàm nâu đặt cạnh nhau trên nền trắng, cả hai mặt trên mài phẳng, cùng nhuộm một màu nâu đỏ, trông gần như y hệt nhau. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Hai chiếc phải gần như giống hệt.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Two brown back teeth side by side, both with tops ground perfectly flat and both stained the same reddish brown, looking almost exactly alike. No lettering, no labels, no people, plain white background. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-38 · `character` · ✅ có trên Flow

**Tên card:** Geologist Looking Into Microscope

**Lời kể (`at`):** Then they put the real Piltdown teeth **under a microscope**, and the file marks were plain to see.

**Ý đồ:** Soi rang that duoi kinh hien vi (Oakley giu hoa thach that — nguon: Weiner nho Oakley soi)

**🖼️ Ảnh sẽ ra:** Vẽ lại Oakley (C2-31, giữ nguyên mặt) nửa người trong áo tweed, cúi nhìn vào thị kính một chiếc kính hiển vi đen của phòng thí nghiệm thập niên 1950. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Kính hiển vi kiểu cũ, không vẽ máy hiện đại.

**Sinh bằng:** câu @mention — chip `@Geologist Ref Long Face Tweed` (asset từ C2-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Geologist Ref Long Face Tweed, keep his face exactly the same, seen from the waist up in the same tweed jacket, bending over a black laboratory microscope of the 1950s and looking into its eyepiece, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-38b · `object` · ✅ có trên Flow

**Tên card:** Round Microscope View Of Scratched Tooth

**Lời kể (`at`):** Then they put the real Piltdown teeth under a microscope, and **the file marks were plain to see**.

**Ý đồ:** Vet dua nhin qua kinh hien vi

**🖼️ Ảnh sẽ ra:** Một khung nhìn tròn như qua kính hiển vi, bên trong là cận cảnh mặt răng phẳng màu xám, chằng chịt những vết xước thẳng mảnh song song chạy chéo theo hai hướng, viền tối quanh vòng tròn. Không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Vết xước SONG SONG thẳng (không ngoằn ngoèo).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A round circle of view as seen through a microscope, filled with a close-up of the flat grey surface of a tooth, criss-crossed by many fine straight parallel scratch lines running diagonally in two directions, with a dark rim around the circle. No lettering, no numbers, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `29-microscope-01.jpg`

**Ghi chú:** Anh 29-microscope-01 la anh SEM ve sau; chi lay hinh vet xuoc song song.

### C2-39 · `object` · ✅ có trên Flow

**Tên card:** Dark X-Ray Film Of One Molar

**Lời kể (`at`):** **X-rays showed** that no new dentin had grown in beneath the worn surface, which meant the wear hadn't happened while the owner of those teeth was alive.

**Ý đồ:** Phim X-quang (o anh 4)

**🖼️ Ảnh sẽ ra:** Một tấm phim X-quang nha khoa cũ: hình chữ nhật nhỏ màu xám đen, giữa là đường viền trắng sáng của một chiếc răng hàm có hai chân, bên trong răng hơi tối hơn. Không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Không chữ số trên phim.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An old dental X-ray film: a small dark grey-black rectangle of film with a pale glowing white outline of a single molar tooth with two roots in the middle, the inside of the tooth slightly darker. No lettering, no numbers, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Dung lai cho 'no new dentin had grown'.

### C2-41 · `object` · ✅ có trên Flow

**Tên card:** Skull Parts Pulled Apart

**Lời kể (`at`):** **Piltdown Man was a patchwork**.

**Ý đồ:** 'Patchwork' — ban phuc dung tach ra thanh tung phan (trang thai noi tu C2-16)

**🖼️ Ảnh sẽ ra:** Chính hộp sọ C2-16 nay tách ra thành các phần lơ lửng cách nhau một khoảng nhỏ như sơ đồ tháo rời: các mảnh xương nâu đỏ của vòm sọ, cái hàm dài kiểu vượn, vài chiếc răng rời; phần thạch cao trắng biến mất. Không chữ, không mũi tên.

**🔍 Cần soi khi ra ảnh:** Đọc ra là CÁC MẢNH RỜI ghép lại, không phải sọ vỡ.

**Sinh bằng:** câu @mention — chip `@Reconstructed Skull Ref Plaster Patches` (asset từ C2-16). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same reconstructed skull as in @Reconstructed Skull Ref Plaster Patches, now pulled apart into its separate parts floating slightly apart from each other with small gaps between them like an exploded diagram: the dark reddish brown pieces of the skull dome, the long ape-like jaw and a few loose teeth, the white plaster gone, no arrows, no lettering, plain white background
```

### C2-42 · `figure` · ✅ có trên Flow

**Tên card:** Medieval Man In Brown Hooded Tunic

**Lời kể (`at`):** The skull came from a human who had **lived in the Middle Ages**.

**Ý đồ:** Nguon goc hop so: mot nguoi thoi Trung co (minh hoa chung)

**🖼️ Ảnh sẽ ra:** Một người nông dân Anh thời Trung cổ (khoảng thế kỷ 14) nửa người: tóc nâu ngắn, râu ngắn, áo chùng len nâu trơn, mũ trùm vắt quanh vai. Mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Minh hoạ 'một người thời Trung cổ', không phải nhân vật cụ thể.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A medieval English peasant man of about the 1300s seen from the chest up: short brown hair and a short beard, wearing a plain brown wool tunic with a hood lying around his shoulders, a calm neutral face. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-43 · `object` · ✅ có trên Flow

**Tên card:** Sitting Orangutan Reddish Hair

**Lời kể (`at`):** **The jaw came from an orangutan** that had died about 500 years earlier.

**Ý đồ:** Nguon goc ham: con duoi uoi (o anh 4) — dung lai cho 'the same orangutan'

**🖼️ Ảnh sẽ ra:** Một con đười ươi trưởng thành ngồi bình thản nhìn thẳng, lông dài bờm xờm màu đỏ cam trên tay dài và thân, mặt trần sẫm mắt nhỏ, tay dài chống xuống đất. Chỉ con vật.

**🔍 Cần soi khi ra ảnh:** Không vẽ thành tinh tinh (lông phải đỏ cam).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An adult orangutan sitting calmly, seen from the front, with long shaggy reddish-orange hair on its long arms and body, a dark bare face with small eyes, and its long arms resting on the ground. Only the animal, no people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-44 · `object` · ✅ có trên Flow

**Tên card:** Three Dark Brown Fossil Ape Teeth

**Lời kể (`at`):** There were also **a few fossil chimpanzee teeth**.

**Ý đồ:** Rang tinh tinh HOA THACH (nau) — khac rang trang C2-36b

**🖼️ Ảnh sẽ ra:** Ba chiếc răng vượn hoá thạch cũ nằm rời trên nền trắng, nhuộm nâu sẫm mặt xỉn như đá, một chiếc nhọn, hai chiếc rộng. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Phải NÂU SẪM (khác răng trắng C2-36b).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Three small old fossil ape teeth lying apart, stained dark brown with a dull stony surface, one pointed and two broad. No lettering, no labels, no people, plain white background. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-45 · `object` · ✅ có trên Flow

**Tên card:** Two Glass Bottles Of Brown Stain

**Lời kể (`at`):** Everything had been stained with **an iron solution and chromic acid** to make it look ancient.

**Ý đồ:** Hoa chat nhuom (ten hoa chat la chu hau ky)

**🖼️ Ảnh sẽ ra:** Hai chai thuỷ tinh kiểu nhà thuốc cũ có nút thuỷ tinh đứng cạnh nhau, một chai đựng dung dịch nâu gỉ, chai kia màu cam sẫm, mỗi chai dán nhãn giấy trống trơn; phía trước là một cây cọ nhỏ đầu nhuốm nâu. Tuyệt đối không chữ, không số.

**🔍 Cần soi khi ra ảnh:** Nhãn phải TRỐNG.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Two old glass chemist's bottles with glass stoppers standing side by side, one holding a rust-brown liquid and the other a dark orange liquid, each with a plain blank paper label with nothing written on it, and a small paintbrush with a brown-stained tip lying in front of them. Absolutely no letters, no words and no numbers. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Dung lai cho 'the way the bones were stained'.

### C2-46 · `object` · ✅ có trên Flow

**Tên card:** Hands Filing Teeth Of Jaw

**Lời kể (`at`):** And the 2 flat, humanlike molars that had turned an ape's jaw into the missing link had been **filed down by hand**.

**Ý đồ:** Hanh vi gia mao (su that da duoc chung minh) — chi ve tay, khong lo nguoi

**🖼️ Ảnh sẽ ra:** Cận cảnh chính cái hàm C2-10 (giữ nguyên), một bàn tay giữ yên hàm, bàn tay kia chà một cây dũa kim loại dẹt nhỏ lên mặt hai răng hàm; chỉ thấy bàn tay và cổ tay, không mặt người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không lộ mặt ai (danh tính kẻ giả mạo để lời kể tiết lộ sau).

**Sinh bằng:** câu @mention — chip `@Jaw Ref Two Flat Molars` (asset từ C2-10). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a close-up of the same jaw as in @Jaw Ref Two Flat Molars, keep it exactly the same, held still by one hand while another hand rubs a small flat metal file across the tops of its two back teeth, only the hands and wrists shown, no faces, no lettering, plain white background
```

### C2-47 · `symbol` · ✅ có trên Flow

**Tên card:** Row Of Six Grey Silhouettes Of Men

**Lời kể (`at`):** For decades, **the list of suspects kept growing**.

**Ý đồ:** Danh sach nghi pham (bong den — skill 5c-3)

**🖼️ Ảnh sẽ ra:** Một hàng sáu bóng người đàn ông xám sẫm phẳng đứng cạnh nhau nguyên người, mỗi bóng là một khối đặc không mặt không chi tiết, dáng đầu thế kỷ 20 khác nhau: hai người đội mũ quả dưa, một người mũ chóp cao, một người hói, một người áo khoác dài, một người đội mũ lưỡi trai. Không chữ, không dấu hỏi.

**🔍 Cần soi khi ra ảnh:** Không có mặt. Dấu hỏi là hậu kỳ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A row of six plain dark grey silhouettes of men standing side by side, seen full length, each one a flat solid shape with no face and no details, in different early-1900s outlines: two with bowler hats, one with a top hat, one bald, one in a long coat and one with a cloth cap. No lettering, no question marks. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-48 · `group` · ✅ có trên Flow

**Tên card:** Three Modern Scientists Studying Bone Fragments

**Lời kể (`at`):** Then in 2016, after 8 years of research, **a team from the Natural History Museum** and Liverpool John Moores University published their conclusion.

**Ý đồ:** Nhom nghien cuu 2016 (NHM + Liverpool John Moores; khong goi ten)

**🖼️ Ảnh sẽ ra:** Ba nhà khoa học ngày nay mặc áo blouse trắng đeo găng xanh đứng quanh bàn thí nghiệm, một phụ nữ buộc tóc và hai người đàn ông, một người giơ một mảnh xương nâu nhỏ lên xem; trên bàn có máy tính xách tay và vài mảnh xương nâu. Không chữ.

**🔍 Cần soi khi ra ảnh:** Trang phục hiện đại (2016), không lẫn thời 1912.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `03-five-men-group.png`

**Prompt gửi Flow:**

```text
Three present-day scientists in white lab coats and blue gloves standing around a laboratory table, one woman with her hair tied back and two men, one of them holding a small brown bone fragment up to look at it, a laptop and a few brown bone pieces on the table. No lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C2-49 · `symbol` · ✅ có trên Flow

**Tên card:** One Grey Silhouette Of A Man In Bowler

**Lời kể (`at`):** There had been **only one forger**.

**Ý đồ:** Chi mot ke gia mao — mot bong nguoi

**🖼️ Ảnh sẽ ra:** Một bóng người đàn ông xám sẫm phẳng duy nhất đứng nguyên người, đội mũ quả dưa, khối đặc không mặt không chi tiết. Không chữ, không dấu hỏi.

**🔍 Cần soi khi ra ảnh:** Bóng trung tính — chưa lộ là Dawson (câu sau mới nói).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One single plain dark grey silhouette of a man of the early 1900s in a bowler hat, standing, seen full length, a flat solid shape with no face and no details. No lettering, no question mark. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-50b · `object` · ✅ có trên Flow

**Tên card:** Bone Crack Packed With Gravel Grains

**Lời kể (`at`):** The methods used on Piltdown 1 and Piltdown 2 were the same, from the way the bones were stained, to **the gravel packed into their cracks**, to the dental putty used to fix the teeth in place.

**Ý đồ:** Dau vet giong nhau: soi nhet vao ke nut

**🖼️ Ảnh sẽ ra:** Cận cảnh một mảnh xương sọ cùng chất nâu đỏ như mảnh C2-04e, có một vết nứt sâu chạy ngang được nhét chặt những hạt sỏi cát nâu li ti. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Thấy rõ sỏi NẰM TRONG vết nứt.

**Sinh bằng:** câu @mention — chip `@Skull Fragment Ref Reddish Brown` (asset từ C2-04e). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a close-up of a single piece of skull bone made of exactly the same reddish brown stained bone as @Skull Fragment Ref Reddish Brown, with a deep crack running across it that is packed tight with tiny grains of brown gravel and sand, no labels, no lettering, plain white background
```

### C2-50c · `object` · ✅ có trên Flow

**Tên card:** Tooth Held In Socket With Grey Putty

**Lời kể (`at`):** The methods used on Piltdown 1 and Piltdown 2 were the same, from the way the bones were stained, to the gravel packed into their cracks, to **the dental putty used to fix the teeth in place**.

**Ý đồ:** Dau vet giong nhau: chat tram nha khoa giu rang

**🖼️ Ảnh sẽ ra:** Cận cảnh một chiếc răng hàm nâu cắm trong một hốc của mẩu xương hàm nâu đỏ, quanh chân răng có một vòng chất trám màu xám hồng bị ép đầy để giữ răng. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Thấy rõ vòng chất trám quanh chân răng.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A close-up of a single brown back tooth set into a hole in a piece of reddish brown jaw bone, with a ring of grey-pink putty squeezed in around the base of the tooth to hold it in place. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-51 · `symbol` · ✅ có trên Flow

**Tên card:** Twisted Ladder Double Helix

**Lời kể (`at`):** **DNA analysis** even showed that the teeth from both sites came from the same orangutan.

**Ý đồ:** VAT TUONG TRUNG cho phan tich DNA (o anh 8)

**🖼️ Ảnh sẽ ra:** Một chuỗi xoắn kép DNA đơn giản: hai dải trơn xoắn quanh nhau, nối bằng những bậc thẳng ngắn như cái thang xoắn, màu xanh dương và cam, dựng đứng. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không chữ cái A/T/G/C.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A simple DNA double helix: two smooth ribbons twisting around each other, joined by short straight rungs like a twisted ladder, in blue and orange, standing upright. No letters, no lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-53 · `object` · ✅ có trên Flow

**Tên card:** Wooden Cabinet Crowded With Antiquities

**Lời kể (`at`):** Another archaeologist went back through **Dawson's lifelong collection** and counted at least 38 fakes.

**Ý đồ:** Bo suu tap ca doi cua Dawson (con so 38 la chu hau ky)

**🖼️ Ảnh sẽ ra:** Một tủ trưng bày gỗ cũ cao có cửa kính và nhiều ngăn, chật kín đồ cổ nhỏ: hũ gốm cũ, tượng đồng nhỏ, công cụ đá lửa, đồng xu cổ, gạch và xương, mỗi món đứng riêng. Không chữ, không nhãn.

**🔍 Cần soi khi ra ảnh:** Không nhãn chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A tall old wooden display cabinet with glass doors and several shelves crowded with small antiquities: old pottery jars, bronze figurines, flint tools, old coins, bricks and bones, each small object standing on its own. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C2-53b · `figure` · ✅ có trên Flow

**Tên card:** Modern Archaeologist With Magnifying Glass

**Lời kể (`at`):** **Another archaeologist** went back through Dawson's lifelong collection and counted at least 38 fakes.

**Ý đồ:** Nha khao co ngay nay (Miles Russell, khong goi ten -> figure)

**🖼️ Ảnh sẽ ra:** Một nhà khảo cổ ngày nay khoảng năm mươi tuổi, tóc xám ngắn, râu xám ngắn, sơ mi xanh và áo len sẫm, nửa người ngồi bên bàn soi kỹ một đồ vật cổ nhỏ qua kính lúp; trên bàn có thêm vài món đồ cổ nhỏ. Không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Trang phục hiện đại.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A present-day archaeologist, a man of about fifty with short grey hair and a short grey beard, in a blue shirt and a dark jumper, seen from the waist up sitting at a table and looking closely at a small old object through a magnifying glass, a few more small old objects on the table. No lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-55 · `character` · ✅ có trên Flow

**Tên card:** Retired Scholar Ref White Beard Homburg

**Lời kể (`at`):** **When he retired in 1924**, he bought a house near Piltdown, and for the next 20 years he kept digging in that same gravel pit, the one that hadn't given up a single bone since the day Dawson died.

**Ý đồ:** Asset Woodward luc ve huu (60-80 tuoi) — skill 5b doi tuoi + trang phuc

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một ông già khoảng bảy mươi: mặt dài, râu quai nón trắng đầy và ria trắng dày, kính tròn nhỏ; mũ phớt nỉ xám có dải băng sẫm, áo khoác dài sẫm, sơ mi trắng, nơ đen. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Râu TRẮNG + mũ phớt — khác bản 1912 (râu sẫm, kính kẹp mũi).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Retired Scholar Ref White Beard Homburg` — dùng lại ở: C2-55c

**Prompt gửi Flow:**

```text
An old man of about seventy seen from the chest up. A long face, a full white beard and a thick white moustache, small round spectacles. He wears a grey felt homburg hat with a dark band, a long dark overcoat over a white shirt and a black bow tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `15-woodward-02.png`

**Ghi chú:** SHOT TAO ASSET. Anh BGS P537725 (15-woodward-02): rau trang, mu phot, ao khoac dai, no. Bo shot 'ngoi nha gan Piltdown' vi khong co anh that cua nha (Hill Place, Haywards Heath).

### C2-55c · `character` · ✅ có trên Flow

**Tên card:** Old Man Sifting Gravel Alone By Hedge

**Lời kể (`at`):** When he retired in 1924, he bought a house near Piltdown, and for the next 20 years **he kept digging in that same gravel pit**, the one that hadn't given up a single bone since the day Dawson died.

**Ý đồ:** Canh MO cua cap doi xung voi C2-08b: cung ranh, cung thung, nay mot minh va gia

**🖼️ Ảnh sẽ ra:** Vẽ lại Woodward già (C2-55, giữ nguyên mặt, râu, kính) vẫn đội mũ phớt, cởi áo khoác, mặc gi-lê và sơ mi xắn tay, quần sẫm, ủng, nguyên người cúi bên thùng gỗ sàng sỏi qua sàng tròn, MỘT MÌNH ở rãnh sỏi (C2-04b, giữ nguyên nơi chốn). Không ai khác. Không chữ.

**🔍 Cần soi khi ra ảnh:** Cùng nơi chốn và đồ nghề với C2-08b để hai cảnh cắt cạnh nhau đọc ra ngay. Mặt trung tính.

**Sinh bằng:** câu @mention — chip `@Retired Scholar Ref White Beard Homburg` (asset từ C2-55), `@Gravel Trench Ref Hedge Edge` (asset từ C2-04b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same old man as in @Retired Scholar Ref White Beard Homburg, keep his face, white beard and spectacles exactly the same, wearing the same homburg hat but with his overcoat off, in a waistcoat and rolled-up shirtsleeves, dark trousers and boots, seen full length bending over a wooden half-barrel tub and sifting gravel through a round garden sieve, alone at @Gravel Trench Ref Hedge Edge, keep the place exactly the same, nobody else anywhere in the picture, no lettering. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C2-57 · `object` · ✅ có trên Flow

**Tên card:** Garden Sieve Holding Only Pebbles

**Lời kể (`at`):** **He never found anything else**.

**Ý đồ:** Ket: sang chi con soi — doi xung voi khay hien vat C2-09

**🖼️ Ảnh sẽ ra:** Một cái sàng tròn khung gỗ đáy lưới thép nhìn từ trên xuống, chỉ đựng sỏi cuội xám nâu bình thường, không có gì khác. Không xương, không chữ.

**🔍 Cần soi khi ra ảnh:** Tuyệt đối không có xương/răng trong sàng.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A round wooden garden sieve with a wire mesh bottom seen from above, holding only ordinary grey and brown pebbles and gravel and nothing else. No bones, no teeth, no lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```
