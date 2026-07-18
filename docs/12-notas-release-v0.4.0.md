# Notas da Release — Test Quest v0.4.0

**Data:** 2026-07-18  
**Tema da versão:** Arquitetura, persistência e confiabilidade

## Resumo

A v0.4.0 consolida a base interna do Test Quest sem alterar o fluxo visual aprovado na v0.3.0. O foco foi tornar sessões, histórico, configurações e exportações mais seguros, modularizar responsabilidades do controlador principal e ampliar a cobertura de testes.

## Principais entregas

- sessão ativa com esquema versionado e migração automática;
- recuperação segura de dados legados, inválidos ou incompatíveis;
- backups locais limitados durante migrações;
- repositórios próprios para sessão e configurações;
- histórico normalizado e sem duplicações;
- ciclo de vida da sessão separado da interface;
- cálculo de resultados centralizado;
- formatadores e exportações modularizados;
- identificação de armazenamento indisponível, cheio ou com falha;
- aviso recuperável de falha no salvamento;
- proteção contra fechamento quando existem dados não persistidos;
- suíte automatizada com 23 arquivos de teste;
- teste integrado do ciclo completo da sessão.

## Compatibilidade

A versão preserva automaticamente sessões e configurações salvas nas chaves legadas da v0.3.0. Quando uma migração não pode ser gravada, os dados antigos permanecem preservados e a sessão continua disponível em memória na aba atual.

## Validação

- 23 arquivos de teste automatizado aprovados;
- sintaxe dos módulos JavaScript validada;
- estrutura das cinco telas preservada;
- regressão de fechamento aprovada para publicação.

## Próximo ciclo planejado

A v0.5 será dedicada a modos de resolução e revisão:

- gabarito após cada questão;
- embaralhamento de alternativas;
- questões de verdadeiro ou falso;
- opção manual para reduzir efeitos visuais;
- nova sessão com questões erradas.
