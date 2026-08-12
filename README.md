# Test Quest

> **Now I Know.**

Aplicação web estática de estudo ativo para resolução de questões objetivas, Verdadeiro ou Falso e discursivas, com temporizador, anotações, correção guiada, revisão de erros e análise de desempenho.

## Sobre o projeto

O **Test Quest** acompanha o estudante entre tentativa, correção e compreensão. O usuário importa uma lista textual, valida seu conteúdo, configura a sessão, responde às questões e revisa o desempenho sem depender de backend.

> **Resolver, compreender e avançar.**

## Estado atual

**Versão candidata:** `v0.6.1`

**Status:** correção do ciclo de vida do vínculo com o Study Stack pronta para validação conjunta

**Esquema de sessão:** `schemaVersion: 7`

A v0.6.1 impede que uma entrada vinculada abandonada seja reutilizada por outra
sessão. A correção preserva a compatibilidade da v0.6.0 e mantém a suíte com
**47 arquivos de teste automatizados**.

## Correção da v0.6.1

- contexto do Study Stack vinculado ao `sessionId` da resolução criada;
- retomada permitida somente quando contexto e sessão ativa correspondem;
- vínculo abandonado, órfão ou incompatível descartado na abertura direta;
- retorno da importação, exclusão da sessão e encerramento do resultado removem o vínculo;
- recarregar uma sessão vinculada válida abre a Tela Inicial para retomada, sem iniciar outra importação.

## Destaques da v0.6.0

- entrada vinculada pelo Study Stack diretamente em **Preparar resolução**;
- Assunto, sequência e nome sugerido preservados como contexto estruturado;
- nome da lista editável sem perda da sequência;
- resultado entregue pelo contrato `1.1.0` com suporte a respostas parciais;
- ação principal **Salvar no Study Stack e voltar**;
- backup nativo identificado como **Baixar cópia da sessão**;
- exportação manual de recuperação exibida apenas quando o retorno falha;
- base do aproveitamento e quantidades por assunto apresentadas com clareza;
- contexto consumido após a entrega para impedir vínculo residual.

## Destaques da v0.5.0

- alternativas objetivas com IDs estáveis;
- embaralhamento de alternativas sem perder resposta, marcador ou gabarito;
- suporte a questões de Verdadeiro ou Falso;
- correção somente ao final ou imediatamente após cada questão;
- Metacognição inicial separada do Veredito Final das discursivas;
- tela Wizard de Correção Discursiva no modo de gabarito ao final;
- desempenho combinado de objetivas e discursivas;
- detalhamento expansível por assunto e por questão;
- mapa semântico com estados de acerto, parcial e erro;
- criação de uma nova sessão para refazer questões erradas;
- preferência de efeitos visuais: Sistema, Completos ou Reduzidos;
- migração automática de sessões anteriores para `schemaVersion: 7`;
- persistência, histórico e exportações integrados ao novo fluxo.

## Funcionalidades

- importação por texto ou arquivo `.txt`;
- validação com mensagens por questão e campo;
- questões objetivas, V/F e discursivas;
- embaralhamento de questões e alternativas;
- temporizador individual, total e médio;
- pausa e retomada da sessão;
- anotações por questão;
- marcação para revisão;
- marcadores auxiliares em alternativas objetivas;
- temas claro e escuro;
- controle manual de efeitos visuais;
- salvamento automático em `localStorage`;
- retomada pela Tela Inicial;
- gabarito imediato opcional;
- Correção Discursiva guiada;
- Tela de Desempenho intermediária;
- Resultado Final com filtros e cards expansíveis;
- revisão de questões erradas;
- exportação de respostas, anotações e sessão;
- histórico local resumido de sessões concluídas.

## Fluxo oficial

```text
Tela Inicial
├── Iniciar nova resolução → Importação e Validação
└── Continuar sessão → Resolução ou Correção Discursiva

Importação e Validação
└── Começar → Resolução

Resolução
├── Gabarito imediato → correção dentro da própria questão
├── Finalizar sem discursivas pendentes → Desempenho
└── Finalizar com discursivas pendentes → Correção Discursiva

Correção Discursiva
└── Concluir correção → Desempenho

Desempenho
└── Continuar → Resultado Final

Resultado Final
├── Refazer questões erradas → nova Resolução
└── Voltar ao início → Tela Inicial
```

## Como executar

O projeto utiliza módulos JavaScript e deve ser aberto por um servidor local.

### Live Server

1. Abra a pasta no VS Code.
2. Clique com o botão direito em `index.html`.
3. Selecione **Open with Live Server**.

### Python

```bash
python -m http.server 5501
```

Acesse `http://localhost:5501`.

## Testes automatizados

```bash
node tests/run-all-tests.mjs
```

Resultado esperado na v0.6.1:

```text
✓ 47 arquivos de teste concluídos com sucesso.
```

A suíte cobre parser, alternativas estáveis, embaralhamento, V/F, gabarito imediato, Metacognição, Veredito Final, Correção Discursiva, revisão de erros, efeitos visuais, persistência, migrações, histórico, exportações e regressão estrutural.

## Estrutura principal

```text
test-quest/
├── docs/
│   ├── manuais-de-telas/
│   ├── 01-visao-do-projeto.md
│   ├── 05-roadmap.md
│   ├── 06-testes.md
│   ├── 07-changelog.md
│   ├── 23-checklist-fechamento-v0.5.md
│   ├── 24-notas-release-v0.5.0.md
│   ├── 25-study-stack-handoff-v1.1.md
│   ├── 26-validacao-integracao-study-stack.md
│   ├── 27-notas-release-v0.6.0.md
│   └── 28-notas-release-v0.6.1.md
├── public/
├── src/
│   ├── assets/
│   ├── scripts/
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
│   ├── styles/
│   └── templates/
├── tests/
├── index.html
└── README.md
```

## Arquitetura e persistência

A aplicação utiliza ES Modules e separa responsabilidades por recursos, incluindo sessão, armazenamento, importação, resolução, desempenho, resultados, exportações, configurações e Correção Discursiva.

Os dados permanecem no navegador por meio do `localStorage`. Sessões antigas são normalizadas e migradas automaticamente, com proteção contra dados inválidos e falhas de armazenamento.

Quando aberto a partir de um Assunto do Study Stack, o Resultado Final também
pode gerar o contrato de integração `1.1.0`, salvar o resultado e retornar à
aplicação de origem. Essa camada é separada do `schemaVersion: 7` e da exportação
nativa de sessão. Consulte [`docs/25-study-stack-handoff-v1.1.md`](docs/25-study-stack-handoff-v1.1.md).

## Limites atuais

- não há backend ou sincronização entre dispositivos;
- as discursivas dependem de avaliação manual do usuário;
- o histórico ainda apresenta resumos locais, sem uma tela detalhada por sessão;
- parte do controlador da Resolução continua extensa e deverá ser refatorada em um ciclo futuro.

## Documentação

A documentação completa está em [`docs/`](docs/README.md), incluindo roadmap, changelog, arquitetura, testes, checklist de fechamento e notas da Release.
