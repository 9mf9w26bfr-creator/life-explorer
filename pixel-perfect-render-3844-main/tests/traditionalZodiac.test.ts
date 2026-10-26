import { describe, it, expect } from "vitest";
import { calculateTraditionalProfile } from "../src/lib/chineseZodiac";

describe("Traditional Chinese Astrological Engine", () => {
  it("should accurately calculate year and zodiac based on Lunar calendar / Lichun rather than simple calendar modulo", () => {
    // 1990-01-15 is before Lichun and Lunar New Year of 1990 (Horse)
    // It belongs to 己巳 (Snake) year!
    const profile = calculateTraditionalProfile("1990-01-15");
    expect(profile.zodiacZh).toBe("蛇");
    expect(profile.zodiacEn).toBe("Snake");
    expect(profile.yearGanZhi).toContain("巳");
  });

  it("should correctly compute 4-pillar BaZi and element counts", () => {
    const profile = calculateTraditionalProfile("1995-06-15", "08:30");
    expect(profile.yearGanZhi).toBe("乙亥");
    expect(profile.monthGanZhi).toBe("壬午");
    expect(profile.dayGanZhi).toBe("丁丑");
    expect(profile.timeGanZhi).toBe("甲辰");

    const totalElements =
      profile.elementCounts.metal +
      profile.elementCounts.wood +
      profile.elementCounts.water +
      profile.elementCounts.fire +
      profile.elementCounts.earth;
    expect(totalElements).toBe(8); // 8 characters in 4 pillars
  });

  it("should accurately determine Western Astrology Sign", () => {
    const aries = calculateTraditionalProfile("1998-04-05");
    expect(aries.westernZodiacZh).toBe("白羊座");
    expect(aries.westernZodiacEn).toBe("Aries");

    const scorpio = calculateTraditionalProfile("1998-11-05");
    expect(scorpio.westernZodiacZh).toBe("天蝎座");
    expect(scorpio.westernZodiacEn).toBe("Scorpio");
  });
});
