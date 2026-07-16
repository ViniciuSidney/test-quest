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

**Base funcional:** `v0.2.5-dev`  
**Ciclo em desenvolvimento:** `v0.3-dev`

**Fase atual:** implementação gradual das cinco telas oficiais.

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

### Próxima etapa

A próxima adaptação será a **Tela de Resultado Final**, que receberá os filtros e cards expansíveis aprovados. Depois dela, o ciclo seguirá para:

1. modais e confirmações restantes;
2. modularização complementar;
3. testes completos;
4. revisão e integração da branch `dev` na `main`.

A implementação continua sendo feita uma tela por vez, com testes e commits separados.

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
- transição da Resolução para o Desempenho e, depois, para o Resultado Final.

## Funcionalidades planejadas para o próximo ciclo

- filtros no Resultado Final;
- cards de revisão expansíveis;
- card objetivo expandido;
- card discursivo expandido;
- estados vazios e mensagens de erro aprimorados;
- modularização gradual do JavaScript;
- migração versionada dos dados locais.

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
│   └── ALTERACOES-REALIZADAS.md
├── public/
│   ├── examples/
│   └── manifest.json
├── src/
│   ├── assets/
│   ├── scripts/
│   │   ├── core/
│   │   │   └── screens.js
│   │   ├── features/
│   │   │   └── home/
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

A modularização já começou com o gerenciador de telas, o serviço da Tela Inicial e o parser de importação. Ela continuará separando responsabilidades como:

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

A Tela Inicial, a Importação e a Resolução possuem estilos próprios em:

```text
src/styles/pages/home.css
src/styles/pages/import.css
src/styles/pages/resolution.css
```

O parser da importação e os auxiliares puros da Resolução estão em:

```text
src/scripts/features/question-import/question-import.parser.js
src/scripts/features/question-resolution/question-resolution.helpers.js
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

- implementar a Tela de Resultado Final;
- integrar a revisão detalhada após a Tela de Desempenho;
- preservar a lógica atual;
- testar cada tela separadamente;
- adaptar o estado da aplicação;
- criar histórico de sessões;
- padronizar modais;
- revisar responsividade e acessibilidade.

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
- a Tela Inicial, a Importação, a Resolução e a Tela de Desempenho já foram aplicadas; o Resultado Final ainda usa a base visual legada;
- parte da lógica e do CSS permanece concentrada em arquivos legados.

## Autoria

Desenvolvido por **Vinícius Sidney**.

---

**Test Quest — Now I Know.**  
*Resolver, compreender e avançar.*
