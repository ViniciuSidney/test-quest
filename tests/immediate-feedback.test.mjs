import assert from "node:assert/strict";
import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import {
  canConfirmQuestion,
  confirmQuestion,
  CORRECTION_MODES,
  getImmediateFeedback,
  isImmediateCorrectionEnabled,
  isQuestionConfirmed,
  normalizeCorrectionMode
} from "../src/scripts/features/question-resolution/immediate-feedback.service.js";

const alternatives = normalizeObjectiveAlternatives(
  { A: "Um", B: "Dois", C: "Três", D: "Quatro", E: "Cinco" },
  "q1"
);
const objectiveBase = {
  id: "q1",
  categoria: "objetiva",
  alternativas: alternatives,
  correta: "B",
  respostaCorretaId: "",
  explicacao: "Dois é a resposta correta."
};
const objective = {
  ...objectiveBase,
  respostaCorretaId: getCorrectAlternativeId(objectiveBase)
};
let state = {
  opcoes: { modoCorrecao: CORRECTION_MODES.IMMEDIATE },
  respostas: { q1: objective.respostaCorretaId },
  confirmacoes: {}
};

assert.equal(normalizeCorrectionMode("qualquer"), CORRECTION_MODES.FINAL);
assert.equal(isImmediateCorrectionEnabled(state), true);
assert.equal(canConfirmQuestion(state, objective), true);
state = confirmQuestion(state, objective.id);
assert.equal(isQuestionConfirmed(state, objective.id), true);
assert.equal(canConfirmQuestion(state, objective), false);

const correctFeedback = getImmediateFeedback(objective, objective.respostaCorretaId);
assert.equal(correctFeedback.tone, "success");
assert.equal(correctFeedback.correct.displayLetter, "B");

const wrongFeedback = getImmediateFeedback(objective, alternatives[0].id);
assert.equal(wrongFeedback.tone, "danger");
assert.equal(wrongFeedback.selected.displayLetter, "A");

const discursive = {
  id: "q2",
  categoria: "discursiva",
  respostaEsperada: "Resposta modelo",
  criterios: "Critérios"
};
const discursiveFeedback = getImmediateFeedback(discursive, "Minha resposta");
assert.equal(discursiveFeedback.category, "discursive");
assert.equal(discursiveFeedback.expectedAnswer, "Resposta modelo");

console.log("Immediate feedback: todos os testes passaram.");
