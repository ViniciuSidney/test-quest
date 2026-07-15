# Requisitos e Escopo

## Requisitos funcionais

- **RF01** — Importar questões por texto colado.
- **RF02** — Importar questões a partir de arquivo `.txt`.
- **RF03** — Validar o formato da lista antes de iniciar.
- **RF04** — Resolver questões objetivas com alternativas de A a E.
- **RF05** — Resolver questões discursivas curtas.
- **RF06** — Salvar respostas automaticamente no navegador.
- **RF07** — Retomar uma sessão salva.
- **RF08** — Registrar o tempo individual de cada questão.
- **RF09** — Pausar e retomar o temporizador.
- **RF10** — Registrar anotações por questão.
- **RF11** — Marcar e desmarcar questões para revisão.
- **RF12** — Navegar pelo mapa de questões.
- **RF13** — Corrigir automaticamente questões objetivas.
- **RF14** — Exibir resposta esperada e critérios das discursivas.
- **RF15** — Exibir desempenho geral e por assunto.
- **RF16** — Exportar respostas em `.txt`.
- **RF17** — Exportar anotações em `.txt`.
- **RF18** — Exportar a sessão completa em `.json`.
- **RF19** — Alternar entre tema claro e escuro.
- **RF20** — Exibir o modelo de importação em modal.

## Requisitos não funcionais

- **RNF01** — A aplicação deve funcionar como projeto estático.
- **RNF02** — A interface deve permanecer legível em sessões longas.
- **RNF03** — O conteúdo principal deve permanecer dentro da visualização, com rolagem apenas em regiões internas necessárias.
- **RNF04** — Os dados não devem ser enviados a servidores externos.
- **RNF05** — A aplicação deve funcionar em navegadores modernos.
- **RNF06** — O código deve seguir a estrutura do Modelo de Projeto.
- **RNF07** — As alterações estruturais não devem quebrar os IDs usados pela interface.
- **RNF08** — As cores semânticas devem ser acompanhadas por texto, ícone ou outro indicador.
- **RNF09** — O projeto deve ser executável por Live Server ou servidor estático equivalente.
- **RNF10** — O código deve ser preparado para versionamento com Git.

## Escopo da versão atual

### Incluído

- migração da pasta para o Modelo de Projeto;
- preservação do fluxo funcional da versão atual;
- entrada JavaScript por ES Modules;
- documentação inicial do projeto;
- tokens oficiais da identidade visual disponíveis;
- preparação da estrutura para Git.

### Próxima etapa

- validar toda a aplicação depois da migração;
- separar gradualmente CSS e JavaScript por responsabilidade;
- aplicar integralmente a identidade visual do Test Quest;
- adicionar o ícone oficial aos arquivos públicos;
- fechar uma versão testável antes da criação da primeira release.

### Fora do escopo atual

- contas de usuário;
- banco de dados remoto;
- sincronização em nuvem;
- correção automática por inteligência artificial;
- painel administrativo;
- compartilhamento de listas dentro da aplicação.
