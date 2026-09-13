# r2-01 · Review Claude — đóng D17

**Thông qua.** Không còn điểm nào mở.

## D17 — chốt: đã sửa

A1-08 giờ có `refs` trỏ tới `05-reles-mugshot-1940-jjay__codex.jpg` và
`01-reles-portrait-loc__codex.jpg`. Cả bốn shot `character` đều đủ tư liệu chân
dung:

| Shot | `refs` |
| --- | --- |
| A1-01 | 4 ảnh (mugshot, chân dung LOC, Commons, toàn thân 1933) |
| A1-08 | 2 ảnh (mugshot, chân dung LOC) |
| A1-13 | 1 ảnh (mugshot) |
| A1-16 | 1 ảnh (mugshot) |

Builder: **20 shot, cue khớp hết, không lỗi nào.**

## Trạng thái sản phẩm khi đóng luồng

Artifact đạt yêu cầu về **cấu trúc**. Nói rõ nó chưa đạt cái gì, để phiên sau
không đọc chữ "thông qua" rồi tưởng đã xong:

- **Chưa sinh một tấm ảnh nào từ bản 20 shot này.** Phép thử ảnh neo
  (`output/anchor-sheet.png`) chạy trên file thí nghiệm 5 shot riêng. Style có
  giữ đều qua cả 20 shot hay không thì chưa ai đo.
- **Ảnh neo hiện tại là do model tự vẽ từ mô tả chữ của tôi** — tức phong cách
  tôi *đoán* từ project của Tú. Tú đã chốt sẽ gửi ảnh neo thật vào
  `input/style-ref/_anchors/`; khi có thì phải tạo lại asset neo và chạy lại cả
  lô, vì mọi shot đều thừa hưởng từ nó.
- **Câu hỏi chữ-trong-ảnh chưa có lời đáp.** Ảnh mẫu Tú gửi có chữ viết tay nằm
  trong hình, trong khi luật hiện hành cấm chữ và 20 shot này viết theo luật cấm.
  Nếu Tú muốn có nhãn chữ thì phải viết lại phần đó.
- Đây mới là **1 trong 32 segment**. A1 có 20 shot; còn 31 segment của hai video.

## Tôi đã không kiểm cái gì

- Không sinh ảnh, không đo độ đồng nhất style trên bản này.
- Không kiểm 20 `at` với thời gian chữ trong VTT — vòng trước ở luồng khác Codex
  bắt được hai mốc lệch 9 và 6 giây bằng cách đó, chưa ai làm lại cho 20 shot.
- Không kiểm `cue` có trỏ đúng đoạn shot định minh hoạ không; builder chỉ kiểm
  có trong transcript và khớp mấy chỗ.
- Không rà xuôi `invented` của cả 20 shot; vòng trước tôi kiểm mẫu bốn shot không
  khai.
- Không kiểm bản quyền.

```points
D17 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | A1-08 da co refs; ca bon shot character deu du tu lieu chan dung
```
