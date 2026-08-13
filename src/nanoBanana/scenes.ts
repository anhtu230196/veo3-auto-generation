/**
 * Kiểu dữ liệu + đọc file `scenes.json` — danh sách CẢNH GHÉP (Character + Background thành 1
 * ảnh cuối, hoặc sửa 1 chi tiết nhỏ trên 1 cảnh đã ghép sẵn) cho pipeline Nano Banana. Khác
 * `assets.ts` (Character/Prop/Background — các "nguyên liệu" tái sử dụng được) ở chỗ: mỗi entry
 * ở đây là 1 KHUNG HÌNH CUỐI dùng trực tiếp cho 1 câu/đoạn cụ thể trong kịch bản, không tái sử
 * dụng cho nhân vật/cảnh khác — xem RUNBOOK.md mục 8.2.
 */
import type { AssetStatus } from "../assetStatus.js";
import { atomicWriteJson } from "./assets.js";
import fs from "node:fs/promises";

export interface SceneComposite {
  /** Tên hiển thị trong Flow — cũng là tên dùng để tra lại / dùng làm reference cho scene khác. */
  name: string;
  /** Số thứ tự case trong tập. */
  case: number;
  /** Câu/đoạn trong `en.md` mà cảnh này minh hoạ — chỉ để đối chiếu, không dùng trong prompt. */
  narrationRef: string;
  /**
   * Tên các asset (Character/Background đã tạo trong `assets.json`, HOẶC 1 scene khác đã
   * `status: "success"` trong chính file này) sẽ đính làm reference, ĐÚNG THỨ TỰ sẽ đính —
   * đính qua `attachExistingAssets`, mỗi asset phải đã tồn tại thật trong Flow trước khi chạy
   * scene này (đặt scene phụ thuộc SAU scene nó tham chiếu trong mảng `scenes`).
   */
  references: string[];
  /** Prompt đầy đủ mô tả cách ghép — không cần lặp lại style block, các ảnh reference đã neo phong cách. */
  prompt: string;
  status?: AssetStatus;
  lastError?: string;
  notes?: string;
}

export interface SceneFile {
  episode: string;
  /**
   * Khoá project Flow cho file này — mỗi case NÊN có khoá riêng, vì asset trong Flow thuộc
   * RIÊNG từng project (đã xác minh bằng scripts/check-asset-scope.ts, 2026-08-11). Tách ra
   * thì ô "Search assets" của mỗi case chỉ chứa asset của case đó, hết hẳn lớp lỗi trùng
   * tên/khớp nhầm ở mục 8.1.3l. Bỏ trống = dùng project chung như trước.
   *
   * PHẢI đặt GIỐNG NHAU giữa assets.json và scenes.json của cùng 1 case — lệch khoá thì asset
   * nằm project này mà cảnh đi tìm ở project kia.
   */
  flowProject?: string;

  scenes: SceneComposite[];
}

export async function loadSceneFile(filePath: string): Promise<SceneFile> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  if (raw === null) {
    throw new Error(`Không đọc được ${filePath}. Tạo file này trước (xem mẫu trong narration-scripts/).`);
  }
  const parsed = JSON.parse(raw) as SceneFile;

  const seen = new Set<string>();
  for (const s of parsed.scenes) {
    const key = s.name.trim().toLowerCase();
    if (seen.has(key)) throw new Error(`Tên scene bị trùng trong ${filePath}: "${s.name}"`);
    seen.add(key);
  }
  return parsed;
}

export { atomicWriteJson };
