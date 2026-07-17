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

**Versão estável:** `v0.3.0`  
**Versão em desenvolvimento:** `v0.4-dev`  
**Estado:** `consolidação técnica em andamento`

**Fase atual:** fortalecimento da arquitetura, persistência e recuperação segura dos dados locais.

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

### Ciclo atual — v0.4-dev

A primeira etapa da consolidação técnica já inclui:

1. esquema versionado para sessões salvas;
2. migração automática das chaves legadas;
3. backup dos dados anteriores antes da migração;
4. isolamento de dados corrompidos;
5. repositórios próprios para sessão e configurações;
6. normalização e deduplicação do histórico;
7. remoção do acesso direto ao `localStorage` pelo controlador principal;
8. novos testes automatizados de persistência e migração.

As próximas etapas da v0.4 serão a modularização complementar do controlador, centralização de formatadores e exportações e reforço dos testes de fluxo completo.

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

### v0.4

- modularização gradual do controlador principal;
- centralização de formatadores e exportações;
- reforço do tratamento de erros;
- testes de fluxo e regressão da persistência.

### v0.5

- gabarito após cada questão;
- embaralhamento de alternativas;
- questões de verdadeiro ou falso;
- controle manual dos efeitos visuais;
- opção de refazer questões erradas.

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

O runner executa os testes de interface estrutural, regras de resolução, desempenho, resultado, App Shell, esquema da sessão, migrações, configurações, histórico e inicialização.

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
