import {
  getAlternativePresentation,
  getCorrectAlternativePresentation,
  isObjectiveAnswerCorrect
} from "../../core/objective-question.js";

export const CORRECTION_MODES = Object.freeze({
  FINAL: "final",
  IMMEDIATE: "imediata"
});

export function normalizeCorrectionMode(value) {
  return value === CORRECTION_MODES.IMMEDIATE
    ? CORRECTION_MODES.IMMEDIATE
    : CORRECTION_MODES.FINAL;
}

export function isImmediateCorrectionEnabled(state) {
  return normalizeCorrectionMode(state?.opcoes?.modoCorrecao) === CORRECTION_MODES.IMMEDIATE;
}

export function isQuestionConfirmed(state, questionId) {
  return Boolean(questionId && state?.confirmacoes?.[questionId]);
}

export function canConfirmQuestion(state, question) {
  if (!question || isQuestionConfirmed(state, question.id)) {
    return false;
  }

  return Boolean(String(state?.respostas?.[question.id] ?? "").trim());
}

export function confirmQuestion(state, questionId) {
  if (!state || !questionId) {
    return state;
  }

  return {
    ...state,
    confirmacoes: {
      ...(state.confirmacoes || {}),
      [questionId]: true
    }
  };
}

export function getImmediateFeedback(question, rawAnswer) {
  if (!question) {
    return null;
  }

  if (question.categoria === "objetiva") {
    const selected = getAlternativePresentation(question, rawAnswer);
    const correct = getCorrectAlternativePresentation(question);
    const isCorrect = isObjectiveAnswerCorrect(question, rawAnswer);

    return {
      category: "objective",
      tone: isCorrect ? "success" : "danger",
      title: isCorrect ? "Resposta correta" : "Resposta incorreta",
      message: isCorrect
        ? "Muito bem! A resposta foi confirmada e bloqueada."
        : "A resposta foi confirmada e bloqueada. Revise o gabarito abaixo.",
      selected,
      correct,
      explanation: String(question.explicacao || "Nenhuma explicação foi informada.")
    };
  }

  return {
    category: "discursive",
    tone: "info",
    title: "Resposta registrada",
    message: "Compare sua resposta com o modelo e os critérios de correção.",
    expectedAnswer: String(question.respostaEsperada || "Nenhuma resposta esperada foi informada."),
    criteria: String(question.criterios || "Nenhum critério de correção foi informado.")
  };
}

export function buildImmediateFeedbackMarkup({
  question,
  answer,
  escapeHtml = (value) => String(value ?? "")
} = {}) {
  const feedback = getImmediateFeedback(question, answer);

  if (!feedback) {
    return "";
  }

  if (feedback.category === "objective") {
    const selectedLabel = feedback.selected
      ? `${feedback.selected.displayLetter}) ${feedback.selected.text}`
      : "Não respondida";
    const correctLabel = feedback.correct
      ? `${feedback.correct.displayLetter}) ${feedback.correct.text}`
      : "Gabarito indisponível";

    return `
      <section class="resolution-feedback resolution-feedback--${feedback.tone}" tabindex="-1" aria-live="polite">
        <header class="resolution-feedback__header">
          <span class="resolution-feedback__icon" aria-hidden="true">${feedback.tone === "success" ? "✓" : "!"}</span>
          <div>
            <p>Correção imediata</p>
            <h3>${escapeHtml(feedback.title)}</h3>
            <span>${escapeHtml(feedback.message)}</span>
          </div>
        </header>
        <div class="resolution-feedback__comparison">
          <article><strong>Sua resposta</strong><p>${escapeHtml(selectedLabel)}</p></article>
          <article><strong>Resposta correta</strong><p>${escapeHtml(correctLabel)}</p></article>
        </div>
        <article class="resolution-feedback__explanation">
          <strong>Explicação</strong>
          <p>${escapeHtml(feedback.explanation)}</p>
        </article>
      </section>
    `;
  }

  return `
    <section class="resolution-feedback resolution-feedback--info" tabindex="-1" aria-live="polite">
      <header class="resolution-feedback__header">
        <span class="resolution-feedback__icon" aria-hidden="true">✓</span>
        <div>
          <p>Correção orientada</p>
          <h3>${escapeHtml(feedback.title)}</h3>
          <span>${escapeHtml(feedback.message)}</span>
        </div>
      </header>
      <div class="resolution-feedback__discursive">
        <article><strong>Resposta esperada</strong><p>${escapeHtml(feedback.expectedAnswer)}</p></article>
        <article><strong>Critérios de correção</strong><p>${escapeHtml(feedback.criteria)}</p></article>
      </div>
    </section>
  `;
}
