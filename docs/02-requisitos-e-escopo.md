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
| RF25 | Permitir marcações auxiliares nas alternativas objetivas | Implementado |
| RF26 | Separar marcação auxiliar da resposta oficial | Implementado |
| RF27 | Filtrar questões no Resultado Final | Implementado |
| RF28 | Expandir apenas um card de revisão por vez | Implementado |
| RF29 | Exibir card objetivo expandido com resposta, gabarito e explicação | Implementado |
| RF30 | Exibir card discursivo expandido com resposta esperada e critérios | Implementado |
| RF31 | Exibir indicadores históricos de sessões concluídas | Implementado |
| RF32 | Exibir desempenho histórico sem incluir a sessão em andamento | Implementado |
| RF33 | Exportar sem alterar o estado da sessão | Implementado |
| RF34 | Confirmar finalização com questões pendentes | Implementado |
| RF35 | Exibir estado vazio em filtros sem resultados | Implementado |
| RF36 | Exibir uma Tela de Desempenho entre a Resolução e o Resultado Final | Implementado |
| RF37 | Selecionar um dos seis estados visuais pela porcentagem objetiva | Implementado |
| RF38 | Usar uma única estrutura dinâmica para todos os estados de desempenho | Implementado |
| RF39 | Avançar da Tela de Desempenho para o Resultado Final pelo CTA principal | Implementado |
| RF40 | Pular a Tela de Desempenho quando a sessão não possuir objetivas | Implementado |
| RF41 | Migrar automaticamente sessões salvas pela v0.3 | Implementado |
| RF42 | Preservar backup da carga anterior antes da migração | Implementado |
| RF43 | Isolar dados locais incompatíveis sem interromper a aplicação | Implementado |
| RF44 | Migrar configurações legadas para o namespace atual | Implementado |
| RF45 | Deduplicar registros históricos pelo ID da sessão | Implementado |
| RF46 | Detectar armazenamento local indisponível ou sem espaço | Implementado |
| RF47 | Manter a sessão utilizável em memória quando a gravação falhar | Implementado |
| RF48 | Permitir nova tentativa de salvamento após uma falha | Implementado |

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
| RNF21 | O controlador principal não deve acessar `localStorage` diretamente |
| RNF22 | Sessões salvas devem ser validadas antes da restauração |
| RNF23 | Backups automáticos devem possuir limite de crescimento |
| RNF24 | Falhas críticas de inicialização devem apresentar uma recuperação visível |
| RNF25 | Novos esquemas devem possuir testes de migração e compatibilidade |
| RNF26 | Falhas de persistência não devem derrubar a aplicação |
| RNF27 | Migrações não devem remover dados legados antes da nova gravação ser confirmada |
| RNF28 | Sessões ativas sem persistência confirmada devem proteger o fechamento da página |

## Escopo do ciclo atual — v0.4

### Incluído

- versionamento do estado da sessão;
- migração automática das chaves antigas;
- backup de dados migrados e incompatíveis;
- validação e normalização antes da restauração;
- repositórios de sessão e configurações;
- evolução e deduplicação do histórico;
- remoção gradual de responsabilidades do controlador principal;
- centralização de resultados, formatadores e exportações;
- testes automatizados de persistência;
- operação degradada segura quando o armazenamento falhar;
- regressão funcional das cinco telas.

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

- sessões da v0.3 migradas e restauradas corretamente;
- dados corrompidos não impedem o carregamento da aplicação;
- nenhum acesso direto ao `localStorage` fora dos serviços de persistência;
- fluxo completo sem erros críticos;
- dados locais preservados;
- testes automatizados e manuais essenciais aprovados;
- documentação atualizada;
- Pull Request de `dev` para `main` revisado.
