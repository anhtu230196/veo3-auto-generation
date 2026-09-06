import type { Page } from "playwright";
import path from "node:path";
import { debugCapture, debugLog } from "./debug.js";
import { dismissOnboardingDialog, dismissOverlays, PROJECT_READY_SELECTOR, ASSET_PICKER_SELECTOR } from "./project.js";

// XÁC NHẬN TRỰC TIẾP (2026-07-18): "Spanish Royal Banner" (Prop quốc kỳ/biểu tượng) vẫn CHƯA
// xong sau đủ 3 phút + reload-recheck cũ (chỉ chờ thêm 3 giây cố định) — throw oan dù người
// dùng tự kiểm tra thấy ảnh ĐÃ tạo xong trong Flow (chỉ chưa đổi tên, vì code throw trước khi
// chạy tới bước rename). Ảnh có nội dung biểu tượng/quốc kỳ có vẻ cần thời gian kiểm duyệt lâu
// hơn ảnh thường — tăng timeout chính lên 5 phút, và quan trọng hơn: đổi cơ chế reload-recheck
// từ "chờ cố định 3 giây rồi chốt" sang "chờ trang thật sự sẵn sàng (Add Media hiện ra, giống
// mục 4.14) rồi POLL thêm 1 khoảng đủ dài" — 3 giây là quá ngắn để trang tải lại lưới media đã
// tích luỹ nhiều (168 cảnh + nhiều Character/Setting/Prop khác) trước khi kết luận lỗi thật.
const GENERATE_TIMEOUT_MS = 2 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;
const RELOAD_RECHECK_TIMEOUT_MS = 90 * 1000;

/** Chờ lưới media render xong trước khi chụp baseline — xem `snapshotGridSrcs`. */
const GRID_RENDER_TIMEOUT_MS = 30 * 1000;

/**
 * Flow TỪ CHỐI tạo ảnh (hết quota / bị bóp tốc độ) — khác hẳn "ảnh chưa xong".
 * `quotaExhausted` = true thì chạy tiếp các asset sau là vô nghĩa, runner phải DỪNG CẢ MẺ.
 */
export class GenerationRejectedError extends Error {
  readonly quotaExhausted: boolean;
  constructor(message: string, quotaExhausted: boolean) {
    super(message);
    this.name = "GenerationRejectedError";
    this.quotaExhausted = quotaExhausted;
  }
}

const QUOTA_TEXT_RE = /reached your usage limit/i;
const REJECTED_TEXT_RE = /(not been charged for this generation|noticed some unusual activity)/i;

/**
 * Đọc card lỗi Flow dựng ngay trong lưới media ("Failed / You've reached your usage limit…").
 *
 * 🔴 PHẢI ĐỌC TRƯỚC KHI RELOAD: reload xoá sạch card, nên nhánh timeout cũ chụp debug sau
 * reload chỉ thấy một trang sạch bong và kết luận nhầm thành "lỗi selector" (mất cả buổi
 * 2026-09-06 vì đúng chuyện này).
 */
async function findGenerationFailure(page: Page): Promise<{ quota: boolean; text: string } | undefined> {
  const body = await page
    .locator("body")
    .innerText()
    .catch(() => "");
  const line = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => QUOTA_TEXT_RE.test(l) || REJECTED_TEXT_RE.test(l));
  if (!line) return undefined;
  // Cụm "usage limit" và cụm "not been charged" nằm ở HAI dòng khác nhau của cùng một card,
  // nên phải xét cờ quota trên toàn bộ text chứ không chỉ trên dòng khớp đầu tiên.
  return { quota: QUOTA_TEXT_RE.test(body), text: line };
}

/**
 * Toàn bộ `src` ảnh đang render trong lưới media.
 *
 * 🔴 ĐỔI 2026-09-05: giao diện mới KHÔNG còn thẻ <a aria-label="Generated image">. Mỗi ảnh giờ
 * là: flow-grid-tile-container[aria-label=...] > flow-tile-container > flow-image-tile > img.image
 */
async function allImageSrcs(page: Page): Promise<string[]> {
  return page
    .locator("flow-image-tile img")
    .evaluateAll((els) => els.map((e) => e.getAttribute("src")).filter((s): s is string => !!s));
}

/**
 * 🔴🔴 BẰNG CHỨNG "ĐÃ CÓ ẢNH MỚI" — ĐỌC HẾT TRƯỚC KHI ĐỤNG VÀO. Sai ở đây thì HỎNG DỮ LIỆU,
 * không phải chỉ chạy lỗi.
 *
 * Lịch sử 3 đời, mỗi đời sửa cái trước:
 *
 * 1. **Đếm số phần tử, chờ tăng.** Hỏng vì lưới ảo hoá (`react-virtuoso`) chỉ render một số
 *    lượng CỐ ĐỊNH: thêm 1 ảnh ở đầu thì 1 ảnh cũ bị đẩy khỏi vùng render, số đếm KHÔNG BAO GIỜ
 *    tăng khi project đã nhiều media. Hậu quả: báo timeout oan → lần sau tạo THÊM bản trùng.
 * 2. **So `src` ở VỊ TRÍ 0 với lúc trước khi bấm Create.** Hỏng nặng hơn nhiều, và đây là bug
 *    đã HỎNG DỮ LIỆU THẬT ngày 2026-09-06: vị trí 0 đổi vì RẤT NHIỀU lý do không phải "có ảnh
 *    mới" — card "Failed" chen vào rồi biến mất sau reload, lưới render lại khác đi, hoặc
 *    baseline đọc phải lúc lưới CHƯA render (trả `undefined`, rồi mọi ảnh cũ hiện ra sau đó đều
 *    khác `undefined` nên bị coi là mới). Lúc đó `newImageSrc` trỏ vào một ẢNH CŨ, và bước
 *    rename ĐẶT TÊN ĐÈ LÊN NÓ. Thực tế: hết quota nên không ảnh nào được tạo, nhưng runner vẫn
 *    lần lượt đổi tên các asset cũ thành `Carved Fence Post`, `Roanoke Shore Daytime`… và đánh
 *    dấu `success`. Người dùng phát hiện vì thấy ảnh ông đội mũ nồi mang tên cột gỗ.
 * 3. **(hiện tại) So TẬP HỢP src.** Ảnh mới = `src` CHƯA TỪNG thấy trước khi bấm Create. Chiều
 *    so sánh này miễn nhiễm với ảo hoá: ảnh bị đẩy khỏi vùng render là MẤT khỏi tập, không phải
 *    THÊM vào, nên không bao giờ bị nhận nhầm là mới.
 *
 * Điều kiện tiên quyết: baseline phải chụp khi lưới ĐÃ render. Vì thế `snapshotGridSrcs` chờ
 * tới khi có ít nhất 1 ảnh (project mới tinh thì hết `GRID_RENDER_TIMEOUT_MS` mới trả tập rỗng
 * — chậm 30s đúng 1 lần cho asset đầu tiên, đổi lại là không bao giờ rename đè).
 */
async function snapshotGridSrcs(page: Page): Promise<Set<string>> {
  const deadline = Date.now() + GRID_RENDER_TIMEOUT_MS;
  let srcs = await allImageSrcs(page);
  while (srcs.length === 0 && Date.now() < deadline) {
    await page.waitForTimeout(1000);
    srcs = await allImageSrcs(page);
  }
  return new Set(srcs);
}

/** `src` đầu tiên chưa có trong `baseline` — tức ảnh vừa được tạo. */
async function findNewImageSrc(page: Page, baseline: ReadonlySet<string>): Promise<string | undefined> {
  for (const src of await allImageSrcs(page)) if (!baseline.has(src)) return src;
  return undefined;
}

/**
 * Tạo 1 ảnh Ingredient dùng chung cho Setting/Prop (bối cảnh/đạo cụ) — luồng "Image mode, số
 * lượng 1" ngay trên canvas chính, rồi đổi tên (right-click → Rename) để tìm lại được qua
 * @mention. XÁC NHẬN TRỰC TIẾP bằng codegen thật do người dùng cung cấp (2026-07-16) — khác
 * hẳn với Character (dùng menu "Add Media" → "Create Character", ra asset type "Character").
 * Luồng này ra asset type "Image" thường, KHÔNG PHẢI "Character"/"Scene" — nhưng vẫn @mention
 * được bình thường sau khi đổi tên (đã xác nhận trực tiếp bởi người dùng: gõ "@", tìm theo
 * tên, chọn kết quả khớp).
 *
 * `styleBlock` do NGƯỜI GỌI truyền vào (settings.ts dùng SETTING_SHEET_STYLE_BLOCK, props.ts
 * dùng CHARACTER_SHEET_STYLE_BLOCK) — KHÔNG hard-code trong hàm này. Xác nhận trực tiếp
 * (2026-07-17): dùng chung 1 style block cho cả Setting lẫn Prop ra kết quả SAI cho Setting
 * (nền xanh + tự chèn người vào ảnh bối cảnh).
 */
/**
 * Đính 1 ảnh reference vào prompt hiện tại (image-to-image) — BẮT BUỘC cho luồng Character
 * của Nano Banana, nơi `reference-character.jpeg` là thứ neo toàn bộ phong cách nhân vật
 * (xem `src/nanoBanana/styleDNA.ts::MASTER_REFERENCE_NOTE`).
 *
 * Đường đi đã khảo sát trực tiếp trên UI thật (2026-08-02, RUNBOOK 8.1):
 *   nút `+` trong THANH PROMPT (accessible name "add_2 Create" — KHÔNG phải nút
 *   "add Add Media" ở sidebar) → bảng chọn media → **CLICK VÀO CARD LÀ ĐÍNH XONG LUÔN**.
 *
 * ⚠️ BẪY ĐÃ DÍNH: bảng có nút "Add to Prompt" ở góc dưới phải, rất dễ tưởng đó là bước
 * xác nhận bắt buộc. THỰC TẾ (xác nhận bằng scripts/inspect-picker.ts): ngay khi click vào
 * card (`[role="option"]`), Flow đính ảnh vào prompt và ĐÓNG LUÔN bảng — nút "Add to
 * Prompt" BIẾN MẤT. Code bản đầu click card rồi mới đi tìm "Add to Prompt" nên timeout 15s
 * dù thao tác đã thành công. Vẫn giữ nhánh bấm nút đó làm dự phòng, phòng biến thể UI khác.
 *
 * Tối ưu: TRA THEO TÊN FILE TRƯỚC khi upload. Ảnh reference dùng lại cho MỌI nhân vật, nên
 * từ nhân vật thứ 2 trở đi nó đã nằm sẵn trong Uploads của project — upload lại mỗi lần sẽ
 * đẻ ra hàng loạt bản trùng (đúng lớp lỗi đã gặp ở mục 4.15/4.45).
 */
export async function attachReferenceImage(page: Page, referenceImagePath: string): Promise<void> {
  const fileName = path.basename(referenceImagePath);

  await dismissOverlays(page);
  await page.locator(ASSET_PICKER_SELECTOR).first().click({ timeout: 15000 });
  await page.waitForTimeout(1500);

  // 🔴 PHẢI GIỚI HẠN TRONG OVERLAY (2026-09-05). Bản cũ dùng `text=<tên file>` trên TOÀN TRANG,
  // và nó khớp nhầm cái thẻ ở LƯỚI MEDIA NỀN phía sau bảng chọn — thẻ đó bị overlay che nên
  // click treo 20-30 giây rồi lỗi, trong khi thẻ ĐÚNG nằm trong bảng thì không ai đụng tới.
  // Triệu chứng đánh lừa hoàn toàn: log ghi "đã có sẵn trong project — dùng lại" (đúng), rồi
  // chết ở bước click (sai chỗ).
  const OVERLAY = ".cdk-overlay-container";
  // Phải GÕ TÊN vào ô Search thì thẻ mới hiện trong bảng — bảng không tự liệt kê hết asset.
  const search = page.getByRole("textbox", { name: /search assets/i }).first();
  await search.waitFor({ state: "visible", timeout: 20000 });
  await search.fill(path.parse(fileName).name);
  await page.waitForTimeout(2500);

  // Thẻ asset trong bảng là `button[role="option"]` (class `asset-item`) — giao diện cũ là
  // `div[role="option"]`, nên selector cũ khớp 0 phần tử.
  const card = page.locator(`${OVERLAY} [role="option"]`).filter({ hasText: fileName }).first();
  if (await card.count()) {
    debugLog("reference", `"${fileName}" đã có sẵn trong project — dùng lại, không upload nữa`);
  } else {
    debugLog("reference", `chưa có "${fileName}" trong project — đang upload`);
    // 🔴 ĐỔI 2026-09-05: giao diện mới KHÔNG còn `input[type="file"]` nằm sẵn trong DOM —
    // nút "Upload media" mở hộp thoại chọn file của HỆ ĐIỀU HÀNH. `setInputFiles` vì thế
    // treo đúng 30 giây rồi ném lỗi. Cách đúng là bắt sự kiện `filechooser` của Playwright,
    // và PHẢI đăng ký lắng nghe TRƯỚC khi bấm nút, nếu không sự kiện bắn mất trước khi chờ.
    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser", { timeout: 30000 }),
      page.getByRole("button", { name: /upload media/i }).first().click({ timeout: 15000 }),
    ]);
    await chooser.setFiles(referenceImagePath);
    // Sau khi upload, phải gõ lại vào ô Search thì thẻ mới hiện ra trong bảng.
    await page.waitForTimeout(4000);
    await search.fill("");
    await page.waitForTimeout(600);
    await search.fill(path.parse(fileName).name);
    await card.waitFor({ state: "visible", timeout: 90000 });
    await page.waitForTimeout(2000); // chờ Flow xử lý xong file vừa nạp
  }

  // 🔴 ĐỔI 2026-09-05: giao diện mới bọc tên file trong `<span class="footer-title">` — bản thân
  // span đó KHÔNG bấm được (Playwright resolve ra nó rồi treo ở "waiting for element to be
  // stable"). Phải leo lên phần tử cha thật sự nhận click. Giữ span làm phương án cuối để không
  // vỡ nếu Google đổi lại cấu trúc.
  await card.scrollIntoViewIfNeeded().catch(() => {});
  const clickableCard = card
    .locator('xpath=ancestor-or-self::*[@role="option" or @role="button" or self::button or self::a][1]')
    .first();
  if (await clickableCard.count()) {
    await clickableCard.click({ timeout: 20000 });
  } else {
    await card.click({ timeout: 20000 });
  }
  await page.waitForTimeout(1500);

  // Dự phòng: nếu biến thể UI nào đó VẪN còn nút "Add to Prompt" sau khi chọn card thì bấm.
  const addToPrompt = page.getByRole("button", { name: /add to prompt/i }).first();
  if (await addToPrompt.count()) {
    await addToPrompt.click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }

  // XÁC MINH THẬT SỰ ĐÃ ĐÍNH — cùng tinh thần mục 4.1 (đếm chip @mention): nếu ảnh reference
  // không đính được mà vẫn chạy tiếp, Nano Banana sẽ vẽ nhân vật KHÔNG theo phong cách gốc,
  // và ta chỉ phát hiện khi soi ảnh bằng mắt (tốn credit + rất dễ lọt).
  // Tín hiệu dùng: nút "Clear prompt" chỉ xuất hiện khi prompt CÓ nội dung. Vì hàm này LUÔN
  // chạy TRƯỚC bước gõ chữ, lúc này prompt chưa có text — nên nút đó xuất hiện đồng nghĩa
  // với "đã có ảnh đính vào".
  const clearPrompt = page.getByRole("button", { name: /clear prompt/i }).first();
  await clearPrompt.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  if (!(await clearPrompt.count())) {
    await debugCapture(page, `reference-attach-failed-${fileName}`);
    throw new Error(
      `Đính ảnh reference "${fileName}" thất bại — không thấy dấu hiệu prompt có nội dung ` +
        `sau khi chọn card. Kiểm tra ảnh debug.`
    );
  }
  debugLog("reference", `đã đính "${fileName}" vào prompt`);
}

/**
 * Đính 1 hoặc NHIỀU asset ĐÃ CÓ SẴN trong Flow vào prompt, tra theo TÊN (khác
 * `attachReferenceImage` vốn upload 1 file từ đĩa lên).
 *
 * Dùng khi cần ghép nhiều asset đã tạo vào 1 ảnh mới — ví dụ cho nhân vật đã có mặc bộ đồ
 * đã có: đính cả "Tailor Inventor" lẫn "Parachute Suit" rồi mô tả tư thế mong muốn.
 *
 * ⚠️ PHẢI MỞ LẠI BẢNG CHỌN CHO TỪNG ASSET: click vào 1 card là Flow đính xong và ĐÓNG LUÔN
 * bảng (xem docstring `attachReferenceImage`) — không chọn được nhiều card trong 1 lần mở.
 *
 * ⚠️ Ô "Search assets" là BẮT BUỘC khi project đã nhiều media: lưới media dùng virtualized
 * list (mục 4.25/4.33/4.45), asset cần tìm có thể chưa được render nếu chỉ cuộn/tìm mù.
 */
export async function attachExistingAssets(page: Page, names: string[]): Promise<void> {
  for (const assetName of names) {
    // Mở bảng chọn media. ⚠️ Bản cũ chỉ mở 1 lần rồi `if (await search.count())` — nếu bảng
    // KHÔNG mở được thì nó lặng lẽ bỏ qua bước gõ tìm, rồi đi tìm card trong 1 bảng đang
    // ĐÓNG và báo "không tìm thấy asset". Chẩn đoán sai hoàn toàn: asset vẫn nằm đó, chỉ là
    // bảng chưa mở. Xác nhận 2026-08-11 với "Bob Bathroom V2" ở lần đính THỨ BA của 1 cảnh
    // (2 lần đính trước cùng mẻ đều ổn), trong khi tra tay thấy asset hiện ra ngay lập tức.
    let panelOpened = false;
    for (let attempt = 1; attempt <= 3 && !panelOpened; attempt++) {
      await dismissOverlays(page);
      await page
        .locator(ASSET_PICKER_SELECTOR)
        .first()
        .click({ timeout: 15000 })
        .catch(() => {});
      await page.waitForTimeout(1200);
      panelOpened = (await page.getByRole("textbox", { name: /search assets/i }).first().count()) > 0;
      if (!panelOpened) {
        debugLog("reference", `bảng chọn media chưa mở (lượt ${attempt}) — thử lại`);
        await page.waitForTimeout(1500);
      }
    }
    if (!panelOpened) {
      await debugCapture(page, `attach-panel-never-opened-${assetName}`);
      throw new Error(
        `Không MỞ được bảng chọn media để đính "${assetName}" (thử 3 lượt) — đây là lỗi UI, ` +
          `KHÔNG phải asset thiếu. Đừng tạo lại asset, chạy lại lệnh là được.`
      );
    }

    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    await search.fill(assetName);

    // 🔴 PHẢI KHỚP TÊN CHÍNH XÁC, KHÔNG dùng `hasText` (bug nặng, sửa 2026-08-11).
    // `hasText` khớp CHUỖI CON, nên tìm "Bob" khớp luôn "Bob Bathroom V2" / "Bob Kitchen" /
    // "Bob Living Room" / "Bob's Wife"..., rồi `.first()` lấy card ĐẦU DANH SÁCH — mà Flow sắp
    // theo "Recent" nên đó thường là asset MỚI NHẤT, không phải cái mình muốn.
    // Hậu quả ÂM THẦM: cảnh vẫn tạo ra bình thường nhưng ĐÍNH SAI ẢNH, chỉ lộ khi soi bằng mắt.
    // Phát hiện được nhờ ảnh debug: đính "Bob" xong thì thanh prompt hiện thumbnail phòng tắm,
    // và tới lượt "Bob Bathroom V2" thật thì Flow báo "No results found" vì nó đã bị đính rồi.
    const cards = page.locator('[role="option"]');
    const want = assetName.trim().toLowerCase();
    let target: ReturnType<typeof cards.nth> | null = null;
    let seen: string[] = [];

    for (let i = 0; i < 12 && !target; i++) {
      await page.waitForTimeout(800);
      const n = await cards.count();
      seen = [];
      for (let k = 0; k < n; k++) {
        const raw = (await cards.nth(k).innerText().catch(() => "")).replace(/\s+/g, " ").trim();
        // Card hiển thị dạng "<Tên> Image" / "<Tên> Video" — bỏ hậu tố loại media rồi so khớp.
        const label = raw.replace(/\s+(Image|Video|Voice|Character|Avatar)$/i, "").trim();
        seen.push(label);
        if (label.toLowerCase() === want) {
          target = cards.nth(k);
          break;
        }
      }
    }

    if (!target) {
      await debugCapture(page, `attach-asset-not-found-${assetName}`);
      throw new Error(
        `Không tìm thấy asset tên CHÍNH XÁC "${assetName}" trong bảng chọn media sau 12 giây. ` +
          `Các card đang hiện: ${seen.length ? seen.map((s) => `"${s}"`).join(", ") : "(không có)"}. ` +
          `Nếu asset có thật, tra tay bằng: npx tsx scripts/check-asset-in-picker.ts "${assetName}".`
      );
    }
    await target.click();

    // Bảng ĐÓNG LẠI = đã đính (RUNBOOK 8.1.3d BẪY 1: click card là xong, "Add to Prompt" chỉ
    // là nút dự phòng). Phải POLL chứ không chờ cứng 1500ms — cùng lớp lỗi với ô search: bảng
    // càng nhiều media càng đóng chậm, chốt sớm sẽ báo "click không ăn" cho thao tác đã thành công.
    let closed = false;
    for (let i = 0; i < 10 && !closed; i++) {
      await page.waitForTimeout(800);
      closed = (await page.locator('[role="option"]').first().count()) === 0;
    }
    if (!closed) {
      // Nhánh dự phòng: một số lần click card không tự đóng, phải bấm nút xác nhận.
      const addBtn = page.getByRole("button", { name: /add to prompt/i }).first();
      if (await addBtn.count()) {
        await addBtn.click().catch(() => {});
        for (let i = 0; i < 6 && !closed; i++) {
          await page.waitForTimeout(800);
          closed = (await page.locator('[role="option"]').first().count()) === 0;
        }
      }
    }
    if (!closed) {
      await debugCapture(page, `attach-asset-panel-still-open-${assetName}`);
      throw new Error(`Đính asset "${assetName}" thất bại — bảng chọn media vẫn mở sau 8 giây.`);
    }
    debugLog("reference", `đã đính asset "${assetName}"`);
  }
}

/**
 * XÁC MINH asset đã thật sự mang tên `name` — tra đúng bằng cơ chế mà `attachExistingAssets`
 * sẽ dùng sau này (ô "Search assets" trong bảng chọn media), nên "tra được ở đây" đồng nghĩa
 * "đính được ở cảnh ghép sau".
 *
 * VÌ SAO CẦN (sự cố thật 2026-08-11): bước rename KHÔNG có kiểm chứng nào — right-click →
 * Rename → gõ tên → Done → chuyển trang. Nếu 1 thao tác im lặng không ăn (Done bấm trước khi
 * ô nhập commit, menu mở nhầm...), hàm vẫn trả về BÌNH THƯỜNG, runner ghi `status: "success"`
 * cho 1 asset không tồn tại dưới tên đó. Đã xảy ra với "Don Decker Prison": ảnh tạo xong,
 * status "success", nhưng trong Flow là ảnh vô danh — và chỉ lộ ra rất muộn, khi 5 cảnh ghép
 * phụ thuộc nó đồng loạt fail giữa mẻ.
 *
 * Ném lỗi ở ĐÂY thì runner đánh dấu asset đó `failed` và lần chạy sau tự tạo lại — thay vì
 * để dữ liệu sai nằm im chờ phá 1 mẻ cảnh ghép về sau.
 */
/**
 * Tra bảng chọn media xem đã có asset tên `name` chưa. Trả `undefined` khi KHÔNG MỞ ĐƯỢC bảng
 * chọn — "không biết" khác hẳn "không có", và người gọi phải phân biệt hai cái đó.
 */
async function lookupAssetByName(
  page: Page,
  name: string,
  attempts: number,
  projectUrl: string
): Promise<boolean | undefined> {
  let sawSearchBox = false;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    await dismissOverlays(page);
    await page
      .locator(ASSET_PICKER_SELECTOR)
      .first()
      .click({ timeout: 20000 })
      .catch(() => {});
    await page.waitForTimeout(1500);

    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    if (await search.count()) {
      sawSearchBox = true;
      await search.fill(name);
      for (let i = 0; i < 8; i++) {
        await page.waitForTimeout(1000);
        if (await page.locator('[role="option"]', { hasText: name }).first().count()) {
          // Về lại project để đóng bảng chọn — Escape không đáng tin với dialog Flow (mục 8.1.4).
          await backToProject(page, projectUrl);
          return true;
        }
      }
    }
    await backToProject(page, projectUrl);
  }

  return sawSearchBox ? false : undefined;
}

/**
 * 🔴 CHỐNG TẠO TRÙNG (2026-09-06). Bất cứ lỗi nào NGAY SAU khi ảnh đã sinh ra — rename hỏng,
 * `assertAssetNamed` báo nhầm, mẻ bị kill giữa chừng — đều để lại asset ở `status: "failed"`
 * dù ẢNH ĐÃ CÓ THẬT trong Flow. Lần chạy sau runner thấy `failed` là tạo lại từ đầu, và đốt
 * thêm một lượt quota cho một ảnh y hệt.
 *
 * Thực tế đo được: project Roanoke có **5 ảnh Governor John White** gần như giống hệt, chỉ 1
 * cái mang tên. Bốn cái kia là bốn lần chạy lại.
 *
 * Vì vậy: tra tên TRƯỚC khi tạo. Có rồi thì bỏ qua hẳn, coi như thành công.
 * ⚠️ Chỉ bỏ qua khi tra được CHẮC CHẮN là "có". Không mở được bảng chọn (`undefined`) thì vẫn
 * tạo — thà trùng còn hơn bỏ sót im lặng.
 * ⚠️ Khớp theo CHUỖI CON (giống `assertAssetNamed`), nên tên này là tiền tố của tên kia sẽ
 * khớp nhầm và bỏ qua oan. Đó chính là lý do skill mục 9b cấm đặt tên kiểu tiền tố.
 */
async function assetAlreadyExists(page: Page, name: string, projectUrl: string): Promise<boolean> {
  return (await lookupAssetByName(page, name, 1, projectUrl)) === true;
}

async function assertAssetNamed(page: Page, name: string): Promise<void> {
  const projectUrl = projectUrlOf(page);

  // ⚠️ PHẢI POLL, KHÔNG tra 1 phát rồi kết luận. Bản đầu của hàm này chỉ chờ cố định 2 giây
  // sau khi gõ vào ô search rồi chốt — và đã BÁO NHẦM cho "Bob Bathroom V2" (asset tồn tại
  // thật, rename ăn bình thường, nhưng lưới asset nạp bất đồng bộ nên chưa kịp hiện). Báo
  // nhầm còn tai hại hơn im lặng: runner đánh `failed`, lần sau tạo lại → sinh ảnh TRÙNG.
  const ATTEMPTS = 2;
  const found = await lookupAssetByName(page, name, ATTEMPTS, projectUrl);
  if (found === true) return;
  const sawSearchBox = found === false;

  throw new Error(
    sawSearchBox
      ? `Đã tạo ảnh cho "${name}" nhưng ĐỔI TÊN KHÔNG ĂN — tra bảng chọn media ${ATTEMPTS} lượt ` +
        `vẫn không thấy. Trong Flow đang có 1 ảnh vô danh đúng nội dung này (vô hại, xoá tay ` +
        `được); đặt lại status "waiting" để tạo bản mới.`
      : `Không mở được bảng chọn media để xác minh tên "${name}" — KHÔNG kết luận được là ` +
        `rename hỏng hay chỉ là trang lỗi. Tra tay bằng: npx tsx scripts/check-asset-in-picker.ts "${name}" ` +
        `rồi sửa status cho đúng, ĐỪNG chạy lại mù (sẽ tạo ảnh trùng).`
  );
}

async function backToProject(page: Page, projectUrl: string): Promise<void> {
  await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await dismissOnboardingDialog(page);
  await page.locator(PROJECT_READY_SELECTOR).waitFor({ state: "visible", timeout: 90000 });
}

/** URL project hiện tại — dùng để quay lại sau khi mở bảng chọn media. */
function projectUrlOf(page: Page): string {
  return page.url().split("?")[0];
}

export async function createImageIngredient(
  page: Page,
  name: string,
  description: string,
  styleBlock: string,
  projectUrl: string,
  /**
   * Reference cho image-to-image. Bỏ trống = tạo từ prompt CHỮ thuần (đúng cho Prop/Setting/
   * động vật — xem ghi chú trong styleDNA.ts: KHÔNG đính ảnh nhân vật vào prop/động vật, rủi
   * ro model kéo tỉ lệ người vào vật thể).
   *
   * - `string` = đường dẫn file trên đĩa (image-to-image, upload qua `attachReferenceImage`) —
   *   dùng cho Character (luôn đính `reference-character.jpeg`).
   * - `string[]` = tên các asset ĐÃ CÓ SẴN trong Flow (đính qua `attachExistingAssets`) — dùng
   *   để ghép nhiều asset đã tạo (Character + Background, hoặc chỉ 1 cảnh đã ghép sẵn để sửa
   *   chi tiết nhỏ) thành 1 ảnh mới, thay cho việc viết riêng 1 file .ts cho mỗi cảnh ghép (xem
   *   `src/nanoBanana/createSceneComposites.ts` — RUNBOOK mục 8.2).
   */
  reference?: string | string[]
): Promise<void> {
  // 🔴 CHỐNG TẠO TRÙNG — xem docstring assetAlreadyExists. Phải đứng TRƯỚC mọi thao tác tạo:
  // asset `failed` trong JSON không có nghĩa là Flow chưa có ảnh của nó.
  if (await assetAlreadyExists(page, name, projectUrl)) {
    console.log(`[imageAsset] "${name}" ĐÃ có sẵn trong Flow — bỏ qua, không tạo lại.`);
    return;
  }

  // Pill hiển thị mode/tỷ lệ khung hình hiện tại — cùng selector đã xác nhận trong
  // generate.ts::ensureModelAndDuration (icon "crop_16_9" luôn xuất hiện, duy nhất TRƯỚC khi
  // bảng cài đặt mở ra). Có fallback reload nếu trang đang ở trạng thái lag/kẹt.
  const pill = page.locator('button:has-text("crop_16_9")').first();
  // 🔴 BẮT BUỘC dọn overlay trước (2026-09-05): giao diện Angular Material để lại
  // `cdk-overlay-backdrop` TRONG SUỐT sau mỗi lần mở bảng chọn asset ở asset TRƯỚC ĐÓ. Nó nuốt
  // click nên pill "không phản hồi" dù selector đúng — và nhánh reload bên dưới che mất triệu
  // chứng thật, khiến rất dễ chẩn đoán nhầm thành "trang lag".
  await dismissOverlays(page);
  try {
    await pill.click({ timeout: 15000 });
  } catch {
    console.log("[imageAsset] pill cài đặt không phản hồi, reload trang và thử lại...");
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19, xem generate.ts cùng bug) —
    // reload xoá mất trạng thái lỗi thật trước khi kịp chụp nếu chụp SAU.
    await debugCapture(page, `pre-reload-pill-stuck-${name}`);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Modal onboarding hiện lại sau reload và chặn mọi click (RUNBOOK 8.1).
    await dismissOnboardingDialog(page);
    await page.locator(PROJECT_READY_SELECTOR).waitFor({ state: "visible", timeout: 90000 });
    await pill.click({ timeout: 15000 });
  }
  await page.waitForTimeout(500);

  // Chuyển sang tab Image, số lượng 1.
  // ⚠️ UI ĐÃ ĐỔI TÊN TAB SỐ LƯỢNG (xác nhận trực tiếp 2026-08-02 qua
  // scripts/inspect-flow-image-ui.ts): danh sách tab thật hiện là
  //   image Image · videocam Video · crop_free Frames · chrome_extension Ingredients
  //   crop_9_16 9:16 · crop_16_9 16:9 · 4s · 6s · 8s · 10s · x1 · x2 · x3 · x4
  // Tức là tab số lượng tên **"x1"**, KHÔNG phải "1x" như codegen cũ ghi (và như RUNBOOK
  // 4.10 vẫn chép lại). Tên cũ làm click timeout 30s ngay lần chạy đầu.
  // Chấp nhận CẢ HAI tên để không vỡ nếu Google đổi lại — regex khớp cả "x1" lẫn "1x".
  await page.getByRole("radio", { name: "Image", exact: true }).click({ timeout: 20000 });
  await page.getByRole("radio", { name: "x1" }).click({ timeout: 15000 });

  // THIẾU SÓT ĐÃ SỬA: quên đóng bảng cài đặt (Radix popper) sau khi chọn xong — bảng còn mở
  // che mất ô nhập prompt bên dưới, khiến click bị chặn (pointer-events intercepted), giống
  // hệt cách ensureModelAndDuration trong generate.ts đã xử lý bằng "Escape".
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // Điền prompt — gõ bằng keyboard.type (không dùng .fill() trên contenteditable, đã xác
  // nhận .fill() gây đảo thứ tự text ở generate.ts::fillPromptWithMentions).
  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  // THỨ TỰ QUAN TRỌNG — đính ảnh SAU khi đã xoá sạch ô prompt, TRƯỚC khi gõ chữ:
  // - Đính TRƯỚC bước xoá: `Ctrl+A` + `Backspace` có nguy cơ xoá luôn ảnh vừa đính (ảnh là
  //   một phần nội dung prompt — chính vì thế nút "Clear prompt" mới hiện ra khi đính xong).
  // - Đính SAU khi gõ chữ: mở/đóng bảng chọn media có nguy cơ làm rớt text đã gõ, đúng lớp
  //   bug 4.42/4.49 (chèn chip @mention sau khi gõ làm mất câu).
  // Kẹp vào giữa là vị trí duy nhất an toàn cho cả hai phía.
  if (reference) {
    if (Array.isArray(reference)) {
      await attachExistingAssets(page, reference);
    } else {
      await attachReferenceImage(page, reference);
    }
    // Bảng chọn media lấy mất focus — phải click lại vào ô prompt trước khi gõ.
    await promptBox.click();
    await page.waitForTimeout(300);
  }

  await page.keyboard.type(`${name}: ${description}. ${styleBlock}`);

  // Baseline = TẬP HỢP src đang render, chụp khi lưới đã render xong (xem docstring
  // snapshotGridSrcs — so vị trí 0 như bản cũ đã gây đổi tên đè lên ảnh cũ).
  const baselineSrcs = await snapshotGridSrcs(page);
  debugLog("baseline", `ingredient "${name}": ${baselineSrcs.size} ảnh đang render trước khi tạo`);
  // Card lỗi của asset TRƯỚC có thể còn nằm đó — ghi lại để chỉ phản ứng với lỗi MỚI.
  const failureBefore = await findGenerationFailure(page);

  await page.locator('button:has-text("arrow_forward")').last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let newImageSrc: string | undefined;
  while (Date.now() < deadline) {
    newImageSrc = await findNewImageSrc(page, baselineSrcs);
    if (newImageSrc) break;
    // Bắt lỗi NGAY trong lúc poll: hết quota thì chờ đủ 2 phút rồi reload là vô ích, mà còn
    // xoá mất card lỗi — đúng cách bản cũ đã chẩn đoán nhầm thành lỗi selector.
    const failure = await findGenerationFailure(page);
    if (failure && (failure.quota || failure.text !== failureBefore?.text)) {
      await debugCapture(page, `generation-rejected-${name}`);
      throw new GenerationRejectedError(`Flow từ chối tạo ảnh cho "${name}": ${failure.text}`, failure.quota);
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!newImageSrc) {
    // XÁC NHẬN TRỰC TIẾP (2026-07-17): cùng lỗi đã gặp với video trong generate.ts — ảnh THẬT
    // RA đã tạo xong (thấy rõ trong media grid, đúng nền xanh + đúng prompt) nhưng bot không
    // phát hiện kịp trong lúc poll trực tiếp. Trước khi kết luận lỗi thật, reload lại trang 1
    // lần và kiểm tra lại — nếu ảnh đã có thì coi là thành công, KHÔNG throw oan.
    console.log(
      `[imageAsset] chưa thấy ảnh cho "${name}" sau ${GENERATE_TIMEOUT_MS / 60000} phút, reload để kiểm tra lại trước khi kết luận lỗi...`
    );
    // CHỤP DEBUG TRƯỚC KHI RELOAD (xác nhận trực tiếp 2026-07-19, xem generate.ts cùng bug) —
    // reload xoá mất trạng thái lỗi thật trước khi kịp chụp nếu chụp SAU.
    await debugCapture(page, `pre-reload-timeout-ingredient-${name}`);
    // 🔴 ĐỌC CARD LỖI TRƯỚC KHI RELOAD — reload xoá sạch nó. Bản cũ reload trước rồi mới soi,
    // nên một mẻ HẾT QUOTA hoàn toàn lại trông y hệt "ảnh tạo xong mà không nhận ra".
    const failureAtTimeout = await findGenerationFailure(page);
    if (failureAtTimeout) {
      throw new GenerationRejectedError(
        `Flow từ chối tạo ảnh cho "${name}": ${failureAtTimeout.text}`,
        failureAtTimeout.quota
      );
    }
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    // Modal onboarding hiện lại sau reload và chặn mọi click (RUNBOOK 8.1).
    await dismissOnboardingDialog(page);
    // Chờ trang THẬT SỰ sẵn sàng (lưới media đã render) trước khi đếm lại — "Add Media" luôn
    // xuất hiện khi trang tương tác được thật sự (xem mục 4.14 RUNBOOK), đáng tin hơn 1 mốc
    // thời gian cố định vốn có thể quá ngắn khi project đã tích luỹ nhiều media.
    await page.locator(PROJECT_READY_SELECTOR).waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
    const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
    newImageSrc = await findNewImageSrc(page, baselineSrcs);
    while (!newImageSrc && Date.now() < recheckDeadline) {
      await page.waitForTimeout(POLL_INTERVAL_MS);
      newImageSrc = await findNewImageSrc(page, baselineSrcs);
    }
    if (!newImageSrc) {
      await debugCapture(page, `timeout-ingredient-${name}`);
      throw new Error(`Hết thời gian chờ tạo ảnh cho "${name}" — kiểm tra thủ công trong Flow.`);
    }
    console.log(`[imageAsset] ảnh cho "${name}" thực ra ĐÃ tạo xong — reload phát hiện được, tiếp tục đổi tên.`);
  }

  // 🔴 CHỐT AN TOÀN CUỐI CÙNG trước khi đổi tên — lớp phòng thủ thứ hai cho bug 2026-09-06.
  // `newImageSrc` chỉ được phép là ảnh CHƯA có trong lưới lúc trước khi bấm Create. Nếu vì lý
  // do nào đó nó lại là ảnh cũ thì THÀ HỎNG MẺ còn hơn đổi tên đè lên asset đã có.
  if (baselineSrcs.has(newImageSrc)) {
    await debugCapture(page, `refuse-rename-old-image-${name}`);
    throw new Error(
      `Từ chối đổi tên cho "${name}": ảnh định đặt tên đã có trong lưới TRƯỚC khi tạo, tức là ` +
        `ảnh CŨ của asset khác. Không đổi tên gì cả — tra tay trong Flow trước khi chạy lại.`
    );
  }

  // Tìm ĐÚNG ảnh vừa tạo bằng src đã biết chắc chắn (newImageSrc) — KHÔNG dùng .first() mù
  // (vị trí 0 có thể lệch nếu có thao tác khác chen giữa lúc poll và lúc rename).
  // Giống hệt cách renameLatestVideo tìm video trong generate.ts.
  const newImage = page
    .locator(`img[src="${newImageSrc}"]`)
    .locator("xpath=ancestor::flow-grid-tile-container[1]")
    .first();
  if (!(await newImage.count())) {
    await debugCapture(page, `rename-card-missing-${name}`);
    throw new Error(`Không thấy item ảnh vừa tạo (src="${newImageSrc}") trong lưới media để đổi tên "${name}" — thử lại.`);
  }
  await newImage.click({ button: "right" });
  // 🔴 ĐỔI 2026-09-05: nhãn menu bỏ phần ligature icon — "whiteboard Rename" thành "Rename",
  // và icon cũng đổi từ whiteboard sang edit. Accessible name KHÔNG chứa ligature (giống radio
  // "Image" chứ không phải "imageImage"), nên khớp chính xác "Rename".
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click({ timeout: 20000 });

  // 🔴 PHẢI GIỚI HẠN TRONG OVERLAY (2026-09-05): aria-label "Editable text" bị DÙNG LẠI cho ô
  // TÊN PROJECT ở thanh trên cùng, nên selector không giới hạn khớp 2 phần tử và Playwright ném
  // "strict mode violation". Ô đổi tên ảnh nằm trong .cdk-overlay-container.
  const nameInput = page.locator(".cdk-overlay-container").getByRole("textbox", { name: "Editable text" }).first();
  await nameInput.press("ControlOrMeta+a");
  await nameInput.fill(name);
  await page.locator(".cdk-overlay-container").getByRole("button", { name: "Done", exact: true }).click({ timeout: 20000 });

  // "networkidle" KHÔNG bao giờ fire ổn định khi project đã có nhiều media (xem ghi chú
  // tương tự trong characters.ts/generate.ts) — dùng "domcontentloaded" + chờ phần tử cụ thể.
  await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await dismissOnboardingDialog(page);
  await page.locator(PROJECT_READY_SELECTOR).waitFor({ state: "visible", timeout: 90000 });

  // Chốt lại: tên phải TRA ĐƯỢC thật, không chỉ "đã bấm Done" (xem docstring assertAssetNamed).
  await assertAssetNamed(page, name);
}
