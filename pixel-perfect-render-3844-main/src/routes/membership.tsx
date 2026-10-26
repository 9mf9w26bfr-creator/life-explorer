import { createFileRoute } from "@tanstack/react-router";
import { Check, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader, Disclaimer } from "@/components/Layer";
import { AuthModal } from "@/components/AuthModal";
import { getStoredEmail, getStoredToken, clearSession } from "@/lib/authClient";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "权益中心 Free Membership · 人生探索" },
      {
        name: "description",
        content: "全部功能永久免费：验证邮箱即可解锁每日建议、塔罗与先天排盘 · 100% Free.",
      },
      { property: "og:title", content: "免费会员与权益 · Life Explorer" },
      {
        property: "og:description",
        content: "全功能免费开放，邮箱验证即可解锁全部档案与每日建议。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  const { t } = useI18n();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const email = getStoredEmail();
    if (token && email) {
      setCurrentUser(email);
    }
  }, []);

  function handleLogout() {
    clearSession();
    setCurrentUser(null);
  }

  const guestFeatures = [
    { zh: "文化与哲学知识库", en: "Cultural & philosophical library" },
    { zh: "50 题自我探索测评", en: "50-question comprehensive assessment" },
    { zh: "基础测评维度分析", en: "Four-dimension profile scores" },
    { zh: "五行文化色彩视觉", en: "Five elements palette theme" },
  ];

  const memberFeatures = [
    { zh: "全部游客基础功能", en: "All guest features included" },
    { zh: "精准先天八字排盘", en: "Precise BaZi & Lunar calendar engine" },
    { zh: "真太阳时与立春干支校正", en: "Astronomical Lichun & solar term accuracy" },
    { zh: "每日专属塔罗抽牌与锁定", en: "Daily locked Tarot reading" },
    { zh: "每日电子骨牌玄学指引", en: "Daily electronic Domino wisdom" },
    { zh: "九维日常生活建议 (衣食住行)", en: "9-dimension lifestyle advice" },
    { zh: "Google Gemini AI 专属感悟", en: "Personalized Gemini AI reflections" },
    { zh: "多设备跨端数据同步", en: "Cross-device profile backup" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-background pb-12">
      {/* 水元素主题 (Water: 润下蓄深 · 黛蓝青紫) */}
      <PageHeader zh="会员与权益" en="Free Membership" element="water">
        {t(
          "全平台功能已全额免费开放，仅需验证邮箱（确认非机器人）即可解锁全部权益。",
          "All features are 100% free! Simply verify your email to unlock all capabilities.",
          "全平台功能已全額免費開放，僅需驗證郵箱（確認非機器人）即可解鎖全部權益。"
        )}
      </PageHeader>

      <div className="space-y-4 px-5">
        {currentUser ? (
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-5 text-center shadow-sm">
            <UserCheck className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            <p className="mt-2 text-base font-bold text-foreground">
              {t("已认证正式用户", "Verified Member", "已認證正式用戶")}
            </p>
            <p className="text-sm font-mono text-muted-foreground">{currentUser}</p>
            <p className="mt-2 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              {t(
                "✨ 您已解锁先天档案、每日建议、塔罗抽牌及 AI 智能感悟等所有特权！",
                "✨ You have unlocked Innate BaZi, Daily Advice, Tarot readings, and Gemini AI reflections!",
                "✨ 您已解鎖先天檔案、每日建議、塔羅抽牌及 AI 智能感悟等所有特權！"
              )}
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 rounded-xl border border-indigo-500/30 bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors"
            >
              {t("退出登录", "Sign Out", "退出登錄")}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-indigo-500/50 bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-background p-5 text-center shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-2 font-serif text-lg font-bold text-foreground">
              {t("限时福利：全功能永久免费", "100% Free Forever", "限時福利：全功能永久免費")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
              {t(
                "为了回馈探索者，原 ¥9 付费功能现已全部转为免费！只需输入邮箱接收 6 位验证码，即可一键激活。",
                "All features are completely free! Simply enter your email to receive a 6-digit code to activate instantly.",
                "為了回饋探索者，原 ¥9 付費功能現已全部轉為免費！只需輸入郵箱接收 6 位驗證碼，即可一鍵激活。"
              )}
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              {t("立即免费激活", "Activate Free Account", "立即免費激活")}
            </button>
          </div>
        )}

        <div className="grid gap-3 pt-2">
          {/* 游客卡片 */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {t("未注册游客", "Guest", "未註冊遊客")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("无需登录，即开即测", "No sign-in required, instant start", "無需登錄，即開即測")}
                </p>
              </div>
              <p className="font-serif text-xl font-bold text-muted-foreground">¥0</p>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
              {guestFeatures.map((item) => (
                <li key={item.en} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{t(item.zh, item.en, item.zh)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 注册会员卡片 - 水元素深邃紫黛蓝高亮 */}
          <div className="rounded-xl border-2 border-indigo-500/40 bg-card p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-foreground">
                    {t("已验证用户", "Verified Member", "已驗證用戶")}
                  </p>
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                    {t("永久免费", "100% Free", "永久免費")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "完成防机器人邮箱验证后享有",
                    "Unlocked after anti-bot email verification",
                    "完成防機器人郵箱驗證後享有"
                  )}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs line-through text-muted-foreground mr-1">¥9</span>
                <span className="font-serif text-2xl font-bold text-indigo-600 dark:text-indigo-400">¥0</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
              {memberFeatures.map((item) => (
                <li key={item.en} className="flex items-center gap-2 text-xs text-foreground">
                  <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="font-medium">{t(item.zh, item.en, item.zh)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => setCurrentUser(email)}
      />

      <Disclaimer />
    </main>
  );
}
