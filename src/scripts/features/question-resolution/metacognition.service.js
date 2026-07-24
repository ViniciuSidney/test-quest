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
    observacao: observation,
    ...(rawEntry.registradoEm ? { registradoEm: normalizeDate(rawEntry.registradoEm) } : {})
  };
}

export function normalizeDiscursiveAssessmentEntry(rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
    return null;
  }

  const hasSeparatedData = Object.prototype.hasOwnProperty.call(rawEntry, "metacognicaoInicial") ||
    Object.prototype.hasOwnProperty.call(rawEntry, "vereditoFinal") ||
    Object.prototype.hasOwnProperty.call(rawEntry, "initial") ||
    Object.prototype.hasOwnProperty.call(rawEntry, "finalVerdict");

  if (!hasSeparatedData) {
    const legacy = normalizeMetacognitionEntry(rawEntry);

    if (!legacy) {
      return null;
    }

    // Até o schema 6 a mesma autoavaliação também era a pontuação oficial.
    // A migração duplica o registro para preservar os resultados históricos.
    return {
      metacognicaoInicial: { ...legacy },
      vereditoFinal: { ...legacy }
    };
  }

  const initial = normalizeMetacognitionEntry(
    rawEntry.metacognicaoInicial ?? rawEntry.initial
  );
  const finalVerdict = normalizeMetacognitionEntry(
    rawEntry.vereditoFinal ?? rawEntry.finalVerdict
  );

  if (!initial && !finalVerdict) {
    return null;
  }

  return {
    ...(initial ? { metacognicaoInicial: initial } : {}),
    ...(finalVerdict ? { vereditoFinal: finalVerdict } : {})
  };
}

export function normalizeDiscursiveAssessmentsMap(rawMap, questions = []) {
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

    const entry = normalizeDiscursiveAssessmentEntry(rawEntry);

    if (entry) {
      result[questionId] = entry;
    }
  });

  return result;
}

// Compatibilidade de importação com testes e integrações anteriores.
export function normalizeMetacognitionMap(rawMap, questions = []) {
  return normalizeDiscursiveAssessmentsMap(rawMap, questions);
}

export function getDiscursiveAssessmentRecord(state, questionId) {
  const rawRecord = state?.avaliacoesDiscursivas?.[questionId];

  if (rawRecord) {
    return normalizeDiscursiveAssessmentEntry(rawRecord);
  }

  const legacy = normalizeMetacognitionEntry(state?.metacognicao?.[questionId]);
  return legacy
    ? { metacognicaoInicial: { ...legacy }, vereditoFinal: { ...legacy } }
    : null;
}

export function getInitialMetacognition(state, questionId) {
  return normalizeMetacognitionEntry(
    getDiscursiveAssessmentRecord(state, questionId)?.metacognicaoInicial
  );
}

export function getFinalVerdict(state, questionId) {
  return normalizeMetacognitionEntry(
    getDiscursiveAssessmentRecord(state, questionId)?.vereditoFinal
  );
}

// Alias legados: “metacognição” agora representa somente a percepção inicial.
export function getMetacognitionAssessment(state, questionId) {
  return getInitialMetacognition(state, questionId);
}

export function hasInitialMetacognition(state, questionId) {
  return Boolean(getMetacognitionLevel(getInitialMetacognition(state, questionId)?.nivel));
}

export function hasFinalVerdict(state, questionId) {
  return Boolean(getMetacognitionLevel(getFinalVerdict(state, questionId)?.nivel));
}

export function hasMetacognitionAssessment(state, questionId) {
  return hasInitialMetacognition(state, questionId);
}

export function setInitialMetacognitionLevel(state, questionId, levelValue) {
  return updateAssessment(state, questionId, "metacognicaoInicial", (current) => {
    const level = getMetacognitionLevel(levelValue);
    return level
      ? { ...current, nivel: level.key, percentual: level.percentage }
      : current;
  });
}

export function setInitialMetacognitionObservation(state, questionId, observation) {
  return updateAssessment(state, questionId, "metacognicaoInicial", (current) => ({
    ...current,
    observacao: String(observation ?? "")
  }));
}

export function setFinalVerdictLevel(state, questionId, levelValue, {
  now = () => new Date().toISOString()
} = {}) {
  return updateAssessment(state, questionId, "vereditoFinal", (current) => {
    const level = getMetacognitionLevel(levelValue);
    return level
      ? {
          ...current,
          nivel: level.key,
          percentual: level.percentage,
          registradoEm: now()
        }
      : current;
  });
}

export function setFinalVerdictObservation(state, questionId, observation) {
  return updateAssessment(state, questionId, "vereditoFinal", (current) => ({
    ...current,
    observacao: String(observation ?? "")
  }));
}

// Aliases para chamadas antigas dentro da Resolução.
export const setMetacognitionLevel = setInitialMetacognitionLevel;
export const setMetacognitionObservation = setInitialMetacognitionObservation;

export function buildMetacognitionMarkup({
  assessment = null,
  referenceVisible = false,
  escapeHtml = (value) => String(value ?? "")
} = {}) {
  const normalized = normalizeMetacognitionEntry(assessment) || emptyAssessment();
  const selectedLevel = getMetacognitionLevel(normalized.nivel);

  return `
    <section class="resolution-metacognition" aria-labelledby="tituloMetacognicao">
      <header class="resolution-metacognition__header">
        <div>
          <p>Metacognição inicial</p>
          <h3 id="tituloMetacognicao">Como você percebe sua resposta?</h3>
          <span>${referenceVisible
            ? "Registre como você avaliava a resposta antes de comparar com o modelo."
            : "Avalie sua resposta pelo próprio raciocínio; esta percepção não define a pontuação final."}</span>
        </div>
        <strong class="resolution-metacognition__score" aria-live="polite">
          ${selectedLevel ? `${selectedLevel.percentage}%` : "—"}
        </strong>
      </header>

      <div class="resolution-metacognition__choices" role="radiogroup" aria-label="Percepção inicial da resposta discursiva">
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
        <span>Observação inicial <small>(opcional)</small></span>
        <textarea
          id="observacaoMetacognicao"
          rows="3"
          placeholder="Registre o que acredita ter acertado, esquecido ou desenvolvido parcialmente."
        >${escapeHtml(normalized.observacao)}</textarea>
      </label>

      <p class="resolution-metacognition__status ${selectedLevel ? "is-complete" : ""}" aria-live="polite">
        ${selectedLevel
          ? `Percepção inicial registrada: ${escapeHtml(selectedLevel.label)} (${selectedLevel.percentage}%).`
          : "Selecione uma percepção inicial para continuar."}
      </p>
    </section>
  `;
}

export function buildFinalVerdictMarkup({
  verdict = null,
  escapeHtml = (value) => String(value ?? ""),
  compact = false
} = {}) {
  const normalized = normalizeMetacognitionEntry(verdict) || emptyAssessment();
  const selectedLevel = getMetacognitionLevel(normalized.nivel);

  return `
    <section class="resolution-final-verdict ${compact ? "resolution-final-verdict--compact" : ""}" aria-labelledby="tituloVereditoFinal">
      <header class="resolution-final-verdict__header">
        <div>
          <p>Veredito final</p>
          <h3 id="tituloVereditoFinal">Após comparar, qual é o resultado real?</h3>
          <span>Somente este veredito será usado no desempenho geral e na revisão de erros.</span>
        </div>
        <strong class="resolution-final-verdict__score" aria-live="polite">
          ${selectedLevel ? `${selectedLevel.percentage}%` : "—"}
        </strong>
      </header>

      <div class="resolution-final-verdict__choices" role="radiogroup" aria-label="Veredito final da resposta discursiva">
        ${METACOGNITION_LEVEL_VALUES.map((level) => `
          <button
            class="resolution-final-verdict__choice ${selectedLevel?.key === level.key ? "is-selected" : ""}"
            type="button"
            role="radio"
            aria-checked="${selectedLevel?.key === level.key}"
            data-final-verdict-level="${level.key}"
            data-tone="${level.key}"
          >
            <strong>${escapeHtml(level.label)}</strong>
            <span>${level.percentage}%</span>
          </button>
        `).join("")}
      </div>

      <label class="resolution-final-verdict__observation" for="observacaoVereditoFinal">
        <span>Observação após a correção <small>(opcional)</small></span>
        <textarea
          id="observacaoVereditoFinal"
          rows="3"
          placeholder="Registre algo que percebeu ao comparar sua resposta com o modelo."
        >${escapeHtml(normalized.observacao)}</textarea>
      </label>
    </section>
  `;
}

function updateAssessment(state, questionId, field, updater) {
  if (!state || !questionId || typeof updater !== "function") {
    return state;
  }

  const currentRecord = getDiscursiveAssessmentRecord(state, questionId) || {};
  const currentEntry = normalizeMetacognitionEntry(currentRecord[field]) || emptyAssessment();
  const nextEntry = updater(currentEntry);

  return {
    ...state,
    avaliacoesDiscursivas: {
      ...(state.avaliacoesDiscursivas || {}),
      [questionId]: {
        ...currentRecord,
        [field]: nextEntry
      }
    }
  };
}

function emptyAssessment() {
  return { nivel: "", percentual: null, observacao: "" };
}

function normalizeDate(value) {
  const timestamp = Date.parse(String(value || ""));
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}
