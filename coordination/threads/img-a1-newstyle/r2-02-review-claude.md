# r2-02 · Review Claude — A1.newstyle.shots.json v2

**Chưa thông qua**, nhưng bản v2 tiến bộ thật: 7 shot → 18, `cue`/`at` đủ cả,
`kind` đã dùng đúng sáu loại của SPEC-v2.

Tôi **xác nhận cả bốn điểm mới của Codex bằng phép đo**, không chỉ đọc. Và tôi
nhận một lỗi là của mình chứ không phải của tác giả — xem D12.

## Xác minh ba điểm tác giả tự nhận đã sửa

Người review có nghĩa vụ kiểm lời khai của tác giả, nên tôi kiểm cả ba:

| Điểm | Tác giả khai | Tôi kiểm |
| --- | --- | --- |
| D05 — A1-13/A1-16 thiếu `refs` | đã sửa | **đúng** — cả hai giờ đều có `refs` |
| D06 — không còn lệnh chặn chữ | đã sửa | **đúng** — A1-12 và A1-17 thành `blank round badge … no text`, thêm A1-05 và A1-06 |
| D07 — A1-13 nhét nền | đã sửa | **đúng** — `on a roof` đã bỏ hẳn |

Ba điểm này chốt được. Ghi rõ vì vòng trước tôi từng nêu chúng, và tác giả sửa
đúng chứ không sửa lấy lệ.

## D08 — xác nhận, và đây là lỗi NẶNG NHẤT của cả luồng

Codex đúng, và hậu quả lớn hơn cách nó mô tả. Tôi chạy thẳng builder rồi soi
chuỗi prompt thật:

```python
jobs, _ = build_jobs(Path('image-prompts/A1.newstyle.shots.json'))
'old computer painting program' in jobs[2]['prompt']            # True
'with the same style with reference images' in jobs[2]['prompt'] # False
```

`full_prompt()` trong `scripts/build_image_prompts.py:71` nối hằng số
`STYLE_BLOCK` cứng trong code, **không hề đọc trường `styleBlock` của artifact**.

Nghĩa là: mọi prompt dựng từ file này vẫn mang nguyên khối style DÀI — đúng cái
Tú nói làm ảnh không đồng nhất, đúng cái cả luồng này sinh ra để thay thế.

👉 **Hệ quả về phạm vi, nói thẳng: chưa một tấm ảnh nào từng được tạo bằng khối
style ngắn.** Toàn bộ tranh luận về "style ngắn có nhất quán hơn không" trong
luồng này **chưa có một phép đo nào đỡ**. Nếu chạy sinh ảnh ngay bây giờ, ta sẽ
nhận lại đúng style cũ rồi kết luận nhầm là cách mới không ăn thua.

Đây là lỗi trong **code của tôi**, không phải trong artifact của tác giả.

**CẦN GÌ ĐỂ ĐÓNG:** sửa `build_image_prompts.py` để `full_prompt` nhận khối
style từ `data["styleBlock"]`, chỉ dùng hằng số trong code làm mặc định cho
đường cũ (`SHOT-LIST.md`). Việc này thuộc về tôi, không phải tác giả.

## D09 — xác nhận: `cue` của A1-08 khớp hai chỗ

Builder bắt được độc lập:

```
LOI: A1-08: cue khop 2 cho, khong neo duoc: 'His testimony sent'
```

Cụm đó có ở `transcript.md:3` (`[0:15]` — Reles khai, bảy trùm vào chỗ chết) và
`transcript.md:61` (`[8:06]` — Barboza khai, bốn người vô tội vào tù). Hai đoạn
cách nhau tám phút và nói về hai người khác nhau.

**CẦN GÌ ĐỂ ĐÓNG:** đổi sang cụm chỉ có ở đoạn A1, ví dụ
`sent seven senior mobsters`.

## D10 — xác nhận: ba chỗ trùng tên card

```
LOI: A1-13: ten card 'A Man In His Early' trung voi A1-01
LOI: A1-16: ten card 'A Man In His Early' trung voi A1-13
LOI: A1-17: ten card 'An Older 1940S New York' trung voi A1-12
```

Ba shot đó sẽ bị `assetAlreadyExists` bỏ qua **im lặng** mà runner vẫn báo thành
công.

## D12 — `outName` phải BẮT BUỘC, và lỗi này là của tôi

**CHỖ NÀO:** `image-prompts/SPEC-v2.md` mục 5c (bảng trường), và
`scripts/build_image_prompts.py:87` (`derive_out_name`).

**VẤN ĐỀ GÌ:** D10 không phải lỗi của tác giả. Chuỗi sự việc:

1. Ở `r1-02` tôi viết điều kiện đóng D04 là *"phần `assets`/`outName`/`produces`
   thì đúng là đang gác, **không cần thêm ở lượt này**"*.
2. Tác giả làm đúng lời đó — không khai `outName` ở shot nào.
3. Builder của tôi lại `KeyError: 'outName'`. Tôi vá bằng cách cho nó **tự suy
   tên** từ năm chữ đầu của `draw`.
4. Bản vá đó đẻ ra đúng ba vụ trùng ở D10, vì mô tả nhân vật lặp lại nên năm chữ
   đầu giống hệt nhau.

Và không có đường cứu bằng cách thêm mã shot vào tên, vì `createImageIngredient`
gõ tên card **vào chính prompt** (`imageAsset.ts:540`: `${name}: ${description}`)
— chuỗi `A1-13` sẽ bị model vẽ thành chữ trong ảnh.

Nên kết luận đúng là: **không có cách tự suy tên nào an toàn. `outName` phải do
người đặt, cho mọi shot.** Hướng dẫn của tôi ở r1-02 sai, và bản vá của tôi cũng
sai.

**CẦN GÌ ĐỂ ĐÓNG:** hai việc, chia rõ:
- **Tôi**: bỏ `derive_out_name`, cho builder báo lỗi khi thiếu `outName`; sửa
  bảng trường trong SPEC-v2 thành bắt buộc.
- **Tác giả**: khai `outName` cho cả 18 shot, mỗi cái một tên khác nhau, và không
  chứa mã shot.

## D11 — xác nhận bằng số đo

Codex nói 11 shot bổ sung còn nguyên mô tả thô. Đo độ dài `draw`:

| Nhóm | Trung bình | Ngắn nhất |
| --- | --- | --- |
| 7 shot có từ v1 | **308** ký tự | 190 |
| 11 shot mới thêm | **43** ký tự | 21 |

Chênh hơn bảy lần. Bốn cái ngắn nhất chép nguyên từ `SHOT-LIST.md`:

- `A1-15` — *"A cast iron radiator."*
- `A1-07` — *"An empty electric chair."*
- `A1-18` — *"A thick bundle of banknotes."*
- `A1-04` — *"A human ear seen from the side."*

Đây đúng chỗ Tú dặn phải bù: *"cần tạo prompt phức tạp hơn xíu là phải thêm chi
tiết cho nhân vật, vật thể như màu sắc, trang phục"*. Với khối style ngắn thì mô
tả là thứ duy nhất còn lại để điều khiển ảnh — 21 ký tự không đủ.

**CẦN GÌ ĐỂ ĐÓNG:** bù chi tiết cho 11 shot mới ở mức tương đương 7 shot kia:
chất liệu, màu, hình dáng cụ thể. Không cần dài bằng nhân vật, nhưng
*"a cast iron radiator"* phải thành thứ nói được nó nhiều đốt hay ít, sơn màu gì,
có van ở đâu.

## Tôi đã không kiểm cái gì

- **Không sinh một tấm ảnh nào từ bản v2.** Và theo D08 thì hiện cũng chưa thể
  sinh đúng — builder vẫn nối khối style cũ.
- **Không kiểm 18 `cue` còn lại** ngoài cái builder đã bắt. Builder chỉ kiểm
  "có trong transcript" và "khớp mấy chỗ", **không** kiểm cue có trỏ đúng đoạn
  mà shot định minh hoạ hay không. Cue đúng chữ mà sai đoạn thì máy không thấy.
- **Không đối chiếu `at` với thời gian chữ trong VTT.** Vòng trước Codex bắt được
  hai mốc lệch 9 và 6 giây theo cách đó; lượt này chưa ai làm lại cho 18 shot.
- **Không mở lại ảnh trong `refs/A1`** — tôi đối chiếu với trường `shows` trong
  manifest, vốn do chính tôi ghi, nên không phải một lần kiểm độc lập.
- Không kiểm bản quyền.

```points
D05 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Da kiem: A1-13 va A1-16 gio deu co refs
D06 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Da kiem: blank round badge + no text o A1-12/A1-17, them A1-05/A1-06
D07 | chốt: đã sửa | image-prompts/A1.newstyle.shots.json | Da kiem: bo han "on a roof" khoi A1-13
D08 | mở | scripts/build_image_prompts.py:71 | CHAN: builder bo qua styleBlock cua artifact, van noi khoi dai — LOI CUA CLAUDE, chua tam anh nao chay bang style ngan
D09 | mở | image-prompts/A1.newstyle.shots.json | CHAN: cue A1-08 khop ca doan Reles lan doan Barboza cach nhau 8 phut
D10 | mở | image-prompts/A1.newstyle.shots.json | CHAN: ba shot trung ten card, se bi bo qua im lang
D11 | mở | image-prompts/A1.newstyle.shots.json | SUA: 11 shot moi trung binh 43 ky tu so voi 308 cua 7 shot cu
D12 | mở | scripts/build_image_prompts.py:87 | SUA: khong co cach tu suy ten an toan — outName phai bat buoc; huong dan r1-02 cua Claude sai
```
