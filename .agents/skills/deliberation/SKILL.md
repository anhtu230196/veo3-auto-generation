---
name: deliberation
description: Cách nhận một lượt trong luồng review nhiều vòng giữa Codex, Claude và Gemini — viết bản đề xuất, viết bản review có mã điểm D**, phản bác một yêu cầu sửa, và đóng luồng. Dùng khi được giao một lượt trong coordination/threads/, khi review khung sườn hoặc kịch bản của agent khác, hoặc khi cần phản bác nhận xét. Deliberation, thread turn, phan bac, khung suon review.
---

# Nhận một lượt trong luồng review

Luồng review là cách ba agent tranh luận nhiều vòng trên một sản phẩm trung gian trước khi bước sau bắt đầu. Luật đầy đủ: [`coordination/RULES.md`](../../../coordination/RULES.md).

Luôn bắt đầu bằng:

```bash
python scripts/thread.py status
python scripts/thread.py next <slug>
```

Đọc `coordination/threads/<slug>/THREAD.md` và **tất cả** file vòng trước. Đừng chỉ đọc vòng gần nhất — một điểm có thể đã được tranh luận và chốt ở vòng một.

## Trước khi viết bất cứ gì

Kiểm tra `turn:` trong `THREAD.md` có phải là mình không. Không tới lượt thì không viết file vòng. Thấy vấn đề gấp thì ghi một dòng vào mục "Ngoài lượt".

## Nếu bạn là tác giả, vòng 1

Viết sản phẩm vào đường dẫn `artifact:`, rồi viết `r1-00-proposal-<agent>.md`:

- **Đã quyết định gì và vì sao.** Nhất là chỗ có nhiều lựa chọn và bạn chọn một.
- **Chỗ bạn tự thấy yếu nhất.** Nói ra trước, đừng để người review tìm. Giấu chỗ yếu chỉ tốn thêm một vòng.
- **Câu hỏi bạn muốn người review trả lời.** Hướng họ vào chỗ đáng soi.
- **Cái bạn cố ý chưa làm** vì thuộc bước sau.

Kết thúc bằng khối `points` (bên dưới). Đừng tự đổi `turn` trong `THREAD.md` — máy lo.

## Nếu bạn là người review

Viết `r<vòng>-<NN>-review-<agent>.md`. Mỗi ý một mã `D**` mới, một nhãn, một dẫn chiếu.

```
### D03 · CHAN
**Chỗ:** scripts/01-beat-sheet.md:44 (B07)
**Vấn đề:** Beat này nói điều tra viên "tin rằng" X. S03 chỉ ghi họ đã kiểm tra
giả thuyết X, không nói họ tin. Đây là gán trạng thái tâm lý không có nguồn.
**Cần gì để đóng:** một nguồn nói điều tra viên tin X, hoặc đổi thành mô tả
hành động họ đã làm.
```

Ba phần đó là bắt buộc: **chỗ**, **vấn đề**, **cần gì để đóng**. Không có phần thứ ba thì tác giả không biết làm sao thoát khỏi nhận xét, và luồng sẽ ping-pong.

Nhãn: `CHAN:` (không đi tiếp bước sau được) · `SUA:` · `HOI:` · `OK:`.

**Chỉ nêu những gì mục 8 cho phép nêu.** Trước khi viết một điểm, tự hỏi: đây là lỗi sự thật, lỗi chứng cứ, lỗi cấu trúc, hay chỉ là tôi sẽ viết khác? Vế cuối thì bỏ.

Cuối file, một mục **"Tôi đã không kiểm cái gì"**. Bắt buộc. Review nửa vời mà trình bày như đã đọc hết là hỏng cả cơ chế — agent sau sẽ tin phần đó đã được kiểm.

Kết thúc bằng khối `points` liệt kê mọi điểm bạn vừa nêu. Đừng tự sửa bảng trong `THREAD.md`.

## Nếu bạn là tác giả nhận review

Trả lời **từng** điểm đang mở. Không bỏ sót điểm nào.

**Chấp nhận:** sửa artifact, ghi vào file response đã sửa ở đâu và sửa thế nào, và cho điểm đó trạng thái `đã sửa ở v<N>` trong khối `points`. `artifact_version` do `thread.py apply` tự bump.

**Phản bác:** chỉ bằng một trong bốn lý do —

| Lý do | Phải kèm |
| --- | --- |
| Nguồn nói khác điều người review tưởng | Trích nguồn và vị trí |
| Nằm ngoài phạm vi bước này | Nói rõ bước nào sẽ xử lý |
| Đã có chỗ khác xử lý | Chỉ ra chỗ đó |
| Lựa chọn kể chuyện trong vùng cho phép | Nói vì sao đây không phải lỗi sự thật hay cấu trúc |

Cho điểm đó trạng thái `tác giả phản bác — chờ <reviewer>` trong khối `points`.

**Không được:** im lặng bỏ qua, hoặc sửa lấy lệ cho điểm biến mất mà không thật sự giải quyết vấn đề. Người review sẽ kiểm lại và điểm đó quay lại ở vòng sau, tốn thêm một vòng.

Không đồng ý nhưng cũng không chắc mình đúng: nói thẳng là chưa chắc và đề nghị đẩy lên Tú. Đây là lựa chọn hợp lệ, không phải thua.

## Nếu phản bác của tác giả rơi vào bạn

Ba lựa chọn, không có lựa chọn thứ tư:

1. **Chấp nhận** — cho điểm trạng thái `chốt: giữ nguyên`, ghi một dòng vì sao bạn đồng ý.
2. **Đưa chứng cứ mới** — nguồn khác, hoặc chỉ ra chỗ trong artifact mà phản bác không giải thích được. Chứng cứ mới, không phải cách nói mới.
3. **Đẩy lên Tú** — cho điểm trạng thái `đẩy lên Tú`, tóm tắt cả hai lập luận trong hai câu, công bằng với cả hai.

Lặp lại nguyên văn ý cũ không phải là một lựa chọn. Một điểm đi quá hai lần qua lại thì tự động thành `đẩy lên Tú`.

## Khối `points` — bắt buộc ở cuối mọi file vòng

`THREAD.md` do máy giữ, không phải do bạn sửa tay. Bạn viết nội dung, rồi khối này nói cho máy biết bảng điểm thay đổi thế nào.

````
```points
D01 | mở | scripts/01-beat-sheet.md:44 | Gán trạng thái tâm lý không có nguồn
D02 | tác giả phản bác — chờ gemini | scripts/01-beat-sheet.md:70 | S03 nói khác điều D02 giả định
```
````

Trạng thái chép **đúng nguyên văn** một trong: `mở` · `đã sửa ở v<N>` · `tác giả phản bác — chờ <agent>` · `chốt: đã sửa` · `chốt: giữ nguyên` · `đẩy lên Tú`.

Sau khi ghi file vòng:

```bash
python scripts/thread.py apply <slug> <ten-file-vong>
```

Lệnh này cập nhật bảng điểm, đổi lượt, bump `artifact_version`, và tự đóng luồng khi hết điểm mở hoặc hết trần vòng. **Đừng sửa `THREAD.md` bằng tay** — quên đổi lượt là lỗi hay gặp nhất.

## Khi chạy dưới orchestrator

`scripts/orchestrate.py` gọi CLI của bạn ở chế độ headless. Lúc đó:

- **Không ghi file vòng lên đĩa.** In toàn bộ nội dung ra stdout; orchestrator ghi hộ.
- **Không sửa `THREAD.md`.**
- Lượt review chạy chế độ chỉ đọc — bạn không có quyền ghi, và không cần.
- Lượt tác giả được sửa artifact, và chỉ artifact.
- Thiếu khối `points` thì orchestrator dừng cả luồng. Đừng bỏ.

## Đóng luồng

Bạn không tự đóng luồng. `thread.py apply` chuyển sang `settled` khi lượt review cuối của một vòng không còn điểm mở, và sang `blocked` khi hết 3 vòng mà vẫn còn.

Việc của bạn chỉ là cho đúng trạng thái từng điểm trong khối `points`. Đừng cố kết thúc sớm bằng cách đánh dấu `chốt:` cho một điểm bạn chưa thật sự giải quyết — `thread.py check` từ chối `settled` khi còn điểm mở, nhưng nó không biết bạn có trung thực hay không.

## Cái skill này không làm được

Không biến ba agent thành một cuộc họp. Ngay cả khi `orchestrate.py` chạy trọn luồng, đó vẫn là ba lượt độc lập nối tiếp nhau, không phải ba bên cùng nói. Không agent nào thấy agent khác đang nghĩ gì — chỉ thấy cái đã viết ra.

Không thay được bước Tú duyệt nội dung bản tiếng Việt. Review chéo kiểm nguồn, chứng cứ và cấu trúc; nó không quyết định câu chuyện có đáng kể hay không.

Và không bảo đảm ra kết quả tốt hơn nếu người review nêu toàn điểm về gu. Chất lượng của cơ chế này bằng chất lượng của điều được phép nêu.
