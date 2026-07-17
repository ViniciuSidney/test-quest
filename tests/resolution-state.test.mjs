import assert from "node:assert/strict";
import {
  buildQuestionMapLabel,
  calculateDisplayedTotalMs,
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

assert.equal(
  calculateDisplayedTotalMs(
    [{ id: "q1" }, { id: "q2" }],
    { q1: 84999, q2: 34999 }
  ),
  118000,
  "O total deve somar os mesmos segundos inteiros exibidos em cada questão."
);

assert.equal(
  calculateDisplayedTotalMs(
    [{ id: "q1" }, { id: "q2" }],
    { q1: 84999, q2: 34999, orphan: 60000 }
  ),
  118000,
  "Tempos de IDs que não pertencem à sessão atual não devem entrar no total."
);

assert.equal(
  calculateDisplayedTotalMs(
    [{ id: "q1" }, { id: "q2" }],
    { q1: Number.NaN, q2: -1000 }
  ),
  0,
  "Tempos inválidos ou negativos devem ser ignorados."
);

console.log("Resolution state: todos os testes passaram.");
