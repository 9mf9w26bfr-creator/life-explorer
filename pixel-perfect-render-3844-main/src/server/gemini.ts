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

export type FacePalmAnalysisRequest = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime?: string | undefined;
  birthPlace?: string | undefined;
  bazi?: {
    yearGanZhi?: string | undefined;
    monthGanZhi?: string | undefined;
    dayGanZhi?: string | undefined;
    timeGanZhi?: string | undefined;
    dominantElement?: string | undefined;
    zodiac?: string | undefined;
  } | undefined;
  faceImageBase64?: string | undefined;
  palmImageBase64?: string | undefined;
};

export type FacePalmAnalysisResult = {
  title: string;
  faceReading: string;
  palmReading: string;
  baziSynthesis: string;
  lifeAdvice: string;
  rawReport: string;
};

function parseBase64Data(dataUrl: string): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match && match[1] && match[2]) {
    return { mimeType: match[1], data: match[2] };
  }
  return null;
}

/**
 * 传统相法与生辰天元形局解析（严格隐去 AI/模型字样，纯东方传统文化易理风格）
 */
export async function analyzeFaceAndPalm(
  req: FacePalmAnalysisRequest,
): Promise<FacePalmAnalysisResult> {
  const genderTitle = req.gender === "female" ? "坤造（女）" : "乾造（男）";
  const baziDesc = req.bazi
    ? `年柱【${req.bazi.yearGanZhi || "吉"}】· 月柱【${req.bazi.monthGanZhi || "祥"}】· 日柱【${req.bazi.dayGanZhi || "安"}】· 时柱【${req.bazi.timeGanZhi || "顺"}】，五行主气属【${req.bazi.dominantElement || "和"}】，生肖属【${req.bazi.zodiac || "灵"}】`
    : `公历生辰：${req.birthDate} ${req.birthTime || ""}`;

  // 经典东方易理神相分析基准（无网络或离线保底库）
  const fallbackFace =
    "天庭饱满开阔，日月角隐现清朗之气，主早年思维开阔，受长辈与师长提携之缘深厚；眉清目秀，印堂平正宽广无杂纹，表心胸开朗，行事富有分寸与包容力。鼻梁端正挺拔，准头丰隆，兰台廷尉分明，主中年前后事业有厚积薄发之势；人中深长，地阁方圆敦厚，预示晚境安和沉静，福泽绵长。";
  const fallbackPalm =
    "掌色红润温润，掌丘丰盈起伏有致。天纹（感情线）深秀修长直达食指巽宫，示重情守诺，人际关系真诚融洽；人纹（智慧线）下行弧度流畅微垂，主逻辑思维与艺术直觉兼备，善化繁为简破局；地纹（生命线）环抱大鱼际深长有力，根基稳固，身心复原力与续航韧性极强；玉柱纹（事业主线）自掌根升腾直指中指，主一生多得机缘，步步为营。";
  const fallbackSynthesis = `本命${genderTitle}，${baziDesc}。生辰四柱干支与神相形局互为经纬：面相气色与掌中纹理相映成辉，五行之气流转顺畅，外显和润之态，内蓄坚韧之质。形局与命造相互滋养，纵遇偶有波折，亦能化险为夷，厚积成势。`;
  const fallbackAdvice =
    "宜常养‘温良恭俭让’之德，遇纷扰事以退为进，不争一时之短长；日常多亲近山水自然以舒展肝木，居处案头保持清爽明亮。饮食起居守常度，心安则气平，气平则神定，福德自随。";

  const defaultResult: FacePalmAnalysisResult = {
    title: "天元象数 · 传统五行神相与生辰八字深度参验报告",
    faceReading: fallbackFace,
    palmReading: fallbackPalm,
    baziSynthesis: fallbackSynthesis,
    lifeAdvice: fallbackAdvice,
    rawReport: `【五官三停神相辨析】\n${fallbackFace}\n\n【掌纹天地人三才推演】\n${fallbackPalm}\n\n【四柱八字形命会通】\n${fallbackSynthesis}\n\n【修身进德研几规箴】\n${fallbackAdvice}`,
  };

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.log(
      "[Physiognomy Engine] No GEMINI_API_KEY; using classical constitutional physiognomy synthesis.",
    );
    return defaultResult;
  }

  try {
    const parts: any[] = [];

    // 若上传了面相图片
    if (req.faceImageBase64) {
      const parsedFace = parseBase64Data(req.faceImageBase64);
      if (parsedFace) {
        parts.push({
          inlineData: {
            mimeType: parsedFace.mimeType,
            data: parsedFace.data,
          },
        });
      }
    }

    // 若上传了手相图片
    if (req.palmImageBase64) {
      const parsedPalm = parseBase64Data(req.palmImageBase64);
      if (parsedPalm) {
        parts.push({
          inlineData: {
            mimeType: parsedPalm.mimeType,
            data: parsedPalm.data,
          },
        });
      }
    }

    // 严禁透露 AI 工具痕迹，完全以传统神相易学大家视角输出
    const promptText = `
你是一位精研中国传统相法（麻衣神相、柳庄相法、五行形局）与生辰天元干支数理的国学学者。
请结合来访者提供的面相照片、手相照片以及生辰八字信息，出具一份高雅、深刻、严谨且富有东方哲理的五行神相深度参验报告。

来访者天元生辰信息：
- 称谓/姓名：${req.name}
- 命造格局：${genderTitle}
- 生辰信息：${baziDesc}
- 出生地点：${req.birthPlace || "未详"}

严格要求：
1. 绝对严禁出现任何“AI”、“人工智能”、“Gemini”、“语言模型”、“算法”、“照片清晰度不足无法识别”等现代词汇！完全以传统易学长者、国学神相学者的庄严沉稳笔触输出。
2. 即使照片有光线或角度偏差，也当根据传统“察神采、观骨相、辨三才”之法，从气韵、五行生克角度予以积极端庄的深度品评。
3. 请严格按照以下 4 个部分输出，标题清晰：
   【五官三停神相辨析】：深入剖析天庭、印堂、眉眼、鼻准、地阁等五岳三停之气色与五行形相格局。
   【掌纹天地人三才推演】：细致解读天纹（感情）、人纹（智慧）、地纹（生命）三大主线走势及掌丘气象。
   【四柱八字形命会通】：融合生辰四柱五行盛衰，剖析形局与命数的相生互补之机，点拨心性禀赋。
   【修身进德研几规箴】：给出具体的养生修德、为人处事、蓄财固本的长远规箴。
`;

    parts.push({ text: promptText });

    const modelsToTry = [env.GEMINI_MODEL || "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    let responseText = "";

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200,
            },
          }),
        });

        if (resp.ok) {
          const json = await resp.json();
          const cand = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (cand && typeof cand === "string") {
            responseText = cand.trim();
            break;
          }
        }
      } catch (err) {
        console.warn(`[Physiognomy Engine] Model ${model} call error:`, (err as Error).message);
      }
    }

    if (!responseText) {
      return defaultResult;
    }

    // 解析分段
    const extractSection = (tag: string, nextTag?: string) => {
      const idx = responseText.indexOf(tag);
      if (idx === -1) return "";
      const start = idx + tag.length;
      const end = nextTag ? responseText.indexOf(nextTag, start) : responseText.length;
      return (end === -1 ? responseText.slice(start) : responseText.slice(start, end))
        .replace(/^[:：\s]+/, "")
        .trim();
    };

    const face = extractSection("【五官三停神相辨析】", "【掌纹天地人三才推演】") || fallbackFace;
    const palm = extractSection("【掌纹天地人三才推演】", "【四柱八字形命会通】") || fallbackPalm;
    const bazi = extractSection("【四柱八字形命会通】", "【修身进德研几规箴】") || fallbackSynthesis;
    const advice = extractSection("【修身进德研几规箴】") || fallbackAdvice;

    return {
      title: "天元象数 · 传统五行神相与生辰八字深度参验报告",
      faceReading: face,
      palmReading: palm,
      baziSynthesis: bazi,
      lifeAdvice: advice,
      rawReport: responseText,
    };
  } catch (e) {
    console.warn("[Physiognomy Engine] Execution exception:", (e as Error).message);
    return defaultResult;
  }
}

/**
 * 每日 Google Gemini AI 感悟与九维哲学反思
 */
export async function generateGeminiReflection(req: AiReflectionRequest): Promise<string> {
  const apiKey = env.GEMINI_API_KEY;

  const fallbackReflection = `【今日生活哲学感悟】\n\n今日抽取塔罗牌「${req.tarotCard}（${req.tarotOrientation}）」与骨牌「${req.dominoTile}」，交织出「向内观照与从容沉淀」的主基调。\n\n在快节奏的生活中，传统智慧常提醒我们：万物皆有其时节与生发节奏。不必为一时的停顿焦虑，亦不必因偶得之顺遂而自满。将精力聚焦于当下可感知、可行动的具体事物，以温和而坚韧的态度对待身边的人与事。\n\n一日三餐顺应五行节律，早起温和暖胃，午间七八分饱保持清明，晚间少盐轻食助眠，在柴米油盐中守护身心清宁。\n\n（*免责声明：本内容结合传统文化与娱乐解读生成，仅供个人心境调节与自我探索参考，不构成任何医疗诊断、财务承诺或宿命论预测。*）`;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.log(
      "[Gemini AI] No GEMINI_API_KEY configured; returning constitutional fallback reflection.",
    );
    return fallbackReflection;
  }

  const prompt = `
You are the Wisdom Reflection Engine for "Life Explorer" (人生探索平台).
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
Write an uplifting, thoughtful 3-4 paragraph personal reflection for today. 
Integrate the symbolic lessons of the cards with daily mindfulness, healthy three-meal nourishment habits, and emotional serenity.
Close with the mandatory disclaimer:
"本内容为自我探索与娱乐参考，不构成医学、心理诊断或确定性预测。/ For self-reflection and entertainment only."
`;

  const modelsToTry = [env.GEMINI_MODEL || "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
            maxOutputTokens: 800,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && typeof candidateText === "string") {
          return candidateText.trim();
        }
      }
    } catch (err) {
      console.warn(`[Gemini AI] Model ${model} request error:`, (err as Error).message);
    }
  }

  return fallbackReflection;
}
