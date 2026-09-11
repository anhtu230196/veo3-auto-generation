# r1 · Bản đề xuất v1 — danh sách ảnh cho 2 video Brofessor Stein

Artifact: `image-prompts/SHOT-LIST.md` (v1) · 376 dòng (A: 190, B: 186).
Công cụ nối khối style: `scripts/build_image_prompts.py`.

## Đã quyết định gì và vì sao

**1. Một dòng = một phần tử rời, không phải một cảnh.** Tú nói rõ "chỉ cần tạo
ảnh cần đưa vào màn hình thôi vì tôi sẽ hậu kỳ sau" và ví dụ đưa ra là mức
`cat, dog, skirt, character, car`. Tôi soi `sheets/sheet_01.jpg` của
`nRiezhIOHH0` để xác nhận: video gốc đúng là ghép từ phần tử rời trên nền
phẳng — toà nhà, cuộn ga trải giường, chiếc máy bay, viên cảnh sát — cộng nhãn
chữ và mũi tên đặt ở hậu kỳ. Nên prompt tả **một vật**, không tả bố cục.

**2. Khối style không nằm trong SHOT-LIST.md, mà nằm trong script.** Nếu gõ nó
vào từng dòng thì 376 dòng có 376 bản sao, sửa một chữ là sửa cả lô, và bảng
không còn đọc được bằng mắt lúc review. `build_image_prompts.py` đọc cột
`vẽ gì` và nối `STYLE_BLOCK` vào cuối. Xuất hai định dạng: `.prompts.txt`
(dán từng cái) và `.prompts.tsv` (đổ vào bảng hoặc công cụ chạy lô).

**3. Mật độ một ảnh mỗi 5–8 giây.** Không phải tôi bịa: `nRiezhIOHH0` dài 16
phút và thư mục `frames/` cắt ra 123 khung ở mức 8 giây, mà riêng trong
`sheet_01` đã đếm được khoảng 14–16 hình khác nhau cho 79 giây đầu. Tôi chọn
mức 5–8s, ra 190 ảnh cho video A.

**4. Không cho model vẽ chân dung người thật.** Video gốc **dán ảnh tư liệu
thật** cho Reles, Escobar, Kuklinski, Popeye và chỉ vẽ minh hoạ cho phần diễn
lại. Tôi giữ nguyên cách chia đó: cột `vẽ gì` luôn là người chung chung
("a heavyset man in a leather jacket and gold chain"), không phải chân dung
nhận ra được ai. Ảnh tư liệu thật thì Tú dán ở hậu kỳ như video gốc.

**5. Không viết chữ vào ảnh.** Tên, ngày tháng, số đo ("42 feet", "Half Moon
Hotel") trong video gốc đều là chữ đặt ở hậu kỳ. Model vẽ chữ sai chính tả, và
khối style này ép "pixel-by-pixel, ridiculously bad" thì càng sai.

## Chỗ tôi tự thấy yếu nhất

**a. Chưa chạy thử một prompt nào qua model ảnh.** Đây là lỗ hổng lớn nhất của
bản v1. Cả 376 dòng đều là giả định rằng "danh từ ngắn + khối style" ra được
thứ dùng được. Chưa ai kiểm.

**b. Tên riêng trong video B bị phụ đề tự động làm méo, tôi tự sửa lại.**
Transcript máy cho ra `Atlantanropa`, `Hamman Zurgal`, `Gmania`, `Albatpa`,
`Bearing Straight`, `Taten's tower`, `senotap`, `Bodisoft`, `Tenno Tidlan`.
Tôi đặt tên mục theo dạng tôi tin là đúng (Atlantropa, Germania, Bering
Strait, Tatlin, cenotaph...). **Đây là chỗ tôi có thể sai và người review nên
soi trước tiên** — sai tên mục thì sai cả cách hiểu đoạn đó.

**c. Mốc thời gian có sai số ±3 giây.** Transcript gộp khối 15 giây
(`vtt_to_transcript.py --block 15`), nên mốc trong bảng là nội suy chứ không
phải cắt chính xác.

**d. Mật độ có thể quá dày.** 376 ảnh là một lô lớn. Nếu Tú chỉ định làm thử
một đoạn trước thì con số này là gánh nặng vô ích.

## Câu hỏi tôi muốn người review trả lời

1. Tên 16 mục của video B (B1–B16) có đúng không? Xem mục (b).
2. Có dòng nào tả **cảnh** thay vì tả **vật** không? Tức là hậu kỳ không tách
   nền ghép lại được, mà bị buộc vào một bố cục sẵn.
3. Có dòng nào buộc model phải vẽ chữ mới ra nghĩa không?
4. Có phần tử nào trong video gốc mà tôi bỏ sót ở mức làm hỏng mạch kể không?
5. Mật độ: giữ 5–8s, hay giãn ra?

## Cái tôi cố ý chưa làm vì thuộc bước sau

- **Chưa sinh ảnh.** Bước này chỉ ra danh sách và prompt.
- **Chưa xếp thứ tự dựng phim, chưa canh khớp từng giây.** Đó là việc hậu kỳ
  của Tú, và Tú đã nói rõ là sẽ tự làm.
- **Chưa đụng vào `src/nanoBanana/styleDNA.ts`.** Khối style của việc này là
  kiểu "vẽ cố tình xấu bằng chuột", khác hẳn style Brofessor Stein đang dùng
  cho pipeline Nano Banana. Hai thứ không liên quan, tôi không trộn.
- **Chưa quyết bỏ hay giữ asset cũ đã lệch phong cách** (RUNBOOK mục 0) — việc
  khác, không thuộc luồng này.

## Tôi đã không kiểm cái gì

- **Không xem video.** Tôi chỉ đọc transcript và nhìn `sheets/sheet_01.jpg`.
  Mười một contact sheet còn lại của `nRiezhIOHH0` và toàn bộ frame của
  `_jT8g9SjUN8` tôi chưa mở. Nên kết luận "video gốc ghép từ phần tử rời" là
  dựa trên một sheet, không phải toàn bộ.
- **Không kiểm chứng dữ kiện lịch sử trong hai video.** Nếu video gốc nói sai
  thì bảng của tôi chép cái sai đó sang.
- **Không chạy thử model ảnh** — xem mục (a).
- **Không kiểm bản quyền.** Đây là danh sách "vẽ cái gì" dựng lại từ nội dung
  video của kênh khác. Tôi chưa xét việc dựng lại mạch hình của một video có
  sẵn thì đứng ở đâu về mặt bản quyền, và đó là câu hỏi thật.

```points
D01 | mở | image-prompts/SHOT-LIST.md:B1-B16 | Ten 16 muc video B do toi tu sua tu phu de bi meo, can nguoi khac xac minh
D02 | mở | image-prompts/SHOT-LIST.md | Chua chay thu prompt nao qua model anh — ca 376 dong deu la gia dinh
D03 | mở | image-prompts/SHOT-LIST.md | Mat do 5-8s (376 anh) can chot: giu hay gian ra
```
