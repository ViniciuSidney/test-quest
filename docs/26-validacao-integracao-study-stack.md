# Validação conjunta com o Study Stack

## Situação

**Integração aprovada localmente em 12 de agosto de 2026.**

A validação utilizou as branches `dev` dos dois projetos servidas pela mesma
origem local, reproduzindo o armazenamento compartilhado necessário ao handoff.

## Cenários aprovados

| Cenário | Resultado |
|---|---|
| Entrada pelo botão **Criar lista no Test Quest** | OK |
| Abertura direta em **Preparar resolução** | OK |
| Assunto e vínculo visíveis | OK |
| Nome sugerido editável | OK |
| Sequência preservada fora do título | OK |
| Prevenção de sugestão canônica duplicada | OK |
| Sessão com acerto, parcial e erro | OK |
| **Salvar no Study Stack e voltar** | OK |
| Card importado, localizado e destacado | OK |
| Mensagem de confirmação no Study Stack | OK |
| Recarregamento sem nova importação | OK |
| Abertura direta sem vínculo residual | OK |
| Exportação manual oculta no sucesso | OK |
| Base do desempenho explicitada | OK |
| Total e respondidas separados por assunto | OK |

## Verificação automatizada

- 47 arquivos de teste aprovados no Test Quest;
- 207 testes aprovados no Study Stack;
- 123 arquivos JavaScript verificados no Study Stack;
- nenhum cálculo de desempenho alterado;
- nenhum schema persistente alterado.

## Recuperação

A falha do retorno automático permanece coberta por testes determinísticos. O
fluxo preserva a possibilidade de exportação manual quando a entrega não pode
ser concluída. No Study Stack, um Assunto indisponível não causa descarte do
handoff.

## Limpeza do ambiente

Após os testes:

- o servidor local foi encerrado;
- a URL temporária do Test Quest no Study Stack foi restaurada;
- os dois repositórios locais permaneceram sem alterações pendentes;
- a abertura direta do Test Quest foi confirmada sem vínculo anterior.

## Publicação coordenada

A integração deve ser publicada nos dois projetos na mesma janela. A ordem
recomendada é:

1. executar novamente as suítes nas pontas das branches `dev`;
2. revisar os comparativos `main...dev`;
3. integrar as duas branches;
4. executar smoke test nas URLs públicas;
5. criar tags ou releases somente após a aprovação pública.
