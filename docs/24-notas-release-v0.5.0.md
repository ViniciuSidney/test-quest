# Notas da Release — Test Quest v0.5.0

**Data:** 24 de julho de 2026  
**Título sugerido no GitHub:** `Test Quest v0.5.0 — Modos de resolução e correção discursiva`

## Resumo

A v0.5.0 amplia o Test Quest de uma aplicação de resolução para um fluxo completo de tentativa, correção, autoavaliação e revisão. A versão adiciona novos tipos e modos de questão, separa a percepção inicial do resultado oficial das discursivas e melhora a leitura do desempenho.

## Novidades principais

- alternativas objetivas com IDs estáveis;
- embaralhamento seguro de alternativas;
- questões de Verdadeiro ou Falso;
- gabarito imediato opcional;
- Metacognição inicial e Veredito Final;
- Correção Discursiva guiada em formato Wizard;
- desempenho combinado entre objetivas e discursivas;
- revisão de questões erradas;
- detalhamento por assunto e por questão;
- mapa semântico dos resultados;
- preferência de efeitos visuais;
- identidade visual e favicons oficiais.

## Correção Discursiva

No modo de gabarito ao final, respostas discursivas passam por uma etapa própria antes do Desempenho. O estudante compara sua resposta com o modelo e os critérios, revê a percepção inicial e registra o Veredito Final de 100%, 50% ou 0%.

Somente o Veredito Final define a pontuação, o histórico e a inclusão na revisão de erros.

## Compatibilidade e dados

- sessões anteriores são migradas automaticamente;
- esquema atual: `schemaVersion: 7`;
- respostas objetivas antigas são convertidas para IDs estáveis;
- dados continuam armazenados localmente;
- exportações TXT e JSON permanecem legíveis e compatíveis com o fluxo atual.

## Qualidade

- regressão manual aprovada;
- 45 arquivos de teste automatizados aprovados;
- nenhum bug bloqueador ou importante pendente no fechamento.

## Limites conhecidos

- não há sincronização entre dispositivos;
- discursivas dependem da avaliação manual do usuário;
- o histórico ainda não oferece uma tela detalhada por sessão;
- o controlador da Resolução permanece como principal candidato à próxima refatoração arquitetural.

## Atualização

Não há instalador. Para publicar, faça o merge da branch `feature/v0.5` na `main`, crie a tag `v0.5.0` e confirme o GitHub Pages.
