# r2-01-review-gemini

## Kết quả rà soát Bước 6 (code)

- **Lỗi logic:** Không phát hiện lỗi logic nghiêm trọng trong luồng mới. Các logic xoá ô prompt, nhận ảnh mới, và xử lý ghi JSON `daTao` đều hợp lý.
- **Nhánh tạo ảnh TRÙNG:** Trong `imageAsset.ts` (`findNewImageSrc`), nếu ảnh mới được tạo ra nhưng Flow chậm cập nhật nhãn (`label` rỗng) cho đến khi hết giờ, hàm sẽ trả về `undefined` và ném lỗi timeout. Ảnh đã được tạo trên Flow sẽ nằm đó vô danh. Lần chạy sau `assetAlreadyExists` sẽ không tìm thấy tên ảnh, dẫn đến việc tạo thêm một ảnh TRÙNG nội dung. Tác giả đã chủ động chọn hướng này để an toàn (tránh ghi đè ảnh cũ). Nhờ lớp bảo vệ `baselineLabels` được áp dụng chặt chẽ ở mọi nhánh (kể cả reload), hiện không phát hiện nhánh nào có nguy cơ đặt tên ĐÈ lên ảnh cũ.
- **Đường gọi cũ bị vỡ:** Không phát hiện. Việc đổi kiểu trả về của `createImageIngredient` thành `"created" | "existing"` tương thích ngược hoàn toàn với các lệnh gọi `await` ở luồng cũ.
- **Ghi JSON hỏng định dạng:** Không hỏng. Hàm `writeDaTao` trong `shotsStatus.ts` sử dụng `JSON.stringify(data, null, 2)` sinh ra JSON hợp lệ, kết hợp với regex bảo toàn kiểu xuống dòng của hệ điều hành, không có nguy cơ phá vỡ cấu trúc file.
- **SPEC-v2 nói khác code:** SPEC-v2 đã được cập nhật đồng bộ với code ở bản v2 (đã ghi rõ `ok=false` khi trùng tên). Code và SPEC hiện tại thống nhất với nhau.

## Tôi đã không kiểm cái gì

- Tôi đã không kiểm tra trực tiếp giao diện Google Flow trên trình duyệt thật vì không có công cụ tự động để tương tác với UI ngoài luồng script. Do đó, tôi không thể xác minh chính xác DOM hiện tại của thẻ card (cụ thể là `innerText` có trả về text đầy đủ hay bị cắt bởi ellipsis như đã ghi chú trong RUNBOOK).

```points
D01 | chốt: đã sửa | src/veo3bot/imageAsset.ts (findNewImageSrc) | Đã sửa logic không nhận thẻ rỗng nhãn khi reload
D02 | chốt: đã sửa | src/veo3bot/imageAsset.ts (focusPromptEnd) | Đã sửa lùi 24px và fallback focus() để tránh thanh cuộn
D03 | đẩy lên Tú | scripts/audit-shots.ts (khớp tên) | Tác giả phản bác sai: RUNBOOK mục 4.49 (phần "Ba điều về UI...") CÓ ghi rõ "Nhãn thẻ bị CẮT bằng dấu ba chấm... Khớp tên chính xác LUÔN trượt". Do tác giả có số đo 85/85 khớp, cần đẩy lên Tú quyết định.
D04 | chốt: đã sửa | scripts/run-shots.ts, scripts/audit-shots.ts | Đã bỏ logic tự gán hash cho ảnh existing
D05 | chốt: đã sửa | image-prompts/SPEC-v2.md | Đã cập nhật SPEC ghi rõ ok=false khi trùng tên
```
