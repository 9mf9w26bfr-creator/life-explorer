import { describe, it, expect } from "vitest";
import { generateDailyAdvice } from "../src/lib/dailyAdvice";
import { getDailyTarot, getDailyDomino } from "../src/lib/fortuneEngines";

describe("Daily Lifestyle Advice Engine (9 Dimensions)", () => {
  it("should generate all 9 required categories of lifestyle advice", () => {
    const email = "user@test.com";
    const dateKey = "2026-10-26";
    const tarot = getDailyTarot(email, dateKey);
    const domino = getDailyDomino(email, dateKey);

    const advice = generateDailyAdvice(email, dateKey, tarot, domino);

    expect(advice.items.length).toBe(9);

    const categories = advice.items.map((i) => i.categoryEn);
    expect(categories).toContain("Clothing");
    expect(categories).toContain("Food & Wellness");
    expect(categories).toContain("Home Space");
    expect(categories).toContain("Movement");
    expect(categories).toContain("Work & Affairs");
    expect(categories).toContain("Study & Curiosity");
    expect(categories).toContain("Relationships");
    expect(categories).toContain("Social");
    expect(categories).toContain("Financial Habits");
  });

  it("should enforce constitutional safety (no guaranteed profit, no medical claims)", () => {
    const email = "user@test.com";
    const dateKey = "2026-10-26";
    const tarot = getDailyTarot(email, dateKey);
    const domino = getDailyDomino(email, dateKey);

    const advice = generateDailyAdvice(email, dateKey, tarot, domino);
    const textAll = JSON.stringify(advice);

    expect(textAll).not.toContain("保证发财");
    expect(textAll).not.toContain("包治百病");
    expect(textAll).toContain("仅供生活方式参考");
    expect(textAll).toContain("不提供任何投资回报承诺");
  });
});
