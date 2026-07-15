# Test Quest — Manual de Estrutura da Tela de Resultado Final

**Versão do documento:** 1.0  
**Aplicação:** Test Quest — *Now I Know.*  
**Layouts de referência:** Resultado Final v3 — card objetivo expandido e card discursivo expandido  
**Escopo:** estrutura visual, funções, elementos, estados, tamanhos, espaçamentos, filtros, cards de revisão, exportações, responsividade, acessibilidade e roteiro de implementação.

---

# 1. Finalidade deste manual

Este documento orienta a criação da Tela de Resultado Final do Test Quest em HTML e CSS.

Essa tela encerra o fluxo principal da aplicação e deve responder com clareza:

```text
1. Qual foi meu desempenho?
2. Quanto tempo utilizei?
3. Em quais assuntos fui melhor ou pior?
4. Quais questões precisam ser revisadas?
```

A tela não deve funcionar apenas como uma nota final. Ela precisa transformar o encerramento da sessão em uma etapa de análise e revisão.

---

# 2. Objetivos da tela

A tela deve permitir que o usuário:

- visualize o resumo geral;
- veja o desempenho nas objetivas;
- identifique respondidas e não respondidas;
- consulte tempo total e médio;
- veja quantas foram marcadas para revisão;
- acompanhe o desempenho por assunto;
- filtre questões por estado;
- expanda questões objetivas e discursivas;
- compare respostas e gabaritos;
- consulte explicações;
- consulte resposta esperada e critérios;
- visualize anotações;
- baixe respostas;
- baixe anotações;
- exporte a sessão;
- retorne ao início;
- altere o tema.

A tela não deve:

- alterar respostas;
- continuar contando tempo;
- corrigir discursivas automaticamente;
- usar `0%` em assuntos sem objetivas;
- abrir vários cards ao mesmo tempo;
- criar rolagem geral no `body`;
- depender somente de cores.

---

# 3. Estrutura visual aprovada

```text
Cabeçalho
├── Início
├── Identificação do resultado
└── Tema

Área principal
├── Coluna esquerda
│   ├── Resultado Geral
│   └── Desempenho por Assunto
└── Coluna direita
    ├── Filtros
    └── Revisão das Questões

Barra inferior
├── Exportações
└── Voltar ao Início
```

Representação:

```text
┌──────────────────────────────────────────────────────────────┐
│ [Início] Resultado final: Nome da lista             [Tema]  │
├───────────────────────┬──────────────────────────────────────┤
│ Resultado Geral       │ Revisão das Questões                 │
│ Indicadores           │ [Filtros]                            │
├───────────────────────┤ [Cards resumidos]                    │
│ Por Assunto           │ [Card expandido objetivo]            │
│ Barras e percentuais  │ ou [Card expandido discursivo]      │
├───────────────────────┴──────────────────────────────────────┤
│ [Respostas] [Anotações] [Sessão]          [Voltar ao início]│
└──────────────────────────────────────────────────────────────┘
```

---

# 4. Estrutura recomendada de arquivos

```text
src/styles/
├── components/
│   ├── buttons.css
│   ├── panels.css
│   ├── metrics.css
│   ├── filters.css
│   ├── review-card.css
│   ├── subject-performance.css
│   ├── status-badges.css
│   └── export-actions.css
├── layouts/
│   └── app-shell.css
├── pages/
│   └── results.css
└── main.css
```

JavaScript sugerido:

```text
src/scripts/features/results/
├── results.controller.js
├── results.metrics.js
├── results.filters.js
├── results.review.js
├── results.export.js
└── results.storage.js
```

---

# 5. Tokens utilizados

## 5.1 Cores principais

```css
:root {
  --tq-primary: #6265F6;
  --tq-primary-light: #8184FF;
  --tq-primary-dark: #4548D8;

  --tq-bg: #F7F7FC;
  --tq-surface: #FFFFFF;
  --tq-surface-soft: #F0F0F8;

  --tq-text: #17182F;
  --tq-text-muted: #666A85;
  --tq-border: #E3E4F0;

  --tq-success: #22C55E;
  --tq-warning: #F59E0B;
  --tq-danger: #EF4444;
  --tq-info: #38BDF8;
}
```

## 5.2 Tema escuro

```css
[data-theme="dark"] {
  --tq-bg: #0D0E22;
  --tq-surface: #141330;
  --tq-surface-soft: #1C1B3D;

  --tq-text: #F3F4FF;
  --tq-text-muted: #A6A8C7;
  --tq-border: #2B2D55;
}
```

## 5.3 Fundos semânticos suaves

```css
:root {
  --tq-primary-soft: rgba(98, 101, 246, 0.12);
  --tq-success-soft: rgba(34, 197, 94, 0.12);
  --tq-warning-soft: rgba(245, 158, 11, 0.12);
  --tq-danger-soft: rgba(239, 68, 68, 0.12);
  --tq-info-soft: rgba(56, 189, 248, 0.12);
}
```

---

# 6. Cores semânticas

```text
Verde    → objetiva correta
Vermelho → objetiva incorreta
Azul     → discursiva e revisão manual
Amarelo  → marcada para revisão
Cinza    → não respondida
Violeta  → destaque, foco e filtro ativo
```

Regras:

- toda cor deve vir com texto ou ícone;
- discursivas não recebem “correta” ou “incorreta”;
- não respondidas não são incorretas;
- revisão pode coexistir com outros estados;
- filtro ativo deve ser reconhecível sem depender só da cor.

---

# 7. Tipografia

```css
:root {
  --tq-font:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  --tq-text-xs: 0.75rem;
  --tq-text-sm: 0.875rem;
  --tq-text-md: 1rem;
  --tq-text-lg: 1.125rem;

  --tq-title-sm: 1.375rem;
  --tq-title-md: 1.625rem;
  --tq-title-lg: 2rem;
}
```

---

# 8. Estrutura semântica sugerida

```html
<section id="telaResultado" class="screen screen--results">
  <header class="results-header">
    <button id="btnInicioResultado" class="button button--neutral">
      Voltar ao início
    </button>

    <div class="results-header__text">
      <h1>Resultado final</h1>
      <span id="nomeListaResultado">Lista de Estatística</span>
    </div>

    <button id="btnTemaResultado" class="button button--neutral">
      Tema
    </button>
  </header>

  <div class="results-layout">
    <aside class="results-sidebar">
      <section class="panel results-summary-panel"></section>
      <section class="panel subject-performance-panel"></section>
    </aside>

    <main class="panel review-panel"></main>

    <footer class="panel results-actionbar"></footer>
  </div>
</section>
```

---

# 9. Contêiner e layout principal

```css
.screen--results {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}

.results-layout {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    clamp(300px, 30vw, 420px)
    minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
  grid-template-areas:
    "sidebar review"
    "actions actions";
  gap: 16px;
}
```

Proporção:

```text
Coluna esquerda → 28% a 32%
Coluna direita  → 68% a 72%
```

---

# 10. Cabeçalho

Elementos:

```text
[Voltar ao início] [Resultado final: Lista de Estatística] [Tema]
```

Regras:

- altura de `48px` a `58px`;
- nome da lista truncado quando necessário;
- conteúdo completo em `title`;
- botão superior e inferior executam o mesmo fluxo;
- temporizador não aparece.

```css
.results-header {
  min-height: 52px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.results-header__text {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 16px;
}

.results-header__text h1,
.results-header__text span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

# 11. Coluna esquerda

```css
.results-sidebar {
  grid-area: sidebar;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows:
    minmax(220px, 0.85fr)
    minmax(0, 1.15fr);
  gap: 16px;
}
```

Estrutura:

```text
Resultado Geral
Desempenho por Assunto
```

---

# 12. Painel Resultado Geral

Indicadores oficiais:

```text
Questões respondidas
Respostas corretas
Tempo total
Desempenho nas objetivas
Marcadas para revisão
Tempo médio
```

HTML sugerido:

```html
<section class="panel results-summary-panel">
  <h2>Resultado geral</h2>

  <div class="results-metrics-grid">
    <article class="result-metric">
      <strong id="resultadoRespondidas">10/10</strong>
      <span>Questões respondidas</span>
    </article>

    <article class="result-metric">
      <strong id="resultadoCorretas">8/10</strong>
      <span>Respostas corretas</span>
    </article>

    <article class="result-metric">
      <strong id="resultadoTempoTotal">22:14</strong>
      <span>Tempo total</span>
    </article>

    <article class="result-metric">
      <strong id="resultadoDesempenho">80%</strong>
      <span>Desempenho nas objetivas</span>
    </article>

    <article class="result-metric">
      <strong id="resultadoRevisao">3</strong>
      <span>Marcadas para revisão</span>
    </article>

    <article class="result-metric">
      <strong id="resultadoTempoMedio">02:13</strong>
      <span>Tempo médio</span>
    </article>
  </div>

  <p class="discursive-notice">
    As questões discursivas devem ser revisadas manualmente.
  </p>
</section>
```

CSS:

```css
.results-summary-panel {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  padding: 20px;
}

.results-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.result-metric strong {
  display: block;
  font-size: clamp(1.35rem, 2vw, 2rem);
  font-weight: 800;
  color: var(--tq-primary);
}

.result-metric span {
  display: block;
  margin-top: 2px;
  color: var(--tq-text-muted);
  font-size: var(--tq-text-sm);
  line-height: 1.2;
}
```

---

# 13. Regras dos indicadores

## Questões respondidas

```text
8/10
```

## Respostas corretas

Considera somente objetivas.

Sem objetivas:

```text
—
```

## Desempenho

```text
acertos objetivos ÷ total de objetivas × 100
```

Sem objetivas:

```text
Não disponível
```

Nunca mostrar `0%` para sessão sem objetivas.

## Tempo total

Soma dos tempos das questões.

## Tempo médio

```text
tempo total ÷ total de questões
```

## Marcadas para revisão

Quantidade de questões marcadas.

---

# 14. Aviso sobre discursivas

Texto:

```text
As questões discursivas devem ser revisadas manualmente.
```

Regras:

- aparece apenas quando existir discursiva;
- usa estilo informativo;
- não ocupa altura excessiva;
- não afirma que a resposta está certa ou errada.

---

# 15. Painel Por Assunto

Cada item deve mostrar:

- nome do assunto;
- acertos e total de objetivas;
- percentual;
- tempo total;
- barra de desempenho.

Exemplo:

```text
Eventos
3/3 objetivas • 05:40
100%
[barra]
```

Assunto sem objetivas:

```text
Mediana
Sem questões objetivas • 04:10
```

Não mostrar barra de `0%`.

HTML:

```html
<section class="panel subject-performance-panel">
  <h2>Por assunto</h2>

  <div id="listaDesempenhoAssuntos" class="subject-performance-list">
    <article class="subject-performance-item">
      <div class="subject-performance-item__header">
        <strong>Eventos</strong>
        <span>100%</span>
      </div>

      <p>3/3 objetivas • 05:40</p>

      <div class="subject-progress" role="progressbar"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
        <div class="subject-progress__value"></div>
      </div>
    </article>
  </div>
</section>
```

CSS:

```css
.subject-performance-panel {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 20px;
}

.subject-performance-list {
  min-height: 0;
  overflow: auto;
  display: grid;
  align-content: start;
  gap: 16px;
  padding-right: 4px;
  scrollbar-gutter: stable;
}

.subject-progress {
  height: 10px;
  overflow: hidden;
  background: var(--tq-surface-soft);
  border-radius: 999px;
}

.subject-progress__value {
  height: 100%;
  background: var(--tq-primary);
}
```

---

# 16. Painel Revisão das Questões

Estrutura:

```text
Título
Filtros
Lista de cards
```

```html
<main class="panel review-panel">
  <header class="review-panel__header">
    <h2>Revisão das questões</h2>

    <nav class="review-filters" aria-label="Filtros da revisão"></nav>
  </header>

  <div id="listaRevisao" class="review-list"></div>
</main>
```

```css
.review-panel {
  grid-area: review;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  padding: 20px;
}

.review-list {
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 12px;
  padding: 16px;
  background: var(--tq-surface-soft);
  border: 1px solid var(--tq-border);
  border-radius: var(--tq-radius-md);
  scrollbar-gutter: stable;
}
```

---

# 17. Filtros

Filtros oficiais:

```text
Todas
Erradas
Discursivas
Revisão
Não respondidas
```

Regras:

- `Todas`: exibe todas;
- `Erradas`: objetivas incorretas;
- `Discursivas`: todas as discursivas;
- `Revisão`: marcadas para revisão;
- `Não respondidas`: questões sem resposta.

Estado ativo:

- destaque violeta;
- `aria-pressed="true"`;
- borda reforçada;
- não depender só da cor.

Estado vazio:

```text
Nenhuma questão encontrada neste filtro.
```

---

# 18. Card resumido

Deve mostrar:

- número;
- tipo;
- assunto;
- estado;
- tempo;
- controle de expansão.

```html
<article class="review-card review-card--correct">
  <button class="review-card__summary" aria-expanded="false">
    <span class="review-card__number">01</span>

    <span class="review-card__meta">
      <strong>Objetiva • Eventos</strong>
      <span>✓ Correta • 01:42</span>
    </span>

    <span class="review-card__toggle">▶</span>
  </button>
</article>
```

Classes:

```text
review-card--correct
review-card--incorrect
review-card--discursive
review-card--review
review-card--unanswered
```

---

# 19. Regra de expansão

Somente um card pode permanecer expandido.

Ao abrir outro:

- fechar o anterior;
- atualizar `aria-expanded`;
- manter foco previsível;
- rolar o card para a área visível, se necessário.

O card expandido ocupa toda a largura:

```css
.review-card.expanded {
  grid-column: 1 / -1;
}
```

---

# 20. Card objetivo expandido

Elementos:

- número;
- tipo;
- assunto;
- estado;
- enunciado;
- sua resposta;
- resposta correta;
- tempo;
- explicação;
- anotação.

Estrutura:

```text
Questão 05 • Objetiva • Eventos
Incorreta • 02:10

Enunciado                         Explicação
...                               ...

Sua resposta   Resposta correta   Anotação
A ✕            D ✓                ...

Tempo utilizado
02:10
```

HTML sugerido:

```html
<div class="review-card__details review-objective-details">
  <section class="review-detail-block">
    <h3>Enunciado</h3>
    <p>...</p>

    <div class="objective-answer-comparison">
      <div>
        <span>Sua resposta</span>
        <strong>A ✕</strong>
      </div>

      <div>
        <span>Resposta correta</span>
        <strong>D ✓</strong>
      </div>

      <div>
        <span>Tempo utilizado</span>
        <strong>02:10</strong>
      </div>
    </div>
  </section>

  <section class="review-detail-block">
    <h3>Explicação</h3>
    <p>...</p>

    <h3>Anotação</h3>
    <p>...</p>
  </section>
</div>
```

CSS:

```css
.review-objective-details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
  gap: 20px;
  padding: 16px 20px 20px;
}

.objective-answer-comparison {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}
```

---

# 21. Card discursivo expandido

Elementos:

- número;
- tipo;
- assunto;
- revisão manual;
- tempo;
- enunciado;
- sua resposta;
- resposta esperada;
- critérios;
- anotações.

Estrutura:

```text
Questão 05 • Discursiva • Mediana
Revisão manual • 04:20

Enunciado       Sua resposta       Critérios de correção
...             ...                ...

Tempo utilizado Resposta esperada  Anotações
04:20           ...                ...
```

HTML sugerido:

```html
<div class="review-card__details review-discursive-details">
  <section class="discursive-review-column">
    <div class="review-detail-block">
      <h3>Enunciado</h3>
      <p>...</p>
    </div>

    <div class="review-time-block">
      <span>Tempo utilizado</span>
      <strong>04:20</strong>
    </div>
  </section>

  <section class="discursive-review-column">
    <div class="review-detail-block">
      <h3>Sua resposta</h3>
      <p>...</p>
    </div>

    <div class="review-detail-block">
      <h3>Resposta esperada</h3>
      <p>...</p>
    </div>
  </section>

  <section class="discursive-review-column">
    <div class="review-detail-block">
      <h3>Critérios de correção</h3>
      <p>...</p>
    </div>

    <div class="review-detail-block">
      <h3>Anotações</h3>
      <p>...</p>
    </div>
  </section>
</div>
```

CSS:

```css
.review-discursive-details {
  display: grid;
  grid-template-columns:
    minmax(0, 0.95fr)
    minmax(0, 1fr)
    minmax(0, 1fr);
  gap: 16px;
  padding: 16px 20px 20px;
}

.discursive-review-column {
  min-width: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;
}
```

---

# 22. Rolagem nos cards expandidos

Prioridade:

```text
rolagem do painel de revisão
```

Evitar várias barras internas.

Usar rolagem individual apenas quando o conteúdo exceder muito:

```css
.review-detail-block.is-scrollable {
  max-height: 180px;
  overflow: auto;
}
```

---

# 23. Não respondidas

Card:

```text
Questão 06
Objetiva • Eventos
— Não respondida • 00:48
```

Ao expandir:

- enunciado;
- sua resposta: `Não respondida`;
- resposta correta;
- explicação;
- anotação;
- tempo.

Não deve ser rotulada como incorreta.

---

# 24. Marcadas para revisão

Pode coexistir com:

- correta;
- incorreta;
- discursiva;
- não respondida.

Exemplo:

```text
✓ Correta • ★ Marcada para revisão
```

No filtro Revisão, todos esses estados aparecem.

---

# 25. Barra inferior

Grupo esquerdo:

```text
Baixar respostas
Baixar anotações
Exportar sessão
```

Grupo direito:

```text
Voltar ao início
```

```html
<footer class="panel results-actionbar">
  <div class="results-actions__exports">
    <button id="btnBaixarRespostas" class="button button--secondary">
      Baixar respostas
    </button>

    <button id="btnBaixarAnotacoes" class="button button--secondary">
      Baixar anotações
    </button>

    <button id="btnExportarSessao" class="button button--secondary">
      Exportar sessão
    </button>
  </div>

  <div class="results-actions__navigation">
    <button id="btnVoltarInicioResultado" class="button button--primary">
      Voltar ao início
    </button>
  </div>
</footer>
```

```css
.results-actionbar {
  grid-area: actions;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
}
```

---

# 26. Exportações

## Respostas

Formato:

```text
.txt
```

Conteúdo:

- resumo;
- respostas;
- gabarito;
- estado;
- tempo.

## Anotações

Formato:

```text
.txt
```

Separado das respostas.

## Sessão

Formato:

```text
.json
```

Conteúdo:

- questões;
- respostas;
- anotações;
- tempos;
- revisão;
- marcações;
- resultado;
- metadados.

---

# 27. Modelo de estado

```js
const resultsState = {
  listaNome: "",
  questoes: [],
  respostas: {},
  anotacoes: {},
  temposMs: {},
  revisao: {},
  marcacoesAlternativas: {},

  resumo: {
    respondidas: 0,
    total: 0,
    corretas: 0,
    objetivas: 0,
    desempenho: null,
    tempoTotalMs: 0,
    tempoMedioMs: 0,
    marcadas: 0
  },

  assuntos: {},
  filtroAtivo: "all",
  cardExpandidoId: null
};
```

Filtros:

```text
all
incorrect
discursive
review
unanswered
```

---

# 28. Estados gerais

## Sessão completa

Todos os dados disponíveis.

## Somente objetivas

Aviso discursivo oculto.

## Somente discursivas

- desempenho: não disponível;
- respostas corretas: `—`;
- aviso manual visível.

## Com não respondidas

Contagem e filtro próprios.

## Filtro sem resultado

```text
Nenhuma questão encontrada neste filtro.
```

## Carregando

```text
Preparando seu resultado...
```

## Erro

```text
Não foi possível carregar os dados desta sessão.
```

Ações:

- tentar novamente;
- voltar ao início.

---

# 29. Responsividade

## Desktop

```text
Resumo lateral + revisão principal
```

## Tablet

Abaixo de `1000px`:

- coluna esquerda reduzida;
- filtros podem rolar horizontalmente;
- card discursivo em duas colunas.

```css
@media (max-width: 1000px) {
  .results-layout {
    grid-template-columns:
      minmax(280px, 0.85fr)
      minmax(0, 1.6fr);
    gap: 12px;
  }

  .review-discursive-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

## Mobile

Abaixo de `720px`:

```text
Cabeçalho
Resultado geral
Por assunto
Filtros
Revisão
Exportações
Voltar ao início
```

```css
@media (max-width: 720px) {
  .screen--results {
    overflow: auto;
  }

  .results-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "sidebar"
      "review"
      "actions";
    overflow: visible;
  }

  .results-sidebar {
    grid-template-rows: auto;
  }

  .review-list {
    grid-template-columns: 1fr;
  }

  .review-objective-details,
  .review-discursive-details {
    grid-template-columns: 1fr;
  }

  .results-actionbar {
    display: grid;
    grid-template-columns: 1fr;
  }
}
```

---

# 30. Dimensões e espaçamentos

## Cabeçalho

```text
48px a 58px
```

## Barra inferior

```text
64px a 76px
```

## Cards resumidos

```text
mínimo de 62px
```

## Card expandido

```text
altura automática
mínimo aproximado de 220px
```

## Botões

```text
mínimo de 44px
```

## Painel por assunto

```text
mínimo de 260px
```

## Espaçamentos

```text
Entre painéis: 12px a 16px
Padding: 18px a 24px
Entre cards: 10px a 14px
Entre filtros: 8px a 12px
Entre blocos internos: 12px a 20px
```

---

# 31. Acessibilidade

## Filtros

```html
aria-pressed
```

## Cards

```html
aria-expanded
aria-controls
```

## Descrições acessíveis

```text
Questão 2, objetiva, incorreta, tempo de 2 minutos e 10 segundos.
Questão 5, discursiva, revisão manual, marcada para revisão.
```

## Barras

Usar `role="progressbar"`.

## Exportações

Ícones não substituem os textos.

## Foco

Ao expandir:

- manter foco no botão;
- ou mover para o título do detalhe, após testes.

---

# 32. Ajustes extras

## Redução de movimento

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Conteúdo longo

```css
overflow-wrap: anywhere;
```

## Nome da lista e assunto

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

---

# 33. Ordem de implementação

## Etapa 1 — Base

1. tela;
2. cabeçalho;
3. grade;
4. barra inferior.

## Etapa 2 — Resultado geral

1. indicadores;
2. formatação;
3. aviso discursivo;
4. estado sem objetivas.

## Etapa 3 — Por assunto

1. agrupamento;
2. percentuais;
3. barras;
4. tempo;
5. assuntos sem objetivas.

## Etapa 4 — Filtros

1. todas;
2. erradas;
3. discursivas;
4. revisão;
5. não respondidas;
6. estado vazio.

## Etapa 5 — Cards resumidos

1. correta;
2. incorreta;
3. discursiva;
4. revisão;
5. não respondida.

## Etapa 6 — Objetiva expandida

1. enunciado;
2. respostas;
3. explicação;
4. anotação;
5. tempo.

## Etapa 7 — Discursiva expandida

1. enunciado;
2. resposta;
3. resposta esperada;
4. critérios;
5. anotações;
6. tempo.

## Etapa 8 — Exportações

1. respostas;
2. anotações;
3. JSON.

## Etapa 9 — Responsividade

1. desktop;
2. tablet;
3. mobile;
4. textos longos;
5. muitos assuntos;
6. muitos cards.

---

# 34. Checklist — Estrutura

- [ ] Cabeçalho estável.
- [ ] Coluna esquerda legível.
- [ ] Revisão ocupa a maior área.
- [ ] Barra inferior permanece visível.
- [ ] Página não cria rolagem global.
- [ ] Tema claro e escuro funcionam.

---

# 35. Checklist — Resultado geral

- [ ] Respondidas corretas.
- [ ] Corretas consideram somente objetivas.
- [ ] Desempenho correto.
- [ ] Sem objetivas não mostra 0%.
- [ ] Tempo total correto.
- [ ] Tempo médio correto.
- [ ] Marcadas corretas.
- [ ] Aviso discursivo aparece quando necessário.

---

# 36. Checklist — Por assunto

- [ ] Todos os assuntos aparecem.
- [ ] Acertos corretos.
- [ ] Percentuais corretos.
- [ ] Tempo correto.
- [ ] Sem objetivas não mostra barra enganosa.
- [ ] Lista rola internamente.
- [ ] Textos longos não quebram o layout.

---

# 37. Checklist — Filtros

- [ ] Todas funciona.
- [ ] Erradas funciona.
- [ ] Discursivas funciona.
- [ ] Revisão funciona.
- [ ] Não respondidas funciona.
- [ ] Filtro ativo visível.
- [ ] Estado vazio aparece.
- [ ] Teclado funciona.

---

# 38. Checklist — Cards

- [ ] Apenas um card expande.
- [ ] Card ocupa largura total.
- [ ] Card anterior fecha.
- [ ] Objetiva mostra resposta correta.
- [ ] Objetiva mostra explicação.
- [ ] Discursiva mostra resposta esperada.
- [ ] Discursiva mostra critérios.
- [ ] Anotações aparecem.
- [ ] Tempo aparece.
- [ ] Não respondida não é chamada de incorreta.
- [ ] Revisão pode coexistir com outros estados.

---

# 39. Checklist — Exportações

- [ ] TXT de respostas funciona.
- [ ] TXT de anotações funciona.
- [ ] JSON funciona.
- [ ] Nomes dos arquivos são adequados.
- [ ] Acentuação é preservada.
- [ ] Conteúdo corresponde à sessão.
- [ ] Exportar não altera o estado.

---

# 40. Decisão estrutural final

A Tela de Resultado Final v3 é considerada a referência oficial.

Estrutura aprovada:

```text
Cabeçalho
├── Início
├── Resultado final + lista
└── Tema

Corpo
├── Lateral
│   ├── Resultado geral
│   └── Por assunto
└── Principal
    ├── Filtros
    └── Revisão
        ├── Cards resumidos
        ├── Card objetivo expandido
        └── Card discursivo expandido

Rodapé
├── Exportações
└── Voltar ao início
```

Estados oficiais:

```text
Correta
Incorreta
Discursiva
Marcada para revisão
Não respondida
```

---

# 41. Próximo passo

Após este manual:

1. reunir os quatro manuais oficiais;
2. revisar IDs e dados existentes;
3. criar uma branch de implementação visual;
4. substituir a Tela Inicial;
5. substituir Importação e Validação;
6. substituir Resolução;
7. substituir Resultado Final;
8. testar o fluxo completo;
9. planejar e implementar os modais.
