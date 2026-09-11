# Danh sách ảnh cần vẽ — 2 video Brofessor Stein

Artifact của luồng `img-prompts-brofessor-2video` (bước 5). Nguồn đọc:
`input/style-ref/brofessor-stein/<id>/transcript.md`.

## Luật của danh sách này

1. **Một dòng = một phần tử rời sẽ đưa lên màn hình.** Không phải một cảnh
   dựng sẵn. Tú ghép, canh vị trí, thêm mũi tên và nhãn chữ ở hậu kỳ.
2. **Cột `vẽ gì` là prompt thô, tiếng Anh, ngắn.** Danh từ + vài chữ bổ nghĩa.
   Không tả bố cục, không tả nền, không tả phong cách — khối style được nối vào
   sau bằng `scripts/build_image_prompts.py`. Cấm luôn **định vị tương đối**
   (`behind`, `next to`, `on a ... road`, `in a clearing`): nó ép model ghép sẵn
   hai vật, đúng thứ hậu kỳ cần tự làm. Hai vật thì hai dòng. Bổ nghĩa chỉ được
   tả *chính cái vật đó* — `covered in ice`, `with its trunk open` thì được, vì
   nó nói về vật, không phải về chỗ vật đứng.
3. **Không viết chữ vào ảnh.** Tên người, ngày tháng, số đo là chữ đặt ở hậu
   kỳ. Model vẽ chữ sai chính tả, và kiểu vẽ cố tình xấu này càng sai. Vật nào
   mà đặc trưng nhận diện chính là chữ — bản đồ, lịch, bảng giá, sổ sách,
   brochure, biển báo, nút bấm — thì prompt **phải** kèm `blank`, `no text`
   hoặc `unlabeled`. Không dựa vào luật viết ở đây: chỉ cột `vẽ gì` mới đi vào
   prompt thật.
4. **Mũi tên, dấu chấm hỏi, dấu X đỏ, đường đo kích thước là đồ hoạ hậu kỳ,
   không phải ảnh.** Video gốc dùng mũi tên vector đen sạch, không phải nét vẽ
   (xem `sheets/sheet_01.jpg`). Prompt không được gọi chúng ra.
5. **So sánh kích thước tách thành hai dòng.** "A cạnh B để so kích thước" ép
   sẵn bố cục và khoá luôn tỉ lệ. Vẽ A một dòng, B một dòng, Tú tự đặt cạnh
   nhau và tự chỉnh cỡ.
6. **Không vẽ chân dung người thật.** Video gốc **dán ảnh tư liệu thật** cho
   người có thật (Reles, Escobar, Kuklinski, Popeye) và chỉ vẽ minh hoạ cho
   phần diễn lại. Cột `vẽ gì` luôn là người chung chung, không phải chân dung
   nhận ra được ai. Ảnh tư liệu thật thì Tú dán ở hậu kỳ.
7. **Nhóm người trong một hình thì được**, nếu đó là một hành động chung. Video
   gốc có sẵn kiểu này: hai cảnh sát đứng nói chuyện, ba người trao một thùng
   hàng. Cái bị cấm ở luật 1 là *bối cảnh cả khu vực* và *hàng icon ghép sẵn*,
   không phải mọi hình có hơn một người.
8. **Mốc thời gian để căn, không phải để cắt chính xác.** Sai số ±3 giây:
   transcript gộp khối 15 giây.

### ⚠️ Hai điểm luồng review không hội tụ — chờ Tú quyết

Luồng `img-prompts-brofessor-2video` chạm trần 3 vòng và đóng ở trạng thái
`blocked`. **D16 đã nhận và sửa** (cả Codex lẫn Gemini cùng nêu). **D17 chỉ
nhận một phần** — Gemini đòi bỏ *mọi* giới từ định vị trong 21 dòng; tôi bỏ 5
dòng mà phần nền chỉ là cái đuôi thừa, và **giữ 16 dòng còn lại**, vì ở những
dòng đó chính cái quan hệ mới là bức ảnh:

- `A9-04` bốn người *sau song sắt* — tách ra thì được "bốn người" và "song sắt",
  ghép lại không ra nghĩa bị giam.
- `A1-13` cái xác *trên mái nhà bếp* — vị trí là toàn bộ nội dung đoạn đó.
- `B15-02` khối cầu *đặt trong bệ tròn* — đó là hình dáng công trình, không
  phải hai vật.
- `B3-13` khối bê tông *có khe hở dưới một cạnh* — khe hở chính là kết quả thử
  tải đang được kể.
- `A10-09` bàn *có hai ly* · `B12-04` đỉnh toà nhà *trên mây* · `B11-03` cột
  *cắm xuống đáy biển* — cùng lý do.

Luật 2 cấm định vị tương đối để chống *ghép sẵn hai vật rời*. Khi hai phần
không tách rời được mà vẫn giữ nghĩa thì đó là **một vật**, không phải một bố
cục. Tú thấy nên siết tiếp thì sửa 16 dòng đó, danh sách đầy đủ nằm ở
`coordination/threads/img-prompts-brofessor-2video/r3-02-review-gemini.md`.

---

Mật độ nhắm tới: một ảnh mỗi 5–8 giây, bám theo video gốc.

---

## Video A — How History's Deadliest Hitmen Died

`nRiezhIOHH0` · 16:16 · 16 nhân vật/nhóm

### A1 · Abe Reles (0:00–1:19)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A1-01 | 0:00 | a 1930s gangster in a pinstripe suit and fedora |
| A1-02 | 0:05 | a group of men in 1930s suits standing shoulder to shoulder |
| A1-03 | 0:09 | an ice pick |
| A1-04 | 0:12 | a man's head seen from the side with an ice pick at his ear |
| A1-05 | 0:17 | a doctor writing on a clipboard with a blank unlined sheet |
| A1-06 | 0:22 | a grid of small mugshot portraits with blank name boards |
| A1-07 | 0:26 | an empty electric chair |
| A1-08 | 0:29 | a man in a suit raising his right hand to swear an oath |
| A1-09 | 0:34 | seven men in 1930s suits standing in a line |
| A1-10 | 0:38 | a lawyer in a suit carrying a thick folder |
| A1-11 | 0:42 | a tall 1930s seaside hotel building |
| A1-12 | 0:46 | a police officer standing guard beside a closed door |
| A1-13 | 0:50 | a body lying face down on a flat rooftop |
| A1-14 | 0:55 | a rope made of knotted bedsheets |
| A1-15 | 0:59 | a cast iron radiator |
| A1-16 | 1:03 | a man falling through the air |
| A1-17 | 1:08 | a police officer asleep in a chair |
| A1-18 | 1:14 | a thick bundle of banknotes |

### A2 · John Jairo Velásquez "Popeye" (1:19–2:08)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A2-01 | 1:19 | a man in a leather jacket holding a pistol |
| A2-02 | 1:24 | a stack of banknotes wrapped in plastic |
| A2-03 | 1:28 | a black square cartel emblem badge with a razor blade in the centre, no text |
| A2-04 | 1:32 | a police cap |
| A2-05 | 1:33 | a judge's gavel |
| A2-06 | 1:34 | a press camera |
| A2-07 | 1:35 | a handheld microphone |
| A2-08 | 1:36 | a car with a bomb wired inside the open trunk |
| A2-09 | 1:40 | a passenger jet airliner |
| A2-10 | 1:45 | a man in a suit standing at a campaign podium |
| A2-11 | 1:50 | a telephone handset left off the hook |
| A2-12 | 1:55 | a man in handcuffs walking between two soldiers |
| A2-13 | 2:00 | a smartphone on a tripod recording |
| A2-14 | 2:03 | a blank rounded rectangular button and a play triangle icon, no text |
| A2-15 | 2:06 | a man lying in a hospital bed |

### A3 · Richard "The Iceman" Kuklinski (2:08–3:11)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A3-01 | 2:10 | a very large bald man with a beard in a work shirt |
| A3-02 | 2:15 | a blank unlabeled map of the United States with New Jersey shaded |
| A3-03 | 2:20 | a long row of chalk tally marks on a wall |
| A3-04 | 2:26 | an old boxy ice cream delivery truck |
| A3-05 | 2:31 | a block of ice with a dark shape frozen inside |
| A3-06 | 2:36 | a wall clock with no numbers on its face |
| A3-07 | 2:41 | a nasal spray bottle |
| A3-08 | 2:46 | two men passing each other on a sidewalk |
| A3-09 | 2:51 | a man wearing a hidden wire under his open jacket |
| A3-10 | 2:57 | a prison building |
| A3-11 | 3:02 | a hospital bed with a heart monitor beside it |
| A3-12 | 3:08 | a small glass vial with a skull symbol on the label, no text |

### A4 · Roy DeMeo (3:11–4:16)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A4-01 | 3:11 | a heavyset man in a leather jacket and gold chain |
| A4-02 | 3:16 | a small corner bar with a blank unlit neon sign, no text |
| A4-03 | 3:22 | a crowd of small identical silhouette figures |
| A4-04 | 3:28 | a factory conveyor belt |
| A4-05 | 3:33 | a rolled up bath towel |
| A4-06 | 3:38 | an empty bathtub with a drain |
| A4-07 | 3:43 | a handsaw |
| A4-08 | 3:47 | a stack of small parcels wrapped in brown paper |
| A4-09 | 3:51 | a row of garbage bins |
| A4-10 | 3:57 | a man in a suit talking to an agent in a dark windbreaker |
| A4-11 | 4:03 | a large 1970s American car with its trunk open |
| A4-12 | 4:09 | snow covered asphalt with painted parking bay lines |

### A5 · Giuseppe "Pino" Greco (4:16–5:07)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A5-01 | 4:16 | a young man in a 1980s open collar shirt holding a rifle |
| A5-02 | 4:21 | a blank unlabeled map of Sicily |
| A5-03 | 4:26 | an assault rifle |
| A5-04 | 4:31 | a car with bullet holes across the side |
| A5-05 | 4:36 | a stone building facade with wrought iron balconies |
| A5-06 | 4:41 | a briefcase with a bomb inside |
| A5-07 | 4:46 | a large country villa with a walled garden |
| A5-08 | 4:51 | a man watering plants with a garden hose |
| A5-09 | 4:56 | two men walking through a garden gate |
| A5-10 | 5:01 | a metal oil drum |

### A6 · Harry "Pittsburgh Phil" Strauss (5:07–5:55)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A6-01 | 5:07 | a well dressed man in a 1930s double breasted suit |
| A6-02 | 5:12 | a steam train |
| A6-03 | 5:17 | a small leather travel bag |
| A6-04 | 5:20 | a coil of rope |
| A6-05 | 5:22 | a meat cleaver |
| A6-06 | 5:26 | a courtroom witness stand |
| A6-07 | 5:32 | a jury box with twelve seated figures |
| A6-08 | 5:37 | a man chewing the leather strap of a briefcase |
| A6-09 | 5:43 | a judge's gavel |
| A6-10 | 5:48 | a heavy studded prison door |
| A6-11 | 5:52 | an electric chair with a lever beside it |

### A7 · "Machine Gun" Jack McGurn (5:55–6:45)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A7-01 | 5:55 | a young man in a 1920s suit holding a tommy gun |
| A7-02 | 5:59 | a pair of boxing gloves |
| A7-03 | 6:04 | a row of men lined up facing a brick wall |
| A7-04 | 6:09 | men in police uniforms holding tommy guns |
| A7-05 | 6:14 | a brick garage with a wide door |
| A7-06 | 6:19 | a newspaper front page with a blank headline area, no text |
| A7-07 | 6:24 | a hotel room door with a blank hanging tag on the handle, no text |
| A7-08 | 6:29 | a wedding ring on a finger |
| A7-09 | 6:33 | a prison island surrounded by water |
| A7-10 | 6:38 | a bowling lane with pins at the end |
| A7-11 | 6:42 | a bowling ball |
| A7-12 | 6:44 | a folded paper card with a heart drawn on the front, no text |

### A8 · Greg Scarpa (6:45–7:34)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A8-01 | 6:47 | a thin older man in a tracksuit |
| A8-02 | 6:52 | a hooded figure holding a scythe |
| A8-03 | 6:57 | a brown envelope stuffed with cash |
| A8-04 | 7:02 | an agent in a dark suit turning his back |
| A8-05 | 7:08 | a shovel stuck in a patch of dirt |
| A8-06 | 7:13 | a patch of swampy ground with reeds |
| A8-07 | 7:19 | two groups of men facing each other |
| A8-08 | 7:24 | a man wearing a black eye patch |
| A8-09 | 7:28 | a telephone on a small side table |
| A8-10 | 7:31 | a blood transfusion bag on a stand |

### A9 · Joe "The Animal" Barboza (7:34–8:37)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A9-01 | 7:36 | a broad shouldered man in a 1960s suit with fists raised |
| A9-02 | 7:42 | a pair of bare clenched fists |
| A9-03 | 7:48 | a man in a suit alone at a witness table |
| A9-04 | 7:54 | four men standing behind prison bars |
| A9-05 | 8:00 | two gravestones side by side with blank faces, no text |
| A9-06 | 8:05 | an identity card with a blank photo square and blank ruled lines, no text |
| A9-07 | 8:10 | a small suburban house with palm trees |
| A9-08 | 8:15 | a reporter holding out a microphone |
| A9-09 | 8:20 | a hardcover book with a blank cover, no text |
| A9-10 | 8:25 | a paper grocery bag being loaded into a car trunk |
| A9-11 | 8:30 | a white panel van |
| A9-12 | 8:35 | a shotgun |

### A10 · Alexander Solonik (8:37–9:43)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A10-01 | 8:39 | a lean young man in a 1990s leather jacket |
| A10-02 | 8:45 | a paper shooting target with plain rings and no numbers |
| A10-03 | 8:50 | a row of men in fur hats and long coats |
| A10-04 | 8:55 | a man aiming two pistols, one in each hand |
| A10-05 | 9:01 | a concrete tower block apartment building under snow |
| A10-06 | 9:06 | a pair of open handcuffs |
| A10-07 | 9:11 | a barred prison window with a bedsheet rope hanging out |
| A10-08 | 9:17 | a blank unlabeled map of Greece |
| A10-09 | 9:22 | a garden table with two drinks on it |
| A10-10 | 9:28 | a coil of thin nylon cord |
| A10-11 | 9:34 | a heap of rubbish bags |
| A10-12 | 9:40 | a closed suitcase |

### A11 · Gonzalo Inzunza (9:43–10:49)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A11-01 | 9:45 | a man in a baseball cap seen from behind |
| A11-02 | 9:51 | a blank unlabeled map of Mexico |
| A11-03 | 9:57 | a row of police caps |
| A11-04 | 10:03 | a blank sheet of paper with an official wax seal at the bottom, no text |
| A11-05 | 10:09 | an empty photo frame with a plain grey silhouette inside |
| A11-06 | 10:14 | a convoy of armoured pickup trucks |
| A11-07 | 10:20 | a low beachfront hotel building |
| A11-08 | 10:26 | a small house with the lights on inside |
| A11-09 | 10:32 | marines in helmets moving in a line |
| A11-10 | 10:38 | a bedroom door standing open |
| A11-11 | 10:44 | a blank wall calendar grid with no numbers or text |

### A12 · José Rodrigo Arechiga "El Chino Ántrax" (10:49–11:39)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A12-01 | 10:51 | a young man in sunglasses and a designer tracksuit |
| A12-02 | 10:56 | a squad of men in matching black tactical gear |
| A12-03 | 11:01 | a smartphone showing a grid of photos |
| A12-04 | 11:06 | a tiger on a leash |
| A12-05 | 11:10 | a gold plated rifle |
| A12-06 | 11:15 | an airport departures board with blank empty rows, no text |
| A12-07 | 11:20 | a man in a suit signing a blank sheet of paper across a table |
| A12-08 | 11:25 | an ankle monitor bracelet cut open |
| A12-09 | 11:31 | a large black luxury SUV |
| A12-10 | 11:36 | three empty car seats |

### A13 · Locusta of Gaul (11:39–12:48)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A13-01 | 11:41 | a woman in a Roman tunic holding a small clay bottle |
| A13-02 | 11:47 | a workshop shelf of clay jars and bundled herbs |
| A13-03 | 11:53 | a mortar and pestle |
| A13-04 | 11:59 | a sprig of dark berries |
| A13-05 | 12:05 | an hourglass |
| A13-06 | 12:11 | a Roman woman in an elaborate hairstyle and jewellery |
| A13-07 | 12:17 | a bowl of mushrooms |
| A13-08 | 12:23 | a laurel crown |
| A13-09 | 12:29 | a Roman banquet couch and low table |
| A13-10 | 12:35 | a goblet of wine tipping over |
| A13-11 | 12:41 | a woman in a Roman tunic in chains being led by two guards |
| A13-12 | 12:46 | a Roman amphitheatre arena |

### A14 · The Sicarii (12:48–13:52)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A14-01 | 12:50 | a man in a hooded cloak |
| A14-02 | 12:56 | a short curved dagger |
| A14-03 | 13:02 | a dagger hidden under the fold of a cloak |
| A14-04 | 13:08 | a crowd of people in ancient robes packed close together |
| A14-05 | 13:14 | a hooded figure disappearing into a crowd |
| A14-06 | 13:20 | Roman soldiers with shields in formation |
| A14-07 | 13:26 | an ancient city wall on fire |
| A14-08 | 13:32 | a flat topped desert mountain |
| A14-09 | 13:38 | a siege ramp built against a cliff |
| A14-10 | 13:44 | a hand drawing one short straw from a fist |
| A14-11 | 13:49 | an empty stone fortress gateway |
| A14-12 | 13:51 | a stone water cistern |

### A15 · The Hashashin (13:52–15:12)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A15-01 | 13:55 | a man in a white robe with a dark sash |
| A15-02 | 14:01 | a mountain fortress on a rock spire |
| A15-03 | 14:07 | a blank unlabeled map of Persia and Syria with small fortress markers on it |
| A15-04 | 14:13 | a young man practising with a dagger |
| A15-05 | 14:19 | a row of different costumes on hooks |
| A15-06 | 14:25 | a ruler on a throne with guards around him |
| A15-07 | 14:31 | a crowd of courtiers in rich robes |
| A15-08 | 14:37 | a lone figure surrounded by pointing guards |
| A15-09 | 14:43 | a crusader knight's helmet |
| A15-10 | 14:49 | a man sleeping in chain mail armour |
| A15-11 | 14:55 | a horseman with a bow |
| A15-12 | 15:01 | a wooden siege catapult |
| A15-13 | 15:08 | a fortress gate standing open with a plain white flag |

### A16 · Julio Santana (15:12–16:16)

| # | mốc | vẽ gì |
| --- | --- | --- |
| A16-01 | 15:14 | an old man in a straw hat and worn shirt |
| A16-02 | 15:20 | a wide jungle river |
| A16-03 | 15:26 | a small open notebook filled with tally marks and no writing |
| A16-04 | 15:32 | a teenage boy and an older man walking into the trees |
| A16-05 | 15:38 | a revolver |
| A16-06 | 15:43 | a hunting rifle resting on the edge of a canoe |
| A16-07 | 15:48 | a canoe on still water |
| A16-08 | 15:53 | two hands folded in prayer |
| A16-09 | 15:58 | a small wooden church |
| A16-10 | 16:03 | a journalist with a notebook and a recorder |
| A16-11 | 16:08 | a paperback book with a blank cover, no text |
| A16-12 | 16:13 | a fisherman casting a net from a boat |

---

## Video B — The Most Insane Engineering Projects That Almost Happened

`_jT8g9SjUN8` · 17:52 · 16 dự án

> **Tên mục lấy theo cách video gốc gọi, không phải theo tên chuẩn trong sử
> liệu.** Phụ đề tự động làm méo gần hết tên riêng, tôi khôi phục lại theo dạng
> tôi tin là đúng. Chỗ nào tên video gốc có khả năng lẫn với một công trình
> khác thì ghi chú ngay dưới tiêu đề mục.

### B1 · Atlantropa (0:01–1:27)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B1-01 | 0:01 | a 1920s architect in a suit holding rolled drawings |
| B1-02 | 0:07 | a blank unlabeled map of the Mediterranean sea |
| B1-03 | 0:13 | a huge concrete dam across a narrow strait |
| B1-04 | 0:20 | a second dam across a narrow channel |
| B1-05 | 0:26 | a sun over open water with rising wisps of vapour |
| B1-06 | 0:32 | a shoreline with the water level dropped far below it |
| B1-07 | 0:38 | a patchwork of farm fields |
| B1-08 | 0:44 | two islands joined to a mainland by new land |
| B1-09 | 0:50 | a dry empty canal channel |
| B1-10 | 0:56 | a railway line crossing from one continent to another |
| B1-11 | 1:03 | a hydroelectric turbine |
| B1-12 | 1:10 | a stack of hardcover books with blank covers, no text |
| B1-13 | 1:14 | a blank poster on a wooden lecture stand, no text |
| B1-14 | 1:17 | a bicycle knocked over |
| B1-15 | 1:23 | a calm sea with nothing built on it |

### B2 · The Palace of the Soviets (1:27–2:34)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B2-01 | 1:27 | a large domed cathedral |
| B2-02 | 1:33 | a building collapsing in a demolition blast |
| B2-03 | 1:39 | a pile of rubble with trucks beside it |
| B2-04 | 1:45 | a tall stepped tower topped by a standing statue |
| B2-05 | 1:51 | a 1930s stepped art deco skyscraper with a spire |
| B2-06 | 1:56 | a giant statue of a man with one arm raised |
| B2-07 | 2:01 | a city bus seen from the side |
| B2-08 | 2:03 | a giant pointing hand with one index finger extended |
| B2-09 | 2:06 | rows of seats in an enormous auditorium |
| B2-10 | 2:11 | a steel building frame under construction |
| B2-11 | 2:16 | a flooded foundation pit |
| B2-12 | 2:21 | a railway bridge made of riveted steel |
| B2-13 | 2:27 | a huge round outdoor swimming pool with steam rising |
| B2-14 | 2:32 | a newly built domed cathedral |

### B3 · Germania (2:34–3:56)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B3-01 | 2:36 | a building being demolished |
| B3-02 | 2:42 | a city plan with two wide boulevards crossing, no text |
| B3-03 | 2:48 | an enormous domed hall the size of a hill |
| B3-04 | 2:54 | an architect bent over a huge scale model |
| B3-05 | 3:00 | a large domed basilica |
| B3-06 | 3:06 | a vast crowd packed into one hall |
| B3-07 | 3:13 | clouds forming under an interior ceiling |
| B3-08 | 3:19 | rain falling indoors |
| B3-09 | 3:26 | a giant triumphal arch |
| B3-10 | 3:32 | an ornate stone triumphal arch |
| B3-11 | 3:38 | soft marshy ground with water pooling |
| B3-12 | 3:44 | a massive plain concrete cylinder on the ground |
| B3-13 | 3:50 | a concrete block resting on soil with a thin gap beneath one edge |

### B4 · Con voi ở quảng trường Bastille (3:56–5:04)

> Video gốc gọi mục này là "The Triumphal Elephant", nhưng nội dung kể là
> **Elephant of the Bastille** (Napoleon, 1808). *L'éléphant triomphal* là một
> dự án khác, của Charles-François Ribart, 1758. Phần cầu thang xoắn trong
> chân, phòng khiêu vũ và tai làm loa là **do video gốc nói**; danh sách này
> minh hoạ video, không phán xử video đúng hay sai — xem D04.

| # | mốc | vẽ gì |
| --- | --- | --- |
| B4-01 | 3:58 | a flat empty area of cobblestone paving |
| B4-02 | 4:04 | a short man in a bicorne hat and military coat |
| B4-03 | 4:10 | a giant bronze elephant statue |
| B4-04 | 4:16 | a small two storey townhouse |
| B4-05 | 4:22 | a pile of captured cannons |
| B4-06 | 4:27 | water pouring from an elephant trunk |
| B4-07 | 4:32 | a spiral staircase inside a column |
| B4-08 | 4:37 | a ballroom with a small orchestra |
| B4-09 | 4:42 | an elephant ear shaped like a megaphone |
| B4-10 | 4:47 | an empty treasury chest |
| B4-11 | 4:52 | a cracked plaster statue with rats around it |
| B4-12 | 4:58 | a tall commemorative column |

### B5 · The Pyramid of Death (5:04–6:10)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B5-01 | 5:06 | a tight cluster of weathered blank headstones, no text |
| B5-02 | 5:12 | soil with coffins pushing up out of it |
| B5-03 | 5:18 | an architect at a drawing board |
| B5-04 | 5:23 | a gigantic brick and granite pyramid |
| B5-05 | 5:28 | a rounded green hill |
| B5-06 | 5:33 | a marked out sports field seen from above |
| B5-07 | 5:38 | a cutaway pyramid full of stacked burial vaults |
| B5-08 | 5:43 | a long sloping ramp inside a building |
| B5-09 | 5:48 | an old hydraulic lift platform |
| B5-10 | 5:54 | an astronomical observatory dome |
| B5-11 | 6:00 | a family having a picnic on a hillside |
| B5-12 | 6:06 | a hill cracking under a heavy weight |

### B6 · Tatlin's Tower (6:10–7:12)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B6-01 | 6:12 | an artist in a workshop coat |
| B6-02 | 6:18 | a leaning double spiral of iron girders |
| B6-03 | 6:24 | a tall iron lattice tower |
| B6-04 | 6:29 | a globe on a tilted axis |
| B6-05 | 6:34 | a glass cube hanging inside a frame |
| B6-06 | 6:38 | a glass pyramid hanging inside a frame |
| B6-07 | 6:43 | a glass cylinder hanging inside a frame |
| B6-08 | 6:48 | a glass hemisphere with a radio antenna on top |
| B6-09 | 6:53 | a projector beaming a wide beam of light |
| B6-10 | 6:59 | a cold empty industrial furnace |
| B6-11 | 7:05 | a small wooden model of a tower in a room |
| B6-12 | 7:10 | a rubber stamp and an ink pad |

### B7 · The Trans-Saharan Railway (7:12–8:01)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B7-01 | 7:14 | a blank unlabeled map of north and west Africa |
| B7-02 | 7:20 | surveyors with a tripod in the desert |
| B7-03 | 7:26 | an open ledger book with blank ruled pages, no writing |
| B7-04 | 7:31 | a thermometer with the mercury near the top and no numbers |
| B7-05 | 7:36 | an empty freight wagon |
| B7-06 | 7:41 | a barbed wire camp fence with a watchtower |
| B7-07 | 7:47 | a crowded train of prisoners |
| B7-08 | 7:52 | men laying railway sleepers in sand |
| B7-09 | 7:57 | a railway track ending abruptly in sand |

### B8 · The Bering Strait Dam (8:01–9:24)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B8-01 | 8:03 | a Soviet engineer in a heavy coat holding a blueprint |
| B8-02 | 8:09 | an arctic ice sheet |
| B8-03 | 8:15 | a long concrete dam across a strait between two continents |
| B8-04 | 8:21 | giant pumps built into a dam wall |
| B8-05 | 8:27 | a radiation symbol on a machine housing |
| B8-06 | 8:33 | a cross section of ocean water in two shades of blue |
| B8-07 | 8:39 | melting ice caps dripping |
| B8-08 | 8:44 | a snowy plain turning into farm fields |
| B8-09 | 8:50 | a cargo ship on an open polar sea route |
| B8-10 | 8:56 | a large blank price tag with no numbers or text |
| B8-11 | 9:02 | two plain unmarked flags on poles |
| B8-12 | 9:09 | an old European townhouse covered in ice |
| B8-13 | 9:16 | a conference hall with a small audience |

### B9 · The Illinois (9:24–10:15)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B9-01 | 9:26 | an elderly architect in a cape and hat |
| B9-02 | 9:31 | a blank drawing sheet taller than the man holding it, no text |
| B9-03 | 9:36 | an extremely tall thin needle shaped skyscraper |
| B9-04 | 9:41 | a 1930s stepped art deco skyscraper with a spire |
| B9-05 | 9:46 | a huge underground parking garage full of cars |
| B9-06 | 9:51 | helicopters landing on a tower roof |
| B9-07 | 9:56 | an elevator car with a small reactor symbol on the door |
| B9-08 | 10:01 | a mouse |
| B9-09 | 10:06 | a blank unsigned contract on a desk, no text |
| B9-10 | 10:11 | a modern glass tower tapering to a spire |

### B10 · The Manhattan Dome (10:15–11:20)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B10-01 | 10:17 | an old man holding a geodesic sphere model |
| B10-02 | 10:23 | a glass dome over a city skyline |
| B10-03 | 10:29 | a blank unlabeled map of Manhattan between two rivers, no text |
| B10-04 | 10:35 | snow melting on a curved glass surface |
| B10-05 | 10:41 | heating wires embedded in a panel |
| B10-06 | 10:47 | a window air conditioner unit |
| B10-07 | 10:53 | a smog cloud passing through a filter |
| B10-08 | 10:59 | a snow plough truck |
| B10-09 | 11:05 | birds flying towards a glass surface |
| B10-10 | 11:11 | a city view seen through a metal grid |
| B10-11 | 11:17 | a modern stadium dome |

### B11 · The Shimizu Mega Pyramid (11:20–12:26)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B11-01 | 11:22 | a giant open steel frame pyramid |
| B11-02 | 11:28 | an ancient stone pyramid in the desert |
| B11-03 | 11:34 | thick concrete pillars sunk into a seabed |
| B11-04 | 11:40 | small skyscrapers hanging from cables inside a frame |
| B11-05 | 11:46 | solar panels covering a sloped surface |
| B11-06 | 11:52 | green algae tanks |
| B11-07 | 11:58 | a small automated pod on a rail |
| B11-08 | 12:04 | construction robots assembling a frame |
| B11-09 | 12:10 | a tiny glass sample vial holding a few grams of black powder |
| B11-10 | 12:16 | a large blank price tag with no numbers or text |
| B11-11 | 12:22 | a typhoon spiral over a coastline |

### B12 · X-Seed 4000 (12:26–13:17)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B12-01 | 12:28 | a cone shaped tower like a smooth mountain |
| B12-02 | 12:34 | a snow capped volcanic mountain |
| B12-03 | 12:40 | a wide artificial mountain base in the sea |
| B12-04 | 12:46 | a building top poking above the clouds |
| B12-05 | 12:52 | a cutaway tower with many stacked floors |
| B12-06 | 12:58 | a sealed pressurised room door |
| B12-07 | 13:04 | a person wearing an oxygen mask |
| B12-08 | 13:09 | a rain cloud forming inside a building |
| B12-09 | 13:14 | a glossy folded brochure with blank pages, no text |

### B13 · The Freedom Ship (13:17–14:23)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B13-01 | 13:19 | an engineer looking up at a cruise ship |
| B13-02 | 13:25 | an extremely long flat ship like a floating city |
| B13-03 | 13:31 | an ordinary cruise ship seen from the side |
| B13-04 | 13:36 | a globe with a circular route drawn around it |
| B13-05 | 13:41 | a small hospital building with a cross on it |
| B13-06 | 13:44 | a park bench |
| B13-07 | 13:46 | a row of shop fronts |
| B13-08 | 13:51 | a stadium |
| B13-09 | 13:56 | a private jet on a short runway |
| B13-10 | 14:01 | a large blank price tag with no numbers or text |
| B13-11 | 14:07 | two stone piers forming a narrow gap |
| B13-12 | 14:13 | a radiation symbol on a ship hull |
| B13-13 | 14:19 | a pile of blank folded brochures, no text |

### B14 · The Earthscraper (14:23–15:44)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B14-01 | 14:25 | a wide flat expanse of stone paving |
| B14-02 | 14:31 | ancient stone ruins under the ground |
| B14-03 | 14:37 | an upside down pyramid dug into the earth |
| B14-04 | 14:43 | a cutaway of a deep pit with many floors |
| B14-05 | 14:49 | a glass floor covering a square |
| B14-06 | 14:55 | a marching parade band |
| B14-07 | 15:01 | sunlight shining down through a glass floor |
| B14-08 | 15:07 | a museum display case with a stone carving |
| B14-09 | 15:13 | stacked floors of shops, apartments and offices |
| B14-10 | 15:19 | soft wet soil with a building sinking into it |
| B14-11 | 15:25 | a leaning cathedral |
| B14-12 | 15:31 | water seeping into the bottom of a deep pit |
| B14-13 | 15:38 | a crowd climbing a single long stairway |

### B15 · Newton's Cenotaph (15:44–16:48)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B15-01 | 15:46 | an 18th century architect with a quill and a drawing |
| B15-02 | 15:52 | an enormous stone sphere set in a round base |
| B15-03 | 15:58 | a ring of cypress trees around a monument |
| B15-04 | 16:04 | a great stone pyramid |
| B15-05 | 16:10 | a tiny sarcophagus alone in a vast empty interior |
| B15-06 | 16:16 | small holes drilled through a curved ceiling |
| B15-07 | 16:22 | a dome interior lit like a night sky |
| B15-08 | 16:28 | a person standing alone looking up |
| B15-09 | 16:34 | a folder of drawings on an archive shelf |
| B15-10 | 16:41 | a heavy stone government building |

### B16 · The Coney Island Globe Tower (16:48–17:52)

| # | mốc | vẽ gì |
| --- | --- | --- |
| B16-01 | 16:50 | a man in an early 1900s suit making an announcement |
| B16-02 | 16:56 | a giant steel globe standing on tall stilts |
| B16-03 | 17:02 | a wooden boardwalk with a striped awning stall |
| B16-04 | 17:08 | a cutaway globe packed with different floors |
| B16-05 | 17:13 | a hotel lobby desk |
| B16-06 | 17:18 | a ballroom with a chandelier |
| B16-07 | 17:20 | a bowling lane with pins at the end |
| B16-08 | 17:22 | a roller skating rink |
| B16-09 | 17:25 | a casino table |
| B16-10 | 17:28 | a long banquet table set with plates |
| B16-11 | 17:33 | a rooftop observatory with a telegraph mast |
| B16-12 | 17:38 | a plain ceremonial cornerstone block with no inscription |
| B16-13 | 17:43 | investors handing over money |
| B16-14 | 17:48 | a ferris wheel |
