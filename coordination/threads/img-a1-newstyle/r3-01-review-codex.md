# r3-01-review-codex

V3 đã sửa D09 và D10. Phần bổ sung chi tiết của D11 đã tiến triển, nhưng chưa phân biệt lựa chọn minh họa với đặc điểm có nguồn. Có một lỗi mới ở A1-08 cần sửa cục bộ.

## Kết quả đối chiếu manifest và ba quyết định của Tú

Đã đọc `image-prompts/refs/A1/manifest.json`, đối chiếu `shows`, `evidenceFor` và các giới hạn nguồn với 18 shot.

- **Style ngắn:** artifact giữ đúng câu `with the same style with reference images`. Builder hiện đã nhận `styleBlock` của JSON; không còn căn cứ nói phần nối style vẫn dùng cố định khối dài.
- **Bù chi tiết:** 11 shot bổ sung đã có thêm trang phục, màu hoặc chất liệu. Manifest không có nguồn cho ghế điện, lò sưởi, bó tiền và một số nhân vật minh họa; các chi tiết mới này cần được xác định là lựa chọn minh họa.
- **Tái sử dụng:** giữ ngoài phạm vi. Không yêu cầu khôi phục hoặc thiết kế lại `useAsset`/`produces`.

## D08 — HOI — Chấp nhận phân công cho Claude, chưa xác nhận đóng toàn bộ

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:7`; `scripts/build_image_prompts.py:71`.

**VẤN ĐỀ GÌ:** Chấp nhận phản bác của Gemini về người chịu trách nhiệm: không yêu cầu tác giả JSON sửa builder. Có bằng chứng mới trong mã hiện tại: `full_prompt` đã nhận style từ artifact và `build_jobs` đã truyền giá trị đó. Phần này đã sửa.

Phần ảnh neo phong cách chưa được chứng minh hoàn tất: builder vẫn bỏ `refs` khỏi jobs, còn runner truyền ảnh tham chiếu qua `refNames`. Không coi việc thêm mugshot vào `refs` là bằng chứng model nhận ảnh.

**CẦN GÌ ĐỂ ĐÓNG:** Claude xác nhận phần nối style đã sửa và chỉ rõ ảnh mẫu phong cách cùng đường đính ảnh cho lần chạy dự kiến. Giữ D08 chờ Claude; không mở mã mới cho cùng vấn đề.

## D09 — OK — Cue đã khớp duy nhất

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:85`.

**VẤN ĐỀ GÌ:** Cue mới `sent seven senior mobsters` xuất hiện đúng một lần trong transcript. Kiểm tra bằng PowerShell sau khi bỏ timestamp và chuẩn hóa khoảng trắng cũng cho thấy cả 18 cue đều khớp một lần.

**CẦN GÌ ĐỂ ĐÓNG:** Không cần sửa thêm cho tính duy nhất của cue; chốt đã sửa.

## D10 — OK — Đã hết trùng tên trong 18 shot

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:21`.

**VẤN ĐỀ GÌ:** Cả 18 shot đã có `outName` riêng, không trùng nhau và không chứa mã shot. Ba shot Reles và hai shot cảnh sát đã có tên phân biệt.

**CẦN GÌ ĐỂ ĐÓNG:** Không cần sửa thêm cho lỗi trùng tên nội bộ; chốt đã sửa. Phần quy định builder/SPEC của D12 để Claude xác nhận.

## D11 — SUA — Đã thêm chi tiết, còn thiếu phân biệt nguồn và lựa chọn minh họa

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:80`; `image-prompts/A1.newstyle.shots.json:154`; `image-prompts/A1.newstyle.shots.json:184`.

**VẤN ĐỀ GÌ:** Phần mô tả thô đã được thay bằng chi tiết cụ thể. Tuy nhiên gỗ sồi nhuộm tối của ghế điện, lớp sơn bạc bong và van đồng của lò sưởi, đai giấy nâu của bó tiền không được `shows` nào trong manifest xác nhận. Điều kiện đóng D11 ở vòng trước đã yêu cầu phân biệt màu minh họa với đặc điểm lịch sử có nguồn; v3 chưa ghi rõ ranh giới này.

Đây không phải yêu cầu tìm ảnh cho mọi vật thể hay bỏ các màu đã chọn.

**CẦN GÌ ĐỂ ĐÓNG:** Ghi rõ trong ghi chú artifact hoặc phản hồi vòng rằng các vật thể không có nguồn trong manifest là minh họa quy ước; màu, vật liệu và chi tiết thêm vào không phải phục dựng hiện vật của vụ Reles. Giữ các mô tả đã bổ sung nếu không khẳng định chúng có nguồn.

## D13 — SUA — A1-08 thêm phòng xử vào phần tử nhân vật

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:88`.

**VẤN ĐỀ GÌ:** Câu mới `as he stands in a wooden paneled courtroom` thêm cả bối cảnh phòng xử vào shot loại `figure`. Shot gốc chỉ là người giơ tay tuyên thệ. Chi tiết này làm nền dính vào nhân vật, cùng loại lỗi hậu kỳ từng được sửa tại D07; nó không cần thiết để diễn đạt hành động tuyên thệ.

**CẦN GÌ ĐỂ ĐÓNG:** Bỏ cụm mô tả phòng xử, giữ người giơ tay và trang phục. Không cần viết lại toàn bộ prompt hoặc thêm shot mới.

## Tôi đã không kiểm cái gì

- Không mở lại chín ảnh; đối chiếu ngoại hình dựa trên `shows` do Claude đã xem ảnh và ghi.
- Không kiểm chứng độc lập lịch sử, bản quyền hoặc chính sách quảng cáo trên web.
- Không chạy Flow, sinh ảnh hay xác nhận mức đồng nhất thực tế của style ngắn.
- Không chạy builder bằng Python: `Get-Command python,py` không tìm thấy lệnh trong môi trường hiện tại. Kiểm cue bằng PowerShell và đọc mã không thay thế một lần chạy builder thành công.
- Không đối chiếu từng mốc `at` với âm thanh/VTT; kết quả cue khớp duy nhất không chứng minh thời điểm đặt ảnh đúng.
- Lần đọc RUNBOOK bị cắt đầu ra. Các file vòng trước có nhiều ký tự tiếng Việt hỏng mã; đã đọc được nội dung và mã điểm nhưng không xác nhận từng chữ.
- Không tạo hoặc sửa file, không sửa `THREAD.md`.

```points
D08 | tác giả phản bác — chờ claude | image-prompts/A1.newstyle.shots.json:7 | HOI - Chấp nhận phân công; builder đã nhận style ngắn, chờ Claude xác nhận đường đính ảnh mẫu
D09 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json:85 | OK - Cue A1-08 khớp đúng một lần trong transcript
D10 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json:21 | OK - Cả 18 shot có outName riêng, không trùng nội bộ
D11 | mở | image-prompts/A1.newstyle.shots.json:154 | SUA - Đã bù chi tiết nhưng chưa ghi rõ lựa chọn minh họa không có nguồn trong manifest
D13 | mở | image-prompts/A1.newstyle.shots.json:88 | SUA - Phòng xử mới thêm làm nền dính vào phần tử nhân vật; bỏ cụm bối cảnh
```