import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type { Scene } from "../splitter/scenes.js";

const ELEVENLABS_MAX_CHARS = 4500; // biên an toàn dưới giới hạn request của ElevenLabs

/** Chia văn bản dài thành các đoạn <= maxChars, ưu tiên cắt tại ranh giới câu. */
export function chunkText(text: string, maxChars = ELEVENLABS_MAX_CHARS): string[] {
  const sentences = text.split(/(?<=[.!?…])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length > maxChars && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + " " + sentence).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function ttsChunk(text: string): Promise<Buffer> {
  if (!config.elevenLabsApiKey || !config.elevenLabsVoiceId) {
    throw new Error("Thiếu ELEVENLABS_API_KEY hoặc ELEVENLABS_VOICE_ID (xem .env.example).");
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${config.elevenLabsVoiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": config.elevenLabsApiKey,
        "Content-Type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs TTS lỗi ${res.status}: ${body}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Chuyển toàn bộ truyện thành audio. Trả về đường dẫn từng file mp3 đoạn
 * (chưa ghép — việc ghép audio + video làm ở bước assembler).
 */
export async function synthesizeStory(storyText: string, outDir: string): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });
  const chunks = chunkText(storyText);
  const files: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const audio = await ttsChunk(chunks[i]);
    const filePath = path.join(outDir, `audio_${String(i).padStart(3, "0")}.mp3`);
    await fs.writeFile(filePath, audio);
    files.push(filePath);
    console.log(`[tts] đã tạo ${filePath} (${chunks[i].length} ký tự)`);
  }
  return files;
}

/**
 * Tạo audio riêng cho từng cảnh (khớp với từng clip video ~7-8s), để assembler
 * ghép clip[i] + audio[i] chính xác theo thứ tự, thay vì audio liền mạch toàn truyện.
 */
export async function synthesizeScenes(scenes: Scene[], outDir: string): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });
  const files: string[] = [];

  for (const scene of scenes) {
    const filePath = path.join(outDir, `audio_${String(scene.index).padStart(3, "0")}.mp3`);
    const alreadyDone = await fs.access(filePath).then(() => true).catch(() => false);
    if (alreadyDone) {
      files.push(filePath);
      continue;
    }
    const audio = await ttsChunk(scene.text);
    await fs.writeFile(filePath, audio);
    files.push(filePath);
    console.log(`[tts] đã tạo ${filePath} (cảnh #${scene.index})`);
  }
  return files;
}
