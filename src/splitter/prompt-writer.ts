import type { CharacterProfile } from "../characters/extract.js";
import type { SettingProfile } from "../settings/extract.js";
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
   * Tên bối cảnh/địa điểm cố định xuất hiện trong cảnh (khớp SettingProfile.name) — dùng để
   * attach Setting asset trong Flow, giữ ĐÚNG cùng 1 không gian khi cắt cảnh rộng → cận trong
   * cùng 1 địa điểm (vd toàn cảnh 1 căn phòng rồi cắt cận 1 nhân vật đang nói, vẫn đúng căn
   * phòng đó). Rỗng nếu cảnh không dùng bối cảnh nào cần giữ nhất quán qua nhiều cảnh.
   */
  settingNames?: string[];
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
   * Trạng thái tạo clip video cho cảnh này (xem assetStatus.ts) — cập nhật + lưu lại trong
   * veo3bot/generate.ts::generateClips. "success" = đã có clip file thật, bỏ qua khi resume.
   * "waiting" khi mới sinh prompt (chưa generate lần nào); "failed" nếu Flow từ chối/timeout.
   */
  status?: AssetStatus;
}

/**
 * Toàn bộ quy tắc/kiến thức viết `videoPrompt` cho `state/prompts.json` — TRƯỚC ĐÂY là system
 * prompt gọi Gemini theo lô, NAY dùng làm SPEC để Claude đọc và tự viết prompt bằng tay trong
 * hội thoại (đã bỏ gọi Gemini/ElevenLabs tự động, xem RUNBOOK.md mục 4.20). Toàn bộ quy tắc
 * đã đúc kết qua thực tế (mục 4 RUNBOOK) vẫn giữ nguyên giá trị dù ai/cái gì viết prompt.
 */
export function buildPromptWritingGuide(
  characters: CharacterProfile[],
  settings: SettingProfile[],
  props: PropProfile[]
): string {
  const roster = characters.map((c) => `- ${c.name}`).join("\n");
  const settingRoster =
    settings.length > 0
      ? settings.map((s) => `- ${s.name}: ${s.description}`).join("\n")
      : "(không có bối cảnh cố định nào được khai báo trước — bỏ qua settingNames, luôn để rỗng)";
  const propRoster =
    props.length > 0
      ? props.map((p) => `- ${p.name}: ${p.description}`).join("\n")
      : "(không có đạo cụ cố định nào được khai báo trước — bỏ qua propNames, luôn để rỗng)";
  return `Bạn là đạo diễn hình ảnh chuyển thể kịch bản (lịch sử/khám phá/tài liệu) thành storyboard video
hoạt hình (Veo3), mỗi cảnh dài 7-8 giây, phong cách ${STYLE_NAME.toUpperCase()} — KHÔNG photorealistic,
không mô tả kết cấu da/ánh sáng như ảnh chụp thật.
Danh sách nhân vật đã có sẵn Character reference trong Flow, đã được tạo THEO ĐÚNG phong cách
${STYLE_NAME} (KHÔNG cần mô tả lại ngoại hình cố định — Flow tự giữ khi nhân vật được @mention đính kèm):
${roster}

Danh sách bối cảnh/địa điểm cố định đã có sẵn Setting reference trong Flow (KHÔNG cần mô tả lại chi tiết
nội thất/bố cục — Flow tự giữ khi bối cảnh được @mention đính kèm):
${settingRoster}

Danh sách đạo cụ/vật dụng cố định đã có sẵn Prop reference trong Flow (KHÔNG cần mô tả lại hình dạng cố
định — Flow tự giữ khi đạo cụ được @mention đính kèm):
${propRoster}

Mỗi cảnh viết 1 phần tử JSON dạng:
{"videoPrompt": "...", "characterNames": ["..."], "settingNames": ["..."], "propNames": ["..."], "era": "period"}

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
- TÊN NHÂN VẬT NỔI TIẾNG (CẢ chính nhân vật LẪN người thân) — LỖI ĐÃ XÁC NHẬN TRỰC TIẾP: Flow từng từ chối
  tạo cảnh với lỗi "might violate our policies about generating prominent people" dù đã @mention đúng
  Character, xảy ra với CẢ 2 trường hợp: (1) chính nhân vật nổi tiếng dùng tên ĐẦY ĐỦ kèm họ (vd
  "Christopher Columbus" — đổi sang tên ngắn "Christopher", bỏ họ, thì hết bị chặn); (2) người thân của
  nhân vật nổi tiếng dùng tên lịch sử thật của họ (vd "Bartholomew Columbus" — đổi sang tên quan hệ sở
  hữu "Columbus's Brother" thì hết bị chặn). Nếu danh sách nhân vật ở trên đã dùng tên NGẮN (chỉ tên
  riêng, vd "Christopher") hoặc tên dạng quan hệ sở hữu (vd "Columbus's Brother") thay vì tên lịch sử
  đầy đủ — đây là CÓ CHỦ ĐÍCH, không phải lỗi đặt tên. LUÔN dùng ĐÚNG tên đã cho trong danh sách (kể cả
  dạng tên ngắn/quan hệ sở hữu) khi nhắc trong videoPrompt — TUYỆT ĐỐI không tự đổi lại/ghép thêm thành
  tên lịch sử đầy đủ của họ dù bạn biết tên đó, vì sẽ tái diễn lỗi bị chặn.

QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM (settingNames) — chỉ áp dụng nếu danh sách bối cảnh ở trên không rỗng:
- Nếu cảnh diễn ra ở ĐÚNG 1 địa điểm đã có trong danh sách bối cảnh (dù là toàn cảnh rộng hay cận cảnh 1
  nhân vật bên trong đó), điền tên bối cảnh đó vào settingNames — kể cả khi cảnh liền trước/liền sau CŨNG
  ở địa điểm này (vd toàn cảnh 1 căn phòng có nhiều người thảo luận, cảnh sau cắt cận 1 nhân vật đang nói
  — CẢ HAI cảnh đều phải ghi cùng 1 tên bối cảnh đó vào settingNames, để Flow giữ đúng cùng 1 không gian
  giữa 2 cú cắt thay vì tự vẽ lại phòng khác).
- Nếu cảnh không diễn ra ở địa điểm nào trong danh sách (địa điểm mới/chỉ xuất hiện 1 lần/ngoài trời
  không cố định), để settingNames RỖNG.
- KHÔNG tự đặt tên bối cảnh mới ngoài danh sách đã cho — settingNames chỉ được chứa tên khớp CHÍNH XÁC
  với danh sách bối cảnh ở trên.
- KHÔNG còn dùng "${STYLE_ANCHOR_NAME}" làm điểm neo phong cách nữa (quyết định của người dùng,
  2026-07-19, xem RUNBOOK mục 4.30) — MỌI cảnh (kể cả cảnh mồ côi hoàn toàn hoặc chỉ có Prop) chỉ dựa
  vào block style text (MOTION_SUFFIX, append bằng code vào cuối mọi videoPrompt) để giữ phong cách,
  KHÔNG cần @mention thêm bất kỳ Ingredient nào chỉ để neo style. (LỊCH SỬ: RUNBOOK mục 4.12/4.29 từng
  xác nhận trực tiếp 1 cảnh chỉ có Prop bị trôi phong cách thành ảnh thật dù đã có đủ MOTION_SUFFIX,
  và cơ chế Style Anchor từng được thêm để khắc phục — người dùng đã cân nhắc và chủ động chấp nhận đổi
  lại, ưu tiên đơn giản hoá pipeline hơn rủi ro trôi phong cách hiếm gặp ở cảnh Prop-only/mồ côi.)

QUY TẮC ÁNH SÁNG/THỜI ĐIỂM CỦA BỐI CẢNH (settingNames) — LỖI ĐÃ XÁC NHẬN TRỰC TIẾP (RUNBOOK mục 4.19,
Setting "Pinta Deck"): ảnh Setting reference trong Flow là 1 ảnh TĨNH DUY NHẤT, mang theo ĐÚNG 1 điều
kiện ánh sáng cố định (ban ngày HOẶC ban đêm) — mood/tông màu viết trong videoPrompt KHÔNG đủ mạnh để
ghi đè ánh sáng đã "khoá cứng" sẵn trong ảnh asset đó khi @mention. Vì vậy:
- Nếu 1 bối cảnh trong danh sách trên CHỈ dùng cho cảnh ở 1 điều kiện ánh sáng xuyên suốt câu chuyện (vd
  luôn là cảnh đêm), MỌI cảnh gán settingName đó PHẢI viết mood/tông màu khớp ĐÚNG điều kiện đó — TUYỆT
  ĐỐI không viết "bright daylight"/"sunny" cho 1 bối cảnh mà mọi cảnh khác dùng nó đều là "night"/"moonlit".
- Nếu câu chuyện thật sự cần dùng lại 1 địa điểm ở CẢ 2 điều kiện ánh sáng khác nhau, đó là dấu hiệu mô tả
  Setting (ngoài phạm vi file này, xem state/settings.json) không nên khoá cứng ánh sáng cụ thể vào
  description — nhưng bạn KHÔNG sửa được state/settings.json từ đây, chỉ cần đảm bảo videoPrompt không tự
  mâu thuẫn với ánh sáng đã dùng cho CÙNG settingName ở các cảnh khác đã thấy trong ngữ cảnh cung cấp.

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
3. MOTION_SUFFIX (luôn luôn, mọi cảnh) — đã gồm cả yêu cầu outline (OUTLINE_BLOCK) và là điểm neo
   phong cách DUY NHẤT (không còn dùng Style Anchor Ingredient, xem QUY TẮC BỐI CẢNH/ĐỊA ĐIỂM ở trên).`;
}

const NIGHT_LIGHTING_KEYWORDS = [
  "night",
  "moonlit",
  "moonlight",
  "midnight",
  "nighttime",
  "under the stars",
  "starry sky",
];
const DAY_LIGHTING_KEYWORDS = [
  "daylight",
  "bright sun",
  "sunny",
  "midday",
  "broad daylight",
  "daytime",
  "bright afternoon",
];

function detectLighting(text: string): "night" | "day" | null {
  const lower = text.toLowerCase();
  const isNight = NIGHT_LIGHTING_KEYWORDS.some((k) => lower.includes(k));
  const isDay = DAY_LIGHTING_KEYWORDS.some((k) => lower.includes(k));
  if (isNight && !isDay) return "night";
  if (isDay && !isNight) return "day";
  return null; // mơ hồ (dawn/dusk) hoặc không nhắc ánh sáng — không đủ tin cậy để so sánh
}

/**
 * XÁC NHẬN TRỰC TIẾP (RUNBOOK mục 4.19, bug Setting "Pinta Deck") — ảnh Setting reference trong
 * Flow là ảnh TĨNH DUY NHẤT, neo giữ ĐÚNG 1 điều kiện ánh sáng cố định; mood/tông màu viết trong
 * videoPrompt KHÔNG đủ mạnh để ghi đè khi @mention. Quét TOÀN BỘ prompt (viết tay hay máy) — nếu
 * 1 settingName được gán cho cả cảnh "night" LẪN cảnh "day" (theo từ khoá rõ ràng, bỏ qua mood
 * mơ hồ như dawn/dusk), in CẢNH BÁO ra console (KHÔNG throw — mismatch có thể là cố ý nếu mô tả
 * Setting không khoá cứng ánh sáng cụ thể) để người viết prompt/Setting kiểm tra TRƯỚC khi
 * generate video. Gọi trong `orchestrator.ts` ngay sau khi load `state/prompts.json`.
 */
export function warnInconsistentSettingLighting(prompts: VeoPrompt[]): void {
  const bySetting = new Map<string, { night: number[]; day: number[] }>();
  for (const p of prompts) {
    const lighting = detectLighting(p.videoPrompt);
    if (!lighting) continue;
    for (const name of p.settingNames ?? []) {
      // Style Anchor KHÔNG phải 1 địa điểm thật — theo thiết kế, nó được gắn @mention vào MỌI
      // cảnh mồ côi bất kể mood/ánh sáng, nên xung đột ngày/đêm với nó là chuyện BÌNH THƯỜNG,
      // không phải dấu hiệu lỗi — bỏ qua để tránh cảnh báo giả che lấp cảnh báo thật (Setting
      // là địa điểm thật trong truyện).
      if (name === STYLE_ANCHOR_NAME) continue;
      const entry = bySetting.get(name) ?? { night: [], day: [] };
      entry[lighting].push(p.index);
      bySetting.set(name, entry);
    }
  }
  for (const [name, { night, day }] of bySetting) {
    if (night.length > 0 && day.length > 0) {
      console.warn(
        `[prompt-writer] CẢNH BÁO: Setting "${name}" được gán cho cả cảnh ĐÊM (#${night.join(", #")}) ` +
          `lẫn cảnh NGÀY (#${day.join(", #")}) — ảnh Setting reference trong Flow chỉ neo được 1 điều ` +
          `kiện ánh sáng cố định (xem RUNBOOK mục 4.19, bug "Pinta Deck"). Nếu đây không phải cố ý, sửa ` +
          `mood/tông màu cho khớp 1 điều kiện xuyên suốt, hoặc kiểm tra mô tả "${name}" trong ` +
          `state/settings.json có đang khoá cứng 1 điều kiện ánh sáng cụ thể trước khi generate video.`
      );
    }
  }
}
