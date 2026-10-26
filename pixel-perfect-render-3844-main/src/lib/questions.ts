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
  // ===== 1-5: 易 Easy (基础模式识别、规律与空间) =====
  {
    level: "易 Easy",
    zh: "3, 6, 9, 12, ? 下一个数是？",
    en: "3, 6, 9, 12, ? What comes next?",
    options: o("13", "14", "15", "16"),
    answer: 2,
  },
  {
    level: "易 Easy",
    zh: "书本之于阅读，如同画笔之于？",
    en: "Book is to reading as paintbrush is to?",
    options: [
      { zh: "纸张", en: "Paper" },
      { zh: "绘画", en: "Painting" },
      { zh: "颜色", en: "Color" },
      { zh: "橡皮", en: "Eraser" },
    ],
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "如果你面朝北站立，先向右转90度，再向后转180度，此时你面朝哪个方向？",
    en: "Facing North, you turn 90° right, then 180° around. Which direction are you facing?",
    options: [
      { zh: "东 East", en: "East" },
      { zh: "南 South", en: "South" },
      { zh: "西 West", en: "West" },
      { zh: "北 North", en: "North" },
    ],
    answer: 2,
  },
  {
    level: "易 Easy",
    zh: "将一张正方形纸沿对角线对折后，得到的平面几何图形是？",
    en: "Folding a square paper along its diagonal gives what 2D shape?",
    options: [
      { zh: "矩形", en: "Rectangle" },
      { zh: "等腰直角三角形", en: "Isosceles right triangle" },
      { zh: "等边三角形", en: "Equilateral triangle" },
      { zh: "梯形", en: "Trapezoid" },
    ],
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "5, 9, 13, 17, ? 下一个数是？",
    en: "5, 9, 13, 17, ? What comes next?",
    options: o("19", "20", "21", "22"),
    answer: 2,
  },

  // ===== 6-11: 中 Medium (经典递推、二阶数列、立体认知与逆向思维) =====
  {
    level: "中 Medium",
    zh: "1, 1, 2, 3, 5, 8, 13, ? 经典数列下一个数是？",
    en: "1, 1, 2, 3, 5, 8, 13, ? What is the next number?",
    options: o("18", "19", "20", "21"),
    answer: 3,
  },
  {
    level: "中 Medium",
    zh: "一个标准正方体木块有几个面、几条棱、几个顶点？",
    en: "How many faces, edges, and vertices does a standard cube have?",
    options: [
      { zh: "6面、12棱、8顶点", en: "6 faces, 12 edges, 8 vertices" },
      { zh: "6面、8棱、12顶点", en: "6 faces, 8 edges, 12 vertices" },
      { zh: "8面、12棱、6顶点", en: "8 faces, 12 edges, 6 vertices" },
      { zh: "6面、10棱、8顶点", en: "6 faces, 10 edges, 8 vertices" },
    ],
    answer: 0,
  },
  {
    level: "中 Medium",
    zh: "2, 5, 10, 17, 26, ? 差值依次递增，问号处的数是？",
    en: "2, 5, 10, 17, 26, ? What comes next?",
    options: o("33", "35", "37", "39"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "在一次跑步比赛中：甲不是第一名；乙紧随甲后冲线；丙在乙之前冲线且不是最后一名；丁是第四名。谁获得了第一名？",
    en: "In a race: A is not 1st; B finishes right behind A; C finishes before B and is not last; D is 4th. Who won 1st place?",
    options: o("甲 A", "乙 B", "丙 C", "丁 D"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "球拍与网球共花费 110 元，球拍比网球贵 100 元。网球的价格是多少？",
    en: "A racket and a ball cost $110 total; the racket costs $100 more. How much does the ball cost?",
    options: o("10元 $10", "5元 $5", "2元 $2", "1元 $1"),
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "5 台机器 5 分钟制造 5 个精密零件。照此速率，100 台同样的机器制造 100 个零件需要几分钟？",
    en: "5 machines make 5 parts in 5 minutes. At this rate, how long for 100 machines to make 100 parts?",
    options: o("1分钟 1 min", "5分钟 5 min", "20分钟 20 min", "100分钟 100 min"),
    answer: 1,
  },

  // ===== 12-16: 难 Hard (乘积递推、微角几何、代数逆推与边界爬行) =====
  {
    level: "难 Hard",
    zh: "2, 6, 12, 20, 30, ? 下一个数是？",
    en: "2, 6, 12, 20, 30, ? What comes next?",
    options: o("36", "40", "42", "44"),
    answer: 2,
  },
  {
    level: "难 Hard",
    zh: "当时钟正好指向 3 点 15 分时，时针与分针之间的夹角是多少度？",
    en: "At exactly 3:15, what is the angle between the hour hand and the minute hand?",
    options: o("0°", "7.5°", "12.5°", "15°"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "一个未知数加上它自身的一半，再减去自身的四分之一，结果是 15。这个数是多少？",
    en: "A number plus half of itself, minus one-fourth of itself, equals 15. What is the number?",
    options: o("10", "12", "14", "16"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "甲、乙、丙三人中有一人说了真话，两人说了假话。甲说：“我说的是假话。” 乙说：“甲说的是假话。” 丙说：“乙说的是假话。” 谁说的是真话？",
    en: "Among A, B, and C, exactly one speaks truth. A says: 'I am lying.' B says: 'A is lying.' C says: 'B is lying.' Who tells the truth?",
    options: [
      { zh: "甲 A", en: "A" },
      { zh: "乙 B", en: "B" },
      { zh: "丙 C", en: "C" },
      { zh: "无法判断 Indeterminate", en: "Indeterminate" },
    ],
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "水井深 12 米。一只蜗牛每天白天向上爬 3 米，夜晚休息滑下 2 米。蜗牛第几天能够爬出井口？",
    en: "A well is 12m deep. A snail climbs 3m by day and slips 2m by night. On which day does it reach the top?",
    options: o("9天 9 days", "10天 10 days", "11天 11 days", "12天 12 days"),
    answer: 1,
  },

  // ===== 17-20: 极难 Very Hard (矩阵计算、层级博弈、状态机搜索与时序测量) =====
  {
    level: "极难 Very Hard",
    zh: "观察3×3数字矩阵：第一行[2, 3, 13]；第二行[4, 1, 17]；第三行[5, 2, ?]。问号处的数字是？",
    en: "3x3 matrix: Row 1: [2, 3, 13]; Row 2: [4, 1, 17]; Row 3: [5, 2, ?]. What is '?'?",
    options: o("25", "27", "29", "31"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "甲乙丙三人面朝同一方向站成一列。丙能看到甲和乙，乙能看到甲，甲谁也看不到。有3顶黑帽和2顶白帽，给三人各戴一顶。裁判问丙是否知道自己帽子颜色，丙说“不知道”；接着问乙，乙也说“不知道”；甲听后立刻推断出自己帽子的颜色。甲戴的是？",
    en: "A, B, C stand in a line facing forward (C sees A & B; B sees A; A sees neither). Out of 3 black and 2 white hats, each wears one. C says 'I don't know'; B says 'I don't know'. A immediately deduces his hat color. What color is A's hat?",
    options: [
      { zh: "黑色 Black", en: "Black" },
      { zh: "白色 White", en: "White" },
      { zh: "无法推断 Indeterminate", en: "Indeterminate" },
      { zh: "黑白皆有可能 Both possible", en: "Both possible" },
    ],
    answer: 0,
  },
  {
    level: "极难 Very Hard",
    zh: "现有两个无刻度水桶，容积分别为 5 升和 3 升，水源充足。每次操作只能打满、倒空或将一桶水倒入另一桶至满或空。最少需要进行几次倒水/接水操作，才能精准在5升桶中量出 4 升水？",
    en: "Two unmarked jugs of 5L and 3L. Operations: fill, empty, or pour until full/empty. What is the minimum operations to measure exactly 4L in the 5L jug?",
    options: o("4次", "5次", "6次", "7次"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "有两根材质不均匀的香，每根从头燃到尾都恰好需要 60 分钟。若想利用这两根香精准测量 45 分钟，应该怎样操作？",
    en: "Two non-uniform incense sticks take 60 min each to burn. How to accurately measure 45 minutes?",
    options: [
      { zh: "将一根折成3/4点燃", en: "Fold one to 3/4 and light it" },
      { zh: "同时点燃第一根的两头和第二根的一头，第一根烧完时点燃第二根的另一头", en: "Light both ends of stick 1 and one end of stick 2; when stick 1 burns out, light the other end of stick 2" },
      { zh: "一根两头同时点燃，烧完后再点燃第二根", en: "Light both ends of stick 1, then light stick 2" },
      { zh: "无法精准测量", en: "Cannot be measured accurately" },
    ],
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
