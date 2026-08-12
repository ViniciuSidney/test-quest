import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [constants, state, controller, contextService, integrationController, index, importCss, resultsCss, nativeExport, handoff] = await Promise.all([
  readFile(new URL("../src/scripts/core/constants.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/core/state.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/question-resolution/question-resolution.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/integrations/study-stack-context.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/integrations/study-stack-integration.controller.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/import.css", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/pages/results.css", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/exports/session-export.service.js", import.meta.url), "utf8"),
  readFile(new URL("../src/scripts/features/integrations/study-stack-handoff.service.js", import.meta.url), "utf8")
]);

assert.match(constants, /SESSION_SCHEMA_VERSION\s*=\s*7/);
assert.doesNotMatch(state, /studyStack|subjectContext|contractVersion/);
assert.match(nativeExport, /JSON\.stringify\(state, null, 2\)/);
assert.match(handoff, /STUDY_STACK_RESULT_CONTRACT_VERSION\s*=\s*"1\.1\.0"/);
assert.match(handoff, /study-stack:handoff:test-quest:v1/);
assert.match(controller, /createStudyStackIntegrationController/);
assert.match(integrationController, /consumeStudyStackContext/);
assert.match(contextService, /bindStudyStackContextToSession/);
assert.match(contextService, /reconcileStudyStackContext/);
assert.match(integrationController, /reception\.found && directive\.openImport/);
assert.match(integrationController, /function prepareStandaloneImport/);
assert.match(integrationController, /function commitSession/);
assert.match(integrationController, /function cancelImport/);
assert.match(integrationController, /function detachContext/);
assert.match(controller, /init\(\{ activeSessionId:/);
assert.match(controller, /commitSession\(estado\.id\)/);
assert.match(controller, /salvarEstadoImediato\(\)[\s\S]*bindSession\(estado\.id\)/);
assert.match(controller, /prepareStandaloneImport\(\{ clearSuggestedListName: true \}\)/);
assert.match(controller, /cancelImport\(\{ clearSuggestedListName: true \}\)/);
assert.match(controller, /detachContext\(\{ clearSuggestedListName: true \}\)/);
assert.match(contextService, /STUDY_STACK_CONTEXT_CONTRACT_VERSION\s*=\s*"1\.1\.0"/);
assert.match(contextService, /STUDY_STACK_CONTEXT_CONTRACT_VERSIONS/);
assert.match(contextService, /suggestedListSequence/);
assert.match(integrationController, /getStudyStackLaunchDirective/);
assert.match(integrationController, /saveToStudyStackAndReturn/);
assert.match(controller, /studyStackLaunch\.openImport/);
assert.match(integrationController, /launch\.suggestedListName/);
assert.match(controller, /createSessionJsonExport\(estado\)/);
assert.match(integrationController, /createStudyStackJsonExport\(getState\(\), context/);

for (const id of [
  "acaoStudyStackResultado",
  "contextoStudyStackImportacao",
  "assuntoStudyStackImportacao",
  "sequenciaStudyStackImportacao",
  "assuntoStudyStackResultado",
  "mensagemStudyStackResultado",
  "btnSalvarStudyStack",
  "btnExportarStudyStack",
  "btnExportarJson"
]) {
  assert.match(index, new RegExp(`id=["']${id}["']`));
}

assert.match(index, /Baixar cópia da sessão/);
assert.match(index, /Exportar para o Study Stack/);
assert.match(index, /Salvar no Study Stack e voltar/);
assert.match(integrationController, /returnFailed/);
assert.match(integrationController, /Use “Exportar para o Study Stack”/);
assert.match(resultsCss, /\.results-actions__study-stack/);
assert.match(importCss, /\.import-study-stack-context/);

console.log("Study Stack handoff structure: todos os testes passaram.");
