import { isObjectiveAnswerCorrect } from "../../core/objective-question.js";
import { getFinalVerdict, getMetacognitionLevel } from "../question-resolution/metacognition.service.js";
import { createActiveSession } from "../session/session-lifecycle.service.js";

export const RETRY_WRONG_LIST_SUFFIX = " — Revisão de erros";

export function isRetryEligibleQuestion(state = {}, question = null) {
  if (!question?.id) {
    return false;
  }

  if (question.categoria === "objetiva") {
    const answer = String(state?.respostas?.[question.id] ?? "").trim();
    return Boolean(answer) && !isObjectiveAnswerCorrect(question, answer);
  }

  if (question.categoria === "discursiva") {
    const assessment = getFinalVerdict(state, question.id);
    return getMetacognitionLevel(assessment?.nivel)?.key === "incorreta";
  }

  return false;
}

export function getRetryEligibleQuestions(state = {}) {
  return (state?.questoes || []).filter((question) =>
    isRetryEligibleQuestion(state, question)
  );
}

export function getRetryWrongSummary(state = {}) {
  const questions = getRetryEligibleQuestions(state);

  return {
    total: questions.length,
    objetivas: questions.filter((question) => question.categoria === "objetiva").length,
    discursivas: questions.filter((question) => question.categoria === "discursiva").length
  };
}

export function buildRetryWrongListName(listName = "") {
  const base = String(listName || "").trim() || "Lista sem nome";

  if (base.endsWith(RETRY_WRONG_LIST_SUFFIX)) {
    return base;
  }

  const maxLength = 80;
  const availableLength = Math.max(1, maxLength - RETRY_WRONG_LIST_SUFFIX.length);
  return `${base.slice(0, availableLength).trimEnd()}${RETRY_WRONG_LIST_SUFFIX}`;
}

export function createRetryWrongSession(sourceState = {}, {
  now,
  idFactory,
  random
} = {}) {
  const questions = getRetryEligibleQuestions(sourceState);

  if (questions.length === 0) {
    throw new RangeError("A sessão não possui questões erradas para refazer.");
  }

  return createActiveSession({
    questions,
    listName: buildRetryWrongListName(sourceState.listaNome),
    showAnswerKey: sourceState?.opcoes?.mostrarGabaritoFinal !== false,
    shuffleQuestions: Boolean(sourceState?.opcoes?.embaralharQuestoes),
    shuffleAlternatives: Boolean(sourceState?.opcoes?.embaralharAlternativas),
    correctionMode: sourceState?.opcoes?.modoCorrecao || "final",
    ...(now ? { now } : {}),
    ...(idFactory ? { idFactory } : {}),
    ...(random ? { random } : {})
  });
}
