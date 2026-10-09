/**
 * Trường `daTao` trong từng shot của `.shots.json` — "ảnh của shot này đã tạo được chưa"
 * (Tú yêu cầu 2026-09-28). Hai nơi ghi, dùng chung module này:
 *
 * - `scripts/run-shots.ts` ghi NGAY sau mỗi shot (`nguon: "run-shots"`). Runner biết chắc prompt
 *   nào vừa gửi, nên `promptHash` của nó là dấu thật của ảnh — nhưng nó chỉ tra tên theo CHUỖI
 *   CON (`assertAssetNamed`), nên không ghi `soCard`.
 * - `scripts/audit-shots.ts` tra THẲNG Flow, đếm card mang ĐÚNG NGUYÊN tên (`nguon: "audit-flow"`).
 *   Mạnh hơn: bắt được card bị đổi tên về sau, ảnh tạo tay, tên trùng.
 *
 * `review_shots.py` đọc trường này làm cột trạng thái.
 */
import fs from "node:fs";
import crypto from "node:crypto";

export type DaTao = {
  /**
   * true = ảnh đã có trên Flow dưới tên `ten`. Với audit: có ĐÚNG MỘT card mang tên đó — trùng tên
   * (`soCard` > 1) là `false`, vì chip `@` của shot sau có thể đính nhầm card.
   */
  ok: boolean;
  /** Số card mang ĐÚNG NGUYÊN tên — chỉ audit-shots.ts đếm được. 0 = chưa có, >1 = trùng. */
  soCard?: number;
  /** outName lúc ghi. Lệch outName hiện tại = ảnh trên Flow mang tên cũ, cần tạo lại. */
  ten: string;
  /**
   * sha1[:12] của prompt đã sinh ra ảnh. Lệch prompt hiện tại = ảnh là của prompt cũ. CHỈ runner ghi
   * được (nhánh `created`); không biết thì để trống, không lấy prompt hiện tại thế vào.
   */
  promptHash?: string;
  kiemLuc: string;
  nguon: "run-shots" | "audit-flow";
  /** Lý do rơi, khi runner báo ❌. */
  loi?: string;
  /**
   * Audit chỉ khớp được qua nhãn bị Flow CẮT bằng dấu ba chấm (`matchLabel` trả `"cat"`) — `ok` không chắc
   * chắn, tên khác chung phần đầu cũng khớp. Xem bằng mắt ảnh audit tải về.
   */
  khopCat?: true;
};

/** Cùng công thức với `prompt_hash` trong review_shots.py. */
export const promptHash = (prompt: string): string =>
  crypto.createHash("sha1").update(prompt, "utf8").digest("hex").slice(0, 12);

/** `.shots.json` nằm cạnh `.jobs.json`, hoặc `undefined` nếu không có (jobs viết tay kiểu cũ). */
export function shotsFileFor(jobsFile: string): string | undefined {
  const f = jobsFile.replace(/\.jobs\.json$/, ".shots.json");
  return f !== jobsFile && fs.existsSync(f) ? f : undefined;
}

/**
 * Đọc–sửa–ghi `daTao` của các shot có trong `updates`. `update(prev)` trả `undefined` = để nguyên.
 * GIỮ NGUYÊN định dạng file (thụt 2 dấu cách, kiểu xuống dòng, có/không dòng trống cuối) để diff
 * chỉ là các dòng `daTao`. Trả số shot đã ghi.
 */
export function writeDaTao(
  shotsFile: string,
  updates: Map<string, (prev: DaTao | undefined) => DaTao | undefined>
): number {
  const raw = fs.readFileSync(shotsFile, "utf-8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const data = JSON.parse(raw);
  let written = 0;
  for (const seg of data.segments ?? []) {
    for (const s of seg.shots ?? []) {
      const update = updates.get(s.id);
      if (!update) continue;
      const next = update(s.daTao);
      if (!next) continue;
      s.daTao = next;
      written++;
    }
  }
  if (!written) return 0;
  let out = JSON.stringify(data, null, 2).replace(/\n/g, eol);
  if (/\r?\n$/.test(raw)) out += eol;
  fs.writeFileSync(shotsFile, out, "utf-8");
  return written;
}

/**
 * Nhãn một dòng bảng chọn có phải card `name` không.
 *
 * - `"exact"`: nhãn (bỏ đuôi loại media) bằng ĐÚNG NGUYÊN tên — đường chính.
 * - `"cat"`: nhãn bị Flow CẮT bằng dấu ba chấm và tên bắt đầu bằng phần còn lại. RUNBOOK mục
 *   "Ba điều về UI phải biết trước khi sửa typeMentionPrompt", điều 2: `09-half-moon-hotel-1927-cihp__claude.jpg`
 *   hiện thành `09-half-moon-hotel-192…`. Đo 2026-09-28/10-09: tên card nhiều chữ (tới 47 ký tự) KHÔNG bị cắt
 *   (85/85 + 77/77 khớp nguyên văn) — có vẻ chỉ tên file dài liền một chữ. Khớp kiểu này KHÔNG chắc chắn (hai tên
 *   chung phần đầu đều khớp), nên được đếm nhưng gắn cờ `khopCat` (luồng img-pipeline-datao D03, Tú quyết 2026-10-09).
 *
 * Không khớp chuỗi con, không khớp tiền tố khi nhãn KHÔNG bị cắt — đó đúng là lỗi tên này là phần đầu tên kia.
 */
export function matchLabel(rowText: string, name: string): "exact" | "cat" | null {
  const t = rowText.replace(/\s+/g, " ").replace(/ Image$/, "").trim();
  if (t === name) return "exact";
  const cut = t.match(/^(.*?)\s*(?:…|\.\.\.)$/);
  if (cut && cut[1].length >= 8 && name.startsWith(cut[1])) return "cat";
  return null;
}
