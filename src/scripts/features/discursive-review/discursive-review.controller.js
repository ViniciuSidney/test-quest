import {
  getCurrentDiscursiveReviewQuestion,
  getDiscursiveQuestionsForReview,
  getDiscursiveReviewProgress,
  markDiscursiveReviewCompleted,
  setCurrentDiscursiveReviewQuestion
} from "./discursive-review.service.js";
import {
  METACOGNITION_LEVEL_VALUES,
  getFinalVerdict,
  getInitialMetacognition,
  getMetacognitionLevel,
  hasFinalVerdict,
  hasInitialMetacognition,
  setFinalVerdictLevel,
  setFinalVerdictObservation
} from "../question-resolution/metacognition.service.js";
import { isQuestionConfirmed } from "../question-resolution/immediate-feedback.service.js";

export function createDiscursiveReviewController({
  documentRef = globalThis.document,
  getState,
  setState,
  saveImmediate = () => {},
  saveDebounced = () => {},
  showScreen = () => {},
  onFinish = () => {},
  onHome = () => {},
  escapeHtml = (value) => String(value ?? "")
} = {}) {
  const $ = (selector) => documentRef?.querySelector(selector);

  function init() {
    $("#btnInicioCorrecaoDiscursiva")?.addEventListener("click", () => {
      saveImmediate();
      onHome();
    });
    $("#btnAnteriorCorrecaoDiscursiva")?.addEventListener("click", goPrevious);
    $("#btnSalvarAvancarCorrecaoDiscursiva")?.addEventListener("click", saveAndAdvance);
    $("#btnConcluirCorrecaoDiscursiva")?.addEventListener("click", conclude);
    $("#listaProgressoCorrecaoDiscursiva")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-discursive-review-id]");
      if (button) selectQuestion(button.dataset.discursiveReviewId);
    });
  }

  function open({ focusTitle = false } = {}) {
    showScreen();
    render({ focusTitle });
  }

  function render({ focusTitle = false } = {}) {
    const state = getState?.() || {};
    const progress = getDiscursiveReviewProgress(state);
    const question = getCurrentDiscursiveReviewQuestion(state);

    if (!question) {
      onFinish();
      return;
    }

    const index = progress.questions.findIndex((item) => item.id === question.id);
    const initialMetacognition = getInitialMetacognition(state, question.id);
    const initialLevel = getMetacognitionLevel(initialMetacognition?.nivel);
    const finalVerdict = getFinalVerdict(state, question.id);
    const finalLevel = getMetacognitionLevel(finalVerdict?.nivel);

    $("#nomeListaCorrecaoDiscursiva").textContent = state.listaNome || "Lista sem nome";
    $("#modoCorrecaoDiscursiva").textContent = "Somente no resultado final";
    $("#tituloQuestaoCorrecaoDiscursiva").textContent = `Questão discursiva ${index + 1} de ${progress.total}`;
    $("#assuntoCorrecaoDiscursiva").textContent = question.assunto || "Sem assunto";
    $("#enunciadoCorrecaoDiscursiva").textContent = question.enunciado || "Enunciado não informado.";
    $("#respostaUsuarioCorrecaoDiscursiva").textContent = state.respostas?.[question.id] || "Não respondida.";
    $("#respostaEsperadaCorrecaoDiscursiva").textContent = question.respostaEsperada || "Nenhuma resposta esperada foi informada.";
    $("#criteriosCorrecaoDiscursiva").innerHTML = formatCriteria(question.criterios);

    const initialBadge = $("#nivelMetacognicaoInicialCorrecao");
    initialBadge.textContent = initialLevel
      ? `${initialLevel.label} — ${initialLevel.percentage}%`
      : "Não registrada";
    initialBadge.dataset.tone = initialLevel?.key || "pendente";
    $("#metacognicaoInicialCorrecaoDiscursiva").innerHTML = initialLevel
      ? `<p><strong>Percepção registrada antes do modelo:</strong> ${escapeHtml(initialLevel.label)} (${initialLevel.percentage}%)</p><p>${escapeHtml(initialMetacognition?.observacao || "Nenhuma observação inicial registrada.")}</p>`
      : `<p>Nenhuma percepção inicial foi registrada para esta resposta.</p>`;

    renderVerdictOptions(question, finalLevel);

    const observation = $("#observacaoVereditoCorrecaoDiscursiva");
    observation.value = finalVerdict?.observacao || "";
    observation.oninput = (event) => {
      const next = setFinalVerdictObservation(getState(), question.id, event.target.value);
      setState(next);
      saveDebounced();
    };

    renderProgress(state, progress, question, index);
    renderValidations(state, question, finalLevel);
    renderSummary(progress);

    const isLastQuestion = index === progress.total - 1;
    const isOnlyQuestion = progress.total === 1;
    const previousButton = $("#btnAnteriorCorrecaoDiscursiva");
    const saveAndAdvanceButton = $("#btnSalvarAvancarCorrecaoDiscursiva");
    const actionbar = $(".discursive-review-actionbar");

    previousButton.hidden = isOnlyQuestion;
    previousButton.disabled = index <= 0;
    saveAndAdvanceButton.hidden = isLastQuestion;
    saveAndAdvanceButton.disabled = !finalLevel;
    saveAndAdvanceButton.textContent = "Salvar e avançar →";
    actionbar?.classList.toggle("is-last-question", isLastQuestion);
    actionbar?.classList.toggle("is-only-question", isOnlyQuestion);
    $("#btnConcluirCorrecaoDiscursiva").disabled = progress.pending > 0;

    saveDebounced();

    if (focusTitle) {
      requestAnimationFrame(() => $("#tituloCorrecaoDiscursiva")?.focus({ preventScroll: true }));
    }
  }

  function renderVerdictOptions(question, selectedLevel) {
    $("#opcoesVereditoCorrecaoDiscursiva").innerHTML = METACOGNITION_LEVEL_VALUES.map((level) => `
      <button
        class="discursive-review-verdict-option ${selectedLevel?.key === level.key ? "is-selected" : ""}"
        type="button"
        role="radio"
        aria-checked="${selectedLevel?.key === level.key}"
        data-discursive-verdict-level="${level.key}"
        data-tone="${level.key}"
      >
        <span aria-hidden="true">${level.key === "completa" ? "✓" : level.key === "parcial" ? "−" : "×"}</span>
        <span><strong>${escapeHtml(level.label)}</strong><small>${level.percentage}%</small></span>
      </button>
    `).join("");

    documentRef.querySelectorAll("[data-discursive-verdict-level]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = setFinalVerdictLevel(
          getState(),
          question.id,
          button.dataset.discursiveVerdictLevel
        );
        setState(next);
        saveImmediate();
        render();
        requestAnimationFrame(() => {
          documentRef.querySelector(
            `[data-discursive-verdict-level="${button.dataset.discursiveVerdictLevel}"]`
          )?.focus();
        });
      });
    });
  }

  function renderProgress(state, progress, currentQuestion, currentIndex) {
    $("#resumoProgressoCorrecaoDiscursiva").textContent = `${progress.evaluated} de ${progress.total} corrigidas`;
    $("#percentualCorrecaoDiscursiva").textContent = `${progress.percentage}%`;
    $("#barraCorrecaoDiscursiva").style.width = `${progress.percentage}%`;
    $(".discursive-review-progress-track")?.setAttribute("aria-valuenow", String(progress.percentage));

    $("#listaProgressoCorrecaoDiscursiva").innerHTML = progress.questions.map((item, itemIndex) => {
      const itemLevel = getMetacognitionLevel(getFinalVerdict(state, item.id)?.nivel);
      const isCurrent = item.id === currentQuestion.id;
      const stateClass = itemLevel
        ? `is-${itemLevel.key === "completa" ? "complete" : itemLevel.key === "parcial" ? "partial" : "incorrect"}`
        : "is-pending";
      const label = isCurrent && !itemLevel
        ? "Em correção"
        : itemLevel
          ? `${itemLevel.label.replace("Resposta ", "")} — ${itemLevel.percentage}%`
          : "Pendente";

      return `
        <li>
          <button
            class="discursive-review-question-button ${isCurrent ? "is-current" : ""} ${stateClass}"
            type="button"
            data-discursive-review-id="${escapeHtml(item.id)}"
            ${itemIndex > currentIndex && !itemLevel ? "disabled" : ""}
          >
            <span class="discursive-review-question-marker" aria-hidden="true">${itemLevel ? "✓" : itemIndex + 1}</span>
            <span>Questão ${itemIndex + 1}</span>
            <small>${escapeHtml(label)}</small>
          </button>
        </li>
      `;
    }).join("");
  }

  function renderValidations(state, question, finalLevel) {
    const validations = [
      { label: "Resposta confirmada", valid: isQuestionConfirmed(state, question.id) },
      { label: "Metacognição inicial registrada", valid: hasInitialMetacognition(state, question.id) },
      { label: "Modelo de correção disponível", valid: Boolean(question.respostaEsperada || question.criterios) },
      { label: finalLevel ? "Veredito final registrado" : "Veredito final pendente", valid: Boolean(finalLevel) }
    ];

    $("#validacoesCorrecaoDiscursiva").innerHTML = validations.map((item) => `
      <li class="${item.valid ? "is-valid" : ""}">${escapeHtml(item.label)}</li>
    `).join("");
  }

  function renderSummary(progress) {
    $("#totalCorrecaoCompleta").textContent = String(progress.counts.completa);
    $("#totalCorrecaoParcial").textContent = String(progress.counts.parcial);
    $("#totalCorrecaoIncorreta").textContent = String(progress.counts.incorreta);
    $("#totalCorrecaoPendente").textContent = String(progress.pending);
    $("#totalCorrecaoDiscursivas").textContent = String(progress.total);
  }

  function selectQuestion(questionId) {
    const next = setCurrentDiscursiveReviewQuestion(getState(), questionId);
    setState(next);
    saveImmediate();
    render();
    requestAnimationFrame(() => $("#tituloQuestaoCorrecaoDiscursiva")?.scrollIntoView({ block: "start" }));
  }

  function goPrevious() {
    const state = getState();
    const questions = getDiscursiveQuestionsForReview(state);
    const current = getCurrentDiscursiveReviewQuestion(state);
    const index = questions.findIndex((question) => question.id === current?.id);

    if (index > 0) {
      selectQuestion(questions[index - 1].id);
    }
  }

  function saveAndAdvance() {
    const state = getState();
    const questions = getDiscursiveQuestionsForReview(state);
    const current = getCurrentDiscursiveReviewQuestion(state);
    const index = questions.findIndex((question) => question.id === current?.id);

    if (!current || !hasFinalVerdict(state, current.id)) {
      return;
    }

    saveImmediate();

    if (index < questions.length - 1) {
      selectQuestion(questions[index + 1].id);
      return;
    }

    render();
    $("#btnConcluirCorrecaoDiscursiva")?.focus();
  }

  function conclude() {
    const state = getState();
    const progress = getDiscursiveReviewProgress(state);

    if (progress.pending > 0) {
      return;
    }

    setState(markDiscursiveReviewCompleted(state));
    saveImmediate();
    onFinish();
  }

  function formatCriteria(value) {
    const criteria = String(value || "").trim();

    if (!criteria) {
      return "<p>Nenhum critério de correção foi informado.</p>";
    }

    const items = criteria.split(/;|\n/).map((item) => item.trim()).filter(Boolean);

    if (items.length <= 1) {
      return `<p>${escapeHtml(criteria)}</p>`;
    }

    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  return { init, open, render };
}
