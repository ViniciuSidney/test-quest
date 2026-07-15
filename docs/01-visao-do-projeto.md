# Visão do Projeto

## Nome do projeto

**Test Quest**

## Slogan

**Now I Know.**

## Mensagem central

**Resolver, compreender e avançar.**

## Ideia principal

O Test Quest é uma aplicação de estudo ativo voltada à resolução de questões objetivas e discursivas. O estudante importa uma lista, valida seu formato, responde às questões, registra anotações, acompanha o tempo utilizado e revisa o desempenho ao final.

## Problema que resolve

Listas de questões em texto normalmente exigem que o estudante organize manualmente respostas, tempo, correção, anotações e revisão. O Test Quest reúne esse fluxo em uma interface única, local e reutilizável.

## Objetivo principal

Ajudar o estudante a transformar a resolução de questões em um processo de compreensão, acompanhamento e revisão, e não apenas em uma contagem de acertos.

## Objetivos específicos

- reduzir o esforço de organizar listas de questões;
- permitir acompanhamento individual do tempo;
- separar resposta oficial de anotações e raciocínio auxiliar;
- destacar assuntos que precisam de revisão;
- preservar o progresso localmente;
- permitir exportação dos dados da sessão;
- oferecer uma experiência consistente em questões objetivas e discursivas.

## Público-alvo

- estudantes do ensino médio, técnico e superior;
- pessoas que estudam para avaliações e concursos;
- usuários que produzem ou recebem listas de questões em texto;
- estudantes que valorizam organização e estudo ativo.

## Diferenciais

- funciona localmente e sem servidor próprio;
- aceita um formato textual simples e legível;
- reúne objetivas e discursivas na mesma sessão;
- registra tempo, anotações e questões marcadas;
- permite marcações auxiliares nas alternativas objetivas;
- apresenta desempenho geral e por assunto;
- possui revisão detalhada no resultado;
- exporta respostas, anotações e a sessão;
- prioriza clareza, progresso e compreensão.

## Princípios do produto

- **clareza:** o próximo passo deve ser evidente;
- **progresso:** a interface deve mostrar avanço e continuidade;
- **compreensão:** o resultado deve apoiar a revisão dos motivos por trás das respostas;
- **estabilidade:** a interface não deve mudar de forma imprevisível;
- **privacidade:** os dados permanecem no dispositivo do usuário;
- **manutenção:** o projeto deve evoluir por etapas pequenas e testáveis.

## Fluxo oficial

```text
Tela Inicial
    ↓
Importação e Validação
    ↓
Resolução
    ↓
Resultado Final
    ↓
Tela Inicial
```

A Tela Inicial também permite continuar uma sessão salva diretamente na Tela de Resolução.

## Estado atual

**Base funcional:** `v0.2.5-dev`  
**Ciclo em desenvolvimento:** `v0.3-dev`

**Fase do projeto:** implementação gradual das quatro telas oficiais.

Concluído:

- estrutura baseada no Modelo de Projeto;
- Git inicializado;
- repositório remoto publicado;
- branches `main` e `dev` configuradas;
- identidade visual documentada;
- layouts das quatro telas aprovados;
- manuais estruturais concluídos;
- Tela Inicial oficial implementada;
- Tela de Importação e Validação oficial implementada;
- estados completos de validação e contadores implementados;
- parser de importação separado;
- navegação centralizada entre as quatro telas;
- histórico local e indicadores de sessões concluídas implementados.

Próxima etapa:

- implementar a nova Tela de Resolução;
- preservar a lógica funcional existente;
- avançar depois para o Resultado Final;
- executar testes após cada etapa.

## Critérios de sucesso da próxima etapa

- quatro telas implementadas conforme os manuais;
- nenhuma perda de respostas, anotações ou tempos;
- temporizador ativo somente durante a resolução;
- ausência de rolagem global e sobreposições;
- tema claro e escuro consistentes;
- fluxo completo validado na branch `dev`.

## Limites atuais

- não há backend ou sincronização entre dispositivos;
- as discursivas dependem de revisão manual;
- os dados ficam no navegador por meio do `localStorage`;
- a arquitetura JavaScript ainda mantém parte da lógica concentrada;
- o histórico atual registra resumos locais, mas ainda não possui visualização detalhada de sessões;
- a Tela Inicial e a Importação estão implementadas, enquanto Resolução e Resultado ainda usam a estrutura legada;
- modais e confirmações terão seus layouts refinados depois das telas principais.
