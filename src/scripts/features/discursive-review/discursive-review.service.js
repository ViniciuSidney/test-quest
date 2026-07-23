import { SESSION_STATUS } from "../../core/state.js";
import { isQuestionConfirmed } from "../question-resolution/immediate-feedback.service.js";
import {
  getFinalVerdict,
  getMetacognitionLevel,
  hasFinalVerdict
} from "../question-resolution/metacognition.service.js";

export function getDiscursiveQuestionsForReview(state = {}) {
  return (state.questoes || []).filter((question) => {
    if (question?.categoria !== "discursiva" || !question.id) {
      return false;
    }

    const answered = Boolean(String(state?.respostas?.[question.id] ?? "").trim());
    return answered && isQuestionConfirmed(state, question.id);
  });
}

export function getDiscursiveReviewProgress(state = {}) {
  const questions = getDiscursiveQuestionsForReview(state);
  const evaluated = questions.filter((question) => hasFinalVerdict(state, question.id));
  const counts = { completa: 0, parcial: 0, incorreta: 0 };

  evaluated.forEach((question) => {
    const level = getMetacognitionLevel(getFinalVerdict(state, question.id)?.nivel);
    if (level && Object.prototype.hasOwnProperty.call(counts, level.key)) {
      counts[level.key] += 1;
    }
  });

  return {
    questions,
    total: questions.length,
    evaluated: evaluated.length,
    pending: Math.max(0, questions.length - evaluated.length),
    percentage: questions.length ? Math.round((evaluated.length / questions.length) * 100) : 100,
    counts
  };
}

export function hasPendingFinalVerdicts(state = {}) {
  return getDiscursiveReviewProgress(state).pending > 0;
}

export function shouldOpenDiscursiveReview(state = {}) {
  return state?.opcoes?.modoCorrecao !== "imediata" && hasPendingFinalVerdicts(state);
}

export function startDiscursiveReview(state = {}, {
  now = () => new Date().toISOString()
} = {}) {
  const progress = getDiscursiveReviewProgress(state);
  const firstPending = progress.questions.find((question) => !hasFinalVerdict(state, question.id));
  const currentId = firstPending?.id || progress.questions[0]?.id || null;

  return {
    ...state,
    status: SESSION_STATUS.REVIEWING,
    correcaoDiscursiva: {
      ...(state.correcaoDiscursiva || {}),
      atualId: currentId,
      iniciadaEm: state?.correcaoDiscursiva?.iniciadaEm || now(),
      concluidaEm: null
    }
  };
}

export function setCurrentDiscursiveReviewQuestion(state = {}, questionId) {
  const valid = getDiscursiveQuestionsForReview(state).some((question) => question.id === questionId);

  if (!valid) {
    return state;
  }

  return {
    ...state,
    correcaoDiscursiva: {
      ...(state.correcaoDiscursiva || {}),
      atualId: questionId
    }
  };
}

export function markDiscursiveReviewCompleted(state = {}, {
  now = () => new Date().toISOString()
} = {}) {
  return {
    ...state,
    correcaoDiscursiva: {
      ...(state.correcaoDiscursiva || {}),
      concluidaEm: now()
    }
  };
}

export function getCurrentDiscursiveReviewQuestion(state = {}) {
  const questions = getDiscursiveQuestionsForReview(state);
  const currentId = state?.correcaoDiscursiva?.atualId;
  return questions.find((question) => question.id === currentId) || questions[0] || null;
}
