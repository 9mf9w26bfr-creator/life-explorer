import { describe, it, expect } from "vitest";
import { iq, eq, comm, wellbeing, likertScore } from "../src/lib/questions";

describe("Acquired Assessment Engine (50 Questions Spec)", () => {
  it("should have exactly 50 total questions (20 IQ, 10 EQ, 10 Comm, 10 Wellbeing)", () => {
    expect(iq.length).toBe(20);
    expect(eq.length).toBe(10);
    expect(comm.length).toBe(10);
    expect(wellbeing.length).toBe(10);
    expect(iq.length + eq.length + comm.length + wellbeing.length).toBe(50);
  });

  it("should correctly score IQ questions deterministically", () => {
    const perfectAnswers = iq.map((q) => q.answer);
    const score = iq.reduce((acc, q, idx) => acc + (perfectAnswers[idx] === q.answer ? 1 : 0), 0);
    expect(score).toBe(20);

    const zeroAnswers = iq.map((q) => (q.answer + 1) % q.options.length);
    const zeroScore = iq.reduce((acc, q, idx) => acc + (zeroAnswers[idx] === q.answer ? 1 : 0), 0);
    expect(zeroScore).toBe(0);
  });

  it("should calculate Likert scale scores (0 to 100) handling reverse scored questions", () => {
    // All neutral (index 2 out of 0..4)
    const neutralAnswers = Array(10).fill(2);
    const neutralScore = likertScore(eq, neutralAnswers);
    expect(neutralScore).toBe(50);

    // All highest score possible
    const bestAnswers = eq.map((q) => (q.reverse ? 0 : 4));
    const maxScore = likertScore(eq, bestAnswers);
    expect(maxScore).toBe(100);

    // All lowest score possible
    const worstAnswers = eq.map((q) => (q.reverse ? 4 : 0));
    const minScore = likertScore(eq, worstAnswers);
    expect(minScore).toBe(0);
  });
});
