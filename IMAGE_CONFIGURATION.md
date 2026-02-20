# Configuração de Imagens para Orações

## Status Atual
As imagens estão usando **placeholders de fallback** do Unsplash enquanto você adiciona suas imagens personalizadas.

## Como Adicionar Suas Imagens

### Opção 1: Usar Google Drive (Recomendado)

1. **Abra cada imagem no Google Drive**
2. **Copie o ID da URL** (formato: `https://drive.google.com/file/d/{ID_AQUI}/view`)
3. **Atualize o arquivo** `src/hooks/useImageFallback.ts`:

```typescript
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Esperança": "https://drive.google.com/uc?export=view&id=SEU_ID_AQUI",
  "Paz": "https://drive.google.com/uc?export=view&id=SEU_ID_AQUI",
  // ... continue para outras categorias
};
```

### Opção 2: Usar Pasta Local

1. **Crie a pasta** `public/images/`
2. **Coloque suas imagens lá** (PNG, JPG, WebP)
3. **Atualize** `src/data/oracoes.ts`:

```typescript
{
  "id": "minha-oracao",
  "titulo": "Minha Oração",
  "imagem": {
    "background": "minha-imagem.png",  // Arquivo em public/images/
    "icon": "minha-imagem.png"
  }
}
```

## Como Funciona o Fallback

1. **Primeiro**: Tenta carregar a imagem local (`/public/images/{filename}`)
2. **Se falhar**: Tenta imagem da categoria no Drive
3. **Se falhar**: Usa gradiente padrão (`#10B981` verde)

## Próximas Etapas

- [ ] Preparar IDs das imagens do Drive (ou arquivos locais)
- [ ] Atualizar `useImageFallback.ts` com seus IDs
- [ ] Testar carregamento das imagens
- [ ] Verificar qualidade e dimensões

## URLs Unsplash Atuais (Placeholders)
- Esperança: Mountain landscape
- Paz: Ocean sunset
- Graças: Sky view
- Perdão: Forest path
- Força: Mountain peak
- Fé: Sunrise

**Substitua estas URLs pelas suas quando estiver pronto!**
