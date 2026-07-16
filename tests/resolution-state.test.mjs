import assert from "node:assert/strict";
import {
  buildQuestionMapLabel,
  getMarkerInfo,
  getNextMarkerState,
  isQuestionAnswered,
  MARKER_STATES,
  normalizeMarkerState
} from "../src/scripts/features/question-resolution/question-resolution.helpers.js";

assert.equal(normalizeMarkerState(undefined), MARKER_STATES.NEUTRAL);
assert.equal(normalizeMarkerState("analysis"), MARKER_STATES.ANALYSIS);
assert.equal(normalizeMarkerState("eliminated"), MARKER_STATES.ELIMINATED);
assert.equal(normalizeMarkerState("analise"), MARKER_STATES.ANALYSIS);
assert.equal(normalizeMarkerState("eliminada"), MARKER_STATES.ELIMINATED);

assert.equal(getNextMarkerState("neutro"), "analise");
assert.equal(getNextMarkerState("analise"), "eliminada");
assert.equal(getNextMarkerState("eliminada"), "neutro");

assert.equal(getMarkerInfo("neutro", "a").icon, "○");
assert.equal(getMarkerInfo("analise", "b").icon, "?");
assert.equal(getMarkerInfo("eliminada", "c").icon, "×");
assert.match(getMarkerInfo("analise", "b").label, /Alternativa B/);

assert.equal(isQuestionAnswered(""), false);
assert.equal(isQuestionAnswered("   \n"), false);
assert.equal(isQuestionAnswered("C"), true);
assert.equal(isQuestionAnswered("Resposta discursiva"), true);

assert.equal(
  buildQuestionMapLabel({ number: 3, current: true, answered: true, review: true }),
  "Questão 3, atual, respondida, marcada para revisão"
);
assert.equal(
  buildQuestionMapLabel({ number: 4, current: false, answered: false, review: false }),
  "Questão 4, pendente"
);

console.log("Resolution state: todos os testes passaram.");
