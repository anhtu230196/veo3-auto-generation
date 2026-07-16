# veo3-story-pipeline — Runbook đầy đủ (đọc file này trước khi làm gì cả)

Tài liệu này dành cho 1 phiên Claude Code MỚI (máy khác) tiếp quản dự án. Nó gộp
toàn bộ kiến trúc, cách chạy, VÀ các bug/bài học đã tốn rất nhiều thời gian mới
tìm ra — đọc kỹ phần "Bài học xương máu" trước khi sửa code, để không lặp lại
đúng những lỗi đã mất công sửa.

## 1. Dự án làm gì

Chuyển 1 truyện văn bản (hiện tại: truyện true-crime, ~2000 từ, dựa trên vụ án
Chris Watts có thật nhưng đổi tên nhân vật thành "The Husband/The Wife/The
Investigator" vì Google Flow chặn tạo hình người nổi tiếng có thật) thành 1
video hoàn chỉnh ~15 phút, có giọng đọc, hình ảnh AI tạo bởi Veo3, nhân vật giữ
mặt nhất quán xuyên suốt.

**Luồng xử lý** (`src/orchestrator.ts`):
1. Trích xuất nhân vật chính từ truyện (Gemini) → `state/characters.json`
2. Tạo Character asset trong Google Flow cho từng nhân vật (giữ mặt nhất quán)
3. Chia truyện thành ~111 cảnh 7-8 giây, mỗi cảnh sinh 1 prompt tiếng Anh chi
   tiết cho Veo3 (Gemini) → `state/prompts.json`
4. TTS từng cảnh bằng ElevenLabs → `output/audio/audio_NNN.mp3`
5. Tự động hoá Google Flow bằng Playwright để tạo video Veo3 cho từng cảnh,
   đính đúng Character asset qua `@mention` → `output/clips/clip_NNN.mp4`
6. Ghép clip + audio từng cảnh, nối tất cả thành video cuối (ffmpeg) →
   `output/video_final.mp4`

## 2. Cài đặt & chạy (xem thêm README.md)

```bash
npm install
npx playwright install chromium
cp .env.example .env   # điền ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, GEMINI_API_KEY
npm run login:veo3     # đăng nhập Google 1 lần, lưu session vào .auth/
# dán truyện vào input/story.txt
npm run run            # chạy pipeline, resume-safe (Ctrl+C giữa chừng thì chạy lại được)
```

Biến môi trường quan trọng: `PARALLEL_WORKERS` (mặc định lấy từ `config.ts`,
đặt `PARALLEL_WORKERS=1` khi cần fix 1 cảnh cụ thể để chắc chắn dùng ĐÚNG 1
project Flow — xem mục 3.4).

## 3. Bài học xương máu (ĐỌC TRƯỚC KHI SỬA `veo3bot/`)

Google Flow **không có API chính thức**. Toàn bộ tương tác là tự động hoá UI
bằng Playwright DOM selectors — cực kỳ dễ vỡ khi UI đổi, và có nhiều hành vi
ngầm không trực quan. Mỗi mục dưới đây từng gây ra 1 lỗi thật, tốn nhiều giờ để
tìm ra nguyên nhân gốc, chỉ phát hiện được qua soi hình ảnh output thực tế
(không phải qua log/test tự động).

### 3.1. `@mention` là cơ chế DUY NHẤT giữ đúng mặt nhân vật
Gõ `@TênNhânVật` trong ô prompt **không mở dropdown gợi ý đơn giản** — nó mở 1
**dialog chọn asset** (Radix dialog) có ô "Search assets". Phải: gõ toàn bộ mô
tả cảnh trước (giữ đúng thứ tự câu), sau đó ở CUỐI mới gõ `@` để mở dialog, gõ
tên vào ô search, click đúng card loại "Character" (không phải "Image"), rồi
mới nhận là đã chèn chip tham chiếu thật. **Kiểm tra bằng cách gõ
`promptBox.innerHTML()` xem có `data-slate-void="true"` không** — nếu không có
chip này, Veo3 sẽ tự bịa ra người hoàn toàn khác dù prompt ghi đúng tên (xem
`fillPromptWithMentions` trong `generate.ts`).

Cách BIND SAI (không hoạt động, đã bỏ hẳn): đính Character qua overlay "Add
Media" ở đầu prompt — chỉ là gợi ý phong cách chung, KHÔNG ràng buộc khuôn mặt.

### 3.2. Tên nhân vật phải xuất hiện ĐÚNG CHỮ trong prompt
`characterNames` (JSON) chỉ dùng để biết cần chèn @mention cho ai — hàm
`fillPromptWithMentions` tìm ĐÚNG CHUỖI tên đó trong `videoPrompt` để tách vị
trí chèn chip. Nếu Gemini sinh prompt mà thay tên bằng đại từ ("he", "she") ở
câu đầu giới thiệu nhân vật, @mention sẽ KHÔNG được chèn cho nhân vật đó → mặt
sai. Đã sửa trong system prompt của `prompt-writer.ts`: bắt buộc nhắc tên đầy
đủ mỗi khi nhân vật xuất hiện/hành động, không dùng đại từ ở lần đầu trong cảnh.

### 3.3. Góc quay PHẢI thấy rõ mặt nhân vật
Các kiểu góc quay sau khiến @mention không "neo" được khuôn mặt, Veo3 tự bịa
người khác hoặc mặt biến dạng giữa clip: **bóng lưng/silhouette, soi
gương/reflection, quay lưng bỏ đi, cận cảnh chỉ 1 bộ phận (chỉ miệng/chỉ
mắt/chỉ tay), ảnh quá tối không thấy mặt, hiệu ứng "glitch/degrade" lên người**.
Muốn truyền tải cảm xúc u ám/căng thẳng thì dùng BIỂU CẢM KHUÔN MẶT + ánh
sáng/tông màu, KHÔNG dùng cách giấu mặt. Đã bake vào system prompt
`prompt-writer.ts`. Nếu 1 cảnh thực sự không cần thấy mặt (cảnh vật, camera an
ninh xa, màn hình...) thì để `characterNames` RỖNG.

### 3.4. Chạy song song NHIỀU project Flow làm 1 nhân vật có NHIỀU khuôn mặt
Khi chạy nhiều tab song song (`PARALLEL_WORKERS > 1`), mỗi tab dùng 1 project
Flow riêng để tránh lẫn dữ liệu giữa các tab (xem `project.ts::ensureProjects`).
NHƯNG mỗi project Flow **tự sinh Character asset riêng** từ cùng 1 mô tả text —
2 lần sinh độc lập từ cùng mô tả KHÔNG ra cùng 1 khuôn mặt! Hậu quả: cùng tên
"The Wife" nhưng mặt khác nhau tuỳ cảnh chạy trúng project nào — bug RẤT khó
phát hiện vì mỗi clip riêng lẻ vẫn "đúng trong nội bộ clip đó", chỉ lộ ra khi so
sánh CÙNG 1 nhân vật QUA NHIỀU cảnh khác nhau bằng mắt.
**Cách xử lý:** khi cần sửa 1 cảnh cụ thể cho khớp với các cảnh khác, LUÔN chạy
`PARALLEL_WORKERS=1` (chỉ dùng project #1 gốc, nơi đa số clip đã đúng).

### 3.5. Veo3 có thể tự "nhân đôi" người trong cảnh nhiều người
1 cảnh mô tả "vợ chồng + 2 con gái" (4 người) từng ra kết quả **2 người vợ**
(5 người) — Veo3 tự thêm người khi prompt mơ hồ về số lượng người lớn/trẻ em
cùng khung hình. Fix: viết prompt tường minh số lượng, ví dụ chỉ rõ "Only one
adult woman, The Wife, appears beside The Husband."

### 3.6. Bug "trùng lặp clip" (duplicate) — nguyên nhân baseline-diff
Không được kiểm tra "video mới xuất hiện chưa" bằng cách check `video[src]` hay
text "Failed" tồn tại trên trang — trang giữ lại TOÀN BỘ lịch sử media cũ vĩnh
viễn, nên check kiểu "tồn tại" sẽ khớp nhầm video CŨ của cảnh khác. Phải:
đếm số lượng element TRƯỚC khi bấm generate (baseline), rồi chờ số lượng TĂNG
so với baseline mới coi là xong. `getByText()` còn khớp cả text ẩn (JSON nhúng
sẵn trong trang) nên phải lọc `.locator(':visible')` nữa. Xem `generateOneClip`
trong `generate.ts` — code hiện tại đã áp dụng đúng, ĐỪNG bỏ 2 cơ chế này khi
sửa lại.

### 3.7. Không dùng vị trí mảng làm ID khi mảng có thể "hụt" phần tử
Nếu 1 cảnh bị Flow từ chối tạo (chính sách nội dung) và bị bỏ qua, mảng kết quả
trả về bị "nén" (mất phần tử giữa). TUYỆT ĐỐI không dùng vị trí lặp `i` làm tên
file/chỉ số cảnh — phải mang theo `index` thật của cảnh xuyên suốt pipeline
(xem interface `ScenePair` trong `ffmpeg.ts`). Sai chỗ này từng làm audio/video
lệch nhau HÀNG LOẠT ở mọi cảnh sau cảnh đầu tiên bị bỏ qua.

### 3.8. Không được báo "xong" khi còn thiếu cảnh
Nếu 1 cảnh bị Flow chặn/lỗi liên tục, KHÔNG được im lặng bỏ qua rồi báo hoàn
tất với video ngắn hơn — phải viết lại prompt trừu tượng hơn và thử lại cho đến
khi đủ. `orchestrator.ts` chủ động `process.exit(1)` kèm log liệt kê rõ cảnh
nào thiếu nếu chưa đủ 111/111 — đây là chủ đích, ĐỪNG xoá logic này.

### 3.9. Ghép audio/video: không đổi tốc độ, dùng cắt/giữ-đứng-hình
Veo3 luôn tạo clip 7-8 giây CỐ ĐỊNH bất kể câu thoại (audio) của cảnh đó dài
hay ngắn (có cảnh audio chỉ ~2s, có cảnh ~16s). Cách ghép SAI: dùng `setpts` đổi
tốc độ video để khớp audio → cảnh audio ngắn bị tua nhanh 4x (giật), cảnh audio
dài bị làm chậm 2x (lừ đừ). Cách ĐÚNG (đã áp dụng trong
`ffmpeg.ts::muxSceneAudio`): nếu audio ngắn hơn video → CẮT BỚT video (giữ tốc
độ gốc); nếu audio dài hơn → GIỮ ĐỨNG HÌNH CUỐI (freeze frame, filter `tpad`)
cho đủ độ dài, không đổi tốc độ.

### 3.10. Ghép nối cuối cùng phải GIẢI MÃ LẠI, không stream-copy
`concatVideos` từng dùng `-c copy` (stream copy) để nối — nhanh nhưng gây
**khựng/giật ngay tại mọi điểm chuyển cảnh** vì mỗi file `scene_*.mp4` được mã
hoá riêng biệt (timestamp/SPS-PPS không hoàn toàn khớp nhau dù cùng codec).
Đã sửa: giải mã lại khi nối (`-c:v libx264 -c:a aac`, bỏ `-c copy`) — chậm hơn
nhưng cho luồng thực sự liên tục.

### 3.11. API key ElevenLabs cần đúng scope
Muốn liệt kê danh sách giọng (`GET /v1/voices`) cần API key có quyền
`voices_read` — bật ở ElevenLabs → Settings → API Keys. Giọng đang dùng:
"Mark" (`zPvq8YlQIIdISxA99nK0`, use_case=narrative_story, giọng Mỹ trầm điềm
tĩnh) — hợp thể loại true-crime hơn giọng mặc định ban đầu.

## 4. Cách verify (ĐỪNG chỉ tin log "0 lỗi")

Các bug nghiêm trọng nhất (sai mặt nhân vật, trùng lặp clip, lệch audio/video)
đều **vượt qua mọi check tự động** (file tồn tại, không trùng hash, không lỗi
runtime) — chỉ lộ ra khi soi bằng mắt. Quy trình verify chuẩn:

1. **Trùng lặp clip:** `md5 -r output/clips/*.mp4 | awk '{print $1}' | sort | uniq -d` → phải rỗng.
2. **Sai/lệch nhân vật:** trích 1 frame giữa mỗi cảnh có `characterNames` không
   rỗng, ghép contact-sheet (xem script mẫu bên dưới), soi bằng mắt so với mô
   tả trong `state/characters.json` — không tin riêng 1 frame, nếu nghi ngờ
   1 cảnh cụ thể thì trích thêm 3-4 frame (đầu/giữa/cuối) để bắt lỗi "morph
   giữa chừng".
3. **Lệch audio/video:** so `ffprobe` duration của từng cặp
   `clips/clip_NNN.mp4` và `audio/audio_NNN.mp3` — nếu chênh lệch lớn (tỉ lệ xa
   1.0) nghĩa là cảnh đó sẽ bị tua nhanh/chậm nếu code cũ (mục 3.9) còn tồn tại.
4. **Khựng khi chuyển cảnh:** trích frame ngay TRƯỚC và SAU 1 điểm cắt (dùng
   duration của `output/muxed/scene_NNN.mp4` để tính mốc thời gian), xem có
   khung hình lặp/đứng hình bất thường không.

Script mẫu tạo contact-sheet (Python + ffmpeg, không cần ImageMagick — máy có
thể không có `convert`/`montage`):
```python
import subprocess, glob
files = sorted(glob.glob("f_*.jpg"))  # đã trích sẵn bằng ffmpeg -ss ... -frames:v 1
sheets = [files[i:i+9] for i in range(0, len(files), 9)]
positions = ["0_0","320_0","640_0","0_180","320_180","640_180","0_360","320_360","640_360"]
for si, sheet in enumerate(sheets):
    n = len(sheet); inputs = []
    for f in sheet: inputs += ["-i", f]
    scale = "".join(f"[{j}:v]scale=320:180[s{j}];" for j in range(n))
    labels = "".join(f"[s{j}]" for j in range(n))
    fc = scale + f"{labels}xstack=inputs={n}:layout={'|'.join(positions[:n])}[out]"
    subprocess.run(["ffmpeg","-y"]+inputs+["-filter_complex",fc,"-map","[out]",f"sheet_{si}.jpg","-loglevel","error"])
```

## 5. Việc còn dang dở / có thể làm tiếp
- **Nhạc nền:** đang định thêm 1 track ambient bí ẩn/rùng rợn (free, nguồn
  Pixabay Music — track "Mysterious Suspense Background No Copyright Music"
  của ArctSound, đã tải nhưng chưa move vào `assets/` do giới hạn quyền
  Downloads trên máy cũ). Cần: đặt file mp3 vào `assets/`, trộn dưới giọng đọc
  bằng ffmpeg (`amix` hoặc filter `volume` giảm nhạc nền, giữ giọng đọc rõ), có
  thể áp dụng cho cả video hoặc ducking theo từng đoạn.
- **Nhân vật phụ chưa có Character asset riêng:** vài cảnh (#17-19, về nhân vật
  "Nickole" — bạn của Shanann/The Wife) đang tạm gán vào "The Investigator" vì
  chỉ có 3 Character asset (Husband/Wife/Investigator). Muốn chính xác tuyệt
  đối cần tạo thêm asset riêng.
- **Skill `crime-scene-mood-grading`**: đã tồn tại trong danh sách skill khả
  dụng của Claude Code (không phải file trong repo này) — dùng khi viết/soát
  lại prompt cảnh để đảm bảo tông màu u ám phù hợp thể loại true-crime, mặt
  nhân vật vẫn phải rõ (xem mục 3.3).

## 6. Repo
Code đã push lên: `https://github.com/dangtrieu/video-playwright.git` (branch
`master`). File KHÔNG có trong git (theo `.gitignore`, cần tự tạo lại):
`.env` (API keys), `output/`, `state/` (cache Gemini + project Flow đã tạo),
`.auth/` (session Google đã đăng nhập), `input/story.txt` (nội dung truyện).
