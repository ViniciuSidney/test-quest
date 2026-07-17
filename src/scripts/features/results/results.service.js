export const RESULT_FILTERS = Object.freeze({
  ALL: "all",
  INCORRECT: "incorrect",
  DISCURSIVE: "discursive",
  REVIEW: "review",
  UNANSWERED: "unanswered"
});

export const RESULT_FILTER_VALUES = Object.freeze(Object.values(RESULT_FILTERS));

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeAnswer(value) {
  return normalizeText(value).toUpperCase();
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
    return normalizeAnswer(response) === normalizeAnswer(question?.correta)
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
  showAnswerKey = true
} = {}) {
  return questions.map((question, index) => {
    const answer = normalizeText(answers[question.id]);
    const status = getQuestionResultStatus(question, answer);
    const markedForReview = Boolean(review[question.id]);

    return {
      id: question.id,
      index,
      number: index + 1,
      category: question.categoria,
      typeLabel: question.categoria === "objetiva" ? "Objetiva" : "Discursiva",
      subject: normalizeText(question.assunto) || "Sem assunto",
      statement: normalizeText(question.enunciado) || "Enunciado não informado.",
      answer,
      note: normalizeText(notes[question.id]),
      timeMs: normalizeTime(timesMs[question.id]),
      markedForReview,
      status,
      correctAnswer: showAnswerKey && question.categoria === "objetiva"
        ? normalizeText(question.correta)
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
      answerKeyVisible: Boolean(showAnswerKey)
    };
  });
}

export function filterQuestionReviewItems(items = [], filter = RESULT_FILTERS.ALL) {
  switch (filter) {
    case RESULT_FILTERS.INCORRECT:
      return items.filter((item) => item.status === "incorrect");
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
  timesMs = {}
} = {}) {
  const subjectMap = new Map();

  questions.forEach((question) => {
    const subject = normalizeText(question.assunto) || "Sem assunto";
    const current = subjectMap.get(subject) || {
      subject,
      total: 0,
      objectives: 0,
      correct: 0,
      timeMs: 0
    };

    current.total += 1;
    current.timeMs += normalizeTime(timesMs[question.id]);

    if (question.categoria === "objetiva") {
      current.objectives += 1;

      if (getQuestionResultStatus(question, answers[question.id]) === "correct") {
        current.correct += 1;
      }
    }

    subjectMap.set(subject, current);
  });

  return Array.from(subjectMap.values()).map((item) => ({
    ...item,
    percentage: item.objectives > 0
      ? Math.round((item.correct / item.objectives) * 100)
      : null
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
