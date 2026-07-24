# Dados e Arquitetura

## Tipo de aplicação

Aplicação web estática executada no navegador, sem backend obrigatório.

## Princípios arquiteturais

- estado central versionado;
- persistência local;
- funcionalidades separadas por domínio;
- telas controladas como SPA simples;
- migração gradual da lógica legada;
- nenhuma quebra de dados durante alterações visuais;
- exportações geradas no navegador.

## Estado principal proposto

```js
{
  schemaVersion,
  telaAtual,

  sessao: {
    id,
    status,
    listaNome,
    questoes,
    questaoAtual,
    respostas,
    anotacoes,
    temposMs,
    revisao,
    marcacoesAlternativas,
    opcoes,
    importadoEm,
    iniciadoEm,
    finalizadoEm
  },

  historico: {
    sessoes,
    resumo
  },

  interface: {
    tema,
    filtroResultado,
    cardResultadoExpandidoId,
    temporizadorPausado
  }
}
```

## Status da sessão

```text
preparando
em_andamento
finalizada
```

## Entidade Sessão

- `id`: identificador permanente;
- `schemaVersion`: versão dos dados;
- `status`: estado da sessão;
- `listaNome`: nome da lista;
- `questoes`: lista ordenada;
- `questaoAtual`: índice atual;
- `respostas`: respostas por ID;
- `anotacoes`: anotações por ID;
- `temposMs`: tempo por ID;
- `revisao`: marcações de revisão;
- `marcacoesAlternativas`: rascunhos da objetiva;
- `opcoes`: configuração da sessão;
- `importadoEm`: data da importação;
- `iniciadoEm`: início da resolução;
- `finalizadoEm`: conclusão.

## Entidade Questão

### Campos comuns

- `id`;
- `categoria`;
- `assunto`;
- `tipo`;
- `enunciado`;
- `ordemOriginal`.

### Objetiva

- `alternativas`;
- `correta`;
- `explicacao`.

### Discursiva

- `respostaEsperada`;
- `criterios`.

## Respostas por ID

```js
respostas[questaoId] = "C";
respostas[questaoDiscursivaId] = "Texto...";
```

## Anotações por ID

```js
anotacoes[questaoId] = "Raciocínio auxiliar";
```

## Tempos por ID

```js
temposMs[questaoId] = 125000;
```

## Revisão por ID

```js
revisao[questaoId] = true;
```

## Marcações auxiliares

```js
marcacoesAlternativas[questaoId] = {
  A: "neutro",
  B: "analise",
  C: "eliminada",
  D: "neutro",
  E: "neutro"
};
```

Valores permitidos:

```text
neutro
analise
eliminada
```

## Histórico

Cada sessão concluída deve armazenar um resumo suficiente para a Tela Inicial:

```js
{
  id,
  listaNome,
  totalQuestoes,
  respondidas,
  totalObjetivas,
  corretas,
  desempenho,
  tempoTotalMs,
  finalizadoEm
}
```

Resumo histórico:

```js
{
  questoesRespondidas,
  taxaMediaAcertos,
  tempoTotalMs,
  sessoesConcluidas
}
```

A sessão em andamento não entra no resumo.

## Resultado por assunto

```js
{
  "Eventos": {
    total: 3,
    objetivas: 2,
    corretas: 1,
    tempoMs: 280000,
    desempenho: 50
  }
}
```

Se `objetivas === 0`, `desempenho` deve ser `null`, não `0`.

## Persistência

### Chaves legadas

```text
resolvedorQuestoesV2.estado
resolvedorQuestoesV2.config
```

### Namespace atual da aplicação

```text
testQuest.state
testQuest.settings
testQuest.history
```

As chaves antigas são reconhecidas somente pelo processo de migração.

## Migração de dados — implementação da v0.4

Ao iniciar:

1. procurar dados em `testQuest.state`;
2. validar e normalizar a sessão atual;
3. se ausente, procurar `resolvedorQuestoesV2.estado`;
4. salvar o conteúdo legado no backup de migração;
5. transformar para o esquema vigente;
6. salvar na chave atual;
7. remover a chave legada somente após a nova gravação;
8. isolar cargas incompatíveis em um backup separado.

O controlador principal não acessa mais o `localStorage` diretamente.

## Implementação atual da navegação e da Home

Já implementado:

- `src/scripts/core/screens.js` para troca centralizada de telas;
- `src/scripts/features/home/home.service.js` para histórico e indicadores;
- `src/styles/pages/home.css` para o layout oficial da Tela Inicial;
- chave `testQuest.history` para resumos de sessões concluídas;
- compatibilidade com a chave legada da sessão ativa.

A sessão em andamento não entra nos indicadores históricos. Se uma sessão concluída for reaberta para revisão, seu resumo é removido temporariamente do histórico e volta a ser registrado após nova finalização.

## Arquitetura atual

```text
src/scripts
├── core
│   ├── config.js
│   ├── constants.js
│   ├── objective-question.js
│   ├── screens.js
│   ├── session-schema.js
│   └── state.js
├── features
│   ├── exports
│   │   └── session-export.service.js
│   ├── home
│   │   └── home.service.js
│   ├── performance
│   │   └── performance.service.js
│   ├── question-import
│   │   └── question-import.parser.js
│   ├── question-resolution
│   │   ├── question-resolution.controller.js
│   │   └── question-resolution.helpers.js
│   ├── results
│   │   └── results.service.js
│   ├── session
│   │   ├── session-confirmations.service.js
│   │   ├── session-lifecycle.service.js
│   │   └── session.repository.js
│   └── settings
│       └── settings.repository.js
├── shared
│   ├── dom.js
│   ├── formatters.js
│   ├── startup-error.js
│   └── storage.js
├── app.js
└── main.js
```

## Fronteiras atuais

- o controlador coordena DOM, eventos e transições entre telas;
- repositórios cuidam de leitura, gravação, migração e recuperação;
- o serviço de ciclo de vida cria, restaura e finaliza sessões;
- o serviço de resultados fornece uma única fonte para métricas;
- o serviço de exportação gera arquivos sem conhecer a interface;
- formatadores não acessam estado nem DOM;
- confirmações retornam apenas descrições consumidas pelo modal visual.

## Arquitetura-alvo

```text
src/scripts
├── core
│   ├── app-state.js
│   ├── constants.js
│   ├── migrations.js
│   └── router.js
├── features
│   ├── home
│   ├── question-import
│   ├── question-resolution
│   ├── performance
│   ├── results
│   ├── timer
│   ├── export
│   ├── theme
│   └── modals
├── shared
│   ├── dom.js
│   ├── formatters.js
│   ├── storage.js
│   └── validators.js
├── app.js
└── main.js
```

## Inicialização prevista

1. `main.js` aguarda o DOM.
2. `app.js` carrega configurações.
3. migração de dados é executada.
4. estado é restaurado.
5. tela inicial é determinada.
6. features são inicializadas.
7. temporizador só é iniciado na Resolução.

## Estrutura de CSS-alvo

```text
src/styles
├── base
├── themes
├── components
├── layouts
├── pages
│   ├── home.css
│   ├── import.css
│   ├── resolution.css
│   └── results.css
└── main.css
```

## Regra de migração

A substituição das telas deve acontecer uma por vez. A lógica legada pode permanecer temporariamente enquanto os novos componentes são conectados e testados.


## Tela de Desempenho

A Tela de Desempenho não cria um segundo cálculo independente. Ela recebe o percentual já produzido pelo cálculo final da sessão e seleciona um estado visual por faixa.

Quando não existem questões objetivas, a aplicação não apresenta porcentagem artificial de `0%`: o fluxo segue diretamente para o Resultado Final, onde a revisão manual das discursivas é apresentada.


## Implementação da primeira etapa da v0.4

```text
src/scripts
├── core
│   └── session-schema.js
├── features
│   ├── session
│   │   └── session.repository.js
│   └── settings
│       └── settings.repository.js
└── shared
    └── storage.js
```

Responsabilidades:

- `session-schema.js`: validação, normalização e evolução do estado;
- `session.repository.js`: leitura, gravação, migração, backup e limpeza;
- `settings.repository.js`: tema e preferências globais versionadas;
- `storage.js`: operações seguras e injetáveis para testes.


## Implementação da segunda etapa da v0.4

```text
src/scripts
├── features
│   ├── exports
│   │   └── session-export.service.js
│   ├── results
│   │   └── results.service.js
│   └── session
│       ├── session-confirmations.service.js
│       └── session-lifecycle.service.js
└── shared
    └── formatters.js
```

Responsabilidades:

- `session-lifecycle.service.js`: criação, restauração, identificação, embaralhamento e finalização de sessões;
- `session-confirmations.service.js`: descrições puras das confirmações exibidas pelo modal;
- `results.service.js`: cálculo geral, tempo total e preparação das métricas do resultado;
- `session-export.service.js`: geração dos relatórios TXT, JSON e download no navegador;
- `formatters.js`: formatação compartilhada de tempo, datas, HTML e nomes de arquivo.

O controlador principal permanece responsável por DOM, eventos, foco, temporizador ativo e transições visuais. A extração reduziu o arquivo sem mudar IDs, telas, armazenamento ou formato público das exportações.

---

# Operação degradada do armazenamento — v0.4

A camada de armazenamento não presume que `localStorage` esteja sempre disponível.

Estados reconhecidos:

```text
leitura e escrita disponíveis
somente leitura
cota esgotada
acesso bloqueado
JSON inválido
falha de serialização
erro desconhecido
```

Quando a escrita falha, o estado em memória permanece ativo na aba atual. O controlador exibe um aviso recuperável e protege o fechamento quando existe uma sessão que ainda não pôde ser persistida.

A migração só remove a chave legada depois que a nova chave é gravada com sucesso.


## Fundação de dados da v0.5

### Esquema de sessão

A sessão passa a usar:

```js
{
  schemaVersion: 4,
  respostas: {
    "questao-id": "alternativa-id"
  },
  marcacoesAlternativas: {
    "questao-id": {
      "alternativa-id": "analise"
    }
  }
}
```

### Questão objetiva

```js
{
  id: "questao-id",
  categoria: "objetiva",
  alternativas: [
    {
      id: "alt-id-estavel",
      chaveOriginal: "A",
      texto: "Texto da alternativa",
      ordemOriginal: 0
    }
  ],
  respostaCorretaId: "alt-id-estavel",
  correta: "A"
}
```

`respostaCorretaId` é a referência canônica. O campo `correta` permanece temporariamente como projeção legível e compatível com dados anteriores.

A letra exibida é calculada pela posição atual da alternativa. Assim, uma alternativa pode mudar de `B` para `A` quando for embaralhada, mas seu ID, sua resposta e o gabarito permanecem os mesmos.

### Migração da v0.4

Ao carregar uma sessão com `schemaVersion: 3`:

1. converter o mapa `{ A, B, C, D, E }` em uma lista de alternativas;
2. gerar IDs determinísticos a partir da questão e da chave original;
3. converter `correta` para `respostaCorretaId`;
4. converter respostas antigas em letras para IDs;
5. converter marcações auxiliares por letra para IDs;
6. salvar a sessão como `schemaVersion: 4` mantendo o backup de migração.

### Fronteira de compatibilidade

- a interface trabalha com IDs internamente;
- resultados e exportações transformam IDs em letras visíveis;
- serviços aceitam temporariamente letras antigas para facilitar migrações e testes;
- o modelo já permite reordenar o array de alternativas sem invalidar a resposta.


## Correção imediata — v0.5 Etapa 4

A sessão utiliza `schemaVersion: 5` e acrescenta:

```js
{
  confirmacoes: {
    "id-da-questao": true
  },
  opcoes: {
    modoCorrecao: "final" | "imediata"
  }
}
```

O módulo `features/question-resolution/immediate-feedback.service.js` concentra normalização do modo, confirmação, bloqueio lógico e preparação do feedback. O controlador permanece responsável por DOM, eventos e transições da tela.
