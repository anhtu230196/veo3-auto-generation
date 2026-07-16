# veo3-story-pipeline

Pipeline: truyện văn bản → trích xuất nhân vật + audio (ElevenLabs) → tạo Character
asset trong Google Flow (giữ nhân vật nhất quán) → nhiều clip Veo3 (4-8s/clip, tạo
qua Playwright) → ghép thành 1 video hoàn chỉnh (ffmpeg).

## Cài đặt

```bash
npm install
npx playwright install chromium
cp .env.example .env   # rồi điền API key
```

- `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`: https://elevenlabs.io/app/settings/api-keys
- `GEMINI_API_KEY` (miễn phí): https://aistudio.google.com/apikey — dùng chung gmail
  với tài khoản Veo3/Flow (trieudev99@gmail.com)

## Chạy

1. Dán nội dung truyện vào `input/story.txt`.
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

- **Selectors trong `src/veo3bot/generate.ts` và `src/veo3bot/characters.ts`**
  đã được xác nhận trực tiếp trên UI Flow thật (2026-07-13), nhưng Flow không có
  API chính thức nên UI có thể đổi bất cứ lúc nào. Nếu bot lỗi, dùng
  `npx playwright codegen https://labs.google/fx/tools/flow` để soi lại UI mới.
- Pipeline có thể **resume**: nếu bị gián đoạn giữa chừng (mất mạng, lỗi UI,
  hết quota...), chạy lại `npm run run` sẽ bỏ qua nhân vật/audio/clip đã tạo và
  tiếp tục.
- `state/characters.json` và `state/prompts.json` cache kết quả gọi Gemini để
  không tốn quota gọi lại mỗi lần resume. Xoá file tương ứng nếu muốn sinh lại.
- Model Veo3 mặc định là **"Veo 3.1 - Lite [Lower Priority]"** (rẻ/chậm hơn) —
  đổi trong `src/veo3bot/generate.ts` (`TEXT.modelLite`) nếu muốn dùng Fast/Quality.
