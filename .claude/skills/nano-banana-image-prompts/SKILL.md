---
name: nano-banana-image-prompts
description: Write the image prompts and the assets.json / scenes.json entries that drive the illustration pipeline (Google Flow "Image" mode, a.k.a. Nano Banana) for the true-story compilation YouTube channel. Use when breaking a narration passage into shots, creating Character/Background/Prop assets for a case, composing final frames from existing assets, revising an asset that came out wrong, or recovering from a blocked/timed-out generation. Covers authoring decisions only — the English style-block text itself lives in src/nanoBanana/styleDNA.ts.
---

# Viết prompt ảnh cho pipeline Nano Banana

Skill này ghi lại **cách QUYẾT ĐỊNH viết gì** khi soạn `assets.json` /
`scenes.json` cho 1 tập trong `narration-scripts/`. Nó KHÔNG chứa nội dung các
style block — xem mục 0.

## 0. Nguồn sự thật — đọc trước khi viết

| Cần gì | Đọc ở đâu |
|---|---|
| **Nội dung** các style block (chuỗi tiếng Anh thật) | `src/nanoBanana/styleDNA.ts` |
| Cách runner ghép block vào prompt | `buildPrompt()` trong `src/nanoBanana/createImageAssets.ts` |
| Schema đầy đủ từng field | `src/nanoBanana/assets.ts`, `src/nanoBanana/scenes.ts` |
| Bug/hành vi ngầm của UI Flow | `RUNBOOK.md` mục 8.1 — **chỉ cần khi sửa `src/`**, không cần khi viết prompt |

> ⚠️ **TUYỆT ĐỐI không chép nội dung block vào skill này hay vào RUNBOOK.**
> Việc đó đã hỏng 1 lần: mô tả `MASTER_REFERENCE_NOTE` chép sang RUNBOOK bị sai
> sau khi người dùng thay `reference-character.jpeg`, tới mức RUNBOOK 8.1.3j
> phải ghi *"đừng tin mô tả chép lại ở RUNBOOK"*. Luôn đọc thẳng `styleDNA.ts`.

Runner tự ghép block theo `type` + `composition` + `reserveCharacterSpace` —
**không viết tay style block vào `description`**, sẽ bị lặp và mâu thuẫn.

## 1. Ảnh này để LÀM GÌ — quyết định mọi ưu tiên còn lại

Ảnh sinh ra **không phải sản phẩm cuối**. Người dùng **vẽ đồ lại bằng tay** rồi
tự chỉnh (xác nhận 2026-08-10). Ảnh AI đóng vai **bản nháp bố cục**: để xem
*nhân vật/vật thể đặt vào cảnh với kích cỡ và vị trí thế nào cho hợp lý*.

Hệ quả khi viết prompt:

- **Tiêu chí số 1**: đúng TỈ LỆ nhân vật so với bối cảnh, đúng VỊ TRÍ đứng,
  đúng GÓC MÁY. Sai mấy cái này thì ảnh vô dụng.
- **Không tối ưu cho "đẹp"**: chi tiết tinh xảo là gánh nặng, vì phải đồ lại
  bằng tay. Đây chính là lý do `SIMPLIFY_DETAIL_BLOCK` và
  `HAND_DRAWN_LINE_BLOCK` tồn tại.
- Phân vân giữa "ảnh đẹp hơn" và "bố cục/tỉ lệ đọc rõ hơn" → **luôn chọn cái
  sau**.

## 1b. Bố cục thư mục: MỖI CASE MỘT THƯ MỤC, MỘT PROJECT FLOW

```
narration-scripts/<tập>/
  en.md                  ← kịch bản cả tập
  refs/case-1/  case-5/  ← ảnh tham khảo, MỖI CASE MỘT THƯ MỤC + README manifest
                            (ảnh gitignore, chỉ commit README — xem refs/README.md)
  case-1/assets.json  scenes.json
  case-2/assets.json  scenes.json
  ...
```

Mỗi cặp file khai báo thêm **`flowProject`** ở cấp cao nhất — khoá project Flow
riêng cho case đó:

```json
{ "episode": "...", "flowProject": "ten-tap-case-3", "assets": [ ... ] }
```

🔑 **Vì sao tách project**: đã đo trực tiếp (`scripts/check-asset-scope.ts`) —
**asset trong Flow thuộc RIÊNG từng project**, mở project trống thì không tra
được asset của project cũ. Nên mỗi case 1 project = ô "Search assets" chỉ chứa
asset của case đó, **triệt tiêu tận gốc lớp lỗi trùng tên/khớp nhầm ở mục 11c**
vốn nảy sinh khi một project ôm cả trăm ảnh.

⚠️ **`flowProject` phải GIỐNG NHAU giữa `assets.json` và `scenes.json` của cùng
case.** Lệch khoá thì asset nằm project này mà cảnh đi tìm ở project kia — hỏng
âm thầm, cực khó lần ra. Đó cũng là lý do khoá nằm TRONG file chứ không phải cờ
dòng lệnh.

⚠️ **Không dùng lại được asset giữa các case.** Cần nhân vật/bối cảnh giống nhau
ở 2 case thì phải tạo lại trong từng project.

*(Case 1 và 2 của tập "vu-viec-tam-linh" tạo trước quy ước này nên nằm chung 1
project và để trống `flowProject` — đừng thêm khoá vào, sẽ trỏ sang project rỗng.)*

## 2. Hai file, hai vai trò — đừng nhầm

| | `assets.json` | `scenes.json` |
|---|---|---|
| Là gì | **Nguyên liệu** tái dùng nhiều lần | **Khung hình cuối** cho 1 câu kịch bản |
| Loại | `character` / `prop` / `background` | cảnh ghép từ các asset đã có |
| Style block | Runner tự ghép từ `styleDNA.ts` | **Không cần** — ảnh reference đã neo phong cách |
| Reference | Character: tự đính `reference-character.jpeg` | Tên các asset đã `success` trong Flow |
| Runner | `npm run banana` | `npm run banana-scenes` |

Thứ tự bắt buộc: mọi asset trong `references` của 1 scene phải `status:
"success"` **trước** khi chạy scene đó.

## 3. Quy trình chuẩn cho 1 case

1. Đọc trọn đoạn kịch bản của case trong `en.md`.
2. **Phân shot** (mục 4) — ra danh sách khung hình cần vẽ.
3. Kiểm kê asset: mỗi shot cần Character nào, Background nào, Prop nào.
4. 🔴 **GOM ẢNH TƯ LIỆU cho các asset đó — BẮT BUỘC.** Dùng skill riêng
   **`case-reference-images`**. Làm TRƯỚC khi viết một dòng prompt nào.
5. Viết `assets.json` → `npm run banana -- <file> --case N`.
6. **Người dùng xem bằng mắt** trước khi đi tiếp — sai bối cảnh mà ghép cảnh
   luôn thì hỏng hàng loạt.
7. Viết `scenes.json` → `npm run banana-scenes -- <file> --case N`.

### 3b. Bước 4 (gom ảnh tư liệu) → skill RIÊNG

Toàn bộ chi tiết của bước 4 nằm ở skill **`case-reference-images`** (tách riêng
2026-08-15 theo yêu cầu người dùng: tìm tư liệu là việc khác hẳn viết prompt).
Ở đó có: tìm gì, nguồn nào, mẹo tra Commons, cách tra vụ án bằng **tên gốc bản
ngữ** để ra ảnh nhân vật thật, cách tải (User-Agent, Referer, lazy-load), quy ước
thư mục `refs/case-N/` + manifest, và pattern `.gitignore`.

Ở skill này chỉ cần nhớ 2 điều:
- **Không viết prompt từ trí nhớ.** Mọi case đều thuộc một thời kỳ và một vùng cụ
  thể; viết chay ra thứ chung chung, sai niên đại, và chỉ lộ khi đã tạo xong cả mẻ.
- **Soi ảnh bằng mắt rồi mới viết `description`**, tả lại bằng chữ đo được. KHÔNG
  đính ảnh vào prompt — pipeline chỉ đính `reference-character.jpeg` cho
  Character; Background/Prop không đính gì (xem mục 5).

## 4. PHÂN SHOT — luật quan trọng nhất

**1 câu kịch bản ≠ 1 ảnh.** Câu văn có thể chứa nhiều khoảnh khắc khác nhau về
VỊ TRÍ KHÔNG GIAN, gộp vào 1 ảnh là mất nhịp kể.

👉 **Dấu hiệu bắt buộc tách shot** — câu chứa động từ ĐỔI KHOẢNG CÁCH / ĐỔI
HƯỚNG: *spotted… then drew closer, walked up to, turned around, looked back,
led her deeper, followed them in*.

Ví dụ chuẩn (case A Fei, đoạn "18 Lakes"): *"spotted a group standing on a
**nearby hill**… but as she **drew closer** to strike up a conversation"* = 2
vị trí khác nhau → 2 shot, không phải 1.

**Làm shot/reverse-shot**: cần **2 background biến thể của CÙNG 1 địa điểm** —
1 cái là chỗ đối tượng đứng, 1 cái là chỗ nhân vật đứng nhìn sang. Đặt tên đối
xứng để đọc `assets.json` là hiểu quan hệ:
`Long Wang 18 Lakes Hillside` (nhóm đứng) ↔ `Long Wang 18 Lakes Opposite
Hilltop` (A Fei đứng). Background thứ 2 phải mô tả rõ có 1 quả đồi KHÁC ở
midground, cách nhau bằng chỗ trũng thấy được.

### 4b. CẶP CẢNH ĐỐI XỨNG ĐẦU–CUỐI (gài rồi mở)

Nhiều case có một hiện tượng lạ ở đầu, tới cuối mới được giải thích. Đừng vẽ hai
cảnh đó rời rạc — **dựng chúng thành một cặp đối xứng**: cùng background, cùng
góc máy, cùng tư thế nhân vật, cùng mọi chi tiết — **chỉ khác đúng thứ được
reveal**. Cắt cạnh nhau trong video là khán giả tự nhận ra ngay, không cần lời
giải thích nào.

Ví dụ case 5: `The Bicycle Grows Heavy` (bánh sau bẹp, người chồng ngoái lại nhìn
yên sau trống) ↔ `The Spirit On The Bicycle` (y hệt, nhưng giờ thấy cô gái ngồi
đó, và người chồng KHÔNG ngoái lại vì anh ta không biết).

⚠️ **Ở cảnh GÀI, phải cấm tường minh cái sắp reveal** — model rất hay tự thêm
người vào chỗ trống cho "đầy khung": *"the luggage rack is EMPTY: draw absolutely
NO second person, NO figure, NO silhouette and NO shape sitting on it"*. Cùng
lớp với luật để đối tượng ngoài khung ở shot "nhìn thấy từ xa" ngay dưới đây.

⚠️ Ở shot "nhìn thấy từ xa", **cố ý để đối tượng NGOÀI KHUNG** (nhân vật nhìn
off-frame), KHÔNG vẽ người tí hon ở xa: `BACKGROUND_STYLE_BLOCK` cấm mọi bóng
người trong background, và nhân vật vẽ nhỏ thì không giữ được mặt/trang phục
theo reference. Đối tượng được reveal ở shot kế tiếp — đó mới là chỗ cần nhìn
rõ.

## 5. Character

- Mô tả **chỉ gồm** những mục trong `CHARACTER_DESCRIPTION_CHECKLIST`
  (`styleDNA.ts`). Không mô tả dáng người/tỉ lệ (ảnh master đã khoá), không mô
  tả biểu cảm (quyết định theo từng cảnh).
- **Không dùng tên người thật/nổi tiếng** trong prompt — bị bộ lọc "prominent
  people" chặn. Dùng mô tả ngoại hình thay thế.
- **Ảnh chụp thật của nhân vật có thật**: chỉ dùng để **soi bằng mắt rồi viết
  ra mô tả chữ**. KHÔNG đính làm reference thứ 2 — pipeline chỉ đính duy nhất
  `reference-character.jpeg` (ảnh phong cách).
- **Ảnh người dùng gửi trong hội thoại làm "mẫu bố cục"** (vd screenshot từ 1
  video kênh khác): xử lý y hệt — **soi bằng mắt, tả lại bằng chữ trong
  `description`**, không đính vào prompt và không lưu vào repo. Tả bằng thứ đo
  được: mảng nào chiếm bao nhiêu phần khung, có bao nhiêu vật, đường nào ngang
  đường nào chéo. Ghi vào `notes` là mô tả này bắt nguồn từ ảnh mẫu nào, để lần
  sau sửa còn biết gốc.
- Ảnh master khoá cứng vài đặc điểm (tóc dài 2 bên, trang phục nhiều lớp…).
  Muốn khác thì **phải nói tường minh** ("tóc búi gọn không buông", "váy 1 lớp
  không khoác ngoài") — đã xác nhận là ghi đè được.
- **Nhân vật phụ**: KHÔNG gộp nhiều vai vào 1 asset chung nếu họ có thể xuất
  hiện **cùng khung hình** (sẽ trông như nhân bản 1 người). Chỉ dùng asset
  chung cho đám đông nền không cần nhận diện. Phân vân thì **hỏi người dùng**.

### 5a. TÓC + RÂU: mô tả cho MỌI nhân vật có tên, và phải KHÁC NHAU

Người dùng chốt 2026-08-13: **mỗi nhân vật có tên đều phải được tả tóc, và tả
râu nếu là nam** — kể cả vai chỉ xuất hiện 1-2 cảnh. Lý do: phong cách này đã
lược hết mũi/lông mày, mặt chỉ còn 2 chấm mắt + 1 nét miệng, nên **tóc và râu
gần như là thứ DUY NHẤT phân biệt người này với người kia**. Bỏ trống thì cả
dàn nhân vật ra na ná nhau và ảnh mất tác dụng làm bản nháp dựng.

Ngoại lệ DUY NHẤT: **người nền/đám đông** (khách viếng, quản giáo đứng nền,
hàng xóm) — nhóm này vẽ thẳng vào background bằng `editFrom` (mục 5c) và chỉ
cần *"vary their heights and hair colours slightly"*, không tả kỹ.

Hai điểm dễ sai:
- **"Clean-shaven" là một lựa chọn, không phải mặc định để trống.** Vẫn phải
  viết ra (*"clean-shaven with no beard and no moustache"*) — nhưng nếu cả case
  ai cũng clean-shaven thì đã hỏng mục đích. Rải cho khác nhau: ria không râu /
  râu quai nón đầy có ria / râu cằm không ria / chỉ tóc mai / cạo nhẵn.
- **Tóc phải khác nhau ở CẢ 3 trục**: độ dài–kiểu (cắt cua, xoăn, rẽ ngôi giữa,
  hói đỉnh còn tóc 2 bên), MÀU, và có/không đội mũ che tóc. Đội mũ thì vẫn nói
  phần tóc lộ ra dưới vành (*"showing below the hat brim"*), không thì model tự
  cho hói.

Rà nhanh sau khi viết xong: đọc dọc cột tóc + râu của cả case một lượt — có 2
nhân vật nào trùng cả hai không? Trùng thì đổi, đừng để tới lúc soi ảnh.

*(Case 3 "Carl Ledges" là case đầu áp quy tắc này: 8 nhân vật ra 8 kiểu râu/tóc
khác nhau — xem `case-3/assets.json` làm mẫu.)*

### 5c. ĐÁM ĐÔNG NỀN: vẽ thẳng vào background bằng `editFrom`, không tạo asset riêng

Cảnh cần vài người vô danh (khách viếng đám tang, quản giáo đứng nền, hàng xóm
tụ tập)? **Đừng tạo Character asset cho từng người** rồi ghép — vừa tốn, vừa
phải viết prompt hình học chặt để xếp vị trí.

👉 Tạo 1 background biến thể bằng `editFrom` (mục 6b) và **mô tả thẳng nhóm
người vào đó**. Mẹo: `editFrom` **bỏ qua mọi style block**, nên không vướng điều
khoản *"NO people"* của `BACKGROUND_STYLE_BLOCK` vốn chặn việc này ở background
thường.

⚠️ **Vai phụ phải dùng ĐÚNG ngôn ngữ tạo hình của nhân vật chính** (người dùng
chốt 2026-08-11). Không thì người nền và người chính nhìn như hai bộ phim khác
nhau. Phải tả tường minh, vì `editFrom` không có style block nào đỡ cho:

- **Góc 3/4, thấy ĐỦ HAI MẮT** — không dùng bóng lưng cho tiện. Bản thử vẽ
  quay lưng tuy né được chuyện nhân bản nhưng bị loại vì lệch dàn chính.
- **Mặt tối giản**: *"exactly TWO small round black dots for the eyes and ONE
  short straight line for the mouth, no nose, no eyebrows"*.
- **Thân dạng que**: *"arms and legs as THIN PLAIN STRAIGHT LINES with no
  thickness"*, trang phục là *"ONE plain flat dark shape… no folds, no creases,
  no buttons"*. Không nói rõ thì model vẽ thân đầy đặn, vest có nếp gấp.
- **Chống nhân bản**: *"vary their heights and hair colours slightly so they do
  not look like copies of one figure"*.
- **Chừa chỗ**: dồn nhóm vào 1/3 khung và nói rõ phần còn lại *"must be left
  clear and completely empty"* — nếu không họ tràn kín, hết chỗ đặt nhân vật
  chính.

### 5d. 🔑 Vai phụ LẶP LẠI qua nhiều cảnh → PHẢI có Character asset

Mục 5c nói đám đông nền thì vẽ thẳng vào background. Nhưng có một nhóm nằm GIỮA
hai thái cực đó, và đây là chỗ dễ sai nhất: **vai phụ không cần tên nhưng xuất
hiện lặp lại qua nhiều cảnh** (nhóm bạn đồng hành, tổ công tác, mấy đứa trẻ theo
chân nhân vật chính).

Tả họ bằng chữ trong prompt CỦA TỪNG CẢNH — kể cả khi tả rất kỹ và có câu
*"vary their heights and hair colours"* — sẽ cho ra **người khác hẳn nhau ở mỗi
ảnh**, vì mỗi lần generate model chọn lại từ đầu, không có gì neo giữ. Người dùng
phát hiện đúng chuyện này ở case 5 (3 người tị nạn đổi diện mạo qua cả 3 cảnh
hành trình).

👉 **Luật**: vai phụ xuất hiện ở **từ 2 cảnh trở lên** thì tạo Character asset
riêng và đính reference như nhân vật chính. Chỉ giữ cách tả-trong-prompt cho vai
xuất hiện ĐÚNG 1 cảnh (case 5: 2 ngư dân phụ trên thuyền cá — chỉ có mặt 1 cảnh
nên không cần asset).

⚠️ Đám đông nền của mục 5c cũng theo luật này: bake vào background chỉ ăn khi
background đó ĐỨNG YÊN qua các cảnh. Nếu nhóm người đi theo một Prop DI CHUYỂN
qua nhiều bối cảnh (con thuyền qua bến → giữa biển → gặp thuyền khác), không có
background nào để bake vào — lúc đó buộc phải là Character asset.

### 5b. Nhân vật đổi TRANG PHỤC trong truyện → mỗi bộ đồ 1 asset riêng

Câu chuyện có thể đưa nhân vật qua nhiều bối cảnh đòi trang phục khác hẳn nhau
(đồng phục tù → vest đám tang → đồ thường ở nhà bạn). **Đừng dùng 1 asset chung
cho tất cả** — mặc áo tù đi dự đám tang thì ảnh vô dụng cho việc dựng.

Cách làm:
- Mỗi bộ đồ 1 asset: `Don Decker` (đồ thường), `Don Decker Prison`,
  `Don Decker Funeral`. **Giữ NGUYÊN VĂN phần mặt/tóc/râu** ở cả 3 mô tả, chỉ
  đổi đúng phần trang phục — để 3 asset đọc ra cùng một người.
- Sau khi viết xong, **in bảng "nhân vật mặc gì ở cảnh nào"** rà lại một lượt.
  Đây là chỗ cực dễ sót vì trang phục nằm trong `references` chứ không nằm ở
  chỗ nào dễ nhìn.
- Chỗ **chuyển trang phục** phải quyết rõ và ghi vào `notes`: ví dụ Don đi
  thẳng từ đám tang sang nhà Bob nên cảnh *tới cửa* vẫn mặc vest, từ cảnh
  *trong nhà* trở đi mới là đồ thường (đã thay để ở lại qua đêm).

## 6. Background

- `composition` — chọn theo LOẠI CẢNH, đọc `styleDNA.ts` để biết block tương ứng:

  | Giá trị | Dùng cho |
  |---|---|
  | `"flat"` (mặc định) | Cảnh KHÔNG có tương tác: toàn cảnh, nhân vật đứng một mình, cảnh trống |
  | `"corner"` | **Cảnh có 2+ người TÁC ĐỘNG LÊN NHAU** — xem mục 6h, đây là luật quan trọng |
  | `"layered"` | Phong cảnh thiên nhiên rộng (núi xa → làng giữa → ruộng gần) |
  | ~~`"perspective"`~~ | ❌ **KHÔNG dùng nữa** — xem ngay dưới |

  🔴 **PHỐI CẢNH ĐÃ BỊ LOẠI (người dùng chốt 2026-08-14).** `assets.ts` và
  `styleDNA.ts` vẫn còn định nghĩa `"corner"` và `"perspective"` — **đừng tưởng
  còn dùng được**. Lịch sử đầy đủ, để không ai đi lại đường này lần thứ ba:

  1. 2026-08-11 chốt dùng `"perspective"` (phối cảnh 2 điểm tụ) cho background mới.
  2. 2026-08-14 người dùng xem loạt background case 4 → loại: *"mọi thứ đang bị
     chéo, nhìn không đúng lắm"*. Thủ phạm nằm ngay trong block, nó viết thẳng
     *"rectangular objects are drawn as parallelograms"*.
  3. Vá thành phối cảnh **1 điểm tụ** (mặt chính là hình chữ nhật thật song song
     khung hình, chỉ cạnh lùi xa mới xiên), tạo thử 2 ảnh → **vẫn bị loại**.
  4. 👉 Quay lại `"flat"` — đúng phong cách case 1 và case 2 vốn đã duyệt.

  ⚠️ Thứ bị loại là **PHỐI CẢNH TOÀN CẢNH** (mọi đồ vật xoay chéo, không cạnh
  nào song song khung hình), KHÔNG phải là mọi thứ có chiều sâu. `"corner"` vẫn
  dùng, và có luật riêng ở mục 6h ngay dưới.

### 6h. 🔑 NHÂN VẬT TÁC ĐỘNG LÊN MỘT VẬT → dựng GÓC CHO CHÍNH VẬT ĐÓ

**Luật (người dùng chốt 2026-08-15, kèm ảnh mẫu từ 1 video cùng thể loại).**
Điều kiện KHÔNG phải là "có nhiều người trong khung", cũng không phải "hai người
đối thoại" — đối thoại thường nền phẳng vẫn đọc tốt. Điều kiện là:

> Nhân vật **tác động lên / áp vào / đối diện một VẬT hoặc MẶT** của bối cảnh.

Lúc đó phải đặt **chính cái vật ấy** lên một mảng nghiêng (tường bên, mặt đặt
chéo), vì nền phẳng chiếu thẳng không diễn được quan hệ *chạm vào / đứng dựa /
soi vào*: nhân vật chỉ đọc ra là **đứng TRƯỚC** cái vật, không phải **áp vào** nó.

Hai ví dụ người dùng đưa:
- **Người phụ nữ bị dựa vào tường trước tiểu đội lính** — bức tường phải đặt
  nghiêng, cô ấy áp lưng vào mảng tường đó, lính đứng chếch phía đối diện. Tường
  vẽ chiếu thẳng thì không ai đọc ra là cô bị dồn vào tường.
- **Nhân vật soi gương thấy mặt người khác** (case 2, Don Decker) — gương phải
  treo trên **tường BÊN**, nhân vật quay vào nó. Đây đúng bài học đã trả giá 3
  vòng ở mục 8b(c): *"dạt gương sang trái" KHÔNG giống "treo gương trên tường
  bên"*, và vòng sửa thứ hai trượt đúng vì lẫn hai thứ đó.

**KHÔNG cần góc** (nền phẳng là đủ, đừng vẽ vẽ thêm cho phức tạp): nhân vật đứng
một mình; toàn cảnh giới thiệu; cảnh trống; **và cả cảnh 2-3 người đang nói
chuyện/tranh cãi với nhau mà không ai chạm vào vật gì** — người dùng đã xem toàn
bộ case 4 (Greenbrier) với loại cảnh này trên nền phẳng và xác nhận **đạt**.

⚠️ **Ngoài trời cũng áp dụng** — luật theo VẬT BỊ TÁC ĐỘNG, không theo trong
nhà/ngoài trời. Ảnh mẫu chính là cảnh ngoài trời (tường + bụi cây + trời).

**Hình học của góc** (giữ tinh thần phẳng, không rơi vào phối cảnh hút sâu): tả
bằng **số mảng và số đường** theo công thức đã chạy đúng ở mục 8b(c) — đúng HAI
mảng tường gặp nhau ở MỘT đường dọc, mảng bên tô **sắc độ đậm hơn** để mắt đọc ra
là mặt khác, và **đúng MỘT đường chéo** dưới sàn để sàn đọc ra là quẹo ở góc.
Không điểm tụ, không hàng gạch nhỏ dần về xa.

👉 Ở prompt cảnh phải **gán vật cho mảng** và **gán người cho mảng**, nếu không
model vẫn xếp mọi thứ dàn hàng quay ra ngoài: *"the mirror belongs to the LEFT
side wall only"*, *"she stands with her back against that LEFT side wall, they
stand on the floor in front of the BACK wall facing her"*.

### 6e. Đổi phong cách nền: sửa BLOCK thôi KHÔNG đủ, phải sửa cả `description`

Bài học đắt nhất của vòng bỏ phối cảnh. Mô tả từng background tự nó mang câu chữ
theo phong cách cũ — *"drawn at an angle so its top reads as a parallelogram"*,
*"two flat wall planes meeting along one vertical corner line"*. **Mô tả cụ thể
của asset thường THẮNG style block**, nên sửa block xong mà để nguyên
`description` thì ảnh vẫn ra kiểu cũ.

Đổi phong cách nền = 3 việc, thiếu việc nào cũng hỏng:
1. Sửa block trong `styleDNA.ts` (và ghi lý do vào docstring).
2. Viết lại `description` của TỪNG background theo ngôn ngữ phong cách mới.
3. Sửa câu khoá background trong TỪNG cảnh ghép (*"the same corner line"* →
   *"the same ceiling band… the same floor strip"*), và chỉnh lại câu style cuối
   prompt (`"no perspective"` phải có mặt khi nền là phẳng).

⚠️ Khi thay chuỗi hàng loạt trong `scenes.json`, **lọc theo `references` trước** —
chỉ sửa cảnh thật sự dùng background đó. Thay toàn cục kiểu *"brown floor strip"
→ "grey floor strip"* sẽ phá luôn các cảnh phòng khác cũng có đúng cụm chữ ấy.

### 6f. Bảng màu phải thống nhất giữa các background của CÙNG một nơi

Hai background của cùng một công trình (tầng trên ↔ tầng dưới, trong nhà ↔ ngoài
hiên) mà khác tông là lộ ngay khi cắt qua lại. Đã dính thật: tầng trên tường nâu
+ sàn xám, tầng dưới tường kem + sàn nâu — hai cảnh liền nhau trong cùng một đoạn.

👉 Sửa bằng `editFrom` **chỉ đổi màu**, đừng sinh mới từ chữ:

> Keep absolutely everything about the layout unchanged … Change ONLY the
> colours, and nothing else at all. FIRST: change the wall from pale cream to a
> plain flat WARM BROWN … Do not move anything, do not resize anything.

Sinh mới sẽ ra cầu thang/đồ đạc "na ná" nhưng lệch vị trí — đúng thứ mà cặp cảnh
cắt qua lại sẽ phơi ra.

### 6i. MỌI THỨ CÓ CHỮ ĐỀU ĐỂ TRỐNG — không có ngoại lệ

Model **không viết được chữ**: ra ký tự méo mó, sai chính tả, hoặc chữ Hán vô
nghĩa. Đã dính 3 lần liên tiếp (bảng tưởng niệm case 4; bài vị + băng vải tang lễ
+ mặt báo case 5), nên đây là luật cứng chứ không phải lưu ý.

👉 Với MỌI vật mang chữ trong đời thật — bia mộ, bài vị, bảng hiệu, băng rôn,
biển tên, mặt báo, thư từ, hồ sơ — mô tả nó là **hình chữ nhật trống hoàn toàn**
và cấm theo tên: *"completely BLANK — absolutely no writing, no letters, no
characters, no headlines and no carving on it anywhere"*.

Muốn vật đó vẫn ĐỌC RA đúng loại thì cho **tín hiệu hình học thay cho chữ**:
- Mặt báo → *"EXACTLY FOUR plain thin horizontal grey lines standing for columns
  of text and nothing more"*.
- Bài vị → dáng chữ nhật đầu tròn + một viền vàng mảnh bên trong mép.
- Bia mộ → dáng phiến đá đầu vòm.

Chữ thật là việc của khâu dựng — ghi vào `notes` để người dùng biết chỗ nào cần
điền, đừng để họ tưởng ảnh bị thiếu.

### 6g. CHÊNH CAO trong bố cục phẳng (cầu thang, giếng trời, cửa hầm)

Bố cục phẳng không có chiều sâu, nên **"nhìn xuống tầng dưới" không tả được bằng
lối thường**. Chọn cách theo chỗ nhân vật ĐỨNG:

| Nhân vật đứng ở | Vẽ cầu thang thành |
|---|---|
| Tầng **dưới**, nhìn lên | **Hình chiếu cạnh**: các bậc xếp chéo đi LÊN, tread ngang tuyệt đối / riser dọc tuyệt đối, một tay vịn thẳng, không con tiện |
| Tầng **trên**, nhìn xuống | **LỖ KHOÉT trong dải sàn** — công thức ngay dưới |

Công thức lỗ khoét (viết ra số, đừng tả "cầu thang đi xuống"):

> Cut into the RIGHT THIRD of the floor is the stairwell opening, drawn as a
> plain four-sided hole: its top edge lies along the wall line, its left edge is
> ONE single straight diagonal line running down toward the right… Through that
> hole draw EXACTLY FIVE plain pale step bands and no more, each a thin flat
> horizontal bar, stacked in one straight diagonal line descending toward the
> lower right… Behind and below the steps the inside of the stairwell is filled
> with the same flat colour as the wall.

🔑 **Thứ khiến nó ĐỌC RA là cầu thang, không phải vũng tối trên sàn**: phải có
một vật ĐỨNG ở mép lỗ làm mốc chiều cao — *"EXACTLY ONE plain newel post, one
plain narrow upright rectangle rising from the floor to about the height of the
doorknob"* — cộng *ONE* tay vịn chạy chéo song song với các bậc rồi ra khỏi mép
khung. Cấm con tiện, cấm trụ thứ hai.

Kèm 2 việc bắt buộc:
- Chừa **hai phần ba sàn còn lại trống hẳn** làm chỗ đứng cho nhân vật.
- Ở prompt cảnh, cấm nhân vật che mất mốc: *"neither of them may cover the newel
  post or the step bands, so the stairwell opening stays clearly visible"* —
  che mất trụ là mất luôn thông tin "đây là chỗ hụt xuống".

✅ **ĐÃ XÁC NHẬN** (2026-08-15): công thức viết theo ảnh mẫu người dùng gửi, tạo
ra `Shue House Upstairs Stairwell Flat` của case 4 và **người dùng đã duyệt ảnh
đó**. Dùng lại thẳng cho mọi cảnh chênh cao về sau.
- `reserveCharacterSpace: true` khi sẽ ghép người vào — chừa sàn trống + khoá
  góc máy ngang tầm mắt. Cảnh toàn cảnh không ghép người thì để `false`.
- **Ánh sáng ngày/đêm phải bake thẳng vào mô tả** nếu bối cảnh chỉ dùng ở 1
  thời điểm. Ảnh reference là ảnh TĨNH — mood viết trong prompt cảnh **không
  ghi đè được** ánh sáng đã khoá trong ảnh. Cần cả ngày lẫn đêm → tạo 2 asset
  riêng.
- **"Dãy vật thể đứng cạnh nhau" (nhà, quầy chợ, hàng cột) không tự tràn khung**
  — model thu nhỏ cả cụm rồi đặt giữa, hở đất/trời 2 bên. Phải nói thẳng: dãy
  phải phủ kín từ mép trái tới mép phải, không hở khoảng cỏ/trời nào ở 2 bên.
- **Vật thể CAO xuyên qua nhiều dải** (tháp, cột, cây lớn): đừng liệt kê nó
  trong danh sách dải ngang, sẽ bị cắt cụt. Phải nói rõ 3 điều: chạy suốt từ
  mép trên xuống đâu, nằm TRƯỚC hay SAU các dải kia, và chạm đất thế nào.
- 🔴 **THỨ TỰ DẢI MÃ HOÁ KHOẢNG CÁCH — trên là XA, dưới là GẦN.** Nghe hiển
  nhiên nhưng rất dễ xếp sai khi cảnh có nhiều mặt nền (đất + nước, sân + đường,
  sàn + bậc). Soát bằng đúng 1 câu hỏi: **"nhân vật đứng/nổi trên cái gì?"** —
  cái đó BẮT BUỘC là dải DƯỚI CÙNG.

  Đã dính thật (case 5, `Kinmen Shore Daytime`): xếp trời → nhà → **biển** → cát,
  tức biển nằm giữa nhà và bãi cát, nghĩa là nhà ở phía sau mặt nước. Ảnh ra dãy
  nhà **đứng thẳng trên mặt biển**, chân nhà bị mép dải biển cắt ngang. Bản đúng
  là trời → nhà → bãi cát (nhà đứng trên đó) → **biển ở dải dưới cùng**, vì cô
  gái ngồi trên thuyền nổi trên biển.

  ⚠️ Câu *"X tựa lên mép xa của dải Y và phải chạm vào nó"* — vốn là câu chữa
  lỗi vật lơ lửng — **làm lỗi này nặng thêm** nếu Y sai chỗ: nó ép vật đứng lên
  đúng cái dải không nên đứng. Gán vật vào dải NÀO phải đúng trước, rồi mới nói
  chuyện chạm.

### 6c. 🔢 RA SỐ CỤ THỂ cho mọi thứ LẶP LẠI — "một số ít" là vô nghĩa

`SIMPLIFY_DETAIL_BLOCK` có câu *"reduced to a SMALL number of large simple
shapes"*, nhưng "số ít" là **định tính** và model hiểu rất thoáng. Hai lần dính
liên tiếp (2026-08-11):

- Nhà bếp tả *"a plain row of simple flat wooden upper cabinets"* → ra **hơn 30
  cánh tủ** cộng sàn caro mấy chục ô.
- Buồng giam tả *"only a SMALL number of widely spaced vertical bars"* → song
  sắt **phủ kín khung**, cắt ngang cả mặt nhân vật.

👉 Với BẤT KỲ thứ gì lặp (cánh tủ, song sắt, cột, ô cửa sổ, gạch sàn, hàng ghế),
viết **con số** vào mô tả:

> *"EXACTLY FOUR cabinet doors and no more, each door drawn as one single very
> wide plain flat rectangle"*
> *"EXACTLY EIGHT plain vertical steel bars evenly spaced… and NOTHING MORE — no
> extra bars, no lattice, only ONE single horizontal rail"*

Kèm 2 việc nữa:
- **Cấm từng loại chi tiết nhỏ theo TÊN**: *"no knobs, no handles, no glass
  panes, no moulding, no inner frame lines"*. Cấm chung chung không ăn.
- **Cấm hoa văn sàn tường minh**: *"ONE single flat colour with absolutely NO
  tiles, NO chequered pattern, NO grid"* — chữ "chequered/tiled" trong mô tả là
  đủ để model vẽ ra hàng chục ô.

⚠️ Ra số giúp rất nhiều nhưng **không tuyệt đối**: yêu cầu "đúng 4 cánh" ra 6
cánh (vẫn tốt hơn 30). Cần chính xác hơn nữa thì neo bằng tỉ lệ khung
(*"each door is one quarter of the cabinet run"*).

🔴 **Chữ "OR" giữa 2 trạng thái ngang hàng = cho model quyền CHỌN, và nó chọn
lỏng.** Khác hẳn lớp lỗi "số lượng" ở trên — đây là lỗi **THUỘC TÍNH** (mắt
mở/nhắm, đứng/ngồi, vui/buồn). Viết *"eyes as two round dots OR two downward
curves"* để NHÓM NGƯỜI cùng ở một trạng thái (vd cả nhóm đang kiệt sức) thường ra
kết quả trộn lẫn — model chọn mắt mở cho phần lớn, chỉ 1-2 người chọn đúng nhắm.

Đã dính thật (case 5, "Adrift At Sea"): tả 4 người trôi dạt kiệt sức, câu mắt
viết "two round dots or two downward curves" → 2 trong 3 người phụ vẫn mắt mở
ngồi thẳng, chỉ đúng cách gán tư thế cho nhân vật chính riêng mới đọc đúng.

👉 Khi CẢ NHÓM phải cùng một trạng thái, bỏ hẳn lựa chọn — chỉ còn ĐÚNG MỘT thuộc
tính, và gán tư thế **cụ thể theo từng vị trí** thay vì một câu chung áp cho cả
nhóm: *"EVERY ONE of these three has EYES CLOSED, drawn ONLY as two downward
curves — never open, never round dots"*, rồi mô tả riêng người ở đầu trái tựa
tay lên mạn thuyền, người giữa gục xuống tấm ván, người đầu phải ngả đầu ra sau.
Cùng nguyên tắc gốc: câu có nhiều lựa chọn ngang hàng luôn bị diễn giải lỏng,
dù đó là số lượng hay thuộc tính.

### 6d. Vật che trước mặt nhân vật (song sắt, lan can, cây) — phải cấm ĐÈ LÊN người

Background có thứ chắn ngang (song sắt, hàng rào, cột) thì lúc ghép, model rất
hay xếp nhân vật RA SAU nó — mặt bị cắt ngang, hỏng cảnh. Câu *"đứng phía trong
song"* KHÔNG đủ, vì "phía trong" không nói gì về thứ tự lớp.

👉 Ở background: chừa hẳn **dải sàn trống phía trước** vật chắn
(*"the bars STOP where they meet the floor; in front of them the near floor is
left completely clear across the width"*).
👉 Ở prompt cảnh: nói thứ tự lớp tường minh —
*"stand IN FRONT OF the bars, closer to the viewer than the bars, so that NO bar
passes in front of any part of their bodies or their faces"* — kèm
*"do NOT add any extra bars anywhere"*.

### 6e-2. 🔑 KHÔNG vẽ chiều sâu khoang — vẽ THÀNH làm mốc che thân, đảo ngược mục
6d

Khi nhiều người cùng "ở trong" một vật chứa nông/hẹp mà máy hay vẽ sai tỉ lệ
(thuyền, xe, bồn tắm, hố...), đừng cố mô tả đúng chiều sâu 3D của khoang — đó là
thứ model liên tục đoán sai (đã dính 3 vòng liên tiếp ở case 5: nhân vật chồm ra
mép mũi thuyền, thân thuyền quá nông lộ hết người, mô tả "sâu hơn" cũng không
đủ). Thay vào đó, áp dụng NGƯỢC LẠI mục 6d: mục 6d cấm vật che MẶT, cho phép che
THÂN; ở đây ta chủ động dùng đúng cơ chế che thân đó để thay thế toàn bộ việc mô
tả chiều sâu.

**Cách làm**: vật chứa chỉ còn là MỘT DẢI PHẲNG (thành/mép), không vẽ nội thất
bên trong (không sàn, không ghế, không đáy) — *"the boat's INTERIOR IS NOT SHOWN
AT ALL... the hull reads as ONE simple flat shape, like a long low wall"*. Người
đứng/ngồi NGAY SAU dải đó; ở prompt cảnh nói thứ tự lớp — *"the near side of the
hull passes IN FRONT OF every one of them, hiding their body from the waist down
... heads, shoulders and upper chest stay fully visible ... no part of the hull
may cross anyone's face"*. Không có phép tính 3D nào cả, chỉ là quan hệ lớp
trước/sau phẳng — đúng thứ model làm tốt.

**Lợi ích kèm theo**: tư thế "mệt mỏi/kiệt sức" của cả nhóm cũng đơn giản hẳn —
*"leans forward with both arms folded on top of the rim and head resting down on
their own folded arms"*, mọi người làm ĐÚNG MỘT động tác, chỉ đổi góc nghiêng
đầu để tránh nhân bản. Đỡ hẳn việc phải nghĩ 4 tư thế phức tạp khác nhau (dựa
mạn, gục ván, ngả ra sau...) mà vẫn dễ sai như 2 vòng sửa trước.

Vật chứa cần kéo DÀI hơn bình thường để đủ chỗ cho cả nhóm xếp hàng dọc theo mép
— nói tường minh tỉ lệ (*"about twice the length of an ordinary rowing boat"*).

### 6b. Biến thể của cùng 1 bối cảnh → dùng `editFrom`, ĐỪNG sinh mới từ chữ

Cần cửa mở/đóng, đèn bật/tắt, phòng khô/ướt của **cùng một căn phòng**? Khai báo
asset mới với `editFrom: "<tên asset gốc>"` — runner đính ảnh gốc làm reference
duy nhất và **không ghép style block nào**, nên bố cục giữ nguyên tuyệt đối.

Sinh mới từ chữ sẽ ra căn phòng "na ná" nhưng lệch vị trí đồ đạc — cắt qua lại
giữa 2 cảnh là lộ ngay. Asset gốc phải đứng **TRƯỚC** trong mảng `assets` và đã
`success` (`loadAssetFile` kiểm tra và báo lỗi nếu xếp sai).

`description` lúc này chỉ nói **đúng thứ cần đổi** + câu giữ nguyên phần còn lại:

> Use the single reference image and keep absolutely everything unchanged — same
> wall, same bars, same floor, same colours, same flat 2D style. Change ONLY …
> Everything else stays exactly as it already is.

⚠️ **Tả chuyển động của vật thể phải nói rõ KIỂU chuyển động.** *"slid fully
open"* ra **cửa trượt**; muốn cửa bản lề phải nói đủ **HINGED** + **SWUNG
OUTWARD** + **NOT slid sideways**, kèm hình học quan sát được (*"a slanted
rectangle of bars sticking out at about forty-five degrees, its free edge drawn
slightly larger than its hinge edge"*). Cùng nguyên tắc mục 9.

## 7. Prop — và khi nào KHÔNG tạo Prop

**Quy tắc chọn**:
- Vật thể xuất hiện **giống hệt ở NHIỀU cảnh/bối cảnh khác nhau** → tạo Prop
  riêng.
- Vật thể chỉ thuộc **ĐÚNG 1 bối cảnh** → **vẽ thẳng vào mô tả Background đó**,
  đơn giản và chắc hơn nhiều so với tạo Prop rồi ghép lại (ghép cần prompt hình
  học rất chặt, dễ sai vị trí/góc).

### 7b. 🔴 Prop phải có ĐỦ BỘ PHẬN mà cảnh sẽ đụng tới

Trước khi chạy, đọc lại các cảnh dùng prop đó và **liệt kê mọi bộ phận được nhắc
tên trong tư thế nhân vật** — tay cầm gì, chân đặt lên đâu, ngồi lên chỗ nào —
rồi soát xem mô tả prop có tả ra đủ từng cái không.

Đã dính thật (case 5, `Old Bicycle`): mô tả liệt kê bánh, khung, ghi-đông, yên,
yên sau — **quên hẳn BÀN ĐẠP**, trong khi cả 5 cảnh đều viết *"both leg lines
bent at the pedals"*. Ảnh ra chiếc xe không có bàn đạp, và mọi cảnh đạp xe đều
vô nghĩa. Kiểu lỗi này KHÔNG báo lỗi, không ai phát hiện cho tới lúc soi mắt.

Chỗ dễ quên nhất là **bộ phận để tương tác** chứ không phải bộ phận để nhận
dạng: bàn đạp, quai xách, dây đeo, tay nắm, bậc lên, chỗ ngồi. Mắt ta nhìn ảnh
prop thấy "đúng là cái xe đạp" nên bỏ qua.

👉 Sửa bằng `editFrom` chỉ thêm bộ phận thiếu, đừng sinh lại từ chữ — dáng vật
đã đúng thì giữ.

## 8. Cảnh ghép (`scenes.json`)

Công thức prompt đã chạy ổn định, gồm 4 phần theo đúng thứ tự:

1. **Mở**: "Draw a scene combining all N reference images."
2. **Khoá từng reference**: nêu rõ giữ nguyên cái gì từ ảnh nào ("keep the
   woman's exact face, hair, jacket from the first reference image,
   unchanged"; "keep the background exactly as shown… unchanged"). Nhiều nhân
   vật thì thêm: **không trộn đặc điểm của họ vào nhau**.
3. **Hành động**: tư thế/hướng nhìn/đang cầm gì.
4. **Tỉ lệ + góc máy + style**: scale người bình thường so với bối cảnh, cùng
   góc máy ngang tầm mắt như ảnh background, rồi nhắc lại flat 2D vector.
   Cảnh `layered` thì viết "no single-point converging perspective" thay vì
   "no perspective" (tránh mâu thuẫn với chiều sâu xếp lớp).

**Liên tục đạo cụ**: trước khi viết `references`, rà lại nhân vật đang cầm/đeo
gì ở shot TRƯỚC. Không có cơ chế tự kiểm tra — lỗi chỉ lộ khi xem 2 ảnh cạnh
nhau. (Đã dính thật: giỏ đi chợ biến mất giữa 2 cảnh liền kề.)

**Sửa 1 chi tiết nhỏ trên cảnh ĐÃ GHÉP** (đổi biểu cảm, nhắm mắt, đổi hướng
nhìn): đính **duy nhất chính ảnh cảnh đó** làm reference, prompt nói "giữ
nguyên mọi thứ, CHỈ đổi X". ĐỪNG ghép lại từ các asset gốc — sẽ lệch pose/vị
trí và phá liên tục giữa 2 cảnh. Coi ảnh trước như 1 keyframe để biến đổi tiếp.

**Thứ tự phụ thuộc**: scene tham chiếu scene khác thì phải xếp SAU nó trong
mảng `scenes`. Runner không tự sắp xếp.

### 8c. TRẺ EM: phải ép chiều cao ở TỪNG cảnh, không ép được ở asset

`CHARACTER_DESCRIPTION_CHECKLIST` **cấm mô tả dáng người/tỉ lệ** trong asset
Character (ảnh master đã khoá cấu trúc thân), mà ảnh master lại là người lớn —
nên asset "cậu bé 11 tuổi" vẫn ra cao bằng người lớn. Không có chỗ nào sửa được
việc đó ở tầng asset.

👉 Ép ở **prompt cảnh**, và neo vào vật trong khung chứ đừng nói "nhỏ hơn":
*"plainly SHORTER than the man, about up to the man's chest"*, hoặc khi đứng một
mình: *"only about as tall as the middle of the door"*. Phải nhắc lại ở MỌI cảnh
có nhân vật đó — không có cơ chế nào nhớ hộ.

### 8d. Cảnh cần tư thế mà `SCENE_CHARACTER_VIEW_BLOCK` cấm

Block do `createSceneComposites` tự nối vào mọi cảnh **cấm vẽ lưng, cấm profile,
bắt LUÔN thấy đủ 2 mắt**. Nó nằm ở đầu prompt VÀ nhắc lại ở cuối — tức 2 vị trí
mạnh nhất, còn prompt cảnh nằm ở giữa. Đừng viết cảnh đánh nhau với nó, sẽ thua.

Gặp cảnh mà kịch bản đòi đúng thứ bị cấm (quay đầu 180°, nhìn từ sau lưng, chỉ
thấy 1 bên mặt) thì **đi vòng**, đừng ép:
- Quay đầu 180° → giữ đủ 2 mắt nhưng **vặn đầu lệch hẳn khỏi vai**, neo bằng chi
  tiết đo được: *"her chin sits directly above the shoulder that is furthest from
  the viewer"*.
- Nếu vẫn ra bình thường: **đừng sửa prompt cảnh** — làm keyframe từ chính ảnh
  cảnh trước rồi chỉ đổi mỗi hướng đầu (kỹ thuật đầu mục 8).

### 8b. Nhân vật nằm TRONG một khung (gương, ảnh thờ, màn hình, tranh treo)

Khi 1 nhân vật chỉ được thấy **bên trong 1 hình chữ nhật** trong cảnh, model
rất hay vẽ luôn người đó đứng ngoài phòng. Phải nói tường minh **cả hai vế**:

1. Nằm gọn trong khung: *"filling the frame and contained entirely inside its
   border"*.
2. Cấm đứng ngoài: *"appears ONLY inside the picture frame and must NOT be
   standing on the grass"*.

Kèm 2 việc ở background: mô tả khung đó là **hình chữ nhật RỖNG hoàn toàn**
(*"nothing reflected in it"*), và nếu cảnh chỉ có 1 người thật thì chốt thêm
*"He is the only person actually standing in the room"*.

⚠️ **Nếu định ghép nhân vật vào khung ở khâu HẬU KỲ** (không nhờ AI), prompt
còn phải cấm cả **phản chiếu của chính nhân vật đang đứng đó** — mặc định model
sẽ vẽ mặt anh ta trong gương, thế là mất chỗ ghép.

**Hai lỗi nữa lộ ra khi xem ảnh thật (2026-08-11), đều phải chặn từ BACKGROUND:**

**(a) Đặt khung ở GIỮA thì nhân vật đứng chắn mất.** Bồn rửa + gương ở giữa
khung → người đứng rửa mặt che đúng chỗ cần ghép. Không sửa được bằng prompt
cảnh, vì vị trí gương đã khoá cứng trong ảnh background.
👉 Trong mô tả background, **dạt gương/khung hẳn sang MỘT BÊN** và nói rõ *"the
whole MIDDLE of the room is left completely clear and empty"*. Rồi ở prompt
cảnh, đặt nhân vật sang phía đối diện kèm câu cấm: *"he must NOT stand in front
of it and must NOT overlap it at any point, so the entire mirror rectangle stays
fully visible"*.

**(b) Gương ra màu phẳng lì, không đọc ra là gương.** Tả "plain rectangle with a
flat pale silver surface" ra đúng nghĩa đen: một tấm xám phẳng, nhìn như bảng
treo tường.
👉 Phải cho **tín hiệu hình học của mặt kính**: *"crossed by exactly two thin
pale white diagonal streak shapes running corner to corner"*. Nói **số lượng cụ
thể** ("exactly two") — để mở thì model vẽ loang lổ hoặc thêm gradient, hỏng
phong cách phẳng. Cùng cách này dùng được cho cửa sổ, màn hình, mặt nước.

👉 Khi sửa background loại này, **làm lại TẤT CẢ cảnh dùng nó**, kể cả cảnh
không liên quan tới cái khung (vd cảnh thợ trèo thang trong phòng tắm) — nếu
không, cùng một căn phòng sẽ đổi bố cục giữa các cảnh liền nhau.

**(c) "Dạt sang trái" KHÔNG giống "treo trên tường bên trái".** Vòng sửa thứ
hai của phòng tắm vẫn trượt vì lý do này: mô tả *"on the LEFT side of the
frame"* chỉ dời cái gương sang **mép trái của cùng một mặt tường sau**, trong
khi ý muốn là có hẳn **một bức tường BÊN** để treo lên. Hai chuyện khác nhau,
và câu chữ "bên trái" không phân biệt được.

👉 Muốn có góc phòng mà vẫn giữ phong cách phẳng, tả bằng **số mảng và số
đường**, đừng dùng từ phối cảnh:

> built from exactly TWO flat wall panels meeting along ONE single vertical
> line. The LEFT panel fills roughly the left third and is the SIDE WALL, in a
> slightly DARKER shade… The RIGHT panel is the BACK WALL… Exactly one straight
> diagonal line runs from the foot of the vertical corner line down toward the
> bottom-left corner, so the floor reads as turning at the corner. There are no
> other diagonal lines, no vanishing point, and no rows of tiles shrinking
> toward a distance.

Ba chốt chặn quan trọng: **mảng bên tô đậm hơn** (cho mắt đọc ra là mặt khác),
**đúng 1 đường chéo dưới sàn** (để mở là model vẽ cả lưới gạch hút xa), và câu
gán vật thể tường minh *"the mirror belongs to the LEFT side wall only and must
NOT be drawn anywhere on the other panel"*.

## 9. Khi cần ảnh mới KHÁC ảnh reference (đổi góc, đổi tư thế)

Ảnh **thắng** chữ — kể cả về GÓC NHÌN, không riêng hình dạng. Mô tả trung tính
đặt giữa đoạn sẽ bị bỏ qua hoàn toàn. Phải làm đủ 3 việc:

1. Đưa yêu cầu lên **ĐẦU prompt**, nói thẳng reference sai ở điểm đó ("the
   reference images are front-facing but this new image must NOT be").
2. Diễn đạt bằng **ngôn ngữ HÌNH HỌC quan sát được**, không dùng thuật ngữ
   nhiếp ảnh: "rotated about 45 degrees", "one shoulder closer to the viewer",
   "the nose points off to one side" — thay cho "three-quarter view".
3. **Nhắc lại ở CUỐI prompt**.

Cùng nguyên tắc này áp cho mọi lúc cần ép hình học: đối xứng, đường chân trời
thẳng, chiều cao bằng nhau.

## 9b. ĐẶT TÊN: đừng để tên này là tiền tố của tên kia

`Bob` / `Bob Kitchen` / `Bob Bathroom` / `Bob's Wife` — cách đặt tên này từng
gây lỗi ĐÍNH SAI ASSET âm thầm suốt nhiều mẻ (RUNBOOK 8.1.3l): code cũ tra card
bằng khớp chuỗi con nên tìm `"Bob"` lại lấy `Bob Bathroom V2`, cảnh vẫn tạo ra
bình thường nhưng sai ảnh, không hề báo lỗi.

Code đã sửa sang khớp tên chính xác nên không còn sai nữa. Nhưng vẫn nên đặt
tên **phân biệt rõ ngay từ đầu** — dễ đọc `references`, dễ debug, và không phụ
thuộc vào việc code luôn khớp đúng:

- Nhân vật thêm tiền tố vai: `Homeowner Bob` thay vì `Bob`.
- Hoặc bối cảnh thêm hậu tố: `Bob House Kitchen` — miễn không có tên nào là
  tiền tố trọn vẹn của tên khác.

Rà nhanh trước khi chạy:

```bash
node -e "const a=require('./narration-scripts/<tập>/assets.json').assets.map(x=>x.name);console.log(a.filter(n=>a.some(m=>m!==n&&m.toLowerCase().includes(n.toLowerCase()))))"
```

## 9c. 🔴 SỬA ĐÚNG TẦNG — lỗi lặp lại 2 lần là dấu hiệu sai ở TẦNG TRÊN

Khi người dùng chê cùng một điểm ở nhiều vòng liên tiếp, **dừng việc vá prompt
cảnh lại** và hỏi: lỗi này nằm ở cảnh, hay ở chính Prop/Background mà cảnh đang
dùng?

Ca thật (case 5, thuyền tị nạn): người dùng chê nhân vật "không ở trong thuyền".
Tôi sửa **tư thế trong prompt cảnh** 2 vòng liền (đổi hướng gục đầu, đổi chỗ tựa)
— đều không dứt điểm. Nguyên nhân thật nằm ở **Prop**: mô tả thuyền ghi *"shallow
curved hull"*, mạn thấp hơn vai người ngồi, nên **mọi tư thế** đều lộ thân. Sửa 1
dòng ở Prop giải quyết cả 3 cảnh cùng lúc.

Dấu hiệu nhận biết nhanh:
- Cùng một lời chê xuất hiện ở **nhiều cảnh khác nhau** → gần như chắc chắn lỗi ở
  Prop/Background dùng chung, không phải ở cảnh.
- Sửa cảnh 2 lần vẫn ra vấn đề tương tự → lỗi ở tầng trên.
- Lời chê nói về **tỉ lệ/kích thước/độ sâu** của một vật → tra Prop trước tiên;
  đây là nhóm thuộc tính mà prompt cảnh gần như không ghi đè được.

Sửa ở tầng trên tốn 1 lần tạo lại Prop + N lần tạo lại cảnh, nhưng đó vẫn rẻ hơn
nhiều so với vá vô hạn ở tầng cảnh mà không bao giờ đúng.

## 10. Đặt tên & sửa asset đã tạo sai

Asset đã `success` là **đã tồn tại thật trong Flow dưới tên đó**. Sửa mô tả rồi
giữ nguyên tên → runner tra tên thấy "đã có" và bỏ qua, không bao giờ tạo lại.

👉 **Luôn tạo tên MỚI**: `<tên> V2`, `V3`… Giữ nguyên entry cũ (`status:
"success"` + `notes` ghi rõ lỗi thời và vì sao). **Không xoá, không ghi đè cùng
tên** — trùng tên gây lẫn lộn khi tra reference sau này.

### 10b. Tạo lại 1 CẢNH: đặt lại `status` sẽ tạo card TRÙNG TÊN trong Flow

Mục 10 nói asset phải đổi tên V2 khi sửa. Với **cảnh ghép** thì khác: cách nhanh
nhất để tạo lại là đặt `status: "waiting"` rồi chạy runner — nhưng phải biết hệ
quả: **ảnh cũ vẫn nằm trong Flow dưới đúng tên đó**, nên project sẽ có 2 (hoặc
nhiều) card cùng tên. Xác nhận trực tiếp 2026-08-15 bằng
`check-asset-in-picker.ts`: 2 card "Wu Approaches The Coffin".

Vì sao thường KHÔNG sao (người dùng case 5 chấp nhận): cảnh ghép là khung hình
cuối, hiếm khi được dùng làm reference cho cảnh khác; người dùng chọn ảnh bằng
mắt lúc dựng. Và nếu có cảnh nào tham chiếu tới nó, Flow sắp theo "Recent" nên
card đầu tiên khớp tên chính là bản MỚI NHẤT — thường đúng là bản vừa sửa.

👉 Chỉ cần đổi tên V2 cho cảnh khi cảnh đó **được cảnh khác dùng làm reference**
(kỹ thuật keyframe ở mục 8) — lúc đó trùng tên mới thật sự nguy hiểm.

## 11. Sự cố thường gặp

**Bị chặn "This generation might violate our policies"** → soi lại **cách diễn
đạt MỐI QUAN HỆ giữa các nhân vật** trước tiên (dẫn đi / đuổi theo / cô lập /
đe doạ), không phải số lượng ảnh reference. Viết lại trung tính là qua: "nhóm
dẫn 1 phụ nữ đi sâu vào rừng, cô theo sau" bị chặn → "sáu người bạn cùng đi bộ
đường dài, xếp thành 1 hàng, cùng hướng" qua ngay.

### 11e. Case có án mạng/thi thể: cái rùng rợn nằm ở LỜI KỂ, không nằm trong ảnh

Kênh này kể chuyện có thật nên sẽ gặp án mạng, thi thể, quật mộ. Nguyên tắc đã
chạy qua cả case 3 (hài cốt dưới giếng) và case 4 (Greenbrier) **không lỗi cảnh
nào**: ảnh chỉ cần đủ để người xem HIỂU, phần ghê rợn để giọng đọc gánh.

Công thức đã qua bộ lọc, dùng lại được:
- **Không vẽ chính hành vi** → vẽ khoảnh khắc NGAY TRƯỚC (tay với tới nhưng
  *"stops short of her and does not touch her"*, nạn nhân mất thăng bằng ở mép
  bậc) hoặc NGAY SAU (cầu thang trống, không người).
- **Thi thể** → nằm nghiêng, tay xuôi, váy áo phẳng phiu, mắt nhắm (2 nét cong
  xuống — đúng 1 trong 3 kiểu mắt block cho phép), kèm cấm tường minh:
  *"absolutely NO blood, NO wound, NO injury, NO bruise and NO mark of any kind"*.
- **Quật mộ** → quan tài ĐÓNG, *"nothing at all is drawn inside it"*.
- **Vết thương/vết siết** → đừng vẽ lên người, chuyển thành cảnh **cầm vật
  chứng** (bác sĩ giơ chiếc khăn).
- **Xô xát** → *"neither man touches the other"*, đổi thành giơ tay ra hiệu dừng
  + người kia lùi một bước.

👉 Cảnh nào rủi ro thì **viết sẵn phương án lùi vào `notes` của chính cảnh đó**
lúc soạn prompt, đừng đợi bị chặn rồi mới nghĩ — lúc đó đang giữa mẻ, dễ sửa vội
rồi hỏng cả nhịp kể.

**Runner báo timeout/failed nhưng ảnh ĐÃ có trong Flow (chưa kịp đổi tên)** →
**ĐỪNG chạy lại runner ngay**, nó sẽ tạo thêm 1 ảnh trùng. Làm đúng thứ tự:
1. `npx tsx scripts/rename-orphan.ts "Tên Asset"` (đổi tên ảnh mới nhất).
2. Sửa `status` thành `"success"` trong JSON.
3. Chạy lại runner để xác nhận không còn gì pending.

⚠️ `rename-orphan.ts` chỉ đổi tên ảnh **mới nhất**. Nếu đã tạo thêm thứ khác sau
đó thì ảnh mồ côi không còn ở vị trí 0 nữa — lúc đó đơn giản nhất là đặt lại
`status: "waiting"` cho tạo lại; ảnh mồ côi cũ vô hại vì không ai tra tới nó.

### 11b. Trước khi chạy lại 1 mục lỗi, TRA THẲNG trong Flow xem nó có thật không

```bash
npx tsx scripts/check-asset-in-picker.ts "Tên cần tra" --project <flowProject-của-case>
```

🔴 **`--project` BẮT BUỘC — lấy đúng giá trị `flowProject` trong chính
`assets.json`/`scenes.json` của case đang tra.** Sự cố thật (2026-08-15): script
gọi thiếu cờ này mở `state/project.json` (project mặc định/legacy) thay vì
project của case, nên "0 card" trả về KHÔNG chứng minh được gì — nó tra nhầm cả
project. Bỏ trống thì script tự cảnh báo, nhưng vẫn chạy tiếp và vẫn cho ra kết
quả (sai) trông y hệt kết quả đúng, nên đừng trông chờ có ai giật mình đọc cảnh
báo giữa lúc đang xử lý dồn dập.

Hậu quả nếu tin nhầm: kết luận "chưa tồn tại" rồi chạy lại có thể tạo ra **card
TRÙNG TÊN** trong project thật — 2 asset cùng tên, không biết cái nào mới hơn.
Trót tra sai thì PHẢI tra lại đúng project trước khi tin bất kỳ kết luận nào,
không suy luận tiếp từ kết quả sai.

Script chỉ-đọc: mở bảng chọn media, gõ vào ô "Search assets", in ra **tên thật**
của mọi card hiện lên. Không tốn credit. Dùng để phân biệt 3 tình huống mà log
runner KHÔNG phân biệt được: (a) chưa tạo thật → chạy lại; (b) tạo rồi nhưng
mang tên khác/vô danh → xử lý như ảnh mồ côi; (c) có đủ rồi → chỉ cần sửa
`status`.

### 11c. `status: "success"` KHÔNG chứng minh asset tra được theo tên

Sự cố thật 2026-08-11: `Don Decker Prison` báo `✅ 44.8s` và ghi `status:
"success"`, nhưng trong Flow **không tồn tại dưới tên đó** — bước rename im lặng
không ăn. Lỗi nằm im, tới khi 5 cảnh ghép phụ thuộc nó chạy thì gãy giữa mẻ.

Đã vá bằng `assertAssetNamed()` trong `imageAsset.ts`: sau khi đổi tên, tra lại
đúng bằng cơ chế mà cảnh ghép sẽ dùng, không thấy thì ném lỗi ngay (asset bị
đánh `failed`, lần sau tự tạo lại). Bước này khiến mỗi asset lâu thêm ~25 giây —
đó là giá phải trả, đừng gỡ ra để chạy nhanh hơn.

### 11d. Chrome mồ côi khoá profile sau khi 1 mẻ bị gãy

Mẻ gãy giữa chừng (đóng trình duyệt, kill tiến trình) có thể để lại **tiến trình
Chrome còn sống** giữ `.auth/chrome-profile`. Lần chạy sau Playwright báo
`Opening in existing browser session` rồi chết ngay. Dọn:

```bash
powershell -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { $_.CommandLine -like '*\.auth\chrome-profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
```

⚠️ Lọc theo `.auth\chrome-profile` là BẮT BUỘC — người dùng thường có hàng chục
tab Chrome cá nhân đang mở, giết nhầm là mất hết.

**Đừng mở/đóng cửa sổ Flow của pipeline khi đang chạy** — dùng chung profile,
đóng cửa sổ là giết luôn mẻ đang chạy.

## 12. Lệnh

```bash
npm run banana -- narration-scripts/<tập>/assets.json --case 1
```

```bash
npm run banana-scenes -- narration-scripts/<tập>/scenes.json --case 1
```

Nhớ dấu `--` sau tên script để npm chuyển tiếp đúng flag `--case`. Cả 2 lệnh
resume-safe: bỏ qua `status: "success"`, ghi atomic sau mỗi mục, lỗi 1 mục
không giết cả mẻ.

## 13. Shot dùng ẢNH THẬT (ngoài pipeline)

Với **địa danh có thật**, có thể chèn thẳng 1 ảnh chụp thật làm establishing
shot giới thiệu địa điểm, không qua AI. Pipeline **không có cơ chế nào** cho
việc này — thủ công hoàn toàn lúc dựng, không khai báo trong `assets.json`/
`scenes.json`. Lưu ảnh vào `narration-scripts/<tập>/refs/`.
