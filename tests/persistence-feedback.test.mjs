import assert from "node:assert/strict";
import { STORAGE_ERROR_CODES } from "../src/scripts/shared/storage.js";
import {
  getPersistenceWarning,
  shouldProtectBeforeUnload
} from "../src/scripts/features/storage/persistence-feedback.service.js";

const quota = getPersistenceWarning(STORAGE_ERROR_CODES.QUOTA_EXCEEDED);
assert.equal(quota.tone, "warning");
assert.match(quota.title, /cheio/i);
assert.match(quota.description, /sessão continua/i);

const unavailable = getPersistenceWarning(STORAGE_ERROR_CODES.UNAVAILABLE);
assert.equal(unavailable.tone, "danger");
assert.match(unavailable.title, /indisponível/i);

const unknown = getPersistenceWarning("outro");
assert.equal(unknown.tone, "danger");
assert.match(unknown.title, /salvar/i);

assert.equal(shouldProtectBeforeUnload({ persistenceAtRisk: true, hasSession: true }), true);
assert.equal(shouldProtectBeforeUnload({ persistenceAtRisk: false, hasSession: true }), false);
assert.equal(shouldProtectBeforeUnload({ persistenceAtRisk: true, hasSession: false }), false);

console.log("Persistence feedback: todos os testes passaram.");
