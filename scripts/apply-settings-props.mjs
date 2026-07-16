// Script một lần: gắn settingNames/propNames vào các cảnh liên quan trong state/prompts.json
// đã viết sẵn (168 cảnh), dựa trên state/settings.json + state/props.json vừa tạo.
//
// Chạy: node scripts/apply-settings-props.mjs

import fs from "node:fs";

const PROMPTS_PATH = "./state/prompts.json";

const SETTING_MAP = {
  "Santa María Deck": [6, 7, 10, 12, 50, 64, 67, 98],
  "Pinta Deck": [1, 2, 3, 4, 77, 78, 81, 161, 162],
  "Spanish Royal Court Hall": [29, 30, 31, 38, 42, 45, 82, 83, 84, 113],
  "La Navidad Fort": [108, 109, 116, 117, 119, 120, 121, 163],
};

const PROP_MAP = {
  "Santa María": [53, 56, 102, 103, 105],
  Pinta: [54],
  "Niña": [55, 62, 110],
  "Spanish Royal Banner": [37, 93],
};

function buildIndexToNames(map) {
  const result = new Map();
  for (const [name, indices] of Object.entries(map)) {
    for (const i of indices) {
      if (!result.has(i)) result.set(i, []);
      result.get(i).push(name);
    }
  }
  return result;
}

const settingByIndex = buildIndexToNames(SETTING_MAP);
const propByIndex = buildIndexToNames(PROP_MAP);

const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf-8"));

let settingsApplied = 0;
let propsApplied = 0;

for (const p of prompts) {
  const settingNames = settingByIndex.get(p.index);
  if (settingNames) {
    p.settingNames = settingNames;
    settingsApplied++;
  } else if (p.settingNames === undefined) {
    p.settingNames = [];
  }

  const propNames = propByIndex.get(p.index);
  if (propNames) {
    p.propNames = propNames;
    propsApplied++;
  } else if (p.propNames === undefined) {
    p.propNames = [];
  }
}

fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2) + "\n");

console.log(`Đã gắn settingNames cho ${settingsApplied} cảnh.`);
console.log(`Đã gắn propNames cho ${propsApplied} cảnh.`);
