import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [index, state, schema, lifecycle, controller, styles, metacognition] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/state.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/session-schema.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/session/session-lifecycle.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/metacognition.service.js", import.meta.url), "utf8")
]);

assert.match(index, /name="modoCorrecao"/);
assert.match(index, /value="imediata"/);
assert.match(index, /id="btnConfirmarResposta"/);
assert.match(state, /confirmacoes:\s*\{\}/);
assert.match(state, /metacognicao:\s*\{\}/);
assert.match(state, /modoCorrecao:\s*"final"/);
assert.match(schema, /normalizeCorrectionMode/);
assert.match(schema, /confirmacoes:/);
assert.match(schema, /normalizeMetacognitionMap/);
assert.match(lifecycle, /correctionMode/);
assert.match(controller, /confirmarRespostaAtual/);
assert.match(controller, /requiresQuestionConfirmation/);
assert.match(controller, /confirmada && !correcaoImediata/);
assert.match(controller, /buildImmediateFeedbackMarkup/);
assert.match(styles, /resolution-feedback--success/);
assert.match(styles, /resolution-option-card\.is-correct/);
assert.match(styles, /resolution-metacognition/);
assert.match(styles, /resolution-confirmation-note/);
assert.match(metacognition, /METACOGNITION_LEVELS/);

console.log("Immediate feedback structure: todos os testes passaram.");
