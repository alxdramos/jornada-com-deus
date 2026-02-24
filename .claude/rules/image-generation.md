# Image Generation Rules — AIOS

## Regra Principal: Consultar o Picasso SEMPRE

**CRÍTICO:** Antes de qualquer geração de imagem, o agente ativo DEVE invocar o skill `picasso` para engenharia de prompt.

### Fluxo Obrigatório

```
Qualquer agente recebe pedido de imagem
    ↓
PARAR — NÃO gerar direto
    ↓
Invocar skill: picasso
    ↓
Picasso crafta o prompt completo (8 layers)
    ↓
Agente executa mcp__mcp-image__generate_image com o prompt do Picasso
    ↓
Salvar como .png (SEMPRE)
```

### Por que consultar o Picasso?

O Picasso garante:
- Prompts com os 8 layers (Subject, Environment, Lighting, Color Palette, Style, Composition, Mood, Quality Tags)
- Consistência visual entre sets de imagens
- Tradução automática para inglês (melhor resultado com o modelo Gemini)
- Nomenclatura correta dos arquivos

---

## Formato de Arquivo: SEMPRE PNG

**OBRIGATÓRIO:** Todas as imagens geradas via MCP devem ser salvas com extensão `.png`.

### Nomenclatura Correta

```
✅ stage-0-semente.png
✅ hero-banner-prayer.png
✅ app-icon-cross.png

❌ stage-0-semente.jpg
❌ stage-0-semente        (sem extensão)
❌ image_001.png          (não descritivo)
```

### Convenção de Nomes

- Usar **kebab-case** descritivo
- Incluir contexto: `{categoria}-{descrição}.png`
- Exemplos:
  - `tree-stage-0-semente.png`
  - `onboarding-step1-welcome.png`
  - `meditation-bg-starry-night.png`

---

## Parâmetros Padrão do MCP

```json
{
  "aspectRatio": "1:1",          // padrão para app; ajustar conforme contexto
  "imageSize": "2K",             // padrão; usar "4K" para imagens principais
  "fileName": "descricao.png",   // SEMPRE com .png
  "purpose": "descrever uso"     // ajuda o modelo a calibrar o estilo
}
```

---

## Onde Salvar as Imagens

| Contexto | Pasta |
|----------|-------|
| Estágios da árvore / gamificação | `public/images/tree-stages/` |
| Imagens gerais do app | `public/images/` |
| Banners / hero images | `public/images/banners/` |
| Ícones | `public/images/icons/` |

Após gerar, copiar de `/mnt/c/Users/User/Documents/Nano Banana/` para a pasta correta no projeto.

---

## Skill Reference

- **Skill:** `picasso` (disponível via Skill tool)
- **Arquivo:** `.claude/commands/AIOS/agents/picaso skill.md`
- **MCP:** `mcp__mcp-image__generate_image`
- **Output Dir:** `/mnt/c/Users/User/Documents/Nano Banana/`
