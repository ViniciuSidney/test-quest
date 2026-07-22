# Testes

## Informações

**Projeto:** Test Quest  
**Base:** v0.2.5-dev  
**Fase:** implementação das telas oficiais  
**Status geral:** Ok

## Legenda

- `Ok`
- `OK`
- `Falhou`
- `Bloqueado`

---



## Pré-validação técnica — Rolagem interna da Resolução — 2026-07-22

Foram verificadas as seguintes condições:

- área de resposta com `overflow-y: auto` em larguras a partir de 981 px;
- barra de ações separada e sempre abaixo do painel da questão;
- alternativas, correção e metacognição sem sobreposição;
- rolagem interna alcançando o fim do bloco de Metacognição;
- rolagem geral preservada em tablet e mobile;
- cenários equivalentes a 100%, 110% e 125% de zoom;
- 34 arquivos de teste automatizado concluídos com sucesso.

Teste estrutural adicionado:

```bash
node tests/resolution-internal-scroll.test.mjs
```

---

## Pré-validação técnica da Importação — 2026-07-15

Foram executados testes automatizados antes da entrega do pacote:

- parser com lista objetiva e discursiva válida;
- coleta de múltiplos erros;
- exemplo interno;
- arquivo TXT;
- estados inicial, Ok, válido e inválido;
- invalidação após edição;
- botão Começar bloqueado e habilitado;
- criação da sessão;
- modal aberto e fechado com `Escape`;
- restauração de foco;
- tema claro e escuro;
- desktop, tablet e mobile;
- ausência de IDs duplicados;
- console sem erros durante o fluxo testado.

Teste unitário disponível:

```bash
node tests/import-parser.test.mjs
```

Os testes manuais da tabela continuam necessários no computador do usuário antes do commit definitivo.

---


## Pré-validação técnica da Resolução — 2026-07-15

Foram executadas verificações automatizadas antes da entrega do pacote:

- sintaxe de todos os módulos JavaScript;
- IDs obrigatórios e ausência de IDs duplicados;
- importação do novo CSS da Resolução;
- ciclo dos marcadores `neutro → analise → eliminada → neutro`;
- normalização de estados legados em inglês;
- separação entre resposta oficial e marcação auxiliar;
- rótulos acessíveis do mapa;
- estado respondido de objetivas e discursivas;
- persistência do estado pausado do temporizador;
- confirmação de finalização com resumo da sessão;
- composição visual estática em desktop, tablet e mobile;
- versões objetiva e discursiva sem sobreposição estrutural.

Testes disponíveis:

```bash
node tests/resolution-state.test.mjs
node tests/resolution-structure.test.mjs
```

Os testes manuais da tabela continuam necessários no navegador antes do commit definitivo.

---

# Carregamento e estrutura

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T01 | Abrir por Live Server | Aplicação carrega sem erro de módulo | Ok |
| T02 | Console inicial | Nenhum erro crítico | Ok |
| T03 | Recarregar página | Estado e tema são restaurados | Ok |
| T04 | Estrutura Git | `main` e `dev` sincronizadas com remotos | Ok |

# Tela Inicial

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T05 | Primeiro acesso | Bloco de continuar fica oculto | Ok |
| T06 | Nova resolução | Abre Importação e Validação | Ok |
| T07 | Sessão ativa | Nome, progresso e tempo aparecem | Ok |
| T08 | Continuar resolução | Restaura a sessão | Ok |
| T09 | Nova sessão com ativa | Exibe confirmação | Ok |
| T10 | Indicadores históricos | Valores consideram sessões concluídas | Ok |
| T11 | Sessão ativa no histórico | Não é contabilizada | Ok |
| T12 | Nome longo | Não transborda | Ok |

# Importação e Validação

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T13 | Carregar exemplo | Conteúdo e nome são preenchidos | Ok |
| T14 | Selecionar TXT | Conteúdo aparece na textarea | Ok |
| T15 | Nome do arquivo | Nome é exibido sem transbordar | Ok |
| T16 | Validar lista correta | Contadores e sucesso aparecem | Ok |
| T17 | Lista inválida | Erros indicam bloco e campo | Ok |
| T18 | Editar após validar | Estado volta a Ok | Ok |
| T19 | Botão Começar inválido | Permanece desabilitado | Ok |
| T20 | Botão Começar válido | Cria a sessão | Ok |
| T21 | Limpar | Restaura o estado inicial | Ok |
| T22 | Modal do modelo | Abre e fecha por todos os meios | Ok |
| T22.1 | Ações abaixo de 820px | Todos os botões permanecem dentro do painel | Ok |
| T22.2 | Cabeçalho fixo abaixo de 820px | Permanece destacado e legível durante a rolagem | Ok |

# Resolução comum

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T23 | Primeira questão | Dados corretos aparecem | Ok |
| T24 | Navegar pelo mapa | Questão correta é aberta | Ok |
| T25 | Anterior na primeira | Botão desabilitado | Ok |
| T26 | Próxima na última | É substituída por Finalizar | Ok |
| T27 | Marcar revisão | Botão, selo e mapa atualizam | Ok |
| T28 | Anotações | Persistem por questão | Ok |
| T29 | Restaurar sessão | Estado completo é recuperado | Ok |

# Objetivas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T30 | Selecionar card | Define resposta oficial | Ok |
| T31 | Seleção única | Apenas uma resposta permanece | Ok |
| T32 | Marcador em análise | Não altera resposta oficial | Ok |
| T33 | Marcador eliminada | Estado é salvo | Ok |
| T34 | Ciclo do marcador | Alterna conforme regra | Ok |
| T35 | Restaurar marcações | Estados reaparecem | Ok |
| T36 | Texto longo | Cards não transbordam | Ok |

# Discursivas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T37 | Digitar resposta | Texto é salvo | Ok |
| T38 | Quebras de linha | São preservadas | Ok |
| T39 | Trocar questão | Resposta permanece | Ok |
| T40 | Campo longo | Rolagem interna funciona | Ok |

# Temporizador

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T41 | Tempo por questão | Valor correto é associado | Ok |
| T42 | Tempo total | Soma os mesmos segundos inteiros exibidos por questão | Ok |
| T42.1 | Frações de segundo | Não produzem diferença entre a soma visível e o total | Ok |
| T42.2 | Tempos órfãos | IDs fora da sessão atual não entram no total | Ok |
| T43 | Pausar | Tempo deixa de aumentar | Ok |
| T44 | Retomar | Contagem continua | Ok |
| T45 | Voltar ao início | Tempo para | Ok |
| T46 | Aba oculta | Intervalo não é somado | Ok |
| T47 | Resultado aberto | Tempo não aumenta | Ok |
| T48 | Recarregar | Tempos são restaurados | Ok |

# Finalização

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T49 | Finalizar com pendências | Confirmação exibe resumo em lista | Ok |
| T49.1 | Finalizar sem pendências | Lista exibe respondidas, zero Oks e revisão | Ok |

# Tela de Desempenho

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T49.2 | Finalizar com objetivas | Abre a Tela de Desempenho antes do Resultado Final | Ok |
| T49.3 | Estado 100% | Exibe Perfeito, texto e botão corretos | Ok |
| T49.4 | Estado 90–99% | Exibe Excelente | Ok |
| T49.5 | Estado 75–89% | Exibe Muito bom | Ok |
| T49.6 | Estado 60–74% | Exibe Bom resultado e Tudo bem | Ok |
| T49.7 | Estado 50–59% | Exibe Pode melhorar | Ok |
| T49.8 | Estado 0–49% | Exibe Hora de revisar | Ok |
| T49.9 | CTA de desempenho | Abre o Resultado Final | Ok |
| T49.10 | Somente discursivas | Pula a Tela de Desempenho | Ok |
| T49.11 | Responsividade | Percentual e textos não transbordam | Ok |
| T49.12 | Backdrop translúcido | Resultado Final permanece perceptível ao fundo, sem painéis falsos | Ok |
| T49.13 | Entrada animada | Backdrop, card, percentual e textos entram suavemente | Ok |
| T49.14 | Saída animada | CTA remove o overlay e revela o Resultado Final | Ok |
| T49.15 | Movimento reduzido | Animações são removidas quando solicitado pelo sistema | Ok |
| T49.16 | Foco do overlay | Navegação por Tab permanece no CTA enquanto a tela está aberta | Ok |
| T49.17 | Fade In do desempenho | Overlay surge suavemente após confirmar a finalização | Ok |
| T49.18 | Fade Out do desempenho | CTA remove o overlay suavemente antes de revelar o resultado | Ok |
| T49.19 | Aura giratória | Brilho circular gira atrás da porcentagem sem prejudicar a leitura | Ok |

# Resultado Final

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T50 | Resultado geral | Indicadores corretos | Ok |
| T51 | Somente discursivas | Desempenho mostra indisponível | Ok |
| T52 | Por assunto | Acertos e tempos corretos | Ok |
| T53 | Assunto sem objetiva | Não mostra 0% | Ok |
| T54 | Filtro Todas | Exibe todos os cards | Ok |
| T55 | Filtro Erradas | Exibe somente incorretas | Ok |
| T56 | Filtro Discursivas | Exibe discursivas | Ok |
| T57 | Filtro Revisão | Exibe marcadas | Ok |
| T58 | Filtro Não respondidas | Exibe Oks | Ok |
| T59 | Filtro vazio | Exibe estado vazio | Ok |
| T60 | Expandir card | Ocupa largura total | Ok |
| T61 | Expandir outro card | Fecha o anterior | Ok |
| T62 | Objetiva expandida | Mostra gabarito e explicação | Ok |
| T63 | Discursiva expandida | Mostra resposta e critérios | Ok |
| T64 | Não respondida | Não é chamada de incorreta | Ok |
| T64.1 | Apenas um card expandido | Abrir outro fecha o anterior | Ok |
| T64.2 | Gabarito oculto | Explicações, modelos e critérios permanecem ocultos | Ok |
| T64.3 | Foco após expansão | Foco permanece no controle do card atualizado | Ok |
| T64.4 | Estado de revisão combinado | Marcada pode coexistir com correta, incorreta, discursiva ou Ok | Ok |
| T64.5 | Cabeçalho e rodapé | As duas ações de Início encerram o mesmo fluxo | Ok |
| T64.6 | Cabeçalho legado | A identidade antiga não aparece na Tela de Resultado Final | Ok |
| T64.7 | Fluxo do card expandido | Cards seguintes permanecem abaixo do card aberto, sem sobreposição | Ok |
| T64.8 | Conteúdo em janela baixa | Indicadores e textos permanecem contidos ou usam rolagem interna | Ok |
| T64.9 | Barra de ações mobile | Todos os quatro botões permanecem dentro do painel visual | Ok |

# Exportações

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T65 | Exportar respostas | TXT válido é baixado | Ok |
| T66 | Exportar anotações | TXT separado é baixado | Ok |
| T67 | Exportar sessão | JSON válido é baixado | Ok |
| T68 | Acentuação | Caracteres são preservados | Ok |
| T69 | Estado após exportar | Não é alterado | Ok |

# Visual e responsividade

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T70 | Desktop | Sem rolagem global | Ok |
| T71 | Tela baixa | Áreas internas continuam utilizáveis | Ok |
| T72 | Tablet | Layout adapta sem compressão excessiva | Ok |
| T73 | Mobile | Tela ativa usa rolagem interna | Ok |
| T74 | Tema claro | Contraste adequado | Ok |
| T75 | Tema escuro | Contraste adequado | Ok |
| T76 | Foco de teclado | Visível em controles | Ok |
| T77 | Redução de movimento | Preferência é respeitada | Ok |
| T78 | Texto longo | Não causa transbordamento | Ok |

## Regra para fechamento

A versão não pode ser enviada à `main` como estável enquanto houver:

- perda de respostas, anotações, tempos ou marcações;
- temporizador contando fora da resolução;
- importação inválida aceita;
- filtros incorretos;
- exportações inválidas;
- sobreposição de controles;
- erro de módulo;
- regressão grave de acessibilidade.


# Tela de Desempenho — legibilidade do placar

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T79 | Fonte digital monoespaçada | Percentual e `%` usam a pilha monoespaçada sem oscilar de largura durante a contagem | Ok |
| T80 | Base do cálculo | A tela informa corretamente acertos e total de questões objetivas | Ok |
| T81 | Singular e plural | `1 acerto em 1 questão objetiva` e demais variações são exibidas corretamente | Ok |

# App Shell global

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T79 | Viewport 1920 × 1080 | A aplicação utiliza quase toda a largura, com margens controladas | Ok |
| T80 | Viewport 1600 × 900 | Painéis permanecem proporcionais e legíveis | Ok |
| T81 | Viewport 1366 × 768 | Nenhum painel é comprimido ou sobreposto | Ok |
| T82 | Zoom 125% e 150% | Os breakpoints continuam estáveis | Ok |
| T83 | Monitor ultrawide | A largura para em 1880px e não espalha excessivamente o conteúdo | Ok |
| T84 | Mobile 360–390px | O empilhamento existente é preservado | Ok |

# Ajustes dos cards do Resultado Final

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T85 | Exemplo interno | O botão `Carregar exemplo` insere a lista de Gramática em Português | Ok |
| T86 | Arquivo de exemplo público | `public/examples/exemplo-questoes.txt` usa a mesma lista de Gramática | Ok |
| T87 | Resultado Geral | O bloco usa 3 cards por linha em desktop largo, reduzindo para 2 quando necessário | Ok |
| T88 | Card objetivo expandido | Enunciado, explicação e anotação mantêm altura visual estável com rolagem interna quando o texto excede o espaço | Ok |
| T89 | Card discursivo expandido | Enunciado, resposta, resposta esperada, critérios e anotações mantêm altura visual estável com rolagem interna quando necessário | Ok |


# Resultado Final — ações mobile e discursivas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T90 | Toggle de ações no mobile | Em até 720px, as três exportações ficam recolhidas em `Ações da sessão` | Ok |
| T91 | Navegação por teclado | Exportações recolhidas não recebem foco; abertas voltam a ser acessíveis | Ok |
| T92 | Desktop | Exportações permanecem visíveis sem depender do toggle | Ok |
| T93 | Card discursivo desktop | Enunciado e tempo ocupam a primeira linha; resposta e modelo, a segunda; critérios e anotações, a terceira | Ok |
| T94 | Card discursivo mobile | Todos os blocos ficam em uma única coluna e na ordem correta | Ok |

# Resultado Final — filtros compactos e desempenho responsivo

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T95 | Tempo discursivo | O conteúdo de `Tempo utilizado` fica alinhado ao topo, como os demais blocos da primeira linha | Ok |
| T96 | Ações acima de 720px | O toggle `Ações da sessão` permanece oculto e as exportações ficam visíveis diretamente | Ok |
| T97 | Ações até 720px | O toggle aparece recolhido e controla somente as exportações | Ok |
| T98 | Filtros até 900px | O toggle compacto informa o filtro ativo e inicia recolhido | Ok |
| T99 | Filtros e teclado | Filtros recolhidos não recebem foco; abertos voltam a ser acessíveis | Ok |
| T100 | Desempenho em 100% de zoom | O card inteiro, incluindo o CTA, permanece dentro da viewport | Ok |
| T101 | Viewport dinâmica | Alterações de altura e barras do navegador não empurram o card de desempenho para fora da tela | Ok |


# v0.4 — Persistência e migração

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| V04-T01 | Normalização de sessão legada | Estado recebe esquema 3 e preserva dados compatíveis | OK |
| V04-T02 | IDs duplicados ou ausentes | Questões recebem identificadores válidos sem interromper a sessão | OK |
| V04-T03 | Mapas órfãos | Respostas, notas, tempos e revisão fora da lista são descartados | OK |
| V04-T04 | Migração da chave legada | Sessão é salva em `testQuest.state` e a carga anterior recebe backup | OK |
| V04-T05 | JSON atual corrompido | Carga é isolada e uma sessão legada válida pode ser recuperada | OK |
| V04-T06 | Configurações legadas | Tema é migrado para `testQuest.settings` | OK |
| V04-T07 | Histórico duplicado | Apenas a entrada concluída mais recente por ID permanece | OK |
| V04-T08 | Acesso do controlador | Controlador principal não usa `localStorage` diretamente | OK |
| V04-T09 | Migração real pelo navegador | Sessão criada na v0.3 continua disponível após atualizar para a v0.4 | OK |
| V04-T10 | Recarregamento após migração | A sessão utiliza somente a chave atual sem duplicação | OK |
| V04-T11 | Apagar sessão migrada | Chaves atual e legada são removidas e a sessão não reaparece | OK |


# v0.4 — Modularização complementar

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| V04-T12 | Ciclo de vida | Criação, restauração, identificação e finalização preservam o esquema da sessão | OK |
| V04-T13 | Cálculo centralizado | Resultado geral e tempo total usam o serviço de resultados | OK |
| V04-T14 | Formatadores | Tempo, duração histórica, datas, HTML e nomes de arquivo mantêm o formato esperado | OK |
| V04-T15 | Exportação de respostas | Relatório mantém resumo, respostas, gabarito e explicações | OK |
| V04-T16 | Exportação de anotações | Relatório mantém tempos, revisão e anotações por questão | OK |
| V04-T17 | Exportação JSON | Conteúdo preserva o estado versionado completo | OK |
| V04-T18 | Confirmações | Mensagens e resumo da finalização são produzidos fora do controlador visual | OK |
| V04-T19 | Estrutura modular | Controlador não contém cálculos, relatórios, formatadores ou geração de IDs extraídos | OK |
| V04-T20 | Regressão manual dos arquivos | Os três botões baixam arquivos válidos pelo navegador | OK |
| V04-T21 | Regressão manual da sessão | Criar, recarregar, continuar e finalizar mantém o mesmo comportamento visual | OK |


# v0.4 — Confiabilidade e Release Candidate

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| V04-T22 | Armazenamento bloqueado | A aplicação classifica a falha sem interromper a inicialização | OK |
| V04-T23 | Cota esgotada | A sessão continua em memória e a falha recebe código específico | OK |
| V04-T24 | Migração sem espaço | A chave legada permanece intacta quando a nova gravação falha | OK |
| V04-T25 | Serialização inválida | Estruturas cíclicas são rejeitadas sem quebrar a aplicação | OK |
| V04-T26 | Aviso de persistência | Mensagens variam entre armazenamento cheio, indisponível e erro desconhecido | OK |
| V04-T27 | Proteção de saída | O fechamento só é protegido quando há sessão e persistência em risco | OK |
| V04-T28 | Fluxo integrado completo | Importação, sessão, recarga simulada, resultado, histórico e exportações permanecem coerentes | OK |
| V04-T29 | Estrutura de release | Cinco telas e controles de recuperação permanecem presentes | OK |
| V04-T30 | Regressão manual final | Fluxo completo funciona no navegador em desktop e mobile | OK |
| V04-T31 | Aviso visual real | Simulação no DevTools mostra o aviso sem bloquear a interface | OK |
| V04-T32 | Recuperação real | Após restabelecer o armazenamento, `Tentar novamente` salva e remove o aviso | OK |


# v0.5 — Fundação de alternativas e respostas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| V05-T01 | Conversão das alternativas | Questões antigas recebem cinco objetos com IDs estáveis | OK |
| V05-T02 | Determinismo dos IDs | A mesma questão produz os mesmos IDs durante a migração | OK |
| V05-T03 | Gabarito canônico | `respostaCorretaId` aponta para uma alternativa existente | OK |
| V05-T04 | Migração da resposta | Respostas antigas em letras são convertidas para IDs | OK |
| V05-T05 | Migração dos marcadores | Marcações antigas por letra passam a usar IDs | OK |
| V05-T06 | Correção após reordenação | A resposta permanece correta mesmo quando a alternativa muda de posição visual | OK |
| V05-T07 | Letras visíveis | Interface, resultado e TXT continuam apresentando letras legíveis | OK |
| V05-T08 | Exportação JSON | Sessão exportada registra `schemaVersion: 4` e respostas por ID | OK |
| V05-T09 | Fluxo completo | Importar, salvar, restaurar, finalizar e exportar mantém os dados coerentes | OK |
| V05-T10 | Regressão automatizada | Os 26 arquivos da suíte terminam sem falhas | OK |
| V05-T11 | Migração real no navegador | Uma sessão ativa da v0.4 reaparece com resposta e marcadores preservados | Pendente |
| V05-T12 | Regressão visual | As cinco telas permanecem visualmente iguais à v0.4 | Pendente |


# v0.5 — Embaralhamento de alternativas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| V05-T13 | Opção de sessão | A Importação oferece `Embaralhar alternativas` separadamente de `Embaralhar questões` | OK |
| V05-T14 | Ordem alterada | Uma sessão nova com a opção ativa recebe ordem diferente da importada | OK |
| V05-T15 | IDs preservados | O embaralhamento não modifica os IDs nem o `respostaCorretaId` | OK |
| V05-T16 | Correção automática | Uma alternativa correta continua correta em qualquer posição visual | OK |
| V05-T17 | Marcadores auxiliares | Estados em análise e eliminada continuam ligados à alternativa certa | OK |
| V05-T18 | Restauração | A mesma ordem reaparece depois de salvar e restaurar a sessão | OK |
| V05-T19 | Nova sessão | Uma nova sessão pode gerar outra ordem sem modificar a sessão anterior | OK |
| V05-T20 | Resultado Final | Letra visual e texto da resposta aparecem corretamente no card expandido | OK |
| V05-T21 | Relatório TXT | Resposta e gabarito usam letra visual atual acompanhada do texto | OK |
| V05-T22 | Opção desativada | A ordem importada é preservada quando o embaralhamento está desligado | OK |
| V05-T23 | Regressão automatizada | Os 28 arquivos da suíte terminam sem falhas | OK |
| V05-T24 | Teste real no navegador | Responder, marcar, recarregar e finalizar mantém alternativa e gabarito corretos | Pendente |
| V05-T25 | Combinação das opções | Embaralhar questões e alternativas simultaneamente mantém o fluxo correto | OK |

# v0.5 — Verdadeiro ou Falso

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T-VF-01 | Importar `correta: V` | Questão aceita e gabarito associado a Verdadeiro | Automatizado — OK |
| T-VF-02 | Importar `correta: F` | Questão aceita e gabarito associado a Falso | Automatizado — OK |
| T-VF-03 | Embaralhar alternativas | Questão V/F mantém a ordem Verdadeiro → Falso | Automatizado — OK |
| T-VF-04 | Responder e recarregar | Escolha permanece salva após restauração | Pendente manual |
| T-VF-05 | Resultado correto | Card V/F mostra acerto, gabarito, explicação e tempo | Pendente manual |
| T-VF-06 | Resultado incorreto | Card V/F diferencia resposta escolhida e correta | Pendente manual |
| T-VF-07 | Guia de importação | Os três formatos aparecem separados e legíveis | Pendente manual |
| T-VF-08 | Mobile | Escolhas empilham sem extrapolação horizontal | Pendente manual |


# v0.5 — Etapa 4: gabarito imediato

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T90 | Modo final | A resolução mantém o comportamento anterior e não exibe o botão de confirmação | Automatizado OK |
| T91 | Modo imediato objetivo | Confirmar bloqueia a alternativa e revela acerto, gabarito e explicação | Automatizado OK |
| T92 | Modo imediato V/F | Confirmar preserva a ordem V → F e revela a correção | Automatizado OK |
| T93 | Modo imediato discursivo | Confirmar bloqueia o texto e mostra resposta esperada e critérios | Automatizado OK |
| T94 | Persistência | Recarregar mantém respostas confirmadas e o painel de correção | Automatizado OK |
| T95 | Migração | Sessões antigas recebem `modoCorrecao: final` e `confirmacoes: {}` | Automatizado OK |
| T96 | Encerramento | O modal informa a quantidade de questões sem confirmação imediata | Automatizado OK |
| T97 | Regressão | Embaralhamento, resultado, exportações e histórico continuam funcionando | Automatizado OK |

A suíte contém 34 arquivos de teste automatizado até a conclusão da Etapa 4.


# v0.5 — Etapa 5: refazer questões erradas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T102 | Objetiva incorreta | Questão entra na nova sessão | Automatizado OK |
| T103 | Verdadeiro ou Falso incorreta | Questão entra mantendo o modelo V/F | Automatizado OK |
| T104 | Objetiva não respondida | Questão não entra automaticamente | Automatizado OK |
| T105 | Discursiva incorreta em 0% | Questão entra na revisão | Automatizado OK |
| T106 | Discursiva parcial ou completa | Questão não entra automaticamente | Automatizado OK |
| T107 | Sessão original | Dados da sessão concluída não são modificados | Automatizado OK |
| T108 | Nova tentativa | Respostas, tempos, confirmações, revisão, marcadores, anotações e metacognição começam vazios | Automatizado OK |
| T109 | Configurações | Embaralhamento e modo de correção são preservados | Automatizado OK |
| T110 | Resultado sem erros | O botão de revisão permanece oculto | Estrutural OK |
| T111 | Filtro Erradas | Objetivas incorretas e discursivas em 0% aparecem juntas | Automatizado OK |
| T112 | Histórico | A nova tentativa recebe ID próprio e pode ser registrada separadamente | Automatizado OK |
| T113 | Regressão automatizada | Os 36 arquivos da suíte terminam sem falhas | Automatizado OK |
| T114 | Fluxo real no navegador | Finalizar, iniciar revisão e concluir nova tentativa mantém o histórico coerente | Pendente manual |

A suíte contém 36 arquivos de teste automatizado.
