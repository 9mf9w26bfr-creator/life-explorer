import { Link } from "@tanstack/react-router";
import { Home, Sprout, BookOpen, Sun, ShieldCheck } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function BottomNav() {
  const { t } = useI18n();

  const items = [
    {
      to: "/" as const,
      label: t("首页", "Home", "首頁"),
      elementZh: "土",
      elementEn: "Earth",
      elementColor: "text-amber-600 dark:text-amber-400",
      activeClasses:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm",
      icon: Home,
    },
    {
      to: "/innate" as const,
      label: t("先天", "Innate", "先天"),
      elementZh: "木",
      elementEn: "Wood",
      elementColor: "text-emerald-600 dark:text-emerald-400",
      activeClasses:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm",
      icon: Sprout,
    },
    {
      to: "/acquired" as const,
      label: t("后天", "Acquired", "後天"),
      elementZh: "金",
      elementEn: "Metal",
      elementColor: "text-cyan-700 dark:text-cyan-400",
      activeClasses:
        "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 shadow-sm",
      icon: BookOpen,
    },
    {
      to: "/daily" as const,
      label: t("每日", "Daily", "每日"),
      elementZh: "火",
      elementEn: "Fire",
      elementColor: "text-rose-600 dark:text-rose-400",
      activeClasses:
        "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 shadow-sm",
      icon: Sun,
    },
    {
      to: "/membership" as const,
      label: t("权益", "Member", "權益"),
      elementZh: "水",
      elementEn: "Water",
      elementColor: "text-indigo-600 dark:text-indigo-400",
      activeClasses:
        "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/40 shadow-sm",
      icon: ShieldCheck,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-lg">
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1 py-1.5">
        {items.map(({ to, label, elementZh, elementEn, elementColor, activeClasses, icon: Icon }) => (
          <li key={to} className="flex justify-center">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex w-full flex-col items-center justify-center rounded-xl py-1.5 px-0.5 text-muted-foreground transition-all duration-200 border border-transparent hover:text-foreground"
              activeProps={{ className: `${activeClasses} font-bold scale-[1.02]` }}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                <span
                  className={`absolute -top-1 -right-2 rounded-full px-1 text-[8px] font-extrabold leading-none ${elementColor}`}
                >
                  {elementZh}
                </span>
              </div>
              <span className="mt-1 text-[11px] leading-tight font-medium tracking-tight">
                {label}
              </span>
              <span className="text-[8px] opacity-70 leading-none">
                {elementEn}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
