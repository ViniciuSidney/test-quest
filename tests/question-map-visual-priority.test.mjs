import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles/pages/resolution.css", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

assert.match(
  css,
  /\.resolution-map-button\.is-answered:not\(\.is-current\):not\(\.is-correct\):not\(\.is-partial\):not\(\.is-incorrect\)/,
  "O estado azul de respondida deve ser aplicado somente quando não houver resultado semântico."
);

assert.match(
  html,
  /id="btnConcluirCorrecaoDiscursiva" class="primary"/,
  "Concluir correção deve ser uma ação primária."
);

console.log("Question map visual priority: todos os testes passaram.");
