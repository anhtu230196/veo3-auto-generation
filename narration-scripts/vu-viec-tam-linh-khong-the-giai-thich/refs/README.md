# Ảnh tham khảo — tập "Vụ Việc Tâm Linh Không Thể Giải Thích"

**Mỗi case một thư mục con**: `refs/case-N/`, kèm `README.md` riêng làm manifest
(nhóm ảnh ↔ asset, tên gốc, giấy phép, tác giả, URL nguồn).

| Thư mục | Case | Số ảnh |
|---|---|---|
| [`case-1/`](case-1/README.md) | A Fei — Long Wang, Trung Quốc 2020 | 49 |
| [`case-5/`](case-5/README.md) | Chu Xiu-hua — Đài Loan 1959 | 205 |

Số thứ tự nhóm KHÔNG reset giữa các case (case 1 giữ `01-05`, case 5 dùng
`06-34`) — để đọc tên file là biết ngay thuộc case nào kể cả khi bị copy ra
ngoài thư mục.

## Quy ước

- **File ảnh nằm trong `.gitignore`** (`narration-scripts/*/refs/**/*.jpg|jpeg|png|webp`)
  — chỉ commit các `README.md`, vì manifest giữ đủ URL để tải lại bất cứ lúc nào.
- **Mục đích: SOI ĐỂ VẼ LẠI, không phải để chèn vào video.** Người dùng chốt
  2026-08-15: ảnh dính bản quyền vẫn lấy được vì chỉ dùng làm tư liệu tham khảo
  riêng. Cột "Giấy phép" trong manifest vẫn giữ, nhưng để trả lời câu hỏi KHÁC:
  ảnh nào được phép chèn thẳng vào video công khai (skill mục 13) — mặc định là
  **không**, trừ Public domain / CC có ghi nguồn đúng yêu cầu.
- Quy trình gom ảnh (bắt buộc, làm TRƯỚC khi viết prompt) nằm ở skill riêng
  **`case-reference-images`**.

### Ghi chú kỹ thuật (để lần sau khỏi mất công)

Tìm Commons bằng từ CHUNG kiểu `"mountain lake China"` ra **toàn tranh thuỷ
mặc cổ** — Commons chứa rất nhiều tư liệu bảo tàng số hoá, và search là AND
trên mọi từ nên cụm dài còn ra 0-1 kết quả. Muốn ảnh CHỤP thì phải:
1. Nhắm **tên địa danh có thật** (nơi khách du lịch chụp nhiều), không dùng từ mô tả chung.
2. Thêm loại trừ `-painting -scroll`.
3. Giữ cụm tìm NGẮN (2-3 từ + loại trừ).
