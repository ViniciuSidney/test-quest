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
  createObjective({ id: "q4", subject: "Média", statement: "Questão pendente", correct: "C" }),
  (() => {
    const alternativas = normalizeObjectiveAlternatives([
      { chaveOriginal: "V", texto: "Verdadeiro" },
      { chaveOriginal: "F", texto: "Falso" }
    ], "q5");
    const question = {
      id: "q5",
      categoria: "objetiva",
      assunto: "Média",
      tipo: "verdadeiro ou falso",
      enunciado: "A média pode ser afetada por valores extremos.",
      alternativas,
      correta: "V",
      respostaCorretaId: "",
      explicacao: "Explicação V/F"
    };
    question.respostaCorretaId = getCorrectAlternativeId(question);
    return question;
  })()
];

const answers = {
  q1: questions[0].respostaCorretaId,
  q2: questions[1].alternativas[3].id,
  q3: "Minha resposta",
  q5: questions[4].respostaCorretaId
};
const notes = { q2: "Rever este assunto" };
const timesMs = { q1: 62000, q2: 125000, q3: 185000, q4: 10000, q5: 30000, orphan: 999999 };
const review = { q2: true, q3: true };
const discursiveAssessments = {
  q3: {
    metacognicaoInicial: {
      nivel: "completa",
      percentual: 100,
      observacao: "Eu achava que estava completa."
    },
    vereditoFinal: {
      nivel: "parcial",
      percentual: 50,
      observacao: "Faltou desenvolver o raciocínio."
    }
  }
};

assert.equal(getQuestionResultStatus(questions[0], "B"), "correct");
assert.equal(getQuestionResultStatus(questions[1], "D"), "incorrect");
assert.equal(getQuestionResultStatus(questions[2], "texto"), "discursive");
assert.equal(getQuestionResultStatus(questions[3], ""), "unanswered");


const sessionResult = calculateSessionResult({
  questoes: questions,
  respostas: answers,
  temposMs: timesMs,
  revisao: review,
  avaliacoesDiscursivas: discursiveAssessments
});
assert.deepEqual(sessionResult, {
  total: 5,
  respondidas: 4,
  objetivas: 4,
  discursivas: 1,
  discursivasAvaliadas: 1,
  questoesAvaliadas: 5,
  pontosObtidos: 250,
  acertos: 2,
  discursivasCorretas: 0,
  questoesCorretas: 2,
  erros: 1,
  percentual: 50,
  percentualObjetivas: 50,
  tempoTotal: 412000,
  tempoMedio: 82400,
  marcadas: 2
});
assert.equal(calculateSessionTotalTime({ questoes: questions, temposMs: timesMs }), 412000);

const items = buildQuestionReviewItems({
  questions,
  answers,
  notes,
  timesMs,
  review,
  discursiveAssessments,
  showAnswerKey: true
});

assert.equal(items.length, 5);
assert.equal(items[0].status, "correct");
assert.equal(items[1].status, "incorrect");
assert.equal(items[1].markedForReview, true);
assert.equal(items[2].expectedAnswer, "Modelo");
assert.equal(items[2].initialMetacognitionLabel, "Resposta completa");
assert.equal(items[2].initialMetacognitionPercentage, 100);
assert.equal(items[2].finalVerdictLabel, "Resposta parcial");
assert.equal(items[2].finalVerdictPercentage, 50);
assert.equal(items[2].finalVerdictObservation, "Faltou desenvolver o raciocínio.");
assert.equal(items[3].status, "unanswered");
assert.equal(items[4].isTrueFalse, true);
assert.equal(items[4].typeLabel, "Verdadeiro ou Falso");
assert.equal(items[4].answerText, "Verdadeiro");

assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.INCORRECT).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.DISCURSIVE).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.REVIEW).length, 2);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.UNANSWERED).length, 1);
assert.equal(filterQuestionReviewItems(items, RESULT_FILTERS.ALL).length, 5);

const subjects = buildSubjectResultItems({ questions, answers, timesMs, discursiveAssessments });
const eventos = subjects.find((item) => item.subject === "Eventos");
const mediana = subjects.find((item) => item.subject === "Mediana");

assert.deepEqual(
  { objectives: eventos.objectives, correct: eventos.correct, percentage: eventos.percentage },
  { objectives: 2, correct: 1, percentage: 50 }
);
assert.equal(mediana.objectives, 0);
assert.equal(mediana.discursivesEvaluated, 1);
assert.equal(mediana.scoredQuestions, 1);
assert.equal(mediana.percentage, 50);
assert.equal(mediana.questions.length, 1);
assert.equal(mediana.questions[0].statusLabel, "Parcial");
assert.equal(mediana.questions[0].contributionPercentage, 50);
assert.equal(eventos.questions[0].contributionPercentage, 50);
assert.equal(eventos.questions[1].contributionPercentage, 0);
assert.equal(getSubjectPerformanceTone(90), "success");
assert.equal(getSubjectPerformanceTone(60), "warning");
assert.equal(getSubjectPerformanceTone(30), "danger");
assert.equal(getSubjectPerformanceTone(null), "neutral");
assert.equal(normalizeResultFilter("invalid"), RESULT_FILTERS.ALL);

console.log("Results state: todos os testes passaram.");
