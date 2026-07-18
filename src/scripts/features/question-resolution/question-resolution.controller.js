import {
  getAlternativeDisplayLetter,
  getObjectiveAlternatives,
  resolveObjectiveAnswerId
} from "../../core/objective-question.js";
import { createInitialState } from "../../core/state.js";
import { createScreenManager } from "../../core/screens.js";
import { calculateHistoryMetrics, readHistory, recordCompletedSessionSafe } from "../home/home.service.js";
import { parseQuestions, QuestionImportError, summarizeQuestions } from "../question-import/question-import.parser.js";
import { clearSession, loadSession, saveSession } from "../session/session.repository.js";
import {
  getClearImportConfirmation,
  getDeleteSessionConfirmation,
  getFinishSessionConfirmation,
  getNewResolutionConfirmation,
  getReplaceSessionConfirmation
} from "../session/session-confirmations.service.js";
import {
  createActiveSession,
  finishSession,
  isActiveSession,
  restoreActiveSession
} from "../session/session-lifecycle.service.js";
import { loadSettings, saveSettings } from "../settings/settings.repository.js";
import {
  getPersistenceWarning,
  shouldProtectBeforeUnload
} from "../storage/persistence-feedback.service.js";
import { inspectStorage } from "../../shared/storage.js";
import {
  createAnswersExport,
  createNotesExport,
  createSessionJsonExport,
  downloadExportFile
} from "../exports/session-export.service.js";
import {
  escapeHtml,
  formatDuration as formatarTempo,
  formatStudyDuration as formatarTempoHistorico
} from "../../shared/formatters.js";
import {
  formatPerformanceBasis,
  getPerformanceState,
  PERFORMANCE_STATE_CLASSES,
  shouldShowPerformanceScreen
} from "../performance/performance.service.js";
import {
  calculateSessionResult as calcularResultado,
  calculateSessionTotalTime as calcularTempoTotal,
  RESULT_FILTERS,
  buildQuestionReviewItems,
  buildSubjectResultItems,
  filterQuestionReviewItems,
  getSubjectPerformanceTone,
  normalizeResultFilter
} from "../results/results.service.js";
import {
  buildQuestionMapLabel,
  getMarkerInfo,
  getNextMarkerState,
  isQuestionAnswered,
  MARKER_STATES,
  normalizeMarkerState
} from "./question-resolution.helpers.js";

export function initQuestionResolution() {
  const exemploQuestoes = `@questao
  assunto: Gramática: uso de mas e mais
  tipo: objetiva
  enunciado: Em qual alternativa o uso de "mas" e "mais" está correto?
  a: Estudei mais não consegui terminar o exercício.
  b: Quero mais atenção na leitura, mas ainda preciso treinar interpretação.
  c: Ela falou mas alto para ser ouvida.
  d: O professor explicou o conteúdo, mais ninguém anotou.
  e: Preciso de mas exemplos para entender a regra.
  correta: B
  explicacao: A alternativa B está correta porque "mais" indica intensidade ou quantidade, enquanto "mas" expressa oposição. Nas demais alternativas, as duas palavras foram trocadas de forma inadequada.
  +++

  @discursiva
  assunto: Gramática: uso de mas e mais
  tipo: discursiva curta
  enunciado: Explique a diferença entre "mas" e "mais" e escreva um exemplo com cada uma das palavras.
  resposta_esperada: "Mas" é uma conjunção adversativa e indica oposição, como em "Estudei, mas fiquei com dúvida". "Mais" indica quantidade, intensidade ou comparação, como em "Preciso de mais exercícios para treinar". Portanto, embora tenham som parecido, as duas palavras exercem funções diferentes na frase.
  criterios_de_correcao: Explicar que "mas" indica oposição; explicar que "mais" indica quantidade, intensidade ou comparação; apresentar um exemplo adequado com "mas"; apresentar um exemplo adequado com "mais".
  +++`;

  const $ = (seletor) => document.querySelector(seletor);

  const screenManager = createScreenManager({
    home: "#telaInicial",
    importacao: "#telaImportacao",
    resolucao: "#telaResolucao",
    resultado: "#telaResultado"
  });


  const estadoInicial = createInitialState;

  let estado = estadoInicial();
  let timerInterval = null;
  let timerRodando = true;
  let ultimoTick = Date.now();
  let saveTimeout = null;
  let substituicaoAutorizada = false;
  let importValidation = createImportValidationState();
  let importFileReadToken = 0;
  let modalPreviousFocus = null;
  let confirmationPreviousFocus = null;
  let confirmationResolver = null;
  const PERFORMANCE_FADE_OUT_MS = 440;

  let performanceScoreAnimationFrame = null;
  let performanceCloseTimeout = null;
  let filtroResultadoAtivo = RESULT_FILTERS.ALL;
  let questaoResultadoExpandidaId = null;
  let itensRevisaoResultado = [];
  let persistenceAtRisk = false;
  let persistenceErrorCode = null;
  let persistenceWarningDismissed = false;
  const resultadoAcoesMobileMedia = window.matchMedia("(max-width: 720px)");
  const resultadoFiltrosCompactosMedia = window.matchMedia("(max-width: 900px)");

  const entradaQuestoes = $("#entradaQuestoes");
  const arquivoQuestoes = $("#arquivoQuestoes");
  const nomeLista = $("#nomeLista");
  const mensagemImportacao = $("#mensagemImportacao");
  const statusResumo = $("#statusResumo");
  const indicadorSalvo = $("#indicadorSalvo");
  const btnImportar = $("#btnImportar");
  const btnValidar = $("#btnValidar");
  const nomeArquivoSelecionado = $("#nomeArquivoSelecionado");
  const avisoPersistencia = $("#avisoPersistencia");
  const tituloAvisoPersistencia = $("#tituloAvisoPersistencia");
  const descricaoAvisoPersistencia = $("#descricaoAvisoPersistencia");

  inicializar();

  function inicializar() {
    const storageInspection = inspectStorage();
    const persistenceReport = loadSession();
    carregarConfiguracoes();
    configurarEventos();
    sincronizarAcoesResultadoResponsivas();
    sincronizarFiltrosResultadoResponsivos();
    sincronizarSessaoFinalizadaComHistorico();
    trocarTela("home");
    atualizarHome();
    atualizarResumoTopo();
    comunicarResultadoPersistencia(persistenceReport);

    if (!storageInspection.writable) {
      registrarFalhaPersistencia(storageInspection.errorCode, storageInspection.error);
    }
  }

  function configurarEventos() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", alternarTema);
    });

    $("#btnTentarPersistencia")?.addEventListener("click", tentarRestaurarPersistencia);
    $("#btnFecharAvisoPersistencia")?.addEventListener("click", () => {
      persistenceWarningDismissed = true;
      avisoPersistencia?.classList.add("hidden");
    });
    window.addEventListener("beforeunload", protegerSaidaComPersistenciaEmRisco);

    $("#btnNovaResolucao")?.addEventListener("click", abrirNovaResolucao);
    $("#btnVoltarInicioImportacao")?.addEventListener("click", voltarAoInicioDaImportacao);

    $("#btnExemplo").addEventListener("click", () => {
      entradaQuestoes.value = exemploQuestoes;
      nomeLista.value = "Lista exemplo - Gramática";
      atualizarNomeArquivo("Exemplo interno");
      invalidarValidacaoImportacao("Exemplo carregado. Valide o conteúdo antes de começar.");
    });

    btnValidar.addEventListener("click", validarImportacao);
    $("#btnLimpar").addEventListener("click", () => limparCamposImportacao({ confirmar: true }));
    entradaQuestoes.addEventListener("input", () => {
      invalidarValidacaoImportacao("Conteúdo alterado. Valide novamente antes de começar.");
    });

    $("#btnAbrirModelo")?.addEventListener("click", abrirModalModelo);
    $("#btnFecharModelo")?.addEventListener("click", fecharModalModelo);
    $("#modalModelo")?.addEventListener("click", (evento) => {
      if (evento.target.matches("[data-fechar-modelo]")) {
        fecharModalModelo();
      }
    });

    $("#btnCancelarConfirmacao")?.addEventListener("click", () => fecharModalConfirmacao(false));
    $("#btnConfirmarAcao")?.addEventListener("click", () => fecharModalConfirmacao(true));
    $("#modalConfirmacao")?.addEventListener("click", (evento) => {
      if (evento.target.matches("[data-cancelar-confirmacao]")) {
        fecharModalConfirmacao(false);
      }
    });

    document.addEventListener("keydown", (evento) => {
      const modalConfirmacao = $("#modalConfirmacao");

      if (modalConfirmacao && !modalConfirmacao.classList.contains("hidden")) {
        if (evento.key === "Escape") {
          evento.preventDefault();
          fecharModalConfirmacao(false);
          return;
        }

        if (evento.key === "Tab") {
          manterFocoNoModal(evento, modalConfirmacao);
        }

        return;
      }

      const desempenho = $("#telaDesempenho");

      if (desempenho && !desempenho.classList.contains("hidden")) {
        if (evento.key === "Tab") {
          evento.preventDefault();
          $("#btnVerResultadoFinal")?.focus();
        }

        return;
      }

      const modal = $("#modalModelo");

      if (!modal || modal.classList.contains("hidden")) {
        return;
      }

      if (evento.key === "Escape") {
        evento.preventDefault();
        fecharModalModelo();
        return;
      }

      if (evento.key === "Tab") {
        manterFocoNoModal(evento, modal);
      }
    });

    arquivoQuestoes.addEventListener("change", async (evento) => {
      const arquivo = evento.target.files[0];
      const readToken = ++importFileReadToken;

      if (!arquivo) {
        atualizarNomeArquivo();
        return;
      }

      try {
        const texto = await arquivo.text();

        if (readToken !== importFileReadToken) {
          return;
        }

        entradaQuestoes.value = texto;
        atualizarNomeArquivo(arquivo.name);

        if (!nomeLista.value.trim()) {
          nomeLista.value = arquivo.name.replace(/\.[^/.]+$/, "");
        }

        invalidarValidacaoImportacao(`Arquivo “${arquivo.name}” carregado. Valide o conteúdo.`);
      } catch {
        if (readToken !== importFileReadToken) {
          return;
        }

        definirEstadoValidacao("invalid", {
          errors: ["Não foi possível ler o arquivo selecionado. Escolha outro arquivo TXT."]
        });
      }
    });

    btnImportar.addEventListener("click", importarQuestoes);
    $("#btnContinuarSessao").addEventListener("click", continuarSessao);
    $("#btnApagarSessao").addEventListener("click", apagarSessaoSalva);

    $("#btnAnterior").addEventListener("click", irAnterior);
    $("#btnProxima").addEventListener("click", irProxima);
    $("#btnFinalizar").addEventListener("click", finalizar);
    $("#btnFinalizarSessao")?.addEventListener("click", finalizar);
    $("#btnPausarTempo").addEventListener("click", alternarCronometro);
    $("#btnMarcarRevisao").addEventListener("click", alternarMarcacaoRevisao);

    $("#btnVoltarImportacao").addEventListener("click", voltarAoInicioComSessaoAtiva);

    $("#btnLimparProgressoResolucao")?.addEventListener("click", apagarSessaoSalva);

    $("#btnVerResultadoFinal")?.addEventListener("click", fecharDesempenho);
    $("#btnInicioResultado")?.addEventListener("click", voltarAoInicioAposResultado);
    $("#btnNovaLista")?.addEventListener("click", voltarAoInicioAposResultado);
    document.querySelectorAll("[data-result-filter]").forEach((button) => {
      button.addEventListener("click", () => selecionarFiltroResultado(button.dataset.resultFilter));
    });

    $("#listaRevisaoResultado")?.addEventListener("click", (evento) => {
      const button = evento.target.closest("[data-result-question-id]");

      if (button) {
        alternarCardResultado(button.dataset.resultQuestionId);
      }
    });

    $("#btnAlternarAcoesResultado")?.addEventListener("click", alternarAcoesResultado);
    resultadoAcoesMobileMedia.addEventListener?.("change", sincronizarAcoesResultadoResponsivas);

    $("#btnAlternarFiltrosResultado")?.addEventListener("click", alternarFiltrosResultado);
    resultadoFiltrosCompactosMedia.addEventListener?.("change", sincronizarFiltrosResultadoResponsivos);

    $("#btnBaixarTxt")?.addEventListener("click", baixarRespostasTxt);
    $("#btnBaixarAnotacoes")?.addEventListener("click", baixarAnotacoesTxt);
    $("#btnExportarJson")?.addEventListener("click", exportarJson);

    window.addEventListener("beforeunload", () => {
      registrarTempoAtual();
      salvarEstadoImediato();
    });

    document.addEventListener("visibilitychange", () => {
      // Evita que o temporizador acumule tempo quando a aba não está realmente em uso.
      ultimoTick = Date.now();
      if (!document.hidden) {
        atualizarTemposNaTela();
      }
      salvarEstadoImediato();
    });
  }

  async function limparCamposImportacao({ confirmar = false } = {}) {
    const possuiDados = Boolean(
      entradaQuestoes.value.trim() ||
      arquivoQuestoes.files?.length ||
      nomeLista.value.trim()
    );

    if (confirmar && possuiDados) {
      const confirmado = await solicitarConfirmacao(getClearImportConfirmation());

      if (!confirmado) {
        return false;
      }
    }

    importFileReadToken += 1;
    entradaQuestoes.value = "";
    arquivoQuestoes.value = "";
    nomeLista.value = "";
    $("#opcaoEmbaralhar").checked = false;
    $("#opcaoMostrarGabaritoFinal").checked = true;
    atualizarNomeArquivo();
    importValidation = createImportValidationState();
    definirEstadoValidacao("idle");
    return true;
  }

  function solicitarConfirmacao({
    label = "Confirmar ação",
    title = "Deseja continuar?",
    message = "Confirme para continuar com esta ação.",
    items = [],
    note = "",
    confirmText = "Confirmar",
    variant = "primary"
  } = {}) {
    const modal = $("#modalConfirmacao");

    if (!modal) {
      return Promise.resolve(false);
    }

    if (confirmationResolver) {
      fecharModalConfirmacao(false);
    }

    registrarTempoAtual();
    ultimoTick = Date.now();
    confirmationPreviousFocus = document.activeElement;
    $("#rotuloModalConfirmacao").textContent = label;
    $("#tituloModalConfirmacao").textContent = title;
    $("#descricaoModalConfirmacao").textContent = message;

    const summaryList = $("#listaModalConfirmacao");
    const noteElement = $("#notaModalConfirmacao");
    const normalizedItems = Array.isArray(items) ? items : [];

    summaryList.replaceChildren();

    normalizedItems.forEach((item) => {
      const normalizedItem =
        typeof item === "string"
          ? { label: item, value: "", tone: "neutral" }
          : item || {};

      const listItem = document.createElement("li");
      const itemTone = ["success", "warning", "review", "neutral"].includes(normalizedItem.tone)
        ? normalizedItem.tone
        : "neutral";

      listItem.className =
        `confirmation-modal__summary-item confirmation-modal__summary-item--${itemTone}`;

      const itemLabel = document.createElement("span");
      itemLabel.className = "confirmation-modal__summary-label";
      itemLabel.textContent = String(normalizedItem.label || "");

      const itemValue = document.createElement("strong");
      itemValue.className = "confirmation-modal__summary-value";
      itemValue.textContent = String(normalizedItem.value ?? "");

      listItem.append(itemLabel, itemValue);
      summaryList.append(listItem);
    });

    summaryList.classList.toggle("hidden", normalizedItems.length === 0);
    noteElement.textContent = note;
    noteElement.classList.toggle("hidden", !note);

    const confirmButton = $("#btnConfirmarAcao");
    confirmButton.textContent = confirmText;
    confirmButton.classList.remove(
      "confirmation-modal__confirm--danger",
      "confirmation-modal__confirm--warning"
    );

    if (variant === "danger") {
      confirmButton.classList.add("confirmation-modal__confirm--danger");
    } else if (variant === "warning") {
      confirmButton.classList.add("confirmation-modal__confirm--warning");
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
      $("#btnCancelarConfirmacao")?.focus();
    });

    return new Promise((resolve) => {
      confirmationResolver = resolve;
    });
  }

  function fecharModalConfirmacao(confirmado) {
    const modal = $("#modalConfirmacao");

    if (!modal || modal.classList.contains("hidden")) {
      return;
    }

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");

    if ($("#modalModelo")?.classList.contains("hidden")) {
      document.body.classList.remove("modal-open");
    }

    const resolver = confirmationResolver;
    confirmationResolver = null;

    const focusTarget =
      confirmationPreviousFocus instanceof HTMLElement &&
      confirmationPreviousFocus.isConnected
        ? confirmationPreviousFocus
        : null;

    confirmationPreviousFocus = null;
    ultimoTick = Date.now();
    focusTarget?.focus();
    resolver?.(Boolean(confirmado));
  }

  function abrirModalModelo() {
    const modal = $("#modalModelo");
    if (!modal) return;

    modalPreviousFocus = document.activeElement;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#btnFecharModelo")?.focus();
  }

  function fecharModalModelo() {
    const modal = $("#modalModelo");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    const focusTarget = modalPreviousFocus instanceof HTMLElement && modalPreviousFocus.isConnected
      ? modalPreviousFocus
      : $("#btnAbrirModelo");

    focusTarget?.focus();
    modalPreviousFocus = null;
  }

  function manterFocoNoModal(evento, modal) {
    const focusable = [...modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hasAttribute("hidden"));

    if (!focusable.length) {
      evento.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (evento.shiftKey && document.activeElement === first) {
      evento.preventDefault();
      last.focus();
    } else if (!evento.shiftKey && document.activeElement === last) {
      evento.preventDefault();
      first.focus();
    }
  }


  function carregarConfiguracoes() {
    const config = loadSettings();
    aplicarTema(config.tema || "light");
  }

  function salvarConfiguracoes() {
    const configAtual = loadSettings();
    const result = saveSettings({
      ...configAtual,
      tema: document.body.dataset.theme || "light"
    });

    if (!result.ok) {
      registrarFalhaPersistencia(result.errorCode, result.error);
    }
  }

  function aplicarTema(tema) {
    document.body.dataset.theme = tema;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = tema === "dark" ? "☀️ Tema" : "🌙 Tema";
      button.setAttribute(
        "aria-label",
        tema === "dark" ? "Alternar para tema claro" : "Alternar para tema escuro"
      );
    });
  }

  function alternarTema() {
    aplicarTema(document.body.dataset.theme === "dark" ? "light" : "dark");
    salvarConfiguracoes();
  }

  function verificarSessaoSalva() {
    atualizarHome();
  }

  function obterSessaoSalva() {
    return loadSession().session;
  }

  function continuarSessao() {
    const salva = obterSessaoAtiva();

    if (!salva) {
      mostrarMensagemInicial("Não encontrei uma sessão em andamento para continuar.");
      atualizarHome();
      return;
    }

    estado = restoreActiveSession(salva);
    timerRodando = !Boolean(estado.temporizadorPausado);
    atualizarBotaoCronometro();
    trocarTela("resolucao");
    renderizarQuestao();
    iniciarCronometro();
    atualizarResumoTopo();
  }

  async function apagarSessaoSalva() {
    const confirmado = await solicitarConfirmacao(getDeleteSessionConfirmation());

    if (!confirmado) return;

    pararCronometro();
    const removida = clearSession();

    if (!removida) {
      const inspection = inspectStorage();
      registrarFalhaPersistencia(inspection.errorCode, inspection.error);
      return;
    }

    resolverFalhaPersistencia();
    estado = estadoInicial();
    limparCamposImportacao();
    atualizarResumoTopo();
    trocarTela("home");
    atualizarHome();
    mostrarMensagemInicial("Progresso da sessão apagado.", "ok");
  }

  async function validarImportacao() {
    const texto = entradaQuestoes.value.trim();

    if (!texto) {
      definirEstadoValidacao("invalid", {
        errors: ["Cole as questões ou selecione um arquivo TXT antes de validar."]
      });
      entradaQuestoes.focus();
      return;
    }

    definirEstadoValidacao("loading");
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      const questions = parseQuestions(texto);
      const summary = summarizeQuestions(questions);

      importValidation = {
        status: "valid",
        snapshot: texto,
        questions,
        summary,
        errors: []
      };

      definirEstadoValidacao("valid", { questions, summary });
    } catch (error) {
      const errors = error instanceof QuestionImportError
        ? error.issues
        : [error instanceof Error ? error.message : String(error)];

      importValidation = {
        ...createImportValidationState(),
        status: "invalid",
        errors
      };

      definirEstadoValidacao("invalid", { errors });
    }
  }

  async function importarQuestoes() {
    const texto = entradaQuestoes.value.trim();

    if (!texto) {
      definirEstadoValidacao("invalid", {
        errors: ["Cole as questões ou selecione um arquivo TXT antes de começar."]
      });
      return;
    }

    if (importValidation.status !== "valid" || importValidation.snapshot !== texto) {
      invalidarValidacaoImportacao("O conteúdo precisa ser validado antes de começar.");
      return;
    }

    const sessaoExistente = obterSessaoAtiva();
    if (sessaoExistente?.questoes?.length && !substituicaoAutorizada) {
      const confirmado = await solicitarConfirmacao(getReplaceSessionConfirmation());

      if (!confirmado) {
        return;
      }
    }

    try {
      estado = createActiveSession({
        questions: importValidation.questions,
        listName: nomeLista.value,
        showAnswerKey: $("#opcaoMostrarGabaritoFinal").checked,
        shuffleQuestions: $("#opcaoEmbaralhar").checked
      });
      substituicaoAutorizada = false;

      timerRodando = true;
      atualizarBotaoCronometro();
      salvarEstadoImediato();
      verificarSessaoSalva();
      atualizarResumoTopo();

      trocarTela("resolucao");
      renderizarQuestao();
      iniciarCronometro();
    } catch (error) {
      definirEstadoValidacao("invalid", {
        errors: [error instanceof Error ? error.message : String(error)]
      });
    }
  }

  function renderizarQuestao({ registrarTempo = true, focarTitulo = false } = {}) {
    if (registrarTempo) {
      registrarTempoAtual();
    }

    ultimoTick = Date.now();

    const questao = estado.questoes[estado.atual];
    if (!questao) return;

    const total = estado.questoes.length;
    const numero = estado.atual + 1;
    const progresso = total ? Math.round((numero / total) * 100) : 0;
    const marcadaParaRevisao = Boolean(estado.revisao[questao.id]);

    $("#nomeListaResolucao").textContent = estado.listaNome || "Lista sem nome";
    $("#nomeListaResolucao").title = estado.listaNome || "Lista sem nome";
    $("#contadorQuestao").textContent = `Questão ${numero} de ${total}`;
    $("#percentualProgresso").textContent = `${progresso}%`;
    $("#barraProgresso").style.width = `${progresso}%`;
    $("#progressoResolucao")?.setAttribute("aria-valuenow", String(progresso));

    $("#numeroQuestao").textContent = `Questão ${numero}`;
    $("#tipoQuestao").textContent = questao.categoria === "objetiva" ? "Objetiva" : "Discursiva";
    $("#assuntoQuestao").textContent = questao.assunto || "Sem assunto";
    $("#assuntoQuestao").title = questao.assunto || "Sem assunto";
    $("#enunciadoQuestao").textContent = questao.enunciado;

    $("#revisaoQuestao").classList.toggle("hidden", !marcadaParaRevisao);
    $("#btnMarcarRevisao").textContent = marcadaParaRevisao ? "Desmarcar revisão" : "Marcar revisão";
    $("#btnMarcarRevisao").classList.toggle("is-active", marcadaParaRevisao);
    $("#btnMarcarRevisao").setAttribute("aria-pressed", String(marcadaParaRevisao));

    if (questao.categoria === "objetiva") {
      renderizarObjetiva(questao);
    } else {
      renderizarDiscursiva(questao);
    }

    $("#anotacaoQuestao").value = estado.anotacoes[questao.id] || "";
    $("#anotacaoQuestao").oninput = (evento) => {
      estado.anotacoes[questao.id] = evento.target.value;
      salvarEstadoDebounced();
    };

    const ultimaQuestao = estado.atual === total - 1;
    $("#btnAnterior").disabled = estado.atual === 0;
    $("#btnProxima").classList.toggle("hidden", ultimaQuestao);
    $("#btnFinalizar").classList.toggle("hidden", !ultimaQuestao);
    $("#btnFinalizarSessao")?.classList.toggle("hidden", ultimaQuestao);

    renderizarMapa();
    atualizarTemposNaTela();
    atualizarBotaoCronometro();
    atualizarResumoTopo();
    salvarEstadoDebounced();

    if (focarTitulo) {
      requestAnimationFrame(() => $("#tituloResolverQuestao")?.focus({ preventScroll: true }));
    }
  }

  function renderizarObjetiva(questao) {
    const alternativas = getObjectiveAlternatives(questao);
    const respostaAtual = resolveObjectiveAnswerId(
      questao,
      estado.respostas[questao.id]
    );
    const marcacoes = estado.marcacoesAlternativas[questao.id] || {};

    $("#areaResposta").innerHTML = `
      <fieldset class="resolution-objective-options">
        <legend class="sr-only">Selecione uma alternativa como resposta oficial</legend>
        ${alternativas.map((alternativa, indice) => {
          const letra = getAlternativeDisplayLetter(questao, alternativa.id);
          const selected = respostaAtual === alternativa.id;
          const markerState = normalizeMarkerState(marcacoes[alternativa.id]);
          const markerInfo = getMarkerInfo(markerState, letra);
          const inputId = `resposta-${questao.id}-${indice + 1}`;

          return `
            <div class="resolution-option-card ${selected ? "is-selected" : ""} ${markerState === MARKER_STATES.ANALYSIS ? "is-analysis" : ""} ${markerState === MARKER_STATES.ELIMINATED ? "is-eliminated" : ""}">
              <input
                id="${escapeHtml(inputId)}"
                class="resolution-option-radio"
                type="radio"
                name="respostaObjetiva"
                value="${escapeHtml(alternativa.id)}"
                ${selected ? "checked" : ""}
              >
              <label class="resolution-option-answer" for="${escapeHtml(inputId)}">
                <span class="resolution-option-letter">${escapeHtml(letra)})</span>
                <span class="resolution-option-text">${escapeHtml(alternativa.texto)}</span>
              </label>
              <button
                class="resolution-option-marker"
                type="button"
                data-alternative-id="${escapeHtml(alternativa.id)}"
                data-marker-state="${markerState}"
                title="${escapeHtml(markerInfo.title)}"
                aria-label="${escapeHtml(markerInfo.label)}"
              >
                <span aria-hidden="true">${markerInfo.icon}</span>
              </button>
            </div>
          `;
        }).join("")}
        <p class="resolution-marker-legend">
          O card define a resposta oficial. O botão lateral alterna entre sem marcação, em análise e eliminada.
        </p>
      </fieldset>
    `;

    document.querySelectorAll("input[name='respostaObjetiva']").forEach((input) => {
      input.addEventListener("change", (evento) => {
        const alternativeId = evento.target.value;
        estado.respostas[questao.id] = alternativeId;

        if (estado.marcacoesAlternativas[questao.id]?.[alternativeId]) {
          delete estado.marcacoesAlternativas[questao.id][alternativeId];
          limparMarcacoesVazias(questao.id);
        }

        renderizarObjetiva(questao);
        renderizarMapa();
        atualizarResumoTopo();
        salvarEstadoImediato();

        requestAnimationFrame(() => {
          Array.from(document.querySelectorAll("input[name='respostaObjetiva']"))
            .find((item) => item.value === alternativeId)
            ?.focus();
        });
      });
    });

    document.querySelectorAll(".resolution-option-marker").forEach((button) => {
      button.addEventListener("click", () => {
        alternarMarcadorAlternativa(questao, button.dataset.alternativeId);
      });
    });
  }

  function renderizarDiscursiva(questao) {
    const respostaAtual = estado.respostas[questao.id] || "";

    $("#areaResposta").innerHTML = `
      <label class="resolution-discursive-field" for="respostaDiscursiva">
        <span>Sua resposta</span>
        <textarea
          class="resolution-discursive-textarea"
          id="respostaDiscursiva"
          placeholder="Responda aqui..."
          spellcheck="true"
        >${escapeHtml(respostaAtual)}</textarea>
      </label>
    `;

    $("#respostaDiscursiva").addEventListener("input", (evento) => {
      const estavaRespondida = isQuestionAnswered(estado.respostas[questao.id]);
      estado.respostas[questao.id] = evento.target.value;
      const estaRespondida = isQuestionAnswered(estado.respostas[questao.id]);

      if (estavaRespondida !== estaRespondida) {
        renderizarMapa();
      }

      atualizarResumoTopo();
      salvarEstadoDebounced();
    });
  }

  function renderizarMapa() {
    const mapa = $("#listaNavegacao");

    mapa.innerHTML = estado.questoes.map((questao, indice) => {
      const respondida = isQuestionAnswered(estado.respostas[questao.id]);
      const atual = indice === estado.atual;
      const revisao = Boolean(estado.revisao[questao.id]);
      const ariaLabel = buildQuestionMapLabel({ number: indice + 1, current: atual, answered: respondida, review: revisao });

      return `
        <button
          class="resolution-map-button ${respondida ? "is-answered" : ""} ${atual ? "is-current" : ""} ${revisao ? "is-review" : ""}"
          type="button"
          data-indice="${indice}"
          aria-label="${escapeHtml(ariaLabel)}"
          ${atual ? 'aria-current="step"' : ""}
          title="Ir para a questão ${indice + 1}"
        >
          ${indice + 1}
        </button>
      `;
    }).join("");

    mapa.querySelectorAll(".resolution-map-button").forEach((button) => {
      button.addEventListener("click", () => {
        irParaQuestao(Number(button.dataset.indice), { focarTitulo: true });
      });
    });

    requestAnimationFrame(() => {
      mapa.querySelector(".resolution-map-button.is-current")?.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    });
  }

  function irAnterior() {
    if (estado.atual > 0) {
      irParaQuestao(estado.atual - 1, { focarTitulo: true });
    }
  }

  function irProxima() {
    if (estado.atual < estado.questoes.length - 1) {
      irParaQuestao(estado.atual + 1, { focarTitulo: true });
    }
  }

  function irParaQuestao(indice, { focarTitulo = false } = {}) {
    if (!Number.isInteger(indice) || indice < 0 || indice >= estado.questoes.length) {
      return;
    }

    registrarTempoAtual();
    estado.atual = indice;
    renderizarQuestao({ registrarTempo: false, focarTitulo });
  }

  function alternarMarcadorAlternativa(questao, alternativeId) {
    const proximo = getNextMarkerState(
      estado.marcacoesAlternativas[questao.id]?.[alternativeId]
    );

    estado.marcacoesAlternativas[questao.id] ||= {};

    if (proximo === MARKER_STATES.NEUTRAL) {
      delete estado.marcacoesAlternativas[questao.id][alternativeId];
      limparMarcacoesVazias(questao.id);
    } else {
      estado.marcacoesAlternativas[questao.id][alternativeId] = proximo;
    }

    renderizarObjetiva(questao);
    salvarEstadoImediato();

    requestAnimationFrame(() => {
      Array.from(document.querySelectorAll(".resolution-option-marker"))
        .find((item) => item.dataset.alternativeId === alternativeId)
        ?.focus();
    });
  }

  function limparMarcacoesVazias(questaoId) {
    if (Object.keys(estado.marcacoesAlternativas[questaoId] || {}).length === 0) {
      delete estado.marcacoesAlternativas[questaoId];
    }
  }

  function alternarMarcacaoRevisao() {
    const questao = estado.questoes[estado.atual];
    if (!questao) return;

    estado.revisao[questao.id] = !estado.revisao[questao.id];

    if (!estado.revisao[questao.id]) {
      delete estado.revisao[questao.id];
    }

    renderizarQuestao();
    salvarEstadoImediato();
  }

  async function finalizar() {
    registrarTempoAtual();
    salvarEstadoImediato();

    const r = calcularResultado(estado);
    const marcadas = Object.values(estado.revisao || {}).filter(Boolean).length;
    const confirmado = await solicitarConfirmacao(
      getFinishSessionConfirmation(r, marcadas)
    );

    if (!confirmado) {
      return;
    }

    estado = finishSession(estado);

    const resultadoFinal = calcularResultado(estado);

    salvarEstadoImediato();
    registrarResultadoNoHistorico(estado, resultadoFinal);
    pararCronometro();

    if (shouldShowPerformanceScreen(resultadoFinal.objetivas)) {
      abrirResultadoFinal({ focar: false });
      mostrarDesempenho(resultadoFinal);
    } else {
      abrirResultadoFinal();
    }

    atualizarHome();
  }

  function iniciarCronometro() {
    pararCronometro();
    ultimoTick = Date.now();

    timerInterval = setInterval(() => {
      registrarTempoAtual();
      atualizarTemposNaTela();
      salvarEstadoDebounced();
    }, 1000);
  }

  function pararCronometro() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function cronometroPodeContar() {
    const telaResolucaoAtiva = screenManager.isActive("resolucao");

    return (
      timerRodando &&
      Boolean(timerInterval) &&
      telaResolucaoAtiva &&
      estado.questoes.length > 0 &&
      !estado.finalizadoEm &&
      !document.hidden &&
      !document.body.classList.contains("modal-open")
    );
  }

  function registrarTempoAtual() {
    if (!cronometroPodeContar()) {
      ultimoTick = Date.now();
      return;
    }

    const questao = estado.questoes[estado.atual];
    if (!questao) {
      ultimoTick = Date.now();
      return;
    }

    const agora = Date.now();

    // Limite de segurança para não somar grandes saltos causados por aba suspensa,
    // travamento momentâneo do navegador ou troca de tela fora da resolução.
    const delta = Math.min(Math.max(0, agora - ultimoTick), 5000);

    estado.temposMs[questao.id] = (estado.temposMs[questao.id] || 0) + delta;
    ultimoTick = agora;
  }

  function alternarCronometro() {
    registrarTempoAtual();
    timerRodando = !timerRodando;
    estado.temporizadorPausado = !timerRodando;
    ultimoTick = Date.now();
    atualizarBotaoCronometro();
    salvarEstadoImediato();
  }

  function atualizarBotaoCronometro() {
    const pausado = !timerRodando;
    const button = $("#btnPausarTempo");
    const status = $("#statusCronometro");

    button.textContent = pausado ? "Retomar tempo" : "Pausar tempo";
    button.classList.toggle("is-paused", pausado);
    button.setAttribute("aria-pressed", String(pausado));

    status.textContent = pausado ? "Pausado" : "Rodando";
    status.classList.toggle("is-paused", pausado);
  }

  function atualizarTemposNaTela() {
    const questao = estado.questoes[estado.atual];
    const tempoAtual = questao ? estado.temposMs[questao.id] || 0 : 0;
    const total = calcularTempoTotal(estado);

    $("#tempoAtual").textContent = formatarTempo(tempoAtual);
    $("#tempoTotal").textContent = formatarTempo(total);
  }

  function renderizarDesempenho(resultado) {
    const tela = $("#telaDesempenho");
    const state = getPerformanceState(resultado?.percentual);

    if (!tela) {
      return state;
    }

    tela.classList.remove(...PERFORMANCE_STATE_CLASSES);
    tela.classList.add(state.className);
    tela.dataset.performanceState = state.key;
    document.body.dataset.performanceState = state.key;

    $("#valorDesempenho").textContent = String(state.percentage);
    $("#tituloDesempenho").textContent = state.title;
    $("#subtituloDesempenho").textContent = state.subtitle;
    $("#detalheDesempenho").textContent = formatPerformanceBasis(
      resultado?.acertos,
      resultado?.objetivas
    );
    $("#btnVerResultadoFinal").textContent = state.buttonLabel;
    $("#blocoPontuacaoDesempenho").setAttribute(
      "aria-label",
      `Desempenho geral de ${state.percentage} por cento`
    );

    return state;
  }

  function mostrarDesempenho(resultado) {
    const tela = $("#telaDesempenho");
    const state = renderizarDesempenho(resultado);

    if (!tela || !state) {
      return;
    }

    if (performanceCloseTimeout) {
      clearTimeout(performanceCloseTimeout);
      performanceCloseTimeout = null;
    }

    cancelAnimationFrame(performanceScoreAnimationFrame);

    tela.classList.remove("hidden", "is-visible", "is-leaving");
    tela.setAttribute("aria-hidden", "false");
    document.body.classList.add("performance-open", "performance-transitioning");
    screenManager.elements.resultado?.setAttribute("inert", "");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scoreElement = $("#valorDesempenho");

    if (scoreElement) {
      scoreElement.textContent = prefersReducedMotion ? String(state.percentage) : "0";
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tela.classList.add("is-visible");
        document.body.classList.remove("performance-transitioning");

        if (!prefersReducedMotion) {
          animarPontuacaoDesempenho(state.percentage);
        }

        window.setTimeout(() => {
          $("#tituloDesempenho")?.focus();
        }, prefersReducedMotion ? 0 : 460);
      });
    });
  }

  function animarPontuacaoDesempenho(percentualFinal) {
    const elemento = $("#valorDesempenho");

    if (!elemento) {
      return;
    }

    cancelAnimationFrame(performanceScoreAnimationFrame);

    const inicio = performance.now();
    const duracao = 820;

    function atualizar(agora) {
      const progresso = Math.min(1, (agora - inicio) / duracao);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      elemento.textContent = String(Math.round(percentualFinal * suavizado));

      if (progresso < 1) {
        performanceScoreAnimationFrame = requestAnimationFrame(atualizar);
      } else {
        elemento.textContent = String(percentualFinal);
      }
    }

    performanceScoreAnimationFrame = requestAnimationFrame(atualizar);
  }

  function fecharDesempenho() {
    const tela = $("#telaDesempenho");
    const botao = $("#btnVerResultadoFinal");

    if (!tela || tela.classList.contains("hidden") || tela.classList.contains("is-leaving")) {
      return;
    }

    cancelAnimationFrame(performanceScoreAnimationFrame);
    botao?.setAttribute("disabled", "");
    tela.classList.add("is-leaving");
    tela.classList.remove("is-visible");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalizarFechamento = () => {
      tela.classList.add("hidden");
      tela.classList.remove("is-leaving");
      tela.setAttribute("aria-hidden", "true");
      botao?.removeAttribute("disabled");
      document.body.classList.remove("performance-open", "performance-transitioning");
      delete document.body.dataset.performanceState;
      screenManager.elements.resultado?.removeAttribute("inert");
      $("#tituloResultadoFinal")?.focus();
      performanceCloseTimeout = null;
    };

    if (prefersReducedMotion) {
      finalizarFechamento();
      return;
    }

    performanceCloseTimeout = window.setTimeout(finalizarFechamento, PERFORMANCE_FADE_OUT_MS);
  }

  function ocultarDesempenhoImediato() {
    const tela = $("#telaDesempenho");

    cancelAnimationFrame(performanceScoreAnimationFrame);

    if (performanceCloseTimeout) {
      clearTimeout(performanceCloseTimeout);
      performanceCloseTimeout = null;
    }

    tela?.classList.add("hidden");
    tela?.classList.remove("is-visible", "is-leaving");
    tela?.setAttribute("aria-hidden", "true");
    $("#btnVerResultadoFinal")?.removeAttribute("disabled");
    document.body.classList.remove("performance-open", "performance-transitioning");
    delete document.body.dataset.performanceState;
    screenManager.elements.resultado?.removeAttribute("inert");
  }

  function abrirResultadoFinal({ focar = true } = {}) {
    filtroResultadoAtivo = RESULT_FILTERS.ALL;
    questaoResultadoExpandidaId = null;
    trocarTela("resultado");
    renderizarResultado();

    if (focar) {
      requestAnimationFrame(() => $("#tituloResultadoFinal")?.focus());
    }
  }

  function renderizarResultado() {
    const resultado = calcularResultado(estado);
    const nomeDaLista = estado.listaNome || "Lista sem nome";
    const nomeListaElement = $("#nomeListaResultado");

    if (nomeListaElement) {
      nomeListaElement.textContent = nomeDaLista;
      nomeListaElement.title = nomeDaLista;
    }

    $("#resultadoRespondidas").textContent = `${resultado.respondidas}/${resultado.total}`;
    $("#resultadoCorretas").textContent = resultado.objetivas > 0
      ? `${resultado.acertos}/${resultado.objetivas}`
      : "—";
    $("#resultadoTempoTotal").textContent = formatarTempo(resultado.tempoTotal);
    $("#resultadoDesempenho").textContent = resultado.objetivas > 0
      ? `${resultado.percentual}%`
      : "—";
    $("#resultadoRevisao").textContent = String(resultado.marcadas);
    $("#resultadoTempoMedio").textContent = formatarTempo(resultado.tempoMedio);

    $("#avisoResultadoDiscursivas")?.classList.toggle("hidden", resultado.discursivas === 0);

    recolherAcoesResultadoMobile();
    renderizarResumoPorAssunto();

    itensRevisaoResultado = buildQuestionReviewItems({
      questions: estado.questoes,
      answers: estado.respostas,
      notes: estado.anotacoes,
      timesMs: estado.temposMs,
      review: estado.revisao,
      showAnswerKey: estado.opcoes.mostrarGabaritoFinal
    });

    atualizarBotoesFiltroResultado();
    renderizarListaRevisaoResultado();
    atualizarResumoTopo();
  }

  function alternarAcoesResultado() {
    const button = $("#btnAlternarAcoesResultado");

    if (!button || !resultadoAcoesMobileMedia.matches) {
      return;
    }

    button.dataset.mobileOpen = String(button.dataset.mobileOpen !== "true");
    sincronizarAcoesResultadoResponsivas();
  }

  function recolherAcoesResultadoMobile() {
    const button = $("#btnAlternarAcoesResultado");

    if (button) {
      button.dataset.mobileOpen = "false";
    }

    sincronizarAcoesResultadoResponsivas();
  }

  function sincronizarAcoesResultadoResponsivas() {
    const button = $("#btnAlternarAcoesResultado");
    const actions = $("#acoesExportacaoResultado");

    if (!button || !actions) {
      return;
    }

    const mobile = resultadoAcoesMobileMedia.matches;
    const expanded = !mobile || button.dataset.mobileOpen === "true";

    button.hidden = !mobile;
    button.setAttribute("aria-expanded", String(expanded));
    actions.classList.toggle("is-open", expanded);

    if (mobile && !expanded) {
      actions.setAttribute("inert", "");
      actions.setAttribute("aria-hidden", "true");
    } else {
      actions.removeAttribute("inert");
      actions.removeAttribute("aria-hidden");
    }
  }

  function alternarFiltrosResultado() {
    const button = $("#btnAlternarFiltrosResultado");

    if (!button || !resultadoFiltrosCompactosMedia.matches) {
      return;
    }

    button.dataset.compactOpen = String(button.dataset.compactOpen !== "true");
    sincronizarFiltrosResultadoResponsivos();
  }

  function recolherFiltrosResultadoCompactos() {
    const button = $("#btnAlternarFiltrosResultado");

    if (button) {
      button.dataset.compactOpen = "false";
    }

    sincronizarFiltrosResultadoResponsivos();
  }

  function sincronizarFiltrosResultadoResponsivos() {
    const button = $("#btnAlternarFiltrosResultado");
    const filters = $("#filtrosResultado");

    if (!button || !filters) {
      return;
    }

    const compact = resultadoFiltrosCompactosMedia.matches;
    const expanded = !compact || button.dataset.compactOpen === "true";

    button.hidden = !compact;
    button.setAttribute("aria-expanded", String(expanded));
    filters.classList.toggle("is-open", expanded);

    if (compact && !expanded) {
      filters.setAttribute("inert", "");
      filters.setAttribute("aria-hidden", "true");
    } else {
      filters.removeAttribute("inert");
      filters.removeAttribute("aria-hidden");
    }
  }

  function renderizarResumoPorAssunto() {
    const container = $("#listaDesempenhoAssuntos");

    if (!container) {
      return;
    }

    const assuntos = buildSubjectResultItems({
      questions: estado.questoes,
      answers: estado.respostas,
      timesMs: estado.temposMs
    });

    if (assuntos.length === 0) {
      container.innerHTML = `
        <div class="results-empty-state">
          <strong>Nenhum assunto encontrado.</strong>
          <p>A lista finalizada não possui assuntos para resumir.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = assuntos.map((item) => {
      const possuiObjetivas = item.objectives > 0;
      const percentual = possuiObjetivas ? item.percentage : null;
      const tone = getSubjectPerformanceTone(percentual);
      const meta = possuiObjetivas
        ? `${item.correct}/${item.objectives} objetivas • ${formatarTempo(item.timeMs)}`
        : `Sem questões objetivas • ${formatarTempo(item.timeMs)}`;
      const progress = possuiObjetivas
        ? `
          <div
            class="subject-result-progress"
            role="progressbar"
            aria-label="Desempenho em ${escapeHtml(item.subject)}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${percentual}"
          >
            <div class="subject-result-progress__value" style="--subject-percentage: ${percentual}%;"></div>
          </div>
        `
        : "";

      return `
        <article class="subject-result-item" data-tone="${tone}">
          <div class="subject-result-item__header">
            <strong title="${escapeHtml(item.subject)}">${escapeHtml(item.subject)}</strong>
            <span class="subject-result-item__percentage">${possuiObjetivas ? `${percentual}%` : "—"}</span>
          </div>
          <p class="subject-result-item__meta">${meta}</p>
          ${progress}
        </article>
      `;
    }).join("");
  }

  function selecionarFiltroResultado(filter) {
    const proximoFiltro = normalizeResultFilter(filter);

    if (proximoFiltro === filtroResultadoAtivo) {
      if (resultadoFiltrosCompactosMedia.matches) {
        recolherFiltrosResultadoCompactos();
      }
      return;
    }

    filtroResultadoAtivo = proximoFiltro;
    questaoResultadoExpandidaId = null;
    atualizarBotoesFiltroResultado();
    renderizarListaRevisaoResultado();

    if (resultadoFiltrosCompactosMedia.matches) {
      recolherFiltrosResultadoCompactos();
    }
  }

  function atualizarBotoesFiltroResultado() {
    document.querySelectorAll("[data-result-filter]").forEach((button) => {
      const ativo = button.dataset.resultFilter === filtroResultadoAtivo;
      button.classList.toggle("is-active", ativo);
      button.setAttribute("aria-pressed", String(ativo));
    });

    const labels = {
      [RESULT_FILTERS.ALL]: "Todas",
      [RESULT_FILTERS.INCORRECT]: "Erradas",
      [RESULT_FILTERS.DISCURSIVE]: "Discursivas",
      [RESULT_FILTERS.REVIEW]: "Revisão",
      [RESULT_FILTERS.UNANSWERED]: "Não respondidas"
    };
    const currentLabel = $("#textoFiltroResultadoAtual");

    if (currentLabel) {
      currentLabel.textContent = `Filtros: ${labels[filtroResultadoAtivo] || labels[RESULT_FILTERS.ALL]}`;
    }

    sincronizarFiltrosResultadoResponsivos();
  }

  function alternarCardResultado(questionId) {
    if (!questionId) {
      return;
    }

    questaoResultadoExpandidaId = questaoResultadoExpandidaId === questionId
      ? null
      : questionId;

    renderizarListaRevisaoResultado({
      focusQuestionId: questionId,
      scrollIntoView: Boolean(questaoResultadoExpandidaId)
    });
  }

  function renderizarListaRevisaoResultado({ focusQuestionId = null, scrollIntoView = false } = {}) {
    const container = $("#listaRevisaoResultado");

    if (!container) {
      return;
    }

    const itensFiltrados = filterQuestionReviewItems(
      itensRevisaoResultado,
      filtroResultadoAtivo
    );

    if (!itensFiltrados.some((item) => item.id === questaoResultadoExpandidaId)) {
      questaoResultadoExpandidaId = null;
    }

    if (itensFiltrados.length === 0) {
      container.innerHTML = criarEstadoVazioResultado(filtroResultadoAtivo);
      return;
    }

    container.innerHTML = itensFiltrados
      .map((item) => renderizarCardResultado(item, item.id === questaoResultadoExpandidaId))
      .join("");

    if (!focusQuestionId) {
      return;
    }

    requestAnimationFrame(() => {
      const button = Array.from(
        container.querySelectorAll("[data-result-question-id]")
      ).find((item) => item.dataset.resultQuestionId === focusQuestionId);

      button?.focus({ preventScroll: true });

      if (scrollIntoView) {
        button?.closest(".result-review-card")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest"
        });
      }
    });
  }

  function renderizarCardResultado(item, expanded) {
    const presentation = obterApresentacaoStatusResultado(item);
    const markedClass = item.markedForReview ? " is-marked" : "";
    const expandedClass = expanded ? " is-expanded" : "";
    const detailsId = `detalhes-resultado-${item.id}`;
    const reviewText = item.markedForReview ? " • ★ Marcada para revisão" : "";

    return `
      <article
        class="result-review-card${markedClass}${expandedClass}"
        data-status="${presentation.statusAttribute}"
      >
        <button
          class="result-review-card__summary"
          type="button"
          data-result-question-id="${escapeHtml(item.id)}"
          aria-expanded="${expanded}"
          aria-controls="${detailsId}"
          aria-label="Questão ${item.number}, ${item.typeLabel.toLowerCase()}, ${presentation.spokenLabel}${item.markedForReview ? ", marcada para revisão" : ""}, tempo ${formatarTempo(item.timeMs)}"
        >
          <span class="result-review-card__number">${String(item.number).padStart(2, "0")}</span>
          <span class="result-review-card__meta">
            <strong>${item.typeLabel} • ${escapeHtml(item.subject)}</strong>
            <span class="result-review-card__status">${presentation.icon} ${presentation.label} • ${formatarTempo(item.timeMs)}${reviewText}</span>
          </span>
          <span class="result-review-card__toggle" aria-hidden="true">▶</span>
        </button>

        ${expanded ? renderizarDetalhesResultado(item, detailsId) : ""}
      </article>
    `;
  }

  function obterApresentacaoStatusResultado(item) {
    if (item.status === "correct") {
      return {
        statusAttribute: "correct",
        icon: "✓",
        label: "Correta",
        spokenLabel: "correta"
      };
    }

    if (item.status === "incorrect") {
      return {
        statusAttribute: "incorrect",
        icon: "✕",
        label: "Incorreta",
        spokenLabel: "incorreta"
      };
    }

    if (item.status === "discursive") {
      return {
        statusAttribute: "discursive",
        icon: "✎",
        label: "Revisão manual",
        spokenLabel: "revisão manual"
      };
    }

    return {
      statusAttribute: "unanswered",
      icon: "—",
      label: "Não respondida",
      spokenLabel: "não respondida"
    };
  }

  function renderizarDetalhesResultado(item, detailsId) {
    if (item.category === "objetiva") {
      return renderizarDetalhesObjetivaResultado(item, detailsId);
    }

    return renderizarDetalhesDiscursivaResultado(item, detailsId);
  }

  function renderizarBlocoDetalheResultado({ title, content, modifier = "" }) {
    return `
      <div class="result-detail-block${modifier ? ` ${modifier}` : ""}">
        <h3>${title}</h3>
        <div class="result-detail-block__content">
          ${content}
        </div>
      </div>
    `;
  }

  function renderizarDetalhesObjetivaResultado(item, detailsId) {
    const respondeu = Boolean(item.answer);
    const acertou = item.status === "correct";
    const answerKey = item.answerKeyVisible
      ? `
        <div class="result-answer-stat result-answer-stat--correct">
          <span>Resposta correta</span>
          <strong>${escapeHtml(item.correctAnswer || "—")} ✓</strong>
        </div>
      `
      : "";
    const explanation = item.answerKeyVisible
      ? `
        ${renderizarBlocoDetalheResultado({
          title: "Explicação",
          modifier: "result-detail-block--explanation",
          content: `<p>${escapeHtml(item.explanation || "Nenhuma explicação informada.")}</p>`
        })}
      `
      : `<p class="result-answer-key-hidden">O gabarito e a explicação foram ocultados pelas configurações desta sessão.</p>`;

    return `
      <div id="${detailsId}" class="result-review-card__details result-objective-details">
        <section class="result-detail-column">
          ${renderizarBlocoDetalheResultado({
            title: "Enunciado",
            modifier: "result-detail-block--statement",
            content: `<p>${escapeHtml(item.statement)}</p>`
          })}

          <div class="result-answer-comparison ${item.answerKeyVisible ? "" : "is-key-hidden"}">
            <div class="result-answer-stat result-answer-stat--user" data-correct="${acertou}">
              <span>Sua resposta</span>
              <strong>${respondeu ? `${escapeHtml(item.answer)} ${acertou ? "✓" : "✕"}` : "Não respondida"}</strong>
            </div>
            ${answerKey}
            <div class="result-answer-stat">
              <span>Tempo utilizado</span>
              <strong>${formatarTempo(item.timeMs)}</strong>
            </div>
          </div>
        </section>

        <section class="result-detail-column">
          ${explanation}
          ${renderizarBlocoDetalheResultado({
            title: "Anotação",
            modifier: "result-detail-block--note",
            content: `<p>${escapeHtml(item.note || "Nenhuma anotação registrada.")}</p>`
          })}
        </section>
      </div>
    `;
  }

  function renderizarDetalhesDiscursivaResultado(item, detailsId) {
    const expectedAnswer = item.answerKeyVisible
      ? `
        ${renderizarBlocoDetalheResultado({
          title: "Resposta esperada",
          modifier: "result-detail-block--expected result-discursive-detail--expected",
          content: `<p>${escapeHtml(item.expectedAnswer || "Não informada.")}</p>`
        })}
      `
      : `<p class="result-answer-key-hidden result-discursive-detail--expected">A resposta esperada foi ocultada pelas configurações desta sessão.</p>`;
    const criteria = item.answerKeyVisible
      ? `
        ${renderizarBlocoDetalheResultado({
          title: "Critérios de correção",
          modifier: "result-detail-block--criteria result-discursive-detail--criteria",
          content: `<p>${escapeHtml(item.criteria || "Não informados.")}</p>`
        })}
      `
      : `<p class="result-answer-key-hidden result-discursive-detail--criteria">Os critérios de correção foram ocultados pelas configurações desta sessão.</p>`;

    return `
      <div id="${detailsId}" class="result-review-card__details result-discursive-details">
        ${renderizarBlocoDetalheResultado({
          title: "Enunciado",
          modifier: "result-detail-block--statement result-discursive-detail--statement",
          content: `<p>${escapeHtml(item.statement)}</p>`
        })}

        <div class="result-time-block result-discursive-detail--time">
          <span>Tempo utilizado</span>
          <strong>${formatarTempo(item.timeMs)}</strong>
        </div>

        ${renderizarBlocoDetalheResultado({
          title: "Sua resposta",
          modifier: "result-detail-block--answer result-discursive-detail--answer",
          content: `<p>${escapeHtml(item.answer || "Não respondida.")}</p>`
        })}

        ${expectedAnswer}
        ${criteria}

        ${renderizarBlocoDetalheResultado({
          title: "Anotações",
          modifier: "result-detail-block--note result-discursive-detail--note",
          content: `<p>${escapeHtml(item.note || "Nenhuma anotação registrada.")}</p>`
        })}
      </div>
    `;
  }

  function criarEstadoVazioResultado(filter) {
    const mensagens = {
      [RESULT_FILTERS.INCORRECT]: [
        "Nenhuma questão errada.",
        "As questões objetivas respondidas corretamente não aparecem neste filtro."
      ],
      [RESULT_FILTERS.DISCURSIVE]: [
        "Nenhuma questão discursiva.",
        "Esta sessão não possui questões para revisão manual."
      ],
      [RESULT_FILTERS.REVIEW]: [
        "Nenhuma questão marcada.",
        "Você não marcou questões para revisar nesta sessão."
      ],
      [RESULT_FILTERS.UNANSWERED]: [
        "Todas as questões foram respondidas.",
        "Não há questões pendentes neste resultado."
      ],
      [RESULT_FILTERS.ALL]: [
        "Nenhuma questão encontrada.",
        "A sessão não possui questões para exibir."
      ]
    };
    const [title, description] = mensagens[filter] || mensagens[RESULT_FILTERS.ALL];

    return `
      <div class="results-empty-state" role="status">
        <strong>${title}</strong>
        <p>${description}</p>
      </div>
    `;
  }

  function baixarRespostasTxt() {
    prepararEstadoParaExportacao();
    downloadExportFile(createAnswersExport(estado));
  }

  function baixarAnotacoesTxt() {
    prepararEstadoParaExportacao();
    downloadExportFile(createNotesExport(estado));
  }

  function exportarJson() {
    prepararEstadoParaExportacao();
    downloadExportFile(createSessionJsonExport(estado));
  }

  function prepararEstadoParaExportacao() {
    registrarTempoAtual();
    salvarEstadoImediato();
  }

  function salvarEstadoDebounced() {
    if (!estado.questoes.length) return;
    if (indicadorSalvo) indicadorSalvo.textContent = "Salvando...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(salvarEstadoImediato, 350);
  }

  function salvarEstadoImediato() {
    if (!estado.questoes.length) return true;
    estado.temporizadorPausado = !timerRodando;

    const result = saveSession(estado);

    if (result.ok) {
      estado = result.session;
      if (indicadorSalvo) indicadorSalvo.textContent = "Salvo localmente";
      resolverFalhaPersistencia();
      return true;
    }

    if (indicadorSalvo) indicadorSalvo.textContent = "Falha ao salvar";
    registrarFalhaPersistencia(result.errorCode, result.error);
    return false;
  }

  function atualizarResumoTopo() {
    if (!statusResumo) return;

    const baseEstado = estado.questoes.length ? estado : obterSessaoAtiva();

    if (!baseEstado?.questoes?.length) {
      statusResumo.textContent = "Nenhuma lista importada";
      return;
    }

    const r = calcularResultado(baseEstado);
    statusResumo.textContent = `${baseEstado.listaNome || "Lista sem nome"} • ${r.respondidas}/${r.total} respondidas • ${formatarTempo(r.tempoTotal)}`;
  }

  async function abrirNovaResolucao() {
    const sessaoAtiva = obterSessaoAtiva();

    if (sessaoAtiva?.questoes?.length) {
      const confirmado = await solicitarConfirmacao(getNewResolutionConfirmation());

      if (!confirmado) {
        return;
      }
    }

    substituicaoAutorizada = Boolean(sessaoAtiva?.questoes?.length);
    esconderMensagemInicial();
    trocarTela("importacao");
  }

  function voltarAoInicioDaImportacao() {
    substituicaoAutorizada = false;
    trocarTela("home");
    atualizarHome();
  }

  function voltarAoInicioComSessaoAtiva() {
    registrarTempoAtual();
    salvarEstadoImediato();
    pararCronometro();
    trocarTela("home");
    atualizarHome();
  }

  function voltarAoInicioAposResultado() {
    ocultarDesempenhoImediato();
    pararCronometro();
    clearSession();
    estado = estadoInicial();
    limparCamposImportacao();
    $("#listaRevisaoResultado")?.replaceChildren();
    $("#listaDesempenhoAssuntos")?.replaceChildren();
    filtroResultadoAtivo = RESULT_FILTERS.ALL;
    questaoResultadoExpandidaId = null;
    itensRevisaoResultado = [];
    atualizarResumoTopo();
    trocarTela("home");
    atualizarHome();
  }

  function trocarTela(nome) {
    if (nome !== "resolucao") {
      pararCronometro();
    }

    screenManager.show(nome);
  }

  function atualizarHome() {
    const sessaoAtiva = obterSessaoAtiva();
    const blocoSessao = $("#blocoContinuarSessao");
    const botaoNovaResolucao = $("#btnNovaResolucao");

    if (sessaoAtiva?.questoes?.length) {
      const resultado = calcularResultado(sessaoAtiva);
      const progresso = resultado.total
        ? Math.round((resultado.respondidas / resultado.total) * 100)
        : 0;

      blocoSessao?.classList.remove("hidden");
      $("#nomeSessaoAtual").textContent = sessaoAtiva.listaNome || "Lista sem nome";
      $("#nomeSessaoAtual").title = sessaoAtiva.listaNome || "Lista sem nome";
      $("#resumoSessaoAtual").textContent =
        `${resultado.respondidas}/${resultado.total} respondidas • ${formatarTempo(resultado.tempoTotal)}`;
      $("#barraProgressoSessao").style.width = `${progresso}%`;
      $("#progressoSessaoAtual").setAttribute("aria-valuenow", String(progresso));

      botaoNovaResolucao?.classList.remove("primary");
      botaoNovaResolucao?.classList.add("secondary");
    } else {
      blocoSessao?.classList.add("hidden");
      $("#barraProgressoSessao").style.width = "0%";
      $("#progressoSessaoAtual").setAttribute("aria-valuenow", "0");

      botaoNovaResolucao?.classList.remove("secondary");
      botaoNovaResolucao?.classList.add("primary");
    }

    const metrics = calculateHistoryMetrics(readHistory());
    $("#totalRespondidas").textContent = String(metrics.answered);
    $("#taxaMediaAcertos").textContent = `${metrics.averageAccuracy}%`;
    $("#tempoTotalEstudo").textContent = formatarTempoHistorico(metrics.totalTimeMs);
    $("#sessoesConcluidas").textContent = String(metrics.completedSessions);
    $("#mensagemHistoricoVazio")?.classList.toggle("hidden", metrics.completedSessions > 0);
  }

  function obterSessaoAtiva() {
    const salva = obterSessaoSalva();
    return isActiveSession(salva) ? salva : null;
  }

  function sincronizarSessaoFinalizadaComHistorico() {
    const salva = obterSessaoSalva();

    if (!salva?.questoes?.length || !salva.finalizadoEm) {
      return;
    }

    registrarResultadoNoHistorico(salva, calcularResultado(salva));
  }

  function registrarResultadoNoHistorico(session, result) {
    const report = recordCompletedSessionSafe(session, result);

    if (!report.ok) {
      registrarFalhaPersistencia(report.errorCode, report.error);
    }

    return report.history;
  }

  function registrarFalhaPersistencia(errorCode, error = null) {
    persistenceAtRisk = true;
    persistenceErrorCode = errorCode || "storage-unknown-error";

    if (error) {
      console.error("Não foi possível persistir os dados do Test Quest.", error);
    }

    if (persistenceWarningDismissed || !avisoPersistencia) {
      return;
    }

    const warning = getPersistenceWarning(persistenceErrorCode);
    avisoPersistencia.dataset.tone = warning.tone;
    tituloAvisoPersistencia.textContent = warning.title;
    descricaoAvisoPersistencia.textContent = warning.description;
    avisoPersistencia.classList.remove("hidden");
  }

  function resolverFalhaPersistencia() {
    persistenceAtRisk = false;
    persistenceErrorCode = null;
    persistenceWarningDismissed = false;
    avisoPersistencia?.classList.add("hidden");
  }

  function tentarRestaurarPersistencia() {
    persistenceWarningDismissed = false;
    const inspection = inspectStorage();

    if (!inspection.writable) {
      registrarFalhaPersistencia(inspection.errorCode, inspection.error);
      return;
    }

    if (estado.questoes.length) {
      salvarEstadoImediato();
      return;
    }

    const settingsResult = saveSettings(loadSettings());

    if (settingsResult.ok) {
      resolverFalhaPersistencia();
      mostrarMensagemInicial("O salvamento local voltou a funcionar.", "ok");
      return;
    }

    registrarFalhaPersistencia(settingsResult.errorCode, settingsResult.error);
  }

  function protegerSaidaComPersistenciaEmRisco(evento) {
    if (!shouldProtectBeforeUnload({
      persistenceAtRisk,
      hasSession: Boolean(estado.questoes.length)
    })) {
      return;
    }

    evento.preventDefault();
    evento.returnValue = "";
  }

  function comunicarResultadoPersistencia(report) {
    if (!report) {
      return;
    }

    if (report.errorCode || report.source === "unavailable") {
      registrarFalhaPersistencia(report.errorCode, report.error);

      if (report.session) {
        mostrarMensagemInicial(
          "A sessão foi recuperada nesta aba, mas ainda não pôde ser gravada no armazenamento local.",
          "error"
        );
      }

      return;
    }

    if (report.migrated && report.session) {
      mostrarMensagemInicial(
        "Sua sessão salva foi atualizada com segurança para o formato da v0.4.",
        "ok"
      );
      return;
    }

    if (report.recovered && report.session) {
      mostrarMensagemInicial(
        "A sessão salva precisou de pequenos reparos e foi recuperada.",
        "ok"
      );
      return;
    }

    if (report.recovered && !report.session) {
      mostrarMensagemInicial(
        "Os dados salvos estavam incompatíveis e foram isolados para evitar falhas. Você pode iniciar uma nova resolução.",
        "error"
      );
    }
  }

  function mostrarMensagemInicial(texto, tipo = "error") {
    const mensagem = $("#mensagemInicial");
    if (!mensagem) return;

    mensagem.textContent = texto;
    mensagem.classList.remove("hidden");
    mensagem.dataset.type = tipo;
  }

  function esconderMensagemInicial() {
    const mensagem = $("#mensagemInicial");
    if (!mensagem) return;

    mensagem.textContent = "";
    mensagem.classList.add("hidden");
    delete mensagem.dataset.type;
  }

  function createImportValidationState() {
    return {
      status: "idle",
      snapshot: "",
      questions: [],
      summary: { total: 0, objective: 0, discursive: 0, subjects: 0 },
      errors: []
    };
  }

  function invalidarValidacaoImportacao(message) {
    const hasContent = Boolean(entradaQuestoes.value.trim());
    importValidation = createImportValidationState();

    if (!hasContent) {
      definirEstadoValidacao("idle");
      return;
    }

    importValidation.status = "pending";
    definirEstadoValidacao("pending", { message });
  }

  function definirEstadoValidacao(status, details = {}) {
    const statusElement = $("#statusValidacao");
    const titleElement = $("#tituloStatusValidacao");
    const descriptionElement = $("#descricaoStatusValidacao");
    const iconElement = $("#iconeStatusValidacao");
    const messagesElement = $("#mensagensValidacao");

    const definitions = {
      idle: {
        title: "Nenhuma validação realizada.",
        description: "Aguardando conteúdo para análise.",
        icon: "—",
        messages: ["Cole ou carregue uma lista e selecione “Validar”."]
      },
      pending: {
        title: "Conteúdo alterado.",
        description: "Valide novamente antes de começar.",
        icon: "!",
        messages: [details.message || "Existem alterações que ainda não foram analisadas."]
      },
      loading: {
        title: "Validando importação...",
        description: "Analisando blocos, campos e tipos de questão.",
        icon: "…",
        messages: ["Aguarde enquanto o conteúdo é verificado."]
      },
      valid: {
        title: "Importação válida.",
        description: "Nenhum problema estrutural foi encontrado.",
        icon: "✓",
        messages: [
          `${details.summary?.total || 0} questão(ões) pronta(s) para a sessão.`,
          `${details.summary?.subjects || 0} assunto(s) identificado(s).`
        ]
      },
      invalid: {
        title: "Importação com problemas.",
        description: "Revise os itens indicados antes de começar.",
        icon: "×",
        messages: details.errors?.length ? details.errors : ["Não foi possível validar o conteúdo."]
      }
    };

    const definition = definitions[status] || definitions.idle;

    statusElement.dataset.status = status;
    statusElement.className = `validation-status validation-status--${status}`;
    statusElement.setAttribute("aria-busy", status === "loading" ? "true" : "false");
    titleElement.textContent = definition.title;
    descriptionElement.textContent = definition.description;
    iconElement.textContent = definition.icon;

    messagesElement.replaceChildren();
    const list = document.createElement("ul");
    list.className = "validation-message-list";

    definition.messages.forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      list.appendChild(item);
    });

    messagesElement.appendChild(list);
    mensagemImportacao.textContent = definition.messages.join(" ");
    mensagemImportacao.className = "sr-only";

    const summary = status === "valid"
      ? details.summary || importValidation.summary
      : { total: 0, objective: 0, discursive: 0, subjects: 0 };

    atualizarContadoresImportacao(summary);

    btnValidar.disabled = status === "loading";
    btnValidar.textContent = status === "loading" ? "Validando..." : "Validar";
    btnImportar.disabled = status !== "valid";
  }

  function atualizarContadoresImportacao(summary) {
    $("#contadorTotalImportacao").textContent = String(summary.total || 0);
    $("#contadorObjetivasImportacao").textContent = String(summary.objective || 0);
    $("#contadorDiscursivasImportacao").textContent = String(summary.discursive || 0);
    $("#contadorAssuntosImportacao").textContent = String(summary.subjects || 0);
  }

  function atualizarNomeArquivo(fileName = "") {
    const displayName = fileName || "Nenhum arquivo selecionado";
    nomeArquivoSelecionado.textContent = displayName;
    nomeArquivoSelecionado.title = displayName;
  }

}
