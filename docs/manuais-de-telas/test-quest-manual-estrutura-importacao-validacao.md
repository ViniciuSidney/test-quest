# Test Quest — Manual de Estrutura da Tela de Importação e Validação

**Versão do documento:** 1.0  
**Aplicação:** Test Quest — *Now I Know.*  
**Layout de referência:** Tela de Importação e Validação v3  
**Escopo:** estrutura visual, funções, elementos, estados, tamanhos, espaçamentos, responsividade, acessibilidade e roteiro de implementação da Tela de Importação e Validação.

---

# 1. Finalidade deste manual

Este documento orienta a criação da Tela de Importação e Validação do Test Quest em HTML e CSS.

Essa tela deve transformar um arquivo TXT ou um bloco de texto em uma sessão de questões pronta para ser resolvida.

Ela precisa organizar quatro responsabilidades:

```text
1. Receber as questões
2. Configurar a sessão
3. Validar o conteúdo
4. Autorizar o início da resolução
```

A implementação deve ser estável, previsível e livre de mudanças bruscas de altura quando mensagens ou erros aparecerem.

---

# 2. Objetivos da Tela de Importação e Validação

A tela deve permitir que o usuário:

- volte para a Tela Inicial;
- altere o tema;
- escolha um arquivo TXT;
- cole questões manualmente;
- visualize o conteúdo importado;
- defina o nome da lista;
- escolha opções da sessão;
- valide o formato;
- visualize contadores;
- identifique erros;
- carregue um exemplo;
- consulte o modelo aceito;
- limpe os campos;
- comece a resolução após validação correta.

A tela não deve:

- mostrar sessão salva;
- mostrar indicadores históricos;
- iniciar automaticamente ao escolher um arquivo;
- permitir começar sem validação;
- alterar sua altura ao mostrar mensagens;
- criar rolagem global no `body`.

---

# 3. Estrutura visual aprovada

A estrutura oficial segue esta composição:

```text
Cabeçalho
├── Voltar
├── Identificação da tela
└── Tema

Área principal
├── Painel de importação
│   ├── Arquivo
│   ├── Textarea
│   └── Contadores
├── Painel de configurações
│   ├── Nome da lista
│   └── Opções
└── Painel de validação
    ├── Estado atual
    └── Mensagens

Barra inferior
├── Exemplo
├── Ver modelo
├── Limpar
├── Validar
└── Começar
```

Representação:

```text
┌──────────────────────────────────────────────────────────────┐
│ [Voltar] Preparar resolução: importe e configure    [Tema]  │
├──────────────────────────────────────┬───────────────────────┤
│ Importar questões                    │ Configurações         │
│                                      │                       │
│ Arquivo TXT                          │ Nome da lista         │
│                                      │ Opções                │
│ Conteúdo              Contadores     ├───────────────────────┤
│ [textarea]             0 Questões    │ Validação             │
│                        0 Objetivas    │ Estado atual          │
│                        0 Discursivas  │ Mensagens             │
│                        0 Assuntos     │                       │
├──────────────────────────────────────┴───────────────────────┤
│ [Exemplo] [Ver modelo] [Limpar]   [Validar] [Começar]      │
└──────────────────────────────────────────────────────────────┘
```

---

# 4. Estrutura recomendada de arquivos

```text
src/styles/
├── components/
│   ├── buttons.css
│   ├── fields.css
│   ├── panels.css
│   ├── counters.css
│   ├── validation.css
│   ├── modal.css
│   └── file-input.css
├── layouts/
│   └── app-shell.css
├── pages/
│   └── import.css
└── main.css
```

JavaScript sugerido futuramente:

```text
src/scripts/features/question-import/
├── question-import.controller.js
├── question-import.parser.js
├── question-import.validator.js
├── question-import.file.js
├── question-import.state.js
└── question-import.storage.js
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

## 5.3 Fundos suaves

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

# 6. Cores semânticas nesta tela

```text
Violeta → ação principal e foco
Azul    → validar e estado informativo
Verde   → importação válida e começar habilitado
Amarelo → conteúdo alterado ou validação pendente
Vermelho → limpar ou erro de validação
Cinza   → estados neutros e desabilitados
```

Regras:

- “Voltar” deve ser neutro;
- “Limpar” pode usar vermelho discreto;
- “Começar” nasce desabilitado;
- “Começar” só recebe destaque quando a validação for válida;
- mensagens não devem depender apenas da cor.

---

# 7. Tipografia

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

Escala recomendada:

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

# 8. Estrutura semântica sugerida

```html
<section id="telaImportacao" class="screen screen--import">
  <header class="import-header">
    <button
      id="btnVoltarInicio"
      class="button button--neutral"
      type="button"
    >
      Voltar
    </button>

    <div class="import-header__text">
      <h1>Preparar resolução</h1>
      <p>Importe as questões e configure sua sessão.</p>
    </div>

    <button
      id="btnTemaImportacao"
      class="button button--neutral"
      type="button"
    >
      Tema
    </button>
  </header>

  <div class="import-layout">
    <section class="panel import-content-panel">
      <!-- arquivo, textarea e contadores -->
    </section>

    <div class="import-side-column">
      <section class="panel import-settings-panel">
        <!-- nome e opções -->
      </section>

      <section class="panel validation-panel">
        <!-- estado e mensagens -->
      </section>
    </div>

    <footer class="panel import-actionbar">
      <!-- ações -->
    </footer>
  </div>
</section>
```

---

# 9. Contêiner da tela

```css
.screen--import {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}
```

---

# 10. Cabeçalho

## 10.1 Elementos

```text
[Voltar] [Preparar resolução: Importe as questões e configure sua sessão.] [Tema]
```

## 10.2 Funções

- Voltar: retorna à Tela Inicial;
- título: identifica a etapa;
- descrição: explica a tarefa;
- Tema: alterna claro/escuro.

## 10.3 Regras

- altura entre `48px` e `58px`;
- Voltar neutro;
- Tema neutro;
- título e descrição separados no HTML;
- em desktop podem aparecer na mesma linha;
- em mobile podem quebrar.

## 10.4 CSS sugerido

```css
.import-header {
  min-height: 52px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.import-header__text {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 16px;
}

.import-header__text h1,
.import-header__text p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

# 11. Layout principal

```css
.import-layout {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(300px, 0.8fr);
  grid-template-rows: minmax(0, 1fr) auto;
  grid-template-areas:
    "content side"
    "actions actions";
  gap: 16px;
}
```

Proporção aproximada:

```text
Painel principal → 68% a 72%
Coluna direita   → 28% a 32%
```

Coluna direita:

```css
.import-side-column {
  min-height: 0;
  display: grid;
  grid-template-rows:
    minmax(0, 1fr)
    minmax(190px, 0.65fr);
  gap: 16px;
}
```

---

# 12. Painel de importação

## 12.1 Função

Receber:

- arquivo TXT;
- conteúdo colado;
- contadores.

## 12.2 Estrutura

```html
<section class="panel import-content-panel">
  <header>
    <h2>Importar questões</h2>
  </header>

  <div class="file-import-block">
    <label for="arquivoQuestoes">
      Escolha um arquivo TXT
    </label>

    <div class="file-import-row">
      <input
        id="arquivoQuestoes"
        type="file"
        accept=".txt,text/plain"
      />

      <span id="nomeArquivoSelecionado">
        Nenhum arquivo selecionado
      </span>
    </div>
  </div>

  <div class="import-content-grid">
    <label class="import-textarea-field">
      <span>Conteúdo das questões</span>
      <textarea id="entradaQuestoes"></textarea>
    </label>

    <aside class="counter-panel">
      <!-- contadores -->
    </aside>
  </div>
</section>
```

---

# 13. Seletor de arquivo

## 13.1 Estado vazio

```text
Nenhum arquivo selecionado
```

## 13.2 Estado preenchido

```text
lista-estatistica.txt
```

## 13.3 Comportamento

Ao escolher arquivo:

1. ler o conteúdo;
2. preencher a textarea;
3. sugerir nome da lista;
4. atualizar contadores preliminares, se desejado;
5. marcar validação como pendente;
6. desabilitar “Começar”;
7. não iniciar automaticamente.

## 13.4 Estilo do botão nativo

```css
input[type="file"]::file-selector-button {
  min-height: 44px;
  padding: 10px 16px;
  border: 0;
  border-radius: var(--tq-radius-md);
  background: var(--tq-primary);
  color: #FFFFFF;
  font-weight: 700;
  cursor: pointer;
}
```

## 13.5 Nome longo do arquivo

```css
#nomeArquivoSelecionado {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Adicionar `title` com o nome completo.

---

# 14. Textarea de importação

## 14.1 Rótulo

```text
Conteúdo das questões
```

## 14.2 Placeholder

```text
Cole aqui as questões no formato aceito...
```

## 14.3 CSS

```css
.import-textarea-field {
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
}

.import-textarea {
  width: 100%;
  height: 100%;
  min-height: 260px;
  resize: none;
  overflow: auto;
  padding: 16px;
  line-height: 1.5;
  scrollbar-gutter: stable;
}
```

## 14.4 Comportamento

Qualquer alteração manual deve:

- invalidar a validação anterior;
- mudar status para pendente;
- desabilitar “Começar”;
- atualizar contadores somente após nova análise, conforme a regra escolhida.

---

# 15. Contadores

## 15.1 Função

Mostrar:

- total de questões;
- objetivas;
- discursivas;
- assuntos únicos.

## 15.2 Estrutura

```html
<aside class="counter-panel">
  <h3>Contadores</h3>

  <dl class="counter-list">
    <div>
      <dt>Questões</dt>
      <dd id="contadorTotal">0</dd>
    </div>

    <div>
      <dt>Objetivas</dt>
      <dd id="contadorObjetivas">0</dd>
    </div>

    <div>
      <dt>Discursivas</dt>
      <dd id="contadorDiscursivas">0</dd>
    </div>

    <div>
      <dt>Assuntos</dt>
      <dd id="contadorAssuntos">0</dd>
    </div>
  </dl>
</aside>
```

## 15.3 CSS

```css
.counter-panel {
  min-width: 180px;
  padding: 16px;
  background: var(--tq-surface-soft);
  border: 1px solid var(--tq-border);
  border-radius: var(--tq-radius-md);
}

.counter-list {
  display: grid;
  gap: 18px;
}

.counter-list > div {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.counter-list dd {
  order: -1;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--tq-primary);
}
```

## 15.4 Estados

### Inicial

```text
0 / 0 / 0 / 0
```

### Conteúdo carregado, não validado

Opções possíveis:

- manter zerado até validar;
- ou exibir contagem preliminar com aviso “prévia”.

Recomendação oficial:

```text
contadores definitivos somente após validação bem-sucedida
```

Isso evita transmitir confiança em dados ainda não confirmados.

---

# 16. Painel de configurações

## 16.1 Elementos

```text
Configurações
Nome da lista
Opções
☐ Embaralhar questões
☑ Mostrar gabarito
```

## 16.2 Nome da lista

Placeholder:

```text
Ex.: Lista de Estatística
```

Regras:

- sugerir nome do arquivo;
- aceitar edição manual;
- limite visual de aproximadamente 80 caracteres;
- “Lista sem nome” apenas como último recurso.

## 16.3 Opções

### Embaralhar questões

Padrão:

```text
desmarcado
```

### Mostrar gabarito

Padrão:

```text
marcado
```

## 16.4 Estrutura

```html
<section class="panel import-settings-panel">
  <h2>Configurações</h2>

  <label class="field">
    <span>Nome da lista</span>
    <input
      id="nomeLista"
      type="text"
      placeholder="Ex.: Lista de Estatística"
    />
  </label>

  <fieldset class="session-options">
    <legend>Opções</legend>

    <label class="option-check">
      <input id="opcaoEmbaralhar" type="checkbox" />
      <span>Embaralhar questões</span>
    </label>

    <label class="option-check">
      <input
        id="opcaoMostrarGabarito"
        type="checkbox"
        checked
      />
      <span>Mostrar gabarito</span>
    </label>
  </fieldset>
</section>
```

## 16.5 Área clicável

```css
.option-check {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
}
```

O texto deve fazer parte do mesmo `label`.

---

# 17. Painel de validação

## 17.1 Função

Mostrar:

- estado atual;
- mensagens;
- erros;
- avisos.

Estrutura:

```text
Validação

Nenhuma validação realizada.
Aguardando conteúdo para análise.
```

## 17.2 Estrutura HTML

```html
<section class="panel validation-panel">
  <h2>Validação</h2>

  <div
    id="statusValidacao"
    class="validation-status validation-status--idle"
    aria-live="polite"
    aria-atomic="true"
  >
    <strong>Nenhuma validação realizada.</strong>
    <span>Aguardando conteúdo para análise.</span>
  </div>

  <div id="mensagensValidacao" class="validation-messages">
  </div>
</section>
```

## 17.3 Altura reservada

O painel deve manter altura estável.

```css
.validation-panel {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 12px;
  padding: 18px;
}
```

## 17.4 Área de mensagens

```css
.validation-messages {
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
  scrollbar-gutter: stable;
}
```

Mensagens devem ficar alinhadas à esquerda.

---

# 18. Estados da validação

## 18.1 Inicial

```text
Nenhuma validação realizada.
Aguardando conteúdo para análise.
```

Classe:

```text
validation-status--idle
```

## 18.2 Pendente

Após carregar ou editar conteúdo:

```text
Conteúdo alterado.
Valide novamente antes de começar.
```

Classe:

```text
validation-status--pending
```

Cor:

```text
amarelo / atenção
```

## 18.3 Validando

```text
Validando importação...
```

Classe:

```text
validation-status--loading
```

Cor:

```text
azul / informação
```

## 18.4 Válida

```text
Importação válida.
Nenhum problema encontrado.
```

Classe:

```text
validation-status--valid
```

Cor:

```text
verde / sucesso
```

## 18.5 Inválida

```text
Importação com problemas.
Revise os itens abaixo.
```

Classe:

```text
validation-status--invalid
```

Cor:

```text
vermelho / perigo
```

---

# 19. Mensagens de erro

## 19.1 Formato

```text
Questão 4: campo “correta” ausente.
Questão 7: alternativa E ausente.
+ 3 problemas encontrados.
```

## 19.2 Regras

- indicar o bloco;
- indicar o campo;
- evitar mensagem genérica;
- mostrar primeiros erros;
- resumir erros extras;
- permitir rolagem interna.

## 19.3 Estrutura

```html
<ul class="validation-error-list">
  <li>Questão 4: campo “correta” ausente.</li>
  <li>Questão 7: alternativa E ausente.</li>
</ul>
```

---

# 20. Barra inferior de ações

## 20.1 Estrutura aprovada

```text
Grupo esquerdo:
[Exemplo] [Ver modelo] [Limpar]

Grupo direito:
[Validar] [Começar]
```

## 20.2 HTML

```html
<footer class="panel import-actionbar">
  <div class="import-actions__support">
    <button id="btnExemplo" class="button button--secondary">
      Exemplo
    </button>

    <button id="btnVerModelo" class="button button--neutral">
      Ver modelo
    </button>

    <button id="btnLimpar" class="button button--danger-soft">
      Limpar
    </button>
  </div>

  <div class="import-actions__flow">
    <button id="btnValidar" class="button button--info">
      Validar
    </button>

    <button
      id="btnComecar"
      class="button button--primary"
      disabled
    >
      Começar
    </button>
  </div>
</footer>
```

## 20.3 CSS

```css
.import-actionbar {
  grid-area: actions;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
}

.import-actions__support,
.import-actions__flow {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

---

# 21. Regras dos botões

## Exemplo

Ao clicar:

- preencher textarea;
- preencher nome da lista;
- marcar validação como pendente;
- desabilitar “Começar”.

## Ver modelo

Ao clicar:

- abrir modal;
- não alterar dados;
- devolver foco ao fechar.

## Limpar

Ao clicar:

- confirmar se houver conteúdo;
- limpar arquivo;
- limpar textarea;
- limpar nome;
- restaurar opções padrão;
- zerar contadores;
- restaurar estado inicial;
- desabilitar “Começar”.

## Validar

Só deve funcionar quando houver conteúdo.

Durante validação:

```text
Validando...
```

Pode bloquear ações conflitantes.

## Começar

Estado inicial:

```text
desabilitado
```

Estado válido:

```text
habilitado
```

Ao clicar:

1. criar IDs;
2. aplicar embaralhamento;
3. criar sessão;
4. salvar no `localStorage`;
5. registrar horário;
6. abrir primeira questão.

---

# 22. Modal “Ver modelo”

## 22.1 Função

Mostrar:

- questão objetiva;
- questão discursiva;
- campos obrigatórios;
- separador `+++`.

## 22.2 Estrutura

```html
<div class="modal hidden" role="dialog" aria-modal="true">
  <button class="modal__backdrop" aria-label="Fechar modal"></button>

  <section class="modal__card">
    <header class="modal__header">
      <h2>Modelo aceito pela aplicação</h2>
      <button id="btnFecharModelo">Fechar</button>
    </header>

    <div class="modal__content">
      <pre><code>...</code></pre>
    </div>
  </section>
</div>
```

## 22.3 Fechamento

- botão;
- fundo;
- tecla `Escape`.

Ao fechar:

```text
foco retorna ao botão “Ver modelo”
```

---

# 23. Modelo aceito

## Objetiva

```text
@questao
assunto: Nome do assunto
tipo: objetiva
enunciado: Texto do enunciado
a: Alternativa A
b: Alternativa B
c: Alternativa C
d: Alternativa D
e: Alternativa E
correta: B
explicacao: Explicação
+++
```

## Discursiva

```text
@discursiva
assunto: Nome do assunto
tipo: discursiva curta
enunciado: Texto da pergunta
resposta_esperada: Resposta modelo
criterios_de_correcao: Critérios
+++
```

---

# 24. Modelo de estado sugerido

```js
const importState = {
  arquivoNome: "",
  conteudo: "",
  nomeLista: "",

  opcoes: {
    embaralhar: false,
    mostrarGabarito: true
  },

  validacao: {
    status: "idle",
    total: 0,
    objetivas: 0,
    discursivas: 0,
    assuntos: 0,
    erros: []
  }
};
```

Status possíveis:

```text
idle
pending
loading
valid
invalid
```

---

# 25. Regras de invalidação

A validação anterior deve ser invalidada quando:

- textarea mudar;
- novo arquivo for escolhido;
- conteúdo for limpo;
- exemplo for carregado;
- parser ou formato relevante mudar.

Mensagem:

```text
Conteúdo alterado. Valide novamente.
```

O nome da lista e opções que não alteram o parser não precisam necessariamente invalidar a estrutura, mas devem ser salvos antes de iniciar.

---

# 26. Responsividade

## 26.1 Desktop

Manter:

```text
Painel principal + coluna direita
Barra inferior
```

## 26.2 Tablet

Abaixo de `1000px`:

- reduzir largura da coluna direita;
- manter duas colunas enquanto confortável;
- diminuir paddings.

```css
@media (max-width: 1000px) {
  .import-layout {
    grid-template-columns:
      minmax(0, 1.6fr)
      minmax(280px, 0.9fr);
    gap: 12px;
  }
}
```

## 26.3 Mobile

Abaixo de `720px`:

```text
Cabeçalho
Importação
Configurações
Validação
Barra de ações
```

```css
@media (max-width: 720px) {
  .screen--import {
    overflow: auto;
  }

  .import-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "content"
      "side"
      "actions";
    overflow: visible;
  }

  .import-side-column {
    grid-template-rows: auto;
  }

  .import-actionbar {
    display: grid;
    grid-template-columns: 1fr;
  }

  .import-actions__support,
  .import-actions__flow {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

O botão “Começar” pode ocupar largura completa.

---

# 27. Dimensões recomendadas

## Cabeçalho

```text
48px a 58px
```

## Barra inferior

```text
64px a 76px
```

## Botões

```text
mínimo de 44px
```

## Textarea

```text
mínimo de 260px
```

## Contadores

```text
largura entre 170px e 220px
```

## Painel de validação

```text
mínimo de 190px
```

---

# 28. Espaçamentos

## Entre painéis

```text
12px a 16px
```

## Padding principal

```text
18px a 24px
```

## Entre campo e label

```text
8px
```

## Entre ações

```text
10px a 14px
```

## Entre contadores

```text
16px a 20px
```

---

# 29. Acessibilidade

## Arquivo

O input deve possuir label.

## Textarea

Associar label corretamente.

## Checkboxes

Texto dentro do mesmo `label`.

## Validação

Usar:

```html
aria-live="polite"
```

Erros críticos podem usar:

```html
role="alert"
```

## Modal

- `role="dialog"`;
- `aria-modal="true"`;
- foco preso dentro;
- foco restaurado ao fechar.

## Botão Começar

O estado desabilitado deve ser real:

```html
disabled
```

Não apenas visual.

---

# 30. Ajustes extras obrigatórios

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

## Texto truncado

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

Usar somente quando o conteúdo completo estiver acessível.

---

# 31. Ordem de implementação

## Etapa 1 — Base

1. tela;
2. cabeçalho;
3. grade principal;
4. barra inferior.

## Etapa 2 — Importação

1. título;
2. input de arquivo;
3. nome do arquivo;
4. textarea;
5. contadores.

## Etapa 3 — Configurações

1. nome da lista;
2. checkboxes;
3. estados padrão.

## Etapa 4 — Validação

1. estado inicial;
2. pendente;
3. carregando;
4. válido;
5. inválido;
6. lista de erros.

## Etapa 5 — Ações

1. exemplo;
2. modelo;
3. limpar;
4. validar;
5. começar.

## Etapa 6 — Modal

1. estrutura;
2. conteúdo;
3. foco;
4. fechamento.

## Etapa 7 — JavaScript

1. leitura do arquivo;
2. parser;
3. validação;
4. contadores;
5. estado;
6. criação da sessão.

## Etapa 8 — Testes

1. desktop;
2. tablet;
3. mobile;
4. textos longos;
5. muitos erros;
6. tema claro;
7. tema escuro;
8. teclado.

---

# 32. Checklist — Estrutura

- [ ] Cabeçalho está estável.
- [ ] Painel principal possui espaço suficiente.
- [ ] Coluna direita não comprime o conteúdo.
- [ ] Barra de ações permanece visível.
- [ ] Mensagens não alteram altura.
- [ ] Página não cria rolagem global.
- [ ] Tema claro e escuro funcionam.

---

# 33. Checklist — Arquivo e conteúdo

- [ ] Arquivo TXT pode ser escolhido.
- [ ] Nome aparece.
- [ ] Conteúdo é carregado.
- [ ] Nome da lista é sugerido.
- [ ] Textarea pode ser editada.
- [ ] Edição invalida validação.
- [ ] Rolagem interna funciona.
- [ ] Textos longos não quebram layout.

---

# 34. Checklist — Configurações

- [ ] Nome pode ser editado.
- [ ] Embaralhar começa desmarcado.
- [ ] Mostrar gabarito começa marcado.
- [ ] Labels são clicáveis.
- [ ] Valores são preservados ao iniciar.

---

# 35. Checklist — Validação

- [ ] Estado inicial correto.
- [ ] Estado pendente correto.
- [ ] Estado validando correto.
- [ ] Estado válido correto.
- [ ] Estado inválido correto.
- [ ] Contadores corretos.
- [ ] Erros indicam questão e campo.
- [ ] Lista de erros rola internamente.
- [ ] Começar só habilita quando válido.

---

# 36. Checklist — Ações

- [ ] Exemplo preenche dados.
- [ ] Exemplo invalida validação anterior.
- [ ] Ver modelo abre modal.
- [ ] Modal fecha por botão.
- [ ] Modal fecha pelo fundo.
- [ ] Modal fecha com `Escape`.
- [ ] Limpar pede confirmação.
- [ ] Validar funciona.
- [ ] Começar cria a sessão.

---

# 37. Decisão estrutural final

A Tela de Importação e Validação v3 é considerada a referência oficial.

Estrutura aprovada:

```text
Cabeçalho
├── Voltar
├── Título e descrição
└── Tema

Corpo
├── Importação
│   ├── Arquivo
│   ├── Textarea
│   └── Contadores
└── Lateral
    ├── Configurações
    └── Validação

Rodapé
├── Ações auxiliares
└── Ações de fluxo
```

Estados oficiais:

```text
Inicial
Pendente
Validando
Válida
Inválida
```

---

# 38. Próximo passo

Após este manual:

1. planejar a Tela de Resultado Final;
2. aprovar seu layout;
3. criar o manual da Tela de Resultado;
4. revisar os modais;
5. implementar as telas em HTML e CSS;
6. integrar a lógica gradualmente.
