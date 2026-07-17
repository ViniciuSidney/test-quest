import assert from "node:assert/strict";
import {
  CONFIG_KEY,
  LEGACY_CONFIG_KEY,
  MIGRATION_BACKUP_KEY,
  SETTINGS_SCHEMA_VERSION
} from "../src/scripts/core/constants.js";
import { loadSettings, saveSettings } from "../src/scripts/features/settings/settings.repository.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

const storage = new MemoryStorage({
  [LEGACY_CONFIG_KEY]: JSON.stringify({ tema: "dark" })
});

const migrated = loadSettings(storage);
assert.equal(migrated.schemaVersion, SETTINGS_SCHEMA_VERSION);
assert.equal(migrated.tema, "dark");
assert.equal(migrated.efeitosVisuais, "system");
assert.equal(storage.getItem(LEGACY_CONFIG_KEY), null);
assert.ok(storage.getItem(CONFIG_KEY));
assert.ok(storage.getItem(MIGRATION_BACKUP_KEY));

const saved = saveSettings({ tema: "invalid", efeitosVisuais: "reduced" }, storage);
assert.equal(saved.ok, true);
assert.equal(saved.settings.tema, "light");
assert.equal(saved.settings.efeitosVisuais, "reduced");

console.log("Settings repository: todos os testes passaram.");
