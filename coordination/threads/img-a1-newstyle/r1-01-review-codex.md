# r1-01-review-codex

Bản v1 cần sửa trước khi chốt: thiếu 11 shot của A1, đổi mất hành động ở A1-17 và dùng đặc điểm của dụng cụ hiện đại cho dụng cụ được giới thiệu là thuộc thập niên 1930.

## Kết quả đối chiếu manifest và ba quyết định của Tú

Đã đọc toàn bộ `image-prompts/refs/A1/manifest.json`, đối chiếu cả `shows`, `evidenceFor` và `note` với bảy prompt trong bản v1.

- **Style ngắn:** dòng 2 đã dùng đúng câu `with the same style with reference images`. Không đề nghị đưa khối style dài trở lại.
- **Mô tả chi tiết:** bản v1 đã bổ sung tóc gợn marcel, nét mặt, vải tweed vân xương cá, sơ mi trắng, cà vạt sọc chéo; đồng phục cảnh sát có chất vải, tay áo và phù hiệu mũ. Riêng A1-03 đang ghép đặc điểm từ hai nguồn có giá trị chứng cứ khác nhau, nêu tại D03.
- **Tái sử dụng nhân vật/vật thể:** giữ ngoài phạm vi xét duyệt lượt này. Không yêu cầu phục hồi hay thiết kế lại `useAsset`/`produces`. Việc nhắc lại trang phục trong các prompt độc lập tự nó không phải lỗi.

## D01 — CHAN — Bản được trình là toàn bộ A1 nhưng chỉ có bảy shot

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:7`; `coordination/threads/img-a1-newstyle/r1-00-proposal-gemini.md:3`.

**VẤN ĐỀ GÌ:** Đề xuất nói đã viết lại toàn bộ shot của A1, nhưng mảng chỉ có A1-01, 03, 11, 12, 13, 16 và 17. Đối chiếu `image-prompts/SHOT-LIST.md:85`, A1 có 18 shot. Thiếu A1-02, 04, 05, 06, 07, 08, 09, 10, 14, 15 và 18. Đặc biệt, mất dây ga giường và lò sưởi khiến đoạn giải thích cú rơi không còn các hình minh họa manh mối đã có trong bản gốc. Câu hỏi của luồng chưa giới hạn công việc vào bảy shot có liên quan đến ảnh tư liệu.

**CẦN GÌ ĐỂ ĐÓNG:** Bổ sung 11 shot còn thiếu theo cách viết mới, giữ chức năng kể chuyện đã có. Nếu tác giả chủ ý nộp một phần để thử, cần ghi rõ phạm vi đó và phần còn thiếu; không kết luận đã hoàn thành toàn bộ A1.

## D02 — SUA — A1-17 đổi cảnh sát ngủ thành cảnh sát đứng

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:58`.

**VẤN ĐỀ GÌ:** Prompt mới ghi `policeman standing`. Shot gốc tại `image-prompts/SHOT-LIST.md:101` là cảnh sát ngủ trên ghế, minh họa lời tại mốc `[1:04]` trong transcript rằng những người gác đều khai đang ngủ. Đổi sang đứng làm mất chức năng của shot này và lặp lại vai trò hình cảnh sát ở A1-12. Nguồn `03-nyc-policeman-1942-loc__codex.jpg` chỉ làm căn cứ trang phục; manifest đã nói không dùng tư thế trong ảnh cho A1-12/A1-17.

**CẦN GÌ ĐỂ ĐÓNG:** Giữ mô tả đồng phục mới, khôi phục hành động ngủ trên ghế cho A1-17. Khi ghép với lời, cảnh này minh họa lời khai của người gác.

## D03 — SUA — Đặc điểm cán đen bóng lấy từ ảnh hiện đại bị gắn vào dụng cụ thập niên 1930

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:22`.

**VẤN ĐỀ GÌ:** Prompt giới thiệu dụng cụ `from the 1930s`, rồi mô tả cán gỗ sơn đen bóng. Trong manifest, đặc điểm đen bóng chỉ có ở nguồn `08-ice-pick-modern-commons__gemini.jpg`, được ghi rõ là vật dụng hiện đại chụp năm 2005, chỉ chứng minh hình dáng chung. Nguồn cùng thời `07-ice-pick-awl-1930s-pemberton__codex.jpg` chứng minh cán gỗ phình, cổ kim loại và thân nhọn, nhưng `shows` không xác nhận lớp sơn đen bóng. Bản mới đã nâng chi tiết của nguồn phụ thành đặc điểm lịch sử mà không phân biệt.

**CẦN GÌ ĐỂ ĐÓNG:** Dùng các chi tiết đã được ghi nhận ở nguồn 07 và bỏ khẳng định cán sơn đen bóng. Nếu muốn giữ màu đó như lựa chọn minh họa, phải ghi rõ là màu quy ước, không phải chi tiết được nguồn cùng thời xác nhận.

## Tôi đã không kiểm cái gì

- Không mở lại từng ảnh; đánh giá ngoại hình dựa trên mô tả Claude đã xác minh trong manifest theo yêu cầu lượt này.
- Không kiểm chứng độc lập lịch sử vụ Reles trên web. Transcript chỉ được dùng để đối chiếu chức năng của shot.
- Không chạy Flow, sinh ảnh hoặc xác nhận độ đồng nhất thực tế của style ngắn.
- Không kiểm thử khả năng build/chạy JSON hay cơ chế tái sử dụng asset.
- Lần đọc RUNBOOK toàn bộ bị công cụ cắt bớt đầu ra; đã đọc lại phần đầu, không coi là đã rà đầy đủ RUNBOOK. `rg` không có trên máy; đã dùng `Select-String` để đối chiếu các dòng liên quan.

```points
D01 | mở | image-prompts/A1.newstyle.shots.json:7 | CHAN — Thiếu 11 trong 18 shot nhưng đề xuất trình là toàn bộ A1
D02 | mở | image-prompts/A1.newstyle.shots.json:58 | SUA — A1-17 đổi cảnh sát ngủ trên ghế thành đứng, mất chức năng minh họa lời khai
D03 | mở | image-prompts/A1.newstyle.shots.json:22 | SUA — Gắn lớp sơn đen bóng từ vật dụng hiện đại vào mô tả dụng cụ thập niên 1930
```