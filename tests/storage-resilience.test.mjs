import assert from "node:assert/strict";
import {
  STORAGE_ERROR_CODES,
  inspectStorage,
  readJsonSafe,
  writeJsonSafe
} from "../src/scripts/shared/storage.js";
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY
} from "../src/scripts/core/constants.js";
import { loadSession, saveSession } from "../src/scripts/features/session/session.repository.js";
import { createActiveSession } from "../src/scripts/features/session/session-lifecycle.service.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

class UnavailableStorage {
  getItem() {
    const error = new Error("Access denied");
    error.name = "SecurityError";
    throw error;
  }

  setItem() {
    const error = new Error("Access denied");
    error.name = "SecurityError";
    throw error;
  }

  removeItem() {
    const error = new Error("Access denied");
    error.name = "SecurityError";
    throw error;
  }
}

class QuotaStorage extends MemoryStorage {
  setItem() {
    const error = new Error("Storage quota exceeded");
    error.name = "QuotaExceededError";
    throw error;
  }
}

function createQuestion() {
  return {
    id: "q-1",
    categoria: "objetiva",
    assunto: "Gramática",
    tipo: "objetiva",
    enunciado: "Questão",
    alternativas: { A: "A", B: "B", C: "C", D: "D", E: "E" },
    correta: "A",
    explicacao: "Explicação"
  };
}

const unavailable = new UnavailableStorage();
const unavailableInspection = inspectStorage(unavailable);
assert.equal(unavailableInspection.readable, false);
assert.equal(unavailableInspection.writable, false);
assert.equal(unavailableInspection.errorCode, STORAGE_ERROR_CODES.UNAVAILABLE);

const unavailableRead = readJsonSafe(STORAGE_KEY, unavailable);
assert.equal(unavailableRead.ok, false);
assert.equal(unavailableRead.exists, false);
assert.equal(unavailableRead.errorCode, STORAGE_ERROR_CODES.UNAVAILABLE);

const unavailableSession = loadSession(unavailable);
assert.equal(unavailableSession.source, "unavailable");
assert.equal(unavailableSession.session, null);
assert.equal(unavailableSession.errorCode, STORAGE_ERROR_CODES.UNAVAILABLE);

const quota = new QuotaStorage();
const quotaInspection = inspectStorage(quota);
assert.equal(quotaInspection.readable, true);
assert.equal(quotaInspection.writable, false);
assert.equal(quotaInspection.errorCode, STORAGE_ERROR_CODES.QUOTA_EXCEEDED);

const activeSession = createActiveSession({
  questions: [createQuestion()],
  listName: "Teste de armazenamento",
  idFactory: () => "session-storage-test",
  now: () => "2026-07-18T12:00:00.000Z"
});
const quotaSave = saveSession(activeSession, quota);
assert.equal(quotaSave.ok, false);
assert.equal(quotaSave.errorCode, STORAGE_ERROR_CODES.QUOTA_EXCEEDED);

const cyclic = {};
cyclic.self = cyclic;
const serialization = writeJsonSafe("cyclic", cyclic, new MemoryStorage());
assert.equal(serialization.ok, false);
assert.equal(serialization.errorCode, STORAGE_ERROR_CODES.SERIALIZATION);

const legacyRaw = JSON.stringify({
  ...activeSession,
  schemaVersion: 2,
  versao: 2
});
const readOnlyLegacy = new QuotaStorage({
  [LEGACY_STORAGE_KEY]: legacyRaw
});
const migratedInMemory = loadSession(readOnlyLegacy);
assert.equal(migratedInMemory.source, "legacy-memory");
assert.equal(migratedInMemory.session.id, "session-storage-test");
assert.equal(migratedInMemory.errorCode, STORAGE_ERROR_CODES.QUOTA_EXCEEDED);
assert.equal(readOnlyLegacy.getItem(LEGACY_STORAGE_KEY), legacyRaw);
assert.equal(readOnlyLegacy.getItem(STORAGE_KEY), null);

console.log("Storage resilience: todos os testes passaram.");
