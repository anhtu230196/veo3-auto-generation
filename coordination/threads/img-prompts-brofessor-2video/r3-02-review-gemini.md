# r3-02 — Review Gemini — SHOT-LIST v3

Artifact: `image-prompts/SHOT-LIST.md`, v3.

**Chưa thông qua.** Mặc dù tác giả đã có nỗ lực sửa đổi luật và làm sạch một số prompt, bảng vẫn còn rất nhiều vi phạm rõ ràng liên quan đến việc đặt vị trí tương đối giữa hai vật hoặc gắn vật vào phông nền.

## D17 — CHAN — Vẫn còn rất nhiều prompt định vị tương đối vi phạm luật 2

**CHỖ NÀO:**
`image-prompts/SHOT-LIST.md`, các dòng chứa:
- Nhóm ghép hai vật thể: `A1-12` (`beside a closed door`), `A7-03` (`facing a brick wall`), `A9-03` (`at a witness table`), `A9-04` (`behind prison bars`), `A9-10` (`into a car trunk`), `A10-09` (`with two drinks on it`), `A14-09` (`against a cliff`), `B3-04` (`over a huge scale model`), `B13-01` (`at a cruise ship`), `B15-02` (`set in a round base`).
- Nhóm tả phông nền/không gian: `A1-13` (`on a flat rooftop`), `A16-06` (`on the edge of a canoe`), `A16-07` (`among trees`), `B1-14` (`on a road`), `B2-14` (`on an empty lot`), `B3-13` (`resting on soil`), `B6-09` (`onto clouds`), `B7-09` (`in open desert`), `B11-03` (`into a seabed`), `B12-04` (`above the clouds`), `B15-05` (`in a vast empty interior`).

**VẤN ĐỀ GÌ:**
Ở vòng 3, tác giả đã tự tay làm rõ luật 2: "Cấm định vị tương đối (behind, next to, on a ... road...)" và "Hai vật thì hai dòng". Tuy nhiên, bước rà soát thực tế lại bỏ sót một lượng lớn các prompt dùng giới từ vị trí (on, in, behind, into, against, beside, among) để gắn kết nhiều vật thể hoặc dán vật thể lên một phông nền không gian. Vi phạm trầm trọng nhất là `A9-04` khi tiếp tục dùng từ `behind` - chính là từ đã bị tác giả cấm đích danh trong luật 2. Việc này vẫn ép model phải tạo ra các bố cục ghép sẵn, đi ngược lại tôn chỉ chỉ tạo phần tử rời phục vụ hậu kỳ.

**CẦN GÌ ĐỂ ĐÓNG:**
Loại bỏ hoàn toàn các cấu trúc chỉ vị trí tương đối trong tất cả các dòng được liệt kê:
- Tách các vật thể rời thành hai dòng riêng biệt (nếu cả hai đều cần thiết).
- Hoặc giữ lại vật thể chính và xoá hẳn phần tả phông nền/vật thể phụ. Ví dụ: `A1-12` chỉ tả cảnh sát, `A9-04` chỉ tả nhóm người (hoặc người mặc áo tù), `B1-14` chỉ tả xe đạp ngã, v.v. Tuyệt đối không dùng giới từ định vị.

## D16 — Nhất trí với Codex

**CHỖ NÀO:** `image-prompts/SHOT-LIST.md` (các dòng Codex liệt kê: A8-07, A10-11, A15-07, B1-09, B13-06, B13-07).

**VẤN ĐỀ GÌ:** Cùng quan điểm với Codex ở vòng này, việc giữ nguyên các bố cục "cảnh cả khu vực" là vi phạm điều kiện cốt lõi của luật 1. Dù tác giả sửa D05 nhưng vẫn chưa xử lý triệt để toàn bảng.

## Xác nhận các điểm cũ

Tôi đồng ý với trạng thái chốt "đã sửa" cho các điểm D14 và D15 mà tác giả đã phản hồi và thực thi đầy đủ. D02 và D03 vẫn giữ nguyên trạng thái đóng từ vòng trước.

## Tôi đã không kiểm cái gì

- **Không sinh ảnh thực tế:** Tôi không có khả năng chạy thử prompt qua các mô hình tạo ảnh nên không kiểm chứng được liệu các từ khóa hãm như `blank`, `no text` có thực sự ngăn chặn được model vẽ chữ rác hay không.
- **Không kiểm đối chiếu nguồn video:** Tôi chỉ đọc văn bản `SHOT-LIST.md` và các file `THREAD.md`, tôi không xem được các frame cắt từ video A hay video B. Do đó, tôi không thể xác nhận danh sách prompt đã bao phủ đầy đủ và chính xác các chi tiết xuất hiện trên video gốc.
- **Không đánh giá quyền sở hữu trí tuệ:** Tôi không xác minh vấn đề rủi ro pháp lý hay quảng cáo khi vẽ lại nội dung của video bên thứ ba. 
- **Quyền chạy lệnh bị chặn:** Tôi đã cố dùng `run_command` để dò tìm file hệ thống nhưng bị chặn bởi lớp bảo mật. Mọi kết luận ở trên chỉ lấy từ việc đọc file trực tiếp.

```points
D17 | mở | image-prompts/SHOT-LIST.md | Vẫn còn nhiều dòng dùng giới từ mô tả phông nền và định vị tương đối vi phạm luật 2
```
