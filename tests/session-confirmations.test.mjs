import assert from "node:assert/strict";
import {
  getClearImportConfirmation,
  getDeleteSessionConfirmation,
  getFinishSessionConfirmation,
  getNewResolutionConfirmation,
  getReplaceSessionConfirmation
} from "../src/scripts/features/session/session-confirmations.service.js";

assert.equal(getClearImportConfirmation().variant, "danger");
assert.equal(getDeleteSessionConfirmation().confirmText, "Apagar progresso");
assert.equal(getReplaceSessionConfirmation().title, "Iniciar uma nova resolução?");
assert.equal(getNewResolutionConfirmation().label, "Nova resolução");

const pending = getFinishSessionConfirmation({ total: 5, respondidas: 3 }, 2);
assert.equal(pending.title, "Existem questões não respondidas");
assert.equal(pending.items[1].value, "2");
assert.equal(pending.items[2].value, "2");
assert.equal(pending.items[1].tone, "warning");


const immediatePending = getFinishSessionConfirmation({ total: 2, respondidas: 2 }, 0, 1);
assert.equal(immediatePending.items.at(-1).label, "Sem confirmação imediata");
assert.equal(immediatePending.items.at(-1).value, "1");
assert.match(immediatePending.note, /sem confirmação imediata/);

const complete = getFinishSessionConfirmation({ total: 2, respondidas: 2 }, 0);
assert.equal(complete.title, "Finalizar esta resolução?");
assert.equal(complete.items[0].tone, "success");
assert.equal(complete.items[1].tone, "success");

console.log("Session confirmations: todos os testes passaram.");
