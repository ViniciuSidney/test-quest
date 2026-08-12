# Documentação do Test Quest

Este diretório reúne a documentação oficial do **Test Quest — Now I Know.**

## Estado atual

- base funcional local preservada;
- repositório Git criado e publicado;
- branch estável `main` e desenvolvimento atual em `dev`;
- identidade visual oficial definida;
- telas principais planejadas e aprovadas, incluindo o Wizard de Correção Discursiva;
- manuais estruturais concluídos;
- Tela Inicial oficial implementada;
- Tela de Importação e Validação oficial implementada;
- Tela de Resolução oficial implementada;
- Tela de Desempenho oficial implementada;
- Tela de Resultado Final oficial implementada;
- Tela de Correção Discursiva guiada implementada;
- v0.4.0 concluída: persistência versionada, modularização e confiabilidade consolidadas.
- v0.5.0 concluída: novos modos de resolução, Correção Discursiva, revisão de erros, efeitos visuais e desempenho combinado aprovados.
- v0.6.0 concluída: integração orientada de ida e volta com o Study Stack publicada.
- v0.6.1 candidata: ciclo de vida do vínculo endurecido contra contexto abandonado ou incompatível.

## Documentos principais

| Arquivo | Finalidade |
|---|---|
| `01-visao-do-projeto.md` | Propósito, público, diferenciais e estado atual |
| `02-requisitos-e-escopo.md` | Requisitos funcionais, não funcionais e limites |
| `03-fluxos-e-telas.md` | Fluxo oficial das cinco telas |
| `04-dados-e-arquitetura.md` | Estrutura dos dados e arquitetura atual/alvo |
| `05-roadmap.md` | Etapas de desenvolvimento até a versão estável |
| `06-testes.md` | Roteiro de validação funcional, visual e de persistência |
| `07-changelog.md` | Histórico de mudanças importantes |
| `08-identidade-visual.md` | Regras visuais, tokens e usos semânticos |
| `09-plano-de-implementacao.md` | Ordem segura para substituir as telas atuais |
| `10-v0.4-consolidacao-tecnica.md` | Persistência, migração e etapas técnicas da v0.4 |
| `11-checklist-fechamento-v0.4.md` | Regressão final, aprovação, merge, tag e publicação da v0.4.0 |
| `12-notas-release-v0.4.0.md` | Resumo oficial e conteúdo-base da Release v0.4.0 |
| `23-checklist-fechamento-v0.5.md` | Aprovação final, critérios e comandos de publicação da v0.5.0 |
| `24-notas-release-v0.5.0.md` | Resumo oficial e conteúdo-base da Release v0.5.0 |
| `25-study-stack-handoff-v1.1.md` | Contratos e comportamento da integração com o Study Stack |
| `26-validacao-integracao-study-stack.md` | Evidências da validação conjunta e roteiro de publicação |
| `27-notas-release-v0.6.0.md` | Resumo oficial e conteúdo-base da Release v0.6.0 |
| `28-notas-release-v0.6.1.md` | Correção do vínculo por sessão e roteiro de validação da v0.6.1 |
| `13-v0.5-fundacao-alternativas.md` | Modelo estável de alternativas, respostas e migração do esquema 4 |
| `14-v0.5-embaralhamento-alternativas.md` | Regras e persistência do embaralhamento de alternativas |
| `15-v0.5-verdadeiro-falso.md` | Formato, comportamento e validação de Verdadeiro ou Falso |
| `16-v0.5-gabarito-imediato.md` | Modos de correção e confirmação por questão |
| `17-v0.5-refino-gabarito-e-metacognicao.md` | Responsividade do feedback, metacognição e desempenho geral |
| `18-v0.5-correcao-rolagem-resolucao.md` | Correção da rolagem interna e sobreposição na Resolução |
| `19-v0.5-refazer-questoes-erradas.md` | Regras e fluxo da revisão focada em erros |
| `20-v0.5-efeitos-visuais.md` | Preferência global de movimento e acessibilidade |
| `21-v0.5-correcao-discursiva-guiada.md` | Wizard, Veredito Final e migração para o schema 7 |

## Manuais de telas

```text
manuais-de-telas/
├── test-quest-manual-estrutura-tela-inicial.md
├── test-quest-manual-estrutura-importacao-validacao.md
├── test-quest-manual-estrutura-resolucao.md
├── test-quest-manual-estrutura-desempenho.md
└── test-quest-manual-estrutura-resultado-final.md
```

Os manuais são as referências oficiais para HTML, CSS, estados, dimensões, responsividade e acessibilidade.

## Regra de atualização

Sempre que uma alteração funcional ou estrutural for concluída:

1. atualizar o documento relacionado;
2. atualizar `07-changelog.md`;
3. revisar `06-testes.md`;
4. registrar a mudança em commit próprio;
5. evitar declarar como implementado algo que ainda esteja apenas planejado.
