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
- [ ] O modal de finalização mostra respondidas, pendentes e marcadas.
- [ ] Apenas a tela ativa possui rolagem em tablet e mobile.

## Bloco E — Persistência

- [ ] Recarregar a página mantém a sessão.
- [ ] Voltar ao início interrompe o temporizador.
- [ ] Continuar sessão recupera os dados.
- [ ] Limpar progresso remove a sessão.
- [ ] O tema permanece após recarregar.

## Bloco F — Resultado

- [ ] As objetivas são corrigidas.
- [ ] A discursiva exibe modelo e critérios.
- [ ] O tempo total é coerente.
- [ ] O resumo por assunto aparece.
- [ ] Respostas TXT são baixadas.
- [ ] Anotações TXT são baixadas.
- [ ] Sessão JSON é baixada e pode ser aberta.

## Bloco G — Layout

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
