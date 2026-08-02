---
name: true-story-compilation-script
description: Write long-form English YouTube narration scripts in the "compilation" format — independent true-story segments assembled into one 15-18 minute video, deadpan factual tone, driven by verified specific numbers rather than adjectives. Case count is free; the only target is total runtime of 15-18 minutes, with each case told in maximum verified detail. Length benchmark: narration-scripts/chet-boi-phat-minh-cua-minh/en.md ran 18m29s in ElevenLabs. Topics vary per video (extreme survival, bizarre deaths, sports fatalities, disasters, unsolved cases...). Draft always written in Vietnamese first for manual review, then rewritten (not literally translated) into English for TTS narration. Use when the user wants topic ideas for this channel, wants a new episode script, or wants an approved Vietnamese draft turned into an English narration script.
---

# Kịch bản tuyển tập chuyện có thật (Vietnamese draft → English narration)

Skill này ghi lại quy trình + công thức viết cho 1 kênh YouTube tiếng Anh, dạng
**tuyển tập (compilation)**: mỗi video gồm nhiều câu chuyện CÓ THẬT độc lập
nhau, cùng thuộc 1 chủ đề chung, kể bằng giọng lạnh/khách quan.

**Mục tiêu DUY NHẤT về độ dài: tổng thời lượng đọc khoảng 15-18 phút**. **SỐ LƯỢNG CASE KHÔNG QUAN TRỌNG** — bao nhiêu
case cũng được, miễn cộng lại rơi vào khung này. Trong khung đó, ưu tiên tuyệt
đối vẫn là kể mỗi case CHI TIẾT NHẤT CÓ THỂ dựa trên dữ kiện kiểm chứng được.

- **Mốc quy đổi thực tế** — dùng chính bản tiếng Anh của tập "Chết bởi chính
  phát minh của mình" làm thước đo:
  `narration-scripts/chet-boi-phat-minh-cua-minh/en.md` → **18 phút 29 giây**
  audio ElevenLabs. Muốn ước lượng độ dài tập mới, so tổng lượng chữ bản tiếng
  Anh với file đó (tập đó gồm 9 case viết theo chuẩn chi tiết tối đa, nhưng
  con số 9 chỉ là kết quả, KHÔNG phải chỉ tiêu phải đạt).
- Case dài/nhiều tư liệu thì cần ít case hơn; case ngắn/ít tư liệu thì cần
  nhiều case hơn. Cứ chọn theo chất lượng case, rồi đối chiếu tổng độ dài với
  file mốc ở trên.
- Nếu ước lượng vượt quá 18 phút: cắt bớt SỐ CASE (bỏ case yếu nhất), KHÔNG
  cắt chi tiết trong từng case đã chọn.
- Chi tiết ở đây LUÔN LÀ dữ kiện thật, kiểm chứng được (xem "Kiểm chứng dữ
  kiện" bên dưới) — không phải văn vẻ/tính từ để kéo dài câu chữ.

**Chủ đề thay đổi theo từng video** (mỗi video 1 chủ đề): sinh tồn phi thường,
những cái chết kỳ lạ/lãng nhách, tai nạn chết người trong thể thao, thảm hoạ,
vụ án chưa có lời giải, phát minh thất bại chết người, thoát chết khi bị thú
hoang dã tấn công... Chủ đề mở, miễn là gom được đủ case CÓ THẬT, kiểm chứng
được để dựng ra 15-18 phút, và mỗi case đều đủ chất liệu để đào sâu chi tiết
(không chỉ 1-2 dòng dữ kiện rồi hết).

## Quy trình bắt buộc — 5 bước, KHÔNG gộp/bỏ bước

0. **Đọc `used-topics.md`** (file cùng thư mục) để biết chủ đề + các case đã
   dùng. KHÔNG gợi ý lại chủ đề đã làm, và KHÔNG dùng lại 1 case đã kể ở tập
   trước dù tập đó khác chủ đề (vd đã kể 1 người chết vì trò mạo hiểm trong
   tập "cái chết lãng nhách" thì không lôi lại vào tập "tai nạn thể thao").
1. **Gợi ý chủ đề** — đề xuất 3-5 chủ đề MỚI, mỗi chủ đề kèm vài case ví dụ có
   thật để chứng minh chủ đề gom được đủ case chất lượng để dựng ra 15-18 phút
   (chủ đề nghe hay nhưng chỉ tìm được case có 1-2 dòng dữ kiện, không khai
   thác thêm được gì, thì không dùng được). Nếu user đã tự đưa chủ đề thì bỏ
   qua bước này.
2. **NGHIÊN CỨU TRƯỚC KHI VIẾT — đào SÂU, không chỉ đủ dùng** — xem mục "Kiểm
   chứng dữ kiện" bên dưới. Đây là bước KHÔNG được bỏ: format này sống bằng
   số liệu cụ thể, bịa số là phá hỏng toàn bộ giá trị của kênh. Với mỗi case,
   tra nhiều hơn 1 lượt search: tìm cả dữ kiện đầu dòng (ngày, tuổi, nguyên
   nhân chết) LẪN chi tiết phụ làm case dày hơn — tên những người khác có
   mặt, trình tự/cơ chế chính xác của sự việc, trích dẫn còn ghi lại được,
   diễn biến ngay sau đó (khám nghiệm, an táng, điều tra), và bất kỳ chi tiết
   mỉa mai/hệ quả về sau nào liên quan tới chính case đó.
3. **Viết kịch bản đầy đủ bằng tiếng Việt** theo đúng công thức bên dưới.
4. **DỪNG LẠI xin user xét duyệt bản tiếng Việt.** Cổng thủ công bắt buộc —
   TUYỆT ĐỐI không tự nhảy sang bước 5 khi chưa có xác nhận rõ ràng ("ok",
   "duyệt", "dịch đi"...).
5. **Sau khi được duyệt**, viết lại bằng tiếng Anh với văn phong người Mỹ kể chuyện —    REWRITE, không dịch
   word-by-word. Ngay sau đó **cập nhật `used-topics.md`** (chủ đề + liệt kê
   TÊN từng case đã dùng + ngày).

## Công thức 1 SEGMENT (đơn vị cơ bản — số lượng/độ dài tuỳ case)

**Độ dài mỗi segment KHÔNG cố định, và mặc định thiên về CHI TIẾT NHẤT CÓ
THỂ.** Không dừng lại ở mức "đủ 8 nhịp" rồi kết thúc sớm — nếu nghiên cứu ở
bước 2 tìm ra thêm chi tiết thật kiểm chứng được (tên người liên quan, một
bước trong trình tự tai nạn, một con số phụ, một câu trích dẫn), đưa vào
segment thay vì bỏ qua cho gọn. Case nhiều tình tiết thì dài, case ít tư liệu
hơn thì ngắn hơn thật — nhưng "ngắn" phải vì THIẾU TƯ LIỆU kiểm chứng được,
không phải vì lười khai thác thêm.

Ranh giới duy nhất: chi tiết thêm vào phải là dữ kiện có thật, có nguồn — TUYỆT
ĐỐI không kéo dài bằng tính từ, văn vẻ, mô tả cảm xúc tưởng tượng, hay lặp lại
ý đã nói bằng câu chữ khác. Đó là độn chữ, không phải chi tiết.

Mỗi segment tự đứng độc lập, theo 8 nhịp:

1. **Tiêu đề segment** — tên người, hoặc tên gọi ngắn của vụ việc ("The booby
   trap", "The photo op"). Đọc lên như một dòng tiêu đề, không phải câu.
2. **Câu mở = ngày chính xác + tuổi + hành động ĐỜI THƯỜNG + địa điểm cụ thể.**
   Khuôn: *"Ngày [dd/mm/yyyy], [tên] [tuổi] tuổi đang [việc rất bình thường] ở
   [địa điểm]."* Mở bằng việc tầm thường (hái quả, cho thú ăn, kiểm tra vườn)
   để tương phản với kết cục.
3. **Người đó là ai / vì sao có mặt ở đó** — 1-3 câu, gọn.
4. **Khối giải thích để dựng stakes** — 2-4 câu giải thích cái vật/môn thể
   thao/hiện tượng đó là gì và nó nguy hiểm/khó tới mức nào, kèm 1 dữ kiện
   chứng minh mức độ ("người cuối cùng chết vì loài này là năm 1930", "3/4 số
   ứng viên bỏ cuộc"). Nhờ khối này, kết cục sau đó không đến từ trên trời.
5. **Câu bản lề** — chuyển từ setup sang hậu quả. Dùng đúng 1 câu ngắn, tách
   riêng: *"Kế hoạch đó có một vấn đề."* / *"Thứ họ không hề biết là..."* /
   *"Rồi chuyện không ai ngờ tới xảy ra."*
6. **Leo thang** — chuỗi câu ngắn, mỗi câu mang 1 con số hoặc 1 chi tiết vật
   lý cụ thể. Đây là phần chiếm nhiều chữ nhất.
7. **Kết cục nói thẳng, không melodrama** — "Anh ta chết tại chỗ." Không thêm
   tính từ bi thương, không bình luận.
8. **Câu kết deadpan** — 1 câu CỰC NGẮN, lạnh, thường mỉa mai nhẹ hoặc nêu 1
   chi tiết phụ bất ngờ (con vật gây ra cái chết vẫn khoẻ mạnh; ông ta quay về
   nông trại; anh ta thắng cược nhưng không kịp tiêu tiền). Đây là **chữ ký
   của format** — người xem hay cắt đúng câu này đi chia sẻ. Mỗi segment PHẢI
   có, và mỗi segment một kiểu khác nhau, không lặp khuôn.

## Cấu trúc TOÀN VIDEO

- **KHÔNG có lời mở đầu/chào kênh.** Video bắt đầu THẲNG bằng tiêu đề segment
  #1. Không "hôm nay chúng ta sẽ tìm hiểu...", không giới thiệu chủ đề.
- **Số segment tuỳ ý, chỉ nhắm tổng 15-18 phút.** Ít case dài hay nhiều case
  ngắn đều được. Nếu chủ đề không gom đủ case kiểm chứng tốt để đạt 15 phút,
  cứ để video ngắn hơn — KHÔNG độn case yếu/không truy được nguồn cho "đủ
  dài". Mỗi segment độc lập, không cần câu chuyển tiếp giữa các segment (tiêu
  đề segment mới chính là dấu chuyển).
- **Thứ tự sắp xếp**: mở bằng 1 case mạnh (dễ hình dung, kịch tính rõ), để
  dành 1-2 case mạnh nhất cho cuối. Case nhạt hơn nhét vào giữa.
- **Kết video**: 1 câu mời subscribe + mời gợi ý chủ đề tập sau ở comment.
  Tự viết bằng lời của kênh mình — KHÔNG copy nguyên văn câu outro của kênh
  tham khảo.

## Kiểm chứng dữ kiện — BẮT BUỘC, không thoả hiệp

Format này dựa hoàn toàn vào việc mọi thứ là thật và kiểm chứng được. Vì vậy:

- **Dùng `WebSearch`/`WebFetch` để tra từng case TRƯỚC khi viết** — không viết
  từ trí nhớ. Trí nhớ về số liệu (ngày, tuổi, độ cao, cân nặng, khoảng cách)
  rất dễ sai lệch, mà sai số liệu là phá đúng thứ tạo nên uy tín của kênh.
- **TUYỆT ĐỐI không bịa số cho "kêu" hơn.** Nếu không tra được con số chính
  xác, viết mô tả định tính ("mất gần một nửa trọng lượng cơ thể") thay vì
  bịa một con số cụ thể.
- **Đánh dấu chỗ chưa chắc** ngay trong bản tiếng Việt gửi user duyệt (vd
  `[CHƯA XÁC MINH: con số này các nguồn ghi khác nhau, 82-84 người]`) để user
  quyết định giữ hay bỏ — đừng âm thầm chọn 1 con số rồi viết như thể chắc
  chắn.
- **Ưu tiên case có nguồn rõ ràng** (báo lớn, hồ sơ toà, sách của chính người
  trong cuộc). Case chỉ lan truyền trên mạng, không truy được nguồn gốc → bỏ,
  đừng đưa vào cho đủ số lượng.

## Giọng văn

- **Câu ngắn, chủ-vị-tân, ít mệnh đề phụ.** Nhịp gõ đều như báo cáo.
- **Để CON SỐ làm phần việc cảm xúc, không dùng tính từ.** Không viết "cực kỳ
  lạnh" mà viết nhiệt độ; không "sụt cân khủng khiếp" mà viết số cân đã mất.
  Đây là quy tắc quan trọng nhất của format.
- **KHÔNG bình luận, KHÔNG dạy đời, KHÔNG đúc kết bài học.** Không nói cho
  khán giả biết phải cảm thấy gì — dữ kiện tự nói. Được dùng RẤT tiết chế vài
  trạng từ chuyển mạch ("Đáng buồn thay", "Kỳ diệu thay") nhưng tối đa 1-2 lần
  mỗi segment, không lạm dụng.
- **KHÔNG xưng hô trực tiếp với người xem** ("bạn có thấy...", "hãy tưởng
  tượng..."), **KHÔNG câu hỏi tu từ**, **KHÔNG bông đùa/chơi chữ**. Sự lạnh
  lùng chính là hiệu ứng — đùa vào là hỏng.
- **Không ẩn dụ/văn vẻ.** Mô tả vật lý cụ thể thay cho ví von.
- Được phép có mỉa mai NGUỘI, nhưng chỉ qua việc SẮP ĐẶT dữ kiện cạnh nhau
  (đặc biệt ở câu kết deadpan), không qua lời bình của người kể.

## Bản tiếng Anh — quy tắc riêng cho ElevenLabs

- REWRITE, không dịch bám cấu trúc câu tiếng Việt — viết như người bản ngữ.
- **Hạn chế dấu câu gây ngắt giọng**: TRÁNH em dash
  (—), dấu hai chấm mở danh sách, chấm phẩy, và mệnh đề chêm giữa câu kiểu
  "..., which...", "..., even though...". Những dấu này khiến giọng đọc TTS bị
  khựng, nghe không tự nhiên. Thay bằng: tách thành câu ngắn hoàn chỉnh nối
  bằng "and"/"but"/dấu chấm.
- May mắn là format này vốn ưa câu ngắn nên quy tắc trên gần như tự thoả mãn.
- Số liệu: viết dạng người đọc lên nghe tự nhiên ("about 26 miles" chứ không
  "26.2mi"), đơn vị dùng hệ Mỹ (feet/pounds/miles) vì khán giả là US.

## ⚠️ CẢNH BÁO BẢN QUYỀN

Các kịch bản mẫu mà user đưa vào để tham khảo (2026-08-01: 3 kịch bản chép từ
1 kênh YouTube tiếng Anh khác) — chỉ được rút ra **CÔNG THỨC/CẤU TRÚC** (nhịp
kể, thứ tự beat, kiểu câu kết) và **CÁC SỰ KIỆN CÓ THẬT** (dữ kiện công khai,
không ai độc quyền). TUYỆT ĐỐI:

- Không dịch/diễn đạt sát theo câu chữ bản gốc, dù đổi ngôn ngữ.
- Không kể lại đúng cùng danh sách case theo đúng thứ tự của họ.
- Không copy câu outro/câu thoại đặc trưng của kênh đó.

Viết case bằng câu chữ hoàn toàn của mình, dựa trên nguồn tra cứu độc lập
(bước 2), không dựa vào bản kịch bản của họ. Nếu nghi ngờ 1 chủ đề user đưa ra
là lấy nguyên từ nội dung người khác, hỏi rõ trước khi viết.
