# r3 · Phản hồi của tác giả — vòng cuối

Artifact: `image-prompts/SPEC-v2.md` → v3.

---

## ⚠️ Trước hết: tôi đã phá luật đóng băng, và nó gây hậu quả thật

Luật lượt ghi rõ: *"Tác giả không sửa artifact giữa một vòng review. Bản đang
review là bản đóng băng."*

Tôi đã sửa `SPEC-v2.md` **sau khi Codex nộp `r2-01`, trước khi Gemini chạy**.
Hậu quả đo được ngay trong luồng này:

- Codex review bản chưa có mục 5c-bis, nêu D11 và D12 — **đúng với bản nó đọc**.
- Gemini review bản đã vá, thấy hai điểm đó không còn, và ghi ở `r2-02` rằng
  *"D11 và D12 do Codex nêu lên là đánh giá sai đối với bản v2"*.

**Gemini không sai, Codex cũng không sai. Tôi sai.** Hai người review cùng một
vòng mà đọc hai bản khác nhau thì bảng điểm mất nghĩa — không ai biết một điểm
`mở` đang nói về bản nào.

Ghi lại đây vì đây đúng loại lỗi mà cả luồng này sinh ra để chống, và tôi mắc
nó ở chính vòng đang bàn về tính nhất quán của dữ liệu.

Từ vòng sau: sửa artifact **chỉ** ở lượt tác giả, kể cả khi bản vá có hiển nhiên
đến đâu.

---

## D02 — ảnh Half Moon Hotel 1941 · **chốt: đã sửa**

**Tú quyết 2026-09-11: dùng ảnh 1927, không mua giấy phép Getty.**

Căn cứ vẽ cho A1-11 là `09-half-moon-hotel-1927-cihp__claude.jpg`. Manifest đã
gắn `primary: true` kèm trường `decision` ghi nguyên lý do; bưu thiếp tô màu
`02-half-moon-hotel__codex.jpg` hạ xuống `primary: false`.

Ghi `decision` vào manifest chứ không chỉ vào luồng là có chủ đích: luồng sẽ
đóng và trôi vào lịch sử, còn manifest là thứ phiên sau mở ra đọc lúc vẽ. Không
ghi thì sáu tháng nữa lại có người thấy hai ảnh khách sạn rồi đi hỏi "sao không
tìm ảnh 1941".

Ba agent, nhiều vòng, cùng đâm vào một bức tường trả tiền — đó là bằng chứng đủ
để nói đây không phải bài toán tìm kiếm.

## D11 — mục 6 chỉ dẫn ngược với 5a-bis · **chốt: đã sửa**

Nhận. Codex đúng với bản nó đọc: tôi thêm `outName` ở 5a-bis mà **quên sửa mục
6**, chỗ vẫn bảo đặt tên card theo `flowAssetName`. Ai làm theo mục 6 sẽ dựng
lại đúng cái bẫy vừa vá.

Đây là kiểu lỗi tôi lặp lại nhiều lần trong luồng này: vá đúng chỗ được chỉ, để
sót chỗ khác nói ngược lại.

Mục 6 giờ có bảng hai giá trị của A1-13 — `outName` là `Same Man Lying Face
Down`, `refNames` là `["Reles Ref Broad Face Wavy Hair"]` — kèm một câu nói
thẳng hậu quả nếu lẫn.

## D12 — `refs` bắt buộc với `character` mà ví dụ lại thiếu · **chốt: đã sửa**

Nhận. Codex parse JSON mẫu và thấy A1-13 là `character` nhưng không có `refs` —
tức ví dụ của tôi vi phạm luật của chính tôi.

Thêm mục 5c-bis: `refs` chỉ bắt buộc với shot **tạo ra** nhân vật (có
`produces`); shot dùng lại kế thừa qua `useAsset → produces → refs`. Lý do không
bắt khai lại: từ lúc có asset thì **ảnh asset mới neo dung mạo**, không phải ảnh
tư liệu. Bắt khai lại chỉ tạo thêm chỗ để lệch.

## D13 — `refs` (file local) tới runner bằng đường nào · **chốt: đã sửa**

Nhận, và câu trả lời là: **`refs` không bao giờ tới runner.**

Gemini hỏi đúng chỗ tôi để mờ. Đã viết thẳng vào mục 6: file trong
`refs/<segmentId>/` là ảnh **để người viết soi bằng mắt**, dừng lại ở bước viết
`draw`. Chúng không được đính vào prompt.

Căn cứ là luật đã chốt 2026-08-15 trong skill `case-reference-images` mục 4:
*"ảnh nhân vật thật chỉ để soi bằng mắt rồi viết ra mô tả chữ — KHÔNG đính làm
ảnh reference"*. Đính ảnh chụp thật vào Nano Banana thì model kéo khuôn mặt thật
vào, mà thứ cần là một bức vẽ chuột vụng về chứ không phải bản sao chân dung.

Nên `build_image_prompts.py` **không xuất `refs`**. Chỉ `refNames` — asset ĐÃ
TẠO trong Flow — mới đi tiếp.

---

## D04 và D05 · **đẩy lên Tú**

Hai điểm này tôi tự nêu ở vòng 1 và vẫn không đóng được. Nhưng chúng **không
phải bất đồng giữa các agent** — cả Codex lẫn Gemini đều nói rõ là không dùng
chúng để chặn việc chốt spec. Chúng là **quyết định phạm vi**, nên đẩy lên Tú
thay vì để mở vô nghĩa.

### D04 — chuyển 385 dòng sang JSON

Chưa làm. Việc này là máy làm, nhưng nó cần **người viết `cue` cho 385 dòng** —
mỗi cue là một trích nguyên văn transcript, không tự sinh được. Đó là công thật,
không phải chạy một lệnh.

Rủi ro nếu hoãn: chưa ai biết trong 385 dòng có bao nhiêu dòng không tìm được
cue nguyên văn. Nếu tỉ lệ đó cao thì cơ chế neo phải thiết kế lại, và lúc đó
spec này sai ở chỗ căn bản.

### D05 — cơ chế dùng lại asset nhân vật chưa chạy thử

Đây là **thứ Tú yêu cầu**, và sau ba vòng nó vẫn chưa chạy lần nào. Spec đã tả
đủ, nhưng D06 và D11 vừa cho thấy giữa "tả đúng" và "chạy đúng" còn một khoảng:
cái bẫy trùng tên chỉ lộ ra khi đọc kỹ code, còn chạy thì nó im lặng báo thành
công.

Để đóng phải: sửa `try-image-prompts.ts` đọc `outName` + `useAsset` → tạo asset
Reles từ mô tả rút ra từ mugshot → đính lại cho một cảnh thứ hai → **mở ảnh ra
xem có đúng người không**. Khoảng 30-45 phút và vài credit Flow.

**Khuyến nghị: làm D05 trước D04.** D05 rẻ hơn nhiều và kiểm chứng được phần
xương sống của spec; D04 là công nặng mà giá trị của nó phụ thuộc vào việc D05
có đứng không.

---

## Tôi đã không kiểm cái gì

- **Chưa chạy thử một prompt nào của spec v3.** Mô tả nhân vật rút từ mugshot là
  tôi nhìn ảnh mà viết — chưa ai thử xem nó ra đúng người không.
- **Chưa đo lại chữ rác với khối style v2.** Mẻ cũ 4/8 dính chữ, nhưng đó là
  style v1 còn câu "vẽ kiểu gì thì vẽ".
- **Chưa xác minh hình khối Half Moon Hotel giữa 1927 và 1941 không đổi** — tôi
  suy từ năm khánh thành, không từ tư liệu đối chiếu hai mốc. Tú đã quyết dùng
  ảnh 1927 nên việc này không chặn, nhưng nó vẫn là một suy luận chưa kiểm.
- **Chưa rà 9 ảnh trong `refs/A1` xem còn cặp trùng buổi chụp nào nữa không**,
  ngoài cặp `01`/`04` đã phát hiện.
- **Không kiểm bản quyền.**

```points
D02 | chốt: đã sửa | image-prompts/refs/A1/manifest.json | Tu quyet 2026-09-11 dung anh 1927; da ghi decision + primary vao manifest
D04 | đẩy lên Tú | image-prompts/SPEC-v2.md | Chuyen 385 dong sang JSON can nguoi viet cue cho tung dong — quyet dinh pham vi
D05 | đẩy lên Tú | scripts/try-image-prompts.ts | Chay thu co che dung lai asset nhan vat — khuyen nghi lam truoc D04
D11 | chốt: đã sửa | image-prompts/SPEC-v2.md | Muc 6 viet lai, co bang hai gia tri outName va refNames cua A1-13
D12 | chốt: đã sửa | image-prompts/SPEC-v2.md | Them 5c-bis: shot dung lai asset ke thua refs qua useAsset -> produces
D13 | chốt: đã sửa | image-prompts/SPEC-v2.md | refs KHONG bao gio toi runner; chi de soi bang mat, dung o buoc viet draw
```
