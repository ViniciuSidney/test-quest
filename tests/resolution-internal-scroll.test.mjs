import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8");

assert.match(css, /@media \(min-width: 981px\)[\s\S]*#telaResolucao #areaResposta,[\s\S]*overflow-y:\s*auto;/);
assert.match(css, /#telaResolucao \.resolution-workspace[\s\S]*grid-template-rows:\s*minmax\(0, 1fr\) auto;/);
assert.match(css, /#telaResolucao #areaResposta,[\s\S]*grid-auto-rows:\s*max-content;/);
assert.match(css, /#telaResolucao \.resolution-question-panel[\s\S]*grid-template-rows:\s*auto auto minmax\(0, 1fr\);/);
assert.match(css, /@media \(max-width: 980px\)[\s\S]*#telaResolucao\.screen--resolution\.active[\s\S]*overflow-y:\s*auto;/);
assert.match(css, /\.resolution-feedback\s*\{[\s\S]*position:\s*static;/);

console.log("✓ rolagem interna da resolução e fluxo responsivo validados");
