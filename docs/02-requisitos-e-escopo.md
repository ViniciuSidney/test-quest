# Requisitos e Escopo

## Legenda de estado

- **Implementado:** existe na base funcional atual.
- **A adaptar:** existe, mas deverá ser ajustado aos novos layouts.
- **Planejado:** aprovado para a próxima etapa.
- **Futuro:** fora do ciclo atual.

## Requisitos funcionais

| Código | Requisito | Estado |
|---|---|---|
| RF01 | Importar questões por texto colado | Implementado |
| RF02 | Importar questões por arquivo `.txt` | Implementado |
| RF03 | Validar o formato antes de iniciar | Implementado |
| RF04 | Exibir contadores de questões, objetivas, discursivas e assuntos | Implementado |
| RF05 | Resolver questões objetivas com alternativas A–E | Implementado |
| RF06 | Resolver questões discursivas curtas | Implementado |
| RF07 | Salvar respostas automaticamente no navegador | Implementado |
| RF08 | Retomar uma sessão salva pela Tela Inicial | Implementado |
| RF09 | Registrar o tempo individual de cada questão | Implementado |
| RF10 | Pausar e retomar o temporizador | Implementado |
| RF11 | Interromper a contagem fora da Tela de Resolução | Implementado |
| RF12 | Registrar anotações independentes por questão | Implementado |
| RF13 | Marcar e desmarcar questões para revisão | Implementado |
| RF14 | Navegar pelo mapa de questões | Implementado |
| RF15 | Corrigir automaticamente questões objetivas | Implementado |
| RF16 | Exibir resposta esperada e critérios das discursivas | Implementado |
| RF17 | Exibir desempenho geral e por assunto | A adaptar |
| RF18 | Exportar respostas em `.txt` | Implementado |
| RF19 | Exportar anotações em `.txt` | Implementado |
| RF20 | Exportar a sessão completa em `.json` | Implementado |
| RF21 | Alternar entre tema claro e escuro | Implementado |
| RF22 | Exibir o modelo aceito em modal | Implementado |
| RF23 | Exibir uma Tela Inicial com sessão ativa e indicadores | Implementado |
| RF24 | Permitir iniciar nova resolução pela Tela Inicial | Implementado |
| RF25 | Permitir marcações auxiliares nas alternativas objetivas | Planejado |
| RF26 | Separar marcação auxiliar da resposta oficial | Planejado |
| RF27 | Filtrar questões no Resultado Final | Planejado |
| RF28 | Expandir apenas um card de revisão por vez | Planejado |
| RF29 | Exibir card objetivo expandido com resposta, gabarito e explicação | Planejado |
| RF30 | Exibir card discursivo expandido com resposta esperada e critérios | Planejado |
| RF31 | Exibir indicadores históricos de sessões concluídas | Implementado |
| RF32 | Exibir desempenho histórico sem incluir a sessão em andamento | Implementado |
| RF33 | Exportar sem alterar o estado da sessão | Implementado |
| RF34 | Confirmar finalização com questões pendentes | Implementado |
| RF35 | Exibir estado vazio em filtros sem resultados | Planejado |

## Requisitos não funcionais

| Código | Requisito |
|---|---|
| RNF01 | A aplicação deve funcionar como projeto estático |
| RNF02 | A interface deve permanecer legível em sessões longas |
| RNF03 | O `body` não deve possuir rolagem global |
| RNF04 | Rolagens devem existir somente em áreas internas necessárias |
| RNF05 | Os dados não devem ser enviados a servidores externos |
| RNF06 | A aplicação deve funcionar em navegadores modernos |
| RNF07 | O código deve seguir a estrutura do Modelo de Projeto |
| RNF08 | Migrações visuais não devem apagar dados existentes |
| RNF09 | Cores semânticas devem ser acompanhadas por texto ou ícone |
| RNF10 | Controles devem possuir foco visível |
| RNF11 | Áreas clicáveis devem ter aproximadamente 44 × 44 px |
| RNF12 | A interface deve respeitar `prefers-reduced-motion` |
| RNF13 | O temporizador não deve somar tempo com aba oculta |
| RNF14 | Apenas um card de resultado deve permanecer expandido |
| RNF15 | O projeto deve funcionar por Live Server ou servidor estático |
| RNF16 | O projeto deve permanecer versionado em Git |
| RNF17 | `main` deve preservar versões estáveis e `dev` receber desenvolvimento |
| RNF18 | Alterações de tela devem ser implementadas e testadas separadamente |
| RNF19 | O esquema do `localStorage` deve possuir versão |
| RNF20 | Dados legados devem ser migrados ou preservados |

## Escopo do ciclo atual

### Incluído

- documentação das quatro telas;
- implementação da Tela Inicial;
- implementação da Importação e Validação;
- implementação da Resolução objetiva e discursiva;
- implementação do Resultado Final;
- aplicação integral da identidade visual;
- adaptação do fluxo de sessão salva;
- marcações auxiliares das alternativas;
- filtros e expansão dos cards de resultado;
- preservação das exportações;
- revisão de acessibilidade;
- testes em desktop, tablet e mobile.

### Fora do ciclo atual

- contas de usuário;
- banco de dados remoto;
- sincronização em nuvem;
- correção automática por inteligência artificial;
- compartilhamento de listas dentro da aplicação;
- histórico avançado com gráficos por período;
- colaboração em tempo real;
- editor visual de questões;
- PWA completa.

## Critérios de conclusão do ciclo

- telas equivalentes aos layouts aprovados;
- fluxo completo sem erros críticos;
- dados locais preservados;
- testes essenciais aprovados;
- documentação atualizada;
- Pull Request de `dev` para `main` revisado.
