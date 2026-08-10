import assert from "node:assert/strict";
import {
  getCorrectAlternativeId,
  normalizeObjectiveAlternatives
} from "../src/scripts/core/objective-question.js";
import { SESSION_SCHEMA_VERSION } from "../src/scripts/core/constants.js";
import { SESSION_STATUS } from "../src/scripts/core/state.js";
import {
  STUDY_STACK_CONTEXT_KEY,
  consumeStudyStackContext,
  loadStudyStackContext,
  parseStudyStackContext,
  validateStudyStackReturnUrl
} from "../src/scripts/features/integrations/study-stack-context.service.js";
import {
  STUDY_STACK_HANDOFF_KEY,
  createStudyStackJsonExport,
  createStudyStackResultPayload,
  saveToStudyStackAndReturn
} from "../src/scripts/features/integrations/study-stack-handoff.service.js";
import { MemoryStorage } from "./helpers/memory-storage.mjs";

function createContextUrl(overrides = {}) {
  const params = new URLSearchParams({
    contractVersion: "1.0.0",
    sentAt: "2026-08-10T14:00:00.000Z",
    sourceApp: "study_stack",
    matterId: "matter-biology",
    matterName: "Biologia",
    themeId: "theme-ecology",
    themeName: "Ecologia",
    subjectId: "subject-food-webs",
    subjectName: "Cadeias e Teias Alimentares",
    returnUrl: "https://viniciusidney.github.io/study-stack/?section=exercises"
  });

  Object.entries(overrides).forEach(([key, value]) => params.set(key, value));
  return `https://viniciusidney.github.io/test-quest/?${params}`;
}

const parsed = parseStudyStackContext({ href: createContextUrl() });
assert.equal(parsed.found, true);
assert.equal(parsed.error, null);
assert.equal(parsed.context.sourceApp, "study_stack");
assert.equal(parsed.context.subjectContext.subjectId, "subject-food-webs");
assert.equal(parsed.context.subjectContext.themeName, "Ecologia");

const storage = new MemoryStorage();
let cleanedUrl = "";
const consumed = consumeStudyStackContext({
  locationRef: { href: `${createContextUrl()}&keep=1` },
  historyRef: { replaceState: (_state, _title, url) => { cleanedUrl = url; } },
  storage
});
assert.equal(consumed.context.subjectContext.subjectName, "Cadeias e Teias Alimentares");
assert.equal(loadStudyStackContext(storage).subjectContext.subjectId, "subject-food-webs");
assert.ok(storage.getItem(STUDY_STACK_CONTEXT_KEY));
assert.match(cleanedUrl, /keep=1/);
assert.doesNotMatch(cleanedUrl, /subjectId=/);

const invalidSource = parseStudyStackContext({
  href: createContextUrl({ sourceApp: "unknown_app" })
});
assert.equal(invalidSource.found, true);
assert.match(invalidSource.error.message, /sourceApp/);

assert.throws(
  () => validateStudyStackReturnUrl("https://example.com/steal-result"),
  /origem autorizada/
);

const alternativesBase = {
  id: "q-objective",
  categoria: "objetiva",
  tipo: "multipla escolha",
  assunto: "Ecologia",
  enunciado: "Quem inicia a cadeia alimentar?",
  alternativas: normalizeObjectiveAlternatives(
    { A: "Consumidor", B: "Produtor", C: "Decompositor", D: "Predador", E: "Onívoro" },
    "q-objective"
  ),
  correta: "B",
  explicacao: "Produtores transformam energia luminosa em energia química."
};
const objective = {
  ...alternativesBase,
  respostaCorretaId: getCorrectAlternativeId(alternativesBase)
};
const unansweredBase = {
  ...alternativesBase,
  id: "q-unanswered",
  enunciado: "Qual nível vem depois dos produtores?",
  alternativas: normalizeObjectiveAlternatives(
    { A: "Consumidor primário", B: "Produtor", C: "Decompositor", D: "Sol", E: "Mineral" },
    "q-unanswered"
  ),
  correta: "A"
};
const unanswered = {
  ...unansweredBase,
  respostaCorretaId: getCorrectAlternativeId(unansweredBase)
};
const discursive = {
  id: "q-discursive",
  categoria: "discursiva",
  tipo: "discursiva curta",
  assunto: "Ecologia",
  enunciado: "Explique o fluxo de energia.",
  respostaEsperada: "A energia flui e parte é dissipada em cada nível.",
  criterios: "Explicar fluxo unidirecional e dissipação."
};
const state = {
  schemaVersion: SESSION_SCHEMA_VERSION,
  versao: SESSION_SCHEMA_VERSION,
  id: "session-test-quest-1",
  status: SESSION_STATUS.FINISHED,
  listaNome: "Lista de Ecologia",
  questoes: [objective, discursive, unanswered],
  respostas: {
    [objective.id]: objective.respostaCorretaId,
    [discursive.id]: "A energia diminui entre os níveis."
  },
  avaliacoesDiscursivas: {
    [discursive.id]: {
      metacognicaoInicial: {
        nivel: "completa",
        percentual: 100,
        observacao: "Achei que estava completa."
      },
      vereditoFinal: {
        nivel: "parcial",
        percentual: 50,
        observacao: "Faltou explicar a dissipação."
      }
    }
  },
  iniciadoEm: "2026-08-10T13:30:00.000Z",
  finalizadoEm: "2026-08-10T14:00:00.000Z"
};
const originalState = structuredClone(state);
const payload = createStudyStackResultPayload(state, parsed.context, {
  now: () => "2026-08-10T14:05:00.000Z",
  resultUrl: "https://viniciusidney.github.io/test-quest/"
});

assert.equal(payload.contractVersion, "1.1.0");
assert.equal(payload.sourceApp, "test_quest");
assert.equal(payload.sessionId, state.id);
assert.equal(payload.subjectContext.subjectId, "subject-food-webs");
assert.equal(payload.questions[0].result, "correct");
assert.equal(payload.questions[0].scorePercentage, 100);
assert.equal(payload.questions[0].userAnswer, "B) Produtor");
assert.equal(payload.questions[1].result, "partial");
assert.equal(payload.questions[1].scorePercentage, 50);
assert.match(payload.questions[1].metacognition, /Resposta completa \(100%\)/);
assert.equal(payload.questions[2].result, "unanswered");
assert.equal(payload.questions[2].scorePercentage, null);
assert.deepEqual(state, originalState, "O adaptador não deve alterar o schema interno da sessão.");

const exportFile = createStudyStackJsonExport(state, parsed.context, {
  now: () => "2026-08-10T14:05:00.000Z"
});
assert.equal(exportFile.fileName, "lista-de-ecologia-study-stack.json");
assert.equal(JSON.parse(exportFile.content).contractVersion, "1.1.0");

const handoffStorage = new MemoryStorage();
handoffStorage.setItem(STUDY_STACK_CONTEXT_KEY, JSON.stringify(parsed.context));
let assignedUrl = "";
saveToStudyStackAndReturn({
  state,
  context: parsed.context,
  storage: handoffStorage,
  locationRef: { assign: (url) => { assignedUrl = url; } },
  now: () => "2026-08-10T14:05:00.000Z"
});
assert.equal(JSON.parse(handoffStorage.getItem(STUDY_STACK_HANDOFF_KEY)).contractVersion, "1.1.0");
assert.equal(handoffStorage.getItem(STUDY_STACK_CONTEXT_KEY), null);
assert.equal(assignedUrl, parsed.context.returnUrl);

const rejectedStorage = new MemoryStorage();
assert.throws(
  () => saveToStudyStackAndReturn({
    state,
    context: { ...parsed.context, returnUrl: "https://example.com/" },
    storage: rejectedStorage,
    locationRef: { assign: () => assert.fail("Não deve navegar para origem rejeitada.") }
  }),
  /origem autorizada/
);
assert.equal(rejectedStorage.getItem(STUDY_STACK_HANDOFF_KEY), null);

console.log("Study Stack handoff: todos os testes passaram.");
