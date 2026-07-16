# Test Quest — Manual de Estrutura da Tela de Desempenho

## 1. Objetivo da tela

A **Tela de Desempenho** é uma tela intermediária exibida **após a finalização da resolução** e **antes da Tela de Resultado Final**.

Sua função é:

- entregar uma leitura **rápida, visual e emocional** do desempenho da sessão;
- destacar a **porcentagem geral de acerto**;
- reforçar a sensação de progresso, conquista ou necessidade de revisão;
- preparar o usuário para seguir para a **Tela de Resultado Final detalhada**.

Esta tela deve ser **simples, impactante e curta**, sem excesso de informações técnicas.

---

## 2. Papel da tela no fluxo do app

Fluxo recomendado:

```text
Tela de Resolução
→ Tela de Desempenho
→ Tela de Resultado Final
```

### Regras do fluxo

- A tela aparece imediatamente após o usuário concluir a sessão.
- Exibe o desempenho geral calculado com base nas questões objetivas.
- Ao clicar no botão principal, o usuário avança para a **Tela de Resultado Final**.
- Não deve substituir a Tela de Resultado Final. Ela funciona como **transição de impacto**.

---

## 3. Estrutura geral da tela

A tela possui **uma única estrutura base**, variando apenas o conteúdo e as cores conforme a faixa de desempenho.

### Blocos visuais principais

1. **Faixa superior / cabeçalho de destaque**
   - mostra o rótulo “Desempenho Geral:”.

2. **Painel central de desempenho**
   - mostra o percentual em destaque;
   - mostra a mensagem principal;
   - mostra a mensagem complementar;
   - mostra o botão principal de continuação.

3. **Bloco inferior decorativo / base visual**
   - ajuda a manter coerência com o restante do layout do app;
   - não precisa ter função ativa obrigatória.

4. **Painéis laterais decorativos**
   - reforçam a composição visual;
   - ajudam a manter o mesmo “idioma estrutural” das outras telas.

---

## 4. Filosofia visual da tela

Esta tela deve transmitir:

- **clareza**;
- **impacto imediato**;
- **resposta emocional coerente com o desempenho**;
- **continuidade com as demais telas do Test Quest**.

### Princípios visuais

- percentual muito grande e centralizado;
- pouco texto, mas texto forte;
- alto contraste;
- botão central único e evidente;
- uso de cor como sinalização de faixa de desempenho;
- mesma base estrutural para todos os estados.

---

## 5. Estrutura HTML sugerida

```html
<section class="performance-screen performance-screen--excellent-100">
  <div class="performance-shell">
    <aside class="performance-side performance-side--left" aria-hidden="true"></aside>

    <div class="performance-main-column">
      <header class="performance-topbar">
        <p class="performance-topbar-label">Desempenho Geral:</p>
      </header>

      <main class="performance-hero-panel">
        <div class="performance-score-block">
          <span class="performance-score-value">100</span>
          <span class="performance-score-symbol">%</span>
        </div>

        <div class="performance-copy-block">
          <h1 class="performance-title">Perfeito!</h1>
          <p class="performance-subtitle">Você acertou tudo nesta sessão!</p>
        </div>

        <div class="performance-action-block">
          <button class="btn btn-primary performance-continue-button" type="button">
            Ótimo!
          </button>
        </div>
      </main>

      <footer class="performance-footer-bar" aria-hidden="true"></footer>
    </div>

    <aside class="performance-side-group performance-side-group--right" aria-hidden="true">
      <div class="performance-side performance-side--right-top"></div>
      <div class="performance-side performance-side--right-bottom"></div>
    </aside>
  </div>
</section>
```

---

## 6. Hierarquia de conteúdo

### Ordem de leitura

1. **Desempenho Geral:**
2. **Percentual**
3. **Mensagem principal**
4. **Mensagem complementar**
5. **Botão principal**

### Importância dos elementos

#### Muito alta
- percentual;
- mensagem principal;
- botão principal.

#### Alta
- mensagem complementar.

#### Média
- rótulo superior “Desempenho Geral:”.

#### Baixa / estrutural
- painéis laterais e base inferior.

---

## 7. Conteúdo textual oficial dos 6 estados

---

### Estado 1 — 100%

#### Faixa
- exatamente **100%**.

#### Cor-base
- verde forte / verde de sucesso.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** `100%`
- **Mensagem principal:** `Perfeito!`
- **Mensagem complementar:** `Você acertou tudo nesta sessão!`
- **Texto do botão:** `Ótimo!`

#### Classe sugerida
```text
performance-screen--excellent-100
```

---

### Estado 2 — 90% a 99%

#### Faixa
- de **90% até 99%**.

#### Cor-base
- verde de sucesso, levemente menos intenso que o 100%.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** valor dinâmico entre `90%` e `99%`
- **Mensagem principal:** `Excelente!`
- **Mensagem complementar:** `Seu desempenho foi muito forte!`
- **Texto do botão:** `Aí Sim!`

#### Classe sugerida
```text
performance-screen--excellent-90
```

---

### Estado 3 — 75% a 89%

#### Faixa
- de **75% até 89%**.

#### Cor-base
- verde-azulado / azul-esverdeado.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** valor dinâmico entre `75%` e `89%`
- **Mensagem principal:** `Muito bom!`
- **Mensagem complementar:** `Você está avançando muito bem.`
- **Texto do botão:** `Que bom!`

#### Classe sugerida
```text
performance-screen--very-good
```

---

### Estado 4 — 60% a 74%

#### Faixa
- de **60% até 74%**.

#### Cor-base
- amarelo / dourado suave.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** valor dinâmico entre `60%` e `74%`
- **Mensagem principal:** `Bom resultado!`
- **Mensagem complementar:** `Você já construiu uma boa base.`
- **Texto do botão:** `Tudo bem!`

#### Classe sugerida
```text
performance-screen--good-result
```

> Observação: esta faixa reconhece que o usuário já possui uma base consistente, mas ainda pode avançar por meio da revisão.

---

### Estado 5 — 50% a 59%

#### Faixa
- de **50% até 59%**.

#### Cor-base
- laranja / âmbar.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** valor dinâmico entre `50%` e `59%`
- **Mensagem principal:** `Pode melhorar.`
- **Mensagem complementar:** `Você está no caminho, mas ainda precisa revisar alguns pontos.`
- **Texto do botão:** `Vou melhorar!`

#### Classe sugerida
```text
performance-screen--attention-50
```

> Observação: o ponto final em “Pode melhorar.” transmite firmeza sem exagero.

---

### Estado 6 — 0% a 49%

#### Faixa
- de **0% até 49%**.

#### Cor-base
- vermelho / vermelho escuro / vermelho de alerta.

#### Conteúdo
- **Rótulo superior:** `Desempenho Geral:`
- **Percentual:** valor dinâmico entre `0%` e `49%`
- **Mensagem principal:** `Hora de revisar!`
- **Mensagem complementar:** `Essa sessão mostrou pontos importantes para reforçar.`
- **Texto do botão:** `Vou me dedicar mais!`

#### Classe sugerida
```text
performance-screen--review-needed
```

---

## 8. Regras de ativação das faixas

### Lógica recomendada

```text
Se percentual === 100 → Estado 1
Se percentual >= 90 e percentual < 100 → Estado 2
Se percentual >= 75 e percentual < 90 → Estado 3
Se percentual >= 60 e percentual < 75 → Estado 4
Se percentual >= 50 e percentual < 60 → Estado 5
Se percentual >= 0 e percentual < 50 → Estado 6
```

### Regra importante

- O percentual usado aqui deve ser o **mesmo percentual final exibido na Tela de Resultado Final**.
- Evitar recalcular com outra lógica para não gerar inconsistência entre telas.

---

## 9. Elementos obrigatórios da tela

### 9.1. Rótulo superior

Texto fixo:

```text
Desempenho Geral:
```

#### Função
- contextualizar o valor central;
- deixar claro que o foco da tela é o resultado global.

#### Características visuais
- alinhado ao centro;
- alto contraste;
- menor que o número principal;
- sem competir com o percentual.

---

### 9.2. Percentual principal

#### Função
- elemento de maior destaque visual da tela.

#### Conteúdo
- número inteiro sem casas decimais;
- símbolo `%` destacado ao lado.

#### Regras
- deve ser grande;
- deve ser centralizado;
- precisa ser legível imediatamente.

#### Exemplo
```text
100%
90%
75%
60%
50%
0%
```

---

### 9.3. Mensagem principal

#### Função
- traduzir o resultado numérico em linguagem humana.

#### Características
- grande;
- forte;
- emocionalmente clara;
- curta.

---

### 9.4. Mensagem complementar

#### Função
- acrescentar contexto e direcionamento.

#### Características
- mais curta que um parágrafo comum;
- no máximo 1 linha idealmente, 2 linhas no limite;
- tom de incentivo.

---

### 9.5. Botão principal

#### Função
- avançar para a Tela de Resultado Final.

#### Comportamento
- ao clicar, seguir para a próxima etapa do fluxo;
- deve ser o único CTA principal da tela.

#### Importante
- o texto do botão muda conforme o estado, mas a ação é a mesma.

---

## 10. Funções dos blocos visuais

### 10.1. `.performance-shell`
Contêiner principal da tela.

#### Função
- alinhar todos os blocos estruturais;
- definir a largura máxima e a distribuição visual.

---

### 10.2. `.performance-topbar`
Faixa superior central.

#### Função
- receber o rótulo “Desempenho Geral:”.

---

### 10.3. `.performance-hero-panel`
Painel central principal.

#### Função
- concentrar toda a comunicação do desempenho.

#### Conteúdo interno
- percentual;
- título;
- subtítulo;
- botão.

---

### 10.4. `.performance-side`
Blocos laterais decorativos.

#### Função
- reforçar a composição visual;
- manter identidade com o restante das telas.

#### Observação
- podem ser ocultados ou simplificados em telas menores.

---

### 10.5. `.performance-footer-bar`
Faixa inferior decorativa.

#### Função
- dar sustentação visual à composição;
- manter repetição estrutural semelhante às outras telas.

---

## 11. Estados visuais e cores

A tela deve usar **cor semântica por faixa**.

### Estrutura recomendada das cores por estado

Cada estado deve afetar:

- fundo geral da tela (opcional);
- topo;
- painel central;
- painéis laterais;
- base inferior;
- botão principal;
- sombras coloridas suaves.

### Recomendação de organização no CSS

```css
.performance-screen--excellent-100 { ... }
.performance-screen--excellent-90 { ... }
.performance-screen--very-good { ... }
.performance-screen--good-result { ... }
.performance-screen--attention-50 { ... }
.performance-screen--review-needed { ... }
```

### Variáveis CSS sugeridas

```css
--performance-bg
--performance-panel
--performance-panel-strong
--performance-accent
--performance-button
--performance-button-hover
--performance-shadow
--performance-text
--performance-subtext
```

---

## 12. Tamanhos e proporções recomendadas

> Os valores podem ser ajustados conforme o Design System do projeto.

### 12.1. Largura geral
- largura máxima do conjunto: **1280px a 1440px**;
- largura útil da área principal: **1100px a 1280px**.

### 12.2. Painel central
- largura dominante da composição;
- altura suficiente para conter:
  - percentual grande;
  - título;
  - subtítulo;
  - botão.

### 12.3. Percentual
- visualmente o maior elemento da tela;
- altura tipográfica muito superior aos demais textos.

### 12.4. Botão principal
- largura confortável, centralizada;
- deve ser grande o suficiente para parecer “ação final” da tela.

---

## 13. Espaçamentos recomendados

### Externo
- margem generosa ao redor da composição.

### Interno
- espaçamento claro entre:
  - rótulo superior e percentual;
  - percentual e título;
  - título e subtítulo;
  - subtítulo e botão.

### Sugestão de lógica de espaçamento
- gaps maiores entre blocos macro;
- gaps médios entre blocos textuais;
- gaps menores entre elementos relacionados diretamente.

---

## 14. Responsividade

A Tela de Desempenho deve se adaptar bem, mantendo impacto e clareza.

### Desktop largo
- estrutura completa com painéis laterais.

### Tablet / notebook menor
- pode reduzir a largura dos painéis laterais;
- manter painel central dominante.

### Mobile
- empilhar estrutura;
- ocultar ou simplificar painéis laterais;
- manter apenas:
  - rótulo superior;
  - percentual;
  - título;
  - subtítulo;
  - botão.

### Regra importante
- em telas pequenas, o impacto do percentual deve ser mantido, mas sem causar overflow.

---

## 15. Acessibilidade

### Requisitos mínimos
- contraste adequado entre texto e fundo;
- botão com foco visível;
- ordem de leitura lógica;
- título semântico forte;
- texto legível em tamanhos reduzidos.

### Boas práticas
- o percentual pode receber um `aria-label`, por exemplo:

```html
<div class="performance-score-block" aria-label="Desempenho geral de 75 por cento">
```

- o botão deve ter texto claro;
- evitar comunicar a faixa apenas pela cor.

---

## 16. Comportamentos e interações

### Ao carregar a tela
Pode haver:
- transição suave de entrada;
- leve animação no número;
- fade no painel central.

### Ao clicar no botão principal
- prosseguir para a Tela de Resultado Final;
- sem abrir modal intermediário, salvo se houver regra específica no app.

### O que evitar
- múltiplos botões concorrentes;
- excesso de informação técnica;
- ações secundárias desnecessárias.

---

## 17. Regras de implementação

### Regra 1
Implementar **uma única tela/componente** com **6 estados dinâmicos**, e não 6 páginas independentes.

### Regra 2
O conteúdo textual e a classe visual devem ser definidos a partir do percentual final.

### Regra 3
O botão sempre leva à Tela de Resultado Final.

### Regra 4
A tela não deve recalcular o desempenho de forma independente da etapa anterior.

### Regra 5
A estrutura do HTML deve permanecer estável. O que muda é:
- classe do estado;
- valor do percentual;
- título;
- subtítulo;
- texto do botão.

---

## 18. Estrutura de dados sugerida para os estados

```js
const PERFORMANCE_STATES = [
  {
    key: 'excellent-100',
    min: 100,
    max: 100,
    className: 'performance-screen--excellent-100',
    title: 'Perfeito!',
    subtitle: 'Você acertou tudo nesta sessão!',
    buttonLabel: 'Ótimo!'
  },
  {
    key: 'excellent-90',
    min: 90,
    max: 99,
    className: 'performance-screen--excellent-90',
    title: 'Excelente!',
    subtitle: 'Seu desempenho foi muito forte!',
    buttonLabel: 'Aí Sim!'
  },
  {
    key: 'very-good',
    min: 75,
    max: 89,
    className: 'performance-screen--very-good',
    title: 'Muito bom!',
    subtitle: 'Você está avançando muito bem.',
    buttonLabel: 'Que bom!'
  },
  {
    key: 'good-result',
    min: 60,
    max: 74,
    className: 'performance-screen--good-result',
    title: 'Bom resultado!',
    subtitle: 'Você já construiu uma boa base.',
    buttonLabel: 'Tudo bem!'
  },
  {
    key: 'attention-50',
    min: 50,
    max: 59,
    className: 'performance-screen--attention-50',
    title: 'Pode melhorar.',
    subtitle: 'Você está no caminho, mas ainda precisa revisar alguns pontos.',
    buttonLabel: 'Vou melhorar!'
  },
  {
    key: 'review-needed',
    min: 0,
    max: 49,
    className: 'performance-screen--review-needed',
    title: 'Hora de revisar!',
    subtitle: 'Essa sessão mostrou pontos importantes para reforçar.',
    buttonLabel: 'Vou me dedicar mais!'
  }
];
```

---

## 19. Checklist de construção

Antes de considerar a tela pronta, confirmar:

- [ ] existe apenas uma estrutura base da tela;
- [ ] os 6 estados estão mapeados;
- [ ] o percentual exibido está correto;
- [ ] as mensagens correspondem à faixa correta;
- [ ] o botão leva para a Tela de Resultado Final;
- [ ] o layout não quebra em telas menores;
- [ ] as cores respeitam a semântica de desempenho;
- [ ] a tela mantém coerência com o estilo geral do Test Quest.

---

## 20. Resumo final

A Tela de Desempenho é uma etapa de **impacto visual e reforço emocional** entre a resolução e a análise detalhada.

Ela deve:

- ser simples;
- ser forte visualmente;
- comunicar o resultado em segundos;
- usar uma única estrutura com 6 estados;
- conduzir o usuário naturalmente até a Tela de Resultado Final.

Se bem implementada, essa tela ajuda o Test Quest a ter mais identidade, mais clareza e uma experiência mais envolvente.
