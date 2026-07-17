# Changelog

Todas as mudanças importantes do Test Quest serão registradas neste arquivo.

## [Não lançado]

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
