export function readJson(key, fallback = null, storage = globalThis.localStorage) {
  const result = readJsonSafe(key, storage);
  return result.ok ? result.value : fallback;
}

export function readJsonSafe(key, storage = globalThis.localStorage) {
  try {
    assertStorageMethod(storage, "getItem");
    const raw = storage.getItem(key);

    if (raw === null || raw === undefined) {
      return { ok: true, exists: false, value: null, raw: null, error: null };
    }

    return {
      ok: true,
      exists: true,
      value: JSON.parse(raw),
      raw,
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      exists: true,
      value: null,
      raw: safeGetRawValue(storage, key),
      error
    };
  }
}

export function writeJson(key, value, storage = globalThis.localStorage) {
  const result = writeJsonSafe(key, value, storage);

  if (!result.ok) {
    throw result.error;
  }

  return value;
}

export function writeJsonSafe(key, value, storage = globalThis.localStorage) {
  try {
    assertStorageMethod(storage, "setItem");
    storage.setItem(key, JSON.stringify(value));
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error };
  }
}

export function removeStoredValue(key, storage = globalThis.localStorage) {
  try {
    assertStorageMethod(storage, "removeItem");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readRawValue(key, storage = globalThis.localStorage) {
  try {
    assertStorageMethod(storage, "getItem");
    return storage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeGetRawValue(storage, key) {
  try {
    assertStorageMethod(storage, "getItem");
    return storage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function assertStorageMethod(storage, method) {
  if (!storage || typeof storage[method] !== "function") {
    throw new Error(`Armazenamento local indisponível: ${method}.`);
  }
}
