import assert from "node:assert/strict";
import {
  escapeHtml,
  formatDateTime,
  formatDuration,
  formatStudyDuration,
  slugify
} from "../src/scripts/shared/formatters.js";

assert.equal(formatDuration(0), "00:00");
assert.equal(formatDuration(65000), "01:05");
assert.equal(formatDuration(3661000), "01:01:01");
assert.equal(formatStudyDuration(0), "0h 00min");
assert.equal(formatStudyDuration(7260000), "2h 01min");
assert.equal(formatDateTime(null), "—");
assert.equal(formatDateTime("data inválida"), "—");
assert.match(formatDateTime("2026-07-17T12:00:00.000Z"), /2026/);
assert.equal(escapeHtml('<p class="x">A & B\nC</p>'), "&lt;p class=&quot;x&quot;&gt;A &amp; B<br>C&lt;/p&gt;");
assert.equal(slugify("Lista de Gramática — Revisão!"), "lista-de-gramatica-revisao");
assert.equal(slugify(""), "arquivo");

console.log("Formatters: todos os testes passaram.");
