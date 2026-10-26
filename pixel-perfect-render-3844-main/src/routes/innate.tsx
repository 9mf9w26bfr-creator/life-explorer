import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { PageHeader, LayerBadge, Disclaimer } from "@/components/Layer";
import { calculateTraditionalProfile, type TraditionalProfile } from "@/lib/chineseZodiac";
import { INNATE_KEY, addVersion, getVersions, type Version } from "@/lib/profileStore";
import { getStoredToken, getStoredEmail } from "@/lib/authClient";
import { analyzeInnateProfileFn, getProfilesFn } from "@/lib/serverFns";
import { AuthModal } from "@/components/AuthModal";
import { useI18n } from "@/lib/i18n";
import {
  Sparkles,
  Calendar,
  Lock,
  Compass,
  Camera,
  Hand,
  User,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  ScrollText,
} from "lucide-react";

export const Route = createFileRoute("/innate")({
  head: () => ({
    meta: [
      { title: "先天档案 · 天元八字与神相形局 Innate Profile · 人生探索" },
      {
        name: "description",
        content: "精准农历干支八字排盘、面相手相五行形局参验 · 终身仅测一次并锁定归卷。",
      },
      { property: "og:title", content: "先天档案 · 天元八字与神相形局" },
      { property: "og:description", content: "生辰干支八字、五行生肖、面相手相传统神相文化解读。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InnatePage,
});

type FacePalmAnalysisData = {
  title: string;
  faceReading: string;
  palmReading: string;
  baziSynthesis: string;
  lifeAdvice: string;
  rawReport?: string;
};

type InnateFormData = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime?: string | undefined;
  birthPlace?: string | undefined;
  color?: string | undefined;
  profile?: TraditionalProfile | undefined;
  facePalmAnalysis?: FacePalmAnalysisData | undefined;
  hasFacePhoto?: boolean | undefined;
  hasPalmPhoto?: boolean | undefined;
};

// 客户端图片快速无损压缩，防止 Base64 超限
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function InnatePage() {
  const { t, isZh } = useI18n();
  const [versions, setVersions] = useState<Version<InnateFormData>[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 照片上传状态
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const palmInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const email = getStoredEmail();
    const token = getStoredToken();
    if (email && token) {
      setCurrentUser(email);
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

  async function handleFaceFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file);
      setFaceImage(base64);
    } catch (err) {
      console.warn("Face image read error:", err);
    }
  }

  async function handlePalmFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file);
      setPalmImage(base64);
    } catch (err) {
      console.warn("Palm image read error:", err);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");

    const name = g("name");
    const gender = g("gender");
    const birthDate = g("birthDate");
    const birthTime = g("birthTime") || undefined;
    const birthPlace = g("birthPlace") || undefined;
    const color = g("color") || undefined;

    try {
      const token = getStoredToken() || undefined;
      const res = await analyzeInnateProfileFn({
        data: {
          token,
          name,
          gender,
          birthDate,
          birthTime,
          birthPlace,
          color,
          faceImageBase64: faceImage || undefined,
          palmImageBase64: palmImage || undefined,
        },
      });

      if (res.success && res.profile) {
        addVersion<InnateFormData>(INNATE_KEY, res.profile);
        setVersions(getVersions<InnateFormData>(INNATE_KEY));
      } else {
        // Fallback
        const traditional = calculateTraditionalProfile(birthDate, birthTime);
        const fallbackFormData: InnateFormData = {
          name,
          gender,
          birthDate,
          birthTime,
          birthPlace,
          color,
          profile: traditional,
        };
        addVersion<InnateFormData>(INNATE_KEY, fallbackFormData);
        setVersions(getVersions<InnateFormData>(INNATE_KEY));
      }
    } catch (err) {
      console.warn("Innate analysis error, falling back to local calculation:", err);
      const traditional = calculateTraditionalProfile(birthDate, birthTime);
      const fallbackFormData: InnateFormData = {
        name,
        gender,
        birthDate,
        birthTime,
        birthPlace,
        color,
        profile: traditional,
      };
      addVersion<InnateFormData>(INNATE_KEY, fallbackFormData);
      setVersions(getVersions<InnateFormData>(INNATE_KEY));
    } finally {
      setSaving(false);
    }
  }

  // ===== 表单界面（仅在尚未评测过时显示） =====
  if (!latest) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-500/5 via-background to-background pb-16">
        <PageHeader zh="先天档案" en="Innate Profile" element="wood">
          {t(
            "输入生辰并上传手相、面相照片，系统将基于中国传统农历历法、二十四节气与五行神相形局进行综合推算。终身仅测一次并锁定归卷。",
            "Accurate BaZi & traditional physiognomy calculation based on Chinese lunar calendar and Five Elements morphology. One-time locked evaluation.",
            "輸入生辰並上傳手相、面相照片，系統將基於中國傳統農曆曆法、二十四節氣與五行神相形局進行綜合推算。終身僅測一次並鎖定歸卷。",
          )}
        </PageHeader>

        {/* 终身一次锁定提示 */}
        <div className="mx-5 mb-4 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="font-bold">
              {t("先天定数 · 终身仅测一次", "Innate Blueprint · One-time Lock", "先天定數 · 終身僅測一次")}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              {t(
                "依传统易理，生辰八字与神相初局代表先天元气，提交后将永久锁定，不可重复修改。",
                "According to classical wisdom, birth BaZi and physiognomy represent lifelong foundation. Once submitted, it will be permanently locked.",
                "依傳統易理，生辰八字與神相初局代表先天元氣，提交後將永久鎖定，不可重複修改。",
              )}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5">
          <Field
            label={t("真实姓名或称谓", "Full Name / Preferred Name", "真實姓名或稱謂")}
            name="name"
            required
            placeholder={t("如：李明", "e.g. Leo", "如：李明")}
          />

          <label className="block text-sm font-medium">
            {t("命造格局（性别）", "Gender & Polarity", "命造格局（性別）")}
            <select
              name="gender"
              className="mt-1 w-full rounded-md border border-input bg-card p-2 text-sm"
            >
              <option value="female">
                {t("坤造（女） Female", "Female (Yin)", "坤造（女） Female")}
              </option>
              <option value="male">
                {t("乾造（男） Male", "Male (Yang)", "乾造（男） Male")}
              </option>
              <option value="other">
                {t("其他 Other", "Other", "其他 Other")}
              </option>
            </select>
          </label>

          <Field
            label={t("公历出生日期", "Solar Birth Date", "公曆出生日期")}
            name="birthDate"
            type="date"
            required
            defaultValue="1995-06-15"
          />

          <Field
            label={t("出生时间 (精确时辰有助排盘，可选)", "Birth Time (Optional, helps hour pillar)", "出生時間 (精確時辰有助排盤，選填)")}
            name="birthTime"
            type="time"
          />

          <Field
            label={t("出生地点 (用于真太阳时参考，可选)", "Birthplace (Optional, for True Solar Time)", "出生地點 (用於真太陽時參考，選填)")}
            name="birthPlace"
            placeholder={t("如：北京市海淀区", "e.g. London, New York, Beijing", "如：北京市海淀區")}
          />

          <Field
            label={t("偏好的色彩 (可选)", "Preferred Colour (Optional)", "偏好的色彩 (選填)")}
            name="color"
            placeholder={t("如：竹青、朱砂、月白", "e.g. Bamboo Green, Crimson, Silver", "如：竹青、朱砂、月白")}
          />

          {/* 手相与面相照片上传专区 */}
          <div className="rounded-xl border border-emerald-500/30 bg-card p-4 space-y-4">
            <div>
              <h4 className="font-serif text-sm font-bold text-foreground flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-600" />
                {t("神相形局图文参验（手相与面相照片）", "Physiognomy & Palmistry Reading (Photos)", "神相形局圖文參驗（手相與面相照片）")}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(
                  "通过面相五岳骨相与手相三大主纹走势，会通八字五行盛衰，提供深度形局参验",
                  "Analyze facial structure and palm lines in harmony with your BaZi five elements.",
                  "透過面相五嶽骨相與手相三大主紋走勢，會通八字五行盛衰，提供深度形局參驗",
                )}
              </p>
            </div>

            {/* 面相照片 */}
            <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {t("面相照片", "Face Photo", "面相照片")}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {t("五官正面 · 光线均匀", "Frontal face · Even lighting", "五官正面 · 光線均勻")}
                </span>
              </div>

              {faceImage ? (
                <div className="relative mt-2 inline-block">
                  <img
                    src={faceImage}
                    alt="Face"
                    className="h-28 w-28 rounded-lg object-cover border border-emerald-500/40 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setFaceImage(null)}
                    className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-600 p-1 text-white shadow hover:bg-rose-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {t("面相已载入", "Face photo loaded", "面相已載入")}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => faceInputRef.current?.click()}
                  className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-4 px-2 hover:border-emerald-500 cursor-pointer transition-colors"
                >
                  <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-xs font-medium text-foreground">
                    {t("点击拍摄或上传面相照片", "Click to take or upload face photo", "點擊拍攝或上傳面相照片")}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t("露出额头印堂与下颌，用于辨察神采五岳", "Clear forehead and jaw for facial structure analysis", "露出額頭印堂與下頷，用於辨察神采五嶽")}
                  </p>
                </div>
              )}
              <input
                ref={faceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFaceFile}
              />
            </div>

            {/* 手相照片 */}
            <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Hand className="h-3.5 w-3.5 text-primary" />
                  {t("手相照片", "Palm Photo", "手相照片")}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {t("手掌平展 · 纹理清晰", "Open palm · Clear lines", "手掌平展 · 紋理清晰")}
                </span>
              </div>

              {palmImage ? (
                <div className="relative mt-2 inline-block">
                  <img
                    src={palmImage}
                    alt="Palm"
                    className="h-28 w-28 rounded-lg object-cover border border-emerald-500/40 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setPalmImage(null)}
                    className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-600 p-1 text-white shadow hover:bg-rose-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {t("手相已载入", "Palm photo loaded", "手相已載入")}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => palmInputRef.current?.click()}
                  className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-4 px-2 hover:border-emerald-500 cursor-pointer transition-colors"
                >
                  <Hand className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-xs font-medium text-foreground">
                    {t("点击拍摄或上传手掌照片", "Click to take or upload palm photo", "點擊拍攝或上傳手掌照片")}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t("平展手掌掌心向上，用于推演天地人三才气象", "Keep palm flat facing up to capture the 3 main lines", "平展手掌掌心向上，用於推演天地人三才氣象")}
                  </p>
                </div>
              )}
              <input
                ref={palmInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePalmFile}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {t(
              "🔒 隐私保护：所有数据加密存储于自建服务端或当前设备，仅用于个人探索与传统文化参验。",
              "🔒 Privacy Protected: Data encrypted on server/device for personal reflection.",
              "🔒 隱私保護：所有數據加密存儲於自建服務端或當前設備，僅用於個人探索與傳統文化參驗。",
            )}
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("天元象数与神相形局参验中...", "Calculating BaZi & Physiognomy...", "天元象數與神相形局參驗中...")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{t("推算生辰并终身锁定档案（仅测一次）", "Calculate BaZi & Lock Profile (One-time)", "推算生辰並終身鎖定檔案（僅測一次）")}</span>
              </>
            )}
          </button>
        </form>

        <Disclaimer />
      </main>
    );
  }

  // ===== 档案已锁定展示页面（只读，无法修改重测） =====
  const data = latest.data;
  const p = data.profile || calculateTraditionalProfile(data.birthDate, data.birthTime);
  const facePalm = data.facePalmAnalysis;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-500/5 via-background to-background pb-16">
      <PageHeader zh="先天档案" en="Innate Profile" element="wood">
        {t(
          "已依据传统历法与易道相法完成干支八字排盘与神相形局参验。",
          "Traditional BaZi and Five Elements physiognomy calculated and permanently locked.",
          "已依據傳統曆法與易道相法完成干支八字排盤與神相形局參驗。",
        )}
      </PageHeader>

      <section className="space-y-4 px-5">
        {/* 永久锁定横幅（严禁二次修改或重测） */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-950 dark:text-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold">
                {t("档案已正式入卷锁定 · 终身先天印记", "Profile Permanently Locked · Lifelong Innate Blueprint", "檔案已正式入卷鎖定 · 終身先天印記")}
              </h4>
              <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 mt-0.5">
                {t(
                  "先天干支与神相形局为终身定数基准，仅限参验一次，已永久归卷锁定。",
                  "Innate BaZi and physiognomy represent lifelong foundational imprint. Permanently locked.",
                  "先天干支與神相形局為終身定數基準，僅限參驗一次，已永久歸卷鎖定。",
                )}
              </p>
            </div>
          </div>
          <LayerBadge kind="culture" />
        </div>

        {/* 用户基础信息卡片 */}
        <div className="rounded-xl border border-emerald-500/30 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {t("终身档案版本 · 唯一锁定", "Lifelong Locked Profile", "終身檔案版本 · 唯一鎖定")}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              {data.gender === "female"
                ? t("坤造 (女)", "Female (Yin)", "坤造 (女)")
                : t("乾造 (男)", "Male (Yang)", "乾造 (男)")}
            </span>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">{data.name}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {t("公历生辰", "Solar Date", "公曆生辰")}：{data.birthDate} {data.birthTime || ""}
            </span>
            {data.birthPlace && <span className="ml-2">· {data.birthPlace}</span>}
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {isZh ? p.lunarDateStr : `Lunar Date: ${p.lunarDateStr} (${p.zodiacEn} Year)`}
          </p>
        </div>

        {/* 核心天干地支四柱 */}
        <div className="rounded-xl border border-emerald-500/30 bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Compass className="h-4 w-4 text-emerald-600" />
              {t("生辰四柱干支", "Four Pillars (BaZi)", "生辰四柱干支")}
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {t("天干地支", "Stems & Branches", "天干地支")}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2">
            <BaZiCell title={t("年柱 Year", "Year Pillar", "年柱 Year")} val={p.yearGanZhi} />
            <BaZiCell title={t("月柱 Month", "Month Pillar", "月柱 Month")} val={p.monthGanZhi} />
            <BaZiCell title={t("日柱 Day", "Day Pillar", "日柱 Day")} val={p.dayGanZhi} />
            <BaZiCell title={t("时柱 Hour", "Hour Pillar", "時柱 Hour")} val={p.timeGanZhi} />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            {t(
              "传统上以立春节气与子夜子时为转换节点，精准对应农历纪历与五行纳音。",
              "Calculated accurately using astronomical solar terms and lunar calendar.",
              "傳統上以立春節氣與子夜子時為轉換節點，精準對應農曆紀曆與五行納音。",
            )}
          </p>
        </div>

        {/* 生肖与五行属性 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("五行与生肖属性", "Five Elements & Chinese Zodiac", "五行與生肖屬性")}
            </h3>
            <LayerBadge kind="culture" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-secondary/50 p-2.5">
              <p className="text-xs text-muted-foreground">{t("传统生肖", "Zodiac", "傳統生肖")}</p>
              <p className="font-serif text-lg font-bold text-foreground">
                {isZh ? `${p.zodiacZh} · ${p.zodiacEn}` : p.zodiacEn}
              </p>
            </div>
            <div className="rounded-md bg-secondary/50 p-2.5">
              <p className="text-xs text-muted-foreground">{t("五行主气", "Dominant Element", "五行主氣")}</p>
              <p className="font-serif text-lg font-bold text-foreground">
                {isZh
                  ? `${p.dominantElementZh} (${p.dominantElementEn}) · ${p.yinYangZh}`
                  : `${p.dominantElementEn} (${p.yinYangEn})`}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1.5">
              {t("四柱五行分布：", "Four Pillars Element Distribution:", "四柱五行分布：")}
            </p>
            <div className="flex justify-between gap-1 text-xs">
              <ElementTag label={t("金 Metal", "Metal", "金 Metal")} count={p.elementCounts.metal} />
              <ElementTag label={t("木 Wood", "Wood", "木 Wood")} count={p.elementCounts.wood} />
              <ElementTag label={t("水 Water", "Water", "水 Water")} count={p.elementCounts.water} />
              <ElementTag label={t("火 Fire", "Fire", "火 Fire")} count={p.elementCounts.fire} />
              <ElementTag label={t("土 Earth", "Earth", "土 Earth")} count={p.elementCounts.earth} />
            </div>
          </div>

          <div className="mt-3 rounded-md bg-primary/5 p-3 text-xs leading-relaxed text-foreground border border-primary/20">
            <p className="font-medium mb-1">
              {t("传统哲学解读：", "Traditional Cultural Reading:", "傳統哲學解讀：")}
            </p>
            <p>{isZh ? p.traditionalReadingZh : p.traditionalReadingEn}</p>
          </div>
        </div>

        {/* 传统神相形局图文参验报告（纯东方相法，无 AI 字样） */}
        {facePalm && (
          <div className="rounded-xl border border-emerald-500/40 bg-card p-4 space-y-4 shadow-sm">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-1.5">
                  <ScrollText className="h-4 w-4 text-emerald-600" />
                  {t("天元象数 · 传统五行神相参验研析", "Five Elements Physiognomy & Palmistry Reading", "天元象數 · 傳統五行神相參驗研析")}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t(
                    "融合生辰四柱、面相三停五岳与手相天地人三才纹理之易道合参",
                    "Deep synthesis of Four Pillars, facial physiognomy, and palm line morphology.",
                    "融合生辰四柱、面相三停五嶽與手相天地人三才紋理之易道合參",
                  )}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                {t("神相入卷", "Archived", "神相入卷")}
              </span>
            </div>

            {/* 1. 五官三停辨析 */}
            <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20 space-y-1">
              <h5 className="font-serif text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-emerald-600" />
                {t("【面相形局 · 五岳三停气色辨析】", "【Facial Features & Five Peaks Morphology】", "【面相形局 · 五嶽三停氣色辨析】")}
              </h5>
              <p className="text-xs text-foreground leading-relaxed pt-1">
                {facePalm.faceReading}
              </p>
            </div>

            {/* 2. 掌纹三才推演 */}
            <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20 space-y-1">
              <h5 className="font-serif text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Hand className="h-3.5 w-3.5 text-emerald-600" />
                {t("【掌纹气象 · 天地人三才纹理推演】", "【Palmistry · Three Primary Lines & Mounts】", "【掌紋氣象 · 天地人三才紋理推演】")}
              </h5>
              <p className="text-xs text-foreground leading-relaxed pt-1">
                {facePalm.palmReading}
              </p>
            </div>

            {/* 3. 形命通会 */}
            <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20 space-y-1">
              <h5 className="font-serif text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                {t("【四柱八字 · 形相与命造格局通会】", "【BaZi & Physiognomy Cosmic Synthesis】", "【四柱八字 · 形相與命造格局通會】")}
              </h5>
              <p className="text-xs text-foreground leading-relaxed pt-1">
                {facePalm.baziSynthesis}
              </p>
            </div>

            {/* 4. 修身规箴 */}
            <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20 space-y-1">
              <h5 className="font-serif text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {t("【修身进德 · 养生立业研几规箴】", "【Mindful Living & Life Guidance】", "【修身進德 · 養生立業研幾規箴】")}
              </h5>
              <p className="text-xs text-foreground leading-relaxed pt-1">
                {facePalm.lifeAdvice}
              </p>
            </div>
          </div>
        )}

        {/* 西方占星对照 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold">
              {t("西方星座", "Western Astrology", "西方星座")}
            </h3>
            <LayerBadge kind="fun" />
          </div>
          <p className="text-base font-bold text-foreground">
            {isZh ? `${p.westernZodiacZh} · ${p.westernZodiacEn}` : p.westernZodiacEn}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "按公历出生日期对应的黄道太阳星座划分，供多元文化探索参考。",
              "Based on the tropical zodiac from solar birth date for multicultural reflection.",
              "按公曆出生日期對應的黃道太陽星座劃分，供多元文化探索參考。",
            )}
          </p>
        </div>

        {/* 账户绑定与云端保存提示 */}
        {!currentUser && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center shadow-xs">
            <Lock className="mx-auto h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-2 text-sm font-bold text-foreground">
              {t("免费备份此终身档案到云端", "Free Cloud Backup for this Profile", "免費備份此終身檔案到雲端")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "当前档案保存在本机浏览器。验证邮箱即可永久同步到云端数据库，换设备不丢失。",
                "Profile currently in browser memory. Verify email to backup to database permanently.",
                "當前檔案保存在本機瀏覽器。驗證郵箱即可永久同步到雲端數據庫，換設備不丟失。",
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
