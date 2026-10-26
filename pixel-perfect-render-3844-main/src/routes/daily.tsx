import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, LayerBadge, Disclaimer } from "@/components/Layer";
import { getStoredEmail, getStoredToken } from "@/lib/authClient";
import { getDailyReadingFn, getAiReflectionFn } from "@/lib/serverFns";
import { AuthModal } from "@/components/AuthModal";
import { useI18n } from "@/lib/i18n";
import {
  Sparkles,
  Lock,
  Shirt,
  Utensils,
  Home,
  Footprints,
  Briefcase,
  BookOpen,
  Heart,
  Users,
  Coins,
  Bot,
  Loader2,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute("/daily")({
  head: () => ({
    meta: [
      { title: "每日建议 Daily Advice · 人生探索" },
      {
        name: "description",
        content: "每日塔罗牌、电子骨牌与九维生活方式健康参考 · Daily Tarot & Lifestyle Advice.",
      },
      { property: "og:title", content: "每日建议 Daily Advice" },
      { property: "og:description", content: "每日专属塔罗抽牌、电子骨牌与九维生活习惯建议。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DailyPage,
});

const ICON_MAP: Record<string, any> = {
  Shirt,
  Utensils,
  Home,
  Footprints,
  Briefcase,
  BookOpen,
  Heart,
  Users,
  Coins,
};

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DailyPage() {
  const { t } = useI18n();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState<any | null>(null);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const dateKey = getTodayKey();

  useEffect(() => {
    const t = getStoredToken();
    const e = getStoredEmail();
    if (t && e) {
      setToken(t);
      setCurrentUser(e);
      loadDaily(t);
    }
  }, []);

  async function loadDaily(authToken: string) {
    setLoading(true);
    try {
      const res = await getDailyReadingFn({ data: { token: authToken, dateKey } });
      if (res.success && res.data) {
        setDailyData(res.data);
        if (res.data.aiReflection) {
          setAiReflection(res.data.aiReflection);
        }
      }
    } catch (err) {
      console.warn("Failed to load daily advice:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateAi() {
    if (!token) return;
    setLoadingAi(true);
    try {
      const res = await getAiReflectionFn({ data: { token, dateKey } });
      if (res.success && res.reflection) {
        setAiReflection(res.reflection);
      }
    } catch (err) {
      console.warn("Failed to generate AI reflection:", (err as Error).message);
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-500/5 via-background to-background">
      <PageHeader zh="每日建议" en="Daily Advice" element="fire">
        {t(
          "结合今日节律、塔罗象征、骨牌玄学与生活哲学生成的每日启发。每日仅生成一次并锁定。",
          "One locked daily guidance per calendar day. For mindfulness and cultural reflection.",
          "結合今日節律、塔羅象徵、骨牌玄學與生活哲學生成的每日啟發。每日僅生成一次並鎖定。",
        )}
      </PageHeader>

      <div className="px-5 space-y-4">
        {/* 日期栏 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">公历今日：{dateKey}</span>
          </div>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-foreground">
            当日锁定 · 无法重抽
          </span>
        </div>

        {/* 未登录游客门禁展示 · 火德暖阳红 */}
        {!currentUser && (
          <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-b from-rose-500/10 to-card p-6 text-center shadow-sm">
            <Lock className="mx-auto h-10 w-10 text-rose-600 dark:text-rose-400" />
            <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
              {t("免费验证邮箱，解锁今日建议", "Verify Email Free to Unlock Daily Guidance", "免費驗證郵箱，解鎖今日建議")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {t(
                "每日专属塔罗抽牌、骨牌指引、九维生活习惯建议与 Google Gemini 专属感悟，验证邮箱即可永久免费解锁！",
                "Daily locked Tarot draw, electronic dominoes, 9-dimension lifestyle habits, and Gemini AI reflections. 100% Free."
              )}
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="mt-5 w-full rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all"
            >
              {t("验证邮箱免费解锁", "Verify Free & Unlock Now", "驗證郵箱免費解鎖")}
            </button>
          </div>
        )}

        {/* 已登录状态加载中 */}
        {currentUser && loading && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            <p className="mt-3 text-xs">{t("正在抽取今日塔罗与生成九维生活建议...", "Drawing daily Tarot and generating 9-dimension advice...")}</p>
          </div>
        )}

        {/* 已登录且加载完成 */}
        {currentUser && !loading && dailyData && (
          <>
            {/* 塔罗牌卡片 */}
            <div className="rounded-2xl border border-rose-500/30 bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-rose-600" />
                  <h3 className="font-serif text-sm font-bold text-foreground">
                    {t("今日塔罗象征", "Daily Tarot Reading", "今日塔羅象徵")}
                  </h3>
                </div>
                <LayerBadge kind="fun" />
              </div>

              <div className="mt-2.5 rounded-xl bg-rose-500/5 p-4 border border-rose-500/20">
                <div className="flex items-baseline justify-between">
                  <p className="font-serif text-xl font-bold text-foreground">
                    {dailyData.tarot.nameZh}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({dailyData.tarot.nameEn})
                    </span>
                  </p>
                  <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    {dailyData.tarot.orientationZh} · {dailyData.tarot.orientationEn}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {dailyData.tarot.meaningZh}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/80 italic">
                  {dailyData.tarot.meaningEn}
                </p>
              </div>
            </div>

            {/* 电子骨牌卡片 */}
            <div className="rounded-2xl border border-rose-500/30 bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-foreground">
                  {t("每日电子骨牌", "Electronic Domino", "每日電子骨牌")}
                </h3>
                <LayerBadge kind="culture" />
              </div>

              <div className="mt-2 flex items-center gap-4 rounded-xl bg-secondary/40 p-3 border border-border/50">
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-background px-3 py-2 font-mono font-bold text-lg shadow-inner text-rose-700 dark:text-rose-400">
                  <span>{dailyData.domino.tile[0]}</span>
                  <div className="w-4 h-px bg-rose-500/30 my-0.5" />
                  <span>{dailyData.domino.tile[1]}</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {dailyData.domino.nameZh} · {dailyData.domino.traditionalSignZh}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{dailyData.domino.adviceZh}</p>
                </div>
              </div>
            </div>

            {/* Google Gemini AI 专属每日感悟 · 火德晨光主题 */}
            <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <h3 className="font-serif text-sm font-bold text-foreground">
                    {t("Google Gemini AI 专属感悟", "Google Gemini AI Reflection", "Google Gemini AI 專屬感悟")}
                  </h3>
                </div>
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                  Gemini 3.8 Flash
                </span>
              </div>

              {aiReflection ? (
                <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-foreground bg-card/80 p-3.5 rounded-xl border border-rose-500/20 shadow-2xs">
                  {aiReflection}
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground mb-3">
                    {t(
                      "点击下方按钮，由 Gemini AI 综合您的生辰五行与今日抽签，生成一段温暖的晨间反思。",
                      "Click below to generate a mindful morning reflection integrating your BaZi and today's draw."
                    )}
                  </p>
                  <button
                    onClick={handleGenerateAi}
                    disabled={loadingAi}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors"
                  >
                    {loadingAi && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {t("生成今日 AI 灵感感悟", "Generate Daily Reflection with Gemini", "生成今日 AI 靈感感悟")}
                  </button>
                </div>
              )}
            </div>

            {/* 九维生活方式建议 */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-foreground">
                  九维生活习惯建议 · 9-Dimension Advice
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>幸运色: {dailyData.advice.luckyColorZh}</span>
                  <span>数字: {dailyData.advice.luckyNumber}</span>
                </div>
              </div>

              {dailyData.advice.items.map((item: any) => {
                const IconComponent = ICON_MAP[item.iconName] || Sparkles;
                return (
                  <div
                    key={item.categoryEn}
                    className="rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-primary">
                      <IconComponent className="h-4 w-4" />
                      <span>
                        {item.categoryZh} · {item.categoryEn}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-foreground">{item.titleZh}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.contentZh}
                    </p>
                    <p className="text-[11px] text-muted-foreground/75 mt-0.5">{item.contentEn}</p>

                    {item.recipes && (
                      <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 font-bold text-amber-900 dark:text-amber-200">
                          <span className="flex items-center gap-1.5">
                            <Utensils className="h-4 w-4 text-amber-600" />
                            一日三餐健康养生食谱 · 3 Meals Recipes
                          </span>
                          <span className="text-[11px] rounded-full bg-amber-500/15 px-2 py-0.5 font-medium">
                            {item.recipes.wellnessGoal}
                          </span>
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                            <p className="font-bold text-foreground flex items-center gap-1">
                              <span>🌅 早餐 Breakfast：</span>
                              <span>{item.recipes.breakfast.name}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              <strong>食材清单：</strong>{item.recipes.breakfast.ingredients}
                            </p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                              <strong>烹饪/养生要旨：</strong>{item.recipes.breakfast.tip}
                            </p>
                          </div>

                          <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                            <p className="font-bold text-foreground flex items-center gap-1">
                              <span>☀️ 午餐 Lunch：</span>
                              <span>{item.recipes.lunch.name}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              <strong>食材清单：</strong>{item.recipes.lunch.ingredients}
                            </p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                              <strong>烹饪/养生要旨：</strong>{item.recipes.lunch.tip}
                            </p>
                          </div>

                          <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                            <p className="font-bold text-foreground flex items-center gap-1">
                              <span>🌙 晚餐 Dinner：</span>
                              <span>{item.recipes.dinner.name}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              <strong>食材清单：</strong>{item.recipes.dinner.ingredients}
                            </p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                              <strong>烹饪/养生要旨：</strong>{item.recipes.dinner.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => {
          setCurrentUser(email);
          const t = getStoredToken();
          if (t) {
            setToken(t);
            loadDaily(t);
          }
        }}
      />

      <Disclaimer />
    </main>
  );
}
