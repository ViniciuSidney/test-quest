# Notas da Release — Test Quest v0.6.1

**Título sugerido no GitHub:** `Test Quest v0.6.1 — Vínculo seguro por sessão`

## Resumo

A v0.6.1 corrige o ciclo de vida do vínculo com o Study Stack. Uma entrada
abandonada não pode mais associar silenciosamente uma resolução futura ao
Assunto anterior.

## Correções

- o contexto interno passa a registrar o `sessionId` da resolução criada;
- a retomada aceita somente contexto e sessão ativa correspondentes;
- contexto sem sessão, órfão ou incompatível é removido na abertura direta;
- voltar de **Preparar resolução** cancela o vínculo e limpa o nome sugerido
  quando ele não foi editado;
- apagar uma sessão ou sair do Resultado Final também encerra o vínculo;
- recarregar uma sessão vinculada válida abre a Tela Inicial para retomada, sem
  reabrir a importação.
- **Refazer questões erradas** transfere o vínculo para o `sessionId` da nova tentativa.

## Compatibilidade

- versão da aplicação: `0.6.1`;
- schema da sessão preservado em `7`;
- contratos externos preservados em `1.0.0`/`1.1.0`;
- nenhum campo foi adicionado à sessão nativa nem ao resultado entregue;
- sessões, histórico e exportações anteriores continuam compatíveis.

## Validação

- 47 arquivos de teste automatizados;
- regressões específicas para contexto válido, abandonado e incompatível;
- validação manual conjunta ainda necessária nas URLs de desenvolvimento antes
  da promoção para `main` e da publicação da Release.

## Roteiro manual essencial

1. Abrir o Test Quest pelo Assunto no Study Stack e confirmar a importação vinculada.
2. Voltar sem iniciar a lista e abrir o Test Quest diretamente; nenhum vínculo deve aparecer.
3. Criar uma sessão vinculada, voltar à Tela Inicial, recarregar e continuar a mesma sessão.
4. Finalizar e usar **Salvar no Study Stack e voltar**; o card correto deve receber o resultado.
5. Abrir o Test Quest diretamente novamente; nenhuma ação vinculada deve permanecer.
