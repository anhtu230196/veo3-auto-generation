import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import type { CharacterProfile } from "./characters/extract.js";
import type { PropProfile } from "./props/extract.js";
import { ensureCharactersInFlow } from "./veo3bot/characters.js";
import { ensurePropsInFlow } from "./veo3bot/props.js";
import { ensureProject } from "./veo3bot/project.js";
import { launchVeo3Browser } from "./veo3bot/browser.js";

const CHARACTERS_STATE_FILE = path.join(config.stateDir, "characters.json");
const PROPS_STATE_FILE = path.join(config.stateDir, "props.json");
const CHROME_PROFILE_DIR = path.join(config.authDir, "chrome-profile");

/**
 * Lệnh RIÊNG chỉ tạo Character/Prop Ingredient trong Google Flow, KHÔNG generate video —
 * tách khỏi `generateVideo.ts` để có thể tạo xong toàn bộ nhân vật/đồ vật một lần, xác nhận
 * bằng mắt trong Flow, rồi mới chạy generate video riêng.
 * `state/characters|props.json` đều do Claude viết tay trực tiếp trong hội thoại (xem
 * RUNBOOK.md mục 0/1/4.20) — script này chỉ ĐỌC cache, báo lỗi rõ nếu thiếu characters.
 * (ĐÃ BỎ Setting Ingredient 2026-07-22 — không còn tạo sẵn 1 ảnh cho mọi địa điểm nữa, xem
 * RUNBOOK mục 0. Cảnh cần giữ đúng khung hình dùng `needsAngleLock` + `npm run generate-images`
 * thay thế, xem `sceneImages.ts`.)
 */
async function loadCharacters(): Promise<CharacterProfile[]> {
  const cached = await fs.readFile(CHARACTERS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    throw new Error(
      `Thiếu state/characters.json. Nhờ Claude viết file này (danh sách nhân vật + mô tả ngoại hình cố định) dựa trên kịch bản trước khi chạy lệnh này.`
    );
  }
  console.log("[assets] dùng danh sách nhân vật đã viết sẵn (state/characters.json)");
  return JSON.parse(cached) as CharacterProfile[];
}

async function loadProps(): Promise<PropProfile[]> {
  const cached = await fs.readFile(PROPS_STATE_FILE, "utf-8").catch(() => null);
  if (!cached) {
    console.log(
      "[assets] chưa có state/props.json — bỏ qua Prop asset (nhờ Claude viết file này nếu muốn giữ nhất quán 1 đạo cụ qua nhiều cảnh)."
    );
    return [];
  }
  console.log("[assets] dùng danh sách đạo cụ đã viết sẵn (state/props.json)");
  return JSON.parse(cached) as PropProfile[];
}

/**
 * Ghi ATOMIC (file tạm rồi rename) — cùng lý do đã sửa trong orchestrator.ts trước đây (xem
 * RUNBOOK mục 4.23): `fs.writeFile` không atomic, crash giữa chừng để lại file 0 byte.
 */
async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, filePath);
}

async function saveCharactersProgress(characters: CharacterProfile[]): Promise<void> {
  await atomicWriteJson(CHARACTERS_STATE_FILE, characters);
}
async function savePropsProgress(props: PropProfile[]): Promise<void> {
  await atomicWriteJson(PROPS_STATE_FILE, props);
}

async function main() {
  const characters = await loadCharacters();
  const props = await loadProps();

  const profileExists = await fs.access(CHROME_PROFILE_DIR).then(() => true).catch(() => false);
  if (!profileExists) {
    throw new Error(`Chưa có session Veo3. Chạy "npm run login:veo3" trước.`);
  }

  const context = await launchVeo3Browser();
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    const projectUrl = await ensureProject(page);
    await ensureCharactersInFlow(page, characters, projectUrl, saveCharactersProgress);
    await ensurePropsInFlow(page, props, projectUrl, savePropsProgress);
  } finally {
    // Persistent context KHÔNG được để mở nếu bước trên lỗi — vẫn giữ khóa profile dir,
    // khiến lần chạy lại tiếp theo mở context thứ 2 trên CÙNG profile bị xung đột.
    await context.close().catch(() => {});
  }

  const failed = [
    ...characters.filter((c) => c.status === "failed").map((c) => `Character "${c.name}"`),
    ...props.filter((p) => p.status === "failed").map((p) => `Prop "${p.name}"`),
  ];
  if (failed.length > 0) {
    console.error(
      `\n⚠️ ${failed.length} tài sản bị lỗi khi tạo trong Flow: ${failed.join(", ")}.` +
        `\nChạy lại "npm run assets" để thử lại (đã lưu status "failed", chỉ tài sản này sẽ thử lại).`
    );
    process.exit(1);
  }

  console.log(
    `\n✅ Đã tạo xong ${characters.length} Character, ${props.length} Prop trong Flow.` +
      `\nChạy "npm run generate" để tạo video từng cảnh (cảnh needsAngleLock cần "npm run generate-images" + tự chọn ảnh trước).`
  );
}

main().catch((err) => {
  console.error("[assets] lỗi:", err);
  process.exit(1);
});
