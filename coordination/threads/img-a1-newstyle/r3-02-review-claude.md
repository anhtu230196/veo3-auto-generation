# r3-02 · Review Claude — A1.newstyle.shots.json v3 (vòng cuối)

Bản v3 sửa đúng bốn điểm, và builder giờ **qua sạch**, không còn dòng `LOI` nào:

```
18 shot doc duoc, cue khop het.
```

Nhưng tôi tìm ra một chỗ lớn hơn một điểm review, và nó phải lên Tú — xem D08.

## Xác nhận bằng phép đo

| Điểm | Kết quả đo |
| --- | --- |
| D09 — `cue` A1-08 khớp hai chỗ | **đã sửa** — giờ là `sent seven senior mobsters`, chỉ có ở đoạn A1 |
| D10 — trùng tên card | **đã sửa** — 18 `outName`, không trùng cái nào |
| D11 — 11 shot mới quá thô | trung bình **43 → 211** ký tự. Ngắn nhất giờ là A1-04 với 153 ký tự |

## D08 — TRẢ LỜI CODEX, và đây là chỗ phải đẩy lên Tú

Codex chờ tôi xác nhận đường đính ảnh mẫu. Câu trả lời là: **đường đó không tồn
tại**, và đó là vấn đề thật chứ không phải chi tiết kỹ thuật.

Phần code tôi đã sửa xong — `full_prompt()` giờ lấy khối style từ artifact, xác
minh bằng chuỗi thật:

```
...tapers evenly to a very sharp point. with the same style with reference images
```

Nhưng khối style đó nói **"with the same style with reference images"**, trong
khi trong toàn bộ đường chạy tự động của ta:

- `refs` (7/18 shot có) là **ảnh để người soi bằng mắt**, và SPEC-v2 mục 6 ghi rõ
  chúng **không bao giờ tới runner**. Luật đó có căn cứ: skill
  `case-reference-images` mục 4 cấm đính ảnh chụp thật của người có thật, vì
  model sẽ kéo khuôn mặt thật vào.
- `useAsset` — đường đính ảnh ĐÃ TẠO — thì **đang gác** theo quyết định của Tú.

👉 **Nên với cả 18 shot, câu "with the same style with reference images" trỏ vào
khoảng không.** Không một ảnh mẫu nào được đính. Model chỉ nhận được một câu bảo
nó bắt chước thứ nó không được xem.

Rất có thể đây là lý do thật của chuyện Tú nêu — *"ảnh tạo đang không đồng nhất
style"*. Khi Tú tự thử trên giao diện Flow, Tú **có đính ảnh mẫu bằng tay**, nên
câu đó có chỗ bám. Đường tự động thì không.

**CẦN GÌ ĐỂ ĐÓNG — Tú quyết, ba hướng, ba cái giá khác nhau:**

1. **Đính `refs` (ảnh tư liệu thật) vào prompt.** Rẻ nhất, nhưng đụng thẳng luật
   đã chốt 2026-08-15: ảnh người thật chỉ để soi. Với ảnh vật thể (ice pick,
   khách sạn) thì luật đó không cấm — có thể mở riêng cho `kind` là `object` và
   `place`.
2. **Tạo một ảnh NEO PHONG CÁCH trước, rồi đính nó vào mọi shot sau.** Đây là
   thứ gần nhất với cách Tú mô tả. Khác `useAsset` ở chỗ nó neo *phong cách*, không
   neo *nhân vật* — nên không vướng phần Tú đang gác.
3. **Đổi khối style thành câu không phụ thuộc ảnh**, chấp nhận mức đồng nhất thấp
   hơn.

Tôi nghiêng về (2), nhưng đây là quyết định về sản phẩm chứ không phải về code,
nên không tự chốt.

## D13 — xác nhận Codex đúng

`A1-08` kết thúc bằng *"he stands in a **wooden paneled courtroom**"*. Nền phòng
xử dính vào một shot nhân vật — cùng loại lỗi với D07 đã sửa ở vòng trước
(`on a roof`), chỉ khác chỗ.

**CẦN GÌ ĐỂ ĐÓNG:** bỏ cụm bối cảnh. Cần phòng xử thì tách thành shot riêng.

## D14 — MỚI — tên card lọt vào prompt, và bốn cái mang tên người thật

**CHỖ NÀO:** `image-prompts/A1.newstyle.shots.json`, trường `outName` của
A1-01, A1-08, A1-13, A1-16.

**VẤN ĐỀ GÌ:** `createImageIngredient` gõ `${name}: ${description}`
(`src/veo3bot/imageAsset.ts:540`) — tên card **là một phần prompt**. Nên thứ thật
sự gửi lên Flow là:

```
relesPortrait: A man in his early thirties, broad heavy face...
```

Hai chỗ hỏng:

1. **`relesPortrait`, `relesSwearingOath`, `relesDeadOnRoof`, `relesFalling` mang
   họ thật của nhân vật.** Đây không phải lo xa: đo ngày 2026-09-11, prompt có
   tên `Abe Reles` cho ra ảnh **đóng nguyên dòng chữ `ABE RELES 1940` dưới mặt**
   (xem `output/name-test-churchill-vs-reles.png`). Cái tên vừa quay lại qua cửa
   sau, qua đúng trường mà không ai để ý là nó đi vào prompt.
2. **camelCase không phải tiếng Anh tự nhiên.** Một token dính liền kiểu
   `halfMoonHotelExterior` đặt ở đầu prompt là đầu vào lạ với model ảnh.

Lỗi này một phần do tôi: ở `r2-02` tôi bắt phải khai `outName` bằng tay nhưng
**không nói nó sẽ đi vào prompt**, cũng không đặt luật đặt tên.

**CẦN GÌ ĐỂ ĐÓNG:** đổi sang tiếng Anh tự nhiên Title Case, **không chứa tên
người thật** — ví dụ `relesPortrait` → `Broad Faced Man In Dark Overcoat`,
`nypdCopSleeping` → `Police Officer Asleep In Chair`. Và bổ sung luật này vào
SPEC-v2 mục 5a-bis.

## D11 — tôi ủng hộ Codex giữ mở

Số liệu đã tốt lên thật (43 → 211), nhưng Codex đúng ở chỗ còn lại: bản v3 thêm
nhiều chi tiết **không có trong manifest**. Ví dụ A1-04 mô tả *"harsh, dramatic
lighting"* — không nguồn nào nói vậy, đó là lựa chọn minh hoạ.

Không cấm, nhưng phải phân biệt được cái nào rút từ tư liệu và cái nào tự nghĩ
ra — đúng tinh thần trường `evidenceFor` trong manifest. Nếu không, phiên sau sẽ
đọc mô tả rồi tưởng mọi chi tiết đều có nguồn.

## Tôi đã không kiểm cái gì

- **Chưa sinh một tấm ảnh nào từ bản v3.** Và theo D08 thì sinh bây giờ cũng chưa
  đánh giá được style ngắn, vì không có ảnh mẫu nào được đính.
- **Không kiểm 18 `at`** với thời gian chữ trong VTT. Vòng trước ở luồng khác
  Codex bắt được hai mốc lệch 9 và 6 giây bằng cách đó; lượt này chưa ai làm.
- **Không kiểm từng `cue` có trỏ đúng đoạn mà shot định minh hoạ không.** Builder
  chỉ kiểm "có trong transcript" và "khớp mấy chỗ" — cue đúng chữ mà sai đoạn thì
  máy không thấy.
- **Không mở lại ảnh trong `refs/A1`**; tôi đối chiếu với trường `shows` do chính
  tôi ghi, nên không phải kiểm độc lập.
- Không kiểm bản quyền.

```points
D08 | đẩy lên Tú | image-prompts/A1.newstyle.shots.json | Code da sua, nhung khoi style tro vao anh mau ma duong tu dong KHONG dinh anh nao — can Tu chon 1 trong 3 huong
D09 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Da do: cue 'sent seven senior mobsters' chi khop mot cho
D10 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Da do: 18 outName rieng biet, builder qua sach
D11 | mở | image-prompts/A1.newstyle.shots.json | Do duoc 43 -> 211 ky tu, nhung dong y voi Codex: chua tach duoc chi tiet co nguon va chi tiet tu nghi
D13 | mở | image-prompts/A1.newstyle.shots.json | Xac nhan: A1-08 dinh nen "wooden paneled courtroom" vao shot nhan vat
D14 | mở | image-prompts/A1.newstyle.shots.json | MOI: outName di vao prompt; bon cai mang ho that cua nhan vat, da do la model dong ten thanh chu
```
