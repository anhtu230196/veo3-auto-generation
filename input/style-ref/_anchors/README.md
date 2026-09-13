# Ảnh neo phong cách do Tú cung cấp

Tú chốt 2026-09-12: **Tú gửi ảnh reference vào đây**, thay vì để agent tự sinh ảnh
neo bằng mô tả chữ.

## Ba ảnh Tú gửi 2026-09-12 — DÙNG CHUNG CHO MỌI PROJECT

Tú gửi kèm câu *"đây là những ảnh reference, mỗi project hãy tải lên"* — tức ba
ảnh này là neo PHONG CÁCH của cả kênh, không phải tư liệu riêng của một case. Mỗi
project Flow mới thì upload lại đúng ba file này (asset trong Flow không dùng
chung được giữa các project).

| File | Neo cho loại nội dung nào |
| --- | --- |
| `01-pyramid-place.png` | `place` / `object` — công trình, vật lớn trên nền phẳng |
| `02-doctor-figure.png` | `figure` / `character` — một người, nửa người, có đạo cụ trong tay |
| `03-five-men-group.png` | `group` — nhiều người xếp hàng, toàn thân |

Ba ảnh phủ đúng ba nhóm `kind` của `image-prompts/SPEC-v2.md` mục 3, nên đính cả
ba vào mọi shot: shot loại nào cũng có một ảnh neo cùng loại bố cục để bắt chước.

Phong cách của ba ảnh: **nét viền mực đen dày không đều, tô màu phẳng bên trong,
phần tối gạch chì/sáp thấy rõ nét, nền trắng trơn, mặt đơn giản (mắt là hai vệt,
không có bóng đổ trên da)**. Ghi lại bằng chữ chỉ để phiên sau biết mình đang xem
cái gì — **khối style gửi cho Flow KHÔNG tả lại mấy câu này**, xem mục dưới.

`02-doctor-figure.png` là bản PNG gốc Tú để ở `Desktop/ref1.png` (1024×1536); hai
file kia trích từ ảnh Tú gửi trong chat (webp → png, giữ nguyên kích cỡ 1536×1024).

## Vì sao ảnh Tú gửi TỐT HƠN ảnh agent tự sinh

Ảnh neo tự sinh phải mô tả phong cách bằng chữ, mà chữ thì không tả nổi nét vẽ.
Ảnh thật thì neo trực tiếp. Đo ngày 2026-09-12 (`output/anchor-sheet.png`): ảnh
neo tự sinh đã cho ra 5 ảnh cùng một chất nét — nhưng đó là phong cách do *tôi*
đoán từ project của Tú, không phải phong cách Tú thật sự muốn. Mẻ
`output/reles-a1-sheet.png` (10 ảnh, cùng ngày) cho thấy rõ khoảng lệch: tất cả
ra **tranh chì tả thực chi tiết**, không dính gì tới ba ảnh trên.

👉 Vì ảnh đã neo phong cách, **khối style bằng chữ phải NGẮN**, chỉ trỏ về ảnh:

```
Draw this in exactly the same drawing style as the reference images, on a plain white background.
```

Tả lại nét vẽ bằng chữ trong khi đã có ảnh là cho model hai nguồn chỉ dẫn có thể
chỏi nhau — và chữ thì mô tả kém hơn.

## Đường đi trong code

- `scripts/run-shots.ts --anchors <thư mục>` (mặc định chính thư mục này, `none`
  để tắt): đọc mọi file ảnh trong thư mục, sắp theo tên, **đính vào trước**
  `refNames` của từng shot.
- `attachReferences` (`src/veo3bot/imageAsset.ts`) phân loại từng phần tử bằng
  `fs.existsSync`: đường dẫn file có thật → upload (`attachReferenceImage`), còn
  lại → tên asset đã có trong Flow (`attachExistingAssets`). Nhờ vậy một shot
  đính được CẢ ảnh neo trên đĩa LẪN asset nhân vật đã tạo.
- Upload chỉ xảy ra ở shot ĐẦU mẻ: từ shot thứ hai `attachReferenceImage` tra
  thấy file đã có trong project và dùng lại.

Thứ tự quy ước: **ảnh neo trước, asset nội dung (nhân vật) sau**. Chưa đo được
ảnh nào thắng khi đính nhiều ảnh — nếu sau này thấy nhân vật bị ảnh neo lấn dung
mạo thì đây là chỗ đầu tiên để thử đảo.

⚠️ Luật "không đính ảnh chụp thật của người có thật" (skill `case-reference-images`
mục 4) **không áp vào đây**: ảnh neo là tranh vẽ, không phải ảnh chụp người thật.

## Nếu Tú gửi ảnh riêng cho một case

Thì mới cần thư mục con, một thư mục cho mỗi project, và chạy `--anchors` trỏ vào
đó:

```
input/style-ref/_anchors/
  <ten-project>/
    01-<mo-ta-ngan>.png
```

Một case = một project Flow (luật cũ, không đổi).
