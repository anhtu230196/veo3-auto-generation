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
   *
   * `"corner"` → dùng `INTERIOR_CORNER_NOTE`: phòng TRONG NHÀ sẽ được ghép nhân vật vào.
   * Cho phép đúng 1 góc (2 mảng tường) + foreshorten nhẹ ở mảng bên, vì nhân vật do pipeline
   * sinh ra đều ở góc 3/4 — đặt lên nền phẳng tuyệt đối sẽ nhìn như dán đè lên (người dùng
   * chốt 2026-08-11). Vẫn cấm cảnh hút sâu thật. Dùng cho phòng tắm/phòng khách/văn phòng…,
   * KHÔNG dùng cho phố xá hay mặt tiền nhà (những cái đó vẫn "flat").
   *
   * `"perspective"` → dùng `SIMPLE_PERSPECTIVE_BLOCK`: phối cảnh 3D bình thường (nhà/tường
   * đặt chéo, mặt đất lùi xa) nhưng mọi mặt vẫn tô 1 màu đặc, không đổ bóng. Hướng phong cách
   * MỚI chốt 2026-08-11 — xem docstring block đó để biết vì sao bỏ ràng buộc trực giao.
   */
  composition?: "flat" | "layered" | "corner" | "perspective";
  /**
   * SỬA ẢNH: tạo asset này bằng cách lấy 1 asset ĐÃ CÓ làm ảnh gốc rồi đổi đúng vài chi tiết,
   * thay vì sinh mới từ chữ. Giá trị là TÊN asset gốc (phải đứng TRƯỚC trong mảng `assets` và
   * đã `status: "success"`).
   *
   * DÙNG KHI cần biến thể của cùng một bối cảnh: cửa mở/đóng, đèn bật/tắt, phòng khô/ướt,
   * ngày/đêm cùng góc máy. Sinh mới từ chữ sẽ ra bố cục lệch đi, không khớp với ảnh gốc khi
   * cắt qua lại giữa 2 cảnh — đây đúng là bài học "retouch 1 reference" đã dùng cho cảnh ghép
   * (skill mục 8), nay áp cho cả asset.
   *
   * Khi có `editFrom`, runner KHÔNG ghép style block nào — ảnh gốc đã neo phong cách, nhồi
   * thêm chữ chỉ làm model vẽ lại từ đầu. `description` lúc này chỉ nên nói ĐÚNG thứ cần đổi,
   * kèm câu giữ nguyên mọi thứ còn lại.
   */
  editFrom?: string;
  status?: AssetStatus;
  /** Ghi lại lý do lần thử gần nhất thất bại, để đọc lại bằng mắt không phải mò log. */
  lastError?: string;
  /**
   * Ghi chú tự do — dùng để đánh dấu asset ĐÃ TẠO XONG (`status: "success"`) nhưng không còn
   * đáng tin cậy để dùng làm reference cho asset khác, mà KHÔNG xoá lịch sử hay tự động tạo
   * lại (tự tạo lại cần user xác nhận prompt trước). Ví dụ: master reference nhân vật đã đổi
   * (`reference-character.jpeg` thay ảnh) nên Character cũ giờ lệch phong cách mới.
   */
  notes?: string;
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

    // `editFrom` phải trỏ tới asset ĐÃ ĐỨNG TRƯỚC — runner chạy tuần tự theo mảng, trỏ ra sau
    // thì lúc tạo ảnh gốc chưa tồn tại trong Flow. Chặn ngay khi đọc file, đừng để phát hiện
    // giữa mẻ (cùng lý do scenes.ts bắt xếp đúng thứ tự phụ thuộc).
    if (a.editFrom && !seen.has(a.editFrom.trim().toLowerCase())) {
      throw new Error(
        `Asset "${a.name}" có editFrom: "${a.editFrom}" nhưng asset đó không tồn tại hoặc ` +
          `đứng SAU nó trong mảng — xếp asset gốc lên trước.`
      );
    }
  }
  return parsed;
}
