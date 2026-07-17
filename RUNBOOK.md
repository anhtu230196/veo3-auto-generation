# veo3-story-pipeline — Runbook đầy đủ (đọc file này trước khi làm gì cả)

Tài liệu này dành cho 1 phiên Claude Code MỚI (context đã bị clear, hoặc máy khác)
tiếp quản dự án. Nó gộp toàn bộ kiến trúc, cách chạy, trạng thái hiện tại, VÀ các
bug/bài học đã tốn rất nhiều thời gian mới tìm ra — đọc kỹ phần "Bài học xương
máu" (mục 4) trước khi sửa code trong `veo3bot/`, để không lặp lại đúng những lỗi
đã mất công sửa.

## 0. Trạng thái hiện tại (đọc đầu tiên)

- **Kịch bản đang dùng**: câu chuyện Christopher Columbus / Rodrigo de Triana
  (1492, ai thực sự nhìn thấy đất liền trước) — KHÔNG PHẢI truyện true-crime cũ.
  168 cảnh (`state/scenes.json` / `state/prompts.json`).
- **Phong cách hình ảnh**: 2D flat vector illustration (không photorealistic).
  Xem `src/styleDNA.ts` — nguồn duy nhất định nghĩa style.
- **`state/characters.json`, `state/prompts.json`, `state/settings.json`,
  `state/props.json`** đều do **Claude viết tay trực tiếp trong hội thoại**
  (không gọi Gemini) — xem mục 1 để hiểu vì sao việc này khả thi.
- **Đã generate xong `output/clips/clip_000.mp4` → `clip_017.mp4`,
  `clip_026.mp4`, `clip_028.mp4`** (20/168 cảnh) tính đến thời điểm ghi tài liệu
  này. Chạy `npm run run` để tiếp tục — resume-safe, tự bỏ qua clip đã có.
- **Git đã init** (KHÔNG có remote) — dùng `git status`/`git diff` để xem thay
  đổi thay vì hỏi lại. `state/`, `output/`, `.env`, `.auth/`,
  `input/story.txt` đều bị `.gitignore` — không nằm trong git.
- **Việc CHƯA xác nhận xong**: cơ chế "Style Anchor" (neo phong cách cho cảnh
  không có Ingredient nào) đang ở phiên bản thứ 3, vừa sửa xong lỗi khung viền
  bị lẫn vào video — CHƯA có xác nhận cuối cùng là clip #0/#5 sau khi tạo lại
  đã ổn hoàn toàn chưa. Xem mục 4.16.

## 1. Dự án làm gì

Chuyển 1 kịch bản văn bản (lịch sử/khám phá — hiện tại: Columbus 1492) thành 1
video hoạt hình phong cách 2D flat vector, hình ảnh AI tạo bởi Veo3 (qua Google
Flow), nhân vật/bối cảnh/đạo cụ đều giữ hình ảnh nhất quán xuyên suốt qua cơ chế
Ingredient (`@mention`) của Flow.

**3 loại Ingredient** (khác biệt quan trọng nhất so với bản gốc dự án — xem mục
3 để hiểu cách tạo từng loại):
- **Character** (`state/characters.json`) — nhân vật có tên riêng, tạo qua menu
  Flow "Add Media → Create Character" (đã xác nhận ổn định từ đầu dự án).
- **Setting** (`state/settings.json`) — bối cảnh/địa điểm cố định (vd "boong
  tàu Santa María", "triều đình Tây Ban Nha"), dùng để giữ ĐÚNG cùng 1 không
  gian khi cắt cảnh rộng → cận trong cùng 1 địa điểm.
- **Prop** (`state/props.json`) — đạo cụ/vật thể cố định cần giữ đúng hình dạng
  qua nhiều cảnh (vd 3 con tàu Santa María/Pinta/Niña, lá cờ hoàng gia).

Setting và Prop **KHÔNG** tạo qua "Create Character"/"Create Scene" như suy đoán
ban đầu — cách ĐÚNG đã xác nhận bằng codegen thật là chế độ **Image, số lượng
1** rồi đổi tên (xem `src/veo3bot/imageAsset.ts` và mục 4.10-4.12).

**Luồng xử lý** (`src/orchestrator.ts`):
1. Đọc `state/characters.json` / `settings.json` / `props.json` (cache sẵn,
   viết tay — KHÔNG gọi Gemini trong project này) hoặc tự trích xuất qua Gemini
   nếu có `GEMINI_API_KEY` và chưa có cache.
2. Tạo Character/Setting/Prop asset trong Google Flow cho từng mục (giữ hình
   ảnh nhất quán) — `ensureCharactersInFlow` / `ensureSettingsInFlow` /
   `ensurePropsInFlow`.
3. Chia kịch bản thành các cảnh 7-8 giây, mỗi cảnh có sẵn prompt tiếng Anh chi
   tiết cho Veo3 trong `state/prompts.json` (viết tay hoặc Gemini).
4. TTS từng cảnh bằng ElevenLabs → `output/audio/audio_NNN.mp3` — **BỊ BỎ QUA**
   trong cấu hình hiện tại (`ELEVENLABS_API_KEY` trống trong `.env`) vì project
   này chưa cần giọng đọc. Video ra sẽ ghép thẳng clip Veo3, không audio.
5. Tự động hoá Google Flow bằng Playwright để tạo video Veo3 cho từng cảnh,
   đính đúng Character/Setting/Prop asset qua `@mention` →
   `output/clips/clip_NNN.mp4`.
6. Ghép clip (+ audio nếu có) từng cảnh, nối tất cả thành video cuối (ffmpeg) →
   `output/video_final.mp4`.

`ELEVENLABS_API_KEY`/`GEMINI_API_KEY` đều **KHÔNG BẮT BUỘC** (xem
`config.ts::hasAudio`/`hasGemini`) — pipeline tự bỏ qua bước tương ứng nếu
thiếu, miễn là `state/*.json` đã có cache sẵn (viết tay).

## 2. Cài đặt & chạy (xem thêm README.md)

```bash
npm install
npx playwright install chromium
npm run login:veo3     # đăng nhập Google 1 lần, lưu session vào .auth/ (trieudev99@gmail.com)
npm run run            # chạy pipeline, resume-safe (Ctrl+C giữa chừng thì chạy lại được)
```

KHÔNG cần tạo `.env`/điền API key nào nếu chỉ tiếp tục project hiện tại —
`state/*.json` đã có cache sẵn. Chỉ cần `.env` nếu muốn:
- Bật TTS: điền `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`.
- Dùng Gemini tự sinh prompt cho kịch bản MỚI thay vì Claude viết tay: điền
  `GEMINI_API_KEY`.
- Giới hạn số cảnh khi test: `TEST_SCENE_LIMIT=3`.

Biến môi trường quan trọng: `PARALLEL_WORKERS` — **mặc định đã đổi thành 1**
trong `config.ts` (khác bản gốc dự án mặc định 3), để tránh lặp lại bug mục 4.4
(nhiều project Flow song song làm 1 nhân vật/bối cảnh có nhiều bản mặt khác
nhau). Chỉ tăng lên khi thật sự cần tốc độ VÀ đã chấp nhận rủi ro đó.

**Kiểm tra thay đổi code**: dùng `git status` / `git diff` (đã init, không có
remote) — không cần hỏi lại xem file nào vừa sửa.

**Các script một lần trong `scripts/`** (không cần `npm install` để chạy, chỉ
dùng Node core) — chạy lại KHÔNG an toàn nếu đã chạy rồi (sẽ áp dụng lại patch,
thường vô hại vì có kiểm tra idempotent, nhưng nên đọc code trước khi chạy lại):
- `split-scenes.mjs` — tách `input/story.txt` thành `state/scenes.json` theo
  đúng logic `splitIntoScenes` (không cần Gemini).
- `apply-period-anchor.mjs` — chèn `PERIOD_ANCHOR` vào `state/prompts.json`
  (đã chạy xong, không cần chạy lại trừ khi thêm cảnh mới bằng tay).
- `apply-settings-props.mjs` — gắn `settingNames`/`propNames` vào các cảnh liên
  quan (đã chạy xong).
- `apply-style-anchor-and-fix-glow.mjs` — cập nhật `MOTION_SUFFIX` mới (chặn
  glow/sparkle) + gắn Style Anchor cho mọi cảnh mồ côi (đã chạy xong).

## 3. Kiến trúc Ingredient — Character / Setting / Prop

File tương ứng theo từng loại (đối xứng nhau):

| Loại | Trích xuất (Gemini, optional) | Tạo asset trong Flow | Field trong VeoPrompt |
|---|---|---|---|
| Character | `characters/extract.ts` | `veo3bot/characters.ts` | `characterNames` |
| Setting | `settings/extract.ts` | `veo3bot/settings.ts` | `settingNames` |
| Prop | `props/extract.ts` | `veo3bot/props.ts` | `propNames` |

`veo3bot/settings.ts` và `veo3bot/props.ts` đều gọi chung
`veo3bot/imageAsset.ts::createImageIngredient(page, name, description,
styleBlock, projectUrl)` — style block truyền vào KHÁC NHAU:
- Character/Prop: `CHARACTER_SHEET_STYLE_BLOCK` (nền xanh chroma-key, có
  turnaround front/3-4 view).
- Setting: `SETTING_SHEET_STYLE_BLOCK` (ảnh nền THẬT, full-bleed, KHÔNG nền
  xanh, KHÔNG người) — xem mục 4.11 vì sao KHÔNG được dùng chung block với
  Character/Prop.

Trong `generate.ts::fillPromptWithMentions`, cả 3 loại tên được GỘP CHUNG 1
danh sách rồi chèn `@mention` tuần tự — dialog chọn asset trong Flow tìm theo
tên, không lọc theo loại, nên không cần code riêng cho từng loại ở bước này.
Điều kiện bắt buộc: **tên không được trùng giữa 3 danh sách**.

## 4. Bài học xương máu (ĐỌC TRƯỚC KHI SỬA `veo3bot/`)

Google Flow **không có API chính thức**. Toàn bộ tương tác là tự động hoá UI
bằng Playwright DOM selectors — cực kỳ dễ vỡ khi UI đổi, và có nhiều hành vi
ngầm không trực quan. Mỗi mục dưới đây từng gây ra 1 lỗi thật, tốn nhiều giờ để
tìm ra nguyên nhân gốc, chỉ phát hiện được qua soi hình ảnh output thực tế
(không phải qua log/test tự động).

### 4.1. `@mention` là cơ chế DUY NHẤT giữ đúng hình ảnh Ingredient
Gõ `@Tên` trong ô prompt **không mở dropdown gợi ý đơn giản** — nó mở 1
**dialog chọn asset** (Radix dialog) có ô "Search assets". Phải: gõ toàn bộ mô
tả cảnh trước (giữ đúng thứ tự câu bằng `page.keyboard.type`, KHÔNG dùng
`.fill()` — gây đảo thứ tự text), sau đó ở CUỐI mới gõ `@` để mở dialog, gõ tên
vào ô search, click đúng card khớp tên, rồi mới nhận là đã chèn chip tham
chiếu thật. **Kiểm tra bằng cách đếm `data-slate-void="true"` trong
`promptBox.innerHTML()`** — nếu số chip < số tên cần gắn, Veo3 sẽ tự bịa ra
hình khác dù prompt ghi đúng tên (xem `fillPromptWithMentions` trong
`generate.ts`).

Cách BIND SAI (không hoạt động, đã bỏ hẳn): đính Ingredient qua overlay "Add
Media" ở đầu prompt — chỉ là gợi ý phong cách chung, KHÔNG ràng buộc hình ảnh.

### 4.2. Tên nhân vật/bối cảnh/đạo cụ nên xuất hiện trong lời văn cảnh
Không bắt buộc về mặt kỹ thuật (chip @mention chèn ở CUỐI prompt, không cần
đúng vị trí trong câu), nhưng vẫn nên nhắc TÊN ĐẦY ĐỦ mỗi khi nhân vật xuất
hiện/hành động trong câu — không dùng đại từ ("he", "she") ở lần đầu giới
thiệu trong cảnh, vì giúp mô hình hiểu rõ ai đang làm gì trong prompt text.

### 4.3. Góc quay PHẢI thấy rõ nhân vật/hiện rõ chủ thể
Các kiểu góc quay sau khiến @mention không "neo" được hình ảnh, Veo3 tự bịa
chủ thể khác hoặc biến dạng giữa clip: **bóng lưng/silhouette, soi
gương/reflection, quay lưng bỏ đi, cận cảnh chỉ 1 bộ phận, ảnh quá tối, hiệu
ứng "glitch/degrade"**. Đã bake vào system prompt `prompt-writer.ts`. Ngoại lệ
CÓ CHỦ ĐÍCH: cảnh bạo lực/chiến tranh dùng silhouette đen phẳng (xem mục quy
tắc riêng trong `prompt-writer.ts`), `characterNames` để rỗng cho các cảnh đó.

### 4.4. Chạy song song NHIỀU project Flow làm 1 Ingredient có NHIỀU bản khác nhau
Khi chạy nhiều tab song song (`PARALLEL_WORKERS > 1`), mỗi tab dùng 1 project
Flow riêng (xem `project.ts::ensureProjects`). NHƯNG mỗi project Flow **tự sinh
asset riêng** từ cùng 1 mô tả text — 2 lần sinh độc lập từ cùng mô tả KHÔNG ra
cùng 1 hình ảnh! Bug RẤT khó phát hiện vì mỗi clip riêng lẻ vẫn "đúng trong nội
bộ clip đó", chỉ lộ ra khi so sánh CÙNG 1 Ingredient QUA NHIỀU cảnh khác nhau
bằng mắt. **Đã đổi mặc định `PARALLEL_WORKERS=1`** trong `config.ts` để tránh
hẳn lớp bug này (xem mục 2).

### 4.5. Veo3 có thể tự "nhân đôi" chủ thể trong cảnh nhiều người
1 cảnh mô tả nhiều người cùng khung hình có thể ra kết quả THỪA người — Veo3 tự
thêm khi prompt mơ hồ về số lượng. Fix: viết prompt tường minh số lượng, ví dụ
"Only one adult woman, X, appears beside Y."

### 4.6. Bug "trùng lặp clip/ảnh" (duplicate) — nguyên nhân baseline-diff
Không được kiểm tra "media mới xuất hiện chưa" bằng cách check `video[src]`/
`img[src]` hay text "Failed" TỒN TẠI trên trang — trang giữ lại TOÀN BỘ lịch sử
media cũ vĩnh viễn, nên check kiểu "tồn tại" sẽ khớp nhầm media CŨ của cảnh
khác. Phải: đếm số lượng element TRƯỚC khi bấm generate (baseline), rồi chờ số
lượng TĂNG so với baseline mới coi là xong. `getByText()` còn khớp cả text ẩn
(JSON nhúng sẵn trong trang) nên phải lọc `.locator(':visible')` nữa. Áp dụng ở
CẢ 2 nơi: `generateOneClip` (video, `generate.ts`) VÀ `createImageIngredient`
(ảnh Setting/Prop, `imageAsset.ts`) — ĐỪNG bỏ cơ chế này khi sửa lại.

### 4.7. Không dùng vị trí mảng làm ID khi mảng có thể "hụt" phần tử
Nếu 1 cảnh bị Flow từ chối tạo (chính sách nội dung) và bị bỏ qua, mảng kết quả
trả về bị "nén" (mất phần tử giữa). TUYỆT ĐỐI không dùng vị trí lặp `i` làm tên
file/chỉ số cảnh — phải mang theo `index` thật của cảnh xuyên suốt pipeline
(xem interface `ScenePair` trong `ffmpeg.ts`).

### 4.8. Không được báo "xong" khi còn thiếu cảnh
Nếu 1 cảnh bị Flow chặn/lỗi liên tục, KHÔNG được im lặng bỏ qua rồi báo hoàn
tất với video ngắn hơn — phải viết lại prompt trừu tượng hơn và thử lại cho đến
khi đủ. `orchestrator.ts` chủ động `process.exit(1)` kèm log liệt kê rõ cảnh
nào thiếu nếu chưa đủ — đây là chủ đích, ĐỪNG xoá logic này.

### 4.9. Ghép nối cuối cùng phải GIẢI MÃ LẠI, không stream-copy
`concatVideos` KHÔNG được dùng `-c copy` (stream copy) để nối — gây khựng/giật
tại mọi điểm chuyển cảnh vì mỗi file được mã hoá riêng biệt. Phải giải mã lại
khi nối (`-c:v libx264 -c:a aac`). Tương tự, ghép audio/video theo từng cảnh
KHÔNG được đổi tốc độ video (`setpts`) để khớp độ dài audio — cắt bớt video nếu
audio ngắn hơn, giữ đứng hình cuối (`tpad`) nếu audio dài hơn (xem
`ffmpeg.ts::muxSceneAudio`, hiện KHÔNG dùng vì project chưa bật audio, nhưng
logic này vẫn còn nguyên nếu bật lại).

### 4.10. Setting/Prop KHÔNG tạo qua "Create Scene"/"Create Character" reuse — dùng chế độ Image
**LỊCH SỬ**: ban đầu đoán Setting dùng menu "Create Scene" (quan sát thấy tồn
tại trong "Add Media") và Prop tái dùng "Create Character" — CẢ HAI ĐỀU SAI
hoặc không tối ưu:
- "Create Scene" cho Setting: ra asset "Untitled" — bước đặt tên thất bại (sai
  selector ô nhập tên), không tìm lại được qua `@mention`.
- "Create Character" cho Prop: thực ra hoạt động (tạo đúng tên), nhưng không
  nhất quán với luồng đúng đã xác nhận cho Setting.

**CÁCH ĐÚNG đã xác nhận bằng Playwright codegen thật** (người dùng tự thao tác
và cung cấp code sinh ra): tạo qua **chế độ Image ngay trên canvas chính, số
lượng 1**, rồi **right-click ảnh vừa tạo → Rename** để đặt tên tìm lại được qua
`@mention`. Toàn bộ luồng nằm trong `imageAsset.ts::createImageIngredient`:
mở bảng cài đặt (pill `crop_16_9`) → tab `role="tab" name="image Image"` → tab
`role="tab" name="1x"` → **`Escape` để đóng bảng** (xem mục 4.13) → gõ prompt →
bấm Generate (`arrow_forward`) → baseline-diff đếm `role="link"
name="Generated image"` → right-click ảnh mới nhất → menuitem "Rename" → gõ
tên vào textbox "Editable text" → nút "Done".

### 4.11. Setting KHÔNG được dùng chung style block với Character/Prop
`CHARACTER_SHEET_STYLE_BLOCK` (nền xanh chroma-key + turnaround front/3-4 view)
CHỈ đúng cho Character/Prop. Dùng chung cho Setting ra kết quả SAI — xác nhận
trực tiếp: ảnh "Pinta Deck" ra kèm 2 người đứng "Front View"/"3/4 View" như
đang tạo nhân vật, và có viền xanh chroma-key thay vì là ảnh nền thật. Setting
cần `SETTING_SHEET_STYLE_BLOCK` riêng: ảnh nền THẬT (không nền xanh), KHÔNG có
người/nhân vật nào, full-bleed (xem mục 4.12 vì sao còn phải cấm cả khung
viền). `imageAsset.ts::createImageIngredient` nhận `styleBlock` làm THAM SỐ
(không hard-code) đúng vì lý do này — callers (`settings.ts`/`props.ts`) tự
chọn block phù hợp.

### 4.12. Nội dung ảnh "Style Anchor" LÀ đúng thứ sẽ bị kéo vào video khi tham chiếu
**Bối cảnh**: cảnh không có Ingredient nào (không nhân vật/bối cảnh/đạo cụ neo
giữ) dễ trôi phong cách — 2 lần render CÙNG 1 prompt text-only ra 2 kết quả
khác hẳn nhau về nét vẽ dù cùng mô tả style. Đã thử tạo 1 Ingredient "Style
Anchor" duy nhất, gắn @mention vào MỌI cảnh mồ côi để luôn có ảnh tham chiếu
thật, qua **3 lần lặp**:

1. **Lần 1 — tạo qua "Create Character"**: công cụ này luôn ra 1 NHÂN VẬT NGƯỜI
   cụ thể dù mô tả là vật thể trừu tượng. Gắn vào cảnh có người vô danh khiến
   nhân vật đó đè lên (xác nhận: cảnh "a young unnamed mapmaker" ra đúng hình
   người mặc hoodie cam của Style Anchor). **BỎ HẲN "Create Character" cho việc
   này.**
2. **Lần 2 — đổi sang Setting (chế độ Image), mô tả là "khung viền giấy da
   trang trí"**: Ingredient được tạo đúng (không phải người), NHƯNG vì nội
   dung ảnh MÔ TẢ 1 khung viền, khi tham chiếu style Veo3 kéo luôn khung viền
   trang trí vào video (viền vàng cổ điển hiện quanh khung hình mọi cảnh gắn
   Style Anchor).
3. **Lần 3 — đổi nội dung ảnh thành 1 bức phong cảnh thường** (bờ biển vắng,
   full-bleed, cấm tường minh "no decorative border/frame/vignette", cấm
   người). Lý do: **ảnh tham chiếu style PHẢI LÀ đúng loại nội dung muốn Veo3
   học theo** — không phải 1 vật/khung có hình dạng riêng sẽ bị chèn nguyên
   vào cảnh khác. Trạng thái: **VỪA SỬA XONG, CHƯA CÓ XÁC NHẬN CUỐI CÙNG** —
   cần kiểm tra `clip_000.mp4`/`clip_005.mp4` sau khi tạo lại.

**Bài học tổng quát**: bất kỳ "asset chỉ để neo phong cách" nào PHẢI được mô tả
như 1 ví dụ THẬT của loại nội dung sẽ render (ở đây: 1 cảnh phong cảnh), không
phải 1 đối tượng/biểu tượng trừu tượng đại diện cho phong cách — Ingredient
luôn được Veo3 hiểu là "hãy vẽ giống CÁI NÀY", không phải "hãy học phong cách
TRỪU TƯỢNG từ cái này".

Ngoài chip @mention, còn thêm 1 câu TƯỜNG MINH trong chính text prompt
("Maintain the exact same illustration style as @Style Anchor.") — xem
`STYLE_ANCHOR_MENTION_SENTENCE` trong `styleDNA.ts`, append bằng CODE trong
`prompt-writer.ts` khi `settingNames` có chứa `STYLE_ANCHOR_NAME`.

### 4.13. Quên đóng bảng cài đặt (Escape) làm chặn click ô nhập prompt
Sau khi chọn tab Image/1x trong bảng cài đặt (Radix popper), bảng KHÔNG tự
đóng — nếu không bấm `Escape`, nó vẫn che phần ô nhập prompt bên dưới, khiến
`click()` vào `div[contenteditable="true"]` bị chặn (pointer-events
intercepted), timeout 30s. `generate.ts::ensureModelAndDuration` đã xử lý đúng
bằng `Escape`, nhưng `imageAsset.ts` (viết sau) quên bước này — đã sửa. Nếu
viết thêm luồng mở bảng cài đặt mới, LUÔN nhớ `Escape` trước khi thao tác vào
phần tử bên dưới.

### 4.14. `networkidle` không bao giờ fire ổn định khi project nhiều media
`page.goto(projectUrl); await page.waitForLoadState("networkidle")` timeout
30s ngay khi project đã tích luỹ đủ nhiều media (không phải ngay từ đầu — lỗi
xuất hiện MUỘN, sau khi đã tạo được vài Character/Setting/Prop, dễ gây nhầm là
"code mới sửa bị lỗi" trong khi thực ra là hành vi UI theo tải trọng dữ liệu).
Sửa ở CẢ 3 file (`characters.ts`, `settings.ts` — nay gọi qua `imageAsset.ts`,
`props.ts` — tương tự): dùng `waitUntil: "domcontentloaded"` + chờ 1 phần tử cụ
thể chắc chắn có (`button:has-text("Add Media")`) thay vì chờ mạng im lặng
hoàn toàn. `project.ts` đã làm đúng từ đầu (có `.catch(() => {})` sau
`networkidle`, không throw) — mẫu tham khảo tốt khi viết code mới.

### 4.15. Timeout "hết thời gian chờ" có thể là DƯƠNG TÍNH GIẢ — reload để xác nhận
Video/ảnh đôi khi tạo THÀNH CÔNG thật trong Flow (thấy rõ trong media grid,
đúng nội dung, đúng style) nhưng bot không phát hiện kịp trong lúc poll trực
tiếp — dẫn đến báo lỗi/bỏ qua OAN 1 cảnh thực ra đã xong (tốn credit tạo lại
không cần thiết, và nếu tạo lại còn có nguy cơ trùng lặp — xem mục 4.6). Trước
khi kết luận lỗi thật (throw/return "skipped"), LUÔN `page.reload()` 1 lần rồi
kiểm tra lại baseline-diff — nếu phát hiện được sau reload thì coi là thành
công. Áp dụng ở CẢ 2 nơi: `generateOneClip` (`generate.ts`) và
`createImageIngredient` (`imageAsset.ts`).

### 4.16. `MOTION_SUFFIX` cần cấm rõ glow/sparkle, "no visual effects" chung chung không đủ
Vật thể sáng bóng (vàng, kim loại, đá quý) trong cảnh dễ bị Veo3 tự thêm hiệu
ứng toả sáng/lấp lánh dù prompt đã có "no visual effects" — câu này quá chung
chung để mô hình hiểu áp dụng cho glow/sparkle. Phải liệt kê CỤ THỂ: "No glow,
no sparkle, no light flares, no particle effects, no shine bursts... flat matte
surfaces only, even on metal, gold, or gemstones" (xem `MOTION_SUFFIX` trong
`styleDNA.ts`).

### 4.17. Cảnh không tên riêng dễ mặc định vẽ theo nghĩa HIỆN ĐẠI
Nhân vật/bối cảnh KHÔNG có Ingredient (@mention) — vd thủy thủ quần chúng,
cảng, khu chợ — không có gì neo giữ thời đại, nên Veo3 mặc định vẽ theo nghĩa
HIỆN ĐẠI của danh từ chung ("sailor", "harbor", "ship"...). Đã xác nhận trực
tiếp: prompt "a young unnamed sailor... merchant ship's deck" ra hình thủy thủ
áo kẻ sọc thời nay đứng cạnh container/cần cẩu cảng hiện đại, dù style đã là
flat vector đúng. Fix: `PERIOD_ANCHOR` (xem `styleDNA.ts`) append bằng CODE vào
MỌI cảnh không cố ý hiện đại (`era: "period"`, mặc định).

## 5. Cách verify (ĐỪNG chỉ tin log "0 lỗi")

Các bug nghiêm trọng nhất (sai hình ảnh Ingredient, trùng lặp clip, phong cách
trôi/lẫn, hiệu ứng lạ) đều **vượt qua mọi check tự động** (file tồn tại, không
lỗi runtime) — chỉ lộ ra khi soi bằng mắt. Quy trình verify chuẩn:

1. **Trùng lặp clip:**
   ```powershell
   Get-ChildItem output/clips/*.mp4 | Get-FileHash | Group-Object Hash | Where-Object Count -gt 1
   ```
   → phải rỗng.
2. **Sai/lẫn Ingredient (nhân vật/bối cảnh/đạo cụ):** trích 1 frame giữa mỗi
   cảnh có `characterNames`/`settingNames`/`propNames` không rỗng, soi bằng
   mắt so với mô tả trong `state/*.json` tương ứng — không tin riêng 1 frame,
   nếu nghi ngờ 1 cảnh cụ thể thì trích thêm 3-4 frame để bắt lỗi "morph giữa
   chừng".
3. **Trôi/lẫn phong cách ở cảnh mồ côi (không Ingredient nào):** xem có còn
   nét vẽ khác hẳn phần còn lại không, và **đặc biệt kiểm tra Style Anchor
   không bị lẫn nội dung của chính nó vào cảnh** (khung viền, vật thể lạ — xem
   mục 4.12).
4. **Hiệu ứng lạ (glow/sparkle) trên vật sáng bóng:** xem mục 4.16.
5. **Thời đại sai (hiện đại lẫn vào cảnh 15th-century):** xem mục 4.17, đặc
   biệt các cảnh không tên riêng.
6. **Khựng khi chuyển cảnh:** trích frame ngay TRƯỚC và SAU 1 điểm cắt, xem có
   khung hình lặp/đứng hình bất thường không (chỉ áp dụng nếu bật audio/mux
   theo cảnh — hiện project KHÔNG bật, xem mục 1).

## 6. Việc còn dang dở / có thể làm tiếp

- **Xác nhận cuối cùng Style Anchor v3 (mục 4.12, lần 3)**: vừa xoá + tạo lại
  Style Anchor asset (nội dung mới: phong cảnh, không khung viền) và
  `clip_000.mp4`/`clip_005.mp4`. CẦN kiểm tra bằng mắt kết quả sau khi
  `npm run run` chạy xong lần tiếp theo trước khi tin tưởng áp dụng cho 74 cảnh
  mồ côi còn lại.
- **148/168 cảnh còn thiếu clip** — tiếp tục chạy `npm run run` (resume-safe).
- **Audio/TTS đang tắt** — nếu sau này muốn bật giọng đọc, điền
  `ELEVENLABS_API_KEY`/`ELEVENLABS_VOICE_ID` vào `.env`, pipeline tự bật lại
  bước TTS + mux audio/video theo cảnh (logic `ffmpeg.ts::muxSceneAudio` vẫn
  còn nguyên, chưa test lại với kịch bản Columbus).
- **`ensurePropsInFlow` dùng "Create Character" reuse** (không phải chế độ
  Image như Setting) — hoạt động ổn định nhưng khác luồng với Setting, có thể
  cân nhắc thống nhất về 1 luồng nếu phát sinh vấn đề tương tự mục 4.10.
- **Skill `flow-historical-video-prompts`** (không phải file trong repo này —
  nằm trong danh sách skill khả dụng của Claude Code) đã được cập nhật nhiều
  lần trong quá trình làm project này (nghiên cứu nhân vật có thật, đồng nhất
  nhiều mốc tuổi, Setting/Prop Ingredient, neo thời đại) — đọc skill đó trước
  khi bắt đầu 1 project lịch sử/Flow MỚI để tận dụng bài học đã tích luỹ.

## 7. Repo

Git đã `init` cục bộ trong quá trình làm project này — **CHƯA có remote**.
Dùng `git status`/`git diff`/`git log` để xem lịch sử thay đổi. File KHÔNG có
trong git (theo `.gitignore`): `.env`, `output/`, `state/` (cache
characters/settings/props/prompts + project Flow đã tạo), `.auth/` (session
Google đã đăng nhập), `input/story.txt` (nội dung kịch bản) — nếu context bị
mất VÀ các file này còn nguyên trên máy, mục 0 của tài liệu này mô tả đúng
trạng thái chúng; nếu bị xoá, cần viết lại từ đầu theo mục 1.
