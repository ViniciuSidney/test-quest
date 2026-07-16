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
