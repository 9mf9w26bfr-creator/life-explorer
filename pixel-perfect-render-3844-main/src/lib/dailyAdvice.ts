import crypto from "crypto";
import { type TarotResult, type DominoResult } from "./fortuneEngines";
import { type TraditionalProfile } from "./chineseZodiac";

export type DailyAdviceItem = {
  categoryZh: string;
  categoryEn: string;
  iconName: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
};

export type FullDailyAdvice = {
  dateKey: string;
  luckyColorZh: string;
  luckyColorEn: string;
  luckyNumber: number;
  items: DailyAdviceItem[];
};

const COLORS = [
  { zh: "竹青绿 (木)", en: "Bamboo Green", hex: "#36B37E" },
  { zh: "朱砂红 (火)", en: "Vermilion Red", hex: "#FF5630" },
  { zh: "暖杏黄 (土)", en: "Warm Amber", hex: "#FFAB00" },
  { zh: "素月白 (金)", en: "Moonlit Silver", hex: "#00B8D9" },
  { zh: "黛墨蓝 (水)", en: "Indigo Navy", hex: "#6554C0" },
];

function seedFromString(str: string): number {
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  return parseInt(hash.slice(0, 8), 16);
}

export function generateDailyAdvice(
  userEmail: string,
  dateKey: string,
  tarot: TarotResult,
  domino: DominoResult,
  profile?: TraditionalProfile,
): FullDailyAdvice {
  const seed = seedFromString(`advice:${userEmail.toLowerCase()}:${dateKey}`);
  const color = COLORS[seed % COLORS.length]!;
  const luckyNumber = (seed % 9) + 1;

  const items: DailyAdviceItem[] = [
    {
      categoryZh: "衣 · 着装",
      categoryEn: "Clothing",
      iconName: "Shirt",
      titleZh: `宜搭配${color.zh}元素`,
      titleEn: `Suggested Palette: ${color.en}`,
      contentZh: `着装以舒适透气为主，点缀${color.zh}配饰或单品，给人沉稳自然的亲和感。`,
      contentEn: `Opt for relaxed, breathable layers complemented by subtle accents of ${color.en}.`,
    },
    {
      categoryZh: "食 · 饮食",
      categoryEn: "Food & Wellness",
      iconName: "Utensils",
      titleZh: "温润清淡，规律补水",
      titleEn: "Mindful Hydration & Light Fare",
      contentZh: "适量饮用温水或草本茶，饮食宜温和少油腻。此建议仅供生活方式参考，不作为医疗指导。",
      contentEn:
        "Stay hydrated with warm water or herbal tea; favor light, balanced meals. For lifestyle reflection only.",
    },
    {
      categoryZh: "住 · 居家",
      categoryEn: "Home Space",
      iconName: "Home",
      titleZh: "通风采光，理顺案头",
      titleEn: "Aeration & Tidy Workspaces",
      contentZh: "晨间开启门窗通风，保持办公桌与床头整洁无杂物，有助于维持思路开阔。",
      contentEn:
        "Open windows for fresh air in the morning and clear tabletop clutter for mental calm.",
    },
    {
      categoryZh: "行 · 出行",
      categoryEn: "Movement",
      iconName: "Footprints",
      titleZh: "散步舒缓，留意步频",
      titleEn: "Paced Walking & Fresh Air",
      contentZh: "午后或傍晚适合进行 15-20 分钟轻松散步，让视线离开屏幕，放松肩颈。",
      contentEn:
        "A 15-20 minute gentle afternoon stroll is ideal to unwind your neck and rest your eyes.",
    },
    {
      categoryZh: "事 · 工作",
      categoryEn: "Work & Affairs",
      iconName: "Briefcase",
      titleZh: "抓核心重点，分步推进",
      titleEn: "Prioritize Key Tasks",
      contentZh: "今日适合处理关键 1-2 件要务，避免多线程切换。遇到分歧时就事论事。",
      contentEn:
        "Focus on 1-2 core priorities today rather than multitasking; maintain objective clarity.",
    },
    {
      categoryZh: "学 · 研习",
      categoryEn: "Study & Curiosity",
      iconName: "BookOpen",
      titleZh: "精读半刻，记录灵感",
      titleEn: "Reading & Notes",
      contentZh: "留出 15 分钟阅读一篇文章或记录一则思考，积少成多深化认知。",
      contentEn: "Dedicate 15 minutes to quiet reading or journaling a fresh insight.",
    },
    {
      categoryZh: "人 · 情感",
      categoryEn: "Relationships",
      iconName: "Heart",
      titleZh: "温和倾听，真诚反馈",
      titleEn: "Gentle Listening",
      contentZh: "与亲近之人交谈时多问一句感受，先倾听对方表达，再平和分享自身想法。",
      contentEn:
        "Ask about loved ones' feelings and listen fully before sharing your own perspective.",
    },
    {
      categoryZh: "友 · 社交",
      categoryEn: "Social",
      iconName: "Users",
      titleZh: "保持分寸，自在相处",
      titleEn: "Warm Boundaries",
      contentZh: "无需迎合消耗型聚会，与志趣相投者简单问候即可感受默契。",
      contentEn:
        "No need to force exhausting gatherings; a simple genuine text to a good friend is enough.",
    },
    {
      categoryZh: "财 · 财务",
      categoryEn: "Financial Habits",
      iconName: "Coins",
      titleZh: "审慎记账，理性消费",
      titleEn: "Mindful Budgeting",
      contentZh: "下单前稍作权衡，记录日常开支。平台不提供任何投资回报承诺，倡导健康财务习惯。",
      contentEn:
        "Track daily expenses and pause before non-essential purchases. No financial profit guarantees.",
    },
  ];

  return {
    dateKey,
    luckyColorZh: color.zh,
    luckyColorEn: color.en,
    luckyNumber,
    items,
  };
}
