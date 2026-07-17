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

### Namespace futuro recomendado

```text
testQuest.state
testQuest.settings
testQuest.history
```

## Migração de dados

Ao iniciar:

1. procurar dados no namespace novo;
2. se ausente, procurar chaves legadas;
3. transformar para o esquema atual;
4. adicionar `schemaVersion`;
5. salvar no namespace novo;
6. manter backup temporário até os testes concluírem.

Nunca apagar dados legados antes de confirmar a migração.

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
│   ├── screens.js
│   └── state.js
├── features
│   ├── home
│   │   └── home.service.js
│   ├── question-import
│   │   └── question-import.parser.js
│   └── question-resolution
│       ├── question-resolution.controller.js
│       └── question-resolution.helpers.js
├── shared
│   ├── dom.js
│   └── storage.js
├── app.js
└── main.js
```

A navegação, o histórico da Home, o parser de importação e as regras puras dos marcadores da Resolução já foram separados. O controlador principal ainda coordena eventos e transições entre as funcionalidades durante a migração gradual.

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
