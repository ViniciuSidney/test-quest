export const METACOGNITION_LEVELS = Object.freeze({
  COMPLETE: Object.freeze({
    key: "completa",
    percentage: 100,
    label: "Resposta completa",
    description: "A resposta contempla corretamente os pontos essenciais."
  }),
  PARTIAL: Object.freeze({
    key: "parcial",
    percentage: 50,
    label: "Resposta parcial",
    description: "A resposta apresenta parte do raciocínio, mas ainda possui lacunas."
  }),
  INCORRECT: Object.freeze({
    key: "incorreta",
    percentage: 0,
    label: "Resposta incorreta",
    description: "A resposta não atende aos critérios principais de correção."
  })
});

export const METACOGNITION_LEVEL_VALUES = Object.freeze(
  Object.values(METACOGNITION_LEVELS)
);

const LEVEL_MAP = new Map(
  METACOGNITION_LEVEL_VALUES.map((item) => [item.key, item])
);

export function getMetacognitionLevel(value) {
  return LEVEL_MAP.get(String(value ?? "").trim().toLowerCase()) || null;
}

export function normalizeMetacognitionEntry(rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
    return null;
  }

  const level = getMetacognitionLevel(rawEntry.nivel ?? rawEntry.desempenho);
  const observation = String(rawEntry.observacao ?? rawEntry.observacoes ?? "");

  if (!level && !observation.trim()) {
    return null;
  }

  return {
    nivel: level?.key || "",
    percentual: level?.percentage ?? null,
    observacao: observation
  };
}

export function normalizeMetacognitionMap(rawMap, questions = []) {
  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) {
    return {};
  }

  const discursiveIds = new Set(
    questions
      .filter((question) => question?.categoria === "discursiva")
      .map((question) => question.id)
  );
  const result = {};

  Object.entries(rawMap).forEach(([questionId, rawEntry]) => {
    if (!discursiveIds.has(questionId)) {
      return;
    }

    const entry = normalizeMetacognitionEntry(rawEntry);

    if (entry) {
      result[questionId] = entry;
    }
  });

  return result;
}

export function getMetacognitionAssessment(state, questionId) {
  return normalizeMetacognitionEntry(state?.metacognicao?.[questionId]);
}

export function hasMetacognitionAssessment(state, questionId) {
  return Boolean(getMetacognitionLevel(
    getMetacognitionAssessment(state, questionId)?.nivel
  ));
}

export function setMetacognitionLevel(state, questionId, levelValue) {
  const level = getMetacognitionLevel(levelValue);

  if (!state || !questionId || !level) {
    return state;
  }

  const current = getMetacognitionAssessment(state, questionId) || {
    nivel: "",
    percentual: null,
    observacao: ""
  };

  return {
    ...state,
    metacognicao: {
      ...(state.metacognicao || {}),
      [questionId]: {
        ...current,
        nivel: level.key,
        percentual: level.percentage
      }
    }
  };
}

export function setMetacognitionObservation(state, questionId, observation) {
  if (!state || !questionId) {
    return state;
  }

  const current = getMetacognitionAssessment(state, questionId) || {
    nivel: "",
    percentual: null,
    observacao: ""
  };

  return {
    ...state,
    metacognicao: {
      ...(state.metacognicao || {}),
      [questionId]: {
        ...current,
        observacao: String(observation ?? "")
      }
    }
  };
}

export function buildMetacognitionMarkup({
  assessment = null,
  escapeHtml = (value) => String(value ?? "")
} = {}) {
  const normalized = normalizeMetacognitionEntry(assessment) || {
    nivel: "",
    percentual: null,
    observacao: ""
  };
  const selectedLevel = getMetacognitionLevel(normalized.nivel);

  return `
    <section class="resolution-metacognition" aria-labelledby="tituloMetacognicao">
      <header class="resolution-metacognition__header">
        <div>
          <p>Metacognição</p>
          <h3 id="tituloMetacognicao">Como você avalia sua resposta?</h3>
          <span>Compare sua resposta com o modelo e os critérios antes de escolher.</span>
        </div>
        <strong class="resolution-metacognition__score" aria-live="polite">
          ${selectedLevel ? `${selectedLevel.percentage}%` : "—"}
        </strong>
      </header>

      <div class="resolution-metacognition__choices" role="radiogroup" aria-label="Desempenho na questão discursiva">
        ${METACOGNITION_LEVEL_VALUES.map((level) => `
          <button
            class="resolution-metacognition__choice ${selectedLevel?.key === level.key ? "is-selected" : ""}"
            type="button"
            role="radio"
            aria-checked="${selectedLevel?.key === level.key}"
            data-metacognition-level="${level.key}"
            data-tone="${level.key}"
          >
            <strong>${escapeHtml(level.label)} (${level.percentage}%)</strong>
            <span>${escapeHtml(level.description)}</span>
          </button>
        `).join("")}
      </div>

      <label class="resolution-metacognition__observation" for="observacaoMetacognicao">
        <span>Observações <small>(opcional)</small></span>
        <textarea
          id="observacaoMetacognicao"
          rows="3"
          placeholder="Registre o que faltou, o que acertou ou o que precisa revisar."
        >${escapeHtml(normalized.observacao)}</textarea>
      </label>

      <p class="resolution-metacognition__status ${selectedLevel ? "is-complete" : ""}" aria-live="polite">
        ${selectedLevel
          ? `Autoavaliação registrada: ${escapeHtml(selectedLevel.label)} (${selectedLevel.percentage}%).`
          : "Selecione um desempenho para liberar a próxima etapa."}
      </p>
    </section>
  `;
}
