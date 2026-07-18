import { isTrueFalseQuestion } from "../../core/objective-question.js";

export const MARKER_STATES = Object.freeze({
  NEUTRAL: "neutro",
  ANALYSIS: "analise",
  ELIMINATED: "eliminada"
});

export function normalizeMarkerState(value) {
  if (value === MARKER_STATES.ANALYSIS || value === "analysis") {
    return MARKER_STATES.ANALYSIS;
  }

  if (value === MARKER_STATES.ELIMINATED || value === "eliminated") {
    return MARKER_STATES.ELIMINATED;
  }

  return MARKER_STATES.NEUTRAL;
}

export function getNextMarkerState(value) {
  const current = normalizeMarkerState(value);

  if (current === MARKER_STATES.NEUTRAL) {
    return MARKER_STATES.ANALYSIS;
  }

  if (current === MARKER_STATES.ANALYSIS) {
    return MARKER_STATES.ELIMINATED;
  }

  return MARKER_STATES.NEUTRAL;
}

export function getMarkerInfo(value, letter) {
  const state = normalizeMarkerState(value);
  const normalizedLetter = String(letter || "").toUpperCase();

  if (state === MARKER_STATES.ANALYSIS) {
    return {
      state,
      icon: "?",
      title: `Alternativa ${normalizedLetter} em análise. Clique para marcar como eliminada.`,
      label: `Alternativa ${normalizedLetter} em análise. Marcar como eliminada.`
    };
  }

  if (state === MARKER_STATES.ELIMINATED) {
    return {
      state,
      icon: "×",
      title: `Alternativa ${normalizedLetter} eliminada. Clique para remover a marcação.`,
      label: `Alternativa ${normalizedLetter} eliminada. Remover marcação.`
    };
  }

  return {
    state,
    icon: "○",
    title: `Alternativa ${normalizedLetter} sem marcação. Clique para marcar como em análise.`,
    label: `Marcar alternativa ${normalizedLetter} como em análise.`
  };
}

export function isQuestionAnswered(answer) {
  return Boolean(String(answer ?? "").trim());
}

export function buildQuestionMapLabel({ number, current, answered, review }) {
  const states = [
    current ? "atual" : "",
    answered ? "respondida" : "pendente",
    review ? "marcada para revisão" : ""
  ].filter(Boolean);

  return `Questão ${number}, ${states.join(", ")}`;
}

export function calculateDisplayedTotalMs(questions = [], timesById = {}) {
  return questions.reduce((total, question) => {
    const rawTime = Number(timesById?.[question?.id] ?? 0);

    if (!Number.isFinite(rawTime) || rawTime <= 0) {
      return total;
    }

    // Cada tempo individual é exibido sem milissegundos. Somar os mesmos
    // segundos inteiros evita que o total visual difira da soma visível.
    return total + Math.floor(rawTime / 1000) * 1000;
  }, 0);
}

export function getQuestionTypeLabel(question) {
  if (question?.categoria === "discursiva") {
    return "Discursiva";
  }

  return isTrueFalseQuestion(question) ? "Verdadeiro ou Falso" : "Objetiva";
}

export function buildTrueFalseOptionsMarkup({ alternatives = [], selectedId = "", escapeHtml = (value) => String(value ?? "") } = {}) {
  const trueOptionId = alternatives[0]?.id || "";
  const falseOptionId = alternatives[1]?.id || "";

  return `
    <div class="resolution-vf-layout" role="group" aria-label="Selecione Verdadeiro ou Falso">
      <button
        class="resolution-vf-choice resolution-vf-choice--true ${selectedId === trueOptionId ? "is-selected" : ""}"
        type="button"
        data-vf-choice-id="${escapeHtml(trueOptionId)}"
        aria-pressed="${String(selectedId === trueOptionId)}"
      >
        <span class="resolution-vf-choice__text">${escapeHtml(alternatives[0]?.texto || "Verdadeiro")}</span>
      </button>

      <span class="resolution-vf-divider" aria-hidden="true">ou</span>

      <button
        class="resolution-vf-choice resolution-vf-choice--false ${selectedId === falseOptionId ? "is-selected" : ""}"
        type="button"
        data-vf-choice-id="${escapeHtml(falseOptionId)}"
        aria-pressed="${String(selectedId === falseOptionId)}"
      >
        <span class="resolution-vf-choice__text">${escapeHtml(alternatives[1]?.texto || "Falso")}</span>
      </button>
    </div>
  `;
}
