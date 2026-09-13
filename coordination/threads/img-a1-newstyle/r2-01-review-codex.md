# r2-01-review-codex

Bản v2 chưa thể chốt. Đã sửa ba điểm D01–D03 của tôi, nhưng còn cue không duy nhất, tên đầu ra trùng nhau và khối style mới chưa đi vào prompt mà builder tạo.

## Kết quả đối chiếu manifest và ba quyết định của Tú

Đã đọc toàn bộ `image-prompts/refs/A1/manifest.json`, đối chiếu `shows`, `evidenceFor` và giới hạn của các nguồn với bản v2.

- **Style ngắn:** dòng 7 giữ đúng câu Tú yêu cầu. Tuy nhiên builder vẫn nối khối dài, và `refs` không phải ảnh được đính vào model; xem D08.
- **Mô tả chi tiết:** các shot Reles, cảnh sát và dùi đá đã có mô tả tóc, trang phục, chất liệu hoặc hình dáng từ manifest. D03 đã bỏ lớp sơn đen bóng. Tuy nhiên 11 shot bổ sung phần lớn vẫn giữ mô tả thô, chưa thực hiện yêu cầu bù chi tiết; xem D11.
- **Tái sử dụng nhân vật/vật thể:** không đề nghị thiết kế lại `useAsset` hay `produces`. Các vấn đề về tên đầu ra và ảnh neo style bên dưới không yêu cầu phục hồi cơ chế tái sử dụng.

## Đối chiếu điểm vòng trước

### D01 — OK — Đã đủ 18 shot

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:15`.

**VẤN ĐỀ GÌ:** Bản v2 có đủ A1-01 đến A1-18, gồm các hình dây ga giường và lò sưởi từng thiếu. Điều kiện về số lượng và khôi phục các phần bị bỏ đã đạt.

**CẦN GÌ ĐỂ ĐÓNG:** Không cần bổ sung cho D01; chốt đã sửa. Chất lượng phần mô tả mới được xét riêng tại D11.

### D02 — OK — Đã khôi phục cảnh sát ngủ

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:156`.

**VẤN ĐỀ GÌ:** Prompt đã đổi thành `asleep in a chair`, khôi phục chức năng minh họa lời khai của người gác.

**CẦN GÌ ĐỂ ĐÓNG:** Không cần sửa thêm; chốt đã sửa.

### D03 — OK — Đã bỏ lớp sơn đen bóng

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:41`.

**VẤN ĐỀ GÌ:** Mô tả dùi hiện dùng cán gỗ phình, cổ kim loại và thân thuôn nhọn, phù hợp `shows` của nguồn `07-ice-pick-awl-1930s-pemberton__codex.jpg`.

**CẦN GÌ ĐỂ ĐÓNG:** Không cần sửa thêm cho D03; chốt đã sửa.

## D08 — CHAN — Khối style mới không được builder sử dụng; thêm refs chưa tạo ảnh neo style

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:7`; `scripts/build_image_prompts.py:159`; `scripts/build_image_prompts.py:160`.

**VẤN ĐỀ GÌ:** Builder gọi `full_prompt(shot["draw"])`, hàm này nối hằng `STYLE_BLOCK` dài trong Python, không đọc `styleBlock` của JSON. Vì vậy bản v2 ghi style ngắn nhưng prompt đầu ra vẫn dùng style cũ.

Đồng thời, `refs` bị cố ý loại khỏi jobs; `refNames` chỉ lấy từ `useAsset`, hiện không có trong 18 shot. Thêm ảnh mugshot tại dòng 124 và 148 chưa làm model nhận ảnh tham chiếu như phản hồi D05 khẳng định. `SPEC-v2.md:399` cũng xác định ảnh tư liệu trong `refs` chỉ để người viết soi, không đưa vào model. Đây là bằng chứng mới từ đường build, khác với giả định ở review trước rằng có trường `refs` là có ảnh đính kèm.

**CẦN GÌ ĐỂ ĐÓNG:** Xác định cách đưa bản prompt này vào Flow để câu style ngắn thực sự được dùng cùng ảnh mẫu phong cách. Nếu qua builder, cần cho đường build sử dụng khối ngắn và chứng minh ảnh neo style được truyền đúng; nếu nhập thủ công, ghi rõ quy trình và ảnh mẫu sẽ đính. Không coi ảnh tư liệu trong `refs` là ảnh đã được model nhận, và không cần thiết kế lại phần tái sử dụng asset đang tạm gác.

## D09 — CHAN — Cue A1-08 khớp hai nơi trong transcript

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:78`.

**VẤN ĐỀ GÌ:** `His testimony sent` xuất hiện ở đoạn Abe Reles và đoạn Joe Barboza. Builder đếm trên toàn transcript, nên cue này không thỏa điều kiện khớp duy nhất. Việc đã bổ sung trường `cue` chưa đủ để chốt phần neo nội dung của D04.

**CẦN GÌ ĐỂ ĐÓNG:** Mở rộng cue thành trích đoạn duy nhất, chẳng hạn `His testimony sent seven senior mobsters to their deaths`, rồi kiểm lại số lần xuất hiện.

## D10 — CHAN — Tên đầu ra tự suy bị trùng giữa các shot

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:122`; `image-prompts/A1.newstyle.shots.json:146`; `image-prompts/A1.newstyle.shots.json:156`.

**VẤN ĐỀ GÌ:** Builder tự lấy năm từ đầu của `draw` khi thiếu `outName`:

- A1-01, A1-13, A1-16 cùng thành `A Man In His Early`.
- A1-12, A1-17 cùng thành `An Older 1940s New York`.

Builder hiện có kiểm tra trùng tên và sẽ báo lỗi. Đây là xung đột giữa các ảnh đầu ra độc lập, không phải yêu cầu dùng lại nhân vật.

**CẦN GÌ ĐỂ ĐÓNG:** Bảo đảm mỗi shot có tên đầu ra riêng, bằng `outName` riêng hoặc cơ chế tự đặt tên có mã shot. Không cần thêm `useAsset` hay `produces`.

## D11 — SUA — Phần bổ sung chưa được viết lại theo yêu cầu tăng chi tiết

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:34`; `image-prompts/A1.newstyle.shots.json:73`; `image-prompts/A1.newstyle.shots.json:94`; `image-prompts/A1.newstyle.shots.json:132`; `image-prompts/A1.newstyle.shots.json:166`.

**VẤN ĐỀ GÌ:** Nhiều shot vừa khôi phục vẫn gần như chép nguyên mô tả thô: nhóm người mặc vest, ghế điện trống, luật sư cầm hồ sơ, dây ga giường, bó tiền. Các câu này chưa bổ sung màu sắc, trang phục hoặc chất liệu theo yêu cầu chính của luồng. Đây không phải yêu cầu đổi gu viết: phần việc được giao mới thực hiện rõ ở nhóm shot có ảnh tư liệu.

Manifest không cung cấp chi tiết cho mọi vật thể này, nên không thể nói toàn bộ phần bổ sung đã được nguồn xác nhận.

**CẦN GÌ ĐỂ ĐÓNG:** Rà 11 shot bổ sung và thêm chi tiết thị giác phục vụ việc vẽ ở những chỗ còn chung chung. Phân biệt lựa chọn màu minh họa với đặc điểm lịch sử có nguồn; không bịa thêm ngoại hình của người thật. Không cần viết lại các shot đã đủ chi tiết.

## Tôi đã không kiểm cái gì

- Không mở lại chín ảnh tư liệu; đối chiếu bằng mô tả Claude đã xác minh trong manifest.
- Không kiểm chứng độc lập lịch sử Reles, bản quyền hay chính sách quảng cáo trên web.
- Không chạy Flow hoặc sinh ảnh; chưa xác nhận độ đồng nhất thực tế của style ngắn.
- Không chạy được lệnh `python -B scripts/build_image_prompts.py --shots image-prompts/A1.newstyle.shots.json --check` vì shell không tìm thấy `python`. Không phải bị từ chối quyền chạy. Đã đọc mã builder và dùng PowerShell chỉ đọc để kiểm số shot, số lần khớp cue và nhóm trùng năm từ đầu; đây không thay thế một lần chạy builder thành công.
- Chưa kiểm độ chính xác từng mốc `at` so với âm thanh.
- Các file vòng trước hiển thị nhiều ký tự tiếng Việt hỏng mã; đã đọc được nội dung chính và mã điểm, không xác nhận từng chữ.
- Lần đọc RUNBOOK bị cắt đầu ra; không coi là đã rà toàn bộ tài liệu.
- Không tạo hoặc sửa file, không sửa THREAD.md.

```points
D01 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json:15 | OK - Đã đủ 18 shot A1
D02 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json:156 | OK - Đã khôi phục cảnh sát ngủ trên ghế
D03 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json:41 | OK - Đã bỏ lớp sơn đen bóng không được nguồn cùng thời xác nhận
D08 | mở | image-prompts/A1.newstyle.shots.json:7 | CHAN - Builder vẫn dùng style dài và refs không tạo ảnh neo cho model
D09 | mở | image-prompts/A1.newstyle.shots.json:78 | CHAN - Cue A1-08 khớp hai nơi trong transcript
D10 | mở | image-prompts/A1.newstyle.shots.json:122 | CHAN - Tên đầu ra tự suy trùng giữa ba shot Reles và hai shot cảnh sát
D11 | mở | image-prompts/A1.newstyle.shots.json:34 | SUA - Nhiều shot bổ sung còn nguyên mô tả thô, chưa bù chi tiết theo yêu cầu
```