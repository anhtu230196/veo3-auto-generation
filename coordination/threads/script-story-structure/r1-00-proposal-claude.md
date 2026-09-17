# Đề xuất r1 (Claude)

**Artifact:** `.claude/skills/true-story-compilation-script/references/story-structure.md`
**và** `.claude/skills/true-story-compilation-script/SKILL.md`. Bản `.agents/` chép y hệt
(`cmp` đã khớp). Nhánh `claude/update-skill-story-telling`, chưa commit.

Xem thay đổi so với `master`:

```bash
git diff master -- .claude/skills/true-story-compilation-script/
```

Nhánh dựng trên `chatgpt/update-skill-story-telling`, nên diff gồm hai lớp:

- **Lớp Codex** (commit `0c97659`): `story-structure.md` mục 1–7, bảng chuẩn bị, bảng rà,
  và các sửa trong `SKILL.md` (công thức 8 nhịp, thứ tự video, kiểm chứng).
- **Lớp Claude** (chưa commit, `git diff` trên nhánh này):
  - `story-structure.md`: đoạn "Lúc đặt" / "Lúc trả" ở mục 3; đoạn cuối mục 5, 6, 7; mục 8 và 9
    (mới); 2 dòng mới + 3 dòng sửa trong bảng chuẩn bị; 3 ý mới trong bảng rà.
  - `SKILL.md`: bước 1 (neo ngoài), công thức nhịp 1 (tiêu đề quanh hình ảnh neo), "Cấu trúc
    toàn video" (hai case cùng khung).

## Căn cứ: kịch bản mẫu làm gì (tóm tắt cấu trúc, không chép lời)

Kịch bản mẫu Tú đưa là bản phiên âm một video tiếng Việt khoảng 7 chuyện tâm linh. Dữ kiện
trong đó **chưa kiểm chứng**; chỉ cấu trúc được dùng làm căn cứ.

| Điểm bổ sung | Mẫu làm gì |
| --- | --- |
| Lúc đặt: kể hành động, không gán cách hiểu | Người chồng ngồi khóc, không chịu ra khi bác sĩ khám; quấn khăn cho vợ trước khi chôn. Người kể không bình luận, về sau mới nối với vết siết. Cậu bé cằn nhằn chê áo, chê nhà, đòi ô tô; tài xế hay bắn nỏ vào chó mèo. Đều trông như chi tiết tính cách |
| Lúc trả: gợi lại chi tiết | Trước khi nối xe đạp nặng với người ngồi sau, người kể nhắc lại chi tiết xe nặng. Mẫu nhắc bằng câu tự quy chiếu; bản skill chuyển thành nhắc trong câu phát hiện vì `SKILL.md` cấm loại câu đó |
| Hậu quả trước giữa case | Người mẹ đến gặp công tố viên, khai quật diễn ra, rồi mới quay lại cảnh bà thấy hồn ma |
| Người chứng kiến theo đà leo thang | Case nhập hồn: hiện tượng lan từ gương, sang nhà bạn, phòng giam, văn phòng chỉ huy; người chứng kiến đổi từ bạn, sang chủ nhà, cảnh sát, bạn tù, cai ngục, mục sư |
| Kết hai lớp | Án đã xử xong rồi mới đến nhịp cuối: đồng hồ dừng đúng giờ bóng ma hay hiện; mọi phần thi thể được tìm thấy trừ cái đầu, đúng thứ đã ám kẻ gây án; người trong đám tang gọi bà bằng hai tên |
| Neo ngoài (mục 8) | Mỗi chuyện có một thứ nằm ngoài lời người trong cuộc: camera, hài cốt + đồng hồ, khai quật + vết siết, ngư dân xác nhận, lời khai, vết bớt. Ba case dùng khung "điều lạ dẫn tới kết quả kiểm chứng được" |
| Hình ảnh neo (mục 9) | Mỗi case có một hình ảnh dễ nhớ: bóng áo trắng đi về phía giếng, taxi dán kín bùa, ông già đội vương miện trong gương |
| Hai case cùng khung (`SKILL.md`) | Hai case "ma dẫn tới án mạng" đặt liền nhau, case sau leo thang từ dấu hiệu gián tiếp lên lời tố cáo trực tiếp |

## Đã quyết định gì và vì sao

1. **Dựng trên bản Codex, không viết lại từ `master`.** Bản Codex đã có mục 1–7 và ghi quyết định
   của Tú (bỏ giọng trò chuyện). Viết lại song song sẽ sinh ba phiên bản cạnh tranh cho cùng một
   file.
2. **Neo ngoài đặt ở bước 1, không ở bước viết.** Đây là tiêu chí chọn case. Tới bước viết mà case
   không có neo thì không viết cách nào để có.
3. **Mục nào cũng có mục "Giới hạn" / câu chặn bịa.** Mỗi thủ pháp trong mẫu đều có một biến thể
   dẫn tới bịa: gán cách hiểu sai để giấu manh mối, đổi thời điểm nhân chứng có mặt, dựng hình ảnh
   không có nguồn, nối thêm lời đồn làm dư âm. Tôi chặn từng biến thể ngay tại mục đó, không để
   người viết phải nhớ luật ở chỗ khác.
4. **Mục 8 nhắc lại LUẬT 1/6.** Khung "điều lạ dẫn tới án mạng" là khung mạnh nhất trong mẫu và
   cũng là khung dễ trượt cổng kiếm tiền nhất. Mẫu dùng nó 3 lần trong 7 case, và theo luật trong
   `SKILL.md` thì tập mẫu đã không qua cổng.
5. **Mục 9 dẫn chiếu luật thumbnail của `nano-banana-image-prompts`**, thay vì tự đặt luật mới.
   Hình ảnh neo mạnh nhất có thể là cảnh án mạng; khi đó nó chỉ dùng trong lời kể.
6. **Không thêm intro, xưng hô hay giọng trò chuyện.** Theo claim `sys-script-story-structure`
   của Codex, Tú đã loại điểm này.

## Chỗ tôi tự thấy yếu nhất — đọc trước

**W1. Căn cứ chỉ là một kịch bản.** Cả 6 điểm rút từ một video của kênh khác, n=1. Tôi chưa đối
chiếu với tập nào đã lên của kênh mình để xem các thủ pháp này có thật sự là thứ giữ người xem
hay không.

**W2. Ranh giới "giấu manh mối" (mục 3) có thể chưa đủ chặt.** Luật chặn việc gán cách hiểu sai,
nhưng chọn chi tiết nào đưa vào, chi tiết nào bỏ, tự nó đã là một cách định hướng người nghe.
Người review xem thử câu "Mục đích là để người nghe không nhận ra manh mối, không phải đánh lừa"
có đủ rõ để người viết biết dừng ở đâu không.

**W3. Mục 8 có thể thu hẹp quá mức nguồn case tâm linh.** Nhiều case tâm linh kinh điển chỉ có
lời một người. Tôi viết "xếp sau", không phải "bỏ", nhưng người viết có thể hiểu thành loại hẳn.

**W4. Luật người chứng kiến leo thang (mục 6) có thể ít tác dụng.** Luật cấm đổi thời điểm nhân
chứng có mặt. Vậy thủ pháp chỉ dùng được khi trình tự thật tình cờ đã leo thang như trong mẫu.
Trường hợp ngược lại, luật chỉ còn phần "giới thiệu người đúng lúc, có vai trò".

**W5. `SKILL.md` bước 1 đổi hành vi.** Trước đây, Tú tự đưa chủ đề thì bỏ qua cả bước 1. Giờ vẫn
phải ghi neo ngoài cho từng case. Đây là việc thêm cho người viết.

**W6. Lớp Codex (mục 1–7) mới chỉ được một sub-agent Codex rà.** Codex review phần mình viết
trong luồng này thì không độc lập. Đề nghị Gemini đọc cả mục 1–7, còn Codex tập trung vào lớp
Claude.

## Câu hỏi muốn người review trả lời

- **Q1.** Có luật nào trong lớp Claude mâu thuẫn với luật sẵn có của `SKILL.md` không: cổng kiếm
  tiền, LUẬT 1/6, cấm câu tự quy chiếu, quy tắc tên người, không bịa số?
- **Q2.** Có luật nào khiến người viết tuân thủ theo nghĩa đen mà vẫn đổi trình tự sự thật, hoặc
  nâng lời kể thành chứng cứ không?
- **Q3.** Ví dụ lấy từ lời kể mẫu đã ghi rõ là lời kể mẫu ở mọi chỗ chưa? Có chỗ nào đọc lên như
  dữ kiện đã kiểm chứng không?
- **Q4 (cho Gemini).** Mục 1–7 của lớp Codex có chỗ nào chưa đạt theo cùng tiêu chí Q1–Q3 không?

## Cái cố ý chưa làm

- **Giọng văn, câu chào, xưng hô:** Tú đã loại. Nhánh `gemini/update-skill-story-telling` đi hướng
  ngược lại; việc chọn hướng là của Tú, không thuộc luồng này.
- **Quy tắc bản tiếng Anh cho ElevenLabs:** không đổi.
- **`used-topics.md`, kịch bản đã viết, skill ảnh:** không đụng.
- **Chưa thử viết một case thật bằng bản skill mới.** Đó là bước sau, khi luồng đã settled.

## Tôi đã không kiểm cái gì

- Không viết thử case nào theo luật mới, kể cả case giả định.
- Không kiểm chứng dữ kiện nào trong kịch bản mẫu. Mọi ví dụ trong artifact đều ghi "lời kể mẫu".
- Không đọc lại toàn bộ mục 1–7 của lớp Codex theo tiêu chí review; chỉ đọc để nối các đoạn bổ sung
  cho khớp.
- Không kiểm các agent đọc `.agents/skills/` có tự nạp `references/` hay không.

```points
```
