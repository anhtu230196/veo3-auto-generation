import { config } from "../config.js";

export interface Scene {
  index: number;
  text: string;
}

const WORDS_PER_SECOND = 2.5; // tốc độ đọc trung bình ~150 từ/phút

/**
 * Chia truyện thành các "cảnh" theo số từ ước lượng khớp config.clipSeconds.
 * Ưu tiên cắt tại ranh giới câu để cảnh không bị đứt giữa câu.
 */
export function splitIntoScenes(storyText: string): Scene[] {
  const targetWords = Math.round(config.clipSeconds * WORDS_PER_SECOND);
  const sentences = storyText
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const scenes: Scene[] = [];
  let currentWords: string[] = [];

  const flush = () => {
    if (currentWords.length === 0) return;
    scenes.push({ index: scenes.length, text: currentWords.join(" ") });
    currentWords = [];
  };

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    if (words.length > targetWords * 1.6) {
      // câu quá dài: cắt theo từ, không quan tâm ranh giới câu
      for (const w of words) {
        currentWords.push(w);
        if (currentWords.length >= targetWords) flush();
      }
      continue;
    }

    if (currentWords.length + words.length > targetWords * 1.3 && currentWords.length > 0) {
      flush();
    }
    currentWords.push(...words);
    if (currentWords.length >= targetWords) flush();
  }
  flush();

  return scenes;
}
