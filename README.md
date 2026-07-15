# Test Quest

> **Now I Know.**

Aplicação estática de estudo ativo para resolução de questões objetivas e discursivas, com temporizador por questão, anotações, salvamento local e análise de desempenho.

## Objetivo

O Test Quest acompanha o estudante no percurso entre dúvida, tentativa, correção e compreensão. A proposta não é apenas registrar acertos, mas ajudar a entender por que uma resposta faz sentido.

## Funcionalidades atuais

- importação de questões por texto ou arquivo `.txt`;
- suporte a questões objetivas e discursivas curtas;
- correção automática das objetivas;
- exibição de resposta esperada e critérios das discursivas;
- temporizador individual por questão;
- tempo total e tempo médio;
- anotações associadas a cada questão;
- marcação de questões para revisão;
- salvamento automático com `localStorage`;
- retomada de sessão;
- temas claro e escuro;
- exportação de respostas e anotações em `.txt`;
- exportação da sessão em `.json`;
- resumo de desempenho geral e por assunto.

## Tecnologias

- HTML5
- CSS3
- JavaScript com ES Modules
- Web Storage API (`localStorage`)

## Como executar

Como a estrutura usa módulos JavaScript, execute a aplicação por um servidor local.

### Com Live Server

1. Abra a pasta no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito em `index.html`.
4. Escolha **Open with Live Server**.

### Com Python

```bash
python -m http.server 5501
```

Depois, abra `http://localhost:5501`.

## Estrutura principal

```text
test-quest
├── docs
│   ├── docs/manuais-de-telas/
│   ├── 01-visao-do-projeto.md
│   ├── 02-requisitos-e-escopo.md
│   ├── 03-fluxos-e-telas.md
│   ├── 04-dados-e-arquitetura.md
│   ├── 05-roadmap.md
│   ├── 06-testes.md
│   ├── 07-changelog.md
│   └── 08-identidade-visual.md
├── public
│   ├── examples
│   └── manifest.json
├── src
│   ├── assets
│   ├── scripts
│   │   ├── core
│   │   ├── features
│   │   ├── shared
│   │   ├── app.js
│   │   └── main.js
│   ├── styles
│   │   ├── base
│   │   ├── base-layout
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── themes
│   │   ├── utilities
│   │   └── main.css
│   └── templates
├── tests
├── index.html
├── .gitignore
└── README.md
```

## Arquitetura atual

A lógica funcional foi movida para uma feature única:

```text
src/scripts/features/question-resolution/question-resolution.controller.js
```

Essa decisão preserva o comportamento da aplicação durante a migração estrutural. A divisão futura em módulos menores deve ser feita gradualmente e acompanhada por testes.

O CSS atual foi preservado em:

```text
src/styles/pages/test-quest.css
```

Os tokens oficiais da identidade visual já foram adicionados à estrutura, mas a substituição completa dos tokens legados deve ocorrer em uma etapa visual própria para evitar regressões.

## Formato das questões

Um exemplo completo está disponível em:

```text
public/examples/exemplo-questoes.txt
```

## Documentação

A visão, os requisitos, os fluxos, a arquitetura, o roadmap, os testes e o histórico de mudanças ficam na pasta `docs`.

O guia oficial de identidade visual está em:

```text
docs/identidade-visual/Test_Quest_Identidade_Visual.docx
```

## Status

**Versão de desenvolvimento:** `v0.2.5-dev`

A estrutura já está preparada para inicialização do Git, mas o repositório ainda não foi criado.
