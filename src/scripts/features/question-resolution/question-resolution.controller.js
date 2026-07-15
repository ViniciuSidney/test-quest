import { CONFIG_KEY, STORAGE_KEY } from "../../core/constants.js";
import { createInitialState } from "../../core/state.js";
import { createScreenManager } from "../../core/screens.js";
import { calculateHistoryMetrics, readHistory, recordCompletedSession, removeCompletedSession } from "../home/home.service.js";

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

  const entradaQuestoes = $("#entradaQuestoes");
  const arquivoQuestoes = $("#arquivoQuestoes");
  const nomeLista = $("#nomeLista");
  const mensagemImportacao = $("#mensagemImportacao");
  const statusResumo = $("#statusResumo");
  const indicadorSalvo = $("#indicadorSalvo");

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
      mostrarMensagem("Exemplo carregado. Valide a importação antes de começar.", "ok");
    });

    $("#btnValidar").addEventListener("click", validarImportacao);
    $("#btnLimpar").addEventListener("click", limparCamposImportacao);

    $("#btnAbrirModelo")?.addEventListener("click", abrirModalModelo);
    $("#btnFecharModelo")?.addEventListener("click", fecharModalModelo);
    $("#modalModelo")?.addEventListener("click", (evento) => {
      if (evento.target.matches("[data-fechar-modelo]")) {
        fecharModalModelo();
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && !$("#modalModelo")?.classList.contains("hidden")) {
        fecharModalModelo();
      }
    });

    arquivoQuestoes.addEventListener("change", async (evento) => {
      const arquivo = evento.target.files[0];
      if (!arquivo) return;

      const texto = await arquivo.text();
      entradaQuestoes.value = texto;

      if (!nomeLista.value.trim()) {
        nomeLista.value = arquivo.name.replace(/\.[^/.]+$/, "");
      }

      mostrarMensagem(`Arquivo “${arquivo.name}” carregado.`, "ok");
    });

    $("#btnImportar").addEventListener("click", importarQuestoes);
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

  function limparCamposImportacao() {
    entradaQuestoes.value = "";
    arquivoQuestoes.value = "";
    nomeLista.value = "";
    mostrarMensagem("Campos limpos.", "ok");
  }

  function abrirModalModelo() {
    const modal = $("#modalModelo");
    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    $("#btnFecharModelo")?.focus();
  }

  function fecharModalModelo() {
    const modal = $("#modalModelo");
    if (!modal) return;

    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    $("#btnAbrirModelo")?.focus();
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

  function apagarSessaoSalva() {
    if (!confirm("Tem certeza que deseja apagar o progresso salvo desta aplicação?")) return;

    pararCronometro();
    localStorage.removeItem(STORAGE_KEY);
    estado = estadoInicial();
    limparCamposImportacao();
    atualizarResumoTopo();
    trocarTela("home");
    atualizarHome();
    mostrarMensagemInicial("Progresso da sessão apagado.", "ok");
  }

  function validarImportacao() {
    const texto = entradaQuestoes.value.trim();

    if (!texto) {
      mostrarMensagem("Cole as questões ou importe um arquivo TXT antes de validar.", "error");
      return;
    }

    try {
      const questoes = parseQuestoes(texto);
      const objetivas = questoes.filter((q) => q.categoria === "objetiva").length;
      const discursivas = questoes.filter((q) => q.categoria === "discursiva").length;
      mostrarMensagem(`Importação válida: ${questoes.length} questões encontradas (${objetivas} objetivas e ${discursivas} discursivas).`, "ok");
    } catch (erro) {
      mostrarMensagem(erro.message, "error");
    }
  }

  function importarQuestoes() {
    const texto = entradaQuestoes.value.trim();

    if (!texto) {
      mostrarMensagem("Cole as questões ou importe um arquivo TXT antes de começar.", "error");
      return;
    }

    const sessaoExistente = obterSessaoAtiva();
    if (
      sessaoExistente?.questoes?.length &&
      !substituicaoAutorizada &&
      !confirm("Iniciar esta lista substituirá a resolução em andamento. Deseja continuar?")
    ) {
      return;
    }

    try {
      let questoes = parseQuestoes(texto);

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
    } catch (erro) {
      mostrarMensagem(erro.message, "error");
    }
  }

  function parseQuestoes(texto) {
    const blocos = texto
      .split(/\n\s*\+\+\+\s*/g)
      .map((bloco) => bloco.trim())
      .filter(Boolean);

    if (!blocos.length) {
      throw new Error("Nenhum bloco de questão foi encontrado. Use +++ ao final de cada questão.");
    }

    return blocos.map((bloco, indice) => parseBloco(bloco, indice));
  }

  function parseBloco(bloco, indice) {
    const primeiraLinha = bloco.trim().split(/\r?\n/)[0].trim().toLowerCase();
    let categoria = "";

    if (primeiraLinha.startsWith("@questao")) categoria = "objetiva";
    if (primeiraLinha.startsWith("@discursiva")) categoria = "discursiva";

    if (!categoria) {
      throw new Error(`O bloco ${indice + 1} precisa começar com @questao ou @discursiva.`);
    }

    const corpo = bloco.replace(/^@(questao|discursiva)\s*/i, "").trim();
    const dados = extrairCampos(corpo);

    if (categoria === "objetiva") validarObjetiva(dados, indice);
    if (categoria === "discursiva") validarDiscursiva(dados, indice);

    return {
      id: gerarId(indice),
      categoria,
      assunto: dados.assunto || "Sem assunto",
      tipo: dados.tipo || categoria,
      enunciado: dados.enunciado || "",
      alternativas: categoria === "objetiva" ? {
        A: dados.a, B: dados.b, C: dados.c, D: dados.d, E: dados.e
      } : null,
      correta: categoria === "objetiva" ? dados.correta.toUpperCase().trim() : null,
      explicacao: dados.explicacao || "",
      respostaEsperada: dados.resposta_esperada || "",
      criterios: dados.criterios_de_correcao || ""
    };
  }

  function extrairCampos(corpo) {
    const regex = /(^|\n|\s)(criterios_de_correcao|resposta_esperada|explicacao|enunciado|correta|assunto|tipo|a|b|c|d|e)\s*:\s*/gi;
    const matches = [...corpo.matchAll(regex)];
    const dados = {};

    matches.forEach((match, index) => {
      const chave = match[2].toLowerCase();
      const inicioValor = match.index + match[0].length;
      const fimValor = index + 1 < matches.length ? matches[index + 1].index : corpo.length;
      dados[chave] = corpo.slice(inicioValor, fimValor).trim();
    });

    return dados;
  }

  function validarObjetiva(dados, indice) {
    const obrigatorios = ["assunto", "enunciado", "a", "b", "c", "d", "e", "correta", "explicacao"];
    const ausentes = obrigatorios.filter((campo) => !dados[campo]);

    if (ausentes.length > 0) {
      throw new Error(`A questão objetiva ${indice + 1} está incompleta. Campos ausentes: ${ausentes.join(", ")}.`);
    }

    if (!["A", "B", "C", "D", "E"].includes(dados.correta.toUpperCase().trim())) {
      throw new Error(`A questão objetiva ${indice + 1} possui alternativa correta inválida. Use A, B, C, D ou E.`);
    }
  }

  function validarDiscursiva(dados, indice) {
    const obrigatorios = ["assunto", "enunciado", "resposta_esperada", "criterios_de_correcao"];
    const ausentes = obrigatorios.filter((campo) => !dados[campo]);

    if (ausentes.length > 0) {
      throw new Error(`A questão discursiva ${indice + 1} está incompleta. Campos ausentes: ${ausentes.join(", ")}.`);
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

  function finalizar() {
    registrarTempoAtual();
    salvarEstadoImediato();

    const r = calcularResultado(estado);
    const naoRespondidas = r.total - r.respondidas;

    if (naoRespondidas > 0 && !confirm(`Você ainda tem ${naoRespondidas} questão(ões) sem resposta. Deseja finalizar mesmo assim?`)) {
      return;
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
    indicadorSalvo.textContent = "Salvando...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(salvarEstadoImediato, 350);
  }

  function salvarEstadoImediato() {
    if (!estado.questoes.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    indicadorSalvo.textContent = "Salvo localmente";
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

  function abrirNovaResolucao() {
    const sessaoAtiva = obterSessaoAtiva();

    if (
      sessaoAtiva?.questoes?.length &&
      !confirm(
        "Você possui uma resolução em andamento. Ao começar uma nova lista, o progresso atual será substituído. Deseja preparar uma nova resolução?"
      )
    ) {
      return;
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

  function mostrarMensagem(texto, tipo = "ok") {
    mensagemImportacao.textContent = texto;
    mensagemImportacao.className = `message show ${tipo}`;
  }

  function gerarId(indice) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `q-${Date.now()}-${indice}-${Math.random().toString(16).slice(2)}`;
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
