import { describe, it, expect } from "vitest";
import { generateGeminiReflection } from "../src/server/gemini";

describe("Google Gemini AI Reflection Engine", () => {
  it("should generate constitutional fallback reflection when API key is unset or in dev", async () => {
    const reflection = await generateGeminiReflection({
      userEmail: "test@example.com",
      dateKey: "2026-10-26",
      tarotCard: "愚者",
      tarotOrientation: "正位",
      dominoTile: "天牌 · 双六",
      dominantElement: "木",
      zodiac: "龙",
    });

    expect(typeof reflection).toBe("string");
    expect(reflection.length).toBeGreaterThan(50);
    expect(reflection).toContain("愚者");
    expect(reflection).toContain("天牌 · 双六");
    // Ensure constitutional disclaimers are present
    expect(reflection).toContain("免责声明");
    expect(reflection).toContain("自我探索参考");
    expect(reflection).not.toContain("保证发财");
    expect(reflection).not.toContain("必然发生");
  });
});
