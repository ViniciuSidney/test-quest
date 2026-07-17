import {
  INVALID_DATA_BACKUP_KEY,
  LEGACY_STORAGE_KEY,
  MIGRATION_BACKUP_KEY,
  STORAGE_KEY
} from "../../core/constants.js";
import { normalizeSessionState, validateSessionState } from "../../core/session-schema.js";
import {
  readJsonSafe,
  readRawValue,
  removeStoredValue,
  writeJsonSafe
} from "../../shared/storage.js";

export function loadSession(storage = globalThis.localStorage) {
  const current = readJsonSafe(STORAGE_KEY, storage);

  if (current.exists) {
    if (!current.ok) {
      backupInvalidPayload({ key: STORAGE_KEY, raw: current.raw, reason: "invalid-json" }, storage);
      removeStoredValue(STORAGE_KEY, storage);
      return loadLegacySession(storage, ["A sessão atual possuía JSON inválido e foi isolada para recuperação."]);
    }

    const validation = validateSessionState(current.value);

    if (validation.valid) {
      if (validation.migrated || validation.issues.length) {
        backupMigrationPayload({
          key: STORAGE_KEY,
          raw: current.raw,
          reason: validation.migrated ? "schema-migration" : "session-repair"
        }, storage);
        writeJsonSafe(STORAGE_KEY, validation.state, storage);
      }

      return {
        session: validation.state,
        source: "current",
        migrated: validation.migrated,
        recovered: Boolean(validation.issues.length),
        issues: validation.issues
      };
    }

    backupInvalidPayload({
      key: STORAGE_KEY,
      raw: current.raw,
      reason: "invalid-session",
      issues: validation.issues
    }, storage);
    removeStoredValue(STORAGE_KEY, storage);
    return loadLegacySession(storage, validation.issues);
  }

  return loadLegacySession(storage);
}

export function saveSession(session, storage = globalThis.localStorage) {
  try {
    const normalized = normalizeSessionState(session).state;
    const result = writeJsonSafe(STORAGE_KEY, normalized, storage);

    if (!result.ok) {
      return {
        ok: false,
        session: null,
        error: result.error
      };
    }

    return {
      ok: true,
      session: normalized,
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      session: null,
      error
    };
  }
}

export function clearSession(storage = globalThis.localStorage) {
  const currentRemoved = removeStoredValue(STORAGE_KEY, storage);
  const legacyRemoved = removeStoredValue(LEGACY_STORAGE_KEY, storage);
  return currentRemoved && legacyRemoved;
}

export function inspectSession(storage = globalThis.localStorage) {
  const current = readJsonSafe(STORAGE_KEY, storage);
  const legacy = readJsonSafe(LEGACY_STORAGE_KEY, storage);

  return {
    currentExists: current.exists,
    currentReadable: current.ok,
    legacyExists: legacy.exists,
    legacyReadable: legacy.ok
  };
}

function loadLegacySession(storage, previousIssues = []) {
  const legacy = readJsonSafe(LEGACY_STORAGE_KEY, storage);

  if (!legacy.exists) {
    return {
      session: null,
      source: "none",
      migrated: false,
      recovered: Boolean(previousIssues.length),
      issues: previousIssues
    };
  }

  if (!legacy.ok) {
    backupInvalidPayload({ key: LEGACY_STORAGE_KEY, raw: legacy.raw, reason: "invalid-json" }, storage);
    removeStoredValue(LEGACY_STORAGE_KEY, storage);
    return {
      session: null,
      source: "legacy-invalid",
      migrated: false,
      recovered: true,
      issues: [...previousIssues, "A sessão legada possuía JSON inválido."]
    };
  }

  const validation = validateSessionState(legacy.value);

  if (!validation.valid) {
    backupInvalidPayload({
      key: LEGACY_STORAGE_KEY,
      raw: legacy.raw,
      reason: "invalid-session",
      issues: validation.issues
    }, storage);
    removeStoredValue(LEGACY_STORAGE_KEY, storage);
    return {
      session: null,
      source: "legacy-invalid",
      migrated: false,
      recovered: true,
      issues: [...previousIssues, ...validation.issues]
    };
  }

  backupMigrationPayload({ key: LEGACY_STORAGE_KEY, raw: legacy.raw }, storage);
  const writeResult = writeJsonSafe(STORAGE_KEY, validation.state, storage);

  if (!writeResult.ok) {
    return {
      session: validation.state,
      source: "legacy-memory",
      migrated: true,
      recovered: true,
      issues: [...previousIssues, "A sessão foi migrada em memória, mas não pôde ser salva na nova chave."]
    };
  }

  removeStoredValue(LEGACY_STORAGE_KEY, storage);

  return {
    session: validation.state,
    source: "legacy",
    migrated: true,
    recovered: Boolean(previousIssues.length || validation.issues.length),
    issues: [...previousIssues, ...validation.issues]
  };
}

function backupMigrationPayload(payload, storage) {
  appendBackup(MIGRATION_BACKUP_KEY, payload, storage);
}

function backupInvalidPayload(payload, storage) {
  appendBackup(INVALID_DATA_BACKUP_KEY, payload, storage);
}

function appendBackup(key, payload, storage) {
  const current = readJsonSafe(key, storage);
  const entries = current.ok && Array.isArray(current.value?.entries)
    ? current.value.entries
    : [];

  entries.push({
    ...payload,
    raw: payload.raw ?? readRawValue(payload.key, storage),
    savedAt: new Date().toISOString()
  });

  writeJsonSafe(key, {
    version: 1,
    entries: entries.slice(-5)
  }, storage);
}
