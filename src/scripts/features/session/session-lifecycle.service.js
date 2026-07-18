import { createInitialState, SESSION_STATUS } from "../../core/state.js";

export function createSessionId({
  cryptoRef = globalThis.crypto,
  now = Date.now,
  random = Math.random
} = {}) {
  if (cryptoRef && typeof cryptoRef.randomUUID === "function") {
    return cryptoRef.randomUUID();
  }

  return `sessao-${now()}-${random().toString(16).slice(2)}`;
}

export function shuffleItems(items = [], random = Math.random) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy;
}

export function createActiveSession({
  questions = [],
  listName = "",
  showAnswerKey = true,
  shuffleQuestions = false,
  now = () => new Date().toISOString(),
  idFactory = createSessionId,
  random = Math.random
} = {}) {
  const importedAt = now();
  const clonedQuestions = cloneQuestions(questions);
  const orderedQuestions = shuffleQuestions
    ? shuffleItems(clonedQuestions, random)
    : clonedQuestions;
  const state = createInitialState();

  return {
    ...state,
    id: idFactory(),
    status: SESSION_STATUS.ACTIVE,
    listaNome: String(listName || "").trim() || "Lista sem nome",
    questoes: orderedQuestions,
    opcoes: {
      ...state.opcoes,
      mostrarGabaritoFinal: Boolean(showAnswerKey)
    },
    importadoEm: importedAt,
    iniciadoEm: importedAt,
    temporizadorPausado: false
  };
}

export function restoreActiveSession(savedState) {
  if (!savedState || !Array.isArray(savedState.questoes) || savedState.questoes.length === 0) {
    return null;
  }

  const base = createInitialState();

  return ensureSessionIdentity({
    ...base,
    ...savedState,
    status: SESSION_STATUS.ACTIVE,
    respostas: savedState.respostas || {},
    anotacoes: savedState.anotacoes || {},
    temposMs: savedState.temposMs || {},
    revisao: savedState.revisao || {},
    marcacoesAlternativas: savedState.marcacoesAlternativas || {},
    opcoes: {
      ...base.opcoes,
      ...(savedState.opcoes || {})
    }
  });
}

export function finishSession(state, {
  now = () => new Date().toISOString(),
  idFactory = createSessionId
} = {}) {
  return ensureSessionIdentity({
    ...state,
    status: SESSION_STATUS.FINISHED,
    finalizadoEm: now()
  }, idFactory);
}

export function ensureSessionIdentity(state, idFactory = createSessionId) {
  if (!state || typeof state !== "object") {
    return state;
  }

  if (state.id) {
    return state;
  }

  return {
    ...state,
    id: idFactory()
  };
}

export function isActiveSession(state) {
  return Boolean(
    state?.questoes?.length &&
    !state.finalizadoEm &&
    state.status !== SESSION_STATUS.FINISHED
  );
}

function cloneQuestions(questions) {
  return questions.map((question) => ({
    ...question,
    alternativas: question?.alternativas ? { ...question.alternativas } : null
  }));
}
