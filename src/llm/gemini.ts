import { config } from "../config.js";

// "gemini-flash-latest" (→ gemini-3.5-flash) chỉ có 20 request/ngày free tier — hết quota
// ngay khi test. "gemini-flash-lite-latest" còn quota rộng hơn, xác nhận trực tiếp.
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_RETRIES = 3;

/** Index key đang dùng — giữ ở module scope để các lần gọi sau tiếp tục dùng key đã chuyển. */
let activeKeyIndex = 0;

function extractRetryDelayMs(errorBody: string): number {
  const match = errorBody.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
  return match ? Math.ceil(parseFloat(match[1]) * 1000) : 10000;
}

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string) {
  return fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    }),
  });
}

/**
 * Gọi Gemini API (free tier) với 1 system prompt + 1 user prompt, trả về text thô.
 * Free tier có quota rất hẹp theo phút/ngày tuỳ model:
 * - Lỗi 429 theo PHÚT: tự retry theo retryDelay Google trả về.
 * - Lỗi 429 theo NGÀY (hết quota key hiện tại): tự chuyển sang key kế tiếp trong
 *   config.geminiApiKeys (nếu còn), không cần restart script.
 */
export async function generateText(systemPrompt: string, userPrompt: string): Promise<string> {
  for (let keyAttempt = activeKeyIndex; keyAttempt < config.geminiApiKeys.length; keyAttempt++) {
    const apiKey = config.geminiApiKeys[keyAttempt];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const res = await callGemini(apiKey, systemPrompt, userPrompt);

      if (res.ok) {
        activeKeyIndex = keyAttempt;
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
        if (!text) throw new Error(`Gemini API trả về rỗng: ${JSON.stringify(data)}`);
        return text.trim();
      }

      const body = await res.text().catch(() => "");
      const isDailyQuota = body.includes("PerDayPerProject");

      if (res.status === 429 && isDailyQuota) {
        console.log(
          `[gemini] key #${keyAttempt + 1} hết quota theo ngày${keyAttempt + 1 < config.geminiApiKeys.length ? ", chuyển sang key kế tiếp..." : " — không còn key dự phòng."}`
        );
        break; // thoát vòng retry, chuyển sang key kế tiếp ở vòng ngoài
      }

      if (res.status === 429 && attempt < MAX_RETRIES) {
        const delayMs = extractRetryDelayMs(body);
        console.log(`[gemini] rate limit theo phút, thử lại sau ${delayMs}ms (lần ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw new Error(`Gemini API lỗi ${res.status}: ${body}`);
    }
  }

  throw new Error("Gemini API: tất cả key đều hết quota theo ngày. Thêm key mới vào GEMINI_API_KEY trong .env.");
}
