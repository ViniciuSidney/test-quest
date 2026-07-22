import { HISTORY_KEY, HISTORY_SCHEMA_VERSION } from "../../core/constants.js";
import { getDefaultStorage, readJson, writeJsonSafe } from "../../shared/storage.js";

export function createEmptyHistory() {
  return {
    schemaVersion: HISTORY_SCHEMA_VERSION,
    version: HISTORY_SCHEMA_VERSION,
    sessions: []
  };
}

export function readHistory(storage = getDefaultStorage()) {
  const stored = readJson(HISTORY_KEY, createEmptyHistory(), storage);
  const normalized = normalizeHistory(stored);

  if (JSON.stringify(stored) !== JSON.stringify(normalized)) {
    writeJsonSafe(HISTORY_KEY, normalized, storage);
  }

  return normalized;
}

export function recordCompletedSession(state, result, storage = getDefaultStorage()) {
  return recordCompletedSessionSafe(state, result, storage).history;
}

export function recordCompletedSessionSafe(state, result, storage = getDefaultStorage()) {
  if (!state?.questoes?.length || !state.finalizadoEm) {
    return {
      ok: true,
      history: readHistory(storage),
      error: null,
      errorCode: null
    };
  }

  const history = readHistory(storage);
  const sessionId = state.id || createLegacySessionId(state);
  const entry = normalizeHistoryEntry({
    id: sessionId,
    listName: state.listaNome || "Lista sem nome",
    totalQuestions: Number(result.total) || 0,
    answered: Number(result.respondidas) || 0,
    objectives: Number(result.objetivas) || 0,
    correct: Number(result.acertos) || 0,
    discursivesEvaluated: Number(result.discursivasAvaliadas) || 0,
    scoredQuestions: Number(result.questoesAvaliadas) || 0,
    earnedPoints: Number(result.pontosObtidos) || 0,
    performance: result.questoesAvaliadas ? Number(result.percentual) || 0 : null,
    totalTimeMs: Number(result.tempoTotal) || 0,
    completedAt: state.finalizadoEm
  });

  if (!entry) {
    return {
      ok: true,
      history,
      error: null,
      errorCode: null
    };
  }

  const existingIndex = history.sessions.findIndex((session) => session.id === sessionId);

  if (existingIndex >= 0) {
    history.sessions[existingIndex] = entry;
  } else {
    history.sessions.push(entry);
  }

  history.sessions = sortHistoryEntries(history.sessions);
  const writeResult = writeJsonSafe(HISTORY_KEY, history, storage);

  return {
    ok: writeResult.ok,
    history,
    error: writeResult.error,
    errorCode: writeResult.errorCode
  };
}

export function removeCompletedSession(sessionId, storage = getDefaultStorage()) {
  if (!sessionId) {
    return readHistory(storage);
  }

  const history = readHistory(storage);
  history.sessions = history.sessions.filter((session) => session.id !== sessionId);
  writeJsonSafe(HISTORY_KEY, history, storage);
  return history;
}

export function calculateHistoryMetrics(history = readHistory()) {
  const sessions = Array.isArray(history.sessions) ? history.sessions : [];
  const answered = sessions.reduce((sum, session) => sum + Number(session.answered || 0), 0);
  const scoredQuestions = sessions.reduce(
    (sum, session) => sum + Number(session.scoredQuestions || 0),
    0
  );
  const earnedPoints = sessions.reduce(
    (sum, session) => sum + Number(session.earnedPoints || 0),
    0
  );
  const totalTimeMs = sessions.reduce((sum, session) => sum + Number(session.totalTimeMs || 0), 0);

  return {
    answered,
    averageAccuracy: scoredQuestions ? Math.round(earnedPoints / scoredQuestions) : 0,
    totalTimeMs,
    completedSessions: sessions.length
  };
}

export function normalizeHistory(rawHistory) {
  const sessions = Array.isArray(rawHistory?.sessions) ? rawHistory.sessions : [];
  const deduplicated = new Map();

  sessions.forEach((session) => {
    const entry = normalizeHistoryEntry(session);

    if (!entry) {
      return;
    }

    const existing = deduplicated.get(entry.id);

    if (!existing || compareDates(entry.completedAt, existing.completedAt) >= 0) {
      deduplicated.set(entry.id, entry);
    }
  });

  return {
    schemaVersion: HISTORY_SCHEMA_VERSION,
    version: HISTORY_SCHEMA_VERSION,
    sessions: sortHistoryEntries(Array.from(deduplicated.values()))
  };
}

function normalizeHistoryEntry(session) {
  if (!session || typeof session !== "object") {
    return null;
  }

  const id = String(session.id || "").trim();
  const completedAt = normalizeDate(session.completedAt ?? session.finalizadoEm);

  if (!id || !completedAt) {
    return null;
  }

  const objectives = toNonNegativeInteger(session.objectives ?? session.totalObjetivas);
  const correct = Math.min(
    toNonNegativeInteger(session.correct ?? session.corretas),
    objectives
  );
  const discursivesEvaluated = toNonNegativeInteger(
    session.discursivesEvaluated ?? session.discursivasAvaliadas
  );
  const fallbackScoredQuestions = objectives + discursivesEvaluated;
  const scoredQuestions = toNonNegativeInteger(
    session.scoredQuestions ?? session.questoesAvaliadas ?? fallbackScoredQuestions
  );
  const fallbackEarnedPoints = (correct * 100) + (
    discursivesEvaluated > 0
      ? Math.round((Number(session.performance ?? session.desempenho) || 0) * discursivesEvaluated)
      : 0
  );
  const earnedPoints = Math.min(
    scoredQuestions * 100,
    toNonNegativeInteger(session.earnedPoints ?? session.pontosObtidos ?? fallbackEarnedPoints)
  );
  const performance = scoredQuestions > 0
    ? clampPercentage(
      session.performance ?? session.desempenho ?? Math.round(earnedPoints / scoredQuestions)
    )
    : null;

  return {
    id,
    listName: String(session.listName ?? session.listaNome ?? "Lista sem nome").trim() || "Lista sem nome",
    totalQuestions: toNonNegativeInteger(session.totalQuestions ?? session.totalQuestoes),
    answered: toNonNegativeInteger(session.answered ?? session.respondidas),
    objectives,
    correct,
    discursivesEvaluated,
    scoredQuestions,
    earnedPoints,
    performance,
    totalTimeMs: toNonNegativeInteger(session.totalTimeMs ?? session.tempoTotalMs),
    completedAt
  };
}

function sortHistoryEntries(entries) {
  return [...entries].sort((a, b) => compareDates(a.completedAt, b.completedAt));
}

function compareDates(a, b) {
  return Date.parse(a || 0) - Date.parse(b || 0);
}

function normalizeDate(value) {
  const timestamp = Date.parse(String(value || ""));
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function toNonNegativeInteger(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 0;
}

function clampPercentage(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(100, Math.max(0, Math.round(numeric))) : 0;
}

function createLegacySessionId(state) {
  const source = `${state.importadoEm || "sem-data"}-${state.listaNome || "lista"}`;
  return `legacy-${source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
