import assert from "node:assert/strict";
import {
  INVALID_DATA_BACKUP_KEY,
  LEGACY_STORAGE_KEY,
  MIGRATION_BACKUP_KEY,
  STORAGE_KEY
} from "../src/scripts/core/constants.js";
import { clearSession, loadSession, saveSession } from "../src/scripts/features/session/session.repository.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

function createLegacySession(name = "Lista legada") {
  return {
    versao: 2,
    listaNome: name,
    status: "em_andamento",
    atual: 0,
    questoes: [
      {
        id: "q-1",
        categoria: "objetiva",
        assunto: "Gramática",
        tipo: "objetiva",
        enunciado: "Questão",
        alternativas: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        correta: "A",
        explicacao: "Explicação"
      }
    ],
    respostas: {},
    anotacoes: {},
    temposMs: {},
    revisao: {},
    marcacoesAlternativas: {},
    opcoes: { mostrarGabaritoFinal: true },
    importadoEm: "2026-07-17T12:00:00.000Z"
  };
}

const storage = new MemoryStorage({
  [LEGACY_STORAGE_KEY]: JSON.stringify(createLegacySession())
});

const migrated = loadSession(storage);
assert.equal(migrated.source, "legacy");
assert.equal(migrated.migrated, true);
assert.equal(migrated.session.listaNome, "Lista legada");
assert.equal(storage.getItem(LEGACY_STORAGE_KEY), null);
assert.ok(storage.getItem(STORAGE_KEY));
assert.ok(storage.getItem(MIGRATION_BACKUP_KEY));

const saved = saveSession({ ...migrated.session, listaNome: "Atualizada" }, storage);
assert.equal(saved.ok, true);
assert.equal(loadSession(storage).session.listaNome, "Atualizada");

assert.equal(clearSession(storage), true);
assert.equal(storage.getItem(STORAGE_KEY), null);
assert.equal(storage.getItem(LEGACY_STORAGE_KEY), null);

const fallbackStorage = new MemoryStorage({
  [STORAGE_KEY]: "{json quebrado",
  [LEGACY_STORAGE_KEY]: JSON.stringify(createLegacySession("Recuperada"))
});
const recovered = loadSession(fallbackStorage);
assert.equal(recovered.session.listaNome, "Recuperada");
assert.equal(recovered.recovered, true);
assert.ok(fallbackStorage.getItem(INVALID_DATA_BACKUP_KEY));

console.log("Session repository: todos os testes passaram.");
