# Integração com o Study Stack — handoff 1.1.0

## Objetivo

Enviar uma sessão finalizada do Test Quest ao Assunto de origem no Study Stack
sem alterar o modelo persistente do Test Quest. O `schemaVersion: 7` e a ação
**Exportar sessão** continuam representando exclusivamente o backup nativo.

## Fronteiras

- o contexto recebido do Study Stack usa o protocolo `1.0.0` já publicado;
- o resultado enviado usa o contrato `testQuestSessionResult` `1.1.0`;
- o contexto fica na chave separada
  `testQuest.integration.studyStackContext.v1`;
- o resultado automático fica temporariamente em
  `study-stack:handoff:test-quest:v1`;
- o Study Stack continua sendo a única fonte do progresso do Assunto;
- nenhum dado é enviado diretamente ao Concept Compass.

## Pontuação

| Veredito no Test Quest | `result` | `scorePercentage` |
|---|---|---:|
| Objetiva correta ou discursiva completa | `correct` | `100` |
| Discursiva parcial | `partial` | `50` |
| Objetiva incorreta ou discursiva incorreta | `incorrect` | `0` |
| Sem resposta objetiva ou sem Veredito Final discursivo | `unanswered` | `null` |

A resposta discursiva permanece no snapshot mesmo quando ainda não existe um
Veredito Final. Nesse caso, o adaptador não inventa uma nota.

## Ações do Resultado Final

- **Salvar no Study Stack e voltar** grava o envelope no armazenamento da mesma
  origem e retorna somente para uma URL autorizada;
- **Exportar para o Study Stack** gera o fallback
  `<lista>-study-stack.json`;
- **Exportar sessão** permanece inalterado e gera
  `<lista>-sessao.json` com o estado interno completo.

As ações de integração aparecem somente quando o Test Quest recebeu um
`subjectId` válido do Study Stack. Um contexto rejeitado mostra apenas o aviso
de vínculo indisponível, sem habilitar envio ou exportação.

## Segurança e não regressão

- `sourceApp`, versão, `subjectId`, data e `returnUrl` são validados;
- URLs externas não autorizadas são rejeitadas;
- parâmetros de contexto só são removidos da URL depois da persistência;
- o contexto persistido é removido após o handoff automático para não vincular
  uma nova lista ao Assunto anterior;
- o adaptador é puro e não modifica a sessão;
- tentativas refeitas mantêm o Assunto, mas usam o novo `sessionId` criado pelo
  ciclo nativo do Test Quest;
- falha no retorno automático preserva a exportação manual como alternativa.
