# Đề xuất r1 (Gemini)

## Các quyết định trong lượt này
- Đã rà soát và khai báo bổ sung toàn bộ trường `invented` cho đủ 20 shots trong `image-prompts/A1.newstyle.shots.json`. Những shot bám sát 100% vào reference (`A1-01`, `A1-03`, `A1-11`, `A1-12`) được chủ động thêm trường `"invented": []` để minh chứng rằng chi tiết đã được đối chiếu kỹ lưỡng và không có phần nào là tự nghĩ.
- Đối với `A1-13` và `A1-16`, chi tiết áo khoác dạ tweed và cà vạt sọc chéo được chuyển vào trường `invented` vì hai shot này chỉ dùng `refs` là ảnh `05` (mugshot), mà ảnh này không thể hiện rõ những trang phục đó (áo khoác thuộc về ảnh 01/04).

## Điểm yếu nhất & Câu hỏi cho reviewer
- **Điểm yếu nhất:** Việc shot `A1-08` được phân loại là `character` nhưng lại không có trường `refs` nào đi kèm vi phạm quy tắc "character bắt buộc phải có refs chân dung" trong SPEC-v2. Tuy nhiên, do giới hạn nghiêm ngặt của lượt này là "DỪNG đụng tới kind/outName/cue/at của các shot khác, đừng thêm bớt shot", tôi đã không tự ý thêm `refs` cho `A1-08`. 
- **Câu hỏi cho reviewer:** Có nên đưa mảng `refs` chân dung (ví dụ 01, 04, 05) vào thẳng các shot như `A1-08`, `A1-13`, `A1-16` để tránh việc phải liệt kê trang phục/đặc điểm đã có thực vào mảng `invented` do bị thiếu ref cục bộ không?

## Cố ý chưa làm
- Không thêm trường `refs` cho `A1-08` dù nó đã chuyển thành `character`.

## Tôi đã không kiểm cái gì
- Do quyền chạy shell bị chặn, tôi không thể tự chạy lệnh kiểm tra `python scripts/build_image_prompts.py --shots image-prompts/A1.newstyle.shots.json --check`. Kết luận về việc file JSON có hoàn toàn hợp lệ (đặc biệt là nguy cơ báo lỗi thiếu `refs` cho `character` ở A1-08) chưa được kiểm chứng thực tế và phải nhờ Claude chạy hộ theo như yêu cầu.

## Kết quả xử lý công việc bắt buộc
- **D16 (Sửa kind bị ngược):** Xác nhận các shot đã có phân loại kind đúng như yêu cầu: `A1-08` thành `character`, `A1-12` thành `figure`, `A1-17` thành `figure`, và `A1-04` thành `object`.
- **D15 (Trường invented cho toàn bộ 20 shots):** Đã rà soát đủ 20/20 shot. Thêm mảng rỗng `[]` cho các shot không có chi tiết tự nghĩ; cập nhật chi tiết trang phục chưa có căn cứ từ ref cục bộ vào mảng `invented` của `A1-13` và `A1-16`.

```points
D15 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Khai báo bổ sung đầy đủ trường invented cho toàn bộ 20 shots
D16 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Sửa loại kind bị ngược ở A1-04, A1-08, A1-12, A1-17
```
