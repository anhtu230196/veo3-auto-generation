# veo3-story-pipeline

Pipeline: kịch bản văn bản → trích xuất nhân vật/bối cảnh/đạo cụ + audio (tuỳ
chọn, ElevenLabs) → tạo Character/Setting/Prop asset trong Google Flow (giữ
hình ảnh nhất quán) → nhiều clip Veo3 (4-8s/clip, tạo qua Playwright, phong
cách 2D flat vector illustration) → ghép thành 1 video hoàn chỉnh (ffmpeg).

**Đọc [RUNBOOK.md](RUNBOOK.md) trước** nếu tiếp quản project đang dang dở —
file đó có trạng thái hiện tại + toàn bộ bài học/bug đã sửa.

## Cài đặt

```bash
npm install
npx playwright install chromium
```

Không cần tạo `.env` nếu chỉ tiếp tục project đã có sẵn `state/characters.json`
/ `settings.json` / `props.json` / `prompts.json` (viết tay hoặc đã sinh sẵn).
Chỉ cần `cp .env.example .env` rồi điền nếu muốn:

- `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` (tuỳ chọn, bật giọng đọc):
  https://elevenlabs.io/app/settings/api-keys
- `GEMINI_API_KEY` (tuỳ chọn, miễn phí, tự sinh nhân vật/bối cảnh/đạo cụ/prompt
  cho kịch bản MỚI thay vì viết tay): https://aistudio.google.com/apikey —
  dùng chung gmail với tài khoản Veo3/Flow (trieudev99@gmail.com)

## Chạy

1. Dán nội dung kịch bản vào `input/story.txt` (bỏ qua nếu đã có sẵn).
2. Đăng nhập Veo3 một lần (lưu session để bot dùng lại):
   ```bash
   npm run login:veo3
   ```
   Đăng nhập bằng trieudev99@gmail.com trong cửa sổ Chrome mở ra, xong quay lại
   terminal nhấn Enter.
3. Chạy pipeline:
   ```bash
   npm run run
   ```

Kết quả: `output/video_final.mp4`.

## Ghi chú

- **Selectors trong `src/veo3bot/`** đã được xác nhận trực tiếp trên UI Flow
  thật (nhiều đợt, gần nhất 2026-07-16/17), nhưng Flow không có API chính thức
  nên UI có thể đổi bất cứ lúc nào. Nếu bot lỗi, dùng
  `npx playwright codegen --channel=chrome --user-data-dir=".auth/chrome-profile" https://labs.google/fx/tools/flow`
  (dùng lại session đã đăng nhập, không cần login lại) để soi lại UI mới.
- Pipeline có thể **resume**: nếu bị gián đoạn giữa chừng (mất mạng, lỗi UI,
  hết quota...), chạy lại `npm run run` sẽ bỏ qua nhân vật/bối cảnh/đạo cụ/
  audio/clip đã tạo và tiếp tục.
- `state/*.json` cache kết quả (viết tay hoặc Gemini) để không tốn quota/công
  sức viết lại mỗi lần resume. Xoá file tương ứng nếu muốn sinh lại.
- Model Veo3 mặc định là **"Veo 3.1 - Lite [Lower Priority]"** (rẻ/chậm hơn) —
  đổi trong `src/veo3bot/generate.ts` (`TEXT.modelLite`) nếu muốn dùng Fast/Quality.
- `PARALLEL_WORKERS` mặc định = 1 (xem `src/config.ts`) — xem RUNBOOK.md mục
  4.4 trước khi tăng lên, có rủi ro Ingredient bị nhiều bản khác nhau.
