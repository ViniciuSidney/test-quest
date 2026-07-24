import assert from "node:assert/strict";
import {
  METACOGNITION_LEVELS,
  buildFinalVerdictMarkup,
  buildMetacognitionMarkup,
  getFinalVerdict,
  getInitialMetacognition,
  getMetacognitionLevel,
  hasFinalVerdict,
  hasInitialMetacognition,
  normalizeDiscursiveAssessmentsMap,
  setFinalVerdictLevel,
  setFinalVerdictObservation,
  setInitialMetacognitionLevel,
  setInitialMetacognitionObservation
} from "../src/scripts/features/question-resolution/metacognition.service.js";
import { calculateSessionResult } from "../src/scripts/features/results/results.service.js";

const questions = [
  { id: "d1", categoria: "discursiva", assunto: "Gramática", enunciado: "Explique a regra." },
  { id: "o1", categoria: "objetiva", assunto: "Gramática", enunciado: "Questão objetiva." }
];

assert.equal(getMetacognitionLevel("completa")?.percentage, 100);
assert.equal(getMetacognitionLevel("parcial")?.percentage, 50);
assert.equal(getMetacognitionLevel("incorreta")?.percentage, 0);
assert.equal(METACOGNITION_LEVELS.COMPLETE.label, "Resposta completa");

let state = { avaliacoesDiscursivas: {} };
state = setInitialMetacognitionObservation(state, "d1", "Acho que faltou um exemplo.");
state = setInitialMetacognitionLevel(state, "d1", "parcial");
assert.equal(hasInitialMetacognition(state, "d1"), true);
assert.equal(hasFinalVerdict(state, "d1"), false);
assert.deepEqual(getInitialMetacognition(state, "d1"), {
  nivel: "parcial",
  percentual: 50,
  observacao: "Acho que faltou um exemplo."
});

state = setFinalVerdictObservation(state, "d1", "O exemplo realmente ficou incompleto.");
state = setFinalVerdictLevel(state, "d1", "incorreta", {
  now: () => "2026-07-23T12:00:00.000Z"
});
assert.equal(hasFinalVerdict(state, "d1"), true);
assert.deepEqual(getFinalVerdict(state, "d1"), {
  nivel: "incorreta",
  percentual: 0,
  observacao: "O exemplo realmente ficou incompleto.",
  registradoEm: "2026-07-23T12:00:00.000Z"
});

const migrated = normalizeDiscursiveAssessmentsMap({
  d1: { desempenho: "completa", observacoes: "Registro legado." },
  o1: { nivel: "incorreta" }
}, questions);
assert.equal(migrated.d1.metacognicaoInicial.nivel, "completa");
assert.equal(migrated.d1.vereditoFinal.nivel, "completa");
assert.equal(migrated.o1, undefined);

const initialMarkup = buildMetacognitionMarkup({ assessment: getInitialMetacognition(state, "d1") });
assert.match(initialMarkup, /Metacognição inicial/);
assert.match(initialMarkup, /esta percepção não define a pontuação final/i);
assert.match(initialMarkup, /Resposta parcial \(50%\)/);

const verdictMarkup = buildFinalVerdictMarkup({ verdict: getFinalVerdict(state, "d1") });
assert.match(verdictMarkup, /Veredito final/);
assert.match(verdictMarkup, /Somente este veredito será usado/);
assert.match(verdictMarkup, /aria-checked="true"/);

const result = calculateSessionResult({
  questoes: [questions[0]],
  respostas: { d1: "Minha resposta" },
  avaliacoesDiscursivas: state.avaliacoesDiscursivas,
  temposMs: { d1: 1000 }
});
assert.equal(result.discursivasAvaliadas, 1);
assert.equal(result.pontosObtidos, 0, "O desempenho deve usar o veredito final, não a percepção inicial.");
assert.equal(result.percentual, 0);

console.log("Metacognition and final verdict: todos os testes passaram.");
