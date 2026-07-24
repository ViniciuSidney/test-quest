import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [controller, feedback, resultsCss, resolutionCss, index] = await Promise.all([
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/immediate-feedback.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/results.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8")
]);

assert.match(feedback, /requiresQuestionConfirmation/);
assert.match(feedback, /question\.categoria === "discursiva"/);
assert.match(controller, /confirmada && !correcaoImediata/);
assert.match(controller, /buildMetacognitionMarkup/);
assert.match(index, /discursivas registram a percepção inicial antes da correção guiada/);
assert.match(resultsCss, /--review-card-outline/);
assert.match(resultsCss, /result-discursive-detail--metacognition/);
assert.match(resolutionCss, /resolution-confirmation-note/);

console.log("Discursive final metacognition structure: todos os testes passaram.");
