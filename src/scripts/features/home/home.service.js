import { HISTORY_KEY } from "../../core/constants.js";
import { readJson, writeJson } from "../../shared/storage.js";

const HISTORY_VERSION = 1;

export function createEmptyHistory() {
  return {
    version: HISTORY_VERSION,
    sessions: []
  };
}

export function readHistory() {
  const stored = readJson(HISTORY_KEY, createEmptyHistory());

  if (!stored || !Array.isArray(stored.sessions)) {
    return createEmptyHistory();
  }

  return {
    version: Number(stored.version) || HISTORY_VERSION,
    sessions: stored.sessions.filter(Boolean)
  };
}

export function recordCompletedSession(state, result) {
  if (!state?.questoes?.length || !state.finalizadoEm) {
    return readHistory();
  }

  const history = readHistory();
  const sessionId = state.id || createLegacySessionId(state);
  const entry = {
    id: sessionId,
    listName: state.listaNome || "Lista sem nome",
    totalQuestions: Number(result.total) || 0,
    answered: Number(result.respondidas) || 0,
    objectives: Number(result.objetivas) || 0,
    correct: Number(result.acertos) || 0,
    performance: result.objetivas ? Number(result.percentual) || 0 : null,
    totalTimeMs: Number(result.tempoTotal) || 0,
    completedAt: state.finalizadoEm
  };

  const existingIndex = history.sessions.findIndex((session) => session.id === sessionId);

  if (existingIndex >= 0) {
    history.sessions[existingIndex] = entry;
  } else {
    history.sessions.push(entry);
  }

  writeJson(HISTORY_KEY, history);
  return history;
}


export function removeCompletedSession(sessionId) {
  if (!sessionId) {
    return readHistory();
  }

  const history = readHistory();
  history.sessions = history.sessions.filter((session) => session.id !== sessionId);
  writeJson(HISTORY_KEY, history);
  return history;
}

export function calculateHistoryMetrics(history = readHistory()) {
  const sessions = Array.isArray(history.sessions) ? history.sessions : [];
  const answered = sessions.reduce((sum, session) => sum + Number(session.answered || 0), 0);
  const objectives = sessions.reduce((sum, session) => sum + Number(session.objectives || 0), 0);
  const correct = sessions.reduce((sum, session) => sum + Number(session.correct || 0), 0);
  const totalTimeMs = sessions.reduce((sum, session) => sum + Number(session.totalTimeMs || 0), 0);

  return {
    answered,
    averageAccuracy: objectives ? Math.round((correct / objectives) * 100) : 0,
    totalTimeMs,
    completedSessions: sessions.length
  };
}

function createLegacySessionId(state) {
  const source = `${state.importadoEm || "sem-data"}-${state.listaNome || "lista"}`;
  return `legacy-${source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
