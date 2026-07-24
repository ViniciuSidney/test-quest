import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);
const themeController = await readFile(
  new URL("../src/scripts/features/settings/theme.controller.js", import.meta.url),
  "utf8"
);
const visualEffectsController = await readFile(
  new URL("../src/scripts/features/settings/visual-effects.controller.js", import.meta.url),
  "utf8"
);

assert.ok(controller.includes('from "../session/session.repository.js"'));
assert.ok(controller.includes('from "../settings/theme.controller.js"'));
assert.ok(controller.includes('from "../settings/visual-effects.controller.js"'));
assert.ok(themeController.includes('from "./settings.repository.js"'));
assert.ok(visualEffectsController.includes('from "./settings.repository.js"'));
assert.equal(controller.includes("localStorage."), false);
assert.ok(controller.includes("saveSession(estado)"));
assert.ok(controller.includes("clearSession()"));

console.log("Persistence structure: todos os testes passaram.");
