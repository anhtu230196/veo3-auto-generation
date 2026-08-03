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

export const STYLE_NAME = "Nano Banana flat 2D vector (geometric-primitive, no-shading)";

/**
 * Áp dụng cho MỌI ảnh (Character lẫn Background) — phần lõi chung của phong cách.
 */
export const BASE_STYLE_BLOCK =
  "Flat 2D vector illustration style, bold uniform-width black outlines around every shape. " +
  "Completely flat color fills, no shading, no gradients, no drop shadows.";

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
  "Reference image: reference-character (man with side-swept brown hair, long strands framing " +
  "both sides of the face down to chest level, skin-tone round head, small ear visible, white " +
  "lab coat open over a blue shirt and grey tie) — the single fixed visual anchor for ALL human " +
  "characters going forward. If a new character needs a clearly different hairstyle, skin " +
  "tone, or outfit type, describe that explicitly — otherwise the reference's specific traits " +
  "(long side hair strands, skin tone, layered coat-and-tie outfit) will carry over by default.";

/**
 * PREFIX CHUẨN để ghép trước mô tả nhân vật mới — dùng CHUNG cho MỌI nhân vật từ giờ trở đi,
 * LUÔN đính kèm ảnh master reference (xem MASTER_REFERENCE_NOTE) khi gửi prompt này. Đã bỏ hẳn
 * phần mô tả tư thế/biểu cảm/nền mặc định ("standing pose", "gentle expression", "same plain
 * background as reference"...) khỏi phần MÔ TẢ NHÂN VẬT — để trống cho người viết prompt tự
 * thêm tư thế/biểu cảm CỤ THỂ theo từng cảnh nếu cần, tránh lặp lại boilerplate không cần thiết.
 *
 * Cách dùng: `${CHARACTER_PROMPT_PREFIX} <mô tả nhân vật mới, càng ngắn gọn càng tốt>`
 */
export const CHARACTER_PROMPT_PREFIX =
  "Using the exact same illustration style as the attached reference image — same bold " +
  "uniform-width black outlines, same flat color fill with zero shading, same stick-line limb " +
  "treatment, same simplified head/eyes, no background:";

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
  "Minimalist animal character design, flat 2D vector art style, bold uniform-width black " +
  "outlines, completely flat colors, no shading, no gradients, no textures. Plain solid " +
  "single-color background, no scenery. Simplified head built from basic geometric shapes " +
  "(species-appropriate snout/beak shape, simple flat ear shapes if any, one or two black dot " +
  "eyes, no other facial detail). Flat-colored simplified body shape. Legs drawn as simple " +
  "flat-colored solid shapes (short rounded cylinders/rectangles with real width and volume — " +
  "NOT thin stick lines), each ending in a small simple rounded flat paw/hoof shape with no " +
  "toe or claw detail. Tail matching the same solid-shape treatment (not a thin line). " +
  "Standing pose, side profile view, full body visible.";

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
  "Draw the scene with as few separate shapes as possible, because a person has to be able to " +
  "trace the whole picture by hand quickly. Any repeating structural pattern — lattice " +
  "girders, railings, balusters, roof tiles, rows of columns, window panes, brickwork — must " +
  "be reduced to a SMALL number of large simple shapes, never dozens of small individual " +
  "pieces. Draw only a few widely spaced members and let them stand for the whole structure. " +
  "No fine hatching, no small repeated marks, no surface texture, no tiny ornament. If a " +
  "detail would take more than a few strokes to trace, simplify it into one flat shape " +
  "instead.";

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
  "and NOT as clean computer vector paths. Each stroke wobbles slightly, its thickness varies " +
  "a little along its length, and strokes slightly overshoot and cross each other at corners. " +
  "Flat color fills are painted a little loosely so they sometimes stop just short of the " +
  "outline or spill a little past it. " +
  "IMPORTANT: this changes only the QUALITY OF THE INK LINE, never the layout. The composition " +
  "stays exactly as described: same flat head-on arrangement, same horizontal bands, same " +
  "symmetry, no perspective. A line described as horizontal must still read as horizontal and " +
  "span the full width, it is just drawn by a slightly unsteady hand rather than a machine.";

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
  "Minimalist single-object prop design, flat 2D vector art style, bold uniform-width black " +
  "outlines, completely flat colors, no shading, no gradients, no textures. Plain solid " +
  "single-color background, no scenery, no ground line, no cast shadow. ONE object only, " +
  "centered, entire object fully visible inside the frame. NO people, NO hands, NO characters " +
  "of any kind. Build the whole object from basic geometric primitives only (rectangles, " +
  "circles, simple arcs, plain tapered shapes) — no intricate ornament, no engraved detail, no " +
  "fine linework, no realistic material texture. Every rigid part (legs, poles, handles, " +
  "shafts, frames) drawn as a flat-colored solid shape with real width and volume, NOT as a " +
  "thin stick line. Fabric parts drawn as simple flat-colored panels with a few plain fold " +
  "lines only.";

/**
 * BACKGROUND — quy tắc chung cho MỌI ảnh bối cảnh (Setting), áp dụng cùng với BASE_STYLE_BLOCK.
 * Đã xác nhận qua nhiều cảnh test (phố gỗ, bến tàu, nội thất cung điện, làng adobe, quảng
 * trường thị trấn, hội trường nghị viện) — 2026-08-01.
 */
export const BACKGROUND_STYLE_BLOCK =
  "Full-bleed composition filling the entire frame edge to edge — no decorative border, no " +
  "vignette. NO people, NO characters, NO figures of any kind — empty environment only. " +
  "Keep all decorative detail extremely minimal and simplified — every detail must be built " +
  "from basic geometric primitives only (rectangles, simple arcs/half-circles, circles, plain " +
  "spiral/volute shapes). Avoid intricate repeating ornamental patterns, filigree, carved " +
  "relief, or fine linework — plain flat-colored panels and simple trim only.";

/**
 * CHỐNG PHỐI CẢNH HỘI TỤ — bắt buộc cho cảnh có kiến trúc thẳng hàng (phố, mặt tiền nhà, dãy
 * cột...). XÁC NHẬN: model mặc định vẽ phối cảnh điểm tụ thật (đường phố hút về xa) nếu không
 * cấm rõ — phải nói rõ đây là bố cục "phẳng kiểu sân khấu", không phải ảnh chụp 3D thật.
 * KHÔNG áp dụng cứng nhắc cho cảnh phong cảnh thiên nhiên rộng — xem
 * LAYERED_DEPTH_LANDSCAPE_NOTE bên dưới cho trường hợp đó.
 */
export const NO_PERSPECTIVE_BLOCK =
  "Flat orthographic composition with NO perspective and NO vanishing point — camera looking " +
  "straight at the scene, not down a receding street or into a converging corner. Elements " +
  "arranged as flat parallel planes across the frame, like a theater backdrop or paper cutout " +
  "diorama, all at the same flat depth layer. No 3D depth, no diminishing scale toward a " +
  "horizon point.";

/**
 * Ghi chú (không phải block để nối trực tiếp vào prompt) — cho cảnh phong cảnh thiên nhiên
 * rộng (đồng ruộng, núi, làng xa...): KHÔNG cần ép "zero depth" như NO_PERSPECTIVE_BLOCK ở
 * trên — chiều sâu kiểu XẾP LỚP (núi xa → làng giữa → ruộng gần, to nhỏ theo lớp) vẫn giữ được
 * cảm giác phẳng đặc trưng, KHÔNG cần cấm. Chỉ cấm đường thẳng hội tụ kiểu phối cảnh kiến trúc
 * thật (không có "đường ray" hội tụ về 1 điểm). Khi viết prompt cho cảnh loại này, mô tả trực
 * tiếp từng lớp (background/midground/foreground) thay vì dùng NO_PERSPECTIVE_BLOCK.
 */
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
