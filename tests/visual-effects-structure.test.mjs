import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);
const visualController = await readFile(
  new URL("../src/scripts/features/settings/visual-effects.controller.js", import.meta.url),
  "utf8"
);
const motionCss = await readFile(
  new URL("../src/styles/utilities/motion.css", import.meta.url),
  "utf8"
);
const modalCss = await readFile(
  new URL("../src/styles/components/visual-effects-modal.css", import.meta.url),
  "utf8"
);
const mainCss = await readFile(new URL("../src/styles/main.css", import.meta.url), "utf8");

for (const path of [
  "../src/scripts/features/settings/visual-effects.service.js",
  "../src/scripts/features/settings/visual-effects.controller.js",
  "../src/styles/utilities/motion.css",
  "../src/styles/components/visual-effects-modal.css"
]) {
  assert.equal((await stat(new URL(path, import.meta.url))).isFile(), true, `Arquivo ausente: ${path}`);
}

assert.match(index, /id="modalEfeitosVisuais"/);
assert.match(index, /name="efeitosVisuais" value="system"/);
assert.match(index, /name="efeitosVisuais" value="full"/);
assert.match(index, /name="efeitosVisuais" value="reduced"/);
assert.ok((index.match(/data-motion-settings-open/g) || []).length >= 4);
assert.match(index, /data-motion="system" data-motion-resolved="full"/);

assert.match(controller, /createVisualEffectsController/);
assert.match(controller, /shouldReduceVisualEffects\(document\.body\)/);
assert.doesNotMatch(controller, /prefers-reduced-motion: reduce/);
assert.match(visualController, /saveSettings/);
assert.match(visualController, /reducedMotionMedia/);
assert.match(visualController, /Configurar efeitos visuais/);

assert.match(motionCss, /body\[data-motion-resolved="reduced"\]/);
assert.match(motionCss, /scroll-behavior: auto !important/);
assert.match(modalCss, /visual-effects-option/);
assert.match(mainCss, /utilities\/motion\.css/);
assert.match(mainCss, /components\/visual-effects-modal\.css/);

console.log("Visual effects structure: todos os testes passaram.");
