export function getClearImportConfirmation() {
  return {
    label: "Limpar importação",
    title: "Limpar todo o conteúdo?",
    message: "O arquivo selecionado, o texto importado, o nome da lista e as configurações desta importação serão removidos.",
    confirmText: "Limpar conteúdo",
    variant: "danger"
  };
}

export function getDeleteSessionConfirmation() {
  return {
    label: "Apagar progresso",
    title: "Apagar a sessão salva?",
    message: "Respostas, anotações, tempos e marcações da sessão em andamento serão removidos deste navegador.",
    confirmText: "Apagar progresso",
    variant: "danger"
  };
}

export function getReplaceSessionConfirmation() {
  return {
    label: "Substituir sessão",
    title: "Iniciar uma nova resolução?",
    message: "A resolução em andamento será substituída pela lista que acabou de ser validada.",
    confirmText: "Substituir sessão",
    variant: "danger"
  };
}

export function getNewResolutionConfirmation() {
  return {
    label: "Nova resolução",
    title: "Preparar uma nova lista?",
    message: "Existe uma resolução em andamento. O progresso atual será substituído quando a nova lista for iniciada.",
    confirmText: "Preparar nova lista",
    variant: "danger"
  };
}


export function getRetryWrongQuestionsConfirmation(summary = {}, listName = "") {
  const total = Math.max(0, Number(summary.total) || 0);
  const objectives = Math.max(0, Number(summary.objetivas) || 0);
  const discursives = Math.max(0, Number(summary.discursivas) || 0);
  const sourceName = String(listName || "").trim() || "Lista sem nome";

  return {
    label: "Refazer questões erradas",
    title: total === 1 ? "Refazer a questão errada?" : `Refazer ${total} questões erradas?`,
    message: `Uma nova sessão de revisão será criada a partir de “${sourceName}”. O resultado atual continuará registrado no histórico.`,
    items: [
      {
        label: "Questões na revisão",
        value: String(total),
        tone: "review"
      },
      {
        label: "Objetivas e V/F",
        value: String(objectives),
        tone: objectives > 0 ? "warning" : "neutral"
      },
      {
        label: "Discursivas com 0%",
        value: String(discursives),
        tone: discursives > 0 ? "warning" : "neutral"
      }
    ],
    note: "Respostas, confirmações, tempos, marcações, anotações e metacognição serão reiniciados apenas na nova tentativa.",
    confirmText: "Iniciar revisão de erros",
    variant: "warning"
  };
}

export function getFinishSessionConfirmation(result = {}, markedCount = 0, unconfirmedCount = 0, unassessedDiscursiveCount = 0) {
  const total = Number(result.total) || 0;
  const answered = Number(result.respondidas) || 0;
  const unanswered = Math.max(0, total - answered);
  const marked = Math.max(0, Number(markedCount) || 0);
  const unconfirmed = Math.max(0, Number(unconfirmedCount) || 0);
  const unassessedDiscursives = Math.max(0, Number(unassessedDiscursiveCount) || 0);

  return {
    label: "Finalizar sessão",
    title: unanswered > 0 ? "Existem questões não respondidas" : "Finalizar esta resolução?",
    message: "Confira o resumo da sessão antes de finalizar.",
    items: [
      {
        label: "Questões respondidas",
        value: `${answered} de ${total}`,
        tone: answered === total ? "success" : "neutral"
      },
      {
        label: "Sem resposta",
        value: String(unanswered),
        tone: unanswered > 0 ? "warning" : "success"
      },
      {
        label: "Marcadas para revisão",
        value: String(marked),
        tone: marked > 0 ? "review" : "neutral"
      },
      ...(unconfirmed > 0 ? [{
        label: "Sem confirmação imediata",
        value: String(unconfirmed),
        tone: "warning"
      }] : []),
      ...(unassessedDiscursives > 0 ? [{
        label: "Discursivas sem percepção inicial",
        value: String(unassessedDiscursives),
        tone: "warning"
      }] : [])
    ],
    note: unanswered > 0 || unconfirmed > 0 || unassessedDiscursives > 0
      ? "A sessão pode ser finalizada, mas ainda existem questões pendentes, sem confirmação ou sem percepção inicial."
      : "Todas as questões foram respondidas. O resultado será exibido após a confirmação.",
    confirmText: "Finalizar resolução",
    variant: "warning"
  };
}
