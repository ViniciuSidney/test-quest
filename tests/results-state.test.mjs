import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import assert from "node:assert/strict";
import {
  RESULT_FILTERS,
  buildQuestionReviewItems,
  calculateSessionResult,
  calculateSessionTotalTime,
  buildSubjectResultItems,
  filterQuestionReviewItems,
  getQuestionResultStatus,
  getSubjectPerformanceTone,
  normalizeResultFilter
} from "../src/scripts/features/results/results.service.js";

function createObjective({ id, subject, statement, correct }) {
  const alternativas = normalizeObjectiveAlternatives(
    { A: "A", B: "B", C: "C", D: "D", E: "E" },
    id
  );
  const question = {
    id,
    categoria: "objetiva",
    assunto: subject,
    enunciado: statement,
    alternativas,
    correta: correct,
    respostaCorretaId: "",
    explicacao: "Explicação"
  };

  return {
    ...question,
    respostaCorretaId: getCorrectAlternativeId(question)
  };
}

const questions = [
  createObjective({ id: "q1", subject: "Eventos", statement: "Questão correta", correct: "B" }),
  createObjective({ id: "q2", subject: "Eventos", statement: "Questão incorreta", correct: "A" }),
  {
    id: "q3",
    categoria: "discursiva",
    assunto: "Mediana",
    enunciado: "Questão discursiva",
    respostaEsperada: "Modelo",
    criterios: "Critérios"
  },
  createObjective({ id: "q4", subject: "Média", statement: "Questão pendente", correct: "C" })
];

const answers = {
  q1: questions[0].respostaCorretaId,
  q2: questions[1].alternativas[3].id,
  q3: "Minha resposta"
};
const notes = { q2: "Rever este assunto" };
const timesMs = { q1: 62000, q2: 125000, q3: 185000, q4: 10000, orphan: 999999 };
const review = { q2: true, q3: true };

assert.equal(getQuestionResultStatus(questions[0], "B"), "correct");
assert.equal(getQuestionResultStatus(questions[1], "D"), "incorrect");
assert.equal(getQuestionResultStatus(questions[2], "texto"), "discursive");
assert.equal(getQuestionResultStatus(questions[3], ""), "unanswered");


const sessionResult = calculateSessionResult({
  questoes: questions,
  respostas: answers,
  temposMs: timesMs,
  revisao: review
});
assert.deepEqual(sessionResult, {
  total: 4,
  respondidas: 3,
  objetivas: 3,
  discursivas: 1,
  acertos: 1,
  erros: 1,
  percentual: 33,
  tempoTotal: 382000,
  tempoMedio: 95500,
  marcadas: 2
});
assert.equal(calculateSessionTotalTime({ questoes: questions, temposMs: timesMs }), 382000);

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
