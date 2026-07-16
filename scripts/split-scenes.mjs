// Script độc lập, KHÔNG cần npm install — chỉ dùng Node core, để tách input/story.txt
// thành state/scenes.json với ĐÚNG logic của src/splitter/scenes.ts, giúp Claude viết
// state/prompts.json khớp đúng ranh giới cảnh mà orchestrator.ts mong đợi (không cần
// gọi Gemini để làm việc này).
//
// Chạy: node scripts/split-scenes.mjs

import fs from "node:fs";
import path from "node:path";

const CLIP_SECONDS = Number(process.env.CLIP_SECONDS ?? 7);
const WORDS_PER_SECOND = 2.5;

function splitIntoScenes(storyText) {
  const targetWords = Math.round(CLIP_SECONDS * WORDS_PER_SECOND);
  const sentences = storyText
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const scenes = [];
  let currentWords = [];

  const flush = () => {
    if (currentWords.length === 0) return;
    scenes.push({ index: scenes.length, text: currentWords.join(" ") });
    currentWords = [];
  };

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    if (words.length > targetWords * 1.6) {
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

const storyPath = process.env.STORY_INPUT_PATH ?? "./input/story.txt";
const storyText = fs.readFileSync(storyPath, "utf-8");
const scenes = splitIntoScenes(storyText);

fs.mkdirSync("./state", { recursive: true });
fs.writeFileSync("./state/scenes.json", JSON.stringify(scenes, null, 2));

console.log(`Đã tách ${scenes.length} cảnh từ ${storyPath} -> state/scenes.json`);
