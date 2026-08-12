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
4. Viết `assets.json` → `npm run banana -- <file> --case N`.
5. **Người dùng xem bằng mắt** trước khi đi tiếp — sai bối cảnh mà ghép cảnh
   luôn thì hỏng hàng loạt.
6. Viết `scenes.json` → `npm run banana-scenes -- <file> --case N`.

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
- Ảnh master khoá cứng vài đặc điểm (tóc dài 2 bên, trang phục nhiều lớp…).
  Muốn khác thì **phải nói tường minh** ("tóc búi gọn không buông", "váy 1 lớp
  không khoác ngoài") — đã xác nhận là ghi đè được.
- **Nhân vật phụ**: KHÔNG gộp nhiều vai vào 1 asset chung nếu họ có thể xuất
  hiện **cùng khung hình** (sẽ trông như nhân bản 1 người). Chỉ dùng asset
  chung cho đám đông nền không cần nhận diện. Phân vân thì **hỏi người dùng**.

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
  | `"flat"` (mặc định) | Kiến trúc, phố xá, dãy nhà, mặt tiền — phông phẳng kiểu sân khấu |
  | `"layered"` | Phong cảnh thiên nhiên rộng (núi xa → làng giữa → ruộng gần) |
  | `"corner"` | **Phòng TRONG NHÀ sẽ ghép nhân vật vào** — xem ngay dưới |

  🔑 **Vì sao có `"corner"` (người dùng chốt 2026-08-11)**: nhân vật do pipeline
  sinh ra đều ở **góc 3/4**. Đặt người 3/4 lên nền phẳng tuyệt đối thì người có
  chiều mà nền thì không — nhìn như **dán đè lên**. Một góc phòng nhẹ (2 mảng
  tường gặp nhau ở 1 đường dọc, mảng bên foreshorten nhẹ) cho nhân vật chỗ đứng
  hợp lý. Vẫn cấm cảnh hút sâu thật.

  ⚠️ Đừng cố đạt hiệu ứng này bằng cách viết mô tả góc phòng trong khi để
  `composition: "flat"` — runner sẽ nhét `NO_PERSPECTIVE_BLOCK` vào và bạn đang
  đánh nhau với chính prompt của mình. Lần đầu ăn may thắng được, lần sau chưa
  chắc. Đặt đúng `"corner"`.
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

## 10. Đặt tên & sửa asset đã tạo sai

Asset đã `success` là **đã tồn tại thật trong Flow dưới tên đó**. Sửa mô tả rồi
giữ nguyên tên → runner tra tên thấy "đã có" và bỏ qua, không bao giờ tạo lại.

👉 **Luôn tạo tên MỚI**: `<tên> V2`, `V3`… Giữ nguyên entry cũ (`status:
"success"` + `notes` ghi rõ lỗi thời và vì sao). **Không xoá, không ghi đè cùng
tên** — trùng tên gây lẫn lộn khi tra reference sau này.

## 11. Sự cố thường gặp

**Bị chặn "This generation might violate our policies"** → soi lại **cách diễn
đạt MỐI QUAN HỆ giữa các nhân vật** trước tiên (dẫn đi / đuổi theo / cô lập /
đe doạ), không phải số lượng ảnh reference. Viết lại trung tính là qua: "nhóm
dẫn 1 phụ nữ đi sâu vào rừng, cô theo sau" bị chặn → "sáu người bạn cùng đi bộ
đường dài, xếp thành 1 hàng, cùng hướng" qua ngay.

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
npx tsx scripts/check-asset-in-picker.ts "Tên cần tra"
```

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
