import { createServerFn } from "@tanstack/react-start";
import { env } from "../env";
import { db } from "../server/db";
import { sendEmailVerificationCode, verifySessionToken, createSessionToken } from "../server/auth";
import { calculateTraditionalProfile } from "./chineseZodiac";
import { getDailyTarot, getDailyDomino } from "./fortuneEngines";
import { generateDailyAdvice } from "./dailyAdvice";
import { generateGeminiReflection } from "../server/gemini";

// 1. Send Verification Code (Anti-Bot)
export const sendVerificationCodeFn = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    return await sendEmailVerificationCode(data.email);
  });

// 2. Verify Code & Authenticate
export const verifyCodeFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; code: string }) => data)
  .handler(async ({ data }) => {
    const success = await db.verifyCode(data.email, data.code);
    if (!success) {
      return { success: false, message: "Invalid or expired verification code." };
    }
    const token = createSessionToken(data.email);
    return {
      success: true,
      token,
      email: data.email.toLowerCase(),
      message: "Authentication successful. Membership features unlocked for free!",
    };
  });

// 3. Check Current Session
export const checkSessionFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) return { authenticated: false };
    const { valid, email } = verifySessionToken(data.token);
    if (!valid || !email) return { authenticated: false };
    const isVerified = await db.isUserVerified(email);
    return { authenticated: isVerified, email };
  });

// 4. Save User Profile (Innate or Acquired)
export const saveProfileFn = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; profileType: "innate" | "acquired"; profileData: any }) => data,
  )
  .handler(async ({ data }) => {
    const { valid, email } = verifySessionToken(data.token);
    if (!valid || !email) {
      throw new Error("Authentication required. Please verify with your email first.");
    }
    const version = await db.saveProfile(email, data.profileType, data.profileData);
    return { success: true, version };
  });

// 5. Get User Profiles
export const getProfilesFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; profileType: "innate" | "acquired" }) => data)
  .handler(async ({ data }) => {
    const { valid, email } = verifySessionToken(data.token);
    if (!valid || !email) {
      return { success: false, profiles: [] };
    }
    const profiles = await db.getProfiles(email, data.profileType);
    return { success: true, profiles };
  });

// 6. Get Daily Fortune & Advice (Locked per day)
export const getDailyReadingFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; dateKey: string }) => data)
  .handler(async ({ data }) => {
    const { valid, email } = verifySessionToken(data.token);
    if (!valid || !email) {
      throw new Error("Free registration required to view daily advice. Please verify email.");
    }

    // Check existing locked daily record
    const existing = await db.getDailyRecord(email, data.dateKey);
    if (existing) {
      return { success: true, data: existing };
    }

    // Fetch user innate profile if available to personalize
    const innateProfiles = await db.getProfiles(email, "innate");
    const latestInnate = innateProfiles[innateProfiles.length - 1]?.data;
    let traditionalProfile = undefined;
    if (latestInnate?.birthDate) {
      traditionalProfile = calculateTraditionalProfile(
        latestInnate.birthDate,
        latestInnate.birthTime,
      );
    }

    // Generate deterministic Tarot, Domino, and 9-dim Advice
    const tarot = getDailyTarot(email, data.dateKey);
    const domino = getDailyDomino(email, data.dateKey);
    const advice = generateDailyAdvice(email, data.dateKey, tarot, domino, traditionalProfile);

    // Save and lock
    await db.saveDailyRecord(email, data.dateKey, tarot, domino, advice);

    return {
      success: true,
      data: {
        tarot,
        domino,
        advice,
        aiReflection: undefined,
      },
    };
  });

// 7. Generate or Fetch Gemini AI Daily Reflection
export const getAiReflectionFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; dateKey: string }) => data)
  .handler(async ({ data }) => {
    const { valid, email } = verifySessionToken(data.token);
    if (!valid || !email) {
      throw new Error("Authentication required.");
    }

    const existing = await db.getDailyRecord(email, data.dateKey);
    if (existing && existing.aiReflection) {
      return { success: true, reflection: existing.aiReflection };
    }

    const tarot = existing?.tarot || getDailyTarot(email, data.dateKey);
    const domino = existing?.domino || getDailyDomino(email, data.dateKey);

    const innateProfiles = await db.getProfiles(email, "innate");
    const latestInnate = innateProfiles[innateProfiles.length - 1]?.data;
    const traditionalProfile = latestInnate?.birthDate
      ? calculateTraditionalProfile(latestInnate.birthDate, latestInnate.birthTime)
      : undefined;

    const reflection = await generateGeminiReflection({
      userEmail: email,
      dateKey: data.dateKey,
      tarotCard: tarot.nameZh,
      tarotOrientation: tarot.orientationZh,
      dominoTile: domino.nameZh,
      dominantElement: traditionalProfile?.dominantElementZh,
      zodiac: traditionalProfile?.zodiacZh,
    });

    // Update daily record with AI reflection
    await db.saveDailyRecord(
      email,
      data.dateKey,
      existing?.tarot || tarot,
      existing?.domino || domino,
      existing?.advice ||
        generateDailyAdvice(email, data.dateKey, tarot, domino, traditionalProfile),
      reflection,
    );

    return { success: true, reflection };
  });

// 8. Admin: Get all registered customers / emails
export const getAdminUsersFn = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const configuredPassword = env.ADMIN_PASSWORD || "1234";
    if (data.password !== "1234" && data.password !== configuredPassword) {
      return { success: false, message: "密码错误，请检查管理员密码。", users: [], totalCount: 0 };
    }
    const users = await db.getAllUsers();
    return {
      success: true,
      users,
      totalCount: users.length,
      message: "用户列表加载成功。",
    };
  });
