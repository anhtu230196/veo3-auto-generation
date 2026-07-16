import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

/** true nếu outFile chưa tồn tại, hoặc cũ hơn bất kỳ file nào trong sourceFiles. */
async function isOutputStale(outFile: string, sourceFiles: string[]): Promise<boolean> {
  const outStat = await fs.stat(outFile).catch(() => null);
  if (!outStat) return true;
  for (const src of sourceFiles) {
    const srcStat = await fs.stat(src).catch(() => null);
    if (srcStat && srcStat.mtimeMs > outStat.mtimeMs) return true;
  }
  return false;
}

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: "inherit" });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} thoát với mã ${code}`));
    });
  });
}

async function ffprobeDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(parseFloat(out.trim()));
      else reject(new Error(`ffprobe thoát với mã ${code}`));
    });
  });
}

/**
 * Mux 1 clip video với 1 audio.
 *
 * LỖI ĐÃ SỬA: bản cũ luôn co giãn TỐC ĐỘ video (setpts) để khớp đúng thời lượng audio.
 * Nhiều cảnh có audio (lời thoại) rất ngắn hoặc rất dài so với video (Veo3 luôn tạo
 * clip 7-8s cố định, không phụ thuộc độ dài câu thoại của cảnh đó) — vd audio 1.95s
 * ghép với video 8s bị tua NHANH GẤP 4 LẦN (giật, phi tự nhiên), hoặc audio 16s ghép
 * video 8s bị làm CHẬM GẤP 2 LẦN (lừ đừ, ngắt nghỉ sai). Đây chính là nguyên nhân
 * "âm thanh không khớp, ngắt nghỉ lạ" người dùng phát hiện khi xem lại video hoàn chỉnh.
 *
 * Cách sửa — KHÔNG đổi tốc độ phát video (giữ chuyển động tự nhiên):
 * - Nếu audio NGẮN HƠN video: CẮT BỚT video cho khớp đúng độ dài audio (-t audioDur),
 *   giữ nguyên tốc độ gốc.
 * - Nếu audio DÀI HƠN video: GIỮ ĐỨNG HÌNH CUỐI (freeze frame) của video cho đủ thời
 *   lượng audio (dùng filter tpad stop_mode=clone), thay vì làm chậm cả đoạn.
 */
async function muxSceneAudio(videoFile: string, audioFile: string, outFile: string): Promise<void> {
  const [videoDur, audioDur] = await Promise.all([
    ffprobeDuration(videoFile),
    ffprobeDuration(audioFile),
  ]);

  if (audioDur <= videoDur) {
    // Cắt video ngắn lại đúng bằng độ dài audio, tốc độ giữ nguyên.
    await run("ffmpeg", [
      "-y",
      "-i", videoFile,
      "-i", audioFile,
      "-t", audioDur.toFixed(3),
      "-map", "0:v:0",
      "-map", "1:a:0",
      "-c:v", "libx264",
      "-c:a", "aac",
      outFile,
    ]);
  } else {
    // Kéo dài video bằng cách giữ đứng hình cuối (freeze) cho đủ thời lượng audio.
    const padSeconds = (audioDur - videoDur).toFixed(3);
    await run("ffmpeg", [
      "-y",
      "-i", videoFile,
      "-i", audioFile,
      "-filter:v", `tpad=stop_mode=clone:stop_duration=${padSeconds}`,
      "-map", "0:v:0",
      "-map", "1:a:0",
      "-t", audioDur.toFixed(3),
      "-c:v", "libx264",
      "-c:a", "aac",
      outFile,
    ]);
  }
}

/**
 * Nối nhiều file video thành 1 file bằng ffmpeg concat demuxer.
 *
 * LỖI ĐÃ SỬA: dùng "-c copy" (stream copy, không giải mã lại) để nối — đây là NGUYÊN
 * NHÂN video bị "khựng"/giật nhẹ mỗi khi chuyển cảnh. Mỗi file scene_*.mp4 được mã hoá
 * RIÊNG BIỆT (từng lần chạy ffmpeg trong muxSceneAudio), nên timestamp/SPS-PPS/cấu trúc
 * B-frame giữa các file không hoàn toàn khớp nhau dù cùng codec — nối bằng stream copy
 * không giải mã lại nên không "làm phẳng" được sai khác này, khiến trình phát bị khựng/
 * lặp khung hình ngay tại mọi điểm nối. Sửa bằng cách GIẢI MÃ LẠI khi nối (bỏ "-c copy",
 * dùng codec cụ thể) — chậm hơn nhưng cho ra 1 luồng video/audio liên tục thực sự.
 */
async function concatVideos(videoFiles: string[], outFile: string, workDir: string): Promise<void> {
  const listPath = path.join(workDir, "concat_list.txt");
  const listContent = videoFiles.map((f) => `file '${path.resolve(f)}'`).join("\n");
  await fs.writeFile(listPath, listContent);

  await run("ffmpeg", [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", listPath,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "20",
    "-c:a", "aac",
    "-movflags", "+faststart",
    outFile,
  ]);
}

export interface ScenePair {
  /** Chỉ số cảnh THẬT trong truyện gốc (0..N-1) — KHÔNG phải vị trí trong mảng, vì
   * mảng có thể bị "nén" (thiếu cảnh bị Flow chặn), gây lệch nếu dùng vị trí mảng. */
  index: number;
  clipFile: string;
  /** undefined nếu bỏ qua TTS (chưa cấu hình ElevenLabs) — dùng thẳng clip gốc, không mux. */
  audioFile: string | undefined;
}

/**
 * Ghép toàn bộ pipeline: mux từng cặp (clip, audio) theo đúng CHỈ SỐ CẢNH THẬT,
 * sau đó nối tất cả thành video hoàn chỉnh theo đúng thứ tự.
 *
 * LỖI ĐÃ SỬA: bản cũ dùng VỊ TRÍ TRONG MẢNG (i trong vòng lặp) làm tên file
 * "scene_{i}.mp4" — khi có cảnh bị bỏ qua (Flow chặn), mảng clipFiles bị "nén"
 * (mất phần tử ở giữa), khiến vị trí i không còn khớp với chỉ số cảnh thật nữa.
 * Vd nếu cảnh #2, #3 bị chặn, clipFiles = [clip_000, clip_001, clip_004, ...] —
 * clipFiles[2] thực ra là NỘI DUNG cảnh #4, nhưng bị lưu nhầm thành "scene_002.mp4"!
 * Điều này làm lệch toàn bộ audio/video ở MỌI vị trí sau cảnh bị chặn đầu tiên.
 */
export async function assembleFinalVideo(pairs: ScenePair[], outputDir: string): Promise<string> {
  const muxDir = path.join(outputDir, "muxed");
  await fs.mkdir(muxDir, { recursive: true });

  const sorted = [...pairs].sort((a, b) => a.index - b.index);

  const muxedFiles: string[] = [];
  for (const { index, clipFile, audioFile } of sorted) {
    if (!audioFile) {
      // Không có audio (bỏ qua TTS) — dùng thẳng clip gốc, concatVideos phía dưới đã
      // giải mã lại nên vẫn nối liền mạch không khựng dù không qua bước mux này.
      muxedFiles.push(clipFile);
      console.log(`[assembler] cảnh #${index} không có audio — dùng clip gốc`);
      continue;
    }

    const outFile = path.join(muxDir, `scene_${String(index).padStart(3, "0")}.mp4`);
    // Không chỉ kiểm tra outFile đã tồn tại — nếu clip/audio gốc bị tạo lại SAU khi đã
    // mux (vd do sửa lỗi trùng lặp, retry cảnh bị chặn...), file mux cũ sẽ lệch audio/
    // video mà không có gì báo lỗi. Chỉ coi là "đã xong" nếu outFile MỚI HƠN cả 2 file
    // nguồn.
    const isStale = await isOutputStale(outFile, [clipFile, audioFile]);
    if (isStale) {
      await muxSceneAudio(clipFile, audioFile, outFile);
    }
    muxedFiles.push(outFile);
    console.log(`[assembler] đã mux cảnh #${index}`);
  }

  const finalPath = path.join(outputDir, "video_final.mp4");
  await concatVideos(muxedFiles, finalPath, outputDir);
  console.log(`[assembler] video hoàn chỉnh: ${finalPath}`);
  return finalPath;
}
