import { downloadExportFile } from "../exports/session-export.service.js";
import {
  bindStudyStackContextToSession,
  clearStudyStackContext,
  consumeStudyStackContext,
  getStudyStackLaunchDirective,
  reconcileStudyStackContext,
  saveStudyStackContext
} from "./study-stack-context.service.js";
import {
  createStudyStackJsonExport,
  saveToStudyStackAndReturn
} from "./study-stack-handoff.service.js";

export function createStudyStackIntegrationController({
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  getState,
  prepareState = () => {}
} = {}) {
  let context = null;
  let contextError = null;
  let returnFailed = false;
  let suspendedContext = null;

  const $ = (selector) => documentRef?.querySelector?.(selector);

  function init({ activeSessionId = null } = {}) {
    const reception = consumeStudyStackContext({
      locationRef: windowRef?.location,
      historyRef: windowRef?.history
    });
    context = reception.context;
    contextError = reception.error;

    if (!reception.found && context) {
      context = reconcileStudyStackContext(context, activeSessionId);
    } else if (
      reception.found &&
      reception.previousContext?.sessionId &&
      reception.previousContext.sessionId === String(activeSessionId || "").trim()
    ) {
      suspendedContext = reception.previousContext;
    }

    $("#btnExportarStudyStack")?.addEventListener("click", exportResult);
    $("#btnSalvarStudyStack")?.addEventListener("click", saveAndReturn);
    sync();
    const directive = getStudyStackLaunchDirective(context);
    const launch = Object.freeze({
      ...directive,
      openImport: Boolean(reception.found && directive.openImport)
    });

    if (launch.openImport && launch.suggestedListName) {
      const listNameInput = $("#nomeLista");

      if (listNameInput && !listNameInput.value.trim()) {
        listNameInput.value = launch.suggestedListName;
      }
    }

    return {
      context,
      error: contextError,
      launch
    };
  }

  function bindSession(sessionId) {
    if (!context) {
      return false;
    }

    try {
      context = bindStudyStackContextToSession(context, sessionId);
      contextError = null;
      sync();
      return true;
    } catch (error) {
      contextError = error instanceof Error
        ? error
        : new Error("Não foi possível vincular o contexto do Study Stack à sessão.");
      sync();
      return false;
    }
  }

  function prepareStandaloneImport({ clearSuggestedListName = false } = {}) {
    if (!context) {
      return false;
    }

    clearSuggestedNameIfUnedited(context, clearSuggestedListName);
    suspendedContext = context;
    context = null;
    contextError = null;
    returnFailed = false;
    sync();
    return true;
  }

  function commitSession(sessionId) {
    if (suspendedContext && !context) {
      clearStudyStackContext();
    }

    suspendedContext = null;
    return bindSession(sessionId);
  }

  function cancelImport({ clearSuggestedListName = false } = {}) {
    if (!suspendedContext) {
      return detachContext({ clearSuggestedListName });
    }

    clearSuggestedNameIfUnedited(context, clearSuggestedListName);
    context = suspendedContext;
    suspendedContext = null;
    contextError = null;
    returnFailed = false;

    try {
      saveStudyStackContext(context);
    } catch (error) {
      contextError = error instanceof Error
        ? error
        : new Error("Não foi possível restaurar o vínculo anterior com o Study Stack.");
    }

    sync();
    return true;
  }

  function detachContext({ clearSuggestedListName = false } = {}) {
    const removed = clearStudyStackContext();

    clearSuggestedNameIfUnedited(context, clearSuggestedListName);

    context = null;
    suspendedContext = null;
    contextError = removed
      ? null
      : new Error("Não foi possível remover o vínculo salvo com o Study Stack.");
    returnFailed = false;
    sync();
    return removed;
  }

  function clearSuggestedNameIfUnedited(targetContext, enabled) {
    const suggestedListName = getStudyStackLaunchDirective(targetContext).suggestedListName;
    const listNameInput = $("#nomeLista");

    if (enabled && suggestedListName && listNameInput?.value.trim() === suggestedListName) {
      listNameInput.value = "";
    }
  }

  function exportResult() {
    if (!context) {
      showMessage("Abra o Test Quest pelo Assunto no Study Stack para vincular este resultado.", "warning");
      return;
    }

    try {
      prepareState();
      downloadExportFile(createStudyStackJsonExport(getState(), context, {
        resultUrl: getCleanResultUrl()
      }));
      showMessage("Arquivo de integração gerado. Importe-o no Study Stack se o retorno automático não funcionar.", "success");
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Não foi possível exportar o resultado para o Study Stack.",
        "danger"
      );
    }
  }

  function saveAndReturn() {
    const button = $("#btnSalvarStudyStack");

    if (!context) {
      showMessage("O contexto do Study Stack não está disponível.", "warning");
      return;
    }

    try {
      prepareState();
      if (button) button.disabled = true;
      showMessage("Salvando o resultado e retornando ao Study Stack...", "info");
      saveToStudyStackAndReturn({
        state: getState(),
        context,
        locationRef: windowRef?.location,
        resultUrl: getCleanResultUrl()
      });
    } catch (error) {
      if (button) button.disabled = false;
      returnFailed = true;
      $("#btnExportarStudyStack")?.classList.remove("hidden");
      showMessage(
        `${error instanceof Error ? error.message : "Não foi possível retornar ao Study Stack."} Use “Exportar para o Study Stack” para baixar o resultado.`,
        "danger"
      );
    }
  }

  function getCleanResultUrl() {
    const url = new URL(windowRef.location.href);
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function sync() {
    const panel = $("#acaoStudyStackResultado");
    const exportButton = $("#btnExportarStudyStack");
    const saveButton = $("#btnSalvarStudyStack");
    const subjectElement = $("#assuntoStudyStackResultado");
    const available = Boolean(context?.subjectContext?.subjectId);

    panel?.classList.toggle("hidden", !available && !contextError);
    exportButton?.classList.toggle("hidden", !available || !returnFailed);
    saveButton?.classList.toggle("hidden", !available);

    if (subjectElement) {
      subjectElement.textContent = available
        ? context.subjectContext.subjectName || "Assunto vinculado"
        : "Vínculo indisponível";
    }

    syncImportContext();

    if (contextError) {
      showMessage(contextError.message, "danger");
    } else if (available) {
      showMessage("Resultado vinculado ao Assunto do Study Stack.", "info");
    }
  }

  function syncImportContext() {
    const panel = $("#contextoStudyStackImportacao");
    const subjectElement = $("#assuntoStudyStackImportacao");
    const sequenceElement = $("#sequenciaStudyStackImportacao");
    const directive = getStudyStackLaunchDirective(context);
    const available = Boolean(context?.subjectContext?.subjectId);

    panel?.classList.toggle("hidden", !available);

    if (subjectElement && available) {
      subjectElement.textContent = directive.subjectName || "Assunto vinculado";
    }

    if (sequenceElement) {
      sequenceElement.textContent = directive.suggestedListSequence
        ? `Lista ${directive.suggestedListSequence}`
        : "Lista vinculada";
    }
  }

  function showMessage(message, tone = "info") {
    const element = $("#mensagemStudyStackResultado");

    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone;
  }

  return Object.freeze({
    init,
    sync,
    bindSession,
    prepareStandaloneImport,
    commitSession,
    cancelImport,
    detachContext,
    exportResult,
    saveAndReturn
  });
}
