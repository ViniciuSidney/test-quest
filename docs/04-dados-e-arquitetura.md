# Dados e Arquitetura

## Tipo de aplicação

Aplicação web estática executada no navegador.

## Estado da sessão

A aplicação mantém um objeto principal com a seguinte estrutura:

```js
{
  versao,
  listaNome,
  questoes,
  atual,
  respostas,
  anotacoes,
  temposMs,
  revisao,
  opcoes,
  importadoEm,
  finalizadoEm
}
```

## Entidade: Questão

### Campos comuns

- `id`: identificador único;
- `categoria`: `objetiva` ou `discursiva`;
- `assunto`: assunto associado;
- `tipo`: tipo informado no arquivo;
- `enunciado`: texto principal.

### Campos da objetiva

- `alternativas`: objeto com A, B, C, D e E;
- `correta`: letra da resposta correta;
- `explicacao`: justificativa da correção.

### Campos da discursiva

- `respostaEsperada`: resposta modelo;
- `criterios`: pontos necessários para a correção.

## Dados relacionados por ID da questão

- `respostas[id]`;
- `anotacoes[id]`;
- `temposMs[id]`;
- `revisao[id]`.

## Persistência

### Chaves atuais

```text
resolvedorQuestoesV2.estado
resolvedorQuestoesV2.config
```

As chaves foram preservadas nesta migração para não invalidar sessões já existentes. Uma futura renomeação para o namespace `testQuest` deve incluir migração dos dados legados.

## Arquitetura de arquivos

```text
src/scripts
├── core
│   ├── config.js
│   ├── constants.js
│   └── state.js
├── features
│   └── question-resolution
│       └── question-resolution.controller.js
├── shared
│   ├── dom.js
│   └── storage.js
├── app.js
└── main.js
```

## Inicialização

1. `main.js` aguarda o DOM.
2. `app.js` inicializa as features.
3. `question-resolution.controller.js` inicializa a aplicação atual.

## Decisão de migração

A lógica foi movida inicialmente como uma feature única. Isso reduz o risco de regressões durante a mudança de estrutura.

A divisão recomendada para etapas futuras é:

```text
features
├── import
├── resolution
├── timer
├── notes
├── results
├── export
└── theme
```

## CSS

O CSS funcional permanece consolidado em:

```text
src/styles/pages/test-quest.css
```

Os tokens oficiais já existem em:

```text
src/styles/base/tokens.css
src/styles/themes/light.css
src/styles/themes/dark.css
```

A separação do CSS legado em componentes e layouts deve preservar a ordem da cascata e ser feita com testes visuais.
