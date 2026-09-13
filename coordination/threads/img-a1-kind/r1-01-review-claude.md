# r1-01 · Review Claude — sửa `kind` và `invented`

Builder qua sạch, 20 shot, cue khớp hết. Cả hai việc được giao đều làm đúng.

Nhưng **chính yêu cầu của tôi ở D16 đẻ ra một lỗ mới** — xem D17.

## D16 — chốt: đã sửa

Kiểm cả bốn chỗ:

| Shot | Yêu cầu | Kết quả |
| --- | --- | --- |
| A1-08 | `figure` → `character` | **đúng** |
| A1-12 | `character` → `figure` | **đúng** |
| A1-17 | `character` → `figure` | **đúng** |
| A1-04 | `figure` → `object` | **đúng** |

## D15 — chốt: đã sửa

`invented` từ 8/20 lên **16/20**. Tôi kiểm bốn shot **không** khai `invented`, vì
đó mới là chỗ có thể sót:

| Shot | Vì sao không có `invented` là ĐÚNG |
| --- | --- |
| A1-01 | mô tả truy được về `shows` của ảnh 01/05 (mugshot + chân dung) |
| A1-03 | *"cán gỗ phình ở dưới, thót lại về phía cổ, cổ kim loại ngắn"* — khớp `shows` của ảnh 07 |
| A1-11 | hình khối toà nhà truy về `shows` của ảnh 09 |
| A1-12 | *"tunic sẫm màu, tay áo rộng, mũ kết lưỡi trai, phù hiệu tròn"* — khớp `shows` của ảnh 03 |

Bốn cái không khai là **đúng bốn cái có tư liệu thật đỡ toàn bộ mô tả**. Đó là
một mẫu mạch lạc, không phải sót. Ghi rõ vì nếu chỉ nhìn con số 16/20 thì dễ
tưởng còn thiếu.

Codex nêu ví dụ A1-07 (ghế điện *"dark stained oak"*) — giờ đã nằm trong
`invented`.

## D17 — SUA — A1-08 là `character` nhưng không có `refs`. Lỗi do tôi.

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json`, A1-08.

**VẤN ĐỀ GÌ:** SPEC-v2 mục 3 ghi `character` **bắt buộc có `refs` chân dung**.
Mục 5c-bis cho miễn nếu shot kế thừa qua `useAsset → produces → refs`.

A1-08 giờ là `character`, nhưng:

- không có `refs`
- `useAsset` chỉ có `style-anchor` — đó là asset **phong cách**, không phải asset
  nhân vật, và nó không có `refs` chân dung nào để kế thừa

Nên A1-08 vi phạm luật. Ba shot cùng nhân vật (A1-01, A1-13, A1-16) đều có `refs`
trỏ tới ảnh Reles; riêng nó không.

**Đây là hậu quả trực tiếp của yêu cầu tôi đặt ở D16.** Tôi bảo đổi A1-08 sang
`character` mà không nói rằng đổi loại thì kéo theo nghĩa vụ `refs`. Tác giả làm
đúng chữ tôi viết.

Đây là lần thứ ba trong chuỗi này một bản vá của tôi đẻ ra điểm mới: D06 → D12,
D12 → D14, giờ D16 → D17. Mẫu đã rõ: tôi hay nói *phải đổi thành gì* mà quên
*đổi rồi thì kéo theo gì*.

**CẦN GÌ ĐỂ ĐÓNG:** thêm vào A1-08 mảng `refs` giống A1-01 — trỏ tới
`05-reles-mugshot-1940-jjay__codex.jpg` và `01-reles-portrait-loc__codex.jpg`.
Không đổi `kind`, không đổi gì khác.

## Tôi đã không kiểm cái gì

- **Chưa sinh ảnh nào từ bản 20 shot này.** Phép thử ảnh neo chạy trên file thí
  nghiệm 5 shot riêng, nên **chưa ai biết style có giữ đều qua cả 20 shot không**.
- **Chưa dùng ảnh neo THẬT của Tú.** Ảnh neo hiện tại là do tôi tả bằng chữ và
  model tự vẽ — tức phong cách tôi đoán, không phải phong cách Tú muốn. Tú đã
  chốt sẽ gửi ảnh thật (`input/style-ref/_anchors/`), khi có thì phải chạy lại.
- **Không kiểm 20 `at`** với thời gian chữ trong VTT.
- **Không kiểm `cue` có trỏ đúng đoạn mà shot định minh hoạ không** — builder chỉ
  kiểm có trong transcript và khớp mấy chỗ.
- **Không đối chiếu lại `invented` của 16 shot kia từng dòng một** — tôi kiểm mẫu
  bốn shot không khai, không rà xuôi toàn bộ.

```points
D15 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | 16/20 khai invented; bon shot khong khai dung la bon shot co tu lieu do toan bo mo ta
D16 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Ca bon kind da dung: A1-08 character, A1-12/A1-17 figure, A1-04 object
D17 | mở | image-prompts/A1.newstyle.shots.json | SUA: A1-08 thanh character nhung khong co refs — he qua truc tiep cua chinh yeu cau D16 cua Claude
```
