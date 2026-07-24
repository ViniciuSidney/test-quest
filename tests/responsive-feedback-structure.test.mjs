import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [importCss, resolutionCss, resultsCss] = await Promise.all([
  readFile(new URL("../src/styles/pages/import.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/results.css", import.meta.url), "utf8")
]);

assert.match(importCss, /v0\.5 — Robustez da coluna de configurações em zoom alto/);
assert.match(importCss, /\.import-side-column\s*\{[^}]*overflow-y:\s*auto/s);
assert.match(importCss, /grid-template-rows:\s*max-content max-content/);
assert.match(importCss, /\.session-options\s*\{[^}]*min-height:\s*max-content/s);

assert.match(resolutionCss, /v0\.5 — Correção imediata responsiva e rolagem da resolução/);
assert.match(resolutionCss, /@media \(min-width: 981px\)[\s\S]*#telaResolucao #areaResposta,[\s\S]*overflow-y:\s*auto/);
assert.match(resolutionCss, /@media \(max-width: 980px\)[\s\S]*#telaResolucao\.screen--resolution\.active[\s\S]*overflow-y:\s*auto/);
assert.match(resolutionCss, /#telaResolucao \.resolution-question-panel[\s\S]*grid-template-rows:\s*auto auto minmax\(0, 1fr\)/);
assert.match(resolutionCss, /\.resolution-feedback__comparison,[\s\S]*auto-fit/);
assert.match(resolutionCss, /\.resolution-metacognition__choices/);
assert.match(resolutionCss, /data-tone="completa"/);
assert.match(resultsCss, /result-metacognition-summary/);
assert.match(resultsCss, /result-discursive-detail--metacognition/);
assert.match(resultsCss, /data-metacognition-level="completa"/);
assert.match(resolutionCss, /resolution-option-card\.is-selected[\s\S]*0 0 0 3px/);
assert.match(resolutionCss, /resolution-vf-choice\.is-selected[\s\S]*scale\(1\.012\)/);

console.log("Responsive feedback structure: todos os testes passaram.");
