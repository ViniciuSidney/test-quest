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

## Bloco C — Importação

- [ ] O botão **Carregar exemplo** preenche os campos.
- [ ] A validação reconhece duas questões no exemplo.
- [ ] O modal do modelo abre e fecha corretamente.
- [ ] O arquivo em `public/examples` pode ser selecionado no input.
- [ ] Uma lista inválida produz mensagem de erro.

## Bloco D — Resolução

- [ ] A sessão inicia na primeira questão.
- [ ] A resposta objetiva permanece após navegar.
- [ ] A resposta discursiva permanece após navegar.
- [ ] As anotações permanecem vinculadas à questão.
- [ ] O mapa muda o estado da questão respondida.
- [ ] A marcação para revisão funciona.
- [ ] O temporizador atualiza a questão correta.
- [ ] Pausar e retomar funciona.

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
