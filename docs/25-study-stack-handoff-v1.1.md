# Integração com o Study Stack — handoff 1.1.0

## Objetivo

Receber o contexto de um Assunto do Study Stack e devolver uma sessão finalizada
sem alterar o modelo persistente do Test Quest. O `schemaVersion: 7` continua
representando a sessão nativa; `contractVersion` identifica apenas os
envelopes de integração.

## Fronteiras

- o contexto recebido usa o protocolo `1.0.0`;
- o resultado enviado usa `testQuestSessionResult` `1.1.0`;
- o contexto fica em
  `testQuest.integration.studyStackContext.v1`;
- o resultado automático fica temporariamente em
  `study-stack:handoff:test-quest:v1`;
- o Study Stack continua sendo a única fonte do progresso do Assunto;
- nenhum dado é enviado diretamente ao Concept Compass.

## Entrada orientada

Quando o contexto válido contém `entryPoint=import`, o Test Quest:

1. abre diretamente **Preparar resolução**;
2. exibe **Vinculado ao Study Stack** e o nome do Assunto;
3. preenche o nome sugerido;
4. mantém o nome da lista editável;
5. preserva a sequência em campo estruturado, independentemente do título.

A ausência de contexto mantém o fluxo comum da aplicação. Abrir o Test Quest
diretamente não deve reaproveitar o vínculo de uma sessão já entregue.

## Pontuação

| Veredito no Test Quest | `result` | `scorePercentage` |
|---|---|---:|
| Objetiva correta ou discursiva completa | `correct` | `100` |
| Discursiva parcial | `partial` | `50` |
| Objetiva incorreta ou discursiva incorreta | `incorrect` | `0` |
| Sem resposta objetiva ou sem Veredito Final discursivo | `unanswered` | `null` |

A resposta discursiva permanece no snapshot mesmo sem Veredito Final. Nesse
caso, o adaptador não inventa pontuação.

## Ações do Resultado Final

- **Salvar no Study Stack e voltar** grava o envelope na mesma origem e retorna
  apenas para uma URL autorizada;
- **Baixar cópia da sessão** gera o backup nativo completo da sessão;
- a exportação manual para o Study Stack fica oculta no fluxo normal;
- se o retorno automático falhar, a exportação manual é revelada como
  alternativa de recuperação.

As ações de integração aparecem somente quando existe `subjectId` válido. Um
contexto rejeitado informa vínculo indisponível sem habilitar a entrega.

## Clareza do resultado

- o aproveitamento informa quantas questões formam a base do cálculo;
- **Por assunto** separa total da lista, quantidade respondida e tempo;
- respostas parciais contribuem com 50%;
- questões não avaliadas não recebem pontuação inventada.

## Segurança e não regressão

- `sourceApp`, versão, `subjectId`, data e `returnUrl` são validados;
- URLs externas não autorizadas são rejeitadas;
- parâmetros só saem da URL depois da persistência;
- o contexto é removido após o handoff automático;
- o adaptador não modifica a sessão;
- tentativas refeitas preservam o Assunto e recebem novo `sessionId`;
- falha no retorno preserva uma alternativa manual;
- o título editável não substitui a sequência estruturada.
