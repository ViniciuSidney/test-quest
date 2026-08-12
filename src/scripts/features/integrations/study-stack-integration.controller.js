import { downloadExportFile } from "../exports/session-export.service.js";
import {
  consumeStudyStackContext,
  getStudyStackLaunchDirective
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

  const $ = (selector) => documentRef?.querySelector?.(selector);

  function init() {
    const reception = consumeStudyStackContext({
      locationRef: windowRef?.location,
      historyRef: windowRef?.history
    });
    context = reception.context;
    contextError = reception.error;

    $("#btnExportarStudyStack")?.addEventListener("click", exportResult);
    $("#btnSalvarStudyStack")?.addEventListener("click", saveAndReturn);
    sync();
    const launch = getStudyStackLaunchDirective(context);

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

  return Object.freeze({ init, sync, exportResult, saveAndReturn });
}
