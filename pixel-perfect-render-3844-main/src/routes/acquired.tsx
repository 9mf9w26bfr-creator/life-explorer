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
import { Brain, Heart, MessageSquare, Activity, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/acquired")({
  head: () => ({
    meta: [
      { title: "后天档案 · 50 题测评 Acquired Profile · 人生探索" },
      {
        name: "description",
        content:
          "免费 50 题测评：认知20题、情商10题、沟通10题、身心状态10题 · Free 50-question self-assessment.",
      },
      { property: "og:title", content: "后天档案 50 题测评 · Acquired Profile" },
      {
        property: "og:description",
        content: "免费完成 50 道自我测评题目，认知推理与心理素养探索。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AcquiredPage,
});

type Result = { iq: number; eq: number; comm: number; wellbeing: number };

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

function AcquiredPage() {
  const { t } = useI18n();
  const [versions, setVersions] = useState<Version<Result>[]>([]);
  const [taking, setTaking] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

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

  // ===== 答题与计分 =====
  async function pick(i: number) {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);

    if (step < TOTAL - 1) return setStep(step + 1);

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
      <main className="px-5 pt-8">
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
              className="w-full rounded-lg border p-4 text-left transition-all hover:scale-[1.01]"
              style={{
                borderColor: answers[step] === i ? part.element.border : "var(--border)",
                backgroundColor: answers[step] === i ? part.element.bg : "var(--card)",
              }}
            >
              <span className="font-medium text-foreground">{opt.zh}</span>
              {opt.en !== opt.zh && (
                <span className="ml-2 text-xs text-muted-foreground">{opt.en}</span>
              )}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-xs text-muted-foreground underline hover:text-foreground"
          >
            ← 上一题 · Previous Question
          </button>
        )}
      </main>
    );
  }

  // ===== 首页展示 =====
  return (
    <main>
      {/* 优雅中国风五行几何横幅 */}
      <div className="relative mx-5 mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-6 text-primary-foreground shadow-md">
        <div className="relative z-10">
          <span className="inline-block rounded-full bg-primary-foreground/20 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            免费标准测评 · 50 题完整版
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold">后天档案测评</h2>
          <p className="mt-1 text-xs opacity-90 leading-relaxed">
            认知推理 20 题 · 情商调节 10 题 · 人际沟通 10 题 · 身心韧性 10 题
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary-foreground/10 blur-xl pointer-events-none" />
      </div>

      <PageHeader zh="后天能力档案" en="Acquired Profile" element="metal">
        {t(
          "科学参考：探索思维逻辑、情绪感知、协同表达与心理调适倾向。",
          "Evidence-based reflection: Explore logic, empathy, communication, and emotional resilience.",
          "科學參考：探索思維邏輯、情緒感知、協同表達與心理調適傾向。",
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
        <section className="px-5 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-foreground">
              当前结果 V{latest.version} · Latest Result
            </h2>
            <LayerBadge kind="science" />
          </div>

          {/* 结果卡片 · 五行配色 */}
          <div className="grid grid-cols-2 gap-3">
            <ScoreCard
              zh="认知推理"
              en="Cognitive"
              value={`${latest.data.iq}/20`}
              element={ELEMENT.wood}
              iconComp={Brain}
            />
            <ScoreCard
              zh="情商调节"
              en="EQ & Empathy"
              value={`${latest.data.eq}分`}
              element={ELEMENT.fire}
              iconComp={Heart}
            />
            <ScoreCard
              zh="人际沟通"
              en="Communication"
              value={`${latest.data.comm}分`}
              element={ELEMENT.earth}
              iconComp={MessageSquare}
            />
            <ScoreCard
              zh="身心状态"
              en="Wellbeing"
              value={`${latest.data.wellbeing}分`}
              element={ELEMENT.metal}
              iconComp={Activity}
            />

            {/* 新建版本按钮 */}
            <button
              onClick={() => {
                setAnswers([]);
                setStep(0);
                setTaking(true);
              }}
              className="col-span-2 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 shadow"
              style={{ backgroundColor: ELEMENT.water.border }}
            >
              <Sparkles className="h-4 w-4" />
              重新测评并生成新版本 · Retake Assessment
            </button>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            ⚠️ 认知题为益智推理测试，非专业标准化 IQ
            考试；身心状态仅为自我筛查，如长期不适请寻求专业医务人员支持。
          </p>
        </section>
      ) : (
        <div className="px-5 mt-4">
          <button
            onClick={() => setTaking(true)}
            className="w-full py-3.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 shadow hover:opacity-95"
            style={{ backgroundColor: ELEMENT.water.border }}
          >
            <CheckCircle2 className="h-5 w-5" />
            开始 50 题测试 · Start 50 Questions
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
