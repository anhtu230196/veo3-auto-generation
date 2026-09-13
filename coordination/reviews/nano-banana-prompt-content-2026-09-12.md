# Review nội dung skill viết prompt Nano Banana — 2026-09-12

**Kết luận:** skill có nền tảng tốt, nhưng cần chỉnh trước khi dùng làm hướng dẫn thống nhất để tạo từng ảnh phục vụ hậu kỳ như video mẫu. Chỗ cần cải thiện nhất là chuyển ý lời kể thành nội dung nhìn thấy được, quyết định tách hay ghép phần tử, và loại bỏ các chỉ dẫn nội dung đã mâu thuẫn với cách làm hiện tại.

**Phạm vi đã kiểm:** [video người dùng gửi](https://www.youtube.com/watch?v=nRiezhIOHH0), bản MP4 lưu sẵn trong repo có ID khớp, toàn bộ transcript và 123 khung hình lấy mẫu mỗi 8 giây qua 7 tờ tổng hợp. Đã mở lớn riêng các khung 0:48, 0:56, 1:04 và 8:24. Đây là kiểm tra hình và lời kể xuyên suốt video; không phải xem liên tục từng giây hoặc đo toàn bộ chuyển cảnh. Không review phong cách hình ảnh, chất lượng nét vẽ, màu sắc hoặc code điều khiển Flow; không kiểm chứng lại tính đúng sai lịch sử của toàn bộ lời kể video.

**Tài liệu đối chiếu:** bản skill Codex đang được trỏ tới trong `.agents/skills/`, bản mới hơn trong `.claude/skills/`, `SPEC-v2.md`, `SHOT-LIST.md` và một số prompt A1 hiện có. Các prompt A1 được dùng làm ví dụ cho lỗi mà quy tắc cần ngăn, không phải một đợt review toàn bộ bộ prompt của agent khác. Chỉ tạo báo cáo này, không sửa skill hay artifact đang được claim.

**Phần đã ổn, nên giữ**

- Một câu lời kể có thể cần nhiều hình; skill §4 đã nói rõ. §4c cũng đã phân biệt ảnh gốc với các trạng thái bổ sung phần tử. Không cần bổ sung lại hai nguyên tắc này.
- Tư liệu phải được nhìn trước khi mô tả; dùng lại nhân vật đã tạo; kiểm tính liên tục của vật đang cầm/đeo; dùng ảnh trước để sửa một thay đổi nhỏ; đạo cụ phải có bộ phận phục vụ tương tác. Những điều này đã có ở skill §3b, §7b, §8 và SPEC-v2 §4b.
- Chữ, mũi tên, dấu X và đường đo được làm ở hậu kỳ. Quy tắc này phù hợp với phần việc người dùng muốn tự dựng.
- SPEC-v2 §5b và §5b-bis đã có cue nguyên văn và suy thời gian từ phụ đề. Không kết luận rằng hệ thống thiếu liên kết prompt–lời kể, và không đề nghị bắt người dùng lên toàn bộ timeline dựng phim trước khi viết prompt.

**1. Ưu tiên cao — kiểm xem ảnh có truyền đúng ý, không chỉ có đúng danh từ**

Skill [§4c](C:/Users/AnhTu/Desktop/claude/.agents/skills/nano-banana-image-prompts/SKILL.md:193) có bảng chọn hình theo loại nội dung, nhưng chưa có bước bắt buộc kiểm ý nghĩa của từng lựa chọn. Việc cue khớp transcript chỉ chứng minh prompt được gắn vào đúng câu; nó không chứng minh nội dung ảnh đúng câu đó.

Ví dụ hiện có: [A1-06](C:/Users/AnhTu/Desktop/claude/image-prompts/A1.tu-anchors.shots.json:96) gắn “30 vụ giết người” với một lưới ảnh mugshot. Lưới này dễ được hiểu là danh sách người bị bắt, không truyền đạt số vụ giết người. [A1-12](C:/Users/AnhTu/Desktop/claude/image-prompts/A1.tu-anchors.shots.json:201) gắn lời kể canh gác với một người cảnh sát được tả kỹ đồng phục, nhưng không nêu hành động hoặc tư thế gác. Đây là thiếu nội dung, không phải vấn đề hình đẹp hay xấu.

**Sửa đề nghị:** trước mỗi prompt, ghi một câu ngắn “Người xem cần hiểu điều gì?”. Sau đó chọn hình truyền đạt đúng chủ thể, hành động, đối tượng và trạng thái liên quan. Con số có thể do chữ hậu kỳ gánh; không cần sinh một đám người để minh hoạ mọi số đếm. Bảng §4c nên là gợi ý có điều kiện: lời kể đang nói nguyên nhân bệnh, tình trạng nằm viện hay cái chết thì nhu cầu hình khác nhau; không áp một loại icon cho tất cả.

**2. Ưu tiên cao — độ dài prompt theo chi tiết cần truyền đạt**

[SPEC-v2 §3](C:/Users/AnhTu/Desktop/claude/image-prompts/SPEC-v2.md:146) hướng dẫn vật đơn bằng danh từ và 2–4 chữ bổ nghĩa; [SHOT-LIST luật 2](C:/Users/AnhTu/Desktop/claude/image-prompts/SHOT-LIST.md:10) cũng yêu cầu rất ngắn. Cách đó phù hợp với vật thông dụng không có trạng thái đặc biệt, nhưng chưa đủ làm quy tắc chung.

Ở [khung 0:48](https://www.youtube.com/watch?v=nRiezhIOHH0&t=48s), nhân vật bám vào vật liệu nối dài và có biểu tượng ga giường giải thích bên cạnh. Điều quan trọng cho prompt của mình là người xem nhận ra vật liệu ga giường, chỗ nối và phần cần cầm. RUNBOOK đã ghi mẻ ảnh thật từng biến ga buộc thành dây bện vì danh từ “rope” lấn át phần mô tả vải. A1-14 hiện đã sửa; cần đưa bài học nội dung đó vào skill, không đề nghị sửa lại prompt đã đúng.

**Sửa đề nghị:** prompt phải đủ các chi tiết có vai trò trong câu chuyện: hình dạng nhận diện, vật liệu nếu quan trọng, trạng thái hiện tại, bộ phận sẽ tương tác, hướng nhìn cần thấy. Bỏ chi tiết trang trí không giúp kể; không đặt giới hạn số chữ cứng.

Ví dụ minh hoạ cách mô tả đạo cụ đã có trong A1, không gồm chỉ dẫn phong cách:

> White cotton bed sheets joined end to end by large knots, with wide flat sections of fabric and loose cloth corners visible between the knots. Show both free ends and every knot. No lettering.

**3. Ưu tiên cao — chọn đơn vị ảnh theo khả năng dựng và quan hệ hành động**

[Skill §7](C:/Users/AnhTu/Desktop/claude/.agents/skills/nano-banana-image-prompts/SKILL.md:953) còn quyết định vật riêng dựa nhiều vào việc nó lặp qua nhiều bối cảnh hay chỉ thuộc một bối cảnh. Trong khi đó SHOT-LIST luật 2 và SPEC-v2 §3 cấm định vị tương đối giữa hai vật rời. Những luật này chưa tạo thành một cách quyết định thống nhất cho sản xuất từng phần tử hậu kỳ.

Ví dụ [khung 8:24](https://www.youtube.com/watch?v=nRiezhIOHH0&t=504s): một người đang nâng thùng cạnh cốp xe mở. Để dựng được hành động, tay phải tiếp xúc đúng thùng, thùng phải đúng góc, và cốp phải mở. Chỉ tạo ba danh từ “người”, “thùng”, “xe” độc lập chưa bảo đảm ghép thành được hành động ấy.

**Sửa đề nghị:** một phần tử cần xuất hiện, di chuyển hoặc thay đổi độc lập thì có thể tách riêng dù chỉ dùng một lần. Cụm tương tác khó ghép có thể sinh chung khi phù hợp. Nếu tạo rời, phải thống nhất hướng nhìn, trạng thái, chỗ tiếp xúc và phần bị che giữa các ảnh; tránh nướng thêm đạo cụ trùng vào ảnh nhân vật. Không bắt mọi người và đồ vật chạm nhau đều phải tạo chung. Giữ lựa chọn tạo phần tử riêng và cách biểu đạt trung tính phù hợp nội dung.

Phân biệt rõ: di chuyển/thu phóng một ảnh ở hậu kỳ không tự tạo nhu cầu prompt mới; đổi tư thế, vật bị mở/đóng, thay đổi vật đang cầm mới có thể cần biến thể. §4c đã có ý dựng dần, cần biến thành tiêu chí lựa chọn đầu ra cho mỗi phần tử.

**4. Ưu tiên vừa — giữ mức chắc chắn của lời kể trong lựa chọn hình**

Trong [khung 1:04](https://www.youtube.com/watch?v=nRiezhIOHH0&t=64s), video dùng hai cảnh sát đang giải thích bằng cử chỉ; lời kể nói họ khai rằng đã ngủ. [A1-17](C:/Users/AnhTu/Desktop/claude/image-prompts/A1.tu-anchors.shots.json:284) lại tạo một người cảnh sát đang ngủ trên ghế. Ảnh tái hiện này có thể dùng nếu người dựng giữ rõ đây là lời khai; nếu bỏ ngữ cảnh đó, ảnh dễ nâng lời khai thành việc đã được chứng kiến. Đây là rủi ro diễn đạt, không có nghĩa mọi hình tái hiện lời khai đều sai.

**Sửa đề nghị:** khi lựa chọn cảnh, nhận diện lời kể đang xác nhận sự kiện, dẫn lời nhân vật, nêu giả thuyết hay phủ định. Giữ phân biệt đó bằng hình trung tính hoặc một ghi chú ngắn cho hậu kỳ; không tự vẽ một thủ phạm cụ thể đang làm việc mà lời chỉ nói có người nghi ngờ. Không cần đưa câu chữ giải thích vào ảnh AI.

**5. Ưu tiên vừa — bảo toàn ngoại hình người thật**

[Skill §5a](C:/Users/AnhTu/Desktop/claude/.agents/skills/nano-banana-image-prompts/SKILL.md:337) yêu cầu rải các loại râu và đổi nếu hai người trùng tóc/râu. Bản `.claude` cũng còn chỉ dẫn này, tại dòng 404–414. Nó xung đột với [SPEC-v2 §4a](C:/Users/AnhTu/Desktop/claude/image-prompts/SPEC-v2.md:165), vốn yêu cầu mô tả đúng ngoại hình đã quan sát trong ảnh tư liệu.

**Sửa đề nghị:** chỉ chủ động đa dạng hoá ngoại hình người vô danh dùng để minh hoạ. Với người có thật, giữ tóc, râu và nét nhận dạng có căn cứ; hai người thật có thể cùng tóc ngắn, cạo nhẵn. Phân biệt họ bằng đặc điểm đã được xác nhận, trang phục phù hợp, asset riêng và nhãn hậu kỳ. Đây là độ đúng của nội dung, không phải góp ý về nét vẽ.

**6. Ưu tiên cao về độ tin cậy của skill — một bộ luật hiện hành**

Bản Codex được trỏ đến là `.agents/skills/nano-banana-image-prompts/SKILL.md`; bản `.claude/skills/nano-banana-image-prompts/SKILL.md` dài hơn 67 dòng tại thời điểm review. Bản `.agents` thiếu ngoại lệ dùng ảnh tư liệu cho công trình nhận ra được và quy trình mới cụ thể: tạo asset nhân vật nửa thân trước rồi sinh biến thể toàn thân từ asset tại [.claude §5](C:/Users/AnhTu/Desktop/claude/.claude/skills/nano-banana-image-prompts/SKILL.md:263). Hai bổ sung này thay đổi cách cung cấp nội dung tham chiếu, dù không đánh giá phong cách đi kèm.

Cả hai bản còn mở đầu bằng đường viết `assets.json`/`scenes.json`, nhưng công việc mới đang dùng `.shots.json` theo SPEC-v2; chưa có đoạn phân luồng rõ ràng. Ngoài ra luật dùng hình tư liệu hay hình vẽ cho người thật trong tài liệu cũ đã được SPEC-v2 ghi rõ là thay đổi. Người chỉ đọc skill dễ đi theo quy trình không còn phù hợp với yêu cầu tạo phần tử rời hiện nay.

**Sửa đề nghị:** có mục đầu “Quy tắc hiện hành cho tạo ảnh để hậu kỳ” trỏ đúng tài liệu; đồng bộ hai bản skill hoặc chỉ duy trì một nguồn được các agent đọc; đưa các quy tắc cũ xung đột sang phần lịch sử tách biệt. Không sửa các khối phong cách trong đợt chỉnh nội dung này.

**Mẫu kiểm trước khi chốt mỗi prompt**

| Câu cần trả lời | Nội dung cần chốt |
| --- | --- |
| Ảnh làm người xem hiểu điều gì? | Một ý hoặc một hành động chính bám lời kể |
| Ai/cái gì phải có? | Chủ thể và số lượng có ý nghĩa, đúng danh tính khi cần |
| Trông thấy trạng thái nào? | Tư thế, hướng nhìn, vật đang cầm, mở/đóng, đầy/rỗng… |
| Chi tiết nào thiếu là sai nghĩa? | Vật liệu, bộ phận tương tác, mốc không gian cần dùng |
| Có ghép được với phần còn lại không? | Hướng, chỗ tiếp xúc, phần bị che, phiên bản asset |
| Hình có nói quá lời kể không? | Sự kiện, lời khai, suy đoán và phủ định được giữ đúng |

Không cần biến toàn bộ bảng thành các trường JSON bắt buộc. Có thể dùng làm checklist người viết và người review. Thời điểm tắt ảnh, chữ, đường đo và chuyển động cuối cùng vẫn thuộc phần hậu kỳ người dùng tự làm.

**Trạng thái:** hoàn tất review nội dung; skill chưa được sửa. Báo cáo chưa commit, không chạy luồng CLI lồng phiên. Claim riêng chỉ bao gồm báo cáo này; các claim và thay đổi có sẵn của agent khác được giữ nguyên.
