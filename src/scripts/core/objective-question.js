export const OBJECTIVE_ALTERNATIVE_KEYS = Object.freeze(["A", "B", "C", "D", "E"]);

export function normalizeObjectiveAlternatives(rawAlternatives, questionId, {
  issues = [],
  questionNumber = null
} = {}) {
  const sourceItems = toAlternativeSourceItems(rawAlternatives);

  if (!sourceItems || sourceItems.length !== OBJECTIVE_ALTERNATIVE_KEYS.length) {
    return null;
  }

  const usedIds = new Set();
  const alternatives = sourceItems.map((item, index) => {
    const originalKey = normalizeOriginalKey(
      item?.chaveOriginal ?? item?.letraOriginal ?? item?.key,
      index
    );
    const text = normalizeText(item?.texto ?? item?.text ?? item?.value);

    if (!text) {
      return null;
    }

    let id = normalizeText(item?.id);

    if (!id || usedIds.has(id)) {
      id = createAlternativeId(questionId, originalKey, index);

      if (questionNumber !== null) {
        issues.push(
          `A alternativa ${originalKey} da questão ${questionNumber} recebeu um identificador estável.`
        );
      }
    }

    usedIds.add(id);

    return {
      id,
      chaveOriginal: originalKey,
      texto: text,
      ordemOriginal: normalizeOrder(item?.ordemOriginal, index)
    };
  });

  if (alternatives.some((alternative) => !alternative)) {
    return null;
  }

  return alternatives;
}

export function createAlternativeId(questionId, originalKey, index = 0) {
  const safeQuestion = normalizeText(questionId) || "question";
  const safeKey = normalizeOriginalKey(originalKey, index).toLowerCase();
  return `alt-${stableHash(`${safeQuestion}|${safeKey}|${index}`)}-${safeKey}`;
}

export function getObjectiveAlternatives(question) {
  if (!question || question.categoria !== "objetiva") {
    return [];
  }

  if (Array.isArray(question.alternativas)) {
    return question.alternativas;
  }

  return normalizeObjectiveAlternatives(question.alternativas, question.id) || [];
}

export function getCorrectAlternativeId(question) {
  const alternatives = getObjectiveAlternatives(question);

  if (!alternatives.length) {
    return "";
  }

  const explicitId = normalizeText(question?.respostaCorretaId);

  if (explicitId && alternatives.some((alternative) => alternative.id === explicitId)) {
    return explicitId;
  }

  return resolveObjectiveAnswerId(question, question?.correta);
}

export function resolveObjectiveAnswerId(question, rawAnswer) {
  const alternatives = getObjectiveAlternatives(question);
  const reference = normalizeAnswerReference(rawAnswer);

  if (!reference || !alternatives.length) {
    return "";
  }

  const direct = alternatives.find((alternative) => alternative.id === reference);

  if (direct) {
    return direct.id;
  }

  const normalizedKey = reference.toUpperCase();
  const byOriginalKey = alternatives.find(
    (alternative) => alternative.chaveOriginal === normalizedKey
  );

  if (byOriginalKey) {
    return byOriginalKey.id;
  }

  return "";
}

export function getAlternativePresentation(question, rawAnswer) {
  const alternatives = getObjectiveAlternatives(question);
  const alternativeId = resolveObjectiveAnswerId(question, rawAnswer);
  const index = alternatives.findIndex((alternative) => alternative.id === alternativeId);

  if (index < 0) {
    return null;
  }

  const alternative = alternatives[index];

  return {
    id: alternative.id,
    displayLetter: OBJECTIVE_ALTERNATIVE_KEYS[index] || String(index + 1),
    originalKey: alternative.chaveOriginal,
    text: alternative.texto,
    index
  };
}

export function getCorrectAlternativePresentation(question) {
  return getAlternativePresentation(question, getCorrectAlternativeId(question));
}

export function isObjectiveAnswerCorrect(question, rawAnswer) {
  const answerId = resolveObjectiveAnswerId(question, rawAnswer);
  const correctId = getCorrectAlternativeId(question);
  return Boolean(answerId && correctId && answerId === correctId);
}

export function getAlternativeDisplayLetter(question, rawAnswer) {
  return getAlternativePresentation(question, rawAnswer)?.displayLetter || "";
}

export function getAlternativeText(question, rawAnswer) {
  return getAlternativePresentation(question, rawAnswer)?.text || "";
}

function toAlternativeSourceItems(rawAlternatives) {
  if (Array.isArray(rawAlternatives)) {
    return rawAlternatives;
  }

  if (!isPlainObject(rawAlternatives)) {
    return null;
  }

  return OBJECTIVE_ALTERNATIVE_KEYS.map((key, index) => ({
    id: null,
    chaveOriginal: key,
    texto: rawAlternatives[key] ?? rawAlternatives[key.toLowerCase()],
    ordemOriginal: index
  }));
}

function normalizeAnswerReference(value) {
  if (isPlainObject(value)) {
    return normalizeText(
      value.alternativeId ?? value.alternativaId ?? value.id ?? value.key ?? value.letra
    );
  }

  return normalizeText(value);
}

function normalizeOriginalKey(value, fallbackIndex) {
  const normalized = normalizeText(value).toUpperCase();
  return OBJECTIVE_ALTERNATIVE_KEYS.includes(normalized)
    ? normalized
    : OBJECTIVE_ALTERNATIVE_KEYS[fallbackIndex] || String(fallbackIndex + 1);
}

function normalizeOrder(value, fallback) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function stableHash(value) {
  let hash = 2166136261;

  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
