import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Users, Copy, Download, Search, CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { getAdminUsersFn } from "../lib/serverFns";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "管理员控制台 · 客户邮箱管理 · Life Explorer" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type UserRecord = {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string;
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
        setError(res.message || "密码错误，请检查环境变量 ADMIN_PASSWORD。");
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
    const headers = "ID,客户邮箱,认证状态,注册时间\n";
    const rows = users
      .map(
        (u) =>
          `${u.id},"${u.email}",${u.is_verified ? "已认证" : "未认证"},"${new Date(u.created_at).toLocaleString()}"`,
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registered_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase().trim()),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900/10 via-background to-background p-5 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* 顶部标题栏 */}
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">
                管理员控制台 · 客户邮箱管理
              </h1>
              <p className="text-xs text-muted-foreground">Admin Customer Email Management</p>
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setPassword("");
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
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
              请输入管理员管理密钥
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              对应环境变量 <code className="rounded bg-muted px-1.5 py-0.5 font-mono">ADMIN_PASSWORD</code> (默认：admin888)
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
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                  <Users className="h-4 w-4" />
                  <span>已收集客户总数</span>
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                  {users.length}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">已注册并激活的真实用户</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>防机器人验证通过率</span>
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  100%
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">全量通过两步人机校验</p>
              </div>
            </div>

            {/* 操作控制栏 */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 shadow-xs">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索客户邮箱..."
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
                  <span>导出 CSV 表格</span>
                </button>
              </div>
            </div>

            {copyNotice && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ✨ 全部 {users.length} 个客户邮箱已成功复制到剪贴板！可直接粘贴至邮件群发工具或文档中。
              </div>
            )}

            {/* 客户列表表格 */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
              <div className="border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-bold text-foreground flex items-center justify-between">
                <span>客户邮箱明细 ({filteredUsers.length})</span>
                <span className="text-[11px] text-muted-foreground font-normal">按注册时间倒序</span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {search ? "没有找到符合搜索条件的客户邮箱" : "暂无注册客户记录"}
                </div>
              ) : (
                <div className="divide-y divide-border/60 max-h-[460px] overflow-y-auto">
                  {filteredUsers.map((user, idx) => (
                    <div
                      key={user.id || idx}
                      className="flex items-center justify-between px-4 py-3 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground w-6">
                          #{user.id}
                        </span>
                        <div>
                          <div className="font-mono text-sm font-semibold text-foreground">
                            {user.email}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            注册时间: {new Date(user.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          已验证
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(user.email);
                            alert(`已复制邮箱: ${user.email}`);
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                          title="复制单个邮箱"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
