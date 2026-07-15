# Test Quest — Manual de Estrutura da Tela Inicial

**Versão do documento:** 1.0  
**Aplicação:** Test Quest — *Now I Know.*  
**Layout de referência:** Tela Inicial v3  
**Escopo:** estrutura visual, funções, elementos, estados, tamanhos, espaçamentos, responsividade, acessibilidade e roteiro de implementação da Tela Inicial.

---

# 1. Finalidade deste manual

Este documento orienta a criação da Tela Inicial do Test Quest em HTML e CSS.

A Tela Inicial deve funcionar como ponto de entrada da aplicação. Ela precisa apresentar a marca, mostrar o progresso acumulado do usuário e oferecer dois caminhos principais:

```text
Continuar uma resolução existente
Iniciar uma nova resolução
```

O objetivo deste manual é impedir que a tela seja construída apenas como um painel decorativo. Cada bloco deve possuir função clara, estado definido e comportamento previsível.

---

# 2. Objetivos da Tela Inicial

A tela deve permitir que o usuário:

- reconheça imediatamente o Test Quest;
- veja o slogan oficial;
- compreenda a proposta da aplicação;
- continue uma sessão em andamento;
- inicie uma nova resolução;
- consulte indicadores históricos;
- altere o tema;
- identifique o autor da aplicação.

A tela não deve:

- importar questões;
- exibir erros de validação;
- mostrar o mapa de questões;
- apresentar respostas;
- exibir detalhes extensos de sessões antigas;
- criar rolagem global no `body`.

---

# 3. Estrutura visual aprovada

A estrutura oficial segue esta composição:

```text
Barra superior
└── Botão Tema

Área principal
├── Coluna esquerda
│   ├── Painel da marca
│   └── Painel de ações e sessão ativa
└── Coluna direita
    ├── Painel “Seu Progresso”
    └── Rodapé
```

Representação:

```text
┌──────────────────────────────────────┬──────────────────────┐
│                                      │ [Tema]               │
│          TEST QUEST                  │                      │
│          Now I Know.                 │ Seu progresso        │
│                                      │                      │
│ Resolva, compreenda e avance.        │ Indicadores          │
│                                      │                      │
├──────────────────────────────────────┤                      │
│ Continuar resolução                  │                      │
│ Detalhes da sessão                   ├──────────────────────┤
│ Barra de progresso                   │ Rodapé               │
│                                      │                      │
│ Iniciar nova resolução               │                      │
└──────────────────────────────────────┴──────────────────────┘
```

---

# 4. Estrutura recomendada de arquivos

```text
src/styles/
├── components/
│   ├── buttons.css
│   ├── panels.css
│   ├── progress.css
│   ├── metrics.css
│   └── theme-toggle.css
├── layouts/
│   └── app-shell.css
├── pages/
│   └── home.css
└── main.css
```

JavaScript sugerido futuramente:

```text
src/scripts/features/home/
├── home.controller.js
├── home.metrics.js
├── home.session.js
└── home.storage.js
```

---

# 5. Tokens utilizados

A Tela Inicial deve utilizar os tokens oficiais da identidade visual.

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

## 5.3 Cores semânticas nesta tela

```text
Violeta → ação principal, progresso e números dos indicadores
Cinza   → ações secundárias e superfícies
Verde   → sessão concluída ou progresso histórico
Amarelo → avisos
Vermelho → apagar ou substituir dados
```

A Tela Inicial não deve usar vermelho em ações comuns de navegação.

---

# 6. Tipografia

Fonte funcional:

```css
:root {
  --tq-font:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}
```

A marca pode usar uma fonte condensada própria, desde que:

- continue legível;
- não dependa de sombras pesadas;
- não seja usada nos botões;
- possua fonte alternativa.

Escala sugerida:

```css
:root {
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

# 7. Estrutura semântica sugerida

```html
<section id="telaInicial" class="screen screen--home">
  <header class="home-toolbar">
    <button
      id="btnTemaInicial"
      class="button button--neutral theme-toggle"
      type="button"
    >
      Tema
    </button>
  </header>

  <div class="home-layout">
    <div class="home-left-column">
      <section class="panel brand-panel">
        <!-- marca -->
      </section>

      <section class="panel home-actions-panel">
        <!-- sessão ativa e ações -->
      </section>
    </div>

    <div class="home-right-column">
      <aside class="panel progress-panel">
        <!-- indicadores -->
      </aside>

      <footer class="panel home-footer">
        <!-- autoria -->
      </footer>
    </div>
  </div>
</section>
```

---

# 8. Contêiner da tela

```css
.screen--home {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}
```

A barra superior deve conter apenas o botão de tema.

```css
.home-toolbar {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
```

---

# 9. Layout principal

```css
.home-layout {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    minmax(0, 1.75fr)
    minmax(320px, 0.9fr);
  gap: 20px;
}
```

Proporção aproximada:

```text
Coluna esquerda → 64% a 68%
Coluna direita  → 32% a 36%
```

## 9.1 Coluna esquerda

```css
.home-left-column {
  min-height: 0;
  display: grid;
  grid-template-rows:
    minmax(0, 1.35fr)
    minmax(220px, 0.9fr);
  gap: 20px;
}
```

## 9.2 Coluna direita

```css
.home-right-column {
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 16px;
}
```

---

# 10. Painel da marca

## 10.1 Função

Apresentar:

```text
TEST QUEST
Now I Know.
Resolva, compreenda e avance.
```

## 10.2 Regras

- usar o nome oficial “Test Quest” em conteúdos acessíveis;
- preservar o slogan “Now I Know.” com ponto final;
- não usar aspas no slogan;
- a frase de apoio pode usar itálico;
- o painel deve transmitir identidade sem parecer um cartaz exagerado;
- evitar sombras pesadas.

## 10.3 Estrutura sugerida

```html
<section class="panel brand-panel">
  <div class="brand-panel__content">
    <h1 class="brand-title">Test Quest</h1>
    <p class="brand-slogan">Now I Know.</p>
    <p class="brand-message">
      Resolva, compreenda e avance.
    </p>
  </div>
</section>
```

## 10.4 CSS sugerido

```css
.brand-panel {
  min-height: 0;
  display: grid;
  place-items: center;
  padding: clamp(24px, 4vw, 48px);
  text-align: center;
}

.brand-panel__content {
  width: min(100%, 820px);
}

.brand-title {
  margin: 0;
  font-size: clamp(3.5rem, 7vw, 7rem);
  line-height: 0.9;
  color: var(--tq-text);
}

.brand-slogan {
  margin: 16px 0 0;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1;
}

.brand-message {
  margin: clamp(24px, 4vh, 48px) 0 0;
  font-size: clamp(1.25rem, 2vw, 2rem);
  font-style: italic;
  font-weight: 600;
}
```

---

# 11. Painel de ações

## 11.1 Função

Oferecer:

- continuação da sessão ativa;
- início de nova resolução.

Estrutura aprovada:

```text
[Continuar resolução] [Nome e detalhes]
[Barra de progresso]

[Iniciar nova resolução] [Descrição]
```

## 11.2 HTML sugerido

```html
<section class="panel home-actions-panel">
  <div id="blocoContinuarSessao" class="session-resume">
    <div class="session-resume__row">
      <button
        id="btnContinuarResolucao"
        class="button button--primary"
        type="button"
      >
        Continuar resolução
      </button>

      <div class="session-resume__details">
        <strong id="nomeSessaoAtual">Lista de Estatística</strong>
        <span id="resumoSessaoAtual">
          6/10 respondidas • 12:34
        </span>
      </div>
    </div>

    <div
      class="session-progress"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="60"
    >
      <div class="session-progress__value"></div>
    </div>
  </div>

  <div class="new-session-action">
    <button
      id="btnNovaResolucao"
      class="button button--secondary"
      type="button"
    >
      Iniciar nova resolução
    </button>

    <p>Importar uma nova lista de questões.</p>
  </div>
</section>
```

---

# 12. Sessão ativa

## 12.1 Informações exibidas

- nome da lista;
- número de questões respondidas;
- total;
- tempo usado;
- barra de progresso.

Formato:

```text
Lista de Estatística
6/10 respondidas • 12:34
```

## 12.2 Nome longo

```css
.session-resume__details strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Adicionar:

```html
title="Nome completo da lista"
```

## 12.3 Barra

```css
.session-progress {
  height: 10px;
  overflow: hidden;
  background: var(--tq-surface-soft);
  border-radius: 999px;
}

.session-progress__value {
  width: 60%;
  height: 100%;
  background: var(--tq-primary);
}
```

---

# 13. Estado sem sessão ativa

Quando não houver sessão ativa:

- ocultar completamente o bloco de continuação;
- não deixar espaço vazio;
- “Iniciar nova resolução” se torna a ação principal;
- descrição permanece visível.

Exemplo:

```css
.session-resume.hidden {
  display: none;
}
```

O botão nova resolução muda de classe:

```text
button--secondary → button--primary
```

---

# 14. Iniciar nova resolução com sessão ativa

Ao clicar em “Iniciar nova resolução” quando houver sessão ativa, exibir confirmação:

```text
Você possui uma resolução em andamento.

Iniciar uma nova sessão substituirá o progresso atual.
```

Ações:

```text
Cancelar
Iniciar nova resolução
```

O modal será definido posteriormente.

---

# 15. Painel “Seu Progresso”

## 15.1 Função

Apresentar indicadores históricos de sessões concluídas.

Cabeçalho:

```text
Seu progresso
Resumo das suas sessões no Test Quest
```

## 15.2 Indicadores oficiais

1. questões respondidas;
2. taxa média de acertos;
3. tempo total de estudo;
4. sessões concluídas.

## 15.3 Regra de cálculo

A sessão atual não entra nos indicadores antes de ser concluída.

### Questões respondidas

```text
Soma das questões respondidas em sessões concluídas.
```

### Taxa média de acertos

```text
Média das questões objetivas concluídas.
```

### Tempo total

```text
Soma do tempo das sessões concluídas.
```

### Sessões concluídas

```text
Quantidade de sessões finalizadas.
```

---

# 16. Estrutura dos indicadores

```html
<aside class="panel progress-panel">
  <header class="progress-panel__header">
    <h2>Seu progresso</h2>
    <p>Resumo das suas sessões no Test Quest</p>
  </header>

  <div class="metrics-list">
    <article class="metric-card">
      <strong id="totalRespondidas" class="metric-card__value">
        0
      </strong>
      <span class="metric-card__label">
        Questões respondidas
      </span>
    </article>

    <article class="metric-card">
      <strong id="taxaMediaAcertos" class="metric-card__value">
        0%
      </strong>
      <span class="metric-card__label">
        Taxa média de acertos
      </span>
    </article>

    <article class="metric-card">
      <strong id="tempoTotalEstudo" class="metric-card__value">
        0h 00min
      </strong>
      <span class="metric-card__label">
        Tempo total de estudo
      </span>
    </article>

    <article class="metric-card">
      <strong id="sessoesConcluidas" class="metric-card__value">
        0
      </strong>
      <span class="metric-card__label">
        Sessões concluídas
      </span>
    </article>
  </div>
</aside>
```

---

# 17. CSS dos indicadores

```css
.progress-panel {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 20px;
  padding: 24px;
}

.progress-panel__header {
  text-align: center;
}

.progress-panel__header h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
}

.progress-panel__header p {
  margin: 8px 0 0;
  color: var(--tq-text-muted);
}

.metrics-list {
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(4, minmax(70px, 1fr));
  gap: 12px;
}

.metric-card {
  min-height: 78px;
  display: grid;
  grid-template-columns: minmax(72px, auto) minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: var(--tq-surface-soft);
  border: 1px solid var(--tq-border);
  border-radius: var(--tq-radius-md);
}

.metric-card__value {
  font-size: clamp(1.75rem, 2.8vw, 2.75rem);
  font-weight: 800;
  color: var(--tq-primary);
}

.metric-card__label {
  font-size: var(--tq-text-md);
  font-weight: 600;
  overflow-wrap: anywhere;
}
```

---

# 18. Estado vazio dos indicadores

No primeiro acesso:

```text
0
0%
0h 00min
0
```

Mensagem opcional:

```text
Conclua sua primeira sessão para começar seu histórico.
```

Os cards permanecem visíveis mesmo zerados para evitar alteração brusca do layout.

---

# 19. Rodapé

Conteúdo:

```text
Test Quest © 2026 — Vinícius Sidney
```

HTML:

```html
<footer class="panel home-footer">
  <small>Test Quest © 2026 — Vinícius Sidney</small>
</footer>
```

CSS:

```css
.home-footer {
  min-height: 64px;
  display: grid;
  place-items: center;
  padding: 12px 16px;
  color: var(--tq-text-muted);
  text-align: center;
}
```

Regras:

- sem sombra pesada;
- sem tamanho exagerado;
- autoria não deve competir com as ações.

---

# 20. Botão de tema

## 20.1 Função

- alternar tema;
- salvar preferência;
- atualizar ícone e texto.

Estados:

```text
🌙 Tema
☀ Tema
```

Texto acessível:

```text
Alternar para tema escuro
Alternar para tema claro
```

O botão deve ficar alinhado com a borda direita da coluna de progresso.

---

# 21. Estados completos da Tela Inicial

## Estado 1 — primeiro acesso

- sem sessão;
- sem histórico;
- indicadores zerados;
- nova resolução primária.

## Estado 2 — sessão ativa

- bloco continuar visível;
- continuar primário;
- nova resolução secundária;
- progresso visível.

## Estado 3 — sessão ativa e histórico

- sessão ativa visível;
- indicadores carregados;
- sessão atual não incluída no histórico.

## Estado 4 — somente histórico

- sem bloco continuar;
- nova resolução primária;
- indicadores carregados.

## Estado 5 — carregando dados

Mostrar:

```text
Carregando seus dados...
```

Evitar exibir valores parciais.

## Estado 6 — erro de leitura local

Mostrar aviso discreto:

```text
Não foi possível carregar o histórico salvo.
```

A aplicação ainda deve permitir iniciar uma nova resolução.

---

# 22. Persistência de dados

Dados mínimos para a Tela Inicial:

```js
const homeData = {
  sessaoAtual: {
    existe: true,
    listaNome: "Lista de Estatística",
    respondidas: 6,
    total: 10,
    tempoMs: 754000,
    progresso: 60
  },

  historico: {
    questoesRespondidas: 120,
    taxaMediaAcertos: 82,
    tempoTotalMs: 16320000,
    sessoesConcluidas: 12
  }
};
```

---

# 23. Formatação dos indicadores

## Questões respondidas

```js
String(total)
```

## Taxa média

```js
`${taxa}%`
```

## Tempo total

Exemplos:

```text
0h 00min
4h 32min
26h 08min
```

## Sessões concluídas

```js
String(total)
```

---

# 24. Responsividade

# 24.1 Desktop

Manter duas colunas.

# 24.2 Tablet

Abaixo de `1000px`:

- reduzir títulos;
- estreitar o painel de progresso;
- manter duas colunas somente enquanto houver espaço confortável.

```css
@media (max-width: 1000px) {
  .home-layout {
    grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.85fr);
    gap: 14px;
  }

  .home-left-column {
    gap: 14px;
  }
}
```

# 24.3 Mobile

Abaixo de `720px`:

```text
Tema
Marca
Ações
Indicadores
Rodapé
```

```css
@media (max-width: 720px) {
  .screen--home {
    overflow: auto;
  }

  .home-layout {
    grid-template-columns: 1fr;
    overflow: visible;
  }

  .home-left-column,
  .home-right-column {
    display: grid;
    grid-template-rows: auto;
  }

  .metrics-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto;
  }
}
```

Em telas muito estreitas:

```css
@media (max-width: 460px) {
  .metrics-list {
    grid-template-columns: 1fr;
  }
}
```

A rolagem deve ocorrer dentro da tela ativa, nunca no `body`.

---

# 25. Dimensões recomendadas

## Barra de tema

```text
44px a 52px de altura
```

## Painel da marca

```text
mínimo recomendado de 320px de altura no desktop
```

## Painel de ações

```text
mínimo recomendado de 220px
```

## Cards de indicadores

```text
mínimo de 76px
```

## Botões

```text
mínimo de 44px
```

## Rodapé

```text
56px a 72px
```

---

# 26. Espaçamentos

## Entre colunas

```text
16px a 20px
```

## Entre painéis

```text
14px a 20px
```

## Padding dos painéis

```text
20px a 32px
```

## Entre ação e descrição

```text
16px a 24px
```

## Entre indicadores

```text
10px a 14px
```

---

# 27. Acessibilidade

## Marca

O nome oficial deve estar em um `h1`.

## Botões

- texto claro;
- foco visível;
- área mínima de 44px;
- descrição acessível.

## Barra de progresso

Usar:

```html
role="progressbar"
aria-valuemin
aria-valuemax
aria-valuenow
```

## Indicadores

Cada valor deve estar associado à descrição.

## Tema

Informar a ação futura, não apenas o estado atual.

## Sessão ativa

O bloco deve ser compreensível sem depender somente da barra colorida.

---

# 28. Ajustes extras obrigatórios

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

## Truncamento

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

Usar somente quando o conteúdo completo estiver disponível via `title` ou recurso equivalente.

---

# 29. Ordem de implementação

## Etapa 1 — Base

1. contêiner da tela;
2. toolbar;
3. grade principal;
4. colunas.

## Etapa 2 — Marca

1. nome;
2. slogan;
3. mensagem;
4. escala responsiva.

## Etapa 3 — Ações

1. sessão ativa;
2. barra de progresso;
3. nova resolução;
4. estados sem sessão.

## Etapa 4 — Indicadores

1. cabeçalho;
2. cards;
3. formatação;
4. estado vazio.

## Etapa 5 — Rodapé

1. autoria;
2. alinhamento;
3. responsividade.

## Etapa 6 — Tema

1. botão;
2. troca;
3. persistência.

## Etapa 7 — JavaScript

1. leitura da sessão;
2. leitura do histórico;
3. atualização dos indicadores;
4. navegação;
5. confirmação de substituição.

## Etapa 8 — Testes

1. desktop;
2. tablet;
3. mobile;
4. textos longos;
5. tema claro;
6. tema escuro;
7. teclado.

---

# 30. Checklist — Estrutura

- [ ] Marca ocupa a área principal sem transbordar.
- [ ] Botão de tema está alinhado.
- [ ] Colunas possuem proporção correta.
- [ ] Painéis não criam rolagem global.
- [ ] Rodapé permanece discreto.
- [ ] Layout mobile foi testado.

---

# 31. Checklist — Sessão ativa

- [ ] Bloco aparece somente quando existe sessão.
- [ ] Nome da lista está correto.
- [ ] Nome longo não quebra o layout.
- [ ] Quantidade respondida está correta.
- [ ] Tempo está correto.
- [ ] Progresso está correto.
- [ ] Botão continuar funciona.
- [ ] Nova resolução pede confirmação.

---

# 32. Checklist — Indicadores

- [ ] Questões respondidas corretas.
- [ ] Taxa média correta.
- [ ] Tempo total correto.
- [ ] Sessões concluídas corretas.
- [ ] Sessão ativa não entra antes de finalizar.
- [ ] Valores zerados são exibidos corretamente.
- [ ] Formatos e unidades estão corretos.

---

# 33. Checklist — Acessibilidade

- [ ] `h1` correto.
- [ ] Botões têm foco visível.
- [ ] Tema possui rótulo acessível.
- [ ] Barra possui ARIA.
- [ ] Indicadores são compreensíveis.
- [ ] Contraste verificado.
- [ ] Navegação por teclado funciona.

---

# 34. Decisão estrutural final

A Tela Inicial v3 é considerada a referência oficial.

Estrutura aprovada:

```text
Toolbar
└── Tema

Área principal
├── Esquerda
│   ├── Marca
│   └── Sessão ativa e ações
└── Direita
    ├── Indicadores históricos
    └── Rodapé
```

Estados oficiais:

```text
Sem sessão
Com sessão ativa
Com histórico
Com sessão e histórico
Carregando
Erro de leitura local
```

---

# 35. Próximo passo

Após este manual:

1. criar o manual separado da Tela de Importação/Validação;
2. planejar a Tela de Resultado Final;
3. criar seu manual;
4. planejar modais;
5. implementar HTML e CSS;
6. integrar JavaScript gradualmente.
