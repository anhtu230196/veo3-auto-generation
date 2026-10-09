# r1-01-review-gemini

## Trả lời các yêu cầu bắt buộc (Việc mọi lượt phải làm)

- **Lỗi logic / nhánh đặt tên ĐÈ:** Nhánh reload trong `findNewImageSrc` mắc lỗi logic nghiêm trọng. Khi reload, token của `src` ảnh cũ sẽ thay đổi (không nằm trong `baselineSrcs` ban đầu). Nếu thẻ trên cùng của Flow lúc đó là một thẻ vô danh/lỗi từ lần chạy trước (`label` rỗng, không nằm trong `baselineLabels`), nó sẽ lọt qua cả 2 điều kiện chặn, bị nhận nhầm là ảnh mới và bị đặt tên đè lên, trong khi ảnh thật sự mới có thể chưa kịp xuất hiện. (Trả lời Q1).
- **Lỗi logic hợp thức hoá prompt cũ:** Ở `run-shots.ts` (nhánh existing) và `audit-shots.ts`, khi code thấy ảnh đã tồn tại nhưng chưa có `prev.promptHash` (ví dụ: chạy audit lần đầu cho mẻ cũ), nó tự động lấy hash của prompt HIỆN TẠI gán vào `promptHash`. Điều này che đậy sự thật là ảnh vốn được tạo từ một prompt cũ, khiến `review_shots.py` báo `✅ có trên Flow` sai sự thật thay vì hiện cảnh báo prompt đã thay đổi. (Trả lời Q2).
- **Lỗi logic khớp tên ở audit:** `audit-shots.ts` dùng phép so sánh `t === j.outName` để kiểm tra. Theo RUNBOOK bài học 4.49, nhãn thẻ trên bảng chọn luôn bị Flow cắt chữ bằng dấu ba chấm (`...`) nếu tên quá dài. Việc dùng `===` sẽ khiến audit hoàn toàn mù với các ảnh có tên dài (luôn báo `soCard = 0` và đè trạng thái báo lỗi sai sự thật).
- **Đường gọi cũ bị vỡ:** Hàm `focusPromptEnd` dùng `page.mouse.click(box.x + box.width - 4, box.y + box.height - 4)`. Khi văn bản quá dài làm xuất hiện thanh cuộn (scrollbar) dọc hoặc nút resize, cú click này sẽ trúng thẳng vào thanh cuộn. Việc bấm thanh cuộn không cấp focus cho ô văn bản, khiến lệnh `Ctrl+End` và ký tự `@` rơi vào khoảng không, vỡ toàn bộ luồng chèn chip. (Trả lời Q4).
- **Ghi JSON hỏng định dạng:** Không phát hiện code làm hỏng cấu trúc JSON, ngoại trừ việc `JSON.stringify(..., 2)` sẽ định dạng lại toàn bộ file thành nhiều dòng (phá vỡ kiểu viết mảng trên một dòng nếu có) và làm mất ký tự BOM, nhưng tác giả đã ghi nhận chủ động nhược điểm này trong đề xuất.
- **Chỗ SPEC-v2 nói khác code:** SPEC quy định `ok: true` nghĩa là "ảnh đã có trên Flow dưới tên ten". Tuy nhiên trong `audit-shots.ts`, biến `const ok = r.soCard === 1;` ép `ok` thành `false` nếu có 2 ảnh trùng tên (`soCard > 1`), dù thực tế ảnh ĐÃ CÓ trên Flow. (Trả lời Q3).

## Tôi đã không kiểm cái gì

Do chạy ở chế độ tự động và bị chặn quyền thực thi một số lệnh shell (`ls`), tôi chỉ sử dụng công cụ đọc mã nguồn tĩnh (`view_file`, `list_dir`) để tra cứu. Tôi đã không kiểm tra được DOM thực tế của UI Google Flow bằng DevTools trình duyệt để xác nhận hành vi hiển thị thẻ hay mã HTML chính xác của chip trong ô contenteditable.

```points
D01 | mở | src/veo3bot/imageAsset.ts (findNewImageSrc) | CHẶN: Nhánh reload nhận nhầm thẻ cũ vô danh thành ảnh mới (do token src đổi và label rỗng lọt qua bộ lọc), gây đặt tên đè lên ảnh cũ. Cần sửa logic không nhận thẻ rỗng nhãn khi reload.
D02 | mở | src/veo3bot/imageAsset.ts (focusPromptEnd) | CHẶN: Bấm tọa độ góc dưới phải (width-4, height-4) sẽ trúng thanh cuộn khi prompt dài, ô text mất focus và phím gõ rơi ra ngoài. Cần đổi cách cấp focus không dính thanh cuộn.
D03 | mở | scripts/audit-shots.ts (khớp tên) | CHẶN: Khớp tên bằng `t === j.outName` trượt 100% với tên dài do Flow cắt chuỗi bằng dấu ba chấm (bài học RUNBOOK 4.49). Cần chuyển sang so khớp startsWith sau khi cắt đuôi như cũ.
D04 | mở | scripts/run-shots.ts (recordDaTao) | CHẶN: Tự động gán promptHash mới cho ảnh existing cũ chưa có dấu, che đậy việc ảnh vốn vẽ bằng prompt cũ và báo ✅ sai sự thật. Cần bỏ logic tự gán hash này ở cả run-shots và audit-shots.
D05 | mở | scripts/audit-shots.ts | SỬA: Code ép `ok = false` khi `soCard > 1`, mâu thuẫn với SPEC-v2 (quy định ok=true nghĩa là ảnh đã có trên Flow). Cần sửa code để ok=true hoặc cập nhật SPEC ghi rõ ngoại lệ này.
```
