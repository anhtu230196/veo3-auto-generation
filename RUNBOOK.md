# veo3-story-pipeline — Runbook đầy đủ (đọc file này trước khi làm gì cả)

Tài liệu này dành cho 1 phiên Claude Code MỚI (context đã bị clear, hoặc máy khác)
tiếp quản repo. Nó gộp toàn bộ kiến trúc, cách chạy, trạng thái hiện tại, VÀ các
bug/bài học đã tốn rất nhiều thời gian mới tìm ra CỦA PIPELINE VIDEO VEO3 — đọc kỹ
phần "Bài học xương máu" (mục 4) trước khi sửa code trong `veo3bot/`, để không lặp
lại đúng những lỗi đã mất công sửa. **Repo này còn host thêm 1 việc thứ 2 không
liên quan gì tới pipeline video — xem ngay phần "📌 Repo này giờ có 2 việc ĐỘC LẬP"
trong mục 0 bên dưới trước khi giả định mọi yêu cầu của người dùng đều là về
video/Veo3/Flow.**

## 0. Trạng thái hiện tại (đọc đầu tiên)

- **(2026-07-31) Không có project video nào đang chạy.** Người dùng đã xoá
  toàn bộ dữ liệu của các project video trước đó và xác nhận không tiếp tục
  làm nữa — `state/`, `output/`, `input/story.txt` đều đang TRỐNG. **Code
  pipeline (`src/`, `scripts/`) vẫn giữ nguyên**, dùng lại được ngay cho 1
  project video mới bất cứ lúc nào (quy trình ở mục 1).

### 📌 Repo này giờ có 2 việc ĐỘC LẬP — đừng nhầm lẫn 2 việc với nhau

Kể từ 2026-07-31, thư mục này KHÔNG chỉ còn là pipeline video Veo3 (phần còn
lại của RUNBOOK này, mục 1-7) — nó còn đang host thêm **1 workflow hoàn toàn
khác, không liên quan gì tới Playwright/Google Flow/tạo video**:

- **Viết kịch bản tường thuật YouTube về động vật/tự nhiên** (giọng hài
  hước/dí dỏm) — quy trình: gợi ý chủ đề → viết bản tiếng Việt trong chat →
  người dùng duyệt thủ công → viết lại (không dịch máy) bản tiếng Anh cho
  ElevenLabs TTS.
- Toàn bộ quy trình + phong cách nằm trong skill
  **`.claude/skills/nature-doc-narration-script/SKILL.md`** — đọc file đó
  (không phải RUNBOOK này) khi làm việc này. File
  `.claude/skills/nature-doc-narration-script/used-topics.md` ghi lại các chủ
  đề đã làm để không gợi ý trùng — SKILL.md tự dặn đọc file này ở bước 0.
  Kịch bản đã duyệt (VN + EN) được lưu vào `narration-scripts/<ten-tap>/`.
- Không tạo state/output gì trong `state/`/`output/`/`input/` cho việc này —
  2 thư mục đó CHỈ dành cho pipeline video ở mục 1-7. Nếu người dùng nhắc tới
  "kịch bản", "chủ đề mới", "duyệt bản tiếng Anh"... nhiều khả năng đang nói
  về workflow NÀY, không phải pipeline Veo3 — hỏi lại nếu không chắc.

### ⚠️ KHI CÓ KỊCH BẢN MỚI — đọc TRƯỚC KHI viết gì vào `state/`

Mục "Trạng thái hiện tại" ở trên đã ghi rõ: `state/`/`output/`/`input/story.txt`
đang TRỐNG HOÀN TOÀN — không có project nào đang "sống" trong 2 thư mục đó, nên
có thể viết thẳng `state/*.json` cho project mới mà không sợ ghi đè gì cả.

Đoạn dưới đây vẫn còn giá trị THAM KHẢO cho lần sau (nếu 1 project mới đã tích
luỹ dữ liệu, rồi người dùng lại muốn đổi sang câu chuyện khác lần nữa):

**Việc cần làm khi đó**: hỏi rõ người dùng muốn 1 trong 2 hướng sau trước khi viết
đè bất kỳ `state/*.json` nào cho kịch bản mới:
1. **Chạy song song, KHÔNG đụng vào project đang có** (mặc định nên đề xuất, rủi
   ro = 0): dùng `STATE_DIR`/`OUTPUT_DIR`/`STORY_INPUT_PATH` khác trong `.env` (vd
   `STATE_DIR=./state-<tenkichban>`, `OUTPUT_DIR=./output-<tenkichban>`,
   `STORY_INPUT_PATH=./input/<tenkichban>.txt`) — `config.ts` đã hỗ trợ sẵn 3 biến
   này, không cần sửa code. `.auth/` (session Google) dùng chung, không cần đổi.
2. **Thay hẳn project cũ**:
   - BẮT BUỘC backup `state/` và `output/` hiện tại trước (đổi tên thành
     `state-<tenproject>-backup/`/`output-<tenproject>-backup/`, hoặc nén lại) —
     xác nhận backup thành công rồi mới viết đè file mới vào `state/`/`output/`
     mặc định. Bước backup này KHÔNG bị bỏ qua dù người dùng đồng ý ghi đè.
   - **TUYỆT ĐỐI KHÔNG tái sử dụng dữ liệu project cũ** khi viết `state/*.json` cho
     kịch bản mới — không mang theo/thừa hưởng bất kỳ nhân vật, bối cảnh, đạo cụ
     nào. Viết hoàn toàn mới từ đầu, đúng theo nội dung kịch bản mới (dùng skill
     `flow-historical-video-prompts` + các `*_EXTRACTION_GUIDE`/
     `buildPromptWritingGuide()` như quy trình ở mục 1 — không phải chỉnh sửa/kế
     thừa file cũ).
   - Sau đó PHẢI cập nhật lại mục 0 này để mô tả đúng project mới đang "sống"
     trong `state/`/`output/` mặc định — RUNBOOK phải luôn khớp với project thật.

## 1. Dự án làm gì

Chuyển 1 kịch bản văn bản (lịch sử/khám phá) thành 1 video hoạt hình phong cách
2D flat vector, hình ảnh AI tạo bởi Veo3 (qua Google Flow), nhân vật/bối
cảnh/đạo cụ đều giữ hình ảnh nhất quán xuyên suốt qua cơ chế Ingredient
(`@mention`) của Flow. (Chưa có project nào đang chạy kể từ 2026-07-31 — xem
mục 0.)

**3 loại Ingredient** (khác biệt quan trọng nhất so với bản gốc dự án — xem mục
3 để hiểu cách tạo từng loại):
- **Character** (`state/characters.json`) — nhân vật có tên riêng, tạo qua menu
  Flow "Add Media → Create Character" (đã xác nhận ổn định từ đầu dự án).
- **Setting** (`state/settings.json`) — bối cảnh/địa điểm cố định (vd "boong
  tàu", "triều đình"), dùng để giữ ĐÚNG cùng 1 không gian khi cắt cảnh rộng →
  cận trong cùng 1 địa điểm.
- **Prop** (`state/props.json`) — đạo cụ/vật thể cố định cần giữ đúng hình dạng
  qua nhiều cảnh (vd 1 con tàu cụ thể, lá cờ hoàng gia).

Setting và Prop **KHÔNG** tạo qua "Create Character"/"Create Scene" như suy đoán
ban đầu — cách ĐÚNG đã xác nhận bằng codegen thật là chế độ **Image, số lượng
1** rồi đổi tên (xem `src/veo3bot/imageAsset.ts` và mục 4.10-4.12).

**Luồng xử lý** — ĐÃ BỎ HẲN Gemini/ElevenLabs (mục 4.20), `state/*.json` giờ
LUÔN do Claude viết tay, không có nhánh gọi LLM/TTS nào nữa. **Từ 2026-07-19,
pipeline TÁCH thành 3 LỆNH riêng** (trước đây 2 lệnh, xem mục 4.31 — tách
thêm bước download khỏi generate theo yêu cầu người dùng; trước đó nữa gộp
chung trong `src/orchestrator.ts`/`npm run run` — file đó đã bị XOÁ):

**Lệnh 1 — `npm run assets`** (`src/createAssets.ts`) — chỉ tạo Ingredient,
KHÔNG động đến video:
1. Đọc `state/characters.json` (bắt buộc) / `settings.json` / `props.json`
   (tuỳ chọn) — chỉ ĐỌC cache, báo lỗi rõ nếu thiếu thay vì tự sinh.
2. Tạo Character/Setting/Prop asset trong Google Flow cho từng mục (giữ hình
   ảnh nhất quán) — `ensureCharactersInFlow` / `ensureSettingsInFlow` /
   `ensurePropsInFlow`.

**Lệnh 2 — `npm run generate`** (`src/generateVideo.ts`) — chỉ generate +
đổi tên video, KHÔNG tạo/tra lại Ingredient, KHÔNG tải video về/ghép video cuối
(xem mục 4.31):
3. Đọc `state/prompts.json` (đã viết đủ tay theo đúng số cảnh của
   `input/story.txt`) — báo lỗi rõ nếu thiếu cảnh. Chạy
   `warnInconsistentSettingLighting` ngay sau khi đọc (mục 4.19).
4. Tự động hoá Google Flow bằng Playwright để tạo video Veo3 cho từng cảnh,
   đính đúng Character/Setting/Prop asset qua `@mention`, rồi ĐỔI TÊN clip vừa
   tạo trong Flow theo chỉ số cảnh (vd "clip_017", `renameLatestVideo()`) —
   KHÔNG tải file về ở bước này.

**Lệnh 3 — `npm run download`** (`src/downloadVideos.ts`, MỚI, mục 4.31) —
chỉ tải video + ghép video cuối, chạy SAU KHI `npm run generate` đã xong (toàn
bộ hoặc một phần, resume-safe):
5. Đọc `state/prompts.json`, lọc cảnh `status: "success"` chưa có file local.
6. Mở lần lượt mọi project Flow đã biết, tìm clip theo tên đã đổi, tải về ở
   chất lượng **1080p** (`downloadClip()`) → `output/clips/clip_NNN.mp4`.
7. Ghép mọi clip đã có file local thành video cuối (ffmpeg, KHÔNG audio) →
   `output/video_final.mp4`.

**Vì sao tách 2→3 lệnh**: (assets vs generate, lý do gốc) cho phép tạo xong
toàn bộ nhân vật/bối cảnh/đạo cụ 1 lần, xác nhận bằng mắt trong Flow (đúng
hình, đúng tên, không lẫn style — xem mục 4.10-4.12/4.19), rồi mới chạy
generate video nhiều lần (retry cảnh bị chặn, viết lại prompt) mà không phải
tra lại Ingredient mỗi lần. (generate vs download, lý do mục 4.31) người dùng
muốn generate nhanh/gọn hơn (không tốn thời gian tải từng file ngay lúc
generate) và tải về 1 lần cuối ở chất lượng cao hơn (1080p). Cả 3 lệnh đều
resume-safe — `assets`/`generate` dựa vào field `status` (`src/assetStatus.ts`),
`download` dựa vào file đã tồn tại trong `output/clips/` — và `assets`/
`generate` đều dùng `atomicWriteJson()` khi ghi `state/*.json` (mục 4.23).

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
   `generateVideo.ts::loadPrompts`.
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
7. Người dùng chạy `npm run login:veo3` (nếu chưa đăng nhập) rồi `npm run assets`
   (tạo Character/Setting/Prop), xác nhận bằng mắt trong Flow, rồi
   `npm run generate` (tạo video từng cảnh + ghép video cuối).

## 2. Cài đặt & chạy (xem thêm README.md)

```bash
npm install
npx playwright install chromium
npm run login:veo3     # đăng nhập Google 1 lần, lưu session vào .auth/ (trieudev99@gmail.com)
npm run assets          # tạo Character/Setting/Prop trong Flow, resume-safe
npm run generate        # tạo video từng cảnh + đổi tên trong Flow, resume-safe (mục 4.31)
npm run download        # tải video (1080p) + ghép video cuối, resume-safe (mục 4.31)
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

**Kiểm tra thay đổi code**: dùng `git status`/`git diff`/`git log` (xem mục 7
cho thông tin remote) — không cần hỏi lại xem file nào vừa sửa.

**Script trong `scripts/`** (không cần `npm install`, chỉ dùng Node core, dùng
lại được cho MỌI project):
- `split-scenes.mjs` — tách `input/story.txt` thành `state/scenes.json` theo
  đúng logic `splitIntoScenes` (không cần Gemini).
- `check-clip-names.ts`, `generate-test-scenes.ts` — tiện ích debug/test (xem
  chi tiết cách dùng trong chính file).

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
trực tiếp: 1 ảnh Setting (boong tàu) ra kèm 2 người đứng "Front View"/"3/4
View" như đang tạo nhân vật, và có viền xanh chroma-key thay vì là ảnh nền
thật. Setting
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
   nhân vật đó đè lên (xác nhận: 1 cảnh có nhân vật vô danh ra đúng hình người
   của Style Anchor thay vì người chung chung). **BỎ HẲN "Create Character"
   cho việc này.**
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
trực tiếp trên 1 Prop cụ thể — sau khi hết `GENERATE_TIMEOUT_MS` + reload +
chờ CỐ ĐỊNH 3 giây, code vẫn throw "hết thời gian chờ", nhưng người dùng tự
kiểm tra trong Flow thấy ảnh **đã tạo xong thật**, chỉ chưa kịp đổi tên (vì
code throw trước khi chạy tới bước rename). Nguyên nhân: 3 giây cố định sau
reload không đủ để trang tải lại lưới media khi project đã tích luỹ nhiều
cảnh + nhiều Character/Setting/Prop khác — cùng lớp lỗi mục 4.14.
Đã sửa ở CẢ 2 nơi: sau reload, chờ `button:has-text("Add Media")` HIỆN RA
(dấu hiệu trang thật sự tương tác được, timeout 90s) rồi **POLL THÊM** tối đa
`RELOAD_RECHECK_TIMEOUT_MS` (90 giây) thay vì chốt ngay sau 1 mốc cố định.
Cũng tăng `GENERATE_TIMEOUT_MS` của `imageAsset.ts` từ 3 phút lên 5 phút — nghi
ngờ ảnh có nội dung biểu tượng/quốc kỳ cần thời gian kiểm duyệt lâu hơn ảnh
thường (giống hiện tượng cảnh thẩm vấn/toà án cần 10 phút thay vì 5 phút, đã
ghi ở đầu mục này).

**LƯU Ý KHI GẶP LẠI LỖI NÀY (asset đã tạo trong Flow nhưng bot báo lỗi trước
khi kịp đổi tên)**: đừng chạy lại `npm run assets` ngay — `ensurePropsInFlow`/
`ensureSettingsInFlow` tra asset đã tồn tại BẰNG TÊN, ảnh chưa đổi tên sẽ
KHÔNG được tìm thấy, khiến bot tạo THÊM 1 ảnh trùng nội dung (tốn credit, lẫn
lộn 2 ảnh cùng nội dung nhưng chỉ 1 cái được đặt tên đúng). Vào Flow,
right-click ảnh vừa tạo (chưa tên) → Rename → gõ đúng tên → Done, RỒI mới
chạy lại pipeline để nó nhận ra asset đã có sẵn.

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
  các nhân vật/bối cảnh/đạo cụ còn lại** thay vì crash cả tiến trình. Lần chạy `npm run assets`
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
**XÁC NHẬN TRỰC TIẾP**: 1 Setting (bối cảnh chòi quan sát trên tàu) có `description` trong
`state/settings.json` KHÔNG chỉ định ngày/đêm ("Open dark ocean visible on all sides" — không có
"at night"). Ảnh asset thật được Flow tạo ra là **BAN NGÀY**, rồi bị kéo vào **cả 9 cảnh** dùng
@mention nó — toàn bộ 9 cảnh đó đều là cảnh đêm/trăng theo kịch bản ("Cool moonlit blue-white
tones", "night", "moonlight"...). Cùng lúc phát hiện thêm 1 lỗi tệ hơn: 1 Setting khác (boong
tàu chính, 8 cảnh) có `description` bị COPY-PASTE NHẦM từ "Style Anchor" — mô tả 1 bãi biển
vắng, không hề có tàu/boong tàu nào, dù đã `status: "success"` (tưởng đã tạo xong đúng).

**Bài học cốt lõi**: ảnh Setting reference trong Flow là 1 ảnh TĨNH DUY NHẤT — nếu mô tả không
chỉ định rõ ngày/đêm, Flow tự chọn 1 điều kiện ánh sáng cố định (thường mặc định ban ngày), và
mood/tông màu viết trong `videoPrompt` từng cảnh **KHÔNG đủ mạnh để ghi đè** ảnh đã "khoá cứng"
đó khi @mention — đúng bài học đã có ở mục 4.12 (nội dung ảnh Ingredient LÀ đúng thứ sẽ bị kéo
vào video), áp dụng thêm cho khía cạnh ánh sáng/thời điểm trong ngày, không chỉ hình dạng vật
thể.

**Cách sửa đã dùng**: đổi tên Setting bị lỗi (thêm hậu tố mới, vd "X Deck" → "X Deck Night") thay
vì sửa tại chỗ — vì asset cũ đã tạo (status "success") trong Flow với nội dung sai, sửa mô tả rồi
để nguyên tên sẽ khiến bot tra tên thấy asset cũ vẫn "tồn tại" và bỏ qua, không bao giờ tạo lại.
Đổi tên buộc bot tạo asset MỚI hoàn toàn dưới tên mới (không cần xoá gì trong Flow, asset cũ chỉ
nằm đó không dùng nữa). Với Setting chỉ dùng ở 1 điều kiện ánh sáng: bake THẲNG điều kiện đó vào
description. Với Setting dùng ở CẢ cảnh ngày lẫn đêm: sửa lại đúng nội dung nhưng **KHÔNG** bake
ánh sáng cụ thể — để mood/tông màu trong videoPrompt tự điều chỉnh theo từng cảnh như thiết kế
ban đầu.

**Đã thêm cơ chế phòng ngừa cho kịch bản SAU** (`src/splitter/prompt-writer.ts`):
- Thêm 1 đoạn quy tắc mới vào `buildPromptWritingGuide` (SPEC viết prompt, xem mục 4.20 — trước
  đây tên `buildSystemPrompt`, dùng để gọi Gemini; nay dùng làm tài liệu tham khảo khi Claude viết
  tay), ngay sau QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM, giải thích rõ ảnh Setting neo 1 điều kiện ánh sáng cố
  định — để không viết mood mâu thuẫn ánh sáng cho cùng 1 settingName.
- Thêm hàm `warnInconsistentSettingLighting()` — quét MỌI cảnh trong `state/prompts.json`, nhóm
  theo `settingNames`, phát hiện qua từ khoá (night/moonlit/... vs daylight/sunny/...) nếu 1
  setting bị gán CẢ cảnh đêm LẪN cảnh ngày, in CẢNH BÁO ra console (không throw, vì có thể là cố ý
  nếu Setting mô tả trung lập ánh sáng, dùng cố ý ở cả 2 điều kiện). `STYLE_ANCHOR_NAME` được
  LOẠI TRỪ khỏi check này — theo thiết kế nó gắn vào MỌI cảnh mồ côi bất kể mood, xung đột với nó
  là bình thường, không phải lỗi. Hàm này được gọi UNCONDITIONALLY trong `generateVideo.ts::
  loadPrompts` mỗi lần chạy `npm run generate`.

### 4.20. Đã bỏ HẲN Gemini/ElevenLabs khỏi codebase — Claude viết prompt trực tiếp
**XÁC NHẬN TRỰC TIẾP**: kiểm tra `.env` thật — `GEMINI_API_KEY` và
`ELEVENLABS_API_KEY`/`ELEVENLABS_VOICE_ID` đều để trống, `state/characters|settings|props|
prompts.json` đã có sẵn ĐỦ dữ liệu cho toàn bộ số cảnh — nghĩa là 2 tích hợp này **chưa từng
được gọi thật** trong suốt project, chỉ là nhánh dự phòng không dùng tới. Người dùng xác nhận:
quy trình thật sự là Claude viết tay toàn bộ `state/*.json` trong hội thoại, KHÔNG qua
Gemini/ElevenLabs.

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
- `warnInconsistentSettingLighting()` — vẫn chạy, giờ UNCONDITIONALLY mỗi lần `npm run generate`
  (xem mục 4.19, cập nhật 2026-07-18) thay vì chỉ khi gọi Gemini.
- `VeoPrompt` interface (bao gồm `status`, xem mục 4.18) — không đổi.

**KHÔNG đổi/không cần đổi**: `package.json` (không có SDK Gemini/ElevenLabs, cả 2 đều gọi bằng
`fetch` thô nên không có dependency nào phải gỡ). `state/*.json` (dữ liệu hiện tại không đổi, vẫn
đúng định dạng cũ).

**Nếu bắt đầu project lịch sử MỚI**: đọc `CHARACTER_EXTRACTION_GUIDE`/`SETTING_EXTRACTION_GUIDE`/
`PROP_EXTRACTION_GUIDE`/`buildPromptWritingGuide()` (import và gọi thử, hoặc đọc trực tiếp source)
làm SPEC trước khi viết tay `state/characters|settings|props|prompts.json` — cùng nội dung/quy tắc
đã đúc kết qua các project video trước đó, chỉ khác người/máy thực thi.

### 4.21. Đã cập nhật skill `flow-historical-video-prompts` với 2 bài học mục 4.16/4.19
**Bối cảnh**: skill `flow-historical-video-prompts` (ngoài repo — nằm trong danh sách skill khả
dụng của Claude Code, đường dẫn thật tại thời điểm ghi chú này:
`%APPDATA%\Claude\local-agent-mode-sessions\skills-plugin\<id>\<id>\skills\flow-historical-video-prompts\SKILL.md`,
đường dẫn có thể đổi giữa các phiên/máy — dùng `find`/`Glob` tìm lại theo tên file nếu cần) là kiến
thức DÙNG CHUNG cho MỌI project lịch sử/Flow, tách biệt khỏi RUNBOOK.md (chỉ ghi riêng pipeline +
lịch sử debug của repo này). 2 bài học sau đủ tổng quát nên đã merge thẳng vào skill (bằng
`skill-creator`, sửa
trực tiếp SKILL.md, không chạy full eval loop vì đây là merge nội dung đã có sẵn, không phải thiết
kế skill mới):
1. Outline bắt buộc áp dụng RÕ RÀNG cho cả nền/vật thể, không chỉ nhân vật (thêm rule #6 trong mục
   "Avoiding Veo3 errors" của skill — xem mục 4.16 RUNBOOK này để biết bối cảnh gốc: glow/sparkle).
2. Setting Ingredient khoá cứng 1 điều kiện ánh sáng ngày/đêm mà mood text không ghi đè được (thêm
   đoạn mới trong mục "Setting/environment Ingredients" của skill — xem mục 4.19 RUNBOOK này để
   biết bối cảnh gốc).
Nếu sau này sửa tiếp 2 bug này trong RUNBOOK (mục 4.16/4.19), cân nhắc đồng bộ lại nội dung skill
cho khớp — 2 nơi này có thể lệch nhau theo thời gian nếu chỉ sửa 1 bên.

### 4.22. (đã xoá 2026-07-31) — dead-end cũ về "prominent people", thay hẳn bằng mục 4.49
Mục này từng ghi lại 1 cách né lỗi "prominent people" (đổi cách chèn @mention từ dồn cục sang
xen kẽ đúng vị trí) — về sau xác nhận KHÔNG đủ (mục 4.26 cũ), rồi cả hướng "chèn xen kẽ" này bị
thay thế hoàn toàn bởi quyết định kiến trúc cuối cùng ở **mục 4.49** (đọc mục đó thay thế). Xem
mục 4.1 cho cơ chế @mention hiện tại.

### 4.23. `state/prompts.json` bị mất trắng (0 byte) — nguyên nhân, và ghi atomic
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: `state/prompts.json` bị phát hiện RỖNG HOÀN TOÀN (0 byte).
`state/` bị `.gitignore` nên KHÔNG có git backup nào. Nguyên nhân: `savePromptsProgress` (lúc đó
còn trong `orchestrator.ts`, nay đã xoá) dùng `fs.writeFile` — thao tác này KHÔNG atomic, nó
truncate file về 0 byte TRƯỚC khi ghi nội dung mới. Nếu process bị crash/kill đúng lúc giữa 2
bước đó, file bị bỏ lại ở trạng thái 0 byte vĩnh viễn.

**Đã sửa gốc rễ**: thêm `atomicWriteJson()` — ghi ra file TẠM (`<path>.tmp-<pid>-<timestamp>`)
trước, rồi `fs.rename()` đè lên file đích. `rename` trên cùng ổ đĩa là thao tác NGUYÊN TỬ ở tầng
hệ điều hành — không có trạng thái "nửa vời" giữa chừng, nên dù crash bất cứ lúc nào, file đích
chỉ có thể giữ nguyên bản CŨ hoàn toàn hoặc có bản MỚI hoàn toàn, không bao giờ rỗng/hỏng nữa.
Áp dụng cho CẢ 4 hàm save (prompts/characters/settings/props) — cùng lỗ hổng như nhau. Đây là lý
do `assets`/`generate` đều dùng `atomicWriteJson()` khi ghi `state/*.json` (xem mục 1).

### 4.24. (đã xoá 2026-07-31) — bug cụ thể của 1 roster nhân vật, đã tổng quát hoá vào mục 4.40
Mục này từng ghi lại 1 sự cố "prominent people" chặn cả người thân của 1 nhân vật nổi tiếng cụ
thể, và cách đặt tên quan hệ sở hữu (vd "X's Brother") để né bộ lọc. Bài học TỔNG QUÁT (đặt tên
quan hệ cho người thân của bất kỳ nhân vật có thật/nổi tiếng nào) đã được ghi lại đầy đủ ở
**mục 4.40** — đọc mục đó thay thế.

### 4.25. Picker `@mention` báo "không tìm thấy" — search tên phổ biến khớp hàng trăm kết quả, danh sách ảo hoá không render kịp tới đúng item
**XÁC NHẬN TRỰC TIẾP**: 1 Prop có tên là 1 cụm từ khá phổ biến (xuất hiện lặp lại trong nhiều
prompt cảnh khác nhau) bị lỗi picker không tìm thấy dù `status: "success"` thật trong
`state/props.json`. Soi debug HTML thấy ô search khớp đúng, nhưng các item ĐẦU render trong DOM
đều là các tên DÀI HƠN cùng tiền tố (vd "X Ship Deck", "X deck at sea…") — KHÔNG có item nào tên
CHÍNH XÁC. Nguyên nhân: danh sách kết quả dùng `react-virtuoso` (ảo hoá — chỉ render item đang ở
viewport); đo `padding-bottom` cho thấy **hàng trăm kết quả** khớp từ khoá đó, vì Flow search khớp
CẢ text nhắc tới cụm đó trong nhiều clip/ảnh khác, không chỉ đúng 1 asset trùng tên. Sort mặc định
"Recent" (mới nhất trước) đẩy asset tạo từ SỚM xuống gần cuối danh sách dài — không cách nào
chờ/cuộn kịp trong thời gian hợp lý nếu không đổi chiến lược.

**Đã sửa** (`insertMentionChip`, `generate.ts`): (1) thử đổi sort dropdown (cạnh ô search) sang
"Name/A-Z" trước khi tìm card — tên ĐÚNG (không hậu tố) luôn xếp TRƯỚC các tên dài hơn cùng tiền
tố theo bảng chữ cái; best-effort, im lặng bỏ qua (giữ nguyên sort "Recent") nếu Flow không có
tuỳ chọn này hoặc selector không khớp; (2) fallback POLL + CUỘN danh sách ảo hoá tối đa 20 giây
(thay vì chỉ chờ cố định) trước khi kết luận thật sự không tìm thấy.

**Bài học cho project SAU này**: cân nhắc đặt tên Character/Setting/Prop CÓ TIỀN TỐ RIÊNG BIỆT
(không dùng tên trùng hoàn toàn với 1 từ/cụm sẽ xuất hiện lặp lại trong nhiều prompt khác) để
tránh hẳn lớp vấn đề "search quá phổ biến" này.

### 4.26. (đã xoá 2026-07-31) — bug cụ thể "tên ngắn không khớp roster", nguyên tắc chung đã có ở mục 4.2/CHARACTER_EXTRACTION_GUIDE
Mục này từng ghi lại 1 đợt quét sửa hàng loạt cảnh dùng tên nhân vật rút gọn không khớp
CHÍNH XÁC tên đăng ký trong `characters.json` (picker `@mention` dùng so khớp EXACT). Nguyên tắc
chung — LUÔN dùng tên đăng ký ĐẦY ĐỦ, không rút gọn/thân mật, và nhân vật ở mốc tuổi khác cần
Ingredient riêng — đã nằm sẵn trong `CHARACTER_EXTRACTION_GUIDE` (`src/characters/extract.ts`) và
skill `flow-historical-video-prompts` ngoài repo (mục 4.21), áp dụng cho MỌI project sau này.

### 4.27. Phát hiện xong video timeout oan — đếm SỐ LƯỢNG `video[src]` sai, phải so TẬP HỢP giá trị `src`
**XÁC NHẬN TRỰC TIẾP**: 1 cảnh báo `Hết thời gian chờ generate — video không xuất hiện kể cả sau
khi reload` — người dùng xác nhận trực tiếp video ĐÃ tạo xong thật trong Flow. Soi debug capture
(chụp SAU reload + hết 90s recheck) phát hiện: trang chỉ có **ĐÚNG 1 thẻ `<video src>` duy nhất**
trên toàn trang — không phải cả lưới nhiều video như code cũ giả định. `debugLog("baseline", ...)`
in ra `baselineVideoCount=1` (đo TRƯỚC khi bấm generate) — nghĩa là Flow chỉ giữ 1 phần tử
`<video>` "đang xem/preview" DUY NHẤT và **đổi `src` của chính nó tại chỗ** khi có clip mới, KHÔNG
thêm phần tử `<video>` mới vào DOM. Cơ chế cũ (`videoLocatorAll.count() > baselineVideoCount`, kế
thừa từ mục 4.6) chỉ đúng cho trường hợp DOM thêm phần tử mới — số lượng ở đây luôn giữ nguyên = 1
cả trước lẫn sau khi xong thật, nên `count() > baseline` (`1 > 1`) không bao giờ đúng, báo timeout
oan MỌI LẦN bất kể đợi bao lâu (không phải vấn đề thời gian chờ).

**Đã sửa** (`generate.ts`): thêm hàm `currentVideoSrcs(page)` trả về TẬP HỢP (`Set`) toàn bộ giá trị `src`
hiện có của mọi thẻ `video[src]` trên trang (không chỉ đếm số lượng). So sánh: coi là xong khi xuất hiện 1
giá trị `src` KHÔNG có trong tập hợp baseline (chụp trước khi bấm generate) — cách này bắt được CẢ 2 trường
hợp: DOM thêm phần tử `<video>` mới (baseline cũ vẫn đúng) LẪN phần tử `<video>` cũ đổi `src` tại chỗ
(baseline cũ bỏ sót, cách mới bắt được). Áp dụng nhất quán ở CẢ vòng poll chính LẪN vòng reload-recheck.
Dùng thẳng `newVideoSrc` tìm được để tải video (không còn gọi `videoLocator.first().getAttribute("src")`
sau vòng lặp — có thể trỏ nhầm phần tử nếu DOM đổi thứ tự).

**KHÔNG tái diễn bug mục 4.6** (tải nhầm video CŨ của cảnh khác gây trùng lặp): cách so tập hợp `src` vẫn
giữ đúng nguyên tắc cốt lõi của mục 4.6 — chỉ chấp nhận `src` KHÔNG có trong baseline, nên không thể vô tình
khớp lại 1 clip cũ đã tồn tại từ trước; thậm chí còn CHẶT CHẼ HƠN cách đếm số lượng cũ (đếm số lượng có thể
"trùng khớp giả" nếu 1 phần tử cũ mất đi đúng lúc 1 phần tử mới xuất hiện, tổng số lượng không đổi nhưng
code cũ vẫn coi là "chưa xong"; cách so tập hợp `src` không có lỗ hổng này).

**Đồng thời giảm `GENERATE_TIMEOUT_MS` từ 10 phút xuống 3 phút** theo yêu cầu người dùng (không muốn đợi
lâu khi có lỗi thật) — đánh đổi: cảnh nào THẬT SỰ cần hơn 3 phút để Flow xử lý xong (vd nội dung cần kiểm
duyệt lâu hơn, xem lịch sử bug ở đầu file `generate.ts`) sẽ rơi vào nhánh reload-recheck (giữ nguyên 90
giây) rồi có thể vẫn timeout thật — chấp nhận retry ở lần `npm run generate` sau (resume-safe) thay vì ngồi
chờ tại chỗ. Với fix chính (so tập hợp `src`) ở trên, kỳ vọng phần lớn cảnh xong trong vài chục giây tới
1-2 phút sẽ được PHÁT HIỆN ĐÚNG ngay trong vòng poll 3 phút đầu, không cần rơi vào nhánh reload nữa.

**CHƯA XÁC NHẬN**: chưa generate lại thử cảnh #14 với code đã sửa — cần
`npx tsx scripts/generate-test-scenes.ts 14 15 16` (bật `DEBUG=1`) để xác nhận cả bug phát hiện video LẪN
timeout 3 phút mới hoạt động đúng.

### 4.28. Bộ lọc "prominent people" chặn CẢ chính nhân vật nổi tiếng khi dùng tên ĐẦY ĐỦ — không chỉ người thân
**Bài học cốt lõi (xác nhận trực tiếp qua test thật)**: dùng tên ĐẦY ĐỦ (tên + họ) của 1 nhân vật
lịch sử có thật khiến Flow chặn với lỗi "prominent people", NGAY CẢ KHI đó là nhân vật chính của
câu chuyện — chỉ cần rút gọn còn TÊN RIÊNG (bỏ họ) là hết bị chặn, không cần đổi sang tên quan hệ
như với người thân (mục 4.24 cũ). Bộ lọc có vẻ quét theo CHUỖI TÊN ĐẦY ĐỦ khớp 1 người nổi tiếng
đã biết (tên riêng đứng một mình quá chung chung để định danh cụ thể 1 người), không phải nhận
diện hình ảnh qua chip @mention.

Nguyên tắc đầy đủ (3 case: nhân vật chính, người thân, nhân vật lịch sử khác trong dàn nhân vật)
đã được tổng quát hoá ở **mục 4.40** và bake sẵn vào `CHARACTER_EXTRACTION_GUIDE`
(`src/characters/extract.ts`) — đọc mục đó để áp dụng cho project mới.

### 4.29. Prop một mình KHÔNG đủ neo phong cách + nhân vật đã đăng ký bị viết thành "unnamed" + race condition ghi đè `state/prompts.json` khi 2 process cùng chạy
**XÁC NHẬN TRỰC TIẾP — bug 1**: 1 cảnh toàn cảnh chỉ có Prop (`characterNames`/`settingNames` đều
rỗng) render ra ảnh THẬT/photorealistic thay vì 2D flat vector, dù `videoPrompt` đã có đủ
`MOTION_SUFFIX`. Nguyên nhân: ảnh Prop reference (`CHARACTER_SHEET_STYLE_BLOCK`) là 1 vật thể CÔ
LẬP trên nền xanh chroma-key — không chứa bối cảnh/môi trường xung quanh, nên không neo được
phong cách cho phần NỀN chiếm phần lớn khung hình ở cảnh toàn/rộng, dù bản thân vật thể vẫn đúng
hình dạng. Quy tắc cũ ở mục "QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM" (`buildPromptWritingGuide`) từng ghi "bỏ
qua Style Anchor nếu cảnh đã có BẤT KỲ Ingredient nào (kể cả Prop)" — SAI, đã sửa thành "chỉ bỏ
qua nếu có Character HOẶC Setting; Prop một mình KHÔNG đủ, vẫn cần thêm Style Anchor".
(Ghi chú: sau đó ở mục 4.30 project đã bỏ hẳn cơ chế Style Anchor, nên nguyên tắc "Prop không đủ
neo" giờ chỉ còn là kiến thức nền, không còn áp dụng trực tiếp — nhưng vẫn hữu ích nếu bật lại.)

**XÁC NHẬN TRỰC TIẾP — bug 2**: 1 cảnh mô tả rõ ràng 1 nhân vật ĐÃ đăng ký bị viết prompt thành
"a young unnamed X" dù Character đó ĐÃ tồn tại sẵn trong danh sách — không phải thiếu Ingredient
mà là QUÊN ĐỐI CHIẾU danh sách nhân vật đã có trước khi mặc định viết "unnamed". Đã thêm rule mới
vào "QUY TẮC NHÂN VẬT" (`buildPromptWritingGuide`, `src/splitter/prompt-writer.ts`): bắt buộc đối
chiếu lại danh sách nhân vật TRƯỚC khi viết bất kỳ cụm "unnamed X" nào — quy tắc này vẫn còn hiệu
lực, không liên quan gì đến việc bỏ Style Anchor ở mục 4.30.

**⚠️ RACE CONDITION NGHIÊM TRỌNG (vẫn còn hiệu lực cho mọi project) — `npm run generate` ĐANG CHẠY
tự ghi đè mất fix đang áp dụng trực tiếp vào `state/prompts.json`**: `generateVideo.ts::main` đọc
`prompts.json` vào biến trong bộ nhớ lúc KHỞI ĐỘNG, rồi `savePromptsProgress` (gọi từ
`generateClips` mỗi khi 1 cảnh xong/lỗi) ghi ATOMIC lại **TOÀN BỘ mảng `prompts` từ bộ nhớ đó** —
nếu 1 session Claude khác ghi trực tiếp vào `prompts.json` trên đĩa TRONG LÚC process này vẫn
đang chạy, lần `savePromptsProgress` kế tiếp sẽ ghi đè mất bản sửa đó bằng snapshot CŨ trong bộ
nhớ, dù thao tác ghi (atomic rename) tự nó không hỏng file — hoàn toàn im lặng, không có log/lỗi
nào báo hiệu. Đã xảy ra thật 2 lần trong project trước (mất tiến độ sửa tay 2 lần liên tiếp vì
process cũ/mới chạy xen giữa lúc đang sửa) — xem quy trình phát hiện/phòng tránh ngay dưới đây.

**Cách phát hiện đã dùng**: `Get-CimInstance Win32_Process -Filter "name='node.exe'"` (PowerShell) xem
`CommandLine` có `generateVideo.ts` không — nếu có, TUYỆT ĐỐI không ghi trực tiếp vào `state/prompts.json`
lúc đó. Sau khi user xác nhận đã dừng, LUÔN re-verify bằng chính lệnh này (không tin lời xác nhận suông vì
việc dừng process có thể chưa kịp propagate) trước khi ghi.

**BÀI HỌC QUY TRÌNH (áp dụng cho MỌI lần sau sửa `state/prompts.json` bằng tay/script khi đang có
`npm run generate` chạy song song, hoặc CÓ THỂ đang chạy)**:
1. LUÔN kiểm tra process trước khi ghi (lệnh PowerShell ở trên) — không giả định vì user nói "đã dừng".
2. Sau khi ghi fix xong, nếu ngay sau đó user tự chạy lại `npm run generate`, **PHẢI re-verify lại đúng
   những gì vừa sửa** (không phải chỉ tin fix đã persist từ trước) — vì hoàn toàn có thể có 1 process
   CŨ HƠN vẫn đang chạy song song ở thời điểm ghi mà không hay biết (đúng kịch bản đã xảy ra ở đây).
3. Cân nhắc dài hạn (CHƯA làm): thêm 1 file lock đơn giản (`state/.generate.lock`, ghi PID lúc
   `generateVideo.ts::main` khởi động, xoá khi thoát) để các script sửa tay CÓ THỂ tự kiểm tra thay vì
   phải nhờ Claude chạy `Get-CimInstance` mỗi lần — chưa triển khai, chỉ là ý tưởng nếu tái diễn nhiều lần
   nữa.

### 4.30. Bỏ hẳn cơ chế Style Anchor — quyết định CHỦ ĐỘNG của người dùng, chấp nhận đánh đổi lấy đơn giản hoá
**BỐI CẢNH**: người dùng chủ động yêu cầu bỏ hẳn việc dùng Style Anchor (@mention Ingredient) làm
điểm neo phong cách, dù mục 4.12/4.29 đã XÁC NHẬN TRỰC TIẾP cảnh chỉ có Prop từng trôi phong cách
thành ảnh thật nếu KHÔNG có Style Anchor — người dùng biết rõ rủi ro này (đã được nhắc lại trước
khi làm) và vẫn quyết định: chỉ dựa vào block text `MOTION_SUFFIX` (append bằng code vào MỌI
videoPrompt) là đủ, đổi lấy pipeline đơn giản hơn — không còn phải quản lý thêm 1 Ingredient đặc
biệt, không còn rủi ro các bug liên quan đến việc chèn `@mention` nó (mục 4.25 — bug "@" tự mở
dialog; mục 4.29 — race condition khi sửa `prompts.json` hàng loạt để thêm/bớt Style Anchor).

**Đã sửa** (áp dụng CẢ project này LẪN skill chung `flow-historical-video-prompts`, theo đúng yêu cầu
người dùng — quyết định này áp dụng cho MỌI project sau này dùng skill này):
- `src/splitter/prompt-writer.ts::buildPromptWritingGuide()` — bỏ quy tắc bắt buộc thêm `"Style Anchor"`
  vào `settingNames` cho cảnh Prop-only/mồ côi (mục "QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM"), bỏ bước 3
  (`STYLE_ANCHOR_MENTION_SENTENCE`) khỏi "VIDEOPROMPT CUỐI CÙNG PHẢI GỒM" — giờ chỉ còn 3 bước (nội dung
  cảnh → PERIOD_ANCHOR → MOTION_SUFFIX).
- Xoá hẳn hàm `warnMissingStyleAnchor()` (không còn dùng, đã bỏ lời gọi trong `generateVideo.ts::loadPrompts`
  và import tương ứng) — khác với `warnInconsistentSettingLighting()` (mục 4.19) VẪN GIỮ NGUYÊN, không liên
  quan đến quyết định này.
- Bỏ import `STYLE_ANCHOR_MENTION_SENTENCE` (không dùng client-side, hoá ra trước đó cũng chỉ được NHẮC làm
  text trong guide chứ chưa từng thực sự dùng làm giá trị JS) khỏi `prompt-writer.ts`. `STYLE_ANCHOR_NAME`
  vẫn GIỮ (còn dùng trong `warnInconsistentSettingLighting` để loại trừ Style Anchor khỏi check ánh sáng —
  vô hại nếu không còn cảnh nào gán tên này nữa, không cần xoá).
- `styleDNA.ts` — GIỮ NGUYÊN `STYLE_ANCHOR_NAME`/`STYLE_ANCHOR_DESCRIPTION`/`STYLE_ANCHOR_MENTION_SENTENCE`
  (không xoá hằng số, chỉ ngừng dùng ở bước viết prompt) — asset "Style Anchor" đã tạo trong Flow/
  `state/settings.json` cũng KHÔNG xoá, chỉ đơn giản không còn được gán vào `settingNames` của cảnh nào nữa.
- **Skill `flow-historical-video-prompts`** (ngoài repo, mục 4.21) — thay rule #7 (vừa thêm ở mục 4.29,
  khuyên LUÔN tạo Style Anchor cho cảnh Prop-only/mồ côi) bằng khuyến nghị NGƯỢC LẠI: mặc định KHÔNG tạo
  Ingredient neo phong cách riêng, chấp nhận rủi ro trôi phong cách (thường nhẹ/hiếm) ở cảnh Prop-only/mồ
  côi để đổi lấy pipeline đơn giản hơn — chỉ cân nhắc lại nếu 1 project cụ thể gặp trôi phong cách THƯỜNG
  XUYÊN/NGHIÊM TRỌNG.
- `state/prompts.json`: với project nào từng bật Style Anchor rồi quyết định bỏ giữa chừng, cần
  xoá `"Style Anchor"` khỏi `settingNames` + xoá câu `STYLE_ANCHOR_MENTION_SENTENCE` khỏi
  `videoPrompt` cho mọi cảnh đang có — nhớ xác nhận `npm run generate` đã dừng hẳn trước (đúng race
  condition mục 4.29) bằng `Get-CimInstance Win32_Process -Filter "name='node.exe'"`. Cảnh nào đã
  có clip render SẴN với câu Style Anchor trong prompt vẫn giữ nguyên clip (không bắt buộc xoá
  lại) — chỉ cần dọn dữ liệu prompt để các lần viết/generate SAU không còn nhắc tới Style Anchor.

**LƯU Ý CHO PROJECT SAU dùng skill `flow-historical-video-prompts`**: mặc định giờ là KHÔNG tạo Style
Anchor Ingredient — nếu 1 project cụ thể gặp trôi phong cách rõ rệt ở cảnh Prop-only/mồ côi, đây là lựa
chọn có thể bật lại CÓ CHỦ ĐÍCH (tham khảo cơ chế cũ ở mục 4.12/4.29 nếu cần khôi phục), không phải mặc
định nữa.

### 4.31. Tách `npm run generate` thành 2 bước: generate+rename (Flow) và download+ghép (local) — theo yêu cầu người dùng
**BỐI CẢNH (2026-07-19)**: người dùng chủ động yêu cầu đổi luồng — (1) sau khi 1 cảnh generate
thành công trong Flow, ĐỔI TÊN clip đó theo đúng chỉ số cảnh (`state/prompts.json`), KHÔNG tải về
ngay; (2) thêm 1 lệnh RIÊNG để tải hàng loạt video về sau, ở chất lượng **1080p**. Lý do suy đoán
(không phải người dùng nói rõ, nhưng khớp bối cảnh phiên này): tách generate khỏi download giúp
generate nhanh hơn/ổn định hơn (không tốn thời gian fetch từng file ngay lúc generate), và tải về
1 lần ở cuối cho phép chọn chất lượng cao hơn (1080p) so với việc fetch trực tiếp `src` của thẻ
`<video>` preview (nhiều khả năng chỉ là bản xem trước độ phân giải thấp, không phải bản gốc).

**Đã sửa**:
- `src/veo3bot/generate.ts::generateOneClip` — bỏ hẳn bước `page.request.get(newVideoSrc)` +
  `fs.writeFile` (tải trực tiếp qua src của thẻ `<video>` preview, xem mục 4.27) — thay bằng
  hàm mới `renameLatestVideo()`: right-click item media mới nhất → menuitem "Rename" → gõ tên
  `clip_NNN` (khớp đúng quy ước đặt tên file cũ, vd "clip_017") → "Done". Cùng cơ chế right-click
  → Rename đã dùng cho Setting/Prop (`imageAsset.ts`, mục 4.10), khác ở chỗ dùng baseline-diff
  trên `getByRole("link", {name: /Generated video/i})` để tìm đúng item vừa tạo (thay vì
  `getByRole("link", {name: "Generated image"})` dùng cho ảnh).
- `generateClips()` — đổi nguồn sự thật cho "cảnh này đã xong chưa" từ FILE TRÊN ĐĨA (mục 4.18)
  sang FIELD `status` TRONG `state/prompts.json` — vì giờ không còn file local nào được tạo ở
  bước generate nữa. Bỏ luôn cơ chế tự đồng bộ status↔file cũ (mục 4.18) vì không còn áp dụng
  được (không có file để đối chiếu).
- **File mới `src/veo3bot/download.ts`** (`downloadClip()`) — tìm 1 clip theo tên đã đổi (search
  trên lưới media chính), right-click → menuitem "Download" → (best-effort) chọn "1080p" nếu có
  submenu chất lượng → bắt sự kiện `page.waitForEvent("download")` → lưu về `output/clips/
  clip_NNN.mp4`. Trả về `false` (không throw) nếu không tìm thấy clip trong project hiện tại, để
  nơi gọi thử project KHÁC trước khi kết luận thật sự không có (mỗi project Flow có lưới media
  riêng biệt, xem mục 4.4).
- **File mới `src/downloadVideos.ts`** (lệnh `npm run download`) — đọc `state/prompts.json`, lọc
  cảnh `status: "success"` CHƯA có file local (`output/clips/clip_NNN.mp4` — file local LÀ nguồn
  sự thật ở BƯỚC NÀY, khác bước generate dùng `status`), mở lần lượt MỌI project Flow đã biết
  (`state/projects.json`/`project.json`) tìm + tải từng clip, rồi gọi `assembleFinalVideo` từ MỌI
  cảnh đã có file local (không chỉ cảnh vừa tải) để ghép `output/video_final.mp4` — resume-safe,
  chạy lại nhiều lần an toàn.
- `src/generateVideo.ts` — bỏ hẳn bước gọi `assembleFinalVideo` (dồn sang `downloadVideos.ts`) —
  giờ chỉ báo "đã tạo + đổi tên xong trong Flow, chạy npm run download tiếp" khi hoàn tất.
- `src/veo3bot/browser.ts::launchVeo3Browser` — thêm `acceptDownloads: true` vào
  `launchPersistentContext` để Playwright bắt được sự kiện `download` thay vì để Chrome tự xử lý
  file tải về ngoài tầm kiểm soát của code.
- `package.json` — thêm script `"download": "tsx src/downloadVideos.ts"`. `README.md` — cập nhật
  luồng 3 lệnh (`assets` → `generate` → `download`).

**CHƯA XÁC NHẬN TRỰC TIẾP (quan trọng — đọc trước khi chạy thật)**: TOÀN BỘ selector mới trong
`renameLatestVideo()` (`getByRole("link", {name: /Generated video/i})` — suy đoán theo mẫu ảnh
"Generated image" của Setting/Prop, CHƯA quan sát trực tiếp text thật cho video) và trong
`downloadClip()` (ô search trên lưới media chính, menuitem "Download", submenu/tuỳ chọn "1080p")
đều là SUY ĐOÁN theo mẫu đã xác nhận ở chỗ khác trong codebase — CHƯA chạy thử thật lần nào. Nếu
sai, mỗi bước đều có `debugCapture` riêng lưu bằng chứng (screenshot + HTML) — sửa theo đúng bằng
chứng thật đó, cùng quy trình đã dùng cho MỌI bug UI khác trong project này (mục 4), KHÔNG đoán
lại từ đầu. Test trước bằng vài cảnh nhỏ (`npx tsx scripts/generate-test-scenes.ts <index...>` rồi
`npm run download`) trước khi tin tưởng chạy đại trà toàn bộ số cảnh.

**RỦI RO ĐÃ BIẾT, CHẤP NHẬN**: nếu `generateOneClip` tạo clip THÀNH CÔNG trong Flow nhưng bước
`renameLatestVideo` sau đó throw (vd không tìm thấy menuitem), cảnh vẫn bị đánh dấu `"failed"` và
sẽ được TẠO LẠI (thêm 1 clip MỚI) ở lần chạy `npm run generate` sau — có thể để lại 1 clip trùng
nội dung CHƯA đổi tên nằm không dùng trong Flow. Cùng loại rủi ro đã chấp nhận với Setting/Prop
(mục 4.15 cập nhật, vd "Spanish Royal Banner") — không tự động dọn dẹp, chỉ cần biết để kiểm tra
thủ công trong Flow nếu nghi ngờ có clip rác.

### 4.32. Debug capture chụp SAU reload làm mất bằng chứng lỗi thật — chụp THÊM 1 lần TRƯỚC reload
**XÁC NHẬN TRỰC TIẾP (2026-07-19, người dùng phát hiện khi soi lại `output/debug/`)**: mọi nhánh
"nghi ngờ lỗi/timeout → reload để kiểm tra lại trước khi kết luận" (mục 4.14/4.15/4.27) đều chỉ
gọi `debugCapture`/screenshot SAU KHI đã reload (và sau cả vòng recheck nếu có) — nghĩa là ảnh/HTML
lưu lại phản ánh trạng thái trang SAU khi reload đã làm mới toàn bộ DOM, KHÔNG PHẢI trạng thái THẬT
tại đúng lúc lỗi/timeout xảy ra. Bất kỳ dấu hiệu cụ thể nào chỉ tồn tại nhất thời (dialog lỗi còn
mở, prompt đang gõ dở, thẻ "Failed" vừa xuất hiện, trang bị kẹt ở 1 trạng thái JS cụ thể...) đều đã
biến mất trước khi được chụp lại — khiến việc soi debug capture để tìm nguyên nhân gốc không hiệu
quả (đúng như người dùng mô tả: "chụp hình lại sau khi reload page và hình lỗi bị mất nên khi kiểm
tra sẽ không thấy được thật sự lỗi gì").

**Đã sửa**: thêm 1 lần `debugCapture`/screenshot NGAY TRƯỚC mỗi lệnh `page.reload()` dùng cho mục
đích "recheck sau nghi ngờ lỗi" (KHÔNG áp dụng cho lần reload định kỳ vô hại trong `processQueue`,
vì đó không phải phản ứng với lỗi) — giữ NGUYÊN cả debug capture SAU reload đã có từ trước (vẫn hữu
ích để so sánh trước/sau, xác nhận reload có thực sự khắc phục được không):
- `src/veo3bot/generate.ts::ensureModelAndDuration` — tag `pre-reload-pill-stuck`.
- `src/veo3bot/generate.ts::generateOneClip` (nhánh timeout) — tag `pre-reload-timeout-scene{index}`.
- `src/veo3bot/imageAsset.ts::createImageIngredient` (2 nhánh: pill kẹt + timeout ảnh) — tag
  `pre-reload-pill-stuck-{name}` / `pre-reload-timeout-ingredient-{name}`.
- `src/veo3bot/project.ts::waitForProjectReady` — dùng `page.screenshot()` trực tiếp (hàm này
  không dùng `debugCapture`/`config.debug`, tự lưu PNG vào `state/` từ trước) — tag
  `pre-reload-project-ready-{timestamp}`.

**LƯU Ý dùng debug capture từ giờ về sau**: mỗi lần nghi ngờ lỗi timeout/reload trong
`output/debug/`, LUÔN kiểm tra file `pre-reload-*` (trạng thái lỗi THẬT tại thời điểm xảy ra)
TRƯỚC, không chỉ nhìn file không có tiền tố này (đó là trạng thái SAU khi đã reload, có thể không
còn phản ánh nguyên nhân gốc).

### 4.33. Selector `renameLatestVideo` đoán sai hoàn toàn — accessible name thật là "Video thumbnail", không phải "Generated video"
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: người dùng chạy `npm run generate` sau khi có tính năng đổi
tên (mục 4.31) — báo video đã tạo xong trong Flow nhưng KHÔNG đổi tên được. Soi debug capture
`rename-card-missing-scene0-*.html` (đếm mọi `role="..."` xuất hiện trong trang: chỉ có button/
toolbar/status/textbox/presentation/alert — **0 lần** `role="link"`) xác nhận giả thuyết ban đầu
"Generated video" (đoán theo mẫu "Generated image" của Setting/Prop) SAI HOÀN TOÀN.

Soi cấu trúc DOM thật quanh 1 item media: mỗi clip là `<a href="/fx/tools/flow/project/.../edit/
...">` (role "link" NGẦM ĐỊNH từ `href`, không cần khai báo `role="link"` tường minh — đây là lý
do đếm literal `role="link"` ra 0 nhưng Playwright vẫn nhận đúng qua accessibility tree tính toán
runtime, KHÔNG phải qua thuộc tính HTML tường minh) chứa `<button><video src=".."/><img
alt="Video thumbnail"/></button>` — accessible NAME của `<a>` được suy ra từ nội dung con, ở đây
là **"Video thumbnail"** (từ `alt` của `<img>`, `<video>` không đóng góp tên). Đối chiếu mọi
`alt="..."` khác trong trang: chỉ có "User profile image"/"Video thumbnail"/"Character reference
image" — xác nhận "Video thumbnail" DÙNG CHUNG cho MỌI item video (không phân biệt clip nào),
đúng kiểu "tên chung + baseline-diff + `.first()`" đã dùng cho ảnh Setting/Prop.

Cũng phát hiện thêm: `<video src>` KHÔNG chỉ có ĐÚNG 1 thẻ trên toàn trang như mục 4.27 từng xác
nhận — dump này có **5 thẻ `<video src>`** khác nhau cùng lúc. Suy đoán hợp lý: mục 4.27 quan sát
lúc project còn ít media (virtualized list `react-virtuoso` chỉ render 1 item trong viewport);
giờ project đã tích luỹ nhiều clip hơn nên nhiều item cùng lọt viewport → nhiều thẻ `<video>` cùng
tồn tại. `currentVideoSrcs()` (so TẬP HỢP `src`, không phải đếm số lượng) vẫn đúng trong cả 2
trường hợp — không cần sửa gì thêm ở phần phát hiện thành công, chỉ rename mới bị ảnh hưởng.

**Đã sửa** (`src/veo3bot/generate.ts::renameLatestVideo` + baseline count trong `generateOneClip`):
- `getByRole("link", { name: /Generated video/i })` → `getByRole("link", { name: "Video thumbnail" })`.
- `getByRole("menuitem", { name: "whiteboard Rename" })` → `getByRole("menuitem", { name: /rename/i })`
  (nới lỏng vì CHƯA xác nhận icon ligature đứng trước "Rename" của menu video — tìm thấy chuỗi dịch
  `"applet_card_menu_rename": "Rename"` nhúng sẵn trong trang, xác nhận menu THẬT có tuỳ chọn này,
  nhưng không biết chắc tên icon).
- Nút `"done Done"` → `getByRole("button", { name: /done/i })` (cùng lý do nới lỏng).

**RỦI RO ĐÃ XẢY RA**: cảnh #0 thử generate 2 lần (cả 2 đều fail ở bước rename do bug trên, theo
retry logic trong `processQueue`) — nhiều khả năng để lại **2 clip trùng nội dung CHƯA đổi tên**
trong Flow (đúng rủi ro đã ghi ở mục 4.31) — không tự động dọn, có thể vào Flow xoá tay nếu muốn.

**CẬP NHẬT (2026-07-19) — fix trên VẪN CHƯA ĐỦ**: người dùng chạy lại, cảnh #0 vẫn lỗi y hệt
(`rename-card-missing-scene0` lần 3). Soi debug capture mới: đúng "Video thumbnail" đã đúng tên,
NHƯNG nguyên nhân THẬT là **lưới media chính CŨNG ảo hoá bằng `react-virtuoso`** (cùng lớp bug mục
4.25, lần này ở lưới chính chứ không phải dialog @mention) — xác nhận trực tiếp: `data-testid=
"virtuoso-item-list"` giữ ỔN ĐỊNH đúng 5 thẻ `<video src>` render trong DOM cả TRƯỚC lẫn SAU khi
có clip mới (chỉ khác 1 giá trị `src` — clip mới nhất xuất hiện, clip cũ nhất bị đẩy ra khỏi vùng
render). Đếm SỐ LƯỢNG "Video thumbnail" rồi chờ TĂNG so với baseline (y hệt cách dùng cho ảnh
Setting/Prop) không bao giờ đúng với lưới virtualized kiểu này — số lượng render gần như không đổi
dù tổng số item thật tăng lên.

**Đã sửa LẦN 2 (đúng gốc rễ)**: bỏ HẲN cách đếm/so baseline — tìm THẲNG đúng item vừa tạo bằng giá
trị `src` đã biết CHẮC CHẮN (`newVideoSrc`, chính là giá trị `generateOneClip` đã dùng để xác nhận
generate thành công qua `currentVideoSrcs()`, mục 4.27) thay vì dò theo tên chung + số lượng:
`renameLatestVideo(page, clipName, newVideoSrc, sceneIndex)` — tìm `video[src="..."]` rồi đi lên
`ancestor::a[1]` để right-click, tuyệt đối chính xác bất kể virtualization/thứ tự render. Bỏ tham
số `baselineLinkCount`/dòng `baselineVideoLinkCount` không còn cần thiết trong `generateOneClip`.

**BÀI HỌC**: nếu 1 danh sách trong Flow dùng `react-virtuoso` (nhận diện qua `data-testid=
"virtuoso-scroller"`/`"virtuoso-item-list"` trong debug capture), KHÔNG dùng chiến lược "đếm số
lượng phần tử khớp tên chung rồi chờ TĂNG so với baseline" để tìm "item mới nhất" — chiến lược này
chỉ đúng với danh sách KHÔNG ảo hoá (mọi item đều render đủ trong DOM). Với danh sách ảo hoá, PHẢI
tìm bằng 1 giá trị ĐỊNH DANH DUY NHẤT đã biết chắc chắn của chính item đó (ở đây là `src` của thẻ
`<video>`) thay vì đếm/so sánh số lượng.

**CHƯA XÁC NHẬN TIẾP**: fix lần 2 CHƯA chạy thử thật. Test lại cảnh #0 trước khi tin tưởng chạy đại
trà — nếu vẫn lỗi, debug capture mới sẽ cho bằng chứng ở bước cụ thể nào (tìm `<a>` ancestor / mở
menu / gõ tên / bấm Done) để sửa tiếp.

### 4.34. Bấm "Retry" ngay tại chỗ khi Flow từ chối cảnh (2 lần) trước khi thật sự bỏ qua
**BỐI CẢNH (2026-07-19)**: người dùng yêu cầu — trước đây cảnh bị Flow từ chối (vd policy
"prominent people", xem ảnh chụp card lỗi có sẵn nút "Retry"/undo/delete) bị **bỏ qua NGAY LẬP
TỨC, không hề thử lại** (`generateOneClip` trả `"skipped"` ngay khi thấy "Failed" tăng so với
baseline). Người dùng muốn: bấm "Retry" NGAY (không đợi thêm), tối đa 2 lần, hết 2 lần vẫn lỗi mới
thật sự bỏ qua sang cảnh tiếp theo.

**Đã sửa** (`src/veo3bot/generate.ts::generateOneClip`): khi phát hiện "Failed" TĂNG (so kiểu PHÁT
HIỆN CẠNH — so với lần đếm gần nhất `lastFailedCount`, KHÔNG so cố định với baseline ban đầu, vì
bấm Retry tái sử dụng LẠI card lỗi cũ thay vì tạo card mới — số lượng "Failed" có thể tạm về lại
baseline lúc đang generate lại rồi tăng lại nếu Retry cũng lỗi; so cạnh bắt được cả lần lỗi ĐẦU lẫn
mọi lần lỗi SAU mỗi Retry), bấm luôn `getByRole("button", {name: /retry/i}).first()` — tối đa
`MAX_INLINE_RETRIES = 2` lần — rồi `continue` kiểm tra lại NGAY (bỏ qua `POLL_INTERVAL_MS` chờ,
đúng yêu cầu "không đợi nữa"). Hết 2 lần vẫn lỗi (hoặc không bấm được nút Retry) mới trả
`"skipped"`.

**Vì sao nhanh hơn hẳn retry cũ**: nhánh catch/`reopenPage()` trong `processQueue` (dùng cho lỗi
khác — picker/chip mismatch/crash) phải mở tab MỚI, vào lại project, gõ lại TOÀN BỘ prompt +
@mention từ đầu — chậm và tốn. Bấm "Retry" tại chỗ tái dùng ĐÚNG prompt/card đã có sẵn trong Flow,
không cần gõ lại gì — đúng ý người dùng "nhấn Retry liền, không đợi".

**CHƯA XÁC NHẬN TRỰC TIẾP** (chưa chạy thử thật lần nào): selector `getByRole("button", {name:
/retry/i})` là SUY ĐOÁN theo mẫu icon-ligature + hidden label đã xác nhận ở toolbar item THÀNH
CÔNG ("download"/"undo" ẩn danh "Reuse Prompt"/"delete" ẩn danh "Move to trash", xem mục 4.33) —
CHƯA có debug capture thật của 1 card LỖI để xác nhận cấu trúc/tên nút "Retry" đúng y hệt. Nếu
sai, mỗi lần thử đều có `debugCapture` riêng (`flow-rejected-before-retry{N}-scene{index}` và
`retry-button-missing-scene{index}`) — soi debug capture đó để sửa đúng theo bằng chứng thật, cùng
quy trình đã dùng cho mọi bug UI khác (mục 4).

### 4.35. Thêm field `isDownloaded` — resume `npm run download` qua state thay vì chỉ dò file trên đĩa
**BỐI CẢNH (2026-07-19)**: người dùng yêu cầu — cảnh nào tải thành công thì đánh dấu lại bằng 1
field trong `state/prompts.json` (`isDownloaded`), để `npm run download` chạy lại sau không tải
lại những video đã tải rồi.

**Đã sửa**:
- `src/splitter/prompt-writer.ts::VeoPrompt` — thêm field `isDownloaded?: boolean`.
- `src/downloadVideos.ts` — thêm `atomicWriteJson`/`savePromptsProgress` (copy pattern từ
  `generateVideo.ts`, mục 4.23) để ghi `state/prompts.json` an toàn. Nguồn sự thật để quyết định
  "cảnh này cần tải không" giờ là `isDownloaded` (nhanh, không cần `fs.access` mọi lần) — NHƯNG vẫn
  đối chiếu với file thật trên đĩa mỗi lần chạy để TỰ ĐỒNG BỘ lại cờ (cùng cơ chế status↔file mục
  4.18): file có mà cờ nói chưa tải → sửa cờ thành `true`; file mất mà cờ nói đã tải (vd người dùng
  xoá tay) → sửa cờ về `false` để tải lại — không tin mù cờ cũ nếu thực tế trên đĩa khác đi. Ghi
  `state/prompts.json` NGAY sau MỖI cảnh tải thành công (không đợi xong cả hàng đợi) — resume-safe
  nếu lệnh bị gián đoạn giữa chừng.
- Docstring `VeoPrompt.status` cũng được làm rõ lại: `"success"` giờ CHỈ có nghĩa "đã tạo+đổi tên
  xong TRONG FLOW" (mục 4.31), KHÔNG có nghĩa đã có file local nữa — tách bạch rõ với
  `isDownloaded` (đã tải file THẬT về máy).

### 4.36. `npm run download` vào nhầm project hỏng — nguyên nhân gốc: `downloadClip` luôn "không tìm thấy" (im lặng, không debug capture) khiến rơi qua project khác
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: người dùng chạy `npm run download`, trình duyệt điều hướng
sang project `a2a56e6c-...` (project THỨ 2 trong `state/projects.json`, hiện đã HỎNG — Flow báo
"Something went wrong. Back to projects") thay vì dừng lại ở project ĐÚNG `1d64f24f-...` (project
THẬT đang dùng, đứng ĐẦU danh sách). Điều tra: `downloadClip()` bản đầu có 2 chỗ SAI khiến nó luôn
báo "không tìm thấy" (trả `false`, KHÔNG throw, KHÔNG debugCapture — lỗi HOÀN TOÀN IM LẶNG) ngay
cả với project ĐÚNG có đủ clip, khiến vòng lặp ở `downloadVideos.ts` tưởng project 1 không có clip
nào và tự động thử tiếp project 2 (hỏng) → crash (xem mục 4.35 phần sửa try/catch — đã chặn crash,
nhưng CHƯA sửa nguyên nhân gốc là tìm sai clip ngay từ project đúng).

**2 chỗ sai đã sửa** (`src/veo3bot/download.ts::downloadClip`):
1. Ô search: đoán `input[placeholder="Search assets"]` — SAI, chuỗi này chỉ là i18n key
   `add_menu_search_placeholder` dành cho DIALOG @mention "Add Media" (nhúng sẵn trong trang dạng
   JSON, không phải placeholder thật render ra — cùng bẫy "text ẩn" đã gặp ở mục 4.6/4.29), KHÔNG
   PHẢI ô search trên trang lưới media CHÍNH. Soi toàn bộ `<input>` thật trong debug capture: trang
   chính dùng `<input data-testid="search-input" type="text">` (không có `type="search"`, không có
   placeholder) — đã sửa lại đúng selector này.
2. Tìm card: đoán `getByText(clipName, {exact:true})` (tìm text hiển thị đúng tên đã rename trên
   card) — CHƯA có bằng chứng card có hiển thị tên rename làm caption hay không (mọi card đã soi
   đều hiện TEXT PROMPT GỐC làm caption, không phải tên rename) — nếu giả định sai, `getByText` sẽ
   KHÔNG BAO GIỜ khớp, khiến `downloadClip` luôn trả `false` dù clip có tồn tại. Đổi sang: gõ tên
   vào ô search ĐÚNG rồi LẤY THẲNG kết quả ĐẦU TIÊN dạng `getByRole("link", {name: "Video
   thumbnail"})` (tin tưởng search đã lọc đúng, giống pattern baseline-diff + `.first()` đã dùng ở
   nơi khác) thay vì cố khớp text hiển thị.
3. Thêm `debugCapture` vào nhánh "không tìm thấy card" (`download-card-missing-{clipName}`) — bản
   đầu thiếu hẳn, khiến lỗi này HOÀN TOÀN IM LẶNG không để lại bằng chứng gì để điều tra.

**CHƯA XÁC NHẬN TRỰC TIẾP**: fix này CHƯA chạy thử thật. Nếu ô search KHÔNG lọc theo tên rename mà
lọc theo nội dung khác (vd prompt text), kết quả `.first()` sau khi gõ "clip_017" có thể vẫn SAI
(lấy nhầm clip khác) — cần verify bằng mắt: tải thử 1 cảnh rồi mở file xem đúng nội dung cảnh đó
không, đừng chỉ tin "tải được là xong".

### 4.37. Bấm "Download" kích hoạt UPSCALE (vài phút) trước khi tải được — timeout 45s cũ luôn quá ngắn
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: người dùng báo cảnh #0/#1/#3 "thiếu dù kiểm tra trên Flow đã
có" — soi debug capture `download-fail-clip_000/001-*.png` thấy rõ: sau khi bấm "Download", Flow
hiện toast **"Upscaling your video. This may take several minutes. Refrain from starting multiple
upscaling jobs for the best results."** — nghĩa là clip gốc KHÔNG phải sẵn 1080p, bấm Download
kích hoạt 1 job UPSCALE lên 1080p chạy nền, chỉ sau khi upscale xong mới thực sự tải được. Timeout
chờ sự kiện `download` cũ (45 giây) LUÔN quá ngắn so với việc này — mọi cảnh đều timeout dù chờ bao
lâu ở mốc 45s.

Đồng thời xác nhận: card #0 tìm ra 2 kết quả trùng khi search "clip_000" (cảnh #1 chỉ ra đúng 1 —
không phải bug chung, mà do cảnh #0 từng bị lỗi rename nhiều lần trước khi sửa xong, xem mục
4.31/4.33/4.34 — rủi ro "clip trùng chưa đổi tên" đã cảnh báo trước có vẻ đã xảy ra thật). Cần vào
Flow kiểm tra tay project và xoá bớt clip trùng/thừa cho cảnh #0 nếu có, tránh nhầm lẫn khi tìm
kiếm về sau.

**Đã sửa** (`src/veo3bot/download.ts`):
- Tăng timeout chờ sự kiện `download` từ 45 giây → **`UPSCALE_DOWNLOAD_TIMEOUT_MS = 10 phút`**.
- Phát hiện toast "Upscaling your video" sau khi bấm Download, log rõ cho người dùng biết đang chờ
  (tránh hiểu nhầm là bị kẹt/lỗi khi thấy terminal đứng yên vài phút).

**HỆ QUẢ QUAN TRỌNG NGƯỜI DÙNG CẦN BIẾT**: mỗi cảnh tải về giờ có thể mất **VÀI PHÚT** (không phải
vài giây) do bước upscale — tải TOÀN BỘ số cảnh THEO KIỂU TUẦN TỰ (đúng cảnh báo của Flow "refrain
from starting multiple upscaling jobs", code đã tự nhiên tuân thủ vì xử lý từng cảnh một, KHÔNG
chạy song song) có thể mất **NHIỀU GIỜ** cho 1 lần chạy `npm run download` đầy đủ nếu project có
nhiều cảnh. Đây là đặc tính
của Flow, không phải lỗi — cần kiên nhẫn hoặc cân nhắc chạy `npm run download` qua đêm/nhiều lần
(resume-safe nhờ `isDownloaded`, mục 4.35 — dừng giữa chừng rồi chạy lại không mất tiến độ).

**CHƯA XÁC NHẬN TIẾP**: 10 phút là ước lượng an toàn dựa trên "vài phút" Flow tự nói — nếu vẫn có
cảnh timeout ở mốc này (nội dung phức tạp hơn cần upscale lâu hơn), tăng thêm
`UPSCALE_DOWNLOAD_TIMEOUT_MS`.

### 4.38. 🔴 BUG NGHIÊM TRỌNG: cảnh bị gán NHẦM nội dung của cảnh KHÁC — do lỗ hổng trong cách phát hiện "video mới" với lưới ảo hoá
**XÁC NHẬN TRỰC TIẾP**: người dùng phát hiện 1 clip đổi tên "clip_041" trong Flow lại CHỨA ĐÚNG
nội dung/prompt của cảnh #0 (1 cảnh toàn cảnh khác hẳn) — nghĩa là khi generate cảnh #41, hệ
thống đã ĐỔI TÊN NHẦM 1 clip CŨ (không phải clip vừa tạo cho cảnh #41) thành "clip_041". Đây là
hậu quả TRỰC TIẾP của bug đã nghi ngờ nhưng
chưa xác nhận ở mục 4.33: `currentVideoSrcs()` so TẬP HỢP mọi giá trị `src` đang RENDER trong lưới
ẢO HOÁ (`react-virtuoso`, chỉ ~5 item trong viewport tại 1 thời điểm, KHÔNG PHẢI toàn bộ lịch sử
clip) — nếu 1 clip CŨ (rất có thể là 1 trong 2 bản duplicate CHƯA đổi tên còn sót lại của cảnh #0
do lỗi rename trước đây, xem mục 4.33/4.37) "trôi vào" vùng render đúng lúc đang generate cảnh #41
(vì lưới liên tục thay đổi item nào được render khi có hoạt động khác), src của nó CHƯA từng có
trong baseline (baseline chỉ chụp đúng thời điểm đó, không phải toàn bộ lịch sử) → bị hiểu NHẦM là
"video vừa tạo của cảnh #41" → `renameLatestVideo` đổi tên ĐÚNG clip SAI này thành "clip_041". Lỗi
HOÀN TOÀN ÂM THẦM — không log/exception/debug capture nào báo hiệu, chỉ lộ ra khi người dùng tự
soi lại nội dung trong Flow.

**Đã sửa** (`src/veo3bot/generate.ts`): bỏ hẳn `currentVideoSrcs()` (so TẬP HỢP), thay bằng
`firstVideoSrc()` — chỉ theo dõi ĐÚNG 1 VỊ TRÍ: item ĐẦU TIÊN trong lưới (dựa vào sort "Recent"
mặc định, item mới nhất luôn ở vị trí 0 — cùng giả định `.first()` đã dùng nhất quán ở mọi nơi
khác trong codebase). Coi là "có video mới" CHỈ KHI src ở vị trí 0 đổi khác so với lúc trước khi
bấm generate — đúng cho CẢ 2 trường hợp đã gặp: Flow chỉ có 1 thẻ `<video>` "preview" duy nhất
(mục 4.27) LẪN lưới nhiều item ảo hoá (mục 4.33) — vị trí 0 luôn là item MỚI NHẤT thật sự, không
bị nhiễu bởi item cũ trôi vào/ra vùng render ở các vị trí SAU vị trí 0. Áp dụng nhất quán ở CẢ vòng
poll chính LẪN vòng reload-recheck trong `generateOneClip`.

**BÀI HỌC TỔNG QUÁT (áp dụng cho MỌI cơ chế baseline-diff trên danh sách CÓ THỂ ảo hoá)**: "so TẬP
HỢP mọi giá trị đang render, tìm giá trị KHÔNG có trong baseline" chỉ đáng tin nếu danh sách đó
render ĐẦY ĐỦ mọi item (không ảo hoá) — với danh sách ẢO HOÁ, tập hợp render được tại 1 thời điểm
chỉ là 1 "cửa sổ" thay đổi liên tục, không phản ánh đúng "cái gì thực sự mới xuất hiện". Phải theo
dõi 1 VỊ TRÍ CỤ THỂ (đầu danh sách, nếu sort mới-nhất-trước) thay vì so tập hợp, để tránh nhầm lẫn
giữa "mới THẬT SỰ" và "mới XUẤT HIỆN TRONG VÙNG RENDER do trôi/cuộn".

**⚠️ RỦI RO DỮ LIỆU ĐÃ XẢY RA — CẦN NGƯỜI DÙNG TỰ KIỂM TRA**: bug này có thể đã ảnh hưởng đến
NHIỀU cảnh khác ngoài #41 (bất kỳ cảnh nào generate SAU khi có clip CŨ/duplicate trôi nổi chưa
được dọn trong Flow — đặc biệt các cảnh generate sau cảnh #0, #17, #21, #34 vốn đã biết có
duplicate do lỗi rename trước đó, xem mục 4.31/4.33/4.34). KHÔNG có cách nào tôi tự kiểm tra được
nội dung THẬT của từng clip (không xem được video) — người dùng cần:
1. Vào Flow, kiểm tra lại TỪNG clip đã đổi tên (`clip_NNN`) xem nội dung có ĐÚNG khớp prompt của
   cảnh N trong `state/prompts.json` không — ưu tiên các cảnh generate ngay SAU những cảnh từng có
   duplicate (dễ bị ảnh hưởng nhất).
2. Với clip bị gán sai (như "clip_041" chứa nội dung cảnh #0): đổi tên lại cho ĐÚNG cảnh thật sự
   chứa nội dung đó, rồi tìm/generate lại clip THẬT SỰ cho cảnh bị thiếu (ở đây là #41 — status
   `"success"` hiện đang SAI, cần đặt lại `"waiting"` để `npm run generate` tạo lại đúng).
3. Dọn (xoá) các clip duplicate/chưa đổi tên còn sót trong Flow (đặc biệt quanh cảnh #0) để giảm
   rủi ro tái diễn cho các cảnh generate tiếp theo.

**CHƯA XÁC NHẬN TIẾP**: fix `firstVideoSrc()` CHƯA chạy thử thật sau khi sửa — cần generate lại vài
cảnh (đặc biệt cảnh ngay sau 1 cảnh vừa có duplicate) để xác nhận không còn tái diễn gán nhầm.

### 4.39. Sau khi rename video, trang có thể bị "mắc kẹt" ở trang Edit riêng của clip — luôn ép quay về đúng project URL
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: người dùng hỏi vì sao debug capture `pre-reload-pill-stuck-*`
lại hiện clip #73 trong 1 màn hình EDIT (timeline, "Describe your edits", nút "Done" ở navbar) thay
vì lưới media chính. Điều tra: ô tiêu đề clip trên trang Edit này dùng ĐÚNG `aria-label="Editable
text"` và có ĐÚNG nút "Done" — TRÙNG HỆT 2 selector `renameLatestVideo()` đang dùng để gõ tên +
xác nhận rename. Suy luận có căn cứ cao: menuitem "Rename" cho VIDEO (khác Setting/Prop —
`imageAsset.ts` xác nhận mở MODAL tại chỗ) rất có thể thực ra ĐIỀU HƯỚNG SANG TRANG "Edit" riêng
của clip đó — code cũ gõ tên vào Ô TIÊU ĐỀ của trang Edit (không phải ô input của 1 modal), bấm
"Done" (thoát editor, không phải "xác nhận rename & đóng modal"), rồi KHÔNG có bước nào đưa trang
quay lại lưới media chính — để trang kẹt nguyên ở URL edit đó cho tới khi cảnh SAU gọi
`ensureModelAndDuration` và không tìm thấy pill "crop_16_9" (vì sai trang), kích hoạt reload (vẫn
sai trang, reload không đổi URL) rồi cuối cùng throw, rơi vào nhánh catch/`reopenPage()` của
`processQueue` — ĐÂY mới thực sự là chỗ code TỰ HỒI PHỤC (vì `reopenPage()` gọi `page.goto(projectUrl)`),
giải thích vì sao bug này không làm crash hẳn pipeline nhưng âm thầm làm hỏng/lãng phí 1 lượt xử lý
cảnh mỗi lần xảy ra.

**Đã sửa**:
- `src/veo3bot/debug.ts::debugCapture` — lưu thêm `<base>.url.txt` chứa `page.url()` hiện tại (bản
  cũ chỉ có screenshot + HTML, KHÔNG có URL — HTML/`page.content()` không phản ánh thanh địa chỉ,
  khiến việc xác định "trang đang ở đâu" khi có bug kiểu này khó hơn nhiều). Áp dụng cho MỌI lần gọi
  `debugCapture` từ nay, không cần sửa từng chỗ gọi.
- `src/veo3bot/generate.ts::renameLatestVideo` — nhận thêm tham số `projectUrl`, sau khi gõ tên +
  bấm "Done" xong, LUÔN chủ động `page.goto(projectUrl)` + chờ "Add Media" xuất hiện — KHÔNG tin
  rằng bấm "Done" đã tự đưa trang về đúng lưới media chính (dù rename thực chất là modal tại chỗ
  hay điều hướng sang trang khác, hành động này đều AN TOÀN và đưa trang về trạng thái known-good).
  Truyền `projectUrl` xuyên suốt `generateOneClip` → gọi từ `processQueue` (đã có sẵn `projectUrl`
  trong scope).

**BÀI HỌC**: khi 1 hành động UI (rename, v.v.) có thể ĐIỀU HƯỚNG sang trang khác thay vì chỉ mở
modal tại chỗ, đừng giả định trang sẽ tự "quay lại" đúng chỗ sau khi hành động xong — luôn CHỦ ĐỘNG
điều hướng về 1 URL đã biết chắc chắn (`page.goto(knownGoodUrl)`) trước khi tiếp tục bước kế tiếp,
đặc biệt nếu bước kế đó giả định đang đứng ở 1 trang cụ thể (ở đây là lưới media chính có pill
"crop_16_9"). Cũng nên **luôn lưu `page.url()` trong debug capture** — thiếu thông tin này khiến 1
bug dạng "sai trang" mất nhiều công điều tra hơn hẳn cần thiết.

**CHƯA XÁC NHẬN TIẾP**: fix CHƯA chạy thử thật. Cần generate lại vài cảnh để xác nhận sau khi
rename, trang luôn quay đúng về lưới media chính (không còn kẹt ở trang Edit), và cảnh liền sau đó
không còn gặp lỗi "pill cài đặt không phản hồi" do sai trang.

### 4.40. Skill: mở rộng quy tắc "prominent people" ra CẢ DÀN NHÂN VẬT, không chỉ nhân vật chính + người thân
**BỐI CẢNH**: vẫn hay gặp lỗi "prominent people" dù skill đã có quy tắc đổi tên ngắn cho nhân vật
chính (mục 4.28) và tên quan hệ cho người thân (mục 4.24). Kiểm tra kỹ 1 dàn nhân vật lịch sử có
thật thấy: NGOÀI nhân vật chính (đã biết cần đổi tên ngắn), còn RẤT NHIỀU nhân vật lịch sử có thật
KHÁC trong dàn nhân vật vẫn dùng tên đầy đủ (vua/hoàng hậu, nhà tài trợ, đồng đội...) — đây đều là
người có thật, KHÔNG PHẢI nhân vật chính lẫn người thân, nên 2 quy tắc cũ (chỉ nhắc "nhân vật
chính" và "người thân") KHÔNG bao trùm được — đây chính là lỗ hổng khiến lỗi cứ tái diễn rải rác
suốt quá trình sản xuất.

**Đã sửa skill `flow-historical-video-prompts`** (ngoài repo, xem đường dẫn mục 4.21):
- Mở rộng quy tắc thành nguyên tắc CHUNG: áp dụng cho MỌI nhân vật trong cả dàn nhân vật là người
  thật/có thể định danh được — không giới hạn ở nhân vật chính hay người thân của họ. Thêm case
  thứ 3 (nhân vật lịch sử có thật KHÁC, không phải chính/người thân — vd vua/hoàng hậu, nhà tài
  trợ, đồng đội thám hiểm...) — dùng nhãn vai trò/chức danh (`The Queen`, `The Fleet Captain`) hoặc
  tên riêng đơn lẻ nếu tên đó không đủ định danh cụ thể.
- Chuyển việc kiểm tra này lên NGAY bước 1 của workflow (bảng kiểm kê tài sản) — bắt buộc rà soát
  CẢ DÀN NHÂN VẬT một lần duy nhất trước khi viết prompt, thay vì phát hiện rải rác từng cảnh một
  trong lúc render (nguyên nhân gốc khiến lỗi "cứ xuất hiện lai rai suốt dự án" thay vì bắt hết một
  lần).
- Cập nhật "Named person / content-block workaround" — thêm bước xử lý thứ 4 cho case nhân vật
  lịch sử KHÔNG phải chính/người thân.

**Đồng bộ luôn 2 file guide trong REPO này** (khác skill ngoài repo — đây là code Claude tự đọc khi
viết/rà soát `state/characters.json`/`state/prompts.json` cho MỌI project sau này):
- `src/characters/extract.ts::CHARACTER_EXTRACTION_GUIDE` — viết lại thành quy tắc chung + 3 CÁCH cụ
  thể (nhân vật chính → tên ngắn; người thân → tên quan hệ sở hữu; nhân vật lịch sử khác → tên vai
  trò/chức danh), thay vì 2 mục tách rời chỉ nói "chính nhân vật" và "người thân".
- `src/splitter/prompt-writer.ts::buildPromptWritingGuide()` — cập nhật quy tắc "TÊN NHÂN VẬT" cho
  khớp, thêm nhắc tên vai trò/chức danh là dạng CÓ CHỦ ĐÍCH thứ 3 (trước chỉ biết tên ngắn/quan hệ
  sở hữu).

### 4.41. Bấm nút "Retry" làm trang RELOAD LẠI — bản mục 4.34 thiếu bước chờ trang ổn định trước khi kiểm tra tiếp
**XÁC NHẬN TRỰC TIẾP (2026-07-19, người dùng quan sát trực tiếp trình duyệt)**: bấm nút "Retry" trên
card lỗi (mục 4.34) làm TRANG RELOAD LẠI — khác giả định ban đầu (regenerate tại chỗ trong DOM hiện
có, không điều hướng/reload gì cả). Code cũ `continue` thẳng vào vòng kiểm tra lại NGAY sau khi bấm
Retry, không chờ gì — có thể đọc nhầm trạng thái (`firstVideoSrc`/đếm "Failed") nếu DOM đang giữa
chừng load lại chưa ổn định.

**Đã sửa** (`src/veo3bot/generate.ts`, nhánh xử lý "Failed" trong `generateOneClip`): sau khi bấm
"Retry" xong, chờ trang THẬT SỰ sẵn sàng (nút "Add Media" xuất hiện, timeout 45s, cùng tín hiệu đã
dùng ở mọi chỗ reload khác trong file) TRƯỚC KHI `continue` vào vòng lặp kiểm tra lại — không còn
kiểm tra ngay lập tức trên trang có thể chưa load xong.

**Không cần sửa gì thêm**: `failedLocatorAll` (Playwright Locator, không phải element handle) và
`baselineFirstSrc`/`lastFailedCount` (giá trị string/number đơn thuần) đều vẫn hợp lệ xuyên suốt
reload — Locator tự truy vấn lại DOM hiện tại mỗi lần gọi `.count()`, không bị "stale" như element
handle thông thường.

**CHƯA XÁC NHẬN TIẾP**: fix CHƯA chạy thử thật sau khi thêm bước chờ. Cần xác nhận: (1) chờ "Add
Media" đủ hay cần lâu hơn nếu trang có nhiều media; (2) sau khi Retry + reload, cơ chế so
`firstVideoSrc`/đếm "Failed" vẫn phát hiện đúng kết quả (thành công hay lại lỗi) như kỳ vọng.

### 4.42. 🔴 Prompt bị RỚT MẤT văn bản giữa chừng khi chèn @mention — đủ chip nhưng thiếu câu, lọt qua mọi kiểm tra cũ
**XÁC NHẬN TRỰC TIẾP (2026-07-19)**: người dùng báo prompt hiện trên Flow cho cảnh #41 bị "thiếu" —
soi debug capture `pre-reload-timeout-scene41-2026-07-19T11-04-44-112Z.png` thấy card bị Flow đánh
dấu **"Failed - prominent people"** với caption thật là: *"Medium shot, Luis speaking urgently to
Spanish Royal Banner Spanish Royal Court Hall Queen"* — so với `videoPrompt` gốc trong
`state/prompts.json` ("Medium shot, Luis speaking urgently to Queen in the court hall, one hand
gesturing... [PERIOD_ANCHOR]... [MOTION_SUFFIX]"), bản gửi lên Flow bị MẤT gần hết câu (toàn bộ
phần sau vị trí đáng lẽ là "Queen" — bao gồm cả PERIOD_ANCHOR/MOTION_SUFFIX) VÀ 2 chip Setting/Prop
(đáng lẽ nằm CUỐI câu — "Spanish Royal Court Hall"/"Spanish Royal Banner" là trailing names, không
xuất hiện dạng chữ trong text) lại chèn LẪN vào GIỮA câu, đẩy "Queen" ra cuối cùng.

**Nguyên nhân gốc CHƯA xác định chính xác được bước nào gây lỗi** (không đủ debug capture chi tiết
từng bước để soi) — nghi ngờ hợp lý: 1 bước gõ "before"/"remainder" text trong
`fillPromptWithMentions` bị gõ NHẦM vào nơi khác (vd ô search của 1 dialog @mention CHƯA đóng hẳn
từ lần chèn chip trước) thay vì vào `promptBox` thật, khiến đoạn đó biến mất khỏi nội dung cuối
cùng dù code vẫn tưởng đã gõ xong (không throw, không log lỗi).

**LỖ HỔNG QUAN TRỌNG NHẤT phát hiện được**: bước xác minh cuối cùng của `fillPromptWithMentions`
(mục 3, "XÁC MINH chip void đã chèn đủ") TRƯỚC ĐÂY chỉ đếm SỐ LƯỢNG chip @mention, KHÔNG kiểm tra
phần VĂN BẢN THUẦN (không phải chip) có còn đầy đủ hay không — nên đúng lỗi này (đủ chip, nhưng
mất phần lớn câu chữ + PERIOD_ANCHOR/MOTION_SUFFIX) HOÀN TOÀN LỌT QUA kiểm tra cũ, khiến Flow nhận
1 prompt bị hỏng/thiếu mà code vẫn tưởng đã gõ đúng và cứ thế bấm Generate.

**Đã sửa** (`src/veo3bot/generate.ts::fillPromptWithMentions`): thêm bước kiểm tra MỚI ngay sau
bước đếm chip — lấy 60 ký tự CUỐI của `text` gốc (luôn nằm trong `MOTION_SUFFIX`, KHÔNG chứa tên
@mention nào, xem `styleDNA.ts`) và xác nhận đoạn này THẬT SỰ xuất hiện trong nội dung hiện tại của
`promptBox` (qua `innerText()`, so sau khi chuẩn hoá khoảng trắng). Nếu thiếu → coi là prompt đã bị
hỏng giữa chừng, `debugCapture` (tag `prompt-text-truncated-scene{index}`) rồi throw để cảnh được
RETRY (qua nhánh catch/`reopenPage()` của `processQueue`) thay vì âm thầm generate video với prompt
sai/thiếu.

**PHÁT HIỆN PHỤ (chưa xử lý, cần người dùng xác nhận)**: soi cùng ảnh debug thấy 2 Character asset
trong Flow đã bị đổi tên NGẮN — "Martín Alonso Pinzón" → hiện thị "Martín", và 1 asset khác hiện
tên "Luis" (nhiều khả năng đổi từ "Luis de Santángel") — nhưng `state/characters.json` VẪN còn ghi
tên ĐẦY ĐỦ cũ. Nếu đúng là bạn đã tự đổi tên trong Flow (theo hướng dẫn mục 4.28/4.40) mà CHƯA cập
nhật lại `state/characters.json`, cần đồng bộ lại field `name` cho khớp — nếu không, lần chạy
`npm run assets` sau có thể không tìm thấy asset cũ (đang tìm theo tên ĐẦY ĐỦ) và tạo THÊM 1 asset
trùng dưới tên đầy đủ (dễ bị chặn lại y hệt bug đã sửa). CHƯA xác nhận chắc `state/characters.json`
cần đổi thành gì chính xác — hỏi lại người dùng tên hiện tại của TỪNG asset trong Flow trước khi
sửa file này.

**TRẠNG THÁI CẢNH #41 HIỆN TẠI**: `status: "success"` trong `state/prompts.json` — NHƯNG do lịch sử
nhiều lần generate với prompt bị hỏng (xác nhận ít nhất 1 lần "Failed" ở bản ghi 11:04, cộng nhiều
lần timeout khác suốt từ 18/7), KHÔNG chắc chắn clip hiện đang đứng tên "clip_041" trong Flow có
đúng nội dung hay không — cần người dùng tự kiểm tra lại bằng mắt trong Flow trước khi tin tưởng,
CHƯA tự ý reset lại status vì có thể lần thành công sau cùng đã dùng đúng prompt.

**CHƯA XÁC NHẬN TIẾP**: fix kiểm tra văn bản CHƯA chạy thử thật. Cần generate lại vài cảnh để xác
nhận: (1) không báo lỗi giả (false positive) cho cảnh bình thường; (2) THẬT SỰ bắt được lại đúng
lỗi này nếu tái diễn.

### 4.43. Vòng reload-recheck không kiểm tra "Failed" — lãng phí toàn bộ thời gian chờ khi Flow từ chối MUỘN
**XÁC NHẬN TRỰC TIẾP (2026-07-19, test riêng cảnh #6)**: chạy `npx tsx scripts/generate-test-scenes.ts 6`
để kiểm tra lại xem cảnh #6 (Character "Christopher", tên ngắn) có còn bị chặn "prominent people"
không (mục ưu tiên đã ghi ở mục 0). Log chỉ báo "timeout" (không báo "bị Flow từ chối"), nhưng soi
debug capture `pre-reload-timeout-scene6-2026-07-19T14-35-18-687Z.png` thấy RÕ RÀNG 1 card
**"Failed - This prompt might violate our policies about generating prominent people"** đã hiện
sẵn — nghĩa là code KHÔNG hề phát hiện ra lỗi này trong lúc đang chạy, dù nó hiển thị rõ ràng trên
màn hình.

**Nguyên nhân**: bản mục 4.34/4.41 CHỈ kiểm tra "Failed" trong vòng poll CHÍNH (`GENERATE_TIMEOUT_MS`
= hiện là 2 phút, không phải 3 phút như mục 4.27 từng ghi — có vẻ đã bị đổi lại ở đâu đó không rõ
thời điểm), KHÔNG kiểm tra lại trong vòng reload-recheck (90s) phía sau — nếu Flow từ chối MUỘN
(card "Failed" xuất hiện đúng lúc/sau khi vòng poll chính vừa hết giờ), toàn bộ 90 giây recheck bị
lãng phí chờ 1 video sẽ KHÔNG BAO GIỜ xuất hiện (đã bị từ chối, không phải xử lý chậm), rồi mới
throw lỗi "timeout" chung chung — không bao giờ có cơ hội bấm "Retry" nhanh. Xác nhận trực tiếp:
soi HTML dump SAU reload (`timeout-scene6-2026-07-19T14-36-52-491Z.html`) thấy thẻ "Failed" VẪN
CÒN NGUYÊN — chứng tỏ đây không phải lỗi thoáng qua mà là trạng thái ổn định bị bỏ sót hoàn toàn.
Hệ quả: 1 cảnh bị từ chối kiểu này tốn tới ~7 phút (2 phút poll + 90s recheck, x2 lần vì
`processQueue` mở tab mới thử lại toàn bộ) thay vì bấm Retry trong vài giây.

**Đã sửa** (`src/veo3bot/generate.ts::generateOneClip`): gộp toàn bộ logic "đếm Failed theo kiểu
edge-detect + bấm Retry + chờ trang ổn định" thành 1 hàm dùng chung `checkFailedAndRetry()`, gọi ở
CẢ vòng poll chính LẪN vòng reload-recheck — đảm bảo phát hiện đúng bất kể lỗi xảy ra SỚM hay MUỘN
(kể cả sau khi đã reload).

**⚠️ PHÁT HIỆN QUAN TRỌNG, MÂU THUẪN VỚI MỤC 4.28**: 1 cảnh dùng Character với tên NGẮN (đã bỏ họ
theo đúng fix mục 4.28) **VẪN bị chặn "prominent people"** — mục 4.28 từng xác nhận trực tiếp đổi
tên ngắn là ĐỦ để hết bị chặn (dựa trên 1 cảnh khác). 2 khả năng: (1) bộ lọc không hoàn toàn xác
định — CÙNG 1 tên có thể lúc bị chặn lúc không tuỳ ngữ cảnh khác của prompt (không chỉ dựa vào
tên); (2) nội dung CỤ THỂ của cảnh đó (tranh công/tranh chấp) có thể tự nó chạm 1 lớp lọc khác
(tranh chấp/xung đột danh tính?) trùng thông báo lỗi. **CHƯA KẾT LUẬN ĐƯỢC** — cần test thêm cùng
tên ngắn đó ở vài cảnh KHÁC (không phải tranh công) để xác định đây là do TÊN hay do NỘI DUNG CẢNH
cụ thể. Nếu tái diễn ở nhiều cảnh khác
dùng "Christopher", kết luận mục 4.28 (tên ngắn là ĐỦ) cần xem lại — có thể cần tên ngắn hơn nữa
hoặc chấp nhận đây là giới hạn không khắc phục được hoàn toàn bằng đổi tên.

**Trạng thái cảnh #6 sau lần test này**: vẫn `"failed"` trong `state/prompts.json` (2 lần thử đều
timeout do bug trên, chưa từng thực sự chạm nhánh Retry) — CẦN chạy lại sau khi có fix mục 4.44
dưới đây.

**ĐÍNH CHÍNH (2026-07-19, ngay sau khi chạy lại lần 2)**: giả định "thẻ Failed vẫn còn nguyên sau
reload" ở mục này SAI — dựa trên nhầm lẫn tự khớp phải 1 chuỗi i18n ẩn giống hệt câu lỗi
("applet_chat_error_safety") khi tôi tự kiểm tra bằng `html.indexOf(...)` không lọc theo hiển thị
thực tế, không phải card THẬT còn hiển thị. Xem mục 4.44 để biết nguyên nhân + fix ĐÚNG.

### 4.44. ⚠️ KẾT LUẬN NÀY SAI PHẦN LỚN — nguyên nhân thật là selector detection hỏng, xem mục 4.50
**ĐÍNH CHÍNH (2026-07-20)**: mục 4.44 dưới đây kết luận "Failed xuất hiện quá sát mốc timeout +
reload xoá mất dấu hiệu" là nguyên nhân khiến bot không bấm Retry. **PHẦN LỚN SAI**: nguyên nhân
GỐC là DETECTION `getByText("Failed").locator(":visible")` HỎNG HOÀN TOÀN (luôn đếm 0), nên
`checkFailedAndRetry` chưa BAO GIỜ chạm tới bước bấm Retry — bất kể timing. Xem mục 4.50. Phần
đúng còn giữ giá trị của 4.44: reload thật sự xoá card "Failed" (nên vẫn nên bấm Retry TRƯỚC khi
reload — mục 4.48). Đọc 4.50 trước khi tin nội dung 4.44 bên dưới.

### 4.44 (bản gốc). Nguyên nhân "Failed" xuất hiện quá sát mốc timeout, reload xoá mất dấu hiệu
**XÁC NHẬN TRỰC TIẾP (2026-07-19, chạy lại cảnh #6 lần 2 sau fix mục 4.43)**: vẫn timeout y hệt, dù
đã thêm `checkFailedAndRetry()` vào CẢ 2 vòng lặp. Soi lại kỹ bằng cách tìm ĐÚNG cấu trúc DOM của
card "Failed" hiển thị thật (`>warning</i><div><div class="...">Failed</div>`, không phải chỉ tìm
chuỗi "This prompt might violate" — chuỗi đó khớp CẢ với 1 i18n key ẩn `applet_chat_error_safety`
không liên quan): card Failed CÓ MẶT ở capture TRƯỚC reload (`pre-reload-timeout-scene6-*`), nhưng
**HOÀN TOÀN KHÔNG CÒN** ở capture SAU khi reload+90s recheck hết giờ (`timeout-scene6-*`) — "Failed"
là trạng thái TẠM THỜI của phiên hiện tại (client-side, gắn với lần submit cụ thể), KHÔNG phải asset
lưu trữ vĩnh viễn như video/ảnh thành công — `page.reload()` xoá sạch dấu hiệu này, không phải nó
"vẫn còn nguyên" như mục 4.43 nhầm tưởng.

**Nguyên nhân THẬT sự khiến `checkFailedAndRetry()` không bắt được**: card "Failed" của Flow xuất
hiện RẤT SÁT mốc `GENERATE_TIMEOUT_MS` (khi đó = 2 phút, không rõ ai/lúc nào đổi từ 3 phút xuống 2
phút, lệch với chính comment cũ của hằng số này) — vòng poll chính LUÔN vừa kịp thoát do hết giờ
NGAY TRƯỚC KHI lần kiểm tra tiếp theo có cơ hội thấy "Failed" (lần kiểm tra cuối cùng trước khi
sleep 5s luôn rơi vào đúng khoảng vài giây TRƯỚC khi Failed thật sự xuất hiện). Sau đó reload xoá
sạch "Failed" (như xác nhận trên), nên vòng reload-recheck (dù có kiểm tra) không còn gì để bắt.

**Đã sửa** (`src/veo3bot/generate.ts`):
- Tăng `GENERATE_TIMEOUT_MS` từ 2 phút → **3 phút** (khớp lại đúng ý định ghi trong comment cũ) —
  cho vòng poll chính đủ khoảng đệm để bắt "Failed" ở NHIỀU lần kiểm tra (mỗi 5s) trước khi chạm
  mốc timeout, thay vì đúng lúc chạm mốc.
- Thêm 1 LẦN KIỂM TRA CUỐI (video mới + `checkFailedAndRetry()`) NGAY LẬP TỨC, không chờ, đúng thời
  điểm vòng poll chính vừa thoát do hết giờ — trước khi rơi vào nhánh reload tốn kém — phòng trường
  hợp lỗi/video xuất hiện ĐÚNG NGAY sau lần kiểm tra cuối cùng trong vòng lặp.

**CHƯA XÁC NHẬN TIẾP**: fix CHƯA chạy thử thật. Cần chạy lại cảnh #6 lần nữa — nếu vẫn bị chặn
"prominent people" nhưng LẦN NÀY code bắt đúng và bấm Retry thành công trong vài giây (thay vì
timeout ~7 phút như 2 lần trước), coi như đã sửa đúng lớp bug NÀY — nhưng câu hỏi gốc "tên ngắn
'Christopher' có thật sự đủ để hết bị chặn không" (mục 4.43) vẫn CHƯA có câu trả lời, vì cả 2 lần
test trước đều chưa từng thực sự chạm được cơ chế Retry để biết Retry có giúp vượt qua hay không.

### 4.45. 🔴 `imageAsset.ts` (Setting/Prop) dùng ĐẾM SỐ LƯỢNG để phát hiện ảnh mới — vỡ khi project vượt ~17 media (lưới ảo hoá), tạo hàng loạt bản trùng
**XÁC NHẬN TRỰC TIẾP (lần chạy `npm run assets` đầu tiên trên 1 project ~20+ asset)**: 12
Character + 5 Setting đầu tạo thành công LIÊN TIẾP, đúng 17 asset — rồi từ asset thứ 18 trở đi,
**TOÀN BỘ các asset còn lại** đều timeout y hệt nhau ("chưa thấy ảnh... sau 2 phút", kể cả sau
reload+90s recheck) dù soi debug screenshot xác nhận ảnh đã tạo ĐÚNG nội dung, ĐÚNG style. Chạy
lại `npm run assets` (kể cả bật `DEBUG=1`) KHÔNG sửa được gì — mỗi lần chạy lại tạo THÊM 1 bản
trùng mới cho asset đó (baselineCount log ra CỐ ĐỊNH ở 5 xuyên suốt nhiều asset liên tiếp khác
nhau — dấu hiệu rõ ràng bộ đếm không phản ánh đúng tổng số ảnh thật).

**Nguyên nhân gốc**: `createImageIngredient` (`imageAsset.ts`) dùng cơ chế đếm SỐ LƯỢNG
`page.getByRole("link", {name: "Generated image"}).count()` trước/sau khi bấm Create, chờ số
lượng TĂNG — ĐÚNG Y HỆT cách `generate.ts` từng làm cho video TRƯỚC KHI sửa ở mục 4.33. Lưới media
chính của Flow dùng **virtualized list** (`react-virtuoso`, đã xác nhận ở mục 4.25/4.33): chỉ
render 1 số lượng CỐ ĐỊNH phần tử trong viewport (quan sát thực tế: luôn đúng 5) bất kể project có
bao nhiêu ảnh — ảnh mới chèn vào ĐẦU danh sách thì 1 ảnh cũ bị đẩy khỏi vùng render ở cuối, nên
tổng số phần tử `"Generated image"` RENDER ĐƯỢC không hề tăng. `imageAsset.ts` được viết TRƯỚC khi
mục 4.33 phát hiện + sửa bug này cho video — bản sửa đó KHÔNG được đồng bộ ngược lại
`imageAsset.ts`, nên Setting/Prop vẫn mang lỗi cũ cho đến khi project đủ lớn để lộ ra (đúng như
video đã từng "ẩn" cho đến khi đủ nhiều clip).

**Hậu quả nghiêm trọng**: mỗi lần `npm run assets` chạy lại tưởng đang "retry" 1 asset failed,
thực ra đang TẠO THÊM 1 bản ảnh trùng lặp (đã tốn credit) mà không hề hay biết — càng chạy lại
càng chồng thêm rác vào project, không bao giờ tự khỏi vì bug nằm ở cơ chế phát hiện, không phải ở
nội dung/model.

**Đã sửa** (`src/veo3bot/imageAsset.ts`) — port đúng cách sửa đã xác nhận cho video (mục 4.33) sang
ảnh: thêm `firstImageSrc()` theo dõi `src` của ẢNH Ở VỊ TRÍ 0 (dựa vào sort "Recent" mặc định của
Flow) thay vì đếm số lượng — coi là "có ảnh mới" CHỈ KHI src vị trí 0 đổi khác so với lúc trước khi
bấm Create. Bước rename cũng đổi từ `.first()` mù sang tìm ĐÚNG ảnh bằng `img[src="..."]` đã biết
chắc chắn (giống `renameLatestVideo` tìm video bằng `video[src="..."]`). Typecheck sạch
(`npx tsc --noEmit`) — **CHƯA CHẠY THỬ THẬT sau khi sửa**, cần xác nhận lại trên vài Setting/Prop
thật trước khi tin tưởng hoàn toàn.

**`characters.ts` (Character) KHÔNG dính bug này** — dùng flow hoàn toàn khác (điều hướng sang
trang "Create Character" riêng biệt, không phải lưới media ảo hoá của canvas chính), nên không cần
sửa.

**Dọn dẹp thủ công CẦN LÀM nếu gặp lại bug này trước khi chạy lại `npm run assets`**: nếu bug này
kịp xảy ra trước khi fix được áp dụng, project sẽ có NHIỀU bản ảnh trùng lặp CHƯA đặt tên trong
Flow cho các asset bị timeout oan. Cần vào Flow xoá bản thừa, giữ 1 bản tốt nhất mỗi tên, sau đó
right-click → Rename → gõ ĐÚNG tên (khớp chính xác `state/settings.json`/`props.json`) TRƯỚC khi
chạy lại `npm run assets` — nếu không, `ensureSettingsInFlow`/`ensurePropsInFlow` sẽ không tìm
thấy asset (tra theo tên) và tạo thêm bản trùng nữa (xem mục 4.15).

### 4.46. Cảnh "chân dung trần" (không mô tả bối cảnh, không gán setting/prop) khiến Veo3 lấy ví dụ đồ vật trong PERIOD_ANCHOR làm nội dung thật
**XÁC NHẬN TRỰC TIẾP**: 1 cảnh "Medium portrait shot of [Character] standing confidently in
[period clothing]..., warm golden celebratory light. [Character] looks steadily ahead." — hoàn
toàn KHÔNG mô tả bối cảnh nào, không gán `settingNames`/`propNames`. Người dùng soi bằng mắt phát
hiện nhân vật đứng ở **bánh lái tàu, đầy đủ dây thừng buồm và cả 1 cây kèn đồng** — hoàn toàn
không hợp lý về mặt bối cảnh (không khớp bối cảnh thật của câu chuyện, và không liên quan gì đến
việc lái tàu).

**Nguyên nhân gốc**: `PERIOD_ANCHOR` (`styleDNA.ts`, append bằng code vào CUỐI mọi videoPrompt để
neo thời đại — xem mục 4.17) liệt kê ví dụ đồ vật thời đại để neo các danh từ chung KHÔNG có
Ingredient (vd "a sailor" → quần áo đúng thời đại): "...wooden dog sledges, **wooden sail-and-steam
ships with tall masts and a single smokestack**, oil lamps and brass navigation instruments...".
Cơ chế này hoạt động đúng khi cảnh ĐÃ mô tả sẵn 1 bối cảnh/vật thể chung chung cần neo thời đại
(mục 4.17). NHƯNG khi cảnh HOÀN TOÀN không mô tả bối cảnh nào (chân dung "trần", chỉ có nhân
vật + ánh sáng/tâm trạng), Veo3 không có gì khác để bám ngoài chính danh sách VÍ DỤ trong
PERIOD_ANCHOR — và nó lấy luôn "tàu buồm" trong ví dụ đó làm NỘI DUNG THẬT của khung hình, dù
PERIOD_ANCHOR chỉ có ý định minh hoạ phong cách thời đại, không phải liệt kê thứ PHẢI xuất hiện
trong MỌI cảnh.

**Quét toàn bộ cảnh của project đó phát hiện vài cảnh "chân dung trần" cùng dạng lỗi** (đều
`"Medium/portrait shot of <Character> standing..., <mood> light."` — không 1 chữ nào mô tả không
gian xung quanh). Cảnh có mô tả địa điểm dù chỉ tối thiểu (vd "...standing in a doorway...") thì an
toàn hơn, không cần sửa.

**Đã sửa** — thêm cụm mô tả PHÔNG NỀN TRUNG TÍNH tường minh + cấm rõ vật thể không liên quan vào
nội dung gốc của các cảnh đó: "against a plain softly blurred [warm/cold]-toned background with no
distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any
kind." Vá TRỰC TIẾP đúng các index bị lỗi vào `state/prompts.json` (giữ nguyên mọi cảnh khác, tự
reset `status`/`isDownloaded` CHỈ cho các cảnh vừa sửa để `npm run generate` tạo lại) — KHÔNG chạy
lại toàn bộ script build prompts từ đầu (sẽ RESET status mọi cảnh về "waiting", mất tiến độ đã
generate).

**LƯU Ý khi vá lại video ĐÃ generate trước đó**: PHẢI xoá file local cũ trong `output/clips/`
TRƯỚC khi generate lại — cơ chế resume của `npm run download` coi "file đã tồn tại trên đĩa" là đã
tải xong (mục 4.35), nếu không xoá sẽ giữ nguyên bản SAI dù Flow đã có bản mới đúng. Bản clip cũ
(sai) vẫn còn nằm lại trong Flow dưới cùng tên (vd "clip_003") — `downloadClip` tìm theo tên rồi
lấy `.first()` (dựa vào sort "Recent" mặc định), nên vẫn lấy đúng bản MỚI, nhưng để dọn rác nên xoá
tay bản cũ trong Flow khi tiện.

**Bài học tổng quát cho quy trình viết prompt (áp dụng cho MỌI project sau này)**: bất kỳ cảnh nào
là "chân dung/cận cảnh nhân vật" mà KHÔNG mô tả TÍ GÌ về không gian xung quanh đều có rủi ro bị
PERIOD_ANCHOR "rò rỉ" ví dụ đồ vật vào làm nội dung thật — LUÔN thêm 1 cụm mô tả phông nền tối
thiểu (dù chỉ là "against a plain blurred background") cho MỌI cảnh dạng chân dung không có
setting/prop, đừng để trống hoàn toàn dù chủ đích là "không cần bối cảnh cụ thể".

### 4.47. Chèn chip @mention INLINE cho Setting/Prop gây mất text (bug 4.42 tái diễn) — chỉ inline cho Character, Setting/Prop luôn trailing
**XÁC NHẬN TRỰC TIẾP (2026-07-20, cảnh #29 — settingNames=["Pack Ice Field"], propNames=["The
Wooden Sledge"], KHÔNG có Character)**: generate lỗi "Prompt bị mất văn bản giữa chừng (đủ chip
nhưng thiếu đoạn cuối MOTION_SUFFIX)" — soi debug capture `prompt-text-truncated-scene29`: ô prompt
chỉ còn "Wide shot of an Inuit driver on [chip Pack Ice Field][chip The Wooden Sledge]", TOÀN BỘ
phần text sau "on" ("pulled by a fanned-out team of husky dogs racing across the frozen sea..." +
PERIOD_ANCHOR + MOTION_SUFFIX) BIẾN MẤT, và dialog chọn asset vẫn đang mở. Đúng bug mục 4.42 (text
`remainder` bị gõ nhầm vào ô search của dialog @mention chưa đóng hẳn).

**Nguyên nhân gốc — thiết kế inline áp dụng NHẦM cho Setting/Prop**: `fillPromptWithMentions` chèn
chip @mention XEN GIỮA CÂU (thay tên chữ bằng chip tại đúng vị trí nó xuất hiện) cho MỌI loại tên
(character + setting + prop, gộp chung `uniqueNames`). Cơ chế inline này SINH RA CHỈ ĐỂ tránh bộ
lọc "prominent people" quét tên nhân vật lịch sử có thật trong text thô (mục 4.28/docstring
`fillPromptWithMentions`). "The Wooden Sledge" nằm giữa câu #29 → bị chèn inline → sau khi chèn chip
xong, dialog chưa kịp đóng thì đoạn text còn lại bị gõ nhầm vào ô search dialog → mất sạch. Setting/
Prop KHÔNG phải người thật nên KHÔNG có rủi ro "prominent people" → chèn inline cho chúng là RỦI RO
THỪA, không lợi ích.

**Đã sửa** (`src/veo3bot/generate.ts::fillPromptWithMentions`): chỉ tính `occurrences` (vị trí chèn
inline) trên `characterNames` — Setting/Prop LUÔN vào `trailingNames` (chèn chip ở CUỐI, sau khi đã
gõ trọn vẹn toàn bộ text 1 lần). Cách này: (1) giữ nguyên bảo vệ prominent-people cho tên Character
(mục đích gốc của inline), (2) bỏ hẳn thao tác inline dễ vỡ cho Setting/Prop, (3) với cảnh chỉ có
Setting/Prop (như #29) thì text được gõ 1 lần liền mạch TRƯỚC, không còn text nào bị gõ sau khi
picker mở. Tên Setting/Prop vẫn nằm dạng CHỮ trong prompt (mô tả) + có thêm chip ở cuối — đúng như
cơ chế cũ trước khi có inline (mục 4.1/4.2: nên nhắc tên trong lời văn). Typecheck sạch.

**CHƯA ĐỦ — xem mục 4.49**: fix này CHỈ giải quyết cảnh có Setting/Prop giữa câu (như #29). Cảnh có
NHIỀU CHARACTER inline (vd two-shot 2 nhân vật) VẪN vỡ vì Character vẫn chèn inline — cần fix bổ
sung ở mục 4.49.

### 4.49. 🔴 Bug truncation THẬT SỰ nằm ở dialog @mention chưa đóng hẳn — fix bằng chờ ô search biến mất (không phải bỏ inline)
**XÁC NHẬN TRỰC TIẾP (1 cảnh two-shot 2 nhân vật, 3 chip Character inline)**: dù đã sửa mục 4.47
(Setting/Prop trailing), cảnh này VẪN lỗi truncation vì cả 3 chip đều là Character (chèn inline).
Soi debug capture
`prompt-text-truncated-scene57`: **ô SEARCH của dialog @mention chứa đúng ĐUÔI MOTION_SUFFIX**
("...no gaps in the outline where two shapes overlap or meet."), còn ô prompt thiếu hẳn phần đó —
tức là sau khi chèn chip inline CUỐI, dialog @mention CHƯA ĐÓNG HẲN, nên bước `remainder` (gõ đoạn
text còn lại sau chip cuối) bị gõ NHẦM vào ô search dialog thay vì promptBox → mất sạch.

**Đây mới là nguyên nhân GỐC của cả bug 4.42 lẫn 4.47**: không phải bản thân việc chèn inline sai,
mà là code KHÔNG chờ dialog @mention đóng hẳn trước khi gõ text tiếp — chỉ `waitForTimeout(700)` mù,
không đủ/không chắc chắn. Mục 4.47 (Setting/Prop trailing) chỉ GIẢM số lần chèn inline (giảm xác
suất trúng bug) chứ không chữa gốc; cảnh nhiều Character inline vẫn trúng.

**ĐÃ THỬ VÁ (KHÔNG ĐỦ)**: thêm bước chờ ô search `input[placeholder="Search assets"]` chuyển state
"hidden" sau khi chọn card (+ Escape fallback) trước khi gõ tiếp. Chạy lại VẪN vỡ y hệt — soi DOM
dump lần 2 xác nhận: ô search vẫn chứa nguyên remainder + MOTION_SUFFIX, prompt vẫn thiếu. Dialog
thỉnh thoảng KHÔNG đóng kịp/không đóng (đặc biệt khi chèn LẠI cùng 1 tên lần 2 trong cùng prompt),
và click re-focus promptBox bị modal chặn pointer nên focus kẹt trong search. Vá kiểu "chờ đóng"
không bao giờ chắc chắn 100% với thao tác xen kẽ gõ-text-mở-dialog liên tục.

**ĐÃ SỬA TẬN GỐC** (`src/veo3bot/generate.ts::fillPromptWithMentions`): BỎ HẲN chèn inline. Gõ TRỌN
VẸN `text` 1 lần (không dialog nào mở → không thể mất text), RỒI mới mở picker append MỌI chip ở CUỐI
(trailing). Nếu 1 chip lỗi thì text vẫn nguyên vẹn, chỉ thiếu chip (bước xác minh `voidChips <
expectedChipCount` bắt được để retry) — không bao giờ gửi Flow prompt thiếu nội dung. Xoá luôn hàm
`findMentionOccurrences` (chỉ phục vụ inline, giờ dead code).

**VÌ SAO BỎ ĐƯỢC INLINE**: cơ chế inline SINH RA CHỈ để tránh bộ lọc "prominent people" quét tên
nhân vật lịch sử THẬT trong text thô (mục 4.28). Nhưng quy trình viết prompt HIỆN NAY (skill +
CHARACTER_EXTRACTION_GUIDE) đã BẮT BUỘC khử-định-danh MỌI tên nhân vật thành tên riêng đơn/nhãn vai
trò (xem mục 4.40) CHÍNH XÁC để tên thô không kích hoạt bộ lọc → tên thô trong text LUÔN an toàn →
inline trở nên THỪA. Nếu project tương lai lỡ dùng tên lịch sử đầy đủ, sửa ở KHÂU ĐẶT TÊN (khử
định danh — vốn đã là quy tắc bắt buộc) chứ KHÔNG quay lại inline dễ vỡ. Fix 4.47 (Setting/Prop
trailing) giờ là TẬP CON của fix này (mọi thứ đều trailing). Typecheck sạch.
**ĐÃ XÁC NHẬN CHẠY THẬT**: cảnh two-shot 2 nhân vật ở trên (đã fail 3 lần liên tiếp vì truncation)
chạy lại BÁO đủ chip @mention (mỗi tên duy nhất 1 chip thay vì đếm cả lần lặp trong câu) + KHÔNG
còn lỗi truncation + tạo/đổi tên clip thành công. Bug truncation đã chữa tận gốc.

### 4.48. Rút ngắn thời gian reload-recheck + thêm "grace poll" bắt nút Retry hiện muộn (theo yêu cầu người dùng)
**BỐI CẢNH**: người dùng quan sát trực tiếp khi generate — mỗi khi 1 cảnh timeout, quá trình
reload + chờ trang sẵn sàng + poll lại QUÁ LÂU (tổng ~5-6 phút/cảnh lỗi), và có tình huống "card
Failed + nút Retry hiện ra nhưng bot không bấm mà cứ đợi hết 3 phút rồi reload" (nút Retry hiện
MUỘN, sát/sau mốc `GENERATE_TIMEOUT_MS`, rồi reload xoá mất — cùng lớp bug 4.44 nhưng với lỗi
audio-generation-failed / prominent-people hiện trễ hơn cả những gì 4.44 từng đo).

**Đã làm** (`src/veo3bot/generate.ts`):
- `RELOAD_RECHECK_TIMEOUT_MS` 90s → **20s**, thêm `RELOAD_READY_TIMEOUT_MS` = **30s** (thay số cứng
  90000 ở nhánh reload-recheck của `generateOneClip`). GIỮ NGUYÊN `GENERATE_TIMEOUT_MS` = 3 phút
  (đây là thời gian Veo3 GENERATE THẬT, không phải thời gian lỗi — rút xuống sẽ khiến MỌI cảnh bình
  thường bị timeout oan hàng loạt rồi tạo bản trùng; đã giải thích + người dùng đồng ý giữ).
- Thêm **vòng "grace poll" ~16s** (mỗi 2s) NGAY SAU khi hết `GENERATE_TIMEOUT_MS`, TRƯỚC KHI reload:
  poll cả video mới LẪN "Failed"/Retry — bắt được card lỗi + bấm nút Retry (tối đa
  `MAX_INLINE_RETRIES`=2 lần) khi nó hiện muộn quanh mốc timeout, mà KHÔNG tốn cả chu kỳ reload đắt
  đỏ. Trước đây chỉ kiểm tra 1 lần rồi reload luôn nên hay bỏ lỡ.
- **Lỗi audio-generation-failed**: 1 card "Failed" hoá ra là "Audio generation failed" (Veo3 cố
  tạo audio dù pipeline không dùng) — KHÔNG phải bị chặn nội dung. Khắc phục GỐC bằng cách BẬT
  tuỳ chọn "Return silent videos" trong Settings của Flow (người dùng đã bật) → Flow trả video
  không audio thay vì đánh dấu cả clip "Failed". Sau khi bật, các cảnh từng "failed" (nghi
  "prominent people") generate LẠI BÌNH THƯỜNG — xác nhận lỗi trước đó là do audio, không phải
  chặn tên (tên riêng đã an toàn theo mục 4.28).

### 4.50. 🔴 NGUYÊN NHÂN GỐC "card Failed + nút Retry hiện rõ nhưng bot không bấm": detection `.locator(":visible")` HỎNG — luôn đếm 0
**XÁC NHẬN TRỰC TIẾP**: người dùng quan sát trực tiếp — khi generate 1 cảnh, card "Failed — This
prompt might violate our policies about generating prominent people" + nút "Retry" HIỆN RÕ trên
màn hình, nhưng bot KHÔNG bấm mà cứ đợi hết 3 phút rồi reload (rồi retry-toàn-bộ tab mới). Soi DOM
dump thật: card lỗi CÓ trong DOM (grep "prominent people"/"Failed" đều thấy), nút Retry CÓ trong
DOM. Nhưng log luôn `baselineRetryCount`/`checkFailedAndRetry` trả "no-failure".

**Nguyên nhân GỐC (khác hẳn kết luận timing ở mục 4.44)**: detection cũ
`page.getByText("Failed", {exact:false}).locator(":visible")`. Cú pháp `A.locator(":visible")` trong
Playwright KHÔNG lọc chính A theo tính hiển thị — nó tìm PHẦN TỬ CON hiển thị BÊN TRONG A. Card lỗi
là `<div class="...">Failed</div>` — 1 div chứa TEXT THUẦN, KHÔNG có phần tử con nào → `.locator(
":visible")` luôn khớp 0 → `failedLocatorAll.count()` LUÔN = 0 → `checkFailedAndRetry` luôn thấy
"currentFailedCount(0) <= lastFailedCount(0)" → trả "no-failure" NGAY, KHÔNG BAO GIỜ chạm bước bấm
Retry. Tức là cơ chế Retry (thêm ở mục 4.34/4.41/4.43/4.44) CHƯA BAO GIỜ THỰC SỰ CHẠY kể từ đầu —
mọi "cải tiến timing" ở các mục đó đều vá nhầm chỗ. `.first().click()` để bấm Retry thì ĐÚNG (nút
Retry = `<button><i>refresh</i><span sr-only>Retry</span></button>`, accessible name "Retry", khớp
`getByRole("button",{name:/retry/i})`) — chỉ mỗi DETECTION sai khiến không bao giờ tới đó.

**Đã sửa** (`src/veo3bot/generate.ts`): bỏ hẳn `getByText("Failed").locator(":visible")`. Phát hiện
lỗi qua chính NÚT RETRY: `retryButtonLocator = page.getByRole("button", {name:/retry/i})`, đếm
`baselineRetryCount` TRƯỚC khi generate, `checkFailedAndRetry` so `currentRetryCount >
lastRetryCount` (phát hiện cạnh như cũ) — nút Retry chỉ xuất hiện trên card lỗi, card mới nhất ở đầu
(Recent sort) nên số nút tăng = có lỗi mới → bấm `.first()`. Kết hợp fix mục 4.48 (bấm Retry NGAY
TRƯỚC reload, đúng lúc card được xác nhận hiện). Typecheck sạch.

**KẾT QUẢ TEST (sau khi sửa detection)**: chạy lại cảnh từng lỗi — detection ĐÃ BẮT ĐÚNG, log hiện
"bị Flow từ chối... bấm Retry ngay (lần 1/2)" (trước đây KHÔNG bao giờ tới bước này). Cơ chế Retry
XÁC NHẬN HOẠT ĐỘNG. NHƯNG cảnh đó vẫn fail cuối cùng: bấm Retry rồi VẪN bị chặn lại (cả 2 lần qua
2 tab) → block của cảnh này là **CỐ ĐỊNH cho riêng nó**, Retry KHÔNG cứu được — cần VIẾT LẠI PROMPT
(bỏ/đổi cụm dễ trigger, tên nhân vật lặp nhiều lần trong 1 câu...) chứ không phải lỗi cơ chế. Các
cảnh khác dùng cùng Character đó đều qua bình thường → block CHỈ riêng cảnh cụ thể này.
Thêm 1 cải tiến: sau khi bấm Retry (trang reload), re-baseline `lastRetryCount` theo số nút sau
reload để lần Retry 2/2 trong cùng tab kích hoạt đúng (trước đó count cũ trước reload khiến lần 2
bị bỏ lỡ). Chiến lược xử lý cảnh bị chặn CỐ ĐỊNH: chạy full generate với cơ chế Retry đã sửa (tự
cứu block NGẪU NHIÊN), sau đó thu thập các cảnh vẫn fail (block cố định) và viết lại prompt riêng
từng cảnh đó — data-driven, không đoán trước.

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
   nét vẽ khác hẳn phần còn lại không — (dự án đã bỏ hẳn cơ chế "Style Anchor"
   ở mục 4.30, chỉ còn dựa vào `MOTION_SUFFIX`; nếu 1 project SAU bật lại Style
   Anchor thì đặc biệt kiểm tra thêm nội dung của chính nó không bị lẫn vào
   cảnh — khung viền, vật thể lạ, xem mục 4.12).
4. **Hiệu ứng lạ (glow/sparkle) trên vật sáng bóng:** xem mục 4.16.
5. **Thời đại sai (hiện đại lẫn vào bối cảnh câu chuyện):** xem mục 4.17, đặc
   biệt các cảnh không tên riêng.
6. **Khựng khi chuyển cảnh:** trích frame ngay TRƯỚC và SAU 1 điểm cắt, xem có
   khung hình lặp/đứng hình bất thường không (chỉ áp dụng nếu bật audio/mux
   theo cảnh — pipeline hiện KHÔNG bật audio, xem mục 1; logic mux vẫn còn
   trong `ffmpeg.ts` nếu cần dùng lại sau này).
7. **Ánh sáng ngày/đêm sai ở cảnh có settingNames:** xem mục 4.19 — soi 1 frame
   mỗi cảnh có `settingNames` không rỗng, so mood/tông màu trong `videoPrompt`
   (night/moonlit vs daylight/sunny) với ánh sáng THẬT của frame. Đặc biệt nghi
   ngờ nếu 1 setting được dùng ở cả cảnh ngày lẫn đêm mà mô tả trong
   `state/settings.json` không nói rõ mô tả đó trung lập ánh sáng.

## 6. Việc còn dang dở / có thể làm tiếp

(2026-07-31) Không còn project nào đang chạy (xem mục 0) — mọi việc "dang dở"
từng ghi ở đây (số cảnh còn thiếu clip, xác nhận outline mới trên asset cũ...)
đều thuộc về project đã bị xoá, không còn áp dụng. Vẫn còn giá trị THAM KHẢO
chung cho project SAU:

- **Audio/TTS đã BỎ HẲN** (Gemini/ElevenLabs xoá khỏi codebase, mục 4.20) —
  video ra KHÔNG có giọng đọc. Logic mux audio/video theo cảnh
  (`ffmpeg.ts::muxSceneAudio`) vẫn còn nguyên trong code (generic, không phụ
  thuộc ElevenLabs) nhưng không có gì gọi tới — chỉ dùng lại được nếu sau này
  có nguồn audio khác.
- **`ensurePropsInFlow` dùng "Create Character" reuse** (không phải chế độ
  Image như Setting) — hoạt động ổn định nhưng khác luồng với Setting, có thể
  cân nhắc thống nhất về 1 luồng nếu phát sinh vấn đề tương tự mục 4.10.
- **Skill `flow-historical-video-prompts`** (không phải file trong repo này —
  nằm trong danh sách skill khả dụng của Claude Code) đã được cập nhật nhiều
  lần qua 2 project trước (nghiên cứu nhân vật có thật, đồng nhất nhiều mốc
  tuổi, Setting/Prop Ingredient, neo thời đại) — đọc skill đó trước khi bắt
  đầu 1 project lịch sử/Flow MỚI để tận dụng bài học đã tích luỹ.
- **`OUTLINE_BLOCK` (`src/styleDNA.ts`)** — yêu cầu outline đen đậm, đều nét
  trên MỌI nhân vật/đạo cụ/kiến trúc/cảnh vật, áp dụng vào
  `CHARACTER_SHEET_STYLE_BLOCK`, `SETTING_SHEET_STYLE_BLOCK`, `MOTION_SUFFIX`.
  Với project MỚI, mọi asset sẽ được tạo mới từ đầu nên không có vấn đề
  "asset cũ thiếu outline" — chỉ cần generate thử vài clip đầu và xác nhận
  outline hiện rõ nhất quán trước khi chạy đại trà (xem mục 5).

## 7. Repo

(2026-07-31) Git đã có **remote** `origin` → `github.com/anhtu230196/veo3-auto-generation`
— dùng `git status`/`git diff`/`git log`/`git push` bình thường. `.gitignore`
hiện tại CHỈ chặn `output/`, `output-*/`, `node_modules/`, `dist/`, `*.log` —
**`state/` và `input/*.txt` KHÔNG bị gitignore** (dòng tương ứng trong
`.gitignore` bị comment `#`), tức là `state/*.json`/`input/story.txt` CÓ được
git track/backup bình thường, khác với ghi chú cũ của file này (đã sửa lại
cho khớp thực tế — xác nhận bằng `git ls-files`/`git check-ignore -v`
2026-07-31). Chỉ `output/`/`output-*/`/`.env`/`.auth/` là thực sự không có
git backup — cẩn trọng khi xoá/ghi đè các thư mục đó.

## 8. Ghi chú định hướng: pipeline "tạo ảnh trước, video sau" bằng Nano Banana — CHƯA triển khai

Người dùng đang cân nhắc đổi cách làm video: thay vì text-to-video thẳng qua
Veo3/Flow (cách hiện tại, mục 1-7), sẽ dùng Nano Banana (Gemini 2.5 Flash
Image) để **tạo ảnh nhân vật/bối cảnh trước**, rồi mới đưa ảnh đó vào bước tạo
video sau (image-to-video) — nhằm kiểm soát phong cách hình ảnh tốt hơn trước
khi tốn credit generate video. **Đây MỚI CHỈ LÀ Ý TƯỞNG/THỬ NGHIỆM (test tay
trên Gemini/Nano Banana ngoài repo) — CHƯA có automation Playwright nào gọi
Nano Banana thật, chưa có quyết định chính thức đổi pipeline.**

**Các style block đã test tay + được người dùng xác nhận hài lòng, đã đúc kết
vào code tại `src/nanoBanana/styleDNA.ts`** (đọc file đó để lấy nội dung đầy
đủ + docstring giải thích từng bài học, không lặp lại ở đây để tránh 2 nơi
lệch nhau về sau):
- `CHARACTER_STYLE_BLOCK` — CHỈ còn giá trị lịch sử (dùng để tạo ra ảnh master
  reference ban đầu), KHÔNG dùng lại để tạo nhân vật mới nữa.
- `MASTER_REFERENCE_NOTE` — **QUYẾT ĐỊNH CUỐI CÙNG**: đã chốt 1 ảnh nhân vật cụ
  thể (lính gác, mũ sắt, cầm giáo) làm ẢNH THAM CHIẾU CỐ ĐỊNH cho MỌI nhân vật
  người sau này, CHẤP NHẬN LUÔN 2 điểm chưa hoàn hảo của ảnh đó (hình bàn tay ở
  đầu que, vạt áo hơi loe) thay vì tiếp tục sửa — ưu tiên nhất quán hơn hoàn
  hảo. File ảnh đã được lưu thật tại `src/nanoBanana/reference-character.jpeg`.
- `CHARACTER_PROMPT_PREFIX` — câu mở đầu CHUẨN dùng cho MỌI nhân vật mới (đã bỏ
  boilerplate tư thế/biểu cảm/nền cũ).
- `CHARACTER_DESCRIPTION_CHECKLIST` — mô tả nhân vật mới CHỈ gồm: trang phục,
  tóc, nón/mũ (nếu có), râu (nếu nam), mắt (CHỈ nếu nữ) — KHÔNG mô tả dáng
  người/tỉ lệ cơ thể (ảnh reference đã cố định) hay biểu cảm (quyết định riêng
  theo cảnh). KHÔNG dùng tên riêng người thật/nổi tiếng trong prompt — xác
  nhận trực tiếp: Nano Banana/Gemini chặn theo chính sách Google giống bộ lọc
  "prominent people" của Flow (mục 4.28/4.40) — dùng mô tả ngoại hình/trang
  phục thay thế.
- `BASE_STYLE_BLOCK`/`BACKGROUND_STYLE_BLOCK` — quy tắc chung mọi ảnh (flat
  color, outline đậm, chi tiết quy về hình khối cơ bản).
- `NO_PERSPECTIVE_BLOCK` — chống phối cảnh hội tụ cho cảnh kiến trúc.
- `LAYERED_DEPTH_LANDSCAPE_NOTE` — cho phép chiều sâu kiểu xếp lớp ở cảnh
  phong cảnh thiên nhiên (không bị cấm như kiến trúc).
- `RESERVE_CHARACTER_SPACE_BLOCK` — chừa sàn/nền trống để ghép nhân vật sau.
- `EYE_LEVEL_CAMERA_BLOCK` — ép góc máy ngang tầm mắt, không nhìn chéo từ trên
  xuống (nếu không, sàn trước sẽ sai góc để đặt nhân vật đứng vào).

**Quyết định về nơi lưu quy tắc (2026-08-01)**: người dùng chọn lưu tạm trong
code (`styleDNA.ts`) + RUNBOOK này, CHƯA tạo skill riêng cho việc viết prompt
Nano Banana (khác với `flow-historical-video-prompts` là skill riêng của
pipeline Flow) — vì hướng này vẫn đang thử nghiệm, chưa chốt chính thức. Cân
nhắc tạo skill riêng SAU nếu quyết định chính thức theo hướng Nano Banana.

**Bài học tổng quát quan trọng nhất** (áp dụng khi viết prompt tay hoặc sau
này viết code prompt-builder): **ảnh tham chiếu (image-to-image) THẮNG mô tả
bằng chữ** — nếu ảnh mẫu gốc sai chi tiết gì (vd tay chân vẽ đầy đủ), ảnh mới
dùng nó làm reference sẽ lặp lại đúng lỗi đó dù prompt chữ ghi khác đi. Cùng
bài học đã có ở mục 4.12 cho Veo3 Ingredient (nội dung ảnh LÀ đúng thứ sẽ bị
kéo vào, không chỉ là gợi ý phong cách trừu tượng) — nên PHẢI có 1 ảnh mẫu gốc
đã đúng 100% trước khi dùng làm reference hàng loạt.

**Đã test qua nhiều loại cảnh** (phố gỗ thuộc địa, bến tàu/biển, nội thất cung
điện, làng adobe, quảng trường thị trấn có toà nhà chính quyền, hội trường
nghị viện hình vòng cung) — người dùng xác nhận hài lòng với cả style nhân vật
lẫn background.

**Việc còn chưa làm** (bước tiếp theo, theo đúng thứ tự người dùng muốn):
1. Test thêm nhân vật động vật (chưa làm — nhân vật người đã test khá đủ:
   thường dân, quân nhân, nhân vật lịch sử khác nhau, đều dùng chung master
   reference + checklist ở trên).
2. Test ghép nhân vật (đã confirm style) VÀO bối cảnh (đã confirm style) cùng
   1 ảnh — xem 2 style có hoà hợp/nhất quán khi đứng cạnh nhau không.
3. Viết automation Playwright thật để gọi Nano Banana tự động (tương tự
   `src/veo3bot/` cho Flow) — CHƯA có dòng code nào cho bước này, kể cả
   `src/nanoBanana/styleDNA.ts` mới chỉ có các constant prompt, chưa có hàm gọi
   API/automation nào.
4. Thiết kế lại kiến trúc pipeline tổng thể (thay `@mention` Ingredient trong
   Flow bằng bước generate ảnh Nano Banana + bước image-to-video riêng), cách
   lưu trữ ảnh đã tạo (thay thế vai trò `state/characters.json` hiện tại?), và
   validate xem bước image-to-video sau đó có giữ đúng phong cách ảnh gốc hay
   không (chưa test).
