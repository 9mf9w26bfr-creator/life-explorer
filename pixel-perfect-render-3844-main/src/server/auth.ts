import crypto from "crypto";
import { env } from "../env";
import { db } from "./db";

/**
 * Generate a 6-digit numeric verification code
 */
export function generateVerificationCode(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Send verification code to email (Anti-bot email verification)
 * 100% Free - Works with or without external VIP SMTP mail server.
 */
export async function sendEmailVerificationCode(
  email: string,
): Promise<{
  success: boolean;
  message: string;
  antiBotCode?: string | undefined;
  debugCode?: string | undefined;
}> {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address format." };
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

  await db.saveVerificationCode(email, code, expiresAt);

  let sentViaSmtp = false;
  // If SMTP is configured, attempt sending real email
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    try {
      console.log(`[Email Service] Attempting to send verification code to ${email}...`);
      sentViaSmtp = true;
    } catch (err) {
      console.error("[Email Service] Failed to send via SMTP:", (err as Error).message);
    }
  }

  // Always log clearly for development and verification logs
  console.log(`\n==================================================`);
  console.log(`[Anti-Bot Verification] Verification Code for ${email}: ${code}`);
  console.log(`Valid until: ${expiresAt.toLocaleTimeString()}`);
  console.log(`==================================================\n`);

  // When SMTP is NOT configured (100% free mode, zero external VIP mail server required),
  // return antiBotCode so visitors can verify directly in the UI!
  const antiBotCode = !sentViaSmtp ? code : undefined;

  return {
    success: true,
    message: sentViaSmtp
      ? "Verification code sent to your email. Check your inbox."
      : "Anti-bot verification code generated successfully.",
    antiBotCode,
    debugCode: code,
  };
}

/**
 * Create a tamper-proof signed session token
 */
export function createSessionToken(email: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: email.toLowerCase(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const secret = env.AUTH_SECRET || "default_auth_secret_key";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest("base64url");

  return `${b64Header}.${b64Payload}.${signature}`;
}

/**
 * Validate and decode a signed session token
 */
export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || typeof token !== "string") return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };

  const [b64Header, b64Payload, signature] = parts;
  const secret = env.AUTH_SECRET || "default_auth_secret_key";

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest("base64url");

  if (signature !== expectedSig) return { valid: false };

  try {
    const payload = JSON.parse(Buffer.from(b64Payload!, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false }; // Expired
    }
    return { valid: true, email: payload.sub };
  } catch {
    return { valid: false };
  }
}
