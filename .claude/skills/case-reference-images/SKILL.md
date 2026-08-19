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
| **Nhân vật CÓ THẬT** | ảnh chân dung, ảnh báo chí, ảnh thờ — **ưu tiên số 1**, xem mục 4 |
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
