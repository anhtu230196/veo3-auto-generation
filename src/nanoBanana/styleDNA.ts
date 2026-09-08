/**
 * "Style DNA" cho hướng pipeline MỚI đang thử nghiệm: tạo ảnh (Character/Background) TRƯỚC
 * bằng Nano Banana (Gemini 2.5 Flash Image), rồi mới đưa vào bước image-to-video sau — khác
 * hẳn pipeline hiện tại (`src/styleDNA.ts`, `src/veo3bot/*`) là text-to-video thẳng qua Veo3/
 * Flow. Xem RUNBOOK.md mục 8 để biết bối cảnh đầy đủ.
 *
 * TRẠNG THÁI (2026-08-01): CHƯA có code automation nào gọi Nano Banana — mọi block dưới đây
 * chỉ mới được test TAY (dán prompt vào Gemini/Nano Banana ngoài repo, soi ảnh trả về bằng
 * mắt) và ĐÃ ĐƯỢC NGƯỜI DÙNG XÁC NHẬN HÀI LÒNG với kết quả. File này chỉ đúc kết lại các
 * block prompt đã xác nhận, CHƯA có hàm nào lắp ráp/gọi API/automation — bước tiếp theo (khi
 * làm automation Playwright thật) là viết file cùng cấp `generate.ts`/`imageAsset.ts` tương tự
 * `src/veo3bot/`, dùng lại các block ở đây.
 */

/**
 * 🔴🔴 ĐỔI PHONG CÁCH TOÀN DIỆN — 2026-09-09. ĐỌC TRƯỚC KHI SỬA BẤT KỲ BLOCK NÀO DƯỚI ĐÂY.
 *
 * Người dùng chốt chuyển sang phong cách kênh **Brofessor Stein**. Tư liệu phân tích đầy đủ:
 * `input/style-ref/brofessor-stein/DRAWING-SPEC.md` (cách vẽ) và `ANALYSIS.md` (hệ thống
 * hình ảnh tổng thể), dựng từ 3 video đã tải về, video chuẩn là `nRiezhIOHH0`.
 *
 * Style CŨ (đến 2026-09-08): đầu tròn to, hai chấm mắt đen, không mũi không miệng, tay chân
 * nét cụt KHÔNG bàn tay, một độ dày nét duy nhất, background vẽ đầy đủ cả căn phòng.
 * Style MỚI: giải phẫu người lớn thật (~7 đầu), mặt vẽ đủ có nếp nhăn biểu cảm, BÀN TAY 5
 * NGÓN, HAI độ dày nét, và KHÔNG vẽ căn phòng — chỉ vẽ đồ đạc đứng trên nền phẳng.
 *
 * ✅ ĐÃ ĐỔI ẢNH MASTER: `reference-character.jpeg` giờ là người đàn ông mặc vest, cắt từ
 * frame 3:09 của `nRiezhIOHH0`. Bản cũ giữ ở `reference-character.old-2026-08-03.jpeg`.
 * Đổi ảnh TRƯỚC là bắt buộc — bài học "ảnh thắng text": sửa block chữ mà giữ ảnh cũ thì ảnh
 * cũ kéo mọi nhân vật mới về kiểu đầu tròn chấm mắt.
 *
 * ⚠️ ẢNH MASTER MỚI BỊ CẮT NGANG ĐÙI, KHÔNG CÓ BÀN CHÂN. Nhân vật nào vẽ nguyên người thì
 * PHẢI mô tả rõ giày/bàn chân, nếu không sẽ ra cụt. Đã ghi vào `MASTER_REFERENCE_NOTE`.
 *
 * ⚠️ CHƯA CHẠY THỬ ẢNH NÀO theo style mới. Mẻ đầu tiên phải soi đúng 4 thứ:
 *   1. Bàn tay có ra đủ 5 ngón không (đây là thứ khó nhất, và là thứ style cũ CẤM).
 *   2. Nét có ra HAI độ dày không, hay model vẫn vẽ một độ dày đều.
 *   3. Mặt có nếp nhăn biểu cảm không, hay vẫn phẳng lì.
 *   4. Background có ra "đồ đạc trên nền phẳng" không, hay model vẫn tự vẽ sàn và tường.
 *
 * ⚠️ TOÀN BỘ ASSET CŨ ĐÃ LỆCH PHONG CÁCH: case 1 Roanoke (4/17 asset) và 5 case của tập
 * `vu-viec-tam-linh-khong-the-giai-thich` đều vẽ theo style cũ. Ghép chung với ảnh style
 * mới sẽ đá nhau. Người dùng chưa quyết bỏ hay giữ.
 *
 * ✅ ĐÃ BỎ MỤC TIÊU "ĐỒ LẠI ẢNH BẰNG TAY" (người dùng chốt 2026-09-09). Ảnh Nano Banana giờ
 * là SẢN PHẨM DÙNG THẲNG — người dùng tách nền và dựng phim, không vẽ lại. Ba chỗ đã sửa
 * theo: `SIMPLIFY_DETAIL_BLOCK` (bỏ tiêu chí "vài nét là đồ xong", chuyển sang "chi tiết
 * đúng mức một người vẽ minh hoạ sẽ vẽ"), `HAND_DRAWN_LINE_BLOCK` (giữ nét run tay vì đó
 * ĐÚNG là đặc điểm của style mới, nhưng bỏ mảng màu tô lem và sửa câu bảo vệ bố cục vốn đang
 * mô tả bố cục cũ), `SIMPLE_PERSPECTIVE_BLOCK` (bỏ câu "extremely simple to trace by hand").
 * ⚠️ Comment lịch sử của hai block đó vẫn nhắc mục tiêu đồ tay — đó là lý do RA ĐỜI của
 * chúng, giữ lại để hiểu vì sao có từng điều khoản, KHÔNG phải mục tiêu hiện tại.
 *
 * Các block bên dưới còn giữ nguyên comment lịch sử của style cũ. Comment mô tả KẾT QUẢ TEST
 * của style cũ vẫn có giá trị tham khảo về CÁCH model phản ứng với từng loại câu lệnh, nhưng
 * ĐỪNG đọc chúng như mô tả style đang dùng.
 */

export const STYLE_NAME =
  "Brofessor Stein hand-drawn flat illustration (two-weight ink line, real anatomy, no environment)";

/**
 * Áp dụng cho MỌI ảnh (Character lẫn Background) — phần lõi chung của phong cách.
 */
export const BASE_STYLE_BLOCK =
  "Hand-drawn flat 2D illustration. Everything is inked in black using TWO distinct line " +
  "weights: a THICK outer contour around the silhouette of each person and each object, and " +
  "clearly THINNER interior lines for everything inside that silhouette — facial features, " +
  "cloth folds, lapels, seams, panel edges, wood grain. The interior lines are roughly half " +
  "the thickness of the outer contour. Colors are flat fills with no gradients, no highlights " +
  "and no cast shadows. A single slightly darker tone of the same colour may appear on a few " +
  "recessed areas only, such as a seat cushion or a table top — never all-over cel shading. " +
  "The palette is muted and slightly desaturated: browns, greys, wine red, navy, olive, " +
  "beige. Skin is a flat fill with no blush and no shading, and pale-skinned characters are " +
  "left plain white so the face reads through line work alone.";

/**
 * CHARACTER — đã dùng để tạo ra ảnh MASTER REFERENCE ban đầu (2026-08-01, mô tả NGẮN GỌN, cụ
 * thể từng bộ phận hiệu quả hơn hẳn mô tả dài dòng mơ hồ). CHỈ CÒN GIÁ TRỊ LỊCH SỬ/tài liệu
 * tham khảo — KHÔNG dùng lại để tạo nhân vật MỚI nữa, xem `CHARACTER_PROMPT_PREFIX` +
 * `MASTER_REFERENCE_NOTE` bên dưới cho quy trình chuẩn hiện tại.
 */
export const CHARACTER_STYLE_BLOCK =
  "Minimalist character design, flat 2D vector art style, bold black outlines, completely " +
  "flat colors, no shading, no gradients. Round simple head, two black dot eyes, no nose or " +
  "mouth detail, square flat-colored torso, thin stick-line arms and legs with no hands or " +
  "feet detail, simple flat hair shape on top of head. same style with reference image";

/**
 * ẢNH MASTER REFERENCE CHO NHÂN VẬT — ĐỔI LẦN 2 (2026-08-03): người dùng TỰ THAY file
 * `src/nanoBanana/reference-character.jpeg` bằng ảnh mới (bỏ hẳn phong cách "lính gác" của
 * quyết định 2026-08-01 ở trên — đoạn ghi chú cũ đó CHỈ CÒN GIÁ TRỊ LỊCH SỬ, không mô tả ảnh
 * đang dùng nữa). Lý do đổi: sau nhiều vòng thử viết prompt cực chi tiết để tạo góc quay 3/4
 * (xem lịch sử trong `scripts/make-master-reference.ts`) vẫn không ra đúng ý hoàn toàn — người
 * dùng quyết định tự chọn ảnh thay vì tiếp tục vòng lặp prompt.
 *
 * ẢNH MỚI (đã soi bằng mắt 2026-08-03) — nhân vật nam mặc áo blouse trắng, sơ mi xanh, cà vạt
 * xám, nền xanh ngọc trơn:
 * - Đầu tròn to, MÀU DA (hồng nhạt) — khác hẳn ảnh lính gác cũ và mọi bản thử trước đó đều
 *   dùng đầu trắng phẳng. Nếu muốn nhân vật khác màu da, phải ghi RÕ trong mô tả, vì mặc định
 *   ảnh sẽ kéo đúng tông da này (bài học "ảnh thắng text" — xem NO_PERSPECTIVE_BLOCK/mục 4.12).
 * - Hai chấm mắt đen tròn, ĐẶT CÂN ĐỐI giữa mặt — khác các bản thử "mắt cụm về 1 bên" trước đó.
 * - Miệng 1 nét ngang ngắn, không mũi, không lông mày.
 * - CÓ TAI — 1 nét cong nhỏ ở chỗ tóc giáp mặt. Các bản thử trước đều cấm tai, ảnh này thì có.
 * - Không cổ — đầu chạm thẳng vào áo, không có khoảng hở.
 * - Tóc nâu quét lệch 1 bên, có 2 lọn tóc dài đổ xuống hai bên vai tới ngang ngực — ĐẶC ĐIỂM
 *   RIÊNG của nhân vật này, không phải cấu trúc bắt buộc. Nếu không muốn nhân vật mới bị kéo
 *   theo kiểu tóc dài này, phải mô tả rõ kiểu tóc khác (vd "short cropped hair, no long
 *   strands") trong phần mô tả nhân vật.
 * - Trang phục có LỚP (áo khoác trắng mở, lộ sơ mi + cà vạt bên trong) — khác các block cũ mô
 *   tả thân chỉ là "1 mảng màu phẳng". Nhân vật mới không mặc áo khoác dạng này vẫn cần mô tả
 *   rõ trang phục để không bị kéo theo.
 * - Tay/chân vẫn là nét mảnh cụt, không bàn tay bàn chân — điểm NHẤT QUÁN với mọi bản thử
 *   trước, không đổi.
 *
 * ✅ ĐÃ TEST (2026-08-03, nhân vật "Elderly Woman Test" — phụ nữ lớn tuổi, tóc búi, váy xanh
 * lá 1 lớp, kính tròn). Xác nhận CẢ HAI điều quan trọng:
 * - CÓ THỂ GHI ĐÈ bằng text: mô tả rõ "tóc búi gọn, không buông" + "váy 1 lớp, không khoác
 *   ngoài" ra đúng kết quả — không bị kéo theo tóc dài 2 bên/áo có lớp của ảnh gốc. Vậy quy tắc
 *   ghi rõ trong CHARACTER_DESCRIPTION_CHECKLIST hoạt động đúng như kỳ vọng.
 * - Đặc điểm cấu trúc (tai, không cổ, màu da mặc định khi không mô tả khác) kế thừa đúng qua
 *   ảnh như dự đoán.
 * ⚠️ LỆCH MỚI PHÁT HIỆN: chân ra hình bàn chân/giày loe nhẹ ở đầu mút, KHÁC với "chỉ nét cụt
 * không bàn chân" — trong khi ảnh reference (người mặc áo blouse) có chân là nét cụt thật. Có
 * thể là model tự thêm khi thấy nhân vật mặc váy (liên tưởng "cần giày"), CHƯA xác nhận đây là
 * lỗi hệ thống hay ngẫu nhiên — cần thêm 1-2 nhân vật nữa mới kết luận được.
 */
export const MASTER_REFERENCE_NOTE =
  "Reference image: reference-character (an adult man seen at a slight three-quarter turn, " +
  "short dark hair, pale skin left plain white so the face reads through line work alone, a " +
  "fully drawn face with eyebrows, nose, mouth and a few expression lines on the cheeks, a " +
  "layered outfit of a grey suit jacket open over a white shirt and dark green tie, and BOTH " +
  "hands drawn in full with five separate fingers holding a clipboard and a pen) — the single " +
  "fixed visual anchor for ALL human characters going forward. What must carry over is the " +
  "CONSTRUCTION: realistic adult proportions of about seven heads, a fully drawn face, fully " +
  "drawn five-fingered hands, layered clothing with a few sparse fold lines, and the two-weight " +
  "ink line. If a new character needs a different hairstyle, skin tone, build, age or outfit, " +
  "describe that explicitly — otherwise the reference's own traits (short dark hair, pale " +
  "skin, suit and tie) will carry over by default. The reference is cropped at mid-thigh and " +
  "shows NO feet, so whenever a character is drawn at full length the feet and the shoes must " +
  "be described explicitly or they will come out missing.";

/**
 * PREFIX CHUẨN để ghép trước mô tả nhân vật mới — dùng CHUNG cho MỌI nhân vật từ giờ trở đi,
 * LUÔN đính kèm ảnh master reference (xem MASTER_REFERENCE_NOTE) khi gửi prompt này. Đã bỏ hẳn
 * phần mô tả tư thế/biểu cảm/nền mặc định ("standing pose", "gentle expression", "same plain
 * background as reference"...) khỏi phần MÔ TẢ NHÂN VẬT — để trống cho người viết prompt tự
 * thêm tư thế/biểu cảm CỤ THỂ theo từng cảnh nếu cần, tránh lặp lại boilerplate không cần thiết.
 *
 * Cách dùng: `${CHARACTER_PROMPT_PREFIX} <mô tả nhân vật mới, càng ngắn gọn càng tốt>`
 */
/**
 * ÉP GÓC 3/4 CHO MỌI NHÂN VẬT (2026-08-11, người dùng chốt).
 *
 * VÌ SAO Ở ĐÂY chứ không ở prompt cảnh ghép: đã thử ép 3/4 ngay trong prompt cảnh — dùng đúng
 * công thức mạnh nhất đã biết (đưa lên đầu + ngôn ngữ hình học + nhắc lại cuối, mục 8.1.3f) —
 * và VẪN THUA: cả 4 nhân vật trong 2 cảnh test ra chính diện. Nguyên nhân: ảnh Character asset
 * là chính diện, mà "ảnh thắng chữ" nên mỗi lần ghép lại bị kéo về chính diện. Phải sửa từ
 * GỐC: chính ảnh Character phải là 3/4, rồi cảnh ghép tự thừa hưởng.
 *
 * ⚠️ Lịch sử: mục 8.1.3j ghi lại rằng ép 3/4 từng thất bại nhiều vòng với ảnh master CŨ (đầu
 * tròn tuyệt đối, dịch mắt/miệng sang bên không đọc ra là quay đầu). Ảnh master đã đổi từ đó,
 * và các cảnh gần đây đôi lúc ra đầu quay đúng — nên thử lại là hợp lý. Nếu vẫn thua, đừng lặp
 * vô hạn vòng sửa chữ: cân nhắc thay ảnh master bằng 1 ảnh 3/4 sẵn (đúng cách đã giải quyết
 * lần trước).
 *
 * Điểm mấu chốt là tả bằng thứ QUAN SÁT ĐƯỢC trong phong cách này — không có mũi để làm mốc,
 * nên phải neo vào TAI (chỉ hiện 1 bên), KHỐI TÓC (dồn về phía xa) và KHOẢNG MÁ TRỐNG.
 */
export const CHARACTER_THREE_QUARTER_BLOCK =
  "Draw the character in THREE-QUARTER VIEW, turned about forty-five degrees to one side, the " +
  "same way the attached reference image is turned. The nose and the jawline read clearly " +
  "against the far cheek, ONE ear shows on the near side of the head while the other is " +
  "hidden, and the body turns the same way so that one shoulder sits plainly nearer the viewer " +
  "than the other. EXACTLY TWO EYES stay visible. THREE-QUARTER means BETWEEN a flat " +
  "symmetrical front view and a full side profile, and BOTH extremes are wrong, as is any " +
  "view from behind.";

/**
 * KHOÁ CẤU TẠO THÂN NGƯỜI — chống trôi khỏi ảnh master (2026-08-11, người dùng chỉ ra).
 *
 * Ảnh master (`MASTER_REFERENCE_NOTE`) vẽ tay/chân là NÉT MẢNH CỤT, không bàn tay bàn chân, và
 * trang phục là MỘT mảng áo duy nhất. Nhưng qua nhiều cảnh, model tự thêm vào: quần dài riêng,
 * giày, tay áo có nếp, bàn tay có ngón — nhân vật dần biến thành người vẽ đầy đủ, lệch hẳn dàn
 * gốc và nặng công đồ lại.
 *
 * Bốn điều cấm ở đây đều là thứ model TỰ THÊM chứ không ai yêu cầu, nên phải cấm theo TÊN từng
 * cái. Cấm chung chung kiểu "giữ đúng phong cách reference" không ăn — cùng lớp bài học với
 * "ra số cụ thể" ở SIMPLIFY_DETAIL_BLOCK.
 */
export const CHARACTER_BODY_BLOCK =
  "Build the body as a real adult human, the way the reference image does: proportions of " +
  "about seven heads, never a large head on a small body. Draw BOTH HANDS IN FULL with five " +
  "separate articulated fingers, able to actually grip whatever the character holds. Draw real " +
  "arms inside real sleeves with cuffs. When the character is shown at full length, draw the " +
  "legs, the feet and the shoes in full. The clothing is LAYERED — an outer garment sitting " +
  "open over what is worn underneath — with collar, cuffs, lapels, pockets and hem all drawn " +
  "as thin interior lines. Add cloth folds as a FEW short curved thin lines only, at the " +
  "elbows, the waist, the knees and the hem: sparse marks, never dense hatching and never " +
  "shading.";

/**
 * KHOÁ GÓC 3/4 KHI GHÉP CẢNH — `createSceneComposites` tự nối vào MỌI cảnh ghép.
 *
 * VÌ SAO CẦN RIÊNG, không chỉ dựa vào Character asset: ảnh Character đã 3/4 rồi vẫn có thể bị
 * cảnh ghép "nắn thẳng" về chính diện, vì prompt cảnh mô tả tư thế/hành động và model tự chọn
 * hướng mặt cho tiện. Đây là block CỐ ĐỊNH lại, không phải block tạo ra góc 3/4.
 *
 * Diễn đạt theo hướng GIỮ NGUYÊN ("exactly as in their character reference image") chứ không
 * phải TẠO MỚI — vì lúc này ảnh reference đã đúng, chỉ cần cấm model đổi đi.
 *
 * Câu mở đầu bằng "every person" nên cảnh KHÔNG có người thì mệnh đề tự vô hiệu, không sợ
 * model tự thêm người vào.
 *
 * ⚠️ 2026-09-06: câu "every person" cũ ĐÃ PHẢI THU HẸP lại thành "every person drawn in full".
 * Lý do: đám đông nền nay vẽ thành BÓNG ĐEN ĐẶC KHÔNG CÓ MẶT (`CROWD_SILHOUETTE_BLOCK`), mà
 * block này lại ra lệnh "EXACTLY TWO EYES ... on every single face in the picture" — hai vế
 * chỏi nhau trực tiếp, và vế này còn được NHẮC LẠI ở cuối prompt nên nó thắng. Không thu hẹp
 * thì model sẽ gắn mắt vào bóng đen.
 */
export const SCENE_CHARACTER_VIEW_BLOCK =
  "IMPORTANT — every person DRAWN IN FULL in this picture, meaning everyone who has their own " +
  "character reference image attached, keeps the THREE-QUARTER VIEW they already have in " +
  "that reference image: head and body turned about forty-five degrees to one " +
  "side, only ONE ear visible, the mass of the hair sitting toward the far side, and one " +
  "shoulder plainly nearer the viewer than the other. THREE-QUARTER means BETWEEN the two " +
  "extremes, and BOTH extremes are forbidden: do NOT straighten anyone into a flat symmetrical " +
  "front view, and equally do NOT turn anyone into a full side profile or show anyone from " +
  "behind. EXACTLY TWO EYES must be visible on every single face drawn in full — never one " +
  "eye, never none, never the back of a head. If a pose would hide one eye, rotate that person " +
  "back toward the viewer until both eyes show again. Every face is drawn IN FULL: eyes with " +
  "an upper lid line and a dark iris, eyebrows that carry the expression, a nose drawn with " +
  "one or two short lines, a mouth drawn as a real shape, and a few thin expression lines — a " +
  "frown between the brows, creases from nose to mouth corner, shadows under the eyes — used " +
  "to convey age and mood. " +
  "The ONE exception is any figure this prompt asks for as a plain solid single-colour " +
  "silhouette: such a figure has NO face at all, so do NOT give it eyes, a mouth or any other " +
  "feature, and do NOT redraw it as a person drawn in full. " +
  "Every person also keeps the real adult build of their reference image: about seven heads " +
  "tall, BOTH HANDS drawn in full with five separate fingers gripping whatever they hold, real " +
  "sleeves with cuffs, and — whenever the figure is shown at full length — feet and shoes " +
  "drawn in full. Clothing stays layered, with a few sparse thin fold lines at elbows, waist, " +
  "knees and hem.";

/** Nhắc lại ở CUỐI prompt cảnh ghép — truyền qua tham số `styleBlock` của createImageIngredient. */
export const SCENE_CHARACTER_VIEW_REMINDER =
  "Remember: every person drawn in full stays three-quarter turned — never flattened into a " +
  "front view and never turned into a side profile or seen from behind — with EXACTLY TWO " +
  "EYES visible, a fully drawn face including eyebrows, nose and mouth, and BOTH HANDS drawn " +
  "in full with five separate fingers. Plain solid single-colour silhouette figures are the " +
  "exception and keep no face and no fingers at all.";

/**
 * ĐÁM ĐÔNG NỀN = BÓNG ĐEN ĐẶC (người dùng chốt 2026-09-06).
 *
 * `createSceneComposites` chỉ nối block này vào cảnh có `crowd: true` trong `scenes.json` —
 * KHÔNG nối vào mọi cảnh, vì cảnh 2-3 người không phải cảnh đông người và ở đó ai cũng phải
 * được vẽ đầy đủ.
 *
 * VÌ SAO: đám đông vẽ đầy đủ chi tiết tranh hết sự chú ý với nhân vật chính, và (bài học mục
 * 5c-2 của skill) người nền tả bằng chữ luôn ra sai tỉ lệ vì không có ảnh master nào neo. Bóng
 * đen đặc giải quyết cả hai: không còn mặt/trang phục để tranh sự chú ý, và thứ duy nhất còn
 * lại là HÌNH DÁNG — thứ CÓ THỂ khoá bằng chữ (ra hẳn tỉ lệ đầu/thân), khác hẳn mặt và quần áo.
 *
 * Màu: mặc định đen đặc. Nền tối (trời đêm, rừng sẫm) thì prompt CẢNH nói rõ một màu đơn sắc
 * tối khác — câu "or ... the one single dark colour this prompt names instead" chừa sẵn cửa đó.
 */
export const CROWD_SILHOUETTE_BLOCK =
  "IMPORTANT — this is a CROWD picture, and everyone in the crowd is drawn as a plain " +
  "SILHOUETTE ONLY. Fill each crowd figure completely with ONE single flat solid black, the " +
  "same black as the outlines, or with the one single dark colour this prompt names instead, " +
  "so that the whole figure reads as one unbroken flat shape with nothing inside it: draw NO " +
  "eyes, NO dots, NO mouth, NO nose, NO ears and NO face of any kind on any of them, and NO " +
  "collar, NO buttons, NO belt, NO pocket, NO folds, NO creases, NO pattern and NO second " +
  "colour anywhere inside the shape. A crowd figure keeps the same REAL ADULT PROPORTIONS as " +
  "the people drawn in full — about seven heads tall, never a large head on a short body — but " +
  "reduced to its outline: the head, the shoulders, the arms and the legs read as one " +
  "continuous filled shape, with no fingers, no shoes and no clothing edges picked out inside " +
  "it. Every crowd figure is the SAME total height as the people drawn in full. " +
  "Keep a clear gap between crowd figures so their shapes never merge into one " +
  "black mass, and vary only their heights and the outline of their hair and garment shapes " +
  "slightly so they do not look like copies of one figure. The crowd stays background: no " +
  "crowd figure may overlap, touch or stand in front of anyone drawn in full, and none of them " +
  "may be turned into a detailed person.";

/** Nhắc lại ở CUỐI prompt cảnh đông người — nửa sau của công thức chống "ảnh thắng chữ". */
export const CROWD_SILHOUETTE_REMINDER =
  "Remember: every person in the crowd stays one plain flat solid single-colour silhouette " +
  "with no face, no features and no clothing detail inside it — only the people who have their " +
  "own character reference image attached keep their faces, their two eyes and their colours.";

/** Nhắc lại ở CUỐI prompt — nửa sau của công thức chống "ảnh thắng chữ" (mục 8.1.3f). */
export const CHARACTER_VIEW_REMINDER =
  "Remember: three-quarter turned head and body — never a flat front view and never a side " +
  "profile or back view — with EXACTLY TWO EYES visible on the face, never one.";

export const CHARACTER_PROMPT_PREFIX =
  "Using the exact same illustration style as the attached reference image — same two-weight " +
  "black ink line with a thick outer contour and thinner interior detail, same flat colour " +
  "fill with no gradients, same realistic adult human proportions, same fully drawn face and " +
  "same fully drawn five-fingered hands, on the same plain flat pale-blue background:";

/**
 * CHECKLIST MÔ TẢ NHÂN VẬT — xác nhận 2026-08-01 sau khi test nhân vật lịch sử (Napoleon,
 * Thành Cát Tư Hãn, Cleopatra, Lincoln): mô tả CÀNG NGẮN, CÀNG ĐÚNG TRỌNG TÂM thì kết quả càng
 * ổn định. CHỈ mô tả đúng các mục sau khi viết phần nối sau `CHARACTER_PROMPT_PREFIX`:
 * - Trang phục (quần áo, phụ kiện đặc trưng cầm/đeo trên người).
 * - Tóc (kiểu dáng, màu sắc).
 * - Nón/mũ/khăn trùm đầu (NẾU nhân vật có đội gì đó).
 * - Râu (NẾU nhân vật nam có râu).
 * - Mắt (CHỈ mô tả khi nhân vật là NỮ — vd kẻ mắt, hình dáng mắt).
 * - Màu da (CHỈ mô tả khi khác tông da mặc định của ảnh reference — xem MASTER_REFERENCE_NOTE,
 *   thêm 2026-08-03 vì ảnh reference mới có màu da rõ ràng, không còn trắng phẳng như bản cũ).
 *
 * ⚠️ THÊM 2026-08-03 (đổi ảnh master lần 2, xem MASTER_REFERENCE_NOTE): ảnh reference mới có
 * vài đặc điểm RIÊNG dễ bị model tự kéo theo nếu mô tả nhân vật mới không nói rõ khác đi —
 * kiểu tóc dài buông 2 bên, trang phục có lớp (áo khoác mở lộ sơ mi/cà vạt). Nếu nhân vật mới
 * cần tóc ngắn/trang phục 1 lớp, PHẢI ghi rõ trong phần Trang phục/Tóc, đừng để trống mà hy
 * vọng model tự đổi khác ảnh gốc.
 *
 * TUYỆT ĐỐI KHÔNG mô tả:
 * - Dáng người/tỉ lệ cơ thể (chiều cao, gầy/béo...) — ảnh MASTER REFERENCE đã cố định cấu trúc
 *   thân hình + tay chân dạng que rồi, mô tả thêm dễ xung đột hoặc bị model tự vẽ lại thân hình
 *   sai khác đi.
 * - Biểu cảm khuôn mặt (vui/nghiêm nghị/tự tin...) — đây là lựa chọn RIÊNG theo từng cảnh cụ
 *   thể sau này, không phải đặc điểm NHẬN DẠNG cố định của nhân vật, không thuộc về bước tạo
 *   Character asset. Lông mày CŨNG thuộc nhóm này — ảnh reference mới KHÔNG có lông mày (chỉ
 *   dùng khi cần biểu cảm cụ thể theo cảnh, xác nhận với người dùng 2026-08-03).
 * - Tai — ảnh reference có 1 chi tiết tai nhỏ, đây là đặc điểm CẤU TRÚC kế thừa tự động qua
 *   ảnh, không cần (và không nên) mô tả lại bằng chữ.
 *
 * KHÔNG dùng tên riêng người thật/nổi tiếng trong prompt (dù chỉ để mô tả, không cần đúng như
 * bộ lọc "prominent people" của Flow) — người dùng xác nhận trực tiếp: Nano Banana/Gemini
 * cũng chặn theo chính sách Google nếu gõ thẳng tên thật, dùng mô tả ngoại hình/trang phục để
 * thay thế (đúng tinh thần mục 4.28/4.40 RUNBOOK, nay áp dụng luôn cho Nano Banana).
 */
export const CHARACTER_DESCRIPTION_CHECKLIST = [
  "clothing (outfit + distinctive accessories worn/held — say explicitly if it's a single " +
    "simple layer, otherwise the reference's layered coat-and-tie look may carry over)",
  "hair (style + color — say explicitly if short/simple, otherwise the reference's long " +
    "side-swept strands may carry over)",
  "headwear (hat/hood/headdress, only if the character wears one)",
  "facial hair (only if male character has a beard/moustache)",
  "eyes (only if the character is female — eyeliner, eye shape, etc.)",
  "skin tone (only if different from the reference image's default light skin tone)",
] as const;

/**
 * ANIMAL — KHÁC nhân vật người: chân/đuôi dùng KHỐI PHẲNG CÓ ĐỘ DÀY thật, KHÔNG phải dạng que.
 * XÁC NHẬN qua test tay (2026-08-01, chó/chim/ngựa/gấu): thử chân dạng que (giống người) trước,
 * nhưng trông không tự nhiên với cấu trúc 4 chân/2 chân của động vật — người dùng quyết định
 * đổi sang khối phẳng có độ dày (vẫn đơn giản hoá, không chi tiết móng/ngón/lông) cho MỌI động
 * vật thay vì áp nguyên xi kiểu stick-limb của người.
 *
 * KHÔNG dùng ảnh `reference-character.jpeg` (người) làm reference khi tạo động vật — rủi ro
 * model kéo theo tỉ lệ/dáng đứng giống người vào con vật (cùng bài học "ảnh thắng text" ở
 * MASTER_REFERENCE_NOTE). Mỗi con vật MỚI dùng thẳng `ANIMAL_STYLE_BLOCK` bằng text (không kèm
 * ảnh reference) — giống cách đã tạo ra ảnh master reference người ban đầu. CHƯA chốt 1 ảnh
 * động vật cụ thể nào làm master reference cố định (khác với người) — vì mỗi loài có cấu trúc
 * cơ thể khác nhau (4 chân/2 chân+cánh...), nên hiện dùng chung 1 block text tái sử dụng được
 * cho MỌI loài, không neo theo 1 ảnh cụ thể. Nếu sau này phát hiện lệch phong cách giữa các
 * loài, cân nhắc chốt thêm ảnh reference riêng theo TỪNG NHÓM cấu trúc cơ thể (vd 1 ảnh chuẩn
 * cho nhóm 4 chân, 1 ảnh chuẩn cho nhóm chim/2 chân+cánh).
 */
export const ANIMAL_STYLE_BLOCK =
  "One animal, hand-drawn flat illustration, on a PLAIN FLAT PALE BLUE background with no " +
  "scenery, no ground line and no cast shadow. Ink it with TWO line weights: a thick outer " +
  "contour around the whole animal, thinner interior lines for the face, the ear edges, the " +
  "muscle and coat divisions. Correct animal anatomy and correct proportions for the species — " +
  "not a simplified geometric toy shape. The face is drawn in full: an eye with a lid line and " +
  "a dark iris, the nostril, the mouth line. Legs are solid shapes with real width ending in a " +
  "properly drawn paw or hoof. Flat colour fills with no gradients; at most ONE slightly " +
  "darker tone of the same colour for a marking or a recessed area. Standing pose, three-" +
  "quarter or side view, whole body visible.";

/**
 * GIẢM MẬT ĐỘ CHI TIẾT — ✅ ĐÃ TEST (2026-08-02, tạo lại cả 6 background của case 1).
 *
 * KẾT QUẢ RÕ RỆT ở đúng chỗ nhắm tới: giàn thép chân tháp từ HÀNG CHỤC thanh chéo nhỏ rút
 * còn VÀI hình tam giác lớn; hàng rào còn mấy cọc + 2 thanh ngang; mặt đất thành dải phẳng
 * với vài mảng tuyết đơn giản. Bố cục dải ngang và nét tay đều giữ nguyên. Ảnh giờ đồ lại
 * bằng tay được thật.
 *
 * ⚠️ CHƯA TRIỆT ĐỂ ở mặt tiền kiến trúc: cảnh chung cư và sở cảnh sát vẫn còn khá nhiều ô cửa
 * lặp (5 tầng × ~10 cửa). Block có ép "draw only a few widely spaced members" nhưng với mặt
 * tiền nhà, model coi số tầng/số cửa là thông tin NỘI DUNG (đã ghi rõ "five-storey", "a row of
 * tall windows") nên giữ lại. Nếu cần đơn giản hơn nữa: sửa DESCRIPTION của từng cảnh (giảm
 * hẳn số cửa sổ mô tả), đừng siết thêm block — block đã làm đúng phần việc của nó.
 *
 * LÝ DO RA ĐỜI: mục tiêu thật của người dùng là ĐỒ LẠI ảnh bằng tay. Test
 * `HAND_DRAWN_LINE_BLOCK` cho thấy nét mềm KHÔNG phải yếu tố quyết định — ảnh ra vẫn có hàng
 * chục thanh chéo nhỏ trong giàn thép tháp, đồ lại rất mệt. `BACKGROUND_STYLE_BLOCK` đã có câu
 * "keep all decorative detail extremely minimal" nhưng KHÔNG đủ mạnh với KẾT CẤU LẶP (giàn
 * thép, lan can, ngói, hàng cột, ô kính) — model coi đó là "cấu trúc" chứ không phải "trang
 * trí" nên không áp câu kia vào.
 *
 * Vì vậy block này nhắm thẳng vào KẾT CẤU LẶP, và neo bằng 1 tiêu chí ĐẾM ĐƯỢC (số nét cần để
 * đồ lại) thay vì tính từ mơ hồ như "đơn giản".
 */
export const SIMPLIFY_DETAIL_BLOCK =
  "Give every object the amount of detail a hand illustrator would draw, and stop there. An " +
  "armchair gets its arms, its turned wooden legs and a few seam lines on the upholstery; a " +
  "building gets its windows, its roofline, its door and its sign bracket. What it never gets " +
  "is photographic surface texture: no fine hatching, no cross-hatching, no rendered material, " +
  "no dense ornament, no filigree. Any repeating structural pattern — brickwork, roof tiles, " +
  "clapboard, lattice girders, balusters, rows of window panes — is SUGGESTED with a scatter " +
  "of a few marks over part of the surface, never drawn out course by course across the whole " +
  "of it. Detail belongs on the things the story is about; everything else stays plain.";

/**
 * NÉT VẼ TAY "NGUỆCH NGOẠC" — ✅ ĐÃ TEST (2026-08-02, cảnh "Tower Winter Dawn Sketch", 43s).
 * Viết theo yêu cầu người dùng: muốn nét nguệch ngoạc cho DỄ ĐỒ LẠI bằng tay.
 *
 * KẾT QUẢ: ĐẠT cả 2 mục tiêu. Nét ra vẽ tay thật (cành cây là nét freehand lỏng, bụi cây là
 * mảng méo không đều, đường cong vòm không tròn máy móc, độ dày nét thay đổi dọc đường) VÀ
 * bố cục dải ngang giữ nguyên 100% (hàng cây cùng độ cao, 2 trụ cùng độ rộng/góc, đường nền
 * liền mép-tới-mép). Câu bảo vệ bố cục ở cuối block là thứ chặn được rủi ro chính.
 *
 * ⚠️ CHƯA GIẢI QUYẾT — "dễ đồ lại" còn phụ thuộc MẬT ĐỘ CHI TIẾT, không chỉ chất nét: ảnh
 * test ra phần giàn thép của tháp rất dày chi tiết (hàng chục thanh chéo nhỏ), đồ lại bằng tay
 * sẽ rất mệt, dù nét đã mềm. `BACKGROUND_STYLE_BLOCK` có câu "keep all decorative detail
 * extremely minimal" nhưng rõ ràng chưa đủ mạnh với kết cấu lặp kiểu giàn thép. Nếu mục tiêu
 * chính là đồ lại, cần thêm 1 điều khoản ép giảm số lượng chi tiết lặp (vd "represent repeating
 * structural lattice as a few large simple shapes, not dozens of small individual braces").
 *
 * VẤN ĐỀ CẦN TRÁNH: `BASE_STYLE_BLOCK` hiện ghi "vector illustration" + "uniform-width
 * outlines" — cả 2 cụm này đều đẩy model về phía nét máy sạch, thẳng tắp. Muốn nét tay thì
 * phải nói ngược lại rõ ràng, nếu không 2 chỉ dẫn mâu thuẫn và cụm "vector" thường thắng.
 *
 * 🔑 ĐIỂM MẤU CHỐT: chỉ đổi CHẤT NÉT, KHÔNG đổi BỐ CỤC. Các cảnh background đã chốt bố cục
 * dải ngang phẳng (`NO_PERSPECTIVE_BLOCK` + mô tả dải ngang, mục 3g RUNBOOK) — nếu prompt chỉ
 * nói chung chung "hand-drawn, sketchy" thì model rất dễ hiểu là được vẽ tuỳ hứng và làm hỏng
 * luôn layout vừa sửa xong. Vì vậy block này nói TƯỜNG MINH: đường vẫn nằm đúng chỗ hình học
 * cũ, chỉ có bản thân nét mực là run tay.
 */
export const HAND_DRAWN_LINE_BLOCK =
  "Hand-drawn look: every outline is drawn freehand with a felt-tip marker, NOT with a ruler " +
  "and NOT as clean computer vector paths. Each stroke wobbles slightly and strokes slightly " +
  "overshoot and cross each other at corners. This does NOT blur the two line weights: an " +
  "outer contour stays clearly thicker than the interior detail lines throughout. " +
  "The flat colour fills themselves stay clean and stop at the outline — the looseness is in " +
  "the ink line, not in the paint. " +
  "IMPORTANT: this changes only the QUALITY OF THE INK LINE, never the layout. The composition " +
  "stays exactly as described: same placement, same relative sizes, same three-quarter object " +
  "views, same plain flat background field. A shape described as upright must still read as " +
  "upright, it is just drawn by a slightly unsteady hand rather than by a machine.";

/**
 * PROP / VẬT DỤNG — ✅ ĐÃ TEST THẬT LẦN 1 (2026-08-02, prop "Newsreel Camera" của case
 * Reichelt, tạo qua `createImageIngredient` trong Flow chế độ Image/Nano Banana 2, 34 giây).
 *
 * ĐÚNG như mong đợi: outline đen đậm đều, màu phẳng, đúng 1 vật thể ở giữa khung, nền 1 màu
 * trơn không cảnh vật/không bóng đổ, không có người/bàn tay, và — điều khoản quan trọng nhất
 * — chân máy ba chân ra KHỐI CÓ ĐỘ DÀY THẬT chứ không phải nét que. Điều khoản "mọi bộ phận
 * cứng dùng khối phẳng có độ dày, KHÔNG dùng nét que" hoạt động đúng ý đồ.
 *
 * ✅ TEST LẦN 2 (2026-08-02, cùng ngày): thêm 2 prop cấu trúc rất khác nhau — "Parachute
 * Suit" (đồ vải mặc được, 42s) và "Tailor Dummy" (hình nộm, 32s). CẢ HAI ĐẠT: đúng hình
 * dạng theo mô tả, outline/màu phẳng nhất quán với prop máy móc trước đó. Bộ dù bám rất sát
 * ảnh tư liệu thật (2 cánh vải xoè ngang, khung mũ trùm dựng trên que cứng, thắt lưng khoá
 * vuông, dây đai buông). Kết luận: block dùng được cho cả 3 nhóm cấu trúc đã thử (máy móc có
 * chân đế / đồ vải / hình nộm có trụ đế).
 *
 * 🔴 VẤN ĐỀ ĐÃ XÁC NHẬN QUA 3 PROP — NỀN MỖI ẢNH MỘT MÀU KHÁC NHAU. Thực tế nhận được:
 * máy quay = nâu vàng, bộ dù = xám nhạt, hình nộm = xanh da trời, nhân vật = trắng. Nguyên
 * nhân: block chỉ ghi "Plain solid single-color background" mà KHÔNG chỉ định MÀU NÀO, nên
 * model tự chọn mỗi ảnh một kiểu. Hệ quả: muốn tách nền để ghép asset vào cảnh thì mỗi ảnh
 * phải xử lý một kiểu, và xếp cạnh nhau trong cùng 1 video trông không cùng bộ.
 * 👉 CÁCH SỬA ĐỀ XUẤT (chưa áp dụng, chờ người dùng quyết): chốt cứng 1 màu nền trong block
 * — hoặc nền chroma-key như `CHARACTER_SHEET_STYLE_BLOCK` của pipeline Flow cũ
 * (`src/styleDNA.ts`), hoặc trắng thuần. Sửa xong PHẢI tạo lại cả 3 prop đã có.
 *
 * ⚠️ ĐIỂM CẦN QUYẾT KHÁC (chưa xử lý): prop ra ở góc 3/4 và mỗi mặt tô 1 sắc độ khác nhau để
 * gợi khối — trong khi ảnh master reference NHÂN VẬT phẳng tuyệt đối và chính diện. Ghép
 * chung 1 khung có thể lệch cảm giác không gian. Chưa đủ cơ sở kết luận cần ép
 * "front or side view only, single flat tone per object".
 *
 * Bối cảnh khi viết block (giữ lại để hiểu vì sao có từng điều khoản) — suy luận từ 2 bài
 * học đã xác nhận:
 * - Từ `ANIMAL_STYLE_BLOCK`: những gì KHÔNG phải chi/tay chân người thì dùng KHỐI PHẲNG CÓ ĐỘ
 *   DÀY thật, không dùng dạng que — áp dụng cho mọi bộ phận cứng của đồ vật (chân bàn, chân
 *   máy, cán, trục...).
 * - Từ `ANIMAL_STYLE_BLOCK` + `MASTER_REFERENCE_NOTE`: KHÔNG đính ảnh `reference-character.jpeg`
 *   (người) khi tạo đồ vật — rủi ro model kéo tỉ lệ/đặc điểm người vào vật thể (bài học "ảnh
 *   thắng text"). Prop dùng THẲNG block text này, không kèm ảnh reference, giống cách đã tạo
 *   ảnh master reference người ban đầu.
 * - Từ `BACKGROUND_STYLE_BLOCK`: ép chi tiết quy về hình khối cơ bản, cấm hoa văn/khắc chạm
 *   tinh vi — đây là điểm mọi block trong file này đều chia sẻ.
 *
 * CHƯA chốt ảnh master reference cố định cho Prop (giống tình trạng động vật) — vì mỗi loại đồ
 * vật có cấu trúc rất khác nhau. Nếu sau khi test thấy lệch phong cách giữa các đồ vật, cân
 * nhắc chốt ảnh reference riêng theo TỪNG NHÓM (đồ mặc được / máy móc có chân đế / vũ khí...).
 */
export const PROP_STYLE_BLOCK =
  "ONE single object, centered, entirely visible inside the frame, on a PLAIN FLAT PALE BLUE " +
  "background — no scenery, no room, no ground line, no cast shadow. NO people, NO hands, NO " +
  "characters of any kind. Draw the object in a LOOSE THREE-QUARTER VIEW so it reads as a " +
  "solid thing with real depth: a table top is a parallelogram, an armrest recedes, a box " +
  "shows two faces. Give it the amount of detail a real object has — an armchair has arms, " +
  "turned wooden legs and seam lines on the upholstery; a building sign has a frame and a " +
  "bracket — but stop well short of photographic texture. Ink it with the TWO line weights: a " +
  "thick outer contour around the whole object, thinner lines inside for panel edges, seams, " +
  "wood grain and joins. Flat colour fills, with at most ONE slightly darker tone of the same " +
  "colour on a recessed face such as a seat cushion or a table top. Fabric parts get a few " +
  "plain fold lines only.";

/**
 * BACKGROUND — quy tắc chung cho MỌI ảnh bối cảnh (Setting), áp dụng cùng với BASE_STYLE_BLOCK.
 * Đã xác nhận qua nhiều cảnh test (phố gỗ, bến tàu, nội thất cung điện, làng adobe, quảng
 * trường thị trấn, hội trường nghị viện) — 2026-08-01.
 */
export const BACKGROUND_STYLE_BLOCK =
  "Do NOT draw a room and do NOT draw an environment. Draw ONLY the furniture and the objects " +
  "that tell the viewer where this is, standing on a PLAIN FLAT PALE BLUE background: no " +
  "floor, no walls, no ceiling, no rug, no sky, no horizon line and no cast shadows. Three " +
  "armchairs around a low table with glasses on it IS the sitting room — nothing else is " +
  "needed and nothing else may be added. NO people, NO characters, NO figures of any kind. " +
  "The objects are drawn in a loose three-quarter view and MAY overlap each other freely. " +
  "When the subject is a BUILDING, draw the building as one standalone object in loose " +
  "two-point perspective with its real architectural detail, and put a SMALL irregular patch " +
  "of ground or pavement directly under it that simply ends a short way out — never a full " +
  "street, never neighbouring buildings, never a drawn sky. Leave any text surface blank.";

/**
 * CHỐNG PHỐI CẢNH HỘI TỤ — bắt buộc cho cảnh có kiến trúc thẳng hàng (phố, mặt tiền nhà, dãy
 * cột...). XÁC NHẬN: model mặc định vẽ phối cảnh điểm tụ thật (đường phố hút về xa) nếu không
 * cấm rõ — phải nói rõ đây là bố cục "phẳng kiểu sân khấu", không phải ảnh chụp 3D thật.
 * KHÔNG áp dụng cứng nhắc cho cảnh phong cảnh thiên nhiên rộng — xem
 * LAYERED_DEPTH_LANDSCAPE_NOTE bên dưới cho trường hợp đó.
 */
export const NO_PERSPECTIVE_BLOCK =
  "Perspective lives INSIDE each object and nowhere else. Each individual object is drawn in a " +
  "loose three-quarter view with real volume — a table top reads as a parallelogram, a chair " +
  "arm recedes — but the picture as a whole has NO shared perspective: no vanishing point, no " +
  "receding street, no converging room corner, no horizon line, no drawn ground plane and no " +
  "cast shadows. Everything stands directly on the plain flat background field. Objects and " +
  "people are placed side by side at roughly the same scale and MAY overlap each other freely; " +
  "nothing shrinks toward a distance.";

/**
 * Ghi chú (không phải block để nối trực tiếp vào prompt) — cho cảnh phong cảnh thiên nhiên
 * rộng (đồng ruộng, núi, làng xa...): KHÔNG cần ép "zero depth" như NO_PERSPECTIVE_BLOCK ở
 * trên — chiều sâu kiểu XẾP LỚP (núi xa → làng giữa → ruộng gần, to nhỏ theo lớp) vẫn giữ được
 * cảm giác phẳng đặc trưng, KHÔNG cần cấm. Chỉ cấm đường thẳng hội tụ kiểu phối cảnh kiến trúc
 * thật (không có "đường ray" hội tụ về 1 điểm). Khi viết prompt cho cảnh loại này, mô tả trực
 * tiếp từng lớp (background/midground/foreground) thay vì dùng NO_PERSPECTIVE_BLOCK.
 */
/**
 * PHỐI CẢNH ĐƠN GIẢN — hướng phong cách MỚI (2026-08-11, người dùng chốt sau khi xem 1 kênh
 * khác làm cùng thể loại).
 *
 * BÀI HỌC CỐT LÕI: **"có phối cảnh" KHÔNG mâu thuẫn với "dễ đồ lại bằng tay"**. Thứ khiến ảnh
 * dễ đồ không phải là phẳng trực giao, mà là MỌI MẶT ĐỀU TÔ 1 MÀU ĐẶC — không đổ bóng, không
 * chuyển sắc, không vân bề mặt. Chiều sâu đến từ GÓC ĐẶT và KÍCH THƯỚC của các mảng phẳng, chứ
 * không từ việc tô vẽ. Trước đây ta ép trực giao (`NO_PERSPECTIVE_BLOCK`) vì tưởng đó là cách
 * duy nhất giữ đơn giản — hoá ra không phải.
 *
 * Lợi ích kèm theo: nhân vật do pipeline sinh ra đều ở góc 3/4, nền có phối cảnh mới cho họ
 * chỗ đứng tự nhiên (xem thêm `INTERIOR_CORNER_NOTE` bên dưới — nay chỉ còn là bản NHẸ hơn của
 * block này, dùng khi chỉ cần đúng 1 góc phòng).
 *
 * KHÔNG nhắc tới đám đông trong block này (dù ảnh tham khảo dùng bóng người xám rất hiệu quả) —
 * `BACKGROUND_STYLE_BLOCK` cấm mọi bóng người trong background, thêm vào là 2 câu đá nhau.
 * Kỹ thuật đám đông thuộc về prompt CẢNH GHÉP, ghi trong skill.
 *
 * 🔴 SỬA LỚN 2026-08-14 — ÉP MỘT ĐIỂM TỤ, MẶT CHÍNH SONG SONG VỚI KHUNG HÌNH.
 * Người dùng xem loạt background case 4 và loại: "mọi thứ đang bị chéo, nhìn không đúng". Bản
 * block cũ là THỦ PHẠM TRỰC TIẾP — nó viết thẳng "walls, buildings and furniture are seen at an
 * angle... rectangular objects are drawn as parallelograms", tức là chủ động YÊU CẦU phối cảnh
 * 2 điểm tụ (vật xoay chéo, không cạnh nào song song với khung hình).
 *
 * Phân biệt cần nhớ, vì 2 thứ này rất dễ gộp làm một:
 * - "Có chiều sâu" (thứ người dùng MUỐN, quyết định 2026-08-11) — vẫn giữ.
 * - "Vật xoay chéo góc" (thứ người dùng KHÔNG muốn) — bỏ.
 * Phối cảnh MỘT điểm tụ cho cả hai: mặt chính vẫn là hình chữ nhật thật song song với khung,
 * chiều sâu chỉ nằm ở các cạnh chạy lùi về điểm tụ. Đây cũng là kiểu phối cảnh dễ đồ lại bằng
 * tay nhất — phần lớn đường nét vẫn là ngang/dọc thuần.
 *
 * ⚠️ HỆ QUẢ: mọi background viết TRƯỚC ngày này đều mang chữ "drawn at an angle so its top reads
 * as a parallelogram" / "at a slight angle so both walls are visible" ngay trong `description` —
 * sửa block thôi KHÔNG đủ, phải sửa cả câu chữ trong từng asset, nếu không mô tả riêng của asset
 * sẽ đánh nhau với block (và mô tả cụ thể thường thắng).
 */
export const SIMPLE_PERSPECTIVE_BLOCK =
  "Draw the scene in ordinary three-dimensional cartoon perspective, but strictly as ONE-POINT " +
  "perspective seen HEAD-ON. The camera faces the main surfaces square-on, so every main face — " +
  "the front wall of a building, the back wall of a room, the front of a desk, the side of a " +
  "bed, the front of a bench — is drawn as a TRUE RECTANGLE whose top and bottom edges are " +
  "perfectly HORIZONTAL and whose left and right edges are perfectly VERTICAL, exactly parallel " +
  "to the edges of the picture. Depth appears ONLY on the faces that turn away from the viewer: " +
  "the edges running back into the distance are the ONLY slanted lines in the whole picture, and " +
  "they all converge on a single vanishing point near the centre of the frame. " +
  "NEVER rotate an object so that both of its faces are slanted and none of its edges stay " +
  "parallel to the frame — that skewed corner-on look is wrong here. If an object shows only one " +
  "face, that face is a plain upright rectangle facing the viewer, not a parallelogram. This is " +
  "still a real perspective view with depth, NOT a flat theater backdrop. " +
  "BUT the rendering stays flat: every single surface is filled with ONE " +
  "flat solid color — absolutely no gradients, no shading, no cast shadows, no texture, no " +
  "hatching, no highlights, no reflections. Depth comes ONLY from the angle and the size of " +
  "flat shapes, never from rendering or lighting. Every shape carries the two-weight black " +
  "ink line: thick outer contour, thinner lines inside it. " +
  "Use a narrow palette for the whole picture: one dominant hue rendered in a few flat tints, " +
  "so the mood comes from colour choice rather than from light and shadow. If sky is visible it " +
  "is ONE flat colour band with a simple skyline of plain flat rectangles in a lighter tint. " +
  "To tell two surfaces apart, give each one a DIFFERENT FLAT TINT of the same colour — never " +
  "use shading, never darken an edge, never blend. " +
  "Draw NO surface texture of any kind: no wood grain, no clapboard or siding lines, no brick " +
  "courses, no roof tiles or shingles, no floorboards, no panel seams. Every wall, roof and " +
  "floor is ONE single empty flat shape with nothing drawn inside it.";

/**
 * GÓC PHÒNG NỘI THẤT — cho background trong nhà sẽ được GHÉP NHÂN VẬT vào.
 *
 * VÌ SAO TỒN TẠI (2026-08-11, người dùng chốt): ảnh master reference sinh ra nhân vật ở góc
 * **3/4 view**. Đặt nhân vật 3/4 lên nền phẳng tuyệt đối (`NO_PERSPECTIVE_BLOCK`, kiểu phông
 * sân khấu) thì người và nền đá nhau — người có chiều, nền thì không, nhìn như dán đè lên.
 * Một góc phòng nhẹ cho nhân vật chỗ đứng hợp lý.
 *
 * KHÁC `NO_PERSPECTIVE_BLOCK`: cho phép ĐÚNG 1 góc (2 mảng tường gặp nhau) và foreshorten nhẹ
 * ở mảng bên. VẪN CẤM cảnh hút sâu thật (hành lang dài, dãy vật thể nhỏ dần về xa) — đó là thứ
 * đã làm hỏng 2 cảnh tháp Eiffel đầu tiên và bị người dùng loại (RUNBOOK 8.1.3g).
 *
 * KHÔNG dùng cho: phố xá/dãy nhà/mặt tiền (dùng "flat"), phong cảnh thiên nhiên rộng
 * (dùng "layered"), hay background toàn cảnh không ghép người.
 */
export const INTERIOR_CORNER_NOTE =
  "Interior corner composition: the room is built from exactly TWO flat wall planes meeting " +
  "along ONE single vertical corner line, with mild foreshortening allowed on the side wall " +
  "only so a character standing in the room reads as being inside a real space. This is NOT a " +
  "deep perspective scene: no long receding corridor, no second vanishing point, no rows of " +
  "objects or floor tiles shrinking away into the distance. Every surface stays a plain flat " +
  "colour fill inked with the two-weight black line — thick outer contour, thinner lines " +
  "inside — with no shading and no gradients.";

export const LAYERED_DEPTH_LANDSCAPE_NOTE =
  "Layered flat-depth landscape composition (background/midground/foreground layers stacked " +
  "by simple scale and position — NOT single-point converging perspective, no receding " +
  "parallel lines).";

/**
 * CHỪA CHỖ ĐẶT NHÂN VẬT — bắt buộc cho MỌI background dự định ghép nhân vật vào sau (đúng vai
 * trò Setting cũ trong pipeline Flow). Không có block này, model có xu hướng lấp đầy khung
 * hình bằng chi tiết (như ảnh cột/rèm cung điện lần đầu, không còn chỗ trống).
 */
export const RESERVE_CHARACTER_SPACE_BLOCK =
  "Leave a clear, mostly empty flat-colored floor/ground area occupying roughly the bottom " +
  "third of the frame, kept visually simple and uncluttered — this space is reserved for a " +
  "character to be placed into later, so avoid objects, furniture, or patterned flooring " +
  "directly in this zone.";

/**
 * GÓC MÁY NGANG TẦM MẮT — bắt buộc cho MỌI background dự định ghép nhân vật đứng vào sau.
 * XÁC NHẬN (2026-08-01, cảnh hội trường nghị viện): không có block này, model có xu hướng đặt
 * camera hơi từ trên chéo xuống (nhìn thấy mặt bàn/sàn từ trên) để "khoe" được nhiều chi tiết
 * phòng hơn — khiến sàn trước không còn ở góc nhìn tự nhiên để đặt 1 nhân vật đứng vào.
 */
export const EYE_LEVEL_CAMERA_BLOCK =
  "Camera positioned at human standing eye-level, looking straight ahead or very slightly " +
  "upward — NOT a high-angle or bird's-eye downward-looking shot. The foreground floor must " +
  "be viewed nearly edge-on at a shallow, almost horizontal angle (like a normal human " +
  "viewpoint), not seen from above as a wide flat surface. A standing character placed in the " +
  "foreground should read as being viewed straight at their own eye level, not looked down " +
  "upon.";

/**
 * Ví dụ dùng ANIMAL_STYLE_BLOCK (không ráp thêm gì khác, không kèm ảnh reference):
 *
 *   [ANIMAL_STYLE_BLOCK]
 *   <mô tả loài + đặc điểm riêng, vd: "Simplified bear head... stockier and rounder body...">
 *
 * Ví dụ ráp 1 prompt Background hoàn chỉnh (kiến trúc, có chỗ đặt nhân vật):
 *
 *   [BASE_STYLE_BLOCK]
 *   [BACKGROUND_STYLE_BLOCK]
 *   [NO_PERSPECTIVE_BLOCK]
 *   [RESERVE_CHARACTER_SPACE_BLOCK]
 *   [EYE_LEVEL_CAMERA_BLOCK]
 *   Scene: <mô tả cảnh cụ thể + bảng màu>
 *
 * Với cảnh phong cảnh thiên nhiên rộng, thay NO_PERSPECTIVE_BLOCK bằng
 * LAYERED_DEPTH_LANDSCAPE_NOTE (chỉ là ghi chú định hướng, mô tả layer trực tiếp trong phần
 * Scene, xem ví dụ cảnh đồng ruộng đã test).
 */
