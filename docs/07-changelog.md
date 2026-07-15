# Changelog

Todas as mudanças importantes do Test Quest serão registradas neste arquivo.

## [Não lançado]

### Adicionado

- estrutura baseada no Modelo de Projeto;
- entrada JavaScript por `main.js` e `app.js`;
- feature `question-resolution`;
- arquivos de documentação do projeto;
- manifesto da aplicação;
- pasta pública com lista de exemplo;
- tokens iniciais da identidade visual;
- roteiro de testes pós-migração;
- guia de migração estrutural.

### Alterado

- arquivos principais movidos para `src`;
- `index.html` atualizado para os novos caminhos;
- nome apresentado na interface atualizado para Test Quest;
- CSS funcional movido para `src/styles/pages/test-quest.css`;
- lógica funcional movida para uma feature encapsulada.

### Preservado

- chaves existentes do `localStorage`;
- IDs usados pelo JavaScript;
- fluxo de importação, resolução e resultado;
- comportamento visual da versão v2.5.

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
