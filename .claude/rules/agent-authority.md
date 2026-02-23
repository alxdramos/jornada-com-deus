# Agent Authority — Detailed Rules

## Delegation Matrix

### @devops (Gage) — EXCLUSIVE Authority

| Operation | Exclusive? | Other Agents |
|-----------|-----------|--------------|
| `git push` / `git push --force` | YES | BLOCKED |
| `gh pr create` / `gh pr merge` | YES | BLOCKED |
| MCP add/remove/configure | YES | BLOCKED |
| CI/CD pipeline management | YES | BLOCKED |
| Release management | YES | BLOCKED |

### @pm (Morgan) — Epic Orchestration

| Operation | Exclusive? | Delegated From |
|-----------|-----------|---------------|
| `*execute-epic` | YES | — |
| `*create-epic` | YES | — |
| EPIC-{ID}-EXECUTION.yaml management | YES | — |
| Requirements gathering | YES | — |
| Spec writing (spec pipeline) | YES | — |

### @po (Pax) — Story Validation

| Operation | Exclusive? | Details |
|-----------|-----------|---------|
| `*validate-story-draft` | YES | 10-point checklist |
| Story context tracking in epics | YES | — |
| Epic context management | YES | — |
| Backlog prioritization | YES | — |

### @sm (River) — Story Creation

| Operation | Exclusive? | Details |
|-----------|-----------|---------|
| `*draft` / `*create-story` | YES | From epic/PRD |
| Story template selection | YES | — |

### @dev (Dex) — Implementation

| Allowed | Blocked |
|---------|---------|
| `git add`, `git commit`, `git status` | `git push` (delegate to @devops) |
| `git branch`, `git checkout`, `git merge` (local) | `gh pr create/merge` (delegate to @devops) |
| `git stash`, `git diff`, `git log` | MCP management |
| Story file updates (File List, checkboxes) | Story file updates (AC, scope, title) |

### @architect (Aria) — Design Authority

| Owns | Delegates To |
|------|-------------|
| System architecture decisions | — |
| Technology selection | — |
| High-level data architecture | @data-engineer (detailed DDL) |
| Integration patterns | @data-engineer (query optimization) |
| Complexity assessment | — |

### @data-engineer (Dara) — Database

| Owns (delegated from @architect) | Does NOT Own |
|----------------------------------|-------------|
| Schema design (detailed DDL) | System architecture |
| Query optimization | Application code |
| RLS policies implementation | Git operations |
| Index strategy execution | Frontend/UI |
| Migration planning & execution | — |

### @aios-master — Framework Governance

| Capability | Details |
|-----------|---------|
| Execute ANY task directly | No restrictions |
| Framework governance | Constitutional enforcement |
| Override agent boundaries | When necessary for framework health |

## Cross-Agent Delegation Patterns

### Git Push Flow
```
ANY agent → @devops *push
```

### REGRA OBRIGATÓRIA: Protocolo de Push Seguro (@devops)

**CRÍTICO:** Nunca executar `git push` diretamente. SEMPRE seguir esta sequência exata:

```bash
# 1. Salvar mudanças locais pendentes
git add -A
git stash

# 2. Sincronizar com o remote (rebase evita merge commits)
git pull origin main --rebase

# 3. Restaurar mudanças salvas
git stash pop

# 4. Adicionar e commitar (se houver mudanças pendentes)
git add -A
git commit -m "mensagem do commit"

# 5. Agora sim fazer o push
git push origin main
```

**Motivo:** O remote pode ter commits novos desde o último pull local. Push direto sem rebase causa rejeição (`[rejected] fetch first`).

**Se der conflito no `stash pop`:** Resolver o conflito manualmente e continuar com `git push origin main`.

### Schema Design Flow
```
@architect (decides technology) → @data-engineer (implements DDL)
```

### Story Flow
```
@sm *draft → @po *validate → @dev *develop → @qa *qa-gate → @devops *push
```

### Epic Flow
```
@pm *create-epic → @pm *execute-epic → @sm *draft (per story)
```

## Escalation Rules

1. Agent cannot complete task → Escalate to @aios-master
2. Quality gate fails → Return to @dev with specific feedback
3. Constitutional violation detected → BLOCK, require fix before proceed
4. Agent boundary conflict → @aios-master mediates
