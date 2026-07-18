import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseQuestions } from "../src/scripts/features/question-import/question-import.parser.js";
import {
  createActiveSession,
  finishSession,
  restoreActiveSession
} from "../src/scripts/features/session/session-lifecycle.service.js";
import { clearSession, loadSession, saveSession } from "../src/scripts/features/session/session.repository.js";
import { calculateSessionResult } from "../src/scripts/features/results/results.service.js";
import { readHistory, recordCompletedSessionSafe } from "../src/scripts/features/home/home.service.js";
import {
  createAnswersExport,
  createNotesExport,
  createSessionJsonExport
} from "../src/scripts/features/exports/session-export.service.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

const exampleText = await readFile(new URL("../public/examples/exemplo-questoes.txt", import.meta.url), "utf8");
const questions = parseQuestions(exampleText);
assert.equal(questions.length, 2);

const storage = new MemoryStorage();
let session = createActiveSession({
  questions,
  listName: "Fluxo completo",
  showAnswerKey: true,
  idFactory: () => "full-flow-session",
  now: () => "2026-07-18T13:00:00.000Z"
});

session.respostas[questions[0].id] = questions[0].respostaCorretaId;
session.respostas[questions[1].id] = "Mas indica oposição; mais indica quantidade.";
session.anotacoes[questions[0].id] = "Revisar conjunções.";
session.temposMs[questions[0].id] = 65000;
session.temposMs[questions[1].id] = 95000;
session.revisao[questions[1].id] = true;
session.atual = 1;

const firstSave = saveSession(session, storage);
assert.equal(firstSave.ok, true);

const reloaded = loadSession(storage);
assert.equal(reloaded.source, "current");
assert.equal(reloaded.session.respostas[questions[0].id], questions[0].respostaCorretaId);
assert.equal(reloaded.session.anotacoes[questions[0].id], "Revisar conjunções.");
assert.equal(reloaded.session.revisao[questions[1].id], true);
assert.equal(reloaded.session.atual, 1);

session = restoreActiveSession(reloaded.session);
session = finishSession(session, {
  now: () => "2026-07-18T13:10:00.000Z",
  idFactory: () => "unused"
});

const result = calculateSessionResult(session);
assert.deepEqual(result, {
  total: 2,
  respondidas: 2,
  objetivas: 1,
  discursivas: 1,
  acertos: 1,
  erros: 0,
  percentual: 100,
  tempoTotal: 160000,
  tempoMedio: 80000,
  marcadas: 1
});

const finalSave = saveSession(session, storage);
assert.equal(finalSave.ok, true);

const historyReport = recordCompletedSessionSafe(session, result, storage);
assert.equal(historyReport.ok, true);
assert.equal(historyReport.history.sessions.length, 1);
assert.equal(historyReport.history.sessions[0].id, "full-flow-session");
assert.equal(readHistory(storage).sessions.length, 1);

const answers = createAnswersExport(session, { now: new Date("2026-07-18T13:11:00.000Z") });
assert.match(answers.content, /RELATÓRIO DE RESPOSTAS/);
assert.match(answers.content, /Questões respondidas: 2\/2/);
assert.match(answers.content, /Desempenho nas objetivas: 100%/);
assert.match(answers.content, /Marcadas para revisão: 1/);

const notes = createNotesExport(session, { now: new Date("2026-07-18T13:11:00.000Z") });
assert.match(notes.content, /ANOTAÇÕES DA RESOLUÇÃO/);
assert.match(notes.content, /Revisar conjunções\./);

const json = createSessionJsonExport(session);
const parsedJson = JSON.parse(json.content);
assert.equal(parsedJson.schemaVersion, 4);
assert.equal(parsedJson.status, "finalizada");
assert.equal(parsedJson.id, "full-flow-session");

assert.equal(clearSession(storage), true);
assert.equal(loadSession(storage).session, null);
assert.equal(readHistory(storage).sessions.length, 1);

console.log("Full session flow: todos os testes passaram.");
