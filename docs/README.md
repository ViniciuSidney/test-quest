# Documentação do Test Quest

Este diretório reúne a documentação oficial do **Test Quest — Now I Know.**

## Estado atual

- base funcional local preservada;
- repositório Git criado e publicado;
- branches `main` e `dev` configuradas;
- identidade visual oficial definida;
- quatro telas principais planejadas e aprovadas;
- manuais estruturais concluídos;
- próxima etapa: implementação gradual das novas telas na branch `dev`.

## Documentos principais

| Arquivo | Finalidade |
|---|---|
| `01-visao-do-projeto.md` | Propósito, público, diferenciais e estado atual |
| `02-requisitos-e-escopo.md` | Requisitos funcionais, não funcionais e limites |
| `03-fluxos-e-telas.md` | Fluxo oficial das quatro telas |
| `04-dados-e-arquitetura.md` | Estrutura dos dados e arquitetura atual/alvo |
| `05-roadmap.md` | Etapas de desenvolvimento até a versão estável |
| `06-testes.md` | Roteiro de validação funcional, visual e de persistência |
| `07-changelog.md` | Histórico de mudanças importantes |
| `08-identidade-visual.md` | Regras visuais, tokens e usos semânticos |
| `09-plano-de-implementacao.md` | Ordem segura para substituir as telas atuais |

## Manuais de telas

```text
manuais-de-telas/
├── test-quest-manual-estrutura-tela-inicial.md
├── test-quest-manual-estrutura-importacao-validacao.md
├── test-quest-manual-estrutura-resolucao.md
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
