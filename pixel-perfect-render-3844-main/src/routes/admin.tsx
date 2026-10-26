import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  Users,
  Copy,
  Download,
  Search,
  CheckCircle2,
  Lock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Compass,
  User,
  Calendar,
  Sparkles,
  Camera,
  Hand,
} from "lucide-react";
import { getAdminUsersFn } from "../lib/serverFns";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "管理员控制台 · 客户邮箱与先天信息管理 · Life Explorer" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type InnateProfileInfo = {
  name?: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  color?: string;
  profile?: {
    yearGanZhi?: string;
    monthGanZhi?: string;
    dayGanZhi?: string;
    timeGanZhi?: string;
    zodiacZh?: string;
    dominantElementZh?: string;
    westernZodiacZh?: string;
  };
  facePalmAnalysis?: {
    title?: string;
    faceReading?: string;
    palmReading?: string;
    baziSynthesis?: string;
    lifeAdvice?: string;
  };
  hasFacePhoto?: boolean;
  hasPalmPhoto?: boolean;
};

type UserRecord = {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string;
  innateProfile?: InnateProfileInfo | undefined;
};

export function AdminPage() {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [copyNotice, setCopyNotice] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsersFn({ data: { password } });
      if (res.success && res.users) {
        setUsers(res.users);
        setIsLoggedIn(true);
      } else {
        setError(res.message || "密码错误，请检查管理员密码。");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshList() {
    setLoading(true);
    try {
      const res = await getAdminUsersFn({ data: { password } });
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAllEmails() {
    if (users.length === 0) return;
    const emailList = users.map((u) => u.email).join(", ");
    navigator.clipboard.writeText(emailList);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 3000);
  }

  function handleExportCsv() {
    if (users.length === 0) return;
    const headers =
      "ID,客户邮箱,认证状态,注册时间,真实姓名,性别,公历生日,出生时辰,出生地点,四柱八字,传统生肖,五行主气,神相分析摘要\n";

    const escapeCsv = (val: string | undefined | null) => {
      if (!val) return '""';
      const clean = String(val).replace(/"/g, '""').replace(/\r?\n/g, " ");
      return `"${clean}"`;
    };

    const rows = users
      .map((u) => {
        const inn = u.innateProfile;
        const p = inn?.profile;
        const baziStr = p
          ? `${p.yearGanZhi || ""},${p.monthGanZhi || ""},${p.dayGanZhi || ""},${p.timeGanZhi || ""}`
          : "";
        const analysisSummary = inn?.facePalmAnalysis
          ? `面相:${inn.facePalmAnalysis.faceReading?.slice(0, 50)}... 掌相:${inn.facePalmAnalysis.palmReading?.slice(0, 50)}...`
          : "";

        return [
          u.id,
          escapeCsv(u.email),
          u.is_verified ? "已认证" : "未认证",
          escapeCsv(new Date(u.created_at).toLocaleString()),
          escapeCsv(inn?.name),
          escapeCsv(inn?.gender === "female" ? "坤造(女)" : inn?.gender === "male" ? "乾造(男)" : inn?.gender),
          escapeCsv(inn?.birthDate),
          escapeCsv(inn?.birthTime),
          escapeCsv(inn?.birthPlace),
          escapeCsv(baziStr),
          escapeCsv(p?.zodiacZh),
          escapeCsv(p?.dominantElementZh),
          escapeCsv(analysisSummary),
        ].join(",");
      })
      .join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customer_profiles_full_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase().trim();
    if (!s) return true;
    const matchEmail = u.email.toLowerCase().includes(s);
    const matchName = u.innateProfile?.name?.toLowerCase().includes(s);
    const matchDate = u.innateProfile?.birthDate?.includes(s);
    return matchEmail || Boolean(matchName) || Boolean(matchDate);
  });

  const filledInnateCount = users.filter((u) => Boolean(u.innateProfile?.name)).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900/10 via-background to-background p-5 pb-20">
      <div className="mx-auto max-w-3xl">
        {/* 顶部标题栏 */}
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">
                管理员控制台 · 客户邮箱与先天档案管理
              </h1>
              <p className="text-xs text-muted-foreground">Admin Customer Management Console</p>
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setPassword("");
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
            >
              退出管理
            </button>
          )}
        </div>

        {!isLoggedIn ? (
          /* 管理员登录卡片 */
          <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-base font-bold text-foreground">
              请输入管理员管理密码
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              管理员专属密码：
              <code className="rounded bg-muted px-2 py-0.5 font-mono font-bold text-foreground">
                1234
              </code>
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-destructive/10 p-2 text-xs text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              <input
                type="password"
                required
                placeholder="请输入管理密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "验证中..." : "解锁进入后台"}
              </button>
            </form>
          </div>
        ) : (
          /* 管理员客户管理主体界面 */
          <div className="space-y-5">
            {/* 核心指标统计 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                  <Users className="h-4 w-4" />
                  <span>已注册客户总数</span>
                </div>
                <div className="mt-2 font-mono text-2xl font-extrabold text-foreground">
                  {users.length}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">真实邮箱注册客户</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <Compass className="h-4 w-4" />
                  <span>已建先天档案客户</span>
                </div>
                <div className="mt-2 font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {filledInnateCount}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">已完整收集生辰与神相</p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>免机器人验证率</span>
                </div>
                <div className="mt-2 font-mono text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  100%
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">两步防刷免验证码</p>
              </div>
            </div>

            {/* 操作控制栏 */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 shadow-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索客户邮箱、姓名或生日..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshList}
                  disabled={loading}
                  title="刷新数据"
                  className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>刷新</span>
                </button>

                <button
                  onClick={handleCopyAllEmails}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>一键复制全部邮箱</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>导出全量 CSV（含先天信息）</span>
                </button>
              </div>
            </div>

            {copyNotice && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ✨ 全部 {users.length} 个客户邮箱已成功复制到剪贴板！可直接粘贴使用。
              </div>
            )}

            {/* 客户列表（带先天信息展开） */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
              <div className="border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-bold text-foreground flex items-center justify-between">
                <span>客户明细与先天档案 ({filteredUsers.length})</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  点击右侧箭头可展开查看客户八字与神相
                </span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {search ? "没有找到符合搜索条件的客户记录" : "暂无注册客户记录"}
                </div>
              ) : (
                <div className="divide-y divide-border/60 max-h-[560px] overflow-y-auto">
                  {filteredUsers.map((user, idx) => {
                    const isExpanded = expandedUserId === user.id;
                    const inn = user.innateProfile;
                    const bazi = inn?.profile;

                    return (
                      <div key={user.id || idx} className="transition-colors hover:bg-accent/20">
                        {/* 基础行 */}
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-muted-foreground w-6">
                              #{user.id}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-foreground">
                                  {user.email}
                                </span>
                                {inn?.name && (
                                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                    {inn.name} ({inn.gender === "female" ? "坤造" : "乾造"})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>注册时间: {new Date(user.created_at).toLocaleString()}</span>
                                {inn?.birthDate && (
                                  <span>· 生辰: {inn.birthDate} {inn.birthTime || ""}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user.email);
                                alert(`已复制邮箱: ${user.email}`);
                              }}
                              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                              title="复制邮箱"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {inn ? (
                              <button
                                onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                                className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20"
                              >
                                <span>{isExpanded ? "收起先天" : "查看先天信息"}</span>
                                {isExpanded ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )}
                              </button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground px-2 py-1">
                                暂无先天档案
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 展开的先天详细卡片 */}
                        {isExpanded && inn && (
                          <div className="bg-muted/30 px-6 py-4 border-t border-border/50 space-y-3 text-xs">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div className="rounded-lg bg-card p-2 border border-border">
                                <span className="text-[10px] text-muted-foreground">客户姓名</span>
                                <p className="font-bold text-foreground mt-0.5">{inn.name}</p>
                              </div>
                              <div className="rounded-lg bg-card p-2 border border-border">
                                <span className="text-[10px] text-muted-foreground">格局性别</span>
                                <p className="font-bold text-foreground mt-0.5">
                                  {inn.gender === "female" ? "坤造 (女)" : "乾造 (男)"}
                                </p>
                              </div>
                              <div className="rounded-lg bg-card p-2 border border-border">
                                <span className="text-[10px] text-muted-foreground">公历出生日期</span>
                                <p className="font-bold text-foreground mt-0.5">
                                  {inn.birthDate} {inn.birthTime || ""}
                                </p>
                              </div>
                              <div className="rounded-lg bg-card p-2 border border-border">
                                <span className="text-[10px] text-muted-foreground">出生地点</span>
                                <p className="font-bold text-foreground mt-0.5">
                                  {inn.birthPlace || "未提供"}
                                </p>
                              </div>
                            </div>

                            {/* 四柱八字排盘 */}
                            {bazi && (
                              <div className="rounded-lg bg-card p-3 border border-emerald-500/30 space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                  <span className="flex items-center gap-1">
                                    <Compass className="h-3.5 w-3.5 text-emerald-600" />
                                    生辰四柱八字干支
                                  </span>
                                  <span>
                                    五行主气: {bazi.dominantElementZh} · 生肖: {bazi.zodiacZh}
                                  </span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono font-bold text-sm">
                                  <div className="rounded bg-secondary/50 p-1.5">
                                    <span className="text-[10px] text-muted-foreground block font-sans">
                                      年柱
                                    </span>
                                    {bazi.yearGanZhi || "-"}
                                  </div>
                                  <div className="rounded bg-secondary/50 p-1.5">
                                    <span className="text-[10px] text-muted-foreground block font-sans">
                                      月柱
                                    </span>
                                    {bazi.monthGanZhi || "-"}
                                  </div>
                                  <div className="rounded bg-secondary/50 p-1.5">
                                    <span className="text-[10px] text-muted-foreground block font-sans">
                                      日柱
                                    </span>
                                    {bazi.dayGanZhi || "-"}
                                  </div>
                                  <div className="rounded bg-secondary/50 p-1.5">
                                    <span className="text-[10px] text-muted-foreground block font-sans">
                                      时柱
                                    </span>
                                    {bazi.timeGanZhi || "-"}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 神相形局分析 */}
                            {inn.facePalmAnalysis && (
                              <div className="rounded-lg bg-card p-3 border border-border space-y-2">
                                <span className="font-bold text-foreground block">
                                  传统神相参验记录：
                                </span>
                                {inn.facePalmAnalysis.faceReading && (
                                  <div>
                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                      面相五岳辨析：
                                    </span>
                                    <p className="text-muted-foreground leading-relaxed mt-0.5">
                                      {inn.facePalmAnalysis.faceReading}
                                    </p>
                                  </div>
                                )}
                                {inn.facePalmAnalysis.palmReading && (
                                  <div>
                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                      掌纹天地人三才：
                                    </span>
                                    <p className="text-muted-foreground leading-relaxed mt-0.5">
                                      {inn.facePalmAnalysis.palmReading}
                                    </p>
                                  </div>
                                )}
                                {inn.facePalmAnalysis.baziSynthesis && (
                                  <div>
                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                      八字形局通会：
                                    </span>
                                    <p className="text-muted-foreground leading-relaxed mt-0.5">
                                      {inn.facePalmAnalysis.baziSynthesis}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
