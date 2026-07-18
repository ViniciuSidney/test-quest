import { STORAGE_ERROR_CODES } from "../../shared/storage.js";

export function getPersistenceWarning(errorCode) {
  switch (errorCode) {
    case STORAGE_ERROR_CODES.QUOTA_EXCEEDED:
      return {
        title: "O armazenamento do navegador está cheio.",
        description: "A sessão continua aberta nesta aba, mas novas alterações podem não ser recuperadas depois de fechar ou recarregar a página. Libere espaço do site e tente salvar novamente.",
        tone: "warning"
      };

    case STORAGE_ERROR_CODES.UNAVAILABLE:
      return {
        title: "O salvamento local está indisponível.",
        description: "A sessão pode continuar nesta aba, mas as alterações não estão protegidas contra fechamento ou recarregamento. Verifique as permissões do navegador e tente novamente.",
        tone: "danger"
      };

    default:
      return {
        title: "Não foi possível salvar localmente.",
        description: "A sessão continua nesta aba, mas as alterações podem ser perdidas ao sair. Tente novamente antes de fechar ou recarregar a página.",
        tone: "danger"
      };
  }
}

export function shouldProtectBeforeUnload({ persistenceAtRisk = false, hasSession = false } = {}) {
  return Boolean(persistenceAtRisk && hasSession);
}
