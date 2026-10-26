export const env = {
  ADMIN_PASSWORD:
    (import.meta.env["ADMIN_PASSWORD"] as string | undefined) ||
    process.env["ADMIN_PASSWORD"] ||
    "1234",
  AUTH_SECRET:
    (import.meta.env["AUTH_SECRET"] as string | undefined) ||
    process.env["AUTH_SECRET"] ||
    "default_development_secret_key_32chars",
  NODE_ENV:
    ((import.meta.env["NODE_ENV"] as string | undefined) || process.env["NODE_ENV"]) ??
    "development",
  GEMINI_API_KEY:
    (import.meta.env["GEMINI_API_KEY"] as string | undefined) || process.env["GEMINI_API_KEY"],
  DATABASE_URL:
    (import.meta.env["DATABASE_URL"] as string | undefined) || process.env["DATABASE_URL"],
  SMTP_HOST: (import.meta.env["SMTP_HOST"] as string | undefined) || process.env["SMTP_HOST"],
  SMTP_PORT: Number(
    (import.meta.env["SMTP_PORT"] as string | undefined) || process.env["SMTP_PORT"] || 587,
  ),
  SMTP_USER: (import.meta.env["SMTP_USER"] as string | undefined) || process.env["SMTP_USER"],
  SMTP_PASS: (import.meta.env["SMTP_PASS"] as string | undefined) || process.env["SMTP_PASS"],
  EMAIL_FROM:
    (import.meta.env["EMAIL_FROM"] as string | undefined) ||
    process.env["EMAIL_FROM"] ||
    "Life Explorer <no-reply@life-explorer.com>",
} as const;
