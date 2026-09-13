# r1-02 · Review Claude — A1.newstyle.shots.json v1

**Chưa thông qua.** Nội dung mô tả tốt hơn hẳn bản cũ và không có chỗ nào bịa —
tôi kiểm từng câu với `refs/A1/manifest.json`, phần ngoại hình khớp đúng trường
`shows`. Nhưng **file không chạy qua được pipeline**, và câu style ở dòng 2 đang
trỏ vào thứ không tồn tại ở hai shot.

Bốn điểm dưới đây **không trùng điểm nào của Codex** — D01/D02/D03 của nó tôi
đọc rồi và đồng ý cả ba, không nhắc lại.

## Việc mọi lượt phải làm — phần của người review

Đã đọc `refs/A1/manifest.json` và đối chiếu ngược: mọi chi tiết ngoại hình trong
bản v1 đều truy được về trường `shows` của một ảnh cụ thể. **Không có chi tiết
nào bịa ra.** Đây là điểm mạnh thật của bản này và tôi muốn ghi rõ trước khi nêu
lỗi, vì vòng trước Gemini từng dựng URL không có thật.

Ngoại lệ duy nhất là lớp sơn đen bóng ở A1-03 — Codex đã nêu ở D03, tôi không
nêu lại.

## D04 — CHAN — File không chạy qua builder, và mất luôn cơ chế neo nội dung

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:1-6` (cấp cao nhất), và mọi
phần tử trong `segments[0].shots`.

**VẤN ĐỀ GÌ:** Chạy thật thì crash ngay:

```
$ python scripts/build_image_prompts.py --shots image-prompts/A1.newstyle.shots.json --check
KeyError: 'video'
```

Bản v1 bỏ mất, so với `image-prompts/nRiezhIOHH0.shots.json`:

| Cấp | Trường bị bỏ | Hậu quả |
| --- | --- | --- |
| cấp cao | `video` | builder không biết transcript ở đâu để đối chiếu cue |
| cấp cao | `assets` | không tra được `useAsset` → `flowAssetName` |
| mỗi shot | `cue` | **mất toàn bộ cơ chế neo prompt vào đoạn nội dung** |
| mỗi shot | `at` | không biết hình này đặt ở giây nào |
| mỗi shot | `outName` | mất lớp chặn bẫy trùng tên ở SPEC-v2 mục 5a-bis |

Tôi đoán một phần do chính lời giao của tôi: mục "việc mọi lượt phải làm" bảo
*"phần dùng lại nhân vật/vật thể thì TẠM GÁC"*, và bản v1 gác luôn cả `outName`
với `produces`. **Phần đó tôi nhận là do tôi viết mơ hồ.**

Nhưng `cue` và `at` thì không dính gì tới việc dùng lại asset. `cue` chính là thứ
Tú yêu cầu khi nói *"viết prompt tạo ảnh theo dạng json để biết prompt đó đang
dùng cho đoạn nội dung nào"* — bỏ nó đi là bỏ mất chính lý do file này ở dạng
JSON thay vì một danh sách phẳng.

**CẦN GÌ ĐỂ ĐÓNG:** Thêm lại `video` (trỏ transcript), và cho mỗi shot hai
trường `cue` + `at`. `cue` phải là **trích nguyên văn** transcript, khớp đúng một
chỗ — builder kiểm tự động, chép sai là nó báo lỗi. Phần `assets`/`outName`/
`produces` thì đúng là đang gác, không cần thêm ở lượt này.

Ngoài ra `kind: "background"` ở A1-11 không nằm trong sáu loại của SPEC-v2 mục 3
(`object`, `place`, `figure`, `group`, `symbol`, `character`). Đúng ra là `place`.

## D05 — CHAN — Câu style trỏ vào ảnh reference mà hai shot lại không có ảnh nào

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:2`, đối chiếu A1-13 và A1-16.

**VẤN ĐỀ GÌ:** `styleBlock` là `"with the same style with reference images"`.
Nhưng trong bảy shot:

| Có `refs` | Không có `refs` |
| --- | --- |
| A1-01, A1-03, A1-11, A1-12, A1-17 | **A1-13, A1-16** |

Với hai shot đó, prompt nói *"cùng style với các ảnh reference"* trong khi
**không có ảnh reference nào được đính**. Câu đó trỏ vào khoảng không, và model
không có gì để bám ngoài chữ.

Đây là điểm tôi nghĩ dính thẳng vào chuyện Tú nêu — *"ảnh tạo đang không đồng
nhất style"*. Ghi rõ mức chắc chắn: trong mẻ tôi chạy hôm qua
(`output/asset-reuse-sheet.png`), **đúng hai mã A1-13 và A1-16 là hai cảnh lệch
style**. Nhưng mẻ đó dùng khối style DÀI và CÓ đính asset, nên nó **không chứng
minh** được cùng một nguyên nhân. Nó chỉ đủ để nói: hai shot này là chỗ yếu đã
lộ ra một lần rồi.

**CẦN GÌ ĐỂ ĐÓNG:** Chọn một trong hai, và ghi rõ đã chọn cái nào:

1. Cho A1-13 và A1-16 một `refs` — ảnh chân dung Reles đã có sẵn trong thư mục,
   dùng làm neo phong cách lẫn ngoại hình.
2. Hoặc đổi `styleBlock` thành câu không phụ thuộc ảnh, và chấp nhận hai shot
   này có thể lệch.

Đừng để nguyên trạng thái hiện tại: một câu lệnh trỏ vào thứ không có.

## D06 — SUA — Lớp chặn chữ biến mất hoàn toàn, và phù hiệu là chỗ kích hoạt

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json`, A1-12 và A1-17 — cả hai đều
có `a round badge near the front`.

**VẤN ĐỀ GÌ:** Không một prompt nào trong bản v1 có `no text`, `blank` hay
`unlabeled`.

Lý do luật đó tồn tại là bằng chứng đo được: mẻ 10 ảnh ngày 2026-09-11 có **4/8
ảnh dính chữ rác** — `FOLDER`, `DRAWN BY MOUSE '94`, `DR_CLIPBOARD.BMP`,
`MEN_1930s.BMP` — dù prompt không hề nhắc tới chữ.

Nói rõ giới hạn: mẻ đó dùng khối style DÀI, và chính khối đó ("old computer
painting program") nhiều khả năng là nguồn sinh chữ. **Chưa ai đo chữ rác với
khối style ngắn**, nên chưa chắc rủi ro còn nguyên. Nhưng phù hiệu tròn trên mũ
cảnh sát là thứ model rất hay điền chữ vào, và giá của việc thêm hai chữ
`no text` bằng không.

**CẦN GÌ ĐỂ ĐÓNG:** Thêm `no text` vào A1-12 và A1-17. Rà thêm các shot khác có
vật mang chữ. Hoặc nếu tác giả muốn chờ đo thật rồi mới quyết thì nói rõ như vậy
— đó cũng là câu trả lời hợp lệ, miễn là có người đo.

## D07 — SUA — A1-13 nhét nền vào prompt

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json:50`.

**VẤN ĐỀ GÌ:** `A man in his early thirties lying face down **on a roof**`.

Luật phần tử rời cấm đúng chuyện này: hậu kỳ mất quyền ghép nếu cái mái nhà đã
bị vẽ dính vào người. Ba shot khác trong cùng file làm đúng — A1-12 chỉ tả người
gác, không tả cái cửa; A1-16 chỉ tả người rơi, không tả toà nhà.

**CẦN GÌ ĐỂ ĐÓNG:** Bỏ `on a roof`. Nếu cần cái mái thì tách thành shot riêng.

## Một cái giá đã biết, KHÔNG phải điểm đòi sửa

Mô tả nhân vật giờ lặp gần nguyên văn ở ba chỗ: A1-01, A1-13, A1-16. Sửa một chỗ
mà quên hai chỗ kia là nhân vật lệch nhau.

Tôi **không** nêu đây thành điểm, vì nó là hệ quả trực tiếp của quyết định gác
phần dùng lại asset — mà đó là Tú chốt, không phải lỗi của tác giả. Ghi lại để
khi Tú quay lại phần đó thì biết cái giá đang trả là gì.

## Tôi đã không kiểm cái gì

- **Không chạy Flow, không sinh ảnh nào từ bản v1.** Mọi nhận định về chữ rác và
  về độ đồng nhất style đều là suy từ mẻ trước với khối style KHÁC. D05 và D06
  đều chưa có phép đo cho khối style ngắn.
- **Không mở lại 9 ảnh trong `refs/A1`** ở lượt này; tôi đối chiếu với trường
  `shows` trong manifest — vốn do chính tôi ghi khi mở ảnh, nên đây không phải
  một lần kiểm độc lập.
- **Không đối chiếu cue với transcript** vì bản v1 không có cue nào để đối chiếu.
- **Không kiểm 11 shot còn thiếu** mà Codex nêu ở D01 — tôi nhận điểm đó của nó,
  không tự rà lại.
- Không kiểm bản quyền.

```points
D04 | mở | image-prompts/A1.newstyle.shots.json:1 | CHAN: builder crash KeyError video; mat cue/at/outName nen het neo duoc vao doan noi dung
D05 | mở | image-prompts/A1.newstyle.shots.json:2 | CHAN: styleBlock tro vao anh reference nhung A1-13 va A1-16 khong co refs nao
D06 | mở | image-prompts/A1.newstyle.shots.json | SUA: khong con mot chu no text nao; phu hieu tron o A1-12/A1-17 la cho kich hoat
D07 | mở | image-prompts/A1.newstyle.shots.json:50 | SUA: A1-13 nhet nen "on a roof" vao prompt, hau ky mat quyen ghep
```
