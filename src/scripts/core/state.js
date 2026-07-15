export function createInitialState() {
  return {
    versao: 2,
    listaNome: "",
    questoes: [],
    atual: 0,
    respostas: {},
    anotacoes: {},
    temposMs: {},
    revisao: {},
    opcoes: {
      mostrarGabaritoFinal: true
    },
    importadoEm: null,
    finalizadoEm: null
  };
}
