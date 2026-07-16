import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const mainCss = await readFile(new URL("../src/styles/main.css", import.meta.url), "utf8");
const performanceCss = await readFile(
  new URL("../src/styles/pages/performance.css", import.meta.url),
  "utf8"
);
const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);

const requiredIds = [
  "telaDesempenho",
  "blocoPontuacaoDesempenho",
  "valorDesempenho",
  "tituloDesempenho",
  "subtituloDesempenho",
  "btnVerResultadoFinal"
];

for (const id of requiredIds) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `ID ausente: ${id}`);
}

assert.match(mainCss, /pages\/performance\.css/);
assert.match(performanceCss, /\.screen--performance\.active/);
assert.match(performanceCss, /body\[data-performance-state="excellent-100"\]/);
assert.match(performanceCss, /body\[data-performance-state="excellent-90"\]/);
assert.match(performanceCss, /body\[data-performance-state="very-good"\]/);
assert.match(performanceCss, /body\[data-performance-state="good-result"\]/);
assert.match(performanceCss, /body\[data-performance-state="attention-50"\]/);
assert.match(performanceCss, /body\[data-performance-state="review-needed"\]/);
assert.match(performanceCss, /@media \(max-width: 720px\)/);
assert.match(performanceCss, /prefers-reduced-motion/);

assert.match(controller, /desempenho: "#telaDesempenho"/);
assert.match(controller, /renderizarDesempenho\(resultadoFinal\)/);
assert.match(controller, /shouldShowPerformanceScreen\(resultadoFinal\.objetivas\)/);
assert.match(controller, /trocarTela\("desempenho"\)/);
assert.match(controller, /btnVerResultadoFinal/);
assert.match(controller, /function abrirResultadoFinal\(\)/);

console.log("Performance structure: todos os testes passaram.");
