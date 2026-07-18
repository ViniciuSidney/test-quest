export const STORAGE_ERROR_CODES = Object.freeze({
  UNAVAILABLE: "storage-unavailable",
  QUOTA_EXCEEDED: "storage-quota-exceeded",
  INVALID_JSON: "storage-invalid-json",
  SERIALIZATION: "storage-serialization-failed",
  UNKNOWN: "storage-unknown-error"
});

export function getDefaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function inspectStorage(storage = getDefaultStorage()) {
  if (!storage) {
    const error = new Error("Armazenamento local indisponível.");
    return createStorageInspection({
      readable: false,
      writable: false,
      error,
      errorCode: STORAGE_ERROR_CODES.UNAVAILABLE
    });
  }

  try {
    assertStorageMethod(storage, "getItem");
    storage.getItem("__testQuestStorageReadProbe__");
  } catch (error) {
    return createStorageInspection({
      readable: false,
      writable: false,
      error,
      errorCode: classifyStorageError(error)
    });
  }

  const probeKey = `__testQuestStorageWriteProbe__${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    assertStorageMethod(storage, "setItem");
    assertStorageMethod(storage, "removeItem");
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);

    return createStorageInspection({
      readable: true,
      writable: true,
      error: null,
      errorCode: null
    });
  } catch (error) {
    try {
      storage.removeItem?.(probeKey);
    } catch {
      // O probe é temporário e a limpeza pode falhar pelo mesmo motivo da gravação.
    }

    return createStorageInspection({
      readable: true,
      writable: false,
      error,
      errorCode: classifyStorageError(error)
    });
  }
}

export function readJson(key, fallback = null, storage = getDefaultStorage()) {
  const result = readJsonSafe(key, storage);
  return result.ok ? result.value : fallback;
}

export function readJsonSafe(key, storage = getDefaultStorage()) {
  let raw = null;

  try {
    assertStorageMethod(storage, "getItem");
    raw = storage.getItem(key);
  } catch (error) {
    return {
      ok: false,
      exists: false,
      value: null,
      raw: null,
      error,
      errorCode: classifyStorageError(error)
    };
  }

  if (raw === null || raw === undefined) {
    return {
      ok: true,
      exists: false,
      value: null,
      raw: null,
      error: null,
      errorCode: null
    };
  }

  try {
    return {
      ok: true,
      exists: true,
      value: JSON.parse(raw),
      raw,
      error: null,
      errorCode: null
    };
  } catch (error) {
    return {
      ok: false,
      exists: true,
      value: null,
      raw,
      error,
      errorCode: STORAGE_ERROR_CODES.INVALID_JSON
    };
  }
}

export function writeJson(key, value, storage = getDefaultStorage()) {
  const result = writeJsonSafe(key, value, storage);

  if (!result.ok) {
    throw result.error;
  }

  return value;
}

export function writeJsonSafe(key, value, storage = getDefaultStorage()) {
  let serialized = "";

  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    return {
      ok: false,
      error,
      errorCode: STORAGE_ERROR_CODES.SERIALIZATION
    };
  }

  try {
    assertStorageMethod(storage, "setItem");
    storage.setItem(key, serialized);
    return { ok: true, error: null, errorCode: null };
  } catch (error) {
    return {
      ok: false,
      error,
      errorCode: classifyStorageError(error)
    };
  }
}

export function removeStoredValue(key, storage = getDefaultStorage()) {
  return removeStoredValueSafe(key, storage).ok;
}

export function removeStoredValueSafe(key, storage = getDefaultStorage()) {
  try {
    assertStorageMethod(storage, "removeItem");
    storage.removeItem(key);
    return { ok: true, error: null, errorCode: null };
  } catch (error) {
    return {
      ok: false,
      error,
      errorCode: classifyStorageError(error)
    };
  }
}

export function readRawValue(key, storage = getDefaultStorage()) {
  try {
    assertStorageMethod(storage, "getItem");
    return storage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function classifyStorageError(error) {
  if (!error) {
    return STORAGE_ERROR_CODES.UNKNOWN;
  }

  const name = String(error.name || "");
  const code = Number(error.code);
  const message = String(error.message || "").toLowerCase();

  if (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    code === 22 ||
    code === 1014 ||
    message.includes("quota") ||
    message.includes("storage full")
  ) {
    return STORAGE_ERROR_CODES.QUOTA_EXCEEDED;
  }

  if (
    name === "SecurityError" ||
    name === "NotAllowedError" ||
    name === "InvalidStateError" ||
    message.includes("indisponível") ||
    message.includes("unavailable") ||
    message.includes("disabled") ||
    message.includes("denied")
  ) {
    return STORAGE_ERROR_CODES.UNAVAILABLE;
  }

  return STORAGE_ERROR_CODES.UNKNOWN;
}

function createStorageInspection({ readable, writable, error, errorCode }) {
  return {
    available: readable && writable,
    readable,
    writable,
    error,
    errorCode
  };
}

function assertStorageMethod(storage, method) {
  if (!storage || typeof storage[method] !== "function") {
    throw new Error(`Armazenamento local indisponível: ${method}.`);
  }
}
