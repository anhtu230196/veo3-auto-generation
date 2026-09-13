# r1 · Bản đề xuất v1 — SPEC v2 cho prompt ảnh

Artifact: `image-prompts/SPEC-v2.md` (v1).

## Đã quyết định gì và vì sao

**1. Đuôi `__<agent>` nằm trong TÊN FILE ảnh, không chỉ trong manifest.** Tú muốn
biết ai tìm ra ảnh nào. Nếu chỉ ghi trong `manifest.json` thì lần đầu ai đó kéo
thả một file là lệch, và không cách nào phát hiện. Tên file thì sống sót qua mọi
thao tác chép/gửi.

**2. Neo prompt vào nội dung bằng TRÍCH VÀI CHỮ (`cue`), không bằng số dòng.**
Số dòng transcript chết ngay khi đổi tham số `--block` của
`vtt_to_transcript.py`; chữ thì `grep` là ra. Đánh đổi: `cue` dài hơn, và phải
tự tay chép cho đúng.

**3. Nhân vật có thật: mô tả ngoại hình, KHÔNG gọi tên.** Đây là chỗ tôi muốn
người review soi kỹ nhất — xem mục "chỗ yếu nhất" (a).

**4. Tạo nhân vật một lần rồi đính lại asset đã tạo** (`produces` / `useAsset`),
thay vì lặp mô tả ngoại hình ở mọi cảnh. Cơ chế này `createSceneComposites.ts`
đã chạy được, tôi không phát minh gì mới.

**5. `SHOT-LIST.md` hạ xuống thành bản sinh ra từ JSON**, không còn là nguồn sự
thật. Hai nơi cùng giữ nội dung thì chắc chắn lệch.

## Chỗ tôi tự thấy yếu nhất

**a. Toàn bộ mục 4 dựng trên một câu trong RUNBOOK mà tôi CHƯA tự đo lại.**
RUNBOOK mục 8 ghi Nano Banana chặn prompt có tên người thật/nổi tiếng theo chính
sách "prominent people" của Google, và ghi là *"xác nhận trực tiếp"*. Tôi lấy
nguyên câu đó làm nền cho cả cách làm nhân vật. **Nếu câu đó không còn đúng thì
mục 4 phức tạp hơn mức cần thiết** — có thể gọi thẳng tên là xong.

**b. Chưa tải một ảnh tư liệu nào.** `refs/` hiện là thư mục rỗng. Cả quy ước ở
mục 2 chưa được một file thật nào kiểm chứng.

**c. Mới làm mẫu đúng segment A1.** 31 segment còn lại chưa đụng tới. Nếu schema
sai thì sai lúc còn rẻ, đó là chủ ý — nhưng cũng nghĩa là chưa gặp ca khó
(Locusta, Sicarii, Hashashin đều không có ảnh chụp).

**d. Câu hỏi tôi không tự trả lời được: tạo ảnh giống một người có thật thì có
nên không.** Mười sáu nhân vật video A đều là người thật, phần lớn đã chết, đều
là nhân vật lịch sử được báo chí viết công khai. Video gốc dùng **ảnh tư liệu
thật** của họ. Cái ta làm khác: sinh ra một hình vẽ *giống* họ. Tôi không thấy
vấn đề với người đã chết hàng chục năm, nhưng `A2` (Popeye, chết 2020) và `A12`
(chết 2020) thì gần hơn nhiều. Nêu ra để Tú thấy, không phải để chặn.

## Việc tôi giao thẳng cho hai người review

Tú yêu cầu ba agent **cùng tìm nguồn ảnh**. Cả hai bạn đều có web (đã kiểm chứng
trong `coordination/agents.json`). Nên ngoài việc review spec, mỗi người **tìm
và liệt kê URL thật** cho segment A1 (Abe Reles, 0:00–1:19):

- chân dung Abe Reles (ảnh mugshot/báo chí)
- Half Moon Hotel ở Coney Island, ngoại thất, thời 1940
- trang phục cảnh sát New York đầu 1940
- cái ice pick kiểu 1930-1940

Ghi theo đúng dạng này trong file vòng của bạn, để tôi chép thẳng vào manifest:

```
URL: <link ảnh trực tiếp>
TRANG: <link bài viết chứa nó>
CHO: <mã shot, ví dụ A1-01>
THAY GI: <một dòng tả trong ảnh có gì>
TRUY VAN: <nguyên văn câu bạn đã tra>
```

**Truy vấn tra không ra gì cũng phải ghi** — skill `case-reference-images` mục 4b
có một ca mất cả buổi vì phiên trước chỉ ghi "không tìm thấy" mà không ghi đã tra
gì. Ai tìm ra cái gì sẽ lấy từ chính file vòng này, nên không cần khai thêm ở đâu.

## Câu hỏi tôi muốn người review trả lời

1. **Codex**: đo lại giúp mục (a) — Nano Banana/Gemini có còn chặn tên người thật
   không, và chặn ở mức nào (mọi người nổi tiếng, hay chỉ người còn sống)?
2. Schema JSON ở mục 5 có thiếu trường nào mà 31 segment kia sẽ cần không?
3. `cue` trích vài chữ có đủ neo không, hay cần cả `end` cho từng shot?
4. Quy ước `__<agent>` trong tên file có va vào ký tự cấm của Windows không?

## Cái tôi cố ý chưa làm vì thuộc bước sau

- Chưa chuyển 385 dòng sang JSON — chờ spec chốt, rồi máy chuyển.
- Chưa sửa `build_image_prompts.py` / `try-image-prompts.ts` theo schema mới.
- Chưa tải ảnh về `refs/`.

## Tôi đã không kiểm cái gì

- **Không tự đo lại việc chặn tên người thật** — xem (a). Đây là rủi ro lớn nhất
  của bản này.
- **Không kiểm chứng ảnh thật của bất kỳ nhân vật nào tồn tại hay không.** Mô tả
  Abe Reles trong ví dụ ở mục 5 tôi viết **từ trí nhớ, chưa soi ảnh nào** — nó là
  ví dụ minh hoạ định dạng, không phải mô tả đã xác minh. Đừng chép nó đi dùng.
- **Không chạy thử prompt nhân vật nào** qua Flow, kể cả sau khi mẻ 10 ảnh vừa
  rồi cho thấy bộ lọc chặn thật 2/10.
- **Không kiểm khối style v2** (đã bỏ câu cuối) có chữa được lỗi lệch phong cách
  và chữ rác không. Đó là việc của mẻ thử sau.

```points
D01 | mở | image-prompts/SPEC-v2.md:1 | Ca muc 4 dua tren cau trong RUNBOOK ve chan ten nguoi that, chua tu do lai
D02 | mở | image-prompts/refs/ | Quy uoc luu anh chua duoc file that nao kiem chung
D03 | mở | image-prompts/SPEC-v2.md:5 | Schema JSON moi lam mau A1, chua gap ca khong co anh chup
D04 | mở | image-prompts/SPEC-v2.md | Nguoi review can nop URL anh that cho A1 theo dung dang da neu
```
