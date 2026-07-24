import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [index, mainCss, reviewCss, controller, service, resolutionController, state, schema, constants] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/main.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/discursive-review.css", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/discursive-review/discursive-review.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/discursive-review/discursive-review.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/state.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/session-schema.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/constants.js", import.meta.url), "utf8")
]);

assert.match(index, /id="telaCorrecaoDiscursiva"/);
assert.match(index, /Correção das respostas discursivas/);
assert.match(index, /Resolução[\s\S]*Correção discursiva[\s\S]*Desempenho[\s\S]*Resultado/);
assert.match(index, /id="opcoesVereditoCorrecaoDiscursiva"/);
assert.match(index, /id="listaProgressoCorrecaoDiscursiva"/);
assert.match(index, /id="validacoesCorrecaoDiscursiva"/);
assert.match(index, /id="btnSalvarAvancarCorrecaoDiscursiva"/);
assert.match(index, /id="btnConcluirCorrecaoDiscursiva"/);

assert.match(mainCss, /discursive-review\.css/);
assert.match(reviewCss, /\.discursive-review-layout/);
assert.match(reviewCss, /\.discursive-review-sidebar/);
assert.match(reviewCss, /\.discursive-review-verdict-options/);
assert.match(reviewCss, /@media\s*\(max-width:\s*1120px\)/);

assert.match(controller, /createDiscursiveReviewController/);
assert.match(controller, /setFinalVerdictLevel/);
assert.match(controller, /getDiscursiveReviewProgress/);
assert.match(controller, /Veredito final pendente/);
assert.match(service, /SESSION_STATUS\.REVIEWING/);
assert.match(service, /shouldOpenDiscursiveReview/);
assert.match(service, /markDiscursiveReviewCompleted/);
assert.match(resolutionController, /createDiscursiveReviewController/);
assert.match(resolutionController, /startDiscursiveReview/);
assert.match(resolutionController, /telaCorrecaoDiscursiva/);
assert.match(state, /REVIEWING:\s*"corrigindo_discursivas"/);
assert.match(state, /correcaoDiscursiva/);
assert.match(schema, /normalizeDiscursiveReviewState/);
assert.match(constants, /SESSION_SCHEMA_VERSION\s*=\s*7/);

console.log("Discursive review structure: todos os testes passaram.");
