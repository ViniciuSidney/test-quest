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

## v0.5-dev — Fundação de alternativas e respostas

- versão de desenvolvimento iniciada;
- esquema de sessão atualizado para 4;
- criado o modelo central de alternativas objetivas;
- respostas, gabarito e marcadores passaram a usar IDs estáveis;
- migração da estrutura da v0.4 implementada;
- interface e relatórios continuaram apresentando letras A–E;
- testes automatizados ampliados para 26 arquivos;
- próxima etapa definida como embaralhamento de alternativas.


## v0.5-dev — Etapa 2: embaralhamento de alternativas

- adicionada opção própria na tela de Importação;
- ordem das alternativas definida ao criar a sessão e preservada no estado;
- IDs, resposta correta, resposta oficial e marcadores mantidos após a reordenação;
- Resultado Final e TXT passam a mostrar letra visual e texto da alternativa;
- exemplo e guia de importação adaptados para explicações independentes das letras;
- adicionados testes de ordem, restauração, correção e estrutura;
- suíte ampliada para 28 arquivos de teste.


## v0.5-dev — Etapa 5: refazer questões erradas

- criada ação de revisão no Resultado Final;
- objetivas e V/F incorretas passam a formar uma nova sessão;
- discursivas avaliadas em 0% também entram na revisão;
- sessão original permanece registrada no histórico;
- nova tentativa recebe ID próprio e mapas de progresso vazios;
- configurações de embaralhamento e correção são preservadas;
- filtro `Erradas` atualizado;
- suíte automatizada ampliada para 36 arquivos.


## v0.5.0 — Fechamento oficial

- regressão manual final aprovada;
- 45 arquivos de teste automatizados aprovados;
- `APP_VERSION` promovida de `0.5-dev` para `0.5.0`;
- roadmap e estado do projeto atualizados;
- changelog consolidado na seção `v0.5.0`;
- checklist de fechamento e notas oficiais da Release adicionados;
- pacote preparado para merge, tag e publicação.
