import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "zh-CN" | "zh-TW" | "en";

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (zhCn: string, en: string, zhTw?: string) => string;
  isZh: boolean;
};

const LANG_KEY = "le_preferred_lang";

const LanguageContext = createContext<I18nContextType>({
  lang: "zh-CN",
  setLang: () => {},
  t: (zhCn) => zhCn,
  isZh: true,
});

/**
 * Detect language automatically from client environment:
 * 1. Saved user preference in localStorage
 * 2. Mobile/Browser locale (navigator.language)
 * 3. Default to zh-CN (or en if non-Chinese)
 */
function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "zh-CN";

  const saved = localStorage.getItem(LANG_KEY) as Language | null;
  if (saved && ["zh-CN", "zh-TW", "en"].includes(saved)) {
    return saved;
  }

  const browserLang =
    (navigator.languages && navigator.languages[0]) || navigator.language || "zh-CN";
  const lower = browserLang.toLowerCase();

  if (
    lower.startsWith("zh-tw") ||
    lower.startsWith("zh-hk") ||
    lower.startsWith("zh-mo") ||
    lower.includes("hant")
  ) {
    return "zh-TW";
  }
  if (lower.startsWith("zh")) {
    return "zh-CN";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("zh-CN");

  useEffect(() => {
    const detected = detectInitialLanguage();
    setLangState(detected);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_KEY, newLang);
    }
  };

  const t = (zhCn: string, en: string, zhTw?: string): string => {
    if (lang === "en") return en;
    if (lang === "zh-TW") return zhTw || toTraditionalChinese(zhCn);
    return zhCn;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        isZh: lang.startsWith("zh"),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}

// Lightweight converter for common Simplified to Traditional characters
function toTraditionalChinese(str: string): string {
  const map: Record<string, string> = {
    探索: "探索",
    传统: "傳統",
    文化: "文化",
    档案: "檔案",
    先天: "先天",
    后天: "後天",
    每日: "每日",
    建议: "建議",
    会员: "會員",
    免费: "免費",
    认知: "認知",
    沟通: "溝通",
    身心: "身心",
    状态: "狀態",
    测试: "測試",
    阴阳: "陰陽",
    节气: "節氣",
    运算: "運算",
    科学: "科學",
    娱乐: "娛樂",
    解读: "解讀",
    生肖: "生肖",
    验证: "驗證",
    邮箱: "郵箱",
    锁定: "鎖定",
  };

  let res = str;
  for (const [s, t] of Object.entries(map)) {
    res = res.replaceAll(s, t);
  }
  return res;
}
