import assert from "node:assert/strict";
import {
  getAlternativeDisplayLetter,
  getAlternativePresentation,
  getCorrectAlternativeId,
  isObjectiveAnswerCorrect,
  normalizeObjectiveAlternatives,
  resolveObjectiveAnswerId
} from "../src/scripts/core/objective-question.js";

const legacyAlternatives = { A: "Um", B: "Dois", C: "Três", D: "Quatro", E: "Cinco" };
const first = normalizeObjectiveAlternatives(legacyAlternatives, "q-1");
const second = normalizeObjectiveAlternatives(legacyAlternatives, "q-1");

assert.equal(first.length, 5);
assert.deepEqual(first, second);
assert.ok(first.every((alternative) => alternative.id));
assert.deepEqual(first.map((alternative) => alternative.chaveOriginal), ["A", "B", "C", "D", "E"]);

const question = {
  id: "q-1",
  categoria: "objetiva",
  alternativas: first,
  correta: "B",
  respostaCorretaId: ""
};
question.respostaCorretaId = getCorrectAlternativeId(question);

assert.equal(resolveObjectiveAnswerId(question, "B"), first[1].id);
assert.equal(resolveObjectiveAnswerId(question, first[1].id), first[1].id);
assert.equal(isObjectiveAnswerCorrect(question, "B"), true);
assert.equal(isObjectiveAnswerCorrect(question, first[1].id), true);
assert.equal(getAlternativeDisplayLetter(question, first[1].id), "B");
assert.equal(getAlternativePresentation(question, first[1].id).text, "Dois");

const shuffledQuestion = {
  ...question,
  alternativas: [first[1], first[0], first[2], first[3], first[4]]
};

assert.equal(isObjectiveAnswerCorrect(shuffledQuestion, first[1].id), true);
assert.equal(getAlternativeDisplayLetter(shuffledQuestion, first[1].id), "A");
assert.equal(getAlternativePresentation(shuffledQuestion, first[1].id).originalKey, "B");


const trueFalseAlternatives = normalizeObjectiveAlternatives([
  { chaveOriginal: "V", texto: "Verdadeiro" },
  { chaveOriginal: "F", texto: "Falso" }
], "q-vf");

assert.equal(trueFalseAlternatives.length, 2);
assert.deepEqual(trueFalseAlternatives.map((alternative) => alternative.chaveOriginal), ["V", "F"]);

const trueFalseQuestion = {
  id: "q-vf",
  categoria: "objetiva",
  tipo: "verdadeiro ou falso",
  alternativas: trueFalseAlternatives,
  correta: "V",
  respostaCorretaId: ""
};
trueFalseQuestion.respostaCorretaId = getCorrectAlternativeId(trueFalseQuestion);

assert.equal(resolveObjectiveAnswerId(trueFalseQuestion, "V"), trueFalseAlternatives[0].id);
assert.equal(resolveObjectiveAnswerId(trueFalseQuestion, "F"), trueFalseAlternatives[1].id);
assert.equal(isObjectiveAnswerCorrect(trueFalseQuestion, trueFalseAlternatives[0].id), true);
assert.equal(getAlternativeDisplayLetter(trueFalseQuestion, trueFalseAlternatives[0].id), "V");
assert.equal(getAlternativeDisplayLetter(trueFalseQuestion, trueFalseAlternatives[1].id), "F");

console.log("Objective question model: todos os testes passaram.");
