import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [index, css] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/discursive-review.css", import.meta.url), "utf8")
]);

assert.match(index, /id="btnInicioCorrecaoDiscursiva"[^>]*class="secondary discursive-review-home-action"/);
assert.doesNotMatch(index, /class="discursive-review-brand"/);
assert.match(css, /body\[data-screen="correcaoDiscursiva"\] \.legacy-topbar\s*\{[\s\S]*?display:\s*none/);
assert.match(css, /#telaCorrecaoDiscursiva\.discursive-review-screen\.active\s*\{[\s\S]*?grid-template-rows:\s*auto minmax\(0, 1fr\)/);
assert.match(css, /\.discursive-review-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) clamp\(310px, 23vw, 390px\)/);
assert.match(css, /\.discursive-review-content\s*\{[\s\S]*?overflow-y:\s*auto/);
assert.match(css, /\.discursive-review-sidebar\s*\{[\s\S]*?overflow-y:\s*auto/);
assert.match(css, /@media\s*\(max-width:\s*1120px\)/);
assert.doesNotMatch(css, /max-width:\s*1600px/);

console.log("Discursive review native layout: todos os testes passaram.");
