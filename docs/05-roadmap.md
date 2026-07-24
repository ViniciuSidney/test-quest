# Roadmap

## Estado geral

**Versão estável:** `v0.5.0`  
**Próxima versão:** a definir  
**Estado:** `Etapa 5 — refazer questões erradas concluída`

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

## v0.4.0 — Arquitetura, persistência e confiabilidade

**Status:** Concluída

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

### Etapa 2 — Modularização complementar — concluída

- ciclo de vida da sessão separado em `session-lifecycle.service.js`;
- criação, restauração, finalização, identificação e detecção de sessão ativa centralizadas;
- cálculo geral e tempo total centralizados em `results.service.js`;
- formatadores de tempo, duração histórica, datas, HTML e slugs centralizados;
- relatórios TXT, exportação JSON e download separados em `session-export.service.js`;
- mensagens das confirmações centralizadas em `session-confirmations.service.js`;
- controlador principal reduzido de 2310 para aproximadamente 2050 linhas;
- testes automatizados ampliados de 14 para 19 arquivos;
- interface, persistência e formato dos arquivos preservados.

### Etapa 3 — Confiabilidade e fechamento — implementação concluída

- teste integrado de restauração após recarregamento;
- teste de migração e recuperação em memória;
- classificação de armazenamento indisponível, cheio ou com falha desconhecida;
- aviso visual recuperável quando o salvamento falha;
- tentativa manual de restabelecer a persistência;
- proteção contra fechamento da página quando existe sessão não persistida;
- histórico passa a comunicar falhas de gravação ao controlador;
- regressão estrutural das cinco telas;
- suíte automatizada ampliada de 19 para 23 arquivos;
- documentação preparada para o fechamento.

### Fechamento da v0.4.0

- regressão automatizada concluída com 23 arquivos de teste;
- preparação manual aprovada para fechamento;
- `APP_VERSION`, changelog e status atualizados para `v0.4.0`;
- pacote final preparado para merge, tag e Release.

---

# Marco 4 — Modos de resolução e revisão

## v0.5.0 — Flexibilidade de resolução e estudo ativo

**Status:** Concluída e aprovada em 24/07/2026

### Objetivo

Ampliar as formas de responder, corrigir e revisar questões sem perder compatibilidade com as sessões existentes.

### Etapa 1 — Fundação de alternativas e respostas — concluída

- `APP_VERSION` atualizada para `0.5-dev`;
- esquema de sessão atualizado para `schemaVersion: 4`;
- alternativas objetivas convertidas de um mapa por letras para uma lista de objetos;
- cada alternativa recebe `id`, `chaveOriginal`, `texto` e `ordemOriginal`;
- gabarito objetivo passa a usar `respostaCorretaId` como referência canônica;
- respostas e marcações auxiliares passam a usar o ID estável da alternativa;
- sessões da v0.4 são migradas automaticamente;
- letras continuam sendo exibidas e exportadas para preservar a experiência atual;
- correção permanece válida mesmo quando a ordem das alternativas muda;
- testes automatizados ampliados para 26 arquivos.

### Etapa 2 — Embaralhamento de alternativas — concluída

- configuração própria na importação;
- reordenação somente das alternativas objetivas;
- ordem persistida dentro da sessão;
- gabarito, respostas e marcadores vinculados aos IDs estáveis;
- Resultado Final e exportações convertendo IDs para a letra visual atual;
- nova ordem gerada somente em uma nova sessão;
- orientação para explicações independentes de letras;
- testes automatizados ampliados para 28 arquivos.

### Etapa 3 — Verdadeiro ou Falso — concluída

- importação própria com `tipo: verdadeiro ou falso`;
- alternativas Verdadeiro e Falso geradas automaticamente;
- ordem fixa V → F, sem interferência do embaralhamento;
- tela de resolução específica e responsiva;
- Resultado Final com apresentação especial;
- guia de importação dividido por tipo;
- testes automatizados ampliados para 29 arquivos.


### Etapa 4 — Gabarito imediato por questão — concluída

- configuração de correção na tela de Importação;
- modo padrão mantém o gabarito somente no Resultado Final;
- modo imediato exige confirmação explícita da resposta;
- respostas objetivas, V/F e discursivas ficam bloqueadas após a confirmação;
- objetivas e V/F exibem acerto, erro, gabarito e explicação;
- discursivas exibem resposta esperada, critérios e Metacognição em 100%, 50% ou 0%;
- confirmações e autoavaliações persistem no `localStorage` e após a retomada da sessão;
- sessões anteriores migram para o modo de correção final;
- desempenho geral combina objetivas e discursivas avaliadas;
- esquema de sessão atualizado para `schemaVersion: 6`;
- testes automatizados ampliados para 34 arquivos.

### Etapa 5 — Refazer questões erradas — concluída

- ação própria no Resultado Final, exibida somente quando há erros elegíveis;
- nova sessão composta por objetivas e V/F incorretas;
- inclusão de discursivas avaliadas como `Resposta incorreta (0%)`;
- exclusão de questões não respondidas e discursivas parciais ou completas;
- respostas, confirmações, tempos, revisão, marcadores, anotações e metacognição reiniciados;
- conteúdo, gabarito e configurações da sessão preservados;
- sessão original mantida no histórico e nova tentativa registrada separadamente;
- filtro `Erradas` alinhado ao mesmo critério da revisão;
- suíte automatizada ampliada para 36 arquivos.

### Etapa 6 — Controle manual dos efeitos visuais — concluída

- preferência global com os modos Sistema, Completos e Reduzidos;
- aplicação persistida pelo repositório de configurações já existente;
- sincronização dinâmica com `prefers-reduced-motion` no modo Sistema;
- modo Completo capaz de manter os efeitos mesmo quando o sistema solicita redução;
- modo Reduzido removendo movimentos, fades, contador animado e rolagem suave;
- acesso ao modal pelos cabeçalhos das quatro telas navegáveis;
- controlador e serviço próprios para evitar nova concentração no controlador principal;
- suíte automatizada ampliada para 39 arquivos.

### Etapa 6.1 — Correção discursiva guiada — concluída

- Metacognição inicial separada do Veredito Final;
- nova tela Wizard entre Resolução e Desempenho no modo de gabarito ao final;
- comparação entre resposta do usuário, percepção inicial, modelo e critérios;
- progresso, validações, resumo e navegação por discursiva;
- pontuação oficial baseada somente no Veredito Final;
- retomada da correção pela Tela Inicial;
- migração segura para `schemaVersion: 7`;
- integração com Resultado Final, histórico, exportações e revisão de erros;
- suíte automatizada ampliada para 41 arquivos.

### Etapa 7 — Integração, regressão e fechamento — concluída

- regressão manual completa aprovada;
- 45 arquivos de teste automatizados aprovados;
- versão promovida de `0.5-dev` para `0.5.0`;
- README, roadmap, testes e changelog consolidados;
- checklist e notas oficiais da Release adicionados;
- pacote preparado para merge, tag e publicação.

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
