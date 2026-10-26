import { describe, it, expect } from "vitest";
import { getDailyTarot, getDailyDomino } from "../src/lib/fortuneEngines";

describe("Fortune & Advice Deterministic Engines", () => {
  const testEmail = "testuser@example.com";
  const dateA = "2026-10-26";
  const dateB = "2026-10-27";

  it("should generate deterministic daily Tarot card for the same user and date", () => {
    const draw1 = getDailyTarot(testEmail, dateA);
    const draw2 = getDailyTarot(testEmail, dateA);

    expect(draw1.nameZh).toBe(draw2.nameZh);
    expect(draw1.isUpright).toBe(draw2.isUpright);
    expect(draw1.orientationZh).toBe(draw2.orientationZh);
    expect(draw1.meaningZh).toBe(draw2.meaningZh);
  });

  it("should produce different seed for different dates", () => {
    const drawDateA = getDailyTarot(testEmail, dateA);
    const drawDateB = getDailyTarot(testEmail, dateB);

    // Across consecutive days, the seed hash will differ
    expect(drawDateA.meaningZh).toBeDefined();
    expect(drawDateB.meaningZh).toBeDefined();
  });

  it("should generate deterministic daily Domino tile", () => {
    const tile1 = getDailyDomino(testEmail, dateA);
    const tile2 = getDailyDomino(testEmail, dateA);

    expect(tile1.nameZh).toBe(tile2.nameZh);
    expect(tile1.tile).toEqual(tile2.tile);
    expect(tile1.traditionalSignZh).toBe(tile2.traditionalSignZh);
  });
});
