import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const controllerUrl = new URL(
  "../src/scripts/features/question-resolution/question-resolution.controller.js",
  import.meta.url
);
const controller = await readFile(controllerUrl, "utf8");
const resultsService = await readFile(
  new URL("../src/scripts/features/results/results.service.js", import.meta.url),
  "utf8"
);

const requiredModules = [
  "../src/scripts/shared/formatters.js",
  "../src/scripts/features/session/session-lifecycle.service.js",
  "../src/scripts/features/session/session-confirmations.service.js",
  "../src/scripts/features/exports/session-export.service.js"
];

for (const modulePath of requiredModules) {
  const info = await stat(new URL(modulePath, import.meta.url));
  assert.equal(info.isFile(), true, `Módulo ausente: ${modulePath}`);
}

assert.match(controller, /session-lifecycle\.service\.js/);
assert.match(controller, /session-confirmations\.service\.js/);
assert.match(controller, /session-export\.service\.js/);
assert.match(controller, /shared\/formatters\.js/);
assert.match(controller, /calculateSessionResult as calcularResultado/);
assert.doesNotMatch(controller, /function calcularResultado\(/);
assert.doesNotMatch(controller, /function gerarRespostasTxt\(/);
assert.doesNotMatch(controller, /function formatarTempo\(/);
assert.doesNotMatch(controller, /function gerarIdSessao\(/);
assert.match(resultsService, /export function calculateSessionResult/);
assert.ok(controller.split("\n").length < 2200, "O controlador não foi reduzido como esperado.");

console.log("Modularization structure: todos os testes passaram.");
