import {
  getAlternativePresentation,
  getCorrectAlternativePresentation,
  isObjectiveAnswerCorrect
} from "../../core/objective-question.js";
import { calculateSessionResult } from "../results/results.service.js";
import { formatDateTime, formatDuration, slugify } from "../../shared/formatters.js";

export const EXPORT_MIME_TYPES = Object.freeze({
  TEXT: "text/plain;charset=utf-8",
  JSON: "application/json;charset=utf-8"
});

export function createAnswersExport(state, { now = new Date() } = {}) {
  return {
    content: buildAnswersReport(state, { now }),
    fileName: `${slugify(state?.listaNome || "respostas")}-respostas.txt`,
    mimeType: EXPORT_MIME_TYPES.TEXT
  };
}

export function createNotesExport(state, { now = new Date() } = {}) {
  return {
    content: buildNotesReport(state, { now }),
    fileName: `${slugify(state?.listaNome || "anotacoes")}-anotacoes.txt`,
    mimeType: EXPORT_MIME_TYPES.TEXT
  };
}

export function createSessionJsonExport(state) {
  return {
    content: JSON.stringify(state, null, 2),
    fileName: `${slugify(state?.listaNome || "sessao")}-sessao.json`,
    mimeType: EXPORT_MIME_TYPES.JSON
  };
}

export function buildAnswersReport(state, { now = new Date() } = {}) {
  const result = calculateSessionResult(state);
  const lines = [
    "RELATÓRIO DE RESPOSTAS",
    "======================",
    `Lista: ${state?.listaNome || "Lista sem nome"}`,
    `Data de exportação: ${now.toLocaleString("pt-BR")}`,
    `Importado em: ${formatDateTime(state?.importadoEm)}`,
    `Finalizado em: ${formatDateTime(state?.finalizadoEm)}`,
    "",
    "RESUMO",
    "------",
    `Total de questões: ${result.total}`,
    `Questões respondidas: ${result.respondidas}/${result.total}`,
    `Objetivas: ${result.objetivas}`,
    `Discursivas: ${result.discursivas}`,
    `Acertos nas objetivas: ${result.objetivas > 0 ? `${result.acertos}/${result.objetivas}` : "Não disponível"}`,
    `Discursivas autoavaliadas: ${result.discursivasAvaliadas}/${result.discursivas}`,
    `Desempenho geral: ${result.questoesAvaliadas > 0 ? `${result.percentual}%` : "Não disponível"}`,
    `Tempo total: ${formatDuration(result.tempoTotal)}`,
    `Tempo médio por questão: ${formatDuration(result.tempoMedio)}`,
    `Marcadas para revisão: ${result.marcadas}`,
    "",
    "RESPOSTAS",
    "---------"
  ];

  (state?.questoes || []).forEach((question, index) => {
    const answer = state?.respostas?.[question.id] || "";
    const time = state?.temposMs?.[question.id] || 0;
    const marked = state?.revisao?.[question.id] ? "Sim" : "Não";

    lines.push("");
    lines.push(`${index + 1}. ${String(question.categoria || "").toUpperCase()} - ${question.assunto}`);
    lines.push(`Tempo usado: ${formatDuration(time)}`);
    lines.push(`Marcada para revisão: ${marked}`);
    lines.push(`Enunciado: ${question.enunciado}`);

    if (question.categoria === "objetiva") {
      const answerPresentation = getAlternativePresentation(question, answer);
      const correctPresentation = getCorrectAlternativePresentation(question);
      const status = !answer
        ? "Não respondida"
        : isObjectiveAnswerCorrect(question, answer)
          ? "Correta"
          : "Incorreta";

      lines.push(
        `Sua resposta: ${formatObjectiveAlternativeForReport(answerPresentation)}`
      );
      lines.push(
        `Resposta correta: ${formatObjectiveAlternativeForReport(correctPresentation)}`
      );
      lines.push(`Status: ${status}`);
      lines.push(`Explicação: ${question.explicacao}`);
      return;
    }

    const metacognition = state?.metacognicao?.[question.id] || {};
    const performanceLabel = metacognition.nivel
      ? `${metacognition.nivel} (${metacognition.percentual ?? 0}%)`
      : "Não avaliada";

    lines.push(`Sua resposta: ${answer || "—"}`);
    lines.push(`Resposta esperada: ${question.respostaEsperada}`);
    lines.push(`Critérios de correção: ${question.criterios}`);
    lines.push(`Metacognição: ${performanceLabel}`);
    lines.push(`Observações da metacognição: ${metacognition.observacao || "—"}`);
  });

  return lines.join("\n");
}


function formatObjectiveAlternativeForReport(presentation) {
  if (!presentation) {
    return "—";
  }

  const letter = presentation.displayLetter || "—";
  const text = String(presentation.text || "").trim();
  return text ? `${letter}) ${text}` : letter;
}

export function buildNotesReport(state, { now = new Date() } = {}) {
  const lines = [
    "ANOTAÇÕES DA RESOLUÇÃO",
    "======================",
    `Lista: ${state?.listaNome || "Lista sem nome"}`,
    `Data de exportação: ${now.toLocaleString("pt-BR")}`,
    "",
    "ANOTAÇÕES POR QUESTÃO",
    "---------------------"
  ];

  (state?.questoes || []).forEach((question, index) => {
    const note = state?.anotacoes?.[question.id] || "";
    const time = state?.temposMs?.[question.id] || 0;
    const marked = state?.revisao?.[question.id] ? "Sim" : "Não";

    lines.push("");
    lines.push(`${index + 1}. ${String(question.categoria || "").toUpperCase()} - ${question.assunto}`);
    lines.push(`Tempo usado: ${formatDuration(time)}`);
    lines.push(`Marcada para revisão: ${marked}`);
    lines.push(`Enunciado: ${question.enunciado}`);
    lines.push("");
    lines.push("Anotação:");
    lines.push(note || "—");
  });

  return lines.join("\n");
}

export function downloadExportFile(file, {
  documentRef = globalThis.document,
  urlRef = globalThis.URL
} = {}) {
  if (!file || !documentRef || !urlRef) {
    throw new Error("O ambiente atual não permite baixar arquivos.");
  }

  const blob = new Blob([file.content], { type: file.mimeType });
  const url = urlRef.createObjectURL(blob);
  const link = documentRef.createElement("a");

  link.href = url;
  link.download = file.fileName;
  documentRef.body.appendChild(link);
  link.click();
  link.remove();
  urlRef.revokeObjectURL(url);
}
