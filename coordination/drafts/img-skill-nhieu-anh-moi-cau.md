# Bản nháp: MỖI CÂU LỜI KỂ → NHIỀU ẢNH NHẤT CÓ THỂ (skill `nano-banana-image-prompts`)

**Trạng thái:** bản nháp **v3**, luồng `img-skill-nhieu-anh-moi-cau`. v3 sửa D08 (bộ lọc trùng chức năng không còn
miễn cho khác cụm lời kể) và D09 (nét mặt trung tính là mặc định) của Codex vòng 2 — `r3-00-response-claude.md`;
D01–D07 đã chốt. v2 sửa theo 7 điểm vòng 1 (D01–D05 của
Codex, D06–D07 của Gemini) — từng điểm ở `coordination/threads/img-skill-nhieu-anh-moi-cau/r2-00-response-claude.md`.
**Chưa** chép vào skill — chép khi luồng `settled` (hoặc Tú quyết khi `blocked`).

**Yêu cầu của Tú, 2026-09-13 (nguyên văn):**

> claude, chatgpt, gemini hãy cùng nhau cập nhập lại skill tạo prompt sao cho nhiều ảnh nhất có thể cho
> mỗi câu. Ví dụ câu "In 1587, nearly a hundred and fifteen English men, women, and children landed on a
> small island in what would later become North Carolina, led by governor John White." tạo thêm 2 ảnh
> cho chiếc thuyền cập bờ cát, hình ảnh bản đồ thể hiện North Carolina. " It was England's second attempt
> at a lasting colony in the New World." tạo thêm ảnh lá cờ nước Anh, ảnh cho câu "in the New World"

**Ví dụ áp dụng:** `narration-scripts/ca-mot-nhom-nguoi-bien-mat-khong-dau-vet/case-1/case-1.shots.json` —
bốn shot Tú nêu (`C1-01b`, `C1-01c`, `C1-03a`, `C1-03b`) + `C1-18` sinh từ hình thuyền. v2 sửa thêm `C1-03b`
(D05, D07), `C1-16` (D02), `C1-09` (D04), gắn `choTuLieu` cho ba shot chưa có tư liệu (D03). **Chưa sinh ảnh
nào.** Bản đọc được: `case-1.review.md` cùng thư mục.

---

## 0. Hai chỗ đụng với skill hiện hành

**(a) Skill mục 4d, "Điều kiện chặn"** (`.claude/skills/nano-banana-image-prompts/SKILL.md:283–286`):
*"chỉ thêm khi phần tử đó mang thông tin … mà bộ hình hiện có chưa đảm nhiệm"*. Bằng chứng nó đi ngược yêu cầu
của Tú: **lá cờ Anh** — ví dụ chính Tú đưa — là phần tử Claude đã **bỏ** ở case 1 theo đúng câu đó
(`case-1.shots.json` → `_raSoatSkill4d.10_daBoTheoDieuKienChan`: *"Co Anh cho 'second attempt' (lang C1-03 da
ganh 'thuoc dia')"*), trong khi `kind: "symbol"` đã có sẵn trong SPEC-v2 §3 từ trước.

👉 v2: **thay** câu đó bằng **thứ tự quyết định + bộ lọc trùng chức năng** (mục 4). Bộ lọc vẫn còn (Gemini D06
đúng ở chỗ phải có), chỉ đổi câu hỏi từ *"bộ hình đã gánh chưa?"* sang *"có shot nào cùng cụm lời kể, cho người
xem đọc ra cùng một thông tin không?"*.

**(b) Skill mục 4c** — câu trùm `:215–216` *"Việc của Nano Banana chỉ là phần VẼ … Ảnh thật, bản đồ, logo, icon,
mũi tên, nhãn chữ, bóng thoại đều là hậu kỳ"*, và dòng `:237` *"Địa lý, nơi chốn → bản đồ thật"*. Tú yêu cầu
**tạo ảnh** bản đồ và cờ. 👉 v2 sửa **cả câu trùm lẫn dòng bảng** (D01) — xem mục 7.

**Luồng `img-skill-a1-lessons`** chưa `settled` nhưng không cần chờ: D07 bên đó là chuyện chọn ảnh neo, khác
chuyện thêm ảnh (Codex r1, Q5). Khi chép luồng này vào skill phải giữ nguyên phần ảnh neo.

---

## 1. Bảng 10 ô — DANH MỤC ỨNG VIÊN, chưa phải shot

Viết câu ra, gạch dưới từng cụm, đi qua **10 ô** dưới đây. Cụm rơi vào một ô là **một ứng viên**. Ứng viên thành
shot khi qua đủ ba bước ở **mục 4**. Shot thành `cue` là chính cụm đó; mọi shot của cùng một câu mang chung `at`
(câu lời kể — SPEC-v2 §5b-bis, **chỉ cho kịch bản trong `narration-scripts/`**).

| # | Ô | Câu hỏi | Thành ảnh gì | Ví dụ case 1 |
|---|---|---|---|---|
| 1 | **Người** | Ai có mặt hoặc được nhắc — kể cả gián tiếp (*"White's daughter"*)? | `character` / `figure` / `group` | `C1-01` dân thuộc địa, `C1-02` White |
| 2 | **Hành động** | Động từ chính **mà lời kể nói ra** là gì? | cảnh nhân vật đang làm đúng việc đó | `C1-06` van nài |
| 3 | **Vật ngầm trong động từ** | Động từ này cần vật gì mới xảy ra được? (*landed* → thuyền; *carve* → dao) | `object` | ✅ `C1-01b` thuyền cập bờ (Tú) |
| 4 | **Vật được gọi tên** | Danh từ nào là một vật? | `object` | `C1-05` thùng rỗng |
| 5 | **Nơi chốn** | Chuyện xảy ra ở đâu, nhìn thấy được? | `place` | `C1-03` làng |
| 6 | **Địa lý** | Có tên vùng, đảo, nước, *"off the coast of"*, *"near"*? | **bản đồ vẽ trơn** (5a) | ✅ `C1-01c` bản đồ North Carolina (Tú) |
| 7 | **Quốc gia / tổ chức / phe** | Có nước, hạm đội, tổ chức nào được gọi tên? | **cờ có mẫu được tài liệu xác nhận** (5b) | ✅ `C1-03a` cờ St George (Tú) |
| 8 | **Cụm khái niệm** | Có cụm trừu tượng (*"in the New World"*, *"under distress"*)? | **vật tượng trưng** (5c) | ✅ `C1-03b` quả địa cầu (Tú) |
| 9 | **Trạng thái nối / quan hệ** | 8 luật mục 4d | theo từng luật | `C1-15` White trở lại |
| 10 | **Con số, ngày tháng** | Có số người, năm, khoảng thời gian? | **chữ hậu kỳ**, không vẽ — trừ khi con số có hình (số người → ảnh nhóm) | năm 1587, "three full years" → chữ |

Không có trần số ảnh mỗi câu. Câu 1 của Roanoke (29 chữ) giờ có **4 ảnh**.

---

## 2. Chi phí phải biết trước

- Áp bảng mục 6 lên case 1: **36 shot hiện có + 10 ứng viên còn lại ≈ 46 shot** (v1 ước ~71, v2 ~47; mục 4 bước 3 và
  giới hạn cứng mới loại 25 ứng viên).
- Mẻ case 1 đo được **~75–97 giây/shot** (`output/run-c1.log`) → **~1 giờ chạy cho case 1**.
- Trần lượt tạo mỗi ngày của tài khoản PRO **chưa đo**. Tài khoản free từng chặn ở ~10 ảnh/ngày (RUNBOOK).

---

## 3. Giới hạn cứng — phủ kín KHÔNG được vượt

| Giới hạn | Nguồn | Ví dụ bị chặn ở case 1 |
|---|---|---|
| **Bằng chứng**: không vẽ khoảng trống chưa biết | skill 4d luật 7 | Virginia Dare lúc 3 tuổi; dân thuộc địa trên đảo Croatoan; cái chết của White |
| **Dàn dựng** (D02): không thêm **tâm trạng, hành động, dấu vết, hình thức cụ thể** mà lời kể hoặc nguồn không xác nhận | skill 4d luật 7, mở rộng | White bực bội nhìn biển; thư niêm sáp đỏ; gỗ nhà xếp thành đống; dân vẫy theo tàu; thuỷ thủ chỉ tay thấy đất; nhà khảo cổ đang đào |
| **Nét mặt** (D09): **trung tính là mặc định**. Chọn nét mặt hoặc dáng người **truyền một tâm trạng cụ thể** (lo lắng, sững sờ, buồn bã, háo hức, mỉm cười, vai rũ…) thì cần lời kể hoặc nguồn — **kể cả khi chỉ là chi tiết phụ**. Không cần nguồn cho từng nét mắt, miệng trung tính (Codex r2, trả lời Q6) | mục Dàn dựng | bỏ ở C1-04, C1-06, C1-08, C1-10, C1-15, C1-19, C1-26, C1-27, C1-28; **giữ** nụ cười hy vọng ở C1-21 vì lời kể nói *"To White, that looked like good news"* |
| **Đồng nhất hiện vật** (D02): dùng lại một asset để **thống nhất hình vẽ** không được khẳng định **cùng hiện vật lịch sử** | — | `C1-18`: cùng hình thuyền với `C1-01b`, không nói là cùng chiếc |
| **Mức chắc chắn**: không vẽ *"was said to"*, *"it meant"*, *"wrote that"* thành sự thật | skill 4d câu rà 9 | "da nhạt mắt xám"; xác tàu đắm (*"refused to **risk** a wreck"*) |
| **Niên đại**: áp cho cả **cờ** và **bản đồ** | skill 4d luật 4 | cờ Anh 1587 không phải Union Jack |
| **Mẫu cờ phải có tài liệu cho đúng vai trò** (D04) | 5b | cờ Tây Ban Nha 1588 — bỏ ô |
| **Tư liệu đối chiếu** (D03): vật / nơi / bản đồ thuộc thời kỳ cụ thể phải có ảnh đối chiếu **trước khi chạy** | SPEC-v2 §5c | `C1-01b`, `C1-01c`, `C1-03b` đang `choTuLieu` |
| **Vật tượng trưng không được đọc thành đạo cụ của câu chuyện** (D07) | 5c | địa cầu không sinh chung với người |
| **Không chữ trong ảnh** | skill 6i | bản đồ, cờ, địa cầu là loại model **rất hay tự điền chữ** → câu cấm tường minh |
| **Cổng kiếm tiền YouTube** | skill 11e | bộ xương |
| **Tên riêng không vào `outName` đường `draw`** | SPEC-v2 §5d | *"North Carolina"* trong tên card có thể thành chữ trong ảnh |

---

## 4. Thứ tự quyết định — thay "Điều kiện chặn" cũ (D01, D06)

**Bước 1 — giới hạn cứng (mục 3).** Vướng là loại, không bàn tiếp.

**Bước 2 — 8 luật mục 4d.** Luật nào **bắt thêm** thì ứng viên đó thành shot. Cột *"Không áp khi"* của 8 luật
đổi như sau, để không còn chỗ vừa bắt thêm theo 10 ô vừa được miễn theo 8 luật (D01):

| Luật 4d | *"Không áp khi"* hiện tại (skill) | v2 |
|---|---|---|
| 1 vật chạm cơ thể | dính liền nghĩa; hậu kỳ không cần tách (`:292`) | **GIỮ** — luật này quyết tách một ảnh thành hai, không quyết thêm/bớt |
| 2 chuyển trạng thái | người xem **đã biết** nhân vật chuyển trạng thái (`:293`) | **ĐỔI** thành *"trùng chức năng với một shot đã có (bước 3)"* |
| 3 người có thật | thông tin câu đó cần **đã có hình khác gánh** + lời kể không quay lại (`:294`, đoạn Gaviria `:324–327`) | **BỎ** vế "hình khác đã gánh". **GIỮ** *"danh mục chung không phải tên riêng"*. Gaviria (A2) → có chân dung trung tính |
| 4 tên sai thời kỳ | tên không đổi qua thời gian (`:295`) | **GIỮ** |
| 5 trạng thái gốc | B quen, lời kể không nhấn việc chế tạo (`:296`) | **BỎ** — A được gọi tên thì đã là ứng viên ô 4; không được gọi tên thì không thêm |
| 6 chỗ nối | — | — |
| 7 hành động nối | không có nguồn, không nằm trong giả thuyết đã nêu (`:298`) | **GIỮ**, và nâng thành giới hạn cứng (mục 3) |
| 8 hành vi nói | người nghe đã có ở shot kề bên (`:299`) | **GIỮ** — đây chính là một trường hợp trùng chức năng |

Đoạn "Điều kiện chặn" `:283–286` → **xoá**, trỏ về mục mới 4d-bis. Câu rà 10 → *"ứng viên nào trùng chức năng
với shot đã có?"*.

**Bước 3 — ứng viên từ bảng 10 ô qua bộ lọc TRÙNG CHỨC NĂNG** (sửa ở v3 theo D08). Một ứng viên **trùng chức năng**
với một ảnh đã có khi ảnh đó **cho người xem đọc ra cùng thông tin** và **đảm nhiệm được cùng thao tác dựng** — **bất
kể nằm ở cụm hay câu nào**. Khác cụm **không** tự động cần ảnh mới: ảnh sẵn có gánh được thì ghi dùng lại (♻️) vào
`note`. Chỉ tạo ảnh mới khi cần **thêm nội dung hoặc trạng thái chưa có**.

**Giới hạn của việc dùng lại:** không dùng lại khi việc đó khiến người xem đọc **hai thứ khác nhau thành một** (mục 3,
"Đồng nhất hiện vật") — ví dụ hai hòn đảo khác nhau không dùng chung một hình đảo.

- "Na ná" (cùng nhân vật, tư thế gần) **không tự là trùng**, nhưng **đổi góc không tạo ra chức năng mới** (Codex r1, Q1).
- Ô chỉ là gợi ý để tìm; quyết trùng hay không là theo **thông tin + thao tác dựng**, không theo số ô, cũng không theo cụm.

| Cặp | Cụm | Thông tin người xem đọc ra | Kết luận |
|---|---|---|---|
| cờ `C1-03a` / làng `C1-03` | *"England's"* / *"a lasting colony"* | nước nào / nơi họ ở | **giữ cả hai** — chính ví dụ của Tú |
| bao lương thực rỗng / thùng rỗng `C1-05` | *"short on food"* | hết lương | **trùng** → bỏ bao (Gemini D06) |
| thân cây bóc vỏ / cột `C1-13` | *"into a tree or post"* | chỗ khắc tên | **trùng** → bỏ thân cây (Gemini D06) |
| bãi cát trống / thuyền `C1-18` + dấu X | *"Not a single boat remained"* | không còn thuyền | **trùng** → bỏ bãi trống |
| cuốn sách bìa trống / `C1-29` đang viết | *"one explorer wrote"* | có người đã viết lại | **trùng** → bỏ sách |
| mây bão / tàu trong bão `C1-23` | *"a hurricane tore through"* | có bão | **trùng** → bỏ mây |
| đảo Azores / bản đồ Azores | *"near the Azores"* | họ dạt tới đâu | **trùng** → giữ bản đồ |
| cận cảnh em bé / `C1-04` | *"a girl named Virginia Dare"* | em bé ra đời | **trùng** → bỏ cận cảnh |
| đống thùng tiếp tế / — | *"for more supplies"* | thứ họ thiếu | không trùng → giữ |
| cờ `C1-03a` / câu *"turn back for England"* | **khác câu** | nước Anh | **trùng** → ♻️ dùng lại cờ (ví dụ của Codex D08) |
| bản đồ đảo Hatteras / bản đồ Roanoke–Croatoan | **khác câu** | vị trí đảo — Croatoan nay là phần nam đảo Hatteras | **trùng** → ♻️ dùng lại bản đồ dòng 20 (v3) |
| đảo nhỏ nhìn từ biển (Roanoke) / `C1-22` đảo Croatoan | khác câu | **hai đảo khác nhau** | **không dùng lại** — sẽ đọc thành cùng một đảo |

---

## 5. Cách viết cho bốn loại ảnh mới

### 5a. Bản đồ (ô 6)

- **Vai trò:** bản đồ **định vị cho người xem hôm nay**, không phải bản đồ đương thời năm câu chuyện (Codex r1).
  Lời kể nói *"what would **later become** North Carolina"* → ranh giới bang hiện đại được phép ở `C1-01c`. Bản đồ
  minh hoạ sự kiện trong năm câu chuyện (tàu dạt tới Azores năm 1590) thì **không** vẽ ranh giới đời sau.
- 🔴 **Bắt buộc có tư liệu đối chiếu (D03):** một **bản đồ trống không chữ** (blank outline map) đúng khung —
  đường bờ biển, vị trí đảo, ranh giới đúng vai trò trên. Ghi vào `refs` + manifest. Chưa có → shot mang
  `choTuLieu`, **không chạy**; `draw` bằng chữ lúc đó chỉ là bản nháp.
- **Cách sinh khi đã có tư liệu: chip `@`** —
  *"draw a map shaped like {{<bản đồ trống>}} with the same style as {{01-pyramid-place.png}}, fill <vùng> with
  one flat red colour, no lettering, no names, no labels…"*. Lý do giống `A1-11`: chữ không neo được hình khối,
  bờ biển sai là ai biết nhận ra ngay (cả hai reviewer cùng nêu). Đây là **mở rộng tường minh ngoại lệ ảnh thật
  của SPEC-v2 §6** từ "nơi chốn đặc biệt" sang "bản đồ". Chọn bản đồ **trống** vì ảnh có chữ thì model đọc và vẽ lại
  chữ (bài học biển hiệu `A1-11` v2) — bản đồ John White 1585 (`01-john-white-02.jpg`) đầy chữ nên không dùng.
- `kind: "place"` giữ nguyên: `kind: "map"` riêng không tự giải quyết độ chính xác (Codex r1, Q2).
- Cấm tường minh: *no lettering, no names, no labels, no numbers, no compass rose, no scale bar, no grid lines,
  no arrows*. Nhãn, mũi tên, chấm đánh dấu → hậu kỳ.

### 5b. Cờ / biểu tượng quốc gia (ô 7)

- `kind: "symbol"`, ảnh neo `01`.
- ✅ **Đã có nguồn:** cờ Union đầu tiên có từ **1606** (tuyên cáo của James I); trước đó tàu Anh treo **chữ thập
  đỏ St George** — Flag Institute, *Union Flag history* (Codex dẫn, Claude đã mở kiểm). Nên *"England's"* năm 1587
  → chữ thập St George. Cả hai reviewer đồng ý.
- 🔴 **Chỉ vẽ cờ khi có mẫu được tài liệu xác nhận cho đúng vai trò ô cần** (D04). *Biểu tượng quốc gia*, *cờ hạm
  đội* và *cờ chỉ huy* là ba vai khác nhau — nghiên cứu về cờ Armada 1588 mà Codex dẫn (Pedro Luis Chinchilla,
  armadainvencible.org) phân biệt chúng và coi một số mẫu là suy luận. Không có mẫu xác nhận → **bỏ ô**, ghi lý do.
  Case 1: bỏ ô cờ Tây Ban Nha; bỏ luôn dấu thập đỏ trên buồm `C1-09` cùng lý do.
- **Tả hình học, không gọi tên cờ**: *"a plain white flag with one straight red cross running the full height and
  full width"*. Gọi *"the English flag"* dễ kéo về Union Jack — thứ model thấy nhiều nhất.

### 5c. Cụm khái niệm (ô 8) — vật tượng trưng

- Chọn **một vật cụ thể** mà người xem có thể đọc ra đúng cụm đó. "Đọc ra ngay" là **mục tiêu phải kiểm khi ra ảnh**,
  không phải điều đã biết (D05).
- 🔴 Ba điều bắt buộc với vật tượng trưng (D07):
  1. **Không bao giờ sinh chung với người** hay đặt trong cảnh có nhân vật — vẽ đứng riêng trên nền trắng, để không
     đọc thành đồ vật nhân vật mang theo.
  2. `intent` ghi rõ **VẬT TƯỢNG TRƯNG** và nó đứng cho cụm nào.
  3. `note` bắt buộc nhắc hậu kỳ: vật này phải đứng **tách khỏi cảnh có nhân vật** (khung hoặc nhãn minh hoạ). Cách
     dựng cụ thể là việc của Tú.
- *"in the New World"* → **quả địa cầu thế kỷ 16, Bắc Mỹ và Nam Mỹ nằm chính giữa mặt cầu hướng về người xem**, chỉ
  một mép châu Âu–châu Phi ở rìa (D05 — v1 đặt Đại Tây Dương ở giữa, chỏi với tiêu chí duyệt). Chưa có ảnh địa cầu
  thời kỳ → `choTuLieu`.
- Không chọn biểu tượng mơ hồ (bình minh, cánh cửa mở…).

### 5d. Vật ngầm trong động từ (ô 3)

- Chọn vật **đúng cơ chế của động từ**: *"landed"* với tàu thế kỷ 16 là **thuyền nhỏ cập bãi** — tàu lớn neo ngoài
  khơi (đã có asset `C1-07`).
- Vật ngầm quay lại ở câu sau → tạo asset ngay lần đầu để **thống nhất hình vẽ**. Không khẳng định cùng hiện vật
  (mục 3): `C1-18` và *"White landed again"* dùng **hình** thuyền `C1-01b`, không nói là cùng chiếc năm 1587.
  Tường thuật 1590 của White chỉ ghi không thấy dấu vết thuyền.

### 5e. Trường bắt buộc mới trên shot

- `anhSeRa` + `anhSeRaHash` (quy trình duyệt Tú chốt cùng ngày) — `scripts/review_shots.py` in ra và báo khi prompt
  đổi mà mô tả chưa đổi.
- `choTuLieu` (D03) — lý do shot chưa được chạy. `review_shots.py` gắn nhãn **⏳ chờ tư liệu** ở bảng và từng shot.

---

## 6. Áp thử lên cả case 1 (v2)

✅ đã viết prompt · ⏳ đã viết prompt nhưng **chờ tư liệu** · ➕ ứng viên qua mục 4, **chưa viết prompt** (viết sau khi
luồng chốt và Tú duyệt) · ♻️ trùng, dùng lại · ❌ bỏ, kèm lý do · ⛔ giới hạn cứng.

| # | Câu (rút gọn) | Đang có | Thêm | Bỏ |
|---|---|---|---|---|
| 1 | *In 1587 … landed on a small island … North Carolina, led by governor John White.* | C1-01, C1-02 · ⏳ C1-01b thuyền · ⏳ C1-01c bản đồ NC | ➕ hòn đảo nhỏ nhìn từ biển (*"a small island"*) — phải **khác hình** `C1-22`, không dùng lại (D08) | — |
| 2 | *It was England's second attempt at a lasting colony in the New World.* | C1-03 · ✅ C1-03a cờ St George · ⏳ C1-03b địa cầu | — | — |
| 3 | *…Eleanor gave birth to a girl named Virginia Dare…* | C1-04 | — | ❌ White nhìn cháu (dàn dựng) · ❌ cận cảnh em bé (trùng C1-04) |
| 4 | *The colony was running desperately short on food.* | C1-05 | — | ❌ bao rỗng (trùng C1-05) · ❌ dân chia khẩu phần (dàn dựng) |
| 5 | *The settlers begged White to sail back to England for more supplies.* | C1-06 | ➕ đống thùng/bao tiếp tế (*"more supplies"*) · ➕ bản đồ Roanoke–Anh (*"sail back to England"*) | — |
| 6 | *He left on August 27th, 1587, promising to return quickly.* | C1-07, C1-08 | — | ❌ dân vẫy theo tàu (dàn dựng) |
| 7 | *He couldn't.* | — | ♻️ C1-11 tàu bị giữ | ❌ White bực bội nhìn biển (tâm trạng) |
| 8 | *The Spanish Armada was threatening England, and Queen Elizabeth banned…* | C1-09 (v2: buồm trơn), C1-10, C1-11 | ➕ bản đồ eo biển Anh (*"threatening England"*) | ❌ cờ Tây Ban Nha (không có mẫu xác nhận đúng vai trò) |
| 9 | *It wasn't until 1590, three full years later, that White finally got permission…* | — | ♻️ C1-07 tàu giương buồm | ❌ thư niêm sáp + White cầm thư (hình thức cấp phép không có nguồn) · "3 năm" là chữ |
| 10 | *…agreed on a signal.* | C1-12 | — | — |
| 11 | *…carve the name of their destination into a tree or post.* | C1-13 | ➕ con dao khắc (vật ngầm *"carve"*) | ❌ thân cây bóc vỏ (trùng C1-13) |
| 12 | *If they left under distress, they'd carve a cross beside it.* | C1-14 | — | — |
| 13 | *On August 18th, 1590, his granddaughter's third birthday, White landed again.* | C1-15 | ➕ tàu neo ngoài khơi (từ asset tàu, vật ngầm *"landed"*) · ♻️ hình thuyền C1-01b | ⛔ Virginia 3 tuổi |
| 14 | *The colony was empty.* | C1-16 (v2: nền trống, bỏ khung móng gỗ) | — | — |
| 15 | *The houses had been carefully taken apart, their belongings dug up and rifled through.* | C1-16, C1-17 | — | ❌ gỗ nhà xếp đống (dấu vết không có nguồn — tường thuật 1590 chỉ ghi *"the houses taken downe"*) |
| 16 | *Not a single boat remained on the shore.* | C1-18 (hình thuyền, không khẳng định cùng chiếc) | — | ❌ bãi cát trống (trùng C1-18) |
| 17 | *And carved into a post of the fence, one word. CROATOAN.* | C1-19, C1-20 | — | ❌ cận cảnh mảng khắc (trùng C1-20) |
| 18 | *There was no cross beside it.* | — | ♻️ C1-14 + dấu X | — |
| 19 | *To White, that looked like good news.* | C1-21 | — | — |
| 20 | *It meant everyone had relocated safely to nearby Croatoan Island.* | C1-22 | ➕ bản đồ Roanoke–Croatoan | ⛔ dân chuyển sang đảo |
| 21 | *But just as he prepared to sail there and check, a hurricane tore through the area.* | C1-23 | — | ❌ White chuẩn bị ra thuyền (hình thức "chuẩn bị" không có nguồn) · ❌ mây bão (trùng C1-23) |
| 22 | *His ship's anchor cable snapped … hidden rocks, and the crew refused to risk a wreck.* | C1-24, C1-25, C1-26 | ➕ đá ngầm dưới mặt nước (*"waters full of hidden rocks"*) | ⛔ xác tàu đắm |
| 23 | *The storm blew them completely off course … near the Azores, off the coast of Spain.* | — | ➕ bản đồ Đại Tây Dương, Azores đặt **đúng chỗ** | ❌ thuỷ thủ chỉ tay thấy đất (người + tư thế không nguồn) · ❌ đảo Azores (trùng bản đồ) |
| 24 | *They had no choice but to turn back for England.* | C1-27 | ♻️ cờ C1-03a | — |
| 25 | *John White never got another chance to return to Roanoke.* | — | ♻️ C1-28 | ❌ White già đứng nhìn biển (tư thế + tâm trạng) |
| 26 | *He died years later, never learning what happened to his own family.* | C1-28 | ♻️ C1-04 | ⛔ cái chết |
| 27 | *Centuries afterward, one explorer wrote … Hatteras Island … pale skin and gray eyes.* | C1-29, C1-30 | ♻️ bản đồ Roanoke–Croatoan của dòng 20 | ❌ bản đồ Hatteras riêng (trùng — Croatoan nay là phần nam đảo Hatteras, D08) · ❌ sách bìa trống (trùng C1-29) · ⛔ mắt xám |
| 28 | *But not one skeleton, one grave, or one piece of solid archaeological proof…* | C1-31, C1-32 | — | ❌ nhà khảo cổ đang đào (lời kể không nêu cuộc đào; C1-32 đã gánh) · ⛔ bộ xương |
| 29 | *Not to this day.* | — | ➕ di tích Fort Raleigh ngày nay (có ảnh `03-fort-raleigh-*`) | — |

Tổng: 36 shot hiện có + **10 ➕** ≈ **46 shot**. Trong đó **5 bản đồ** (C1-01c + 4 ➕), cả năm đều cần bản đồ trống
tư liệu trước khi chạy.

**v3 (D09):** 9 shot đã có bỏ nét mặt hoặc dáng người truyền tâm trạng không có nguồn — C1-04, C1-06, C1-08, C1-10,
C1-15, C1-19, C1-26, C1-27, C1-28. **Giữ** C1-21 (lời kể: *"that looked like good news"*). C1-04 và C1-06 **đã tạo ảnh**
nên đổi `outName` để tạo lại; ảnh cũ vẫn nằm trên Flow dưới tên cũ.

---

## 7. Đối chiếu luật đã có

| Luật mới | Đụng | Xử lý |
|---|---|---|
| Mục 4 (thứ tự quyết định + trùng chức năng) | skill 4d "Điều kiện chặn" `:283–286`, cột "Không áp khi" `:292–299`, đoạn Gaviria `:324–327`, câu rà 10 | theo bảng mục 4 |
| Mục 5a–5b (vẽ bản đồ, cờ) | skill 4c câu trùm `:215–216` và dòng "Địa lý" `:237` | câu trùm thành: *"…Ảnh thật, logo hiện đại, icon, mũi tên, nhãn chữ, bóng thoại là hậu kỳ. **Ngoại lệ: bản đồ và cờ thời kỳ** do Nano Banana vẽ trơn không chữ (4d-bis); nhãn, mũi tên, chấm trên bản đồ vẫn là hậu kỳ."* Dòng `:237` thành *"bản đồ vẽ theo bản đồ trống tư liệu, vùng được nhắc tô đỏ; nhãn + mũi tên hậu kỳ"* |
| Mục 5a chip bản đồ | SPEC-v2 §6: ảnh thật lên Flow **chỉ nơi chốn đặc biệt** | **mở rộng tường minh** sang bản đồ trống không chữ |
| Mục 5b cờ | skill 4c dòng "Mở đầu một case … icon/logo tổ chức" | cờ thời kỳ cổ vẽ; logo hiện đại vẫn hậu kỳ |
| Mục 5e `choTuLieu` | SPEC-v2 §5c bảng trường | thêm trường |
| `C1-01b` thuyền cập bờ | SHOT-LIST luật 2 / SPEC-v2 §3: cấm định vị tương đối giữa hai vật rời | Gemini r1 gọi là lách luật. Giữ: luật 2 cấm để hậu kỳ **tự ghép hai vật rời**; "thuyền cập bờ" tách thành "thuyền" + "bãi" thì mất nghĩa — đúng loại ngoại lệ SHOT-LIST đã tự ghi (`A1-13` *"cái xác trên mái nhà bếp: vị trí là toàn bộ nội dung"*). Cát chỉ là mép dưới thân thuyền, không phải bố cục bãi biển. Codex r1 chấp nhận |
| Nhiều shot chung `at` | SPEC-v2 §5b-bis | hợp lệ **chỉ** cho kịch bản trong `narration-scripts/`; video có VTT giữ mốc thời gian (Codex r1) |

---

## 8. Sẽ chép vào đâu (khi luồng `settled`)

- Mục 1, 3, 4 → skill **mục 4d-bis mới "Mỗi câu → ô ảnh"**, ngay sau 4d. Xoá đoạn "Điều kiện chặn" `:283–286`, sửa
  cột "Không áp khi" của luật 2, 3, 5 và đoạn Gaviria theo bảng mục 4, sửa câu rà 10.
- Mục 5a–5c → skill **mục 4c** (câu trùm, dòng "Địa lý", thêm dòng "Quốc gia / tổ chức", "Cụm khái niệm").
- Mục 5a chip bản đồ → SPEC-v2 §6. Mục 5e → SPEC-v2 §5c.
- Bản đồ trống, ảnh cờ thời kỳ, ảnh vật thời kỳ cho ô 3–4 → skill `case-reference-images` §2 (bảng "Tìm gì").
- Giữ nguyên phần ảnh neo của luồng `img-skill-a1-lessons` khi sửa mục 4d.
- Nét mặt trung tính (mục 3, D09) → bảng giới hạn cứng của 4d-bis. `styleByKind` giữ nguyên — nó chỉ tả **hình thức**
  mặt đơn giản, không tả trạng thái (skill 4d-9c).
