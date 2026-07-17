import { generateText } from "../llm/gemini.js";
import type { Scene } from "./scenes.js";
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
  STYLE_ANCHOR_MENTION_SENTENCE,
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
   * Quyết định có append PERIOD_ANCHOR hay không (xem writeVeoPrompts bên dưới).
   */
  era?: "period" | "modern";
  /**
   * Trạng thái tạo clip video cho cảnh này (xem assetStatus.ts) — cập nhật + lưu lại trong
   * veo3bot/generate.ts::generateClips. "success" = đã có clip file thật, bỏ qua khi resume.
   * "waiting" khi mới sinh prompt (chưa generate lần nào); "failed" nếu Flow từ chối/timeout.
   */
  status?: AssetStatus;
}

/** Gộp nhiều cảnh vào 1 lần gọi Gemini để tiết kiệm quota (free tier giới hạn rất thấp số request/ngày). */
const BATCH_SIZE = 10;

function buildSystemPrompt(
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

Bạn sẽ nhận nhiều cảnh cùng lúc, mỗi cảnh đánh số "Cảnh #N". Trả về JSON thuần dạng mảng, ĐÚNG THỨ TỰ,
ĐỦ SỐ PHẦN TỬ bằng số cảnh nhận được, mỗi phần tử ứng với 1 cảnh:
[{"videoPrompt": "...", "characterNames": ["..."], "settingNames": ["..."], "propNames": ["..."], "era": "period"}, ...]

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
- Nếu danh sách bối cảnh có tên "${STYLE_ANCHOR_NAME}" (asset đặc biệt chỉ để neo phong cách, KHÔNG phải
  địa điểm thật trong truyện — xem styleDNA.ts): CHỈ cân nhắc thêm vào settingNames cho cảnh có nhân vật
  KHÔNG tên riêng (vd "a young unnamed sailor") và KHÔNG có settingNames nào khác — đây là kiểu cảnh dễ
  trôi phong cách nhất. KHÔNG thêm "${STYLE_ANCHOR_NAME}" vào cảnh đã có nhân vật/bối cảnh/đạo cụ có tên
  riêng khác (đã có Ingredient neo rồi, không cần thêm).

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
- Với mọi cảnh còn lại, để era: "period" (hoặc bỏ trống) — hệ thống sẽ tự thêm neo thời đại đầy đủ, bạn
  chỉ cần đảm bảo mô tả trong videoPrompt không mâu thuẫn với thời đại (không tự ý thêm chi tiết hiện đại).

Giữ nhất quán bối cảnh/thời điểm xuyên suốt các cảnh (kể cả với ngữ cảnh cảnh trước cung cấp bên dưới,
nếu có) — không lặp lại y hệt bối cảnh/khoảng cách của cảnh liền trước, đổi cỡ cảnh TĨNH để tránh đơn
điệu (KHÔNG dùng chuyển động máy quay để tạo khác biệt — xem mục 1 ở trên).

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
Chỉ trả JSON, không giải thích thêm.`;
}

function parseBatchResponse(text: string): {
  videoPrompt: string;
  characterNames: string[];
  settingNames?: string[];
  propNames?: string[];
  era?: "period" | "modern";
}[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`Không parse được JSON mảng prompt từ LLM: ${text}`);
  return JSON.parse(jsonMatch[0]);
}

/**
 * Sinh prompt Veo3 cho từng cảnh theo từng lô (BATCH_SIZE cảnh/lần gọi Gemini) để tiết
 * kiệm quota, có truyền vài prompt trước làm ngữ cảnh giữ liên tục bối cảnh/thời điểm.
 * onBatchComplete (nếu có) được gọi sau mỗi lô để lưu tiến độ, tránh mất công nếu bị
 * gián đoạn giữa chừng (vd hết quota Gemini).
 */
export async function writeVeoPrompts(
  scenes: Scene[],
  characters: CharacterProfile[],
  settings: SettingProfile[],
  props: PropProfile[],
  onBatchComplete?: (resultsSoFar: VeoPrompt[]) => Promise<void> | void
): Promise<VeoPrompt[]> {
  const systemPrompt = buildSystemPrompt(characters, settings, props);
  const results: VeoPrompt[] = [];
  let recentPrompts: string[] = [];

  for (let i = 0; i < scenes.length; i += BATCH_SIZE) {
    const batch = scenes.slice(i, i + BATCH_SIZE);
    const context =
      recentPrompts.length > 0
        ? `Các prompt cảnh ngay trước đó (để giữ nhất quán bối cảnh):\n${recentPrompts.join("\n")}\n\n`
        : "";
        
    const sceneList = batch.map((s) => `Cảnh #${s.index}:\n"""${s.text}"""`).join("\n\n");
    const userPrompt = `${context}Viết prompt Veo3 cho ${batch.length} cảnh sau, trả về mảng JSON đúng thứ tự, đủ ${batch.length} phần tử:\n\n${sceneList}`;

    const text = await generateText(systemPrompt, userPrompt);
    const items = parseBatchResponse(text);

    for (let j = 0; j < batch.length; j++) {
      const scene = batch[j];
      const item = items[j];
      if (!item) throw new Error(`Thiếu kết quả cho cảnh #${scene.index} trong lô Gemini trả về.`);
      // Suffix giữ style + neo thời đại append bằng CODE (không dựa vào LLM tuân thủ) —
      // đảm bảo mọi prompt đều giữ đúng phong cách/thời đại/hạn chế lỗi Veo3 (styleDNA.ts).
      // PERIOD_ANCHOR CHỈ bỏ qua khi LLM chủ động đánh dấu era "modern" (cảnh cố ý hiện đại).
      const era = item.era ?? "period";
      const anchoredPrompt =
        era === "modern" ? item.videoPrompt : `${item.videoPrompt} ${PERIOD_ANCHOR}`;
      const settingNames = item.settingNames ?? [];
      // THỬ NGHIỆM LẦN 2 (xem styleDNA.ts): nếu cảnh có gắn Setting "Style Anchor", thêm câu
      // tường minh nhắc @mention NGAY TRONG TEXT — chỉ append khi thực sự có mặt trong
      // settingNames (tức là CÓ chip @mention thật đi kèm, không phải câu suông không neo).
      const styleAnchorSentence = settingNames.includes(STYLE_ANCHOR_NAME)
        ? ` ${STYLE_ANCHOR_MENTION_SENTENCE}`
        : "";
      results.push({
        index: scene.index,
        sceneText: scene.text,
        videoPrompt: `${anchoredPrompt}${styleAnchorSentence} ${MOTION_SUFFIX}`,
        characterNames: item.characterNames ?? [],
        settingNames,
        propNames: item.propNames ?? [],
        era,
        status: "waiting",
      });
      console.log(
        `[prompt-writer] cảnh #${scene.index} [${(item.characterNames ?? []).join(", ")}] → ${item.videoPrompt.slice(0, 80)}...`
      );
    }

    recentPrompts = results.slice(-3).map((r) => `#${r.index}: ${r.videoPrompt}`);
    if (onBatchComplete) await onBatchComplete(results);
  }

  return results;
}
