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
  "detalheDesempenho",
  "btnVerResultadoFinal"
];

for (const id of requiredIds) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `ID ausente: ${id}`);
}

assert.match(mainCss, /pages\/performance\.css/);
assert.match(performanceCss, /\.performance-overlay/);
assert.match(performanceCss, /body\[data-performance-state="excellent-100"\]/);
assert.match(performanceCss, /body\[data-performance-state="excellent-90"\]/);
assert.match(performanceCss, /body\[data-performance-state="very-good"\]/);
assert.match(performanceCss, /body\[data-performance-state="good-result"\]/);
assert.match(performanceCss, /body\[data-performance-state="attention-50"\]/);
assert.match(performanceCss, /body\[data-performance-state="review-needed"\]/);
assert.match(performanceCss, /@media \(max-width: 720px\)/);
assert.match(performanceCss, /prefers-reduced-motion/);

assert.match(controller, /mostrarDesempenho\(resultadoFinal\)/);
assert.match(controller, /shouldShowPerformanceScreen\(resultadoFinal\.objetivas\)/);
assert.match(controller, /abrirResultadoFinal\(\{ focar: false \}\)/);
assert.match(controller, /btnVerResultadoFinal/);
assert.match(controller, /function fecharDesempenho\(\)/);
assert.match(controller, /function abrirResultadoFinal\(\{ focar = true \} = \{\}\)/);

assert.doesNotMatch(index, /performance-side-panel/);
assert.doesNotMatch(index, /performance-footer-bar/);
assert.match(index, /class="performance-backdrop"/);
assert.match(index, /role="dialog"/);
assert.match(performanceCss, /backdrop-filter: blur\(7px\)/);
assert.match(performanceCss, /performance-score-in/);
assert.match(index, /class="performance-score-aura"/);
assert.match(performanceCss, /performance-overlay-fade-in/);
assert.match(performanceCss, /performance-overlay-fade-out/);
assert.match(performanceCss, /performance-score-aura-rotate/);
assert.match(performanceCss, /conic-gradient/);
assert.match(controller, /animarPontuacaoDesempenho/);

assert.match(performanceCss, /Cascadia Mono/);
assert.match(performanceCss, /font-variant-numeric: tabular-nums slashed-zero/);
assert.match(performanceCss, /\.performance-detail/);
assert.match(controller, /formatPerformanceBasis/);
assert.match(controller, /screenManager\.elements\.resultado\?\.setAttribute\("inert"/);

console.log("Performance structure: todos os testes passaram.");
