import crypto from "crypto";

export type TarotResult = {
  nameZh: string;
  nameEn: string;
  arcana: "Major" | "Minor";
  isUpright: boolean;
  orientationZh: string;
  orientationEn: string;
  keywordsZh: string[];
  keywordsEn: string[];
  meaningZh: string;
  meaningEn: string;
};

export type DominoResult = {
  tile: [number, number];
  nameZh: string;
  nameEn: string;
  traditionalSignZh: string;
  traditionalSignEn: string;
  adviceZh: string;
  adviceEn: string;
};

// Deterministic seed integer from string
function seedFromString(str: string): number {
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  return parseInt(hash.slice(0, 8), 16);
}

// 22 Major Arcana + Sample Minor Arcana for a representative rich 78-card deck
const MAJOR_ARCANA = [
  {
    nameZh: "愚者",
    nameEn: "The Fool",
    keywordsZh: ["初心", "探索", "纯真"],
    keywordsEn: ["New beginnings", "Adventure", "Innocence"],
  },
  {
    nameZh: "魔术师",
    nameEn: "The Magician",
    keywordsZh: ["创造", "能动", "专注"],
    keywordsEn: ["Skill", "Resourcefulness", "Concentration"],
  },
  {
    nameZh: "女祭司",
    nameEn: "The High Priestess",
    keywordsZh: ["直觉", "内省", "平静"],
    keywordsEn: ["Intuition", "Inner voice", "Calmness"],
  },
  {
    nameZh: "女皇",
    nameEn: "The Empress",
    keywordsZh: ["丰盛", "滋养", "自然"],
    keywordsEn: ["Abundance", "Nurturing", "Harmony"],
  },
  {
    nameZh: "皇帝",
    nameEn: "The Emperor",
    keywordsZh: ["秩序", "坚韧", "担当"],
    keywordsEn: ["Structure", "Stability", "Leadership"],
  },
  {
    nameZh: "教皇",
    nameEn: "The Hierophant",
    keywordsZh: ["沉淀", "传统", "传授"],
    keywordsEn: ["Wisdom", "Tradition", "Guidance"],
  },
  {
    nameZh: "恋人",
    nameEn: "The Lovers",
    keywordsZh: ["联结", "抉择", "契合"],
    keywordsEn: ["Connection", "Choice", "Harmony"],
  },
  {
    nameZh: "战车",
    nameEn: "The Chariot",
    keywordsZh: ["自律", "推进", "决心"],
    keywordsEn: ["Control", "Willpower", "Drive"],
  },
  {
    nameZh: "力量",
    nameEn: "Strength",
    keywordsZh: ["温和", "耐性", "内在定力"],
    keywordsEn: ["Patience", "Courage", "Gentle power"],
  },
  {
    nameZh: "隐士",
    nameEn: "The Hermit",
    keywordsZh: ["独立", "思考", "指引"],
    keywordsEn: ["Soul-searching", "Introspection", "Guidance"],
  },
  {
    nameZh: "命运之轮",
    nameEn: "Wheel of Fortune",
    keywordsZh: ["转机", "循环", "接纳"],
    keywordsEn: ["Change", "Cycles", "Perspective"],
  },
  {
    nameZh: "正义",
    nameEn: "Justice",
    keywordsZh: ["平衡", "客观", "坦诚"],
    keywordsEn: ["Fairness", "Truth", "Equilibrium"],
  },
  {
    nameZh: "倒吊人",
    nameEn: "The Hanged Man",
    keywordsZh: ["新视角", "暂歇", "释怀"],
    keywordsEn: ["New angle", "Surrender", "Pause"],
  },
  {
    nameZh: "节制",
    nameEn: "Temperance",
    keywordsZh: ["调和", "适度", "从容"],
    keywordsEn: ["Balance", "Patience", "Moderation"],
  },
  {
    nameZh: "星星",
    nameEn: "The Star",
    keywordsZh: ["希望", "灵感", "舒缓"],
    keywordsEn: ["Hope", "Inspiration", "Renewal"],
  },
  {
    nameZh: "月亮",
    nameEn: "The Moon",
    keywordsZh: ["敏感", "潜意识", "梦境"],
    keywordsEn: ["Subconscious", "Imagination", "Reflection"],
  },
  {
    nameZh: "太阳",
    nameEn: "The Sun",
    keywordsZh: ["活力", "喜悦", "明朗"],
    keywordsEn: ["Joy", "Vitality", "Clarity"],
  },
  {
    nameZh: "审判",
    nameEn: "Judgement",
    keywordsZh: ["觉醒", "自省", "重塑"],
    keywordsEn: ["Reflection", "Reckoning", "Awakening"],
  },
  {
    nameZh: "世界",
    nameEn: "The World",
    keywordsZh: ["圆满", "整合", "新旅程"],
    keywordsEn: ["Fulfillment", "Wholeness", "Completion"],
  },
];

const DOMINO_TILES: DominoResult[] = [
  {
    tile: [6, 6],
    nameZh: "天牌 · 双六",
    nameEn: "Double Six (Heaven)",
    traditionalSignZh: "大吉 · 刚健中正",
    traditionalSignEn: "Auspicious & Steady",
    adviceZh: "精力充沛，宜从容行事，厚积薄发。",
    adviceEn: "Abundant energy; act with calm confidence.",
  },
  {
    tile: [6, 5],
    nameZh: "虎啸风生",
    nameEn: "Six & Five",
    traditionalSignZh: "顺遂 · 乘势前行",
    traditionalSignEn: "Momentum & Ease",
    adviceZh: "与人协作畅通，适宜推进延宕日程。",
    adviceEn: "Smooth cooperation; ideal for tackling postponed plans.",
  },
  {
    tile: [5, 5],
    nameZh: "梅花双五",
    nameEn: "Double Five",
    traditionalSignZh: "温厚 · 宁静致远",
    traditionalSignEn: "Harmony & Grace",
    adviceZh: "宜整理居所，品味日常温情。",
    adviceEn: "Cultivate home comfort and savor simple everyday moments.",
  },
  {
    tile: [4, 4],
    nameZh: "板凳双四",
    nameEn: "Double Four",
    traditionalSignZh: "平实 · 脚踏实地",
    traditionalSignEn: "Solid Foundations",
    adviceZh: "循序渐进，专注细节必有收获。",
    adviceEn: "Take one step at a time; attention to detail brings rewards.",
  },
  {
    tile: [3, 3],
    nameZh: "长衫双三",
    nameEn: "Double Three",
    traditionalSignZh: "通达 · 思虑明晰",
    traditionalSignEn: "Clear Mind",
    adviceZh: "学习与阅读状态极佳，利于梳理思路。",
    adviceEn: "Excellent focus for learning and analytical reflection.",
  },
  {
    tile: [2, 2],
    nameZh: "地牌双二",
    nameEn: "Double Two (Earth)",
    traditionalSignZh: "包容 · 柔和有度",
    traditionalSignEn: "Nurturing Receptivity",
    adviceZh: "倾听他人建议，避开急躁争端。",
    adviceEn: "Listen attentively and remain gentle in all conversations.",
  },
  {
    tile: [1, 1],
    nameZh: "地丁双一",
    nameEn: "Double One",
    traditionalSignZh: "萌发 · 孕育新生",
    traditionalSignEn: "Gentle Inception",
    adviceZh: "适合制定新目标，保持初心。",
    adviceEn: "Great for setting intentions with a quiet, open mind.",
  },
  {
    tile: [6, 1],
    nameZh: "首尾相映",
    nameEn: "Six & One",
    traditionalSignZh: "流转 · 随机应变",
    traditionalSignEn: "Adaptability",
    adviceZh: "计划有微调亦无妨，顺其自然。",
    adviceEn: "Be flexible with your routine and welcome spontaneous ideas.",
  },
  {
    tile: [5, 3],
    nameZh: "八仙过海",
    nameEn: "Five & Three",
    traditionalSignZh: "和乐 · 多元互补",
    traditionalSignEn: "Creative Synergy",
    adviceZh: "适合交流与灵感碰撞，保持开朗。",
    adviceEn: "Connect with friends and share creative perspectives.",
  },
  {
    tile: [4, 2],
    nameZh: "六六大顺",
    nameEn: "Four & Two",
    traditionalSignZh: "从容 · 平衡中和",
    traditionalSignEn: "Equilibrium",
    adviceZh: "作息有序，劳逸结合为先。",
    adviceEn: "Prioritize proper rest and balance work with relaxation.",
  },
];

/**
 * Generate a deterministic daily Tarot draw per user and calendar day
 */
export function getDailyTarot(userEmail: string, dateKey: string): TarotResult {
  const seed = seedFromString(`tarot:${userEmail.toLowerCase()}:${dateKey}`);
  const cardIndex = seed % MAJOR_ARCANA.length;
  const isUpright = (seed >> 8) % 2 === 0;

  const card = MAJOR_ARCANA[cardIndex]!;
  return {
    nameZh: card.nameZh,
    nameEn: card.nameEn,
    arcana: "Major",
    isUpright,
    orientationZh: isUpright ? "正位" : "逆位",
    orientationEn: isUpright ? "Upright" : "Reversed",
    keywordsZh: card.keywordsZh,
    keywordsEn: card.keywordsEn,
    meaningZh: isUpright
      ? `今日抽取【${card.nameZh}（正位）】。象征着${card.keywordsZh.join("与")}。提醒你秉持积极温和的心态，专注于当下的真实力量。`
      : `今日抽取【${card.nameZh}（逆位）】。象征着内在的调整与反思。提示你不必急于外求结果，先向内梳理节奏与思绪。`,
    meaningEn: isUpright
      ? `Today's card is ${card.nameEn} (Upright). Highlighting ${card.keywordsEn.join(", ")}. A gentle prompt to engage with calm focus.`
      : `Today's card is ${card.nameEn} (Reversed). Highlighting reflection and recalibration. Take time to pause before responding.`,
  };
}

/**
 * Generate a deterministic daily Domino fortune per user and calendar day
 */
export function getDailyDomino(userEmail: string, dateKey: string): DominoResult {
  const seed = seedFromString(`domino:${userEmail.toLowerCase()}:${dateKey}`);
  const tileIndex = seed % DOMINO_TILES.length;
  return DOMINO_TILES[tileIndex]!;
}
