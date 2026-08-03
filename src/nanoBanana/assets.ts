/**
 * Kiểu dữ liệu + đọc/ghi danh sách asset ảnh cho pipeline "tạo ảnh bằng Flow chế độ Image
 * (Nano Banana 2)" — dùng cho kênh kịch bản tuyển tập, KHÁC hoàn toàn pipeline video Veo3.
 *
 * NƠI LƯU: `narration-scripts/<tên-tập>/assets.json`, KHÔNG dùng `state/` — RUNBOOK mục 0
 * ghi rõ `state/`/`output/`/`input/` CHỈ dành cho pipeline video, workflow kịch bản không
 * được tạo state ở đó. Để mọi thứ của 1 tập nằm cùng 1 thư mục cũng dễ theo dõi hơn.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { AssetStatus } from "../assetStatus.js";

export type ImageAssetType = "character" | "prop" | "background";

export interface ImageAsset {
  /** Tên hiển thị trong Flow — cũng là tên dùng để tra lại asset. PHẢI duy nhất toàn tập. */
  name: string;
  type: ImageAssetType;
  /** Số thứ tự case trong tập (để lọc/ chạy từng case một). */
  case: number;
  /**
   * Mô tả để ghép vào prompt. Với `character`, đây là phần nối SAU
   * `CHARACTER_PROMPT_PREFIX` và chỉ nên gồm trang phục/tóc/mũ/râu — xem
   * `CHARACTER_DESCRIPTION_CHECKLIST` trong styleDNA.ts.
   * TUYỆT ĐỐI không chứa tên người thật (bộ lọc "prominent people", RUNBOOK 4.28/4.40).
   */
  description: string;
  /**
   * CHỈ dùng cho `type: "background"`. `true` = cảnh này sẽ được ghép nhân vật đứng vào sau,
   * nên phải thêm `RESERVE_CHARACTER_SPACE_BLOCK` (chừa sàn trống ~1/3 dưới khung) và
   * `EYE_LEVEL_CAMERA_BLOCK` (ép góc máy ngang tầm mắt) — styleDNA.ts ghi rõ 2 block này BẮT
   * BUỘC cho loại background đó, không có thì model lấp kín khung và đặt camera chéo từ trên
   * xuống, khiến sàn trước sai góc để đặt nhân vật.
   * `false`/bỏ trống = cảnh toàn cảnh không ghép người (vd cảnh nhìn từ xa) — không ép 2 block
   * đó để khỏi bó bố cục vô ích.
   */
  reserveCharacterSpace?: boolean;
  /**
   * CHỈ dùng cho `type: "background"`. Mặc định (bỏ trống) = `"flat"`.
   *
   * `"flat"` → thêm `NO_PERSPECTIVE_BLOCK`: bố cục chiếu thẳng, KHÔNG điểm tụ, mọi thứ xếp
   * thành các DẢI NGANG song song như phông sân khấu. Đây là phong cách người dùng đã chốt
   * (2026-08-02) sau khi 2 cảnh tháp đầu tiên ra phối cảnh hút sâu và bị loại.
   *
   * `"layered"` → dùng `LAYERED_DEPTH_LANDSCAPE_NOTE` thay thế: chỉ cho cảnh THIÊN NHIÊN
   * RỘNG (núi xa → làng giữa → ruộng gần), nơi chiều sâu kiểu xếp lớp vẫn giữ được cảm giác
   * phẳng và ép "zero depth" là bó vô ích. KHÔNG dùng cho kiến trúc.
   */
  composition?: "flat" | "layered";
  status?: AssetStatus;
  /** Ghi lại lý do lần thử gần nhất thất bại, để đọc lại bằng mắt không phải mò log. */
  lastError?: string;
}

export interface AssetFile {
  episode: string;
  assets: ImageAsset[];
}

/**
 * Ghi ATOMIC (file tạm rồi rename) — `fs.writeFile` không atomic, crash giữa chừng để lại
 * file 0 byte và mất sạch tiến độ (RUNBOOK mục 4.23, đã xảy ra thật với prompts.json).
 */
export async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, filePath);
}

export async function loadAssetFile(filePath: string): Promise<AssetFile> {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => null);
  if (raw === null) {
    throw new Error(
      `Không đọc được ${filePath}. Tạo file này trước (xem mẫu trong narration-scripts/).`
    );
  }
  const parsed = JSON.parse(raw) as AssetFile;

  // Tên trùng nhau khiến bước tra/đổi tên trong Flow chọn nhầm asset — chặn ngay từ đầu,
  // cùng lý do pipeline video bắt buộc tên không trùng giữa Character/Setting/Prop (mục 3).
  const seen = new Set<string>();
  for (const a of parsed.assets) {
    const key = a.name.trim().toLowerCase();
    if (seen.has(key)) throw new Error(`Tên asset bị trùng trong ${filePath}: "${a.name}"`);
    seen.add(key);
  }
  return parsed;
}
