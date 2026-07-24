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
Correção Discursiva, quando necessária
    ↓
Tela de Desempenho
    ↓
Resultado Final
    ↓
Tela Inicial
```

A Tela Inicial permite continuar uma sessão salva diretamente na Resolução ou na Correção Discursiva.

## Estado atual

**Versão estável:** `v0.5.0`  
**Status:** concluída e aprovada para publicação

A v0.5.0 consolida:

- alternativas com IDs estáveis;
- embaralhamento de alternativas;
- questões de Verdadeiro ou Falso;
- gabarito imediato opcional;
- Metacognição inicial e Veredito Final separados;
- Correção Discursiva guiada;
- revisão de questões erradas;
- controle manual de efeitos visuais;
- desempenho combinado e detalhamento por assunto;
- mapa semântico de resultados;
- migração de sessões para `schemaVersion: 7`;
- 45 arquivos de teste automatizados aprovados;
- regressão manual aprovada pelo usuário.

## Critérios de sucesso da v0.5

- sessões anteriores migradas sem perda de dados — aprovado;
- respostas e gabaritos preservados com embaralhamento — aprovado;
- fluxos de correção final e imediata concluídos — aprovado;
- Correção Discursiva retomável e persistente — aprovado;
- desempenho baseado no Veredito Final — aprovado;
- revisão de erros selecionando apenas questões elegíveis — aprovado;
- temas, efeitos visuais, responsividade e zoom validados — aprovado;
- exportações, histórico e persistência validados — aprovado;
- suíte automatizada com 45 arquivos aprovada — aprovado.

## Limites atuais

- não há backend ou sincronização entre dispositivos;
- as discursivas dependem de revisão manual;
- os dados ficam no navegador por meio do `localStorage`;
- a arquitetura JavaScript ainda mantém parte da lógica concentrada;
- o histórico atual registra resumos locais, mas ainda não possui visualização detalhada de sessões;
- as telas oficiais, incluindo a Correção Discursiva, estão implementadas e integradas;
- novas expansões permanecem reservadas para ciclos posteriores.
