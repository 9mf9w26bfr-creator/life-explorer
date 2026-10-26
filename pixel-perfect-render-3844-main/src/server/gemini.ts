import { env } from "../env";

export type AiReflectionRequest = {
  userEmail: string;
  dateKey: string;
  tarotCard: string;
  tarotOrientation: string;
  dominoTile: string;
  dominantElement?: string | undefined;
  zodiac?: string | undefined;
};

/**
 * Call Google Gemini API to produce an AI reflection based on user profile and daily cards.
 * Strictly respects the project constitution:
 * 1. Clearly marked as Entertainment / Cultural reflection.
 * 2. NO deterministic predictions (no lifespan, no medical diagnosis, no wealth guarantees).
 */
export async function generateGeminiReflection(req: AiReflectionRequest): Promise<string> {
  const apiKey = env.GEMINI_API_KEY;

  const fallbackReflection = `【AI 今日生活哲学感悟】\n\n今日抽取塔罗牌「${req.tarotCard}（${req.tarotOrientation}）」与骨牌「${req.dominoTile}」，交织出「向内观照与从容沉淀」的主基调。\n\n在快节奏的生活中，传统智慧常提醒我们：万物皆有其时节与生发节奏。不必为一时的停顿焦虑，亦不必因偶得之顺遂而自满。将精力聚焦于当下可感知、可行动的具体事物，以温和而坚韧的态度对待身边的人与事。\n\n（*免责声明：本内容由 AI 结合传统文化与娱乐解读生成，仅供个人心境调节与自我探索参考，不构成任何医疗诊断、财务承诺或宿命论预测。*）`;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.log(
      "[Gemini AI] No GEMINI_API_KEY configured; returning constitutional fallback reflection.",
    );
    return fallbackReflection;
  }

  const prompt = `
You are the AI Reflection Engine for "Life Explorer" (个人综合人生探索平台).
Project Constitution Rules:
1. Output is for Entertainment / Cultural reflection only.
2. STRICTLY PROHIBITED: Deterministic predictions of future events, lifespan predictions, medical/psychological diagnoses, or guarantees of wealth or relationship success.
3. Language: Bilingual (Chinese followed by a brief English summary).

Input context for user today (${req.dateKey}):
- Daily Tarot Card: ${req.tarotCard} (${req.tarotOrientation})
- Electronic Domino: ${req.dominoTile}
${req.dominantElement ? `- Dominant Five Element: ${req.dominantElement}` : ""}
${req.zodiac ? `- Chinese Zodiac: ${req.zodiac}` : ""}

Task:
Write an uplifting, thoughtful 3-paragraph personal reflection for today. 
Integrate the symbolic lessons of the cards with daily mindfulness.
Close with the mandatory disclaimer:
"本内容为自我探索与娱乐参考，不构成医学、心理诊断或确定性预测。/ For self-reflection and entertainment only."
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!response.ok) {
      console.warn(
        `[Gemini AI] Request failed with HTTP ${response.status}. Using constitutional fallback.`,
      );
      return fallbackReflection;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText && typeof candidateText === "string") {
      return candidateText.trim();
    }

    return fallbackReflection;
  } catch (err) {
    console.warn("[Gemini AI] Network error calling Gemini API:", (err as Error).message);
    return fallbackReflection;
  }
}
