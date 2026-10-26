import { createFileRoute, Link } from "@tanstack/react-router";
import { LayerBadge, PageHeader, Disclaimer } from "@/components/Layer";
import { useI18n } from "@/lib/i18n";
import { Sparkles, ArrowRight, BookOpen, Compass, Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "首页 · 人生探索 Life Explorer" },
      {
        name: "description",
        content:
          "五行、阴阳、节气、生肖、星座与自我测评的双语探索平台 · Bilingual culture & self-assessment explorer.",
      },
      { property: "og:title", content: "人生探索 Life Explorer" },
      {
        property: "og:description",
        content: "传统文化、西方占星与自我测评，清楚区分科学、文化与娱乐。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-background pb-12">
      {/* 顶部标头 · 土元素主题 (Earth: 大地承载 · 暖杏琥珀金) */}
      <PageHeader zh="人生探索" en="Life Explorer" element="earth">
        {t(
          "融汇东方传统文化智慧，探索当下真实的内在自我。",
          "Explore timeless traditional wisdom and discover your authentic self today.",
          "融匯東方傳統文化智慧，探索當下真實的內在自我。"
        )}
      </PageHeader>

      {/* 1. 首页核心金黄色调引导横幅 · 土德承载万象 */}
      <div className="mx-5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 text-white shadow-lg relative border border-amber-400/30">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
            <span>{t("限时全站免费开放", "100% Free Full Access", "限時全站免費開放")}</span>
          </div>

          <h2 className="mt-3 font-serif text-2xl font-bold tracking-wide">
            {t("从 50 道免费测评开始", "Start Free 50-Question Assessment", "從 50 道免費測評開始")}
          </h2>
          <p className="mt-1 text-xs text-amber-100/90 leading-relaxed max-w-xs">
            {t(
              "认知推理 20 题 · 情商 10 题 · 沟通 10 题 · 身心 10 题，生成个人专属思维与素养画像。",
              "20 Cognitive, 10 EQ, 10 Communication, 10 Wellbeing questions to map your cognitive profile.",
              "認知推理 20 題 · 情商 10 題 · 溝通 10 題 · 身心 10 題，生成個人專屬思維與素養畫像。"
            )}
          </p>

          <Link
            to="/acquired"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-amber-900 shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <span>{t("立即开始免费测试", "Start Assessment Now", "立即開始免費測試")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* 2. 五行大美画廊 (五大真实艺术名画，无重复) */}
      <section className="mt-8 px-5">
        <div className="mb-3 flex items-end justify-between gap-2 border-b border-amber-500/20 pb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {t("东方哲学图腾", "Five Elements Gallery", "東方哲學圖騰")}
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {t("五行生生之象", "Living Five Elements", "五行生生之象")}
            </h2>
          </div>
          <LayerBadge kind="culture" />
        </div>

        {/* 主五行生克图 (wuxing.png) */}
        <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-card shadow-sm transition-all hover:shadow-md">
          <div className="relative aspect-video w-full overflow-hidden bg-amber-950/5">
            <img
              src="/wuxing.png"
              alt="五行相生相克图"
              className="h-full w-full object-contain p-3 transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4 border-t border-border/60">
            <h3 className="font-serif text-base font-bold text-foreground">
              {t("五行生克运转机制", "Generating & Overcoming Cycles", "五行生剋運轉機制")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {t(
                "木生火，火生土，土生金，金生水，水生木；相克相济，维持大自然与人身心的和谐节律。",
                "Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal enriches Water, and Water nourishes Wood."
              )}
            </p>
          </div>
        </div>

        {/* 5 元素专属艺术画作网格 (5 张独立名画，各显神通，绝不重复) */}
        <div className="mt-3.5 grid grid-cols-5 gap-2">
          <ElementArtCard
            zh="木"
            en="Wood"
            img="/assets/wuxing/wood-bamboo.webp"
            desc={t("竹韵生机", "Vitality", "竹韻生機")}
            color="border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
          />
          <ElementArtCard
            zh="火"
            en="Fire"
            img="/assets/wuxing/fire-phoenix.jpg"
            desc={t("火凤浴光", "Radiance", "火鳳浴光")}
            color="border-rose-500/40 text-rose-700 dark:text-rose-400"
          />
          <ElementArtCard
            zh="土"
            en="Earth"
            img="/assets/wuxing/earth-mountain.jpg"
            desc={t("厚重山岳", "Stability", "厚重山嶽")}
            color="border-amber-500/40 text-amber-700 dark:text-amber-400"
          />
          <ElementArtCard
            zh="金"
            en="Metal"
            img="/assets/wuxing/metal-sword.jpg"
            desc={t("宝剑淬锋", "Precision", "寶劍淬鋒")}
            color="border-cyan-500/40 text-cyan-800 dark:text-cyan-400"
          />
          <ElementArtCard
            zh="水"
            en="Water"
            img="/assets/wuxing/water-wave.jpg"
            desc={t("碧波万顷", "Wisdom", "碧波萬頃")}
            color="border-indigo-500/40 text-indigo-700 dark:text-indigo-400"
          />
        </div>
      </section>

      {/* 3. 传统文化经典四象 (阴阳、干支、生肖、节气 - 四张专属图片，无重复) */}
      <section className="mt-8 px-5">
        <div className="mb-3 flex items-end justify-between gap-2 border-b border-amber-500/20 pb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {t("古典东方智慧", "Classical Traditions", "古典東方智慧")}
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {t("时空与阴阳象意", "Cosmic Cycles & Lore", "時空與陰陽象意")}
            </h2>
          </div>
          <LayerBadge kind="culture" />
        </div>

        {/* 2x2 精美画廊网格 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 太极阴阳 (yinyang.jpg) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-transform hover:scale-[1.01]">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src="/yinyang.jpg"
                alt="太极阴阳图"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("太极阴阳之道", "Yin-Yang Philosophy", "太極陰陽之道")}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {t(
                  "阴阳对立互根，孤阴不生，独阳不长，启迪身心动静平衡。",
                  "Harmonious balance of complementary forces in daily life."
                )}
              </p>
            </div>
          </div>

          {/* 天干地支 (tiangandizhi.svg - 独创专属六十甲子干支罗盘，杜绝西方星座重复) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-transform hover:scale-[1.01]">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src="/tiangandizhi.svg"
                alt="六十甲子天干地支盘"
                className="h-full w-full object-contain p-1 transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("天干地支纪历", "Stems & Branches", "天干地支紀曆")}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {t(
                  "十干十二支配六十甲子，先天档案推算生辰四柱的根基。",
                  "10 Stems and 12 Branches forming the classical 60-year calendar."
                )}
              </p>
            </div>
          </div>

          {/* 十二生肖 (shengxiao.webp) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-transform hover:scale-[1.01]">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src="/shengxiao.webp"
                alt="十二生肖动物图"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("十二生肖民俗", "Chinese Zodiac", "十二生肖民俗")}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {t(
                  "以立春为界，寄托对不同生命性情与志趣的美好寓意。",
                  "Twelve animal archetypes divided precisely by Lichun."
                )}
              </p>
            </div>
          </div>

          {/* 二十四节气 (assets/wuxing/jieqi.jpeg) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-transform hover:scale-[1.01]">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src="/assets/wuxing/jieqi.jpeg"
                alt="二十四节气农事轮盘"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("二十四节气历法", "24 Solar Terms", "二十四節氣曆法")}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {t(
                  "依据太阳运行划分的农事历法，顺应天时生活作息之源。",
                  "Ancient solar calendar reflecting climate changes and seasonal life."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 星座与娱乐指引 (十二星座 xingzuo.jpg + 塔罗 taluo.jpg - 绝不重复) */}
      <section className="mt-8 px-5">
        <div className="mb-3 flex items-end justify-between gap-2 border-b border-amber-500/20 pb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              {t("西方占星与娱乐", "Western Astrology & Fun", "西方占星與娛樂")}
            </span>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {t("多元星盘与趣味指引", "Astrology & Entertainment", "多元星盤與趣味指引")}
            </h2>
          </div>
          <LayerBadge kind="fun" />
        </div>

        <div className="grid gap-3.5">
          {/* 十二星座图 (assets/wuxing/xingzuo.jpg) */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="aspect-[21/9] w-full overflow-hidden bg-slate-900/10">
              <img
                src="/assets/wuxing/xingzuo.jpg"
                alt="十二黄道星座图"
                className="h-full w-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3.5">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("黄道十二星座 · Western Zodiac", "12 Zodiac Signs", "黃道十二星座 · Western Zodiac")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {t(
                  "依据公历出生日期划分太阳星座，融合西方原型性格心理学，供现代人日常自我觉察与娱乐闲谈。",
                  "Twelve astrological signs divided by solar date, blending archetype lore for mindful amusement."
                )}
              </p>
            </div>
          </div>

          {/* 塔罗牌意象 (taluo.jpg) */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
            <div className="col-span-1 overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
              <img
                src="/taluo.jpg"
                alt="每日塔罗与智慧象征"
                className="h-full w-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="col-span-2 flex flex-col justify-center">
              <h3 className="font-serif text-sm font-bold text-foreground">
                {t("每日专属塔罗抽牌", "Daily Tarot Drawing", "每日專屬塔羅抽牌")}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {t(
                  "每日 0 点后生成 1 张专属塔罗牌，结合九维生活习惯建议，为新的一天增添从容仪式感。",
                  "One daily card draw locked per calendar day, fostering reflective mindfulness."
                )}
              </p>
              <Link
                to="/daily"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <span>{t("前往每日建议", "Go to Daily Advice", "前往每日建議")}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 底部快速开始引导卡片 */}
      <section className="mt-8 px-5">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/10 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-600" />
              {t("开始自我探索之旅", "Begin Self-Discovery", "開始自我探索之旅")}
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
              {t("永久免费", "100% Free", "永久免費")}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {t(
              "后天 50 题测评已全面开放，输入生辰更可一键排盘先天干支八字与纳音五行。",
              "The 50-question assessment is open for free. Enter your birth date for full BaZi profile.",
              "後天 50 題測評已全面開放，輸入生辰更可一鍵排盤先天干支八字與納音五行。"
            )}
          </p>
          <div className="mt-4 flex items-center gap-2.5">
            <Link
              to="/acquired"
              className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-colors"
            >
              {t("50 题自我测评", "50-Question Quiz", "50 題自我測評")}
            </Link>
            <Link
              to="/innate"
              className="flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 text-center text-xs font-bold text-emerald-800 dark:text-emerald-300 transition-colors"
            >
              {t("先天生辰排盘", "BaZi Astrological", "先天生辰排盤")}
            </Link>
          </div>
        </div>
      </section>

      {/* 6. 手机扫码体验卡片 (二维码) */}
      <section className="mt-6 px-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-white p-1 shadow-xs">
            <img
              src="/qrcode.png"
              alt="手机扫码访问 Life Explorer"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {t("移动端专属适配", "Mobile Experience", "移動端專屬適配")}
            </span>
            <h3 className="font-serif text-sm font-bold text-foreground">
              {t("手机扫码快速登录", "Scan QR Code for Mobile Access", "手機掃碼快速登錄")}
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
              {t(
                "微信或手机相机扫码即可直达，随时随地开启每日运势与个性化测评。",
                "Scan with phone camera to launch mobile experience on life-explorer-eta.vercel.app directly.",
                "微信或手機相機掃碼即可直達，隨時隨地開啟每日運勢與個性化測評。"
              )}
            </p>
          </div>
        </div>
      </section>

      <Disclaimer />

      <div className="mt-4 pb-2 text-center">
        <Link
          to="/admin"
          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors underline"
        >
          {t("管理员控制台", "Admin Dashboard", "管理員控制台")}
        </Link>
      </div>
    </main>
  );
}

function ElementArtCard({
  zh,
  en,
  img,
  desc,
  color,
}: {
  zh: string;
  en: string;
  img: string;
  desc: string;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center overflow-hidden rounded-xl border bg-card p-1.5 shadow-2xs ${color}`}>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <img
          src={img}
          alt={zh}
          className="h-full w-full object-cover transition-transform hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="mt-1 font-bold text-xs">{zh}</span>
      <span className="text-[9px] opacity-75">{en}</span>
      <span className="text-[8px] opacity-60 text-center leading-tight mt-0.5 line-clamp-1">{desc}</span>
    </div>
  );
}
