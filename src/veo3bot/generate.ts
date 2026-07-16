import type { Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type { VeoPrompt } from "../splitter/prompt-writer.js";
import type { CharacterProfile } from "../characters/extract.js";
import type { SettingProfile } from "../settings/extract.js";
import type { PropProfile } from "../props/extract.js";
import { ensureProjects, waitForProjectReady } from "./project.js";
import { ensureCharactersInFlow } from "./characters.js";
import { ensureSettingsInFlow } from "./settings.js";
import { ensurePropsInFlow } from "./props.js";
import { launchVeo3Browser } from "./browser.js";

const POLL_INTERVAL_MS = 5000;
// Cảnh có nội dung căng thẳng (thẩm vấn/toà án) từng bị timeout LẶP LẠI RẤT NHIỀU LẦN
// (5-7 lần liên tiếp) ở mốc 5 phút trong khi mọi cảnh khác xung quanh đều generate xong
// bình thường — nghi ngờ các cảnh này cần thời gian kiểm duyệt/render lâu hơn hẳn (không
// phải bị chặn hẳn, vì không có card "Failed" nào xuất hiện, chỉ là chưa xong trong 5 phút).
// Tăng lên 10 phút để kiểm chứng giả thuyết này trước khi kết luận là bị chặn thật.
const GENERATE_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Text nút/tab xác nhận trực tiếp trên labs.google/fx/tools/flow ngày 2026-07-13.
 * Flow không có API chính thức, UI có thể đổi — nếu bot lỗi, mở
 * `npx playwright codegen https://labs.google/fx/tools/flow` để soi lại text/label mới.
 */
const TEXT = {
  generate: "arrow_forward", // chỉ match icon (chắc chắn không trùng nút nào khác)
  modelLite: "Veo 3.1 - Lite [Lower Priority]",
};

function durationTabLabel(seconds: number): "4s" | "6s" | "8s" {
  if (seconds <= 4) return "4s";
  if (seconds <= 6) return "6s";
  return "8s";
}

// GHI CHÚ QUAN TRỌNG (phát hiện muộn, sau khi đã chạy nhiều vòng): cách "Add Media" +
// click card Character CHỈ đính kèm ảnh làm gợi ý phong cách chung, KHÔNG thực sự buộc
// Veo3 dùng đúng khuôn mặt nhân vật — dẫn đến rất nhiều cảnh render ra người hoàn toàn
// khác. Cách ĐÚNG: gõ "@" ngay trong ô prompt để mở dropdown mention, chọn đúng mục loại
// "Character" (không phải "Image") — Flow chèn vào 1 CHIP tham chiếu thật sự (Slate.js
// void inline node), ràng buộc Veo3 dùng đúng nhân vật đó. Toàn bộ hàm attachCharacters
// cũ (dùng overlay riêng) đã bị loại bỏ, thay bằng chèn @mention trực tiếp trong
// fillPromptWithMentions bên dưới.

async function ensureModelAndDuration(page: Page): Promise<void> {
  // Pill hiển thị model/tỷ lệ khung hình hiện tại — label thay đổi theo chế độ đang chọn
  // (vd "Video · 8s ..." nếu đang ở Video, hoặc "🍌 Nano Banana 2 ..." nếu đang ở Image,
  // do việc tạo Character trước đó dùng model ảnh làm đổi chế độ mặc định của canvas
  // chính luôn). Vì vậy KHÔNG match theo "Video ·" — dùng icon tỷ lệ khung hình
  // "crop_16_9" luôn xuất hiện ở cả 2 chế độ, và chỉ duy nhất TRƯỚC khi bảng mở ra
  // (bên trong bảng cũng có nút "16:9" trùng text nhưng chưa tồn tại lúc này).
  const pill = page.locator('button:has-text("crop_16_9")').first();
  try {
    await pill.click({ timeout: 15000 });
  } catch {
    // Sau nhiều chục lần generate liên tiếp, trang đôi khi vào trạng thái lag/kẹt —
    // reload để làm mới DOM trước khi thử lại, tránh crash cả pipeline.
    console.log("[veo3bot] pill cài đặt không phản hồi, reload trang và thử lại...");
    // waitUntil "domcontentloaded" — "load"/"networkidle" không bao giờ fire ổn định khi
    // project có nhiều media, gây timeout dù trang đã tương tác được thật sự.
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
    await pill.click({ timeout: 15000 });
  }
  await page.waitForTimeout(500);

  // QUAN TRỌNG: có 2 thứ khác nhau chứa chữ "Video" — pill đã đóng (vd "Video · 8s...",
  // KHÔNG có aria-selected) và tab thật bên trong bảng (CÓ aria-selected="true|false").
  // Nếu không lọc theo [aria-selected], có lúc bấm nhầm vào pill làm đóng bảng luôn.
  const videoTab = page.locator('button[aria-selected]:has-text("Video")').first();
  if ((await videoTab.getAttribute("aria-selected")) !== "true") {
    await videoTab.click();
    await page.waitForTimeout(300);
  }

  // Dropdown model hiển thị TÊN MODEL HIỆN TẠI (có thể không phải Lite — vd "Omni Flash"
  // — do lần dùng gần nhất khác đi), nên không thể match cứng theo tên "Lite". Chỉ có
  // đúng 1 dropdown dạng này trong bảng cài đặt đang mở, nhận diện qua icon
  // "arrow_drop_down" — luôn bấm mở rồi chọn lại đúng Lite (an toàn kể cả khi đã đúng).
  await page.locator('button:has-text("arrow_drop_down")').click();
  await page.getByText(TEXT.modelLite, { exact: false }).last().click();

  const durationLabel = durationTabLabel(config.clipSeconds);
  await page.locator(`button:has-text("${durationLabel}")`).last().click();

  await page.keyboard.press("Escape");
}

/**
 * Điền prompt + chèn chip @mention Character THẬT để ràng buộc đúng khuôn mặt.
 *
 * CƠ CHẾ UI (xác nhận trực tiếp 2026-07-15): gõ "@" trong ô prompt KHÔNG mở dropdown text
 * mà chèn 1 nút void mở DIALOG chọn asset (Radix dialog, có ô input[placeholder="Search
 * assets"] + các card asset, mỗi card có subtitle loại "Character"/"Image"/...). Phải:
 * điền tên vào ô Search rồi click đúng card loại Character → dialog đóng, chip được gắn.
 *
 * CÁCH LÀM ỔN ĐỊNH: gõ TOÀN BỘ mô tả trước bằng page.keyboard.type (giữ đúng thứ tự — KHÔNG
 * dùng promptBox.type() từng đoạn vì nó tự focus lại làm ĐẢO THỨ TỰ text, đã gặp thực tế),
 * rồi chèn chip vào CUỐI prompt (vị trí chip không ảnh hưởng việc binding). Click chuột vào
 * card làm mất focus editor nên nếu chèn chip xen giữa sẽ mất phần text gõ sau — đặt chip ở
 * cuối tránh được hẳn lỗi này. Cuối cùng XÁC MINH số chip void trong DOM = số nhân vật, nếu
 * thiếu thì throw để vòng retry chạy lại (KHÔNG tạo clip với mặt sai).
 *
 * Setting/Prop asset (bối cảnh/đạo cụ cố định, xem settings.ts/props.ts) dùng CHUNG cơ chế
 * @mention này — dialog chọn asset tìm theo tên, không lọc theo loại Character/Setting/Prop,
 * nên chỉ cần gộp characterNames + settingNames + propNames thành 1 danh sách tên để chèn
 * chip, miễn tên không trùng giữa các danh sách (đảm bảo ở bước đặt tên nhân vật/bối cảnh/
 * đạo cụ).
 */
async function fillPromptWithMentions(page: Page, prompt: VeoPrompt): Promise<void> {
  const promptBox = page.locator('div[contenteditable="true"]').first();
  await promptBox.click();
  // Xoá sạch nội dung cũ (select-all + Backspace; fill("") đôi khi để sót chip void cũ).
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");

  const { videoPrompt: text, characterNames, settingNames, propNames } = prompt;
  const mentionNames = [...characterNames, ...(settingNames ?? []), ...(propNames ?? [])];
  // 1) Gõ toàn bộ mô tả tại con trỏ — đúng thứ tự.
  await page.keyboard.type(text);
  if (mentionNames.length === 0) return;

  // 2) Chèn chip @mention từng nhân vật/bối cảnh (loại bỏ trùng) vào cuối prompt.
  const uniqueNames = [...new Set(mentionNames)];
  for (const name of uniqueNames) {
    // Đưa con trỏ về cuối tài liệu rồi mở picker bằng "@".
    await promptBox.click();
    await page.keyboard.press("ControlOrMeta+ArrowDown");
    await page.keyboard.press("End");
    await page.keyboard.type(" @");
    await page.waitForTimeout(1000);

    const search = page.locator('input[placeholder="Search assets"]');
    try {
      await search.waitFor({ state: "visible", timeout: 8000 });
    } catch {
      throw new Error(`Không mở được picker @mention cho "${name}" (cảnh #${prompt.index}) — thử lại.`);
    }
    await search.fill(name);
    await page.waitForTimeout(1200);

    // Click đúng card trong DIALOG (scope theo [role="dialog"] để không khớp nhầm text tên
    // đang nằm trong chính prompt), khớp exact tên.
    const card = page.locator('[role="dialog"]').getByText(name, { exact: true }).last();
    if (!(await card.count())) {
      throw new Error(`Không thấy Character/Setting/Prop "${name}" trong picker (cảnh #${prompt.index}) — thử lại.`);
    }
    await card.click();
    await page.waitForTimeout(400);
    // Một số phiên bản cần bấm "Add to Prompt"; nếu card click đã tự đóng dialog thì nút
    // này không còn (count 0) → bỏ qua.
    const addBtn = page.getByText("Add to Prompt", { exact: false }).last();
    if (await addBtn.count()) {
      await addBtn.click().catch(() => {});
    }
    await page.waitForTimeout(700);
  }

  // 3) XÁC MINH chip void đã chèn đủ (mỗi Character = 1 node data-slate-void).
  const html = await promptBox.innerHTML();
  const voidChips = (html.match(/data-slate-void="true"/g) || []).length;
  if (voidChips < uniqueNames.length) {
    throw new Error(
      `Chip @mention chưa đủ cho cảnh #${prompt.index} (có ${voidChips}/${uniqueNames.length}) — thử lại để tránh sai nhân vật.`
    );
  }
}

async function generateOneClip(page: Page, prompt: VeoPrompt, outFile: string): Promise<"ok" | "skipped"> {
  await ensureModelAndDuration(page);
  await fillPromptWithMentions(page, prompt);

  // Thẻ "Failed" của các lần lỗi TRƯỚC vẫn nằm trong lưới media của project mãi mãi
  // (không biến mất kể cả reload) — nếu chỉ kiểm tra sự tồn tại, mọi cảnh SAU lần lỗi
  // đầu tiên sẽ bị hiểu nhầm là lỗi ngay lập tức. Đếm số lượng "Failed" TRƯỚC khi bấm
  // generate, chỉ coi là lỗi thật nếu số lượng TĂNG so với baseline này.
  //
  // LỖI NGHIÊM TRỌNG ĐÃ SỬA: tương tự vậy, video[src] của các cảnh TRƯỚC cũng luôn có
  // sẵn trên trang (lưới media giữ lại mọi video đã tạo). Trước đây code chỉ kiểm tra
  // "có video[src] nào không" mà không so với baseline — khiến bot tưởng cảnh mới xong
  // NGAY LẬP TỨC và tải nhầm video CŨ của cảnh khác, gây trùng lặp clip hàng loạt trong
  // video cuối (xác nhận qua kiểm tra hash: >20 cặp clip bị trùng y hệt nhau).
  // getByText khớp cả text ẩn/không hiển thị (vd data JSON nhúng sẵn trong trang chứa
  // chữ "Failed" trong nội dung i18n) — xác nhận trực tiếp: 1 project HOÀN TOÀN TRỐNG,
  // chưa từng tạo gì, vẫn báo failedCount=2 ngay khi vừa mở. Phải lọc chỉ đếm phần tử
  // THỰC SỰ HIỂN THỊ trên màn hình bằng locator(":visible").
  const failedLocatorAll = page.getByText("Failed", { exact: false }).locator(":visible");
  const baselineFailedCount = await failedLocatorAll.count();
  const videoLocatorAll = page.locator("video[src]");
  const baselineVideoCount = await videoLocatorAll.count();

  await page.locator(`button:has-text("${TEXT.generate}")`).last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  const videoLocator = videoLocatorAll.first();
  while (Date.now() < deadline) {
    if ((await videoLocatorAll.count()) > baselineVideoCount) break;
    if ((await failedLocatorAll.count()) > baselineFailedCount) {
      console.warn(
        `[veo3bot] cảnh #${prompt.index} bị Flow từ chối tạo (có thể do chính sách nội dung) — bỏ qua cảnh này.`
      );
      return "skipped";
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if ((await videoLocatorAll.count()) <= baselineVideoCount) {
    // XÁC NHẬN TRỰC TIẾP (2026-07-16): cảnh #25 bị báo "hết thời gian chờ" nhưng video THẬT
    // RA đã tạo xong trong Flow (thấy rõ trong media grid, đúng khớp prompt) — bot chỉ không
    // phát hiện kịp trong lúc poll trực tiếp trên trang đang mở (không rõ do hàng đợi "Lower
    // Priority" hoàn tất chậm hơn deadline, hay do grid cần reload mới hiển thị đúng phần tử
    // mới). Trước khi kết luận là lỗi thật/bỏ qua oan 1 cảnh đã xong, reload lại trang 1 lần
    // và kiểm tra lại — nếu video đã có thì coi là thành công, KHÔNG bỏ qua.
    console.log(
      `[veo3bot] cảnh #${prompt.index} chưa thấy video sau ${GENERATE_TIMEOUT_MS / 60000} phút, reload để kiểm tra lại trước khi kết luận lỗi...`
    );
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(3000);
    if ((await videoLocatorAll.count()) <= baselineVideoCount) {
      throw new Error(
        `Hết thời gian chờ generate cảnh #${prompt.index} — video không xuất hiện kể cả sau khi reload. Kiểm tra thủ công trong Flow.`
      );
    }
    console.log(`[veo3bot] cảnh #${prompt.index} thực ra ĐÃ tạo xong — reload phát hiện được, tiếp tục tải về.`);
  }

  const videoSrc = await videoLocator.getAttribute("src");
  if (!videoSrc) throw new Error(`Không lấy được URL video cho cảnh #${prompt.index}.`);

  // src trả về là đường dẫn tương đối (vd "/fx/api/trpc/media.getMediaUrlRedirect?..."),
  // phải ghép với origin của trang mới fetch được.
  const absoluteVideoUrl = new URL(videoSrc, page.url()).href;
  const response = await page.request.get(absoluteVideoUrl);
  await fs.writeFile(outFile, await response.body());
  return "ok";
}

export interface ClipResult {
  index: number;
  file: string;
}

/**
 * Xử lý tuần tự hàng đợi CHUNG (queue.shift()) trên 1 tab/project riêng của worker này.
 * queue.shift() an toàn dù nhiều worker gọi song song vì JS đơn luồng — không có await
 * xen giữa lúc kiểm tra rỗng và lúc lấy phần tử, nên không có race condition thật sự.
 * Vì mỗi worker có project Flow RIÊNG BIỆT (không share lưới media với worker khác),
 * cơ chế baseline-diff cũ (đếm trước/sau trên video[src]/"Failed") vẫn đúng nguyên vẹn —
 * không cần match theo text prompt, vì không còn state nào bị lẫn giữa các tab.
 */
async function processQueue(
  workerId: number,
  initialPage: Page,
  projectUrl: string,
  queue: VeoPrompt[],
  outDir: string,
  results: ClipResult[]
): Promise<void> {
  const RELOAD_EVERY = 15;
  let generatedSinceReload = 0;
  let page = initialPage;
  const log = (msg: string) => console.log(`[veo3bot#${workerId}] ${msg}`);

  // LỖI ĐÃ GẶP: page.goto() lại CÙNG 1 page bị lỗi không đủ để hồi phục — quan sát trực
  // tiếp thấy 1 tab bị lỗi "locator.click: Timeout" thì lỗi y hệt ở MỌI cảnh sau đó liên
  // tục dù đã goto lại project mỗi lần (dấu hiệu trang bị kẹt ở tầng JS/DOM sâu hơn, chỉ
  // goto không dọn sạch được). Mã cũ (chạy đơn luồng, 1 tab) từng đóng cả trình duyệt và
  // mở lại mới hoàn toàn để hồi phục — ở đây không thể đóng cả context (dùng chung với
  // worker khác), nên thay bằng: đóng riêng page đang lỗi và mở page MỚI tinh trong CÙNG
  // context, rồi mới goto vào lại project.
  async function reopenPage(): Promise<void> {
    const context = page.context();
    const oldPage = page;
    page = await context.newPage();
    await oldPage.close().catch(() => {});
    await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(page);
  }

  while (queue.length > 0) {
    const p = queue.shift();
    if (!p) break;
    const outFile = path.join(outDir, `clip_${String(p.index).padStart(3, "0")}.mp4`);

    if (generatedSinceReload >= RELOAD_EVERY) {
      log("mở lại tab mới định kỳ để làm mới trang...");
      await reopenPage().catch((e) => log(`reload định kỳ lỗi, vẫn tiếp tục dùng tab hiện tại: ${(e as Error).message}`));
      generatedSinceReload = 0;
    }

    log(`tạo cảnh #${p.index} [${p.characterNames.join(", ")}]: ${p.videoPrompt.slice(0, 80)}...`);

    let status: "ok" | "skipped";
    try {
      status = await generateOneClip(page, p, outFile);
    } catch (err) {
      log(`lỗi cảnh #${p.index}, mở tab mới và thử lại: ${(err as Error).message}`);
      try {
        await reopenPage();
        generatedSinceReload = 0;
        status = await generateOneClip(page, p, outFile);
      } catch (err2) {
        log(`cảnh #${p.index} vẫn lỗi sau khi thử lại — bỏ qua: ${(err2 as Error).message}`);
        status = "skipped";
      }
    }

    generatedSinceReload++;
    if (status === "ok") {
      results.push({ index: p.index, file: outFile });
      log(`đã tải ${outFile}`);
    }
  }
}

/**
 * Sinh video cho toàn bộ danh sách prompt, chạy SONG SONG nhiều tab (config.parallelWorkers)
 * trong CÙNG 1 trình duyệt persistent — mỗi tab dùng 1 project Flow RIÊNG BIỆT (xem
 * project.ts::ensureProjects) để lưới media của tab này không thể lẫn vào tab khác, tránh
 * tái diễn lỗi trùng lặp clip đã gặp trước đây khi chạy đơn luồng trên 1 project chung.
 * Bỏ qua clip đã tồn tại để có thể resume khi lỗi giữa chừng. Cảnh bị Flow từ chối tạo
 * (chính sách nội dung) sẽ bị bỏ qua, KHÔNG có mặt trong kết quả trả về — orchestrator cần
 * lọc audio tương ứng để giữ đồng bộ khi ghép video.
 */
export async function generateClips(
  prompts: VeoPrompt[],
  characters: CharacterProfile[],
  settings: SettingProfile[],
  props: PropProfile[],
  outDir: string
): Promise<ClipResult[]> {
  await fs.mkdir(outDir, { recursive: true });

  const results: ClipResult[] = [];
  const queue: VeoPrompt[] = [];
  for (const p of prompts) {
    const outFile = path.join(outDir, `clip_${String(p.index).padStart(3, "0")}.mp4`);
    const alreadyDone = await fs.access(outFile).then(() => true).catch(() => false);
    if (alreadyDone) {
      results.push({ index: p.index, file: outFile });
    } else {
      queue.push(p);
    }
  }
  if (queue.length === 0) return results;

  const workerCount = Math.max(1, Math.min(config.parallelWorkers, queue.length));
  console.log(`[veo3bot] còn ${queue.length} cảnh cần tạo, chạy song song ${workerCount} tab...`);

  const context = await launchVeo3Browser();
  try {
    // Project #0 luôn là project cũ (đã có Character asset + 83 clip đầu) — mở trong tab
    // đầu tiên (đã sẵn có trong context, không mở tab mới) để tận dụng, không tạo lãng phí.
    const setupPage = context.pages()[0] ?? (await context.newPage());
    const projectUrls = await ensureProjects(setupPage, workerCount);

    const pages: Page[] = [setupPage];
    await setupPage.goto(projectUrls[0], { waitUntil: "domcontentloaded", timeout: 45000 });
    await waitForProjectReady(setupPage);

    for (let i = 1; i < workerCount; i++) {
      const page = await context.newPage();
      await page.goto(projectUrls[i], { waitUntil: "domcontentloaded", timeout: 45000 });
      await waitForProjectReady(page);
      // Chưa chắc Character/Setting/Prop asset là tài nguyên toàn tài khoản hay riêng theo
      // từng project — luôn kiểm tra lại ở project MỚI tạo cho worker này (hàm tự bỏ qua nếu
      // đã tồn tại nên rẻ), thay vì giả định và có thể để lọt cảnh không @mention được.
      await ensureCharactersInFlow(page, characters, projectUrls[i]);
      await ensureSettingsInFlow(page, settings, projectUrls[i]);
      await ensurePropsInFlow(page, props, projectUrls[i]);
      pages.push(page);
    }

    // "Add Media" hiện sớm hơn khi trang thực sự sẵn sàng thao tác — vài giây đầu sau đó dễ
    // khiến các cảnh ĐẦU TIÊN bị hiểu nhầm là bị chặn (thực chất chỉ đang "Queued").
    await Promise.all(pages.map((p) => p.waitForTimeout(3000)));

    await Promise.all(
      pages.map((page, i) => processQueue(i, page, projectUrls[i], queue, outDir, results))
    );
  } finally {
    // Luôn đóng context kể cả khi setup/worker lỗi giữa chừng — nếu để mở, lần chạy lại
    // tiếp theo sẽ launchPersistentContext thứ 2 trên CÙNG profile dir, xung đột khóa
    // profile và gây lỗi UI khó hiểu (đã xác nhận trực tiếp: 2 lần chạy liên tiếp lỗi
    // giống hệt nhau ở bước không liên quan, do context lần trước bị bỏ mở).
    await context.close().catch(() => {});
  }
  return results;
}
