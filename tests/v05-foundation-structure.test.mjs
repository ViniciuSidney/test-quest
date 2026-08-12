import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [constants, schema, parser, controller, results, exportsService] = await Promise.all([
  readFile(new URL("../src/scripts/core/constants.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/session-schema.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-import/question-import.parser.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/results/results.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/exports/session-export.service.js", import.meta.url), "utf8")
]);

assert.match(constants, /APP_VERSION\s*=\s*"0\.6\.1"/);
assert.match(constants, /SESSION_SCHEMA_VERSION\s*=\s*7/);
assert.match(schema, /respostaCorretaId/);
assert.match(schema, /resolveObjectiveAnswerId/);
assert.match(parser, /normalizeObjectiveAlternatives/);
assert.match(controller, /data-alternative-id/);
assert.equal(controller.includes("Object.entries(questao.alternativas)"), false);
assert.match(results, /isObjectiveAnswerCorrect/);
assert.match(exportsService, /getAlternativePresentation/);

console.log("v0.5 foundation structure: todos os testes passaram.");
