# r1-02 · Review Claude — áp ảnh neo phong cách

**Gần thông qua.** Đây là bản nộp sạch nhất của tác giả từ đầu tới giờ: builder
qua ngay từ lượt đầu, không một dòng `LOI`. Ba điểm treo từ luồng trước đều sửa
đúng, và D13 còn được xử khéo hơn mức tôi yêu cầu.

Tôi nêu một điểm mới về phân loại `kind`, và ủng hộ D15 của Codex.

## Xác minh bốn việc được giao

| Việc | Kết quả kiểm |
| --- | --- |
| Áp ảnh neo | **đủ** — `assets` đã khai, cả 19 shot còn lại đều `useAsset: ["style-anchor"]` |
| D14 — tên card | **sạch** — không tên nào chứa `reles`/`abe`/tên người thật nào khác |
| D13 — nền phòng xử | **hơn yêu cầu** — bỏ khỏi A1-08 *và* tách thành `A1-08b` kind `place`, giữ được cả hình lẫn tính tách rời |
| D11 — chi tiết tự nghĩ | 8/20 shot khai `invented`, ví dụ A1-02 tự khai `"stern and menacing expressions"` |

Builder: **20 shot, cue khớp hết, không trùng tên card nào.**

## D16 — SUA — Phân loại `kind` bị đảo ở hai chỗ, và cùng một người có hai loại

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json` — A1-08, A1-12, A1-17,
và A1-04. Đối chiếu SPEC-v2 mục 3.

**VẤN ĐỀ GÌ:** Luật định nghĩa:

- `character` = **người có thật, cần nhận ra** — bắt buộc có `refs` chân dung
- `figure` = **một người vô danh**, vai minh hoạ — chỉ cần tư liệu trang phục

Rà cả 20 shot thì thấy dùng ngược ở hai chỗ:

**1. Cùng một người, hai loại.** A1-08 là *"Man Swearing Oath"* — đoạn Reles ra
làm chứng, cùng nhân vật với A1-01, A1-13, A1-16. Nhưng A1-08 khai `figure`, ba
cái kia khai `character`. Một người không thể vừa cần nhận ra vừa vô danh.

**2. Hai viên cảnh sát khai `character`.** A1-12 và A1-17 là cảnh sát gác —
**không có danh tính nào để đi tìm chân dung**. Đó đúng là định nghĩa của
`figure`. Tệ hơn, `refs` của chúng trỏ tới
`03-nyc-policeman-1942-loc__codex.jpg`, mà manifest ghi rõ ảnh đó là bằng chứng
về *đồng phục thời kỳ*, và ghi thẳng: **"KHONG phai anh nguoi gac Reles"**. Khai
`character` là ngầm bảo tấm ảnh đó là chân dung nhân vật, đúng thứ trường
`evidenceFor` sinh ra để chặn.

**3. A1-04 là cái tai, khai `figure`.** Một bộ phận cơ thể không phải một người.
Đúng ra là `object`.

Vì sao đáng sửa chứ không phải chuyện chữ nghĩa: `kind` quyết định **luật viết
prompt nào áp vào** và **có bắt buộc chân dung hay không**. Sai loại là sai luật,
và khi chuyển sang 31 segment còn lại thì cái sai này nhân lên.

**CẦN GÌ ĐỂ ĐÓNG:**
- A1-08 → `character` (cùng người với A1-01/A1-13/A1-16)
- A1-12, A1-17 → `figure`
- A1-04 → `object`

Nếu tác giả cho rằng A1-08 không cần nhận ra mặt thì phản bác cũng hợp lệ —
nhưng khi đó A1-13 và A1-16 phải đổi theo cho nhất quán, vì cả ba đều là cùng
một người trong cùng một đoạn.

## D15 — ủng hộ Codex giữ mở

Codex đúng: `invented` mới khai 8/20, và còn sót đúng loại chi tiết dễ tưởng là
có nguồn nhất — hiện vật và cảnh tái dựng. Ví dụ A1-07 tả ghế điện *"heavy, dark
stained oak wood"*; không ảnh nào trong `refs/A1/` là ghế điện, nên toàn bộ chi
tiết đó là tự nghĩ mà chưa khai.

Không cấm tự nghĩ. Nhưng nửa khai nửa không thì còn tệ hơn không khai gì: phiên
sau đọc thấy có trường `invented` sẽ tin những chi tiết **không** nằm trong đó là
có nguồn.

## Tôi đã không kiểm cái gì

- **Chưa sinh ảnh nào từ bản này.** Phép thử ảnh neo hôm nay chạy trên 5 shot của
  file thí nghiệm riêng (`A1.anchor.shots.json`), không phải trên 20 shot này.
  Việc style có giữ đều qua cả 20 shot hay không thì **chưa ai đo**.
- **Không kiểm 20 `at`** với thời gian chữ trong VTT.
- **Không kiểm từng `cue` có trỏ đúng đoạn mà shot định minh hoạ không** —
  builder chỉ kiểm "có trong transcript" và "khớp mấy chỗ".
- **Không mở lại ảnh trong `refs/A1`**; đối chiếu với trường `shows` do chính tôi
  ghi, nên không phải kiểm độc lập.
- **Không kiểm A1-08b** (phòng xử mới thêm) có cần tư liệu không — nó là `place`
  của một địa điểm chung chung, không phải phòng xử có thật cụ thể nào.

```points
D15 | mở | image-prompts/A1.newstyle.shots.json | Ung ho Codex: invented moi 8/20, sot chi tiet hien vat nhu ghe dien A1-07
D16 | mở | image-prompts/A1.newstyle.shots.json | SUA: kind dao o hai cho — A1-08 la figure trong khi cung nguoi voi 3 shot character; hai canh sat vo danh lai khai character; A1-04 la cai tai khai figure
```
