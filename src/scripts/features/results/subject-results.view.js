import { getSubjectPerformanceTone } from "./results.service.js";

export function buildSubjectResultsMarkup({
  items = [],
  expandedKeys = new Set(),
  formatDuration = (value) => String(value ?? ""),
  escapeHtml = (value) => String(value ?? "")
} = {}) {
  return items.map((item) => {
    const hasAssessment = item.scoredQuestions > 0;
    const percentage = hasAssessment ? item.percentage : null;
    const tone = getSubjectPerformanceTone(percentage);
    const subjectKey = encodeURIComponent(item.subject);
    const expanded = expandedKeys.has(subjectKey);
    const totalLabel = item.total === 1
      ? "1 questão nesta lista"
      : `${item.total} questões nesta lista`;
    const answeredLabel = item.answered === 1
      ? "1 respondida"
      : `${item.answered} respondidas`;
    const meta = `${totalLabel} • ${answeredLabel} • ${formatDuration(item.timeMs)}`;
    const progress = hasAssessment
      ? `
        <div
          class="subject-result-progress"
          role="progressbar"
          aria-label="Desempenho em ${escapeHtml(item.subject)}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percentage}"
        >
          <div class="subject-result-progress__value" style="--subject-percentage: ${percentage}%;"></div>
        </div>
      `
      : "";
    const details = item.questions.map((question) => {
      const contribution = question.contributionPercentage === null
        ? "—"
        : `${question.contributionPercentage}%`;

      return `
        <li class="subject-result-question" data-tone="${question.tone}">
          <span class="subject-result-question__number">${String(question.number).padStart(2, "0")}</span>
          <span class="subject-result-question__type">${escapeHtml(question.typeLabel)}</span>
          <strong class="subject-result-question__status">${escapeHtml(question.statusLabel)}</strong>
          <time class="subject-result-question__time">${formatDuration(question.timeMs)}</time>
          <span class="subject-result-question__contribution" title="Contribuição para o desempenho do assunto">(${contribution})</span>
        </li>
      `;
    }).join("");

    return `
      <article class="subject-result-item ${expanded ? "is-expanded" : ""}" data-tone="${tone}">
        <button
          class="subject-result-toggle"
          type="button"
          data-subject-result-toggle="${escapeHtml(subjectKey)}"
          aria-expanded="${expanded}"
        >
          <span class="subject-result-toggle__copy">
            <strong title="${escapeHtml(item.subject)}">${escapeHtml(item.subject)}</strong>
            <span class="subject-result-item__meta">${meta}</span>
          </span>
          <span class="subject-result-item__percentage">${hasAssessment ? `${percentage}%` : "—"}</span>
          <span class="subject-result-toggle__chevron" aria-hidden="true">⌄</span>
        </button>
        ${progress}
        <div class="subject-result-details" ${expanded ? "" : "hidden"}>
          <ol>${details}</ol>
        </div>
      </article>
    `;
  }).join("");
}
