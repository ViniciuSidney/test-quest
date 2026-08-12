# Changelog

Todas as mudanças importantes do Test Quest são registradas neste arquivo.

## [Não lançado]

### Integração

- entrada orientada pelo Study Stack com abertura direta da importação, vínculo
  visível, nome sugerido editável e sequência estruturada;
- retorno automático da sessão pelo contrato `1.1.0`;
- contexto removido após a entrega para impedir vínculo residual;
- exportação manual de recuperação exibida apenas quando o retorno falha.

### Interface

- backup nativo renomeado para **Baixar cópia da sessão**;
- **Salvar no Study Stack e voltar** permanece como ação principal vinculada;
- resultado informa a base do aproveitamento;
- desempenho por assunto separa total, respondidas e tempo.

### Qualidade

- 47 arquivos de teste aprovados;
- fluxo conjunto validado e registrado em
  `26-validacao-integracao-study-stack.md`;
- schema nativo preservado em `7`.

## [v0.5.0] — 2026-07-24

### Adicionado

- alternativas objetivas com IDs estáveis e gabarito por `respostaCorretaId`;
- opção de embaralhar alternativas preservando respostas, marcadores e correção;
- questões de Verdadeiro ou Falso com ordem fixa e layout próprio;
- modo de gabarito imediato com confirmação e bloqueio da resposta;
- Metacognição inicial para respostas discursivas;
- Veredito Final independente em 100%, 50% ou 0%;
- tela Wizard de Correção Discursiva no modo de gabarito ao final;
- retomada da Correção Discursiva pela Tela Inicial;
- ação para refazer questões erradas em uma nova sessão;
- controle manual de efeitos visuais: Sistema, Completos e Reduzidos;
- detalhamento expansível do desempenho por assunto e por questão;
- mapa semântico de acerto, desempenho parcial e erro;
- ícone oficial, favicon e ícones do manifesto;
- testes específicos dos novos fluxos e regras.

### Alterado

- esquema da sessão promovido para `schemaVersion: 7`;
- respostas e marcações objetivas passam a usar IDs estáveis;
- desempenho geral passa a combinar objetivas e discursivas pelo Veredito Final;
- contador de respostas corretas inclui discursivas avaliadas em 100%;
- revisão de erros usa o Veredito Final e inclui discursivas de 0%;
- Resultado Final apresenta Metacognição inicial e Veredito Final separadamente;
- desempenho por assunto usa resumo unificado de questões e tempo;
- layout da Resolução recebeu rolagem interna e proteção contra sobreposição;
- Correção Discursiva foi integrada ao App Shell e ao comportamento responsivo;
- alternativas selecionadas e estados semânticos ganharam maior contraste;
- exportações, histórico e migrações foram adaptados ao novo modelo.

### Corrigido

- sobreposição dos painéis de correção em zoom elevado;
- falta de acesso a conteúdos extensos na Resolução;
- proporções irregulares dos blocos de Metacognição;
- perda do estado semântico ao trocar a questão atual no mapa;
- ação redundante de salvamento na última discursiva;
- inconsistências visuais entre desktop, tablet, mobile e zoom reduzido.

### Compatibilidade

- sessões anteriores são migradas automaticamente para `schemaVersion: 7`;
- letras A–E permanecem na interface e nos relatórios legíveis;
- V/F permanece fora do embaralhamento de alternativas;
- dados continuam locais, sem backend ou sincronização obrigatória.

### Qualidade

- regressão manual aprovada;
- 45 arquivos de teste automatizados aprovados;
- nenhum bug bloqueador ou importante pendente no fechamento.

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

## [v0.5-dev] — Etapa 3: Verdadeiro ou Falso

### Adicionado

- suporte a questões objetivas de Verdadeiro ou Falso;
- layout próprio de resolução com escolhas semânticas;
- tratamento visual especial no Resultado Final;
- seção dedicada a V/F no guia de importação;
- testes de estrutura, correção e integração do novo tipo.

### Corrigido

- o embaralhamento de alternativas não altera mais a ordem Verdadeiro → Falso;
- o guia de importação separa claramente objetiva A–E, V/F e discursiva.

### Melhorado

- proporções, afirmativa e área de resposta da tela V/F aproximadas do mockup oficial;
- Resultado Final mostra comparação específica entre resposta e gabarito V/F.

### Refinamento da Resolução V/F

- a pill do assunto passou a acompanhar o tamanho do texto e aplicar reticências quando necessário;
- questões respondidas no mapa agora usam a cor informativa, sem sugerir acerto antes da correção;
- os cards Verdadeiro e Falso ficaram menores e mais próximos das proporções do mockup oficial;
- foram preservados o empilhamento mobile, foco por teclado e estados selecionados.

## [v0.5-dev] — atualização do ícone do Test Quest

### Alterado

- o novo ícone monocromático foi adicionado à Tela Inicial;
- as bordas externas do PNG passaram a ser transparentes;
- o favicon principal passou a usar SVG vetorial;
- os ícones do manifesto e do atalho móvel foram sincronizados com a nova identidade.


## [v0.5-dev] — Etapa 4: gabarito imediato por questão

### Adicionado

- opção de correção somente no Resultado Final ou após confirmar cada questão;
- botão `Confirmar resposta` no fluxo de resolução imediata;
- painel de correção para objetivas e Verdadeiro ou Falso;
- comparação orientada para questões discursivas;
- mapa `confirmacoes` persistido no estado da sessão;
- serviço dedicado `immediate-feedback.service.js`;
- testes de comportamento, estrutura, migração e persistência da correção imediata.

### Alterado

- esquema da sessão atualizado para `schemaVersion: 5`;
- respostas confirmadas são bloqueadas contra alterações posteriores;
- o fluxo de navegação libera `Próxima` ou `Finalizar` depois da confirmação;
- o modal de encerramento informa questões ainda sem confirmação imediata;
- sessões antigas são migradas para o modo de correção final.

### Preservado

- modo tradicional de resolução sem confirmação por questão;
- embaralhamento de questões e alternativas;
- ordem fixa das questões de Verdadeiro ou Falso;
- anotações, revisão, temporizadores, resultado e exportações.

## [v0.5-dev] — Etapa 6: controle de efeitos visuais

### Adicionado

- modal global de efeitos visuais com os modos Sistema, Completos e Reduzidos;
- acesso à preferência nos cabeçalhos das telas Inicial, Importação, Resolução e Resultado Final;
- serviço para normalizar e resolver a preferência efetiva de movimento;
- controlador dedicado para persistência, foco, teclado e mudanças do sistema;
- testes automatizados de comportamento e estrutura da nova preferência.

### Alterado

- Tela de Desempenho passou a respeitar a preferência manual no contador, aura e transições;
- rolagens suaves e transições globais são desativadas no modo Reduzido;
- o modo Completo passa a ignorar explicitamente `prefers-reduced-motion`;
- a suíte automatizada foi ampliada para 39 arquivos.

### Preservado

- tema claro e escuro;
- estados, cores e mensagens semânticas;
- sessões, histórico, exportações e migrações existentes.

## [v0.5-dev] — Refinamento visual da Correção Discursiva

### Alterado

- a tela de Correção Discursiva passou a ocupar nativamente toda a área útil do Test Quest;
- o cabeçalho legado é ocultado durante o Wizard, eliminando duplicações de identidade e preferências;
- removido o limite interno de largura que comprimía a interface em monitores amplos e zoom reduzido;
- conteúdo principal e painel lateral ganharam rolagens internas no desktop;
- em tablets e celulares, a tela utiliza rolagem geral e empilhamento responsivo;
- componentes visuais foram alinhados aos tokens, botões, superfícies e proporções da Resolução;
- o bloco de Veredito Final recebeu maior destaque e estados semânticos mais claros.

