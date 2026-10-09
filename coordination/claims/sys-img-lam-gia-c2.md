---
id: sys-img-lam-gia-c2
agent: claude
branch: master
status: done
opened: 2026-10-08
updated: 2026-10-09
scope:
  - narration-scripts/lam-gia-va-mao-danh-bi-vach-tran/refs/case-2/
  - narration-scripts/lam-gia-va-mao-danh-bi-vach-tran/case-2/
---

# sys-img-lam-gia-c2 — Tap Lam gia va mao danh, case 2 Piltdown Man: gom anh tu lieu, viet case-2.shots.json, sinh ban review cho Tu duyet roi chay Flow

**Làm gì:** Tap Lam gia va mao danh, case 2 Piltdown Man: gom anh tu lieu, viet case-2.shots.json, sinh ban review cho Tu duyet roi chay Flow

**Không đụng tới:** `src/`, các skill, `vi.md`/`en.md` của tập, case 1 và case 3–6.

**Ghi chú:** 2026-10-09: Tú cho tải 33 ảnh tư liệu (`refs/case-2/`, manifest README) và lệnh "tải xong rồi chạy tạo ảnh luôn" — BỎ bước duyệt bản review trước khi chạy. Viết `case-2/case-2.shots.json`: 77 shot + 31 cụm dùng lại, phủ đủ 57 câu; build sạch. Chạy Flow 2026-10-09, project `lam-gia-c2-shots`, log `output/run-lamgia-c2-a.log`: 77/77 ✅, không lần thử lại nào. Runner tự ghi `daTao` (lần đầu nhánh `created` chạy thật: promptHash khớp 77/77); audit-shots.ts tra thẳng Flow: 77/77 khớp đúng 1 card. Đã soi bằng mắt cả 77 ảnh (`output/audit-lam-gia-c2-shots/`). Lỗi nhỏ có thể tạo lại nếu Tú muốn: xương vẽ kiểu xương chó hoạt hình (C2-09, C2-32, C2-32b, C2-48), hai bộ não gần bằng nhau (C2-16b), sọ Taung trông như sọ người lớn (C2-29c), một nhà khoa học hói đeo kính có ria dễ nhầm Dawson (C2-17), răng C2-37 trông như cốc rỗng, C2-41 chưa tách rời rõ. Chưa commit.
2026-10-09: DONG claim — Tu cho commit + push. Cac loi nho liet ke o tren chua tao lai; Tu muon sua thi mo claim moi.
