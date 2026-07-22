# Testes Manuais — Migração Estrutural

## Preparação

1. Abra a pasta raiz no VS Code.
2. Inicie o Live Server pelo `index.html`.
3. Abra o console do navegador.
4. Confirme que não existem erros de importação de módulos ou arquivos CSS.

## Bloco A — Carregamento

- [ ] A página abre com o título Test Quest.
- [ ] Os estilos são carregados.
- [ ] O tema inicial aparece corretamente.
- [ ] O console não mostra erro 404.
- [ ] O console não mostra erro de JavaScript.

## Bloco B — Tela Inicial

- [ ] A aplicação abre na Tela Inicial.
- [ ] Sem sessão ativa, o bloco de continuação permanece oculto.
- [ ] Com sessão ativa, nome, progresso e tempo são exibidos.
- [ ] **Continuar resolução** restaura respostas, anotações e tempos.
- [ ] **Iniciar nova resolução** abre a importação.
- [ ] Uma sessão ativa exige confirmação antes de preparar outra lista.
- [ ] O retorno da importação abre a Tela Inicial sem apagar a sessão.
- [ ] O histórico considera apenas sessões concluídas.
- [ ] O temporizador não aumenta enquanto a Home está ativa.
- [ ] O layout mobile usa rolagem interna sem rolagem no `body`.

## Bloco C — Importação e Validação

- [ ] A tela abre no estado **Nenhuma validação realizada**.
- [ ] O botão **Começar** inicia desabilitado.
- [ ] O botão **Carregar exemplo** preenche o conteúdo e o nome da lista.
- [ ] Carregar ou editar o conteúdo muda o estado para **Pendente**.
- [ ] A validação reconhece duas questões no exemplo.
- [ ] Os contadores mostram 2 questões, 1 objetiva, 1 discursiva e 1 assunto.
- [ ] O botão **Começar** só habilita após validação válida.
- [ ] Editar o conteúdo após validar desabilita **Começar** novamente.
- [ ] O arquivo em `public/examples` pode ser selecionado no input.
- [ ] O nome do arquivo aparece sem transbordar.
- [ ] Uma lista inválida apresenta os campos ausentes.
- [ ] Mais de um bloco inválido pode produzir mais de uma mensagem.
- [ ] **Limpar** pede confirmação quando existem dados.
- [ ] Após limpar, contadores e estado retornam ao início.
- [ ] O modal do modelo abre e fecha pelo botão, fundo e tecla `Escape`.
- [ ] O foco retorna ao botão **Ver modelo** após fechar o modal.
- [ ] Tema claro e escuro preservam o contraste da tela.
- [ ] A barra inferior permanece acessível em telas pequenas.

## Bloco D — Resolução

- [ ] A sessão inicia na primeira questão.
- [ ] O cabeçalho mostra o nome correto da lista.
- [ ] A resposta objetiva é selecionada ao clicar no card.
- [ ] Somente uma resposta oficial permanece selecionada.
- [ ] O marcador lateral não seleciona a resposta oficial.
- [ ] O marcador alterna entre neutro, em análise e eliminada.
- [ ] Selecionar uma alternativa limpa sua marcação auxiliar anterior.
- [ ] A resposta objetiva permanece após navegar.
- [ ] A resposta discursiva permanece após navegar.
- [ ] As anotações permanecem vinculadas à questão.
- [ ] O mapa distingue atual, respondida e revisão.
- [ ] O mapa possui rótulos compreensíveis pelo leitor de tela.
- [ ] A marcação para revisão atualiza botão, selo e mapa.
- [ ] O botão Anterior fica desabilitado na primeira questão.
- [ ] Próxima é substituída por Finalizar na última questão.
- [ ] O temporizador atribui o tempo à questão que estava aberta antes da navegação.
- [ ] Pausar e retomar funciona.
- [ ] O estado pausado permanece após voltar à Home e continuar a sessão.
- [ ] O modal de finalização mostra respondidas, pendentes e marcadas em uma lista organizada.
- [ ] O assunto da questão possui espaçamento horizontal confortável, inclusive quando é longo.
- [ ] A soma dos tempos visíveis por questão coincide com o tempo total visível.
- [ ] Apenas a tela ativa possui rolagem em tablet e mobile.

## Bloco E — Persistência

- [ ] Recarregar a página mantém a sessão.
- [ ] Voltar ao início interrompe o temporizador.
- [ ] Continuar sessão recupera os dados.
- [ ] Limpar progresso remove a sessão.
- [ ] O tema permanece após recarregar.

## Bloco F — Tela de Desempenho

- [ ] Finalizar uma sessão com objetivas abre a Tela de Desempenho.
- [ ] O percentual coincide com o Resultado Final.
- [ ] 100% mostra **Perfeito!** e **Ótimo!**.
- [ ] 90% a 99% mostra **Excelente!**.
- [ ] 75% a 89% mostra **Muito bom!**.
- [ ] 60% a 74% mostra **Bom resultado!**, **Você já construiu uma boa base.** e **Tudo bem!**.
- [ ] 50% a 59% mostra **Pode melhorar.**.
- [ ] 0% a 49% mostra **Hora de revisar!**.
- [ ] O botão principal abre o Resultado Final.
- [ ] Sessões somente discursivas pulam esta tela.
- [ ] Desktop, tablet e mobile não apresentam transbordamentos.
- [ ] O foco chega ao título ao abrir a tela.
- [ ] A preferência de redução de movimento é respeitada.

## Bloco G — Resultado Final

- [ ] Os seis indicadores gerais apresentam valores corretos.
- [ ] Sessões sem objetivas mostram `—` no desempenho e nos acertos.
- [ ] O aviso de revisão manual aparece apenas quando existem discursivas.
- [ ] O resumo por assunto apresenta acertos, total de objetivas e tempo.
- [ ] Assuntos sem objetivas não exibem barra enganosa de `0%`.
- [ ] O filtro **Todas** exibe todas as questões.
- [ ] O filtro **Erradas** exibe apenas objetivas respondidas incorretamente.
- [ ] O filtro **Discursivas** exibe todas as discursivas.
- [ ] O filtro **Revisão** exibe todas as marcadas, independentemente do status.
- [ ] O filtro **Não respondidas** exibe apenas questões pendentes.
- [ ] Filtros sem resultados mostram uma mensagem específica.
- [ ] Apenas um card permanece expandido por vez.
- [ ] Card objetivo expandido mostra enunciado, respostas, tempo, explicação e anotação.
- [ ] Card discursivo expandido mostra enunciado, resposta, modelo, critérios, tempo e anotações.
- [ ] Quando o gabarito estiver oculto, respostas esperadas e explicações não aparecem.
- [ ] Respostas TXT são baixadas.
- [ ] Anotações TXT são baixadas.
- [ ] Sessão JSON é baixada e pode ser aberta.
- [ ] Botões de Início no cabeçalho e no rodapé encerram a sessão ativa sem apagar o histórico.
- [ ] O cabeçalho antigo da aplicação permanece oculto no Resultado Final.
- [ ] Em 1140 × 612 e dimensões próximas, os indicadores não se sobrepõem ao aviso discursivo.
- [ ] Ao expandir um card, os cards posteriores seguem abaixo dele no fluxo normal.
- [ ] Em telas menores, os botões de exportação e retorno permanecem dentro da barra inferior.

## Bloco H — Layout

- [ ] Não existe rolagem global no desktop.
- [ ] O painel lateral não encobre as anotações.
- [ ] A textarea discursiva ocupa o espaço útil.
- [ ] As ações permanecem visíveis.
- [ ] Conteúdo longo usa rolagem interna.
- [ ] Tema claro e escuro preservam contraste.
- [ ] O layout continua utilizável em janelas baixas.

## Resultado

- Data:
- Navegador:
- Resolução:
- Testador:
- Resultado geral:
- Bugs encontrados:


## Tela de Desempenho — overlay refinado

- [ ] Ao confirmar a finalização, o Resultado Final é preparado ao fundo.
- [ ] O overlay utiliza a cor da faixa com transparência e desfoque.
- [ ] Não existem painéis laterais, superiores ou inferiores simulados.
- [ ] O card central preserva rótulo, percentual, mensagem e botão.
- [ ] A pontuação conta suavemente de zero até o percentual final.
- [ ] O CTA fecha o overlay com animação e revela o Resultado Final.
- [ ] O overlay entra com Fade In após confirmar a finalização.
- [ ] O overlay sai com Fade Out ao avançar para o Resultado Final.
- [ ] Um brilho circular giratório aparece atrás da porcentagem sem encobrir o número.
- [ ] O foco é enviado ao título do Resultado Final após a saída.
- [ ] Em movimento reduzido, a troca ocorre sem animações.


## Tela de Desempenho — placar digital

- [ ] Confirmar que o percentual e o símbolo usam fonte monoespaçada de aparência digital.
- [ ] Observar se a contagem de 0 até o resultado não desloca o conjunto horizontalmente.
- [ ] Confirmar a linha de contexto: `X acerto(s) em Y questão(ões) objetiva(s)`.
- [ ] Conferir singular e plural com sessões de 1 e 2 questões objetivas.

## App Shell amplo

- [ ] Conferir Home em 1920 × 1080 e zoom de 100%.
- [ ] Conferir Importação em 1600 × 900.
- [ ] Conferir Resolução em 1366 × 768.
- [ ] Conferir Resultado Final em 1140 × 612.
- [ ] Repetir o fluxo com zoom de 125% e 150%.
- [ ] Confirmar que mobile mantém os painéis empilhados e sem rolagem horizontal.


## Resultado Final — validação adicional

- [ ] Em telas até 720px, `Ações da sessão` inicia recolhido.
- [ ] O toggle abre e fecha as três exportações sem deslocamentos bruscos.
- [ ] `Voltar ao início` permanece sempre acessível.
- [ ] No desktop, as exportações continuam abertas.
- [ ] O card discursivo segue a organização visual aprovada.
- [ ] Em telas pequenas, os seis blocos discursivos são empilhados na ordem correta.

## Resultado Final — controles compactos e alinhamento

- [ ] Confirmar que `Tempo utilizado` começa no topo do bloco discursivo.
- [ ] Em largura superior a 720px, confirmar que `Ações da sessão` não aparece.
- [ ] Em largura de até 720px, abrir e fechar o toggle de exportações.
- [ ] Em largura de até 900px, abrir o toggle de filtros e selecionar cada opção.
- [ ] Confirmar que o toggle informa o filtro atual e se recolhe após a seleção.
- [ ] Testar Tab com filtros e exportações recolhidos.

## Tela de Desempenho — encaixe na viewport

- [ ] Conferir a tela em zoom de 100%, 125% e 150%.
- [ ] Conferir alturas de 900px, 720px, 640px e 600px.
- [ ] Confirmar que o botão principal permanece integralmente visível.
- [ ] Confirmar que o Fade In, Fade Out e a aura continuam funcionando.


## V0.4 — Migração e recuperação

- [ ] Criar uma sessão na v0.3, atualizar os arquivos e confirmar a continuação na v0.4.
- [ ] Verificar no DevTools que `testQuest.state` foi criada.
- [ ] Confirmar que a antiga `resolvedorQuestoesV2.estado` não permanece ativa após a migração.
- [ ] Recarregar a página e confirmar respostas, anotações, tempo, revisão e questão atual.
- [ ] Apagar o progresso e confirmar que a sessão não reaparece.
- [ ] Alternar o tema antes e depois da migração e confirmar persistência.
- [ ] Finalizar uma sessão migrada e confirmar apenas um registro no histórico.


## v0.4 — regressão após modularização

- [ ] Criar uma sessão com o exemplo interno e confirmar que o nome, as questões e as opções permanecem corretos.
- [ ] Responder uma objetiva e uma discursiva, adicionar anotação, marcar revisão e recarregar a página.
- [ ] Continuar a sessão pela Home e confirmar respostas, tempos, anotação, revisão e questão atual.
- [ ] Finalizar com questões pendentes e conferir o mesmo resumo no modal.
- [ ] Finalizar sem pendências e conferir a Tela de Desempenho e o Resultado Final.
- [ ] Baixar respostas TXT e comparar resumo, gabarito, explicações e tempos.
- [ ] Baixar anotações TXT e comparar anotações, revisão e tempos.
- [ ] Exportar JSON e conferir `schemaVersion`, ID, status, questões e mapas da sessão.
- [ ] Confirmar que limpar importação, substituir sessão, apagar progresso e preparar nova resolução mantêm os mesmos textos e ações.


## v0.4 — fechamento da Release Candidate

### Fluxo principal

- [ ] Carregar o exemplo, validar e iniciar uma sessão.
- [ ] Responder objetiva e discursiva, adicionar anotação e marcar revisão.
- [ ] Recarregar a página e continuar pela Home sem perda de dados.
- [ ] Finalizar, passar pelo Desempenho e abrir o Resultado Final.
- [ ] Conferir os filtros, cards e desempenho por assunto.
- [ ] Baixar respostas TXT, anotações TXT e sessão JSON.
- [ ] Voltar ao início e confirmar um único registro no histórico.

### Persistência degradada

- [ ] Bloquear o armazenamento do site pelo navegador e recarregar.
- [ ] Confirmar que a aplicação inicia e exibe aviso de salvamento indisponível.
- [ ] Iniciar uma sessão e confirmar que a interface continua utilizável na aba atual.
- [ ] Tentar recarregar e confirmar que o navegador alerta sobre alterações não persistidas.
- [ ] Restabelecer a permissão e selecionar **Tentar novamente**.
- [ ] Confirmar que o aviso desaparece após a gravação funcionar.

### Responsividade

- [ ] Executar o fluxo em 1920 × 1080 e 1366 × 768.
- [ ] Executar o fluxo em 900 × 720 e 390 × 844.
- [ ] Conferir zoom de 100%, 125% e 150%.
- [ ] Confirmar que o aviso de persistência não encobre ações essenciais.

### Registro

- Data:
- Navegador e versão:
- Dimensões testadas:
- Resultado geral:
- Bugs bloqueadores:
- Decisão: [ ] Aprovar v0.4.0  [ ] Corrigir e repetir

## Registro de fechamento da v0.4.0

- Data de aprovação: 2026-07-18
- Resultado geral: aprovado para fechamento e publicação
- Navegador e dimensões: não registrados no documento enviado
- Bugs bloqueadores informados: nenhum
- Observação: a aprovação para avançar ao fechamento foi considerada como confirmação da regressão manual final.

## v0.5 — Fundação de alternativas e respostas

### Migração real da v0.4

1. Na v0.4.0, inicie uma sessão com ao menos uma questão objetiva.
2. Selecione uma resposta, marque outra alternativa como `em análise` e escreva uma anotação.
3. Feche a página sem finalizar a sessão.
4. Atualize os arquivos para a v0.5-dev e abra novamente pelo Live Server.
5. Continue a sessão pela Home.

Confirmar:

- [ ] a questão atual foi preservada;
- [ ] a resposta oficial continua selecionada;
- [ ] a marcação auxiliar continua na alternativa correta;
- [ ] anotações e tempos permanecem;
- [ ] o resultado final calcula acertos corretamente;
- [ ] o TXT mostra letras, não IDs internos;
- [ ] o JSON usa `schemaVersion: 5`;
- [ ] `respostas` e `marcacoesAlternativas` usam IDs de alternativas.

### Regressão visual

- [ ] a Tela de Importação permanece igual;
- [ ] as alternativas continuam exibindo A–E;
- [ ] seleção e marcadores mantêm os mesmos estilos;
- [ ] mapa, temporizador e anotações continuam funcionando;
- [ ] Resultado Final continua mostrando resposta e gabarito por letras;
- [ ] temas claro e escuro não apresentam regressões.

## Verdadeiro ou Falso — refinamento visual

1. Importe uma questão V/F com `correta: V`.
2. Ative `Embaralhar alternativas` e inicie a sessão.
3. Confirme que Verdadeiro permanece à esquerda e Falso à direita.
4. Selecione Falso, recarregue a página e continue a sessão.
5. Confirme que a resposta continua selecionada.
6. Finalize e abra o card no Resultado Final.
7. Confira selo V/F, afirmativa, resposta escolhida, resposta correta, explicação, tempo e anotação.
8. Repita em 1366×768, 754×817, 390×844 e nos temas claro e escuro.

## Refinamento visual da resolução V/F

- [ ] assunto curto produz uma pill compacta, sem largura artificial;
- [ ] assunto longo termina com reticências e não invade outras pills;
- [ ] questões respondidas usam cor informativa, diferente de verde/sucesso;
- [ ] Verdadeiro e Falso permanecem menores que a área interna e centralizados;
- [ ] em mobile, Verdadeiro, “ou” e Falso continuam empilhados e legíveis.


## Etapa 4 — Gabarito imediato

- [ ] iniciar uma sessão com `Somente no resultado final` e confirmar que o fluxo antigo permanece igual;
- [ ] iniciar uma sessão com `Após confirmar cada questão`;
- [ ] verificar que `Confirmar resposta` fica desabilitado enquanto não houver resposta;
- [ ] confirmar uma objetiva correta e conferir bloqueio, gabarito e explicação;
- [ ] confirmar uma objetiva incorreta e conferir destaque da escolhida e da correta;
- [ ] confirmar uma questão V/F e conferir a ordem Verdadeiro → Falso;
- [ ] confirmar uma discursiva e conferir resposta esperada e critérios;
- [ ] recarregar a página e verificar que a resposta continua bloqueada;
- [ ] continuar a sessão pela Home e verificar que o painel de correção reaparece;
- [ ] navegar para uma questão não confirmada e verificar que ela continua editável;
- [ ] finalizar com questões não confirmadas e conferir o aviso no modal;
- [ ] testar tema claro, tema escuro, desktop e mobile.


## Etapa 4 — Refinamento responsivo e metacognição

### Zoom e rolagem

- [ ] conferir a configuração da sessão em 90%, 100%, 125% e 150%;
- [ ] confirmar que opções e modos de correção não se sobrepõem;
- [ ] conferir a correção objetiva com explicação curta e extensa;
- [ ] confirmar rolagem vertical da Resolução em desktop, tablet e mobile;
- [ ] verificar que a última parte do feedback e as ações continuam alcançáveis;
- [ ] repetir nos temas claro e escuro.

### Metacognição discursiva

- [ ] confirmar uma discursiva no modo imediato;
- [ ] conferir resposta esperada, critérios e bloco de Metacognição;
- [ ] selecionar `Resposta completa` e verificar 100%;
- [ ] selecionar `Resposta parcial` e verificar 50%;
- [ ] selecionar `Resposta incorreta` e verificar 0%;
- [ ] escrever uma observação, recarregar e confirmar persistência;
- [ ] verificar que Próxima/Finalizar só é liberado após a seleção;
- [ ] finalizar com uma discursiva sem avaliação e conferir o aviso;
- [ ] confirmar o desempenho geral combinado no Resultado Final;
- [ ] conferir metacognição no histórico e nas exportações TXT/JSON.


## Etapa 5 — Refazer questões erradas

- [ ] finalizar uma sessão com uma objetiva incorreta e confirmar que o botão `Refazer questões erradas` aparece com contador `1`;
- [ ] finalizar uma sessão sem erros e confirmar que o botão não aparece;
- [ ] criar uma revisão contendo uma objetiva incorreta, uma V/F incorreta e uma discursiva avaliada em 0%;
- [ ] confirmar que objetivas não respondidas não entram automaticamente;
- [ ] confirmar que discursivas avaliadas em 50% ou 100% não entram automaticamente;
- [ ] confirmar no modal a quantidade total, objetiva/V/F e discursiva;
- [ ] iniciar a revisão e verificar que respostas, tempos, anotações, revisão, marcações, confirmações e Metacognição estão vazios;
- [ ] verificar que o modo de correção e as opções de embaralhamento foram preservados;
- [ ] finalizar a revisão e confirmar que a sessão original e a nova tentativa aparecem separadamente nos indicadores históricos;
- [ ] repetir o fluxo nos temas claro e escuro, em desktop e mobile.
