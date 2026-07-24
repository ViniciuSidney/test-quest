import assert from "node:assert/strict";
import { SESSION_STATUS } from "../src/scripts/core/state.js";
import {
  getCurrentDiscursiveReviewQuestion,
  getDiscursiveQuestionsForReview,
  getDiscursiveReviewProgress,
  hasPendingFinalVerdicts,
  markDiscursiveReviewCompleted,
  setCurrentDiscursiveReviewQuestion,
  shouldOpenDiscursiveReview,
  startDiscursiveReview
} from "../src/scripts/features/discursive-review/discursive-review.service.js";
import {
  setFinalVerdictLevel,
  setInitialMetacognitionLevel
} from "../src/scripts/features/question-resolution/metacognition.service.js";

const d1 = {
  id: "d1",
  categoria: "discursiva",
  assunto: "Gramática",
  tipo: "discursiva curta",
  enunciado: "Explique a regra.",
  respostaEsperada: "Modelo 1",
  criterios: "Critério 1"
};
const d2 = { ...d1, id: "d2", enunciado: "Dê um exemplo.", respostaEsperada: "Modelo 2" };
const d3 = { ...d1, id: "d3", enunciado: "Questão não respondida." };
const objective = { id: "o1", categoria: "objetiva", assunto: "Gramática", enunciado: "Objetiva." };

let state = {
  status: SESSION_STATUS.ACTIVE,
  questoes: [d1, objective, d2, d3],
  respostas: { d1: "Resposta 1", o1: "a1", d2: "Resposta 2" },
  confirmacoes: { d1: true, o1: true, d2: true },
  avaliacoesDiscursivas: {},
  correcaoDiscursiva: { atualId: null, iniciadaEm: null, concluidaEm: null },
  opcoes: { modoCorrecao: "final" }
};

state = setInitialMetacognitionLevel(state, "d1", "parcial");
state = setInitialMetacognitionLevel(state, "d2", "completa");

assert.deepEqual(getDiscursiveQuestionsForReview(state).map((question) => question.id), ["d1", "d2"]);
assert.deepEqual(getDiscursiveReviewProgress(state), {
  questions: [d1, d2],
  total: 2,
  evaluated: 0,
  pending: 2,
  percentage: 0,
  counts: { completa: 0, parcial: 0, incorreta: 0 }
});
assert.equal(hasPendingFinalVerdicts(state), true);
assert.equal(shouldOpenDiscursiveReview(state), true);
assert.equal(shouldOpenDiscursiveReview({ ...state, opcoes: { modoCorrecao: "imediata" } }), false);

state = startDiscursiveReview(state, { now: () => "2026-07-23T15:00:00.000Z" });
assert.equal(state.status, SESSION_STATUS.REVIEWING);
assert.equal(state.correcaoDiscursiva.atualId, "d1");
assert.equal(state.correcaoDiscursiva.iniciadaEm, "2026-07-23T15:00:00.000Z");
assert.equal(getCurrentDiscursiveReviewQuestion(state)?.id, "d1");

const unchanged = setCurrentDiscursiveReviewQuestion(state, "inexistente");
assert.equal(unchanged, state);
state = setCurrentDiscursiveReviewQuestion(state, "d2");
assert.equal(state.correcaoDiscursiva.atualId, "d2");

state = setFinalVerdictLevel(state, "d1", "incorreta", {
  now: () => "2026-07-23T15:01:00.000Z"
});
let progress = getDiscursiveReviewProgress(state);
assert.equal(progress.evaluated, 1);
assert.equal(progress.pending, 1);
assert.equal(progress.percentage, 50);
assert.equal(progress.counts.incorreta, 1);
assert.equal(shouldOpenDiscursiveReview(state), true);

state = setFinalVerdictLevel(state, "d2", "completa", {
  now: () => "2026-07-23T15:02:00.000Z"
});
progress = getDiscursiveReviewProgress(state);
assert.equal(progress.evaluated, 2);
assert.equal(progress.pending, 0);
assert.equal(progress.percentage, 100);
assert.equal(progress.counts.completa, 1);
assert.equal(progress.counts.incorreta, 1);
assert.equal(hasPendingFinalVerdicts(state), false);
assert.equal(shouldOpenDiscursiveReview(state), false);

state = markDiscursiveReviewCompleted(state, { now: () => "2026-07-23T15:03:00.000Z" });
assert.equal(state.correcaoDiscursiva.concluidaEm, "2026-07-23T15:03:00.000Z");

console.log("Discursive review flow: todos os testes passaram.");
