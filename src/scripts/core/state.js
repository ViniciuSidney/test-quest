import { SESSION_SCHEMA_VERSION } from "./constants.js";

export const SESSION_STATUS = Object.freeze({
  PREPARING: "preparando",
  ACTIVE: "em_andamento",
  FINISHED: "finalizada"
});

export function createInitialState() {
  return {
    schemaVersion: SESSION_SCHEMA_VERSION,
    // Mantido durante a v0.4 para compatibilidade com exportações da v0.3.
    versao: SESSION_SCHEMA_VERSION,
    id: null,
    status: SESSION_STATUS.PREPARING,
    listaNome: "",
    questoes: [],
    atual: 0,
    respostas: {},
    anotacoes: {},
    temposMs: {},
    revisao: {},
    marcacoesAlternativas: {},
    confirmacoes: {},
    temporizadorPausado: false,
    opcoes: {
      mostrarGabaritoFinal: true,
      embaralharQuestoes: false,
      embaralharAlternativas: false,
      modoCorrecao: "final"
    },
    importadoEm: null,
    iniciadoEm: null,
    finalizadoEm: null
  };
}
