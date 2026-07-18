import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const controller = await readFile(
  new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url),
  "utf8"
);

assert.ok(controller.includes('from "../session/session.repository.js"'));
assert.ok(controller.includes('from "../settings/settings.repository.js"'));
assert.equal(controller.includes("localStorage."), false);
assert.ok(controller.includes("saveSession(estado)"));
assert.ok(controller.includes("clearSession()"));

console.log("Persistence structure: todos os testes passaram.");
