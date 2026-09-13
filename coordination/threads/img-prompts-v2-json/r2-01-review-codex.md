# r2-01-review-codex

Artifact: `image-prompts/SPEC-v2.md`, bản v2 của luồng hiện tại.

## Tư liệu ảnh thật A1 — tìm trong lượt này

Đã tìm trước khi đánh giá spec. Hai ảnh dưới đây đã được đọc vào bộ nhớ và mở xem, không ghi xuống đĩa.

### REF-A1-CODEX-R2-01 — Reles trong ảnh nhận dạng năm 1938

URL: https://dc.lib.jjay.cuny.edu/index.php/Detail/Object/DownloadRepresentation/representation_id/392/object_id/229/download/1/version/large  
TRANG: https://dc.lib.jjay.cuny.edu/index.php/Detail/Object/Show/object_id/229  
CHO: A1-01  
THAY GI: Ba người đứng chính diện; Reles ở giữa, đầu trần, tóc gợn sóng, mặc bộ vest hai hàng khuy; hai người bên cạnh đội mũ và mặc áo khoác dài.  
TRUY VAN: "Abe Reles" "1938" photograph John Jay

[Hồ sơ John Jay](https://dc.lib.jjay.cuny.edu/index.php/Detail/Object/Show/object_id/229) ghi ngày **4-11-1938**, ảnh nhóm Sam Bernstein, Abe Reles và Joseph Bernstein. Đường tải lấy từ HTML của chính hồ sơ, không tự dựng.

HTTP 200, `application/octet-stream`, nhưng dữ liệu là JPEG mở được, 700×733, 65.418 byte, đuôi `FFD9`. Đây là ảnh khác buổi chụp, hữu ích cho vóc người và trang phục; **vẫn là chính diện**, không phải góc nghiêng mới hay chân dung nét hơn mugshot đã có.

Lượt r1 đã ghi đầu mối hồ sơ 229 nhưng chưa kiểm bản lớn. Lượt này bổ sung URL tải và kiểm hình; không nhận là phát hiện hồ sơ lần đầu.

### REF-A1-CODEX-R2-02 — kiểm lại tư liệu dụng cụ đã có

URL: https://www.pembertonmuseum.org/wp-content/uploads/2024/10/0211055_ed.jpg  
TRANG: https://www.pembertonmuseum.org/objects/scratch-awl/  
CHO: A1-03  
THAY GI: Dụng cụ cán gỗ phình tròn, cổ kim loại, mũi nhọn thẳng; đặt trên nền đen cạnh thước và bảng số 021.10.55.  
TRUY VAN: Mở trực tiếp https://www.pembertonmuseum.org/objects/scratch-awl/ để đối chiếu nguồn đã có sau hai truy vấn mới không tìm được ảnh phù hợp hơn.

[Pemberton Museum](https://www.pembertonmuseum.org/objects/scratch-awl/) ghi niên đại khoảng **1930–1940**, gọi hiện vật là *scratch awl*, đồng thời dùng tên *ice pick*. Chỉ dùng làm căn cứ hình dáng dụng cụ cùng thời, không chứng minh loại Reles đã dùng.

Lượt này URL trả JPEG 800×533, 43.100 byte, đuôi `FFD9`, mở xem được. **Trùng ảnh 07 đã lưu**, không cần tải thêm bản riêng.

### Half Moon Hotel năm 1941 — chưa có URL ảnh trực tiếp mới

Truy vấn `"Half Moon Hotel" "1941" "November" photograph` tiếp tục trả [hồ sơ Getty 2265487109](https://www.gettyimages.be/detail/nieuwsfoto%27s/the-half-moon-hotel-in-coney-island-new-york-scene-of-abe-nieuwsfotos/2265487109?slot=22), chú thích ngày **12-11-1941**. Mở trang bằng `web.run` gặp `Cache miss`; chưa lấy được URL ảnh trực tiếp.

Giữ quyết định của Tú trong `THREAD.md`: dùng ảnh CIHP năm 1927 cho A1-11. Không mở lại D02, không đề nghị mua ảnh.

### Nhật ký truy vấn, gồm hướng trượt

| Truy vấn nguyên văn | Kết quả |
| --- | --- |
| `"ice pick" "1935" museum` | Có bằng sáng chế 1935–1938, không thu được ảnh chụp hiện vật phù hợp hơn. Không nộp bản vẽ sáng chế thành ảnh thật. |
| `"ice pick" "1930" "museum" wooden handle -pinterest -ebay -etsy -trotsky` | Kết quả lẫn vật dụng khác, danh sách đồ sưu tầm và tài liệu không cung cấp ảnh đạt yêu cầu. Không có URL ảnh mới để nộp. |
| `"Half Moon Hotel" "1941" "November" photograph` | Có Getty ngoại thất đúng ngày và ảnh điều tra bên trong; chưa lấy được URL ngoại thất trực tiếp. |
| `"Abe Reles" "1938" photograph John Jay` | Ra hồ sơ 229; đã lấy đường tải từ HTML và mở bản lớn. |

Hai liên kết ảnh John Jay/Pemberton mở qua `web.run` bị lỗi; đọc HTTP bằng Node vào bộ nhớ rồi mở xem thành công. Việc kiểm URL không cần tạo file.

## D11 — CHAN — Mục triển khai vẫn chỉ dẫn ngược với sửa đổi về tên đầu ra

**CHO NAO:** `image-prompts/SPEC-v2.md:367`, đặc biệt dòng 369–371; đối chiếu dòng 277–303.

**VAN DE GI:** Chấp nhận cách giải quyết D06: mẫu A1-13 đã có `outName` riêng, và mục 5a-bis phân biệt rõ tên đầu ra với tên reference. Tuy nhiên, **mục 6 còn nguyên chỉ dẫn đặt tên card theo `flowAssetName`**, còn đầu ra của bước build chỉ nhắc `kind` và `flowAssetName`, không nhắc truyền `outName`.

Đây là bằng chứng còn sót trong bản v2: người triển khai theo mục 6 sẽ làm ngược mục 5a-bis. A1-13 không có `produces`; `flowAssetName` tra từ `useAsset` là tên ảnh Reles gốc, không phải `Same Man Lying Face Down`. Vì vậy đặc tả vẫn có hai chỉ dẫn cho cùng một thao tác.

**CAN GI DE DONG:** Sửa riêng mục 6: bước build giữ `outName` và dữ liệu reference cần thiết; runner đặt tên bằng `shots[].outName`, chỉ dùng các `flowAssetName` đã tra làm reference. Minh họa lại hai giá trị của A1-13 là đủ. Không yêu cầu sửa hoặc chạy code ở lượt chốt spec.

## D12 — SUA — Quy tắc bắt buộc `refs` chưa khớp với cảnh dùng lại nhân vật

**CHO NAO:** `image-prompts/SPEC-v2.md:356`; đối chiếu mẫu A1-13 tại dòng 251–257.

**VAN DE GI:** Bảng trường mới quy định `refs` **bắt buộc với `character`**, nhưng A1-13 có `kind: "character"` và chỉ khai `useAsset`, không có `refs`. Parse JSON mẫu xác nhận A1-01 có `refs`, A1-13 không có.

Quan hệ dùng lại asset đã biểu diễn được, nhưng chưa có quy tắc cho biết tư liệu chân dung của shot tạo asset có được kế thừa hay không. Nếu áp dụng bảng trường nguyên văn, chính mẫu A1-13 không hợp lệ; nếu miễn theo suy đoán, người viết bộ kiểm phải tự quyết một phần hợp đồng dữ liệu.

**CAN GI DE DONG:** Chốt một quy tắc nhất quán. Có thể cho phép shot `character` dùng lại asset kế thừa tư liệu qua `useAsset → produces → refs`, còn shot tạo nhân vật phải có `refs` trực tiếp; hoặc yêu cầu mọi shot nhân vật khai `refs` và bổ sung vào mẫu. Chỉ cần sửa bảng trường và ví dụ tương ứng.

## Toi da khong kiem cai gi

- Đã đọc `THREAD.md`, bốn file vòng trước của luồng hiện tại và toàn bộ SPEC-v2; chỉ đọc bổ sung bản phản hồi tác giả của luồng lưu trữ, không rà lại toàn bộ luồng đó.
- Đã parse JSON mẫu và kiểm mâu thuẫn trường dữ liệu; chưa chuyển 385 dòng, chưa kiểm toàn bộ cue hoặc thời gian. Không dùng D04/D05 để yêu cầu làm bước sau trước khi chốt spec.
- Chưa chạy Flow, tạo ảnh hoặc đo khả năng giữ dung mạo. Chưa chạy lại thử nghiệm tên người thật và phong cách; giữ kết luận đã chốt.
- Chưa lấy được ảnh ngoại thất khách sạn đúng năm 1941; chưa đối chiếu kiến trúc 1927–1941. Không thay đổi quyết định dùng ảnh 1927.
- Chưa kiểm các file ảnh tác giả đã lưu trên đĩa hoặc quyền chèn ảnh trực tiếp vào video. Hai ảnh nộp trên chỉ được kiểm trong bộ nhớ.
- `python` và `rg` không có trong PATH; lệnh `python scripts/claims.py check` không chạy được. Đã đọc trực tiếp claim hiện tại, không tạo claim hoặc sửa file. PowerShell hiển thị tiếng Việt lỗi ở các lượt đọc đầu; đã dùng Node đọc UTF-8 cho các tài liệu review.
- Không tạo hoặc sửa bất kỳ file nào, kể cả `THREAD.md`, manifest và file vòng này.

```points
D11 | mở | image-prompts/SPEC-v2.md:369 | CHAN: mục 6 vẫn yêu cầu đặt tên card bằng flowAssetName, trái với outName đã chốt tại mục 5a-bis
D12 | mở | image-prompts/SPEC-v2.md:356 | SUA: refs bắt buộc với mọi character nhưng mẫu A1-13 thiếu refs và chưa có luật kế thừa qua useAsset
```