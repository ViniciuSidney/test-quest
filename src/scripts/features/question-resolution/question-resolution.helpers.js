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
