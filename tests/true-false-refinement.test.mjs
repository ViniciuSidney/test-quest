import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const importCss = await readFile(new URL("../src/styles/pages/import.css", import.meta.url), "utf8");
const resolutionCss = await readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8");
const lifecycle = await readFile(new URL("../src/scripts/features/session/session-lifecycle.service.js", import.meta.url), "utf8");
const controller = await readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8");

assert.match(index, /import-model-card--vf/);
assert.match(index, /Não informe alternativas/);
assert.match(index, /ordem Verdadeiro → Falso permanece fixa/);
assert.match(importCss, /\.import-model-grid/);
assert.match(importCss, /\.import-model-card--vf/);
assert.match(lifecycle, /isTrueFalseQuestion\(question\)/);
assert.match(resolutionCss, /\.resolution-question-panel\.is-true-false/);
assert.match(resolutionCss, /\.resolution-answer-area\.is-true-false/);
assert.match(controller, /classList\.toggle\("is-true-false"/);
assert.match(resolutionCss, /\.resolution-tag--subject\s*\{[\s\S]*?width:\s*fit-content/);
assert.match(resolutionCss, /\.resolution-tag--subject\s*\{[\s\S]*?text-overflow:\s*ellipsis/);
assert.match(resolutionCss, /\.resolution-map-button\.is-answered:not\(\.is-current\)[\s\S]*?var\(--tq-info-soft\)/);
assert.doesNotMatch(
  resolutionCss.match(/\.resolution-map-button\.is-answered:not\(\.is-current\)\s*\{[\s\S]*?\}/)?.[0] || "",
  /--tq-success/
);
assert.match(
  resolutionCss,
  /\.resolution-answer-area\.is-true-false \.resolution-vf-layout[\s\S]*?34%/
);
assert.match(
  resolutionCss,
  /\.resolution-answer-area\.is-true-false \.resolution-vf-choice[\s\S]*?24vh/
);

console.log("True/false refinement: todos os testes passaram.");
