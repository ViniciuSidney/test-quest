import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [index, controller, service, confirmations, resultsService, resultsCss] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/retry-wrong/retry-wrong.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/session/session-confirmations.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/results/results.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/results.css", import.meta.url), "utf8")
]);

assert.match(index, /id="btnRefazerErradas"/);
assert.match(index, /id="quantidadeRefazerErradas"/);
assert.match(controller, /createRetryWrongSession/);
assert.match(controller, /getRetryWrongSummary/);
assert.match(controller, /btnRefazerErradas/);
assert.match(controller, /refazerQuestoesErradas/);
assert.match(service, /export function isRetryEligibleQuestion/);
assert.match(service, /export function createRetryWrongSession/);
assert.match(service, /embaralharAlternativas/);
assert.match(service, /modoCorrecao/);
assert.match(confirmations, /getRetryWrongQuestionsConfirmation/);
assert.match(resultsService, /retryEligible/);
assert.match(resultsCss, /\.results-retry-button/);
assert.match(resultsCss, /\.results-retry-count/);
assert.match(resultsCss, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);

console.log("Retry wrong structure: todos os testes passaram.");
