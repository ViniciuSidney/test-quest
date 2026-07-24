import assert from "node:assert/strict";
import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import { SESSION_STATUS } from "../src/scripts/core/state.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";
import { readHistory, recordCompletedSessionSafe } from "../src/scripts/features/home/home.service.js";
import { getRetryWrongQuestionsConfirmation } from "../src/scripts/features/session/session-confirmations.service.js";
import {
  buildRetryWrongListName,
  createRetryWrongSession,
  getRetryEligibleQuestions,
  getRetryWrongSummary,
  isRetryEligibleQuestion
} from "../src/scripts/features/retry-wrong/retry-wrong.service.js";
import {
  RESULT_FILTERS,
  buildQuestionReviewItems,
  calculateSessionResult,
  filterQuestionReviewItems
} from "../src/scripts/features/results/results.service.js";

function createObjective(id, correctKey = "A", type = "objetiva") {
  const alternatives = type === "verdadeiro ou falso"
    ? normalizeObjectiveAlternatives([
      { chaveOriginal: "V", texto: "Verdadeiro" },
      { chaveOriginal: "F", texto: "Falso" }
    ], id)
    : normalizeObjectiveAlternatives(
      { A: "A", B: "B", C: "C", D: "D", E: "E" },
      id
    );
  const question = {
    id,
    categoria: "objetiva",
    assunto: "Assunto",
    tipo: type,
    enunciado: `Questão ${id}`,
    alternativas: alternatives,
    correta: correctKey,
    respostaCorretaId: "",
    explicacao: "Explicação"
  };

  return {
    ...question,
    respostaCorretaId: getCorrectAlternativeId(question)
  };
}

const wrongObjective = createObjective("q1", "A");
const correctObjective = createObjective("q2", "B");
const unansweredObjective = createObjective("q3", "C");
const wrongTrueFalse = createObjective("q4", "V", "verdadeiro ou falso");
const incorrectDiscursive = {
  id: "q5",
  categoria: "discursiva",
  assunto: "Assunto",
  tipo: "discursiva curta",
  enunciado: "Explique.",
  respostaEsperada: "Modelo",
  criterios: "Critérios"
};
const partialDiscursive = { ...incorrectDiscursive, id: "q6" };
const completeDiscursive = { ...incorrectDiscursive, id: "q7" };

const source = {
  id: "source-session",
  status: SESSION_STATUS.FINISHED,
  listaNome: "Lista de Gramática",
  questoes: [
    wrongObjective,
    correctObjective,
    unansweredObjective,
    wrongTrueFalse,
    incorrectDiscursive,
    partialDiscursive,
    completeDiscursive
  ],
  respostas: {
    q1: wrongObjective.alternativas[3].id,
    q2: correctObjective.respostaCorretaId,
    q4: wrongTrueFalse.alternativas.find((item) => item.chaveOriginal === "F").id,
    q5: "Resposta incorreta",
    q6: "Resposta parcial",
    q7: "Resposta completa"
  },
  anotacoes: { q1: "Anotação original" },
  temposMs: { q1: 1000, q4: 2000, q5: 3000 },
  revisao: { q1: true },
  marcacoesAlternativas: { q1: { [wrongObjective.alternativas[0].id]: "eliminada" } },
  confirmacoes: { q1: true, q4: true, q5: true },
  avaliacoesDiscursivas: {
    q5: { metacognicaoInicial: { nivel: "parcial", percentual: 50 }, vereditoFinal: { nivel: "incorreta", percentual: 0, observacao: "Rever tudo." } },
    q6: { metacognicaoInicial: { nivel: "completa", percentual: 100 }, vereditoFinal: { nivel: "parcial", percentual: 50, observacao: "Faltou um ponto." } },
    q7: { metacognicaoInicial: { nivel: "parcial", percentual: 50 }, vereditoFinal: { nivel: "completa", percentual: 100, observacao: "Tudo certo." } }
  },
  temporizadorPausado: true,
  opcoes: {
    mostrarGabaritoFinal: true,
    embaralharQuestoes: false,
    embaralharAlternativas: false,
    modoCorrecao: "imediata"
  },
  importadoEm: "2026-07-20T10:00:00.000Z",
  iniciadoEm: "2026-07-20T10:00:00.000Z",
  finalizadoEm: "2026-07-20T11:00:00.000Z"
};

assert.equal(isRetryEligibleQuestion(source, wrongObjective), true);
assert.equal(isRetryEligibleQuestion(source, correctObjective), false);
assert.equal(isRetryEligibleQuestion(source, unansweredObjective), false);
assert.equal(isRetryEligibleQuestion(source, wrongTrueFalse), true);
assert.equal(isRetryEligibleQuestion(source, incorrectDiscursive), true);
assert.equal(isRetryEligibleQuestion(source, partialDiscursive), false);
assert.equal(isRetryEligibleQuestion(source, completeDiscursive), false);

assert.deepEqual(
  getRetryEligibleQuestions(source).map((question) => question.id),
  ["q1", "q4", "q5"]
);
assert.deepEqual(getRetryWrongSummary(source), {
  total: 3,
  objetivas: 2,
  discursivas: 1
});

const sourceSnapshot = JSON.parse(JSON.stringify(source));
const retry = createRetryWrongSession(source, {
  now: () => "2026-07-20T12:00:00.000Z",
  idFactory: () => "retry-session"
});

assert.deepEqual(source, sourceSnapshot, "A sessão original não pode ser alterada.");
assert.equal(retry.id, "retry-session");
assert.equal(retry.status, SESSION_STATUS.ACTIVE);
assert.equal(retry.listaNome, "Lista de Gramática — Revisão de erros");
assert.deepEqual(retry.questoes.map((question) => question.id), ["q1", "q4", "q5"]);
assert.deepEqual(retry.respostas, {});
assert.deepEqual(retry.anotacoes, {});
assert.deepEqual(retry.temposMs, {});
assert.deepEqual(retry.revisao, {});
assert.deepEqual(retry.marcacoesAlternativas, {});
assert.deepEqual(retry.confirmacoes, {});
assert.deepEqual(retry.avaliacoesDiscursivas, {});
assert.equal(retry.temporizadorPausado, false);
assert.equal(retry.finalizadoEm, null);
assert.equal(retry.opcoes.modoCorrecao, "imediata");
assert.equal(retry.opcoes.embaralharAlternativas, false);
assert.equal(retry.opcoes.embaralharQuestoes, false);

assert.equal(
  buildRetryWrongListName("Lista de Gramática — Revisão de erros"),
  "Lista de Gramática — Revisão de erros"
);
assert.ok(buildRetryWrongListName("x".repeat(100)).length <= 80);

const reviewItems = buildQuestionReviewItems({
  questions: source.questoes,
  answers: source.respostas,
  discursiveAssessments: source.avaliacoesDiscursivas
});
assert.deepEqual(
  filterQuestionReviewItems(reviewItems, RESULT_FILTERS.INCORRECT).map((item) => item.id),
  ["q1", "q4", "q5"]
);


const confirmation = getRetryWrongQuestionsConfirmation(getRetryWrongSummary(source), source.listaNome);
assert.equal(confirmation.items[0].value, "3");
assert.match(confirmation.title, /3 questões erradas/i);
assert.match(confirmation.note, /serão reiniciados/i);

const historyStorage = new MemoryStorage();
const originalHistoryWrite = recordCompletedSessionSafe(
  source,
  calculateSessionResult(source),
  historyStorage
);
assert.equal(originalHistoryWrite.ok, true);

const completedRetry = {
  ...retry,
  status: SESSION_STATUS.FINISHED,
  respostas: {
    q1: retry.questoes.find((question) => question.id === "q1").respostaCorretaId
  },
  finalizadoEm: "2026-07-20T13:00:00.000Z"
};
const retryHistoryWrite = recordCompletedSessionSafe(
  completedRetry,
  calculateSessionResult(completedRetry),
  historyStorage
);
assert.equal(retryHistoryWrite.ok, true);
assert.deepEqual(
  readHistory(historyStorage).sessions.map((session) => session.id),
  ["source-session", "retry-session"]
);

assert.throws(
  () => createRetryWrongSession({ questoes: [correctObjective], respostas: { q2: correctObjective.respostaCorretaId } }),
  /não possui questões erradas/i
);

console.log("Retry wrong questions: todos os testes passaram.");
