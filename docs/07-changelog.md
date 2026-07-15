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
- layouts oficiais das quatro telas;
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

### Corrigido

- barra de ações permanece contida no painel em larguras menores que `820px`;
- cabeçalho fixo da Importação recebe fundo, borda e sombra próprios durante a rolagem;
- envoltório visual desigual do seletor de arquivo;
- largura insuficiente dos cards de contadores;
- confirmações nativas substituídas por modal customizado e acessível.

### Alterado

- documentação atualizada para quatro telas;
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

### Corrigido

- temporizador não continua ao voltar para a Tela Inicial;
- uma sessão reaberta para revisão deixa temporariamente de contar no histórico;
- substituição de sessão ativa exige apenas uma confirmação no fluxo normal;
- corrida entre leituras sucessivas de arquivos não sobrescreve a seleção mais recente;
- ID duplicado do tipo da questão foi removido;
- troca de tema na Importação não produz contraste intermediário incorreto;
- modal do modelo restaura o foco ao ser fechado.

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
