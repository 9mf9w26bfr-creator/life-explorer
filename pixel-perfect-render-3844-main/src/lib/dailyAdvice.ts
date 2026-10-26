import crypto from "crypto";
import { type TarotResult, type DominoResult } from "./fortuneEngines";
import { type TraditionalProfile } from "./chineseZodiac";

export type MealItem = {
  name: string;
  nameEn: string;
  ingredients: string;
  ingredientsEn: string;
  tip: string;
  tipEn: string;
};

export type ThreeMealsRecipe = {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  wellnessGoal: string;
  wellnessGoalEn: string;
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
      nameEn: "Spinach & Poached Egg Whole-Wheat Wrap + Warm Black Soybean Milk",
      ingredients: "鲜嫩菠菜、优质鸡蛋1枚、全麦饼皮1张、现磨温热纯黑豆浆",
      ingredientsEn: "Fresh baby spinach, 1 organic egg, whole wheat tortilla, freshly ground black soy milk",
      tip: "菠菜沸水焯水10秒去除草酸，搭配优质蛋白与低GI全麦，舒展肝气助晨起精力。",
      tipEn: "Blanch spinach for 10s to reduce oxalates. Combined with clean protein to support liver vitality and morning alertness.",
    },
    lunch: {
      name: "清蒸深海鲈鱼 + 荷塘小炒（莲藕/荷兰豆/木耳）+ 杂粮藜麦饭",
      nameEn: "Steamed Sea Bass + Lotus & Snow Pea Medley + Quinoa Grain Rice",
      ingredients: "鲜鲈鱼半条（葱姜清蒸）、荷兰豆、鲜藕片、泡发秋耳、藜麦胚芽米",
      ingredientsEn: "Fresh sea bass with ginger & scallions, snow peas, lotus root slices, black fungus, quinoa germ rice",
      tip: "青绿色时蔬利肝胆代谢，优质白肉清淡不油腻，七八分饱保持午后清明思路。",
      tipEn: "Vibrant greens promote gallbladder and liver metabolism. Clean white protein maintains light satiety and afternoon mental clarity.",
    },
    dinner: {
      name: "枸杞叶上汤瘦肉滚汤 + 蒜蓉菜心 + 清蒸小紫薯",
      nameEn: "Wolfberry Greens & Lean Pork Broth + Garlic Choy Sum + Steamed Purple Yam",
      ingredients: "鲜枸杞叶、前腿瘦肉片、鲜宁夏枸杞5粒、菜心一把、小紫薯1个",
      ingredientsEn: "Fresh wolfberry leaves, tender lean pork slices, goji berries, choy sum greens, 1 small purple sweet potato",
      tip: "晚间宜清淡少盐，枸杞叶清肝明目，暖汤下腹缓解眼部疲劳与身心浮躁。",
      tipEn: "Keep evening fare low-sodium. Wolfberry leaves nourish the eyes and warm broth soothes somatic restlessness.",
    },
    wellnessGoal: "五行疏木 · 养肝舒达 · 养目明心",
    wellnessGoalEn: "Wood Alignment · Liver Vitality & Visual Clarity",
  },
  fire: {
    breakfast: {
      name: "红枣桂圆小米养胃粥 + 溏心蛋 + 凉拌鲜黄瓜条",
      nameEn: "Red Date & Longan Golden Millet Porridge + Soft-boiled Egg + Cucumber Ribbons",
      ingredients: "山西金苗小米、若羌红枣2枚、桂圆肉3粒、母鸡鲜蛋1个、水果小黄瓜",
      ingredientsEn: "Golden millet, 2 red dates, 3 dried longans, 1 fresh egg, baby cucumber ribbons",
      tip: "小米温润健脾养胃，红枣微温补气，晨起暖胃生阳，唤醒心脉活力。",
      tipEn: "Millet warms the digestive core while red dates nourish Qi. Gentle morning warmth awakens cardiovascular vitality.",
    },
    lunch: {
      name: "番茄牛肉滑肉片煲 + 白灼西蓝花 + 红豆胚芽米饭",
      nameEn: "Slow Tomato & Tender Beef Pot + Steamed Broccoli + Red Bean Brown Rice",
      ingredients: "成熟沙瓤番茄2个、牛里脊薄片120g、西蓝花半朵、红小豆与胚芽米",
      ingredientsEn: "2 vine-ripened tomatoes, 120g sliced beef tenderloin, fresh broccoli florets, adzuki beans with germ rice",
      tip: "番茄红素与优质铁蛋白促进气血循环，酸甜适口刺激脾胃，红豆助利湿消肿。",
      tipEn: "Lycopene and clean bioavailable iron promote blood circulation, while adzuki beans gently dispel internal dampness.",
    },
    dinner: {
      name: "莲子百合银耳素润羹 + 鲜蔬豆腐煲 + 烤燕麦南瓜块",
      nameEn: "Lotus Seed & Lily Bulb White Fungus Soup + Vegetable Tofu Pot + Roasted Pumpkin",
      ingredients: "建宁通心白莲、兰州鲜百合、古田银耳、嫩豆腐、贝贝南瓜",
      ingredientsEn: "White lotus seeds, fresh lily bulbs, snow fungus, soft silken tofu, roasted kabocha squash",
      tip: "莲子百合清心降燥，晚间安神助眠，银耳多糖温和抚平燥热，促进深度睡眠。",
      tipEn: "Lotus seeds and lily bulbs quiet the spirit, easing restlessness for restorative, deep evening sleep.",
    },
    wellnessGoal: "五行明火 · 养心安神 · 气血充和",
    wellnessGoalEn: "Fire Alignment · Heart Serenity & Qi Harmony",
  },
  earth: {
    breakfast: {
      name: "金玉山药南瓜浓浆 + 全麦核桃馒头 + 白煮蛋",
      nameEn: "Golden Yam & Pumpkin Velouté + Whole Wheat Walnut Bun + Boiled Egg",
      ingredients: "铁棍山药100g、老南瓜100g打浆、天然全麦无糖馒头半个、白煮蛋",
      ingredientsEn: "100g Chinese wild yam, 100g kabocha squash blend, half whole-wheat walnut bun, 1 boiled egg",
      tip: "山药南瓜富含黏蛋白，保护胃黏膜，黄色入脾胃，温热厚实带来满满安全感。",
      tipEn: "Yam and pumpkin mucilage shields the gastric lining. Warm earthy tones deeply ground digestive stability.",
    },
    lunch: {
      name: "板栗香菇炖清远鸡 + 清炒鲜芦笋 + 糙米饭",
      nameEn: "Chestnut & Shiitake Braised Chicken + Sautéed Green Asparagus + Brown Rice",
      ingredients: "去壳板栗6颗、鲜香菇4朵、清远走地鸡块150g、绿芦笋一把、高纤糙米",
      ingredientsEn: "6 peeled sweet chestnuts, 4 fresh shiitake caps, 150g free-range chicken, tender green asparagus, brown rice",
      tip: "板栗强肾健脾，鸡肉补充优质氨基酸，搭配芦笋清脆解腻，补中益气。",
      tipEn: "Chestnuts tone the spleen and kidneys, chicken supplies essential amino acids, and crisp asparagus balances richness.",
    },
    dinner: {
      name: "猴头菇山药素排骨汤 + 凉拌秋葵 + 蒸玉米段",
      nameEn: "Hericium Mushroom & Yam Broth + Chilled Okra Salad + Steamed Sweet Corn",
      ingredients: "猴头菇1朵（泡发洗净）、铁棍山药、精选软骨肋排、鲜秋葵、甜玉米",
      ingredientsEn: "1 Hericium (Lion's Mane) mushroom, wild yam, lean pork riblet, fresh okra, sweet corn cob",
      tip: "猴头菇调理胃肠微生态，秋葵富含天然果胶，晚餐轻负担，助消化通利。",
      tipEn: "Lion's Mane supports gut microbiota and okra pectin eases digestion, ensuring a light nocturnal metabolic load.",
    },
    wellnessGoal: "五行培土 · 健脾和胃 · 稳步生化",
    wellnessGoalEn: "Earth Alignment · Spleen Grounding & Digest Ease",
  },
  metal: {
    breakfast: {
      name: "雪梨百合杏仁露 + 燕麦胡萝卜丝鸡蛋饼",
      nameEn: "Snow Pear & Almond Dew + Oat Carrot Ribbon Omelette",
      ingredients: "赵县雪梨半个、南杏仁10g、鲜百合、燕麦片30g、鲜蛋1个、胡萝卜细丝",
      ingredientsEn: "Half sweet snow pear, 10g sweet almonds, fresh lily bulb, 30g rolled oats, 1 egg, shredded carrots",
      tip: "白色入肺，杏仁百合润肺开音，搭配燕麦蛋饼提供持续平稳糖分供给。",
      tipEn: "White foods nurture pulmonary hydration. Almonds and pear soothe airways, paired with complex carbs for steady energy.",
    },
    lunch: {
      name: "香煎迷迭香海盐鸡胸肉 + 白玉菇炒荷兰豆 + 燕麦米饭",
      nameEn: "Rosemary Seared Chicken Breast + White Beech Mushrooms & Snow Peas + Oat Rice",
      ingredients: "鸡胸肉120g（橄榄油微煎）、新鲜白玉菇、脆嫩荷兰豆、全麦燕麦米",
      ingredientsEn: "120g chicken breast seared in olive oil, fresh white beech mushrooms, crisp snow peas, whole oat rice",
      tip: "高蛋白低脂肪，白玉菇补充多糖类营养，锁住水分，保持呼吸系统清爽。",
      tipEn: "Lean protein with white mushroom polysaccharides locks in cellular hydration and refreshes respiratory pathways.",
    },
    dinner: {
      name: "海底椰无花果雪梨瘦肉汤 + 清炒小白菜 + 蒸香芋块",
      nameEn: "Sea Coconut & Fig Pear Clear Broth + Sautéed Bok Choy + Steamed Taro",
      ingredients: "干海底椰片5g、无花果干2粒、雪梨半个、猪里脊瘦肉、本地小白菜、荔浦芋头",
      ingredientsEn: "5g sea coconut slices, 2 dried figs, half snow pear, lean tenderloin, baby bok choy, steamed taro root",
      tip: "无花果生津润喉，清甜汤水缓解咽喉干燥与紧绷，为夜晚带来纯净安歇。",
      tipEn: "Dried figs and pear relieve throat dryness, offering gentle hydration for a peaceful, cough-free night.",
    },
    wellnessGoal: "五行敛金 · 润肺固表 · 清肃生津",
    wellnessGoalEn: "Metal Alignment · Lung Hydration & Pure Respiration",
  },
  water: {
    breakfast: {
      name: "核桃黑芝麻黑米羹 + 蒸温润水蛋 + 鲜蓝莓一把",
      nameEn: "Black Sesame & Walnut Black Rice Congee + Steamed Egg Custard + Fresh Blueberries",
      ingredients: "生核桃仁2瓣、熟黑芝麻10g、有机黑米40g破壁打糊、鲜蛋羹、新鲜蓝莓",
      ingredientsEn: "2 raw walnut halves, 10g roasted black sesame, 40g organic black rice, silky steamed egg, fresh blueberries",
      tip: "黑色入肾，黑芝麻与核桃补充优质不饱和脂肪酸，健脑益智，充盈元气。",
      tipEn: "Deep black foods support kidney essence. Rich in essential omega fatty acids to fuel cognitive vitality and stamina.",
    },
    lunch: {
      name: "黑豆枸杞炖牛腩 + 蚝油双菇西蓝花 + 燕麦黑米饭",
      nameEn: "Black Bean & Goji Braised Beef Flank + Mushroom Broccoli + Black Rice",
      ingredients: "有机小黑豆30g、宁夏枸杞、精选牛腩120g、口蘑、草菇、西蓝花",
      ingredientsEn: "30g organic black beans, Ningxia wolfberries, 120g beef flank, button & straw mushrooms, broccoli",
      tip: "牛腩温补气血，黑豆补肾益阴，双菇增鲜抗氧化，提供坚韧续航耐力。",
      tipEn: "Warm beef restores Qi while black beans nurture deep Yin reserves, delivering robust enduring stamina.",
    },
    dinner: {
      name: "海带排骨冬瓜老火汤 + 葱油淋清蒸海鲈鱼 + 清蒸紫薯",
      nameEn: "Kelp & Winter Melon Simmered Broth + Steamed Sea Bass + Steamed Purple Yam",
      ingredients: "深海无沙海带结、冬瓜厚片、猪精排1小块、海鲈鱼片、小紫薯1个",
      ingredientsEn: "Sea kelp knots, thick winter melon slices, lean pork rib, sea bass fillet, 1 purple yam",
      tip: "海带软坚散结，冬瓜清热利水，鱼肉极易消化，晚间身体零代谢负担。",
      tipEn: "Kelp balances fluid regulation and winter melon cools heat. Light fish ensures zero digestive burden at night.",
    },
    wellnessGoal: "五行润水 · 滋肾蓄精 · 充沛定力",
    wellnessGoalEn: "Water Alignment · Kidney Essence & Deep Grounding",
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
      titleEn: `Seasonal Five-Element Recipes: ${mealPlan.wellnessGoalEn}`,
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
