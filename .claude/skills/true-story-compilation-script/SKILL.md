---
name: true-story-compilation-script
description: Write long-form English YouTube narration scripts in the "compilation" format — several independent true-story cases assembled into one 15-18 minute video, each case told FULLY as a proper story from beginning to end in a warm conversational storyteller voice. Topics vary per video (paranormal cases, unexplained disappearances, strange crimes, survival, disasters...). Roughly 5-6 fully-told cases fills the runtime. Draft always written in Vietnamese first for manual review, then rewritten (not literally translated) into English for TTS narration. Use when the user wants topic ideas for this channel, wants a new episode script, or wants an approved Vietnamese draft turned into an English narration script.
---

# Kịch bản tuyển tập chuyện có thật (Vietnamese draft → English narration)

Skill này ghi lại quy trình + công thức viết cho 1 kênh YouTube tiếng Anh, dạng
**tuyển tập (compilation)**: mỗi video gồm nhiều vụ việc CÓ THẬT độc lập nhau,
cùng thuộc 1 chủ đề chung.

> ⚠️ **FORMAT NÀY THAY THẾ HẲN FORMAT CŨ (đổi 2026-08-03).** Bản trước viết theo
> giọng lạnh/deadpan, câu cụt, cấm tính từ cảm xúc, cấm giải thích, mỗi case chỉ
> vài trăm chữ. Người dùng đã bỏ hẳn hướng đó. Nếu bạn thấy kịch bản cũ trong
> `narration-scripts/` viết theo giọng lạnh — đó là bản CŨ, ĐỪNG lấy làm mẫu.

## Thời lượng & số lượng case

- **KHÔNG cần ép đúng khung phút.** Trước đây mục tiêu 15-18 phút được coi là
  ràng buộc cứng, khiến có tập phải cắt bớt chi tiết đã tra cứu được chỉ để
  khớp số từ — user đã bỏ ràng buộc này (2026-08-06): **ưu tiên viết ĐẦY ĐỦ
  CHI TIẾT, đúng giọng người kể chuyện, hơn là cắt nội dung hay/thật chỉ vì lo
  dài quá.** Đừng tự đếm từ rồi chủ động lược bớt case hay chi tiết.
- **Khoảng 5-6 case** vẫn là số lượng hợp lý cho 1 tập — không phải vì giới
  hạn thời lượng, mà vì mỗi case giờ được kể ĐẦY ĐỦ (đầu-giữa-cuối, không phải
  mẩu dữ kiện). Nhồi quá nhiều case (9-10 như format cũ) vẫn nên tránh, vì sẽ
  buộc phải kể lướt — mất đúng thứ làm nên format này. Nếu tư liệu 1 case nào
  đó phong phú, thà kể ít case hơn (4-5) mà đủ chi tiết còn hơn kể nhiều case
  mà cụt lủn.
- Mốc quy đổi CHỈ để tham khảo, không phải mục tiêu cần đạt: khoảng **170 từ
  tiếng Anh ≈ 1 phút đọc**.

## Quy trình bắt buộc — 5 bước, KHÔNG gộp/bỏ bước

0. **Đọc `used-topics.md`** (file cùng thư mục) để biết chủ đề + các case đã
   dùng. KHÔNG gợi ý lại chủ đề đã làm, và KHÔNG dùng lại 1 case đã kể ở tập
   trước dù tập đó khác chủ đề.
1. **Gợi ý chủ đề** — đề xuất 3-5 chủ đề MỚI, mỗi chủ đề kèm vài case ví dụ có
   thật. Tiêu chí chọn case cho format này KHÁC format cũ: case phải có **đủ
   diễn biến để kể thành một câu chuyện có đầu có cuối** (bối cảnh → chuyện lạ
   xảy ra → điều tra/diễn biến → vỡ lẽ → dư âm). Case chỉ có 1 dữ kiện gây sốc
   rồi hết thì KHÔNG dùng được nữa, dù format cũ vẫn dùng tốt.
   Nếu user đã tự đưa chủ đề thì bỏ qua bước này.
2. **NGHIÊN CỨU TRƯỚC KHI VIẾT — đào SÂU** (xem mục "Kiểm chứng dữ kiện").
3. **Viết kịch bản đầy đủ bằng tiếng Việt** theo đúng công thức bên dưới.
4. **DỪNG LẠI xin user xét duyệt bản tiếng Việt.** Cổng thủ công bắt buộc —
   TUYỆT ĐỐI không tự nhảy sang bước 5 khi chưa có xác nhận rõ ràng.
5. **Sau khi được duyệt**, viết lại bằng tiếng Anh (REWRITE, không dịch
   word-by-word). Ngay sau đó **cập nhật `used-topics.md`**.

## Công thức 1 CASE

Mỗi case là một CÂU CHUYỆN HOÀN CHỈNH, kể theo trình tự, không phải một mẩu
dữ kiện. Cấu trúc chuẩn:

1. **Tiêu đề case** — `Story N: [Tên người] – [cụm gợi tò mò]`.
   Ví dụ: *"Story 1: A Fei – The 17-Day Walk in the Mist"*,
   *"Story 3: Carl Ledges and the 7-Year Secret Beneath the Well"*.
   Cụm sau dấu gạch phải hé một chi tiết lạ mà chưa giải thích.

2. **Mở bài — chọn 1 trong 2 kiểu:**
   - *Kiểu tuần tự* (mặc định): năm + địa điểm + tên + tuổi + cuộc sống bình
     thường. *"In 2020, in a small, peaceful village called Long Wang in China,
     39-year-old A Fei was living a quiet, unremarkable life."*
   - *Kiểu mở bằng hình ảnh lạ*: bắt đầu thẳng bằng cảnh khó hiểu nhất rồi mới
     quay lại kể từ đầu. Ví dụ mở bằng cảnh tài xế taxi dán kín bùa, nhốt mình
     trong xe — rồi mới kể anh ta là ai. Dùng khi hình ảnh mở đủ mạnh.

3. **Việc đời thường** — nhân vật đang làm gì rất bình thường khi mọi chuyện
   bắt đầu (đi chợ, kiểm tra chuồng ngựa, dự đám tang).

4. **Dấu hiệu bất thường đầu tiên** — nhỏ, dễ bỏ qua (sương dày bất thường, ngựa
   không chịu uống nước, bóng người mặc đồ trắng phía xa).

5. **Leo thang theo trình tự thời gian** — phần dài nhất. Kể diễn biến tuần tự,
   giữ nhịp, mỗi đoạn đẩy tình huống đi xa hơn. Đây là chỗ format cũ cắt bỏ và
   format mới GIỮ LẠI ĐẦY ĐỦ.

6. **Khối giải thích bối cảnh** — khi câu chuyện dựa vào kiến thức khán giả Mỹ
   không có, DỪNG LẠI GIẢI THÍCH RÕ. Đây là điều format cũ CẤM, format mới BẮT
   BUỘC. Ví dụ mẫu: *"Here is why that is scientifically impossible: Back in the
   1950s, rural Taiwanese locals only spoke their native Taiwanese dialect.
   Mandarin was brought over from the mainland and was strictly used by the
   government and schools in major cities."* Không có khối này, cú twist mất
   sạch sức nặng vì khán giả không hiểu vì sao nó bất khả thi.

7. **Vỡ lẽ / điều tra** — sự thật lộ ra: cảnh sát vào cuộc, khai quật, lời thú
   tội, hồ sơ toà án.

8. **Chi tiết rợn người chốt lại** — 1-2 đoạn cuối nêu chi tiết ám ảnh nhất,
   thường là thứ KHÔNG giải thích được hoặc chưa khép lại: camera cho thấy cô
   đi một mình nói chuyện với không khí; đồng hồ dừng đúng 9 giờ 35; phần thi
   thể phía trên đến nay chưa tìm thấy; nhiều nhà nhận được cuộc gọi lạ có
   giọng phụ nữ nói tiếng Nhật.
   KHÔNG kết bằng bài học đạo đức, KHÔNG tổng kết ý nghĩa.

**Chỉ nêu tên riêng khi nhân vật đó còn xuất hiện lại hoặc có vai trò riêng
biệt** (kiểu "súng treo tường" của Chekhov) — áp dụng cho CẢ nhóm đông LẪN 1 cá
nhân đơn lẻ chỉ được trích dẫn thoáng qua. **QUY TẮC NÀY CHỈ ÁP DỤNG CHO TÊN
NGƯỜI.** Tên vật/tàu/địa danh/tổ chức (vd 2 con tàu chị em "USS Proteus" và
"USS Nereus" nhắc đúng 1 lần ở case USS Cyclops) thì KHÔNG áp dụng — cứ nêu tên
riêng thoải mái dù chỉ xuất hiện 1 lần, vì tên vật không tạo gánh nặng "phải
nhớ ai là ai" như tên người, ngược lại còn tăng cảm giác tư liệu/uy tín cho
câu chuyện. (Làm rõ 2026-08-06 theo yêu cầu user, sau khi ban đầu chỉ ghi
chung chung "tên người" dễ bị hiểu nhầm áp dụng luôn cho tên vật.)
- **Nhóm đông** (đồng nghiệp, đội cứu hộ, nhân chứng...) mà chỉ 1-2 người trong
  đó thực sự quay lại hoặc có hành động/kết quả khác biệt ở phần sau — chỉ nêu
  tên đúng 1-2 người đó, phần còn lại gọi chung ("cùng năm người thợ khác",
  "cùng đội của anh ta").
- **1 cá nhân được trích dẫn 1 lần rồi không quay lại** (vd 1 nhà nghiên cứu/
  chuyên gia hoài nghi được dẫn lời 1 câu rồi thôi) — gọi chung theo vai trò
  ("nhiều nhà nghiên cứu hoài nghi", "một chuyên gia giám định") thay vì nêu
  tên riêng, trừ khi cái tên đó tự nó có sức nặng với khán giả phổ thông (vd
  nhân vật đã nổi tiếng sẵn) hoặc còn được nhắc lại sau.
Nêu tên chỉ để người nghe phải nhớ những cái tên không bao giờ dùng lại là
lãng phí. Nếu 1 người trong nhóm/1 cá nhân sau này có chi tiết riêng (kết quả
khác biệt, lời khai riêng, số phận khác...), giới thiệu tên NGAY TẠI ĐOẠN họ
trở nên đáng chú ý, không cần nêu trước ở đoạn mở. (Rút ra 2026-08-05 từ case
Travis Walton — đội khai thác gỗ 7 người, bản nháp đầu liệt kê hết 6 tên đồng
nghiệp ngay từ đầu dù chỉ đội trưởng + 1 người có kết quả kiểm tra nói dối
khác biệt còn được nhắc lại; và tên 1 nhà nghiên cứu hoài nghi được dẫn lời
đúng 1 câu rồi không xuất hiện nữa.)

**Tiêu đề phụ trong case**: với case dài nhiều giai đoạn (khoảng 700 từ trở
lên), chia bằng tiêu đề phụ ngắn để dễ theo dõi — vd *"A Sudden Crisis and an
Unnatural Ride"*, *"An Impossible Wake-Up Call"*, *"Justice From Beyond the
Grave"*. Case ngắn thì không cần.

## Cấu trúc TOÀN VIDEO

- **KHÔNG có lời mở đầu/chào kênh.** Video bắt đầu THẲNG bằng tiêu đề case #1.
- Mỗi case độc lập, không cần câu chuyển tiếp (tiêu đề case mới là dấu chuyển).
- **Thứ tự**: mở bằng 1 case mạnh và dễ hình dung, để dành case mạnh nhất cho
  cuối. Case nhạt hơn xếp vào giữa.
- **Kết video**: 1 câu mời subscribe + mời gợi ý chủ đề tập sau ở comment.

## Giọng văn — ĐÃ ĐỔI HẲN so với bản cũ

Giọng người kể chuyện ấm, tự nhiên, như đang kể cho bạn nghe. KHÔNG còn giọng
báo cáo lạnh.

**ĐƯỢC DÙNG (bản cũ cấm):**
- **Tính từ cảm xúc**: *terrifying, horrifying, chillingly, shocking, bizarre,
  breathtakingly beautiful*. Dùng đúng chỗ, không rải đều mọi câu.
- **Giải thích, phân tích, nêu bối cảnh** cho khán giả hiểu (xem nhịp 6).
- **Câu dẫn dắt trò chuyện**: *"The catch?"*, *"Here is why that is
  scientifically impossible:"*, *"Naturally, this wild story caught the
  attention of..."*, *"Even more chillingly,"*. **LƯU Ý (2026-08-06)**: đây là
  VÍ DỤ để lấy cảm hứng, không phải công thức lặp lại nguyên văn mỗi case. Đặc
  biệt tránh cụm *"Here's [tính từ] part/detail..."* dùng lặp lại 2-3 lần trở
  lên trong CÙNG 1 kịch bản (vd *"Here's the stranger part"*, *"Here's some
  context worth knowing"*, *"Here's a detail that matters"*) — bị người dùng
  chỉ đích danh là "mùi AI" vì đọc như 1 khuôn mẫu máy móc lặp lại, dù từng câu
  riêng lẻ không sai. Cách sửa: xoá hẳn câu dẫn, để sự kiện tự nói lên (vd thay
  vì "Here's the stranger part. Years later, two sister ships..." → viết thẳng
  "Cyclops wasn't even the last of it. Years later, two sister ships..."),
  hoặc đổi cấu trúc câu dẫn mỗi lần dùng.
- **Câu dài có mệnh đề phụ** khi cần cho mạch kể trôi chảy.

**VẪN GIỮ TỪ BẢN CŨ:**
- Số liệu cụ thể vẫn rất quan trọng (17 ngày, 9 giờ 35, 40 năm, 97 tuổi) — chúng
  là thứ khiến câu chuyện có thật.
- KHÔNG đúc kết bài học, KHÔNG dạy đời ở cuối.
- KHÔNG bông đùa/chơi chữ — chuyện nghiêm túc, người thật.

**KHÔNG DÙNG:**
- Xưng hô trực tiếp kiểu *"bạn hãy tưởng tượng"*, *"nếu là bạn thì sao"*.
- Câu hỏi tu từ rải rác để câu giờ.

## Kiểm chứng dữ kiện

Format này vẫn dựa vào việc các vụ việc là CÓ THẬT — nhưng cách kiểm chứng khác
nhau tuỳ loại case:

- **Case đời thường (tai nạn, án mạng, thảm hoạ)**: tra như cũ — ngày tháng, tên,
  số liệu, hồ sơ toà. Dùng `WebSearch`/`WebFetch`, KHÔNG viết từ trí nhớ.
- **Case tâm linh/siêu nhiên**: thứ kiểm chứng được là **vụ việc đã được ghi
  nhận/đưa tin thật hay không** — có hồ sơ toà án, có báo đăng, có nhân chứng
  được nêu tên. KHÔNG kiểm chứng được bản thân hiện tượng ma quỷ, và đó là điều
  bình thường. Cách viết đúng: thuật lại điều NHÂN CHỨNG/HỒ SƠ nói, chứ không
  khẳng định hiện tượng là thật. Nếu 1 vụ có xác nhận độc lập thì nêu rõ — vd
  *"This story was publicly verified by many of the guards and police officers
  who witnessed it that day."*
- **TUYỆT ĐỐI không bịa số** cho kêu hơn. Không tra được thì mô tả định tính.
- **Đánh dấu chỗ chưa chắc** ngay trong bản tiếng Việt gửi duyệt (vd
  `[CHƯA XÁC MINH: nguồn ghi khác nhau, 5 hay 7 người]`).
- **Ưu tiên case có nguồn truy được**. Case chỉ lan truyền trên mạng, không truy
  được gốc → bỏ.
- **Đừng gộp chung mọi chi tiết rùng rợn thành "không giải thích được"** nếu
  thực ra CHỈ MỘT PHẦN chưa có lời giải. (Rút ra 2026-08-06 từ case Dyatlov
  Pass: chấn thương ngực/hộp sọ có giả thuyết khoa học khá vững — phiến tuyết
  trượt; còn việc mất mắt/lưỡi lại có lời giải pháp y RIÊNG và được chấp nhận
  rộng rãi — phân huỷ tự nhiên + động vật ăn xác sau 3 tháng ngâm trong suối —
  hoàn toàn khác với phần chấn thương. Bản nháp đầu gộp cả hai thành 1 câu
  "không giải thích được", khiến case có vẻ bí ẩn hơn thực tế và SAI về mặt
  pháp y đã công bố.) Tra riêng từng chi tiết gây sốc, đừng mặc định cả cụm là
  bí ẩn chỉ vì nó *nghe* rùng rợn — chỉ giữ khung "unresolved" cho đúng phần
  THẬT SỰ chưa có lời giải (ở case này là mức phóng xạ trên quần áo).

## Bản tiếng Anh — quy tắc riêng cho ElevenLabs

- REWRITE, không dịch bám cấu trúc câu tiếng Việt.
- **Hạn chế dấu câu gây ngắt giọng**: tránh em dash (—), dấu hai chấm mở danh
  sách, chấm phẩy. Câu dài thì tách bằng dấu chấm hoặc nối bằng "and"/"but".
  *(Lưu ý: format mới ưa câu dài hơn format cũ, nên quy tắc này cần chú ý hơn —
  câu dài vẫn được, chỉ là đừng nhồi dấu câu lạ vào giữa.)*
- Số liệu viết dạng đọc lên nghe tự nhiên; đơn vị hệ Mỹ (feet/pounds/miles).
- Tên riêng nước ngoài: giữ nguyên, nhưng nếu khó đọc thì cân nhắc thêm cách
  đọc gợi ý trong bản Việt để user tự quyết.

## ⚠️ CẢNH BÁO BẢN QUYỀN

Chỉ rút ra **CÔNG THỨC/CẤU TRÚC** và **SỰ KIỆN CÓ THẬT** từ mọi kịch bản tham
khảo user đưa vào. TUYỆT ĐỐI:
- Không dịch/diễn đạt sát theo câu chữ bản gốc, dù đổi ngôn ngữ.
- Không kể lại đúng cùng danh sách case theo đúng thứ tự của họ.
- Không copy câu outro/câu thoại đặc trưng của kênh đó.

Viết bằng câu chữ hoàn toàn của mình, dựa trên nguồn tra cứu độc lập (bước 2).
