import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const main = await readFile(new URL("../src/scripts/main.js", import.meta.url), "utf8");
const reporter = await readFile(new URL("../src/scripts/shared/startup-error.js", import.meta.url), "utf8");

assert.ok(main.includes("reportStartupError"));
assert.ok(main.includes("try"));
assert.ok(main.includes("catch"));
assert.ok(reporter.includes('role", "alert"'));
assert.ok(reporter.includes("data-startup-reload"));

console.log("Startup structure: todos os testes passaram.");
