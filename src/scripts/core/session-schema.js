import { SESSION_SCHEMA_VERSION } from "./constants.js";
import { createInitialState, SESSION_STATUS } from "./state.js";

const VALID_CATEGORIES = new Set(["objetiva", "discursiva"]);
const VALID_OBJECTIVE_ANSWERS = new Set(["A", "B", "C", "D", "E"]);
const VALID_MARKER_STATES = new Set(["neutro", "analise", "eliminada"]);

export class SessionValidationError extends Error {
  constructor(message, issues = []) {
    super(message);
    this.name = "SessionValidationError";
    this.issues = issues.length ? issues : [message];
  }
}

export function normalizeSessionState(rawState) {
  if (!isPlainObject(rawState)) {
    throw new SessionValidationError("Os dados da sessão não possuem um formato válido.");
  }

  if (!Array.isArray(rawState.questoes) || rawState.questoes.length === 0) {
    throw new SessionValidationError(
      "A sessão salva não possui questões válidas.",
      ["O campo questoes deve ser uma lista não vazia."]
    );
  }

  const issues = [];
  const usedIds = new Set();
  const questions = rawState.questoes.map((question, index) =>
    normalizeQuestion(question, index, usedIds, issues)
  );
  const questionIds = new Set(questions.map((question) => question.id));
  const base = createInitialState();
  const finishedAt = normalizeNullableDate(rawState.finalizadoEm);
  const status = normalizeStatus(rawState.status, finishedAt);
  const currentIndex = clampInteger(rawState.atual, 0, Math.max(questions.length - 1, 0));
  const importedAt = normalizeNullableDate(rawState.importadoEm);
  const startedAt = normalizeNullableDate(rawState.iniciadoEm) || importedAt;

  const state = {
    ...base,
    schemaVersion: SESSION_SCHEMA_VERSION,
    versao: SESSION_SCHEMA_VERSION,
    id: normalizeText(rawState.id) || createLegacySessionId(rawState, importedAt),
    status,
    listaNome: normalizeText(rawState.listaNome) || "Lista sem nome",
    questoes: questions,
    atual: currentIndex,
    respostas: normalizeAnswersMap(rawState.respostas, questions),
    anotacoes: normalizeStringMap(rawState.anotacoes, questionIds),
    temposMs: normalizeTimeMap(rawState.temposMs, questionIds),
    revisao: normalizeBooleanMap(rawState.revisao, questionIds),
    marcacoesAlternativas: normalizeMarkersMap(
      rawState.marcacoesAlternativas,
      questions
    ),
    temporizadorPausado: Boolean(rawState.temporizadorPausado),
    opcoes: {
      ...base.opcoes,
      ...(isPlainObject(rawState.opcoes) ? rawState.opcoes : {}),
      mostrarGabaritoFinal: rawState?.opcoes?.mostrarGabaritoFinal !== false
    },
    importadoEm: importedAt,
    iniciadoEm: startedAt,
    finalizadoEm: finishedAt
  };

  return {
    state,
    issues,
    migrated: Number(rawState.schemaVersion || rawState.versao || 0) !== SESSION_SCHEMA_VERSION
  };
}

export function validateSessionState(rawState) {
  try {
    const result = normalizeSessionState(rawState);
    return { valid: true, ...result };
  } catch (error) {
    return {
      valid: false,
      state: null,
      migrated: false,
      issues: error instanceof SessionValidationError
        ? error.issues
        : [error instanceof Error ? error.message : String(error)]
    };
  }
}

function normalizeQuestion(rawQuestion, index, usedIds, issues) {
  if (!isPlainObject(rawQuestion)) {
    throw new SessionValidationError(
      `A questão ${index + 1} não possui um formato válido.`
    );
  }

  const category = normalizeText(rawQuestion.categoria).toLowerCase();

  if (!VALID_CATEGORIES.has(category)) {
    throw new SessionValidationError(
      `A questão ${index + 1} possui uma categoria incompatível.`
    );
  }

  let id = normalizeText(rawQuestion.id);

  if (!id || usedIds.has(id)) {
    id = createQuestionId(index, usedIds);
    issues.push(`A questão ${index + 1} recebeu um novo identificador interno.`);
  }

  usedIds.add(id);

  const common = {
    id,
    categoria: category,
    assunto: normalizeText(rawQuestion.assunto) || "Sem assunto",
    tipo: normalizeText(rawQuestion.tipo) || category,
    enunciado: normalizeText(rawQuestion.enunciado),
    ordemOriginal: normalizeOptionalInteger(rawQuestion.ordemOriginal, index)
  };

  if (!common.enunciado) {
    throw new SessionValidationError(`A questão ${index + 1} não possui enunciado.`);
  }

  if (category === "objetiva") {
    const alternativas = normalizeAlternatives(rawQuestion.alternativas);
    const correct = normalizeText(rawQuestion.correta).toUpperCase();

    if (!alternativas || !VALID_OBJECTIVE_ANSWERS.has(correct)) {
      throw new SessionValidationError(
        `A questão objetiva ${index + 1} possui alternativas ou gabarito inválidos.`
      );
    }

    return {
      ...common,
      alternativas,
      correta: correct,
      explicacao: normalizeText(rawQuestion.explicacao),
      respostaEsperada: "",
      criterios: ""
    };
  }

  return {
    ...common,
    alternativas: null,
    correta: null,
    explicacao: "",
    respostaEsperada: normalizeText(rawQuestion.respostaEsperada),
    criterios: normalizeText(rawQuestion.criterios)
  };
}

function normalizeAlternatives(rawAlternatives) {
  if (!isPlainObject(rawAlternatives)) {
    return null;
  }

  const alternatives = {};

  for (const letter of VALID_OBJECTIVE_ANSWERS) {
    const text = normalizeText(rawAlternatives[letter] ?? rawAlternatives[letter.toLowerCase()]);

    if (!text) {
      return null;
    }

    alternatives[letter] = text;
  }

  return alternatives;
}

function normalizeAnswersMap(rawMap, questions) {
  if (!isPlainObject(rawMap)) {
    return {};
  }

  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const result = {};

  Object.entries(rawMap).forEach(([id, value]) => {
    const question = questionMap.get(id);

    if (!question) {
      return;
    }

    if (question.categoria === "objetiva") {
      const answer = normalizeText(value).toUpperCase();

      if (VALID_OBJECTIVE_ANSWERS.has(answer)) {
        result[id] = answer;
      }

      return;
    }

    result[id] = String(value ?? "");
  });

  return result;
}

function normalizeStringMap(rawMap, allowedIds) {
  if (!isPlainObject(rawMap)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawMap)
      .filter(([id]) => allowedIds.has(id))
      .map(([id, value]) => [id, String(value ?? "")])
  );
}

function normalizeTimeMap(rawMap, allowedIds) {
  if (!isPlainObject(rawMap)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawMap)
      .filter(([id]) => allowedIds.has(id))
      .map(([id, value]) => {
        const numeric = Number(value);
        return [id, Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 0];
      })
  );
}

function normalizeBooleanMap(rawMap, allowedIds) {
  if (!isPlainObject(rawMap)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawMap)
      .filter(([id, value]) => allowedIds.has(id) && Boolean(value))
      .map(([id]) => [id, true])
  );
}

function normalizeMarkersMap(rawMap, questions) {
  if (!isPlainObject(rawMap)) {
    return {};
  }

  const objectiveIds = new Set(
    questions
      .filter((question) => question.categoria === "objetiva")
      .map((question) => question.id)
  );
  const result = {};

  Object.entries(rawMap).forEach(([questionId, markers]) => {
    if (!objectiveIds.has(questionId) || !isPlainObject(markers)) {
      return;
    }

    const normalized = {};

    for (const letter of VALID_OBJECTIVE_ANSWERS) {
      const state = normalizeText(markers[letter] ?? markers[letter.toLowerCase()]);

      if (VALID_MARKER_STATES.has(state) && state !== "neutro") {
        normalized[letter] = state;
      }
    }

    if (Object.keys(normalized).length) {
      result[questionId] = normalized;
    }
  });

  return result;
}

function normalizeStatus(rawStatus, finishedAt) {
  if (finishedAt || rawStatus === SESSION_STATUS.FINISHED) {
    return SESSION_STATUS.FINISHED;
  }

  if (rawStatus === SESSION_STATUS.PREPARING) {
    return SESSION_STATUS.PREPARING;
  }

  return SESSION_STATUS.ACTIVE;
}

function normalizeNullableDate(value) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function createQuestionId(index, usedIds) {
  let attempt = `legacy-q-${index + 1}`;
  let suffix = 1;

  while (usedIds.has(attempt)) {
    suffix += 1;
    attempt = `legacy-q-${index + 1}-${suffix}`;
  }

  return attempt;
}

function createLegacySessionId(rawState, importedAt) {
  const source = `${importedAt || "sem-data"}-${normalizeText(rawState.listaNome) || "lista"}`;
  const slug = source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `legacy-${slug || "sessao"}`;
}

function clampInteger(value, min, max) {
  const numeric = Number.parseInt(value, 10);
  const safe = Number.isFinite(numeric) ? numeric : min;
  return Math.min(Math.max(safe, min), max);
}

function normalizeOptionalInteger(value, fallback) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
