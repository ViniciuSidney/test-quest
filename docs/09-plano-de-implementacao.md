# Plano de Implementação das Telas

## Objetivo

Substituir as telas atuais pelas cinco telas aprovadas sem perder funcionalidades e sem criar um grande lote de alterações difícil de revisar.

## Estratégia de branches

```text
main
└── base estável atual

dev
└── implementação e testes
```

Branches de feature são opcionais:

```text
feature/tela-inicial
feature/importacao-validacao
feature/resolucao
feature/resultado-final
```

## Regra principal

Implementar uma tela por vez:

1. HTML;
2. CSS;
3. integração JavaScript;
4. testes;
5. documentação;
6. commit.

Não substituir as cinco telas em um único commit.

---

# Etapa 0 — Preparação

- confirmar `git status` limpo;
- atualizar `dev`;
- criar backup da sessão local;
- identificar IDs usados pelo JavaScript;
- mapear classes legadas;
- confirmar chaves do `localStorage`;
- registrar capturas da interface atual.

Commit sugerido:

```text
docs: atualiza planejamento da implementação visual
```

---

# Etapa 1 — Tela Inicial

**Status:** concluída nesta etapa de desenvolvimento.

## Implementar

- marca;
- sessão ativa;
- nova resolução;
- indicadores;
- tema;
- rodapé.

## Integração

- mover continuação de sessão para a home;
- calcular indicadores históricos;
- abrir Importação;
- abrir Resolução.

## Testar

- primeiro acesso;
- sessão ativa;
- histórico;
- nome longo;
- tema;
- responsividade.

Commit sugerido:

```text
feat: implementa tela inicial do Test Quest
```

---

# Etapa 2 — Importação e Validação

**Status:** concluída nesta etapa de desenvolvimento.

## Implementar

- cabeçalho;
- arquivo;
- textarea;
- contadores;
- configurações;
- estados de validação;
- ações.

## Integração

- separar o parser em módulo próprio;
- desabilitar Começar quando inválido;
- invalidar após edição;
- preservar modal do modelo.

## Testar

- TXT;
- exemplo;
- erros;
- limpeza;
- validação;
- criação de sessão.

Commit sugerido:

```text
feat: implementa tela de importação e validação
```

---

# Etapa 3 — Resolução

**Status:** concluída; aguardando testes manuais.

## Implementar

- painel de progresso;
- mapa;
- anotações;
- objetiva;
- discursiva;
- barra de ações.

## Integração

- preservar temporizador;
- adicionar marcações auxiliares;
- salvar por ID;
- restaurar sessão;
- manter tempo somente na tela ativa.

## Testar

- objetiva;
- discursiva;
- anotações;
- mapa;
- revisão;
- pausa;
- aba oculta;
- restauração.

Commit sugerido:

```text
feat: implementa nova tela de resolução
```

---

# Etapa 4 — Tela de Desempenho

**Status:** concluído.

## Implementar

- estrutura única;
- seis faixas dinâmicas;
- cores semânticas;
- CTA para o Resultado Final;
- responsividade e acessibilidade.

## Integração

- reutilizar o percentual final das objetivas;
- pular a tela em sessões somente discursivas;
- não iniciar novamente o temporizador.

## Testar

- limites de todas as faixas;
- textos e cores;
- desktop, tablet e mobile;
- fluxo para o Resultado Final.

Commit sugerido:

```text
feat: implementa tela de desempenho
```

---

# Etapa 5 — Resultado Final

**Status:** próxima etapa.

## Implementar

- resultado geral;
- por assunto;
- filtros;
- cards resumidos;
- expansões;
- exportações.

## Integração

- calcular dados;
- tratar sessão sem objetivas;
- limitar a um card expandido;
- preservar exportações.

## Testar

- filtros;
- objetiva expandida;
- discursiva expandida;
- não respondida;
- por assunto;
- arquivos exportados.

Commit sugerido:

```text
feat: implementa tela de resultado final
```

---

# Etapa 6 — Modais

Planejar e implementar:

- modelo aceito;
- limpar importação;
- substituir sessão ativa;
- finalizar sessão;
- apagar progresso;
- erro de migração, se necessário.

Commit sugerido:

```text
feat: padroniza modais e confirmações
```

---

# Etapa 7 — Modularização

- separar controllers;
- centralizar storage;
- criar migrações;
- centralizar formatadores;
- organizar CSS;
- remover estilos legados não utilizados.

Commit sugerido:

```text
refactor: modulariza telas e persistência
```

---

# Etapa 8 — Validação final

- executar `06-testes.md`;
- corrigir regressões;
- atualizar changelog;
- revisar README;
- testar GitHub Pages;
- abrir Pull Request;
- revisar diferenças;
- merge em `main`.

## Critério de Pull Request

O PR só deve ser aberto quando:

- fluxo completo estiver funcional;
- testes críticos estiverem OK;
- documentação estiver atualizada;
- não houver dados sensíveis;
- console estiver limpo;
- `git status` estiver limpo.
