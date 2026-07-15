import { CONFIG_KEY, STORAGE_KEY } from "../../core/constants.js";
import { createInitialState } from "../../core/state.js";
import { createScreenManager } from "../../core/screens.js";
import { calculateHistoryMetrics, readHistory, recordCompletedSession, removeCompletedSession } from "../home/home.service.js";
import { parseQuestions, QuestionImportError, summarizeQuestions } from "../question-import/question-import.parser.js";

export function initQuestionResolution() {
  const exemploQuestoes = `@questao
  assunto: Fluxo de dados: percepção → transporte → decisão → execução
  tipo: objetiva
  enunciado: Um sensor de fumaça detecta sinal de incêndio, envia os dados para a central, o sistema interpreta risco e aciona uma sirene. Qual alternativa classifica corretamente as etapas desse processo?
  a: Sensor detecta fumaça: execução; envio à central: decisão; interpretação do risco: percepção; sirene: transporte.
  b: Sensor detecta fumaça: percepção; envio à central: transporte; interpretação do risco: decisão; sirene: execução.
  c: Sensor detecta fumaça: transporte; envio à central: percepção; interpretação do risco: execução; sirene: decisão.
  d: Sensor detecta fumaça: decisão; envio à central: execução; interpretação do risco: transporte; sirene: percepção.
  e: Sensor detecta fumaça: aplicação; envio à central: atuador; interpretação do risco: sensor; sirene: rede.
  correta: B
  explicacao: [Pilar: aplicação prática com sensor e atuador]; A alternativa B está correta porque o sensor percebe, a rede transporta, o sistema decide e o atuador executa a ação. A, C e D trocam as funções das etapas; E mistura termos de camadas e componentes sem respeitar o fluxo percepção-transporte-decisão-execução.
  +++

  @discursiva
  assunto: Fluxo de dados: percepção → transporte → decisão → execução
  tipo: discursiva curta
  enunciado: Explique, em 4 a 8 linhas, o fluxo percepção → transporte → decisão → execução usando um exemplo com sensor e atuador em uma casa inteligente.
  resposta_esperada: Em uma casa inteligente, a percepção ocorre quando um sensor coleta uma informação, como um sensor de presença detectando movimento. O transporte acontece quando esse dado é enviado pela rede para uma central ou aplicativo. A decisão ocorre quando o sistema interpreta a informação e verifica uma regra, como “se houver presença e estiver escuro, ligar a luz”. A execução acontece quando o atuador realiza a ação, nesse caso, acendendo a lâmpada.
  criterios_de_correcao: Explicar percepção como coleta por sensor; explicar transporte como envio dos dados; explicar decisão como interpretação ou regra; explicar execução como ação por atuador; apresentar exemplo coerente de casa inteligente.
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

  const entradaQuestoes = $("#entradaQuestoes");
  const arquivoQuestoes = $("#arquivoQuestoes");
  const nomeLista = $("#nomeLista");
  const mensagemImportacao = $("#mensagemImportacao");
  const statusResumo = $("#statusResumo");
  const indicadorSalvo = $("#indicadorSalvo");
  const btnImportar = $("#btnImportar");
  const btnValidar = $("#btnValidar");
  const nomeArquivoSelecionado = $("#nomeArquivoSelecionado");

  inicializar();

  function inicializar() {
    carregarConfiguracoes();
    configurarEventos();
    sincronizarSessaoFinalizadaComHistorico();
    trocarTela("home");
    atualizarHome();
    atualizarResumoTopo();
  }

  function configurarEventos() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", alternarTema);
    });

    $("#btnNovaResolucao")?.addEventListener("click", abrirNovaResolucao);
    $("#btnVoltarInicioImportacao")?.addEventListener("click", voltarAoInicioDaImportacao);

    $("#btnExemplo").addEventListener("click", () => {
      entradaQuestoes.value = exemploQuestoes;
      nomeLista.value = "Lista exemplo - Smart Home e IoT";
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
    $("#btnPausarTempo").addEventListener("click", alternarCronometro);
    $("#btnMarcarRevisao").addEventListener("click", alternarMarcacaoRevisao);

    $("#btnVoltarImportacao").addEventListener("click", voltarAoInicioComSessaoAtiva);

    $("#btnLimparProgressoResolucao").addEventListener("click", apagarSessaoSalva);

    $("#btnNovaLista").addEventListener("click", voltarAoInicioAposResultado);
    $("#btnRevisar").addEventListener("click", () => {
      removeCompletedSession(estado.id);
      estado.finalizadoEm = null;
      estado.status = "em_andamento";
      salvarEstadoImediato();
      trocarTela("resolucao");
      renderizarQuestao();
      iniciarCronometro();
    });

    $("#btnBaixarTxt").addEventListener("click", baixarRespostasTxt);
    $("#btnBaixarAnotacoes").addEventListener("click", baixarAnotacoesTxt);
    $("#btnExportarJson").addEventListener("click", exportarJson);

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
      const confirmado = await solicitarConfirmacao({
        label: "Limpar importação",
        title: "Limpar todo o conteúdo?",
        message: "O arquivo selecionado, o texto importado, o nome da lista e as configurações desta importação serão removidos.",
        confirmText: "Limpar conteúdo",
        variant: "danger"
      });

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

    confirmationPreviousFocus = document.activeElement;
    $("#rotuloModalConfirmacao").textContent = label;
    $("#tituloModalConfirmacao").textContent = title;
    $("#descricaoModalConfirmacao").textContent = message;

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
    try {
      const config = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
      aplicarTema(config.tema || "light");
    } catch {
      aplicarTema("light");
    }
  }

  function salvarConfiguracoes() {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ tema: document.body.dataset.theme || "light" }));
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
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function continuarSessao() {
    const salva = obterSessaoAtiva();

    if (!salva || !salva.questoes || !salva.questoes.length) {
      mostrarMensagemInicial("Não encontrei uma sessão em andamento para continuar.");
      atualizarHome();
      return;
    }

    estado = {
      ...estadoInicial(),
      ...salva,
      respostas: salva.respostas || {},
      anotacoes: salva.anotacoes || {},
      temposMs: salva.temposMs || {},
      revisao: salva.revisao || {},
      opcoes: { ...estadoInicial().opcoes, ...(salva.opcoes || {}) },
      marcacoesAlternativas: salva.marcacoesAlternativas || {}
    };

    garantirIdentidadeSessao();
    estado.status = "em_andamento";
    timerRodando = true;
    atualizarBotaoCronometro();
    trocarTela("resolucao");
    renderizarQuestao();
    iniciarCronometro();
    atualizarResumoTopo();
  }

  async function apagarSessaoSalva() {
    const confirmado = await solicitarConfirmacao({
      label: "Apagar progresso",
      title: "Apagar a sessão salva?",
      message: "Respostas, anotações, tempos e marcações da sessão em andamento serão removidos deste navegador.",
      confirmText: "Apagar progresso",
      variant: "danger"
    });

    if (!confirmado) return;

    pararCronometro();
    localStorage.removeItem(STORAGE_KEY);
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
      const confirmado = await solicitarConfirmacao({
        label: "Substituir sessão",
        title: "Iniciar uma nova resolução?",
        message: "A resolução em andamento será substituída pela lista que acabou de ser validada.",
        confirmText: "Substituir sessão",
        variant: "danger"
      });

      if (!confirmado) {
        return;
      }
    }

    try {
      let questoes = importValidation.questions.map((question) => ({
        ...question,
        alternativas: question.alternativas ? { ...question.alternativas } : null
      }));

      if ($("#opcaoEmbaralhar").checked) {
        questoes = embaralhar(questoes);
      }

      estado = estadoInicial();
      estado.id = gerarIdSessao();
      estado.status = "em_andamento";
      estado.listaNome = nomeLista.value.trim() || "Lista sem nome";
      estado.questoes = questoes;
      estado.opcoes.mostrarGabaritoFinal = $("#opcaoMostrarGabaritoFinal").checked;
      estado.importadoEm = new Date().toISOString();
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

  function renderizarQuestao() {
    registrarTempoAtual();
    ultimoTick = Date.now();

    const questao = estado.questoes[estado.atual];
    if (!questao) return;

    const total = estado.questoes.length;
    const numero = estado.atual + 1;
    const progresso = Math.round((numero / total) * 100);

    $("#contadorQuestao").textContent = `Questão ${numero} de ${total}`;
    $("#percentualProgresso").textContent = `${progresso}%`;
    $("#barraProgresso").style.width = `${progresso}%`;

    $("#tipoQuestao").textContent = questao.categoria === "objetiva" ? "Objetiva" : "Discursiva curta";
    $("#assuntoQuestao").textContent = questao.assunto;
    $("#enunciadoQuestao").textContent = questao.enunciado;

    $("#revisaoQuestao").classList.toggle("hidden", !estado.revisao[questao.id]);
    $("#btnMarcarRevisao").textContent = estado.revisao[questao.id] ? "★ Remover revisão" : "☆ Marcar para revisão";

    if (questao.categoria === "objetiva") renderizarObjetiva(questao);
    else renderizarDiscursiva(questao);

    $("#anotacaoQuestao").value = estado.anotacoes[questao.id] || "";
    $("#anotacaoQuestao").oninput = (evento) => {
      estado.anotacoes[questao.id] = evento.target.value;
      salvarEstadoDebounced();
    };

    $("#btnAnterior").disabled = estado.atual === 0;
    $("#btnProxima").style.display = estado.atual === total - 1 ? "none" : "inline-flex";
    $("#btnFinalizar").style.display = estado.atual === total - 1 ? "inline-flex" : "none";

    renderizarMapa();
    atualizarTemposNaTela();
    atualizarResumoTopo();
    salvarEstadoDebounced();
  }

  function renderizarObjetiva(questao) {
    const respostaAtual = estado.respostas[questao.id] || "";

    $("#areaResposta").innerHTML = `
      <div class="option-list">
        ${Object.entries(questao.alternativas).map(([letra, texto]) => `
          <label class="option">
            <input type="radio" name="respostaObjetiva" value="${letra}" ${respostaAtual === letra ? "checked" : ""}>
            <span><strong>${letra})</strong> ${escapeHtml(texto)}</span>
          </label>
        `).join("")}
      </div>
    `;

    document.querySelectorAll("input[name='respostaObjetiva']").forEach((input) => {
      input.addEventListener("change", (evento) => {
        estado.respostas[questao.id] = evento.target.value;
        renderizarMapa();
        atualizarResumoTopo();
        salvarEstadoDebounced();
      });
    });
  }

  function renderizarDiscursiva(questao) {
    const respostaAtual = estado.respostas[questao.id] || "";

    $("#areaResposta").innerHTML = `
      <label class="field">
        <span>Sua resposta</span>
        <textarea class="discursive-answer" id="respostaDiscursiva" placeholder="Digite sua resposta discursiva aqui...">${escapeHtml(respostaAtual)}</textarea>
      </label>
    `;

    $("#respostaDiscursiva").addEventListener("input", (evento) => {
      estado.respostas[questao.id] = evento.target.value;
      renderizarMapa();
      atualizarResumoTopo();
      salvarEstadoDebounced();
    });
  }

  function renderizarMapa() {
    $("#listaNavegacao").innerHTML = estado.questoes.map((questao, indice) => {
      const respondida = Boolean((estado.respostas[questao.id] || "").trim());
      const atual = indice === estado.atual;
      const revisao = Boolean(estado.revisao[questao.id]);

      return `
        <button class="map-btn ${respondida ? "answered" : ""} ${atual ? "current" : ""} ${revisao ? "review" : ""}" 
                type="button" 
                data-indice="${indice}" 
                title="Ir para questão ${indice + 1}">
          ${indice + 1}
        </button>
      `;
    }).join("");

    document.querySelectorAll(".map-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        estado.atual = Number(btn.dataset.indice);
        renderizarQuestao();
      });
    });
  }

  function irAnterior() {
    if (estado.atual > 0) {
      estado.atual--;
      renderizarQuestao();
    }
  }

  function irProxima() {
    if (estado.atual < estado.questoes.length - 1) {
      estado.atual++;
      renderizarQuestao();
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
    const naoRespondidas = r.total - r.respondidas;

    if (naoRespondidas > 0) {
      const confirmado = await solicitarConfirmacao({
        label: "Finalizar sessão",
        title: "Existem questões não respondidas",
        message: `Você ainda tem ${naoRespondidas} questão(ões) sem resposta. A sessão pode ser finalizada mesmo assim.`,
        confirmText: "Finalizar mesmo assim",
        variant: "warning"
      });

      if (!confirmado) {
        return;
      }
    }

    estado.finalizadoEm = new Date().toISOString();
    estado.status = "finalizada";
    garantirIdentidadeSessao();
    salvarEstadoImediato();
    recordCompletedSession(estado, calcularResultado(estado));
    pararCronometro();

    trocarTela("resultado");
    renderizarResultado();
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
      !document.hidden
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
    ultimoTick = Date.now();
    atualizarBotaoCronometro();
    salvarEstadoImediato();
  }

  function atualizarBotaoCronometro() {
    $("#btnPausarTempo").textContent = timerRodando ? "Pausar tempo" : "Retomar tempo";
    $("#statusCronometro").textContent = timerRodando ? "Rodando" : "Pausado";
  }

  function atualizarTemposNaTela() {
    const questao = estado.questoes[estado.atual];
    const tempoAtual = questao ? estado.temposMs[questao.id] || 0 : 0;
    const total = calcularTempoTotal(estado);

    $("#tempoAtual").textContent = formatarTempo(tempoAtual);
    $("#tempoTotal").textContent = formatarTempo(total);
  }

  function calcularTempoTotal(baseEstado = estado) {
    return Object.values(baseEstado.temposMs || {}).reduce((soma, ms) => soma + Number(ms || 0), 0);
  }

  function calcularResultado(baseEstado = estado) {
    const questoes = baseEstado.questoes || [];
    const respostas = baseEstado.respostas || {};
    const objetivas = questoes.filter((q) => q.categoria === "objetiva");
    const discursivas = questoes.filter((q) => q.categoria === "discursiva");
    const respondidas = questoes.filter((q) => Boolean((respostas[q.id] || "").trim())).length;
    const acertos = objetivas.filter((q) => (respostas[q.id] || "").toUpperCase() === q.correta).length;
    const erros = objetivas.length - acertos;
    const percentual = objetivas.length ? Math.round((acertos / objetivas.length) * 100) : 0;
    const tempoTotal = calcularTempoTotal(baseEstado);
    const tempoMedio = questoes.length ? Math.round(tempoTotal / questoes.length) : 0;
    const marcadas = Object.keys(baseEstado.revisao || {}).length;

    return {
      total: questoes.length,
      respondidas,
      objetivas: objetivas.length,
      discursivas: discursivas.length,
      acertos,
      erros,
      percentual,
      tempoTotal,
      tempoMedio,
      marcadas
    };
  }

  function renderizarResultado() {
    const r = calcularResultado(estado);

    $("#resumoResultado").innerHTML = `
      <div class="result-card"><strong>${r.percentual}%</strong><span>desempenho nas objetivas</span></div>
      <div class="result-card"><strong>${r.acertos}/${r.objetivas}</strong><span>objetivas corretas</span></div>
      <div class="result-card"><strong>${r.respondidas}/${r.total}</strong><span>questões respondidas</span></div>
      <div class="result-card"><strong>${formatarTempo(r.tempoTotal)}</strong><span>tempo total</span></div>
      <div class="result-card"><strong>${formatarTempo(r.tempoMedio)}</strong><span>tempo médio</span></div>
    `;

    renderizarResumoPorAssunto();

    const mostrarGabarito = estado.opcoes.mostrarGabaritoFinal;

    $("#detalhesResultado").innerHTML = estado.questoes.map((q, indice) => {
      const resposta = estado.respostas[q.id] || "";
      const anotacao = estado.anotacoes[q.id] || "";
      const tempo = estado.temposMs[q.id] || 0;
      const marcada = Boolean(estado.revisao[q.id]);

      if (q.categoria === "objetiva") {
        const acertou = resposta.toUpperCase() === q.correta;
        const classe = !resposta ? "warning" : acertou ? "correct" : "wrong";
        const status = !resposta ? "Não respondida" : acertou ? "Correta" : "Incorreta";

        return `
          <article class="review-item">
            <h3>${indice + 1}. ${escapeHtml(q.enunciado)}</h3>
            <p class="review-meta">Objetiva • ${escapeHtml(q.assunto)} • Tempo: ${formatarTempo(tempo)}</p>
            ${marcada ? `<p class="answer-line review"><strong>Marcada para revisão.</strong></p>` : ""}
            <p class="answer-line ${classe}"><strong>Status:</strong> ${status}</p>
            <p class="answer-line"><strong>Sua resposta:</strong> ${resposta || "—"}</p>
            ${mostrarGabarito ? `<p class="answer-line"><strong>Correta:</strong> ${q.correta}</p>` : ""}
            ${mostrarGabarito ? `<p class="answer-line"><strong>Explicação:</strong> ${escapeHtml(q.explicacao)}</p>` : ""}
            <p class="answer-line"><strong>Anotações:</strong><br>${escapeHtml(anotacao || "—")}</p>
          </article>
        `;
      }

      return `
        <article class="review-item">
          <h3>${indice + 1}. ${escapeHtml(q.enunciado)}</h3>
          <p class="review-meta">Discursiva curta • ${escapeHtml(q.assunto)} • Tempo: ${formatarTempo(tempo)}</p>
          ${marcada ? `<p class="answer-line review"><strong>Marcada para revisão.</strong></p>` : ""}
          <p class="answer-line"><strong>Sua resposta:</strong><br>${escapeHtml(resposta || "—")}</p>
          ${mostrarGabarito ? `<p class="answer-line correct"><strong>Resposta esperada:</strong><br>${escapeHtml(q.respostaEsperada)}</p>` : ""}
          ${mostrarGabarito ? `<p class="answer-line"><strong>Critérios de correção:</strong><br>${escapeHtml(q.criterios)}</p>` : ""}
          <p class="answer-line"><strong>Anotações:</strong><br>${escapeHtml(anotacao || "—")}</p>
        </article>
      `;
    }).join("");

    atualizarResumoTopo();
  }

  function renderizarResumoPorAssunto() {
    const grupos = {};

    estado.questoes.forEach((q) => {
      if (!grupos[q.assunto]) grupos[q.assunto] = { total: 0, objetivas: 0, acertos: 0, tempo: 0 };

      grupos[q.assunto].total++;
      grupos[q.assunto].tempo += estado.temposMs[q.id] || 0;

      if (q.categoria === "objetiva") {
        grupos[q.assunto].objetivas++;
        if ((estado.respostas[q.id] || "").toUpperCase() === q.correta) grupos[q.assunto].acertos++;
      }
    });

    const linhas = Object.entries(grupos).map(([assunto, dados]) => {
      const desempenho = dados.objetivas ? `${dados.acertos}/${dados.objetivas} objetivas` : "sem objetivas";
      return `<div class="subject-row"><strong>${escapeHtml(assunto)}</strong><span>${desempenho} • ${formatarTempo(dados.tempo)}</span></div>`;
    }).join("");

    $("#resultadoPorAssunto").innerHTML = `<h3>Resumo por assunto</h3>${linhas || "<p>Nenhum assunto encontrado.</p>"}`;
  }

  function baixarRespostasTxt() {
    baixarArquivo(gerarRespostasTxt(), `${slugify(estado.listaNome || "respostas")}-respostas.txt`, "text/plain;charset=utf-8");
  }

  function baixarAnotacoesTxt() {
    baixarArquivo(gerarAnotacoesTxt(), `${slugify(estado.listaNome || "anotacoes")}-anotacoes.txt`, "text/plain;charset=utf-8");
  }

  function exportarJson() {
    registrarTempoAtual();
    salvarEstadoImediato();
    baixarArquivo(JSON.stringify(estado, null, 2), `${slugify(estado.listaNome || "sessao")}-sessao.json`, "application/json;charset=utf-8");
  }

  function gerarRespostasTxt() {
    const r = calcularResultado(estado);
    const linhas = [
      "RELATÓRIO DE RESPOSTAS",
      "======================",
      `Lista: ${estado.listaNome}`,
      `Data de exportação: ${new Date().toLocaleString("pt-BR")}`,
      `Importado em: ${formatarData(estado.importadoEm)}`,
      `Finalizado em: ${formatarData(estado.finalizadoEm)}`,
      "",
      "RESUMO",
      "------",
      `Total de questões: ${r.total}`,
      `Questões respondidas: ${r.respondidas}/${r.total}`,
      `Objetivas: ${r.objetivas}`,
      `Discursivas: ${r.discursivas}`,
      `Acertos nas objetivas: ${r.acertos}/${r.objetivas}`,
      `Desempenho nas objetivas: ${r.percentual}%`,
      `Tempo total: ${formatarTempo(r.tempoTotal)}`,
      `Tempo médio por questão: ${formatarTempo(r.tempoMedio)}`,
      `Marcadas para revisão: ${r.marcadas}`,
      "",
      "RESPOSTAS",
      "---------"
    ];

    estado.questoes.forEach((q, indice) => {
      const resposta = estado.respostas[q.id] || "";
      const tempo = estado.temposMs[q.id] || 0;
      const marcada = estado.revisao[q.id] ? "Sim" : "Não";

      linhas.push("");
      linhas.push(`${indice + 1}. ${q.categoria.toUpperCase()} - ${q.assunto}`);
      linhas.push(`Tempo usado: ${formatarTempo(tempo)}`);
      linhas.push(`Marcada para revisão: ${marcada}`);
      linhas.push(`Enunciado: ${q.enunciado}`);

      if (q.categoria === "objetiva") {
        const status = !resposta ? "Não respondida" : resposta.toUpperCase() === q.correta ? "Correta" : "Incorreta";
        linhas.push(`Sua resposta: ${resposta || "—"}`);
        linhas.push(`Resposta correta: ${q.correta}`);
        linhas.push(`Status: ${status}`);
        linhas.push(`Explicação: ${q.explicacao}`);
      } else {
        linhas.push(`Sua resposta: ${resposta || "—"}`);
        linhas.push(`Resposta esperada: ${q.respostaEsperada}`);
        linhas.push(`Critérios de correção: ${q.criterios}`);
      }
    });

    return linhas.join("\n");
  }

  function gerarAnotacoesTxt() {
    const linhas = [
      "ANOTAÇÕES DA RESOLUÇÃO",
      "======================",
      `Lista: ${estado.listaNome}`,
      `Data de exportação: ${new Date().toLocaleString("pt-BR")}`,
      "",
      "ANOTAÇÕES POR QUESTÃO",
      "---------------------"
    ];

    estado.questoes.forEach((q, indice) => {
      const anotacao = estado.anotacoes[q.id] || "";
      const tempo = estado.temposMs[q.id] || 0;
      const marcada = estado.revisao[q.id] ? "Sim" : "Não";

      linhas.push("");
      linhas.push(`${indice + 1}. ${q.categoria.toUpperCase()} - ${q.assunto}`);
      linhas.push(`Tempo usado: ${formatarTempo(tempo)}`);
      linhas.push(`Marcada para revisão: ${marcada}`);
      linhas.push(`Enunciado: ${q.enunciado}`);
      linhas.push("");
      linhas.push("Anotação:");
      linhas.push(anotacao || "—");
    });

    return linhas.join("\n");
  }

  function baixarArquivo(conteudo, nomeArquivo, tipo) {
    registrarTempoAtual();
    salvarEstadoImediato();

    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function salvarEstadoDebounced() {
    if (!estado.questoes.length) return;
    if (indicadorSalvo) indicadorSalvo.textContent = "Salvando...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(salvarEstadoImediato, 350);
  }

  function salvarEstadoImediato() {
    if (!estado.questoes.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    if (indicadorSalvo) indicadorSalvo.textContent = "Salvo localmente";
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
      const confirmado = await solicitarConfirmacao({
        label: "Nova resolução",
        title: "Preparar uma nova lista?",
        message: "Existe uma resolução em andamento. O progresso atual será substituído quando a nova lista for iniciada.",
        confirmText: "Preparar nova lista",
        variant: "danger"
      });

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
    pararCronometro();
    localStorage.removeItem(STORAGE_KEY);
    estado = estadoInicial();
    limparCamposImportacao();
    $("#detalhesResultado").innerHTML = "";
    $("#resumoResultado").innerHTML = "";
    $("#resultadoPorAssunto").innerHTML = "";
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

    if (
      !salva?.questoes?.length ||
      salva.finalizadoEm ||
      salva.status === "finalizada"
    ) {
      return null;
    }

    return salva;
  }

  function sincronizarSessaoFinalizadaComHistorico() {
    const salva = obterSessaoSalva();

    if (!salva?.questoes?.length || !salva.finalizadoEm) {
      return;
    }

    recordCompletedSession(salva, calcularResultado(salva));
  }

  function garantirIdentidadeSessao() {
    if (!estado.id) {
      estado.id = gerarIdSessao();
    }
  }

  function gerarIdSessao() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `sessao-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatarTempoHistorico(ms) {
    const totalMinutos = Math.floor(Number(ms || 0) / 60000);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas}h ${String(minutos).padStart(2, "0")}min`;
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

  function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
  }

  function formatarTempo(ms) {
    const totalSegundos = Math.floor((ms || 0) / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    if (horas > 0) {
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    }

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  function formatarData(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleString("pt-BR"); }
    catch { return "—"; }
  }

  function escapeHtml(texto) {
    return String(texto)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
      .replaceAll("\n", "<br>");
  }

  function slugify(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60) || "arquivo";
  }
}
