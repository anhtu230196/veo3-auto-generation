# veo3-story-pipeline

Pipeline: kịch bản văn bản → nhân vật/bối cảnh/đạo cụ (`state/*.json`, Claude
viết tay — xem RUNBOOK mục 4.20) → tạo Character/Setting/Prop asset trong
Google Flow (giữ hình ảnh nhất quán) → nhiều clip Veo3 (4-8s/clip, tạo qua
Playwright, phong cách 2D flat vector illustration) → ghép thành 1 video hoàn
chỉnh (ffmpeg). KHÔNG dùng Gemini/ElevenLabs (đã bỏ, xem RUNBOOK mục 4.20) —
toàn bộ nội dung nhân vật/bối cảnh/đạo cụ/prompt đều do Claude viết trực tiếp
trong hội thoại, video không có giọng đọc.

**Đọc [RUNBOOK.md](RUNBOOK.md) trước** nếu tiếp quản project đang dang dở —
file đó có trạng thái hiện tại + toàn bộ bài học/bug đã sửa.

## Cài đặt

```bash
npm install
npx playwright install chromium
```

Không cần tạo `.env` để chạy — mặc định đã hợp lý. Chỉ cần `cp .env.example
.env` rồi điều chỉnh nếu muốn đổi `PARALLEL_WORKERS`, `TEST_SCENE_LIMIT`, hoặc
bật `DEBUG=1` (xem `.env.example`).

Trước khi chạy, cần có sẵn `state/characters.json` (bắt buộc) và tuỳ chọn
`state/settings.json` / `props.json` / `prompts.json` — nhờ Claude viết các
file này dựa trên kịch bản (xem SPEC trong `src/characters/extract.ts`,
`src/settings/extract.ts`, `src/props/extract.ts`,
`src/splitter/prompt-writer.ts::buildPromptWritingGuide`).

## Chạy

1. Dán nội dung kịch bản vào `input/story.txt` (bỏ qua nếu đã có sẵn).
2. Đăng nhập Veo3 một lần (lưu session để bot dùng lại):
   ```bash
   npm run login:veo3
   ```
   Đăng nhập bằng trieudev99@gmail.com trong cửa sổ Chrome mở ra, xong quay lại
   terminal nhấn Enter.
3. Tạo Character/Setting/Prop (nhân vật/bối cảnh/đạo cụ) trong Flow:
   ```bash
   npm run assets
   ```
4. Sau khi asset đã tạo xong (không còn `status: "failed"`), generate video
   từng cảnh + ghép video cuối:
   ```bash
   npm run generate
   ```

Kết quả: `output/video_final.mp4`. 2 lệnh trên tách rời — chạy lại `npm run
generate` nhiều lần (vd sau khi viết lại prompt cho cảnh bị chặn) không cần
chạy lại `npm run assets`, trừ khi vừa thêm/sửa nhân vật/bối cảnh/đạo cụ mới.

## Ghi chú

- **Selectors trong `src/veo3bot/`** đã được xác nhận trực tiếp trên UI Flow
  thật (nhiều đợt, gần nhất 2026-07-16/17), nhưng Flow không có API chính thức
  nên UI có thể đổi bất cứ lúc nào. Nếu bot lỗi, dùng
  `npx playwright codegen --channel=chrome --user-data-dir=".auth/chrome-profile" https://labs.google/fx/tools/flow`
  (dùng lại session đã đăng nhập, không cần login lại) để soi lại UI mới.
- Cả 2 lệnh đều **resume**: nếu bị gián đoạn giữa chừng (mất mạng, lỗi UI...),
  chạy lại `npm run assets` hoặc `npm run generate` sẽ bỏ qua nhân vật/bối
  cảnh/đạo cụ/clip đã tạo (dựa trên field `status` trong `state/*.json`, xem
  `src/assetStatus.ts`) và tiếp tục các mục còn `waiting`/`failed`.
- `state/*.json` do Claude viết tay — xoá file/entry tương ứng nếu muốn viết
  lại, hoặc sửa `status` về `"waiting"` để pipeline tự tạo lại asset đó.
- Model Veo3 mặc định là **"Veo 3.1 - Lite [Lower Priority]"** (rẻ/chậm hơn) —
  đổi trong `src/veo3bot/generate.ts` (`TEXT.modelLite`) nếu muốn dùng Fast/Quality.
- `PARALLEL_WORKERS` mặc định = 1 (xem `src/config.ts`) — xem RUNBOOK.md mục
  4.4 trước khi tăng lên, có rủi ro Ingredient bị nhiều bản khác nhau.
