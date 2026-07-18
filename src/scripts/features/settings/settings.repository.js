import {
  CONFIG_KEY,
  INVALID_DATA_BACKUP_KEY,
  LEGACY_CONFIG_KEY,
  MIGRATION_BACKUP_KEY,
  SETTINGS_SCHEMA_VERSION
} from "../../core/constants.js";
import {
  getDefaultStorage,
  readJsonSafe,
  removeStoredValue,
  writeJsonSafe
} from "../../shared/storage.js";

const DEFAULT_SETTINGS = Object.freeze({
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  tema: "light",
  efeitosVisuais: "system"
});

export function createDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}

export function loadSettings(storage = getDefaultStorage()) {
  const current = readJsonSafe(CONFIG_KEY, storage);

  if (current.exists) {
    if (current.ok) {
      const settings = normalizeSettings(current.value);

      if (JSON.stringify(settings) !== JSON.stringify(current.value)) {
        writeJsonSafe(CONFIG_KEY, settings, storage);
      }

      return settings;
    }

    appendBackup(INVALID_DATA_BACKUP_KEY, {
      key: CONFIG_KEY,
      raw: current.raw,
      reason: "invalid-settings-json"
    }, storage);
    removeStoredValue(CONFIG_KEY, storage);
  }

  const legacy = readJsonSafe(LEGACY_CONFIG_KEY, storage);

  if (legacy.exists) {
    if (legacy.ok) {
      const settings = normalizeSettings(legacy.value);
      appendBackup(MIGRATION_BACKUP_KEY, {
        key: LEGACY_CONFIG_KEY,
        raw: legacy.raw,
        reason: "settings-migration"
      }, storage);
      writeJsonSafe(CONFIG_KEY, settings, storage);
      removeStoredValue(LEGACY_CONFIG_KEY, storage);
      return settings;
    }

    appendBackup(INVALID_DATA_BACKUP_KEY, {
      key: LEGACY_CONFIG_KEY,
      raw: legacy.raw,
      reason: "invalid-legacy-settings-json"
    }, storage);
    removeStoredValue(LEGACY_CONFIG_KEY, storage);
  }

  return createDefaultSettings();
}

export function saveSettings(settings, storage = getDefaultStorage()) {
  const normalized = normalizeSettings(settings);
  const result = writeJsonSafe(CONFIG_KEY, normalized, storage);
  return { ok: result.ok, settings: normalized, error: result.error, errorCode: result.errorCode };
}

export function normalizeSettings(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  const theme = source.tema === "dark" ? "dark" : "light";
  const visualEffects = ["system", "full", "reduced"].includes(source.efeitosVisuais)
    ? source.efeitosVisuais
    : "system";

  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    tema: theme,
    efeitosVisuais: visualEffects
  };
}

function appendBackup(key, payload, storage) {
  const current = readJsonSafe(key, storage);
  const entries = current.ok && Array.isArray(current.value?.entries)
    ? current.value.entries
    : [];

  entries.push({
    ...payload,
    savedAt: new Date().toISOString()
  });

  writeJsonSafe(key, {
    version: 1,
    entries: entries.slice(-5)
  }, storage);
}
