# Fluxos e Telas

## Mapa oficial de navegação

```text
Tela Inicial
├── Iniciar nova resolução → Importação e Validação
└── Continuar resolução → Resolução

Importação e Validação
├── Voltar → Tela Inicial
├── Validar conteúdo
└── Começar → Resolução

Resolução
├── Voltar ao início → Tela Inicial
├── Navegar entre questões
└── Finalizar → Tela de Desempenho

Tela de Desempenho
└── Continuar → Resultado Final

Resultado Final
├── Revisar e exportar
└── Voltar ao início → Tela Inicial
```

---

# Tela 1 — Inicial

## Objetivo

Apresentar a identidade do Test Quest, permitir iniciar ou continuar uma sessão e mostrar indicadores históricos.

## Elementos

- marca Test Quest;
- slogan `Now I Know.`;
- mensagem central;
- botão de tema;
- botão para continuar resolução;
- nome e progresso da sessão ativa;
- botão para iniciar nova resolução;
- indicadores de questões respondidas;
- taxa média de acertos;
- tempo total de estudo;
- sessões concluídas;
- rodapé de autoria.

## Estados

- primeiro acesso;
- sem sessão ativa;
- com sessão ativa;
- com histórico;
- com sessão e histórico;
- carregando dados;
- erro de leitura local.

## Regras

- o bloco de continuação só aparece quando existir sessão;
- a sessão ativa não entra nos indicadores históricos;
- iniciar nova sessão com uma ativa exige confirmação.

---

# Tela 2 — Importação e Validação

## Objetivo

Receber, configurar e validar uma lista antes de criar a sessão.

## Elementos

- botão para voltar;
- botão de tema;
- seletor de arquivo `.txt`;
- nome do arquivo;
- textarea de importação;
- contadores;
- nome da lista;
- opção de embaralhar;
- opção de mostrar gabarito;
- painel de validação;
- botão para carregar exemplo;
- botão para abrir o modelo;
- botão limpar;
- botão validar;
- botão começar.

## Estados

- vazio;
- conteúdo carregado;
- validação pendente;
- validando;
- válida;
- inválida;
- modal do modelo aberto;
- confirmação de limpeza aberta.

## Regras

- selecionar arquivo não inicia automaticamente;
- qualquer edição invalida a validação anterior;
- `Começar` permanece desabilitado até a validação válida;
- mensagens devem permanecer em área reservada;
- contadores definitivos são exibidos após validação.

---

# Tela 3 — Resolução

## Objetivo

Permitir a resolução contínua com acompanhamento de progresso, tempo, anotações e revisão.

## Áreas

- cabeçalho da sessão;
- painel de progresso;
- temporizadores;
- mapa de questões;
- painel de anotações;
- metadados da questão;
- enunciado;
- área de resposta;
- barra de ações.

## Estados comuns

- questão atual;
- respondida;
- não respondida;
- marcada para revisão;
- temporizador rodando;
- temporizador pausado;
- sessão restaurada.

## Questão objetiva

- card inteiro seleciona a resposta oficial;
- apenas uma alternativa pode ser resposta;
- marcador lateral controla rascunho;
- estados auxiliares: neutro, em análise e eliminada;
- marcação auxiliar não substitui a resposta.

## Questão discursiva

- textarea ampla;
- resposta salva automaticamente;
- anotações permanecem separadas;
- preenchimento após `trim()` define questão respondida.

## Regras do temporizador

O tempo conta somente quando:

- a Tela de Resolução está ativa;
- a aba está visível;
- o temporizador não está pausado;
- a sessão não foi finalizada.

---

# Tela 4 — Desempenho

## Objetivo

Entregar uma leitura rápida e emocional do desempenho antes da análise detalhada.

## Elementos

- rótulo “Desempenho Geral”;
- percentual objetivo;
- mensagem principal;
- mensagem complementar;
- botão para abrir o Resultado Final;
- painéis decorativos laterais e inferior.

## Estados

- 100% — Perfeito;
- 90% a 99% — Excelente;
- 75% a 89% — Muito bom;
- 60% a 74% — Bom resultado;
- 50% a 59% — Pode melhorar;
- 0% a 49% — Hora de revisar.

## Regras

- uma única estrutura recebe conteúdo e cores dinâmicas;
- o percentual é o mesmo calculado para o Resultado Final;
- o botão sempre avança para o Resultado Final;
- sessões sem questões objetivas pulam diretamente para o Resultado Final.

---

# Tela 5 — Resultado Final

## Objetivo

Apresentar o desempenho, apoiar a revisão e permitir exportações.

## Elementos

- resultado geral;
- questões respondidas;
- respostas corretas;
- desempenho nas objetivas;
- tempo total;
- tempo médio;
- marcadas para revisão;
- desempenho por assunto;
- filtros;
- cards resumidos;
- card objetivo expandido;
- card discursivo expandido;
- exportações;
- retorno ao início.

## Filtros

- todas;
- erradas;
- discursivas;
- revisão;
- não respondidas.

## Estados dos cards

- correta;
- incorreta;
- discursiva;
- não respondida;
- marcada para revisão.

## Regras

- apenas um card permanece expandido;
- o card expandido ocupa toda a largura;
- discursivas usam revisão manual;
- assuntos sem objetivas não mostram `0%`;
- não respondida não é chamada de incorreta.

---

# Fluxo — Nova sessão

1. Usuário abre a Tela Inicial.
2. Seleciona **Iniciar nova resolução**.
3. A aplicação abre Importação e Validação.
4. Usuário cola conteúdo ou seleciona arquivo.
5. Define nome e opções.
6. Valida a lista.
7. Seleciona **Começar**.
8. A aplicação cria IDs e o estado.
9. Salva a sessão no `localStorage`.
10. Abre a primeira questão.

# Fluxo — Continuar sessão

1. A Tela Inicial detecta uma sessão ativa.
2. Exibe nome, progresso e tempo.
3. Usuário seleciona **Continuar resolução**.
4. A aplicação restaura:
   - questão atual;
   - respostas;
   - anotações;
   - tempos;
   - revisão;
   - marcações auxiliares.
5. O temporizador começa somente após a Resolução estar ativa.

# Fluxo — Validação

1. Conteúdo é carregado.
2. Estado muda para `pendente`.
3. Usuário seleciona **Validar**.
4. Parser identifica blocos e campos.
5. Se houver erro:
   - estado `inválido`;
   - botão Começar desabilitado;
   - erros exibidos.
6. Se estiver correto:
   - estado `válido`;
   - contadores atualizados;
   - botão Começar habilitado.

# Fluxo — Responder objetiva

1. Clique no card define resposta oficial.
2. Estado da questão vira respondida.
3. Clique no marcador altera rascunho.
4. Resposta e marcações são salvas.
5. Mapa é atualizado.

# Fluxo — Finalização

1. Usuário seleciona Finalizar.
2. Aplicação registra o tempo atual.
3. Exibe resumo de pendências.
4. Usuário confirma.
5. Temporizador é encerrado.
6. Resultado é calculado.
7. Sessão concluída é adicionada ao histórico.
8. A Tela de Desempenho é aberta quando existem objetivas.
9. O usuário avança para a Tela de Resultado Final.
10. Sessões somente discursivas abrem diretamente o Resultado Final.

# Fluxo — Revisão do resultado

1. Usuário seleciona um filtro.
2. Lista é recalculada.
3. Usuário expande um card.
4. Card anterior é fechado.
5. Detalhes são exibidos.
6. Nenhuma resposta é alterada.

# Fluxo — Exportação

1. Usuário seleciona uma exportação.
2. Aplicação gera o conteúdo localmente.
3. Navegador baixa o arquivo.
4. Estado da sessão não é modificado.
5. Nenhum dado é enviado a servidor.
