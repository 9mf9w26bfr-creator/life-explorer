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

export type AssessmentSet = {
  iq: IQQuestion[];
  eq: LikertQuestion[];
  comm: LikertQuestion[];
  wellbeing: LikertQuestion[];
};

// ==========================================
// 1. IQ 认知推理题库 · 按难度严格划分
// ==========================================

// 易 Easy 题库 (基础模式识别、规律与空间)
export const iqPoolEasy: IQQuestion[] = [
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
  {
    level: "易 Easy",
    zh: "4, 8, 12, 16, ? 下一个数是？",
    en: "4, 8, 12, 16, ? What comes next?",
    options: o("18", "20", "22", "24"),
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "医生之于医院，如同教师之于？",
    en: "Doctor is to hospital as teacher is to?",
    options: [
      { zh: "黑板", en: "Blackboard" },
      { zh: "学校", en: "School" },
      { zh: "操场", en: "Playground" },
      { zh: "书包", en: "Schoolbag" },
    ],
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "时钟指针顺时针旋转，从12点转过90度，指针指向几点？",
    en: "Clock hands rotate clockwise. Rotating 90° from 12 o'clock points to what hour?",
    options: o("1点 1:00", "3点 3:00", "6点 6:00", "9点 9:00"),
    answer: 1,
  },
  {
    level: "易 Easy",
    zh: "一个正方形有4条对称轴，那么一个圆形有几条对称轴？",
    en: "A square has 4 axes of symmetry. How many axes of symmetry does a circle have?",
    options: o("1条", "2条", "4条", "无数条 Infinite"),
    answer: 3,
  },
  {
    level: "易 Easy",
    zh: "20, 16, 12, 8, ? 递减数列下一个数是？",
    en: "20, 16, 12, 8, ? Decreasing sequence next number is?",
    options: o("4", "2", "0", "-2"),
    answer: 0,
  },
];

// 中 Medium 题库 (经典递推、二阶数列、立体认知与逆向思维)
export const iqPoolMedium: IQQuestion[] = [
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
  {
    level: "中 Medium",
    zh: "1, 3, 7, 15, 31, ? 每个数是前一个数的两倍加一，问号处的数是？",
    en: "1, 3, 7, 15, 31, ? Sequence is 2n+1. What comes next?",
    options: o("55", "61", "63", "65"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "如果所有甲都是乙，有些乙是丙。下列哪项推论必然成立？",
    en: "If all A are B, and some B are C. Which conclusion must follow?",
    options: [
      { zh: "所有甲都是丙", en: "All A are C" },
      { zh: "有些乙是甲", en: "Some B are A" },
      { zh: "所有丙都是乙", en: "All C are B" },
      { zh: "甲都不是丙", en: "No A is C" },
    ],
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "一个凸正六边形总共有几条对角线？",
    en: "How many diagonals does a regular hexagon have in total?",
    options: o("6条", "8条", "9条", "12条"),
    answer: 2,
  },
  {
    level: "中 Medium",
    zh: "水结成冰后体积膨胀 1/11，那么当冰完全融化成水时，体积会减少几分之几？",
    en: "Water expands by 1/11 when freezing into ice. What fraction of volume does ice lose when melting into water?",
    options: o("1/10", "1/12", "1/11", "1/13"),
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "小明上学步行速度为 60米/分钟，放学原路返回速度为 40米/分钟。他往返全程的平均速度是每分钟多少米？",
    en: "A student walks to school at 60m/min and returns along the same route at 40m/min. What is the average round-trip speed?",
    options: o("50米/分", "48米/分", "45米/分", "52米/分"),
    answer: 1,
  },
  {
    level: "中 Medium",
    zh: "2, 3, 5, 7, 11, 13, ? 连续质数数列下一个数是？",
    en: "2, 3, 5, 7, 11, 13, ? Prime number sequence next number is?",
    options: o("15", "17", "19", "21"),
    answer: 1,
  },
];

// 难 Hard 题库 (乘积递推、微角几何、代数逆推与极值边界)
export const iqPoolHard: IQQuestion[] = [
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
  {
    level: "难 Hard",
    zh: "3, 5, 9, 17, 33, ? 差值依次为 2, 4, 8, 16, 32，问号处的数是？",
    en: "3, 5, 9, 17, 33, ? Differences are powers of 2. What is next?",
    options: o("55", "63", "65", "67"),
    answer: 2,
  },
  {
    level: "难 Hard",
    zh: "一个长方体长宽高分别为 3、4、5 厘米，表面全部涂满红色后切成 1×1×1 厘米的小正方体，没有任何一面有红色的有几个？",
    en: "A 3x4x5 block is painted red outside and cut into 1x1x1 cubes. How many small cubes have zero red faces?",
    options: o("4个", "6个", "8个", "12个"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "有 9 个外观相同的小金球，其中 8 个真球重量相同，另有 1 个假球略轻。使用天平最少几次称量必然能找出假球？",
    en: "Out of 9 identical balls, 1 is slightly lighter. What is the minimum weighings on a balance scale to guarantee finding it?",
    options: o("1次", "2次", "3次", "4次"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "班级有 50 名学生，30 人喜欢数学，28 人喜欢物理，15 人两门都喜欢。两门都不喜欢的学生有几人？",
    en: "In a class of 50 students, 30 like Math, 28 like Physics, 15 like both. How many like neither?",
    options: o("5人", "7人", "9人", "12人"),
    answer: 1,
  },
  {
    level: "难 Hard",
    zh: "1, 4, 13, 40, 121, ? 规律为前一项乘3加1，问号处的数是？",
    en: "1, 4, 13, 40, 121, ? Rule is 3n+1. What is the next number?",
    options: o("243", "361", "364", "368"),
    answer: 2,
  },
];

// 极难 Very Hard 题库 (矩阵计算、层级博弈、状态机搜索与时序测量)
export const iqPoolVeryHard: IQQuestion[] = [
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
  {
    level: "极难 Very Hard",
    zh: "观察规律：12 × 12 = 9, 23 × 23 = 25, 34 × 34 = 49，按照同样逻辑，45 × 45 等于多少？",
    en: "Pattern: 12x12=9, 23x23=25, 34x34=49. Following this logic, what is 45x45?",
    options: o("64", "72", "81", "90"),
    answer: 2,
  },
  {
    level: "极难 Very Hard",
    zh: "100 位囚犯戴红帽或蓝帽排成一列。每人只能看到前面所有人的帽子，看不到自己及后面的。从最后一人开始猜测自己的帽子颜色。事前商定最优策略，最多能保住几人 100% 猜对？",
    en: "100 prisoners wear red or blue hats in a line (each sees only those ahead). Starting from the back, each guesses their color. What is the maximum number guaranteed to survive?",
    options: o("50人", "90人", "98人", "99人"),
    answer: 3,
  },
  {
    level: "极难 Very Hard",
    zh: "四个袋子分别装有红、黄、蓝、绿球。袋外标签全部贴错。最少从几个袋子中各摸出一个球，就一定能推断出所有袋子的真实标签？",
    en: "4 bags with Red, Yellow, Blue, Green balls are all incorrectly labeled. What is the minimum bags to draw 1 ball from to deduce all correct labels?",
    options: o("1个袋子", "2个袋子", "3个袋子", "4个袋子"),
    answer: 0,
  },
  {
    level: "极难 Very Hard",
    zh: "岛上有骑士（永远说真话）和小偷（永远说假话）。你遇到 A 和 B，A 说：“我们两人中至少有一个是小偷。” A 和 B 的身份分别是？",
    en: "On an island of Knights (truth-tellers) and Knaves (liars), A says: 'At least one of us is a Knave.' What are A and B?",
    options: [
      { zh: "两人都是小偷", en: "Both are Knaves" },
      { zh: "A是骑士，B是小偷", en: "A is a Knight, B is a Knave" },
      { zh: "A是小偷，B是骑士", en: "A is a Knave, B is a Knight" },
      { zh: "两人都是骑士", en: "Both are Knights" },
    ],
    answer: 1,
  },
];

// ==========================================
// 2. Likert 量表题库 (EQ / Comm / Wellbeing)
// ==========================================

export const likertScale: Choice[] = [
  { zh: "非常不符合", en: "Strongly disagree" },
  { zh: "不太符合", en: "Disagree" },
  { zh: "一般", en: "Neutral" },
  { zh: "比较符合", en: "Agree" },
  { zh: "非常符合", en: "Strongly agree" },
];

export const eqPool: LikertQuestion[] = [
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
  { zh: "面对他人的批评，我能客观分析而非立刻辩解。", en: "Faced with criticism, I analyze objectively without immediate defensiveness." },
  { zh: "我能理解与我观点完全不同的人的处境。", en: "I can empathize with people whose opinions completely differ from mine." },
  { zh: "疲惫时我能及时察觉并自我调节节奏。", en: "When exhausted, I notice early and adjust my pacing." },
  { zh: "在他人伤心时，我懂得如何给予真诚的陪伴。", en: "When someone is sad, I know how to offer genuine presence." },
  { zh: "遇到挫折时我常陷入长时间的懊悔。", en: "After setbacks, I often dwell in prolonged self-blame.", reverse: true },
];

export const commPool: LikertQuestion[] = [
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
  { zh: "提出不同意见时，我能顾及对方的感受。", en: "When expressing dissent, I respect the other person's feelings." },
  { zh: "在多人会议中，我能提炼出各方的核心分歧。", en: "In group meetings, I can distill the core divergences." },
  { zh: "与人交流时，我容易产生误解他人意图的倾向。", en: "In conversations, I tend to misunderstand others' intentions.", reverse: true },
  { zh: "我能根据谈话对象的背景调整表达方式。", en: "I adapt my communication style to the listener's background." },
  { zh: "收到他人求助时，我能明确告知可提供的支持边界。", en: "When asked for help, I clearly articulate the boundaries of my support." },
];

export const wellbeingPool: LikertQuestion[] = [
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
  { zh: "醒来时我感到精力有所恢复。", en: "I wake up feeling reasonably refreshed." },
  { zh: "面对突发变化，我能保持情绪平稳。", en: "In the face of unexpected disruptions, I stay grounded." },
  { zh: "我常常感到对未来缺乏掌控感。", en: "I frequently feel a lack of agency over the future.", reverse: true },
  { zh: "我有坚持的健康生活或运动习惯。", en: "I maintain healthy daily routines or regular physical exercise." },
  { zh: "在忙碌的一天后，我能顺利让自己放松下来。", en: "After a busy day, I can successfully unwind and relax." },
];

export function likertScore(qs: LikertQuestion[], answers: number[]) {
  const total = qs.reduce(
    (s, q, i) => s + (q.reverse ? 4 - (answers[i] ?? 2) : (answers[i] ?? 2)),
    0,
  );
  return Math.round((total / (qs.length * 4)) * 100);
}

// ==========================================
// 3. 随机抽取生成用户专属从易到难 50 题
// ==========================================

function seededRandom(seedStr: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function sampleFromPool<T>(pool: T[], count: number, rng: () => number): T[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy.slice(0, count);
}

/**
 * 根据不同用户随机生成 50 题：
 * 认知推理 20 题严格按「易(5) -> 中(6) -> 难(5) -> 极难(4)」梯度编排
 * 情商 10 题、沟通 10 题、身心 10 题各从专属题库随机抽选
 */
export function generateRandomizedAssessment(seed?: string): AssessmentSet {
  const rng = seed ? seededRandom(seed) : Math.random;
  const iqEasy = sampleFromPool(iqPoolEasy, 5, rng);
  const iqMed = sampleFromPool(iqPoolMedium, 6, rng);
  const iqHard = sampleFromPool(iqPoolHard, 5, rng);
  const iqVeryHard = sampleFromPool(iqPoolVeryHard, 4, rng);

  return {
    iq: [...iqEasy, ...iqMed, ...iqHard, ...iqVeryHard],
    eq: sampleFromPool(eqPool, 10, rng),
    comm: sampleFromPool(commPool, 10, rng),
    wellbeing: sampleFromPool(wellbeingPool, 10, rng),
  };
}

// 默认基准 50 题（保持确定性测试兼容）
export const iq: IQQuestion[] = [
  iqPoolEasy[0]!,
  iqPoolEasy[1]!,
  iqPoolEasy[2]!,
  iqPoolEasy[3]!,
  iqPoolEasy[4]!,
  iqPoolMedium[0]!,
  iqPoolMedium[1]!,
  iqPoolMedium[2]!,
  iqPoolMedium[3]!,
  iqPoolMedium[4]!,
  iqPoolMedium[5]!,
  iqPoolHard[0]!,
  iqPoolHard[1]!,
  iqPoolHard[2]!,
  iqPoolHard[3]!,
  iqPoolHard[4]!,
  iqPoolVeryHard[0]!,
  iqPoolVeryHard[1]!,
  iqPoolVeryHard[2]!,
  iqPoolVeryHard[3]!,
];

export const eq: LikertQuestion[] = eqPool.slice(0, 10);
export const comm: LikertQuestion[] = commPool.slice(0, 10);
export const wellbeing: LikertQuestion[] = wellbeingPool.slice(0, 10);
