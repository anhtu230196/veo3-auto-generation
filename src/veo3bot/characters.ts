import type { Page } from "playwright";
import type { CharacterProfile } from "../characters/extract.js";
import { CHARACTER_SHEET_STYLE_BLOCK } from "../styleDNA.js";

const CHARACTERS_TOOL_URL_SUFFIX = "/characters";
const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 4000;

/**
 * Selectors xác nhận trực tiếp trên labs.google/fx/tools/flow ngày 2026-07-13.
 * Flow không có API chính thức — nếu UI đổi, cập nhật lại các text/label bên dưới.
 */
/**
 * QUAN TRỌNG (phát hiện lại ngày 2026-07-14 — UI Flow đã đổi so với ghi chú cũ ở trên):
 * overlay đính kèm asset hiện có 1 `nav[role="tablist"]` cố định hiển thị đủ mọi tab
 * (All/Images/Videos/Voices/Characters/Avatar/Uploads), KHÔNG còn ẩn sau dropdown "dashboard"
 * nữa. Cách cũ (luôn bấm tab "All" trước rồi mới bấm "Characters", kể cả khi "All" đã
 * aria-selected="true" sẵn) khiến overlay ĐÓNG HẲN (xác nhận trực tiếp: dialog count = 0
 * sau khi chạy) — có lẽ do click đúp gây re-render lệch toạ độ, cú click thứ 2 rơi trúng
 * lớp nền (backdrop) của Radix Dialog khiến nó tự đóng như khi click ra ngoài.
 * Cách ĐÚNG: chỉ bấm tab "Characters" (qua role="tab", tránh khớp nhầm span ẩn
 * accessibility-only cùng chữ "Characters" nằm ở sidebar chính phía sau overlay), và chỉ
 * bấm khi nó CHƯA được chọn.
 */
export async function ensureCharactersFilterActive(page: Page): Promise<void> {
  await page.waitForTimeout(500); // overlay vừa mở, cho React ổn định trước khi thao tác tiếp
  // Các tab không có aria-label, tên accessible bị tính từ text bên trong (bao gồm cả
  // ligature icon dính liền, vd "accessibility_newCharacters") nên getByRole({name:...})
  // exact match thất bại — dùng has-text (substring) scoped theo role="tab" thay thế.
  const charactersTab = page.locator('button[role="tab"]:has-text("Characters")').first();
  if ((await charactersTab.getAttribute("aria-selected")) !== "true") {
    await charactersTab.click({ timeout: 10000 });
  }
}

async function characterAlreadyExists(page: Page, name: string): Promise<boolean> {
  // input[placeholder="Search assets"] chỉ tồn tại trong overlay đính kèm asset, mở bằng
  // nút icon "add_2" + label "Create" NẰM CẠNH Ô PROMPT (không phải nút "+"/"Add Media"
  // ở top-right toolbar — 2 nút trông giống nhau nhưng mở 2 menu hoàn toàn khác nhau,
  // xác nhận trực tiếp qua debug DOM).
  const attachMediaButton = page.locator('button:has-text("add_2")');
  await attachMediaButton.click();
  await ensureCharactersFilterActive(page);

  const searchBox = page.locator('input[placeholder="Search assets"]');
  await searchBox.fill(name);
  await page.waitForTimeout(1000);
  const exists = (await page.getByText(name, { exact: false }).count()) > 0;

  // Nút attach có aria-haspopup="dialog" (Radix Dialog) — đóng bằng Escape đúng chuẩn.
  // Bấm lại nút để "toggle" không đáng tin cậy vì dropdown filter lồng bên trong có thể
  // che mất nút, khiến click bị chặn (pointer-events intercepted).
  await page.keyboard.press("Escape");
  return exists;
}

async function createCharacter(page: Page, character: CharacterProfile, projectUrl: string): Promise<void> {
  // Nút "+"/"Add Media" ở toolbar trên cùng (icon "add", KHÔNG phải icon "add_2" cạnh ô
  // prompt) mở menu Upload media/Create Collection/Create Character/Create Scene.
  await page.locator('button:has-text("Add Media")').click();
  await page.getByText("Create Character", { exact: false }).click();
  await page.waitForURL((url) => url.pathname.endsWith(CHARACTERS_TOOL_URL_SUFFIX));

  const describeBox = page.locator('div[contenteditable="true"]').first();
  await describeBox.click();
  await describeBox.fill(`${character.name}: ${character.description}. ${CHARACTER_SHEET_STYLE_BLOCK}`);

  await page.locator('button:has-text("arrow_forward")').last().click();

  const deadline = Date.now() + GENERATE_TIMEOUT_MS;
  let done = false;
  while (Date.now() < deadline) {
    if ((await page.locator("img[src], video[src]").count()) > 0) {
      done = true;
      break;
    }
    await page.waitForTimeout(POLL_INTERVAL_MS);
  }
  if (!done) {
    throw new Error(
      `Hết thời gian chờ tạo Character "${character.name}" — kiểm tra thủ công trong Flow.`
    );
  }

  // Input tên nhân vật luôn tồn tại sẵn trong form (không cần click bút chì/text trước —
  // đã xác nhận trực tiếp: click vào text tiêu đề KHÔNG vào chế độ sửa, chỉ có input này
  // mới thao tác được), để generate.ts sau này tìm lại đúng nhân vật bằng tên.
  const nameInput = page.locator('input[placeholder="Character Name"]');
  await nameInput.fill(character.name);
  await page.keyboard.press("Enter");

  await page.locator('button:has-text("Done")').click();

  // Quay lại canvas chính của project — tránh trạng thái DOM không ổn định (phần tử bị
  // detach giữa chừng) khi vòng lặp xử lý nhân vật tiếp theo ngay trên trang tạo character.
  //
  // LỖI ĐÃ GẶP (2026-07-16): "networkidle" KHÔNG bao giờ fire ổn định khi project đã có
  // nhiều media (xem ghi chú tương tự trong generate.ts::ensureModelAndDuration) — ban đầu
  // không lỗi vì project còn ít media, nhưng timeout ngay khi project tích luỹ đủ nhiều
  // (character/setting/prop asset sau) dù trang đã tương tác được thật sự. Dùng
  // "domcontentloaded" + chờ 1 phần tử cụ thể chắc chắn có (nút "Add Media") thay vì chờ
  // network im lặng hoàn toàn.
  await page.goto(projectUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.locator('button:has-text("Add Media")').waitFor({ state: "visible", timeout: 90000 });
}

/**
 * Đảm bảo mỗi nhân vật trong danh sách đã có Character asset trong Flow — dựa trên field
 * `status` (xem assetStatus.ts, CharacterProfile.status) thay vì tra tên qua Flow UI mỗi lần
 * chạy như trước:
 * - `status === "success"`: BỎ QUA hẳn, không query Flow (tin tưởng đã tạo + đổi tên xong).
 * - `status` khác (waiting/failed/thiếu field — dữ liệu cũ trước khi có field này): vẫn tra
 *   tên qua Flow UI 1 lần trước khi tạo mới (giữ lại `characterAlreadyExists` làm lưới an
 *   toàn) — tránh tạo TRÙNG asset đã tồn tại thật ngoài Flow mà status chưa kịp ghi "success"
 *   (vd do lỗi/crash giữa chừng, xem RUNBOOK mục 4.15 cập nhật 2026-07-18 — bug "Spanish Royal
 *   Banner" tạo xong nhưng chưa đổi tên/lưu status vì bot throw giữa chừng).
 * Lỗi tạo asset KHÔNG còn làm crash cả pipeline — bắt lỗi, đánh dấu `status = "failed"`, log
 * rõ, rồi tiếp tục nhân vật kế tiếp (lần chạy sau sẽ tự thử lại nhân vật lỗi này).
 * `onProgress` (nếu có) được gọi sau MỖI lần đổi status để orchestrator lưu lại
 * state/characters.json ngay, không mất tiến độ nếu pipeline crash ở nhân vật sau.
 *
 * GIẢ ĐỊNH: Character asset dùng chung cho MỌI project trong tài khoản (không phải tài
 * nguyên riêng theo từng project) — với `PARALLEL_WORKERS=1` (mặc định), hàm này chỉ được gọi
 * đúng 1 lần trên project chính nên giả định này không ảnh hưởng. Nếu tăng `PARALLEL_WORKERS`
 * và giả định sai (asset hoá ra riêng theo project), `status: "success"` từ project đầu sẽ
 * khiến các project song song sau BỊ BỎ QUA việc tạo asset — chưa xác nhận trực tiếp trường
 * hợp này, cân nhắc trước khi chạy song song nhiều tab.
 */
export async function ensureCharactersInFlow(
  page: Page,
  characters: CharacterProfile[],
  projectUrl: string,
  onProgress?: (characters: CharacterProfile[]) => Promise<void> | void
): Promise<void> {
  for (const character of characters) {
    if (character.status === "success") {
      console.log(`[characters] "${character.name}" status=success, bỏ qua (không query lại Flow).`);
      continue;
    }

    const exists = await characterAlreadyExists(page, character.name);
    if (exists) {
      console.log(`[characters] "${character.name}" đã có sẵn trong Flow (tra tên), đánh dấu success.`);
      character.status = "success";
      await onProgress?.(characters);
      continue;
    }

    console.log(`[characters] đang tạo Character "${character.name}" trong Flow...`);
    try {
      await createCharacter(page, character, projectUrl);
      character.status = "success";
      console.log(`[characters] đã tạo "${character.name}"`);
    } catch (err) {
      character.status = "failed";
      console.error(
        `[characters] LỖI tạo "${character.name}", đánh dấu failed để thử lại lần chạy sau: ${(err as Error).message}`
      );
    }
    await onProgress?.(characters);
  }

  const failed = characters.filter((c) => c.status === "failed");
  if (failed.length > 0) {
    console.warn(`[characters] còn ${failed.length} nhân vật lỗi, cần chạy lại "npm run run": ${failed.map((c) => c.name).join(", ")}`);
  }
}
