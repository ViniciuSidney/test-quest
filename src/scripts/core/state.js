export function createInitialState() {
  return {
    versao: 2,
    id: null,
    status: "preparando",
    listaNome: "",
    questoes: [],
    atual: 0,
    respostas: {},
    anotacoes: {},
    temposMs: {},
    revisao: {},
    marcacoesAlternativas: {},
    opcoes: {
      mostrarGabaritoFinal: true
    },
    importadoEm: null,
    finalizadoEm: null
  };
}
