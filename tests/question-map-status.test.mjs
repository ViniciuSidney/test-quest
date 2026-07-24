import assert from "node:assert/strict";
import { getImmediateQuestionMapStatus } from "../src/scripts/features/question-resolution/question-map-status.service.js";

const objective = {
  id: "o1",
  categoria: "objetiva",
  alternativas: [{ id: "a1", chaveOriginal: "A", texto: "A" }],
  respostaCorretaId: "a1"
};
const discursive = { id: "d1", categoria: "discursiva" };

assert.deepEqual(getImmediateQuestionMapStatus({ state: {}, question: objective }), { className: "", label: "" });
assert.deepEqual(getImmediateQuestionMapStatus({ state: { respostas: { o1: "a1" } }, question: objective, immediate: true, confirmed: true }), { className: "is-correct", label: "correta" });
assert.deepEqual(getImmediateQuestionMapStatus({ state: { respostas: { o1: "outro" } }, question: objective, immediate: true, confirmed: true }), { className: "is-incorrect", label: "incorreta" });
assert.deepEqual(getImmediateQuestionMapStatus({ state: { avaliacoesDiscursivas: { d1: { vereditoFinal: { nivel: "parcial", percentual: 50 } } } }, question: discursive, immediate: true, confirmed: true }), { className: "is-partial", label: "parcial" });

console.log("Question map status: todos os testes passaram.");
