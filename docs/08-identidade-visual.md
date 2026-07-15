# Identidade Visual

## Decisão oficial

- **Nome:** Test Quest
- **Slogan:** Now I Know.
- **Mensagem central:** Resolver, compreender e avançar.
- **Assinatura visual:** documento com dúvida transformada em confirmação.
- **Cor principal:** violeta.
- **Personalidade:** clara, organizada, tecnológica e confortável.

## Princípios

- clareza;
- progresso;
- compreensão;
- organização;
- estabilidade;
- conforto para sessões longas;
- tecnologia sem aparência excessivamente gamer;
- consistência entre tema claro e escuro.

## Paleta principal

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

## Tema escuro

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

## Fundos semânticos

```css
:root {
  --tq-primary-soft: rgba(98, 101, 246, 0.12);
  --tq-success-soft: rgba(34, 197, 94, 0.12);
  --tq-warning-soft: rgba(245, 158, 11, 0.12);
  --tq-danger-soft: rgba(239, 68, 68, 0.12);
  --tq-info-soft: rgba(56, 189, 248, 0.12);
}
```

## Tipografia

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

A marca pode usar uma fonte visual própria. Campos, botões e textos funcionais devem usar a fonte principal.

## Espaçamentos

```css
:root {
  --tq-space-1: 0.25rem;
  --tq-space-2: 0.5rem;
  --tq-space-3: 0.75rem;
  --tq-space-4: 1rem;
  --tq-space-5: 1.5rem;
  --tq-space-6: 2rem;
}
```

## Raios

```css
:root {
  --tq-radius-sm: 10px;
  --tq-radius-md: 14px;
  --tq-radius-lg: 18px;
  --tq-radius-xl: 22px;
}
```

## Sombras

```css
:root {
  --tq-shadow-sm: 0 4px 12px rgba(23, 24, 47, 0.08);
  --tq-shadow-md: 0 10px 28px rgba(23, 24, 47, 0.12);
}
```

## Significado das cores

- **Violeta:** ação principal, foco, seleção e progresso;
- **Verde:** acerto e sucesso;
- **Vermelho:** erro ou ação destrutiva;
- **Amarelo:** revisão e atenção;
- **Azul:** informação e discursiva;
- **Cinza:** estado neutro ou não respondido.

## Regras de uso

- não usar verde no botão Próxima;
- não usar vermelho em navegação comum;
- não usar cor sozinha para comunicar estado;
- botão principal deve possuir contraste adequado;
- sombras devem ser discretas;
- título da marca não deve depender de sombra pesada;
- botões funcionais não devem usar itálico;
- áreas clicáveis devem ter aproximadamente 44 × 44 px;
- foco por teclado deve permanecer visível.

## Ícone e variações necessárias

- ícone principal;
- favicon;
- versão simplificada;
- versão transparente;
- versão monocromática;
- assinatura horizontal com nome e slogan.

## Estado de implementação

Os tokens estão definidos e os layouts oficiais foram aprovados. A aplicação integral da identidade visual será realizada durante a substituição das telas na branch `dev`.
