# Test Quest — Manual de Estrutura da Tela de Resolução

**Versão:** 1.0  
**Aplicação:** Test Quest — *Now I Know.*  
**Layouts de referência:** Resolução Objetiva v3 e Resolução Discursiva v3  
**Escopo:** funções, elementos, estados, dimensões, espaçamentos, responsividade, acessibilidade e sequência de criação da Tela de Resolução.

---

# 1. Objetivo do documento

Este manual orienta a criação da Tela de Resolução em HTML e CSS.

A tela possui duas variações:

1. **Questão objetiva** — lista de alternativas selecionáveis e marcadores auxiliares.
2. **Questão discursiva** — campo amplo de resposta textual.

As duas versões devem compartilhar a mesma base estrutural. Somente a área de resposta muda. Isso reduz duplicação, facilita manutenção e mantém a identidade da aplicação.

---

# 2. Funções da tela

A Tela de Resolução deve permitir:

- visualizar a questão atual;
- acompanhar o progresso da sessão;
- consultar o tempo da questão e o tempo total;
- pausar e retomar o cronômetro;
- navegar pelo mapa de questões;
- responder questões objetivas e discursivas;
- fazer marcações auxiliares nas alternativas;
- registrar anotações separadas da resposta;
- marcar questões para revisão;
- finalizar a sessão;
- retornar ao início;
- alterar o tema.

A tela não deve:

- mostrar gabarito durante a resolução;
- indicar resposta correta ou incorreta antes do resultado;
- confundir marcação de rascunho com resposta oficial;
- contar tempo fora da Tela de Resolução;
- criar rolagem global no `body`.

---

# 3. Estrutura geral aprovada

```text
Cabeçalho
├── Voltar
├── Identificação da sessão
└── Tema

Área principal
├── Coluna esquerda
│   ├── Progresso geral
│   └── Anotações
└── Coluna direita
    ├── Questão e resposta
    └── Barra de ações
```

Visualmente:

```text
┌──────────────────────────────────────────────────────────────┐
│ [Voltar]  Resolver questões: Nome da lista          [Tema]  │
├───────────────────┬──────────────────────────────────────────┤
│ Progresso geral   │ Resolver questão                         │
│                   │ Metadados                                │
│                   │ Enunciado                                │
│                   │ Resposta objetiva ou discursiva          │
├───────────────────┼──────────────────────────────────────────┤
│ Anotações         │ Controles + navegação                    │
└───────────────────┴──────────────────────────────────────────┘
```

---

# 4. Tokens visuais

A tela deve usar os tokens oficiais do Test Quest.

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

  --tq-radius-sm: 10px;
  --tq-radius-md: 14px;
  --tq-radius-lg: 18px;
  --tq-radius-xl: 22px;

  --tq-space-1: 4px;
  --tq-space-2: 8px;
  --tq-space-3: 12px;
  --tq-space-4: 16px;
  --tq-space-5: 24px;
  --tq-space-6: 32px;
}
```

Tema escuro:

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

Uso semântico:

```text
Violeta → ação principal, seleção oficial, questão atual
Verde   → questão respondida e conclusão real
Amarelo → questão marcada para revisão
Vermelho → apagar, excluir ou ação destrutiva
Azul    → informação e marcação auxiliar
Cinza   → estados neutros
```

Durante a resolução:

- verde e vermelho não devem indicar correção;
- “Próxima” deve usar violeta, não verde;
- “Finalizar sessão” não deve parecer exclusão.

---

# 5. Estrutura semântica sugerida

```html
<section id="telaResolucao" class="screen screen--resolution">
  <header class="resolution-header">
    <button id="btnVoltarInicio">Voltar</button>

    <div class="resolution-session">
      <h1>Resolver questões</h1>
      <span id="nomeListaResolucao">Lista de Estatística</span>
    </div>

    <button id="btnTemaResolucao">Tema</button>
  </header>

  <div class="resolution-layout">
    <aside class="resolution-sidebar">
      <section class="panel progress-panel"></section>
      <section class="panel notes-panel"></section>
    </aside>

    <main class="resolution-workspace">
      <article class="panel question-panel"></article>
      <footer class="panel resolution-actionbar"></footer>
    </main>
  </div>
</section>
```

---

# 6. Contêiner e layout principal

```css
.screen--resolution {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}

.resolution-layout {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    clamp(280px, 27vw, 390px)
    minmax(0, 1fr);
  gap: 16px;
}
```

Proporção aproximada:

```text
Coluna esquerda → 27% a 30%
Coluna direita  → 70% a 73%
```

---

# 7. Cabeçalho

## Elementos

```text
[Voltar] [Resolver questões: Lista de Estatística] [Tema]
```

## Regras

- altura entre `48px` e `58px`;
- Voltar e Tema com estilo neutro;
- nome da lista truncado quando necessário;
- texto completo disponível em `title`;
- não colocar temporizador no cabeçalho.

```css
.resolution-header {
  min-height: 52px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.resolution-session {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 16px;
}

.resolution-session h1,
.resolution-session span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

# 8. Coluna esquerda

A coluna contém:

```text
Progresso geral
Anotações
```

```css
.resolution-sidebar {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows:
    minmax(0, 58fr)
    minmax(0, 42fr);
  gap: 16px;
}
```

Proporção recomendada:

```text
Progresso → 56% a 62%
Anotações → 38% a 44%
```

Se faltar altura, compactar primeiro o painel de progresso. Não reduzir as anotações a um campo inutilizável.

---

# 9. Painel de Progresso Geral

## Elementos

1. título;
2. posição atual;
3. percentual;
4. barra de progresso;
5. tempo atual;
6. tempo total;
7. pausar/retomar;
8. mapa de questões.

```text
Progresso geral
Questão 3 de 10 (30%)
[barra]

Atual          Total
0h 02m 30s     0h 07m 00s

[Pausar/Retomar]

[1] [2] [3] [4] ...
```

## Barra de progresso

```css
.progress-track {
  height: 10px;
  overflow: hidden;
  background: var(--tq-surface-soft);
  border-radius: 999px;
}

.progress-value {
  height: 100%;
  background: var(--tq-primary);
}
```

Acessibilidade:

```html
<div
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="30"
></div>
```

## Temporizadores

```css
.timer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
```

Usar um único formato em toda a aplicação:

```text
02:30 / 07:00
```

ou:

```text
0h 02m 30s / 0h 07m 00s
```

## Pausar e retomar

Estados:

```text
Pausar tempo
Retomar tempo
```

O cronômetro só conta quando:

- a Tela de Resolução está ativa;
- a aba está visível;
- o temporizador não está pausado;
- nenhum fluxo definido como interrupção está aberto.

---

# 10. Mapa das questões

```css
.question-map {
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  align-content: start;
  gap: 8px;
  scrollbar-gutter: stable;
}
```

Estados:

- pendente;
- atual;
- respondida;
- marcada para revisão;
- atual e marcada.

## Pendente

- fundo neutro;
- texto padrão.

## Atual

- fundo violeta;
- texto branco;
- borda reforçada.

## Respondida

- fundo verde suave;
- texto verde escuro;
- não significa que a resposta está correta.

## Marcada para revisão

- indicador amarelo;
- estrela ou pequeno sinal;
- não depender apenas da cor.

Cada botão deve ter rótulo acessível:

```html
aria-label="Ir para a questão 4"
```

Exemplo de rótulo composto:

```text
Questão 3, atual, respondida, marcada para revisão
```

---

# 11. Painel de Anotações

## Função

Registrar:

- raciocínio;
- dúvidas;
- lembretes;
- pontos de revisão;
- observações pessoais.

Anotação não é resposta oficial.

## Elementos

```text
Anotações
Use este espaço para registrar raciocínio, dúvidas e revisão.

[textarea]
```

```css
.notes-panel {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 8px;
  padding: 16px;
}

.notes-textarea {
  width: 100%;
  height: 100%;
  min-height: 0;
  resize: none;
  overflow: auto;
  padding: 12px;
  line-height: 1.45;
}
```

Placeholder:

```text
Anote aqui...
```

Persistência por questão:

```js
anotacoes[questaoId] = "texto";
```

Ao navegar:

1. salvar anotação atual;
2. carregar anotação da nova questão;
3. atualizar `localStorage`.

---

# 12. Coluna direita

```css
.resolution-workspace {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 16px;
}
```

Ela contém:

```text
Painel da questão
Barra de ações
```

---

# 13. Painel da questão

Estrutura comum:

```text
Resolver questão

[Questão 3] [Objetiva/Discursiva] [Assunto]
[Marcada para revisão]

Enunciado
Texto...

Área de resposta
```

HTML sugerido:

```html
<article class="question-panel">
  <header class="question-panel__header">
    <h2>Resolver questão</h2>

    <div class="question-meta">
      <span id="numeroQuestao" class="tag">Questão 3</span>
      <span id="tipoQuestao" class="tag">Objetiva</span>
      <span id="assuntoQuestao" class="tag">Eventos</span>
      <span id="statusRevisao" class="tag tag--review">
        Marcada para revisão
      </span>
    </div>
  </header>

  <section class="question-statement">
    <h3>Enunciado</h3>
    <p id="enunciadoQuestao"></p>
  </section>

  <section id="areaResposta" class="question-answer"></section>
</article>
```

---

# 14. Etiquetas e metadados

Etiquetas:

- número;
- tipo;
- assunto;
- revisão.

```css
.question-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag {
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--tq-surface-soft);
  color: var(--tq-text-muted);
  font-size: 0.8rem;
  font-weight: 700;
}
```

Regras:

- assunto longo usa reticências;
- texto completo disponível por `title`;
- selo de revisão só aparece quando marcado;
- etiquetas podem quebrar linha no mobile.

---

# 15. Enunciado

```css
.question-statement {
  min-height: 92px;
  max-height: clamp(110px, 20vh, 180px);
  overflow: auto;
  padding: 16px;
  border: 1px solid var(--tq-border);
  border-radius: var(--tq-radius-md);
  background: var(--tq-surface-soft);
  scrollbar-gutter: stable;
}
```

Regras:

- enunciado curto não deve reservar espaço exagerado;
- enunciado longo rola internamente;
- preservar quebras de linha;
- usar `overflow-wrap: anywhere`;
- não deixar o enunciado empurrar a área de resposta para fora da tela.

---

# 16. Versão Objetiva

## Regra fundamental

```text
Clique no card inteiro → resposta oficial
Clique no marcador lateral → marcação auxiliar
```

Esses comportamentos precisam ser visualmente distintos.

## Estrutura

```html
<div class="objective-options" role="radiogroup">
  <article class="option-card">
    <button class="option-card__answer" role="radio">
      <span class="option-card__letter">A)</span>
      <span class="option-card__text">Alternativa</span>
    </button>

    <button class="option-card__marker">
      Marcação auxiliar
    </button>
  </article>
</div>
```

A resposta oficial deve ser implementada com:

- `input type="radio"` estilizado; ou
- comportamento equivalente com ARIA correto.

Nunca usar o marcador auxiliar como resposta oficial.

---

# 17. Resposta oficial objetiva

Apenas uma alternativa pode estar selecionada.

Estados:

- padrão;
- hover;
- foco;
- selecionada.

Selecionada:

- borda violeta;
- fundo violeta suave;
- indicador claro;
- `aria-checked="true"`.

Durante a resolução não mostrar:

- correta;
- incorreta;
- nota;
- explicação.

---

# 18. Marcadores auxiliares

## Função

Apoiar raciocínio por:

- dúvida;
- eliminação;
- comparação;
- análise.

## Estados recomendados

```text
Neutro
Em análise
Eliminada
```

### Neutro

Sem marcação.

### Em análise

Alternativa considerada.

Pode usar:

- ponto;
- círculo;
- ícone de dúvida;
- azul informativo.

### Eliminada

Alternativa descartada.

Pode usar:

- `X`;
- texto levemente apagado;
- risco opcional;
- vermelho suave ou cinza.

## Ciclo sugerido

```text
Neutro → Em análise → Eliminada → Neutro
```

O ciclo deve ser informado por:

- `title`;
- `aria-label`;
- legenda;
- dica acessível.

## Relação com a resposta

A marcação auxiliar é independente da resposta oficial.

Para reduzir confusão, recomenda-se limpar a marcação auxiliar quando uma alternativa é escolhida como resposta oficial.

---

# 19. Card da alternativa

```css
.option-card {
  min-height: 54px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  border: 1px solid var(--tq-border);
  border-radius: var(--tq-radius-md);
  background: var(--tq-surface-soft);
  overflow: hidden;
}

.option-card__answer {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-align: left;
}

.option-card__marker {
  width: 48px;
  min-height: 48px;
}

.objective-options {
  min-height: 0;
  overflow: auto;
  display: grid;
  align-content: start;
  gap: 10px;
  padding-right: 4px;
  scrollbar-gutter: stable;
}
```

---

# 20. Versão Discursiva

Estrutura:

```html
<label class="discursive-field">
  <span>Sua resposta</span>

  <textarea
    id="respostaDiscursiva"
    class="discursive-textarea"
    placeholder="Responda aqui..."
  ></textarea>
</label>
```

```css
.discursive-field {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
}

.discursive-textarea {
  width: 100%;
  height: 100%;
  min-height: 0;
  resize: none;
  overflow: auto;
  padding: 16px;
  line-height: 1.55;
  scrollbar-gutter: stable;
}
```

Regras:

- textarea recebe prioridade de espaço;
- não impor limite pequeno de caracteres;
- salvar automaticamente;
- preservar quebras de linha;
- manter resposta separada das anotações;
- considerar respondida quando `trim()` não estiver vazio.

---

# 21. Barra inferior de ações

Grupos:

```text
Controle:
[Marcar revisão] [Finalizar sessão]

Navegação:
[Anterior] [Próxima/Finalizar]
```

HTML:

```html
<footer class="resolution-actionbar">
  <div class="resolution-actions__session">
    <button id="btnMarcarRevisao">Marcar revisão</button>
    <button id="btnFinalizarSessao">Finalizar sessão</button>
  </div>

  <div class="resolution-actions__navigation">
    <button id="btnAnterior">Anterior</button>
    <button id="btnProxima">Próxima</button>
    <button id="btnFinalizar">Finalizar</button>
  </div>
</footer>
```

```css
.resolution-actionbar {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
}

.resolution-actions__session,
.resolution-actions__navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

---

# 22. Estados dos botões

## Marcar revisão

```text
Marcar revisão
Desmarcar revisão
```

Ao marcar:

- selo superior aparece;
- mapa recebe indicador;
- estado é salvo.

## Finalizar sessão

- estilo neutro forte ou de atenção;
- não vermelho sólido por padrão;
- abre confirmação.

## Anterior

- neutro;
- desabilitado na primeira questão.

## Próxima

- violeta;
- escondida na última questão.

## Finalizar

- substitui Próxima na última questão;
- abre confirmação.

---

# 23. Confirmação de finalização

Conteúdo recomendado:

```text
Finalizar esta resolução?

Questões respondidas: 8 de 10
Questões sem resposta: 2
Questões marcadas para revisão: 3
```

Ações:

```text
Continuar resolvendo
Finalizar resolução
```

Se todas estiverem respondidas:

```text
Todas as questões foram respondidas.
Deseja finalizar e ver o resultado?
```

O modal será detalhado posteriormente.

---

# 24. Estados gerais da tela

## Objetiva sem resposta

- nenhuma alternativa oficial;
- marcações auxiliares opcionais;
- mapa pendente.

## Objetiva respondida

- uma alternativa oficial;
- mapa respondido.

## Discursiva vazia

- campo vazio;
- mapa pendente.

## Discursiva respondida

- texto não vazio após `trim()`;
- mapa respondido.

## Marcada para revisão

- selo visível;
- botão muda;
- mapa recebe indicador.

## Tempo pausado

- contador parado;
- botão “Retomar tempo”;
- estado visual discreto.

## Aba inativa

- tempo não avança;
- intervalo ausente não é somado ao retornar.

## Sessão restaurada

Restaurar:

- questão atual;
- respostas;
- anotações;
- tempos;
- revisão;
- marcadores auxiliares;
- mapa.

---

# 25. Modelo de estado sugerido

```js
const estado = {
  telaAtual: "resolucao",
  listaNome: "",
  questoes: [],
  questaoAtual: 0,

  respostas: {},
  anotacoes: {},
  temposMs: {},
  marcadasParaRevisao: {},

  marcacoesAlternativas: {
    "questao-id": {
      A: "neutro",
      B: "analise",
      C: "eliminada"
    }
  },

  temporizadorPausado: false,
  sessaoIniciadaEm: null,
  sessaoFinalizadaEm: null
};
```

Resposta objetiva:

```js
respostas[questaoId] = "C";
```

Resposta discursiva:

```js
respostas[questaoId] = "Texto da resposta";
```

---

# 26. Salvamento automático

Salvar quando:

- resposta oficial mudar;
- marcador auxiliar mudar;
- resposta discursiva mudar;
- anotação mudar;
- questão mudar;
- revisão mudar;
- usuário sair da tela;
- página for fechada.

Para textos, usar debounce entre:

```text
300ms e 600ms
```

Para tempos:

```text
salvar a cada 5 a 10 segundos
```

Também salvar em transições importantes.

---

# 27. Responsividade

## Desktop

Manter duas colunas.

## Tablet

Abaixo de aproximadamente `980px`:

```text
Progresso compacto + anotações
Painel principal
Ações
```

Possível estrutura:

```css
@media (max-width: 980px) {
  .resolution-layout {
    grid-template-columns: 1fr;
    grid-template-rows:
      minmax(150px, 26vh)
      minmax(0, 1fr);
  }

  .resolution-sidebar {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.8fr);
    grid-template-rows: 1fr;
  }
}
```

## Mobile

Abaixo de `720px`:

```text
Cabeçalho
Progresso compacto
Questão
Ações
Anotações
```

Alternativa:

```text
Cabeçalho
Questão
Ações
Painel auxiliar recolhível
```

Recomendações:

- mapa horizontal ou recolhível;
- temporizadores em linha;
- anotações recolhíveis;
- ações em grade;
- resposta discursiva prioritária;
- alternativas com altura automática;
- rolagem interna da tela ativa, nunca do `body`.

---

# 28. Dimensões mínimas

```text
Cabeçalho: 48px a 58px
Barra de ações: 64px a 76px
Botões: mínimo 44px
Mapa: 36px a 44px
Alternativas: mínimo 52px
Marcador auxiliar: 44px a 48px
Anotações: mínimo 140px
Textarea discursiva: mínimo 220px no desktop
```

---

# 29. Espaçamentos

```text
Padding dos painéis: 16px a 20px
Entre painéis: 12px a 16px
Entre alternativas: 8px a 12px
Entre etiquetas: 8px
Entre grupos de ações: 12px a 16px
```

---

# 30. Rolagem interna

Áreas roláveis:

- mapa;
- enunciado;
- alternativas;
- resposta discursiva;
- anotações.

Aplicar:

```css
scrollbar-gutter: stable;
```

Prioridade de espaço:

1. área de resposta;
2. mapa;
3. enunciado;
4. anotações.

Evitar muitas barras simultâneas quando o conteúdo couber normalmente.

---

# 31. Acessibilidade

## Resposta objetiva

- navegação por teclado;
- setas para alternativas;
- espaço ou Enter para selecionar;
- foco visível.

## Marcadores auxiliares

Rótulos claros:

```text
Marcar alternativa A como em análise
Marcar alternativa A como eliminada
Remover marcação da alternativa A
```

## Mapa

Exemplo:

```text
Questão 3, atual, respondida, marcada para revisão
```

## Temporizador

Não usar `aria-live` a cada segundo.

## Textareas

Sempre usar `label` associado.

## Troca de questão

Após navegar, considerar mover o foco para o título “Resolver questão”. Validar esse comportamento em teste real.

---

# 32. Ajustes extras

Redução de movimento:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Conteúdo longo:

```css
overflow-wrap: anywhere;
```

Nome da lista e assunto:

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

Ao restaurar sessão:

```text
Carregando resolução...
```

Evitar mostrar dados incompletos durante a restauração.

---

# 33. Ordem de implementação

## Etapa 1 — estrutura comum

1. cabeçalho;
2. grade principal;
3. coluna esquerda;
4. workspace;
5. barra de ações.

## Etapa 2 — progresso

1. texto;
2. barra;
3. tempos;
4. pausar;
5. mapa;
6. estados do mapa.

## Etapa 3 — anotações

1. painel;
2. textarea;
3. persistência por questão.

## Etapa 4 — questão comum

1. título;
2. etiquetas;
3. revisão;
4. enunciado.

## Etapa 5 — objetiva

1. cards;
2. seleção oficial;
3. marcadores;
4. estados;
5. teclado.

## Etapa 6 — discursiva

1. label;
2. textarea;
3. salvamento;
4. estado respondido.

## Etapa 7 — ações

1. revisão;
2. finalizar;
3. anterior;
4. próxima;
5. última questão.

## Etapa 8 — responsividade

1. desktop;
2. tablet;
3. mobile;
4. telas baixas;
5. textos longos.

## Etapa 9 — integração

1. `localStorage`;
2. temporizador;
3. navegação;
4. restauração;
5. finalização.

---

# 34. Checklist geral

- [ ] Cabeçalho permanece visível.
- [ ] Nome longo não transborda.
- [ ] Tema funciona.
- [ ] Página não possui rolagem global.
- [ ] Anotações não ficam comprimidas.
- [ ] Painel principal usa o espaço restante.
- [ ] Barra de ações permanece visível.
- [ ] Tema claro e escuro funcionam.

---

# 35. Checklist de progresso e tempo

- [ ] Questão atual correta.
- [ ] Total correto.
- [ ] Percentual correto.
- [ ] Barra atualiza.
- [ ] Tempo atual funciona.
- [ ] Tempo total funciona.
- [ ] Pausa funciona.
- [ ] Retomada funciona.
- [ ] Tempo não avança fora da resolução.
- [ ] Tempo não avança com aba oculta.
- [ ] Tempo é restaurado.

---

# 36. Checklist do mapa

- [ ] Todas as questões aparecem.
- [ ] Atual identificada.
- [ ] Respondidas identificadas.
- [ ] Pendentes identificadas.
- [ ] Revisão identificada.
- [ ] Navegação funciona.
- [ ] Rolagem interna funciona.
- [ ] Teclado funciona.
- [ ] Estados possuem rótulos acessíveis.

---

# 37. Checklist da objetiva

- [ ] Card inteiro seleciona resposta oficial.
- [ ] Apenas uma resposta oficial existe.
- [ ] Marcador não seleciona resposta.
- [ ] Estados do marcador são claros.
- [ ] Eliminação não parece correção.
- [ ] Resposta é salva.
- [ ] Marcadores são salvos.
- [ ] Estado é restaurado.
- [ ] Textos longos não quebram o layout.
- [ ] Alternativas rolam internamente.

---

# 38. Checklist da discursiva

- [ ] Campo ocupa espaço prioritário.
- [ ] Resposta é salva automaticamente.
- [ ] Quebras de linha são preservadas.
- [ ] Troca de questão não apaga conteúdo.
- [ ] Sessão restaurada mantém resposta.
- [ ] Campo possui `label`.
- [ ] Placeholder é claro.
- [ ] Rolagem interna funciona.

---

# 39. Checklist das anotações

- [ ] Anotação é independente da resposta.
- [ ] Cada questão possui anotação própria.
- [ ] Alteração é salva.
- [ ] Navegação restaura a anotação correta.
- [ ] Exportação futura pode separar anotações.
- [ ] Textarea não fica comprimida.
- [ ] Rolagem funciona.

---

# 40. Checklist das ações

- [ ] Anterior desabilitado na primeira.
- [ ] Próxima substituída na última.
- [ ] Finalizar abre confirmação.
- [ ] Marcar revisão altera o botão.
- [ ] Selo acompanha o estado.
- [ ] Mapa acompanha a revisão.
- [ ] Foco é visível.
- [ ] Cores semânticas estão corretas.

---

# 41. Decisão estrutural final

As versões **Objetiva v3** e **Discursiva v3** são as referências oficiais da Tela de Resolução.

Estrutura aprovada:

```text
Cabeçalho
├── Voltar
├── Nome da lista
└── Tema

Corpo
├── Lateral
│   ├── Progresso
│   └── Anotações
└── Principal
    ├── Metadados
    ├── Enunciado
    ├── Resposta objetiva ou discursiva
    └── Ações
```

Diferenças:

```text
Objetiva
- cards clicáveis;
- resposta única;
- marcadores auxiliares.

Discursiva
- textarea ampla;
- resposta textual;
- salvamento automático.
```

---

# 42. Próximos passos

1. planejar a Tela de Resultado Final;
2. aprovar o layout;
3. criar o manual da Tela de Resultado;
4. revisar os modais necessários;
5. implementar HTML e CSS;
6. integrar a lógica gradualmente.

Os modais podem ser detalhados depois das quatro telas principais, desde que seus pontos de abertura já sejam previstos na estrutura do HTML.
