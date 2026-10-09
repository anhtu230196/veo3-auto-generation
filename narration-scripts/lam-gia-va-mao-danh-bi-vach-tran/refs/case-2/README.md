# refs/case-2 — Piltdown Man (Charles Dawson, 1908 → 1953, kết luận 2016)

Gom 2026-10-09 (Claude Opus 5.5) theo skill `case-reference-images`, Tú cho tải danh sách 33 file. Ảnh chỉ để soi
rồi tả bằng chữ — trừ bản đồ (chip `@` hình khối, skill 4d-bis 4a). File ảnh bị `.gitignore`, chỉ commit README.

⚠️ Ảnh tải từ BGS Earthwise và Linda Hall bị API đọc ảnh của Claude **từ chối** khi mở thẳng; phải mã hoá lại thành
JPEG chuẩn (chụp qua Playwright) mới soi được. File gốc giữ nguyên, bản mã hoá lại nằm ngoài repo.

## Nhóm ảnh ↔ shot

| Prefix | Nội dung | Dùng cho | Số ảnh |
| --- | --- | --- | --- |
| `14-dawson` | chân dung studio toàn thân Maull & Fox (lễ phục) | C2-01 và mọi shot Dawson | 1 |
| `15-woodward` | 01 chân dung ~1900s (râu sẫm, kính kẹp mũi); 02 lúc già (râu trắng, mũ phớt) | C2-07b; C2-55 | 2 |
| `16-oakley` | 01 phòng thí nghiệm 1953 với hàm Piltdown; 02 chân dung NPG 1957; 03 lấy mẫu đo flo 1949 | C2-31, C2-32 | 3 |
| `17-weiner` | chân dung NHM (chụp lúc ~55-60 tuổi) | C2-34 | 1 |
| `18-priest` | Teilhard de Chardin ăn trưa ở NHM 1935 — chỉ soi áo chùng, cổ cồn | C2-08 | 1 |
| `19-dig` | 01 Dawson + Woodward sàng sỏi, Hargreaves ở rãnh, hè 1913; 02 "Workers at Piltdown" (có ngỗng Chipper); 03 địa điểm 1952 | C2-04b, C2-04c, C2-08b | 3 |
| `20-barkham` | Barkham Manor hôm nay | C2-04 | 1 |
| `21-jaw` | 01 hàm (NHM); 02 hàm + răng nanh; 03, 04 bản in năm 1953 (hàm, hai răng hàm bị dũa); 05 bản khắc 1913; 06 so sánh ba hàm | C2-10, C2-13, C2-19b | 6 |
| `22-skull` | 01 mảnh sọ (NHM); 02 phục dựng 1912; 03 phục dựng Woodward/Keith; 04 tranh phục dựng; 05 khuôn sọ Wellcome | C2-04e, C2-16 | 5 |
| `23-meeting` | tranh John Cooke 1915 "A Discussion on the Piltdown Skull" | C2-01, C2-07b, C2-14 (trang phục, phòng họp) | 1 |
| `24-letter` | thư Dawson gửi Woodward 14/2/1912 | C2-07 (chỉ tham khảo, vẽ thư trống chữ) | 1 |
| `25-nhm` | mặt tiền Natural History Museum London | C2-07c | 1 |
| `26-oxford` | Radcliffe Camera — biểu tượng Đại học Oxford | C2-34c | 1 |
| `27-taung` | sọ Taung (bản đúc Frankfurt) | C2-29c | 1 |
| `28-antiquities` | 01 rìu tay Acheulean; 02 tượng đồng La Mã nhỏ | C2-03b, C2-03 | 2 |
| `29-microscope` | ảnh hiển vi điện tử vết dũa trên răng hàm | C2-38b | 1 |
| `30-maps` | 01 BlankMap-World-1898; 02 bản đồ định vị Piltdown (BGS); 03 England location map, 04 South Africa location map (chép từ `refs/case-1/13-maps-01/02`) | C2-21, C2-01b, C2-29 | 4 |

## Nguồn (tải lại được)

- BGS Earthwise, trang *Piltdown Man forgery* (earthwise.bgs.ac.uk/index.php/Piltdown_Man_forgery): `Piltdown_007,
  008, 009, 012, 013, 014, 027, 028, 029, 030, 038, 039, 040, 048, 049` và `001` — ảnh gốc ở `/images/<x>/<xx>/<tên>`.
- Linda Hall Library, *Scientist of the Day — Kenneth Oakley* và *Blade and Bone XI*: `Oakley 1, 4, 5, 6`,
  `45_Dawson_Piltdown_jaw_1913` (assets-us-01.kc-usercontent.com).
- Wikimedia Commons (bản 1280px): *Dr. A. S. Woodward of the British Museum (Natural History).jpg*, *Barkham Manor.jpg*,
  *Piltdown man.jpg*, *Skull of the "Eoanthropus Dawsoni" (Piltdown Man) Wellcome M0013579.jpg*, *Comparison of mandibles,
  The American Museum journal (c1900-(1918)).jpg*, *Piltdown gang (dark).jpg*, *Taung child (Frankfurt am Main)
  1-EditMylius.jpg*, *Natural History Museum London South Facade 2020 01.jpg*, *Radcliffe Camera, Oxford - Oct 2006.jpg*,
  *Acheulean hand axe (FindID 73844).jpg*, *Roman Genius-Paterfamilias figurine (FindID 461919).jpg*, *BlankMap-World-1898.png*.

## Chi tiết đã trích để viết nhân vật

- **Charles Dawson ~1912 (48 tuổi)** — `14-dawson-01`, `23-meeting-01` (hàng sau, thứ ba từ trái): người to béo, mặt
  rộng; đỉnh đầu hói nhẵn thành vòm, tóc sẫm ngắn hai bên; ria mép sẫm rất to vểnh hai đầu, không râu cằm. Tranh 1915 vẽ
  ông đeo kính tròn — **bỏ kính** (ảnh chụp không có, và để khác Woodward).
- **Arthur Smith Woodward ~1912 (48 tuổi)** — `15-woodward-01`, `23-meeting-01` (hàng sau, ngoài cùng phải): mặt dài,
  đỉnh đầu hói; râu quai nón và ria tỉa gọn (ảnh: sẫm; tranh 1915: đã bạc); kính kẹp mũi có dây đen; nơ đen.
- **Woodward lúc về hưu (60-80 tuổi)** — `15-woodward-02`: râu quai nón trắng đầy, ria trắng dày, kính tròn nhỏ, mũ
  phớt nỉ xám, áo khoác dài sẫm, nơ đen.
- **Kenneth Oakley (~40 tuổi)** — `16-oakley-01/02/03`: cao gầy, mặt dài hẹp, mũi thẳng dài, trán cao, tóc sẫm hói vào
  thái dương chải ngược, tai hơi vểnh; áo tweed xám sọc mảnh.
- **Joseph Weiner (1953, 38 tuổi)** — `17-weiner-01` chụp lúc ông ~55-60: mặt tròn đầy, đầu hói, **kính gọng sừng chữ
  nhật dày** là dấu nhận diện. Vẽ trẻ lại: tóc sẫm mới hói ở trán. Ảnh tập thể Khoa Giải phẫu Oxford ~1951-53 (tạp chí
  AJPA 2012, không tải) mô tả ông "smiling … horn-rimmed glasses".
- **Linh mục trẻ (Teilhard, 31 tuổi, lời kể không gọi tên → figure)** — `18-priest-01` (54 tuổi): mặt gầy, tóc ngắn
  chải ngược, áo chùng đen, dải cổ cồn trắng. Khi đi đào ông có thể mặc thường phục (`19-dig-02`) — cố ý giữ áo chùng.
- **Hố sỏi** — `19-dig-01`: KHÔNG phải mỏ đá, chỉ là **rãnh nông dọc chân bờ rào cây** ở mép cánh đồng; đồ nghề gồm
  thùng gỗ nửa thùng rượu, sàng tròn, xẻng, cuốc. Dawson mặc sơ mi kẻ có dây đeo quần, Woodward gi-lê.
- **Hàm** — `21-jaw-01`: hàm dưới bên phải, gãy cụt ở phía trước (không có cằm), tấm xương đứng phía sau gãy đỉnh, hai
  răng hàm mòn phẳng ở giữa; xương nâu đỏ như gỉ sắt, răng vàng nâu. Nhãn "1912" và "E 594" dán trên xương — không vẽ.
- **Mảnh sọ** — `22-skull-01`: năm mảnh cong dẹt nâu đỏ to nhỏ khác nhau.
- **Barkham Manor** — `20-barkham-01`: nhà Georgian gạch đỏ hai tầng khối vuông, mái đá phiến dốc thấp, ống khói cao,
  cửa sổ khung trượt trắng, cửa sổ vòm ở giữa, ao phía trước.

## Không tìm ra (stillMissing) — và cách xử lý

- **Ngôi nhà Woodward mua gần Piltdown (Hill Place, Haywards Heath)**: không tra ra ảnh → bỏ shot, dùng lại chân dung
  Woodward già.
- **Ảnh Weiner năm 1953**: chỉ có ảnh lúc già (BGS/NHM) và một ảnh tập thể trong bài AJPA (không tải). Vẽ trẻ lại.
- **Chân dung riêng của Teilhard năm 1912, Waterston, Dart, Miles Russell, nhóm 2016**: lời kể không gọi tên — vẽ
  `figure`/`group` minh hoạ, không tra.
- **Thuyền gỗ cổ của Dawson**: Commons `logboat dugout canoe prehistoric` ra 0 — tả bằng chữ (C2-03c, ghi rủi ro).
- **NPG (npg.org.uk)** chặn bằng trang kiểm tra chống bot — không vượt, lấy ảnh NPG 1957 của Oakley qua Linda Hall.
- **Wikipedia API** trả 429 khi tra nhanh — chuyển sang đọc trang bằng WebFetch.

## Truy vấn đã chạy (Commons `generator=search`)

Ra kết quả dùng được: `Arthur Smith Woodward`, `Piltdown skull`, `Piltdown mandible`, `Barkham Manor`,
`Taung child skull`, `Natural History Museum London facade`, `Radcliffe Camera Oxford`, `Acheulean hand axe flint`,
`Roman bronze figurine British Museum`, `BlankMap-World`. Trượt: `Charles Dawson Piltdown` (chỉ ảnh 193px), `Charles
Dawson` (người cùng tên), `Piltdown excavation`, `Piltdown gravel pit`, `Dawson Woodward excavating Piltdown`, `Kenneth
Oakley`, `Joseph Weiner anthropologist`, `Teilhard de Chardin 1913`, `Arthur Smith Woodward 1930`, `logboat dugout canoe
prehistoric`. Trang en.wiki *Piltdown Man*, *Charles Dawson*, *Kenneth Oakley*, *Joseph Weiner* đọc qua WebFetch.
