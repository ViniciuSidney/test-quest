# Checklist de fechamento — Test Quest v0.4.0

## Estado final da candidata

- código da Etapa 3 concluído;
- 23 arquivos automatizados aprovados;
- sintaxe de JavaScript validada;
- IDs duplicados: nenhum;
- estrutura CSS validada;
- fechamento manual autorizado em 2026-07-18;
- pacote final preparado para publicação.

---

# 1. Preparação

Na branch `dev`:

```bash
git status
node tests/run-all-tests.mjs
```

O repositório deve estar limpo antes da regressão manual definitiva.

---

# 2. Regressão manual mínima

Executar pelo Live Server:

```text
Home
→ Importação e Validação
→ Resolução
→ Desempenho
→ Resultado Final
→ Home
```

Validar:

- resposta objetiva;
- resposta discursiva;
- anotação;
- revisão;
- pausa;
- recarregamento;
- continuação pela Home;
- filtros;
- cards expandidos;
- tema;
- TXT e JSON;
- histórico sem duplicação.

Dimensões mínimas:

```text
1920 × 1080
1366 × 768
900 × 720
390 × 844
```

Zoom:

```text
100%
125%
150%
```

---

# 3. Persistência degradada

No DevTools do navegador, bloquear temporariamente o armazenamento do site ou testar em um contexto no qual ele esteja indisponível.

Confirmar:

- aplicação continua abrindo;
- aviso de persistência aparece;
- sessão continua utilizável na aba atual;
- fechamento ou recarregamento recebe proteção quando existe sessão ativa;
- após restabelecer a permissão, **Tentar novamente** salva a sessão e remove o aviso.

---

# 4. Aprovação

Somente aprovar a release quando:

- nenhum dado for perdido;
- nenhum fluxo principal estiver bloqueado;
- nenhuma tela extrapolar a viewport nas dimensões mínimas;
- arquivos exportados abrirem corretamente;
- armazenamento normal funcionar sem aviso;
- armazenamento indisponível entrar em operação degradada segura.

---

# 5. Preparação final dos documentos

Preparação concluída:

- [x] `APP_VERSION` alterada de `0.4-dev` para `0.4.0`;
- [x] conteúdo consolidado em `[v0.4.0]` no changelog;
- [x] v0.4 marcada como concluída no roadmap e README;
- [x] testes de fechamento registrados em `06-testes.md`;
- [x] registro final incluído em `tests/manual-tests.md`;
- [x] notas oficiais da Release adicionadas em `12-notas-release-v0.4.0.md`.

---

# 6. Commit e publicação

Na `dev`:

```bash
git add .
git commit -m "chore: prepara release v0.4.0"
git push origin dev
```

Depois:

```bash
git switch main
git pull --ff-only origin main
git merge --no-ff dev -m "release: publica Test Quest v0.4.0"
node tests/run-all-tests.mjs
git push origin main
```

Criar a tag:

```bash
git tag -a v0.4.0 -m "Test Quest v0.4.0"
git push origin v0.4.0
```

Sincronizar a `dev`:

```bash
git switch dev
git merge main
git push origin dev
```
