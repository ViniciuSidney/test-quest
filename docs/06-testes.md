# Testes

## Informações

**Projeto:** Test Quest  
**Versão:** v0.2.5-dev  
**Fase:** validação pós-migração estrutural  
**Status geral:** pendente

## Testes essenciais

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T01 | Abrir por Live Server | A aplicação carrega sem erro de módulo | Pendente |
| T02 | Carregar exemplo | O texto e o nome da lista são preenchidos | Pendente |
| T03 | Validar lista correta | A quantidade de objetivas e discursivas é informada | Pendente |
| T04 | Rejeitar lista inválida | Uma mensagem clara é exibida | Pendente |
| T05 | Importar arquivo TXT | O conteúdo do arquivo aparece no campo | Pendente |
| T06 | Iniciar sessão | A primeira questão é exibida | Pendente |
| T07 | Responder objetiva | A resposta fica marcada e salva | Pendente |
| T08 | Responder discursiva | O texto é salvo durante a digitação | Pendente |
| T09 | Trocar de questão | Respostas e anotações permanecem | Pendente |
| T10 | Temporizador por questão | O tempo é associado à questão correta | Pendente |
| T11 | Voltar ao import | O temporizador para de contar | Pendente |
| T12 | Continuar sessão | O estado salvo é restaurado | Pendente |
| T13 | Pausar temporizador | O tempo deixa de aumentar | Pendente |
| T14 | Marcar revisão | A marca aparece no mapa e no resultado | Pendente |
| T15 | Finalizar com pendências | A aplicação pede confirmação | Pendente |
| T16 | Resultado objetivo | Percentual e acertos são calculados corretamente | Pendente |
| T17 | Revisão discursiva | Resposta esperada e critérios aparecem | Pendente |
| T18 | Exportar respostas | Um TXT válido é baixado | Pendente |
| T19 | Exportar anotações | Um TXT separado é baixado | Pendente |
| T20 | Exportar sessão | Um JSON válido é baixado | Pendente |
| T21 | Alternar tema | O tema muda e permanece após recarregar | Pendente |
| T22 | Limpar progresso | O estado salvo é removido | Pendente |
| T23 | Modal do modelo | Abre, fecha pelo botão, fundo e Escape | Pendente |
| T24 | Layout fixo desktop | Não há rolagem geral nem sobreposição | Pendente |
| T25 | Tela de pouca altura | As áreas internas permanecem utilizáveis | Pendente |

## Regra para fechamento

A versão não deve ser enviada para `main` como estável enquanto houver:

- bug crítico em importação;
- perda de respostas ou anotações;
- temporizador contando fora da resolução;
- sobreposição de controles;
- exportação inválida;
- erro de módulo no carregamento.
