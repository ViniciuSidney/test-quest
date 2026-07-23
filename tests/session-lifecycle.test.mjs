import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import assert from "node:assert/strict";
import { SESSION_STATUS } from "../src/scripts/core/state.js";
import {
  createActiveSession,
  createSessionId,
  ensureSessionIdentity,
  finishSession,
  isActiveSession,
  restoreActiveSession,
  shuffleItems,
  shuffleQuestionAlternatives
} from "../src/scripts/features/session/session-lifecycle.service.js";

const objectiveAlternatives = normalizeObjectiveAlternatives(
  { A: "A", B: "B", C: "C", D: "D", E: "E" },
  "q1"
);
const objectiveBase = {
  id: "q1",
  categoria: "objetiva",
  assunto: "Gramática",
  tipo: "objetiva",
  enunciado: "Questão",
  alternativas: objectiveAlternatives,
  correta: "A",
  respostaCorretaId: ""
};
const questions = [
  {
    ...objectiveBase,
    respostaCorretaId: getCorrectAlternativeId(objectiveBase)
  },
  {
    id: "q2",
    categoria: "discursiva",
    assunto: "Gramática",
    tipo: "discursiva curta",
    enunciado: "Explique"
  }
];

const active = createActiveSession({
  questions,
  listName: "  Lista teste  ",
  showAnswerKey: false,
  now: () => "2026-07-17T12:00:00.000Z",
  idFactory: () => "session-1"
});

assert.equal(active.id, "session-1");
assert.equal(active.status, SESSION_STATUS.ACTIVE);
assert.equal(active.listaNome, "Lista teste");
assert.equal(active.importadoEm, "2026-07-17T12:00:00.000Z");
assert.equal(active.iniciadoEm, active.importadoEm);
assert.equal(active.opcoes.mostrarGabaritoFinal, false);
assert.equal(active.opcoes.embaralharQuestoes, false);
assert.equal(active.opcoes.embaralharAlternativas, false);
assert.notEqual(active.questoes[0], questions[0]);
assert.notEqual(active.questoes[0].alternativas, questions[0].alternativas);
assert.equal(isActiveSession(active), true);

const restored = restoreActiveSession({
  ...active,
  id: null,
  respostas: { q1: questions[0].respostaCorretaId },
  anotacoes: null,
  temposMs: null,
  revisao: null,
  marcacoesAlternativas: null
});
assert.ok(restored.id);
assert.deepEqual(restored.respostas, { q1: questions[0].respostaCorretaId });
assert.deepEqual(restored.anotacoes, {});
assert.equal(restored.status, SESSION_STATUS.ACTIVE);

const finished = finishSession(active, {
  now: () => "2026-07-17T13:00:00.000Z",
  idFactory: () => "unused"
});
assert.equal(finished.status, SESSION_STATUS.FINISHED);
assert.equal(finished.finalizadoEm, "2026-07-17T13:00:00.000Z");
assert.equal(finished.id, "session-1");
assert.equal(isActiveSession(finished), false);

assert.equal(ensureSessionIdentity({ id: "existing" }, () => "new").id, "existing");
assert.equal(ensureSessionIdentity({ id: null }, () => "new").id, "new");
assert.equal(createSessionId({ cryptoRef: { randomUUID: () => "uuid" } }), "uuid");
assert.equal(
  createSessionId({ cryptoRef: null, now: () => 123, random: () => 0.5 }),
  "sessao-123-8"
);
assert.deepEqual(shuffleItems([1, 2, 3], () => 0), [2, 3, 1]);
assert.notDeepEqual(
  shuffleQuestionAlternatives(objectiveBase, () => 0).alternativas.map((item) => item.id),
  objectiveBase.alternativas.map((item) => item.id)
);


const immediateSession = createActiveSession({
  questions,
  correctionMode: "imediata",
  idFactory: () => "session-immediate",
  now: () => "2026-07-18T12:00:00.000Z"
});
assert.equal(immediateSession.opcoes.modoCorrecao, "imediata");
assert.deepEqual(immediateSession.confirmacoes, {});
assert.deepEqual(immediateSession.avaliacoesDiscursivas, {});
assert.deepEqual(immediateSession.correcaoDiscursiva, { atualId: null, iniciadaEm: null, concluidaEm: null });

console.log("Session lifecycle: todos os testes passaram.");
