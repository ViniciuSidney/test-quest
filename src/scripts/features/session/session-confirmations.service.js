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
        label: "Discursivas sem metacognição",
        value: String(unassessedDiscursives),
        tone: "warning"
      }] : [])
    ],
    note: unanswered > 0 || unconfirmed > 0 || unassessedDiscursives > 0
      ? "A sessão pode ser finalizada, mas ainda existem questões pendentes, sem confirmação ou sem autoavaliação."
      : "Todas as questões foram respondidas. O resultado será exibido após a confirmação.",
    confirmText: "Finalizar resolução",
    variant: "warning"
  };
}
