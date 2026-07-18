import assert from "node:assert/strict";
import {
  getAlternativeDisplayLetter,
  getCorrectAlternativeId,
  isObjectiveAnswerCorrect,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import {
  createActiveSession,
  restoreActiveSession,
  shuffleQuestionAlternatives
} from "../src/scripts/features/session/session-lifecycle.service.js";
import { buildAnswersReport } from "../src/scripts/features/exports/session-export.service.js";
import { normalizeSessionState } from "../src/scripts/core/session-schema.js";

const alternatives = normalizeObjectiveAlternatives(
  { A: "Um", B: "Dois", C: "Três", D: "Quatro", E: "Cinco" },
  "q-shuffle"
);
const question = {
  id: "q-shuffle",
  categoria: "objetiva",
  assunto: "Gramática",
  tipo: "objetiva",
  enunciado: "Escolha uma alternativa.",
  alternativas: alternatives,
  correta: "A",
  respostaCorretaId: ""
};
question.respostaCorretaId = getCorrectAlternativeId(question);

const originalIds = alternatives.map((alternative) => alternative.id);
const shuffledQuestion = shuffleQuestionAlternatives(question, () => 0);
const shuffledIds = shuffledQuestion.alternativas.map((alternative) => alternative.id);

assert.notDeepEqual(shuffledIds, originalIds);
assert.deepEqual(question.alternativas.map((alternative) => alternative.id), originalIds);
assert.equal(shuffledQuestion.respostaCorretaId, question.respostaCorretaId);
assert.equal(isObjectiveAnswerCorrect(shuffledQuestion, question.respostaCorretaId), true);
assert.equal(getAlternativeDisplayLetter(question, question.respostaCorretaId), "A");
assert.equal(getAlternativeDisplayLetter(shuffledQuestion, question.respostaCorretaId), "E");

const forcedChange = shuffleQuestionAlternatives(question, () => 0.999999);
assert.notDeepEqual(
  forcedChange.alternativas.map((alternative) => alternative.id),
  originalIds,
  "O embaralhamento deve alterar a ordem mesmo quando o sorteio retorna a ordem original."
);

const session = createActiveSession({
  questions: [question],
  listName: "Lista embaralhada",
  shuffleAlternatives: true,
  random: () => 0,
  now: () => "2026-07-18T12:00:00.000Z",
  idFactory: () => "shuffle-session"
});

assert.equal(session.opcoes.embaralharAlternativas, true);
assert.notDeepEqual(
  session.questoes[0].alternativas.map((alternative) => alternative.id),
  originalIds
);
assert.equal(
  isObjectiveAnswerCorrect(session.questoes[0], question.respostaCorretaId),
  true
);

session.respostas[question.id] = question.respostaCorretaId;
const orderBeforeReload = session.questoes[0].alternativas.map((alternative) => alternative.id);
const restored = restoreActiveSession(JSON.parse(JSON.stringify(session)));

assert.deepEqual(
  restored.questoes[0].alternativas.map((alternative) => alternative.id),
  orderBeforeReload,
  "A ordem exibida deve permanecer igual depois da restauração da sessão."
);
assert.equal(restored.respostas[question.id], question.respostaCorretaId);
assert.equal(isObjectiveAnswerCorrect(restored.questoes[0], restored.respostas[question.id]), true);

session.marcacoesAlternativas[question.id] = {
  [session.questoes[0].alternativas[0].id]: "analise"
};
const normalized = normalizeSessionState(JSON.parse(JSON.stringify(session))).state;
assert.deepEqual(
  normalized.marcacoesAlternativas,
  session.marcacoesAlternativas,
  "Os marcadores devem continuar vinculados ao ID da alternativa embaralhada."
);

const combinedSession = createActiveSession({
  questions: [
    question,
    {
      id: "q-discursive",
      categoria: "discursiva",
      assunto: "Gramática",
      tipo: "discursiva curta",
      enunciado: "Explique.",
      alternativas: null
    }
  ],
  shuffleQuestions: true,
  shuffleAlternatives: true,
  random: () => 0,
  now: () => "2026-07-18T12:00:00.000Z",
  idFactory: () => "combined-session"
});
assert.equal(combinedSession.opcoes.embaralharQuestoes, true);
assert.equal(combinedSession.opcoes.embaralharAlternativas, true);
assert.deepEqual(combinedSession.questoes.map((item) => item.id), ["q-discursive", "q-shuffle"]);
assert.notDeepEqual(
  combinedSession.questoes[1].alternativas.map((alternative) => alternative.id),
  originalIds
);

const report = buildAnswersReport({
  ...session,
  finalizadoEm: "2026-07-18T12:10:00.000Z",
  temposMs: { [question.id]: 15000 },
  anotacoes: {},
  revisao: {}
}, { now: new Date("2026-07-18T12:15:00.000Z") });

assert.match(report, /Sua resposta: E\) Um/);
assert.match(report, /Resposta correta: E\) Um/);

const normalSession = createActiveSession({
  questions: [question],
  shuffleAlternatives: false,
  now: () => "2026-07-18T12:00:00.000Z",
  idFactory: () => "normal-session"
});

assert.deepEqual(
  normalSession.questoes[0].alternativas.map((alternative) => alternative.id),
  originalIds
);
assert.equal(normalSession.opcoes.embaralharAlternativas, false);

console.log("Alternative shuffle: todos os testes passaram.");
