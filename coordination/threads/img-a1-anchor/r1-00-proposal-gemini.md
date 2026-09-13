# Đề xuất r1-00 (Gemini)

Tôi đã hoàn thành 4 yêu cầu được giao bằng cách chỉnh sửa trực tiếp file `image-prompts/A1.newstyle.shots.json`. Dưới đây là chi tiết các quyết định sửa đổi:

## Chi tiết thực hiện

1. **Áp ảnh neo phong cách:** 
   - Khởi tạo khối `assets` ở cấp cao nhất chứa định nghĩa `style-anchor`.
   - Thêm shot `A1-00` lên vị trí đầu tiên của mảng `shots`, mang thuộc tính `"produces": "style-anchor"` kèm theo đoạn mô tả `draw` chép từ file anchor.
   - Bổ sung `"useAsset": ["style-anchor"]` vào tất cả các shot còn lại trong sequence.
2. **D14 - Sửa `outName` thành Title Case & Xóa tên thật:**
   - Chuyển toàn bộ các `outName` từ định dạng camelCase sang Title Case (tiếng Anh tự nhiên).
   - Xóa bỏ mọi tên thật trong `outName` để tránh model tự in text vào ảnh. Cụ thể: `relesPortrait` đổi thành `Broad Faced Man In Dark Overcoat`, `relesDeadOnRoof` thành `Heavy Set Man Lying Face Down`, `nypdCopSleeping` thành `Police Officer Asleep In Chair` v.v.
3. **D13 - Tách bối cảnh phòng xử án khỏi A1-08:**
   - Cắt bỏ cụm mô tả bối cảnh "wooden paneled courtroom" khỏi shot nhân vật `A1-08` (Man Swearing Oath).
   - Tạo thêm một shot riêng biệt là `A1-08b` (Wooden Paneled Courtroom) chỉ tập trung vào việc tả không gian phòng xử án.
4. **D11 - Đánh dấu chi tiết tự sáng tác:**
   - Tiến hành rà soát toàn bộ các shot và bổ sung trường `"invented"` dưới dạng mảng (array) cho những chi tiết hư cấu không nằm trong tư liệu gốc. Ví dụ: `harsh, dramatic lighting` ở A1-04, `crisp white lab coat` ở A1-05, hay `dark silk tie` ở A1-08.

## Kết quả kiểm tra nội bộ (Chờ Claude)

Do quyền chạy lệnh shell của tôi bị chặn, tôi không thể tự mình chạy lệnh kiểm tra xác thực định dạng (`python scripts/build_image_prompts.py --shots image-prompts/A1.newstyle.shots.json --check`). Dù vậy, tôi đã cẩn thận ghép nối cú pháp JSON và rà soát các trường dữ liệu để đảm bảo không bị lỗi syntax. Nhờ Claude hoặc người review vòng tiếp theo chạy giúp lệnh trên để xác thực lại file.

```points
D11 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Thêm trường invented thống kê các chi tiết tự sáng tác
D13 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Tách bối cảnh phòng xử án ra thành shot riêng A1-08b
D14 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Đổi outName sang Title Case và gỡ bỏ toàn bộ tên thật
```
