import { useI18n, type Language } from "../lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const options: { code: Language; label: string }[] = [
    { code: "zh-CN", label: "简体" },
    { code: "zh-TW", label: "繁體" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2 py-0.5 shadow-sm backdrop-blur">
      <Globe className="h-3 w-3 text-muted-foreground" />
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLang(opt.code)}
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
            lang === opt.code
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
