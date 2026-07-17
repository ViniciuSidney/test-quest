# Roadmap

## Estado geral

**Versão estável:** `v0.3.0`  
**Versão em desenvolvimento:** `v0.4-dev`  
**Estado:** `consolidação técnica em andamento`

Concluído:

- migração para o Modelo de Projeto;
- Git e GitHub configurados;
- branches `main` e `dev`;
- identidade visual oficial;
- layouts das cinco telas;
- manuais estruturais.

---

# Marco 1 — Base funcional e organização

## v0.2.5-dev — Estrutura e estabilidade

**Status:** concluído como base de desenvolvimento.

Incluído:

- `localStorage`;
- temporizador;
- anotações;
- tema;
- revisão;
- exportações;
- layout fixo;
- migração estrutural;
- documentação inicial.

---

# Marco 2 — Implementação das telas oficiais

## v0.3.0 — Interface e experiência

**Status:** Concluída

### Objetivo

Substituir as telas atuais pelas cinco telas aprovadas sem perder funcionalidades.

### Etapas

1. implementar Tela Inicial — **concluído**;
2. implementar Importação e Validação — **concluído**;
3. implementar Resolução — **concluído**;
4. implementar Tela de Desempenho — **concluído**;
5. implementar Resultado Final — **concluído**;
6. padronizar modais;
7. preservar IDs ou atualizar HTML/JS em conjunto.

### Entregue até esta etapa

- gerenciador central de telas;
- Home responsiva;
- continuação de sessão;
- início de nova resolução;
- histórico local de sessões concluídas;
- indicadores históricos;
- retorno seguro à Home;
- interrupção do temporizador fora da Resolução;
- Tela de Importação e Validação responsiva;
- estados completos de validação;
- contadores definitivos após validação;
- início bloqueado para conteúdo inválido ou alterado;
- parser isolado em módulo próprio;
- relatório de múltiplos problemas de importação;
- modal do modelo com foco restaurado.
- Tela de Resolução objetiva e discursiva responsiva;
- resposta oficial separada das marcações auxiliares;
- mapa com estados acessíveis;
- pausa do temporizador persistida;
- finalização sempre confirmada por modal customizado;
- testes unitários das regras de marcação;
- Tela de Desempenho com seis estados dinâmicos;
- fluxo direto para o Resultado Final em sessões somente discursivas;
- testes de fronteira das faixas de desempenho;
- Resultado Final com indicadores gerais e por assunto;
- filtros de revisão e estados vazios;
- cards objetivos e discursivos expansíveis;
- apenas um card expandido por vez;
- exportações preservadas.

### Funcionalidades novas

- indicadores históricos;
- sessão ativa na Tela Inicial;
- marcações auxiliares nas alternativas;
- filtros no resultado;
- cards expansíveis;
- estados vazios;
- melhor separação entre resposta e anotação.

### Critérios

- cada tela entra em commit separado;
- testes executados após cada tela;
- nenhum dado local perdido;
- `main` permanece estável.

---

# Marco 3 — Modularização e migração de dados

## v0.4-dev — Arquitetura, persistência e confiabilidade

**Status:** Em desenvolvimento

### Objetivo

Reduzir a concentração de responsabilidades, proteger os dados locais e preparar a aplicação para receber novos modos de resolução sem regressões.

### Etapa 1 — Persistência versionada — concluída

- esquema de sessão `schemaVersion: 3`;
- chave atual `testQuest.state`;
- configurações em `testQuest.settings`;
- migração automática das chaves `resolvedorQuestoesV2.*`;
- backup limitado das cargas migradas;
- isolamento de JSON inválido ou sessão incompatível;
- validação e normalização de questões, respostas, tempos, revisão e marcadores;
- histórico atualizado para o esquema 2;
- deduplicação de sessões concluídas;
- controlador sem acesso direto ao `localStorage`;
- testes de esquema, repositórios, configurações e histórico.

### Etapa 2 — Modularização complementar — próxima

- separar ciclo de vida da sessão do controlador visual;
- centralizar cálculo de resultado;
- centralizar formatação de tempo e datas;
- separar geração de arquivos e downloads;
- organizar mensagens e confirmações;
- reduzir o tamanho do controlador principal sem alterar o comportamento.

### Etapa 3 — Confiabilidade e fechamento

- testes de restauração após recarregamento;
- testes de migração com dados reais da v0.3;
- teste de armazenamento indisponível ou cheio;
- regressão dos cinco fluxos de tela;
- atualização final da documentação;
- release v0.4.0.

---

# Marco 4 — Modos de resolução e revisão

## v0.5-dev — Flexibilidade de estudo

### Objetivo

Ampliar as formas de responder, corrigir e refazer questões.

### Planejado

- gabarito após cada questão;
- embaralhamento de alternativas com IDs estáveis;
- questões de verdadeiro ou falso;
- opção manual para reduzir efeitos visuais;
- criar nova sessão somente com questões erradas;
- integração dos novos modos com histórico, exportações e Resultado Final.

---

# Primeira versão estável

## v1.0 — Test Quest

Critérios:

- arquitetura consolidada;
- modos essenciais de resolução implementados;
- fluxos principais sem bugs críticos;
- migrações de dados validadas;
- identidade visual aplicada;
- testes essenciais aprovados;
- documentação atualizada;
- funcionamento em desktop e mobile;
- publicação por GitHub Pages;
- tag e release no GitHub.

---

# Ideias futuras

- modo prova;
- modo estudo guiado;
- histórico detalhado;
- gráficos por período;
- banco local de listas;
- importação/exportação de pacotes;
- PWA;
- autocorreção assistida de discursivas;
- sincronização opcional;
- editor de questões.
