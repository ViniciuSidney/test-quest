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

assert.equal(formatPerformanceBasis(10, 10), "10 acertos em 10 questões objetivas");
assert.equal(formatPerformanceBasis(1, 1), "1 acerto em 1 questão objetiva");
assert.equal(formatPerformanceBasis(1, 2), "1 acerto em 2 questões objetivas");
assert.equal(formatPerformanceBasis(undefined, undefined), "0 acertos em 0 questões objetivas");

console.log("Performance state: todos os testes passaram.");
