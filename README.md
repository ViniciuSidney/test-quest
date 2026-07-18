# Test Quest

> **Now I Know.**

Aplicação web estática de estudo ativo para resolução de questões objetivas e discursivas, com temporizador por questão, anotações, salvamento local, revisão e análise de desempenho.

## Sobre o projeto

O **Test Quest** acompanha o estudante no percurso entre dúvida, tentativa, correção e compreensão.

A proposta não é apenas registrar acertos, mas ajudar o usuário a:

- resolver questões com organização;
- acompanhar o tempo utilizado;
- registrar anotações;
- identificar assuntos que precisam de revisão;
- compreender por que uma resposta está correta;
- preservar e exportar os dados da sessão.

## Mensagem central

> **Resolver, compreender e avançar.**

## Estado atual

**Versão estável:** `v0.4.0`  
**Versão em desenvolvimento:** `v0.5-dev`  
**Estado:** `fundação de dados implementada e em validação`

**Fase atual:** preparação dos novos modos de resolução e revisão, começando pelo modelo estável de alternativas e respostas.

### Concluído

- base funcional com resolução objetiva e discursiva;
- persistência local com `localStorage`;
- temporizador por questão;
- anotações;
- marcação para revisão;
- exportações em `.txt` e `.json`;
- identidade visual oficial;
- estrutura baseada no Modelo de Projeto;
- repositório Git inicializado;
- repositório remoto publicado no GitHub;
- branches `main` e `dev` configuradas;
- layouts das cinco telas principais aprovados;
- manuais estruturais concluídos;
- Tela Inicial oficial implementada;
- Tela de Importação e Validação oficial implementada;
- Tela de Resolução objetiva e discursiva oficial implementada;
- Tela de Desempenho com seis estados dinâmicos implementada;
- Tela de Resultado Final oficial implementada com filtros e cards expansíveis;
- estados inicial, pendente, validando, válido e inválido;
- contadores definitivos de questões e assuntos;
- parser de importação separado em módulo próprio;
- navegação centralizada entre as cinco telas;
- sessão em andamento movida para a Tela Inicial;
- indicadores históricos de sessões concluídas;
- temporizador interrompido ao sair da Resolução;
- marcações auxiliares independentes da resposta oficial;
- pausa do temporizador preservada no estado da sessão;
- navegação entre questões sem atribuição incorreta de tempo.

### Entregue na v0.4.0

As três etapas da consolidação técnica já incluem:

1. esquema versionado para sessões salvas;
2. migração automática das chaves legadas;
3. backup e isolamento de dados incompatíveis;
4. repositórios próprios para sessão e configurações;
5. normalização e deduplicação do histórico;
6. ciclo de vida da sessão separado do controlador visual;
7. cálculo geral de resultados centralizado;
8. formatadores compartilhados de tempo, datas, HTML e nomes de arquivo;
9. geração e download das exportações separados da interface;
10. mensagens de confirmação centralizadas;
11. detecção de armazenamento indisponível ou cheio;
12. aviso recuperável de falha no salvamento e tentativa de recuperação;
13. proteção contra fechamento quando há sessão não persistida;
14. teste integrado do fluxo importar → salvar → restaurar → finalizar → histórico → exportar;
15. suíte automatizada ampliada para 23 arquivos de teste.

A v0.4.0 conclui o ciclo de consolidação técnica. A suíte automatizada foi aprovada e o fechamento manual foi autorizado para publicação na `main`.

## Funcionalidades atuais

- Tela de Importação e Validação com estados completos;
- importação de questões por texto ou arquivo `.txt`;
- contadores de questões objetivas, discursivas e assuntos;
- bloqueio do início enquanto a lista não estiver validada;
- suporte a questões objetivas e discursivas curtas;
- correção automática das objetivas;
- exibição de resposta esperada e critérios das discursivas;
- temporizador individual por questão;
- tempo total e tempo médio;
- anotações associadas a cada questão;
- marcação de questões para revisão;
- salvamento automático com `localStorage`;
- Tela Inicial com retomada de sessão;
- indicadores históricos de sessões concluídas;
- temas claro e escuro;
- exportação de respostas em `.txt`;
- exportação de anotações em `.txt`;
- exportação da sessão em `.json`;
- resumo de desempenho geral e por assunto;
- Tela de Resolução oficial com objetiva e discursiva;
- mapa acessível de questões;
- marcadores auxiliares com estados neutro, em análise e eliminada;
- confirmação customizada antes da finalização;
- Tela de Desempenho intermediária com estados de 100%, 90–99%, 75–89%, 60–74%, 50–59% e 0–49%;
- transição da Resolução para o Desempenho e, depois, para o Resultado Final;
- Resultado Final com resumo geral, desempenho por assunto e filtros;
- cards objetivos e discursivos expansíveis;
- estado vazio para filtros sem resultados;
- apenas um card de revisão expandido por vez.

## Funcionalidades planejadas para os próximos ciclos

### v0.4.0 — concluída

- modularização gradual do controlador principal;
- ciclo de vida, resultados, formatadores, confirmações e exportações separados;
- persistência versionada, migrações e recuperação de dados;
- tratamento seguro de armazenamento indisponível ou cheio;
- testes automatizados de fluxo, persistência e regressão;
- documentação e pacote preparados para publicação.

### v0.5 — em desenvolvimento

**Fundação concluída nesta etapa:**

- alternativas objetivas representadas por objetos com IDs estáveis;
- respostas objetivas salvas pelo ID da alternativa, não pela letra visual;
- `schemaVersion: 4` com migração automática das sessões da v0.4;
- marcações auxiliares vinculadas às alternativas estáveis;
- gabarito objetivo vinculado por `respostaCorretaId`;
- resultados e exportações convertendo os IDs para letras legíveis;
- estrutura preparada para reordenar alternativas sem perder resposta ou gabarito;
- suíte automatizada ampliada para 26 arquivos de teste.

**Próximas entregas planejadas:**

- embaralhamento de alternativas;
- questões de verdadeiro ou falso;
- gabarito após cada questão;
- opção de refazer questões erradas;
- controle manual dos efeitos visuais.

## Fluxo oficial

```text
Tela Inicial
├── Iniciar nova resolução → Importação e Validação
└── Continuar resolução → Resolução

Importação e Validação
└── Começar → Resolução

Resolução
└── Finalizar → Tela de Desempenho

Tela de Desempenho
└── Continuar → Resultado Final

Resultado Final
└── Voltar ao início → Tela Inicial
```

## Tecnologias

- HTML5;
- CSS3;
- JavaScript com ES Modules;
- Web Storage API (`localStorage`);
- Git e GitHub.

## Como executar

Como o projeto utiliza módulos JavaScript, a aplicação deve ser executada por um servidor local.

### Com Live Server

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito em `index.html`.
4. Escolha **Open with Live Server**.

### Com Python

```bash
python -m http.server 5501
```

Depois, abra:

```text
http://localhost:5501
```

## Testes automatizados

Execute toda a suíte da aplicação com:

```bash
node tests/run-all-tests.mjs
```

O runner executa 26 arquivos de teste, incluindo interface estrutural, regras de resolução, desempenho, resultado, App Shell, esquema da sessão, migrações, configurações, histórico, falhas de armazenamento, modelo de alternativas e fluxo integrado completo.

## Estrutura principal

```text
test-quest/
├── docs/
│   ├── manuais-de-telas/
│   │   ├── test-quest-manual-estrutura-tela-inicial.md
│   │   ├── test-quest-manual-estrutura-importacao-validacao.md
│   │   ├── test-quest-manual-estrutura-resolucao.md
│   │   ├── test-quest-manual-estrutura-desempenho.md
│   │   └── test-quest-manual-estrutura-resultado-final.md
│   ├── README.md
│   ├── 01-visao-do-projeto.md
│   ├── 02-requisitos-e-escopo.md
│   ├── 03-fluxos-e-telas.md
│   ├── 04-dados-e-arquitetura.md
│   ├── 05-roadmap.md
│   ├── 06-testes.md
│   ├── 07-changelog.md
│   ├── 08-identidade-visual.md
│   ├── 09-plano-de-implementacao.md
│   ├── 10-v0.4-consolidacao-tecnica.md
│   ├── 11-checklist-fechamento-v0.4.md
│   ├── 12-notas-release-v0.4.0.md
│   └── ALTERACOES-REALIZADAS.md
├── public/
│   ├── examples/
│   └── manifest.json
├── src/
│   ├── assets/
│   ├── scripts/
│   │   ├── core/
│   │   │   ├── constants.js
│   │   │   ├── screens.js
│   │   │   ├── session-schema.js
│   │   │   └── state.js
│   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── performance/
│   │   │   ├── question-import/
│   │   │   ├── question-resolution/
│   │   │   └── results/
│   │   ├── shared/
│   │   ├── app.js
│   │   └── main.js
│   ├── styles/
│   │   ├── base/
│   │   ├── base-layout/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── themes/
│   │   ├── utilities/
│   │   └── main.css
│   └── templates/
├── tests/
├── index.html
├── .gitignore
└── README.md
```

## Arquitetura atual

A maior parte da lógica funcional ainda está concentrada em:

```text
src/scripts/features/question-resolution/question-resolution.controller.js
```

Essa decisão preservou o funcionamento da aplicação durante a migração estrutural.

A modularização já começou com o gerenciador de telas, o serviço da Tela Inicial, o parser de importação, os auxiliares da Resolução, o serviço de Desempenho e o serviço de Resultado. Ela continuará separando responsabilidades como:

- controle visual da importação e validação;
- resolução;
- temporizador;
- resultados;
- exportações;
- tema;
- armazenamento;
- migração de dados;
- modais.

O CSS funcional atual permanece principalmente em:

```text
src/styles/pages/test-quest.css
```

As cinco telas oficiais possuem estilos próprios em:

```text
src/styles/pages/home.css
src/styles/pages/import.css
src/styles/pages/resolution.css
src/styles/pages/performance.css
src/styles/pages/results.css
```

Os módulos funcionais extraídos do controlador estão em:

```text
src/scripts/features/question-import/question-import.parser.js
src/scripts/features/question-resolution/question-resolution.helpers.js
src/scripts/features/performance/performance.service.js
src/scripts/features/results/results.service.js
```

Os demais estilos e responsabilidades serão distribuídos progressivamente entre componentes, layouts e páginas.

## Formato das questões

Um exemplo completo está disponível em:

```text
public/examples/exemplo-questoes.txt
```

### Questão objetiva

```text
@questao
assunto: Nome do assunto
tipo: objetiva
enunciado: Texto da questão
a: Alternativa A
b: Alternativa B
c: Alternativa C
d: Alternativa D
e: Alternativa E
correta: B
explicacao: Explicação da resposta
+++
```

### Questão discursiva

```text
@discursiva
assunto: Nome do assunto
tipo: discursiva curta
enunciado: Texto da pergunta
resposta_esperada: Resposta modelo
criterios_de_correcao: Critérios de correção
+++
```

## Documentação

A documentação oficial está em:

```text
docs/
```

O índice completo está em:

```text
docs/README.md
```

O guia de identidade visual está em:

```text
docs/08-identidade-visual.md
```

Os manuais das telas estão em:

```text
docs/manuais-de-telas/
```

O plano de implementação está em:

```text
docs/09-plano-de-implementacao.md
```

## Persistência e privacidade

Os dados são armazenados localmente no navegador por meio do `localStorage`.

A aplicação não depende de servidor próprio e não envia respostas, anotações ou resultados para serviços externos.

Como os dados ficam vinculados ao navegador e ao dispositivo, limpar os dados do site pode apagar sessões salvas. A exportação em `.json` funciona como forma de preservação da sessão.

## Fluxo de desenvolvimento

```text
main
└── base estável

dev
└── desenvolvimento e testes
```

Fluxo recomendado:

```bash
git switch dev
git pull
git status
```

Após uma alteração concluída:

```bash
git add .
git commit -m "feat: descreve a alteração"
git push
```

Quando um ciclo estiver validado, as mudanças devem passar por revisão antes de serem integradas à `main`.

## Roadmap resumido

### Próximo ciclo

- executar os testes completos das cinco telas;
- corrigir regressões visuais e funcionais;
- padronizar os modais restantes;
- modularizar o controlador gradualmente;
- revisar responsividade e acessibilidade;
- preparar a integração em `main`.

### Antes da versão estável

- concluir modularização;
- executar o roteiro completo de testes;
- validar GitHub Pages;
- atualizar documentação;
- criar tag e release.

## Limitações atuais

- não há backend;
- não há sincronização entre dispositivos;
- discursivas dependem de revisão manual;
- o histórico detalhado de sessões ainda não foi implementado;
- as cinco telas oficiais já foram aplicadas; ainda faltam testes completos e refinamentos de fechamento;
- parte da lógica e do CSS permanece concentrada em arquivos legados.

## Autoria

Desenvolvido por **Vinícius Sidney**.

---

**Test Quest — Now I Know.**  
*Resolver, compreender e avançar.*
