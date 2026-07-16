import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const mainCss = await readFile(new URL("../src/styles/main.css", import.meta.url), "utf8");
const resolutionCss = await readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8");
const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);

const requiredIds = [
  "telaResolucao",
  "btnVoltarImportacao",
  "nomeListaResolucao",
  "contadorQuestao",
  "percentualProgresso",
  "barraProgresso",
  "tempoAtual",
  "tempoTotal",
  "btnPausarTempo",
  "listaNavegacao",
  "anotacaoQuestao",
  "numeroQuestao",
  "tipoQuestao",
  "assuntoQuestao",
  "revisaoQuestao",
  "enunciadoQuestao",
  "areaResposta",
  "btnMarcarRevisao",
  "btnFinalizarSessao",
  "btnAnterior",
  "btnProxima",
  "btnFinalizar"
];

for (const id of requiredIds) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `ID ausente: ${id}`);
}

const ids = [...index.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, position) => ids.indexOf(id) !== position);
assert.deepEqual([...new Set(duplicates)], [], `IDs duplicados: ${duplicates.join(", ")}`);

assert.match(mainCss, /pages\/resolution\.css/);
assert.match(resolutionCss, /\.screen--resolution\.active/);
assert.match(resolutionCss, /\.resolution-option-card\.is-selected/);
assert.match(resolutionCss, /@media \(max-width: 720px\)/);
assert.match(controller, /getNextMarkerState/);
assert.match(controller, /btnFinalizarSessao/);
assert.match(controller, /temporizadorPausado/);
assert.doesNotMatch(controller, /querySelectorAll\("\.map-btn"\)/);

console.log("Resolution structure: todos os testes passaram.");
