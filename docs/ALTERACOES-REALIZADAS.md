# Alterações realizadas na documentação

**Data:** 2026-07-15

## Atualizados

- `01-visao-do-projeto.md`
- `02-requisitos-e-escopo.md`
- `03-fluxos-e-telas.md`
- `04-dados-e-arquitetura.md`
- `05-roadmap.md`
- `06-testes.md`
- `07-changelog.md`
- `08-identidade-visual.md`

## Adicionados

- `README.md` — índice da documentação;
- `09-plano-de-implementacao.md` — ordem segura para implementar as telas;
- `ALTERACOES-REALIZADAS.md` — resumo deste pacote.

## Principais correções

- substituição do fluxo antigo de três telas pelo fluxo oficial de quatro telas;
- remoção conceitual da sessão salva da Importação;
- registro do Git/GitHub como concluído;
- distinção entre implementado, planejado e futuro;
- inclusão das marcações auxiliares;
- inclusão dos filtros e cards expansíveis;
- inclusão de histórico e migração no modelo de dados;
- ampliação do roteiro de testes;
- expansão dos tokens e regras da identidade visual;
- atualização do roadmap para a fase de implementação.

## Preservado

Os quatro manuais em `manuais-de-telas/` foram mantidos sem alterações, pois já são as referências aprovadas.

## v0.4-dev — Etapa 3: confiabilidade e Release Candidate

- diagnóstico de disponibilidade e cota do `localStorage`;
- códigos de erro de persistência padronizados;
- aviso visual com tentativa de recuperação;
- proteção de saída para sessão ativa não persistida;
- histórico com relatório seguro de gravação;
- migração preserva dados legados quando a nova gravação falha;
- teste integrado do ciclo completo da sessão;
- suíte ampliada para 23 arquivos automatizados;
- checklist de fechamento da v0.4.0 criado.

## v0.4.0 — Fechamento oficial

**Data:** 2026-07-18

- `APP_VERSION` promovida de `0.4-dev` para `0.4.0`;
- changelog consolidado na seção `v0.4.0`;
- README, visão, roadmap e índice documental atualizados;
- regressão de fechamento registrada;
- pacote preparado para merge na `main`, tag e Release.
