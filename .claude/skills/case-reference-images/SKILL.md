---
name: case-reference-images
description: Gather real-photo reference material for one case of a narration-script episode BEFORE any image prompt is written — search, download into narration-scripts/<tập>/refs/case-N/, and write the manifest README. Use when starting a new case, when a prompt needs period-accurate clothing/architecture/objects, when looking for photos of the real people or real places behind a true story, or when an existing case's reference folder needs extending. Sister skill of nano-banana-image-prompts, which covers what to WRITE once the references are in hand.
---

# Gom ảnh tư liệu cho 1 case

Bước **bắt buộc, làm TRƯỚC khi viết một dòng prompt nào** — là bước 4 trong quy
trình chuẩn của skill `nano-banana-image-prompts` (mục 3). Skill này là toàn bộ
chi tiết của riêng bước đó.

**Vì sao tồn tại**: mọi case đều có bối cảnh/trang phục/đồ vật thuộc một thời kỳ
và một vùng cụ thể (Ohio 1921, West Virginia 1896, Vân Lâm 1959...). Viết prompt
từ trí nhớ thì ra thứ chung chung "kiểu phương Tây", sai niên đại — và chỉ lộ ra
sau khi đã tạo xong cả mẻ ảnh, lúc sửa đã đắt.

> **Bằng chứng** (case 5, 2026-08-15): ảnh chân dung thật của hai vợ chồng cho ra
> *"chồng tóc chải ngược hẳn ra sau để lộ trán cao, vợ tóc ngắn gợn tới quai hàm
> rẽ ngôi lệch"*. Viết chay thì đã cho anh chồng tóc rẽ ngôi thường và bà vợ búi
> tóc — sai hẳn thời kỳ.

## 1. Thứ tự — gom ảnh SAU khi kiểm kê asset

1. Đọc trọn đoạn kịch bản của case.
2. Phân shot → kiểm kê: case này cần Character/Background/Prop nào.
3. **→ Skill này**: từ bảng kiểm kê đó mới biết đi tìm cái gì.

Tìm trước khi kiểm kê thì thành gom ảnh vu vơ, và thiếu đúng thứ cần.

## 2. Tìm gì

Chia theo nhóm, mỗi nhóm ứng với một hoặc vài asset:

| Nhóm | Ví dụ |
|---|---|
| **Nhân vật CÓ THẬT** | ảnh chân dung, ảnh báo chí, ảnh thờ — **ưu tiên số 1**, xem mục 4. Case trước thời nhiếp ảnh, hoặc không có chân dung nào → **mục 4c** |
| Kiến trúc | nhà ở theo vùng/thời kỳ, nội thất, công trình công cộng |
| Trang phục theo thời kỳ | thường phục nông thôn, đồng phục, tang phục |
| Phương tiện & đồ vật | xe đạp, thuyền, nông cụ, đồ thờ |
| Địa danh có thật | đảo, làng, bờ biển, nghĩa trang |

## 3. Nguồn

**Bắt đầu từ Wikimedia Commons** — giấy phép tra được rõ, và tải được bằng API
kèm sẵn license/tác giả. Truy vấn dùng thẳng được:

```
https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=<TỪ+KHOÁ>&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url%7Cextmetadata&iiextmetadatafilter=LicenseShortName%7CArtist&format=json
```

**Nhưng KHÔNG giới hạn ở Commons, và KHÔNG lọc theo giấy phép.** Người dùng chốt
2026-08-15: *"cứ tìm tất cả những ảnh liên quan, dính bản quyền cũng được, tôi
chỉ xem hình tham khảo thôi"* — và sau đó: *"không cần giấy phép đâu, cứ có hình
ảnh nào là tải về hết"*.

👉 **Không tra giấy phép, không ghi cột giấy phép vào manifest, không bỏ ảnh vì
license.** Ảnh chỉ để SOI rồi vẽ lại bằng tay, không phát tán, nên khâu đó là
công vô ích. Càng nhiều góc/biến thể càng tốt: báo chí, blog, bảo tàng số, diễn
đàn, ảnh du lịch — lấy hết. Với vụ án có thật thì **báo bản ngữ mới là nơi có ảnh
nhân vật**.

⚠️ Ngoại lệ DUY NHẤT còn phải cân nhắc giấy phép: khi định **chèn thẳng ảnh chụp
thật vào video** làm establishing shot (kênh có bật kiếm tiền → ảnh không rõ
nguồn có thể bị đánh gậy bản quyền). Đó là quyết định lúc dựng, không phải việc
của bước gom tư liệu này.

## 4. 🔑 Vụ án có thật: TRA BẰNG TÊN GỐC BẢN NGỮ

Kịch bản viết cho khán giả Mỹ nên tên đã bị phiên âm và niên đại bị làm tròn.
Tra tên phiên âm gần như không ra gì.

- `"Chu Xiu-hua Taiwan reincarnation"` → lèo tèo, không ảnh.
- `朱秀華 借屍還魂` → Wikipedia + báo lớn + kho ký ức văn hoá quốc gia, **kèm ảnh
  chân dung thật của hai nhân vật chính**.

Áp dụng chung cho tên Hán, Nhật, Nga, và mọi địa danh bản ngữ.

Tra bản ngữ còn lòi ra những chỗ **kịch bản ghi mờ hoặc ghi lệch** — case 5: kịch
bản ghi "thập niên 1950", sự thật là **1959**; tên người chồng cũng khác. Không
tự sửa kịch bản (việc của người dùng), nhưng **mô tả ảnh thì bám sự thật** và ghi
chênh lệch vào manifest.

⚠️ Ảnh nhân vật thật chỉ để **soi bằng mắt rồi viết ra mô tả chữ** — KHÔNG đính
làm ảnh reference thứ 2 (pipeline chỉ đính `reference-character.jpeg`). Ghi thẳng
vào manifest những chi tiết đã trích ra (tóc, râu, kiểu áo), để lần sau sửa
Character không phải mở lại ảnh.

## 4b. 🔴 TRA KHÔNG RA ≠ VỤ KHÔNG CÓ THẬT — bốn cách gỡ, theo thứ tự

**Ca thật, case 1 (A Fei), 2026-08-31.** Tra hụt **hai lần** rồi ghi thẳng vào
manifest *"không nguồn chính thống nào có vụ này"*. **Kết luận đó SAI.** Vụ này
được **澎湃新闻 (The Paper)** và **Sina Đài Châu** đưa tin, có ảnh hiện trường,
tìm ra trong đúng 1 truy vấn khi làm đúng cách. Mọi tên riêng trong kịch bản đều
CÓ THẬT: 龙王村 (Long Wang village), 十八潭 ("18 Lakes"), 阿飞 (A Fei), 39 tuổi,
mất tích 17 ngày.

👉 **Luật**: chỉ được viết "không xác minh được" sau khi đã đi hết 4 bước dưới
đây. Viết sớm là bịt đường của chính phiên sau — và nó đã bịt thật, phiên sau đọc
manifest rồi tin luôn.

### (1) Tra theo GÓC KỂ CỦA NGUỒN, không phải góc kể của kịch bản

Sai lầm nặng nhất. Kịch bản kênh này là **truyện tâm linh**, nên tôi ghép từ khoá
tâm linh: `灵异`, `鬼打墙` (ma dẫn lối), `监控显示独自一人 说话`. Trượt sạch.

Báo địa phương viết vụ này là **tin cứu hộ tìm người mất tích** — tiêu đề thật:
*"女子离奇失踪，警民联手数百人上山寻找！17天后…"*. Không một chữ tâm linh nào.

👉 Tra bằng **từ vựng của bản tin**, không phải từ vựng của kịch bản:
`失联 / 走失 / 搜救 / 找到 / 平安归来` + địa danh + số ngày. Chi tiết rùng rợn
thường nằm ở **đoạn giữa bài**, không nằm ở tiêu đề — nên đừng dùng nó làm từ khoá.

### (2) Thử BIẾN THỂ CHÍNH TẢ của tên

Phiên âm sang tiếng Anh làm mất chữ gốc. "A Fei" có thể là `阿菲` hoặc `阿飞` —
tôi tra `阿菲`, tên thật là **`阿飞`**. Một chữ sai là trượt hết.

👉 Với tên Hán/Nhật/Hàn phiên âm, **liệt kê 2-3 biến thể đồng âm rồi tra lần
lượt**. Tương tự: dịch nghĩa địa danh cũng lệch — *"18 Lakes"* thật ra là
**十八潭** (mười tám cái *vũng/đầm*), không phải hồ.

### (3) 🔑 TÌM MỘT NEO CÓ THẬT TRONG ẢNH — cách đã mở khoá được ca này

Khi tên trong kịch bản không ra gì, **đừng tra tiếp bằng tên đó**. Nhìn sang bất
kỳ ảnh nào đang có (người dùng gửi, ảnh chụp màn hình video nguồn) và **đọc chữ
trong ảnh**:

- chữ trên **đồng phục / áo phản quang** → ra đơn vị, ra địa phương
- **biển hiệu, bảng trực ban, băng rôn, cờ cảm tạ** → ra cơ quan, ra ngày tháng
- **biển số xe, số hiệu tàu, logo đài truyền hình**

Ca thật: ảnh người dùng gửi có chữ **`杜桥义警`** trên áo phản quang và
**`2020年03月09日`** trên bảng trực ban. Từ đó ra `临海市杜桥镇` (Chiết Giang), và
truy vấn `临海 杜桥 女子 失联 17天 山上 找到 生还 2020年3月` **ra ngay bài gốc**.

👉 Neo địa danh + neo thời gian mạnh hơn hẳn tên người, vì báo địa phương luôn ghi
đủ hai thứ đó, còn tên nạn nhân thì hay viết tắt hoặc giấu.

### (4) Hỏi thẳng người dùng NGUỒN của kịch bản

Kịch bản kênh này thường lấy từ **video tổng hợp** (YouTube/TikTok/Douyin). Kênh
đó đã tìm được ảnh rồi — nghĩa là **có đường đi, chỉ là ta chưa tìm ra**. Hỏi link
video nguồn rẻ hơn nhiều so với tra mò thêm 5 vòng.

⚠️ Nhưng vẫn phải **kiểm chéo**: ảnh trên kênh tổng hợp có thể là ảnh minh hoạ lấy
từ chỗ khác. Chỉ tin sau khi truy được về bài báo gốc.

### 📌 Ghi vào manifest thế nào cho đúng

Nếu cuối cùng vẫn không ra: ghi **đã tra những truy vấn NÀO** (liệt kê nguyên văn)
chứ đừng chỉ ghi "không tìm thấy" — để phiên sau biết chỗ nào đã cày rồi. Và ghi
kèm câu *"chưa đi hết mục 4b"* nếu còn bước nào chưa thử.

Nếu sau đó tìm ra: **sửa lại manifest thành ĐÍNH CHÍNH tường minh**, đừng lặng lẽ
xoá dòng cũ — người đọc cần biết kết luận trước đã sai để không tin nhầm bản ghi
tương tự ở case khác.

### 🔴 Ảnh thật ra rồi thì PHẢI SOI LẠI BACKGROUND ĐÃ VẼ

Tìm ra tư liệu muộn nghĩa là phần ảnh đã vẽ theo phỏng đoán. Ca thật: *"18 Lakes"*
khiến background vẽ **mấy cái hồ giữa đồi sương mù**, trong khi 十八潭 thật là
**một dòng suối núi trong khe rừng** — vũng nước nối nhau bằng thác nhỏ, hai bên
vách đá, có bậc đá đi bộ. Sai hẳn địa hình.

👉 Có ảnh thật rồi thì **đối chiếu từng background một** với ảnh, và ghi vào
manifest cái nào sai + sai ở đâu, kể cả khi chưa sửa ngay.

## 4c. 🔴 NHÂN VẬT KHÔNG CÓ ẢNH CHỤP — dùng TRANH VẼ, và CẤM ảnh diễn viên

Kênh này sẽ còn gặp nhiều case trước thời nhiếp ảnh (Roanoke 1587, Franklin 1845,
Flannan Isle 1900...). Mục 4 dạy tra ảnh nhân vật thật; mục này là việc phải làm
khi **ảnh thật không tồn tại**.

### (1) XÁC MINH là không có, rồi GHI LẠI

Đừng im lặng bỏ qua. Tra thẳng *"<tên> portrait known likeness exists"* rồi ghi
kết quả vào manifest kèm nguồn.

Ca thật (case Roanoke, 2026-08-31): **John White không có chân dung nào** — nghịch
lý là chính ông là hoạ sĩ của đoàn, vẽ hàng chục bức về người Algonquian nhưng
không vẽ mình, và không ai cùng thời vẽ ông. Ta có tranh ông VẼ, không có tranh vẽ
ÔNG. Eleanor Dare, Virginia Dare cũng vậy.

Không ghi ra thì phiên sau lại đi tra vòng nữa — đúng lỗi đã mắc ở mục 4b, chỉ
ngược chiều.

### (2) Người dùng chốt: KHÔNG có ảnh thật thì lấy ẢNH VẼ LẠI

*"nếu không có ảnh người thật thì kiếm ảnh vẽ lại cũng được"* (2026-08-31). Nguồn
tốt, theo thứ tự:

- **Bản khắc / minh hoạ sách thế kỷ 19-20** — loại nhiều nhất, dễ tìm trên
  Commons qua tên sách: `Stories of American explorers`, `Stories of the three
  Americas`, tra kèm tên sự kiện.
- **Tranh sơn dầu / bản khắc cùng thời** nếu có.
- **Tượng đài, tem thư, mặt đồng xu kỷ niệm** — cũng là hình dung tạo hình.
- **Bản dựng lại của hoạ sĩ** cho công trình/địa điểm (`artist's reconstruction`).

### (3) 🔴 CẤM TUYỆT ĐỐI: ảnh DIỄN VIÊN HOÁ TRANG / tái hiện lịch sử

**Người dùng chốt thẳng: *"chỉ lấy ảnh vẽ lại chứ không lấy ảnh diễn viên hóa
trang"*.**

Lý do: diễn viên là **diện mạo của một người thật đang sống**, không liên quan gì
tới câu chuyện. Lấy làm mẫu tạo hình nghĩa là ta đang vẽ lại người đó. Bản khắc
thì khác — nó là hình dung tập thể về nhân vật lịch sử, không gắn với ai cụ thể.

⚠️ Loại này **rất dễ lọt** vì nằm lẫn trong kết quả tìm địa danh. Đã lọt 4 ảnh ở
case Roanoke: biển thuyết minh và nhà hát ngoài trời ở khu di tích, cộng **một bưu
thiếp VẼ LẠI cảnh sân khấu** — vẽ thì có vẽ thật, nhưng vẫn là diễn viên hoá
trang. Dấu hiệu nhận biết trong tiêu đề file: `Lost Colony`, `outdoor drama`,
`historical drama`, `reenactment`, `living history`, `festival park`,
`Waterside Theatre`, tên đoàn kịch.

👉 Rà lại tiêu đề file trước khi ghi vào manifest, đừng chỉ nhìn ảnh — một số ảnh
sân khấu nhìn y như tranh lịch sử.

### (4) 🔑 Viết mô tả theo CHỖ HỘI TỤ của nhiều hoạ sĩ, không theo một bản

Mỗi bản vẽ là tưởng tượng riêng của một hoạ sĩ, chép nguyên một bản là chép luôn
cái tuỳ tiện của người đó. Gom **3-4 bản của các hoạ sĩ khác nhau, cách xa nhau về
thời gian**, rồi lấy phần trùng nhau.

Ca thật: bốn bản vẽ cảnh phát hiện chữ CROATOAN (1890, 1906, 1979, cộng bản
Sheppard) hội tụ ở — **đàn ông có râu, mũ có chóp, áo doublet cổ dựng, tay giơ về
phía chữ khắc**. Mô tả `Governor John White` viết theo đúng chỗ hội tụ đó. Với
người không ai biết mặt thì đây là căn cứ vững nhất có thể có.

Chi tiết nào chỉ xuất hiện ở MỘT bản thì bỏ (bản 1890 có con chó và khẩu súng
hoả mai — không đưa vào).

### (5) Ghi vào manifest 2 điều, không được thiếu

1. **Nhân vật này là HƯ CẤU CÓ CƠ SỞ**, mô tả dựa trên bản vẽ nào, ra đời cách sự
   kiện bao lâu. Kèm khuyến cáo: dùng được cho kênh kể chuyện, nhưng **đừng ghi
   trong video rằng đây là chân dung nhân vật**.
2. **Chỗ ta CỐ Ý vẽ khác sự thật khảo cổ**, kèm lý do. Ca thật: công trình thật ở
   Roanoke là **luỹ đất hình sao có hào**, nhưng background vẫn vẽ **hàng rào cọc
   gỗ** — vì kịch bản nói *"carved into a post of the FENCE"* (không có hàng rào
   thì không khắc được), và vì luỹ đất thấp trong phong cách phẳng không đọc ra là
   công sự. Ghi ra để phiên sau biết đó là lựa chọn, không phải sai sót.

⚠️ Các bản vẽ cũng **mâu thuẫn nhau**, phải chọn có ý thức: bản 1890 khắc chữ lên
**thân cây**, bản Sheppard khắc lên **cột hàng rào**. Chọn theo KỊCH BẢN, rồi ghi
lại đã chọn gì.

## 5. Mẹo tìm trên Commons (đúc kết, đừng mò lại)

- Tìm bằng từ CHUNG kiểu `"mountain lake China"` ra **toàn tranh thuỷ mặc cổ** —
  Commons chứa rất nhiều tư liệu bảo tàng số hoá.
- 👉 Nhắm **tên địa danh/sự vật có thật** (chỗ khách du lịch chụp nhiều), thêm
  loại trừ `-painting -scroll`, giữ cụm tìm **NGẮN 2-3 từ** — search là AND trên
  mọi từ nên cụm dài ra 0-1 kết quả. Cụm dài còn hay ra **toàn PDF**.
- Trang phục/đồ vật theo thời kỳ: nhắm **tên định danh lịch sử**
  (`Qing dynasty farmer clothing`, `1920s Ohio farmhouse`) thay vì mô tả.
- Ảnh tư liệu cũ thường nằm trong **category**, không nằm trong search —
  `Category:Historical images of women of Taiwan` cho ra cả loạt ảnh Public domain
  đúng thời kỳ mà search thường không thấy.

## 5b. ⚠️ Bẫy `?utm_source=` khi tải theo API

URL ảnh Commons trả về từ API giờ **có kèm query string**:
`https://upload.wikimedia.org/.../Foo.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo...`

Nên mọi phép kiểm đuôi file kiểu `url.endsWith(".jpg")` hoặc regex `/\.jpg$/`
đều **trượt sạch** — script chạy xong báo "✅ thành công, 0 ảnh" cho MỌI nhóm,
trông y hệt như Commons không có tư liệu. Đã mất 1 vòng chẩn đoán vì việc này.

👉 Luôn cắt query string trước khi kiểm và trước khi đặt tên file:

```js
const url = raw.split("?")[0];
if (!/\.(jpe?g|png)$/i.test(url)) continue;
```

## 6. Tải về

Thư mục: **`narration-scripts/<tập>/refs/case-N/`** — mỗi case một thư mục riêng.
Đặt tên `NN-<nhóm>-NN.jpg`. Số thứ tự nhóm **KHÔNG reset giữa các case** (case 1
giữ `01-05`, case 5 dùng `06-19`) — đọc tên file là biết ngay thuộc case nào kể
cả khi bị copy ra ngoài thư mục.

Viết script Node tải tuần tự, **có `User-Agent` thật** (Wikimedia chặn UA rỗng),
nghỉ ~300ms giữa các file, bỏ qua file đã tồn tại để chạy lại được:

```js
const res = await fetch(url, { headers: { "User-Agent": UA } });
```

⚠️ Ảnh trên **trang báo** thường chặn hotlink — phải thêm `Referer` là chính URL
bài viết thì mới tải được:

```js
const res = await fetch(url, { headers: { "User-Agent": UA, Referer: articleUrl } });
```

⚠️ Nhiều trang lazy-load: `img src` lấy về là ảnh placeholder (`default800.jpg`,
`spacer.gif`). Thấy tên kiểu đó thì bỏ, đừng tải.

## 7. Manifest — `refs/case-N/README.md`

Giữ NGẮN — manifest là để tra lại, không phải để làm sổ sách. Bắt buộc có:
1. Bảng **nhóm ảnh ↔ asset** (prefix → dùng cho background/prop nào → số ảnh).
2. **URL nguồn theo NHÓM** (một dòng cho cả nhóm là đủ), để tải lại được khi
   cần. KHÔNG ghi giấy phép, KHÔNG ghi tác giả — xem mục 3.
3. 🔴 **Ghi rõ những thứ TÌM KHÔNG RA**, kèm nhóm ảnh dùng thay thế. Không ghi
   thì lần sau có người tưởng là sót và đi tìm lại từ đầu. Ví dụ case 5: không có
   ảnh bệnh viện quân y thập niên 1950 → dùng bệnh viện dân sự thời Nhật thuộc;
   không có ảnh thuyền tị nạn Kim Môn 1958 → dùng nhóm thuyền gỗ nhỏ.
   ⚠️ **Phân biệt "không tìm ra MỘT LOẠI ẢNH" với "không xác minh được VỤ ÁN".**
   Cái thứ nhất ghi thoải mái. Cái thứ hai là kết luận NẶNG, chỉ được viết sau khi
   đã đi hết mục 4b — viết ẩu thì phiên sau đọc rồi tin luôn, không tra lại nữa
   (đã xảy ra thật với case 1).
4. Với nhóm ảnh nhân vật thật: **chi tiết đã trích ra** để viết Character. Đây là
   phần GIÁ TRỊ NHẤT của manifest — nó tiết kiệm cả vòng mở lại ảnh về sau.

Thêm 1 dòng vào bảng mục lục ở `refs/README.md`.

## 8. Git

File ảnh nằm trong `.gitignore`:

```
narration-scripts/*/refs/**/*.jpg
narration-scripts/*/refs/**/*.jpeg
narration-scripts/*/refs/**/*.png
narration-scripts/*/refs/**/*.webp
```

⚠️ **Nhớ `**`** — ảnh nằm trong thư mục con theo case, pattern `refs/*.jpg` cũ
KHÔNG khớp và sẽ commit nhầm cả trăm MB ảnh vào repo. Kiểm bằng:

```bash
git check-ignore -v narration-scripts/<tập>/refs/case-N/<file>.jpg
```

**Chỉ commit các `README.md`** — manifest giữ đủ URL để tải lại bất cứ lúc nào.

## 9. Soi ảnh trước khi viết prompt

Tải xong **chưa phải là xong**. Phải mở vài ảnh chủ chốt ra xem thật (công cụ đọc
file hiển thị được ảnh), rồi mới viết `description`. Ưu tiên soi: ảnh nhân vật
thật, ảnh kiến trúc chính, ảnh đồ vật là chi tiết chốt của case.

Tả lại bằng **thứ đo được** — bao nhiêu mảng, mảng nào chiếm mấy phần khung,
đường nào ngang đường nào chéo — không tả bằng tính từ. Cách viết `description`
từ đó trở đi thuộc skill `nano-banana-image-prompts`.
