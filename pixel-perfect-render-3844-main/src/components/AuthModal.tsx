import { useState } from "react";
import { Mail, ShieldCheck, X, Loader2 } from "lucide-react";
import { sendVerificationCodeFn, verifyCodeFn } from "../lib/serverFns";
import { saveSession } from "../lib/authClient";
import { useI18n } from "../lib/i18n";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
};

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError(
        t(
          "请输入有效的电子邮箱地址",
          "Please enter a valid email address.",
          "請輸入有效的電子郵箱地址"
        )
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await sendVerificationCodeFn({ data: { email } });
      if (res.success) {
        setStep("code");
        let msg = t(
          "验证码已发送至您的邮箱，请查收（防机器人确认）",
          "Verification code sent to your email. Please check your inbox.",
          "驗證碼已發送至您的郵箱，請查收（防機器人確認）"
        );
        if (res.debugCode) {
          msg += ` [Dev Code: ${res.debugCode}]`;
        }
        setNotice(msg);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError(
        t(
          "请输入完整的验证码",
          "Please enter the complete verification code.",
          "請輸入完整的驗證碼"
        )
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await verifyCodeFn({ data: { email, code } });
      if (res.success && res.token && res.email) {
        saveSession(res.token, res.email);
        onSuccess(res.email);
        onClose();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 text-center">
          <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            {t("免费注册与邮箱验证", "Free Account & Verification", "免費註冊與郵箱驗證")}
          </h2>
          <p className="mt-1 text-xs text-primary font-medium">
            {t(
              "✨ 全平台功能永久免费 · 验证邮箱即可永久解锁",
              "✨ 100% Free Forever · Verify Email to Unlock All Features",
              "✨ 全平台功能永久免費 · 驗證郵箱即可永久解鎖"
            )}
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-3 rounded-lg bg-accent/20 p-2.5 text-xs text-foreground border border-accent/30">
            {notice}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-foreground">
                {t("电子邮箱地址", "Email Address", "電子郵箱地址")}
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder={lang === "en" ? "name@example.com" : "yourname@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-normal">
                {t(
                  "用于接收 6 位一次性验证码，确认非机器人后即自动激活并登录。",
                  "Used to receive a 6-digit one-time code to confirm you are human.",
                  "用於接收 6 位一次性驗證碼，確認非機器人後即自動激活並登錄。"
                )}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("发送验证码", "Send Verification Code", "發送驗證碼")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-foreground">
                {t("6 位验证码", "6-Digit Verification Code", "6 位驗證碼")}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-center text-xl tracking-widest font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("发送至: ", "Sent to: ", "發送至: ") + email}</span>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-primary underline hover:opacity-80"
                >
                  {t("修改邮箱", "Change Email", "修改郵箱")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("完成验证并解锁", "Verify & Unlock Free Account", "完成驗證並解鎖")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
