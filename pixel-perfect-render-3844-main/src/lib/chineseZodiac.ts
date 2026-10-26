import { Solar } from "lunar-javascript";

export type TraditionalProfile = {
  solarDate: string;
  solarTime?: string | undefined;
  lunarDateStr: string;
  zodiacZh: string;
  zodiacEn: string;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  timeGanZhi: string;
  yearElementZh: string;
  yearElementEn: string;
  elementCounts: {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
  dominantElementZh: string;
  dominantElementEn: string;
  westernZodiacZh: string;
  westernZodiacEn: string;
  yinYangZh: string;
  yinYangEn: string;
  traditionalReadingZh: string;
  traditionalReadingEn: string;
};

const ZODIAC_EN_MAP: Record<string, string> = {
  鼠: "Rat",
  牛: "Ox",
  虎: "Tiger",
  兔: "Rabbit",
  龙: "Dragon",
  蛇: "Snake",
  马: "Horse",
  羊: "Goat",
  猴: "Monkey",
  鸡: "Rooster",
  狗: "Dog",
  猪: "Pig",
};

const ELEMENT_EN_MAP: Record<string, string> = {
  金: "Metal",
  木: "Wood",
  水: "Water",
  火: "Fire",
  土: "Earth",
};

// Five element mapping from Heavenly Stems & Earthly Branches
const STEM_ELEMENT: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const BRANCH_ELEMENT: Record<string, string> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

export function calculateTraditionalProfile(
  birthDate: string,
  birthTime?: string,
): TraditionalProfile {
  const parts = birthDate.split("-").map(Number);
  const year = parts[0] || 2000;
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  let hour = 12;
  let minute = 0;
  if (birthTime && birthTime.includes(":")) {
    const timeParts = birthTime.split(":").map(Number);
    hour = timeParts[0] || 12;
    minute = timeParts[1] || 0;
  }

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getBaZi();

  const yearGanZhi = bazi[0] || lunar.getYearInGanZhi();
  const monthGanZhi = bazi[1] || lunar.getMonthInGanZhi();
  const dayGanZhi = bazi[2] || lunar.getDayInGanZhi();
  const timeGanZhi = bazi[3] || lunar.getTimeInGanZhi();

  const zodiacZh = lunar.getYearShengXiao();
  const zodiacEn = ZODIAC_EN_MAP[zodiacZh] || "Rat";

  // Calculate element distribution
  const allChars = (yearGanZhi + monthGanZhi + dayGanZhi + (birthTime ? timeGanZhi : "")).split("");
  const elementCounts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

  for (const char of allChars) {
    const el = STEM_ELEMENT[char] || BRANCH_ELEMENT[char];
    if (el === "金") elementCounts.metal++;
    if (el === "木") elementCounts.wood++;
    if (el === "水") elementCounts.water++;
    if (el === "火") elementCounts.fire++;
    if (el === "土") elementCounts.earth++;
  }

  // Dominant element
  const maxEntry = Object.entries(elementCounts).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ["wood", elementCounts.wood] as [string, number],
  );

  const dominantMap: Record<string, [string, string]> = {
    metal: ["金", "Metal"],
    wood: ["木", "Wood"],
    water: ["水", "Water"],
    fire: ["火", "Fire"],
    earth: ["土", "Earth"],
  };
  const [dominantElementZh, dominantElementEn] = dominantMap[maxEntry[0]] || ["木", "Wood"];

  // Year Element (Stem element of the year)
  const yearStem = yearGanZhi.charAt(0);
  const yearElementZh = STEM_ELEMENT[yearStem] || "木";
  const yearElementEn = ELEMENT_EN_MAP[yearElementZh] || "Wood";

  // Western Zodiac
  const rawXingZuo = solar.getXingZuo();
  const westernZodiacZh = rawXingZuo.endsWith("座") ? rawXingZuo : `${rawXingZuo}座`;
  const westernZodiacEnMap: Record<string, string> = {
    白羊座: "Aries",
    金牛座: "Taurus",
    双子座: "Gemini",
    巨蟹座: "Cancer",
    狮子座: "Leo",
    处女座: "Virgo",
    天秤座: "Libra",
    天蝎座: "Scorpio",
    射手座: "Sagittarius",
    摩羯座: "Capricorn",
    水瓶座: "Aquarius",
    双鱼座: "Pisces",
  };
  const westernZodiacEn = westernZodiacEnMap[westernZodiacZh] || westernZodiacZh;

  // Yin-Yang
  const isYangYear = ["甲", "丙", "戊", "庚", "壬"].includes(yearStem);
  const yinYangZh = isYangYear ? "阳" : "阴";
  const yinYangEn = isYangYear ? "Yang" : "Yin";

  const traditionalReadingZh = `生辰干支${yearGanZhi}年，生肖属${zodiacZh}，纳音与干支五行以「${dominantElementZh}」为主气。传统文化视其具有${
    dominantElementZh === "木"
      ? "生发条达、仁和探索"
      : dominantElementZh === "火"
        ? "热情明朗、进取向上"
        : dominantElementZh === "土"
          ? "沉稳厚重、诚信包容"
          : dominantElementZh === "金"
            ? "刚毅果决、精敏条理"
            : "深邃灵动、智慧变通"
  }的文化特质。`;

  const traditionalReadingEn = `Born in the ${yearGanZhi} year of the ${zodiacEn}, governed primarily by the ${dominantElementEn} element. Traditional cultural philosophy associates this with ${
    dominantElementEn === "Wood"
      ? "vitality, benevolence, and exploratory growth"
      : dominantElementEn === "Fire"
        ? "enthusiasm, radiance, and aspiration"
        : dominantElementEn === "Earth"
          ? "stability, trustworthiness, and grounded composure"
          : dominantElementEn === "Metal"
            ? "decisiveness, clarity, and precision"
            : "adaptability, profound insight, and flowing wisdom"
  }.`;

  return {
    solarDate: birthDate,
    solarTime: birthTime,
    lunarDateStr: `农历 ${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`,
    zodiacZh,
    zodiacEn,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    timeGanZhi: birthTime ? timeGanZhi : "未提供时辰",
    yearElementZh,
    yearElementEn,
    elementCounts,
    dominantElementZh,
    dominantElementEn,
    westernZodiacZh,
    westernZodiacEn,
    yinYangZh,
    yinYangEn,
    traditionalReadingZh,
    traditionalReadingEn,
  };
}
