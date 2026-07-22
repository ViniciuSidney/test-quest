import assert from "node:assert/strict";
import {
  formatPerformanceBasis,
  getPerformanceState,
  normalizePerformancePercentage,
  shouldShowPerformanceScreen
} from "../src/scripts/features/performance/performance.service.js";

assert.equal(getPerformanceState(100).key, "excellent-100");
assert.equal(getPerformanceState(99).key, "excellent-90");
assert.equal(getPerformanceState(90).key, "excellent-90");
assert.equal(getPerformanceState(89).key, "very-good");
assert.equal(getPerformanceState(75).key, "very-good");
assert.equal(getPerformanceState(74).key, "good-result");
assert.equal(getPerformanceState(60).key, "good-result");
assert.equal(getPerformanceState(59).key, "attention-50");
assert.equal(getPerformanceState(50).key, "attention-50");
assert.equal(getPerformanceState(49).key, "review-needed");
assert.equal(getPerformanceState(0).key, "review-needed");

assert.equal(getPerformanceState(60).title, "Bom resultado!");
assert.equal(getPerformanceState(60).subtitle, "Você já construiu uma boa base.");
assert.equal(getPerformanceState(60).buttonLabel, "Tudo bem!");

assert.equal(normalizePerformancePercentage(105), 100);
assert.equal(normalizePerformancePercentage(-5), 0);
assert.equal(normalizePerformancePercentage(74.6), 75);
assert.equal(normalizePerformancePercentage("90"), 90);
assert.equal(normalizePerformancePercentage(Number.NaN), 0);

assert.equal(shouldShowPerformanceScreen(1), true);
assert.equal(shouldShowPerformanceScreen(0), false);
assert.equal(shouldShowPerformanceScreen(undefined), false);

assert.equal(
  formatPerformanceBasis({ earnedPoints: 1000, scoredQuestions: 10, objectives: 10 }),
  "1000 pontos em 10 questões avaliadas • 10 objetivas"
);
assert.equal(
  formatPerformanceBasis({ earnedPoints: 150, scoredQuestions: 2, objectives: 1, discursivesEvaluated: 1 }),
  "150 pontos em 2 questões avaliadas • 1 objetiva + 1 discursiva"
);
assert.equal(
  formatPerformanceBasis({ earnedPoints: 50, scoredQuestions: 1, discursivesEvaluated: 1 }),
  "50 pontos em 1 questão avaliada • 1 discursiva"
);
assert.equal(formatPerformanceBasis(), "0 pontos em 0 questões avaliadas");

console.log("Performance state: todos os testes passaram.");
