# r1-01-review-codex

V1 đã áp ảnh neo, đổi tên card và tách phòng xử khỏi nhân vật. Phần `invented` chưa đủ để xác nhận D11 đã sửa xong.

## Kết quả đối chiếu bốn việc bắt buộc

Không tạo hoặc sửa file: phiên này chỉ có quyền đọc. Các thay đổi dưới đây đã có trong artifact của Gemini, không phải do lượt review này thực hiện.

1. **Ảnh neo:** Có `assets`, A1-00 đứng đầu, `produces` đúng tên; `draw` chép đúng bản anchor và `cue` giống A1-01. Cả 19 shot sau đều có `useAsset: ["style-anchor"]`. Tổng cộng 20 shot gồm 18 shot gốc, ảnh neo và phòng xử bổ sung.
2. **D14:** Toàn bộ `outName` đã thành tiếng Anh Title Case, không chứa tên người thật và không trùng nhau.
3. **D13:** A1-08 không còn bối cảnh phòng xử; A1-08b chứa phòng xử riêng.
4. **D11:** Đã thêm `invented` nhưng bỏ sót cả shot lẫn chi tiết quan trọng; xem D15.

Đã thử lệnh kiểm tra yêu cầu. Shell trả `python` không được nhận diện; chưa có kết quả builder thành công.

## D15 — SUA — `invented` chưa bao phủ các phần dựng thêm

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:125`, `image-prompts/A1.newstyle.shots.json:227`, `image-prompts/A1.newstyle.shots.json:252`, `image-prompts/A1.newstyle.shots.json:277`.

**VẤN ĐỀ GÌ:** Bản đề xuất mới tuyên bố hoàn tất D11, nhưng bản v1 vẫn thiếu `invented` ở những shot có chi tiết không được manifest xác nhận:

- A1-07: gỗ sồi nhuộm tối, dây da và bộ chụp đầu kèm dây cuộn; A1-15: sơn bạc bong, chân cong và van đồng. Manifest không có tư liệu cho hai hiện vật này.
- A1-13: tư thế nằm úp, tay buông và lựa chọn trang phục lúc phát hiện thi thể. Reference `05-reles-mugshot-1940-jjay__codex.jpg` chỉ chứng minh ngoại hình trong ảnh nhận dạng, không chứng minh hiện trường.
- A1-17: cảnh sát ngủ trên ghế. Reference `03-nyc-policeman-1942-loc__codex.jpg` ghi rõ chỉ dùng cho trang phục, không phải người gác Reles; transcript chỉ thuật lại lời họ khai đã ngủ, không xác nhận tư thế ngủ trên ghế.

Đây là bằng chứng trực tiếp từ bản v1 cho thấy phần bổ sung metadata chưa hoàn tất, không phải yêu cầu bỏ những lựa chọn minh họa đã được chấp nhận.

**CẦN GÌ ĐỂ ĐÓNG:** Rà toàn bộ `draw` và bổ sung `invented` cho các chi tiết không có trong manifest, gồm các ví dụ trên. Với tư thế và trang phục trong cảnh tái dựng, ghi rõ đó là lựa chọn minh họa, không phải chứng cứ hiện trường. Có thể giữ nguyên mô tả hình ảnh; không cần tìm thêm nguồn hoặc viết lại toàn bộ shot.

## Toi da khong kiem cai gi

- Không chạy được builder: `exec_command` đọc file được, nhưng lệnh `python` trả `CommandNotFoundException`; chưa xác nhận chính thức `--check` qua.
- Không mở ảnh gốc hoặc `output/anchor-sheet.png`; đối chiếu tư liệu dựa trên `shows`, `evidenceFor` và ghi chú trong manifest. Không xác nhận độc lập chất nét của năm ảnh thử.
- Không chạy Flow, sinh ảnh hoặc kiểm tra việc gắn asset trong phiên chạy thực tế.
- Không kiểm chứng lịch sử, bản quyền hay chính sách quảng cáo trên web; không đối chiếu từng mốc `at` với âm thanh.
- Đầu ra RUNBOOK bị cắt; một số văn bản tiếng Việt hiển thị lỗi mã hóa. Không coi đó là lỗi nội dung file.
- Không sửa artifact hoặc `THREAD.md` vì quyền hệ thống chỉ cho đọc.

```points
D15 | mở | image-prompts/A1.newstyle.shots.json:227 | SUA — invented còn bỏ sót chi tiết hiện vật và cảnh tái dựng; chưa đủ căn cứ chốt D11
```