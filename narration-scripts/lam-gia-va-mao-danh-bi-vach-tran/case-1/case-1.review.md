# Review prompt ảnh — Forgeries and Impostors Exposed

Sinh bằng `scripts/review_shots.py` từ `case-1.shots.json` + `case-1.jobs.json`. Prompt dưới đây là **nguyên văn** gửi Flow. Cột *Lời kể* là trường `at`; chữ in đậm là `cue`.

**Trạng thái:** 85/85 ảnh đã tạo (theo log: output/run-lamgia-c1-a.log, output/run-lamgia-c1-b.log, output/run-lamgia-c1-c.log, output/run-lamgia-c1-d.log, output/run-lamgia-c1-e.log, output/run-lamgia-c1-f.log, output/run-lamgia-c1-g.log, trường `daTao` trong case-1.shots.json, kiểm Flow lúc 2026-09-28 00:09 UTC).

**Mọi ảnh trong file này:** Mọi ảnh vẽ theo nét của ba ảnh neo phong cách Tú gửi — viền mực đen dày không đều, tô màu phẳng, gạch chì thấy nét, nền trắng trơn — khổ 16:9. Người có MẶT ĐƠN GIẢN: mắt chấm nhỏ, mũi ngắn, miệng một nét (hoặc hình mở khi đang nói/cười), không đổ bóng trên mặt. Shot vẽ bằng CHỮ thì runner tự đính một ảnh neo theo loại (một người → 02, nhóm → 03, đồ vật/nơi chốn → 01). Shot @MENTION chỉ dùng ảnh được gọi tên trong câu. NĂM TẤM ẢNH TIÊN GỐC là hiện vật thật: lúc dựng có thể chèn thẳng ảnh thật (refs/case-1/01-fairy-photos-*) cạnh bản vẽ lại C1-14b, C1-20, C1-46, C1-47, C1-48 — Tú chọn.

## Bảng tổng

| Mã | Lời kể (`at`) | Loại | Tên card | Sinh bằng | Trạng thái |
|---|---|---|---|---|---|
| C1-01 | In the summer of 1917, in Cottingley, a small village **just outside the city of Bradford** in the north of England, two cousins kept getting into trouble for the very same thing. | `place` | Country Map With One Northern City Labelled | chip @ | ✅ có trên Flow |
| C1-02 | **Elsie Wright was 16**. | `character` | Older Girl Ref Bell Hat White Dress | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-03 | Her cousin **Frances Griffiths was only 9**. | `character` | Young Girl Ref Flower Band Long Hair | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-04 | Frances and her mother had recently come **back to England from South Africa**, and they were staying with Elsie's family. | `place` | Southern Africa Map With Cape Town Labelled | chip @ | ✅ có trên Flow |
| C1-04b | Frances and her mother **had recently come back** to England from South Africa, and they were staying with Elsie's family. | `object` | Passenger Steamship With Two Funnels | chữ + ảnh neo | ✅ có trên Flow |
| C1-04c | Frances and her mother had recently come back to England from South Africa, and they were **staying with Elsie's family**. | `place` | Stone End Terrace House With Tall Gable Chimney | chữ + ảnh neo | ✅ có trên Flow |
| C1-05 | At the bottom of the Wrights' garden ran a little stream, **what the locals call a beck**. | `place` | Stream Ref Flat Stones Small Fall | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-06 | **The girls spent hours down there**, and every time they came home with soaking wet shoes and muddy clothes. | `group` | Two Girls Crouching On Stream Stones | chip @ | ✅ có trên Flow |
| C1-06b | The girls spent hours down there, and every time they came home with **soaking wet shoes** and muddy clothes. | `object` | Pair Of Soaked Lace Up Girls Boots | chữ + ảnh neo | ✅ có trên Flow |
| C1-06c | The girls spent hours down there, and every time they came home with soaking wet shoes and **muddy clothes**. | `object` | White Cotton Dress With Muddy Hem | chữ + ảnh neo | ✅ có trên Flow |
| C1-07 | **When the grown-ups asked** what they could possibly be doing down there to get so wet, the girls had an answer ready. | `figure` | Mother Ref Pinned Bun Brown Coat | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-07b | When the grown-ups asked **what they could possibly be doing down there** to get so wet, the girls had an answer ready. | `group` | Mother Asking Two Wet Girls | chip @ | ✅ có trên Flow |
| C1-08 | **They were going to see the fairies**. | `group` | Two Girls Answering Their Mother | chip @ | ✅ có trên Flow |
| C1-10 | So one day in July 1917, Elsie **borrowed her father's camera**. | `object` | Box Camera Ref Black Leather | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-10b | So one day in July 1917, **Elsie borrowed** her father's camera. | `character` | Older Girl Holding Box Camera | chip @ | ✅ có trên Flow |
| C1-11 | **Arthur Wright was a keen amateur photographer**, with his own darkroom right there in the house. | `figure` | Father Ref Moustache Waistcoat | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-11b | Arthur Wright was a keen amateur photographer, with **his own darkroom right there in the house**. | `place` | Darkroom Ref Red Lamp Two Trays | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-12 | The girls **took the camera down to the stream**, and about half an hour later they came back looking triumphant. | `group` | Two Girls Carrying Camera Toward Stream | chip @ | ✅ có trên Flow |
| C1-12b | The girls took the camera down to the stream, and about half an hour later they **came back looking triumphant**. | `group` | Girls Handing Camera Back To Father | chip @ | ✅ có trên Flow |
| C1-13 | That evening, **Arthur developed the glass plate himself**. | `figure` | Father Rocking Tray In Red Lit Darkroom | chip @ | ✅ có trên Flow |
| C1-14 | **As the image slowly appeared** in the darkroom, he saw Frances sitting behind a bush, her chin resting on her hand, looking straight into the camera. | `object` | Glass Plate With Faint Image In Tray | chữ + ảnh neo | ✅ có trên Flow |
| C1-14b | As the image slowly appeared in the darkroom, he saw Frances sitting behind a bush, **her chin resting on her hand**, looking straight into the camera. | `character` | Girl With Chin On Hand And Four Tiny Fairies | chip @ | ✅ có trên Flow |
| C1-17 | He knew **his daughter was a gifted artist**, and Elsie had spent some time working in a photographer's studio. | `character` | Older Girl Painting With Paint Box | chip @ | ✅ có trên Flow |
| C1-17b | He knew his daughter was a gifted artist, and Elsie had spent some time **working in a photographer's studio**. | `character` | Older Girl Beside Big Studio Camera | chip @ | ✅ có trên Flow |
| C1-18 | He said the figures were **nothing but cardboard cutouts** and called the whole thing a prank. | `figure` | Father Holding Print And Speaking | chip @ | ✅ có trên Flow |
| C1-20 | This one showed Elsie sitting on the lawn, **holding out her hand toward a gnome** about one foot tall. | `character` | Older Girl On Lawn Reaching To Small Gnome | chip @ | ✅ có trên Flow |
| C1-21 | After that, Arthur **refused to lend them the camera** at all. | `group` | Father Keeping Camera From Two Girls | chip @ | ✅ có trên Flow |
| C1-22 | His wife Polly, though, **believed the photographs were real**. | `figure` | Mother Looking At Two Small Prints | chip @ | ✅ có trên Flow |
| C1-23 | Near the end of 1918, **Frances wrote to an old friend** back in Cape Town. | `character` | Young Girl Writing A Letter At Table | chip @ | ✅ có trên Flow |
| C1-26 | In 1919, Polly went to **a lecture given by the Theosophical Society** in Bradford, a group of people deeply interested in the spirit world. | `figure` | Lecturer Ref Bald White Fringe | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-26b | In 1919, Polly went to a lecture given by the Theosophical Society in Bradford, a group of people **deeply interested in the spirit world**. | `group` | Lecturer At Lectern Before Small Audience | chip @ | ✅ có trên Flow |
| C1-28 | When the talk was over, **Polly showed the speaker the 2 photographs**. | `group` | Mother Showing Prints To Lecturer | chip @ | ✅ có trên Flow |
| C1-29 | **They were passed around the society** until they reached Edward Gardner, one of its leading members. | `group` | Hands Passing Small Prints Along A Row | chữ + ảnh neo | ✅ có trên Flow |
| C1-29b | They were passed around the society until they reached **Edward Gardner, one of its leading members**. | `character` | Society Member Ref Dark Suit | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-30 | Gardner became convinced that for the very first time in history, fairies had appeared clearly enough to be **captured on a photographic plate**. | `character` | Society Member Holding Glass Plate To Light | chip @ | ✅ có trên Flow |
| C1-31 | Gardner took the original plates to **a photography expert named Harold Snelling**. | `figure` | Photo Expert Ref Round Spectacles | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-31b | **Gardner took the original plates** to a photography expert named Harold Snelling. | `group` | Society Member Handing Plates To Expert | chip @ | ✅ có trên Flow |
| C1-32 | **After studying them closely**, Snelling declared that both negatives were genuine, with no sign of studio trickery using paper or card. | `figure` | Expert Studying Plate Through Loupe | chip @ | ✅ có trên Flow |
| C1-33 | **These were straightforward photographs**, he said, of whatever had been in front of the camera at the time. | `figure` | Expert Holding Plate And Speaking | chip @ | ✅ có trên Flow |
| C1-34 | **The Kodak company examined them too**. | `figure` | Technician In White Coat Examining Print | chữ + ảnh neo | ✅ có trên Flow |
| C1-35 | Kodak couldn't find any sign of faking either, but it **refused to certify** that they were real pictures of fairies. | `object` | Blank Certificate Paper With Empty Seal | chữ + ảnh neo | ✅ có trên Flow |
| C1-36 | The next person to hear about the photographs was **Sir Arthur Conan Doyle**, the creator of Sherlock Holmes, the most famous detective in all of fiction, a man who trusted nothing but observation and logic. | `character` | Author Ref Walrus Moustache | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-36b | The next person to hear about the photographs was Sir Arthur Conan Doyle, **the creator of Sherlock Holmes**, the most famous detective in all of fiction, a man who trusted nothing but observation and logic. | `object` | Deerstalker Cap Beside Curved Pipe | chữ + ảnh neo | ✅ có trên Flow |
| C1-38 | **The Strand Magazine had just asked him** to write an article about fairies for its Christmas issue of 1920, and the Cottingley photographs reached him at exactly the right moment. | `object` | Magazine Ref Plain Blue Cover | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-38b | The Strand Magazine had just asked him to write an article about fairies for its Christmas issue of 1920, and the Cottingley photographs **reached him at exactly the right moment**. | `character` | Author Holding Two Small Photographs | chip @ | ✅ có trên Flow |
| C1-39 | In the summer of 1920, **Gardner traveled to Cottingley himself**. | `character` | Society Member Walking With Leather Case | chip @ | ✅ có trên Flow |
| C1-40 | **He brought 2 new cameras** and 24 photographic plates that had been secretly marked, so that nobody could swap them. | `object` | Folding Cameras Ref Two Bellows | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-40b | He brought 2 new cameras and **24 photographic plates** that had been secretly marked, so that nobody could swap them. | `object` | Open Box Of Glass Photographic Plates | chữ + ảnh neo | ✅ có trên Flow |
| C1-41 | Frances had moved away by then, but she was **invited back to stay for the school holidays**. | `character` | Teen Girl Ref White Hair Bow | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-42 | **The girls explained** that the fairies wouldn't come out if anyone was watching. | `character` | Young Woman Ref Dark Curls Side Fringe | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-42b | The girls explained that the fairies **wouldn't come out if anyone was watching**. | `group` | Two Girls Explaining To Visitor In Suit | chip @ | ✅ có trên Flow |
| C1-43 | **It rained for days on end**, and the weather didn't clear until August 19th. | `place` | Same Stream Under Heavy Rain | chip @ | ✅ có trên Flow |
| C1-44 | That day, **Polly went off to visit one of her sisters**, leaving the 2 girls at home with the cameras. | `figure` | Mother Walking Off With Travel Bag | chip @ | ✅ có trên Flow |
| C1-44b | That day, Polly went off to visit one of her sisters, **leaving the 2 girls at home with the cameras**. | `group` | Two Girls Each Holding A Folding Camera | chip @ | ✅ có trên Flow |
| C1-46 | In one, **a fairy leaps up right beside Frances's nose**. | `character` | Teen Girl In Profile With Leaping Fairy | chip @ | ✅ có trên Flow |
| C1-47 | In another, a fairy stands on a branch, **offering Elsie a little bunch of harebells**. | `character` | Young Woman Offered Flowers By Tiny Fairy | chip @ | ✅ có trên Flow |
| C1-47b | In another, a fairy stands on a branch, offering Elsie a little **bunch of harebells**. | `object` | Small Bunch Of Pale Blue Bell Flowers | chữ + ảnh neo | ✅ có trên Flow |
| C1-48 | **Just pale, misty fairy shapes among the grass**. | `place` | Pale Misty Winged Shapes In Tall Grass | chữ + ảnh neo | ✅ có trên Flow |
| C1-51 | Doyle was away on **a lecture tour in Australia** at the time. | `place` | Australia Map With Melbourne Labelled | chip @ | ✅ có trên Flow |
| C1-51b | **Doyle was away on a lecture tour** in Australia at the time. | `character` | Author Speaking At A Lectern | chip @ | ✅ có trên Flow |
| C1-52 | When he heard the news, **he sent a telegram from Melbourne** saying his heart was gladdened by 3 wonderful pictures that confirmed everything they had published. | `object` | Blank Telegram Form Paper | chữ + ảnh neo | ✅ có trên Flow |
| C1-53 | In December 1920, Doyle's article, "Fairies Photographed," **appeared in the Christmas issue of The Strand**, along with the 2 photographs from 1917. | `object` | Same Magazine Lying Open On Two Photos | chip @ | ✅ có trên Flow |
| C1-56 | **Doyle wrote that once people accepted** that fairies were real, it would jolt the heavy, materialistic mind of the 20th century out of its ruts. | `character` | Author Writing At His Desk | chip @ | ✅ có trên Flow |
| C1-57 | In 1922, he published a whole book on the subject, **called The Coming of the Fairies**. | `object` | Closed Hardback Book With Plain Cloth Cover | chữ + ảnh neo | ✅ có trên Flow |
| C1-58 | **The press was split**. | `object` | Stack Of Folded Newspapers Blank Columns | chữ + ảnh neo | ✅ có trên Flow |
| C1-61 | In the summer of 1921, Gardner came back one more time, **bringing a clairvoyant with him**. | `figure` | Clairvoyant Ref Grey Tweed Jacket | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-62 | The clairvoyant said **he could see fairies everywhere**. | `group` | Clairvoyant Pointing While Two Girls Watch | chip @ | ✅ có trên Flow |
| C1-68 | **In 1966, a reporter** tracked Elsie down. | `figure` | Elderly Woman Ref White Curls Cardigan | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-68b | In 1966, a reporter **tracked Elsie down**. | `group` | Elderly Woman Talking To Reporter With Notebook | chip @ | ✅ có trên Flow |
| C1-70 | **In 1976, on television**, both women agreed that a rational person doesn't see fairies. | `figure` | Old Lady Ref Grey Bob Green Jumper | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-70b | In 1976, on television, **both women agreed that a rational person** doesn't see fairies. | `group` | Two Elderly Women On Studio Sofa Before Camera | chip @ | ✅ có trên Flow |
| C1-72 | Meanwhile, skeptics were **enlarging the photographs with computers**, and a photography expert went back over them from the very beginning. | `figure` | Man At Old Computer Screen With Grainy Photo | chip @ | ✅ có trên Flow |
| C1-72b | Meanwhile, skeptics were enlarging the photographs with computers, and a photography expert **went back over them from the very beginning**. | `figure` | Grey Bearded Expert Over Prints With Loupe | chip @ | ✅ có trên Flow |
| C1-75 | In 1983, in **a magazine called The Unexplained**, the 2 elderly cousins finally admitted it. | `object` | Glossy Magazine With Dark Blank Cover | chữ + ảnh neo | ✅ có trên Flow |
| C1-75b | In 1983, in a magazine called The Unexplained, **the 2 elderly cousins finally admitted it**. | `group` | Two Elderly Women Talking To Interviewer | chip @ | ✅ có trên Flow |
| C1-76 | **Elsie had drawn the fairies herself**. | `character` | Older Girl Drawing A Winged Dancer | chip @ | ✅ có trên Flow |
| C1-77 | She copied the figures of dancing girls from a popular children's book of the time, **Princess Mary's Gift Book**, changed a few details, and added wings. | `object` | Open Picture Book With Three Dancing Girls | chữ + ảnh neo | ✅ có trên Flow |
| C1-78 | **The cousins cut the figures out**, stood them up in the grass with hatpins, took their pictures, and then threw the props into the stream. | `group` | Two Girls Cutting Paper Figures With Scissors | chip @ | ✅ có trên Flow |
| C1-78b | The cousins **cut the figures out**, stood them up in the grass with hatpins, took their pictures, and then threw the props into the stream. | `object` | Paper Cutout Ref Winged Dancer | chữ + ảnh neo · **tạo asset** | ✅ có trên Flow |
| C1-78c | The cousins cut the figures out, **stood them up in the grass with hatpins**, took their pictures, and then threw the props into the stream. | `object` | Paper Dancer Pinned Upright In Grass | chip @ | ✅ có trên Flow |
| C1-78d | The cousins cut the figures out, stood them up in the grass **with hatpins**, took their pictures, and then threw the props into the stream. | `object` | Long Steel Hatpin With Pearl Head | chữ + ảnh neo | ✅ có trên Flow |
| C1-78e | The cousins cut the figures out, stood them up in the grass with hatpins, took their pictures, and then **threw the props into the stream**. | `group` | Two Girls Tossing Paper Figures Into Stream | chip @ | ✅ có trên Flow |
| C1-84 | **Elsie explained their long silence** simply. | `figure` | Elderly Woman Speaking With Open Hands | chip @ | ✅ có trên Flow |
| C1-86 | Frances, **in a letter written in 1983**, said she had hated those photographs since she was 16 years old. | `figure` | Old Lady Writing A Letter At Table | chip @ | ✅ có trên Flow |
| C1-89 | **Frances insisted, for the rest of her life**, that the fifth one, the sun bath, was real. | `figure` | Old Lady Speaking Holding One Photograph | chip @ | ✅ có trên Flow |

## Các quyết định theo skill 4d (rà 10 câu hỏi)

- **1_vatTacDongCoThe** — Khong co.
- **2_trangThaiNhanVat** — Hai co gai o 3 moc: 1917 (C1-02, C1-03), 1920 (C1-41, C1-42), gia (C1-68, C1-70) — moi moc mot asset rieng (skill 5b, doi tuoi + trang phuc). 'Frances died in 1986 / Elsie died in 1988' KHONG ve canh chet: dung lai chan dung gia, nam la chu hau ky.
- **3_nguoiCoThatDuocGoiTen** — Elsie Wright, Frances Griffiths (anh that: 5 tam anh tien + anh chung), Arthur Conan Doyle (anh ~1920), Edward Gardner (anh chan dung). KHONG co chan dung: Arthur Wright, Polly Wright, Harold Snelling, va hai chi em luc gia (1966-1983) — ha xuong `figure`, ta theo trang phuc dung thoi ky, ghi HU CAU trong note (SPEC-v2 muc 4c). Nguoi khong ten: dien gia buoi giang 1919, nha ngoai cam 1921 (co that la Geoffrey Hodson, loi ke khong goi ten), phong vien 1966, nguoi hoai nghi 1978, chuyen gia anh 1982 (co that la Geoffrey Crawley, loi ke khong goi ten).
- **4_tenSaiThoiKy** — Khong co ten doi theo thoi ky. 'The Strand' va 'Kodak' la ten dung nam 1920. Cape Town, Melbourne khong doi ten.
- **5_trangThaiGoc** — Hinh co gai mua trong sach (C1-77) -> hinh tien ve lai (C1-76) -> hinh cat ra (C1-78b) -> cam bang kim trong co (C1-78c) -> vut xuong suoi (C1-78e). Tam kinh trong khay (C1-14) -> anh hien ra (C1-14b).
- **6_choNoi** — Kim cai mu xuyen qua hinh giay cam xuong dat (C1-78c) — cho noi la chu the cua anh.
- **7_nhayCoc** — Them C1-12 (hai co gai mang may xuong suoi) va C1-12b (tra may cho cha) — loi ke xac nhan ca hai. KHONG them canh hai co gai dung hinh giay de chup o 1917 truoc khi loi ke tiet lo: se lo loi giai som. Canh 'chup anh' chi co o C1-78 sau loi thu nhan.
- **8_hanhViNoi** — Nguoi lon hoi (C1-07b: nguoi noi la me, nguoi nghe la hai co gai). Hai co gai tra loi (C1-08). Cha noi 'bia giay' (C1-18), cha tu choi (C1-21). Snelling tuyen bo (C1-33). Hai co gai giai thich voi Gardner (C1-42b). Nha ngoai cam noi thay tien (C1-62: ve HANH VI NOI, khong ve tien). Elsie gia tra loi phong vien (C1-68b). Hai ba thu nhan voi nguoi phong van (C1-75b). Elsie giai thich (C1-84). Frances khang dinh (C1-89).
- **9_mucChacChan** — C1-62 khong ve tien quanh nha ngoai cam (chi la loi anh ta noi). C1-89 va cau S90 (loi ke cua Frances ve chieu thu Bay mua) KHONG ve tien hien dan trong co — dung lai anh Frances gia dang noi. C1-30: ve Gardner cam tam kinh, khong ve 'tien hien ra'. Cau 'double exposure' la GIA THUYET cua chuyen gia — dung lai anh chuyen gia C1-72b, khong ve so do chup chong.
- **10_trungChucNang_dungLai** — Xem _dungLai (41 cau dung lai anh san co). BO vi trung chuc nang: canh 'sold out' (trung tap chi C1-53, chu hau ky), co nuoc Anh (trung ban do C1-01 — 'north of England' la dia ly, khong phai quoc gia hanh dong), bang/co Nam Phi 1917 (trung ban do C1-04), hai phu nu truong thanh 'grew up, got married' (khong co tu lieu, chu hau ky), so do chup chong (gia thuyet). BO vi gioi han Dan dung: co gai nhin tien hien ra trong co (S90), hai co gai 'played along' (S64, loi ke ve sau), cao be Doyle vui mung doc dien tin.
- **11_netMat** — Net mat trung tinh mac dinh. GIU nu cuoi o C1-12b (loi ke 'looking triumphant'). Cac shot khac khong gan tam trang.

**Thử nghiệm chưa đo:** Shot mention dua NGUOI MOI vao cau co goi ten anh neo (skill 4d-9d, CHUA DO): C1-26b, C1-28, C1-29, C1-34, C1-62, C1-68b, C1-70b, C1-72, C1-72b, C1-75b. Shot ve lai anh tien (C1-14b, C1-20, C1-46, C1-47): cau styleByKind 'Only one person in the image' noi vao cuoi — prompt noi ro tien KHONG phai nguoi; soi xem model co xoa tien khong.

## Từng shot

### C1-01 · `place` · ✅ có trên Flow

**Tên card:** Country Map With One Northern City Labelled

**Lời kể (`at`):** In the summer of 1917, in Cottingley, a small village **just outside the city of Bradford** in the north of England, two cousins kept getting into trouble for the very same thing.

**Ý đồ:** Dinh vi Cottingley cho nguoi xem: Bradford o mien bac nuoc Anh (o anh 6). Cottingley qua nho de ghi — cham + chu COTTINGLEY la hau ky neu Tu muon

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng nước Anh theo đúng hình bản đồ tham chiếu (13-maps-01): nước Anh tô một màu xanh lá nhạt phẳng, có chữ "ENGLAND" in hoa; thành phố Bradford ở phía bắc có chữ "BRADFORD" in hoa. Không tiêu đề, không số, không la bàn, không mũi tên, không tên nơi nào khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ "ENGLAND" và "BRADFORD". Chữ BRADFORD phải nằm ở miền bắc-giữa nước Anh (Tây Yorkshire), không trôi xuống London. Model có tự thêm tên thành phố khác không.

**Sinh bằng:** câu @mention — chip `@13-maps-01.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a map shaped like @13-maps-01.png with the same style as @01-pyramid-place.png, fill England with one flat pale green colour and label it "ENGLAND" in plain capital letters, and write "BRADFORD" in plain capital letters at the position of the city of Bradford in the north of England, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `13-maps-01.png`, `13-maps-04.png`

**Ghi chú:** Skill 4d-bis phan 4a: ban do tham chieu = England location map (Commons). Ban do DINH VI hom nay, ranh gioi hien dai. Cham Cottingley/Bradford va mui ten la hau ky.

### C1-02 · `character` · ✅ có trên Flow

**Tên card:** Older Girl Ref Bell Hat White Dress

**Lời kể (`at`):** **Elsie Wright was 16**.

**Ý đồ:** Asset Elsie 1917 — nhan vat chinh, dung lai o 10 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một cô gái khoảng 16 tuổi: mặt trái xoan, tóc nâu sẫm thẳng xoã dài quá vai, đội mũ nỉ sẫm hình chuông vành tròn sâu có cài một bông hoa nhạt bên hông; mặc váy cotton trắng rộng tay dài, cổ tròn mềm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Asset gốc của Elsie 1917 — duyệt kỹ mũ chuông và tóc dài sẫm (thứ phân biệt với Frances). Model có vẽ cô già hơn 16 không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Older Girl Ref Bell Hat White Dress` — dùng lại ở: C1-06, C1-07b, C1-08, C1-10b, C1-12, C1-12b, C1-17, C1-17b, C1-20, C1-21, C1-76, C1-78, C1-78e

**Prompt gửi Flow:**

```text
A girl of about sixteen seen from the chest up. An oval face. Long straight dark brown hair worn loose and falling well past her shoulders, under a dark felt hat shaped like a bell with a deep rounded brim and a small pale flower pinned to one side. She wears a loose long-sleeved white cotton dress with a soft round neckline. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-02.jpg`, `02-girls-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh that 1917 (Elsie va chu lun): toc sam thang xoa, mu chuong sam co hoa, vay trang rong tay dai co ren o co tay. Ten rieng khong vao outName (duong draw go outName vao prompt).

### C1-03 · `character` · ✅ có trên Flow

**Tên card:** Young Girl Ref Flower Band Long Hair

**Lời kể (`at`):** Her cousin **Frances Griffiths was only 9**.

**Ý đồ:** Asset Frances 1917 — nguoi trong buc anh neo cua case (C1-14b)

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một bé gái khoảng 9 tuổi: mặt tròn má bầu, tóc nâu nhạt dài xoã quá vai, một vòng hoa nhỏ màu nhạt vắt ngang đỉnh đầu; mặc váy cotton trắng trơn cổ nhỏ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Phải ra TRẺ EM 9 tuổi, không ra thiếu nữ. Vòng hoa trên tóc là dấu nhận diện với ảnh gốc.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Young Girl Ref Flower Band Long Hair` — dùng lại ở: C1-06, C1-07b, C1-08, C1-12, C1-12b, C1-14b, C1-21, C1-23, C1-78, C1-78e

**Prompt gửi Flow:**

```text
A girl of about nine seen from the chest up. A round face with full cheeks. Long light brown hair worn loose and falling past her shoulders, with a thin band of small pale flowers across the top of her head. She wears a plain white cotton dress with a small collar. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-01.jpg`, `02-girls-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh that 1917 (Frances va bon nang tien): mat tron, toc nau nhat xoa, vong hoa tren toc, ao trang.

### C1-04 · `place` · ✅ có trên Flow

**Tên card:** Southern Africa Map With Cape Town Labelled

**Lời kể (`at`):** Frances and her mother had recently come **back to England from South Africa**, and they were staying with Elsie's family.

**Ý đồ:** Noi Frances tu do ve (o anh 6). Dung lai cho cau Cape Town (1918)

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng Nam Phi theo hình bản đồ tham chiếu (13-maps-02): lãnh thổ Nam Phi tô một màu cam nhạt phẳng có chữ "SOUTH AFRICA" in hoa; chữ "CAPE TOWN" in hoa ở mũi tây nam. Không tiêu đề, không số, không tên nơi khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ hai tên. CAPE TOWN phải ở mũi tây nam, sát bờ biển. Model có tự thêm tên các nước láng giềng không.

**Sinh bằng:** câu @mention — chip `@13-maps-02.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a map shaped like @13-maps-02.png with the same style as @01-pyramid-place.png, fill South Africa with one flat pale orange colour and label it "SOUTH AFRICA" in plain capital letters, and write "CAPE TOWN" in plain capital letters at the position of Cape Town on the south-western tip of the coast, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `13-maps-02.png`

**Ghi chú:** Skill 4d-bis 4a. Ranh gioi Nam Phi hien dai (nam 1917 la Lien bang Nam Phi) — ban do dinh vi cho nguoi xem hom nay.

### C1-04b · `object` · ✅ có trên Flow

**Tên card:** Passenger Steamship With Two Funnels

**Lời kể (`at`):** Frances and her mother **had recently come back** to England from South Africa, and they were staying with Elsie's family.

**Ý đồ:** Vat ngam trong 'come back ... from South Africa' (o anh 3): chuyen di bang tau bien

**🖼️ Ảnh sẽ ra:** Một tàu hơi nước chở khách thập niên 1910 nhìn ngang: thân dài sẫm màu có một hàng cửa sổ tròn, boong trên màu trắng, hai ống khói cao, đang chạy trên mặt biển phẳng. Không người, không chữ, không cờ.

**🔍 Cần soi khi ra ảnh:** Model có vẽ tên tàu hay cờ lên thân không. Đây là tàu minh hoạ loại, không khẳng định con tàu thật họ đi.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A passenger steamship of the 1910s seen from the side: a long dark hull with one row of small round portholes, a white upper deck and two tall funnels, sailing on flat calm sea. No lettering, no flags, no people, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Gioi han Dong nhat hien vat: khong khang dinh ten tau (nguon khong ghi).

### C1-04c · `place` · ✅ có trên Flow

**Tên card:** Stone End Terrace House With Tall Gable Chimney

**Lời kể (`at`):** Frances and her mother had recently come back to England from South Africa, and they were **staying with Elsie's family**.

**Ý đồ:** Nha gia dinh Wright o Cottingley — so 31 Main Street, nha dau day (anh 08-cottingley-03)

**🖼️ Ảnh sẽ ra:** Ngôi nhà đầu dãy hai tầng nhìn thẳng mặt tiền, xây đá sa thạch khối thô màu vàng xám xếp hàng đều, tường hồi bên phải sẫm hơn. Mái ngói đá phiến xám dốc thấp, hàng con sơn đá nhỏ dưới máng xối; một ống khói đá cao vươn lên ở đầu hồi, một ống khói thấp có hàng chụp gốm ở chỗ giáp nhà bên. Mặt tiền: cửa gỗ sẫm có ô kính chữ nhật phía trên nằm bên trái; bên phải là một cửa sổ khung trượt ở tầng dưới và một cửa sổ y hệt thẳng phía trên ở tầng hai, lanh tô và bậu đá dày. Mép trái lộ một lát nhà bên cùng loại đá. Vườn trước hẹp có cây bụi và dây leo, sau bức tường đá thấp. Không người, không chữ, không số nhà.

**🔍 Cần soi khi ra ảnh:** Bố cục mặt tiền có khớp nhà số 31 thật không: cửa đi bên trái, hai cửa sổ chồng thẳng hàng bên phải, ống khói cao ở đầu hồi. Không được lọt đồ hiện đại của ảnh gốc: cửa nhựa đen có số, hàng rào gỗ sơn đen, ăng-ten, dây điện, xe đạp.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A two-storey end-of-terrace house seen straight from the front, built of rough-faced honey-grey Yorkshire sandstone blocks in even courses, the side gable wall on the right darker and weathered. A low-pitched grey slate roof with a row of small square stone blocks under the gutter; a tall plain stone chimney stack rising from the gable end, and a shorter chimney stack with a row of clay chimney pots where the roof meets the next house. On the front: a plain dark wooden panelled door on the left with a small rectangular glass pane above it; to its right one sash window with two-over-two panes on the ground floor and a matching sash window directly above it on the first floor, each with a thick plain stone lintel and a stone sill. Only a narrow slice of the neighbouring house, in the same stone, shows at the left edge. A narrow front garden with a few shrubs and a climbing plant, behind a low stone wall. No people, no lettering, no house number, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `08-cottingley-03.jpg`

**Ghi chú:** Mo ta theo anh that 08-cottingley-03 (chup gan day, blog Yorkshire Ridings 2019; so 31 tren o kinh cua). Co y bo do hien dai: cua nhua den, hang rao go son den, ang-ten, day dien, xe dap. Than nha da khong doi tu 1917. Ten card doi so voi ban nhap vi ban nhap chua tung chay.

### C1-05 · `place` · ✅ có trên Flow

**Tên card:** Stream Ref Flat Stones Small Fall

**Lời kể (`at`):** At the bottom of the Wrights' garden ran a little stream, **what the locals call a beck**.

**Ý đồ:** Asset con suoi — boi canh cua ca vu, dung lai o 4 shot

**🖼️ Ảnh sẽ ra:** Một con suối nhỏ chảy qua những phiến đá xám phẳng giữa hai bờ cỏ dốc, có một thác nước nhỏ cao chừng đầu gối, dương xỉ và bụi lá thấp dọc bờ, vài cây mảnh nghiêng ra mặt nước. Không người, không cầu, không nhà, không chữ.

**🔍 Cần soi khi ra ảnh:** Suối phải NHỎ (con suối cuối vườn), không thành sông. Model có vẽ thêm người hay tiên không.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Stream Ref Flat Stones Small Fall` — dùng lại ở: C1-06, C1-43, C1-78e

**Prompt gửi Flow:**

```text
A small stream running over flat grey stones between two steep grassy banks, with one small waterfall about knee high, ferns and low leafy bushes along the banks and a few thin trees leaning over the water. No people, no bridge, no buildings, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `07-beck-01.jpg`, `07-beck-02.jpg`, `02-girls-02.jpg`, `01-fairy-photos-01.jpg`

**Ghi chú:** Theo anh con suoi Cottingley hom nay + nen anh tien 1917 (thac nho ben trai) + anh Elsie ngoi tren bo suoi 1920 (da phang, bo doc).

### C1-06 · `group` · ✅ có trên Flow

**Tên card:** Two Girls Crouching On Stream Stones

**Lời kể (`at`):** **The girls spent hours down there**, and every time they came home with soaking wet shoes and muddy clothes.

**Ý đồ:** Hai co gai choi o suoi — viec gay rac roi (dung lai cho cau mo 'two cousins' va cau 'village kids')

**🖼️ Ảnh sẽ ra:** Vẽ lại CHÍNH hai cô gái từ asset C1-02 và C1-03 (giữ nguyên mặt), nguyên người: ngồi xổm trên đá phẳng ở mép con suối C1-05, thò tay xuống nước; Elsie mũ chuông, váy trắng, tất đen, bốt đen buộc dây; Frances nhỏ hơn hẳn (đầu tới vai Elsie), vòng hoa, váy trắng, tất trắng, giày quai. Không chữ.

**🔍 Cần soi khi ra ảnh:** Mặt hai cô có giữ đúng asset không. Frances phải thấp hơn rõ. Model có tự vẽ tiên không (KHÔNG được).

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03), `@Stream Ref Flat Stones Small Fall` (asset từ C1-05). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, now seen full length from head to shoes crouching on the flat stones at the edge of the same stream as in @Stream Ref Flat Stones Small Fall and reaching down into the water, the older girl in the same bell hat and white dress with black stockings and black lace-up ankle boots, the younger girl plainly shorter with her head only reaching the older girl's shoulder, in the same flower band and white dress with white socks and black strap shoes, no fairies, no other people, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Skill 8c: ep chieu cao tre em o tung canh. Cam tuong minh tien (chua den luc).

### C1-06b · `object` · ✅ có trên Flow

**Tên card:** Pair Of Soaked Lace Up Girls Boots

**Lời kể (`at`):** The girls spent hours down there, and every time they came home with **soaking wet shoes** and muddy clothes.

**Ý đồ:** Vat duoc goi ten (o anh 4): giay uot sung

**🖼️ Ảnh sẽ ra:** Một đôi bốt da đen cổ thấp buộc dây của bé gái thập niên 1910, ướt sũng, nước nhỏ giọt và vũng nước nhỏ quanh đế, bùn nâu bắn lên mũi giày. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Giày cỡ trẻ em, kiểu 1910s (buộc dây cao cổ), không ra giày hiện đại.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A pair of small black leather lace-up ankle boots from the 1910s, soaking wet, with water dripping from them into a small puddle and brown mud splashed across the toes. No people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-06c · `object` · ✅ có trên Flow

**Tên card:** White Cotton Dress With Muddy Hem

**Lời kể (`at`):** The girls spent hours down there, and every time they came home with soaking wet shoes and **muddy clothes**.

**Ý đồ:** Vat duoc goi ten (o anh 4): quan ao lam bun

**🖼️ Ảnh sẽ ra:** Một chiếc váy cotton trắng của bé gái treo trên móc, gấu váy ướt và lấm vệt bùn nâu. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Không vẽ người mặc váy.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A girl's plain white cotton dress hanging from a single wooden peg, its hem wet and streaked with brown mud. No people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

### C1-07 · `figure` · ✅ có trên Flow

**Tên card:** Mother Ref Pinned Bun Brown Coat

**Lời kể (`at`):** **When the grown-ups asked** what they could possibly be doing down there to get so wet, the girls had an answer ready.

**Ý đồ:** Asset ba Polly Wright (me Elsie) — xuat hien 5 shot. KHONG co chan dung that

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một phụ nữ đầu bốn mươi: tóc nâu sẫm búi gọn sau gáy, vài lọn gợn ở thái dương; áo blouse cổ cao màu kem dưới áo khoác len dài nâu sẫm cài cúc. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Nhân vật HƯ CẤU CÓ CƠ SỞ (trang phục thời kỳ) — không ghi trong video là chân dung bà Polly.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Mother Ref Pinned Bun Brown Coat` — dùng lại ở: C1-07b, C1-08, C1-22, C1-28, C1-44

**Prompt gửi Flow:**

```text
A woman in her early forties seen from the chest up. Dark brown hair pinned up in a neat bun at the back of her head, with a few soft waves at the temples. She wears a high-necked cream blouse under a long dark brown wool coat buttoned at the front. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** SHOT TAO ASSET. Khong tim duoc anh Polly Wright (stillMissing). Ta theo trang phuc phu nu Anh 1917-1920.

### C1-07b · `group` · ✅ có trên Flow

**Tên card:** Mother Asking Two Wet Girls

**Lời kể (`at`):** When the grown-ups asked **what they could possibly be doing down there** to get so wet, the girls had an answer ready.

**Ý đồ:** Hanh vi noi: nguoi lon HOI (nguoi noi = me, nguoi nghe = hai con) — luat 8

**🖼️ Ảnh sẽ ra:** Vẽ lại mẹ (C1-07) và hai cô gái (C1-02, C1-03), giữ nguyên mặt, nguyên người: người mẹ hơi cúi về phía hai cô, một tay chỉ xuống đôi giày ướt của hai cô, miệng mở như đang hỏi; hai cô đứng cạnh nhau nhìn bà, giày ướt. Nét mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Ba mặt có giữ đúng asset không. Không được thêm vẻ giận dữ (nguồn không nói).

**Sinh bằng:** câu @mention — chip `@Mother Ref Pinned Bun Brown Coat` (asset từ C1-07), `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same woman as in @Mother Ref Pinned Bun Brown Coat, keep her face exactly the same, now seen full length from head to shoes in the same brown coat over a long dark skirt with black boots, leaning slightly toward two girls and pointing down at their wet shoes as she asks them a question, and the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, standing side by side facing her in the same white dresses with wet boots, the younger girl plainly shorter with her head only reaching the older girl's shoulder, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Net mat trung tinh (skill 4d-bis 'Net mat'): loi ke khong noi me gian.

### C1-08 · `group` · ✅ có trên Flow

**Tên card:** Two Girls Answering Their Mother

**Lời kể (`at`):** **They were going to see the fairies**.

**Ý đồ:** Hanh vi noi: hai co gai TRA LOI (nguoi noi = hai con, nguoi nghe = me)

**🖼️ Ảnh sẽ ra:** Cùng ba người như C1-07b, giữ nguyên mặt: giờ hai cô gái đang nói, cô lớn chỉ tay về phía sau lưng (hướng con suối), mẹ đứng nghe. Không tiên, không chữ.

**🔍 Cần soi khi ra ảnh:** Không được vẽ tiên (lời hai cô chưa phải sự thật).

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03), `@Mother Ref Pinned Bun Brown Coat` (asset từ C1-07). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, seen full length from head to shoes in the same white dresses and boots, talking with their mouths open while the older girl points back over her shoulder, the younger girl plainly shorter with her head only reaching the older girl's shoulder, and the same woman as in @Mother Ref Pinned Bun Brown Coat, keep her face exactly the same, standing facing them in the same brown coat, long dark skirt and black boots, listening, no fairies, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Luat 8. Gioi han muc chac chan: KHONG ve tien — chi la loi cua hai co.

### C1-10 · `object` · ✅ có trên Flow

**Tên card:** Box Camera Ref Black Leather

**Lời kể (`at`):** So one day in July 1917, Elsie **borrowed her father's camera**.

**Ý đồ:** Asset may anh Midg (quarter-plate, W. Butcher & Sons) — dung lai 4 shot

**🖼️ Ảnh sẽ ra:** Một máy ảnh hộp thập niên 1910 hình hộp chữ nhật đứng, bọc da đen sần, quai da ngắn trên nóc, hai ô ngắm tròn nhỏ cạnh nhau ở phía trên mặt trước, một ống kính tròn viền kim loại mảnh ở giữa, cần chụp nhỏ bên dưới. Không chữ, không nhãn, không người.

**🔍 Cần soi khi ra ảnh:** Phải là máy HỘP (không ống xếp). Không vẽ lại tờ nhãn giấy dán bên hông như trong ảnh bảo tàng.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Box Camera Ref Black Leather` — dùng lại ở: C1-10b, C1-12, C1-12b, C1-21

**Prompt gửi Flow:**

```text
An old box camera from the 1910s shaped like an upright rectangular box, covered in black pebbled leather, with a short leather carrying strap on top, two small round viewfinder windows side by side near the top of the front, and one round lens with a thin metal ring in the middle of the front, a small shutter lever below it. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `09-cameras-02.png`, `09-cameras-03.jpg`

**Ghi chú:** Soi anh THAT chiec Midg cua ong Arthur Wright (Science Museum Group, qua blog NSMM va Museum Crush): hop dung da den san, quai da tren noc, hai o ngam tron phia tren, ong kinh tron giua, can chup ben duoi. Nhan giay dan ben hong la cua bao tang ve sau — khong ve.

### C1-10b · `character` · ✅ có trên Flow

**Tên card:** Older Girl Holding Box Camera

**Lời kể (`at`):** So one day in July 1917, **Elsie borrowed** her father's camera.

**Ý đồ:** Elsie cam may anh cua cha

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie từ asset C1-02 (giữ nguyên mặt), nửa người, hai tay ôm chiếc máy ảnh hộp C1-10 trước ngực. Nét mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Máy có giữ đúng hình asset không.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Box Camera Ref Black Leather` (asset từ C1-10). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Older Girl Ref Bell Hat White Dress, keep her face exactly the same, seen from the chest up holding the same camera as in @Box Camera Ref Black Leather in both hands in front of her chest, in the same bell hat and white dress, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-11 · `figure` · ✅ có trên Flow

**Tên card:** Father Ref Moustache Waistcoat

**Lời kể (`at`):** **Arthur Wright was a keen amateur photographer**, with his own darkroom right there in the house.

**Ý đồ:** Asset ong Arthur Wright — 5 shot. KHONG co chan dung that

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông ngoài bốn mươi: tóc sẫm ngắn rẽ ngôi lệch, ria mép sẫm rậm, không râu cằm; áo sơ mi trắng không cổ xắn tay dưới gi-lê sẫm cài cúc. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** HƯ CẤU CÓ CƠ SỞ — không ghi trong video là chân dung ông Arthur.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Father Ref Moustache Waistcoat` — dùng lại ở: C1-12b, C1-13, C1-18, C1-21

**Prompt gửi Flow:**

```text
A man in his forties seen from the chest up. Short dark hair parted on one side, a full dark moustache and no beard. He wears a white collarless shirt with the sleeves rolled up, under a dark buttoned waistcoat. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** SHOT TAO ASSET. Khong tim duoc anh Arthur Wright (stillMissing). Trang phuc dan ong Anh 1917. Toc/rau khac Doyle, Gardner, Snelling (skill 5a).

### C1-11b · `place` · ✅ có trên Flow

**Tên card:** Darkroom Ref Red Lamp Two Trays

**Lời kể (`at`):** Arthur Wright was a keen amateur photographer, with **his own darkroom right there in the house**.

**Ý đồ:** Asset buong toi — noi lat lo lan dau, cap dau cuoi voi cau 'guessed right on that very first night'

**🖼️ Ảnh sẽ ra:** Một buồng tối gia đình thập niên 1910: bàn gỗ trơn dọc tường, hai khay tráng ảnh chữ nhật nông, một bình nước và vài chai thuỷ tinh; trên kệ phía trên là một chiếc đèn lồng nhỏ mặt kính đỏ sẫm đang sáng. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Đèn đỏ phải là đèn lồng nhỏ kiểu cũ, không ra bóng đèn hiện đại. Chai lọ KHÔNG có nhãn chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Darkroom Ref Red Lamp Two Trays` — dùng lại ở: C1-13

**Prompt gửi Flow:**

```text
A small home darkroom of the 1910s: a plain wooden bench along a wall with two shallow rectangular developing trays on it, one jug and a few glass bottles with no labels, and above them on a shelf one small lantern with a deep red glass front glowing. No people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `10-glass-plate-01.jpg`

### C1-12 · `group` · ✅ có trên Flow

**Tên card:** Two Girls Carrying Camera Toward Stream

**Lời kể (`at`):** The girls **took the camera down to the stream**, and about half an hour later they came back looking triumphant.

**Ý đồ:** Hanh dong noi: mang may xuong suoi (luat 7, loi ke xac nhan)

**🖼️ Ảnh sẽ ra:** Hai cô gái (asset C1-02, C1-03) nguyên người đang đi, nhìn nghiêng về phía bên phải; Elsie ôm máy ảnh hộp C1-10, Frances đi cạnh nhỏ hơn. Không suối trong khung, không tiên, không chữ.

**🔍 Cần soi khi ra ảnh:** Không vẽ giấy, kéo hay hình tiên trong tay (chưa tới lúc lộ).

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03), `@Box Camera Ref Black Leather` (asset từ C1-10). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, seen full length from head to shoes walking side by side toward the right, the older girl carrying the same camera as in @Box Camera Ref Black Leather in both hands, both in the same white dresses and boots, the younger girl plainly shorter with her head only reaching the older girl's shoulder, nothing else in their hands, no fairies, no paper, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Cam tuong minh giay/tien — hinh giay chi xuat hien sau loi thu nhan (C1-78).

### C1-12b · `group` · ✅ có trên Flow

**Tên card:** Girls Handing Camera Back To Father

**Lời kể (`at`):** The girls took the camera down to the stream, and about half an hour later they **came back looking triumphant**.

**Ý đồ:** Tra may cho cha, 'looking triumphant' — CO NGUON cho nu cuoi

**🖼️ Ảnh sẽ ra:** Hai cô gái (C1-02, C1-03) mỉm cười rạng rỡ, Elsie đưa máy ảnh hộp cho người cha (C1-11) đứng đối diện, nguyên người, gi-lê, quần sẫm, bốt đen; cha đưa tay nhận, mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Nụ cười chỉ ở hai cô (lời kể 'triumphant'), cha trung tính. Bốn thứ đúng asset.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03), `@Box Camera Ref Black Leather` (asset từ C1-10), `@Father Ref Moustache Waistcoat` (asset từ C1-11). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, seen full length from head to shoes with big proud smiles, the older girl holding out the same camera as in @Box Camera Ref Black Leather toward the same man as in @Father Ref Moustache Waistcoat, keep his face exactly the same, who stands facing them full length in the same waistcoat and rolled shirt sleeves with dark trousers and black boots, reaching out to take it, the younger girl plainly shorter with her head only reaching the older girl's shoulder, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-13 · `figure` · ✅ có trên Flow

**Tên card:** Father Rocking Tray In Red Lit Darkroom

**Lời kể (`at`):** That evening, **Arthur developed the glass plate himself**.

**Ý đồ:** Cha trang tam kinh trong buong toi — dung lai cho 'didn't believe' va 'guessed right' (cap dau cuoi)

**🖼️ Ảnh sẽ ra:** Vẽ lại người cha (C1-11, giữ nguyên mặt) nửa người, đứng trước bàn trong buồng tối C1-11b, hai tay nghiêng một khay tráng ảnh, mắt nhìn xuống khay; đèn đỏ trên kệ. Nét mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Buồng tối có giữ bố cục asset không. Không vẽ hình tiên nổi lên khỏi khay.

**Sinh bằng:** câu @mention — chip `@Father Ref Moustache Waistcoat` (asset từ C1-11), `@Darkroom Ref Red Lamp Two Trays` (asset từ C1-11b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Father Ref Moustache Waistcoat, keep his face exactly the same, seen from the chest up standing at the bench of the same darkroom as in @Darkroom Ref Red Lamp Two Trays, gently tilting one developing tray with both hands and looking down into it, the red lantern glowing on the shelf, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-14 · `object` · ✅ có trên Flow

**Tên card:** Glass Plate With Faint Image In Tray

**Lời kể (`at`):** **As the image slowly appeared** in the darkroom, he saw Frances sitting behind a bush, her chin resting on her hand, looking straight into the camera.

**Ý đồ:** Tam kinh trong khay, hinh mo hien dan — dung lai cho 'plates never tampered with'

**🖼️ Ảnh sẽ ra:** Một khay tráng ảnh nông nhìn từ trên xuống, trong khay ngập nước là một tấm kính ảnh vuông nhỏ, trên đó hiện mờ mờ hình một bé gái tì cằm lên tay và bốn hình nhỏ có cánh trước mặt cô. Ánh đỏ nhạt. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hình trên kính phải MỜ, chưa rõ nét. Không ra màn hình hiện đại.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A shallow rectangular developing tray seen from above, filled with liquid, holding one small square glass photographic plate on which a faint pale image is slowly appearing: a young girl resting her chin on her hand and four tiny winged figures in front of her face. A soft red glow over everything. No lettering, no people outside the image. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `10-glass-plate-01.jpg`, `01-fairy-photos-01.jpg`

### C1-14b · `character` · ✅ có trên Flow

**Tên card:** Girl With Chin On Hand And Four Tiny Fairies

**Lời kể (`at`):** As the image slowly appeared in the darkroom, he saw Frances sitting behind a bush, **her chin resting on her hand**, looking straight into the camera.

**Ý đồ:** HINH ANH NEO cua case: ve lai tam anh tien dau tien. Ung vien thumbnail (qua cong 4). Cap dau cuoi voi C1-78c (hinh giay cam kim)

**🖼️ Ảnh sẽ ra:** Vẽ lại Frances (C1-03, giữ nguyên mặt) nửa người ngồi sau một bụi lá thấp, tì cằm lên bàn tay, nhìn thẳng ra người xem; ngay trước mặt cô là bốn nàng tiên tí hon có cánh mặc váy dài nhạt màu bay phấp phới, cao chừng bàn tay cô, một nàng thổi ống sáo mảnh. Thác nước nhỏ mờ phía sau bên trái. Không chữ.

**🔍 Cần soi khi ra ảnh:** Model có XOÁ tiên vì câu 'Only one person in the image' không — prompt đã nói tiên không phải người. Đúng BỐN tiên. Frances nhìn thẳng ra ngoài, không nhìn tiên (đúng ảnh gốc).

**Sinh bằng:** câu @mention — chip `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Young Girl Ref Flower Band Long Hair, keep her face exactly the same, seen from the chest up sitting behind a low leafy bush with her chin resting on her hand and looking straight at the viewer, while right in front of her face exactly four tiny winged fairies in long pale flowing dresses dance in a row, each fairy only as tall as her hand, one of them playing a thin pipe, and a small waterfall faint behind her on the left, she is the only person in the picture and the four fairies are small fairy figures that must all be drawn, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-01.jpg`

**Ghi chú:** Ve lai theo anh that 1917 (Alice and the Fairies). Tien ve NHU TRONG ANH (trong nhu tien) — dung la dieu ong Arthur thay dem do; loi giai den o C1-78. Anh that co the chen canh ban ve luc dung.

### C1-17 · `character` · ✅ có trên Flow

**Tên card:** Older Girl Painting With Paint Box

**Lời kể (`at`):** He knew **his daughter was a gifted artist**, and Elsie had spent some time working in a photographer's studio.

**Ý đồ:** CHI TIET DAT TRUOC: Elsie ve gioi — ke bang hanh dong, KHONG cho thay ve tien (se lo loi giai)

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie (C1-02, giữ nguyên mặt) nửa người, không đội mũ, ngồi bên bàn, tay cầm cọ, trước mặt là hộp màu nước và tờ giấy quay mặt vẽ ra xa người xem (không thấy hình vẽ). Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Tờ giấy phải QUAY LƯNG lại người xem — không được lộ hình tiên. Bỏ mũ có làm mất nhận diện không (tóc dài sẫm giữ nguyên).

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Older Girl Ref Bell Hat White Dress, keep her face and her long dark hair exactly the same but without the hat, seen from the chest up sitting at a table painting with a small brush, a tin box of watercolour paints in front of her and a sheet of paper propped up facing away from the viewer so that nothing painted on it can be seen, in the same white dress, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Skill story-structure muc 3: luc dat chi tiet, ke hanh dong, khong bao hieu. Bao tang NSMM giu tranh mau nuoc ve tien cua Elsie — KHONG dua vao day.

### C1-17b · `character` · ✅ có trên Flow

**Tên card:** Older Girl Beside Big Studio Camera

**Lời kể (`at`):** He knew his daughter was a gifted artist, and Elsie had spent some time **working in a photographer's studio**.

**Ý đồ:** Chi tiet dat truoc thu hai: Elsie tung lam o tiem anh

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie (C1-02, giữ nguyên mặt) nguyên người đứng cạnh một máy ảnh studio lớn bằng gỗ trên chân ba chân, phía sau là một tấm phông vẽ cảnh vườn và một chiếc ghế gỗ. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Máy studio kiểu 1910s (hộp gỗ, ống xếp, chân ba chân), không ra máy hiện đại.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Older Girl Ref Bell Hat White Dress, keep her face exactly the same, seen full length from head to shoes in the same bell hat and white dress with black stockings and black lace-up ankle boots, standing beside a large wooden studio camera of the 1910s with a black bellows on a tall wooden tripod, with a painted garden backdrop and one plain wooden chair behind her, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Nguon ghi 'spent some time working in a photographer's studio' — khong ghi cong viec cu the nen khong ve ve lai/ sua anh.

### C1-18 · `figure` · ✅ có trên Flow

**Tên card:** Father Holding Print And Speaking

**Lời kể (`at`):** He said the figures were **nothing but cardboard cutouts** and called the whole thing a prank.

**Ý đồ:** Hanh vi noi cua cha: 'bia giay', 'tro dua' — ve nguoi noi

**🖼️ Ảnh sẽ ra:** Vẽ lại người cha (C1-11, giữ nguyên mặt) nửa người, một tay giơ một tấm ảnh nhỏ quay mặt sau về phía người xem, miệng mở đang nói. Nét mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Tấm ảnh quay mặt sau — không cần vẽ lại hình tiên. Không thêm vẻ giận.

**Sinh bằng:** câu @mention — chip `@Father Ref Moustache Waistcoat` (asset từ C1-11). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Father Ref Moustache Waistcoat, keep his face exactly the same, seen from the chest up holding up one small photographic print with its plain back turned toward the viewer, talking with his mouth open, in the same waistcoat and rolled shirt sleeves, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Luat 8: nguoi nghe khong ro (nguon khong ghi noi voi ai) — chi ve nguoi noi.

### C1-20 · `character` · ✅ có trên Flow

**Tên card:** Older Girl On Lawn Reaching To Small Gnome

**Lời kể (`at`):** This one showed Elsie sitting on the lawn, **holding out her hand toward a gnome** about one foot tall.

**Ý đồ:** Ve lai tam anh thu hai (1917): Elsie va chu lun

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie (C1-02, giữ nguyên mặt) nguyên người ngồi nghiêng trên bãi cỏ, váy trắng xoè, đưa một tay về phía một chú lùn tí hon cao chừng đầu gối cô: mũ nhọn, cánh như cánh bướm, chân khẳng khiu. Không chữ.

**🔍 Cần soi khi ra ảnh:** Chú lùn phải NHỎ (khoảng 30 cm so với cô ngồi). Model có xoá chú lùn vì câu 'Only one person' không.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Older Girl Ref Bell Hat White Dress, keep her face exactly the same, seen full length sitting sideways on a grass lawn in the same bell hat and white dress, holding out one hand toward a tiny gnome standing on the grass beside her, the gnome no taller than her knee, with a pointed cap, two butterfly-like wings and thin legs, she is the only person in the picture and the gnome is a small fairy creature that must be drawn, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-02.jpg`

**Ghi chú:** Theo anh that 'Iris and the Gnome' (1917): Elsie ngoi nghieng, vay trang rong, tay dua ve chu lun canh buom, mu nhon.

### C1-21 · `group` · ✅ có trên Flow

**Tên card:** Father Keeping Camera From Two Girls

**Lời kể (`at`):** After that, Arthur **refused to lend them the camera** at all.

**Ý đồ:** Cha tu choi (hanh vi noi) — nguoi noi la cha, nguoi nghe la hai con

**🖼️ Ảnh sẽ ra:** Người cha (C1-11) nguyên người giữ chiếc máy ảnh hộp (C1-10) sát người, lắc đầu, miệng mở như đang nói; hai cô gái (C1-02, C1-03) đứng đối diện. Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Bốn asset đúng hình. Không thêm vẻ giận/buồn.

**Sinh bằng:** câu @mention — chip `@Father Ref Moustache Waistcoat` (asset từ C1-11), `@Box Camera Ref Black Leather` (asset từ C1-10), `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Father Ref Moustache Waistcoat, keep his face exactly the same, seen full length in the same waistcoat, rolled shirt sleeves, dark trousers and black boots, holding the same camera as in @Box Camera Ref Black Leather close against his chest and shaking his head as he speaks, and the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, standing facing him full length in the same white dresses and boots, the younger girl plainly shorter with her head only reaching the older girl's shoulder, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-22 · `figure` · ✅ có trên Flow

**Tên card:** Mother Looking At Two Small Prints

**Lời kể (`at`):** His wife Polly, though, **believed the photographs were real**.

**Ý đồ:** Ba Polly tin anh la that — ve hanh dong nhin anh, khong ve cam xuc

**🖼️ Ảnh sẽ ra:** Vẽ lại người mẹ (C1-07, giữ nguyên mặt) nửa người, hai tay cầm hai tấm ảnh nhỏ nâu đỏ, mắt nhìn xuống ảnh. Nét mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Hai tấm ảnh nhỏ, hình trên ảnh có thể mờ; không cần rõ.

**Sinh bằng:** câu @mention — chip `@Mother Ref Pinned Bun Brown Coat` (asset từ C1-07). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same woman as in @Mother Ref Pinned Bun Brown Coat, keep her face exactly the same, seen from the chest up holding two small sepia photographic prints in her hands and looking down at them, in the same blouse and brown coat, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-23 · `character` · ✅ có trên Flow

**Tên card:** Young Girl Writing A Letter At Table

**Lời kể (`at`):** Near the end of 1918, **Frances wrote to an old friend** back in Cape Town.

**Ý đồ:** Frances viet thu (hanh vi viet) — noi dung thu la chu hau ky

**🖼️ Ảnh sẽ ra:** Vẽ lại Frances (C1-03, giữ nguyên mặt) nửa người ngồi bên bàn, cầm bút viết lên một tờ giấy thư; trên tờ giấy chỉ có vài dòng kẻ xám mảnh, không chữ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** KHÔNG có chữ trên thư. Frances năm 1918 khoảng 11 tuổi — asset 9 tuổi chấp nhận được.

**Sinh bằng:** câu @mention — chip `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Young Girl Ref Flower Band Long Hair, keep her face exactly the same, seen from the chest up sitting at a table writing a letter with a pen, the sheet of paper showing only a few thin grey lines standing for writing and no letters, in the same white dress, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Skill 6i: thu tu de trong. Loi trong thu ('too hot for them there') la chu hau ky.

### C1-26 · `figure` · ✅ có trên Flow

**Tên card:** Lecturer Ref Bald White Fringe

**Lời kể (`at`):** In 1919, Polly went to **a lecture given by the Theosophical Society** in Bradford, a group of people deeply interested in the spirit world.

**Ý đồ:** Asset dien gia buoi giang 1919 (khong ten) — 2 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông khoảng sáu mươi: đầu hói bóng, chỉ còn một vòng tóc bạc trắng quanh hai bên và sau gáy, mặt cạo nhẵn; áo khoác dài đen kiểu frock coat, cổ cồn trắng gập, cà vạt đen. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Người minh hoạ, không phải chân dung ai cụ thể. Đầu hói + mặt nhẵn để khác hẳn cha (ria), Gardner (râu tỉa), Snelling (kính tròn), Doyle (ria lớn).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Lecturer Ref Bald White Fringe` — dùng lại ở: C1-26b, C1-28

**Prompt gửi Flow:**

```text
A man of about sixty seen from the chest up. A shiny bald head with only a fringe of white hair around the sides and back, clean-shaven. He wears a long black frock coat, a white wing collar and a black tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Dien gia buoi giang o Bradford khong duoc nguon neu ten -> figure minh hoa.

### C1-26b · `group` · ✅ có trên Flow

**Tên card:** Lecturer At Lectern Before Small Audience

**Lời kể (`at`):** In 1919, Polly went to a lecture given by the Theosophical Society in Bradford, a group of people **deeply interested in the spirit world**.

**Ý đồ:** Buoi giang cua hoi (o anh 5 noi chon + o anh 1 nguoi)

**🖼️ Ảnh sẽ ra:** Diễn giả (C1-26, giữ nguyên mặt) nguyên người đứng sau một bục giảng gỗ, một tay giơ lên đang nói; phía trước là đúng năm người nghe ngồi trên ghế gỗ nhìn về phía ông (nam mặc vest, nữ đội mũ, trang phục 1919). Không chữ.

**🔍 Cần soi khi ra ảnh:** Năm người nghe có ra na ná nhau không. Không vẽ biểu ngữ, chữ trên bục.

**Sinh bằng:** câu @mention — chip `@Lecturer Ref Bald White Fringe` (asset từ C1-26), `@03-five-men-group.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Lecturer Ref Bald White Fringe, keep his face exactly the same, seen full length in the same frock coat with dark trousers and black shoes, standing behind a plain wooden lectern with one hand raised as he speaks, and in front of him exactly five listeners of 1919 seated on plain wooden chairs facing him, three women in long coats and wide hats and two men in dark suits, in the same drawing style as @03-five-men-group.png, no banners, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Nguoi moi la nhom -> goi anh neo 03 (skill 4d-9d, chua do).

### C1-28 · `group` · ✅ có trên Flow

**Tên card:** Mother Showing Prints To Lecturer

**Lời kể (`at`):** When the talk was over, **Polly showed the speaker the 2 photographs**.

**Ý đồ:** Ba Polly dua anh cho dien gia

**🖼️ Ảnh sẽ ra:** Người mẹ (C1-07) nguyên người, áo khoác nâu, đội thêm mũ vành, đưa hai tấm ảnh nhỏ cho diễn giả (C1-26) đứng đối diện đang cúi nhìn. Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hai mặt đúng asset. Thêm mũ có làm đổi mặt bà không.

**Sinh bằng:** câu @mention — chip `@Mother Ref Pinned Bun Brown Coat` (asset từ C1-07), `@Lecturer Ref Bald White Fringe` (asset từ C1-26). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same woman as in @Mother Ref Pinned Bun Brown Coat, keep her face exactly the same, seen full length in the same brown coat over a long dark skirt with black boots and a plain dark wide-brimmed hat, holding out two small sepia photographic prints toward the same man as in @Lecturer Ref Bald White Fringe, keep his face exactly the same, who stands facing her full length in the same frock coat and bends slightly to look at them, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-29 · `group` · ✅ có trên Flow

**Tên card:** Hands Passing Small Prints Along A Row

**Lời kể (`at`):** **They were passed around the society** until they reached Edward Gardner, one of its leading members.

**Ý đồ:** Anh duoc chuyen tay trong hoi

**🖼️ Ảnh sẽ ra:** Ba người trang phục 1919 (hai nam vest sẫm, một nữ áo khoác và mũ) ngồi thành một hàng trên ghế gỗ, người giữa đang chuyền một tấm ảnh nhỏ sang tay người bên phải. Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Ba người không trùng mặt asset nào của case.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `03-five-men-group.png`

**Prompt gửi Flow:**

```text
Three people of 1919 sitting in a row on plain wooden chairs, two men in dark suits and one woman in a long coat and a wide hat, the one in the middle passing one small sepia photograph into the hand of the person on the right, the others watching, seen full length from head to shoes. No lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-29b · `character` · ✅ có trên Flow

**Tên card:** Society Member Ref Dark Suit

**Lời kể (`at`):** They were passed around the society until they reached **Edward Gardner, one of its leading members**.

**Ý đồ:** Asset Edward Gardner — 6 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông khoảng năm mươi: mặt gầy, sống mũi thẳng; tóc ngắn hoa râm chải hất ngược lên khỏi trán; râu cằm và ria tỉa ngắn gọn, lốm đốm bạc; áo vest sẫm, sơ mi trắng, nơ bướm sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Duyệt kỹ — 5 shot sau vẽ lại Gardner từ ảnh này. Nơ bướm + râu tỉa ngắn là dấu nhận diện.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Society Member Ref Dark Suit` — dùng lại ở: C1-30, C1-31b, C1-39, C1-42b

**Prompt gửi Flow:**

```text
A lean man of about fifty seen from the chest up. A narrow face with a straight nose. Short greying hair brushed up and back from his forehead, and a short neatly trimmed beard and moustache streaked with grey. He wears a dark suit jacket, a white shirt and a dark bow tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `04-gardner-01.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh chan dung that (04-gardner-01, anh nghieng): toc ngan hoa ram hat nguoc, rau cam tia ngan, no buom, ao vest.

### C1-30 · `character` · ✅ có trên Flow

**Tên card:** Society Member Holding Glass Plate To Light

**Lời kể (`at`):** Gardner became convinced that for the very first time in history, fairies had appeared clearly enough to be **captured on a photographic plate**.

**Ý đồ:** Gardner cam tam kinh anh len soi — ve hanh dong, khong ve 'niem tin'

**🖼️ Ảnh sẽ ra:** Vẽ lại Gardner (C1-29b, giữ nguyên mặt) nửa người, giơ một tấm kính ảnh vuông nhỏ lên ngang mắt, nhìn qua nó. Nét mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không vẽ tiên bay ra khỏi tấm kính.

**Sinh bằng:** câu @mention — chip `@Society Member Ref Dark Suit` (asset từ C1-29b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Society Member Ref Dark Suit, keep his face exactly the same, seen from the chest up holding one small square glass photographic plate up at eye level and looking at it, in the same suit, no fairies, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Gioi han muc chac chan: 'became convinced' la niem tin cua Gardner — khong ve tien that.

### C1-31 · `figure` · ✅ có trên Flow

**Tên card:** Photo Expert Ref Round Spectacles

**Lời kể (`at`):** Gardner took the original plates to **a photography expert named Harold Snelling**.

**Ý đồ:** Asset Harold Snelling — 4 shot. KHONG co chan dung that

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông ngoài năm mươi: tóc xám chải phẳng rẽ ngôi giữa, mặt cạo nhẵn, kính gọng kim loại tròn; bộ vest ba mảnh sẫm, cổ cồn trắng cao, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** HƯ CẤU CÓ CƠ SỞ — không ghi trong video là chân dung Snelling.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Photo Expert Ref Round Spectacles` — dùng lại ở: C1-31b, C1-32, C1-33

**Prompt gửi Flow:**

```text
A man in his fifties seen from the chest up. Grey hair combed flat and parted in the middle, clean-shaven, small round wire-rimmed spectacles. He wears a dark three-piece suit, a high white collar and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** SHOT TAO ASSET. Khong tim duoc anh Harold Snelling (stillMissing).

### C1-31b · `group` · ✅ có trên Flow

**Tên card:** Society Member Handing Plates To Expert

**Lời kể (`at`):** **Gardner took the original plates** to a photography expert named Harold Snelling.

**Ý đồ:** Gardner giao tam kinh cho Snelling

**🖼️ Ảnh sẽ ra:** Gardner (C1-29b) và Snelling (C1-31) nguyên người đứng đối diện; Gardner trao hai tấm kính ảnh vuông nhỏ, Snelling đưa tay nhận. Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hai mặt đúng asset, không trộn đặc điểm (kính tròn chỉ ở Snelling).

**Sinh bằng:** câu @mention — chip `@Society Member Ref Dark Suit` (asset từ C1-29b), `@Photo Expert Ref Round Spectacles` (asset từ C1-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Society Member Ref Dark Suit, keep his face exactly the same, seen full length in the same suit with dark trousers and black shoes, handing two small square glass photographic plates to the same man as in @Photo Expert Ref Round Spectacles, keep his face and round spectacles exactly the same, who stands facing him full length in the same three-piece suit and reaches out to take them, do not mix their features, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-32 · `figure` · ✅ có trên Flow

**Tên card:** Expert Studying Plate Through Loupe

**Lời kể (`at`):** **After studying them closely**, Snelling declared that both negatives were genuine, with no sign of studio trickery using paper or card.

**Ý đồ:** Snelling soi tam kinh — dung lai cho 'Snelling hadn't been wrong' (cap dau cuoi)

**🖼️ Ảnh sẽ ra:** Vẽ lại Snelling (C1-31, giữ nguyên mặt) nửa người, cúi xem một tấm kính ảnh đặt trên hộp đèn sáng, một mắt áp vào kính lúp nhỏ. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Kính lúp nhỏ kiểu thợ ảnh, không ra kính hiển vi.

**Sinh bằng:** câu @mention — chip `@Photo Expert Ref Round Spectacles` (asset từ C1-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Photo Expert Ref Round Spectacles, keep his face exactly the same, seen from the chest up bending over one small glass photographic plate laid on a glowing light box, looking at it through a small magnifying loupe held to one eye, in the same suit, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-33 · `figure` · ✅ có trên Flow

**Tên card:** Expert Holding Plate And Speaking

**Lời kể (`at`):** **These were straightforward photographs**, he said, of whatever had been in front of the camera at the time.

**Ý đồ:** Hanh vi noi cua Snelling — CHI TIET DAT TRUOC ('whatever had been in front of the camera'), tra o C1-80

**🖼️ Ảnh sẽ ra:** Vẽ lại Snelling (C1-31) nửa người, một tay cầm tấm kính ảnh, tay kia giơ lên, miệng mở đang nói. Mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không thêm vẻ quả quyết/đắc thắng (trung tính).

**Sinh bằng:** câu @mention — chip `@Photo Expert Ref Round Spectacles` (asset từ C1-31). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Photo Expert Ref Round Spectacles, keep his face exactly the same, seen from the chest up holding one small glass photographic plate in one hand and raising the other hand as he talks with his mouth open, in the same suit, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-34 · `figure` · ✅ có trên Flow

**Tên card:** Technician In White Coat Examining Print

**Lời kể (`at`):** **The Kodak company examined them too**.

**Ý đồ:** Nguoi cua hang anh xem xet anh (figure minh hoa). Logo Kodak that la hau ky

**🖼️ Ảnh sẽ ra:** Một kỹ thuật viên nam khoảng ba mươi, tóc nâu ngắn, áo blouse trắng dài, cầm một tấm ảnh nhỏ dưới một chiếc đèn bàn kiểu 1920 để soi. Chỉ một người. Không chữ, không logo.

**🔍 Cần soi khi ra ảnh:** KHÔNG có logo hay chữ Kodak trong ảnh (logo thật là hậu kỳ).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Prompt gửi Flow:**

```text
A laboratory technician of the 1920s, a man of about thirty with short brown hair, clean-shaven, in a long white work coat, seen from the chest up holding one small photographic print under an old desk lamp and examining it closely. No logos, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Bang 4c: logo that -> hau ky. Nguoi cu the o Kodak khong duoc nguon neu ten.

### C1-35 · `object` · ✅ có trên Flow

**Tên card:** Blank Certificate Paper With Empty Seal

**Lời kể (`at`):** Kodak couldn't find any sign of faking either, but it **refused to certify** that they were real pictures of fairies.

**Ý đồ:** Vat tuong trung cho 'khong cap giay chung nhan' — dau X do la hau ky

**🖼️ Ảnh sẽ ra:** Một tờ giấy chứng nhận kiểu cũ có viền trang trí mảnh, mặt giấy trống trơn, góc dưới có một con dấu tròn màu đỏ trơn không hoa văn. Không chữ.

**🔍 Cần soi khi ra ảnh:** Model rất hay điền chữ vào giấy chứng nhận — phải trống hoàn toàn.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An old-fashioned certificate on cream paper with a thin decorative border, its surface completely BLANK with absolutely no writing, no letters and no signature, and one plain round red wax seal with no design in the lower corner. No lettering anywhere. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Skill 6i + 4d-bis 4c (vat tuong trung). Dau X do de len o hau ky.

### C1-36 · `character` · ✅ có trên Flow

**Tên card:** Author Ref Walrus Moustache

**Lời kể (`at`):** The next person to hear about the photographs was **Sir Arthur Conan Doyle**, the creator of Sherlock Holmes, the most famous detective in all of fiction, a man who trusted nothing but observation and logic.

**Ý đồ:** Asset Conan Doyle ~1920 — 7 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông vạm vỡ khoảng sáu mươi: mặt to bè, hàm nặng; tóc xám ngắn, thưa và hói ở thái dương, chải phẳng sang hai bên; bộ ria mép xám rất to rậm, hai đầu hơi cong lên, không râu cằm; áo vest sẫm, sơ mi trắng cổ cồn cao cứng, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Bộ ria là dấu nhận diện số 1. Không gọi tên trong prompt (SPEC-v2 mục 1).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Author Ref Walrus Moustache` — dùng lại ở: C1-38b, C1-51b, C1-56

**Prompt gửi Flow:**

```text
A heavy-set man of about sixty seen from the chest up. A broad full face with a heavy jaw. Short grey hair, thinning and receding at the temples, combed flat to the sides. A very large thick grey walrus moustache whose ends curl slightly upward, and no beard. He wears a dark suit jacket over a white shirt with a high stiff white collar and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `03-doyle-01.jpg`, `03-doyle-02.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh Bain ~1920 (03-doyle-01: ria walrus vuot hai dau, co con cao, vest sam) va anh 1920 tren tau (03-doyle-02: mu phot nhat, gi-le trang).

### C1-36b · `object` · ✅ có trên Flow

**Tên card:** Deerstalker Cap Beside Curved Pipe

**Lời kể (`at`):** The next person to hear about the photographs was Sir Arthur Conan Doyle, **the creator of Sherlock Holmes**, the most famous detective in all of fiction, a man who trusted nothing but observation and logic.

**Ý đồ:** VAT TUONG TRUNG cho Sherlock Holmes (o anh 8) — dat tach khoi canh co Doyle

**🖼️ Ảnh sẽ ra:** Một chiếc mũ vải ca rô kiểu thợ săn nai có hai lưỡi trai trước sau và hai vạt tai buộc lên, và một chiếc tẩu gỗ cong, đặt cạnh nhau. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Hai vật RỜI đặt cạnh nhau — SHOT-LIST luật 2 cấm định vị tương đối; ở đây chấp nhận vì là một cụm biểu tượng, không cần khoảng cách chính xác. Không vẽ người đội mũ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A checked cloth deerstalker cap with one peak at the front and one at the back and its ear flaps tied up on top, with one curved wooden tobacco pipe lying beside it. No people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Skill 4d-bis 4c: vat tuong trung KHONG sinh chung voi nguoi.

### C1-38 · `object` · ✅ có trên Flow

**Tên card:** Magazine Ref Plain Blue Cover

**Lời kể (`at`):** **The Strand Magazine had just asked him** to write an article about fairies for its Christmas issue of 1920, and the Cottingley photographs reached him at exactly the right moment.

**Ý đồ:** Asset tap chi 1920 — dung lai o C1-53. Bia that la hau ky

**🖼️ Ảnh sẽ ra:** Một cuốn tạp chí dày thập niên 1920 nằm nghiêng, bìa giấy xanh nhạt trơn, phần trên bìa có một ô chữ nhật trắng trống. Không chữ, không người.

**🔍 Cần soi khi ra ảnh:** Không được hiện chữ STRAND hay bất kỳ chữ nào.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Magazine Ref Plain Blue Cover` — dùng lại ở: C1-53

**Prompt gửi Flow:**

```text
A thick magazine of the 1920s lying at a slight angle, with a plain pale blue paper cover and one completely blank white rectangle near the top where a title would be. No lettering at all, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `05-strand-1920-01.jpg`

**Ghi chú:** Skill 6i. Bia that tap chi Strand (tranh duong pho London) la anh that — chen o hau ky neu can.

### C1-38b · `character` · ✅ có trên Flow

**Tên card:** Author Holding Two Small Photographs

**Lời kể (`at`):** The Strand Magazine had just asked him to write an article about fairies for its Christmas issue of 1920, and the Cottingley photographs **reached him at exactly the right moment**.

**Ý đồ:** Anh den tay Doyle

**🖼️ Ảnh sẽ ra:** Vẽ lại Doyle (C1-36, giữ nguyên mặt) nửa người, hai tay cầm hai tấm ảnh nhỏ nâu đỏ, mắt nhìn xuống ảnh. Mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không thêm vẻ phấn khích.

**Sinh bằng:** câu @mention — chip `@Author Ref Walrus Moustache` (asset từ C1-36). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Author Ref Walrus Moustache, keep his face exactly the same, seen from the chest up holding two small sepia photographic prints in his hands and looking down at them, in the same dark suit and high white collar, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-39 · `character` · ✅ có trên Flow

**Tên card:** Society Member Walking With Leather Case

**Lời kể (`at`):** In the summer of 1920, **Gardner traveled to Cottingley himself**.

**Ý đồ:** Gardner den Cottingley

**🖼️ Ảnh sẽ ra:** Vẽ lại Gardner (C1-29b, giữ nguyên mặt) nguyên người đang đi về phía phải, tay xách một va li da nâu nhỏ, đội mũ phớt. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Thêm mũ có làm đổi mặt không.

**Sinh bằng:** câu @mention — chip `@Society Member Ref Dark Suit` (asset từ C1-29b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Society Member Ref Dark Suit, keep his face exactly the same, now seen full length walking toward the right in the same suit with dark trousers and black shoes and a dark felt hat, carrying one small brown leather case in one hand, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Phuong tien di lai khong duoc nguon ghi — khong ve tau hoa/xe.

### C1-40 · `object` · ✅ có trên Flow

**Tên card:** Folding Cameras Ref Two Bellows

**Lời kể (`at`):** **He brought 2 new cameras** and 24 photographic plates that had been secretly marked, so that nobody could swap them.

**Ý đồ:** Asset hai may anh gap Cameo (W. Butcher & Sons) — dung lai C1-44b

**🖼️ Ảnh sẽ ra:** Hai máy ảnh gấp giống hệt nhau khoảng năm 1920 đặt cạnh nhau, đang mở: thân bọc da đen sần có quai trên nóc, nắp trước bật xuống thành bệ kim loại, ống xếp đen kéo dài trên bệ, tấm đỡ ống kính đen phía trước có một ống kính tròn và một ô ngắm nhỏ. Không chữ, không người.

**🔍 Cần soi khi ra ảnh:** Phải là máy ẢNH GẤP có ống xếp — khác hẳn máy hộp C1-10.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Folding Cameras Ref Two Bellows` — dùng lại ở: C1-44b

**Prompt gửi Flow:**

```text
Two identical folding plate cameras from about 1920 standing side by side, each opened out: a black pebbled-leather body with a leather strap on top, its front cover dropped down flat to form a metal bed, a black pleated bellows stretched out along the bed, and a small black lens board at the front holding one round lens and one tiny viewfinder. No lettering, no labels, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `09-cameras-04.jpg`

**Ghi chú:** Soi anh THAT chiec Cameo thu ba (National Science and Media Museum, qua Museum Crush): than da den, nap truoc bat xuong thanh be, ong xep den, bang ong kinh + o ngam nho. Cameo quarter-plate, W. Butcher & Sons.

### C1-40b · `object` · ✅ có trên Flow

**Tên card:** Open Box Of Glass Photographic Plates

**Lời kể (`at`):** He brought 2 new cameras and **24 photographic plates** that had been secretly marked, so that nobody could swap them.

**Ý đồ:** Vat duoc goi ten: 24 tam kinh danh dau bi mat. So 24 la chu hau ky

**🖼️ Ảnh sẽ ra:** Một hộp giấy cứng nông đã mở nắp, bên trong xếp đứng một chồng tấm kính ảnh vuông mỏng. Không đánh dấu nhìn thấy được (dấu là bí mật). Không chữ.

**🔍 Cần soi khi ra ảnh:** Hộp không có nhãn chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One open shallow cardboard box with its lid set aside, packed with a neat upright stack of thin square glass photographic plates. No labels, no lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `10-glass-plate-02.jpg`

**Ghi chú:** 'secretly marked' — dau an bi mat nen KHONG ve dau.

### C1-41 · `character` · ✅ có trên Flow

**Tên card:** Teen Girl Ref White Hair Bow

**Lời kể (`at`):** Frances had moved away by then, but she was **invited back to stay for the school holidays**.

**Ý đồ:** Asset Frances 1920 (13 tuoi) — 4 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một cô bé khoảng 13 tuổi: mặt tròn, tóc nâu nhạt xoăn lọn dài quá vai, một chiếc nơ vải trắng to buộc sau đầu; áo blouse cotton trắng rộng cổ bẻ mềm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Phải nhận ra là Frances lớn hơn C1-03 (cùng mặt tròn, tóc nâu nhạt), nơ trắng là dấu mới.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Teen Girl Ref White Hair Bow` — dùng lại ở: C1-42b, C1-44b, C1-46, C1-62

**Prompt gửi Flow:**

```text
A girl of about thirteen seen from the chest up. A round face. Long light brown hair falling in loose ringlets past her shoulders, with a large white ribbon bow tied at the back of her head. She wears a loose white cotton blouse with a wide soft collar. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-03.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh that 1920 (Frances and the Leaping Fairy).

### C1-42 · `character` · ✅ có trên Flow

**Tên card:** Young Woman Ref Dark Curls Side Fringe

**Lời kể (`at`):** **The girls explained** that the fairies wouldn't come out if anyone was watching.

**Ý đồ:** Asset Elsie 1920 (19 tuoi) — 4 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một thiếu nữ khoảng 19 tuổi: mặt trái xoan, tóc nâu sẫm dày xoăn lọn xoã quá vai, mái xoăn vắt lệch một bên trán; áo blouse màu nhạt in hoa văn xoáy mờ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Nhận ra được là Elsie C1-02 lớn hơn (tóc sẫm) nhưng không đội mũ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Young Woman Ref Dark Curls Side Fringe` — dùng lại ở: C1-42b, C1-44b, C1-47, C1-62

**Prompt gửi Flow:**

```text
A young woman of about nineteen seen from the chest up. An oval face. Long thick dark brown hair in loose curls falling past her shoulders, with a curled fringe swept to one side of her forehead. She wears a pale loose blouse printed with a faint swirling pattern. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-04.jpg`

**Ghi chú:** SHOT TAO ASSET. Soi anh that 1920 (Fairy offering Posy of Harebells to Elsie).

### C1-42b · `group` · ✅ có trên Flow

**Tên card:** Two Girls Explaining To Visitor In Suit

**Lời kể (`at`):** The girls explained that the fairies **wouldn't come out if anyone was watching**.

**Ý đồ:** Hanh vi noi: hai co gai giai thich, Gardner nghe

**🖼️ Ảnh sẽ ra:** Elsie 1920 (C1-42) và Frances 1920 (C1-41) nguyên người đứng cạnh nhau đang nói, Elsie giơ một tay; Gardner (C1-29b) đứng đối diện lắng nghe. Không tiên, không chữ.

**🔍 Cần soi khi ra ảnh:** Ba mặt đúng asset. Không vẽ tiên.

**Sinh bằng:** câu @mention — chip `@Young Woman Ref Dark Curls Side Fringe` (asset từ C1-42), `@Teen Girl Ref White Hair Bow` (asset từ C1-41), `@Society Member Ref Dark Suit` (asset từ C1-29b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same young woman as in @Young Woman Ref Dark Curls Side Fringe and the same girl as in @Teen Girl Ref White Hair Bow, keep both faces exactly the same, seen full length side by side talking with their mouths open, the young woman raising one hand, the young woman in the same patterned blouse with a long dark skirt, dark stockings and black shoes, the girl a little shorter in the same white blouse with a dark pleated skirt to mid-calf, white stockings and black shoes, and the same man as in @Society Member Ref Dark Suit, keep his face exactly the same, standing facing them full length in the same suit, listening, no fairies, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Phan duoi trang phuc 1920 (vay, tat, giay) KHONG co trong anh that (anh chi thay nua tren) — ta theo thoi trang thieu nu Anh 1920.

### C1-43 · `place` · ✅ có trên Flow

**Tên card:** Same Stream Under Heavy Rain

**Lời kể (`at`):** **It rained for days on end**, and the weather didn't clear until August 19th.

**Ý đồ:** Trang thai moi cua con suoi: mua nhieu ngay

**🖼️ Ảnh sẽ ra:** Vẽ lại con suối C1-05 cùng góc nhìn, giờ mưa nặng hạt: các vệt mưa xiên thẳng phủ cả khung, mặt nước lăn tăn, bầu trời xám phía trên. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Giữ đúng bố cục asset suối.

**Sinh bằng:** câu @mention — chip `@Stream Ref Flat Stones Small Fall` (asset từ C1-05). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same stream as in @Stream Ref Flat Stones Small Fall from exactly the same viewpoint, now under heavy rain, with straight slanting streaks of rain across the whole picture, the water surface broken by raindrops and a flat grey sky above, no people, no lettering, plain white background
```

### C1-44 · `figure` · ✅ có trên Flow

**Tên card:** Mother Walking Off With Travel Bag

**Lời kể (`at`):** That day, **Polly went off to visit one of her sisters**, leaving the 2 girls at home with the cameras.

**Ý đồ:** Ba Polly di vang

**🖼️ Ảnh sẽ ra:** Vẽ lại người mẹ (C1-07, giữ nguyên mặt) nguyên người đang đi về phía trái, áo khoác nâu, váy dài sẫm, mũ vành, tay xách một túi du lịch nhỏ. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không thêm người đi cùng.

**Sinh bằng:** câu @mention — chip `@Mother Ref Pinned Bun Brown Coat` (asset từ C1-07). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same woman as in @Mother Ref Pinned Bun Brown Coat, keep her face exactly the same, now seen full length walking toward the left in the same brown coat over a long dark skirt with black boots and a plain dark wide-brimmed hat, carrying one small travel bag, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-44b · `group` · ✅ có trên Flow

**Tên card:** Two Girls Each Holding A Folding Camera

**Lời kể (`at`):** That day, Polly went off to visit one of her sisters, **leaving the 2 girls at home with the cameras**.

**Ý đồ:** Hai co gai o nha voi may anh — dung lai cho '3 more photographs' va 'not a single new photograph'

**🖼️ Ảnh sẽ ra:** Elsie 1920 (C1-42) và Frances 1920 (C1-41) nguyên người đứng cạnh nhau, mỗi người cầm một chiếc máy ảnh gấp như C1-40. Mặt trung tính. Không tiên, không chữ.

**🔍 Cần soi khi ra ảnh:** Hai máy phải giống asset máy gấp. Không vẽ giấy hay hình tiên.

**Sinh bằng:** câu @mention — chip `@Young Woman Ref Dark Curls Side Fringe` (asset từ C1-42), `@Teen Girl Ref White Hair Bow` (asset từ C1-41), `@Folding Cameras Ref Two Bellows` (asset từ C1-40). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same young woman as in @Young Woman Ref Dark Curls Side Fringe and the same girl as in @Teen Girl Ref White Hair Bow, keep both faces exactly the same, seen full length standing side by side in the same clothes with long skirts and black shoes, each holding one of the same cameras as in @Folding Cameras Ref Two Bellows in both hands, the girl a little shorter, no fairies, no paper, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-46 · `character` · ✅ có trên Flow

**Tên card:** Teen Girl In Profile With Leaping Fairy

**Lời kể (`at`):** In one, **a fairy leaps up right beside Frances's nose**.

**Ý đồ:** Ve lai anh thu ba (1920)

**🖼️ Ảnh sẽ ra:** Vẽ lại Frances 1920 (C1-41, giữ nguyên mặt) nửa người nhìn nghiêng giữa bụi lá; một nàng tiên tí hon có cánh nhảy vọt lên ngay sát mũi cô, thân mảnh, tay dang. Không chữ.

**🔍 Cần soi khi ra ảnh:** Tiên có bị xoá không. Frances nhìn nghiêng.

**Sinh bằng:** câu @mention — chip `@Teen Girl Ref White Hair Bow` (asset từ C1-41). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Teen Girl Ref White Hair Bow, keep her face and white hair bow exactly the same, seen from the chest up in profile among leafy branches, while one tiny winged fairy with a slim body and outstretched arms leaps up in the air right beside her nose, the fairy only as tall as her hand, she is the only person in the picture and the fairy is a small fairy figure that must be drawn, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-03.jpg`

**Ghi chú:** Theo anh that 1920 'Frances and the Leaping Fairy'.

### C1-47 · `character` · ✅ có trên Flow

**Tên card:** Young Woman Offered Flowers By Tiny Fairy

**Lời kể (`at`):** In another, a fairy stands on a branch, **offering Elsie a little bunch of harebells**.

**Ý đồ:** Ve lai anh thu tu (1920)

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie 1920 (C1-42, giữ nguyên mặt) nửa người, hơi cúi đầu; trên một cành cây ngang trước mặt cô, một nàng tiên tí hon có đôi cánh lớn, váy dài, đứng kiễng chân đưa về phía cô một bó hoa chuông xanh nhỏ. Không chữ.

**🔍 Cần soi khi ra ảnh:** Tiên có bị xoá không. Hoa chuông màu xanh nhạt.

**Sinh bằng:** câu @mention — chip `@Young Woman Ref Dark Curls Side Fringe` (asset từ C1-42). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same young woman as in @Young Woman Ref Dark Curls Side Fringe, keep her face exactly the same, seen from the chest up with her head tilted slightly down, while on a bare branch in front of her one tiny winged fairy with large pale wings and a long dress stands on tiptoe holding out a small bunch of pale blue harebell flowers toward her, the fairy only as tall as her hand, she is the only person in the picture and the fairy is a small fairy figure that must be drawn, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-04.jpg`, `12-harebell-01.jpg`

**Ghi chú:** Theo anh that 1920 'Fairy offering Posy of Harebells to Elsie'.

### C1-47b · `object` · ✅ có trên Flow

**Tên card:** Small Bunch Of Pale Blue Bell Flowers

**Lời kể (`at`):** In another, a fairy stands on a branch, offering Elsie a little **bunch of harebells**.

**Ý đồ:** Vat duoc goi ten: hoa chuong (harebell) — nguoi xem My it biet hoa nay

**🖼️ Ảnh sẽ ra:** Một bó nhỏ hoa chuông dại: những cuống xanh mảnh, mỗi cuống rủ một bông hình chuông màu xanh lam nhạt. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Đúng hoa Campanula rotundifolia (chuông rủ), không ra hoa loa kèn.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small bunch of harebells: thin green stems each ending in one drooping pale blue bell-shaped flower, tied together at the bottom. No people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `12-harebell-01.jpg`

### C1-48 · `place` · ✅ có trên Flow

**Tên card:** Pale Misty Winged Shapes In Tall Grass

**Lời kể (`at`):** **Just pale, misty fairy shapes among the grass**.

**Ý đồ:** Ve lai anh thu nam 'Fairies and Their Sun-Bath' — dung lai o 4 cau cuoi (nhip ket case)

**🖼️ Ảnh sẽ ra:** Cận cảnh đám cỏ cao và hoa dại; giữa các thân cỏ có ba hình người có cánh mờ nhạt, trong suốt, khoác áo dài rủ xuống, vẽ nhạt như sương. Không cô gái nào, không người rõ nét, không chữ.

**🔍 Cần soi khi ra ảnh:** Các hình phải MỜ, nhạt — không vẽ rõ nét như các ảnh trước. Không có cô gái.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
Tall grass and small wildflowers seen close up, and among the stalks three pale, blurry, see-through winged shapes in long draped robes, drawn faint and misty like mist. No girls, no clear people, no lettering, no sun. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `01-fairy-photos-05.jpg`, `01-fairy-photos-06.jpg`

**Ghi chú:** Theo anh that 1920 'Fairies and Their Sun-Bath': cac hinh nhat, chong mo nhu phoi hai lan. Tam anh gay tranh cai giua hai chi em.

### C1-51 · `place` · ✅ có trên Flow

**Tên card:** Australia Map With Melbourne Labelled

**Lời kể (`at`):** Doyle was away on **a lecture tour in Australia** at the time.

**Ý đồ:** Noi Doyle o luc do (o anh 6)

**🖼️ Ảnh sẽ ra:** Bản đồ phẳng nước Úc theo hình bản đồ tham chiếu (13-maps-03): đất liền tô vàng nhạt phẳng có chữ "AUSTRALIA" in hoa; chữ "MELBOURNE" in hoa ở bờ đông nam. Không tiêu đề, không tên nơi khác.

**🔍 Cần soi khi ra ảnh:** CHÍNH TẢ. MELBOURNE ở góc đông nam lục địa (bang Victoria), không nhầm sang Sydney.

**Sinh bằng:** câu @mention — chip `@13-maps-03.png` (file ảnh), `@01-pyramid-place.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a map shaped like @13-maps-03.png with the same style as @01-pyramid-place.png, fill Australia with one flat pale yellow colour and label it "AUSTRALIA" in plain capital letters, and write "MELBOURNE" in plain capital letters at the position of Melbourne on the south-eastern coast, spell every name exactly as written here, no title, no numbers, no compass rose, no scale bar, no grid lines, no arrows, no other place names, no sun
```

**Ảnh tư liệu đã soi (không gửi Flow):** `13-maps-03.png`

### C1-51b · `character` · ✅ có trên Flow

**Tên card:** Author Speaking At A Lectern

**Lời kể (`at`):** **Doyle was away on a lecture tour** in Australia at the time.

**Ý đồ:** Doyle di dien thuyet

**🖼️ Ảnh sẽ ra:** Vẽ lại Doyle (C1-36, giữ nguyên mặt) nguyên người đứng sau bục giảng gỗ, một tay đặt lên bục, miệng mở đang nói. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Bục giảng khác bục ở C1-26b không quan trọng; không có khán giả.

**Sinh bằng:** câu @mention — chip `@Author Ref Walrus Moustache` (asset từ C1-36). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Author Ref Walrus Moustache, keep his face exactly the same, seen full length in the same dark suit with dark trousers and black shoes, standing behind a plain wooden lectern with one hand resting on it, talking with his mouth open, no audience, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-52 · `object` · ✅ có trên Flow

**Tên card:** Blank Telegram Form Paper

**Lời kể (`at`):** When he heard the news, **he sent a telegram from Melbourne** saying his heart was gladdened by 3 wonderful pictures that confirmed everything they had published.

**Ý đồ:** Vat duoc goi ten: buc dien tin. Noi dung la chu hau ky

**🖼️ Ảnh sẽ ra:** Một tờ giấy điện tín chữ nhật nhỏ kiểu năm 1920, màu vàng nhạt, có vài dải băng giấy dán ngang không chữ và vài dòng kẻ xám mảnh. Không chữ.

**🔍 Cần soi khi ra ảnh:** Model hay điền chữ TELEGRAM — phải trống.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A small rectangular telegram form of about 1920 on pale yellow paper, with a few narrow blank paper strips pasted across it and a few thin grey lines standing for text. Completely BLANK: absolutely no letters, no words and no numbers anywhere. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Skill 6i.

### C1-53 · `object` · ✅ có trên Flow

**Tên card:** Same Magazine Lying Open On Two Photos

**Lời kể (`at`):** In December 1920, Doyle's article, "Fairies Photographed," **appeared in the Christmas issue of The Strand**, along with the 2 photographs from 1917.

**Ý đồ:** Bai bao voi hai tam anh — trang that (05-strand-1920-01) chen o hau ky neu can

**🖼️ Ảnh sẽ ra:** Vẽ lại cuốn tạp chí C1-38, giờ mở ra: mỗi trang có một khung ảnh nhỏ màu nâu đỏ (một bé gái với các hình nhỏ có cánh; một cô gái ngồi với chú lùn), quanh ảnh là các dòng kẻ xám thay cho chữ. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không có chữ trên trang. Hai ảnh nhỏ mờ là đủ.

**Sinh bằng:** câu @mention — chip `@Magazine Ref Plain Blue Cover` (asset từ C1-38). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same magazine as in @Magazine Ref Plain Blue Cover, now lying open flat, each of the two open pages showing one small sepia photograph in a thin frame, one of a young girl with tiny winged figures and one of a girl sitting beside a small gnome, surrounded by thin grey lines standing for columns of text, absolutely no letters and no words, no people outside the pictures, plain white background
```

**Ảnh tư liệu đã soi (không gửi Flow):** `05-strand-1920-01.jpg`

### C1-56 · `character` · ✅ có trên Flow

**Tên card:** Author Writing At His Desk

**Lời kể (`at`):** **Doyle wrote that once people accepted** that fairies were real, it would jolt the heavy, materialistic mind of the 20th century out of its ruts.

**Ý đồ:** Hanh vi viet cua Doyle — noi dung la chu hau ky

**🖼️ Ảnh sẽ ra:** Vẽ lại Doyle (C1-36, giữ nguyên mặt) nửa người ngồi bên bàn gỗ, tay cầm bút viết lên trang giấy chỉ có vài dòng kẻ xám. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Giấy không có chữ.

**Sinh bằng:** câu @mention — chip `@Author Ref Walrus Moustache` (asset từ C1-36). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Author Ref Walrus Moustache, keep his face exactly the same, seen from the chest up sitting at a wooden desk writing on a sheet of paper with a pen, the paper showing only a few thin grey lines and no letters, in the same dark suit, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `03-doyle-01.jpg`

**Ghi chú:** Anh that 03-doyle-01 cung la Doyle cam but ben ban — tu the co nguon.

### C1-57 · `object` · ✅ có trên Flow

**Tên card:** Closed Hardback Book With Plain Cloth Cover

**Lời kể (`at`):** In 1922, he published a whole book on the subject, **called The Coming of the Fairies**.

**Ý đồ:** Vat duoc goi ten: cuon sach 1922. Bia that la hau ky

**🖼️ Ảnh sẽ ra:** Một cuốn sách bìa cứng bọc vải thập niên 1920 đứng dựng, bìa trơn màu xanh rêu sẫm, không chữ, không hình. Không người.

**🔍 Cần soi khi ra ảnh:** Không có tên sách trên bìa/gáy.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One closed hardback book of the 1920s standing upright, with a plain dark moss-green cloth cover and spine and nothing printed or stamped on it. No lettering, no pictures, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Mau bia that chua doi chieu — sach minh hoa loai. Anh bia that (neu co) chen o hau ky.

### C1-58 · `object` · ✅ có trên Flow

**Tên card:** Stack Of Folded Newspapers Blank Columns

**Lời kể (`at`):** **The press was split**.

**Ý đồ:** Bao chi chia phe — dung lai cho loi mia cua mot to bao

**🖼️ Ảnh sẽ ra:** Một chồng báo gấp kiểu 1920, trang trên cùng có một ô chữ nhật trống cho ảnh và đúng bốn dòng kẻ xám thay cho cột chữ. Không chữ, không tiêu đề.

**🔍 Cần soi khi ra ảnh:** Model rất hay viết tiêu đề báo — phải trống.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
A stack of folded newspapers of the 1920s, the top page showing one large blank rectangle where a photograph would be and EXACTLY FOUR thin grey horizontal lines standing for columns of text. No headlines, no letters, no words anywhere. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Skill 6i: mat bao -> dong ke xam.

### C1-61 · `figure` · ✅ có trên Flow

**Tên card:** Clairvoyant Ref Grey Tweed Jacket

**Lời kể (`at`):** In the summer of 1921, Gardner came back one more time, **bringing a clairvoyant with him**.

**Ý đồ:** Asset nha ngoai cam 1921 (loi ke khong goi ten) — 2 shot

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một người đàn ông gầy khoảng ba mươi lăm: tóc sẫm chải ngược lộ trán cao, mặt cạo nhẵn; áo khoác tweed xám, sơ mi trắng, cà vạt sẫm. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Người minh hoạ; khác hẳn Gardner (mặt, áo).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Clairvoyant Ref Grey Tweed Jacket` — dùng lại ở: C1-62

**Prompt gửi Flow:**

```text
A slim man in his mid-thirties seen from the chest up. Dark hair combed straight back from a high forehead, clean-shaven. He wears a grey tweed jacket over a white shirt and a dark tie. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Nguoi that la Geoffrey Hodson; loi ke khong goi ten -> figure, khong soi chan dung.

### C1-62 · `group` · ✅ có trên Flow

**Tên card:** Clairvoyant Pointing While Two Girls Watch

**Lời kể (`at`):** The clairvoyant said **he could see fairies everywhere**.

**Ý đồ:** Hanh vi noi cua nha ngoai cam — KHONG ve tien (chi la loi anh ta)

**🖼️ Ảnh sẽ ra:** Nhà ngoại cảm (C1-61) nguyên người chỉ tay về phía một bụi cây, miệng mở đang nói; Elsie 1920 và Frances 1920 (C1-42, C1-41) đứng cạnh nhìn theo, mặt trung tính. KHÔNG có tiên. Không chữ.

**🔍 Cần soi khi ra ảnh:** TUYỆT ĐỐI không vẽ tiên (giới hạn mức chắc chắn).

**Sinh bằng:** câu @mention — chip `@Clairvoyant Ref Grey Tweed Jacket` (asset từ C1-61), `@Young Woman Ref Dark Curls Side Fringe` (asset từ C1-42), `@Teen Girl Ref White Hair Bow` (asset từ C1-41). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same man as in @Clairvoyant Ref Grey Tweed Jacket, keep his face exactly the same, seen full length in the same tweed jacket with grey trousers and brown shoes, pointing at a leafy bush and talking with his mouth open, and the same young woman as in @Young Woman Ref Dark Curls Side Fringe and the same girl as in @Teen Girl Ref White Hair Bow, keep both faces exactly the same, standing beside him full length in the same clothes with long skirts and black shoes, looking where he points, absolutely no fairies anywhere and nothing in the bush, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Cau ra 9: 'said he could see' — ve hanh vi noi.

### C1-68 · `figure` · ✅ có trên Flow

**Tên card:** Elderly Woman Ref White Curls Cardigan

**Lời kể (`at`):** **In 1966, a reporter** tracked Elsie down.

**Ý đồ:** Asset Elsie luc gia (1966-1983) — KHONG co chan dung that, hu cau co co so

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một bà cụ khoảng bảy mươi lăm: mặt trái xoan, tóc bạc trắng ngắn uốn xoăn sát đầu; áo len cardigan xanh nhạt ngoài sơ mi trắng cổ tròn nhỏ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** HƯ CẤU — không ghi trong video là chân dung Elsie. Mặt trái xoan nối với asset trẻ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Elderly Woman Ref White Curls Cardigan` — dùng lại ở: C1-68b, C1-70b, C1-75b, C1-84

**Prompt gửi Flow:**

```text
An elderly woman of about seventy-five seen from the chest up. An oval face. Short white hair set in soft curls close to her head. She wears a pale blue cardigan over a white blouse with a small round collar. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** SHOT TAO ASSET. stillMissing: anh Elsie 1966-1985 (co tren truyen hinh YTV/BBC nhung chua tim ra anh tinh). Tim duoc thi viet lai + doi outName.

### C1-68b · `group` · ✅ có trên Flow

**Tên card:** Elderly Woman Talking To Reporter With Notebook

**Lời kể (`at`):** In 1966, a reporter **tracked Elsie down**.

**Ý đồ:** Phong vien gap Elsie, Elsie tra loi — dung lai cho cau 'figments of her imagination'

**🖼️ Ảnh sẽ ra:** Elsie lúc già (C1-68, giữ nguyên mặt) ngồi trên ghế bành đang nói, một tay giơ nhẹ; đối diện là một phóng viên nam khoảng ba mươi, tóc nâu ngắn, vest xám thập niên 1960, cà vạt mảnh, cầm sổ và bút. Không chữ.

**🔍 Cần soi khi ra ảnh:** Sổ không có chữ. Phóng viên không trùng mặt asset khác.

**Sinh bằng:** câu @mention — chip `@Elderly Woman Ref White Curls Cardigan` (asset từ C1-68), `@02-doctor-figure.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Elderly Woman Ref White Curls Cardigan, keep her face exactly the same, seen full length sitting in an armchair in the same cardigan with a grey skirt and flat shoes, talking with her mouth open and one hand slightly raised, and facing her a reporter of the 1960s, a man of about thirty with short brown hair, clean-shaven, in a grey suit and a thin dark tie, holding a small notebook and a pen, in the same drawing style as @02-doctor-figure.png, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Luat 8: Elsie la nguoi noi. Nguoi moi mot nguoi -> anh neo 02 (4d-9d, chua do).

### C1-70 · `figure` · ✅ có trên Flow

**Tên card:** Old Lady Ref Grey Bob Green Jumper

**Lời kể (`at`):** **In 1976, on television**, both women agreed that a rational person doesn't see fairies.

**Ý đồ:** Asset Frances luc gia (1976-1986) — KHONG co chan dung that, hu cau co co so

**🖼️ Ảnh sẽ ra:** Chân dung NỬA NGƯỜI một bà cụ khoảng bảy mươi: mặt tròn, tóc xám cắt bob ngắn thẳng rẽ ngôi lệch; áo len xanh lá sẫm, cổ đeo chuỗi ngọc trai nhỏ. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** HƯ CẤU. Mặt tròn nối với asset Frances trẻ; tóc phải khác hẳn Elsie già.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `02-doctor-figure.png`

**Tạo asset** `Old Lady Ref Grey Bob Green Jumper` — dùng lại ở: C1-70b, C1-75b, C1-86, C1-89

**Prompt gửi Flow:**

```text
An elderly woman of about seventy seen from the chest up. A round face. Grey hair cut in a short straight bob with a side parting. She wears a dark green wool jumper and a string of small pearls at her neck. Draw this in exactly the same drawing style as the reference images, on a plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** SHOT TAO ASSET. stillMissing: anh Frances 1970s-1980s.

### C1-70b · `group` · ✅ có trên Flow

**Tên card:** Two Elderly Women On Studio Sofa Before Camera

**Lời kể (`at`):** In 1976, on television, **both women agreed that a rational person** doesn't see fairies.

**Ý đồ:** Hai ba tren truyen hinh 1976 — dung lai cho 'wouldn't admit' va 'both telling the truth'

**🖼️ Ảnh sẽ ra:** Elsie già (C1-68) và Frances già (C1-70), giữ nguyên mặt, nguyên người ngồi cạnh nhau trên một chiếc sofa trường quay; phía trước bên phải là một máy quay truyền hình thập niên 1970 trên chân. Mặt trung tính. Không chữ, không logo.

**🔍 Cần soi khi ra ảnh:** Hai mặt đúng asset, không trộn tóc. Máy quay không có logo đài.

**Sinh bằng:** câu @mention — chip `@Elderly Woman Ref White Curls Cardigan` (asset từ C1-68), `@Old Lady Ref Grey Bob Green Jumper` (asset từ C1-70). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Elderly Woman Ref White Curls Cardigan and the same elderly woman as in @Old Lady Ref Grey Bob Green Jumper, keep both faces and hair exactly the same and do not mix their features, seen full length sitting side by side on a plain television studio sofa in the same clothes with skirts and flat shoes, and one large 1970s television studio camera on a wheeled stand facing them from the right, no logos, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-72 · `figure` · ✅ có trên Flow

**Tên card:** Man At Old Computer Screen With Grainy Photo

**Lời kể (`at`):** Meanwhile, skeptics were **enlarging the photographs with computers**, and a photography expert went back over them from the very beginning.

**Ý đồ:** Nguoi hoai nghi phong to anh bang may tinh (1978)

**🖼️ Ảnh sẽ ra:** Một người đàn ông khoảng ba mươi lăm, râu quai nón nâu, kính gọng dày, áo len cardigan nâu, ngồi trước một máy tính thập niên 1970 (màn hình lồi, bàn phím rời); trên màn hình là một hình phóng to hạt lợn cợn: bé gái với các hình nhỏ có cánh. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Máy tính kiểu 1970s, không ra máy hiện đại. Màn hình không có chữ.

**Sinh bằng:** câu @mention — chip `@02-doctor-figure.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a man of about thirty-five with a short brown beard and thick-rimmed glasses, in a brown cardigan, seen from the chest up sitting at a late-1970s computer terminal with a bulky curved screen and a separate keyboard, the screen showing an enlarged grainy picture of a young girl with tiny winged figures, in the same drawing style as @02-doctor-figure.png, no letters on the screen, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Nguoi that (nhom Randi/CSICOP 1978) loi ke khong goi ten -> figure. Nguoi moi -> anh neo 02 (4d-9d).

### C1-72b · `figure` · ✅ có trên Flow

**Tên card:** Grey Bearded Expert Over Prints With Loupe

**Lời kể (`at`):** Meanwhile, skeptics were enlarging the photographs with computers, and a photography expert **went back over them from the very beginning**.

**Ý đồ:** Chuyen gia anh 1982 (Crawley) soi lai — dung lai cho gia thuyet 'double exposure'

**🖼️ Ảnh sẽ ra:** Một người đàn ông khoảng sáu mươi, tóc xám, râu cằm xám ngắn, áo tweed nâu, cúi trên bàn có vài tấm ảnh nhỏ nâu đỏ, mắt áp vào kính lúp. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Phải khác hẳn Snelling (C1-31) — không kính tròn, có râu.

**Sinh bằng:** câu @mention — chip `@02-doctor-figure.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw a man of about sixty with grey hair and a short grey beard, in a brown tweed jacket, seen from the chest up bending over a table spread with a few small sepia photographs and looking at them through a small magnifying loupe held to one eye, in the same drawing style as @02-doctor-figure.png, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Nguoi that la Geoffrey Crawley (British Journal of Photography 1982-83), loi ke khong goi ten. KHAC nguoi voi Snelling — khong dung lai C1-32 (se doc thanh cung mot nguoi).

### C1-75 · `object` · ✅ có trên Flow

**Tên card:** Glossy Magazine With Dark Blank Cover

**Lời kể (`at`):** In 1983, in **a magazine called The Unexplained**, the 2 elderly cousins finally admitted it.

**Ý đồ:** Vat duoc goi ten: tap chi The Unexplained (1983). Bia that la hau ky

**🖼️ Ảnh sẽ ra:** Một cuốn tạp chí mỏng bóng láng thập niên 1980, bìa màu tối với một ô hình lớn trống, không chữ. Không người.

**🔍 Cần soi khi ra ảnh:** Khác hẳn tạp chí 1920 (C1-38): mỏng, bóng, bìa tối. Không chữ.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One thin glossy magazine of the early 1980s lying at a slight angle, with a dark cover and one large blank picture area, completely BLANK with no letters and no words. No people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ghi chú:** Skill 6i.

### C1-75b · `group` · ✅ có trên Flow

**Tên card:** Two Elderly Women Talking To Interviewer

**Lời kể (`at`):** In 1983, in a magazine called The Unexplained, **the 2 elderly cousins finally admitted it**.

**Ý đồ:** Hanh vi thu nhan: nguoi noi la hai ba, nguoi nghe la nguoi phong van

**🖼️ Ảnh sẽ ra:** Elsie già và Frances già (C1-68, C1-70) ngồi trên ghế đang nói; đối diện là một người phỏng vấn nam khoảng bốn mươi, tóc sẫm, áo len, cầm một máy ghi âm cassette nhỏ. Mặt trung tính. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hai mặt đúng asset. Không thêm nét mặt ăn năn/buồn (nguồn không nói).

**Sinh bằng:** câu @mention — chip `@Elderly Woman Ref White Curls Cardigan` (asset từ C1-68), `@Old Lady Ref Grey Bob Green Jumper` (asset từ C1-70), `@02-doctor-figure.png` (file ảnh). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Elderly Woman Ref White Curls Cardigan and the same elderly woman as in @Old Lady Ref Grey Bob Green Jumper, keep both faces and hair exactly the same and do not mix their features, seen full length sitting on two chairs in the same clothes with skirts and flat shoes, both talking, and facing them an interviewer of the early 1980s, a man of about forty with dark hair in a plain jumper, holding a small cassette tape recorder toward them, in the same drawing style as @02-doctor-figure.png, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

**Ghi chú:** Nguoi phong van that (Joe Cooper) loi ke khong goi ten. Nguoi moi mot nguoi -> anh neo 02.

### C1-76 · `character` · ✅ có trên Flow

**Tên card:** Older Girl Drawing A Winged Dancer

**Lời kể (`at`):** **Elsie had drawn the fairies herself**.

**Ý đồ:** TRA chi tiet dat truoc C1-17 (Elsie ve gioi): gio lo hinh tren giay la tien

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie (C1-02, không mũ, giữ nguyên mặt) nửa người ngồi bên bàn như C1-17, nhưng giờ tờ giấy quay về phía người xem: trên đó là hình một cô gái nhỏ đang múa, váy dài bay, có đôi cánh bướm. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Cặp đầu–cuối với C1-17 (skill 4b): cùng tư thế, chỉ khác tờ giấy lộ hình tiên.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same girl as in @Older Girl Ref Bell Hat White Dress, keep her face and her long dark hair exactly the same but without the hat, seen from the chest up sitting at a table drawing with a pencil, a sheet of card in front of her turned toward the viewer showing a drawing of a small dancing girl in a long flowing dress with a pair of butterfly wings, in the same white dress, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Skill 4b cap canh doi xung dau-cuoi voi C1-17. Story-structure muc 3: tra chi tiet trong cung cau phat hien.

### C1-77 · `object` · ✅ có trên Flow

**Tên card:** Open Picture Book With Three Dancing Girls

**Lời kể (`at`):** She copied the figures of dancing girls from a popular children's book of the time, **Princess Mary's Gift Book**, changed a few details, and added wings.

**Ý đồ:** Nguon goc hinh tien: tranh Claude Shepperson trong sach 1914

**🖼️ Ảnh sẽ ra:** Một cuốn sách tranh cũ mở phẳng, trang phải là tranh nét mực đen: ba cô gái chân trần múa trong váy dài bay, cùng giữ một dải khăn dài bay lượn; trang trái trống. Không chữ.

**🔍 Cần soi khi ra ảnh:** Không có chữ trên trang. Ba cô gái KHÔNG có cánh (cánh là Elsie thêm).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
An old picture book lying open flat, the right-hand page showing a black ink line drawing of three barefoot girls dancing in long flowing dresses and holding one long floating scarf between them, the left-hand page blank. No wings on the girls, no lettering anywhere. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `06-princess-mary-01.jpg`, `06-princess-mary-02.png`

**Ghi chú:** Soi tranh that (06-princess-mary-01, Shepperson, minh hoa bai tho 'A Spell for a Fairy' cua Alfred Noyes): ba co gai mua, khan dai, vai nguoi co canh mo — de tranh nham, prompt cam canh. Anh that chen o hau ky canh ban ve C1-14b de so sanh (06-princess-mary-02).

### C1-78 · `group` · ✅ có trên Flow

**Tên card:** Two Girls Cutting Paper Figures With Scissors

**Lời kể (`at`):** **The cousins cut the figures out**, stood them up in the grass with hatpins, took their pictures, and then threw the props into the stream.

**Ý đồ:** Hanh dong cat hinh

**🖼️ Ảnh sẽ ra:** Elsie (không mũ) và Frances 1917 (C1-02, C1-03, giữ nguyên mặt) ngồi bên bàn, Elsie cầm kéo cắt quanh một hình cô gái có cánh vẽ trên bìa mỏng, Frances giữ một hình đã cắt xong. Không chữ.

**🔍 Cần soi khi ra ảnh:** Frances nhỏ hơn rõ. Kéo kiểu cũ.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, the older girl without her hat, seen from the waist up sitting side by side at a table, the older girl cutting around a small drawn winged dancing figure on thin card with a pair of scissors and the younger girl holding up one figure already cut out, the younger girl plainly smaller, in the same white dresses, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-78b · `object` · ✅ có trên Flow

**Tên card:** Paper Cutout Ref Winged Dancer

**Lời kể (`at`):** The cousins **cut the figures out**, stood them up in the grass with hatpins, took their pictures, and then threw the props into the stream.

**Ý đồ:** Asset hinh tien giay — dung cho C1-78c va nhip 'made of paper'

**🖼️ Ảnh sẽ ra:** Một hình cô gái nhỏ đang múa, váy dài nhạt màu bay, đôi cánh hình cánh bướm lớn, vẽ trên bìa mỏng trắng và cắt theo đường viền — thấy rõ mép cắt trắng bao quanh; nằm phẳng. Không chữ.

**🔍 Cần soi khi ra ảnh:** Phải đọc ra là GIẤY cắt (mép trắng, phẳng), không ra tiên thật.

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Tạo asset** `Paper Cutout Ref Winged Dancer` — dùng lại ở: C1-78c

**Prompt gửi Flow:**

```text
A small figure of a dancing girl in a long flowing pale dress with a pair of large butterfly-shaped wings, drawn on thin white card and cut out around its outline, with a thin white cut edge visible all the way around it, lying flat. It is clearly a flat piece of paper. No lettering, no people. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `06-princess-mary-02.png`, `01-fairy-photos-01.jpg`

### C1-78c · `object` · ✅ có trên Flow

**Tên card:** Paper Dancer Pinned Upright In Grass

**Lời kể (`at`):** The cousins cut the figures out, **stood them up in the grass with hatpins**, took their pictures, and then threw the props into the stream.

**Ý đồ:** CHO NOI (luat 6): kim cai mu xuyen qua hinh giay cam xuong dat. Cap dau-cuoi voi C1-14b — dung lai cho 'made of paper'

**🖼️ Ảnh sẽ ra:** Vẽ lại hình tiên giấy C1-78b, giờ đứng thẳng giữa các ngọn cỏ, được giữ bởi một chiếc kim cài mũ dài mảnh đầu ngọc trai tròn xuyên qua tấm bìa cắm xuống đất; thấy rõ mép giấy trắng. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Kim phải XUYÊN qua giấy xuống đất (chỗ nối là chủ thể). Hình vẫn đọc ra là giấy.

**Sinh bằng:** câu @mention — chip `@Paper Cutout Ref Winged Dancer` (asset từ C1-78b). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same paper figure as in @Paper Cutout Ref Winged Dancer, keep it exactly the same with its white cut edge, now standing upright among blades of grass, held up by one long thin steel hatpin with a small round pearl head pushed through the card and down into the ground, no people, no lettering, plain white background
```

**Ảnh tư liệu đã soi (không gửi Flow):** `11-hatpin-01.jpg`

### C1-78d · `object` · ✅ có trên Flow

**Tên card:** Long Steel Hatpin With Pearl Head

**Lời kể (`at`):** The cousins cut the figures out, stood them up in the grass **with hatpins**, took their pictures, and then threw the props into the stream.

**Ý đồ:** Vat duoc goi ten: kim cai mu — nguoi xem hom nay it biet

**🖼️ Ảnh sẽ ra:** Một chiếc kim cài mũ bằng thép dài và mảnh, đầu là một viên ngọc trai tròn nhỏ, nằm chéo. Không người, không chữ.

**🔍 Cần soi khi ra ảnh:** Kim phải rất dài so với đầu (kim cài mũ thời 1910s dài 15-25 cm).

**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: `01-pyramid-place.png`

**Prompt gửi Flow:**

```text
One long thin steel hatpin with a small round pearl head, lying diagonally. No people, no lettering. Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

**Ảnh tư liệu đã soi (không gửi Flow):** `11-hatpin-01.jpg`

### C1-78e · `group` · ✅ có trên Flow

**Tên card:** Two Girls Tossing Paper Figures Into Stream

**Lời kể (`at`):** The cousins cut the figures out, stood them up in the grass with hatpins, took their pictures, and then **threw the props into the stream**.

**Ý đồ:** Hanh dong vut dao cu xuong suoi

**🖼️ Ảnh sẽ ra:** Elsie và Frances 1917 (C1-02, C1-03) nguyên người đứng trên đá ở mép con suối C1-05, thả vài hình giấy nhỏ có cánh xuống dòng nước; các hình giấy trôi trên mặt nước. Không chữ.

**🔍 Cần soi khi ra ảnh:** Hình trôi phải đọc ra là giấy.

**Sinh bằng:** câu @mention — chip `@Older Girl Ref Bell Hat White Dress` (asset từ C1-02), `@Young Girl Ref Flower Band Long Hair` (asset từ C1-03), `@Stream Ref Flat Stones Small Fall` (asset từ C1-05). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same two girls as in @Older Girl Ref Bell Hat White Dress and @Young Girl Ref Flower Band Long Hair, keep both faces exactly the same, seen full length standing on the flat stones at the edge of the same stream as in @Stream Ref Flat Stones Small Fall, in the same white dresses and boots, dropping a few small flat paper cut-out figures with wings into the water, where they float away on the current, the younger girl plainly shorter with her head only reaching the older girl's shoulder, no lettering, plain white background. Adult body proportions like the people in the reference drawings: adults about six and a half heads tall, heads small relative to the bodies, legs a little under half of the total height. Simple faces: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking, no shading and no modelling on the faces, drawn like the faces in the reference drawings.
```

### C1-84 · `figure` · ✅ có trên Flow

**Tên card:** Elderly Woman Speaking With Open Hands

**Lời kể (`at`):** **Elsie explained their long silence** simply.

**Ý đồ:** Hanh vi noi cua Elsie gia — dung lai cho 'all 5 were fakes'

**🖼️ Ảnh sẽ ra:** Vẽ lại Elsie lúc già (C1-68, giữ nguyên mặt) nửa người đang nói, hai bàn tay mở ra trước ngực. Mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Không thêm nét buồn/ăn năn.

**Sinh bằng:** câu @mention — chip `@Elderly Woman Ref White Curls Cardigan` (asset từ C1-68). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Elderly Woman Ref White Curls Cardigan, keep her face exactly the same, seen from the chest up talking with her mouth open and both hands open in front of her chest, in the same cardigan, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

### C1-86 · `figure` · ✅ có trên Flow

**Tên card:** Old Lady Writing A Letter At Table

**Lời kể (`at`):** Frances, **in a letter written in 1983**, said she had hated those photographs since she was 16 years old.

**Ý đồ:** Frances gia viet thu — noi dung la chu hau ky. Cap voi C1-23 (Frances be viet thu 1918)

**🖼️ Ảnh sẽ ra:** Vẽ lại Frances lúc già (C1-70, giữ nguyên mặt) nửa người ngồi bên bàn viết thư bằng bút, tờ giấy chỉ có dòng kẻ xám. Chỉ một người. Không chữ.

**🔍 Cần soi khi ra ảnh:** Đặt cạnh C1-23 (cùng tư thế viết thư) — đọc ra cùng một người qua 65 năm.

**Sinh bằng:** câu @mention — chip `@Old Lady Ref Grey Bob Green Jumper` (asset từ C1-70). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Old Lady Ref Grey Bob Green Jumper, keep her face exactly the same, seen from the chest up sitting at a table writing a letter with a pen, the paper showing only a few thin grey lines and no letters, in the same green jumper and pearls, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Skill 4b: dong dang voi C1-23 de hau ky cat canh nhau.

### C1-89 · `figure` · ✅ có trên Flow

**Tên card:** Old Lady Speaking Holding One Photograph

**Lời kể (`at`):** **Frances insisted, for the rest of her life**, that the fifth one, the sun bath, was real.

**Ý đồ:** Frances khang dinh anh thu nam la that (hanh vi noi) — dung lai cho loi ke 'wet Saturday'

**🖼️ Ảnh sẽ ra:** Vẽ lại Frances lúc già (C1-70, giữ nguyên mặt) nửa người, một tay cầm một tấm ảnh nhỏ nâu đỏ quay mặt sau ra người xem, đang nói. Mặt trung tính. Chỉ một người.

**🔍 Cần soi khi ra ảnh:** Tấm ảnh quay mặt sau — không vẽ tiên. Không thêm vẻ bướng/giận.

**Sinh bằng:** câu @mention — chip `@Old Lady Ref Grey Bob Green Jumper` (asset từ C1-70). Không đính thêm ảnh neo.

**Prompt gửi Flow:**

```text
draw the same elderly woman as in @Old Lady Ref Grey Bob Green Jumper, keep her face exactly the same, seen from the chest up holding one small sepia photograph with its plain back turned toward the viewer and talking with her mouth open, in the same green jumper and pearls, no fairies, no lettering, plain white background. Simple face: the eyes are small dots, a simple short nose, a simple mouth drawn with a single line, or a simple open shape when talking or laughing, no shading and no modelling on the face, drawn like the faces in the reference drawings. Only one person in the image.
```

**Ghi chú:** Cau ra 9: 'insisted ... was real' la loi cua Frances — khong ve tien.
