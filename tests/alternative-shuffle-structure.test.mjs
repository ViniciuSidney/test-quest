import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);
const lifecycle = await readFile(
  new URL("../src/scripts/features/session/session-lifecycle.service.js", import.meta.url),
  "utf8"
);
const state = await readFile(
  new URL("../src/scripts/core/state.js", import.meta.url),
  "utf8"
);
const schema = await readFile(
  new URL("../src/scripts/core/session-schema.js", import.meta.url),
  "utf8"
);

assert.match(index, /id="opcaoEmbaralharAlternativas"/);
assert.match(index, /Embaralhar alternativas/);
assert.match(controller, /shuffleAlternatives:\s*\$\("#opcaoEmbaralharAlternativas"\)\.checked/);
assert.match(controller, /\$\("#opcaoEmbaralharAlternativas"\)\.checked\s*=\s*false/);
assert.match(lifecycle, /shuffleQuestionAlternatives/);
assert.match(lifecycle, /embaralharAlternativas:\s*Boolean\(shuffleAlternatives\)/);
assert.match(state, /embaralharAlternativas:\s*false/);
assert.match(schema, /embaralharAlternativas:\s*Boolean/);

console.log("Alternative shuffle structure: todos os testes passaram.");
