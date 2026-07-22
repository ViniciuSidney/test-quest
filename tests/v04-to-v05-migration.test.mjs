import assert from "node:assert/strict";
import {
  MIGRATION_BACKUP_KEY,
  STORAGE_KEY
} from "../src/scripts/core/constants.js";
import { getAlternativePresentation } from "../src/scripts/core/objective-question.js";
import { loadSession } from "../src/scripts/features/session/session.repository.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

const v04Session = {
  schemaVersion: 3,
  versao: 3,
  id: "session-v04",
  status: "em_andamento",
  listaNome: "Migração v0.4",
  atual: 0,
  questoes: [
    {
      id: "q-v04",
      categoria: "objetiva",
      assunto: "Gramática",
      tipo: "objetiva",
      enunciado: "Escolha B.",
      alternativas: { A: "A", B: "B", C: "C", D: "D", E: "E" },
      correta: "B",
      explicacao: "B é a resposta correta.",
      ordemOriginal: 0
    }
  ],
  respostas: { "q-v04": "B" },
  anotacoes: { "q-v04": "Nota preservada" },
  temposMs: { "q-v04": 42000 },
  revisao: { "q-v04": true },
  marcacoesAlternativas: { "q-v04": { A: "analise" } },
  temporizadorPausado: false,
  opcoes: { mostrarGabaritoFinal: true },
  importadoEm: "2026-07-18T12:00:00.000Z",
  iniciadoEm: "2026-07-18T12:00:00.000Z",
  finalizadoEm: null
};

const storage = new MemoryStorage({
  [STORAGE_KEY]: JSON.stringify(v04Session)
});
const report = loadSession(storage);
const question = report.session.questoes[0];
const answerId = report.session.respostas[question.id];

assert.equal(report.source, "current");
assert.equal(report.migrated, true);
assert.equal(report.session.schemaVersion, 6);
assert.equal(Array.isArray(question.alternativas), true);
assert.equal(question.alternativas.length, 5);
assert.equal(answerId, question.respostaCorretaId);
assert.equal(getAlternativePresentation(question, answerId)?.displayLetter, "B");
assert.deepEqual(report.session.marcacoesAlternativas[question.id], {
  [question.alternativas[0].id]: "analise"
});
assert.equal(report.session.anotacoes[question.id], "Nota preservada");
assert.equal(report.session.temposMs[question.id], 42000);
assert.equal(report.session.revisao[question.id], true);
assert.equal(report.session.opcoes.modoCorrecao, "final");
assert.deepEqual(report.session.confirmacoes, {});
assert.deepEqual(report.session.metacognicao, {});
assert.ok(storage.getItem(MIGRATION_BACKUP_KEY));

const persisted = JSON.parse(storage.getItem(STORAGE_KEY));
assert.equal(persisted.schemaVersion, 6);
assert.equal(persisted.respostas[question.id], question.respostaCorretaId);

console.log("v0.4 → v0.5 migration: todos os testes passaram.");
