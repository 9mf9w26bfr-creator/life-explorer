import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, LayerBadge, Disclaimer } from "@/components/Layer";
import {
  iq,
  eq,
  comm,
  wellbeing,
  likertScale,
  likertScore,
  type LikertQuestion,
  type IQQuestion,
} from "@/lib/questions";
import { ACQUIRED_KEY, addVersion, getVersions, type Version } from "@/lib/profileStore";
import { getStoredToken } from "@/lib/authClient";
import { saveProfileFn, getProfilesFn } from "@/lib/serverFns";
import { useI18n } from "@/lib/i18n";
import {
  Brain,
  Heart,
  MessageSquare,
  Activity,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/acquired")({
  head: () => ({
    meta: [
      { title: "后天档案 · 50 题测评 Acquired Profile · 人生探索" },
      {
        name: "description",
        content:
          "50 题专业测评：认知20题、情商10题、沟通10题、身心状态10题 · 终身仅测一次，生成深度综合分析报告。",
      },
      { property: "og:title", content: "后天档案 50 题测评 · Acquired Profile" },
      {
        property: "og:description",
        content: "50 道自我测评题目，认知推理与心理素养探索，防掉线自动保存与专属深度画像报告。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AcquiredPage,
});

type Result = { iq: number; eq: number; comm: number; wellbeing: number };

const DRAFT_KEY = "acquired_quiz_draft";

// ===== 五行体系 · 配色 + 文化释义 + 图标路径 =====
const ELEMENT = {
  wood: {
    name: "木",
    zh: "木",
    en: "Wood",
    meaning: "生长 · 生机 · 仁",
    bg: "#E3FCEF",
    border: "#36B37E",
    text: "#006644",
    icon: "/assets/wuxing/wood-bamboo.svg",
  },
  fire: {
    name: "火",
    zh: "火",
    en: "Fire",
    meaning: "光明 · 热情 · 礼",
    bg: "#FFEBE6",
    border: "#FF5630",
    text: "#BF2600",
    icon: "/assets/wuxing/fire-flame.svg",
  },
  earth: {
    name: "土",
    zh: "土",
    en: "Earth",
    meaning: "承载 · 包容 · 信",
    bg: "#FFF7E5",
    border: "#FFAB00",
    text: "#B36B00",
    icon: "/assets/wuxing/earth-mountain.svg",
  },
  metal: {
    name: "金",
    zh: "金",
    en: "Metal",
    meaning: "精炼 · 坚毅 · 义",
    bg: "#E6FCFF",
    border: "#00B8D9",
    text: "#008DA6",
    icon: "/assets/wuxing/metal-gold.svg",
  },
  water: {
    name: "水",
    zh: "水",
    en: "Water",
    meaning: "润泽 · 智慧 · 智",
    bg: "#EAE6FF",
    border: "#6554C0",
    text: "#403294",
    icon: "/assets/wuxing/water-wave.svg",
  },
} as const;

// ===== 测评模块绑定五行 · 20+10+10+10=50题 =====
const PARTS = [
  {
    key: "iq",
    zh: "认知推理",
    en: "Cognitive",
    start: 0,
    end: 20,
    element: ELEMENT.wood,
    iconComp: Brain,
  },
  {
    key: "eq",
    zh: "情商调节",
    en: "EQ & Empathy",
    start: 20,
    end: 30,
    element: ELEMENT.fire,
    iconComp: Heart,
  },
  {
    key: "comm",
    zh: "人际沟通",
    en: "Communication",
    start: 30,
    end: 40,
    element: ELEMENT.earth,
    iconComp: MessageSquare,
  },
  {
    key: "wellbeing",
    zh: "身心韧性",
    en: "Wellbeing",
    start: 40,
    end: 50,
    element: ELEMENT.metal,
    iconComp: Activity,
  },
] as const;

const TOTAL = 50;
const WUXING_LIST = [
  ELEMENT.wood,
  ELEMENT.fire,
  ELEMENT.earth,
  ELEMENT.metal,
  ELEMENT.water,
] as const;

function getDetailedAnalysis(r: Result) {
  // 1. 认知推理 (IQ: 0 - 20)
  let iqProfile = {
    level: "卓越极客 · 顶尖架构与战略家",
    levelEn: "Architect & Strategic Synthesizer",
    summary:
      "具备极高维度的抽象模式识别、临界逆向推演与多步博弈计算力。在错综复杂的信息迷雾中，能迅速抓住底层因果轴心并构建闭环模型。",
    strengths: "二阶数列敏感、空间几何与对称感强、博弈博识与抗直觉认知偏误能力卓越。",
    advice: "适合主导高复杂度决策与结构性创新。注意在团队沟通中放缓节奏，化繁为简传递核心脉络。",
  };
  if (r.iq <= 7) {
    iqProfile = {
      level: "直觉感知 · 经验探索型",
      levelEn: "Intuitive & Experiential Explorer",
      summary:
        "比起抽象公式与死板数学符号，你更信赖具身体验与直觉共振。在具体实践、人际互动与感性审美领域具有生动的生命力。",
      strengths: "行动果决、不拘泥教条、对现实情境具有极快感知力与应变力。",
      advice: "面对复杂逻辑与财务算度时，建议借助纸笔列出分支图，利用清单思维辅助决策。",
    };
  } else if (r.iq <= 12) {
    iqProfile = {
      level: "稳健务实 · 现实问题解决者",
      levelEn: "Pragmatic Problem Solver",
      summary:
        "思维清晰严谨，在常规逻辑、关系映射与日常业务分析中展现出高度的稳定性与踏实作风，不轻易被极端假设带偏。",
      strengths: "执行落地扎实、思维严谨负责、善于归纳过往成熟规律与经验。",
      advice: "可在日常多进行逆向推演与假设反证练习，进一步拓宽打破常规的思维边界。",
    };
  } else if (r.iq <= 16) {
    iqProfile = {
      level: "敏锐逻辑 · 深度分析师",
      levelEn: "Sharp Analytical Mind",
      summary:
        "具备优秀的多步演绎与二阶差分推理能力，能迅速厘清因果脉络，善于从表象数据中挖掘隐藏变量并化繁为简。",
      strengths: "因果分析深刻、临界条件敏锐、逻辑自洽度与专注度极高。",
      advice: "善于发现问题本质，可进一步结合宏观长周期思维，将分析优势升华为全局战略视野。",
    };
  }

  // 2. 情商与情绪调节 (EQ: 0 - 100)
  let eqProfile = {
    level: "温润从容 · 高韧性共情者",
    summary:
      "情绪觉察与接纳度极高，在遭遇突发压力或人际摩擦时能迅速启动内在刹车机制，以从容中立的态度稳住全场节奏。",
    advice: "保持对内在情绪的温柔观照，同时注意保护自身情绪边界，避免过度代入他人的负能量。",
  };
  if (r.eq < 50) {
    eqProfile = {
      level: "真性流露 · 情绪敏感型",
      summary:
        "内心世界丰富细腻，对外部环境变化与他人评价较为敏感。在重压之下容易产生心智内耗或短时应激反应。",
      advice:
        "建议建立‘5秒呼吸暂停法’，遇事深呼吸5秒再作回应；将身体反应与客观事实分离，善用运动或书写疏导情绪。",
    };
  } else if (r.eq < 75) {
    eqProfile = {
      level: "自洽平稳 · 理性平衡型",
      summary:
        "能够清晰觉察自我状态，面对生活起伏能维持基本的理性克制，具有良好的心理韧性与自我调节复原力。",
      advice: "在理性控制之外，允许自己适度表达真实脆弱，真诚的情感流动会让周围的人更加信任你。",
    };
  }

  // 3. 人际沟通 (Communication: 0 - 100)
  let commProfile = {
    level: "融通枢纽 · 卓有成效的表达者",
    summary:
      "倾听与表达高度兼备，既能精准捕捉言语背后的潜在需求与情绪，又能用简练有力的语言达成双赢共识。",
    advice: "适合担任团队桥梁或协同舵手，在复杂利益博弈中持续促成建设性合力。",
  };
  if (r.comm < 50) {
    commProfile = {
      level: "内敛含蓄 · 沉潜思考型",
      summary:
        "习惯在内心深入推敲，众人面前或即兴交流时倾向于保留观点，更适合文字或一对一深度对话。",
      advice:
        "沟通前可先梳理 3 个关键论点，先给结论再摆事实；主动在对话中多提一个开放式问题，能显著减轻表达压力。",
    };
  } else if (r.comm < 75) {
    commProfile = {
      level: "坦诚务实 · 稳健交流者",
      summary:
        "表达条理清晰，能就事论事地沟通问题，与同侪合作顺畅且具有基本的分寸感与契约精神。",
      advice: "在事实沟通的基础上，多增加对对方心理感受的肯定与共鸣，会大幅提高说服效率与关系紧密度。",
    };
  }

  // 4. 身心韧性 (Wellbeing: 0 - 100)
  let wellbeingProfile = {
    level: "充盈澎湃 · 身心韧性极佳",
    summary:
      "睡眠节律、能量储备与生活意义感均处于良性循环，内在能量蓄水池充裕，展现出向上的生命力。",
    advice: "保持当前规律的作息节奏与对生活的热忱，在高效输出之余继续呵护心力平衡。",
  };
  if (r.wellbeing < 50) {
    wellbeingProfile = {
      level: "心力耗竭预警 · 急需蓄力关照",
      summary:
        "近期压力负荷偏高，日常精力出现明显的透支信号，可能伴随睡眠质量下降或阶段性倦怠感。",
      advice:
        "请立即为生活按下微暂停键：保证基础睡眠，主动剔除非必要事项，每天留出30分钟放空与户外自然接触。",
    };
  } else if (r.wellbeing < 75) {
    wellbeingProfile = {
      level: "平稳运转 · 需注意劳逸补给",
      summary:
        "能够维持日常工作生活的正常节奏，但在长时间高压连轴转后会感到疲乏，恢复周期略有延长。",
      advice: "建立微休息习惯（如番茄工作法间歇深呼吸），增加周末自然沉浸，让身心恢复弹性。",
    };
  }

  return { iqProfile, eqProfile, commProfile, wellbeingProfile };
}

function AcquiredPage() {
  const { t } = useI18n();
  const [versions, setVersions] = useState<Version<Result>[]>([]);
  const [taking, setTaking] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [restoredDraft, setRestoredDraft] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      getProfilesFn({ data: { token, profileType: "acquired" } })
        .then((res) => {
          if (res.success && res.profiles.length > 0) {
            setVersions(res.profiles);
          } else {
            setVersions(getVersions<Result>(ACQUIRED_KEY));
          }
        })
        .catch(() => setVersions(getVersions<Result>(ACQUIRED_KEY)));
    } else {
      setVersions(getVersions<Result>(ACQUIRED_KEY));
    }

    // 检查本地防掉线进度草稿
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (draft.answers && Array.isArray(draft.answers) && draft.answers.length > 0) {
          setAnswers(draft.answers);
          setStep(Math.min(draft.step || 0, TOTAL - 1));
          setRestoredDraft(true);
        }
      }
    } catch (e) {
      console.warn("Failed to restore draft:", e);
    }
  }, []);

  const latest = versions[versions.length - 1];

  // ===== 当前题目逻辑 =====
  const part = PARTS.find((p) => step >= p.start && step < p.end)!;
  const isIQ = part.key === "iq";
  const idxInPart = step - part.start;

  const rawQ = isIQ
    ? iq[step]
    : (part.key === "eq" ? eq : part.key === "comm" ? comm : wellbeing)[idxInPart];

  const q = rawQ!;
  const options = isIQ ? (q as IQQuestion).options : likertScale;

  // ===== 答题与计分（防掉线持久化） =====
  async function pick(i: number) {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);

    // 实时持久化防掉线
    const nextStep = step < TOTAL - 1 ? step + 1 : step;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          step: nextStep,
          answers: next,
          updatedAt: Date.now(),
        }),
      );
    } catch (e) {
      console.warn("Draft save error:", e);
    }

    if (step < TOTAL - 1) {
      return setStep(step + 1);
    }

    // 完成全部 50 题后结算
    const iqScore = iq.reduce((s, qItem, k) => s + (next[k] === qItem.answer ? 1 : 0), 0);
    const eqScore = likertScore(eq, next.slice(20, 30));
    const commScore = likertScore(comm, next.slice(30, 40));
    const wellbeingScore = likertScore(wellbeing, next.slice(40, 50));

    const resultData: Result = {
      iq: iqScore,
      eq: eqScore,
      comm: commScore,
      wellbeing: wellbeingScore,
    };

    addVersion(ACQUIRED_KEY, resultData);
    setVersions(getVersions<Result>(ACQUIRED_KEY));

    // 清除草稿
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}

    const token = getStoredToken();
    if (token) {
      try {
        await saveProfileFn({
          data: {
            token,
            profileType: "acquired",
            profileData: resultData,
          },
        });
      } catch (err) {
        console.warn("Server save error:", err);
      }
    }

    setTaking(false);
  }

  // ===== 答题界面 =====
  if (taking) {
    const IconComp = part.iconComp;
    return (
      <main className="px-5 pt-8 pb-16">
        {/* 防掉线保护提示条 */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4" />
            防掉线保护中 · 进度已实时自动保存
          </span>
          <span className="text-[11px] opacity-80">意外关闭不丢数据</span>
        </div>

        <div
          className="flex items-center justify-between text-xs"
          style={{ color: part.element.text }}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <IconComp className="h-4 w-4" />
            {isIQ ? `认知推理 · ${(q as IQQuestion).level}` : `${part.zh} · ${part.en}`}
          </span>
          <span className="font-mono font-medium">
            {step + 1} / {TOTAL}
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: part.element.bg }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((step + 1) / TOTAL) * 100}%`,
              backgroundColor: part.element.border,
            }}
          />
        </div>

        <h2 className="mt-8 font-serif text-xl font-bold text-foreground leading-relaxed">
          {q.zh}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{q.en}</p>

        <div className="mt-6 space-y-2.5">
          {options?.map((opt: { zh: string; en: string }, i: number) => (
            <button
              key={i}
              onClick={() => pick(i)}
              className="w-full rounded-lg border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: answers[step] === i ? part.element.border : "var(--border)",
                backgroundColor: answers[step] === i ? part.element.bg : "var(--card)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{opt.zh}</span>
                {answers[step] === i && (
                  <CheckCircle2 className="h-4 w-4" style={{ color: part.element.border }} />
                )}
              </div>
              {opt.en !== opt.zh && (
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.en}</p>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              ← 上一题 · Previous Question
            </button>
          ) : (
            <div />
          )}

          <span className="text-[11px] text-muted-foreground">
            已作答 {answers.filter((a) => a !== undefined).length} / {TOTAL} 题
          </span>
        </div>
      </main>
    );
  }

  // ===== 结果与分析页面（或未测评首页） =====
  const analysis = latest ? getDetailedAnalysis(latest.data) : null;

  return (
    <main className="pb-16">
      {/* 优雅中国风五行几何横幅 */}
      <div className="relative mx-5 mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-6 text-primary-foreground shadow-md">
        <div className="relative z-10">
          <span className="inline-block rounded-full bg-primary-foreground/20 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            {latest ? "后天画像 · 终身永久锁定" : "免费标准测评 · 终身仅测一次"}
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold">后天档案测评</h2>
          <p className="mt-1 text-xs opacity-90 leading-relaxed">
            认知推理 20 题（易到极难） · 情商调节 10 题 · 人际沟通 10 题 · 身心韧性 10 题
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary-foreground/10 blur-xl pointer-events-none" />
      </div>

      <PageHeader zh="后天能力档案" en="Acquired Profile" element="metal">
        {t(
          "科学参考：探索思维逻辑、情绪感知、协同表达与心理调适倾向。测评仅限完成一次并锁定生成基线报告。",
          "Evidence-based reflection: Explore logic, empathy, communication, and resilience. One-time locked evaluation.",
          "科學參考：探索思維邏輯、情緒感知、協同表達與心理調適傾向。測評僅限完成一次並鎖定生成基線報告。",
        )}
      </PageHeader>

      {/* 五行文化展示区 */}
      <section className="px-5 py-2">
        <h3 className="text-center font-serif text-sm font-bold mb-3 text-muted-foreground">
          五行之道 · The Five Elements
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {WUXING_LIST.map((el) => (
            <div
              key={el.name}
              className="flex flex-col items-center rounded-lg p-2.5 transition-transform hover:scale-105"
              style={{
                backgroundColor: el.bg,
                border: `1.5px solid ${el.border}`,
              }}
            >
              <img
                src={el.icon}
                alt={el.zh}
                className="w-7 h-7 mb-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-bold text-base" style={{ color: el.text }}>
                {el.zh}
              </span>
              <span
                className="text-[10px] mt-0.5 text-center leading-tight opacity-90"
                style={{ color: el.text }}
              >
                {el.meaning}
              </span>
            </div>
          ))}
        </div>
      </section>

      {latest ? (
        <section className="px-5 mt-4 space-y-4">
          {/* 终身锁定状态横幅 */}
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="font-serif text-sm font-bold">测评已正式锁定 · 终身基准画像</h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  为保证认知心理测评的严肃性与初测真实性，后天档案仅限评测一次，已永久归卷。
                </p>
              </div>
            </div>
            <LayerBadge kind="science" />
          </div>

          {/* 核心四维结果卡片 */}
          <div className="grid grid-cols-2 gap-3">
            <ScoreCard
              zh="认知推理"
              en="Cognitive"
              value={`${latest.data.iq} / 20`}
              element={ELEMENT.wood}
              iconComp={Brain}
            />
            <ScoreCard
              zh="情商调节"
              en="EQ & Empathy"
              value={`${latest.data.eq} 分`}
              element={ELEMENT.fire}
              iconComp={Heart}
            />
            <ScoreCard
              zh="人际沟通"
              en="Communication"
              value={`${latest.data.comm} 分`}
              element={ELEMENT.earth}
              iconComp={MessageSquare}
            />
            <ScoreCard
              zh="身心韧性"
              en="Wellbeing"
              value={`${latest.data.wellbeing} 分`}
              element={ELEMENT.metal}
              iconComp={Activity}
            />
          </div>

          {/* 深度具体分析报告区 */}
          {analysis && (
            <div className="space-y-4 mt-6">
              <div className="border-b border-border pb-2">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  专属后天素养 · 深度综合测评分析报告
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  基于您 50 道测评实测数据的多维心智模型推演与提升指引
                </p>
              </div>

              {/* 1. 认知推理具体分析 */}
              <div className="rounded-xl border border-emerald-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      维度一：认知推理心智画像（五行木 · 智慧生长）
                    </h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    得分 {latest.data.iq} / 20
                  </span>
                </div>
                <div className="rounded-lg bg-emerald-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    心智模型：{analysis.iqProfile.level} ({analysis.iqProfile.levelEn})
                  </p>
                  <p className="text-foreground">{analysis.iqProfile.summary}</p>
                  <div className="border-t border-emerald-500/20 pt-2 text-[11px] text-muted-foreground space-y-1">
                    <p>
                      <strong className="text-foreground">核心优势：</strong>
                      {analysis.iqProfile.strengths}
                    </p>
                    <p>
                      <strong className="text-foreground">精进建议：</strong>
                      {analysis.iqProfile.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. 情商调节具体分析 */}
              <div className="rounded-xl border border-rose-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      维度二：情商共情与情绪自洽（五行火 · 内在明澈）
                    </h4>
                  </div>
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    得分 {latest.data.eq} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-rose-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-rose-800 dark:text-rose-300">
                    情绪特质：{analysis.eqProfile.level}
                  </p>
                  <p className="text-foreground">{analysis.eqProfile.summary}</p>
                  <div className="border-t border-rose-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">调适指导：</strong>
                    {analysis.eqProfile.advice}
                  </div>
                </div>
              </div>

              {/* 3. 人际沟通具体分析 */}
              <div className="rounded-xl border border-amber-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      维度三：协同沟通与人际张力（五行土 · 承载互信）
                    </h4>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    得分 {latest.data.comm} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-amber-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-amber-800 dark:text-amber-300">
                    表达风格：{analysis.commProfile.level}
                  </p>
                  <p className="text-foreground">{analysis.commProfile.summary}</p>
                  <div className="border-t border-amber-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">协同建议：</strong>
                    {analysis.commProfile.advice}
                  </div>
                </div>
              </div>

              {/* 4. 身心韧性具体分析 */}
              <div className="rounded-xl border border-cyan-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      维度四：身心韧性与能量蓄水池（五行金 · 坚毅固本）
                    </h4>
                  </div>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                    得分 {latest.data.wellbeing} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-cyan-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-cyan-800 dark:text-cyan-300">
                    能量状态：{analysis.wellbeingProfile.level}
                  </p>
                  <p className="text-foreground">{analysis.wellbeingProfile.summary}</p>
                  <div className="border-t border-cyan-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">蓄能指南：</strong>
                    {analysis.wellbeingProfile.advice}
                  </div>
                </div>
              </div>

              {/* 综合赋能闭环总结 */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  四维会通 · 个人发展战略建议
                </h4>
                <p className="text-xs text-foreground leading-relaxed">
                  后天能力是一套动态协同的生命系统：认知推理提供了理性的“导航罗盘”，情商与沟通构成了现实的“推进引擎”，而身心韧性则是坚不可摧的“能源底盘”。将理性分析用于长远布局，将共情同理用于团队协同，常态化关照身心底线，方能在顺逆之境皆游刃有余。
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed text-center">
            ⚠️ 认知题为逻辑益智探索，非医学或官方职业考试；心理与身心状态供自我反思，不替代专业诊疗。
          </p>
        </section>
      ) : (
        <div className="px-5 mt-4 space-y-3">
          {restoredDraft && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-serif text-sm font-bold">已无缝恢复您的答题进度！</h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                    系统为您自动保留了上次退出前的答案（已完成至第 {step + 1} / {TOTAL}{" "}
                    题），防掉线保护生效中。
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setTaking(true)}
            className="w-full py-3.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 shadow hover:opacity-95 transition-all"
            style={{ backgroundColor: ELEMENT.water.border }}
          >
            <CheckCircle2 className="h-5 w-5" />
            {restoredDraft
              ? `继续测评（从第 ${step + 1} 题继续）`
              : "开始 50 题测试（仅限评测一次）"}
          </button>
        </div>
      )}

      <Disclaimer />
    </main>
  );
}

// ===== 分数卡片组件 =====
function ScoreCard({
  zh,
  en,
  value,
  element,
  iconComp: IconComp,
}: {
  zh: string;
  en: string;
  value: string;
  element: (typeof ELEMENT)[keyof typeof ELEMENT];
  iconComp: any;
}) {
  return (
    <div
      className="rounded-lg border p-3.5"
      style={{
        borderColor: element.border,
        backgroundColor: element.bg,
      }}
    >
      <div className="flex items-start gap-2.5">
        <IconComp className="h-5 w-5 mt-0.5 shrink-0" style={{ color: element.text }} />
        <div>
          <p className="text-xs font-bold text-foreground">{zh}</p>
          <p className="text-[10px] text-muted-foreground">{en}</p>
          <p className="mt-1 font-serif text-xl font-bold" style={{ color: element.text }}>
            {value}
          </p>
          <p className="text-[10px] mt-0.5 font-medium" style={{ color: element.text }}>
            五行属{element.zh} · {element.en}
          </p>
        </div>
      </div>
    </div>
  );
}
