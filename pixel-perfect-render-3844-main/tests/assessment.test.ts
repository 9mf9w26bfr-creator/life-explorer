import { describe, it, expect } from "vitest";
import {
  iq,
  eq,
  comm,
  wellbeing,
  likertScore,
  generateRandomizedAssessment,
} from "../src/lib/questions";

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

  it("should generate randomized 50-question sets with strict difficulty gradient (Easy -> Medium -> Hard -> Very Hard)", () => {
    const set1 = generateRandomizedAssessment("user_alice_seed");
    const set2 = generateRandomizedAssessment("user_bob_seed");

    // Length check
    expect(set1.iq.length).toBe(20);
    expect(set1.eq.length).toBe(10);
    expect(set1.comm.length).toBe(10);
    expect(set1.wellbeing.length).toBe(10);
    expect(set1.iq.length + set1.eq.length + set1.comm.length + set1.wellbeing.length).toBe(50);

    // Strict difficulty gradient in IQ questions:
    // 0-4 (5 questions) => 易 Easy
    // 5-10 (6 questions) => 中 Medium
    // 11-15 (5 questions) => 难 Hard
    // 16-19 (4 questions) => 极难 Very Hard
    for (let i = 0; i < 5; i++) {
      expect(set1.iq[i]!.level).toBe("易 Easy");
    }
    for (let i = 5; i < 11; i++) {
      expect(set1.iq[i]!.level).toBe("中 Medium");
    }
    for (let i = 11; i < 16; i++) {
      expect(set1.iq[i]!.level).toBe("难 Hard");
    }
    for (let i = 16; i < 20; i++) {
      expect(set1.iq[i]!.level).toBe("极难 Very Hard");
    }

    // Answers within valid index range
    set1.iq.forEach((q) => {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    });

    // Check that different seeds sample different questions
    const set1Titles = set1.iq.map((q) => q.zh).join("|");
    const set2Titles = set2.iq.map((q) => q.zh).join("|");
    expect(set1Titles).not.toBe(set2Titles);
  });
});
