import { describe, it, expect } from "vitest";
import {
  generateVerificationCode,
  createSessionToken,
  verifySessionToken,
} from "../src/server/auth";

describe("Authentication & Anti-Bot Verification Engine", () => {
  it("should generate a 6-digit numeric verification code", () => {
    const code = generateVerificationCode();
    expect(code).toMatch(/^\d{6}$/);
    const num = parseInt(code, 10);
    expect(num).toBeGreaterThanOrEqual(100000);
    expect(num).toBeLessThanOrEqual(999999);
  });

  it("should sign and verify valid session tokens", () => {
    const email = "explorer@test.com";
    const token = createSessionToken(email);

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = verifySessionToken(token);
    expect(verified.valid).toBe(true);
    expect(verified.email).toBe(email);
  });

  it("should reject tampered or corrupted session tokens", () => {
    const token = createSessionToken("user@test.com");
    const tampered = token.slice(0, -4) + "XXXX";

    const verified = verifySessionToken(tampered);
    expect(verified.valid).toBe(false);
  });

  it("should record verified users and retrieve them for the administrator", async () => {
    const { db } = await import("../src/server/db");
    const testEmail = `admin_test_${Date.now()}@example.com`;
    const code = "999888";
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.saveVerificationCode(testEmail, code, expiresAt);
    const verified = await db.verifyCode(testEmail, code);
    expect(verified).toBe(true);

    const allUsers = await db.getAllUsers();
    expect(Array.isArray(allUsers)).toBe(true);
    const found = allUsers.find((u) => u.email === testEmail);
    expect(found).toBeDefined();
    expect(found?.is_verified).toBe(true);
  });
});
