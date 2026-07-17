import assert from "node:assert/strict";
import {
  RESULT_FILTERS,
  buildQuestionReviewItems,
  buildSubjectResultItems,
  filterQuestionReviewItems,
  getQuestionResultStatus,
  getSubjectPerformanceTone,
  normalizeResultFilter
} from "../src/scripts/features/results/results.service.js";

const questions = [
  {
    id: "q1",
    categoria: "objetiva",
    assunto: "Eventos",
    enunciado: "Questão correta",
    correta: "B",
    explicacao: "Explicação"
  },
  {
    id: "q2",
    categoria: "objetiva",
    assunto: "Eventos",
    enunciado: "Questão incorreta",
    correta: "A",
    explicacao: "Explicação"
  },
  {
    id: "q3",
    categoria: "discursiva",
    assunto: "Mediana",
    enunciado: "Questão discursiva",
    respostaEsperada: "Modelo",
    criterios: "Critérios"
  },
  {
    id: "q4",
    categoria: "objetiva",
    assunto: "Média",
    enunciado: "Questão pendente",
    correta: "C",
    explicacao: "Explicação"
  }
];

const answers = { q1: "b", q2: "D", q3: "Minha resposta" };
const notes = { q2: "Rever este assunto" };
const timesMs = { q1: 62000, q2: 125000, q3: 185000, q4: 10000, orphan: 999999 };
const review = { q2: true, q3: true };

assert.equal(getQuestionResultStatus(questions[0], "B"), "correct");
assert.equal(getQuestionResultStatus(questions[1], "D"), "incorrect");
assert.equal(getQuestionResultStatus(questions[2], "texto"), "discursive");
assert.equal(getQuestionResultStatus(questions[3], ""), "unanswered");

const items = buildQuestionReviewItems({
  questions,
  answers,
  notes,
  timesMs,
  review,
  showAnswerKey: true
});

assert.equal(items.length, 4);
assert.equal(items[0].status, "correct");
assert.equal(items[1].status, "incorrect");
assert.equal(items[1].markedForReview, true);
assert.equal(items[2].expectedAnswer, "Modelo");
assert.equal(items[3].status, "unanswered");

assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.INCORRECT).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.DISCURSIVE).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.REVIEW).length, 2);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.UNANSWERED).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.ALL).length, 4);

const subjects = buildSubjectResultItems({ questions, answers, timesMs });
const eventos = subjects.find((item) => item.subject === "Eventos");
const mediana = subjects.find((item) => item.subject === "Mediana");

assert.deepEqual(
  { objectives: eventos.objectives, correct: eventos.correct, percentage: eventos.percentage },
  { objectives: 2, correct: 1, percentage: 50 }
);
assert.equal(mediana.objectives, 0);
assert.equal(mediana.percentage, null);
assert.equal(getSubjectPerformanceTone(90), "success");
assert.equal(getSubjectPerformanceTone(60), "warning");
assert.equal(getSubjectPerformanceTone(30), "danger");
assert.equal(getSubjectPerformanceTone(null), "neutral");
assert.equal(normalizeResultFilter("invalid"), RESULT_FILTERS.ALL);

console.log("Results state: todos os testes passaram.");
