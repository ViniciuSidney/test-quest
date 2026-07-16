# Roadmap

## Estado geral

**Base funcional:** `v0.2.5-dev`  
**Ciclo atual:** preparação e implementação da próxima evolução visual.

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

## v0.3-dev — Fluxo visual completo

**Status:** em andamento.

### Objetivo

Substituir as telas atuais pelas cinco telas aprovadas sem perder funcionalidades.

### Etapas

1. implementar Tela Inicial — **concluído**;
2. implementar Importação e Validação — **concluído**;
3. implementar Resolução — **concluído**;
4. implementar Tela de Desempenho — **concluído**;
5. implementar Resultado Final — **próximo**;
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
- testes de fronteira das faixas de desempenho.

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

## v0.4-dev — Arquitetura e persistência

### Objetivo

Reduzir concentração de código e preparar evolução segura.

### Planejado

- separar features;
- ampliar o gerenciador interno de telas;
- versionar esquema do estado;
- migrar chaves legadas;
- evoluir o histórico de sessões e suas migrações;
- centralizar formatação de tempo;
- centralizar exportações;
- organizar modais;
- revisar tratamento de erros.

---

# Marco 4 — Testes e polimento

## v0.5 — Validação completa

### Planejado

- executar roteiro completo;
- testar sessões longas;
- testar conteúdo extenso;
- testar desktop, tablet e mobile;
- revisar acessibilidade;
- revisar contraste;
- revisar tema escuro;
- validar GitHub Pages;
- corrigir regressões;
- atualizar documentação.

---

# Primeira versão estável

## v1.0 — Test Quest

Critérios:

- cinco telas implementadas;
- fluxos principais sem bugs críticos;
- migração de dados validada;
- identidade visual aplicada;
- testes essenciais aprovados;
- documentação atualizada;
- funcionamento em desktop e mobile;
- publicação por GitHub Pages;
- tag e release no GitHub.

---

# Ideias futuras

- refazer questões erradas;
- modo prova;
- modo estudo;
- histórico detalhado;
- gráficos por período;
- banco local de listas;
- importação/exportação de pacotes;
- PWA;
- autocorreção assistida de discursivas;
- sincronização opcional;
- editor de questões.
