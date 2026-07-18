# Checklist de fechamento — Test Quest v0.4.0

## Estado da candidata

- código da Etapa 3 concluído;
- 23 arquivos automatizados aprovados;
- sintaxe de JavaScript validada;
- IDs duplicados: nenhum;
- estrutura CSS validada;
- regressão manual final pendente.

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

Após a aprovação manual:

1. alterar `APP_VERSION` de `0.4-dev` para `0.4.0`;
2. mover o conteúdo de `[Não lançado]` para `[v0.4.0]` no changelog;
3. marcar a v0.4 como concluída no roadmap e README;
4. registrar os testes manuais como `OK` em `06-testes.md`;
5. preencher o registro final de `tests/manual-tests.md`.

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
