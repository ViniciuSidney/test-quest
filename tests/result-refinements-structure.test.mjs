import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const controller = await readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8");
const reviewController = await readFile(new URL("../src/scripts/features/discursive-review/discursive-review.controller.js", import.meta.url), "utf8");
const resolutionCss = await readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8");
const resultsCss = await readFile(new URL("../src/styles/pages/results.css", import.meta.url), "utf8");
const subjectView = await readFile(new URL("../src/scripts/features/results/subject-results.view.js", import.meta.url), "utf8");
const mapStatus = await readFile(new URL("../src/scripts/features/question-resolution/question-map-status.service.js", import.meta.url), "utf8");
const reviewCss = await readFile(new URL("../src/styles/pages/discursive-review.css", import.meta.url), "utf8");

assert.match(reviewController, /saveAndAdvanceButton\.hidden = isLastQuestion/);
assert.match(reviewController, /is-last-question/);
assert.match(reviewController, /is-only-question/);
assert.match(reviewCss, /\.discursive-review-actionbar\.is-last-question/);
assert.match(controller, /resultado\.questoesCorretas/);
assert.match(controller, /resultado\.questoesAvaliadas/);
assert.match(controller, /data-subject-result-toggle/);
assert.match(subjectView, /subject-result-question__contribution/);
assert.match(subjectView, /questões nesta lista/);
assert.match(subjectView, /respondidas/);
assert.match(controller, /resultadoBaseDesempenho/);
assert.match(controller, /formatResultPerformanceBasis/);
assert.match(resultsCss, /\.subject-result-details/);
assert.match(resultsCss, /\.subject-result-question/);
assert.match(resultsCss, /\.result-metric small/);
assert.match(mapStatus, /is-correct/);
assert.match(mapStatus, /is-partial/);
assert.match(mapStatus, /is-incorrect/);
assert.match(resolutionCss, /\.resolution-map-button\.is-correct/);
assert.match(resolutionCss, /\.resolution-map-button\.is-partial/);
assert.match(resolutionCss, /\.resolution-map-button\.is-incorrect/);

console.log("Result refinements structure: todos os testes passaram.");
