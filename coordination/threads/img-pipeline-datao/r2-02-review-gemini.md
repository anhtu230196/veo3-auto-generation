# r2 · review — img-pipeline-datao

## Kết quả kiểm tra (Bước 6)
Tôi đã đọc kỹ diff trong bản v3, đề xuất `r1-00-proposal-claude.md`, `RUNBOOK.md` mục 4 và `SPEC-v2.md`. 
- **Lỗi logic:** Không phát hiện. Các hàm tự động hoá Playwright đều có cơ chế retry hoặc fallback an toàn (VD: `focusPromptEnd` có dự phòng gọi thẳng `focus()` nếu chưa lấy được focus, `clearPromptBox` thử xoá tối đa 5 vòng).
- **Nhánh đặt tên ĐÈ lên ảnh cũ:** Đã xử lý triệt để. `findNewImageSrc` đời 4 chặn việc nhận nhầm bằng cách buộc `first.label` phải có và không tồn tại trong `baselineLabels`. Tránh được lỗi thẻ cũ vô danh bị nhận là ảnh mới ở nhánh reload khi hết giờ.
- **Nhánh tạo ảnh TRÙNG:** Được xử lý và bảo vệ tốt. Bất kể việc Flow bị lỗi hay rớt mạng, hàm `assetAlreadyExists` luôn chạy ở đầu luồng, trả về `existing`. Kết hợp với hàm `writeDaTao`, script giữ nguyên dấu `promptHash` cũ thay vì đè prompt hiện hành lên ảnh cũ. 
- **Đường gọi cũ bị vỡ:** Chữ ký của `createImageIngredient` đổi từ `Promise<void>` thành `Promise<"created" | "existing">` hoàn toàn tương thích ngược, các caller cũ dùng `await` nhưng không lấy giá trị trả về nên không gãy luồng.
- **Ghi JSON hỏng định dạng:** Không bị. Hàm `writeDaTao` đảm bảo giữ lại các ký tự EOL của file cũ (`\n` hoặc `\r\n`), và không làm truncate mất file. Việc lưu với `JSON.stringify(..., 2)` có ép lại chuẩn 2 khoảng trắng nhưng tạo ra file JSON hợp lệ và điều này đã được ghi nhận ở đề xuất r1.
- **Chỗ SPEC-v2 nói khác code:** Không có. Mục 5e của SPEC-v2 đã được cập nhật quy tắc `ok=false` khi số card > 1 (trùng tên), khớp chính xác với dòng `ok = r.soCard === 1` của `audit-shots.ts`.

## Tôi đã không kiểm cái gì
- Tôi không chạy shell hay chạy thử luồng UI Flow thật bằng Playwright do giới hạn quyền hệ thống của chế độ TỰ ĐỘNG. Toàn bộ đánh giá, bao gồm các hành vi tải trang lưới media, đều là phân tích mã nguồn tĩnh.

```points
D01 | chốt: đã sửa | src/veo3bot/imageAsset.ts (findNewImageSrc) | Nhãn rỗng giờ là chưa nhận ở mọi nhánh, chặn nhánh reload nhận nhầm
D02 | chốt: đã sửa | src/veo3bot/imageAsset.ts (focusPromptEnd) | Lùi 24px khỏi mép phải và kiểm tra focus, tránh click trượt vào thanh cuộn
D03 | chốt: đã sửa | scripts/lib/shotsStatus.ts (matchLabel) | Đã đổi sang khớp chuỗi con (startsWith) khi nhãn bị cắt bằng dấu ba chấm, kèm cờ khopCat
D04 | chốt: đã sửa | scripts/run-shots.ts, scripts/audit-shots.ts | Không tự gán promptHash mới cho ảnh existing cũ chưa có dấu
D05 | chốt: đã sửa | image-prompts/SPEC-v2.md (5e) | Đã cập nhật SPEC ghi rõ ok=false khi trùng tên, khớp với logic code
```
