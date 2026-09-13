# SPEC v2 — prompt ảnh dạng JSON, ảnh tư liệu có ghi nguồn, nhân vật có thật

Artifact của luồng `img-prompts-v2-json` (bước 5). Thay cách tổ chức của
`image-prompts/SHOT-LIST.md` (bảng Markdown phẳng), giữ nguyên nội dung 385 dòng
đã qua 3 vòng review.

Ba việc Tú giao 2026-09-11: ảnh tư liệu tìm trước và ghi rõ agent nào tìm ra;
prompt viết theo từng loại nội dung, nhân vật có thật thì tạo một lần rồi dùng
lại; prompt lưu dạng JSON neo được vào đoạn nội dung.

---

## 1. Nhân vật có thật: ĐO RỒI, kết quả ngược với RUNBOOK

RUNBOOK mục 8 ghi *"KHÔNG dùng tên riêng người thật/nổi tiếng trong prompt — Nano
Banana/Gemini chặn theo chính sách Google"*. **Đo lại 2026-09-11 trên Flow chế độ
Image: câu đó KHÔNG còn đúng.**

| Prompt thử | Kết quả |
| --- | --- |
| `a portrait of Abe Reles, the 1930s Brooklyn gangster` | tạo được, 65,8s — **không bị chặn** |
| `a portrait of Winston Churchill` | tạo được, 65,5s — **không bị chặn** |

Nhưng nhìn ảnh ra thì **vẫn không nên gọi tên**, vì ba lý do khác hẳn lý do cũ:

1. **Tên nổi tiếng kéo theo cả phong cách của nó.** Ảnh Churchill ra **giống
   thật** — hói, cằm xệ, nơ, điếu xì gà — nhưng vẽ theo lối minh hoạ halftone
   sạch sẽ, **không hề giống kiểu vẽ chuột vụng về** mà khối style yêu cầu. Tiên
   nghiệm "chân dung danh nhân" thắng khối style.
2. **Tên ít nổi tiếng thì model viết luôn cái tên vào ảnh.** Ảnh Reles có dòng
   chữ `ABE RELES 1940` đóng ngay dưới mặt. Đúng loại chữ rác đã phải đi vá suốt
   ba vòng review của luồng trước.
3. **Tên ít nổi tiếng không cho ra dung mạo thật.** Người trong ảnh đội mũ phớt,
   mặt gầy — trong khi ảnh tư liệu thật (`refs/A1/01-reles-portrait-loc__codex.jpg`)
   là người mặt bầu rộng, hàm bạnh, tóc dày gợn sóng hất ngược, không đội mũ. Gọi
   tên không mua được gì.

👉 **Luật: mô tả ngoại hình, không gọi tên.** Kết luận giống RUNBOOK, lý do khác
hẳn — và lần này có số đo. Ai muốn lật lại thì đo lại, đừng suy từ chính sách.

Đường đi:

```
ảnh thật → soi bằng mắt → viết MÔ TẢ NGOẠI HÌNH → tạo 1 asset
         → mọi cảnh sau của nhân vật đó ĐÍNH LẠI asset đã tạo
```

⚠️ **Luật 6 của SHOT-LIST v1 ("không vẽ chân dung người thật") bị Tú lật ngược
2026-09-11.** Ghi rõ ở đây để phiên sau đọc file cũ không làm ngược lại.

---

## 2. Ảnh tư liệu: lưu ở đâu, ghi ai tìm ra

```
image-prompts/refs/<segmentId>/
  manifest.json
  01-reles-portrait-loc__codex.jpg
  02-half-moon-hotel__codex.jpg
```

**Đuôi `__<agent>` nằm trong TÊN FILE**, không chỉ trong manifest: tên file sống
sót qua mọi lần chép/gửi, manifest lệch ngay lần đầu ai kéo thả. Ba giá trị hợp
lệ: `claude`, `codex`, `gemini`.

### 2a. `foundBy` ≠ `verifiedBy`

Lượt review chạy **chế độ chỉ đọc**, nên Codex và Gemini **không tải file về
được** — họ chỉ nộp URL. Ai mở ảnh ra nhìn là việc của lượt tác giả. Hai trường
riêng biệt, đừng gộp.

Bằng chứng vì sao phải tách: trong 4 URL Codex nộp cho A1, **1 cái là thumbnail
120×150 không đọc nổi nét mặt** (phải đổi sang bản dẫn xuất lớn của LOC), và **1
cái trả về HTML chứ không phải ảnh**. URL do agent khác nộp là **ứng viên**, chưa
phải tư liệu.

### 2a-bis. Trùng nguồn thì KHÔNG tải lại — ghi `alsoFoundBy`

Tú chốt 2026-09-11: agent sau tìm ra đúng thứ agent trước đã tìm thì **không lưu
thêm file**, chỉ ghi vào ảnh đã có:

```json
"alsoFoundBy": [
  { "agent": "gemini", "sourceUrl": "https://…", "query": "…", "note": "cùng ảnh, khác kích cỡ" }
]
```

Báo cáo cho Tú theo dạng *"agent X tìm được nguồn tương tự, đã lưu ở
`<tên file>`"* — không đẻ ra `05-…__gemini.jpg` trùng nội dung với
`01-…__codex.jpg`.

Hai agent độc lập cùng ra một nguồn **không phải là công vô ích** — đó là đối
chứng, và nó đáng ghi lại. Cái phải tránh chỉ là file trùng nằm trong thư mục.

⚠️ **"Tương tự" phải xét bằng nội dung, không bằng URL.** Ca thật ở A1: ảnh
Commons `04-…__claude.jpg` và ảnh LOC `01-…__codex.jpg` có URL khác hẳn, tên
file khác, kích cỡ khác — nhưng mở ra thì là **cùng một buổi chụp**, cùng áo,
cùng cà vạt, cùng nếp tóc. Hai file đó vẫn giữ cả hai vì độ nét khác nhau đáng
kể, nhưng `note` phải ghi rõ chúng không phải hai góc.

### 2b. Mỗi ảnh phải ghi nó là bằng chứng cho CÁI GÌ

Không phải mọi ảnh trong `refs/` đều là bằng chứng ngang nhau. Bốn trường bắt
buộc:

| Trường | Nghĩa |
| --- | --- |
| `sourceKind` | ảnh báo chí / ảnh tư liệu / bưu thiếp tô màu / tranh vẽ / tượng đài |
| `dated` | niên đại biết được, hoặc `"KHONG RO"` — không được bỏ trống |
| `evidenceFor` | ngoại hình · hình khối công trình · trang phục thời kỳ · hình dáng vật |
| `verifiedBy` | agent đã mở ảnh ra nhìn |

Ca thật trong A1: bưu thiếp Half Moon Hotel **đã tô màu lại** → là bằng chứng về
*hình khối*, **không** phải về màu. Ảnh cảnh sát chụp **9-1942**, tức sau cái chết
của Reles 10 tháng → bằng chứng về *trang phục thời kỳ*, không phải về hiện
trường. Tượng đài và tem tưởng niệm **không tự chứng minh khuôn mặt thật** —
nhân vật chỉ có hình dung đời sau phải đánh dấu là minh hoạ suy đoán.

### 2c. Tải xong phải kiểm toàn vẹn

**HTTP 200 không bảo đảm file đủ.** Ba lần tải đầu cho A1 đều cụt giữa chừng mà
`curl` không báo lỗi: ảnh Reles dừng ở 22 KB (đủ là 121 KB), ảnh cảnh sát dừng ở
14 KB (đủ là 239 KB). Mở ra chỉ thấy một dải pixel rồi nhiễu đen.

```bash
tail -c 2 <file>.jpg | od -An -tx1 | tr -d ' \n' | grep -q ffd9   # JPEG đủ
```

Không có `FFD9` thì tải lại, đừng ghi vào manifest.

### 2d. Ghi cả truy vấn trượt

`searched[]` ghi **cả truy vấn không ra gì** — luật mục 4b của skill
`case-reference-images`: không ghi thì phiên sau cày lại đúng luống đã cày.
`stillMissing[]` ghi cái còn thiếu và vì sao.

**Không tra giấy phép, không lọc theo license** (Tú chốt 2026-08-15). Ngoại lệ
duy nhất: khi định chèn thẳng ảnh chụp thật vào video.

---

## 3. Sáu loại nội dung

| `kind` | Dùng cho | Cách viết | Cần ảnh tư liệu? |
| --- | --- | --- | --- |
| `object` | vật đơn, dụng cụ, phương tiện | danh từ + 2-4 chữ bổ nghĩa | chỉ khi thuộc thời kỳ cụ thể |
| `place` | công trình, địa hình | một phần tử, không tả cả khu vực | có, nếu là địa danh thật |
| `figure` | **một người vô danh** — vai minh hoạ | tả nghề/trang phục/hành động, không tả mặt | trang phục thời kỳ, không cần chân dung |
| `group` | nhiều người cùng một hành động | tả hành động chung | không |
| `symbol` | icon, huy hiệu | tả hình, kèm `no text` | không |
| `character` | **người có thật, cần nhận ra** | mục 4 | **bắt buộc có chân dung** |

`figure` là loại mới, thêm vì A1 đã có sẵn ba ca không loại nào chứa nổi:
`A1-05` bác sĩ cầm bảng kẹp, `A1-12` cảnh sát đứng gác, `A1-17` cảnh sát ngủ trên
ghế. Những vai này **không có danh tính để đi tìm chân dung**, nhưng cũng không
phải đồ vật và không phải nhóm.

Ba luật cũ giữ nguyên cho mọi `kind`: cấm chữ trong ảnh, cấm mũi tên và ký hiệu
hậu kỳ, cấm định vị tương đối giữa hai vật rời.

🗺️ **Ngoại lệ — Tú chốt 2026-09-13: chữ trong ảnh bản đồ được chấp nhận:** ảnh **bản đồ** được có chữ tên địa danh; ghi nguyên văn tên
trong prompt và soi chính tả khi ra ảnh (skill `nano-banana-image-prompts` 4d-bis phần 4a).

---

## 4. `kind: "character"`

### 4a. Mô tả gì

Soi ảnh tư liệu rồi viết đúng sáu nhóm, không viết gì ngoài sáu nhóm này: tuổi
ước chừng và vóc người · hình khuôn mặt · tóc (kiểu cắt, chân tóc, rẽ ngôi) ·
râu nếu có · lông mày/mắt **chỉ khi đặc biệt đến mức nhận ra được** · trang phục
đúng thời kỳ.

Không tả biểu cảm, không tả tư thế, không tả tỉ lệ cơ thể — ba thứ đó quyết theo
từng cảnh, hoặc đã bị ảnh asset cố định.

> **Mô tả phải rút ra từ ảnh đã MỞ RA NHÌN.** Bản v1 của spec này có một mô tả
> Reles viết từ trí nhớ (*"tóc chải ngược có rẽ ngôi lệch"*); mở ảnh thật ra thì
> tóc **gợn sóng rõ kiểu uốn marcel, hất ngược, không có đường rẽ ngôi rạch
> ròi**. Sai ngay ở chi tiết dễ nhận ra nhất.

### 4b. Tạo một lần, dùng lại mãi

Shot sinh ra nhân vật khai `"produces": "<assetId>"`. Mọi shot sau khai
`"useAsset": "<assetId>"` và **không lặp lại mô tả ngoại hình** — chỉ tả cái thay
đổi.

⚠️ **Ảnh reference THẮNG mô tả bằng chữ** (RUNBOOK mục 8). Asset gốc sai chi tiết
gì thì mọi cảnh sau lặp lại đúng lỗi đó. **Duyệt kỹ asset nhân vật trước khi
dùng nó cho cảnh thứ hai.**

### 4c. Không có ảnh thật

Theo skill `case-reference-images` mục 4c: tranh vẽ/bản khắc cùng thời, tượng
đài, tem — và **đánh dấu là hình dung đời sau** (mục 2b). **Cấm ảnh diễn viên
hoá trang.** Không có gì cả thì hạ xuống **`figure`** (không phải `group` hay
`object` — người vẫn là người), và ghi lý do vào manifest.

---

## 5. Định dạng JSON

Một file cho một video: `image-prompts/<videoId>.shots.json`.

```json
{
  "video": {
    "id": "nRiezhIOHH0",
    "title": "How History's Deadliest Hitmen Died",
    "transcript": "input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md"
  },
  "styleBlock": { "source": "scripts/build_image_prompts.py:STYLE_BLOCK", "version": 2 },
  "assets": [
    { "id": "char-reles", "flowAssetName": "Reles Ref Broad Face Wavy Hair" }
  ],
  "segments": [
    {
      "id": "A1",
      "title": "Abe Reles",
      "start": "0:00",
      "end": "1:19",
      "refs": "image-prompts/refs/A1/",
      "shots": [
        {
          "id": "A1-01",
          "at": "0:00",
          "cue": "the top freelance killer",
          "kind": "character",
          "outName": "Reles Ref Broad Face Wavy Hair",
          "draw": "a man in his early thirties, broad heavy face, wide jaw and strong chin, thick neck, heavy dark eyebrows almost meeting, heavy-lidded eyes, broad nose, short dark wavy hair swept back with the hairline receding at the temples, clean shaven, in a dark overcoat over a white shirt and a dark patterned tie",
          "refs": ["05-reles-mugshot-1940-jjay__codex.jpg", "01-reles-portrait-loc__codex.jpg"],
          "produces": "char-reles"
        },
        {
          "id": "A1-03",
          "at": "0:09",
          "cue": "preferred an ice pick to a gun",
          "kind": "object",
          "outName": "Ice Pick Wooden Handle",
          "draw": "an ice pick with a bulbous wooden handle and a long tapering metal spike",
          "refs": ["07-ice-pick-awl-1930s-pemberton__codex.jpg"]
        },
        {
          "id": "A1-12",
          "at": "0:37",
          "cue": "guarded by 18 cops",
          "kind": "figure",
          "outName": "Police Officer Standing Guard",
          "draw": "a police officer in a dark 1940s tunic and peaked cap standing guard",
          "refs": ["03-nyc-policeman-1942-loc__codex.jpg"]
        },
        {
          "id": "A1-13",
          "at": "0:44",
          "cue": "found dead on the roof",
          "kind": "character",
          "outName": "Same Man Lying Face Down",
          "draw": "the same man lying face down, arms slack",
          "useAsset": ["char-reles"]
        }
      ]
    }
  ]
}
```

### 5a. `assets[]` giữ ánh xạ, `produces` giữ quan hệ

`assets[]` **chỉ** có `id` và `flowAssetName`. Không có `createdBy` — shot nào
sinh ra asset thì chính shot đó khai `produces`, ghi hai chiều là chắc chắn lệch.

Runner tra `useAsset` → `assets[].id` → lấy `flowAssetName` → truyền vào
`createImageIngredient(..., reference: [flowAssetName])`. Đây là điểm bản v1 sai:
nó bảo truyền thẳng `assetId`, trong khi `attachExistingAssets` tìm theo **tên
trên Flow** và đòi khớp chính xác (`src/veo3bot/imageAsset.ts`).

### 5a-bis. 🔴 Tên ảnh ĐẦU RA phải khác tên asset tham chiếu

Mỗi shot có **`outName`** riêng — tên card mà shot đó tạo ra trên Flow. Nó
**không bao giờ** được trùng với `flowAssetName` của asset mà chính shot đó đính
làm reference.

Vì sao chí mạng: `createImageIngredient` mở đầu bằng nhánh chống tạo trùng —

```ts
if (await assetAlreadyExists(page, name, projectUrl)) { ...; return; }   // imageAsset.ts:470
```

`return` này đứng **trước** cả bước tạo ảnh lẫn bước đính reference. Nếu A1-13
lấy tên đầu ra bằng chính tên asset nó đang tham chiếu, thì Flow thấy tên đó tồn
tại rồi và **bỏ qua cả shot** — trong khi runner vẫn chạy trót lọt và báo thành
công. Mất trắng một cảnh mà không có một dòng lỗi nào.

Quy ước đặt tên để hai thứ không bao giờ đụng nhau:

| | Tên |
| --- | --- |
| asset dùng lại (`assets[].flowAssetName`) | có hậu tố `Ref` — `Reles Ref Broad Face Wavy Hair` |
| ảnh đầu ra (`shots[].outName`) | tả chính cảnh đó — `Same Man Lying Face Down` |

Shot có `produces` thì `outName` **chính là** `flowAssetName` của asset nó sinh
ra — đó là shot duy nhất được phép trùng, vì nó là cái tạo ra asset.

Runner đặt tên card bằng `outName`, **không** bằng `nameFor(prompt)` như hiện
tại.

### 5a-ter. `useAsset` là MẢNG

Một cảnh có thể có hai nhân vật có thật cùng xuất hiện. `createImageIngredient`
vốn đã nhận `reference: string[]`, nên giới hạn một chuỗi là do spec tự đặt ra
chứ không phải do code.

```json
"useAsset": ["char-reles", "char-strauss"]
```

### 5b. `cue` phải là trích NGUYÊN VĂN

`cue` là thứ neo prompt vào đoạn nội dung. Luật: **chuỗi con nguyên văn của
transcript**, sau khi bỏ mốc `[m:ss]` và gộp khoảng trắng, và phải nằm **trong
đoạn của segment đó**.

Bản v1 sai ngay ở ví dụ: cue `found dead on the kitchen roof` là **diễn đạt
lại** — transcript ghi `found dead on the roof of the hotel's`, còn chữ `kitchen`
nằm ở khối sau. Codex bắt được bằng cách parse chính khối JSON đó rồi đối chiếu.

`build_image_prompts.py` phải **kiểm tự động**: cue không tìm thấy, hoặc tìm
thấy nhiều chỗ trong segment, thì báo lỗi và dừng.

Chọn trích chữ thay vì số dòng vì số dòng chết ngay khi đổi tham số `--block`
của `vtt_to_transcript.py`.

### 5b-bis. `at` SUY RA TỪ `cue`, không gõ tay

Cue thắng khi hai thứ bất đồng. Và `at` không nên do người gõ: bản
`<video>.en-orig.vtt` có **thời gian từng chữ**, nên `build_image_prompts.py`
tra được chữ đầu của `cue` rồi tự điền `at`.

Vì sao bỏ cách gõ tay: chính hai ví dụ trong spec đã sai. Tôi ghi `A1-12` ở
`0:46` và `A1-13` ở `0:50`, trong khi VTT cho thấy `guarded` bắt đầu ở
`0:36.960` và `found` ở `0:44.080` — lệch 9 và 6 giây, gấp đôi tới gấp ba mức
sai số ±3 giây mà chính spec cam kết. Hậu quả nếu dựng theo: **hình người gác
hiện lên lúc lời đã chuyển sang phát hiện thi thể.**

Bộ kiểm "cue có nằm trong segment không" vẫn cho cả hai qua — nên nó **không
đủ**. Phải đối chiếu tới mức thời gian chữ.

🔴 **Ngoại lệ — kịch bản của kênh (`narration-scripts/`), Tú chốt 2026-09-13:** `at` giữ
**CÂU LỜI KỂ chứa `cue`** (nguyên văn, trọn câu), **không** giữ mốc thời gian. Lý do: tập của
kênh chỉ có file mp3, chưa có VTT thời gian từng chữ, nên mốc chỉ ước tính được bằng vị trí chữ
chia đều trên thời lượng — lệch tới ±5 giây, đúng loại số sai mà mục này đã cảnh báo. Lúc dựng,
tìm chữ trong kịch bản chắc hơn dò một con số sai. Ví dụ:
`narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json`.
Video có VTT (Brofessor Stein) giữ nguyên cách suy `at` từ thời gian chữ. Bản đọc để Tú duyệt
prompt trước khi chạy: `python scripts/review_shots.py <file>.shots.json --log <log mẻ>`.

### 5c. Từng trường

| Trường | Bắt buộc | Nghĩa |
| --- | --- | --- |
| `shots[].id` | ✓ | mã ổn định, không đổi khi chèn thêm shot |
| `shots[].at` | ✓ | mốc trong video. **Máy suy ra từ `cue`** — xem 5b-bis |
| `shots[].cue` | ✓ | trích nguyên văn transcript — xem 5b |
| `shots[].kind` | ✓ | một trong sáu loại ở mục 3 |
| `shots[].outName` | ✓ | tên card đầu ra trên Flow. **Không được trùng tên asset mình tham chiếu** — xem 5a-bis |
| `shots[].draw` | ✓ | prompt thô. Khối style nối vào lúc build |
| `shots[].refs` | | tên file trong `refs/<segmentId>/`. Bắt buộc với `character` **tạo asset** (có `produces`), và với `object`/`place` thuộc thời kỳ cụ thể. Shot `character` **dùng lại** asset thì kế thừa — xem 5c-bis |
| `shots[].produces` | | shot này tạo ra asset dùng lại được; khi đó `outName` = `flowAssetName` của asset đó |
| `shots[].useAsset` | | **mảng** id asset đính làm reference — xem 5a-ter |
| `shots[].mention` | | prompt dạng **chip `@` xen giữa câu** (cách Tú prompt), chỗ chèn chip là `{{tên ảnh}}`. Khai trường này thì `draw`/`style`/`refImages` của shot đó **không dùng nữa** — xem 5d |
| `shots[].refImages` | | **mảng** tên file trong `refs/<segmentId>/` được ĐÍNH THẬT lên Flow. Chỉ cho nơi chốn đặc biệt — xem mục 6 |
| `shots[].style` | | khối style riêng, **THAY** khối chung + phần theo `kind`. Dùng cho shot có `refImages` |
| `shots[].intent` | | người xem cần hiểu gì từ ảnh này; vật tượng trưng ghi rõ **VẬT TƯỢNG TRƯNG** (skill 4d-bis) |
| `shots[].anhSeRa` | | mô tả tiếng Việt ảnh prompt **sẽ vẽ ra**, để Tú duyệt trước khi chạy — in bằng `scripts/review_shots.py` |
| `shots[].anhSeRaHash` | | sha1 (12 ký tự đầu) của prompt nguyên văn trong `.jobs.json` lúc viết `anhSeRa`; lệch thì bản review báo mô tả đã cũ |
| `shots[].canSoi` | | rủi ro đã biết, cần soi khi ra ảnh |
| `shots[].choTuLieu` | | lý do shot **chưa được chạy** vì thiếu ảnh tư liệu đối chiếu (skill 4d-bis phần 2) |

Và ở cấp file, cạnh `styleBlock`:

| `styleByKind` | | `{kind: "câu nối thêm"}` — nối vào sau khối chung, chỉ cho `kind` đó. Đang dùng cho luật "nhân vật đủ từ đầu đến chân": câu đó **không được** nối vào prompt đồ vật, vì nói "cả người từ đầu đến chân" trong prompt một cái ice pick là mời model vẽ thêm người |

Không bắt buộc `end` cho từng shot: `at` + `cue` đủ chỉ đoạn lời đang minh hoạ,
còn thời điểm tắt phần tử là việc dựng phim.

### 5d. `mention` — chip `@` xen giữa câu (Tú chốt 2026-09-12)

Cách prompt Tú đang dùng, và là cách ĐÚNG cho ảnh nơi chốn có ảnh tư liệu:

```json
"mention": "draw a {{09-half-moon-hotel-1927-cihp__claude.jpg}} with the same style as {{01-pyramid-place.png}}, no lettering, no signs, no people"
```

Câu TỰ NÓI ảnh nào giữ vai **hình khối** và ảnh nào giữ vai **nét vẽ**. Cách cũ
(đính 3-4 ảnh qua bảng chọn + một khối style 5 câu) buộc model tự đoán vai, và nó
đoán sai hai lần: bản đầu lấy nét của ảnh chụp nên ra bản vẽ kiến trúc, bản sau
lấy cả CHỮ trên biển hiệu trong ảnh chụp.

- Tên trong `{{...}}` tra theo thứ tự: `refs/<segmentId>/`, rồi
  `input/style-ref/_anchors/`. Không thấy cả hai thì coi là tên asset đã có trên
  Flow (runner tra trong bảng chọn khi gõ `@`).
- Builder xuất `promptParts` + cờ `noAnchors`: shot mention **không** được đính
  thêm ảnh neo, vì ảnh không được nhắc tên trong câu là ảnh không rõ vai.
- Tên card (`outName`) **không** đi vào prompt ở đường này (đường cũ gõ
  `${outName}: ${draw}`) — chèn thêm là model vẽ chuỗi đó thành chữ, đúng bẫy D12.

Cơ chế UI và ba cái bẫy của nó: xem `typeMentionPrompt` trong
`src/veo3bot/imageAsset.ts` và RUNBOOK mục 0.

### 5c-bis. Shot `character` dùng lại asset thì KẾ THỪA `refs`

Luật `refs` bắt buộc với `character` chỉ áp cho shot **tạo ra** nhân vật — shot
có `produces`. Shot dùng lại thì đi theo đường
`useAsset → assets[].id → shot có produces tương ứng → refs của shot đó`.

Vì sao không bắt khai lại: tư liệu chân dung đã làm xong việc của nó ở shot tạo
asset. Từ đó trở đi **ảnh asset mới là thứ neo dung mạo**, không phải ảnh tư
liệu — đúng bài học "ảnh reference thắng mô tả bằng chữ" ở mục 4b. Bắt khai lại
`refs` chỉ tạo ra chỗ để lệch, không thêm thông tin nào.

Bộ kiểm phải cài đúng luật này: `A1-13` có `kind: "character"` và **không có**
`refs` — đó là hợp lệ, không phải thiếu sót.

---

## 6. Cái gì đổi trong code

- `build_image_prompts.py` đọc `.shots.json`; kiểm `cue` theo 5b; suy `at` từ
  thời gian chữ theo 5b-bis; xuất mỗi shot kèm **hai trường tách biệt**:
  `outName` (tên card sẽ tạo) và `refNames` (mảng `flowAssetName` đã tra sẵn từ
  `useAsset`).
- `try-image-prompts.ts` đặt tên card bằng **`outName`** — không phải
  `flowAssetName`, không phải `nameFor(prompt)` — và truyền `refNames` vào
  `createImageIngredient(..., reference: refNames)`.

  Hai giá trị của A1-13, để khỏi nhầm lần nữa:

  | | Giá trị |
  | --- | --- |
  | `outName` (tên card tạo ra) | `Same Man Lying Face Down` |
  | `refNames` (đính làm reference) | `["Reles Ref Broad Face Wavy Hair"]` |

  Lấy `flowAssetName` làm tên card cho một shot **không có** `produces` là dựng
  lại đúng cái bẫy ở 5a-bis: nhánh chống trùng thấy tên đã tồn tại và bỏ qua cả
  shot mà vẫn báo thành công.
- **`refs` KHÔNG bao giờ tới runner.** Đây là chỗ dễ hiểu nhầm nhất của mục này,
  nên nói thẳng: file trong `refs/<segmentId>/` là **ảnh để người viết soi bằng
  mắt**, không phải ảnh đính vào prompt. Chúng dừng lại ở bước viết `draw`.

  Lý do là luật đã chốt từ 2026-08-15 trong skill `case-reference-images` mục 4:
  *"ảnh nhân vật thật chỉ để soi bằng mắt rồi viết ra mô tả chữ — KHÔNG đính làm
  ảnh reference"*. Đính ảnh chụp thật vào Nano Banana thì model kéo cả khuôn mặt
  thật vào ảnh, mà thứ ta cần là một bức vẽ chuột vụng về, không phải bản sao
  chân dung.

  Nên `build_image_prompts.py` **không xuất `refs`** ra file prompt. Chỉ có
  `refNames` (asset ĐÃ TẠO trong Flow, tra từ `useAsset`) mới đi tiếp tới
  `createImageIngredient`.

  🔴 **NGOẠI LỆ, Tú chốt 2026-09-12: `refImages` thì CÓ tới runner.** Trường mới,
  tách hẳn khỏi `refs` để không ai nhầm hai thứ: `refs` vẫn là ảnh để soi bằng
  mắt, `refImages` là danh sách ảnh **được phép đính thẳng lên Flow** (builder
  đổi thành đường dẫn tuyệt đối rồi nhét vào `refNames`; `attachReferences` thấy
  file có thật thì upload — xem `src/veo3bot/imageAsset.ts`).

  **Chỉ dùng cho NƠI CHỐN ĐẶC BIỆT.** Lý do đo được: `A1-11` tả khách sạn Half
  Moon bằng chữ rất chi tiết và **đúng** (thân gạch chữ nhật thu bậc, tháp chuông
  kiểu Phục hưng Tây Ban Nha, dãy nhà thấp phía trước) mà ảnh ra là một toà nhà
  **vòm đối xứng** không liên quan gì. Chữ không neo được hình khối kiến trúc.
  Lý do cũ ("model kéo khuôn mặt thật vào ảnh") **vẫn đúng cho NGƯỜI** — ngoại lệ
  này không mở cho `character`/`figure`/`group`.

  Shot dùng `refImages` phải khai luôn `style` riêng để ép nét vẽ tay, nếu không
  ảnh chụp thật sẽ kéo kết quả về phía ảnh chụp.

  🗺️ **MỞ RỘNG 2026-09-13 — BẢN ĐỒ THAM CHIẾU** (luồng `img-skill-nhieu-anh-moi-cau`, settled; skill 4d-bis phần 4a):
  shot bản đồ **được** đưa một **bản đồ tham chiếu hình dạng** trong `refs/` lên Flow bằng chip `@` làm hình khối:
  `"draw a map shaped like {{<bản đồ tham chiếu>}} with the same style as {{01-pyramid-place.png}}, fill <vùng> with
  one flat red colour and label it "<TÊN>"…"`. Cùng lý do với khách sạn `A1-11`: chữ mô tả không neo được hình khối,
  bờ biển sai là nhận ra ngay. **Tú chốt 2026-09-13: chữ trong ảnh bản đồ được chấp nhận**, nên bản đồ tham chiếu có chữ cũng được —
  tránh bản đồ chữ viết tay cổ. Chưa có bản đồ tham chiếu thì shot mang `choTuLieu` và không chạy. Builder đã tra
  `{{tên}}` trong thư mục `segments[].refs`.

- `SHOT-LIST.md` hạ xuống thành bản **sinh ra từ JSON**, không còn là nguồn sự
  thật.

Chuyển 385 dòng sang JSON là việc máy làm, chạy sau khi spec chốt.
