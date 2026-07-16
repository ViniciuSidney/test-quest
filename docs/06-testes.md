# Testes

## Informações

**Projeto:** Test Quest  
**Base:** v0.2.5-dev  
**Fase:** implementação das telas oficiais  
**Status geral:** pendente

## Legenda

- `Pendente`
- `OK`
- `Falhou`
- `Bloqueado`

---


## Pré-validação técnica da Importação — 2026-07-15

Foram executados testes automatizados antes da entrega do pacote:

- parser com lista objetiva e discursiva válida;
- coleta de múltiplos erros;
- exemplo interno;
- arquivo TXT;
- estados inicial, pendente, válido e inválido;
- invalidação após edição;
- botão Começar bloqueado e habilitado;
- criação da sessão;
- modal aberto e fechado com `Escape`;
- restauração de foco;
- tema claro e escuro;
- desktop, tablet e mobile;
- ausência de IDs duplicados;
- console sem erros durante o fluxo testado.

Teste unitário disponível:

```bash
node tests/import-parser.test.mjs
```

Os testes manuais da tabela continuam necessários no computador do usuário antes do commit definitivo.

---


## Pré-validação técnica da Resolução — 2026-07-15

Foram executadas verificações automatizadas antes da entrega do pacote:

- sintaxe de todos os módulos JavaScript;
- IDs obrigatórios e ausência de IDs duplicados;
- importação do novo CSS da Resolução;
- ciclo dos marcadores `neutro → analise → eliminada → neutro`;
- normalização de estados legados em inglês;
- separação entre resposta oficial e marcação auxiliar;
- rótulos acessíveis do mapa;
- estado respondido de objetivas e discursivas;
- persistência do estado pausado do temporizador;
- confirmação de finalização com resumo da sessão;
- composição visual estática em desktop, tablet e mobile;
- versões objetiva e discursiva sem sobreposição estrutural.

Testes disponíveis:

```bash
node tests/resolution-state.test.mjs
node tests/resolution-structure.test.mjs
```

Os testes manuais da tabela continuam necessários no navegador antes do commit definitivo.

---

# Carregamento e estrutura

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T01 | Abrir por Live Server | Aplicação carrega sem erro de módulo | Pendente |
| T02 | Console inicial | Nenhum erro crítico | Pendente |
| T03 | Recarregar página | Estado e tema são restaurados | Pendente |
| T04 | Estrutura Git | `main` e `dev` sincronizadas com remotos | Pendente |

# Tela Inicial

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T05 | Primeiro acesso | Bloco de continuar fica oculto | Pendente |
| T06 | Nova resolução | Abre Importação e Validação | Pendente |
| T07 | Sessão ativa | Nome, progresso e tempo aparecem | Pendente |
| T08 | Continuar resolução | Restaura a sessão | Pendente |
| T09 | Nova sessão com ativa | Exibe confirmação | Pendente |
| T10 | Indicadores históricos | Valores consideram sessões concluídas | Pendente |
| T11 | Sessão ativa no histórico | Não é contabilizada | Pendente |
| T12 | Nome longo | Não transborda | Pendente |

# Importação e Validação

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T13 | Carregar exemplo | Conteúdo e nome são preenchidos | Pendente |
| T14 | Selecionar TXT | Conteúdo aparece na textarea | Pendente |
| T15 | Nome do arquivo | Nome é exibido sem transbordar | Pendente |
| T16 | Validar lista correta | Contadores e sucesso aparecem | Pendente |
| T17 | Lista inválida | Erros indicam bloco e campo | Pendente |
| T18 | Editar após validar | Estado volta a pendente | Pendente |
| T19 | Botão Começar inválido | Permanece desabilitado | Pendente |
| T20 | Botão Começar válido | Cria a sessão | Pendente |
| T21 | Limpar | Restaura o estado inicial | Pendente |
| T22 | Modal do modelo | Abre e fecha por todos os meios | Pendente |
| T22.1 | Ações abaixo de 820px | Todos os botões permanecem dentro do painel | Pendente |
| T22.2 | Cabeçalho fixo abaixo de 820px | Permanece destacado e legível durante a rolagem | Pendente |

# Resolução comum

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T23 | Primeira questão | Dados corretos aparecem | Pendente |
| T24 | Navegar pelo mapa | Questão correta é aberta | Pendente |
| T25 | Anterior na primeira | Botão desabilitado | Pendente |
| T26 | Próxima na última | É substituída por Finalizar | Pendente |
| T27 | Marcar revisão | Botão, selo e mapa atualizam | Pendente |
| T28 | Anotações | Persistem por questão | Pendente |
| T29 | Restaurar sessão | Estado completo é recuperado | Pendente |

# Objetivas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T30 | Selecionar card | Define resposta oficial | Pendente |
| T31 | Seleção única | Apenas uma resposta permanece | Pendente |
| T32 | Marcador em análise | Não altera resposta oficial | Pendente |
| T33 | Marcador eliminada | Estado é salvo | Pendente |
| T34 | Ciclo do marcador | Alterna conforme regra | Pendente |
| T35 | Restaurar marcações | Estados reaparecem | Pendente |
| T36 | Texto longo | Cards não transbordam | Pendente |

# Discursivas

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T37 | Digitar resposta | Texto é salvo | Pendente |
| T38 | Quebras de linha | São preservadas | Pendente |
| T39 | Trocar questão | Resposta permanece | Pendente |
| T40 | Campo longo | Rolagem interna funciona | Pendente |

# Temporizador

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T41 | Tempo por questão | Valor correto é associado | Pendente |
| T42 | Tempo total | Soma corretamente | Pendente |
| T43 | Pausar | Tempo deixa de aumentar | Pendente |
| T44 | Retomar | Contagem continua | Pendente |
| T45 | Voltar ao início | Tempo para | Pendente |
| T46 | Aba oculta | Intervalo não é somado | Pendente |
| T47 | Resultado aberto | Tempo não aumenta | Pendente |
| T48 | Recarregar | Tempos são restaurados | Pendente |

# Finalização e Resultado

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T49 | Finalizar com pendências | Confirmação exibe resumo | Pendente |
| T50 | Resultado geral | Indicadores corretos | Pendente |
| T51 | Somente discursivas | Desempenho mostra indisponível | Pendente |
| T52 | Por assunto | Acertos e tempos corretos | Pendente |
| T53 | Assunto sem objetiva | Não mostra 0% | Pendente |
| T54 | Filtro Todas | Exibe todos os cards | Pendente |
| T55 | Filtro Erradas | Exibe somente incorretas | Pendente |
| T56 | Filtro Discursivas | Exibe discursivas | Pendente |
| T57 | Filtro Revisão | Exibe marcadas | Pendente |
| T58 | Filtro Não respondidas | Exibe pendentes | Pendente |
| T59 | Filtro vazio | Exibe estado vazio | Pendente |
| T60 | Expandir card | Ocupa largura total | Pendente |
| T61 | Expandir outro card | Fecha o anterior | Pendente |
| T62 | Objetiva expandida | Mostra gabarito e explicação | Pendente |
| T63 | Discursiva expandida | Mostra resposta e critérios | Pendente |
| T64 | Não respondida | Não é chamada de incorreta | Pendente |

# Exportações

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T65 | Exportar respostas | TXT válido é baixado | Pendente |
| T66 | Exportar anotações | TXT separado é baixado | Pendente |
| T67 | Exportar sessão | JSON válido é baixado | Pendente |
| T68 | Acentuação | Caracteres são preservados | Pendente |
| T69 | Estado após exportar | Não é alterado | Pendente |

# Visual e responsividade

| Código | Teste | Resultado esperado | Status |
|---|---|---|---|
| T70 | Desktop | Sem rolagem global | Pendente |
| T71 | Tela baixa | Áreas internas continuam utilizáveis | Pendente |
| T72 | Tablet | Layout adapta sem compressão excessiva | Pendente |
| T73 | Mobile | Tela ativa usa rolagem interna | Pendente |
| T74 | Tema claro | Contraste adequado | Pendente |
| T75 | Tema escuro | Contraste adequado | Pendente |
| T76 | Foco de teclado | Visível em controles | Pendente |
| T77 | Redução de movimento | Preferência é respeitada | Pendente |
| T78 | Texto longo | Não causa transbordamento | Pendente |

## Regra para fechamento

A versão não pode ser enviada à `main` como estável enquanto houver:

- perda de respostas, anotações, tempos ou marcações;
- temporizador contando fora da resolução;
- importação inválida aceita;
- filtros incorretos;
- exportações inválidas;
- sobreposição de controles;
- erro de módulo;
- regressão grave de acessibilidade.
