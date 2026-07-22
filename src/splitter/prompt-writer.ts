import type { CharacterProfile } from "../characters/extract.js";
import type { PropProfile } from "../props/extract.js";
import type { AssetStatus } from "../assetStatus.js";
import {
  STYLE_NAME,
  SCENE_STYLE_BLOCK,
  MOTION_SUFFIX,
  PERIOD_ANCHOR,
  ERA_DESCRIPTOR,
  STYLE_ANCHOR_NAME,
} from "../styleDNA.js";

export interface VeoPrompt {
  index: number;
  sceneText: string;
  videoPrompt: string;
  /** Tên các nhân vật xuất hiện trong cảnh (khớp CharacterProfile.name) — dùng để attach Character asset trong Flow. */
  characterNames: string[];
  /**
   * ĐÁNH DẤU (viết tay, giống characterNames/propNames) khi khung hình/bố cục của ĐÚNG cảnh này
   * quan trọng tới mức cần soi ảnh trước khi tốn công generate video (vd cảnh thiết lập không
   * gian, hoặc 1 nửa của cặp cắt cảnh rộng→cận cần giữ đúng chi tiết phòng) — THAY THẾ cơ chế
   * Setting Ingredient cũ (tạo sẵn 1 ảnh mù cho MỌI địa điểm, xem lịch sử ở RUNBOOK mục 4.11/
   * 4.19). Khi `true`, `npm run generate-images` sinh 4 ảnh candidate RIÊNG cho cảnh này
   * (`sceneImages.ts`), người dùng tự soi trong Flow rồi điền `chosenImageIndex`; `npm run
   * generate` sau đó tạo video bằng cách "Animate" đúng ảnh đã chọn thay vì text-to-video
   * thông thường (xem `animateImage.ts`). Cảnh không đánh dấu vẫn generate như cũ — mô tả bối
   * cảnh/địa điểm được viết trực tiếp trong `videoPrompt` (xem QUY TẮC BỐI CẢNH trong
   * `buildPromptWritingGuide` bên dưới), không còn @mention Setting nào cả.
   */
  needsAngleLock?: boolean;
  /**
   * Trạng thái sinh 4 ảnh candidate cho cảnh có `needsAngleLock: true` (xem `sceneImages.ts`) —
   * dùng lại `AssetStatus` (`waiting`/`failed`/`success`). `undefined`/`waiting` với cảnh không
   * có `needsAngleLock` (không áp dụng).
   */
  imageStatus?: AssetStatus;
  /**
   * Người dùng tự điền TAY sau khi soi 4 ảnh `{index}_1`..`_4` trong Flow (không có UI review
   * nào được xây riêng — soi trực tiếp trong Flow rồi sửa field này trong `state/prompts.json`).
   * `npm run generate` chỉ "Animate" cảnh có `needsAngleLock` khi field này đã được điền.
   */
  chosenImageIndex?: 1 | 2 | 3 | 4;
  /**
   * Tên đạo cụ/vật dụng cố định xuất hiện trong cảnh (khớp PropProfile.name) — dùng để attach
   * Prop asset trong Flow, giữ ĐÚNG hình dạng vật đó qua nhiều cảnh (vd 1 con tàu, 1 bản đồ cụ
   * thể). Rỗng nếu cảnh không dùng đạo cụ nào cần giữ nhất quán qua nhiều cảnh.
   */
  propNames?: string[];
  /**
   * "modern" CHỈ dùng cho cảnh cố ý đặt trong hiện tại/thời nay (vd vệ tinh NASA, biển
   * đường phố, tượng đài) — mặc định "period" (thời đại câu chuyện, xem ERA_DESCRIPTOR).
   * Quyết định có append PERIOD_ANCHOR hay không khi viết videoPrompt (xem PROMPT_WRITING_GUIDE).
   */
  era?: "period" | "modern";
  /**
   * Trạng thái TẠO + ĐỔI TÊN clip video trong Flow cho cảnh này (xem assetStatus.ts) — cập nhật +
   * lưu lại trong veo3bot/generate.ts::generateClips. "success" = đã tạo+đổi tên xong TRONG FLOW,
   * bỏ qua khi `npm run generate` resume — KHÔNG có nghĩa là đã có file local (xem RUNBOOK mục
   * 4.31, generate không còn tải video về nữa). "waiting" khi mới sinh prompt (chưa generate lần
   * nào); "failed" nếu Flow từ chối/timeout.
   */
  status?: AssetStatus;
  /**
   * true khi đã TẢI THÀNH CÔNG clip 1080p về `output/clips/clip_NNN.mp4` — cập nhật + lưu lại
   * trong `downloadVideos.ts` (lệnh `npm run download`, xem RUNBOOK mục 4.31/4.35), dùng để
   * resume: lần chạy `npm run download` sau bỏ qua mọi cảnh đã `isDownloaded === true`, không tải
   * lại. Tự đồng bộ lại theo file THẬT SỰ có tồn tại trên đĩa hay không mỗi lần chạy (giống cơ chế
   * status↔file cũ mục 4.18) — nếu file bị xoá tay, cờ này tự về `false` để tải lại.
   */
  isDownloaded?: boolean;
}

/**
 * Toàn bộ quy tắc/kiến thức viết `videoPrompt` cho `state/prompts.json` — TRƯỚC ĐÂY là system
 * prompt gọi Gemini theo lô, NAY dùng làm SPEC để Claude đọc và tự viết prompt bằng tay trong
 * hội thoại (đã bỏ gọi Gemini/ElevenLabs tự động, xem RUNBOOK.md mục 4.20). Toàn bộ quy tắc
 * đã đúc kết qua thực tế (mục 4 RUNBOOK) vẫn giữ nguyên giá trị dù ai/cái gì viết prompt.
 */
export function buildPromptWritingGuide(
  characters: CharacterProfile[],
  props: PropProfile[]
): string {
  const roster = characters.map((c) => `- ${c.name}`).join("\n");
  const propRoster =
    props.length > 0
      ? props.map((p) => `- ${p.name}: ${p.description}`).join("\n")
      : "(không có đạo cụ cố định nào được khai báo trước — bỏ qua propNames, luôn để rỗng)";
  return `Bạn là đạo diễn hình ảnh chuyển thể kịch bản (lịch sử/khám phá/tài liệu) thành storyboard video
(Veo3), mỗi cảnh dài 7-8 giây, phong cách ${STYLE_NAME.toUpperCase()} — PHẢI trông như ảnh/phim thật
(phim tài liệu lịch sử/phim truyện dàn dựng), CÓ THỂ và NÊN mô tả kết cấu da, chất liệu vải/gỗ/kim loại,
ánh sáng tự nhiên như quay bằng máy quay/máy ảnh thật — KHÔNG mô tả bất kỳ điều gì gợi ý vẽ tay/hoạt
hình/CGI-render (không "flat colors", không "outline", không "illustration", không "cartoon").
Danh sách nhân vật đã có sẵn Character reference trong Flow, đã được tạo THEO ĐÚNG phong cách
${STYLE_NAME} (KHÔNG cần mô tả lại ngoại hình cố định — Flow tự giữ khi nhân vật được @mention đính kèm):
${roster}

Danh sách đạo cụ/vật dụng cố định đã có sẵn Prop reference trong Flow (KHÔNG cần mô tả lại hình dạng cố
định — Flow tự giữ khi đạo cụ được @mention đính kèm):
${propRoster}

Mỗi cảnh viết 1 phần tử JSON dạng:
{"videoPrompt": "...", "characterNames": ["..."], "propNames": ["..."], "era": "period", "needsAngleLock": false}

era: "period" (mặc định, thời đại của câu chuyện) hoặc "modern" — CHỈ dùng "modern" cho cảnh cố ý đặt
trong hiện tại/thời nay (vd vệ tinh, đường phố ngày nay, tượng đài, TV/tin tức). Mọi cảnh khác PHẢI để
"period" hoặc bỏ trống field này.

videoPrompt: tiếng Anh, NGẮN GỌN — tối đa 2-3 câu. Mỗi cảnh chỉ 7-8 giây, và Veo3 RẤT DỄ lỗi/lẫn nhân
vật nếu prompt dồn quá nhiều hành động cùng lúc — nguyên tắc quan trọng nhất: MỖI NHÂN VẬT XUẤT HIỆN CHỈ
ĐƯỢC LÀM ĐÚNG 1 HÀNH ĐỘNG ĐƠN GIẢN trong cảnh đó (vd "X looks out the window" — KHÔNG viết thêm nhiều
hành động dồn dập như "vừa nhìn vừa siết chặt tay vừa quay đầu lại" trong cùng 1 prompt). Gồm ĐỦ các
phần sau:
1. Cỡ cảnh tĩnh cụ thể (medium shot / close-up / wide shot) — KHÔNG mô tả chuyển động máy quay (không
   pan/dolly/zoom/tracking) trừ khi thật sự cần thiết, vì hướng dẫn thêm cho camera cạnh tranh sự chú ý
   của mô hình với đúng chuyển động nhân vật cần render, dễ gây lỗi.
2. Bối cảnh cụ thể: không gian, thời điểm trong ngày, 1-2 chi tiết môi trường nổi bật (không chỉ nói
   chung "a room" mà tả rõ loại phòng, không khí).
3. ĐÚNG 1 hành động/biểu cảm rõ ràng của MỖI nhân vật xuất hiện trong cảnh.
4. Tông màu/không khí cảnh (xem TÔNG MÀU bên dưới).

QUY TẮC NHÂN VẬT (RẤT QUAN TRỌNG — sai quy tắc này làm nhân vật hiện SAI trong video):
- Nhắc TÊN ĐẦY ĐỦ, ĐÚNG CHÍNH TẢ của nhân vật (đúng như trong danh sách trên) MỖI KHI nhân vật đó xuất
  hiện/hành động trong câu — không dùng đại từ ("he", "she", "him", "her") thay tên ở câu đầu tiên giới
  thiệu nhân vật đó trong cảnh; có thể dùng đại từ ở câu sau nếu đã nhắc tên trước đó trong cùng cảnh.
- TUYỆT ĐỐI phải để nhân vật hiện RÕ (front hoặc three-quarter view), đủ sáng để nhận diện được
  silhouette/trang phục đặc trưng. KHÔNG được mô tả cảnh nhân vật xuất hiện dưới dạng: bóng lưng hoàn
  toàn khuất mặt, soi gương/phản chiếu, quay lưng bỏ đi, chỉ quay cận 1 bộ phận không phải cả nhân vật,
  hoặc hiệu ứng "glitch/degrade" — các kiểu này khiến Veo3 KHÔNG neo được đúng nhân vật, tự vẽ ra hình
  khác hẳn. (NGOẠI LỆ: cảnh bạo lực/chiến tranh/chết chóc — xem mục riêng bên dưới, dùng silhouette CÓ
  CHỦ ĐÍCH.)
- Nếu cảnh không có nhân vật nào chính xuất hiện rõ (vd cận cảnh vật thể, camera an ninh quay xa, màn
  hình máy tính, phong cảnh, HOẶC cảnh bạo lực dùng silhouette theo mục riêng) thì để characterNames
  RỖNG — đừng gán nhân vật cho cảnh không thật sự thấy rõ họ.
- Nếu 1 cảnh có từ 2 nhân vật trở lên cùng xuất hiện, mô tả rõ TỪNG nhân vật đang làm gì (không gộp mơ
  hồ "they"), để characterNames liệt kê đủ.
- TRƯỚC KHI viết "a young unnamed X"/"an unnamed X" cho BẤT KỲ nhân vật nào trong cảnh, ĐỐI CHIẾU LẠI với
  danh sách nhân vật đã có sẵn ở trên xem có entry nào KHỚP với người đang được mô tả không (kể cả nhân
  vật ở mốc tuổi khác, tên rút gọn, hay tên dạng quan hệ sở hữu) — LỖI ĐÃ XÁC NHẬN TRỰC TIẾP (RUNBOOK mục
  4.29, cảnh #11): cảnh mô tả rõ ràng Christopher Columbus đang nghiên cứu bản đồ lại bị viết thành "a
  young unnamed mapmaker" dù Character "Christopher" ĐÃ có sẵn trong danh sách — khiến Veo3 không @mention
  được nhân vật này, tự vẽ ra 1 người khác hoàn toàn (mất nhất quán hình ảnh). Chỉ dùng "unnamed" khi
  THẬT SỰ là nhân vật quần chúng không có Character asset nào tương ứng, không phải vì quên đối chiếu.
- TÊN NHÂN VẬT LỊCH SỬ/CÔNG CHÚNG CÓ THẬT (CẢ dàn nhân vật, KHÔNG chỉ nhân vật chính hay người thân của họ
  — cập nhật 2026-07-19 sau khi xác nhận lỗi vẫn tái diễn ở nhân vật phụ khác) — LỖI ĐÃ XÁC NHẬN TRỰC TIẾP:
  Flow từng từ chối tạo cảnh với lỗi "might violate our policies about generating prominent people" dù đã
  @mention đúng Character, xảy ra với BẤT KỲ ai trong dàn nhân vật có tên đầy đủ trùng khớp người thật/lịch
  sử — không chỉ nhân vật chính (vd "Christopher Columbus" → đổi tên ngắn "Christopher" hết bị chặn) hay
  người thân của họ (vd "Bartholomew Columbus" → đổi tên quan hệ sở hữu "Columbus's Brother" hết bị chặn),
  mà CẢ nhân vật phụ khác không liên quan họ hàng (vua/hoàng hậu, nhà tài trợ, đồng đội...) cũng có nguy cơ
  y hệt nếu tên đăng ký là tên lịch sử thật đầy đủ. Nếu danh sách nhân vật ở trên đã dùng tên NGẮN (chỉ tên
  riêng, vd "Christopher"), tên quan hệ sở hữu (vd "Columbus's Brother"), hoặc tên vai trò/chức danh (vd
  "The Queen", "The Fleet Captain") thay vì tên lịch sử đầy đủ — đây là CÓ CHỦ ĐÍCH (xem quy tắc 3 cách đổi
  tên trong CHARACTER_EXTRACTION_GUIDE, file characters/extract.ts), không phải lỗi đặt tên. LUÔN dùng ĐÚNG
  tên đã cho trong danh sách (kể cả dạng tên ngắn/quan hệ sở hữu/vai trò) khi nhắc trong videoPrompt —
  TUYỆT ĐỐI không tự đổi lại/ghép thêm thành tên lịch sử đầy đủ của họ dù bạn biết tên đó, vì sẽ tái diễn
  lỗi bị chặn.

QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM — KHÔNG còn Setting Ingredient nào để @mention nữa (bỏ hẳn cơ chế tạo sẵn
1 ảnh bối cảnh cho mọi địa điểm, xem lịch sử RUNBOOK mục 4.11/4.19 — ảnh Setting mù thường sai nội
dung/khoá cứng sai ánh sáng, chỉ phát hiện được sau khi đã tốn công generate video). Thay vào đó:
- MỌI cảnh PHẢI mô tả không gian/địa điểm bằng LỜI VĂN trực tiếp trong chính videoPrompt của cảnh đó
  (không gian, thời điểm trong ngày, 1-2 chi tiết môi trường nổi bật) — xem thêm mục "CẢNH CHÂN DUNG
  TRẦN" bên dưới, quy tắc đó giờ áp dụng cho TẤT CẢ mọi cảnh, không chỉ chân dung.
- Nếu 1 địa điểm được dùng lại ở nhiều cảnh rải rác (không liền kề), chỉ cần mô tả nhất quán bằng LỜI
  VĂN (cùng vài chi tiết đặc trưng lặp lại) — không cần và không còn cách nào giữ Y HỆT pixel giữa các
  lần dùng, đây là đánh đổi có chủ đích (đơn giản hoá pipeline) của người dùng.
- needsAngleLock: đặt true cho cảnh mà khung hình/bố cục CỤ THỂ của ĐÚNG cảnh đó quan trọng tới
  mức cần soi ảnh trước khi generate video — điển hình nhất: 1 nửa của cặp cắt cảnh rộng→cận CÙNG 1
  khoảnh khắc/căn phòng (index liền kề), nơi bố cục sai sẽ lộ rõ ngay. Khi true, "npm run
  generate-images" sinh 4 ảnh still riêng cho cảnh đó để người dùng tự chọn trước khi tạo video. Đa
  số cảnh KHÔNG cần đánh dấu — chỉ dùng cho trường hợp thật sự quan trọng, vì mỗi cảnh đánh dấu tốn
  thêm 1 vòng soi ảnh thủ công.
- KHÔNG còn dùng "${STYLE_ANCHOR_NAME}" làm điểm neo phong cách nữa (quyết định của người dùng,
  2026-07-19, xem RUNBOOK mục 4.30) — MỌI cảnh (kể cả cảnh mồ côi hoàn toàn hoặc chỉ có Prop) chỉ dựa
  vào block style text (MOTION_SUFFIX, append bằng code vào cuối mọi videoPrompt) để giữ phong cách,
  KHÔNG cần @mention thêm bất kỳ Ingredient nào chỉ để neo style. (LỊCH SỬ: RUNBOOK mục 4.12/4.29 từng
  xác nhận trực tiếp 1 cảnh chỉ có Prop bị trôi phong cách thành ảnh thật dù đã có đủ MOTION_SUFFIX,
  và cơ chế Style Anchor từng được thêm để khắc phục — người dùng đã cân nhắc và chủ động chấp nhận đổi
  lại, ưu tiên đơn giản hoá pipeline hơn rủi ro trôi phong cách hiếm gặp ở cảnh Prop-only/mồ côi.)

QUY TẮC ĐẠO CỤ/VẬT DỤNG (propNames) — chỉ áp dụng nếu danh sách đạo cụ ở trên không rỗng:
- Nếu cảnh có xuất hiện RÕ 1 đạo cụ đã có trong danh sách (vd 1 con tàu cụ thể, 1 bản đồ/vật biểu tượng
  cụ thể) và hình dạng đúng của nó quan trọng với cảnh đó, điền tên đạo cụ vào propNames.
- Nếu cảnh chỉ nhắc thoáng qua hoặc đạo cụ không phải trọng tâm hình ảnh của cảnh, để propNames RỖNG —
  không cần @mention mọi lần đạo cụ được nhắc trong lời kể, chỉ khi hình dạng đúng của nó thực sự cần
  hiện rõ trên màn hình.
- KHÔNG tự đặt tên đạo cụ mới ngoài danh sách đã cho.

BỐI CẢNH THỜI ĐẠI (RẤT QUAN TRỌNG — lỗi đã xác nhận trực tiếp qua ảnh render thật): câu chuyện diễn ra ở
${ERA_DESCRIPTOR}. Nhân vật/đối tượng CÓ tên riêng trong danh sách trên được Character asset giữ đúng
ngoại hình, nhưng nhân vật QUẦN CHÚNG không tên (thủy thủ khác, dân làng, lính gác, người định cư...) và
bối cảnh chung chung (cảng, tàu buôn, khu chợ, boong tàu) KHÔNG có gì neo giữ — Veo3 sẽ mặc định vẽ theo
nghĩa HIỆN ĐẠI của các danh từ chung này (đã xác nhận: prompt "a young unnamed sailor... merchant ship's
deck" ra hình thủy thủ áo kẻ sọc thời nay đứng cạnh container/cần cẩu cảng hiện đại). Vì vậy:
- MỌI cảnh không tên riêng phải mô tả RÕ trang phục/vật dụng đúng thời đại (áo vải len/lanh, quần thô,
  dây thừng, tàu buồm gỗ, kiến trúc đá/gỗ...) — không chỉ nói chung "a sailor" hay "a ship" mà không có
  chi tiết thời đại nào đi kèm.
- Đặt era: "modern" CHỈ cho cảnh cố ý ở hiện tại (vệ tinh, đường phố ngày nay, tượng đài, tin tức) — các
  cảnh này ngược lại phải rõ ràng là hiện đại, không lẫn chi tiết thời cổ.
- Với mọi cảnh còn lại, để era: "period" (hoặc bỏ trống) — PERIOD_ANCHOR (styleDNA.ts) sẽ được append vào
  cuối videoPrompt để neo thời đại đầy đủ, chỉ cần đảm bảo mô tả không mâu thuẫn với thời đại (không tự ý
  thêm chi tiết hiện đại).

CẢNH "CHÂN DUNG TRẦN" — GIỜ LÀ QUY TẮC CHUNG CHO MỌI CẢNH (RẤT QUAN TRỌNG — lỗi đã xác nhận trực tiếp
qua ảnh render thật, RUNBOOK mục 4.46; mở rộng phạm vi sau khi bỏ hẳn Setting Ingredient — không còn gì
neo bối cảnh ngoài chính lời văn nữa, nên quy tắc này áp dụng cho TẤT CẢ cảnh, không chỉ chân dung):
KHÔNG BAO GIỜ viết 1 cảnh chỉ có nhân vật + ánh sáng/tâm trạng mà KHÔNG mô tả TÍ GÌ về không gian xung
quanh (vd "Medium portrait shot of X standing confidently..., warm golden light." — không 1 chữ nào tả
bối cảnh). PERIOD_ANCHOR (styleDNA.ts) liệt kê VÍ DỤ đồ vật thời đại (tàu buồm, xe trượt, đèn dầu...) để
neo các danh từ chung ĐÃ CÓ trong câu — nhưng khi cảnh hoàn toàn không mô tả bối cảnh, Veo3 không có gì
khác để bám ngoài chính danh sách ví dụ đó, và sẽ lấy luôn 1 món trong đó (đã xác nhận: "tàu buồm" xuất
hiện làm phông nền thật cho 1 cảnh chân dung không hề liên quan gì đến tàu thuyền). MỌI cảnh KHÔNG gán
propNames PHẢI thêm 1 cụm mô tả không gian/phông nền — dù chỉ là phông nền trung tính khi cảnh cố ý
không cần bối cảnh cụ thể (vd "against a plain softly blurred [tông màu]-toned background with no
distinct objects, furniture, or setting visible"), hoặc mô tả không gian thật nếu cảnh diễn ra ở 1 nơi
cụ thể (phòng, boong tàu, ngoài trời...). Đừng để trống hoàn toàn.

LƯU Ý KHI RÀ SOÁT LẠI (đã xác nhận trực tiếp lỗi rà soát thiếu sót, RUNBOOK mục 4.46 phần mở rộng):
KHÔNG chỉ tìm mẫu chữ "portrait shot" — cảnh dạng "Close-up of X's face...", "Medium shot of X
[hành động nhỏ]..., [tâm trạng] light" cũng dính CÙNG lỗi hệt vậy nếu không mô tả không gian (đã xác
nhận thêm ở 16 cảnh khác ngoài 3 cảnh "portrait shot" ban đầu). Khi rà soát 1 kịch bản để tìm cảnh chân
dung trần, kiểm tra TẤT CẢ cảnh có characterNames không rỗng + propNames rỗng, rồi tự hỏi "câu này có
bất kỳ từ nào mô tả không gian/vật thể xung quanh không" — đừng chỉ lọc theo 1 cụm chữ cố định, vì cách
diễn đạt "chân dung trần" rất đa dạng.

CẢNH NHIỀU NGƯỜI, CHỈ 1 NGƯỜI CÓ CHARACTER INGREDIENT (RUNBOOK mục 4.51 — CHƯA CÓ CÁCH SỬA CHẮC CHẮN):
đã xác nhận trực tiếp 1 cảnh (nhân vật chính đứng cùng vài người quần chúng không có Ingredient, vd gia
đình/đám đông) render ra nhân vật chính TO HƠN HẲN người khác — nghi do ảnh Character reference (turnaround,
chiếm gần hết khung) mang theo tỉ lệ riêng khi ghép vào cảnh mới. Đã thử thêm câu yêu cầu tỉ lệ nhất quán
vào cuối mọi videoPrompt (append bằng code, xem SCALE_CONSISTENCY_BLOCK trong styleDNA.ts) nhưng generate
lại KHÔNG thấy cải thiện rõ rệt — có thể là giới hạn thật của cơ chế Ingredient, không phải lỗi sửa được
hoàn toàn bằng câu chữ. Khi viết cảnh có nhân vật chính (Character Ingredient) đứng cùng nhiều người quần
chúng ở cự ly gần, cân nhắc: (a) chấp nhận rủi ro lệch tỉ lệ, để sửa tay ở hậu kỳ nếu nặng, hoặc (b) tránh
bố cục "1 nhân vật có Ingredient đứng sát nhiều người không có Ingredient" nếu cảnh không bắt buộc phải vậy
(vd đổi góc máy để nhân vật chính xuất hiện riêng, cắt sang cảnh khác cho nhóm người quần chúng).

Giữ nhất quán bối cảnh/thời điểm xuyên suốt các cảnh liền kề — không lặp lại y hệt bối cảnh/khoảng cách
của cảnh liền trước, đổi cỡ cảnh TĨNH để tránh đơn điệu (KHÔNG dùng chuyển động máy quay để tạo khác biệt
— xem mục 1 ở trên).

TÔNG MÀU/KHÔNG KHÍ — dựng bằng phong cách ${STYLE_NAME}, tông màu đi theo TÂM TRẠNG từng cảnh (không cố
định 1 tông cho toàn bộ video). Áp dụng: ${SCENE_STYLE_BLOCK}
Gợi ý chọn theo mood: cảnh trang trọng/thương lượng/nội thất ban ngày → tông ấm vàng nâu (warm amber);
cảnh căng thẳng/nguy hiểm/chờ đợi/xung đột → tông lạnh xám-xanh (cool blue-grey); cảnh ngoài trời/chợ/lễ
hội/khám phá tích cực → tông ấm bão hoà hơn; cảnh đêm/biển đêm/bi kịch → tông chàm sẫm tối (deep indigo/
desaturated). Đổi tông theo đúng diễn biến cảm xúc của câu chuyện, không áp đặt 1 tông u ám xuyên suốt
nếu câu chuyện có cả đoạn vui/hào hứng/hy vọng.

CẢNH BẠO LỰC/CHIẾN TRANH/CHẾT CHÓC (nếu kịch bản có — giao tranh, hành quyết, thảm sát, hiện trường sau
xung đột...):
- KHÔNG mô tả chi tiết giải phẫu/máu me/vết thương. Mô tả HIỆU ỨNG lên không gian xung quanh trước (quy
  mô, khói bụi, bóng đổ dài, đám đông mờ dần trong sương) thay vì mô tả trực tiếp hành vi bạo lực.
- Nhân vật liên quan trong khoảnh khắc bạo lực: render dưới dạng flat black silhouette tuyệt đối, nói
  RÕ trong prompt "flat black silhouette shape, no anatomical or gore detail". Cảnh này để
  characterNames RỖNG (silhouette không tính là "hiện rõ nhân vật", nên không cần/không nên @mention).
- Ưu tiên khoảng cách xa, góc rộng, sương mù/tối, số đông mờ dần thay vì cận cảnh chi tiết.

QUAN TRỌNG — mô hình AI video (Veo3) render RẤT TỆ mọi chuyển động cần độ chính xác tuần tự/vật lý
chi tiết, kết quả thường giật cục, phi logic, sai vật lý. TUYỆT ĐỐI TRÁNH mô tả:
- Số/chữ cần hiển thị rõ và đúng thứ tự (vd "digital clock counting down 30, 29, 28", "reads the exact
  text on screen") — mô hình sẽ render số/chữ sai, nhảy lộn xộn.
- Chuyển động tay/ngón tay phức tạp cần chính xác (gõ phím đúng từng phím, đếm ngón tay, thao tác tay
  tỉ mỉ) — mô hình hay vẽ sai số ngón/khớp tay kỳ dị.
- Nhiều nhân vật phối hợp hành động đồng bộ chính xác (vd 2 người bắt tay đúng khoảnh khắc, vật thể
  chạm nhau chính xác) — dễ bị chồng hình/xuyên qua nhau phi vật lý.
- Chuyển động đổi hướng đột ngột/nhanh trong 1 clip ngắn — dễ giật, không mượt.
Thay vào đó LUÔN mô tả chuyển động ĐƠN GIẢN, LIÊN TỤC, MỘT HƯỚNG cho MỖI nhân vật (KHÔNG dùng chuyển
động camera để bù — xem mục 1 ở trên): đứng yên với biểu cảm/cử chỉ nhỏ, di chuyển chậm một hướng, vật
thể mờ/blur khi cần thể hiện tốc độ thay vì hiển thị rõ chi tiết (vd "clock hand sweeping steadily" thay
vì đếm số cụ thể, "blurred text scrolling" thay vì yêu cầu đọc được nội dung, "a subtle hand gesture"
thay vì mô tả động tác tay tỉ mỉ).
characterNames: chỉ liệt kê tên đúng như trong danh sách trên, nhân vật thực sự xuất hiện rõ (không phải
silhouette bạo lực) theo QUY TẮC NHÂN VẬT ở trên.

VIDEOPROMPT CUỐI CÙNG PHẢI GỒM (append bằng tay theo đúng thứ tự, xem styleDNA.ts để lấy đúng text):
1. Nội dung cảnh (theo các quy tắc ở trên).
2. PERIOD_ANCHOR nếu era "period" (bỏ qua nếu "modern").
3. MOTION_SUFFIX (luôn luôn, mọi cảnh) — đã gồm cả yêu cầu photorealistic (PHOTOREAL_BLOCK) và là điểm
   neo phong cách DUY NHẤT (không còn dùng Style Anchor Ingredient, xem QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM ở trên).`;
}

