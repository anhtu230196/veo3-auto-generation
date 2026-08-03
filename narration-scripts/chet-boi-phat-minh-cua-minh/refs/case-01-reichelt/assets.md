# Case 1 — danh sách asset cần tạo (Character + Prop)

Style: `src/nanoBanana/styleDNA.ts`. Mọi prompt dưới đây đã tuân thủ:
- KHÔNG dùng tên người thật (bộ lọc "prominent people" — RUNBOOK 4.28/4.40 + mục 8).
- Character: chỉ mô tả **trang phục / tóc / mũ / râu** theo
  `CHARACTER_DESCRIPTION_CHECKLIST`. KHÔNG mô tả dáng người, KHÔNG mô tả biểu cảm.
- Prop: dùng `PROP_STYLE_BLOCK`, **không đính ảnh reference người**.

---

## CHARACTER

### C1 — `Tailor Inventor`

**Đính kèm**: `src/nanoBanana/reference-character.jpeg`
**Ghép**: `CHARACTER_PROMPT_PREFIX` + mô tả dưới đây.

```
Using the exact same illustration style as the attached reference image — same bold uniform-width black outlines, same flat color fill with zero shading, same stick-line limb treatment, same simplified head/eyes, no background: a bulky dark grey-brown padded suit with a large folded fabric hood bunched up over the shoulders and upper back, wide baggy trousers gathered below the knee, glossy black leather gaiters over the shins, short black leather boots, dark brown hair parted at the side and combed back, a soft dark flat cloth cap, a very large thick handlebar moustache curling upward at both ends.
```

Căn cứ tư liệu: `suit-folded-front.jpg`, `suit-folded-profile-1.jpg`.

---

## PROP

Mỗi prompt = `PROP_STYLE_BLOCK` + mô tả riêng bên dưới. Không kèm ảnh reference.

### P1 — `Parachute Suit`

```
A dark charcoal fabric parachute garment displayed spread wide open and completely empty with no wearer: two very wide cape-like fabric wings extended straight out horizontally to their full span reaching down to the bottom of the frame, a tall upright rectangular fabric hood panel held open by four straight rigid rods rising above the top edge of the garment, a dark buttoned tunic front at the centre with one horizontal chest strap and one waist belt closed by a plain square buckle, and several loose pale webbing straps hanging down.
```

Căn cứ tư liệu: `suit-deployed-front.jpg`. Đây là hình ảnh định nghĩa cả case —
nên là prop được ưu tiên kiểm tra kỹ nhất.

### P2 — `Newsreel Camera`

```
An early 1900s hand-cranked motion picture camera mounted on a wooden tripod: a plain dark wooden box body, one short black cylindrical lens on the front face, a round crank handle on the side, one flat circular film magazine sitting on top, and three straight tapered wooden tripod legs splayed evenly below.
```

Căn cứ: hai người quay phim có mặt hôm đó (một trên tháp, một dưới đất) — chi
tiết đã kiểm chứng, và là câu kết của segment ("Máy quay phim đã ghi lại toàn
bộ cú rơi").

### P3 — `Tailor Dummy`

```
A headless tailor's dress form mannequin: a plain cream-coloured armless torso shape mounted on a single straight central post rising from a small round flat base.
```

Căn cứ: điều kiện của Sở Cảnh sát Paris — người nhảy phải là hình nộm.

---

## ⚠️ Vấn đề kỹ thuật chưa giải quyết

Quy trình Character của Nano Banana **bắt buộc đính ảnh reference**
(`reference-character.jpeg`) — đó là thứ neo toàn bộ phong cách nhân vật.

Chưa xác minh: **Google Flow ở chế độ Image có cho đính ảnh reference không**,
và nếu có thì qua đường nào (upload trực tiếp? hay upload thành Ingredient rồi
`@mention` như luồng video ở RUNBOOK 4.1?). `src/veo3bot/imageAsset.ts` hiện chỉ
tạo ảnh từ prompt CHỮ, không có bước đính ảnh nào.

Điều này quyết định toàn bộ thiết kế automation, nên cần kiểm tra UI Flow thật
trước khi viết code.
