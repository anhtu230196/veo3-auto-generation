# r2 · Phản hồi của tác giả — SPEC v2, bản v2

Artifact: `image-prompts/SPEC-v2.md` → v2. Kèm hai thứ mới có thật trên đĩa:
`image-prompts/refs/A1/` (3 ảnh) và `refs/A1/manifest.json`.

**Nhận cả 11 điểm, không phản bác điểm nào.** Hai điểm CHẶN của Codex (D05, D06)
và hai điểm CHẶN của Gemini (D10, D11) đều là lỗi thật trong schema tôi viết.

---

## D01 + D09 — chặn tên người thật · **đã sửa ở v2**

Nhận, và **đi xa hơn điều kiện đóng**: Codex đề nghị hạ giọng thành "quy ước vận
hành chưa đo lại". Tôi đo luôn, vì nó chặn cả thiết kế.

Hai prompt thật lên Flow chế độ Image, project `style-test-mspaint`, 2026-09-11:

| Prompt | Kết quả |
| --- | --- |
| `a portrait of Abe Reles, the 1930s Brooklyn gangster` | **tạo được**, 65,8s |
| `a portrait of Winston Churchill` | **tạo được**, 65,5s |

**Câu trong RUNBOOK mục 8 sai ở chế độ ảnh hiện tại.** Cả người ít tiếng lẫn
người rất nổi tiếng đều không bị chặn.

Nhưng nhìn ảnh ra thì kết luận *"đừng gọi tên"* vẫn giữ, lý do khác hẳn:

- **Churchill ra giống thật** — hói, cằm xệ, nơ, xì gà — **nhưng vẽ theo lối minh
  hoạ halftone sạch sẽ, không hề giống kiểu vẽ chuột vụng về.** Tiên nghiệm "chân
  dung danh nhân" thắng khối style.
- **Reles ra kèm dòng chữ `ABE RELES 1940` đóng dưới mặt** — đúng loại chữ rác
  phải vá suốt ba vòng của luồng trước.
- **Và mặt đó không phải mặt ông ta**: ảnh ra là người đội mũ phớt, mặt gầy;
  ảnh tư liệu thật là người mặt bầu rộng, hàm bạnh, tóc dày gợn sóng hất ngược,
  đầu trần. Gọi tên không mua được dung mạo.

Mục 1 của spec viết lại theo số đo này. Ai muốn lật lại thì đo lại, đừng suy từ
trang chính sách.

## D02 — quy ước lưu ảnh chưa có file thật · **đã sửa ở v2**

Nhận. `refs/A1/` giờ có 3 ảnh thật kèm `manifest.json`. Và chính việc tải về đã
lòi ra thứ không ai trong ba chúng ta đoán ra được:

> **HTTP 200 không bảo đảm file đủ.** Ba lần tải đầu đều cụt giữa chừng mà `curl`
> không báo lỗi: ảnh Reles dừng ở 22 KB (đủ là 121 KB), ảnh cảnh sát dừng ở 14 KB
> (đủ là 239 KB). Mở ra chỉ thấy một dải pixel rồi nhiễu đen — **trông y hệt một
> tấm ảnh hỏng ở nguồn**, chứ không giống lỗi tải.

Đã thêm mục 2c: kiểm JPEG kết thúc bằng `FFD9` trước khi ghi vào manifest.

## D04 — người review nộp URL cho A1 · **mở — chờ gemini**

**Codex nộp đủ bốn nhóm** kèm nhật ký truy vấn trượt. Tôi tải về và kiểm, kết quả
đúng như Codex tự cảnh báo là chưa duyệt được:

| URL Codex nộp | Kiểm bằng cách tải thật |
| --- | --- |
| chân dung Reles (LOC) | là **thumbnail 120×150**, không đọc nổi nét mặt → đổi sang bản dẫn xuất `v` của LOC, ra 816×1024, dùng được |
| Half Moon Hotel | bưu thiếp tô màu, **dùng được** cho hình khối |
| cảnh sát NY (LOC, 9-1942) | **dùng được** cho trang phục |
| ice pick | **trả về HTML, không phải ảnh** → bỏ |

Tức 2/4 dùng ngay, 1 phải sửa URL, 1 hỏng. Đã ghi hết vào `manifest.json`, kèm
trường `foundBy: codex` trong từng bản ghi và đuôi `__codex` trong tên file.

**Gemini không nộp URL nào.** Lượt `r1-02` chỉ review schema rồi kết thúc; phần
tìm nguồn giao ở `r1-00` bị bỏ qua, lý do nó tự ghi là không mở được RUNBOOK và
skill *"do phải tuân thủ giới hạn đọc file"*. Tôi để D04 **mở và chỉ đích danh
Gemini**: vòng này nộp URL cho hai thứ còn thiếu, ghi ở `manifest.json` mục
`stillMissing`:

1. **ice pick kiểu 1930-1940** — Codex trượt, URL hỏng.
2. **ảnh chụp thật Half Moon Hotel năm 1941** — Codex tìm được hồ sơ Getty
   `2265487109` chụp đúng 12-11-1941 nhưng Getty chặn tải.

Đúng khuôn `URL/TRANG/CHO/THAY GI/TRUY VAN` ở `r1-00`. Nếu quyền đọc file đang
cản thì **nói thẳng ra là bị cản cái gì**, đừng bỏ im lặng — tìm nguồn trên web
không cần đọc file trong repo.

## D05 — `assetId` khác `flowAssetName` · **đã sửa ở v2**

Nhận, lỗi thật. `attachExistingAssets` tìm theo **tên trên Flow** và đòi khớp
chính xác, trong khi spec bảo truyền thẳng `assetId`. Mục 5a chốt đường dữ liệu:

```
useAsset → assets[].id → flowAssetName → createImageIngredient(..., reference: [flowAssetName])
```

Và ghi rõ chỗ phải sửa code: shot có `produces` thì card trên Flow phải được đặt
đúng `flowAssetName`, chứ runner hiện đặt tên bằng `nameFor(prompt)`.

## D06 + D11 — không có loại cho người đơn lẻ vô danh · **đã sửa ở v2**

Nhận. Hai bạn nêu cùng một lỗ hổng từ hai phía: Codex chỉ ra A1-05, A1-12, A1-17
không loại nào chứa nổi; Gemini chỉ ra đường "hạ xuống `group`/`object`" ở mục 4c
tự mâu thuẫn với chính định nghĩa hai loại đó.

Thêm loại thứ sáu **`figure`** — một người vô danh, vai minh hoạ: tả nghề/trang
phục/hành động, **không tả mặt**, cần tư liệu trang phục chứ không cần chân dung.
Ba dòng Codex chỉ tên đều là `figure`. Đường hạ cấp ở 4c sửa thành → `figure`,
không phải `group`/`object`: người vẫn là người.

## D07 — `cue` không phải trích nguyên văn · **đã sửa ở v2**

Nhận, và đây là điểm tôi thấy đáng giá nhất trong cả vòng: Codex **parse chính
khối JSON trong spec rồi đối chiếu với transcript**, thấy `cue` của A1-13 không
tìm được. Đúng — nó là diễn đạt lại, và `kitchen` nằm ở khối sau.

Tức ví dụ minh hoạ đã phá chính cơ chế mà spec đề xuất.

Sửa: cue A1-13 thành `found dead on the roof` (trích nguyên văn). Mục 5b chốt
luật đối chiếu (bỏ mốc `[m:ss]`, gộp khoảng trắng, phải nằm trong đoạn của
segment) và **bắt `build_image_prompts.py` kiểm tự động**: không tìm thấy, hoặc
tìm thấy nhiều chỗ, thì dừng. Không dựa vào người tự giác chép đúng.

Không thêm `end` cho từng shot — nhận ý Codex là chưa cần.

## D08 — tư liệu chưa phân biệt niên đại và mức xác nhận · **đã sửa ở v2**

Nhận. Mục 2b thêm bốn trường bắt buộc: `sourceKind`, `dated` (không được bỏ
trống, không biết thì ghi `KHONG RO`), `evidenceFor`, `verifiedBy`.

Hai ca Codex nêu đã ghi đúng cách trong manifest: bưu thiếp Half Moon Hotel **đã
tô màu lại** → bằng chứng về *hình khối*, không phải về màu; ảnh cảnh sát chụp
**9-1942**, sau cái chết của Reles 10 tháng → bằng chứng về *trang phục thời kỳ*,
không phải hiện trường.

Thêm `verifiedBy` tách khỏi `foundBy` (mục 2a) — vì lượt review chạy chỉ đọc nên
người nộp URL **không tải file về kiểm được**. Gộp hai trường đó lại là ghi sai
sự thật về ai đã kiểm cái gì.

## D10 — lặp hai chiều `assets[]` ↔ `produces` · **đã sửa ở v2**

Nhận. Bỏ `createdBy` khỏi `assets[]`; `assets[]` giờ **chỉ** giữ ánh xạ
`id → flowAssetName` (thứ runner bắt buộc phải có), còn quan hệ "shot nào sinh ra
asset nào" chỉ sống ở `produces` của shot. Một chiều, không lệch được.

## D03 — schema mới thử trên A1 · **đã sửa ở v2**

Nhận phần schema: loại `figure` và đường 4c đã phủ được ca không có ảnh chụp.
**Nhưng chưa chạy thử trên segment thật nào như thế** — Locusta, Sicarii,
Hashashin đều chưa đụng tới. Tôi đóng điểm này ở mức *schema biểu diễn được*,
không phải *đã kiểm trên dữ liệu thật*.

---

## Tôi đã không kiểm cái gì

- **Chưa chuyển dòng nào sang JSON.** `SHOT-LIST.md` vẫn là nguồn sự thật; mục 5
  mới là đặc tả. Đến khi chuyển thật mới biết 385 dòng có `cue` nào không trích
  nguyên văn được.
- **Chưa sửa dòng code nào** theo mục 6. `build_image_prompts.py` chưa có bộ kiểm
  `cue`; `try-image-prompts.ts` chưa đọc `useAsset`. Nên **cơ chế dùng lại asset
  nhân vật — thứ Tú yêu cầu — vẫn chưa chạy thử lần nào.** Tôi chỉ đối chiếu code
  hiện có để biết nó khả thi, đúng như Codex đã ghi ở D05.
- **Chưa tạo asset nhân vật nào từ mô tả rút ra từ ảnh thật.** Mô tả Reles ở mục
  5 là do tôi mở ảnh ra nhìn, nhưng chưa ai thử xem nó có ra đúng người không.
- **Hai ảnh còn thiếu của A1** vẫn thiếu (mục `stillMissing`).
- **Chưa đo lại chữ rác với khối style v2** (đã bỏ câu cuối). Mẻ 10 ảnh cho thấy
  4/8 dính chữ, nhưng đó là style v1.
- **Không kiểm bản quyền.** Ảnh trong `refs/` chỉ để soi, đúng luật đã chốt
  2026-08-15. Việc chèn ảnh chụp thật vào video là quyết định khác, của Tú.

```points
D01 | chốt: đã sửa | image-prompts/SPEC-v2.md:11 | Da do that: ten nguoi that KHONG bi chan; giu ket luan dung goi ten vi ly do khac
D02 | chốt: đã sửa | image-prompts/refs/A1/manifest.json | 3 anh that + manifest; them luat kiem FFD9 vi ba lan tai deu cut
D03 | chốt: đã sửa | image-prompts/SPEC-v2.md:100 | Loai figure va duong 4c phu duoc ca khong co anh chup, chua thu tren segment that
D04 | mở | image-prompts/refs/A1/manifest.json | Codex da nop va da kiem; GEMINI chua nop URL nao — con ice pick va Half Moon Hotel 1941
D05 | chốt: đã sửa | image-prompts/SPEC-v2.md:160 | Chot duong useAsset -> assets[].id -> flowAssetName truoc khi dinh
D06 | chốt: đã sửa | image-prompts/SPEC-v2.md:100 | Them kind figure cho nguoi don le vo danh
D07 | chốt: đã sửa | image-prompts/SPEC-v2.md:170 | cue phai la trich nguyen van, build script kiem tu dong
D08 | chốt: đã sửa | image-prompts/SPEC-v2.md:60 | Them sourceKind/dated/evidenceFor/verifiedBy, tach foundBy khoi verifiedBy
D09 | chốt: đã sửa | image-prompts/SPEC-v2.md:11 | Thay khang dinh bao quat bang so do that co ngay, model, che do
D10 | chốt: đã sửa | image-prompts/SPEC-v2.md:150 | Bo createdBy; assets[] chi giu anh xa id -> flowAssetName
D11 | chốt: đã sửa | image-prompts/SPEC-v2.md:132 | Duong ha cap doi thanh figure, khong ep nguoi thanh group/object
```
