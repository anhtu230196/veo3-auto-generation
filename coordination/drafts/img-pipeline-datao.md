Người viết: Claude Opus 5.5 (claude-opus-5-5), Claude Code, 2026-10-09 — v3: v2 (D01, D02, D04, D05) + D03 theo quyết định của Tú

# img-pipeline-datao — thay đổi code pipeline ảnh chờ review (bước 6)

File này là **bản đóng băng của thay đổi**: diff so với `master` (HEAD `9f66a3b`) của 4 file đã có, và
nội dung đầy đủ của 2 file mới. Người review không chạy được shell — mọi thứ cần đọc nằm ở đây; mã nguồn
đầy đủ đọc thẳng ở đường dẫn trong repo. Lý do, bằng chứng và câu hỏi: file đề xuất `r1-00-proposal-claude.md`.

| File | Loại | Nhóm |
| --- | --- | --- |
| `src/veo3bot/imageAsset.ts` | sửa | A (chèn chip, xoá ô prompt, nhận ảnh mới) + B (trả `created`/`existing`) |
| `scripts/run-shots.ts` | sửa | B (tự ghi `daTao`) |
| `scripts/review_shots.py` | sửa | B (đọc `daTao`) |
| `image-prompts/SPEC-v2.md` | sửa | B (mục 5e + dòng bảng 5c) |
| `scripts/lib/shotsStatus.ts` | MỚI | B (kiểu + đọc–ghi `daTao`) |
| `scripts/audit-shots.ts` | MỚI | B (tra thẳng Flow, ghi `daTao`) |

## Diff `src/veo3bot/imageAsset.ts`

```diff
diff --git a/src/veo3bot/imageAsset.ts b/src/veo3bot/imageAsset.ts
index daaaa96..f80ef88 100644
--- a/src/veo3bot/imageAsset.ts
+++ b/src/veo3bot/imageAsset.ts
@@ -104,10 +104,43 @@ async function snapshotGridSrcs(page: Page): Promise<Set<string>> {
   return new Set(srcs);
 }
 
-/** `src` đầu tiên chưa có trong `baseline` — tức ảnh vừa được tạo. */
-async function findNewImageSrc(page: Page, baseline: ReadonlySet<string>): Promise<string | undefined> {
-  for (const src of await allImageSrcs(page)) if (!baseline.has(src)) return src;
-  return undefined;
+/** Thẻ trong lưới theo thứ tự DOM (mới nhất trước): nhãn thẻ (= tên card) + `src` ảnh. */
+async function gridTiles(page: Page): Promise<Array<{ label: string; src: string }>> {
+  return page.locator("flow-grid-tile-container").evaluateAll((els) =>
+    els.map((el) => ({
+      label: el.getAttribute("aria-label") ?? "",
+      src: el.querySelector("flow-image-tile img")?.getAttribute("src") ?? "",
+    }))
+  );
+}
+
+/**
+ * Ảnh vừa tạo = THẺ ĐẦU TIÊN có ảnh, với `src` VÀ nhãn đều chưa có lúc chụp baseline.
+ *
+ * 🔴 Đời 4 (2026-09-25). Đời 3 ("src đầu tiên chưa có trong baseline", quét cả lưới) vẫn đặt
+ * tên ĐÈ lên ảnh cũ: tập lam-gia case 1 có 5 thẻ cũ bị đổi tên (chân dung Gardner thành "Stack Of
+ * Folded Newspapers…", ảnh neo 03 thành "Society Member Holding Glass Plate…"), còn ảnh mới thật
+ * nằm vô danh với tên Flow tự đặt. Giả định "ảnh bị đẩy khỏi vùng render chỉ MẤT khỏi tập" sai khi
+ * project đã ~90 media: thẻ cũ ngoài vùng render lúc chụp baseline có thể hiện lại (hoặc `src`
+ * đổi token), trông như "chưa từng thấy". Nên giờ đòi thêm hai điều: nằm ở ĐẦU lưới (Flow xếp
+ * Recent), và nhãn chưa có trong baseline — thẻ cũ mang tên đã đặt, ảnh mới mang tên Flow tự sinh.
+ * Trùng nhãn tự sinh với một thẻ cũ thì không nhận ra → hết giờ → báo lỗi, KHÔNG đặt tên đè.
+ *
+ * 🔴 NHÃN RỖNG = CHƯA NHẬN (luồng img-pipeline-datao D01, 2026-10-09). Bản đầu đời 4 cho nhãn rỗng
+ * lọt qua ("thẻ chưa kịp có tên"). Sai ở nhánh reload khi hết giờ: reload đổi token `src` của MỌI
+ * thẻ, nên điều kiện `src` vô dụng; thẻ cũ ở đầu lưới mà lúc đó nhãn chưa nạp (rỗng) sẽ được nhận
+ * là ảnh mới và bị đặt tên đè. Giờ nhãn rỗng thì cứ chờ lượt poll sau — ảnh mới thật sẽ có chú
+ * thích tự sinh; không bao giờ có thì hết giờ, báo lỗi (an toàn).
+ */
+async function findNewImageSrc(
+  page: Page,
+  baseline: ReadonlySet<string>,
+  baselineLabels: ReadonlySet<string>
+): Promise<string | undefined> {
+  const first = (await gridTiles(page)).find((t) => t.src);
+  if (!first || !first.label) return undefined;
+  if (baseline.has(first.src) || baselineLabels.has(first.label)) return undefined;
+  return first.src;
 }
 
 /**
@@ -264,19 +297,38 @@ export async function typeMentionPrompt(page: Page, parts: PromptPart[]): Promis
     .replace(/\s+/g, " ")
     .trim();
   const wantChips = parts.filter((p) => "asset" in p).length;
+  // So KHỚP ĐÚNG, không chỉ "đủ": chữ + nhãn chip (nhãn chip = tên asset), bỏ mọi ký tự không
+  // phải chữ/số. Đo 2026-09-25: lượt gõ lại không xoá sạch lượt trước, prompt gửi đi mang cả
+  // phần thừa ("draw the same man as in draw the same man as in …") mà bộ kiểm "đủ chữ, đủ
+  // chip" vẫn cho qua — C1-38b, C1-39, C1-51b của tập lam-gia.
+  const squash = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
+  const wantFull = squash(parts.map((p) => ("text" in p ? p.text : p.asset)).join(""));
 
   for (let attempt = 1; attempt <= 3; attempt++) {
-    await dismissOverlays(page);
-    await promptBox.click();
-    await page.keyboard.press("ControlOrMeta+A");
-    await page.keyboard.press("Backspace");
+    if (!(await clearPromptBox(page, promptBox))) {
+      if (attempt === 3) {
+        await debugCapture(page, `mention-prompt-not-cleared`);
+        throw new Error("Không xoá sạch được ô prompt sau nhiều lần — không gửi prompt lẫn phần thừa.");
+      }
+      continue;
+    }
 
-    for (const part of parts) {
-      if ("text" in part) {
-        await page.keyboard.type(part.text);
-        continue;
+    // Lỗi văng ra GIỮA lúc chèn chip (dialog `@` không mở vì mảnh chữ trước rơi vào ô search —
+    // mục 4.49) cũng phải vào vòng gõ lại, không chỉ lỗi phát hiện lúc đọc lại. Đo 2026-09-25:
+    // cặp chip nối bằng " and " rơi 2/3 lần ở lượt đầu.
+    try {
+      for (const part of parts) {
+        if ("text" in part) {
+          await page.keyboard.type(part.text);
+          continue;
+        }
+        await insertMentionChip(page, promptBox, part.asset);
       }
-      await insertMentionChip(page, promptBox, part.asset);
+    } catch (e) {
+      if (attempt === 3) throw e;
+      debugLog("mention", `lượt ${attempt}: chèn chip lỗi (${(e as Error).message}) — gõ lại từ đầu`);
+      await page.keyboard.press("Escape").catch(() => {});
+      continue;
     }
 
     // ĐỌC LẠI — xem docstring. `innerText` của ô prompt gồm cả nhãn chip, nên chỉ kiểm rằng
@@ -291,15 +343,16 @@ export async function typeMentionPrompt(page: Page, parts: PromptPart[]): Promis
     // Đếm theo `data-mention-id` chứ không theo class, vì id là thứ Flow bắt buộc phải có để
     // biết chip trỏ tới asset nào; class thì đổi tên lúc nào cũng được.
     const chipCount = await promptBox.locator("[data-mention-id]").count();
+    const exact = squash(got) === wantFull && chipCount === wantChips;
 
-    if (textOk && chipCount >= wantChips) {
+    if (textOk && exact) {
       debugLog("mention", `prompt @mention xong (${wantChips} chip): ${got.slice(0, 160)}`);
       return;
     }
 
     debugLog(
       "mention",
-      `lượt ${attempt}: prompt chưa đúng (chữ ${textOk ? "đủ" : "THIẾU"}, chip ${chipCount}/${wantChips}) — gõ lại. Đang có: ${got.slice(0, 200)}`
+      `lượt ${attempt}: prompt chưa đúng (chữ ${textOk ? "đủ" : "THIẾU"}, chip ${chipCount}/${wantChips}, khớp đúng ${exact ? "có" : "KHÔNG"}) — gõ lại. Đang có: ${got.slice(0, 200)}`
     );
     if (attempt === 3) {
       await debugCapture(page, `mention-prompt-broken`);
@@ -311,15 +364,55 @@ export async function typeMentionPrompt(page: Page, parts: PromptPart[]): Promis
   }
 }
 
+/**
+ * Đặt con trỏ ở CUỐI ô prompt. Bấm GÓC DƯỚI PHẢI chứ không bấm giữa ô: giữa ô có thể là một
+ * chip (contenteditable=false), bấm trúng thì con trỏ không nằm ở cuối (đo 2026-09-25).
+ *
+ * Lùi vào 24px theo chiều ngang (luồng img-pipeline-datao D02): prompt dài làm hiện thanh cuộn
+ * dọc sát mép phải, bấm trúng thanh cuộn thì ô không nhận focus và phím gõ rơi ra ngoài. Bấm xong
+ * vẫn KIỂM focus nằm trong ô; chưa thì gọi `focus()` thẳng lên phần tử rồi mới `Ctrl+End`.
+ */
+async function focusPromptEnd(page: Page, promptBox: ReturnType<Page["locator"]>): Promise<void> {
+  const box = await promptBox.boundingBox();
+  if (box) await page.mouse.click(box.x + Math.max(box.width - 24, box.width / 2), box.y + box.height - 6);
+  else await promptBox.click();
+  const focused = await promptBox
+    .evaluate((el) => el === document.activeElement || el.contains(document.activeElement))
+    .catch(() => false);
+  if (!focused) {
+    debugLog("mention", "bấm góc ô prompt không lấy được focus — gọi focus() thẳng");
+    await promptBox.focus().catch(() => {});
+  }
+  await page.keyboard.press("ControlOrMeta+End");
+  await page.keyboard.press("End");
+}
+
+/** Xoá ô prompt rồi ĐỌC LẠI cho tới khi trống thật (không chữ, không chip) — tối đa 5 lần. */
+async function clearPromptBox(
+  page: Page,
+  promptBox: ReturnType<Page["locator"]>
+): Promise<boolean> {
+  for (let i = 0; i < 5; i++) {
+    await dismissOverlays(page);
+    await promptBox.click();
+    await page.keyboard.press("ControlOrMeta+A");
+    await page.keyboard.press("Backspace");
+    await page.waitForTimeout(250);
+    const left = ((await promptBox.innerText().catch(() => "")) || "").trim();
+    const chips = await promptBox.locator("[data-mention-id]").count();
+    if (!left && !chips) return true;
+    debugLog("mention", `xoá ô prompt lần ${i + 1} chưa sạch (còn ${chips} chip): ${left.slice(0, 80)}`);
+  }
+  return false;
+}
+
 async function insertMentionChip(
   page: Page,
   promptBox: ReturnType<Page["locator"]>,
   assetName: string
 ): Promise<void> {
   // Luôn mở dialog khi cursor ở CUỐI tài liệu (phòng thủ 1 ở docstring trên).
-  await promptBox.click();
-  await page.keyboard.press("ControlOrMeta+ArrowDown");
-  await page.keyboard.press("End");
+  await focusPromptEnd(page, promptBox);
   await page.keyboard.type("@");
   await page.waitForTimeout(1200);
 
@@ -329,11 +422,23 @@ async function insertMentionChip(
   // `generate.ts` scope theo `[role="dialog"]` vì hồi đó UI khác — bê nguyên selector đó sang
   // đây thì khớp 0 phần tử và báo "không thấy asset" trong khi thẻ nằm ngay trước mắt.
   const search = page.getByRole("textbox", { name: /search assets/i }).first();
-  try {
-    await search.waitFor({ state: "visible", timeout: 8000 });
-  } catch {
-    await debugCapture(page, `mention-picker-fail-${assetName}`);
-    throw new Error(`Gõ "@" không mở được bảng chọn asset cho "${assetName}".`);
+  const opened = () =>
+    search.waitFor({ state: "visible", timeout: 8000 }).then(() => true, () => false);
+  if (!(await opened())) {
+    // Đo 2026-09-25 (ảnh debug): prompt sạch "… as in [chip] and", mà "@" KHÔNG hiện trong ô —
+    // con trỏ không ở cuối (cú bấm giữa ô trúng chip). Gõ lại một lần: về cuối, bỏ "@" lạc nếu
+    // có, gõ " @" có khoảng trắng đứng trước.
+    debugLog("mention", `"@" không mở bảng cho "${assetName}" — thử lại một lần`);
+    await page.keyboard.press("Escape").catch(() => {});
+    const tail = ((await promptBox.innerText().catch(() => "")) || "").trimEnd();
+    await focusPromptEnd(page, promptBox);
+    if (tail.endsWith("@")) await page.keyboard.press("Backspace");
+    await page.keyboard.type(" @");
+    await page.waitForTimeout(1200);
+    if (!(await opened())) {
+      await debugCapture(page, `mention-picker-fail-${assetName}`);
+      throw new Error(`Gõ "@" không mở được bảng chọn asset cho "${assetName}".`);
+    }
   }
   await search.fill(assetName);
   await page.waitForTimeout(2000);
@@ -407,9 +512,17 @@ async function insertMentionChip(
     await search.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
   }
   await page.waitForTimeout(300);
-  await promptBox.click();
-  await page.keyboard.press("ControlOrMeta+ArrowDown");
-  await page.keyboard.press("End");
+  await focusPromptEnd(page, promptBox);
+  // Đo 2026-09-25: chữ gõ NGAY sau bước này mất 15-25 ký tự đầu, cả 3 lượt gõ lại — ô prompt
+  // chưa nhận lại focus hẳn. Chờ focus nằm trong ô contenteditable rồi mới trả về.
+  await page
+    .waitForFunction(
+      () => (document.activeElement as HTMLElement | null)?.isContentEditable === true,
+      null,
+      { timeout: 3000 }
+    )
+    .catch(() => {});
+  await page.waitForTimeout(500);
 }
 
 export async function attachReferenceImage(page: Page, referenceImagePath: string): Promise<void> {
@@ -751,12 +864,14 @@ export async function createImageIngredient(
    * trong project.
    */
   promptParts?: PromptPart[]
-): Promise<void> {
+): Promise<"created" | "existing"> {
   // 🔴 CHỐNG TẠO TRÙNG — xem docstring assetAlreadyExists. Phải đứng TRƯỚC mọi thao tác tạo:
   // asset `failed` trong JSON không có nghĩa là Flow chưa có ảnh của nó.
+  // Trả "existing" để người gọi PHÂN BIỆT với "created": run-shots.ts chỉ được ghi dấu prompt
+  // (`daTao.promptHash`) khi ảnh vừa sinh ra từ đúng prompt đó — ảnh có sẵn có thể là prompt cũ.
   if (await assetAlreadyExists(page, name, projectUrl)) {
     console.log(`[imageAsset] "${name}" ĐÃ có sẵn trong Flow — bỏ qua, không tạo lại.`);
-    return;
+    return "existing";
   }
 
   // Pill hiển thị mode/tỷ lệ khung hình hiện tại — cùng selector đã xác nhận trong
@@ -867,6 +982,7 @@ export async function createImageIngredient(
   // Baseline = TẬP HỢP src đang render, chụp khi lưới đã render xong (xem docstring
   // snapshotGridSrcs — so vị trí 0 như bản cũ đã gây đổi tên đè lên ảnh cũ).
   const baselineSrcs = await snapshotGridSrcs(page);
+  const baselineLabels = new Set((await gridTiles(page)).map((t) => t.label));
   debugLog("baseline", `ingredient "${name}": ${baselineSrcs.size} ảnh đang render trước khi tạo`);
   // Card lỗi của asset TRƯỚC có thể còn nằm đó — ghi lại để chỉ phản ứng với lỗi MỚI.
   const failureBefore = await findGenerationFailure(page);
@@ -876,7 +992,7 @@ export async function createImageIngredient(
   const deadline = Date.now() + GENERATE_TIMEOUT_MS;
   let newImageSrc: string | undefined;
   while (Date.now() < deadline) {
-    newImageSrc = await findNewImageSrc(page, baselineSrcs);
+    newImageSrc = await findNewImageSrc(page, baselineSrcs, baselineLabels);
     if (newImageSrc) break;
     // Bắt lỗi NGAY trong lúc poll: hết quota thì chờ đủ 2 phút rồi reload là vô ích, mà còn
     // xoá mất card lỗi — đúng cách bản cũ đã chẩn đoán nhầm thành lỗi selector.
@@ -915,10 +1031,10 @@ export async function createImageIngredient(
     // thời gian cố định vốn có thể quá ngắn khi project đã tích luỹ nhiều media.
     await page.locator(PROJECT_READY_SELECTOR).waitFor({ state: "visible", timeout: 90000 }).catch(() => {});
     const recheckDeadline = Date.now() + RELOAD_RECHECK_TIMEOUT_MS;
-    newImageSrc = await findNewImageSrc(page, baselineSrcs);
+    newImageSrc = await findNewImageSrc(page, baselineSrcs, baselineLabels);
     while (!newImageSrc && Date.now() < recheckDeadline) {
       await page.waitForTimeout(POLL_INTERVAL_MS);
-      newImageSrc = await findNewImageSrc(page, baselineSrcs);
+      newImageSrc = await findNewImageSrc(page, baselineSrcs, baselineLabels);
     }
     if (!newImageSrc) {
       await debugCapture(page, `timeout-ingredient-${name}`);
@@ -971,4 +1087,5 @@ export async function createImageIngredient(
 
   // Chốt lại: tên phải TRA ĐƯỢC thật, không chỉ "đã bấm Done" (xem docstring assertAssetNamed).
   await assertAssetNamed(page, name);
+  return "created";
 }
```

## Diff `scripts/run-shots.ts`

```diff
diff --git a/scripts/run-shots.ts b/scripts/run-shots.ts
index 7a5c004..5fffc16 100644
--- a/scripts/run-shots.ts
+++ b/scripts/run-shots.ts
@@ -22,12 +22,18 @@
  *
  * --aspect <ty-le>: mặc định `16:9`, nhận `9:16` / `1:1`, `none` = giữ cài đặt của project.
  * Đừng bỏ mặc: Flow LƯU tỷ lệ theo project, xem ghi chú trong `main()`.
+ *
+ * TRƯỜNG `daTao` (2026-09-28): có `.shots.json` cạnh file jobs thì NGAY SAU MỖI SHOT runner ghi
+ * kết quả vào `daTao` của shot đó — dừng giữa mẻ vẫn giữ được phần đã xong. Xem
+ * scripts/lib/shotsStatus.ts. Runner chỉ tra tên theo chuỗi con, nên sau mẻ nên chạy
+ * scripts/audit-shots.ts để xác nhận bằng cách đếm đúng nguyên tên trên Flow.
  */
 import fs from "node:fs/promises";
 import path from "node:path";
 import { launchVeo3Browser } from "../src/veo3bot/browser.js";
 import { ensureProject } from "../src/veo3bot/project.js";
 import { createImageIngredient, GenerationRejectedError } from "../src/veo3bot/imageAsset.js";
+import { promptHash, shotsFileFor, writeDaTao, type DaTao } from "./lib/shotsStatus.js";
 
 type Job = {
   id: string;
@@ -101,6 +107,36 @@ async function anchorResolver(dir: string): Promise<(kind: string) => string[]>
   return (kind: string) => abs(pick(kind) ?? pick("default") ?? all);
 }
 
+/**
+ * Ghi `daTao` cho một shot vừa chạy xong.
+ *
+ * - `created`: ảnh vừa sinh từ ĐÚNG `job.prompt` → ghi dấu prompt đó, luôn ghi đè.
+ * - `existing`: Flow đã có ảnh mang tên này nên runner bỏ qua. Ảnh đó có thể vẽ từ prompt CŨ,
+ *   nên nếu `daTao` đã xác nhận cùng tên thì để nguyên (giữ dấu prompt thật); chưa có thì ghi
+ *   `ok: true` KHÔNG kèm `promptHash` — không biết ảnh vẽ từ prompt nào thì để trống, đừng lấy
+ *   prompt hiện tại thế vào (luồng img-pipeline-datao D04). Cùng luật với audit-shots.ts.
+ * - lỗi: `daTao` đã xác nhận cùng tên thì để nguyên (ảnh vẫn nằm trên Flow); chưa thì ghi `ok: false`.
+ */
+function recordDaTao(shotsFile: string | undefined, job: Job, result: "created" | "existing" | { error: string }) {
+  if (!shotsFile) return;
+  const kiemLuc = new Date().toISOString();
+  const update = (prev: DaTao | undefined): DaTao | undefined => {
+    const confirmed = prev?.ok && prev.ten === job.outName;
+    if (result === "created") {
+      return { ok: true, ten: job.outName, promptHash: promptHash(job.prompt), kiemLuc, nguon: "run-shots" };
+    }
+    if (confirmed) return undefined;
+    if (result === "existing") return { ok: true, ten: job.outName, kiemLuc, nguon: "run-shots" };
+    return { ok: false, ten: job.outName, kiemLuc, nguon: "run-shots", loi: result.error.slice(0, 300) };
+  };
+  try {
+    writeDaTao(shotsFile, new Map([[job.id, update]]));
+  } catch (e) {
+    // Ghi hỏng không được làm rơi cả mẻ — ảnh đã tạo rồi, audit-shots.ts ghi bù được.
+    console.error(`  ⚠️ không ghi được daTao vào ${shotsFile}: ${(e as Error).message}`);
+  }
+}
+
 async function main() {
   const jobsFile = arg("--jobs");
   const projectKey = arg("--project") ?? "shots-run";
@@ -134,7 +170,10 @@ async function main() {
       : [...anchors, ...job.refNames];
   }
 
+  const shotsFile = shotsFileFor(jobsFile);
+
   console.log(`${jobs.length} shot tu ${jobsFile}`);
+  console.log(shotsFile ? `Ghi daTao vao: ${shotsFile}` : "Khong co .shots.json canh file jobs — khong ghi daTao");
   console.log(`Project Flow: ${projectKey}`);
   console.log(`Ty le khung: ${aspect ?? "(giu cai dat cua project)"}`);
   console.log(
@@ -157,6 +196,7 @@ async function main() {
       const error = `outName trung refNames (${job.outName}) — bo qua de khong mat canh im lang`;
       console.error(`→ ${job.id}  ❌ ${error}`);
       log.push({ ...job, ok: false, secs: 0, error });
+      recordDaTao(shotsFile, job, { error });
       continue;
     }
 
@@ -170,7 +210,7 @@ async function main() {
     console.log(`→ ${job.id} [${job.at}] "${job.outName}"${ref}`);
     const t0 = Date.now();
     try {
-      await createImageIngredient(
+      const result = await createImageIngredient(
         page,
         job.outName,
         job.prompt,
@@ -182,12 +222,14 @@ async function main() {
       );
       const secs = (Date.now() - t0) / 1000;
       log.push({ ...job, ok: true, secs });
-      console.log(`  ✅ ${secs.toFixed(1)}s`);
+      console.log(`  ✅ ${secs.toFixed(1)}s${result === "existing" ? " (da co san tren Flow, khong tao lai)" : ""}`);
+      recordDaTao(shotsFile, job, result);
     } catch (e) {
       const secs = (Date.now() - t0) / 1000;
       const error = (e as Error).message;
       log.push({ ...job, ok: false, secs, error });
       console.error(`  ❌ ${error}`);
+      recordDaTao(shotsFile, job, { error });
       if (e instanceof GenerationRejectedError && e.quotaExhausted) quotaStop = true;
     }
     if (quotaStop) {
```

## Diff `scripts/review_shots.py`

```diff
diff --git a/scripts/review_shots.py b/scripts/review_shots.py
index 4172263..54fbdd4 100644
--- a/scripts/review_shots.py
+++ b/scripts/review_shots.py
@@ -12,6 +12,9 @@ sinh (chu + anh neo, hay chip @ tu asset nao), va trang thai da tao hay chua (do
 
 Ra file <file>.review.md canh file .shots.json.
 
+Trang thai: shot co truong `daTao` (do scripts/audit-shots.ts tra thang Flow roi ghi vao) thi
+lay theo truong do, khong thi theo log. Nen chay audit-shots.ts sau moi me anh.
+
 Vi sao doc prompt tu .jobs.json chu khong tu ghep lai: builder moi la noi quyet prompt that
 (noi styleByKind vao cau mention, doi {{ten}} thanh chip). Ghep lai o day la tao ban thu hai
 co the lech ban that — dung cai bay D08 cua build_image_prompts.py.
@@ -78,6 +81,37 @@ def main() -> int:
     jobs = {j["id"]: j for j in json.loads(jobs_path.read_text(encoding="utf-8"))}
     by_kind = json.loads(BY_KIND.read_text(encoding="utf-8")) if BY_KIND.exists() else {}
     status = read_status(args.log)
+    # `daTao` = truong trong tung shot (2026-09-28, scripts/lib/shotsStatus.ts). Hai noi ghi:
+    # run-shots.ts ngay sau moi shot (`nguon: run-shots`), audit-shots.ts tra THANG Flow
+    # (`nguon: audit-flow`, manh hon). Thang log; --flow-status van thang no.
+    kiem_luc = []
+    for seg in data["segments"]:
+        for s in seg["shots"]:
+            d = s.get("daTao")
+            if not d:
+                continue
+            kiem_luc.append(d.get("kiemLuc", "?"))
+            audit = d.get("nguon") == "audit-flow"
+            if d.get("ten") != s["outName"]:
+                status[s["id"]] = "🔁 ảnh trên Flow mang tên cũ — cần tạo lại"
+            elif not d.get("ok"):
+                n = d.get("soCard", 0)
+                if not audit:
+                    status[s["id"]] = "❌ lần chạy trước rơi" + (f": {cell(d['loi'][:80])}" if d.get("loi") else "")
+                else:
+                    status[s["id"]] = "⏸ chưa có trên Flow" if n == 0 else f"⚠️ trùng {n} card cùng tên trên Flow"
+            elif not d.get("promptHash"):
+                # Khong biet anh ve tu prompt nao (anh co san truoc khi co truong nay) — khong doan.
+                status[s["id"]] = ("✅ có trên Flow" if audit else "✅ đã tạo (runner báo, chưa audit)") + " · chưa rõ prompt tạo ảnh"
+            elif s["id"] in jobs and d["promptHash"] != prompt_hash(jobs[s["id"]]["prompt"]):
+                status[s["id"]] = "⚠️ có trên Flow nhưng prompt đã đổi sau khi tạo — cân nhắc tạo lại"
+            else:
+                status[s["id"]] = "✅ có trên Flow" if audit else "✅ đã tạo (runner báo, chưa audit)"
+            if d.get("khopCat") and status[s["id"]].startswith("✅"):
+                # Audit chi khop duoc qua nhan bi Flow cat bang dau ba cham — khong chac chan (D03).
+                status[s["id"]] += " · khớp qua nhãn bị cắt, xem ảnh audit"
+    if kiem_luc:
+        args.log.append(f"trường `daTao` trong {shots_path.name}, kiểm Flow lúc {max(kiem_luc)[:16].replace('T', ' ')} UTC")
     if args.flow_status:
         fs_data = json.loads(Path(args.flow_status).read_text(encoding="utf-8"))
         # Flow tra theo TEN CARD. Shot da doi outName (vd bo net mat khong nguon, luong
```

## Diff `image-prompts/SPEC-v2.md`

```diff
diff --git a/image-prompts/SPEC-v2.md b/image-prompts/SPEC-v2.md
index 38ea0ea..2834180 100644
--- a/image-prompts/SPEC-v2.md
+++ b/image-prompts/SPEC-v2.md
@@ -376,6 +376,7 @@ prompt trước khi chạy: `python scripts/review_shots.py <file>.shots.json --
 | `shots[].anhSeRaHash` | | sha1 (12 ký tự đầu) của prompt nguyên văn trong `.jobs.json` lúc viết `anhSeRa`; lệch thì bản review báo mô tả đã cũ |
 | `shots[].canSoi` | | rủi ro đã biết, cần soi khi ra ảnh |
 | `shots[].choTuLieu` | | lý do shot **chưa được chạy** vì thiếu ảnh tư liệu đối chiếu (skill 4d-bis phần 2) |
+| `shots[].daTao` | | **MÁY GHI, đừng gõ tay.** Ảnh của shot đã có trên Flow chưa — `run-shots.ts` ghi sau mỗi shot, `audit-shots.ts` ghi khi tra thẳng Flow. Xem 5e |
 
 Và ở cấp file, cạnh `styleBlock`:
 
@@ -424,6 +425,54 @@ Bộ kiểm phải cài đúng luật này: `A1-13` có `kind: "character"` và
 
 ---
 
+### 5e. `daTao` — ảnh đã tạo chưa (Tú yêu cầu 2026-09-28)
+
+Trường duy nhất trong `.shots.json` do **máy ghi**. Người viết prompt không gõ tay, không xoá.
+Kiểu và luật ghi nằm ở `scripts/lib/shotsStatus.ts`.
+
+```json
+"daTao": {
+  "ok": true,
+  "soCard": 1,
+  "ten": "Stone End Terrace House With Tall Gable Chimney",
+  "promptHash": "13347acb1c73",
+  "kiemLuc": "2026-09-28T00:09:15.857Z",
+  "nguon": "audit-flow"
+}
+```
+
+| Trường | Nghĩa |
+| --- | --- |
+| `ok` | `true` = ảnh đã có trên Flow dưới tên `ten`. Với audit: có **đúng một** card mang tên đó — trùng tên (`soCard` > 1) là `false`, vì chip `@` có thể đính nhầm |
+| `soCard` | số card mang **đúng nguyên** tên đó. `0` = chưa có, `>1` = trùng tên (chip `@` có thể đính nhầm). Chỉ audit đếm được, runner không ghi |
+| `ten` | `outName` lúc ghi. **Lệch `outName` hiện tại** = ảnh trên Flow mang tên cũ, cần tạo lại |
+| `promptHash` | sha1 (12 ký tự đầu) của prompt **đã sinh ra ảnh**. **Lệch prompt hiện tại** = ảnh là của prompt cũ. **Chỉ runner ghi được** (lúc vừa tạo); không biết thì **để trống** — bản review hiện "chưa rõ prompt tạo ảnh" |
+| `kiemLuc` | lúc ghi, ISO, giờ UTC |
+| `nguon` | `run-shots` hoặc `audit-flow` |
+| `loi` | lý do rơi, khi runner báo ❌ |
+| `khopCat` | `true` khi audit chỉ khớp được qua **nhãn bị Flow cắt bằng dấu ba chấm** (RUNBOOK, mục "Ba điều về UI phải biết trước khi sửa `typeMentionPrompt`", điều 2) — không chắc chắn vì tên khác chung phần đầu cũng khớp; xem ảnh audit. Khớp nguyên văn vẫn là đường chính (luồng `img-pipeline-datao` D03) |
+
+**Hai nơi ghi, độ tin khác nhau:**
+
+- `scripts/run-shots.ts` ghi **ngay sau mỗi shot**, nên mẻ dừng giữa chừng vẫn giữ phần đã xong. Runner biết chắc
+  prompt vừa gửi nên `promptHash` của nó là dấu thật. Nhưng nó chỉ tra tên theo **chuỗi con**
+  (`assertAssetNamed`), không đếm được trùng tên.
+- `scripts/audit-shots.ts --jobs <.jobs.json> --project <khoá>` **tra thẳng Flow**, đếm card mang đúng nguyên tên,
+  tải ảnh từng shot về để xem bằng mắt. Nó bắt được thứ log không biết: ảnh tạo tay, card bị đổi tên về sau,
+  tên đặt nhầm lên ảnh khác (sự cố 2026-09-25). **Chạy sau mỗi mẻ.**
+
+**Dấu prompt không bao giờ được "hợp thức hoá" ảnh cũ.** Shot bị bỏ qua vì Flow đã có ảnh cùng tên
+(`createImageIngredient` trả `"existing"`) có thể là ảnh vẽ từ prompt cũ. Nên runner và audit **giữ nguyên**
+`promptHash` khi `daTao` đã xác nhận cùng tên, và **chưa có dấu thì để trống** — không bao giờ lấy prompt hiện tại
+thế vào (luồng `img-pipeline-datao` D04). Chỉ nhánh `created` của runner mới đặt dấu. Runner báo ❌ cho shot đã xác
+nhận thì cũng để nguyên, vì ảnh vẫn nằm trên Flow.
+
+`review_shots.py` lấy cột trạng thái từ `daTao` trước, không có mới theo log. Nó hiện `✅ có trên Flow`
+(audit), `✅ đã tạo (runner báo, chưa audit)` (hai trạng thái này kèm `· chưa rõ prompt tạo ảnh` khi không có `promptHash`), `🔁 … cần tạo lại`, `⚠️ … prompt đã đổi`, `⚠️ trùng N card`,
+`⏸ chưa có`, hoặc `❌ lần chạy trước rơi`.
+
+⚠️ `ok: true` chỉ chứng minh **tên** có trên Flow, không chứng minh ảnh đúng nội dung. Vẫn phải xem ảnh.
+
 ## 6. Cái gì đổi trong code
 
 - `build_image_prompts.py` đọc `.shots.json`; kiểm `cue` theo 5b; suy `at` từ
```

## File mới `scripts/lib/shotsStatus.ts`

```ts
/**
 * Trường `daTao` trong từng shot của `.shots.json` — "ảnh của shot này đã tạo được chưa"
 * (Tú yêu cầu 2026-09-28). Hai nơi ghi, dùng chung module này:
 *
 * - `scripts/run-shots.ts` ghi NGAY sau mỗi shot (`nguon: "run-shots"`). Runner biết chắc prompt
 *   nào vừa gửi, nên `promptHash` của nó là dấu thật của ảnh — nhưng nó chỉ tra tên theo CHUỖI
 *   CON (`assertAssetNamed`), nên không ghi `soCard`.
 * - `scripts/audit-shots.ts` tra THẲNG Flow, đếm card mang ĐÚNG NGUYÊN tên (`nguon: "audit-flow"`).
 *   Mạnh hơn: bắt được card bị đổi tên về sau, ảnh tạo tay, tên trùng.
 *
 * `review_shots.py` đọc trường này làm cột trạng thái.
 */
import fs from "node:fs";
import crypto from "node:crypto";

export type DaTao = {
  /**
   * true = ảnh đã có trên Flow dưới tên `ten`. Với audit: có ĐÚNG MỘT card mang tên đó — trùng tên
   * (`soCard` > 1) là `false`, vì chip `@` của shot sau có thể đính nhầm card.
   */
  ok: boolean;
  /** Số card mang ĐÚNG NGUYÊN tên — chỉ audit-shots.ts đếm được. 0 = chưa có, >1 = trùng. */
  soCard?: number;
  /** outName lúc ghi. Lệch outName hiện tại = ảnh trên Flow mang tên cũ, cần tạo lại. */
  ten: string;
  /**
   * sha1[:12] của prompt đã sinh ra ảnh. Lệch prompt hiện tại = ảnh là của prompt cũ. CHỈ runner ghi
   * được (nhánh `created`); không biết thì để trống, không lấy prompt hiện tại thế vào.
   */
  promptHash?: string;
  kiemLuc: string;
  nguon: "run-shots" | "audit-flow";
  /** Lý do rơi, khi runner báo ❌. */
  loi?: string;
  /**
   * Audit chỉ khớp được qua nhãn bị Flow CẮT bằng dấu ba chấm (`matchLabel` trả `"cat"`) — `ok` không chắc
   * chắn, tên khác chung phần đầu cũng khớp. Xem bằng mắt ảnh audit tải về.
   */
  khopCat?: true;
};

/** Cùng công thức với `prompt_hash` trong review_shots.py. */
export const promptHash = (prompt: string): string =>
  crypto.createHash("sha1").update(prompt, "utf8").digest("hex").slice(0, 12);

/** `.shots.json` nằm cạnh `.jobs.json`, hoặc `undefined` nếu không có (jobs viết tay kiểu cũ). */
export function shotsFileFor(jobsFile: string): string | undefined {
  const f = jobsFile.replace(/\.jobs\.json$/, ".shots.json");
  return f !== jobsFile && fs.existsSync(f) ? f : undefined;
}

/**
 * Đọc–sửa–ghi `daTao` của các shot có trong `updates`. `update(prev)` trả `undefined` = để nguyên.
 * GIỮ NGUYÊN định dạng file (thụt 2 dấu cách, kiểu xuống dòng, có/không dòng trống cuối) để diff
 * chỉ là các dòng `daTao`. Trả số shot đã ghi.
 */
export function writeDaTao(
  shotsFile: string,
  updates: Map<string, (prev: DaTao | undefined) => DaTao | undefined>
): number {
  const raw = fs.readFileSync(shotsFile, "utf-8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const data = JSON.parse(raw);
  let written = 0;
  for (const seg of data.segments ?? []) {
    for (const s of seg.shots ?? []) {
      const update = updates.get(s.id);
      if (!update) continue;
      const next = update(s.daTao);
      if (!next) continue;
      s.daTao = next;
      written++;
    }
  }
  if (!written) return 0;
  let out = JSON.stringify(data, null, 2).replace(/\n/g, eol);
  if (/\r?\n$/.test(raw)) out += eol;
  fs.writeFileSync(shotsFile, out, "utf-8");
  return written;
}

/**
 * Nhãn một dòng bảng chọn có phải card `name` không.
 *
 * - `"exact"`: nhãn (bỏ đuôi loại media) bằng ĐÚNG NGUYÊN tên — đường chính.
 * - `"cat"`: nhãn bị Flow CẮT bằng dấu ba chấm và tên bắt đầu bằng phần còn lại. RUNBOOK mục
 *   "Ba điều về UI phải biết trước khi sửa typeMentionPrompt", điều 2: `09-half-moon-hotel-1927-cihp__claude.jpg`
 *   hiện thành `09-half-moon-hotel-192…`. Đo 2026-09-28/10-09: tên card nhiều chữ (tới 47 ký tự) KHÔNG bị cắt
 *   (85/85 + 77/77 khớp nguyên văn) — có vẻ chỉ tên file dài liền một chữ. Khớp kiểu này KHÔNG chắc chắn (hai tên
 *   chung phần đầu đều khớp), nên được đếm nhưng gắn cờ `khopCat` (luồng img-pipeline-datao D03, Tú quyết 2026-10-09).
 *
 * Không khớp chuỗi con, không khớp tiền tố khi nhãn KHÔNG bị cắt — đó đúng là lỗi tên này là phần đầu tên kia.
 */
export function matchLabel(rowText: string, name: string): "exact" | "cat" | null {
  const t = rowText.replace(/\s+/g, " ").replace(/ Image$/, "").trim();
  if (t === name) return "exact";
  const cut = t.match(/^(.*?)\s*(?:…|\.\.\.)$/);
  if (cut && cut[1].length >= 8 && name.startsWith(cut[1])) return "cat";
  return null;
}
```

## File mới `scripts/audit-shots.ts`

```ts
/**
 * TRA THẲNG FLOW xem mỗi shot đã có ảnh chưa, rồi GHI KẾT QUẢ vào trường `daTao` của từng shot
 * trong `.shots.json` (Tú yêu cầu 2026-09-28: "thêm tham số trong json để xác nhận được ảnh đó
 * tạo được chưa").
 *
 *   npx tsx scripts/audit-shots.ts --jobs narration-scripts/<tap>/case-N/case-N.jobs.json --project <khoa>
 *   ... --only C1-04c,C1-42b     chỉ kiểm vài shot (các shot khác giữ nguyên `daTao` cũ)
 *   ... --out output/audit-x     thư mục lưu ảnh từng shot (mặc định output/audit-<khoa>/)
 *
 * VÌ SAO KHÔNG TIN LOG CỦA run-shots.ts: log chỉ nói "lần chạy đó báo ✅". Nó không biết ảnh tạo
 * tay trên Flow, card bị đổi tên về sau, hay tên đặt nhầm lên ảnh khác (sự cố thật 2026-09-25:
 * runner báo ✅ nhưng 5 card cũ bị đổi tên nhầm). Script này tra đúng bằng ô "Search assets" —
 * cơ chế mà chip `@` của shot sau sẽ dùng — và đếm card mang ĐÚNG NGUYÊN tên (không khớp chuỗi
 * con như `assertAssetNamed`, nên tên là tiền tố của tên khác không lọt). Ngoại lệ duy nhất: nhãn
 * bị Flow CẮT bằng dấu ba chấm thì khớp theo phần còn lại và gắn cờ `khopCat` — xem `matchLabel`
 * trong scripts/lib/shotsStatus.ts (luồng img-pipeline-datao D03).
 *
 * Trường ghi vào mỗi shot (kiểu `DaTao` trong scripts/lib/shotsStatus.ts):
 *   "daTao": {
 *     "ok": true,              // true CHỈ KHI có đúng 1 card mang đúng nguyên tên `ten`
 *     "soCard": 1,             // 0 = chưa có; >1 = trùng tên, chip `@` sẽ đính nhầm được
 *     "ten": "<outName lúc kiểm>",
 *     "promptHash": "<sha1[:12] prompt đã sinh ra ảnh>",   // CHỈ khi runner đã ghi lúc tạo; audit không tự đặt
 *     "khopCat": true,         // chỉ có khi khớp qua nhãn bị cắt — không chắc chắn
 *     "kiemLuc": "<ISO>",
 *     "nguon": "audit-flow"
 *   }
 * `run-shots.ts` cũng ghi trường này ngay sau mỗi shot (`nguon: "run-shots"`); script này ghi đè
 * bằng kết quả tra thẳng Flow. `review_shots.py` đọc nó: `ten` lệch `outName` hiện tại → cần tạo
 * lại; `promptHash` lệch prompt hiện tại → ảnh trên Flow là của prompt cũ.
 *
 * ⚠️ `ok: true` chỉ chứng minh TÊN có trên Flow, không chứng minh ảnh đúng nội dung. Ảnh của
 * từng shot được lưu vào `--out` — vẫn phải xem bằng mắt.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "../src/config.js";
import { launchVeo3Browser } from "../src/veo3bot/browser.js";
import { ensureProject, ASSET_PICKER_SELECTOR, dismissOverlays } from "../src/veo3bot/project.js";
import { matchLabel, shotsFileFor, writeDaTao, type DaTao } from "./lib/shotsStatus.js";

type Job = { id: string; outName: string; prompt: string };

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const jobsFile = arg("--jobs");
  const projectKey = arg("--project");
  if (!jobsFile || !projectKey) {
    console.error("Cần --jobs <.jobs.json> và --project <khoá project Flow>.");
    process.exit(2);
  }
  // ensureProject TẠO PROJECT MỚI khi khoá lạ — gõ sai khoá sẽ ra một project rỗng và báo mọi
  // shot "chưa có". Chỉ kiểm project đã có state.
  const stateFile = path.join(config.stateDir, `project-${projectKey.replace(/[^\w.-]+/g, "-")}.json`);
  if (!fs.existsSync(stateFile)) {
    console.error(`Không có ${stateFile} — khoá project "${projectKey}" chưa từng chạy. Kiểm lại khoá.`);
    process.exit(2);
  }
  const shotsFile = shotsFileFor(jobsFile);
  if (!shotsFile) {
    console.error(`Không thấy .shots.json cạnh ${jobsFile} — không có chỗ ghi \`daTao\`.`);
    process.exit(2);
  }

  const only = arg("--only")?.split(",").map((s) => s.trim()).filter(Boolean);
  let jobs: Job[] = JSON.parse(fs.readFileSync(jobsFile, "utf-8"));
  if (only) {
    const missing = only.filter((id) => !jobs.some((j) => j.id === id));
    if (missing.length) {
      console.error(`--only có id không nằm trong ${jobsFile}: ${missing.join(", ")}`);
      process.exit(2);
    }
    jobs = jobs.filter((j) => only.includes(j.id));
  }
  const outDir = arg("--out") ?? path.join("output", `audit-${projectKey}`);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  await ensureProject(page, projectKey);
  await page.waitForTimeout(3000);

  const kiemLuc = new Date().toISOString();
  const found = new Map<string, { soCard: number; saved: boolean; cat: boolean }>();
  for (const j of jobs) {
    await dismissOverlays(page);
    await page.locator(ASSET_PICKER_SELECTOR).first().click({ timeout: 15000 });
    await page.waitForTimeout(1000);
    const search = page.getByRole("textbox", { name: /search assets/i }).first();
    await search.fill(j.outName);
    await page.waitForTimeout(2500);
    const rows = page.locator('.cdk-overlay-container [role="option"]');
    const n = await rows.count();
    const hits: number[] = [];
    let cat = false;
    for (let i = 0; i < n; i++) {
      const kind = matchLabel(await rows.nth(i).innerText(), j.outName);
      if (!kind) continue;
      hits.push(i);
      if (kind === "cat") cat = true;
    }
    let saved = false;
    if (hits.length) {
      const src = await rows.nth(hits[0]).locator("img").first().getAttribute("src").catch(() => null);
      if (src) {
        const res = await page.request.get(new URL(src, new URL(page.url()).origin).toString());
        if (res.ok()) {
          fs.writeFileSync(path.join(outDir, `${j.id}.png`), await res.body());
          saved = true;
        }
      }
    }
    found.set(j.id, { soCard: hits.length, saved, cat });
    const tag = hits.length === 1 ? (cat ? "CAT  " : "OK   ") : hits.length ? "TRUNG" : "MAT  ";
    console.log(
      `${tag} ${j.id} x${hits.length} ${j.outName}${cat ? " (khớp qua nhãn bị cắt — không chắc chắn)" : ""}` +
        `${hits.length && !saved ? " (không tải được ảnh)" : ""}`
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }
  await context.close();

  const updates = new Map<string, (prev: DaTao | undefined) => DaTao>();
  for (const j of jobs) {
    const r = found.get(j.id)!;
    const ok = r.soCard === 1;
    updates.set(j.id, (prev) => {
      // `promptHash` = prompt đã sinh ra ảnh — chỉ runner biết (nhánh `created`). Audit KHÔNG BAO
      // GIỜ tự đặt dấu: lần kiểm này thấy vẫn cùng card thì giữ dấu cũ; chưa có dấu thì để trống.
      // Lấy prompt hiện tại thế vào sẽ lặng lẽ "hợp thức hoá" ảnh vẽ từ prompt cũ (luồng
      // img-pipeline-datao D04).
      const keepHash = ok && prev?.ok && prev.ten === j.outName ? prev.promptHash : undefined;
      return {
        ok,
        soCard: r.soCard,
        ten: j.outName,
        ...(keepHash ? { promptHash: keepHash } : {}),
        ...(r.cat ? { khopCat: true as const } : {}),
        kiemLuc,
        nguon: "audit-flow",
      };
    });
  }
  const written = writeDaTao(shotsFile, updates);

  const ok = [...found.values()].filter((r) => r.soCard === 1).length;
  console.log(`\nKhớp đúng 1 card: ${ok}/${found.size}. Đã ghi \`daTao\` cho ${written} shot vào ${shotsFile}`);
  console.log(`Ảnh từng shot (xem bằng mắt): ${outDir}`);
  process.exit(ok === found.size ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

