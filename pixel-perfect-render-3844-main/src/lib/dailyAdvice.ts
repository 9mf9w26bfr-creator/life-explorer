import crypto from "crypto";
import { type TarotResult, type DominoResult } from "./fortuneEngines";
import { type TraditionalProfile } from "./chineseZodiac";

export type ThreeMealsRecipe = {
  breakfast: { name: string; ingredients: string; tip: string };
  lunch: { name: string; ingredients: string; tip: string };
  dinner: { name: string; ingredients: string; tip: string };
  wellnessGoal: string;
};

export type DailyAdviceItem = {
  categoryZh: string;
  categoryEn: string;
  iconName: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  recipes?: ThreeMealsRecipe;
};

export type FullDailyAdvice = {
  dateKey: string;
  luckyColorZh: string;
  luckyColorEn: string;
  luckyNumber: number;
  items: DailyAdviceItem[];
};

const COLORS = [
  { zh: "竹青绿 (木)", en: "Bamboo Green", hex: "#36B37E", element: "wood" },
  { zh: "朱砂红 (火)", en: "Vermilion Red", hex: "#FF5630", element: "fire" },
  { zh: "暖杏黄 (土)", en: "Warm Amber", hex: "#FFAB00", element: "earth" },
  { zh: "素月白 (金)", en: "Moonlit Silver", hex: "#00B8D9", element: "metal" },
  { zh: "黛墨蓝 (水)", en: "Indigo Navy", hex: "#6554C0", element: "water" },
];

const MEAL_PLANS: Record<string, ThreeMealsRecipe> = {
  wood: {
    breakfast: {
      name: "菠菜水波蛋全麦卷 + 温润黑豆浆",
      ingredients: "鲜嫩菠菜、优质鸡蛋1枚、全麦饼皮1张、现磨温热纯黑豆浆",
      tip: "菠菜沸水焯水10秒去除草酸，搭配优质蛋白与低GI全麦，舒展肝气助晨起精力。",
    },
    lunch: {
      name: "清蒸深海鲈鱼 + 荷塘小炒（莲藕/荷兰豆/木耳）+ 杂粮藜麦饭",
      ingredients: "鲜鲈鱼半条（葱姜清蒸）、荷兰豆、鲜藕片、泡发秋耳、藜麦胚芽米",
      tip: "青绿色时蔬利肝胆代谢，优质白肉清淡不油腻，七八分饱保持午后清明思路。",
    },
    dinner: {
      name: "枸杞叶上汤瘦肉滚汤 + 蒜蓉菜心 + 清蒸小紫薯",
      ingredients: "鲜枸杞叶、前腿瘦肉片、鲜宁夏枸杞5粒、菜心一把、小紫薯1个",
      tip: "晚间宜清淡少盐，枸杞叶清肝明目，暖汤下腹缓解眼部疲劳与身心浮躁。",
    },
    wellnessGoal: "五行疏木 · 养肝舒达 · 养目明心",
  },
  fire: {
    breakfast: {
      name: "红枣桂圆小米养胃粥 + 溏心蛋 + 凉拌鲜黄瓜条",
      ingredients: "山西金苗小米、若羌红枣2枚、桂圆肉3粒、母鸡鲜蛋1个、水果小黄瓜",
      tip: "小米温润健脾养胃，红枣微温补气，晨起暖胃生阳，唤醒心脉活力。",
    },
    lunch: {
      name: "番茄牛肉滑肉片煲 + 白灼西蓝花 + 红豆胚芽米饭",
      ingredients: "成熟沙瓤番茄2个、牛里脊薄片120g、西蓝花半朵、红小豆与胚芽米",
      tip: "番茄红素与优质铁蛋白促进气血循环，酸甜适口刺激脾胃，红豆助利湿消肿。",
    },
    dinner: {
      name: "莲子百合银耳素润羹 + 鲜蔬豆腐煲 + 烤燕麦南瓜块",
      ingredients: "建宁通心白莲、兰州鲜百合、古田银耳、嫩豆腐、贝贝南瓜",
      tip: "莲子百合清心降燥，晚间安神助眠，银耳多糖温和抚平燥热，促进深度睡眠。",
    },
    wellnessGoal: "五行明火 · 养心安神 · 气血充和",
  },
  earth: {
    breakfast: {
      name: "金玉山药南瓜浓浆 + 全麦核桃馒头 + 白煮蛋",
      ingredients: "铁棍山药100g、老南瓜100g打浆、天然全麦无糖馒头半个、白煮蛋",
      tip: "山药南瓜富含黏蛋白，保护胃黏膜，黄色入脾胃，温热厚实带来满满安全感。",
    },
    lunch: {
      name: "板栗香菇炖清远鸡 + 清炒鲜芦笋 + 糙米饭",
      ingredients: "去壳板栗6颗、鲜香菇4朵、清远走地鸡块150g、绿芦笋一把、高纤糙米",
      tip: "板栗强肾健脾，鸡肉补充优质氨基酸，搭配芦笋清脆解腻，补中益气。",
    },
    dinner: {
      name: "猴头菇山药素排骨汤 + 凉拌秋葵 + 蒸玉米段",
      ingredients: "猴头菇1朵（泡发洗净）、铁棍山药、精选软骨肋排、鲜秋葵、甜玉米",
      tip: "猴头菇调理胃肠微生态，秋葵富含天然果胶，晚餐轻负担，助消化通利。",
    },
    wellnessGoal: "五行培土 · 健脾和胃 · 稳步生化",
  },
  metal: {
    breakfast: {
      name: "雪梨百合杏仁露 + 燕麦胡萝卜丝鸡蛋饼",
      ingredients: "赵县雪梨半个、南杏仁10g、鲜百合、燕麦片30g、鲜蛋1个、胡萝卜细丝",
      tip: "白色入肺，杏仁百合润肺开音，搭配燕麦蛋饼提供持续平稳糖分供给。",
    },
    lunch: {
      name: "香煎迷迭香海盐鸡胸肉 + 白玉菇炒荷兰豆 + 燕麦米饭",
      ingredients: "鸡胸肉120g（橄榄油微煎）、新鲜白玉菇、脆嫩荷兰豆、全麦燕麦米",
      tip: "高蛋白低脂肪，白玉菇补充多糖类营养，锁住水分，保持呼吸系统清爽。",
    },
    dinner: {
      name: "海底椰无花果雪梨瘦肉汤 + 清炒小白菜 + 蒸香芋块",
      ingredients: "干海底椰片5g、无花果干2粒、雪梨半个、猪里脊瘦肉、本地小白菜、荔浦芋头",
      tip: "无花果生津润喉，清甜汤水缓解咽喉干燥与紧绷，为夜晚带来纯净安歇。",
    },
    wellnessGoal: "五行敛金 · 润肺固表 · 清肃生津",
  },
  water: {
    breakfast: {
      name: "核桃黑芝麻黑米羹 + 蒸温润水蛋 + 鲜蓝莓一把",
      ingredients: "生核桃仁2瓣、熟黑芝麻10g、有机黑米40g破壁打糊、鲜蛋羹、新鲜蓝莓",
      tip: "黑色入肾，黑芝麻与核桃补充优质不饱和脂肪酸，健脑益智，充盈元气。",
    },
    lunch: {
      name: "黑豆枸杞炖牛腩 + 蚝油双菇西蓝花 + 燕麦黑米饭",
      ingredients: "有机小黑豆30g、宁夏枸杞、精选牛腩120g、口蘑、草菇、西蓝花",
      tip: "牛腩温补气血，黑豆补肾益阴，双菇增鲜抗氧化，提供坚韧续航耐力。",
    },
    dinner: {
      name: "海带排骨冬瓜老火汤 + 葱油淋清蒸海鲈鱼 + 清蒸紫薯",
      ingredients: "深海无沙海带结、冬瓜厚片、猪精排1小块、海鲈鱼片、小紫薯1个",
      tip: "海带软坚散结，冬瓜清热利水，鱼肉极易消化，晚间身体零代谢负担。",
    },
    wellnessGoal: "五行润水 · 滋肾蓄精 · 充沛定力",
  },
};

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

  // 根据用户五行或今日色彩选取一日三餐食谱
  let elementKey = color.element;
  if (profile?.dominantElementEn) {
    const en = profile.dominantElementEn.toLowerCase();
    if (MEAL_PLANS[en]) {
      elementKey = en;
    }
  }
  const mealPlan = MEAL_PLANS[elementKey] || MEAL_PLANS["earth"]!;

  const items: DailyAdviceItem[] = [
    {
      categoryZh: "衣 · 着装",
      categoryEn: "Clothing",
      iconName: "Shirt",
      titleZh: `宜搭配${color.zh}元素`,
      titleEn: `Suggested Palette: ${color.en}`,
      contentZh: `着装以舒适透气为主，点缀${color.zh}配饰、围巾或单品，给人沉稳自然的亲和感。`,
      contentEn: `Opt for relaxed, breathable layers complemented by subtle accents of ${color.en}.`,
    },
    {
      categoryZh: "食 · 饮食",
      categoryEn: "Food & Wellness",
      iconName: "Utensils",
      titleZh: `五行时令养生：${mealPlan.wellnessGoal}`,
      titleEn: "Personalized Three-Meal Seasonal Recipes",
      contentZh: `【早中晚一日三餐具体食谱】遵循五行调理平衡，营养均衡且易于烹饪。此建议仅供生活方式参考，不作为医疗指导。`,
      contentEn: `Concrete breakfast, lunch, and dinner recipes formulated for seasonal five-element equilibrium. For lifestyle reflection only.`,
      recipes: mealPlan,
    },
    {
      categoryZh: "住 · 居家",
      categoryEn: "Home Space",
      iconName: "Home",
      titleZh: "通风采光，理顺案头",
      titleEn: "Aeration & Tidy Workspaces",
      contentZh: "晨间开启门窗通风换气，保持办公桌与床头整洁无杂物，有助于维持全天思路开阔与心境通畅。",
      contentEn:
        "Open windows for fresh air in the morning and clear tabletop clutter for mental calm.",
    },
    {
      categoryZh: "行 · 出行",
      categoryEn: "Movement",
      iconName: "Footprints",
      titleZh: "散步舒缓，留意步频",
      titleEn: "Paced Walking & Fresh Air",
      contentZh: "午后或傍晚适合进行 15-20 分钟轻松散步，让视线离开电子屏幕，舒展肩颈并调节呼吸节律。",
      contentEn:
        "A 15-20 minute gentle afternoon stroll is ideal to unwind your neck and rest your eyes.",
    },
    {
      categoryZh: "作 · 工作",
      categoryEn: "Work & Affairs",
      iconName: "Briefcase",
      titleZh: "抓核心重点，分步推进",
      titleEn: "Prioritize Key Tasks",
      contentZh: "今日适合处理关键 1-2 件核心要务，避免在多线程任务间频繁切换；遇到分歧时就事论事，顺势而为。",
      contentEn:
        "Focus on 1-2 core priorities today rather than multitasking; maintain objective clarity.",
    },
    {
      categoryZh: "息 · 研习",
      categoryEn: "Study & Curiosity",
      iconName: "BookOpen",
      titleZh: "精读半刻，静心沉潜",
      titleEn: "Reading & Reflection",
      contentZh: "留出 15-20 分钟阅读一本书籍或梳理一则思考，远离信息碎片轰炸，积少成多深化底层认知。",
      contentEn: "Dedicate 15 minutes to quiet reading or journaling a fresh insight.",
    },
    {
      categoryZh: "情 · 情感",
      categoryEn: "Relationships",
      iconName: "Heart",
      titleZh: "温和倾听，真诚以待",
      titleEn: "Gentle Listening",
      contentZh: "与亲近之人交谈时多问一句真实感受，先全然倾听对方表达，再平和分享自身想法，不急于评判。",
      contentEn:
        "Ask about loved ones' feelings and listen fully before sharing your own perspective.",
    },
    {
      categoryZh: "友 · 社交",
      categoryEn: "Social",
      iconName: "Users",
      titleZh: "保持分寸，自在相处",
      titleEn: "Warm Boundaries",
      contentZh: "无需迎合消耗心力的无谓聚会，与志趣相投的良友简单问候即可感受默契，互留空间方能长久。",
      contentEn:
        "No need to force exhausting gatherings; a simple genuine text to a good friend is enough.",
    },
    {
      categoryZh: "财 · 财务",
      categoryEn: "Financial Habits",
      iconName: "Coins",
      titleZh: "审慎记账，理性支出",
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
