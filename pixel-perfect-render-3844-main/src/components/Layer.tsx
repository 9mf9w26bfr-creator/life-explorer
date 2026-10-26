import type { ReactNode } from "react";
import { useI18n } from "../lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type LayerKind = "science" | "culture" | "fun";
export type WuxingElement = "wood" | "fire" | "earth" | "metal" | "water";

export function LayerBadge({ kind }: { kind: LayerKind }) {
  const { t } = useI18n();

  const labels: Record<LayerKind, string> = {
    science: t("科学参考 · Evidence-based", "Evidence-based", "科學參考 · Evidence-based"),
    culture: t("传统文化 · Cultural", "Cultural", "傳統文化 · Cultural"),
    fun: t("娱乐解读 · Entertainment", "Entertainment", "娛樂解讀 · Entertainment"),
  };

  const styles: Record<LayerKind, string> = {
    science:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300/40",
    culture:
      "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40",
    fun: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium shadow-2xs ${styles[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}

export function WuxingHeaderTag({ element }: { element: WuxingElement }) {
  const { t, isZh } = useI18n();

  const configs: Record<WuxingElement, { zh: string; en: string; meaning: string; style: string }> =
    {
      earth: {
        zh: "土",
        en: "Earth",
        meaning: t("承载万物 · 中正厚重", "Nurturing Foundation", "承載萬物 · 中正厚重"),
        style: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
      },
      wood: {
        zh: "木",
        en: "Wood",
        meaning: t("本源生发 · 仁和探索", "Vitality & Growth", "本源生發 · 仁和探索"),
        style: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
      },
      metal: {
        zh: "金",
        en: "Metal",
        meaning: t("精金百炼 · 严谨笃定", "Clarity & Precision", "精金百煉 · 嚴謹篤定"),
        style: "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
      },
      fire: {
        zh: "火",
        en: "Fire",
        meaning: t("朝阳照耀 · 热情明朗", "Radiance & Warmth", "朝陽照耀 · 熱情明朗"),
        style: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
      },
      water: {
        zh: "水",
        en: "Water",
        meaning: t("润泽通达 · 智水流深", "Flow & Wisdom", "潤澤通達 · 智水流深"),
        style: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
      },
    };

  const item = configs[element];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs ${item.style}`}
    >
      <span className="font-bold">
        {isZh ? `五行 · ${item.zh}` : `Element · ${item.en}`}
      </span>
      {isZh && <span className="text-[10px] opacity-80">({item.en})</span>}
      <span className="opacity-40">|</span>
      <span className="text-[10px]">{item.meaning}</span>
    </div>
  );
}

export function PageHeader({
  zh,
  en,
  children,
  element,
}: {
  zh: string;
  en: string;
  children?: ReactNode;
  element?: WuxingElement;
}) {
  const { t } = useI18n();

  return (
    <header className="px-5 pb-3 pt-6">
      <div className="flex items-center justify-between gap-2">
        {element ? <WuxingHeaderTag element={element} /> : <div />}
        <LanguageSwitcher />
      </div>

      <div className="mt-3">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          {t(zh, en)}
        </h1>
        <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">{en}</p>
      </div>

      {children && (
        <div className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{children}</div>
      )}
    </header>
  );
}

export function Disclaimer() {
  const { t } = useI18n();

  return (
    <div className="mx-5 my-6 rounded-lg border border-border/80 bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground shadow-2xs">
      <p className="font-medium text-foreground mb-1">
        ⚖️ {t("探索声明与准则", "Platform Disclaimer", "探索聲明與準則")}
      </p>
      <p>
        {t(
          "本平台严格区分科学测评、传统文化与娱乐解读。内容仅供个人自我反思、文化学习与娱乐生活参考，不构成任何医疗诊断、心理治疗、法律或财务投资建议。坚决杜绝任何确定性宿命论预测。",
          "This platform clearly separates evidence-based assessments, cultural heritage, and entertainment. Content is intended solely for personal reflection, cultural exploration, and mindful amusement. It does not constitute medical, psychological, legal, or financial advice.",
        )}
      </p>
    </div>
  );
}
