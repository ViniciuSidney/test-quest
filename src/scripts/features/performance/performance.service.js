export const PERFORMANCE_STATES = Object.freeze([
  Object.freeze({
    key: "excellent-100",
    min: 100,
    max: 100,
    className: "performance-screen--excellent-100",
    title: "Perfeito!",
    subtitle: "Você acertou tudo nesta sessão!",
    buttonLabel: "Ótimo!"
  }),
  Object.freeze({
    key: "excellent-90",
    min: 90,
    max: 99,
    className: "performance-screen--excellent-90",
    title: "Excelente!",
    subtitle: "Seu desempenho foi muito forte!",
    buttonLabel: "Aí Sim!"
  }),
  Object.freeze({
    key: "very-good",
    min: 75,
    max: 89,
    className: "performance-screen--very-good",
    title: "Muito bom!",
    subtitle: "Você está avançando muito bem.",
    buttonLabel: "Que bom!"
  }),
  Object.freeze({
    key: "good-result",
    min: 60,
    max: 74,
    className: "performance-screen--good-result",
    title: "Bom resultado!",
    subtitle: "Você já construiu uma boa base.",
    buttonLabel: "Tudo bem!"
  }),
  Object.freeze({
    key: "attention-50",
    min: 50,
    max: 59,
    className: "performance-screen--attention-50",
    title: "Pode melhorar.",
    subtitle: "Você está no caminho, mas ainda precisa revisar alguns pontos.",
    buttonLabel: "Vou melhorar!"
  }),
  Object.freeze({
    key: "review-needed",
    min: 0,
    max: 49,
    className: "performance-screen--review-needed",
    title: "Hora de revisar!",
    subtitle: "Essa sessão mostrou pontos importantes para reforçar.",
    buttonLabel: "Vou me dedicar mais!"
  })
]);

export const PERFORMANCE_STATE_CLASSES = Object.freeze(
  PERFORMANCE_STATES.map((state) => state.className)
);

export function normalizePerformancePercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)));
}

export function getPerformanceState(value) {
  const percentage = normalizePerformancePercentage(value);
  const state = PERFORMANCE_STATES.find(
    (item) => percentage >= item.min && percentage <= item.max
  );

  return {
    ...state,
    percentage
  };
}

export function shouldShowPerformanceScreen(objectiveCount) {
  return Number.isFinite(Number(objectiveCount)) && Number(objectiveCount) > 0;
}

export function formatPerformanceBasis(correctCount, objectiveCount) {
  const correct = Math.max(0, Math.trunc(Number(correctCount) || 0));
  const objectives = Math.max(0, Math.trunc(Number(objectiveCount) || 0));
  const hitLabel = correct === 1 ? "acerto" : "acertos";
  const questionLabel = objectives === 1 ? "questão objetiva" : "questões objetivas";

  return `${correct} ${hitLabel} em ${objectives} ${questionLabel}`;
}
