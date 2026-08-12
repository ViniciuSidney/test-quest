import {
  getDefaultStorage,
  readJsonSafe,
  removeStoredValueSafe,
  writeJsonSafe
} from "../../shared/storage.js";

export const STUDY_STACK_CONTEXT_KEY = "testQuest.integration.studyStackContext.v1";
export const STUDY_STACK_CONTEXT_CONTRACT_VERSION = "1.1.0";
export const STUDY_STACK_CONTEXT_CONTRACT_VERSIONS = Object.freeze([
  "1.0.0",
  STUDY_STACK_CONTEXT_CONTRACT_VERSION
]);
export const STUDY_STACK_SOURCE_APP = "study_stack";
export const STUDY_STACK_IMPORT_ENTRY_POINT = "import";

const CONTEXT_FIELDS = Object.freeze([
  "matterId",
  "matterName",
  "themeId",
  "themeName",
  "subjectId",
  "subjectName"
]);

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeOptionalSequence(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const sequence = Number(normalized);

  if (!Number.isInteger(sequence) || sequence <= 0) {
    throw new TypeError("suggestedListSequence deve ser um número inteiro positivo.");
  }

  return sequence;
}

function normalizeDate(value, fieldName) {
  const normalized = normalizeText(value);

  if (!normalized || Number.isNaN(Date.parse(normalized))) {
    throw new TypeError(`${fieldName} inválido no contexto do Study Stack.`);
  }

  return new Date(normalized).toISOString();
}

export function validateStudyStackReturnUrl(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    throw new TypeError("O contexto do Study Stack não possui returnUrl.");
  }

  let url;

  try {
    url = new URL(normalized);
  } catch {
    throw new TypeError("O returnUrl do Study Stack é inválido.");
  }

  const isPublishedStudyStack =
    url.protocol === "https:" &&
    url.hostname === "viniciusidney.github.io" &&
    (url.pathname === "/study-stack" || url.pathname.startsWith("/study-stack/"));
  const isLocalStudyStack =
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(url.hostname);

  if (!isPublishedStudyStack && !isLocalStudyStack) {
    throw new TypeError("O returnUrl recebido não pertence a uma origem autorizada do Study Stack.");
  }

  return url.toString();
}

export function getStudyStackLaunchDirective(context) {
  const subjectName = normalizeText(context?.subjectContext?.subjectName);
  const suggestedListSequence = normalizeOptionalSequence(context?.suggestedListSequence);
  const suggestedListName = normalizeText(context?.suggestedListName) || (
    subjectName && suggestedListSequence
      ? `${subjectName} — Lista ${suggestedListSequence}`
      : ""
  );

  return Object.freeze({
    openImport: context?.entryPoint === STUDY_STACK_IMPORT_ENTRY_POINT,
    subjectName,
    suggestedListName,
    suggestedListSequence
  });
}

export function parseStudyStackContext(locationRef = globalThis.location) {
  if (!locationRef?.href) {
    return { found: false, context: null, error: null };
  }

  const url = new URL(locationRef.href);
  const sourceApp = normalizeText(url.searchParams.get("sourceApp"));
  const hasStudyStackFields = sourceApp === STUDY_STACK_SOURCE_APP ||
    CONTEXT_FIELDS.some((field) => url.searchParams.has(field));

  if (!hasStudyStackFields) {
    return { found: false, context: null, error: null };
  }

  try {
    const contractVersion = normalizeText(url.searchParams.get("contractVersion"));

    if (sourceApp !== STUDY_STACK_SOURCE_APP) {
      throw new TypeError("sourceApp deve ser study_stack.");
    }

    if (!STUDY_STACK_CONTEXT_CONTRACT_VERSIONS.includes(contractVersion)) {
      throw new TypeError(`Versão de contexto incompatível: ${contractVersion || "ausente"}.`);
    }

    const subjectId = normalizeText(url.searchParams.get("subjectId"));

    if (!subjectId) {
      throw new TypeError("O contexto do Study Stack exige subjectId.");
    }

    const subjectContext = Object.fromEntries(
      CONTEXT_FIELDS
        .map((field) => [field, normalizeText(url.searchParams.get(field))])
        .filter(([, value]) => value)
    );
    const entryPoint = normalizeText(url.searchParams.get("entryPoint"));

    if (entryPoint && entryPoint !== STUDY_STACK_IMPORT_ENTRY_POINT) {
      throw new TypeError(`entryPoint incompatível: ${entryPoint}.`);
    }

    return {
      found: true,
      error: null,
      context: {
        contractVersion,
        sourceApp,
        sentAt: normalizeDate(url.searchParams.get("sentAt"), "sentAt"),
        subjectContext,
        entryPoint: entryPoint || null,
        suggestedListName: normalizeText(url.searchParams.get("suggestedListName")) || null,
        suggestedListSequence: normalizeOptionalSequence(
          url.searchParams.get("suggestedListSequence")
        ),
        returnUrl: validateStudyStackReturnUrl(url.searchParams.get("returnUrl")),
        receivedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      found: true,
      context: null,
      error: error instanceof Error ? error : new TypeError("Contexto inválido do Study Stack.")
    };
  }
}

export function saveStudyStackContext(
  context,
  storage = getDefaultStorage()
) {
  const result = writeJsonSafe(STUDY_STACK_CONTEXT_KEY, context, storage);

  if (!result.ok) {
    throw result.error || new Error("Não foi possível salvar o contexto do Study Stack.");
  }

  return context;
}

export function loadStudyStackContext(storage = getDefaultStorage()) {
  const result = readJsonSafe(STUDY_STACK_CONTEXT_KEY, storage);

  if (!result.ok || !result.exists) {
    return null;
  }

  const raw = result.value;

  try {
    if (
      !STUDY_STACK_CONTEXT_CONTRACT_VERSIONS.includes(raw?.contractVersion) ||
      raw?.sourceApp !== STUDY_STACK_SOURCE_APP ||
      !normalizeText(raw?.subjectContext?.subjectId)
    ) {
      throw new TypeError("Contexto persistido do Study Stack é incompatível.");
    }

    return {
      ...raw,
      entryPoint: normalizeText(raw.entryPoint) || null,
      suggestedListName: normalizeText(raw.suggestedListName) || null,
      suggestedListSequence: normalizeOptionalSequence(raw.suggestedListSequence),
      returnUrl: validateStudyStackReturnUrl(raw.returnUrl)
    };
  } catch {
    removeStoredValueSafe(STUDY_STACK_CONTEXT_KEY, storage);
    return null;
  }
}

export function clearStudyStackContext(storage = getDefaultStorage()) {
  return removeStoredValueSafe(STUDY_STACK_CONTEXT_KEY, storage).ok;
}

export function consumeStudyStackContext({
  locationRef = globalThis.location,
  historyRef = globalThis.history,
  storage = getDefaultStorage()
} = {}) {
  const received = parseStudyStackContext(locationRef);

  if (!received.found) {
    return {
      found: false,
      context: loadStudyStackContext(storage),
      error: null
    };
  }

  if (received.error) {
    return received;
  }

  try {
    saveStudyStackContext(received.context, storage);
    clearStudyStackContextParams(locationRef, historyRef);
    return received;
  } catch (error) {
    return {
      found: true,
      context: received.context,
      error: error instanceof Error ? error : new Error("Falha ao receber o contexto do Study Stack.")
    };
  }
}

export function clearStudyStackContextParams(locationRef, historyRef) {
  if (!locationRef?.href || typeof historyRef?.replaceState !== "function") {
    return;
  }

  const url = new URL(locationRef.href);

  [
    "contractVersion",
    "sentAt",
    "sourceApp",
    "matterId",
    "matterName",
    "themeId",
    "themeName",
    "subjectId",
    "subjectName",
    "entryPoint",
    "suggestedListName",
    "suggestedListSequence",
    "returnUrl"
  ].forEach((field) => url.searchParams.delete(field));

  historyRef.replaceState({}, "", url.toString());
}
