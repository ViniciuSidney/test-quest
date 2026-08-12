import {
  getAlternativePresentation,
  getCorrectAlternativePresentation,
  isObjectiveAnswerCorrect,
  isTrueFalseQuestion
} from "../../core/objective-question.js";
import {
  getFinalVerdict,
  getInitialMetacognition,
  getMetacognitionLevel
} from "../question-resolution/metacognition.service.js";
import { calculateDisplayedTotalMs } from "../question-resolution/question-resolution.helpers.js";
import { isRetryEligibleQuestion } from "../retry-wrong/retry-wrong.service.js";

export const RESULT_FILTERS = Object.freeze({
  ALL: "all",
  INCORRECT: "incorrect",
  DISCURSIVE: "discursive",
  REVIEW: "review",
  UNANSWERED: "unanswered"
});

export const RESULT_FILTER_VALUES = Object.freeze(Object.values(RESULT_FILTERS));

export function calculateSessionTotalTime(state = {}) {
  return calculateDisplayedTotalMs(
    state.questoes || [],
    state.temposMs || {}
  );
}

export function calculateSessionResult(state = {}) {
  const questions = state.questoes || [];
  const answers = state.respostas || {};
  const objectives = questions.filter((question) => question.categoria === "objetiva");
  const discursives = questions.filter((question) => question.categoria === "discursiva");
  const answered = questions.filter((question) =>
    Boolean(String(answers[question.id] || "").trim())
  ).length;
  const correct = objectives.filter((question) =>
    isObjectiveAnswerCorrect(question, answers[question.id])
  ).length;
  const incorrect = objectives.filter((question) => {
    const answer = String(answers[question.id] || "").trim();
    return answer && !isObjectiveAnswerCorrect(question, answer);
  }).length;
  const evaluatedDiscursives = discursives
    .map((question) => ({
      question,
      assessment: getFinalVerdict(state, question.id)
    }))
    .filter(({ assessment }) => getMetacognitionLevel(assessment?.nivel));
  const discursivePoints = evaluatedDiscursives.reduce(
    (sum, { assessment }) => sum + Number(assessment.percentual || 0),
    0
  );
  const completeDiscursives = evaluatedDiscursives.filter(({ assessment }) =>
    getMetacognitionLevel(assessment?.nivel)?.key === "completa"
  ).length;
  const objectivePoints = correct * 100;
  const scoredQuestions = objectives.length + evaluatedDiscursives.length;
  const earnedPoints = objectivePoints + discursivePoints;
  const correctQuestions = correct + completeDiscursives;
  const percentage = scoredQuestions
    ? Math.round(earnedPoints / scoredQuestions)
    : 0;
  const objectivePercentage = objectives.length
    ? Math.round((correct / objectives.length) * 100)
    : null;
  const totalTime = calculateSessionTotalTime(state);
  const averageTime = questions.length ? Math.round(totalTime / questions.length) : 0;
  const marked = Object.values(state.revisao || {}).filter(Boolean).length;

  return {
    total: questions.length,
    respondidas: answered,
    objetivas: objectives.length,
    discursivas: discursives.length,
    discursivasAvaliadas: evaluatedDiscursives.length,
    questoesAvaliadas: scoredQuestions,
    pontosObtidos: earnedPoints,
    acertos: correct,
    discursivasCorretas: completeDiscursives,
    questoesCorretas: correctQuestions,
    erros: incorrect,
    percentual: percentage,
    percentualObjetivas: objectivePercentage,
    tempoTotal: totalTime,
    tempoMedio: averageTime,
    marcadas: marked
  };
}

export function formatResultPerformanceBasis({ total = 0, scoredQuestions = 0 } = {}) {
  if (total <= 0) return "Nenhuma questão entrou no cálculo.";
  if (scoredQuestions === total) {
    return total === 1
      ? "Calculado sobre a questão da lista."
      : `Calculado sobre as ${total} questões da lista.`;
  }
  return `Calculado sobre ${scoredQuestions} das ${total} questões da lista.`;
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeTime(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

export function getQuestionResultStatus(question, answer) {
  const response = normalizeText(answer);
  const category = question?.categoria;

  if (!response) {
    return "unanswered";
  }

  if (category === "discursiva") {
    return "discursive";
  }

  if (category === "objetiva") {
    return isObjectiveAnswerCorrect(question, response)
      ? "correct"
      : "incorrect";
  }

  return "answered";
}

export function buildQuestionReviewItems({
  questions = [],
  answers = {},
  notes = {},
  timesMs = {},
  review = {},
  discursiveAssessments = {},
  showAnswerKey = true
} = {}) {
  return questions.map((question, index) => {
    const rawAnswer = normalizeText(answers[question.id]);
    const answerPresentation = question.categoria === "objetiva"
      ? getAlternativePresentation(question, rawAnswer)
      : null;
    const correctPresentation = question.categoria === "objetiva"
      ? getCorrectAlternativePresentation(question)
      : null;
    const answer = question.categoria === "objetiva"
      ? answerPresentation?.displayLetter || ""
      : rawAnswer;
    const status = getQuestionResultStatus(question, rawAnswer);
    const markedForReview = Boolean(review[question.id]);
    const assessment = question.categoria === "discursiva"
      ? getFinalVerdict({ avaliacoesDiscursivas: discursiveAssessments }, question.id)
      : null;
    const initialMetacognition = question.categoria === "discursiva"
      ? getInitialMetacognition({ avaliacoesDiscursivas: discursiveAssessments }, question.id)
      : null;
    const initialLevel = getMetacognitionLevel(initialMetacognition?.nivel);
    const assessmentLevel = getMetacognitionLevel(assessment?.nivel);

    return {
      id: question.id,
      index,
      number: index + 1,
      category: question.categoria,
      isTrueFalse: isTrueFalseQuestion(question),
      typeLabel: question.categoria === "objetiva"
        ? (isTrueFalseQuestion(question) ? "Verdadeiro ou Falso" : "Objetiva")
        : "Discursiva",
      subject: normalizeText(question.assunto) || "Sem assunto",
      statement: normalizeText(question.enunciado) || "Enunciado não informado.",
      answer,
      note: normalizeText(notes[question.id]),
      timeMs: normalizeTime(timesMs[question.id]),
      markedForReview,
      status,
      answerId: answerPresentation?.id || "",
      answerText: answerPresentation?.text || "",
      correctAnswer: showAnswerKey && question.categoria === "objetiva"
        ? correctPresentation?.displayLetter || ""
        : "",
      correctAnswerId: showAnswerKey && question.categoria === "objetiva"
        ? correctPresentation?.id || ""
        : "",
      correctAnswerText: showAnswerKey && question.categoria === "objetiva"
        ? correctPresentation?.text || ""
        : "",
      explanation: showAnswerKey && question.categoria === "objetiva"
        ? normalizeText(question.explicacao)
        : "",
      expectedAnswer: showAnswerKey && question.categoria === "discursiva"
        ? normalizeText(question.respostaEsperada)
        : "",
      criteria: showAnswerKey && question.categoria === "discursiva"
        ? normalizeText(question.criterios)
        : "",
      initialMetacognitionLevel: initialLevel?.key || "",
      initialMetacognitionLabel: initialLevel?.label || "",
      initialMetacognitionPercentage: initialLevel?.percentage ?? null,
      initialMetacognitionObservation: normalizeText(initialMetacognition?.observacao),
      finalVerdictLevel: assessmentLevel?.key || "",
      finalVerdictLabel: assessmentLevel?.label || "",
      finalVerdictPercentage: assessmentLevel?.percentage ?? null,
      finalVerdictObservation: normalizeText(assessment?.observacao),
      // Campos transitórios para componentes antigos da tela de resultado.
      metacognitionLevel: assessmentLevel?.key || "",
      metacognitionLabel: assessmentLevel?.label || "",
      metacognitionPercentage: assessmentLevel?.percentage ?? null,
      metacognitionObservation: normalizeText(assessment?.observacao),
      retryEligible: isRetryEligibleQuestion(
        { respostas: answers, avaliacoesDiscursivas: discursiveAssessments },
        question
      ),
      answerKeyVisible: Boolean(showAnswerKey)
    };
  });
}

export function filterQuestionReviewItems(items = [], filter = RESULT_FILTERS.ALL) {
  switch (filter) {
    case RESULT_FILTERS.INCORRECT:
      return items.filter((item) => item.retryEligible || item.status === "incorrect");
    case RESULT_FILTERS.DISCURSIVE:
      return items.filter((item) => item.category === "discursiva");
    case RESULT_FILTERS.REVIEW:
      return items.filter((item) => item.markedForReview);
    case RESULT_FILTERS.UNANSWERED:
      return items.filter((item) => item.status === "unanswered");
    case RESULT_FILTERS.ALL:
    default:
      return [...items];
  }
}

export function buildSubjectResultItems({
  questions = [],
  answers = {},
  timesMs = {},
  discursiveAssessments = {}
} = {}) {
  const subjectMap = new Map();

  questions.forEach((question, questionIndex) => {
    const subject = normalizeText(question.assunto) || "Sem assunto";
    const questionTimeMs = normalizeTime(timesMs[question.id]);
    const current = subjectMap.get(subject) || {
      subject,
      total: 0,
      objectives: 0,
      correct: 0,
      answered: 0,
      discursivesEvaluated: 0,
      scoredQuestions: 0,
      earnedPoints: 0,
      timeMs: 0,
      questions: []
    };

    current.total += 1;
    current.timeMs += questionTimeMs;

    if (question.categoria === "objetiva") {
      const status = getQuestionResultStatus(question, answers[question.id]);
      const correctAnswer = status === "correct";
      const statusLabel = status === "correct"
        ? "Correta"
        : status === "incorrect"
          ? "Incorreta"
          : "Não respondida";

      current.objectives += 1;
      current.answered += Number(status !== "unanswered");
      current.scoredQuestions += 1;

      if (correctAnswer) {
        current.correct += 1;
        current.earnedPoints += 100;
      }

      current.questions.push({
        id: question.id,
        number: questionIndex + 1,
        typeLabel: isTrueFalseQuestion(question) ? "Verdadeiro ou Falso" : "Objetiva",
        statusLabel,
        tone: status === "correct" ? "success" : status === "incorrect" ? "danger" : "neutral",
        scored: true,
        scorePercentage: correctAnswer ? 100 : 0,
        timeMs: questionTimeMs
      });
    } else if (question.categoria === "discursiva") {
      current.answered += Number(Boolean(normalizeText(answers[question.id])));
      const assessment = getFinalVerdict(
        { avaliacoesDiscursivas: discursiveAssessments },
        question.id
      );
      const level = getMetacognitionLevel(assessment?.nivel);

      if (level) {
        current.discursivesEvaluated += 1;
        current.scoredQuestions += 1;
        current.earnedPoints += level.percentage;
      }

      current.questions.push({
        id: question.id,
        number: questionIndex + 1,
        typeLabel: "Discursiva",
        statusLabel: level
          ? level.label.replace(/^Resposta\s+/i, "").replace(/^./, (character) => character.toUpperCase())
          : "Pendente",
        tone: level?.key === "completa"
          ? "success"
          : level?.key === "parcial"
            ? "warning"
            : level?.key === "incorreta"
              ? "danger"
              : "neutral",
        scored: Boolean(level),
        scorePercentage: level?.percentage ?? null,
        timeMs: questionTimeMs
      });
    }

    subjectMap.set(subject, current);
  });

  return Array.from(subjectMap.values()).map((item) => ({
    ...item,
    percentage: item.scoredQuestions > 0
      ? Math.round(item.earnedPoints / item.scoredQuestions)
      : null,
    questions: item.questions.map((question) => ({
      ...question,
      contributionPercentage: question.scored && item.scoredQuestions > 0
        ? Math.round(Number(question.scorePercentage || 0) / item.scoredQuestions)
        : null
    }))
  }));
}

export function getSubjectPerformanceTone(percentage) {
  if (percentage === null || percentage === undefined) {
    return "neutral";
  }

  if (percentage >= 75) {
    return "success";
  }

  if (percentage >= 50) {
    return "warning";
  }

  return "danger";
}

export function normalizeResultFilter(filter) {
  return RESULT_FILTER_VALUES.includes(filter) ? filter : RESULT_FILTERS.ALL;
}
