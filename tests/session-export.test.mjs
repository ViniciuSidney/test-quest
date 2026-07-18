import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import assert from "node:assert/strict";
import {
  buildAnswersReport,
  buildNotesReport,
  createAnswersExport,
  createNotesExport,
  createSessionJsonExport
} from "../src/scripts/features/exports/session-export.service.js";

const objectiveAlternatives = normalizeObjectiveAlternatives(
  { A: "A", B: "B", C: "C", D: "D", E: "E" },
  "q1"
);
const objectiveQuestionBase = {
  id: "q1",
  categoria: "objetiva",
  assunto: "Mas e mais",
  enunciado: "Escolha a opção correta.",
  alternativas: objectiveAlternatives,
  correta: "B",
  respostaCorretaId: "",
  explicacao: "Mas indica oposição."
};
const objectiveQuestion = {
  ...objectiveQuestionBase,
  respostaCorretaId: getCorrectAlternativeId(objectiveQuestionBase)
};
const state = {
  schemaVersion: 4,
  id: "session-1",
  listaNome: "Lista de Gramática",
  questoes: [
    objectiveQuestion,
    {
      id: "q2",
      categoria: "discursiva",
      assunto: "Mas e mais",
      enunciado: "Explique a diferença.",
      respostaEsperada: "Uma explicação.",
      criterios: "Distinguir os termos."
    }
  ],
  respostas: { q1: objectiveQuestion.respostaCorretaId, q2: "Minha resposta" },
  anotacoes: { q2: "Revisar depois" },
  temposMs: { q1: 61000, q2: 120000 },
  revisao: { q2: true },
  importadoEm: "2026-07-17T12:00:00.000Z",
  finalizadoEm: "2026-07-17T13:00:00.000Z"
};
const now = new Date("2026-07-17T14:00:00.000Z");

const answers = buildAnswersReport(state, { now });
assert.match(answers, /RELATÓRIO DE RESPOSTAS/);
assert.match(answers, /Questões respondidas: 2\/2/);
assert.match(answers, /Acertos nas objetivas: 1\/1/);
assert.match(answers, /Tempo total: 03:01/);
assert.match(answers, /Status: Correta/);
assert.match(answers, /Resposta esperada: Uma explicação\./);

const notes = buildNotesReport(state, { now });
assert.match(notes, /ANOTAÇÕES DA RESOLUÇÃO/);
assert.match(notes, /Revisar depois/);
assert.match(notes, /Marcada para revisão: Sim/);

const answersFile = createAnswersExport(state, { now });
const notesFile = createNotesExport(state, { now });
const jsonFile = createSessionJsonExport(state);
assert.equal(answersFile.fileName, "lista-de-gramatica-respostas.txt");
assert.equal(notesFile.fileName, "lista-de-gramatica-anotacoes.txt");
assert.equal(jsonFile.fileName, "lista-de-gramatica-sessao.json");
assert.deepEqual(JSON.parse(jsonFile.content), state);

console.log("Session export: todos os testes passaram.");
