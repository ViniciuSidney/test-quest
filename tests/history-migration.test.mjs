import assert from "node:assert/strict";
import { HISTORY_KEY, HISTORY_SCHEMA_VERSION } from "../src/scripts/core/constants.js";
import { calculateHistoryMetrics, readHistory } from "../src/scripts/features/home/home.service.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

const storage = new MemoryStorage({
  [HISTORY_KEY]: JSON.stringify({
    version: 1,
    sessions: [
      {
        id: "s-1",
        listName: "Primeira",
        totalQuestions: 2,
        answered: 2,
        objectives: 2,
        correct: 1,
        performance: 50,
        totalTimeMs: 60000,
        completedAt: "2026-07-16T10:00:00.000Z"
      },
      {
        id: "s-1",
        listName: "Primeira atualizada",
        totalQuestions: 2,
        answered: 2,
        objectives: 2,
        correct: 2,
        performance: 100,
        totalTimeMs: 70000,
        completedAt: "2026-07-17T10:00:00.000Z"
      },
      { id: "invalida" }
    ]
  })
});

const history = readHistory(storage);
assert.equal(history.schemaVersion, HISTORY_SCHEMA_VERSION);
assert.equal(history.sessions.length, 1);
assert.equal(history.sessions[0].listName, "Primeira atualizada");

const metrics = calculateHistoryMetrics(history);
assert.deepEqual(metrics, {
  answered: 2,
  averageAccuracy: 100,
  totalTimeMs: 70000,
  completedSessions: 1
});

console.log("History migration: todos os testes passaram.");
