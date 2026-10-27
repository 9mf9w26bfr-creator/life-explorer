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
  type AssessmentSet,
  generateRandomizedAssessment,
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
  Target,
  Sparkles,
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
    meaningEn: "Vitality & Growth",
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
    meaningEn: "Radiance & Warmth",
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
    meaningEn: "Nurturing Foundation",
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
    meaningEn: "Clarity & Precision",
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
    meaningEn: "Flow & Wisdom",
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
    levelZh: "卓越极客 · 顶尖架构与战略家",
    levelEn: "Architect & Strategic Synthesizer",
    summaryZh:
      "具备极高维度的抽象模式识别、临界逆向推演与多步博弈计算力。在错综复杂的信息迷雾中，能迅速抓住底层因果轴心并构建闭环模型。",
    summaryEn:
      "Demonstrates high-dimensional pattern recognition, boundary value calculation, and multi-step deduction. Exceptional at distilling complex chaotic variables into clear causal frameworks.",
    strengthsZh: "二阶数列敏感、空间几何与对称感强、博弈推演与抗认知偏误能力卓越。",
    strengthsEn: "Second-order sequence sensitivity, spatial geometric acuity, game-theoretic logic, and strong resistance to cognitive biases.",
    adviceZh: "适合主导高复杂度决策与结构性创新。注意在团队沟通中放缓节奏，化繁为简传递核心脉络。",
    adviceEn: "Ideal for leading high-complexity strategies and structural innovations. Remember to moderate pace when communicating to keep teams aligned.",
  };
  if (r.iq <= 7) {
    iqProfile = {
      levelZh: "直觉感知 · 经验探索型",
      levelEn: "Intuitive & Experiential Explorer",
      summaryZh:
        "比起抽象公式与死板数学符号，你更信赖具身体验与直觉共振。在具体实践、人际互动与感性审美领域具有生动的生命力。",
      summaryEn:
        "Values concrete sensory experiences and somatic intuition over abstract mathematical formulas. Flourishes in hands-on practice, human interaction, and aesthetic discovery.",
      strengthsZh: "行动果决、不拘泥教条、对现实情境具有极快感知力与应变力。",
      strengthsEn: "Decisive action, pragmatic agility, and fast sensory responsiveness to real-time situations.",
      adviceZh: "面对复杂逻辑与财务算度时，建议借助纸笔列出分支图，利用清单思维辅助决策。",
      adviceEn: "When navigating complex logic or budgets, use structured checklists and branching diagrams to assist decision-making.",
    };
  } else if (r.iq <= 12) {
    iqProfile = {
      levelZh: "稳健务实 · 现实问题解决者",
      levelEn: "Pragmatic Problem Solver",
      summaryZh:
        "思维清晰严谨，在常规逻辑、关系映射与日常业务分析中展现出高度的稳定性与踏实作风，不轻易被极端假设带偏。",
      summaryEn:
        "Demonstrates solid, disciplined reasoning in operational logic and practical business workflows. Reliable and not easily misled by extreme hypothetical scenarios.",
      strengthsZh: "执行落地扎实、思维严谨负责、善于归纳过往成熟规律与经验。",
      strengthsEn: "Solid execution, dependable diligence, and skilled synthesis of proven empirical patterns.",
      adviceZh: "可在日常多进行逆向推演与假设反证练习，进一步拓宽打破常规的思维边界。",
      adviceEn: "Practice counterfactual reasoning and proof-by-contradiction puzzles to expand unconventional mental models.",
    };
  } else if (r.iq <= 16) {
    iqProfile = {
      levelZh: "敏锐逻辑 · 深度分析师",
      levelEn: "Sharp Analytical Mind",
      summaryZh:
        "具备优秀的多步演绎与二阶差分推理能力，能迅速厘清因果脉络，善于从表象数据中挖掘隐藏变量并化繁为简。",
      summaryEn:
        "Features superior multi-step deductive strength and acute pattern discernment. Excellent at uncovering latent variables and simplifying complex data.",
      strengthsZh: "因果分析深刻、临界条件敏锐、逻辑自洽度与专注度极高。",
      strengthsEn: "Deep causal insight, acute boundary sensitivity, and high logical consistency and concentration.",
      adviceZh: "善于发现问题本质，可进一步结合宏观长周期思维，将分析优势升华为全局战略视野。",
      adviceEn: "Synthesize micro-level analytical precision with macro long-term vision to elevate strategic perspective.",
    };
  }

  // 2. 情商与情绪调节 (EQ: 0 - 100)
  let eqProfile = {
    levelZh: "温润从容 · 高韧性共情者",
    levelEn: "Calm & Resilient Empath",
    summaryZh:
      "情绪觉察与接纳度极高，在遭遇突发压力或人际摩擦时能迅速启动内在刹车机制，以从容中立的态度稳住全场节奏。",
    summaryEn:
      "Exceptional emotional self-awareness and acceptance. Engages an internal pause during unexpected stress to maintain equilibrium and anchor the room.",
    adviceZh: "保持对内在情绪的温柔观照，同时注意保护自身情绪边界，避免过度代入他人的负能量。",
    adviceEn: "Maintain gentle self-compassion while safeguarding personal emotional boundaries against external negativity.",
  };
  if (r.eq < 50) {
    eqProfile = {
      levelZh: "真性流露 · 情绪敏感型",
      levelEn: "Deeply Feeling & Sensitive",
      summaryZh:
        "内心世界丰富细腻，对外部环境变化与他人评价较为敏感。在重压之下容易产生心智内耗或短时应激反应。",
      summaryEn:
        "Rich, nuanced inner world with acute sensitivity to external evaluation. Prone to mental rumination or stress reactivity under sustained pressure.",
      adviceZh:
        "建议建立‘5秒呼吸暂停法’，遇事深呼吸5秒再作回应；将身体反应与客观事实分离，善用运动或书写疏导情绪。",
      adviceEn:
        "Adopt a '5-second breath pause' before reacting. Separate somatic sensations from objective facts and express tension through writing or exercise.",
    };
  } else if (r.eq < 75) {
    eqProfile = {
      levelZh: "自洽平稳 · 理性平衡型",
      levelEn: "Self-Possessed & Balanced",
      summaryZh:
        "能够清晰觉察自我状态，面对生活起伏能维持基本的理性克制，具有良好的心理韧性与自我调节复原力。",
      summaryEn:
        "Clearly tracks personal emotions and maintains rational composure through life's fluctuations. Good baseline psychological resilience.",
      adviceZh: "在理性控制之外，允许自己适度表达真实脆弱，真诚的情感流动会让周围的人更加信任你。",
      adviceEn: "Beyond rational control, allow space for authentic vulnerability; genuine emotional exchange fosters deeper trust.",
    };
  }

  // 3. 人际沟通 (Communication: 0 - 100)
  let commProfile = {
    levelZh: "融通枢纽 · 卓有成效的表达者",
    levelEn: "Articulate Connector & Diplomat",
    summaryZh:
      "倾听与表达高度兼备，既能精准捕捉言语背后的潜在需求与情绪，又能用简练有力的语言达成双赢共识。",
    summaryEn:
      "Balances deep empathetic listening with crisp persuasion. Accurately reads between the lines and drives win-win alignment.",
    adviceZh: "适合担任团队桥梁或协同舵手，在复杂利益博弈中持续促成建设性合力。",
    adviceEn: "Suited for bridge-builder and collaborative leader roles, fostering constructive momentum in complex stakeholder environments.",
  };
  if (r.comm < 50) {
    commProfile = {
      levelZh: "内敛含蓄 · 沉潜思考型",
      levelEn: "Introspective & Deliberate",
      summaryZh:
        "习惯在内心深入推敲，众人面前或即兴交流时倾向于保留观点，更适合文字或一对一深度对话。",
      summaryEn:
        "Prefers deep internal reflection before speaking. Tends to reserve judgment in large groups and shines in writing or 1-on-1 dialogue.",
      adviceZh:
        "沟通前可先梳理 3 个关键论点，先给结论再摆事实；主动在对话中多提一个开放式问题，能显著减轻表达压力。",
      adviceEn:
        "Outline 3 core takeaways before meetings: lead with conclusions. Asking open-ended questions easily alleviates conversational pressure.",
    };
  } else if (r.comm < 75) {
    commProfile = {
      levelZh: "坦诚务实 · 稳健交流者",
      levelEn: "Candid & Grounded Communicator",
      summaryZh:
        "表达条理清晰，能就事论事地沟通问题，与同侪合作顺畅且具有基本的分寸感与契约精神。",
      summaryEn:
        "Expresses thoughts in an orderly, task-oriented manner. Collaborates smoothly with peers with sound boundary awareness.",
      adviceZh: "在事实沟通的基础上，多增加对对方心理感受的肯定与共鸣，会大幅提高说服效率与关系紧密度。",
      adviceEn: "In addition to factual clarity, acknowledge others' feelings to enhance mutual rapport and persuasive effectiveness.",
    };
  }

  // 4. 身心韧性 (Wellbeing: 0 - 100)
  let wellbeingProfile = {
    levelZh: "充盈澎湃 · 身心韧性极佳",
    levelEn: "Vibrant & High Resilience",
    summaryZh:
      "睡眠节律、能量储备与生活意义感均处于良性循环，内在能量蓄水池充裕，展现出向上的生命力。",
    summaryEn:
      "Circadian rhythms, energy reserves, and purposeful drive are in a flourishing virtuous cycle. Abundant internal energy reservoir.",
    adviceZh: "保持当前规律的作息节奏与对生活的热忱，在高效输出之余继续呵护心力平衡。",
    adviceEn: "Maintain current regular rhythms and zest for life, nurturing emotional balance alongside high output.",
  };
  if (r.wellbeing < 50) {
    wellbeingProfile = {
      levelZh: "心力耗竭预警 · 急需蓄力关照",
      levelEn: "Burnout Alert · Urgent Recharging",
      summaryZh:
        "近期压力负荷偏高，日常精力出现明显的透支信号，可能伴随睡眠质量下降或阶段性倦怠感。",
      summaryEn:
        "Recent stress levels are elevated, signaling energy depletion. Likely accompanied by disturbed sleep or fatigue.",
      adviceZh:
        "请立即为生活按下微暂停键：保证基础睡眠，主动剔除非必要事项，每天留出30分钟放空与户外自然接触。",
      adviceEn:
        "Press the pause button: protect baseline sleep, trim non-essential tasks, and carve out 30 minutes daily in fresh outdoor air.",
    };
  } else if (r.wellbeing < 75) {
    wellbeingProfile = {
      levelZh: "平稳运转 · 需注意劳逸补给",
      levelEn: "Steady State · Mindful Restoration",
      summaryZh:
        "能够维持日常工作生活的正常节奏，但在长时间高压连轴转后会感到疲乏，恢复周期略有延长。",
      summaryEn:
        "Maintains normal functional rhythm, but extended high-pressure stretches cause lingering fatigue and slower rebound.",
      adviceZh: "建立微休息习惯（如番茄工作法间歇深呼吸），增加周末自然沉浸，让身心恢复弹性。",
      adviceEn: "Adopt micro-breaks (e.g. Pomodoro deep breathing) and immerse in nature on weekends to rebuild resilience.",
    };
  }

  return { iqProfile, eqProfile, commProfile, wellbeingProfile };
}

function AcquiredPage() {
  const { t, isZh } = useI18n();
  const [versions, setVersions] = useState<Version<Result>[]>([]);
  const [taking, setTaking] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [assessmentSet, setAssessmentSet] = useState<AssessmentSet>(() => ({
    iq,
    eq,
    comm,
    wellbeing,
  }));

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

    // 检查本地防掉线进度草稿与专属随机题目
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (
          draft.questions &&
          Array.isArray(draft.questions.iq) &&
          draft.questions.iq.length === 20 &&
          Array.isArray(draft.questions.eq) &&
          draft.questions.eq.length === 10
        ) {
          setAssessmentSet(draft.questions);
        }
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

  function startOrResumeQuiz() {
    let currentSet = assessmentSet;
    // 若为初次开始（非恢复既有草稿），为用户随机抽取从易到难专属 50 题
    if (!restoredDraft) {
      const token = getStoredToken();
      currentSet = generateRandomizedAssessment(token || undefined);
      setAssessmentSet(currentSet);
      setAnswers([]);
      setStep(0);
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            step: 0,
            answers: [],
            questions: currentSet,
            updatedAt: Date.now(),
          }),
        );
      } catch (e) {
        console.warn("Draft init save error:", e);
      }
    }
    setTaking(true);
  }

  // ===== 当前题目逻辑 =====
  const part = PARTS.find((p) => step >= p.start && step < p.end)!;
  const isIQ = part.key === "iq";
  const idxInPart = step - part.start;

  const rawQ = isIQ
    ? assessmentSet.iq[step]
    : (part.key === "eq"
        ? assessmentSet.eq
        : part.key === "comm"
          ? assessmentSet.comm
          : assessmentSet.wellbeing)[idxInPart];

  const q = rawQ!;
  const options = isIQ ? (q as IQQuestion).options : likertScale;

  // ===== 答题与计分（防掉线持久化） =====
  async function pick(i: number) {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);

    // 实时持久化防掉线（保存当前题目集 + 已选答案 + 当前题号）
    const nextStep = step < TOTAL - 1 ? step + 1 : step;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          step: nextStep,
          answers: next,
          questions: assessmentSet,
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
    const iqScore = assessmentSet.iq.reduce((s, qItem, k) => s + (next[k] === qItem.answer ? 1 : 0), 0);
    const eqScore = likertScore(assessmentSet.eq, next.slice(20, 30));
    const commScore = likertScore(assessmentSet.comm, next.slice(30, 40));
    const wellbeingScore = likertScore(assessmentSet.wellbeing, next.slice(40, 50));

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
            {t("防掉线保护中 · 进度已实时自动保存", "Anti-Dropout Active · Autosaved in real-time", "防掉線保護中 · 進度已實時自動保存")}
          </span>
          <span className="text-[11px] opacity-80">
            {t("意外关闭不丢数据", "Zero data loss", "意外關閉不丟數據")}
          </span>
        </div>

        <div
          className="flex items-center justify-between text-xs"
          style={{ color: part.element.text }}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <IconComp className="h-4 w-4" />
            {isIQ
              ? `${isZh ? "认知推理" : "Cognitive"} · ${(q as IQQuestion).level}`
              : `${isZh ? part.zh : part.en}`}
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
          {isZh ? q.zh : q.en}
        </h2>
        {isZh && <p className="mt-1 text-sm text-muted-foreground">{q.en}</p>}

        <div className="mt-6 space-y-2.5">
          {options?.map((opt: { zh: string; en: string }, i: number) => {
            const mainLabel = isZh ? opt.zh : opt.en;
            const subLabel = isZh ? (opt.en !== opt.zh ? opt.en : null) : null;
            return (
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
                  <span className="font-medium text-foreground">{mainLabel}</span>
                  {answers[step] === i && (
                    <CheckCircle2 className="h-4 w-4" style={{ color: part.element.border }} />
                  )}
                </div>
                {subLabel && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{subLabel}</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              {t("← 上一题", "← Previous Question", "← 上一題")}
            </button>
          ) : (
            <div />
          )}

          <span className="text-[11px] text-muted-foreground">
            {t("已作答", "Answered", "已作答")} {answers.filter((a) => a !== undefined).length} / {TOTAL} {t("题", "Questions", "題")}
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
            {latest
              ? t("后天画像 · 终身永久锁定", "Acquired Profile · Permanently Locked", "後天畫像 · 終身永久鎖定")
              : t("免费标准测评 · 终身仅测一次", "Free Standard Assessment · One-time Only", "免費標準測評 · 終身僅測一次")}
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold">
            {t("后天档案测评", "Acquired Profile Assessment", "後天檔案測評")}
          </h2>
          <p className="mt-1 text-xs opacity-90 leading-relaxed">
            {t(
              "认知推理 20 题（易到极难） · 情商调节 10 题 · 人际沟通 10 题 · 身心韧性 10 题",
              "20 Cognitive (Easy to Very Hard) · 10 EQ · 10 Communication · 10 Wellbeing",
              "認知推理 20 題（易到極難） · 情商調節 10 題 · 人際溝通 10 題 · 身心韌性 10 題",
            )}
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
          {t("五行之道 · The Five Elements", "The Five Elements System", "五行之道 · The Five Elements")}
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
                {isZh ? el.zh : el.en}
              </span>
              <span
                className="text-[10px] mt-0.5 text-center leading-tight opacity-90"
                style={{ color: el.text }}
              >
                {isZh ? el.meaning : el.meaningEn}
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
                <h4 className="font-serif text-sm font-bold">
                  {t("测评已正式锁定 · 终身基准画像", "Assessment Permanently Locked · Lifelong Baseline", "測評已正式鎖定 · 終身基準畫像")}
                </h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {t(
                    "为保证认知心理测评的严肃性与初测真实性，后天档案仅限评测一次，已永久归卷。",
                    "To maintain psychometric integrity and baseline authenticity, this profile can only be taken once and is permanently archived.",
                    "為保證認知心理測評的嚴肅性與初測真實性，後天檔案僅限評測一次，已永久歸卷。",
                  )}
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
              value={`${latest.data.eq} ${t("分", "pts", "分")}`}
              element={ELEMENT.fire}
              iconComp={Heart}
            />
            <ScoreCard
              zh="人际沟通"
              en="Communication"
              value={`${latest.data.comm} ${t("分", "pts", "分")}`}
              element={ELEMENT.earth}
              iconComp={MessageSquare}
            />
            <ScoreCard
              zh="身心韧性"
              en="Wellbeing"
              value={`${latest.data.wellbeing} ${t("分", "pts", "分")}`}
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
                  {t("专属后天素养 · 深度综合测评分析报告", "Personalized In-Depth Multidimensional Assessment Report", "專屬後天素養 · 深度綜合測評分析報告")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "基于您 50 道测评实测数据的多维心智模型推演与提升指引",
                    "Evidence-based mental archetype deductions & actionable personal growth roadmap.",
                    "基於您 50 道測評實測數據的多維心智模型推演與提升指引",
                  )}
                </p>
              </div>

              {/* 1. 认知推理具体分析 */}
              <div className="rounded-xl border border-emerald-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      {t("维度一：认知推理心智画像（五行木 · 智慧生长）", "Dimension 1: Cognitive Reasoning (Wood · Growth)", "維度一：認知推理心智畫像（五行木 · 智慧生長）")}
                    </h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {t("得分", "Score", "得分")} {latest.data.iq} / 20
                  </span>
                </div>
                <div className="rounded-lg bg-emerald-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    {t("心智模型：", "Mental Archetype: ", "心智模型：")}
                    {isZh ? analysis.iqProfile.levelZh : analysis.iqProfile.levelEn}
                  </p>
                  <p className="text-foreground">
                    {isZh ? analysis.iqProfile.summaryZh : analysis.iqProfile.summaryEn}
                  </p>
                  <div className="border-t border-emerald-500/20 pt-2 text-[11px] text-muted-foreground space-y-1">
                    <p>
                      <strong className="text-foreground">{t("核心优势：", "Core Strengths: ", "核心優勢：")}</strong>
                      {isZh ? analysis.iqProfile.strengthsZh : analysis.iqProfile.strengthsEn}
                    </p>
                    <p>
                      <strong className="text-foreground">{t("精进建议：", "Growth Advice: ", "精進建議：")}</strong>
                      {isZh ? analysis.iqProfile.adviceZh : analysis.iqProfile.adviceEn}
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
                      {t("维度二：情商共情与情绪自洽（五行火 · 内在明澈）", "Dimension 2: EQ & Empathy (Fire · Inner Clarity)", "維度二：情商共情與情緒自洽（五行火 · 內在明澈）")}
                    </h4>
                  </div>
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    {t("得分", "Score", "得分")} {latest.data.eq} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-rose-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-rose-800 dark:text-rose-300">
                    {t("情绪特质：", "Emotional Trait: ", "情緒特質：")}
                    {isZh ? analysis.eqProfile.levelZh : analysis.eqProfile.levelEn}
                  </p>
                  <p className="text-foreground">
                    {isZh ? analysis.eqProfile.summaryZh : analysis.eqProfile.summaryEn}
                  </p>
                  <div className="border-t border-rose-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">{t("调适指导：", "Regulation Tips: ", "調適指導：")}</strong>
                    {isZh ? analysis.eqProfile.adviceZh : analysis.eqProfile.adviceEn}
                  </div>
                </div>
              </div>

              {/* 3. 人际沟通具体分析 */}
              <div className="rounded-xl border border-amber-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      {t("维度三：协同沟通与人际张力（五行土 · 承载互信）", "Dimension 3: Interpersonal Communication (Earth · Mutual Trust)", "維度三：協同溝通與人際張力（五行土 · 承載互信）")}
                    </h4>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    {t("得分", "Score", "得分")} {latest.data.comm} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-amber-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-amber-800 dark:text-amber-300">
                    {t("表达风格：", "Communication Style: ", "表達風格：")}
                    {isZh ? analysis.commProfile.levelZh : analysis.commProfile.levelEn}
                  </p>
                  <p className="text-foreground">
                    {isZh ? analysis.commProfile.summaryZh : analysis.commProfile.summaryEn}
                  </p>
                  <div className="border-t border-amber-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">{t("协同建议：", "Collaboration Tips: ", "協同建議：")}</strong>
                    {isZh ? analysis.commProfile.adviceZh : analysis.commProfile.adviceEn}
                  </div>
                </div>
              </div>

              {/* 4. 身心韧性具体分析 */}
              <div className="rounded-xl border border-cyan-500/30 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-600" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      {t("维度四：身心韧性与能量蓄水池（五行金 · 坚毅固本）", "Dimension 4: Somatic Wellbeing & Resilience (Metal · Fortitude)", "維度四：身心韌性與能量蓄水池（五行金 · 堅毅固本）")}
                    </h4>
                  </div>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                    {t("得分", "Score", "得分")} {latest.data.wellbeing} / 100
                  </span>
                </div>
                <div className="rounded-lg bg-cyan-500/5 p-3 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-cyan-800 dark:text-cyan-300">
                    {t("能量状态：", "Energy Reservoir: ", "能量狀態：")}
                    {isZh ? analysis.wellbeingProfile.levelZh : analysis.wellbeingProfile.levelEn}
                  </p>
                  <p className="text-foreground">
                    {isZh ? analysis.wellbeingProfile.summaryZh : analysis.wellbeingProfile.summaryEn}
                  </p>
                  <div className="border-t border-cyan-500/20 pt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">{t("蓄能指南：", "Restoration Tips: ", "蓄能指南：")}</strong>
                    {isZh ? analysis.wellbeingProfile.adviceZh : analysis.wellbeingProfile.adviceEn}
                  </div>
                </div>
              </div>

              {/* 综合赋能闭环总结 */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  {t("四维会通 · 个人发展战略建议", "Holistic Synthesis · Personal Growth Strategy", "四維會通 · 個人發展戰略建議")}
                </h4>
                <p className="text-xs text-foreground leading-relaxed">
                  {t(
                    "后天能力是一套动态协同的生命系统：认知推理提供了理性的“导航罗盘”，情商与沟通构成了现实的“推进引擎”，而身心韧性则是坚不可摧的“能源底盘”。将理性分析用于长远布局，将共情同理用于团队协同，常态化关照身心底线，方能在顺逆之境皆游刃有余。",
                    "Acquired capability is a dynamically synergistic system: cognitive reasoning provides the rational navigation compass, EQ and communication serve as the reality-facing propulsion engine, while somatic wellbeing forms the bedrock energy reservoir. Deploy analytical rigor for long-term vision, empathetic communication for team synergy, and protect mind-body vitality to flourish in any circumstance.",
                    "後天能力是一套動態協同的生命系統：認知推理提供了理性的“導航羅盤”，情商與溝通構成了現實的“推進引擎”，而身心韌性則是堅不可摧的“能源底盤”。將理性分析用於長遠布局，將共情同理用於團隊協同，常態化關照身心底線，方能在順逆之境皆游刃有餘。",
                  )}
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed text-center">
            {t(
              "⚠️ 认知题为逻辑益智探索，非医学或官方职业考试；心理与身心状态供自我反思，不替代专业诊疗。",
              "⚠️ Cognitive questions are for mental exploration, not official IQ or medical diagnosis. For personal reflection only.",
              "⚠️ 認知題為邏輯益智探索，非醫學或官方職業考試；心理與身心狀態供自我反思，不替代專業診療。",
            )}
          </p>
        </section>
      ) : (
        <div className="px-5 mt-4 space-y-3">
          {restoredDraft && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-serif text-sm font-bold">
                    {t("已无缝恢复您的答题进度！", "Quiz Progress Seamlessly Restored!", "已無縫恢復您的答題進度！")}
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                    {t(
                      `系统为您自动保留了上次退出前的答案（已完成至第 ${step + 1} / ${TOTAL} 题），防掉线保护生效中。`,
                      `Your answers were automatically saved up to Q${step + 1}/${TOTAL}. Anti-dropout protection is active.`,
                      `系統為您自動保留了上次退出前的答案（已完成至第 ${step + 1} / ${TOTAL} 題），防掉線保護生效中。`,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={startOrResumeQuiz}
            className="w-full py-3.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 shadow hover:opacity-95 transition-all"
            style={{ backgroundColor: ELEMENT.water.border }}
          >
            <CheckCircle2 className="h-5 w-5" />
            {restoredDraft
              ? t(`继续测评（从第 ${step + 1} 题继续）`, `Resume Assessment (at Q${step + 1})`, `繼續測評（從第 ${step + 1} 題繼續）`)
              : t("开始 50 题测试（仅限评测一次）", "Start 50 Questions (One-time only)", "開始 50 題測試（僅限評測一次）")}
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
  const { isZh } = useI18n();
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
          <p className="text-xs font-bold text-foreground">{isZh ? zh : en}</p>
          <p className="text-[10px] text-muted-foreground">{isZh ? en : zh}</p>
          <p className="mt-1 font-serif text-xl font-bold" style={{ color: element.text }}>
            {value}
          </p>
          <p className="text-[10px] mt-0.5 font-medium" style={{ color: element.text }}>
            {isZh ? `五行属${element.zh} · ${element.en}` : `Element: ${element.en}`}
          </p>
        </div>
      </div>
    </div>
  );
}
