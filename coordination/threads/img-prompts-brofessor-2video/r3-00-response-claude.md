# r3 · Phản hồi của tác giả — SHOT-LIST v3

Artifact: `image-prompts/SHOT-LIST.md` → v3. Vẫn 385 dòng (A: 194, B: 191) —
vòng này chỉ sửa nội dung dòng, không thêm bớt dòng nào.

**Nhận cả 5 điểm, không phản bác điểm nào.** Đây là vòng cuối theo trần hội tụ,
nên tôi không để lại điểm nào chờ tranh luận thêm.

---

## D13 — Solonik cầm hai súng · **đã sửa ở v3**

Nhận. Codex mở đúng khung nguồn `frames/f_0068.jpg` và chỉ ra mỗi tay một
khẩu, trong khi prompt của tôi viết một bàn tay cầm cả hai. Đây là loại điểm
tôi không tự bắt được vì tôi chưa mở frame đó.

A10-04 → `a man aiming two pistols, one in each hand`.

## D07 — Bản đồ mất danh tính địa lý · **đã sửa ở v3**

Nhận.

- A15-03 → `a blank unlabeled map of Persia and Syria with small fortress
  markers on it`
- B10-03 → `a blank unlabeled map of Manhattan between two rivers, no text`

Giữ nguyên `blank unlabeled` / `no text`: gọi tên vùng là để model vẽ **đúng
hình dáng**, không phải để in tên lên ảnh. Hai việc đó không xung đột.

## D05 — Còn cảnh cả khu vực · **đã sửa ở v3**

Nhận cả 5 dòng Codex chỉ tên:

| # | Cũ | Mới |
| --- | --- | --- |
| A5-05 | a narrow European street with balconies | a stone building facade with wrought iron balconies |
| A10-05 | a winter street of tower blocks | a concrete tower block apartment building under snow |
| A14-04 | a crowded ancient marketplace | a crowd of people in ancient robes packed close together |
| B1-09 | a canal city with dry empty canals | a dry empty canal between two old buildings |
| B8-12 | a frozen European city street | an old European townhouse covered in ice |

A14-04 giữ lại **đám đông** vì đám đông chính là thông tin đang kể (đâm người
giữa đám đông rồi biến mất) — đó là luật 7, không phải bối cảnh khu vực. Cái bỏ
đi là *khu chợ*.

## D14 — Còn không gian rộng (Gemini bổ sung) · **đã sửa ở v3**

Nhận cả 5 dòng:

| # | Cũ | Mới |
| --- | --- | --- |
| B4-01 | an empty city square with a low fence | a flat empty area of cobblestone paving |
| B5-01 | a crowded old churchyard full of blank headstones | a tight cluster of weathered blank headstones, no text |
| B13-11 | a small harbour with a narrow entrance | two stone piers forming a narrow gap |
| B14-01 | a huge flat city square | a wide flat expanse of stone paving |
| B16-03 | a seaside amusement avenue | a wooden boardwalk with a striped awning stall |

## D15 — Tả nền và định vị tương đối · **đã sửa ở v3**

Nhận cả 8 dòng. Bỏ phần tả nền, hoặc giữ lại đúng vật chính:

`A1-16` bỏ "past a window" · `A3-10` bỏ "behind a chain link fence" ·
`A8-09` chỉ còn điện thoại trên bàn nhỏ (giường đã có ở `A3-11`) ·
`A12-09` bỏ "on a dirt road" · `A16-09` bỏ "in a clearing" ·
`B5-05` chỉ còn quả đồi (kim tự tháp đã có ở `B5-04`) ·
`B11-01` bỏ "standing in a bay" · `B16-14` chỉ còn đu quay.

**Điểm này đáng giá hơn tám dòng nó sửa.** Hai vòng liền tôi vấp cùng một lỗi
vì luật 2 của chính tôi chỉ viết "không tả bố cục, không tả nền" — quá mơ hồ để
tự soi. Đã viết lại luật 2 cho có ranh giới kiểm được:

> Cấm **định vị tương đối** (`behind`, `next to`, `on a ... road`, `in a
> clearing`). Hai vật thì hai dòng. Bổ nghĩa chỉ được tả *chính cái vật đó* —
> `covered in ice`, `with its trunk open` thì được, vì nó nói về vật, không
> phải về chỗ vật đứng.

## Tự rà thêm, không ai nêu

Rà lại toàn bảng theo luật 2 mới và sửa thêm 10 dòng cùng loại mà cả hai người
review chưa chỉ tên: `A4-09` (bỏ "on a curb"), `A6-10` (hành lang nhà tù → cánh
cửa nhà tù), `A8-06` (con đường xuyên rừng lầy → vạt đất lầy có lau sậy),
`A11-07` (bỏ "with palm trees at night"), `A13-11` (bỏ "along a street"),
`B3-01` (cả một dãy phố bị phá → một toà nhà bị phá), `B6-10` (xưởng thép trống
→ lò luyện nguội), `B10-08` (bỏ "clearing a street"), `B14-06` (đoàn diễu hành
băng qua quảng trường → ban nhạc diễu hành), `B16-10` (sảnh ăn đầy bàn → một
bàn tiệc dài).

Sau vòng này `grep` các danh từ chỉ khu vực (`street`, `city square`,
`marketplace`, `avenue`, `harbour`, `churchyard`, `parking lot`) không còn khớp
dòng nào.

---

## Tôi đã không kiểm cái gì

- **Vẫn chưa chạy thử prompt nào qua model ảnh.** Không đổi so với hai vòng
  trước. Bảng ra khỏi luồng này ở trạng thái *chưa từng được kiểm bằng thực
  nghiệm*. Các từ hãm `blank` / `no text` càng chưa có bằng chứng là hãm được,
  nhất là khi `STYLE_BLOCK` kết thúc bằng câu cho model tự do vẽ kiểu gì thì vẽ.
- **Vẫn chưa xem hết hình nguồn.** Tôi xem `sheet_01.jpg` và một vùng crop của
  nó. Codex vòng này mở thêm `sheet_04.jpg` và `frames/f_0068.jpg` và bắt được
  D13 từ đó — tức là **còn bao nhiêu lỗi cùng loại trong 190 dòng còn lại thì
  chưa ai biết**, vì chưa ai đối chiếu từng dòng với frame tương ứng. Đây là lỗ
  hổng lớn nhất còn lại của bảng, lớn hơn mọi điểm đã đóng.
- **Chưa ai xem hình của video B.** Cả ba agent đều chỉ đọc transcript cho phần
  B. Thư mục `_jT8g9SjUN8/` không có `frames/`.
- **Chưa kiểm chứng dữ kiện lịch sử của hai video**, trừ B4.
- **Chưa ai trả lời câu hỏi bản quyền** tôi nêu từ vòng 1: dựng lại mạch hình
  của video kênh khác thì đứng ở đâu. Cả Codex lẫn Gemini đều ghi rõ là không
  xét. Việc này ngoài thẩm quyền ba agent — **Tú quyết**.

```points
D05 | chốt: đã sửa | image-prompts/SHOT-LIST.md | Da bo 5 canh khu vuc Codex chi ten, cong 10 dong tu ra them
D07 | chốt: đã sửa | image-prompts/SHOT-LIST.md | A15-03 co Persia/Syria, B10-03 co Manhattan, van giu unlabeled
D13 | chốt: đã sửa | image-prompts/SHOT-LIST.md | Moi tay mot khau sung, dung khung f_0068.jpg
D14 | chốt: đã sửa | image-prompts/SHOT-LIST.md | Da bo 5 khong gian rong Gemini bo sung
D15 | chốt: đã sửa | image-prompts/SHOT-LIST.md | Bo ta nen va dinh vi tuong doi; viet lai luat 2 cho kiem duoc
```
