# Changelog

Todas as mudanças importantes do Test Quest serão registradas neste arquivo.

## [Não lançado]

### v0.5-dev — Fundação de alternativas e respostas

#### Adicionado

- módulo `core/objective-question.js` para identidade, apresentação e correção das alternativas;
- identificadores estáveis para cada alternativa objetiva;
- campo canônico `respostaCorretaId`;
- testes do modelo objetivo e da estrutura inicial da v0.5.

#### Alterado

- versão de desenvolvimento passa a `0.5-dev`;
- esquema de sessão passa a `schemaVersion: 4`;
- respostas objetivas e marcações auxiliares passam a usar IDs estáveis;
- parser passa a produzir alternativas estruturadas;
- controlador, resultados e exportações deixam de depender da letra original como identidade;
- suíte automatizada passa de 23 para 26 arquivos.

#### Preservado

- visual e fluxo das cinco telas;
- letras A–E apresentadas ao usuário;
- formato textual legível dos relatórios;
- migração automática e backups da v0.4;
- sessões discursivas e demais funcionalidades existentes.

## [v0.4.0] — 2026-07-18

### Adicionado

- esquema versionado de sessão em `core/session-schema.js`;
- repositório de sessão com migração, validação e recuperação;
- repositório de configurações com migração da preferência de tema;
- backups locais limitados para dados migrados e cargas inválidas;
- testes automatizados de esquema, persistência, configurações e histórico;
- runner único `tests/run-all-tests.mjs` para executar toda a suíte;
- documento técnico da v0.4.
- fallback visual para falhas críticas durante a inicialização.
- serviço de ciclo de vida da sessão;
- serviço dedicado às confirmações da sessão;
- serviço de geração e download das exportações;
- formatadores compartilhados;
- testes de ciclo de vida, confirmações, exportações, formatadores e estrutura da modularização;
- diagnóstico de leitura e escrita do armazenamento local;
- aviso visual recuperável para armazenamento indisponível ou cheio;
- teste integrado do fluxo completo da sessão;
- testes de resiliência, proteção de saída e regressão de release.

### Alterado

- chave da sessão ativa passa a ser `testQuest.state`;
- chave de configurações passa a ser `testQuest.settings`;
- histórico passa ao esquema 2, com normalização e deduplicação;
- estado da sessão passa ao esquema 3 e recebe `iniciadoEm`;
- controlador principal deixa de acessar `localStorage` diretamente;
- versão da aplicação passa a `0.4.0`.
- criação, restauração e finalização de sessões deixam o controlador visual;
- cálculo de resultado e tempo total passa ao serviço de resultados;
- relatórios TXT e JSON deixam de ser montados dentro do controlador;
- confirmações deixam de manter textos repetidos no controlador;
- controlador principal passa de 2310 para aproximadamente 2050 linhas;
- suíte automatizada passa de 14 para 19 arquivos de teste;
- na etapa de confiabilidade, a suíte passa de 19 para 23 arquivos;
- gravações de sessão e histórico passam a informar códigos de falha;
- migrações que não podem ser gravadas permanecem disponíveis apenas em memória e preservam a chave anterior;
- a página passa a alertar antes de sair quando existe sessão ativa sem persistência confirmada.

### Preservado

- migração automática das chaves `resolvedorQuestoesV2.estado` e `resolvedorQuestoesV2.config`;
- respostas, anotações, tempos, marcações e opções das sessões antigas;
- fluxo e interface completos da v0.3.0.

## [v0.3.0] — 2026-07-17

### Adicionado

- repositório Git local;
- repositório remoto no GitHub;
- branches `main` e `dev`;
- manual separado da Tela Inicial;
- manual separado da Importação e Validação;
- manual da Resolução objetiva e discursiva;
- manual do Resultado Final;
- manual da Tela de Desempenho;
- layouts oficiais das cinco telas;
- fluxo oficial com Tela Inicial;
- planejamento das marcações auxiliares;
- planejamento dos filtros e cards expansíveis;
- índice da documentação;
- plano de implementação das telas;
- Tela Inicial oficial;
- gerenciador central de telas;
- serviço de histórico de sessões concluídas;
- indicadores de questões respondidas, acertos, tempo e sessões;
- botão temporário de retorno à Home na importação legada;
- Tela de Importação e Validação oficial;
- painel de contadores de questões e assuntos;
- estados inicial, pendente, validando, válido e inválido;
- módulo `question-import.parser.js`;
- coleta de múltiplos problemas de importação;
- teste unitário do parser.
- Tela de Resolução oficial;
- layout comum para objetivas e discursivas;
- cards objetivos com seleção oficial;
- marcadores auxiliares em três estados;
- módulo `question-resolution.helpers.js`;
- testes `resolution-state.test.mjs` e `resolution-structure.test.mjs`;
- cabeçalho próprio da Resolução;
- barra de ações dividida entre sessão e navegação;
- Tela de Desempenho intermediária;
- seis estados visuais dinâmicos por faixa de acerto;
- módulo `performance.service.js`;
- testes `performance-state.test.mjs` e `performance-structure.test.mjs`;
- overlay translúcido de desempenho sobre o Resultado Final;
- animação de entrada com contagem progressiva do percentual;
- transição suave para revelar o Resultado Final;
- Tela de Resultado Final oficial;
- painel de indicadores gerais;
- desempenho por assunto com percentuais, tempos e barras semânticas;
- filtros Todas, Erradas, Discursivas, Revisão e Não respondidas;
- cards resumidos com estados correta, incorreta, discursiva e não respondida;
- expansão exclusiva de cards objetivos e discursivos;
- estados vazios específicos para cada filtro;
- módulo `results.service.js`;
- testes `results-state.test.mjs` e `results-structure.test.mjs`.

### Corrigido

- total visível do temporizador passa a somar os mesmos segundos inteiros exibidos em cada questão;
- tempos associados a IDs fora da sessão atual deixam de entrar no total;
- espaçamento horizontal do assunto da questão foi ampliado;
- modal de finalização organiza respondidas, pendentes e revisão em uma lista semântica;
- cabeçalho legado deixa de aparecer na Tela de Resultado Final;
- indicadores e textos do Resultado Final deixam de se sobrepor em janelas baixas e larguras intermediárias;
- card expandido passa a ocupar uma linha própria, mantendo os demais cards abaixo no fluxo;
- botões de exportação e retorno permanecem contidos na barra de ações em telas menores;

- barra de ações permanece contida no painel em larguras menores que `820px`;
- cabeçalho fixo da Importação recebe fundo, borda e sombra próprios durante a rolagem;
- envoltório visual desigual do seletor de arquivo;
- largura insuficiente dos cards de contadores;
- confirmações nativas substituídas por modal customizado e acessível.

### Alterado

- fonte monoespaçada de aparência digital no percentual e no símbolo `%`;
- indicação compacta da base do cálculo, como `10 acertos em 10 questões objetivas`;
- Fade In na entrada e Fade Out na saída da Tela de Desempenho;
- brilho circular giratório atrás da porcentagem principal.

- documentação atualizada para cinco telas;
- requisitos separados por estado;
- arquitetura preparada para histórico e migração;
- roadmap reorganizado;
- roteiro de testes ampliado;
- identidade visual detalhada;
- sessão salva movida conceitualmente para a Tela Inicial;
- próxima etapa definida como implementação gradual na `dev`;
- aplicação passa a abrir na Tela Inicial;
- sessão salva deixa de ocupar a tela de importação;
- retorno da Resolução direciona para a Tela Inicial;
- retorno do Resultado preserva o histórico e encerra a sessão ativa;
- botões de tema passam a compartilhar um único comportamento;
- botão Começar passa a exigir validação válida e atual;
- qualquer edição no conteúdo invalida a análise anterior;
- contadores aparecem somente após validação;
- seletor de arquivo e configurações seguem o layout oficial;
- parser deixa de permanecer concentrado no controlador da Resolução.
- resposta oficial passa a ser independente das marcações auxiliares;
- mapa de questões recebe rótulos acessíveis e estado atual;
- navegação registra o tempo antes de trocar a questão;
- estado pausado do temporizador passa a ser persistido;
- finalização passa a exigir confirmação mesmo com todas as questões respondidas;
- finalização com objetivas passa pela Tela de Desempenho antes do Resultado Final;
- sessões somente discursivas seguem diretamente para o Resultado Final;
- Tela de Desempenho deixa de usar painéis decorativos simulados;
- Resultado Final passa a ser renderizado ao fundo antes da abertura do overlay de desempenho;
- resultado legado é substituído pelo layout oficial de resumo lateral e revisão principal;
- apenas um card de revisão permanece expandido;
- questões não respondidas deixam de ser classificadas como incorretas nos filtros;
- sessões sem objetivas mostram desempenho indisponível em vez de `0%`;
- exportações permanecem disponíveis na barra inferior oficial.

### Corrigido

- temporizador não continua ao voltar para a Tela Inicial;
- uma sessão reaberta para revisão deixa temporariamente de contar no histórico;
- substituição de sessão ativa exige apenas uma confirmação no fluxo normal;
- corrida entre leituras sucessivas de arquivos não sobrescreve a seleção mais recente;
- ID duplicado do tipo da questão foi removido;
- troca de tema na Importação não produz contraste intermediário incorreto;
- modal do modelo restaura o foco ao ser fechado.
- regras legadas de grid da Resolução deixam de deslocar o workspace;
- layouts tablet e mobile deixam de sobrepor progresso, questão e anotações;
- seleção e marcadores restauram o foco após atualização dinâmica.

### Preservado

- base funcional `v0.2.5-dev`;
- chaves legadas do `localStorage`;
- respostas, anotações, tempos e revisão;
- exportações TXT e JSON;
- funcionamento estático;
- histórico anterior do changelog.

---

## [v0.2.5-dev] — 2026-07-13

### Alterado

- proporção entre painel lateral e anotações;
- tamanho e disposição da resposta discursiva;
- compactação de botões, temporizadores e barra de ações.

## [v0.2.4-dev]

### Alterado

- reorganização da tela de resolução;
- painel de anotações separado;
- barra de ações independente.

## [v0.2.3-dev]

### Corrigido

- sobreposição na tela de importação ao exibir sessão salva.

### Adicionado

- modal com o modelo de questões.

## [v0.2.2-dev]

### Corrigido

- temporizador contando fora da tela de resolução.

### Alterado

- estilo do seletor de arquivo;
- altura do campo de importação.

## [v0.2-dev]

### Adicionado

- salvamento com `localStorage`;
- temporizador por questão;
- anotações;
- tema claro e escuro;
- marcação para revisão;
- exportação TXT e JSON;
- desempenho por assunto.

### Alterado — App Shell global amplo

- a largura máxima global passou a `1880px`;
- todas as telas agora aproveitam quase toda a largura da viewport em monitores comuns;
- margens laterais passaram a usar espaçamento fluido compartilhado;
- Home, Importação, Resolução e Resultado Final receberam proporções internas específicas em telas largas;
- limites máximos continuam protegendo a leitura em monitores ultrawide;
- os breakpoints mobile existentes foram preservados.

## [v0.3-dev] — ajustes de exemplo e refinamento dos cards de resultado

### Alterado

- o exemplo interno e o arquivo de exemplo passaram a usar uma lista simples de Gramática em Português;
- o nome automático do exemplo agora é `Lista exemplo - Gramática`.

### Melhorado

- o bloco `Resultado Geral` passou a priorizar 3 cards por linha em telas largas e 2 por linha em larguras menores;
- os cards expandidos da revisão receberam blocos internos com alturas mais padronizadas;
- blocos textuais longos agora usam rolagem interna individual para preservar a altura visual dos cards;
- a leitura dos detalhes de questões objetivas e discursivas ficou mais consistente entre diferentes tamanhos de conteúdo.


## [v0.3-dev] — ações mobile e card discursivo

### Melhorado

- as exportações do Resultado Final passaram a ficar dentro do toggle `Ações da sessão` em telas de até 720px;
- o botão `Voltar ao início` permanece visível fora do toggle;
- o painel de exportações é removido da navegação por teclado enquanto estiver recolhido;
- o card discursivo expandido foi reorganizado em três linhas: enunciado e tempo, resposta e resposta esperada, critérios e anotações;
- a organização discursiva retorna para uma coluna no mobile.

## [v0.3-dev] — filtros compactos e encaixe da Tela de Desempenho

### Corrigido

- o bloco `Tempo utilizado` do card discursivo passou a alinhar seu conteúdo pelo topo;
- o toggle `Ações da sessão` deixou de aparecer fora do breakpoint mobile;
- a Tela de Desempenho passou a respeitar a altura dinâmica da viewport, sem extrapolar em 100% de zoom.

### Melhorado

- os filtros da revisão passaram a usar um toggle compacto em telas de até 900px;
- o filtro ativo é informado no próprio toggle;
- ao selecionar um filtro em tela compacta, o painel é recolhido automaticamente para devolver espaço à listagem;
- filtros e exportações recolhidos são removidos da navegação por teclado.
