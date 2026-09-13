# r2 · Phản hồi của tác giả — SPEC v2, bản v2 của luồng này

Artifact: `image-prompts/SPEC-v2.md` → v2 (luồng chạy lại nên đếm version từ 1). `refs/A1/` giờ có **9 ảnh**
(codex 6, claude 2, gemini 1) và **24 truy vấn** đã ghi.

Nhận 8 điểm, đẩy 1 lên Tú, để mở 2 mà tôi không dám đóng.

---

## VIỆC MỌI LƯỢT PHẢI LÀM — phần của tác giả

Lượt này tôi làm hai việc: **kiểm những URL hai bạn nộp**, và **tự tìm thêm**.

### Kiểm URL — cả 3 cái Gemini nộp đều không tải được như nộp

| Gemini nộp cho | Kết quả `curl` |
| --- | --- |
| ice pick (Commons) | **404**. File `File:ICEPICK2.jpg` có thật, nhưng đường dẫn trực tiếp Gemini dựng là `4/4b`, thật là `d/db`. Commons dùng hash MD5 của tên file — không đoán được. Tôi tra API mới lấy được bản thật |
| Half Moon Hotel 1941 | `api.urbanarchive.org/items/HalfMoonHotel1941/image` → **404**; trang nguồn → **403**. Đường dẫn API tự đặt tên đúng bằng từ khoá tìm kiếm |
| mugshot Reles | tên miền `digitalcollections.lib.jjay.cuny.edu` **không phân giải được** (`000`). Tên thật là `dc.lib.jjay.cuny.edu` |

Cái thứ ba chỉ **đúng hiện vật** — số hồ sơ B62038, chính diện + nghiêng phải,
1940 — nhưng số đó đã nằm trong file vòng `r1-01` của Codex mà Gemini được bảo
phải đọc. Theo luật 2a-bis tôi **không tải lại**, chỉ ghi `alsoFoundBy` trỏ về
`05-reles-mugshot-1940-jjay__codex.jpg`.

Ice pick thì cứu được file, nhưng metadata Commons ghi **ảnh chụp 2005**, vật là
dùi đá gia dụng hiện đại — không phải "kiểu 1930-1940" như Gemini mô tả. Đã sửa
`evidenceFor` thành *hình dáng chung*.

Ba URL Codex nộp thì tải được cả ba, `FFD9` toàn vẹn.

👉 Đây đúng là lý do spec tách `foundBy` khỏi `verifiedBy`, và hôm nay nó cứu ba
lần. Người review chạy chỉ đọc nên **không tự kiểm được URL mình nộp** — cái đó
không phải lỗi của họ, nó là ràng buộc của chế độ.

### Tôi tìm thêm được: ảnh CHỤP THẬT của khách sạn

```
URL:     https://www.coneyislandhistory.org/sites/default/files/documents/302/images/7504_ca_object_representations_media_319_original.png
TRANG:   https://www.coneyislandhistory.org/collection/half-moon-hotel
CHO:     A1-11
THAY GI: Ảnh chụp thật (không tô màu), nhìn từ đường dạo bộ. Tháp gạch cao, thân
         thu nhỏ dần theo bậc; đỉnh kiểu Thuộc địa Tây Ban Nha có ô vòm cuốn,
         mái vòm khảm, chong chóng gió; viền mái lợp ngói, chóp urn ở góc; các
         hàng cửa sổ đều đặn có mái hiên vải sẫm; cánh nhà thấp hơn bên phải.
TRUY VAN: mở thẳng trang collection của Coney Island History Project
```

Bản gốc 4532×5701 PNG **12,6 MB** — quá nặng để nằm trong git cho một ảnh chỉ
để soi, nên tôi thu nhỏ còn 1400px / 280 KB và giữ URL gốc trong manifest.
Cả thư mục `refs/A1` giờ dưới 1 MB.

**Nhưng nó chụp năm 1927, không phải 1941.** Xem D02.

---

## D01 — ice pick 1930-1940 · **chốt: đã sửa**

Codex tìm ra hiện vật bảo tàng Pemberton số `021.10.55`, hồ sơ ghi khoảng thập
niên 1930-1940. Tải về, 800×533, toàn vẹn. Cán gỗ phình tròn, cổ kim loại ngắn,
thân thon đều về mũi rất nhọn.

Giữ nguyên phân biệt Codex đã đặt: hồ sơ gọi hiện vật là *scratch awl* đồng thời
dùng tên *ice pick*, nên đây là bằng chứng về **hình dáng dụng cụ cùng thời**,
không phải về loại Reles đã dùng.

## D02 — ảnh Half Moon Hotel năm 1941 · **đẩy lên Tú**

Cả ba agent đã cày. **Đây không còn là bài toán tìm kiếm, mà là bức tường trả
tiền.**

- Getty có **đúng tấm cần**: hồ sơ `2265487109`, chú thích ghi ngày **12-11-1941**
  (đúng ngày Reles chết), cảnh ngoại thất. Truy cập thì trả về **trang đăng
  nhập**, không phải ảnh.
- Kansas City Star ảnh `173428` (Reles ra toà 1940): **HTTP 403**.
- WNYC có ảnh thật nhưng chỉ **221×268**, và không xác định được năm.
- `api.urbanarchive.org` của Gemini: 404.

Cái tôi mang về được là ảnh **1927** — chụp thật, nét, độ phân giải rất cao.
Công trình khánh thành 1927 và không đổi hình khối tới 1941, nên **để vẽ thì nó
đủ và tốt hơn hẳn** bưu thiếp tô màu đang có.

**Cần Tú quyết:** chấp nhận ảnh 1927 làm căn cứ vẽ, hay bỏ tiền mua giấy phép
Getty cho đúng tấm 12-11-1941. Ba agent không quyết thay được — đây là quyết
định chi tiền.

Khuyến nghị của tôi: **dùng ảnh 1927**. Ảnh Getty chỉ hơn ở chỗ đúng ngày, mà
"đúng ngày" không đổi lấy được nét vẽ nào khác trên một bức vẽ chuột cố tình
vụng.

## D03 — góc thứ hai của Reles · **chốt: đã sửa**

Codex tìm ra mugshot John Jay College `B62038`, danh mục ghi 2-2-1940, placard
trong ảnh ghi `29 40`. Bảng hai ô: nghiêng và chính diện, **cùng một lần chụp
nên cùng ánh sáng** — tốt hơn hẳn hai ảnh báo chí đang có.

Đã sửa `draw` của A1-01 theo nó. Góc nghiêng cho thấy những thứ ảnh chính diện
giấu mất: hàm dưới nặng và bạnh, sống mũi thẳng với chóp hơi gập xuống, chân tóc
lùi ở hai bên thái dương. Mô tả cũ của tôi (viết từ ảnh báo chí) thiếu cả ba.

Cũng ghi rõ trong manifest: ảnh `04` tôi tìm ở Commons **không phải góc thứ ba**
— nó cùng một buổi chụp với ảnh `01` của LOC.

## D06 — tên ảnh đầu ra trùng tên asset tham chiếu · **chốt: đã sửa**

Nhận, và đây là điểm sắc nhất của cả vòng. Tôi đọc lại code để xác minh:

```ts
if (await assetAlreadyExists(page, name, projectUrl)) { ...; return; }   // imageAsset.ts:470
```

`return` này đứng **trước** cả bước tạo ảnh lẫn bước đính reference. Nên nếu
A1-13 lấy tên đầu ra bằng chính tên asset nó đang tham chiếu, Flow thấy tên tồn
tại rồi và **bỏ qua cả shot** — trong khi runner chạy trót lọt và báo thành
công. **Mất trắng một cảnh, không một dòng lỗi.** Đúng loại lỗi im lặng mà cả
RUNBOOK lẫn luồng trước đã tốn nhiều giờ mới tìm ra.

Thêm mục 5a-bis: mỗi shot có `outName` riêng, và quy ước đặt tên để hai thứ
không đụng nhau — asset dùng lại mang hậu tố `Ref`
(`Reles Ref Broad Face Wavy Hair`), ảnh đầu ra tả chính cảnh đó
(`Same Man Lying Face Down`). Shot có `produces` là ngoại lệ duy nhất được trùng,
vì nó chính là cái tạo ra asset.

## D07 — `at` lệch khỏi `cue` · **chốt: đã sửa**

Nhận. Codex đối chiếu với bản `.en-orig.vtt` có **thời gian từng chữ**: `guarded`
bắt đầu ở `0:36.960` còn tôi ghi `0:46`; `found` ở `0:44.080` còn tôi ghi
`0:50`. Lệch 9 và 6 giây — gấp hai tới ba lần mức ±3 giây mà chính spec cam kết.
Dựng theo thì hình người gác hiện lên lúc lời đã chuyển sang phát hiện thi thể.

Sửa cả hai mốc, và **bỏ luôn cách gõ tay**: mục 5b-bis chốt `at` do
`build_image_prompts.py` suy ra từ thời gian chữ đầu của `cue`. Bộ kiểm cũ
("cue có nằm trong segment không") vẫn cho cả hai mốc sai đó đi qua — nên nó
không đủ, phải đối chiếu tới mức thời gian chữ.

## D08 — A1-03 thiếu `refs` · **chốt: đã sửa**

Nhận. Giờ trỏ tới `07-ice-pick-awl-1930s-pemberton__codex.jpg`, và `draw` tả
theo đúng hiện vật đó. Bảng trường cũng ghi rõ `refs` là **bắt buộc** với
`character`, và với `object`/`place` thuộc thời kỳ cụ thể.

## D09 — `useAsset` phải là mảng · **chốt: đã sửa**

Nhận. `createImageIngredient` vốn đã nhận `reference: string[]`, nên giới hạn
một chuỗi là do spec tự đặt ra chứ không do code. Ca cần tới nó có thật ngay
trong video A: đoạn A6 kể Strauss là một trong những người Reles chuẩn bị ra làm
chứng chống lại — hai nhân vật có thật trong cùng một ý.

## D10 — `notContributed` ghi sai về Gemini · **chốt: đã sửa**

Nhận, và Gemini đúng một nửa: nó **có** đóng góp ở lượt này, **không** có ở lượt
trước. Kết luận chung cho cả hai lần là sai.

Đã đổi thành `contributionLog` tách theo từng lần chạy, kèm nguyên nhân đã đo
được của lần trượt đầu: **không phải thiếu quyền** — `search_web` của `agy` chạy
tốt, 25,8 giây — mà do prompt lượt review không hề giao việc tìm kiếm.

---

## Hai điểm tôi để MỞ vì không dám đóng

### D04 — chưa chuyển dòng nào sang JSON

Chưa làm, và tôi cố ý chưa làm: spec vừa thêm `outName` cho **mọi** shot và đổi
`useAsset` thành mảng. Chuyển 385 dòng trước khi spec đứng yên là chuyển hai
lần. Nhưng phải nói thẳng hệ quả: **chưa ai biết trong 385 dòng có bao nhiêu
`cue` không trích nguyên văn được** — và cue là thứ neo toàn bộ hệ thống.

### D05 — cơ chế dùng lại asset nhân vật chưa chạy thử lần nào

Vẫn đúng nguyên văn như hai vòng trước. Đây là **rủi ro lớn nhất còn lại**, và
D06 vừa cho thấy vì sao: đường lỗi đó chỉ lộ ra khi đọc kỹ code, còn chạy thì nó
im lặng báo thành công. Còn bao nhiêu cái bẫy cùng loại thì chưa biết.

Muốn đóng nó phải: sửa `try-image-prompts.ts` đọc `useAsset` và `outName` → tạo
asset Reles từ mô tả rút ra từ mugshot → đính lại cho một cảnh thứ hai → mở ảnh
ra xem có đúng người không.

---

## Tôi đã không kiểm cái gì

- **Chưa chạy thử một prompt nào của spec v3.** Mô tả nhân vật rút từ mugshot là
  tôi nhìn ảnh mà viết, chưa ai thử xem nó ra đúng người không.
- **Chưa đo lại chữ rác với khối style v2** (đã bỏ câu cuối). Mẻ cũ 4/8 dính
  chữ, nhưng đó là style v1.
- **Chưa xác minh hình khối Half Moon Hotel giữa 1927 và 1941 có thật sự không
  đổi không** — tôi suy từ việc toà nhà khánh thành 1927, không phải từ tư liệu
  đối chiếu hai mốc.
- **Chưa kiểm 6 ảnh còn lại của A1** có ảnh nào là bản chụp lại của ảnh khác
  không, ngoài cặp `01`/`04` đã phát hiện.
- **Không kiểm bản quyền.** Ảnh trong `refs/` chỉ để soi.

```points
D01 | chốt: đã sửa | image-prompts/refs/A1/07-ice-pick-awl-1930s-pemberton__codex.jpg | Hien vat bao tang Pemberton 021.10.55, ho so ghi 1930-1940
D02 | đẩy lên Tú | image-prompts/refs/A1/manifest.json | Anh 1941 nam sau tuong tra tien cua Getty; da co anh chup that 1927 du de ve
D03 | chốt: đã sửa | image-prompts/refs/A1/05-reles-mugshot-1940-jjay__codex.jpg | Mugshot B62038 cho ca nghieng lan chinh dien cung mot lan chup
D04 | mở | image-prompts/SPEC-v2.md | Chua chuyen 385 dong sang JSON — co y cho spec dung yen truoc
D05 | mở | scripts/try-image-prompts.ts | Co che dung lai asset nhan vat van chua chay thu lan nao
D06 | chốt: đã sửa | image-prompts/SPEC-v2.md | Them outName rieng cho moi shot; quy uoc hau to Ref cho asset dung lai
D07 | chốt: đã sửa | image-prompts/SPEC-v2.md | Sua hai moc sai, va cho may suy at tu thoi gian chu cua cue
D08 | chốt: đã sửa | image-prompts/SPEC-v2.md | A1-03 co refs tro toi hien vat Pemberton
D09 | chốt: đã sửa | image-prompts/SPEC-v2.md | useAsset thanh mang
D10 | chốt: đã sửa | image-prompts/refs/A1/manifest.json | Doi thanh contributionLog tach theo tung lan chay
```
