# Checklist de fechamento — Test Quest v0.5.0

**Data de aprovação:** 24/07/2026  
**Branch candidata:** `feature/v0.5`  
**Versão:** `0.5.0`  
**Esquema de sessão:** `schemaVersion: 7`  
**Situação:** aprovado para merge, tag e Release

## Aprovação funcional

- [x] importação e validação;
- [x] questões objetivas com IDs estáveis;
- [x] embaralhamento de questões e alternativas;
- [x] Verdadeiro ou Falso;
- [x] gabarito ao final;
- [x] gabarito imediato;
- [x] Metacognição inicial;
- [x] Veredito Final;
- [x] Correção Discursiva guiada;
- [x] desempenho geral e por assunto;
- [x] mapa semântico;
- [x] Resultado Final e filtros;
- [x] refazer questões erradas;
- [x] temas e efeitos visuais;
- [x] persistência e retomada;
- [x] histórico e exportações;
- [x] migração de sessões anteriores.

## Aprovação de qualidade

- [x] regressão manual aprovada pelo usuário;
- [x] 45 arquivos de teste automatizados aprovados;
- [x] nenhum bug bloqueador pendente;
- [x] nenhum bug importante pendente;
- [x] nenhuma perda de dados identificada;
- [x] responsividade e zoom validados;
- [x] documentação consolidada;
- [x] `APP_VERSION` promovida para `0.5.0`.

## Teste final

```bash
node tests/run-all-tests.mjs
```

Resultado esperado:

```text
✓ 45 arquivos de teste concluídos com sucesso.
```

## Commit de preparação

```bash
git status
git add .
git commit -m "chore: prepara release v0.5.0"
git push
```

## Merge na main

```bash
git switch main
git pull origin main
git merge --no-ff feature/v0.5 -m "release: publica Test Quest v0.5.0"
git push origin main
```

## Tag

```bash
git tag -a v0.5.0 -m "Test Quest v0.5.0"
git push origin v0.5.0
```

## Publicação

- [ ] criar a Release `v0.5.0` no GitHub;
- [ ] usar `24-notas-release-v0.5.0.md` como base;
- [ ] verificar o GitHub Pages após o merge;
- [ ] confirmar favicon, carregamento e fluxo básico em produção;
- [ ] remover a branch `feature/v0.5` somente após confirmar a publicação.
