import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, controller, statesCss, mainCss, constants] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/utilities/states.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/main.css", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/constants.js", import.meta.url), "utf8")
]);

for (const id of [
  "telaInicial",
  "telaImportacao",
  "telaResolucao",
  "telaDesempenho",
  "telaResultado",
  "avisoPersistencia",
  "btnTentarPersistencia",
  "btnFecharAvisoPersistencia"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}

assert.match(controller, /inspectStorage\(\)/);
assert.match(controller, /beforeunload/);
assert.match(controller, /recordCompletedSessionSafe/);
assert.match(controller, /getPersistenceWarning/);
assert.equal(controller.includes("localStorage."), false);

assert.match(statesCss, /\.persistence-warning/);
assert.match(mainCss, /utilities\/states\.css/);
assert.match(constants, /APP_VERSION\s*=\s*"0\.5\.0"/);
assert.match(constants, /SESSION_SCHEMA_VERSION\s*=\s*7/);

console.log("Release regression: todos os testes passaram.");
