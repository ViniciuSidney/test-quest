import { getAlternativePresentation } from "../src/scripts/core/objective-question.js";
import assert from "node:assert/strict";
import { SESSION_SCHEMA_VERSION } from "../src/scripts/core/constants.js";
import { normalizeSessionState, validateSessionState } from "../src/scripts/core/session-schema.js";

const legacy = {
  versao: 2,
  listaNome: "  Lista legada  ",
  status: "em_andamento",
  atual: 99,
  questoes: [
    {
      id: "q-1",
      categoria: "objetiva",
      assunto: "Gramática",
      tipo: "objetiva",
      enunciado: "Qual alternativa está correta?",
      alternativas: { A: "A", B: "B", C: "C", D: "D", E: "E" },
      correta: "b",
      explicacao: "Explicação"
    },
    {
      id: "q-1",
      categoria: "discursiva",
      assunto: "Gramática",
      enunciado: "Explique a regra.",
      respostaEsperada: "Resposta",
      criterios: "Critérios"
    }
  ],
  respostas: { "q-1": " b ", orfao: "X" },
  anotacoes: { "q-1": "Nota", orfao: "Descartar" },
  temposMs: { "q-1": 2450.8, orfao: 999, negativo: -10 },
  revisao: { "q-1": true, orfao: true },
  marcacoesAlternativas: {
    "q-1": { A: "analise", B: "neutro", C: "valor-invalido" },
    orfao: { A: "eliminada" }
  },
  importadoEm: "2026-07-17T12:00:00.000Z"
};

const result = normalizeSessionState(legacy);
assert.equal(result.state.schemaVersion, SESSION_SCHEMA_VERSION);
assert.equal(result.state.versao, SESSION_SCHEMA_VERSION);
assert.equal(result.state.listaNome, "Lista legada");
assert.equal(result.state.atual, 1);
assert.equal(result.state.questoes.length, 2);
assert.notEqual(result.state.questoes[0].id, result.state.questoes[1].id);
assert.equal(result.state.questoes[0].correta, "B");
assert.deepEqual(Object.keys(result.state.respostas), ["q-1"]);
assert.equal(
  result.state.respostas["q-1"],
  result.state.questoes[0].respostaCorretaId
);
assert.equal(
  getAlternativePresentation(
    result.state.questoes[0],
    result.state.respostas["q-1"]
  )?.displayLetter,
  "B"
);
assert.deepEqual(Object.keys(result.state.anotacoes), ["q-1"]);
assert.deepEqual(Object.keys(result.state.temposMs), ["q-1"]);
assert.equal(result.state.temposMs["q-1"], 2450);
assert.deepEqual(result.state.marcacoesAlternativas["q-1"], {
  [result.state.questoes[0].alternativas[0].id]: "analise"
});
assert.equal(result.migrated, true);
assert.ok(result.issues.length >= 1);

const invalid = validateSessionState({ questoes: [] });
assert.equal(invalid.valid, false);
assert.ok(invalid.issues.length > 0);

console.log("Session schema: todos os testes passaram.");
