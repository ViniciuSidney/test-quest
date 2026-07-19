import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const mainCss = await readFile(new URL("../src/styles/main.css", import.meta.url), "utf8");
const resultsCss = await readFile(
  new URL("../src/styles/pages/results.css", import.meta.url),
  "utf8"
);
const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);

const requiredIds = [
  "telaResultado",
  "btnInicioResultado",
  "tituloResultadoFinal",
  "nomeListaResultado",
  "resultadoRespondidas",
  "resultadoCorretas",
  "resultadoTempoTotal",
  "resultadoDesempenho",
  "resultadoRevisao",
  "resultadoTempoMedio",
  "avisoResultadoDiscursivas",
  "listaDesempenhoAssuntos",
  "listaRevisaoResultado",
  "btnAlternarFiltrosResultado",
  "textoFiltroResultadoAtual",
  "filtrosResultado",
  "btnAlternarAcoesResultado",
  "acoesExportacaoResultado",
  "btnBaixarTxt",
  "btnBaixarAnotacoes",
  "btnExportarJson",
  "btnNovaLista"
];

for (const id of requiredIds) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `ID ausente: ${id}`);
}

for (const filter of ["all", "incorrect", "discursive", "review", "unanswered"]) {
  assert.match(index, new RegExp(`data-result-filter=["']${filter}["']`));
}

assert.match(mainCss, /pages\/results\.css/);
assert.match(resultsCss, /\.results-screen\.active/);
assert.match(resultsCss, /\.results-layout/);
assert.match(resultsCss, /body\[data-screen=["']resultado["']\]\s+\.legacy-topbar\s*\{[^}]*display:\s*none/s);
assert.match(resultsCss, /\.results-review-list\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s);
assert.match(resultsCss, /\.result-review-card\.is-expanded\s*\{[^}]*flex-basis:\s*100%[^}]*width:\s*100%/s);
assert.match(resultsCss, /@media \(max-width: 900px\)[\s\S]*?\.results-actionbar\s*\{[^}]*display:\s*grid/s);
assert.match(resultsCss, /@media \(max-width: 720px\)/);
assert.match(resultsCss, /\.results-actionbar\s*>\s*\.results-actions-toggle\s*\{[^}]*display:\s*none/s);
assert.match(resultsCss, /\.review-filters-toggle\s*\{[^}]*display:\s*none/s);
assert.match(resultsCss, /@media \(max-width: 900px\)[\s\S]*?\.review-filters\.is-open/s);
assert.match(resultsCss, /\.results-actions__exports\.is-open/);
assert.match(resultsCss, /\.result-discursive-detail--statement\s*\{[^}]*grid-column:\s*1\s*\/\s*11/s);
assert.match(resultsCss, /\.result-discursive-detail--time\s*\{[^}]*grid-column:\s*11\s*\/\s*13[^}]*align-content:\s*start/s);
assert.match(resultsCss, /prefers-reduced-motion/);

assert.match(controller, /buildQuestionReviewItems/);
assert.match(controller, /buildSubjectResultItems/);
assert.match(controller, /filterQuestionReviewItems/);
assert.match(controller, /function selecionarFiltroResultado/);
assert.match(controller, /function alternarCardResultado/);
assert.match(controller, /function renderizarDetalhesObjetivaResultado/);
assert.match(controller, /function renderizarDetalhesDiscursivaResultado/);
assert.match(resultsCss, /\.result-vf-details/);
assert.match(resultsCss, /\.result-vf-verdict-grid/);
assert.match(resultsCss, /\.result-review-card__type-badge/);
assert.match(controller, /function renderizarDetalhesVerdadeiroFalsoResultado/);
assert.match(controller, /data-question-type=/);

assert.match(controller, /function alternarAcoesResultado/);
assert.match(controller, /function sincronizarAcoesResultadoResponsivas/);
assert.match(controller, /function alternarFiltrosResultado/);
assert.match(controller, /function sincronizarFiltrosResultadoResponsivos/);
assert.match(controller, /resultadoFiltrosCompactosMedia/);
assert.match(controller, /questaoResultadoExpandidaId/);
assert.match(controller, /filtroResultadoAtivo/);
assert.doesNotMatch(controller, /resumoResultado/);
assert.doesNotMatch(controller, /detalhesResultado/);
assert.doesNotMatch(controller, /resultadoPorAssunto/);

console.log("Results structure: todos os testes passaram.");
