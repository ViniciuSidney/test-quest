import assert from "node:assert/strict";
import {
  METACOGNITION_LEVELS,
  buildMetacognitionMarkup,
  getMetacognitionAssessment,
  getMetacognitionLevel,
  hasMetacognitionAssessment,
  normalizeMetacognitionMap,
  setMetacognitionLevel,
  setMetacognitionObservation
} from "../src/scripts/features/question-resolution/metacognition.service.js";
import { calculateSessionResult } from "../src/scripts/features/results/results.service.js";
import { shouldShowPerformanceScreen } from "../src/scripts/features/performance/performance.service.js";

const questions = [
  {
    id: "d1",
    categoria: "discursiva",
    assunto: "Gramática",
    enunciado: "Explique a regra."
  },
  {
    id: "o1",
    categoria: "objetiva",
    assunto: "Gramática",
    enunciado: "Questão objetiva."
  }
];

assert.equal(getMetacognitionLevel("completa")?.percentage, 100);
assert.equal(getMetacognitionLevel("parcial")?.percentage, 50);
assert.equal(getMetacognitionLevel("incorreta")?.percentage, 0);
assert.equal(getMetacognitionLevel("invalida"), null);
assert.equal(METACOGNITION_LEVELS.COMPLETE.label, "Resposta completa");

let state = { metacognicao: {} };
state = setMetacognitionObservation(state, "d1", "Faltou um exemplo.");
assert.equal(getMetacognitionAssessment(state, "d1")?.observacao, "Faltou um exemplo.");
assert.equal(hasMetacognitionAssessment(state, "d1"), false);

state = setMetacognitionLevel(state, "d1", "parcial");
assert.equal(hasMetacognitionAssessment(state, "d1"), true);
assert.deepEqual(getMetacognitionAssessment(state, "d1"), {
  nivel: "parcial",
  percentual: 50,
  observacao: "Faltou um exemplo."
});

const normalized = normalizeMetacognitionMap({
  d1: { desempenho: "completa", observacoes: "Atendeu aos critérios." },
  o1: { nivel: "incorreta", observacao: "Não deve permanecer." },
  orfao: { nivel: "parcial" }
}, questions);
assert.deepEqual(normalized, {
  d1: {
    nivel: "completa",
    percentual: 100,
    observacao: "Atendeu aos critérios."
  }
});

const markup = buildMetacognitionMarkup({ assessment: state.metacognicao.d1 });
assert.match(markup, /Metacognição/);
assert.match(markup, /Resposta completa \(100%\)/);
assert.match(markup, /Resposta parcial \(50%\)/);
assert.match(markup, /Resposta incorreta \(0%\)/);
assert.match(markup, /aria-checked="true"/);
assert.match(markup, /Faltou um exemplo\./);

const discursiveResult = calculateSessionResult({
  questoes: [questions[0]],
  respostas: { d1: "Minha resposta" },
  metacognicao: state.metacognicao,
  temposMs: { d1: 1000 }
});
assert.equal(discursiveResult.objetivas, 0);
assert.equal(discursiveResult.discursivasAvaliadas, 1);
assert.equal(discursiveResult.questoesAvaliadas, 1);
assert.equal(discursiveResult.pontosObtidos, 50);
assert.equal(discursiveResult.percentual, 50);
assert.equal(shouldShowPerformanceScreen(discursiveResult.questoesAvaliadas), true);

console.log("Metacognition: todos os testes passaram.");
