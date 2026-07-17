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

### ⚠️ NẾU NGƯỜI DÙNG ĐƯA 1 KỊCH BẢN KHÁC HẲN (không phải Columbus) — đọc TRƯỚC KHI viết gì

Mục "Kịch bản đang dùng" ở trên mô tả trạng thái CỦA RIÊNG `state/`/`output/` hiện
tại — KHÔNG phải giả định cố định về nội dung project. Nếu kịch bản người dùng đưa
rõ ràng là 1 câu chuyện khác (chủ đề/nhân vật/thời đại khác hẳn Columbus), đây là
tín hiệu bắt đầu 1 project MỚI — ĐỪNG tự viết đè lên `state/characters.json` v.v.
mà không hỏi trước. Lý do phải cẩn thận: `state/` và `output/` đều bị `.gitignore`
(mục trên) — **không có git backup nào** cho 168 cảnh + clip đã tạo của Columbus,
ghi đè nhầm là MẤT VĨNH VIỄN, không khôi phục được.

**Việc cần làm**: hỏi rõ người dùng muốn 1 trong 2 hướng sau trước khi viết bất kỳ
`state/*.json` nào cho kịch bản mới:
1. **Chạy song song, KHÔNG đụng vào Columbus** (mặc định nên đề xuất, rủi ro = 0):
   dùng `STATE_DIR`/`OUTPUT_DIR`/`STORY_INPUT_PATH` khác trong `.env` (vd
   `STATE_DIR=./state-<tenkichban>`, `OUTPUT_DIR=./output-<tenkichban>`,
   `STORY_INPUT_PATH=./input/<tenkichban>.txt`) — `config.ts` đã hỗ trợ sẵn 3 biến
   này, không cần sửa code. `.auth/` (session Google) dùng chung, không cần đổi.
   Columbus giữ nguyên trong `state/`/`output/` mặc định, có thể quay lại tiếp tục
   bất cứ lúc nào.
2. **Thay hẳn Columbus** (người dùng đã xác nhận 2026-07-18: chấp nhận ghi đè theo
   hướng này khi cần):
   - BẮT BUỘC backup `state/` và `output/` hiện tại trước (đổi tên thành
     `state-columbus-backup/`/`output-columbus-backup/`, hoặc nén lại) — xác nhận
     backup thành công rồi mới viết đè file mới vào `state/`/`output/` mặc định.
     Bước backup này KHÔNG bị bỏ qua dù người dùng đồng ý ghi đè — "chấp nhận ghi
     đè" chỉ có nghĩa là chấp nhận `state/`/`output/` mặc định đổi sang project mới,
     không có nghĩa là bỏ qua an toàn dữ liệu.
   - **TUYỆT ĐỐI KHÔNG tái sử dụng dữ liệu Columbus cũ** khi viết `state/*.json` cho
     kịch bản mới — không mang theo/thừa hưởng bất kỳ nhân vật, bối cảnh, đạo cụ,
     hay lựa chọn style nào của Columbus. Viết hoàn toàn mới từ đầu, đúng theo nội
     dung kịch bản mới (dùng skill `flow-historical-video-prompts` + các
     `*_EXTRACTION_GUIDE`/`buildPromptWritingGuide()` như quy trình ở mục 1 —
     không phải chỉnh sửa/kế thừa file Columbus cũ).
   - Sau đó PHẢI cập nhật lại mục 0 này (và mục "Quy trình khi có kịch bản MỚI" ở
     mục 1) để mô tả đúng project mới đang "sống" trong `state/`/`output/` mặc định —
     RUNBOOK phải luôn khớp với project thật đang nằm trong 2 thư mục đó.

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

**Luồng xử lý** (`src/orchestrator.ts`) — ĐÃ BỎ HẲN Gemini/ElevenLabs (mục 4.20),
`state/*.json` giờ LUÔN do Claude viết tay, không có nhánh gọi LLM/TTS nào nữa:
1. Đọc `state/characters.json` (bắt buộc) / `settings.json` / `props.json`
   (tuỳ chọn) — chỉ ĐỌC cache, báo lỗi rõ nếu thiếu thay vì tự sinh.
2. Tạo Character/Setting/Prop asset trong Google Flow cho từng mục (giữ hình
   ảnh nhất quán) — `ensureCharactersInFlow` / `ensureSettingsInFlow` /
   `ensurePropsInFlow`.
3. Đọc `state/prompts.json` (đã viết đủ tay theo đúng số cảnh của
   `input/story.txt`) — báo lỗi rõ nếu thiếu cảnh. Chạy
   `warnInconsistentSettingLighting` ngay sau khi đọc (mục 4.19).
4. Tự động hoá Google Flow bằng Playwright để tạo video Veo3 cho từng cảnh,
   đính đúng Character/Setting/Prop asset qua `@mention` →
   `output/clips/clip_NNN.mp4`.
5. Ghép clip thành video cuối (ffmpeg, KHÔNG audio) →
   `output/video_final.mp4`.

**Quy trình khi có KỊCH BẢN MỚI (viết `state/*.json` từ đầu, không dùng Gemini)**:
đây là việc **Claude tự làm bằng tay trong hội thoại**, KHÔNG có code nào tự
động thực thi — ghi rõ thứ tự ở đây vì dễ mất nếu phiên bị `/clear` giữa chừng:
1. Kích hoạt skill `flow-historical-video-prompts` (skill ngoài repo — xem mục
   4.20/4.21) — skill có quy trình chi tiết hơn: bảng kiểm kê tài sản trước
   khi viết prompt, cách nghiên cứu ngoại hình nhân vật có thật, xử lý bạo
   lực/silhouette, outline bắt buộc trên nền/vật thể, ánh sáng ngày/đêm khoá
   cứng theo Setting.
2. Lưu kịch bản vào `input/story.txt`.
3. Chạy `node scripts/split-scenes.mjs` → `state/scenes.json` — ranh giới cảnh
   CHÍNH XÁC theo thuật toán `splitIntoScenes` (không cần LLM), đảm bảo số
   cảnh viết trong `state/prompts.json` khớp đúng với check của
   `orchestrator.ts::loadPrompts`.
4. Đọc toàn bộ kịch bản 1 lượt, xuất bảng kiểm kê tài sản (nhân vật + từng mốc
   tuổi, đạo cụ cần giữ nhất quán, bối cảnh lặp lại) — DỪNG LẠI xin người dùng
   xác nhận trước khi viết prompt đầy đủ, trừ khi họ đã nói đi thẳng luôn.
5. Viết `state/characters.json`/`settings.json`/`props.json` theo
   `CHARACTER_EXTRACTION_GUIDE`/`SETTING_EXTRACTION_GUIDE`/`PROP_EXTRACTION_GUIDE`
   (`src/characters|settings|props/extract.ts`) — LƯU Ý mục 4.19: bối cảnh
   dùng ở NHIỀU điều kiện ánh sáng → mô tả trung lập; CHỈ 1 điều kiện xuyên
   suốt → bake thẳng điều kiện đó vào mô tả.
6. Viết `state/prompts.json` — mỗi cảnh 1 entry khớp `state/scenes.json`, theo
   `buildPromptWritingGuide()` (`src/splitter/prompt-writer.ts`) — tự ghép
   PERIOD_ANCHOR/STYLE_ANCHOR_MENTION_SENTENCE/MOTION_SUFFIX vào cuối
   `videoPrompt` theo đúng thứ tự ghi trong mục "VIDEOPROMPT CUỐI CÙNG PHẢI
   GỒM" của hàm đó, gán `status: "waiting"` cho mọi entry mới.
7. Người dùng chạy `npm run login:veo3` (nếu chưa đăng nhập) rồi `npm run run`.

## 2. Cài đặt & chạy (xem thêm README.md)

```bash
npm install
npx playwright install chromium
npm run login:veo3     # đăng nhập Google 1 lần, lưu session vào .auth/ (trieudev99@gmail.com)
npm run run            # chạy pipeline, resume-safe (Ctrl+C giữa chừng thì chạy lại được)
```

KHÔNG cần tạo `.env` nếu chỉ tiếp tục project hiện tại — `state/*.json` đã có
cache sẵn. Gemini/ElevenLabs đã BỎ HẲN khỏi codebase (mục 4.20) — không còn
API key nào để điền cho 2 việc đó nữa. Chỉ cần `.env` nếu muốn đổi
`PARALLEL_WORKERS`, giới hạn số cảnh khi test (`TEST_SCENE_LIMIT=3`), hoặc bật
`DEBUG=1`.

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

**CẬP NHẬT (2026-07-18) — bản reload-recheck ban đầu VẪN CHƯA ĐỦ**: xác nhận
trực tiếp Prop "Spanish Royal Banner" — sau khi hết `GENERATE_TIMEOUT_MS` +
reload + chờ CỐ ĐỊNH 3 giây, code vẫn throw "hết thời gian chờ", nhưng người
dùng tự kiểm tra trong Flow thấy ảnh **đã tạo xong thật**, chỉ chưa kịp
đổi tên (vì code throw trước khi chạy tới bước rename). Nguyên nhân: 3 giây cố
định sau reload không đủ để trang tải lại lưới media khi project đã tích luỹ
nhiều (168 cảnh + nhiều Character/Setting/Prop khác) — cùng lớp lỗi mục 4.14.
Đã sửa ở CẢ 2 nơi: sau reload, chờ `button:has-text("Add Media")` HIỆN RA
(dấu hiệu trang thật sự tương tác được, timeout 90s) rồi **POLL THÊM** tối đa
`RELOAD_RECHECK_TIMEOUT_MS` (90 giây) thay vì chốt ngay sau 1 mốc cố định.
Cũng tăng `GENERATE_TIMEOUT_MS` của `imageAsset.ts` từ 3 phút lên 5 phút — nghi
ngờ ảnh có nội dung biểu tượng/quốc kỳ cần thời gian kiểm duyệt lâu hơn ảnh
thường (giống hiện tượng cảnh thẩm vấn/toà án cần 10 phút thay vì 5 phút, đã
ghi ở đầu mục này).

**LƯU Ý KHI GẶP LẠI LỖI NÀY (asset đã tạo trong Flow nhưng bot báo lỗi trước
khi kịp đổi tên)**: đừng chạy lại `npm run run` ngay — `ensurePropsInFlow`/
`ensureSettingsInFlow` tra asset đã tồn tại BẰNG TÊN, ảnh chưa đổi tên sẽ
KHÔNG được tìm thấy, khiến bot tạo THÊM 1 ảnh trùng nội dung (tốn credit, lẫn
lộn 2 ảnh cùng là "banner" nhưng chỉ 1 cái được đặt tên đúng). Vào Flow,
right-click ảnh vừa tạo (chưa tên) → Rename → gõ đúng tên (vd "Spanish Royal
Banner") → Done, RỒI mới chạy lại pipeline để nó nhận ra asset đã có sẵn.

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

### 4.18. Đổi sang tracking `status` (waiting/failed/success) thay vì crash cả pipeline khi 1 asset lỗi
**BỐI CẢNH**: bug "Spanish Royal Banner" (mục 4.15 cập nhật ở trên) không chỉ là 1 lần dương
tính giả — nó còn lộ ra vấn đề kiến trúc nghiêm trọng hơn: TRƯỚC ĐÂY, `ensureCharactersInFlow`/
`ensureSettingsInFlow`/`ensurePropsInFlow` chạy 1 vòng `for` KHÔNG có `try/catch` — 1 nhân
vật/bối cảnh/đạo cụ lỗi (timeout, bị Flow từ chối...) sẽ THROW và làm CRASH TOÀN BỘ
`orchestrator.ts` ngay lập tức, kể cả khi 20 cái khác trước đó đã tạo thành công. Đồng thời,
việc "đã tạo chưa" trước đây LUÔN tra lại bằng cách query UI Flow (tìm theo tên trong dialog
"Add Media") ở MỌI lần chạy — chậm và phụ thuộc UI dễ vỡ.

**Đã đổi sang cơ chế status persistent**: mỗi `CharacterProfile`/`SettingProfile`/`PropProfile`
(`state/characters|settings|props.json`) và mỗi `VeoPrompt` (`state/prompts.json`) giờ có thêm
field `status?: "waiting" | "failed" | "success"` (xem `src/assetStatus.ts`):
- `status === "success"`: lần chạy sau BỎ QUA HẲN, không query lại Flow (khác hẳn cơ chế cũ).
- `status` khác (waiting/failed/thiếu field — dữ liệu cũ trước khi có field này): với
  Character/Setting/Prop, VẪN tra tên qua Flow UI 1 lần trước khi tạo mới (giữ
  `characterAlreadyExists`/`settingAlreadyExists`/`propAlreadyExists` làm LƯỚI AN TOÀN, tránh
  tạo trùng asset đã tồn tại thật mà status chưa kịp ghi "success" — đúng kịch bản "Spanish
  Royal Banner"). Với clip video, dùng file `output/clips/clip_NNN.mp4` tồn tại làm nguồn sự
  thật cuối cùng, tự đồng bộ lại `status` theo file thực tế mỗi lần chạy (file có → success dù
  status cũ nói khác; file mất → waiting dù status cũ nói success).
- Lỗi tạo asset (throw từ `createCharacter`/`createImageIngredient`) giờ được BẮT bằng
  `try/catch` NGAY TRONG vòng lặp — đánh dấu `status = "failed"`, log rõ, rồi **tiếp tục xử lý
  các nhân vật/bối cảnh/đạo cụ còn lại** thay vì crash cả tiến trình. Lần chạy `npm run run`
  sau sẽ tự thử lại đúng những cái `status !== "success"`.
- `onProgress` callback (`veo3bot/characters.ts`/`settings.ts`/`props.ts`/`generate.ts` đều
  nhận tham số này) được gọi NGAY sau mỗi lần đổi status — ghi lại `state/*.json` tức thì,
  không đợi xử lý xong cả danh sách, để không mất tiến độ nếu pipeline crash ở phần tử sau.

**GIẢ ĐỊNH CHƯA XÁC NHẬN**: cơ chế status giả định Character/Setting/Prop asset dùng CHUNG cho
mọi project trong tài khoản (không phải tài nguyên riêng theo từng project Flow) — với
`PARALLEL_WORKERS=1` (mặc định), giả định này không ảnh hưởng vì `ensureCharactersInFlow` chỉ
chạy đúng 1 lần trên project chính. Nếu tăng `PARALLEL_WORKERS` và giả định sai (asset hoá ra
riêng theo từng project), `status: "success"` ghi từ project đầu sẽ khiến các project song
song sau bị bỏ qua việc tạo asset — CHƯA kiểm chứng trực tiếp trường hợp này.

### 4.19. Setting neo SAI ánh sáng ngày/đêm — ảnh reference khoá cứng 1 điều kiện, mood text không ghi đè được
**XÁC NHẬN TRỰC TIẾP**: Setting "Pinta Deck" (bối cảnh chòi quan sát trên tàu Pinta) có
`description` trong `state/settings.json` KHÔNG chỉ định ngày/đêm ("Open dark ocean visible on
all sides" — không có "at night"). Ảnh asset thật được Flow tạo ra là **BAN NGÀY**, rồi bị kéo
vào **cả 9 cảnh** dùng @mention nó — toàn bộ 9 cảnh đó đều là cảnh đêm/trăng theo kịch bản
("Cool moonlit blue-white tones", "night", "moonlight"...). Cùng lúc phát hiện thêm 1 lỗi tệ
hơn: Setting "Santa María Deck" (boong tàu chính của Columbus, 8 cảnh) có `description` bị
COPY-PASTE NHẦM từ "Style Anchor" — mô tả 1 bãi biển vắng, không hề có tàu/boong tàu nào, dù
đã `status: "success"` (tưởng đã tạo xong đúng).

**Bài học cốt lõi**: ảnh Setting reference trong Flow là 1 ảnh TĨNH DUY NHẤT — nếu mô tả không
chỉ định rõ ngày/đêm, Flow tự chọn 1 điều kiện ánh sáng cố định (thường mặc định ban ngày), và
mood/tông màu viết trong `videoPrompt` từng cảnh **KHÔNG đủ mạnh để ghi đè** ảnh đã "khoá cứng"
đó khi @mention — đúng bài học đã có ở mục 4.12 (nội dung ảnh Ingredient LÀ đúng thứ sẽ bị kéo
vào video), áp dụng thêm cho khía cạnh ánh sáng/thời điểm trong ngày, không chỉ hình dạng vật
thể.

**Đã sửa cho project hiện tại**: đổi tên 2 Setting này (thêm hậu tố mới, vd "Pinta Deck" →
"Pinta Deck Night") thay vì sửa tại chỗ — vì asset cũ đã tạo (status "success") trong Flow với
nội dung sai, sửa mô tả rồi để nguyên tên sẽ khiến bot tra tên thấy asset cũ vẫn "tồn tại" và
bỏ qua, không bao giờ tạo lại. Đổi tên buộc bot tạo asset MỚI hoàn toàn dưới tên mới (không cần
xoá gì trong Flow, asset cũ chỉ nằm đó không dùng nữa). Với "Pinta Deck Night": bake THẲNG ánh
sáng đêm vào description (an toàn vì cả 9 cảnh dùng nó đều là đêm). Với "Santa María Ship Deck"
(dùng ở cả cảnh ngày lẫn đêm): sửa lại đúng nội dung (boong tàu) nhưng **KHÔNG** bake ánh sáng
cụ thể — để mood/tông màu trong videoPrompt tự điều chỉnh theo từng cảnh như thiết kế ban đầu.

**Đã thêm cơ chế phòng ngừa cho kịch bản SAU** (`src/splitter/prompt-writer.ts`):
- Thêm 1 đoạn quy tắc mới vào `buildPromptWritingGuide` (SPEC viết prompt, xem mục 4.20 — trước
  đây tên `buildSystemPrompt`, dùng để gọi Gemini; nay dùng làm tài liệu tham khảo khi Claude viết
  tay), ngay sau QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM, giải thích rõ ảnh Setting neo 1 điều kiện ánh sáng cố
  định — để không viết mood mâu thuẫn ánh sáng cho cùng 1 settingName.
- Thêm hàm `warnInconsistentSettingLighting()` — quét MỌI cảnh trong `state/prompts.json`, nhóm
  theo `settingNames`, phát hiện qua từ khoá (night/moonlit/... vs daylight/sunny/...) nếu 1
  setting bị gán CẢ cảnh đêm LẪN cảnh ngày, in CẢNH BÁO ra console (không throw, vì có thể là cố ý
  nếu Setting mô tả trung lập ánh sáng — vd "Santa María Ship Deck" cố ý trung lập vì dùng cả 2
  điều kiện). `STYLE_ANCHOR_NAME` được LOẠI TRỪ khỏi check này — theo thiết kế nó gắn vào MỌI cảnh
  mồ côi bất kể mood, xung đột với nó là bình thường, không phải lỗi. **Sau refactor bỏ Gemini
  (mục 4.20), hàm này được gọi UNCONDITIONALLY trong `orchestrator.ts::loadPrompts` mỗi lần chạy**
  — khác bản đầu (chỉ chạy khi gọi Gemini qua `writeVeoPrompts`, nên trước đây KHÔNG tự chạy lại
  trên `state/prompts.json` đã có sẵn 168 cảnh). Giờ mọi lần `npm run run` đều tự rà soát lại.

### 4.20. Đã bỏ HẲN Gemini/ElevenLabs khỏi codebase — Claude viết prompt trực tiếp
**XÁC NHẬN TRỰC TIẾP (2026-07-18)**: kiểm tra `.env` thật — `GEMINI_API_KEY` và
`ELEVENLABS_API_KEY`/`ELEVENLABS_VOICE_ID` đều để trống, `state/characters|settings|props|
prompts.json` đã có sẵn ĐỦ dữ liệu (168/168 cảnh) — nghĩa là 2 tích hợp này **chưa từng được gọi
thật** trong suốt project, chỉ là nhánh dự phòng không dùng tới. Người dùng xác nhận: quy trình
thật sự là Claude viết tay toàn bộ `state/*.json` trong hội thoại, KHÔNG qua Gemini/ElevenLabs.

**Đã xoá** (API-calling code thật sự, không dùng nữa):
- `src/llm/gemini.ts` (client gọi Gemini API) — xoá hẳn.
- `src/tts/elevenlabs.ts` (client gọi ElevenLabs TTS) — xoá hẳn.
- `config.ts`: bỏ `geminiApiKeys`, `elevenLabsApiKey`, `elevenLabsVoiceId`, `hasGemini`, `hasAudio`.
- `orchestrator.ts`: bỏ hẳn bước TTS (audio luôn `undefined`, video ghép thẳng clip Veo3) và mọi
  nhánh gọi Gemini trong `loadOrExtractCharacters/Settings/Props`/`loadOrWritePrompts` — các hàm
  `load*` giờ CHỈ đọc cache `state/*.json`, throw lỗi rõ ràng nếu thiếu (bắt buộc với characters/
  prompts, bỏ qua với settings/props vì không bắt buộc).
- `characters/settings/props/extract.ts`: bỏ hàm `extractCharacters/Settings/Props` (gọi Gemini).
- `splitter/prompt-writer.ts`: bỏ `writeVeoPrompts` (vòng lặp gọi Gemini theo lô) và
  `parseBatchResponse`.

**KHÔNG xoá** (đây là phần "cần thiết để tạo prompt" đã xây dựng từ đầu project, theo yêu cầu
người dùng — chỉ đổi vai trò từ "system prompt gọi API" sang "SPEC để Claude đọc và viết tay"):
- `CharacterProfile`/`SettingProfile`/`PropProfile` (interface) — vẫn dùng xuyên suốt codebase.
- `CHARACTER_EXTRACTION_GUIDE`/`SETTING_EXTRACTION_GUIDE`/`PROP_EXTRACTION_GUIDE` (hằng số string,
  đổi tên từ `SYSTEM_PROMPT` trong từng `extract.ts`) — toàn bộ quy tắc viết mô tả nhân vật (đa mốc
  tuổi, nhân vật có thật...), bối cảnh, đạo cụ vẫn giữ nguyên nội dung.
- `buildPromptWritingGuide()` (đổi tên từ `buildSystemPrompt`, `splitter/prompt-writer.ts`) — TOÀN
  BỘ quy tắc viết `videoPrompt` (nhân vật, bối cảnh, ánh sáng ngày/đêm mục 4.19, thời đại, bạo lực,
  giới hạn vật lý Veo3...) vẫn giữ nguyên, chỉ đổi từ "gọi Gemini" sang "hàm export, Claude tự đọc
  source code này khi cần viết/rà soát lại `state/prompts.json`".
- `warnInconsistentSettingLighting()` — vẫn chạy, giờ UNCONDITIONALLY mỗi lần `npm run run` (xem
  mục 4.19, cập nhật 2026-07-18) thay vì chỉ khi gọi Gemini.
- `VeoPrompt` interface (bao gồm `status`, xem mục 4.18) — không đổi.

**KHÔNG đổi/không cần đổi**: `package.json` (không có SDK Gemini/ElevenLabs, cả 2 đều gọi bằng
`fetch` thô nên không có dependency nào phải gỡ). `state/*.json` (dữ liệu hiện tại không đổi, vẫn
đúng định dạng cũ).

**Nếu bắt đầu project lịch sử MỚI**: đọc `CHARACTER_EXTRACTION_GUIDE`/`SETTING_EXTRACTION_GUIDE`/
`PROP_EXTRACTION_GUIDE`/`buildPromptWritingGuide()` (import và gọi thử, hoặc đọc trực tiếp source)
làm SPEC trước khi viết tay `state/characters|settings|props|prompts.json` — cùng nội dung/quy tắc
đã đúc kết qua toàn bộ project Columbus này, chỉ khác người/máy thực thi.

### 4.21. Đã cập nhật skill `flow-historical-video-prompts` với 2 bài học mục 4.16/4.19
**Bối cảnh**: skill `flow-historical-video-prompts` (ngoài repo — nằm trong danh sách skill khả
dụng của Claude Code, đường dẫn thật tại thời điểm ghi chú này:
`%APPDATA%\Claude\local-agent-mode-sessions\skills-plugin\<id>\<id>\skills\flow-historical-video-prompts\SKILL.md`,
đường dẫn có thể đổi giữa các phiên/máy — dùng `find`/`Glob` tìm lại theo tên file nếu cần) là kiến
thức DÙNG CHUNG cho MỌI project lịch sử/Flow, tách biệt khỏi RUNBOOK.md (chỉ ghi riêng project
Columbus này). 2 bài học sau đủ tổng quát nên đã merge thẳng vào skill (bằng `skill-creator`, sửa
trực tiếp SKILL.md, không chạy full eval loop vì đây là merge nội dung đã có sẵn, không phải thiết
kế skill mới):
1. Outline bắt buộc áp dụng RÕ RÀNG cho cả nền/vật thể, không chỉ nhân vật (thêm rule #6 trong mục
   "Avoiding Veo3 errors" của skill — xem mục 4.16 RUNBOOK này để biết bối cảnh gốc: glow/sparkle).
2. Setting Ingredient khoá cứng 1 điều kiện ánh sáng ngày/đêm mà mood text không ghi đè được (thêm
   đoạn mới trong mục "Setting/environment Ingredients" của skill — xem mục 4.19 RUNBOOK này để
   biết bối cảnh gốc: bug "Pinta Deck").
Nếu sau này sửa tiếp 2 bug này trong RUNBOOK (mục 4.16/4.19), cân nhắc đồng bộ lại nội dung skill
cho khớp — 2 nơi này có thể lệch nhau theo thời gian nếu chỉ sửa 1 bên.

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
7. **Ánh sáng ngày/đêm sai ở cảnh có settingNames:** xem mục 4.19 — soi 1 frame
   mỗi cảnh có `settingNames` không rỗng, so mood/tông màu trong `videoPrompt`
   (night/moonlit vs daylight/sunny) với ánh sáng THẬT của frame. Đặc biệt nghi
   ngờ nếu 1 setting được dùng ở cả cảnh ngày lẫn đêm mà mô tả trong
   `state/settings.json` không nói rõ mô tả đó trung lập ánh sáng.

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
- **Vừa thêm `OUTLINE_BLOCK` (`src/styleDNA.ts`, 2026-07-17)** — yêu cầu outline
  đen đậm, đều nét trên MỌI nhân vật/đạo cụ/kiến trúc/cảnh vật, áp dụng vào
  `CHARACTER_SHEET_STYLE_BLOCK`, `SETTING_SHEET_STYLE_BLOCK` (ảnh Ingredient
  neo), `MOTION_SUFFIX` (append code vào mọi video prompt) và
  `STYLE_ANCHOR_DESCRIPTION`. **CHƯA XÁC NHẬN BẰNG MẮT** — mọi Character/Setting/
  Prop asset đã tạo TRƯỚC thời điểm này (kể cả Style Anchor v3) dùng style block
  CŨ, chưa chắc có outline đậm/đều như yêu cầu mới. Trước khi tin tưởng áp dụng
  đại trà cho các cảnh còn lại, cần: (1) soi lại các asset cũ xem outline có đủ
  đậm/đều không, xoá+tạo lại nếu cần; (2) generate thử vài clip mới, xác nhận
  outline hiện rõ nhất quán trên cả nhân vật lẫn cảnh vật nền trước khi chạy đại
  trà cho 148 cảnh còn thiếu.

## 7. Repo

Git đã `init` cục bộ trong quá trình làm project này — **CHƯA có remote**.
Dùng `git status`/`git diff`/`git log` để xem lịch sử thay đổi. File KHÔNG có
trong git (theo `.gitignore`): `.env`, `output/`, `state/` (cache
characters/settings/props/prompts + project Flow đã tạo), `.auth/` (session
Google đã đăng nhập), `input/story.txt` (nội dung kịch bản) — nếu context bị
mất VÀ các file này còn nguyên trên máy, mục 0 của tài liệu này mô tả đúng
trạng thái chúng; nếu bị xoá, cần viết lại từ đầu theo mục 1.
