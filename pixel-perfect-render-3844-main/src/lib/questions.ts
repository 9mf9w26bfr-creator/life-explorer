export type Choice = { zh: string; en: string };
export type IQQuestion = {
  zh: string;
  en: string;
  options: Choice[];
  answer: number;
  level: string;
};
export type LikertQuestion = { zh: string; en: string; reverse?: boolean };

const o = (...xs: string[]): Choice[] => xs.map((x) => ({ zh: x, en: x }));

export const iq: IQQuestion[] = [
  {
    level: "易 Easy",
    zh: "2, 4, 6, 8, ? 下一个数是？",
    en: "2, 4, 6, 8, ? What comes next?",
    options: o("9", "10", "12", "14"),
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "猫之于小猫，如同狗之于？",
    en: "Cat is to kitten as dog is to?",
    options: [
      { zh: "狼", en: "Wolf" },
      { zh: "小狗", en: "Puppy" },
      { zh: "骨头", en: "Bone" },
      { zh: "狗窝", en: "Kennel" },
    ],
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "所有玫瑰都是花，有些花会很快凋谢。能否确定有些玫瑰会很快凋谢？",
    en: "All roses are flowers; some flowers fade quickly. Must some roses fade quickly?",
    options: [
      { zh: "能", en: "Yes" },
      { zh: "不能", en: "No" },
    ],
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "1, 1, 2, 3, 5, 8, ?",
    en: "1, 1, 2, 3, 5, 8, ?",
    options: o("11", "12", "13", "15"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "一个立方体有几条棱？",
    en: "How many edges does a cube have?",
    options: o("6", "8", "12", "16"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "记住 7-3-9-1，倒序是？",
    en: "Remember 7-3-9-1. What is it reversed?",
    options: o("1-9-3-7", "1-3-9-7", "9-1-7-3", "7-9-3-1"),
    answer: 0,
  },
  {
    level: "难 Hard",
    zh: "5 台机器 5 分钟做 5 个零件，100 台机器做 100 个零件需几分钟？",
    en: "5 machines make 5 parts in 5 min. How long for 100 machines to make 100 parts?",
    options: o("1", "5", "20", "100"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "A 比 B 高，C 比 A 高，D 比 C 矮但比 A 高。谁最矮？",
    en: "A is taller than B, C taller than A, D shorter than C but taller than A. Who is shortest?",
    options: o("A", "B", "C", "D"),
    answer: 1,
  },
  {
    level: "极难 Very Hard",
    zh: "2, 6, 12, 20, 30, ?",
    en: "2, 6, 12, 20, 30, ?",
    options: o("36", "40", "42", "44"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "球拍和球共 1.10 元，球拍比球贵 1 元。球多少钱？",
    en: "A bat and ball cost 1.10 total; the bat costs 1.00 more. What does the ball cost?",
    options: o("0.10", "0.05", "0.01", "0.15"),
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "太阳从哪个方向升起？",
    en: "From which direction does the sun rise?",
    options: [
      { zh: "东", en: "East" },
      { zh: "南", en: "South" },
      { zh: "西", en: "West" },
      { zh: "北", en: "North" },
    ],
    answer: 0,
  },
  {
    level: "易 Easy",
    zh: "一本书有 100 页，翻到第 50 页，还剩几页没看？",
    en: "A book has 100 pages. You are on page 50. How many pages remain?",
    options: o("49", "50", "51", "60"),
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "3, 6, 11, 18, 27, ?",
    en: "3, 6, 11, 18, 27, ?",
    options: o("36", "38", "40", "42"),
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "如果所有 A 都是 B，所有 B 都是 C，那么所有 A 都是 C 吗？",
    en: "If all A are B and all B are C, must all A be C?",
    options: [
      { zh: "是", en: "Yes" },
      { zh: "否", en: "No" },
    ],
    answer: 0,
  },
  {
    level: "中 Medium",
    zh: "时钟 3:15 时，时针与分针的夹角是？",
    en: "At 3:15, the angle between the clock hands is?",
    options: o("0°", "7.5°", "15°", "30°"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "一个数加上它的一半等于 18，这个数是？",
    en: "A number plus half of itself equals 18. What is the number?",
    options: o("9", "10", "12", "14"),
    answer: 2,
  },
  {
    level: "难 Hard",
    zh: "把「STAR」的字母重新排列，能组成哪种水果？",
    en: "Rearrange the letters of STAR to form which fruit?",
    options: [
      { zh: "草莓 Strawberry", en: "Strawberry" },
      { zh: "杨桃 Starfruit", en: "Starfruit" },
      { zh: "苹果 Apple", en: "Apple" },
      { zh: "无法组成水果 Not a fruit", en: "Not a fruit" },
    ],
    answer: 3,
  },
  {
    level: "难 Hard",
    zh: "1, 4, 9, 16, 25, ?",
    en: "1, 4, 9, 16, 25, ?",
    options: o("30", "32", "36", "49"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "三个连续整数之和是 51，最大的一个是？",
    en: "Three consecutive integers sum to 51. The largest is?",
    options: o("16", "17", "18", "19"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "井深 10 米，蜗牛每天白天爬 3 米、晚上滑下 2 米，几天能爬出井？",
    en: "A well is 10m deep. A snail climbs 3m by day and slips 2m by night. How many days to escape?",
    options: o("7", "8", "9", "10"),
    answer: 1,
  },
];

export const likertScale: Choice[] = [
  { zh: "非常不符合", en: "Strongly disagree" },
  { zh: "不太符合", en: "Disagree" },
  { zh: "一般", en: "Neutral" },
  { zh: "比较符合", en: "Agree" },
  { zh: "非常符合", en: "Strongly agree" },
];

export const eq: LikertQuestion[] = [
  { zh: "我能说出自己此刻的情绪。", en: "I can name the emotion I'm feeling." },
  { zh: "生气时我能先停一停再回应。", en: "When angry, I pause before responding." },
  { zh: "我容易察觉别人情绪的变化。", en: "I notice changes in others' moods." },
  { zh: "心情不好时我有办法让自己平复。", en: "I have ways to calm down when upset." },
  { zh: "在群体中我能感受到气氛。", en: "I can sense the atmosphere in a group." },
  {
    zh: "发生冲突时我会寻找双方都能接受的方案。",
    en: "In conflict I look for solutions both sides accept.",
  },
  { zh: "别人说话时我常常打断。", en: "I often interrupt when others speak.", reverse: true },
  { zh: "我能恰当地表达自己的感受。", en: "I express my feelings appropriately." },
  { zh: "我愿意主动维护重要的关系。", en: "I actively maintain important relationships." },
  { zh: "压力大时我很容易失控。", en: "Under stress I easily lose control.", reverse: true },
];

export const comm: LikertQuestion[] = [
  { zh: "我能专注地听完对方的话。", en: "I listen fully to what others say." },
  { zh: "我在众人面前说话较自在。", en: "I feel comfortable speaking in front of people." },
  { zh: "我能把复杂的事解释清楚。", en: "I can explain complex things clearly." },
  { zh: "不明白时我会主动提问。", en: "I ask questions when I don't understand." },
  { zh: "谈判时我能兼顾双方利益。", en: "In negotiation I balance both sides' interests." },
  { zh: "争执时我能保持语气平和。", en: "I keep a calm tone during disagreements." },
  {
    zh: "我会注意对方的表情和肢体语言。",
    en: "I pay attention to facial expressions and body language.",
  },
  { zh: "我的书面表达简洁清楚。", en: "My writing is concise and clear." },
  { zh: "我能用理由说服别人。", en: "I can persuade others with reasons." },
  { zh: "团队中我常常沟通不畅。", en: "I often struggle to communicate in teams.", reverse: true },
];

export const wellbeing: LikertQuestion[] = [
  { zh: "最近我经常感到压力很大。", en: "Lately I often feel very stressed.", reverse: true },
  { zh: "我的睡眠质量还不错。", en: "My sleep quality is fairly good." },
  { zh: "我对日常活动仍有兴趣。", en: "I still enjoy my daily activities." },
  { zh: "我经常感到疲惫、没有精力。", en: "I often feel tired and low in energy.", reverse: true },
  { zh: "我有可以倾诉的人。", en: "I have someone to talk to." },
  { zh: "我常常担心很多事情。", en: "I often worry about many things.", reverse: true },
  { zh: "我对自己基本满意。", en: "I am mostly satisfied with myself." },
  { zh: "我能专注地完成手头的事。", en: "I can focus on the task at hand." },
  { zh: "我觉得生活有方向和意义。", en: "I feel my life has direction and meaning." },
  { zh: "我经常感到孤独。", en: "I often feel lonely.", reverse: true },
];

export function likertScore(qs: LikertQuestion[], answers: number[]) {
  const total = qs.reduce(
    (s, q, i) => s + (q.reverse ? 4 - (answers[i] ?? 2) : (answers[i] ?? 2)),
    0,
  );
  return Math.round((total / (qs.length * 4)) * 100);
}
