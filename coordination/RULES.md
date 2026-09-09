<!-- Luật này dùng chung với repo youtube-research-system. Sửa một bên thì chép sang bên kia. -->

# Review theo từng bước — luật chung cho ba agent

Ba agent **không có kênh nói chuyện trực tiếp**. Không agent nào gọi được agent khác, không agent nào chờ được agent khác trả lời trong cùng một phiên. Cái chung duy nhất là repo, và người chuyển lượt là Tú. Đừng thiết kế hay hứa hẹn như thể có kênh thời gian thực.

Nhưng "không nói chuyện thời gian thực" không có nghĩa là chỉ review một lần ở cuối. Review ở mức pull request là quá muộn: một khung sườn sai từ đầu thì cả bản viết dựng trên nền đó cũng sai, và lúc phát hiện thì sửa đã đắt.

**Mỗi sản phẩm trung gian đi qua một luồng review nhiều vòng trước khi bước sau bắt đầu.**

### Nguyên tắc

Ba agent là một nhóm làm việc, không phải ba dây chuyền song song. Với mỗi bước:

- Một agent là **tác giả** — người viết ra sản phẩm bước đó.
- Hai agent còn lại là **người review** — đọc và nêu điểm chưa hợp lý, có dẫn chiếu cụ thể.
- Tác giả **được phản bác**. Yêu cầu sửa không phải mệnh lệnh. Nhưng phản bác phải thuộc loại lý do được chấp nhận ở dưới, không phải "tôi thích viết khác".
- Người review phải trả lời phản bác: chấp nhận, hoặc đưa chứng cứ mới, hoặc đẩy lên Tú. Không lặp lại nguyên văn ý cũ.

Vai tác giả xoay theo bước, không cố định theo agent. Bảng dưới chỉ nói mặc định ai **cầm** bước nào; nó không cho ai quyền bỏ qua review. Tú giao khác thì làm theo Tú.

### Các bước có luồng review

| # | Sản phẩm bước | Tác giả mặc định | Người review |
| --- | --- | --- | --- |
| 1 | Chủ đề tập + danh sách 5-6 case đã qua cổng kiếm tiền | Codex | Claude (chống trùng `used-topics.md`), Gemini |
| 2 | Bản tiếng Việt của kịch bản tuyển tập | Codex | Claude, Gemini — rồi **Tú duyệt nội dung** |
| 3 | Bản tiếng Anh thu âm | Claude | Codex, Gemini (đối chiếu bản Việt đã duyệt) |
| 4 | Manifest ảnh tư liệu một case (`refs/case-N/README.md`) | Gemini | Claude (giấy phép, nguồn), Codex |
| 5 | Prompt ảnh + `assets.json` / `scenes.json` | Claude | Codex, Gemini |
| 6 | Sửa `src/veo3bot/`, `src/nanoBanana/`, script pipeline | Claude | Codex |

Bước 2 có hai lớp: agent review nguồn và tính nhất quán, **Tú duyệt nội dung**. Agent không thay được lớp thứ hai.

Bước 6 đụng vào `src/veo3bot/` thì người review **bắt buộc** đọc RUNBOOK.md mục 4 trước khi nêu điểm — phần lớn hành vi lạ ở đó là bug đã biết của Google Flow, không phải lỗi code.

### Cấu trúc một luồng

```
coordination/threads/<slug>/
  THREAD.md                    trạng thái: vòng mấy, tới lượt ai, điểm nào còn mở
  r1-00-proposal-claude.md     tác giả nộp bản v1
  r1-01-review-gemini.md
  r1-02-review-codex.md
  r2-00-response-claude.md     nhận điểm nào, phản bác điểm nào, ra v2
  r2-01-review-gemini.md
  ...
```

`THREAD.md` là thứ **duy nhất** cần đọc để biết phải làm gì tiếp. Sản phẩm thật (khung sườn, kịch bản) nằm ở đường dẫn `artifact:` trong `THREAD.md`, không nằm trong luồng.

```bash
python scripts/thread.py status          # tất cả luồng đang mở
python scripts/thread.py next <slug>     # in ra đúng câu cần dán cho agent tới lượt
python scripts/thread.py check           # CI dùng
```

### Luật lượt

Một lượt một agent. `THREAD.md` ghi `turn:`. **Không viết khi không tới lượt** — nếu thấy có vấn đề gấp thì ghi vào `THREAD.md` mục "ngoài lượt" một dòng, không viết file vòng.

Tác giả **không sửa artifact giữa một vòng review**. Bản đang review là bản đóng băng. Sửa chỉ diễn ra ở lượt response của tác giả, kèm bump `artifact_version`.

### Điểm tranh luận

Mỗi điểm có mã `D01`, `D02`… do người nêu đặt, và sống qua các vòng cho tới khi chốt. Bảng điểm nằm trong `THREAD.md`.

| Trạng thái | Nghĩa |
| --- | --- |
| `mở` | Vừa nêu, tác giả chưa trả lời |
| `đã sửa ở v<N>` | Tác giả chấp nhận và đã sửa |
| `tác giả phản bác — chờ <reviewer>` | Chờ người nêu trả lời phản bác |
| `chốt: đã sửa` / `chốt: giữ nguyên` | Hai bên đồng ý, đóng |
| `đẩy lên Tú` | Không hội tụ, chờ người quyết |

### Người review được nêu cái gì

Được:

- Nút thắt không có chứng cứ đỡ; suy diễn trình bày như sự thật; thoại hoặc cảnh không ai chứng kiến được dựng thành sự thật.
- Câu hỏi mở ra mà không bao giờ đóng lại; hoặc lời giải xuất hiện mà manh mối chưa được đặt trước.
- Trình tự tiết lộ hỏng: người nghe biết trước điều lẽ ra phải khám phá sau.
- Chi tiết không phục vụ câu chuyện, hoặc lặp chức năng với một chi tiết khác.
- Trùng chuyện đã có trong `.claude/skills/true-story-compilation-script/used-topics.md`, hoặc case không qua nổi cổng kiếm tiền YouTube (RUNBOOK.md mục 0).
- Rủi ro quảng cáo, rủi ro pháp lý, vi phạm luật trong `RUNBOOK.md` hoặc `AGENTS.md`.

Không được:

- "Tôi sẽ viết khác." Khác gu không phải lỗi.
- Đòi viết lại toàn bộ khi chỉ một đoạn có vấn đề.
- Nêu lại một điểm đã chốt ở vòng trước mà không có chứng cứ mới.
- Góp ý về thứ thuộc bước sau — khung sườn không bị chê vì chưa có câu văn hay.

### Tác giả được phản bác bằng lý do gì

- **Nguồn nói khác điều người review tưởng** — dẫn ra nguồn và vị trí.
- **Ngoài phạm vi bước này** — để bước sau xử lý, nói rõ bước nào.
- **Đã có chỗ khác xử lý** — chỉ ra chỗ đó.
- **Đây là lựa chọn kể chuyện trong vùng cho phép**, không phải lỗi sự thật hay lỗi cấu trúc.

Phản bác phải trả lời đúng điểm được nêu. Không im lặng bỏ qua, và cũng không sửa lấy lệ cho điểm biến mất.

### Hội tụ

- **Tối đa 3 vòng một luồng.**
- **Một điểm tối đa 2 lần phản bác qua lại.** Lần thứ ba tự động chuyển `đẩy lên Tú`.
- Hết vòng mà còn điểm mở: `THREAD.md` chuyển `status: blocked`, liệt kê điểm mở, Tú quyết.
- Không mở luồng mới cho một điểm đã chốt.

Mục tiêu là **đủ tốt và có căn cứ**, không phải hoàn hảo. Ba agent để tự do sẽ sinh vòng review vô hạn vì vòng nào cũng tìm được thứ để nói. Trần này là cố ý, đừng nới nó vì thấy còn góp ý được.

### Khối `points` — hợp đồng giữa agent và sổ luồng

Mọi file vòng phải kết thúc bằng một khối máy đọc được. Không có khối này thì bảng điểm trong `THREAD.md` không cập nhật được, và `thread.py check` sẽ báo lỗi.

````
```points
D01 | mở | scripts/01-beat-sheet.md:44 | Gán trạng thái tâm lý không có nguồn
D02 | đã sửa ở v2 | scripts/01-beat-sheet.md:70 | Đã đổi thành mô tả hành động
```
````

Trạng thái phải chép đúng nguyên văn một trong: `mở` · `đã sửa ở v<N>` · `tác giả phản bác — chờ <agent>` · `chốt: đã sửa` · `chốt: giữ nguyên` · `đẩy lên Tú`.

Agent **không tự sửa `THREAD.md`**. Ghi file vòng xong thì chạy:

```bash
python scripts/thread.py apply <slug> <ten-file-vong>
```

Lệnh này cập nhật bảng điểm, đổi lượt, bump `artifact_version`, và tự chuyển luồng sang `settled` hoặc `blocked` theo trần hội tụ. Máy giữ trạng thái, agent chỉ viết nội dung — agent quên đổi lượt là lỗi hay gặp nhất khi để chúng tự quản.

### Ai chuyển lượt

Không agent nào tự đánh thức agent khác.

**Thủ công:** `python scripts/thread.py next <slug>` in ra đúng câu cần dán cho agent kế tiếp. Tú dán, agent làm, rồi `thread.py apply`.

**Tự động bằng CLI:** `scripts/orchestrate.py` gọi thẳng CLI của từng agent ở chế độ headless — `claude -p`, `agy -p` (Antigravity CLI), `codex exec` — nên chạy bằng subscription đã trả, không tính theo token như gọi API. Cấu hình lệnh ở `coordination/agents.json`.

```bash
python scripts/orchestrate.py doctor --probe   # CLI nao dung duoc, con dang nhap khong
python scripts/orchestrate.py start "<yeu cau>"  # mo luong moi tu mot cau roi chay luon
python scripts/orchestrate.py turn <slug>      # chay dung mot luot roi dung
python scripts/orchestrate.py run <slug>       # chay den khi hoi tu hoac het tran
```

`start` là cửa vào cho một yêu cầu mới nói bằng lời thường. Nó suy slug từ câu yêu cầu,
mở luồng với tác giả mặc định `codex` và hai agent còn lại làm người review, đặt artifact
ở `coordination/drafts/<slug>.md` nếu không chỉ định `--artifact`, rồi chạy tới khi hội tụ
hoặc chạm trần. Đổi người viết bản đầu bằng `--author claude`.

Luật an toàn của chế độ tự động:

- **Lượt review chạy chế độ chỉ đọc.** Người review không cần quyền ghi, và không nên có. Cách chặn khác nhau theo từng CLI, và cờ chế độ không phải lúc nào cũng là hàng rào:

  | Agent | Chặn ghi bằng gì |
  | --- | --- |
  | Codex | `--sandbox read-only` — cờ này chặn thật |
  | Claude | `--allowedTools` không có Write/Edit. Không dùng `--permission-mode plan`: nó chặn luôn WebFetch |
  | Gemini (`agy`) | `permissions.deny` trong `~/.gemini/antigravity-cli/settings.json`. **`--mode plan` không chặn ghi** — đo lại ngày 2026-09-09 thì nó vẫn tạo được file |

  Thêm một agent mới thì phải đo thật xem nó có ghi được không, đừng tin tên cờ.
- **Chỉ lượt tác giả được sửa artifact.** Không lượt nào được sửa `THREAD.md`; orchestrator lấy stdout làm file vòng rồi tự cập nhật sổ.
- Agent không xuất được khối `points` thì orchestrator **giữ lại file vòng và dừng**, không đoán thay. Sửa tay rồi `thread.py apply`.
- `run` dừng ngay khi luồng chuyển `settled` hoặc `blocked`, và có trần số lượt riêng.

Tự động không có nghĩa là tin. Đọc lại các file vòng trước khi dùng kết quả — nhất là mục "tôi đã không kiểm cái gì" của mỗi người review.

### Nhãn dùng trong file review

| Nhãn | Nghĩa |
| --- | --- |
| `CHAN:` | Không đi tiếp bước sau được cho tới khi xử lý |
| `SUA:` | Nên sửa, không chặn |
| `HOI:` | Chưa rõ, cần tác giả trả lời |
| `OK:` | Đã kiểm và đạt — ghi rõ kiểm bằng cách nào |

Mỗi ý kèm `file:dòng`, và kèm `claim_id` hoặc `source_id` khi nói về nội dung. Nhận xét không có dẫn chiếu cụ thể thì tác giả không sửa được.

### Chốt cuối vẫn ở nhánh, không phải ở luồng

**Tú quyết ngày 2026-09-09: commit thẳng lên `master`, không mở pull request và không
chờ ai merge nhánh.** Chỉ dẫn này ghi đè phần cổng nhánh ở bản trước.

Luồng review lo chất lượng từng bước, và giờ nó là **lớp duyệt duy nhất giữa agent với
nhau** — nên phải chạy xong TRƯỚC khi commit vào `master`, không phải song song. Bước
nào bỏ luồng thì commit đó nói rõ vì sao.

- Chạy `python scripts/claims.py check` và `python scripts/thread.py check` tại máy
  **trước khi đẩy**. Không còn cổng nào chặn giúp sau lưng.
- Commit message nêu rõ đang giữ claim nào và thuộc luồng nào — trước đây những thứ
  này nói miệng lúc báo Tú merge, giờ không có chỗ nào khác để ghi.
- Review dài — đối chiếu nguồn từng case, kiểm giấy phép ảnh — vẫn viết
  `coordination/reviews/<slug>-<agent>.md` và commit cùng việc đang review.
- Nhánh `codex/<slug>`, `claude/<slug>`, `gemini/<slug>` vẫn dùng khi việc còn dở qua
  nhiều phiên hoặc hai agent chạy song song. Nhánh là chỗ làm việc, không còn là cổng duyệt.

Người quyết cuối là Tú, sau khi code đã vào `master`. Đây là đánh đổi có chủ đích: đi
nhanh hơn, trả giá bằng việc lỗi có thể vào `master` rồi mới bị phát hiện. Sửa thì sửa
tiếp bằng commit mới, không viết lại lịch sử `master`.

### Điều một agent không được làm

Không sửa thẳng vào nhánh hay artifact của agent khác để "sửa giúp" — viết vào file review. Nếu Tú yêu cầu sửa hộ thì mở nhánh mới và nói rõ.

Không viết lại theo giọng của mình. Nhận xét cái sai và cái thiếu chứng cứ, không nhận xét cái khác gu.
