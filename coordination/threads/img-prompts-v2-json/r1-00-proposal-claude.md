# r1 · Bản đề xuất — SPEC v2 (luồng chạy lại từ đầu)

Artifact: `image-prompts/SPEC-v2.md`.

## ⚠️ Luồng này đã chạy một lần rồi và bị chạy lại — đọc mục này trước

Vòng đầu nằm ở `coordination/threads/_archive-img-prompts-v2-json-vong1/`
(tên bắt đầu bằng `_` nên `thread.py` bỏ qua). Ở đó đã nêu và **đóng 10 điểm**:
`assetId` khác `flowAssetName`, thiếu loại cho người đơn lẻ vô danh, `cue`
không trích nguyên văn, tư liệu chưa ghi niên đại, lặp hai chiều
`assets[]`↔`produces`, và chuyện chặn tên người thật.

**Artifact hiện tại đã mang toàn bộ các sửa đó.** Đừng nêu lại chúng — nêu lại
một điểm đã chốt mà không có chứng cứ mới là thứ luật review cấm.

**Vì sao chạy lại:** không phải vì nội dung. Tú giao "ba agent cùng đi tìm
nguồn ảnh", tôi lại viết yêu cầu đó vào file vòng của mình — chỗ mà người review
chỉ đọc như tài liệu nền. Prompt của lượt review **không có một chữ nào** về
việc tìm kiếm; nó định nghĩa công việc của lượt là "nêu điểm D**". Kết quả:
Codex phá khung và đi tìm thật, Gemini làm đúng phần việc được giao nên không
tìm gì, còn tôi — tác giả — cũng không tìm, vì lượt tác giả cũng chẳng có nghĩa
vụ đó.

Không phải lỗi năng lực: đo lại thì `search_web` của `agy` chạy tốt, 25,8 giây,
không vướng quyền gì.

Đã sửa cơ chế: `THREAD.md` có mục `## Việc mọi lượt phải làm`, và
`turn_prompt()` chèn thẳng nó vào prompt **mọi lượt, kể cả lượt tác giả**, ngang
hàng với luật review. Cùng với đó, câu cũ trong preamble *"Đừng đọc lại
AGENTS.md hay SKILL.md"* đã viết lại — Gemini từng đọc nó thành lệnh cấm đọc
file nói chung và báo cáo là *"không mở được RUNBOOK do phải tuân thủ giới hạn
đọc file"*.

---

## VIỆC MỌI LƯỢT PHẢI LÀM — phần của tác giả

Tôi tìm được **1 ảnh mới**, và quan trọng không kém, **3 hướng trượt** đã ghi
lại để không ai cày lại.

### REF-A1-CLAUDE-01 — chân dung Reles, bản nét nhất hiện có

```
URL:     https://upload.wikimedia.org/wikipedia/commons/8/81/Abe-reles.jpg
TRANG:   https://en.wikipedia.org/wiki/Abe_Reles
CHO:     A1-01
THAY GI: Chân dung nửa người, cắt sát mặt. Sóng tóc thấy rất rõ — từng lớp song
         song chạy ngang đỉnh đầu, kiểu uốn marcel. Lông mày đen rất dày, đuôi
         cong xuống. Mắt hơi xếch, mí trên nặng. Mũi to, cánh mũi rộng. Cười hé
         lộ răng. Tai lớn, lồi hẳn ra khỏi tóc. Áo tweed vân xương cá, sơ mi
         trắng, cà vạt kẻ sọc chéo.
TRUY VAN: Abe Reles photograph 1940 Murder Inc portrait archive
         → rồi lần sang trang Wikipedia đọc danh sách file ảnh
```

Đã tải, kiểm `FFD9`, toàn vẹn, 603×900.

**Nhưng phải nói rõ một điều tôi tìm hụt:** tôi đi tìm *góc thứ hai*, và cái này
**không phải góc thứ hai**. So với ảnh LOC mà Codex nộp vòng trước thì đây là
**cùng một buổi chụp** — cùng áo, cùng cà vạt, cùng nếp tóc, cùng cái cười. Giá
trị của nó là **độ nét cho khuôn mặt**, không phải góc mới. A1 vẫn chỉ có một
góc duy nhất của nhân vật này.

### Ba hướng trượt, đã ghi vào `manifest.json`

| Truy vấn | Kết quả |
| --- | --- |
| `Abe Reles photograph 1940 Murder Inc portrait archive` | ra Getty và Granger, **cả hai chặn tải** |
| `Half Moon Hotel Coney Island photograph wikimedia commons` | **Commons không có**. Ảnh nằm ở NYPL, Brooklyn Museum, Brooklyn Public Library, Coney Island History Project |
| mở trang NYPL `6faf1db0…` (Riegelmann boardwalk – Half-Moon Hotel) | **trượt** — trang dựng bằng JS, fetch về rỗng, không lấy được URL ảnh trực tiếp |
| `antique ice pick 1930s wood handle photograph museum collection` | chỉ ra eBay/Etsy/Pinterest, không có hiện vật bảo tàng có niên đại rõ |

### Còn thiếu, giao lại cho hai người review

1. **ice pick kiểu 1930-1940** — cả Codex lẫn tôi đều trượt. Gợi ý hướng chưa
   ai thử: catalog Sears/Montgomery Ward thập niên 1930 đã số hoá, hoặc kho ảnh
   của các hội sưu tầm đồ nghề nước đá.
2. **ảnh chụp thật Half Moon Hotel 1941** — thử NYPL/Brooklyn Public Library
   bằng API thay vì mở trang web (trang dựng bằng JS).
3. **góc thứ hai của Reles** — vẫn chưa có. Ảnh khám nghiệm, ảnh toà, ảnh chụp
   nghiêng đều được.

Trạng thái hiện tại của `refs/A1/`: **4 ảnh** (`__codex` 3, `__claude` 1),
**15 truy vấn đã ghi** (codex 10, claude 5).

---

## Đã quyết định gì trong spec

Không nhắc lại toàn bộ — artifact đã mang đủ. Bốn điểm xương sống:

1. **Mô tả ngoại hình, không gọi tên** — kết luận giống RUNBOOK nhưng **lý do
   khác hẳn và có số đo**: tên KHÔNG bị chặn (đo 2026-09-11, cả Abe Reles lẫn
   Winston Churchill đều tạo được), nhưng tên nổi tiếng kéo theo phong cách
   riêng của nó và thắng khối style, còn tên ít nổi tiếng thì model viết luôn
   cái tên vào ảnh và vẫn không ra đúng người.
2. **`foundBy` tách khỏi `verifiedBy`** — lượt review chạy chỉ đọc nên người nộp
   URL không tải file về kiểm được. Vòng trước 4 URL Codex nộp: 2 dùng ngay, 1
   là thumbnail 120×150 phải đổi sang bản dẫn xuất lớn, 1 trả về HTML.
3. **Sáu `kind`**, thêm `figure` cho người đơn lẻ vô danh.
4. **`cue` phải là trích nguyên văn transcript**, và `build_image_prompts.py`
   phải kiểm tự động.

## Chỗ tôi tự thấy yếu nhất

- **Chưa chuyển dòng nào sang JSON.** Đến khi chuyển thật mới biết trong 385
  dòng có bao nhiêu `cue` không trích nguyên văn được.
- **Chưa sửa dòng code nào** theo mục 6 của spec. Nên **cơ chế dùng lại asset
  nhân vật — thứ Tú yêu cầu — vẫn chưa chạy thử lần nào.**
- **Chưa tạo asset nhân vật nào** từ mô tả rút ra từ ảnh thật.

## Tôi đã không kiểm cái gì

- Không kiểm ảnh Half Moon Hotel có đúng năm 1941 không — bưu thiếp không ghi
  năm, và tôi không mở được nguồn NYPL.
- Không kiểm chữ rác với khối style v2 (đã bỏ câu cuối). Mẻ 10 ảnh cho thấy 4/8
  dính chữ, nhưng đó là style v1.
- Không kiểm bản quyền. Ảnh trong `refs/` chỉ để soi, đúng luật chốt 2026-08-15.
- Không đọc lại 21 ảnh Half Moon Hotel chụp 1991 ở NYU — Codex đã ghi là chúng
  chụp lúc toà nhà đã thành viện dưỡng lão, nên không dùng cho 1941 được.

```points
D01 | mở | image-prompts/refs/A1/manifest.json | Con thieu ice pick 1930-1940; ca codex lan claude deu truot
D02 | mở | image-prompts/refs/A1/manifest.json | Con thieu anh chup that Half Moon Hotel 1941; NYPL dung JS nen fetch rong
D03 | mở | image-prompts/refs/A1/manifest.json | Van chua co goc thu hai cua Reles — anh Commons la cung mot buoi chup voi anh LOC
D04 | mở | image-prompts/SPEC-v2.md | Chua chuyen dong nao sang JSON nen chua biet bao nhieu cue khong trich nguyen van duoc
D05 | mở | image-prompts/SPEC-v2.md | Co che dung lai asset nhan vat chua chay thu lan nao
```
