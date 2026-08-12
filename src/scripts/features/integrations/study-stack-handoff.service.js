import {
  getAlternativePresentation,
  getCorrectAlternativePresentation,
  isObjectiveAnswerCorrect,
  isTrueFalseQuestion
} from "../../core/objective-question.js";
import { SESSION_STATUS } from "../../core/state.js";
import { getFinalVerdict, getInitialMetacognition, getMetacognitionLevel } from "../question-resolution/metacognition.service.js";
import { getDefaultStorage, writeJsonSafe } from "../../shared/storage.js";
import { slugify } from "../../shared/formatters.js";
import { EXPORT_MIME_TYPES } from "../exports/session-export.service.js";
import {
  clearStudyStackContext,
  validateStudyStackReturnUrl
} from "./study-stack-context.service.js";

export const STUDY_STACK_RESULT_CONTRACT_VERSION = "1.1.0";
export const STUDY_STACK_HANDOFF_KEY = "study-stack:handoff:test-quest:v1";

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeOptionalSequence(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const sequence = Number(value);

  if (!Number.isInteger(sequence) || sequence <= 0) {
    throw new TypeError("A sequência da lista recebida do Study Stack é inválida.");
  }

  return sequence;
}

function formatAlternative(presentation) {
  if (!presentation) {
    return null;
  }

  return normalizeText(presentation.text)
    ? `${presentation.displayLetter}) ${presentation.text}`
    : presentation.displayLetter || null;
}

function mapDiscursiveResult(state, question) {
  const answer = normalizeText(state?.respostas?.[question.id]);
  const verdict = getFinalVerdict(state, question.id);
  const level = getMetacognitionLevel(verdict?.nivel);

  if (!answer || !level) {
    return { result: "unanswered", scorePercentage: null };
  }

  if (level.percentage === 100) {
    return { result: "correct", scorePercentage: 100 };
  }

  if (level.percentage === 50) {
    return { result: "partial", scorePercentage: 50 };
  }

  return { result: "incorrect", scorePercentage: 0 };
}

function mapObjectiveResult(state, question) {
  const answer = normalizeText(state?.respostas?.[question.id]);

  if (!answer) {
    return { result: "unanswered", scorePercentage: null };
  }

  return isObjectiveAnswerCorrect(question, answer)
    ? { result: "correct", scorePercentage: 100 }
    : { result: "incorrect", scorePercentage: 0 };
}

function buildQuestionPayload(state, question) {
  const isObjective = question.categoria === "objetiva";
  const answer = normalizeText(state?.respostas?.[question.id]);
  const initialMetacognition = isObjective
    ? null
    : getInitialMetacognition(state, question.id);
  const finalVerdict = isObjective
    ? null
    : getFinalVerdict(state, question.id);
  const score = isObjective
    ? mapObjectiveResult(state, question)
    : mapDiscursiveResult(state, question);

  const userAnswer = isObjective
    ? formatAlternative(getAlternativePresentation(question, answer))
    : answer || null;
  const correctAnswer = isObjective
    ? formatAlternative(getCorrectAlternativePresentation(question))
    : normalizeText(question.respostaEsperada) || null;
  const finalLevel = getMetacognitionLevel(finalVerdict?.nivel);
  const initialLevel = getMetacognitionLevel(initialMetacognition?.nivel);

  return {
    id: normalizeText(question.id) || null,
    type: isObjective
      ? (isTrueFalseQuestion(question) ? "true_false" : "objective")
      : "discursive",
    difficulty: "unknown",
    statement: normalizeText(question.enunciado),
    userAnswer,
    correctAnswer,
    correction: isObjective
      ? normalizeText(question.explicacao) || null
      : normalizeText(finalVerdict?.observacao) || null,
    expectedCriteria: isObjective
      ? null
      : normalizeText(question.criterios) || null,
    metacognition: initialLevel
      ? `${initialLevel.label} (${initialLevel.percentage}%)${normalizeText(initialMetacognition?.observacao) ? ` — ${normalizeText(initialMetacognition.observacao)}` : ""}`
      : null,
    finalVerdict: finalLevel
      ? `${finalLevel.label} (${finalLevel.percentage}%)`
      : null,
    result: score.result,
    scorePercentage: score.scorePercentage
  };
}

export function createStudyStackResultPayload(state, context, {
  now = () => new Date().toISOString(),
  resultUrl = "https://viniciusidney.github.io/test-quest/"
} = {}) {
  if (!state || state.status !== SESSION_STATUS.FINISHED || !state.finalizadoEm) {
    throw new TypeError("Somente uma sessão finalizada pode ser enviada ao Study Stack.");
  }

  if (!normalizeText(state.id)) {
    throw new TypeError("A sessão finalizada não possui sessionId.");
  }

  if (!Array.isArray(state.questoes) || state.questoes.length === 0) {
    throw new TypeError("A sessão finalizada não possui questões.");
  }

  const subjectId = normalizeText(context?.subjectContext?.subjectId);

  if (!subjectId) {
    throw new TypeError("O contexto recebido do Study Stack não possui subjectId.");
  }

  const sentAt = now();
  const sequence = normalizeOptionalSequence(context?.suggestedListSequence);

  if (Number.isNaN(Date.parse(sentAt))) {
    throw new TypeError("Não foi possível definir sentAt para o resultado.");
  }

  return {
    contractVersion: STUDY_STACK_RESULT_CONTRACT_VERSION,
    sentAt: new Date(sentAt).toISOString(),
    sourceApp: "test_quest",
    sessionId: state.id,
    subjectContext: { ...context.subjectContext },
    session: {
      title: normalizeText(state.listaNome) || "Lista sem nome",
      date: new Date(state.finalizadoEm || state.iniciadoEm || sentAt).toISOString(),
      ...(sequence ? { sequence } : {})
    },
    questions: state.questoes.map((question) => buildQuestionPayload(state, question)),
    resultUrl
  };
}

export function createStudyStackJsonExport(state, context, options = {}) {
  const payload = createStudyStackResultPayload(state, context, options);

  return {
    content: JSON.stringify(payload, null, 2),
    fileName: `${slugify(state?.listaNome || "resultado")}-study-stack.json`,
    mimeType: EXPORT_MIME_TYPES.JSON
  };
}

export function writeStudyStackHandoff(
  payload,
  storage = getDefaultStorage()
) {
  const result = writeJsonSafe(STUDY_STACK_HANDOFF_KEY, payload, storage);

  if (!result.ok) {
    throw result.error || new Error("Não foi possível salvar o resultado para o Study Stack.");
  }

  return payload;
}

export function saveToStudyStackAndReturn({
  state,
  context,
  storage = getDefaultStorage(),
  locationRef = globalThis.location,
  now,
  resultUrl
} = {}) {
  const payload = createStudyStackResultPayload(state, context, { now, resultUrl });
  const returnUrl = validateStudyStackReturnUrl(context?.returnUrl);

  if (typeof locationRef?.assign !== "function") {
    throw new Error("O navegador não permite retornar ao Study Stack.");
  }

  writeStudyStackHandoff(payload, storage);
  clearStudyStackContext(storage);
  locationRef.assign(returnUrl);
  return payload;
}
