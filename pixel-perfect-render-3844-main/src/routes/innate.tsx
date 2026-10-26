import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageHeader, LayerBadge, Disclaimer } from "@/components/Layer";
import { calculateTraditionalProfile, type TraditionalProfile } from "@/lib/chineseZodiac";
import { INNATE_KEY, addVersion, getVersions, type Version } from "@/lib/profileStore";
import { getStoredToken, getStoredEmail } from "@/lib/authClient";
import { saveProfileFn, getProfilesFn } from "@/lib/serverFns";
import { AuthModal } from "@/components/AuthModal";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Calendar, Lock, RefreshCw, Compass } from "lucide-react";

export const Route = createFileRoute("/innate")({
  head: () => ({
    meta: [
      { title: "先天档案 Innate Profile · 人生探索" },
      {
        name: "description",
        content: "精准农历干支八字排盘与五行解读 · BaZi & Lunar Astrological Profile.",
      },
      { property: "og:title", content: "先天档案 Innate Profile" },
      { property: "og:description", content: "生辰干支八字、五行生肖、西方星座与传统文化解读。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InnatePage,
});

type InnateFormData = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime?: string | undefined;
  birthPlace?: string | undefined;
  color?: string | undefined;
  profile?: TraditionalProfile | undefined;
};

export function InnatePage() {
  const { t } = useI18n();
  const [versions, setVersions] = useState<Version<InnateFormData>[]>([]);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const email = getStoredEmail();
    const token = getStoredToken();
    if (email && token) {
      setCurrentUser(email);
      // Fetch from server
      getProfilesFn({ data: { token, profileType: "innate" } })
        .then((res) => {
          if (res.success && res.profiles.length > 0) {
            setVersions(res.profiles);
          } else {
            setVersions(getVersions<InnateFormData>(INNATE_KEY));
          }
        })
        .catch(() => setVersions(getVersions<InnateFormData>(INNATE_KEY)));
    } else {
      setVersions(getVersions<InnateFormData>(INNATE_KEY));
    }
  }, []);

  const latest = versions[versions.length - 1];

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");

    const birthDate = g("birthDate");
    const birthTime = g("birthTime") || undefined;
    const traditional = calculateTraditionalProfile(birthDate, birthTime);

    const formData: InnateFormData = {
      name: g("name"),
      gender: g("gender"),
      birthDate,
      birthTime,
      birthPlace: g("birthPlace") || undefined,
      color: g("color") || undefined,
      profile: traditional,
    };

    // Save locally
    const v = addVersion<InnateFormData>(INNATE_KEY, formData);

    // Save to server if logged in
    const token = getStoredToken();
    if (token) {
      try {
        await saveProfileFn({
          data: {
            token,
            profileType: "innate",
            profileData: formData,
          },
        });
      } catch (err) {
        console.warn("[Profile] Server save notice:", (err as Error).message);
      }
    }

    setVersions(getVersions<InnateFormData>(INNATE_KEY));
    setEditing(false);
    setSaving(false);
  }

  if (!latest || editing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-500/5 via-background to-background">
        <PageHeader zh="先天档案" en="Innate Profile" element="wood">
          {t(
            "输入生辰，系统将基于中国传统农历历法与二十四节气进行干支生肖与五行推算。",
            "Accurate BaZi & Five Elements calculation using traditional Chinese lunar calendar.",
            "輸入生辰，系統將基於中國傳統農曆曆法與二十四節氣進行干支生肖與五行推算。",
          )}
        </PageHeader>

        <form onSubmit={submit} className="space-y-4 px-5">
          <Field
            label="真实姓名或称谓 · Name / Preferred Name"
            name="name"
            required
            placeholder="如：李明 / Leo"
          />

          <label className="block text-sm font-medium">
            性别 · Gender
            <select
              name="gender"
              className="mt-1 w-full rounded-md border border-input bg-card p-2 text-sm"
            >
              <option value="female">女 Female</option>
              <option value="male">男 Male</option>
              <option value="other">其他 Other</option>
            </select>
          </label>

          <Field
            label="公历出生日期 · Solar Birth Date"
            name="birthDate"
            type="date"
            required
            defaultValue="1995-06-15"
          />

          <Field
            label="出生时间 · Birth Time (精确时辰有助排盘，可选 optional)"
            name="birthTime"
            type="time"
          />

          <Field
            label="出生地点 · Birthplace (用于真太阳时参考，可选 optional)"
            name="birthPlace"
            placeholder="如：北京市海淀区 / Beijing"
          />

          <Field
            label="偏好的色彩 · Favourite Colour (可选 optional)"
            name="color"
            placeholder="如：青蓝、暖橙、月白"
          />

          <p className="text-xs text-muted-foreground">
            🔒 隐私保护：所有数据加密存储于自建服务端或当前设备，仅用于个人探索与文化解读。
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition-all"
          >
            {saving ? t("推算并锁定中...", "Calculating...", "推算並鎖定中...") : t("推算生辰并锁定档案", "Calculate BaZi & Lock Profile", "推算生辰並鎖定檔案")}
          </button>
        </form>

        <Disclaimer />
      </main>
    );
  }

  // Display computed traditional profile
  const data = latest.data;
  const p = data.profile || calculateTraditionalProfile(data.birthDate, data.birthTime);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-500/5 via-background to-background">
      <PageHeader zh="先天档案" en="Innate Profile" element="wood">
        {t(
          "已依据传统历法完成生辰干支八字与五行推算。",
          "Traditional BaZi and Five Elements calculated based on astronomical lunar calendar.",
          "已依據傳統曆法完成生辰干支八字與五行推算。",
        )}
      </PageHeader>

      <section className="space-y-4 px-5">
        {/* 用户基础卡片 */}
        <div className="rounded-xl border border-emerald-500/30 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {t(`档案版本 V${latest.version} · 已锁定`, `Version V${latest.version} · Locked`, `檔案版本 V${latest.version} · 已鎖定`)}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              {data.gender === "female" ? t("坤造 (女)", "Female", "坤造 (女)") : t("乾造 (男)", "Male", "乾造 (男)")}
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">{data.name}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {t("公历", "Solar", "公曆")}：{data.birthDate} {data.birthTime || ""}
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">{p.lunarDateStr}</p>
        </div>

        {/* 核心天干地支四柱 */}
        <div className="rounded-xl border border-emerald-500/30 bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Compass className="h-4 w-4 text-emerald-600" />
              {t("生辰四柱干支", "Four Pillars (BaZi)", "生辰四柱干支")}
            </h3>
            <LayerBadge kind="culture" />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2">
            <BaZiCell title={t("年柱 Year", "Year", "年柱 Year")} val={p.yearGanZhi} />
            <BaZiCell title={t("月柱 Month", "Month", "月柱 Month")} val={p.monthGanZhi} />
            <BaZiCell title={t("日柱 Day", "Day", "日柱 Day")} val={p.dayGanZhi} />
            <BaZiCell title={t("时柱 Hour", "Hour", "時柱 Hour")} val={p.timeGanZhi} />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            {t("传统上以立春节气与子夜子时为转换节点，精准对应农历纪历。", "Calculated accurately using astronomical solar terms and lunar calendar.")}
          </p>
        </div>

        {/* 生肖与五行属性 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              五行与生肖属性 · Five Elements & Zodiac
            </h3>
            <LayerBadge kind="culture" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-secondary/50 p-2.5">
              <p className="text-xs text-muted-foreground">传统生肖 · Zodiac</p>
              <p className="font-serif text-lg font-bold text-foreground">
                {p.zodiacZh} · {p.zodiacEn}
              </p>
            </div>
            <div className="rounded-md bg-secondary/50 p-2.5">
              <p className="text-xs text-muted-foreground">五行主气 · Dominant</p>
              <p className="font-serif text-lg font-bold text-foreground">
                {p.dominantElementZh} ({p.dominantElementEn}) · {p.yinYangZh}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1.5">四柱五行分布：</p>
            <div className="flex justify-between gap-1 text-xs">
              <ElementTag label="金 Metal" count={p.elementCounts.metal} />
              <ElementTag label="木 Wood" count={p.elementCounts.wood} />
              <ElementTag label="水 Water" count={p.elementCounts.water} />
              <ElementTag label="火 Fire" count={p.elementCounts.fire} />
              <ElementTag label="土 Earth" count={p.elementCounts.earth} />
            </div>
          </div>

          <div className="mt-3 rounded-md bg-primary/5 p-3 text-xs leading-relaxed text-foreground border border-primary/20">
            <p className="font-medium mb-1">传统哲学解读 · Cultural Reading：</p>
            <p>{p.traditionalReadingZh}</p>
            <p className="mt-1 text-muted-foreground">{p.traditionalReadingEn}</p>
          </div>
        </div>

        {/* 西方占星对照 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold">西方星座 · Western Astrology</h3>
            <LayerBadge kind="fun" />
          </div>
          <p className="text-base font-bold text-foreground">
            {p.westernZodiacZh} · {p.westernZodiacEn}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            按公历出生日期对应的黄道太阳星座划分，供多元文化探索参考。
          </p>
        </div>

        {/* 账户绑定与云端保存提示 · 木德青葱主题 */}
        {!currentUser && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center shadow-xs">
            <Lock className="mx-auto h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-2 text-sm font-bold text-foreground">
              {t("免费备份此档案到云端", "Free Cloud Backup for this Profile", "免費備份此檔案到雲端")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "当前档案保存在本机浏览器。验证邮箱即可永久同步到云端数据库，换设备不丢失。",
                "Profile currently in browser memory. Verify email to backup to database permanently."
              )}
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="mt-3.5 inline-block rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              {t("验证邮箱一键同步", "Verify Email & Sync", "驗證郵箱一鍵同步")}
            </button>
          </div>
        )}

        {/* 新建版本按钮 */}
        <button
          onClick={() => setEditing(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-card py-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t(`新建版本 V${latest.version + 1}`, `Create New Version V${latest.version + 1}`, `新建版本 V${latest.version + 1}`)}
        </button>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => setCurrentUser(email)}
      />

      <Disclaimer />
    </main>
  );
}

function BaZiCell({ title, val }: { title: string; val: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/30 p-2">
      <p className="text-[10px] text-muted-foreground">{title}</p>
      <p className="mt-1 font-serif text-base font-bold text-foreground">{val}</p>
    </div>
  );
}

function ElementTag({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex-1 rounded border border-border bg-secondary/40 py-1 text-center">
      <p className="text-[10px] text-muted-foreground">{label.split(" ")[0]}</p>
      <p className="font-bold text-xs">{count}</p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-md border border-input bg-card p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
