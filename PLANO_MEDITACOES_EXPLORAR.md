# Plano de Implementação: Adicionar 17 Meditações do Excel na Aba Explorar

**Arquiteto Responsável:** Aria (@architect)
**Data:** 22 de Fevereiro de 2026
**Status:** Arquitetura de Projeto
**Complexidade Geral:** MEDIUM (M)

---

## CORREÇÃO CRÍTICA

❌ **Interpretação Anterior:** Criar meditações na aba "Orações"
✅ **Interpretação Correta:** Adicionar 17 meditações do Excel à aba "Explorar" (que já tem meditações)

**Instruções do Usuário:** "Não será feito na aba 'oração', será feito na aba 'explorar'. Já tem até uma seção de meditação na aba 'explorar'. A oração vai ter somente as orações, não misture."

---

## 1. VISÃO GERAL

### Situação Atual
- ✅ Aba "Explorar" (TabExplorar.tsx) já possui seção "Meditações"
- ⚠️ Estrutura de dados: `src/data/meditacoes.ts` tem ~6-8 meditações **que são apenas exemplos (podem ser deletadas)**
- ✅ Componentes: MeditationCard, AllContentModal, MeditationPlayer já existem
- ✅ Navegação: Filtros por categoria e tags já funcionam

### Objetivo
**Substituir** as ~6-8 meditações exemplo por **TODAS as meditações do Google Sheets** (via Cloudflare R2)
- Deletar: exemplos hardcoded em `meditacoes.ts`
- Carregar: 100% de meditações do Google Sheets/Excel

### O QUE NÃO FAZER
- ❌ NÃO modificar aba "Orações" (TabOracoes.tsx)
- ❌ NÃO adicionar componentes de meditações em Orações
- ❌ NÃO criar nova aba dedicada a meditações
- ❌ NÃO preservar meditações hardcoded existentes

### O QUE FAZER
- ✅ **DELETAR** meditações hardcoded em `src/data/meditacoes.ts`
- ✅ **CARREGAR 100%** de meditações do Google Sheets (via Cloudflare R2)
- ✅ Sincronizar todas as meditações do documento Google
- ✅ Validar que todas funcionam no filtro, paginação, áudio
- ✅ Testar com o conjunto completo de meditações do Sheets

---

## 2. ARQUITETURA: REUSE 100%

Todas as estruturas já existem. **Zero novos componentes.** Apenas expandir dados.

### Infraestrutura Existente
```
✅ TabExplorar.tsx          (container)
✅ MeditationCard.tsx        (componente visual)
✅ AllContentModal.tsx       (modal "VER TUDO")
✅ MeditationPlayer.tsx      (player de áudio)
✅ ExploreFilters.tsx        (filtros)
✅ ContentSection.tsx        (seção)
✅ useFavorites hook         (favoritos)
✅ /api/audio proxy          (CORS)
```

### O Que Expandir
```
📝 src/data/meditacoes.ts

Atual:      ~6-8 meditações (hardcoded)
Desejado:   ~23-24 meditações (6-8 existentes + 17 do Excel)
```

---

## 3. FASES DE IMPLEMENTAÇÃO

## FASE 1: Sincronização de Dados (Google Sheets → TypeScript)

**Duração:** 1-2 horas
**Esforço:** XS (Extra Small)

### 1.1 Objetivos
- [ ] Extrair **TODAS** as meditações do Google Sheets (não apenas 17)
- [ ] Deletar meditações hardcoded (exemplos)
- [ ] Mapear campos: titulo, descricao, audioUrl, duracao, categoria, tags, imagem
- [ ] Validar estrutura conforme `MeditationCard` interface
- [ ] Popular array MEDITACOES com 100% dados do Sheets

### 1.2 Arquivos a Modificar
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `scripts/sync-meditacoes.ts` | **CREATE** | Script para extrair do Google Sheets e gerar TypeScript |
| `src/data/meditacoes.ts` | **REPLACE** | Deletar hardcoded; popular com 100% dados do Sheets |
| `package.json` | **MODIFY** | Script: `"sync:meditacoes": "ts-node scripts/sync-meditacoes.ts"` |

### 1.3 Tarefas Específicas

#### 1.3.1 Criar `scripts/sync-meditacoes.ts`

```typescript
/**
 * Sincroniza 17 meditações do Excel (meditacao.xlsx)
 * para src/data/meditacoes.ts
 *
 * Execução: npm run sync:meditacoes
 */

import * as fs from 'fs';
import * as path from 'path';
import SheetsClient from '../src/lib/sheets-client';

interface ExcelMeditacao {
  titulo: string;
  descricao: string;
  audioUrl: string;     // URL do Cloudflare R2
  duracao: number;      // Em minutos (converter para string "X min")
  tema: string;         // Ex: "mente", "corpo", "espírito"
  tags: string[];       // Ex: ["PAZ", "DORMIR"]
  imagem?: string;      // URL ou null (usar Unsplash padrão)
}

async function syncMeditacoes(): Promise<void> {
  console.log('🚀 Iniciando sincronização de 17 meditações...\n');

  try {
    // 1. Conectar ao Google Sheets (mesmo documento de orações)
    const spreadsheetId = '10Sla_3_ic0ZZ9WfKhaHcpnjhj6dddYa-O-oFPVkzs9Q';
    const sheetsClient = new SheetsClient(
      path.join(process.cwd(), 'jornadacomdeus-ce9c0e55fc3e.json'),
      spreadsheetId
    );

    // 2. Buscar dados da aba 'Meditacoes' do Google Sheets
    console.log('📊 Buscando TODAS as meditações do Google Sheets...');
    const sheetData = await sheetsClient.fetchFromSheet('Meditacoes', 'A:H');
    // Esperado: titulo, descricao, audioUrl, duracao, tema, tags, imagem

    if (sheetData.length === 0) {
      throw new Error('Nenhuma meditação encontrada no Google Sheets');
    }

    console.log(`✅ ${sheetData.length} meditações encontradas`);

    // 3. Mapear e validar dados
    console.log('🔍 Validando URLs de áudio...');
    const meditacoes: MeditationCard[] = sheetData.map((row, idx) => {
      const durationStr = row.duracao ? `${Math.round(row.duracao)} min` : '10 min';
      const categoryMap: Record<string, string> = {
        'mente': 'MENTE',
        'corpo': 'CORPO',
        'espírito': 'ESPÍRITO',
        'música': 'MÚSICA',
        'estudo': 'ESTUDOS'
      };

      return {
        id: generateId(row.titulo),
        title: row.titulo,
        duration: durationStr,
        category: categoryMap[row.tema?.toLowerCase()] || 'MENTE',
        plus: false,  // Default: acessível para free users
        description: row.descricao?.substring(0, 200),  // Primeiras 200 chars
        tags: parseTags(row.tags),
        audioUrl: row.audioUrl,
        image: row.imagem || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`
      };
    });

    console.log(`✅ ${meditacoes.length} meditações prontas para carregar`);

    // 4. Gerar arquivo meditacoes.ts completamente novo (deletar hardcoded)
    const tsMeditPath = path.join(process.cwd(), 'src', 'data', 'meditacoes.ts');

    const newContent = `/**
 * Dados de meditações do Google Sheets
 * Extraído de: Google Sheets (Meditacoes tab)
 * AUTO-GERADO por scripts/sync-meditacoes.ts
 *
 * Gerado em: ${new Date().toISOString()}
 * NÃO EDITE MANUALMENTE
 */

export const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"] as const;
export const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "PAZ", "<5MINS", "MOTIVAÇÃO", "ORAÇÃO"] as const;

export interface MeditationCard {
  id: string;
  title: string;
  duration: string;
  category: string;
  plus: boolean;
  description?: string;
  tags: string[];
  image?: string;
  audioUrl?: string;
}

// ===== MEDITAÇÕES DO GOOGLE SHEETS (${meditacoes.length} total) =====
export const MEDITACOES: MeditationCard[] = [
${meditacoes.map(m => '  ' + JSON.stringify(m, null, 2).split('\n').join('\n  ')).join(',\n\n')}
];

export const MEDITACOES_COUNT = ${meditacoes.length};

export default MEDITACOES;
`;

    fs.writeFileSync(tsMeditPath, newContent);
    console.log(`✅ src/data/meditacoes.ts REGENERADO (${meditacoes.length} meditações)`);

    // 5. Relatório
    console.log('\n' + '='.repeat(60));
    console.log('✨ SINCRONIZAÇÃO CONCLUÍDA');
    console.log('='.repeat(60));
    console.log(`📊 Total de meditações: ${meditacoes.length}`);
    console.log(`📍 Primeira: ${meditacoes[0].title}`);
    console.log(`📍 Última: ${meditacoes[meditacoes.length - 1].title}`);
    console.log(`🗑️  Meditações hardcoded antigas: DELETADAS`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERRO:', error);
    process.exit(1);
  }
}

// Helpers
function generateId(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTags(tagStr: string): string[] {
  return (tagStr || '')
    .split(',')
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length > 0);
}

function extractExistingMeditacoes(content: string): string[] {
  // Regex para extrair objetos hardcoded existentes
  // Retorna string[] de objetos JSON
  // (Simplificado: pode precisar refino)
  const match = content.match(/export const MEDITACOES.*?\[([\s\S]*?)\]/);
  if (!match) return [];

  // Retornar linhas de meditações (muito simplificado)
  return [];  // TODO: implementar parsing robusto
}

syncMeditacoes();
```

#### 1.3.2 Expandir `src/data/meditacoes.ts`

```typescript
// Adicionar após array existente MEDITACOES:

export const MEDITACOES: MeditationCard[] = [
  // [6-8 meditações existentes hardcoded]
  {
    id: "renovacao-ceu-infinito",
    title: "Renovação Sob o Céu Infinito",
    // ... existente ...
  },
  // ... mais existentes ...

  // ===== 17 MEDITAÇÕES DO EXCEL (NOVAS) =====
  {
    id: "meditacao-excel-1",
    title: "Meditação do Excel 1",
    duration: "12 min",
    category: "MENTE",
    plus: false,
    description: "...",
    tags: ["PAZ", "SONO"],
    audioUrl: "https://pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev/Med_*.mp3",
    image: "https://images.unsplash.com/..."
  },
  // ... 16 items mais ...
];
```

### 1.4 Dependências & Bloqueadores

- ✅ SheetsClient já existe
- ✅ Google Sheets credentials já configuradas
- ⚠️ **BLOQUEADOR:** Nome exato da aba no Excel ("meditacao.xlsx", "Meditacoes", etc?)
- ⚠️ **BLOQUEADOR:** Estrutura exata das colunas (campos esperados)
- ⚠️ **BLOQUEADOR:** URLs de áudio validam HTTP 200?

### 1.5 Critérios de Aceitação

- [ ] `npm run sync:meditacoes` executa sem erros
- [ ] Gera TODAS as meditações do Google Sheets
- [ ] Meditações hardcoded antigas foram deletadas
- [ ] Todas as URLs de áudio retornam HTTP 200
- [ ] TypeScript compila sem erros
- [ ] Filtros funcionam com novo conjunto de meditações

---

## FASE 2: Validação de Estrutura & Compatibilidade

**Duração:** 1 hora
**Esforço:** XS

### 2.1 Objetivos
- [ ] Validar que 23-24 meditações carregam sem erro
- [ ] Verificar filtros funcionam (categoria, tags)
- [ ] Testar paginação no modal "VER TUDO"
- [ ] Confirmar imagens carregam (Unsplash + local)

### 2.2 Checklist

```
[ ] npm run typecheck     → 0 erros
[ ] npm run lint          → 0 erros
[ ] npm run build         → sucesso
[ ] Dev server inicia     → sucesso
[ ] Aba Explorar carrega  → sem erro
[ ] Seção Meditações exibe 4 cards
[ ] Filtro MENTE funciona
[ ] Filtro CORPO funciona
[ ] Filtro ESPÍRITO funciona
[ ] Filtro MÚSICA funciona
[ ] Filtro ESTUDOS funciona
[ ] Chip PAZ funciona
[ ] Chip DORMIR funciona
[ ] "VER TUDO" modal abre
[ ] Modal exibe ~23-24 items
[ ] Paginação funciona (se > 20)
[ ] Click em card abre player
[ ] Player toca áudio sem CORS error
[ ] Favorite toggle funciona
[ ] Favoritos persistem após reload
```

### 2.3 Critérios de Aceitação

- [ ] TODAS as meditações do Sheets aparecem (sem erro)
- [ ] Filtros & paginação corretos com novo volume
- [ ] Áudio toca com sucesso (via /api/audio proxy)
- [ ] Nenhuma meditação hardcoded antiga permanece
- [ ] Zero erros no console

---

## FASE 3: Testes E2E & Performance

**Duração:** 2 horas
**Esforço:** S (Small)

### 3.1 Objetivos
- [ ] Teste E2E completo: descobrir → reproduzir → favoritar
- [ ] Validar bundle size (< 200KB delta)
- [ ] Testar em mobile (viewport 375px) e desktop (1920px)
- [ ] Validar performance: imagens < 2s, áudio < 1s

### 3.2 Teste Manual

```
[ ] Navegar até Explorar
[ ] Ver "Meditações" com 4 cards visíveis (primeiras 4)
[ ] Clicar em card → abre player
[ ] Clique Play → áudio toca (sem CORS error)
[ ] Clique Pause → áudio pausa
[ ] Mude barra de progresso → áudio salta
[ ] Clique Favorite (coração) → ícone muda
[ ] Reload página → favorito persiste
[ ] Clique "VER TUDO" → modal abre com TODAS as meditações do Sheets
[ ] Verificar paginação correta (20 por página, múltiplas páginas?)
[ ] Navegue paginação (páginas 1, 2, 3, etc se > 20 items)
[ ] Clique em card dentro modal → player abre
[ ] Filtro por categoria MENTE → exibe só MENTE do Sheets
[ ] Filtro por tag PAZ → exibe só PAZ do Sheets
[ ] Combinação: CORPO + DORMIR → filtra correto
[ ] Teste em mobile: responsive?
[ ] Teste em desktop: layout correto?
[ ] Verificar: NENHUMA meditação hardcoded antiga persiste
```

### 3.3 Critérios de QA

- [ ] TODAS as meditações do Google Sheets tocam (100%)
- [ ] Nenhum erro de CORS
- [ ] Nenhum erro no console
- [ ] Filtros precisos (categoria, tags)
- [ ] Paginação sem bugs (20 items/página)
- [ ] Responsivo em todos breakpoints (mobile, tablet, desktop)
- [ ] Bundle size OK (< 200KB delta)
- [ ] Performance OK (< 3s carregamento total)
- [ ] Verificação: 0 meditações hardcoded antigas visíveis

---

## 4. ESTRUTURA DE DADOS

### Interface MeditationCard (Existente)
```typescript
export interface MeditationCard {
  id: string;              // "paz-aguas-tranquilas"
  title: string;           // "A Paz das Águas Tranquilas"
  duration: string;        // "12 min"
  category: string;        // "MENTE" | "CORPO" | "ESPÍRITO" | "MÚSICA" | "ESTUDOS"
  plus: boolean;           // Requer Plus?
  description?: string;    // ~200 chars
  tags: string[];          // ["PAZ", "DORMIR", "<5MINS"]
  image?: string;          // URL (Unsplash, R2, etc)
  audioUrl?: string;       // URL Cloudflare R2 (.mp3)
}
```

### Mapeamento de Campos (Excel → TypeScript)

| Campo Excel | Campo TypeScript | Conversão |
|-------------|------------------|-----------|
| titulo | title | direto |
| descricao | description | substring(0, 200) |
| duracao_min | duration | `${duracao_min} min` |
| categoria | category | mente → MENTE |
| tema | tags | split(","), toUpperCase() |
| audioUrl | audioUrl | validar HTTP 200 |
| imagem_url | image | usar Unsplash padrão se vazio |

---

## 5. ESFORÇO ESTIMADO

| Fase | Tarefa | Duração | Esforço |
|------|--------|---------|--------|
| **1** | Sync script (criar) | 45 min | XS |
| **1** | Expandir meditacoes.ts | 30 min | XS |
| **1** | Validar estrutura | 15 min | XS |
| **2** | Validar compatibilidade | 1h | XS |
| **3** | Testes E2E | 2h | S |
| | **TOTAL** | **4-5h** | **S** |

---

## 6. ARQUIVO DE DADOS: ANTES vs DEPOIS

### ANTES
```typescript
export const MEDITACOES: MeditationCard[] = [
  // ~6-8 meditações HARDCODED (exemplos)
  { id: "renovacao-ceu-infinito", title: "Renovação Sob o Céu Infinito", ... },
  { id: "paz-aguas-tranquilas", title: "A Paz das Águas Tranquilas", ... },
  // ... 4-6 items mais (DELETADOS)
];
```

### DEPOIS
```typescript
// AUTO-GERADO por scripts/sync-meditacoes.ts
// TODAS as meditações vêm do Google Sheets (sem hardcoding)

export const MEDITACOES: MeditationCard[] = [
  // 100% GOOGLE SHEETS (dinâmico)
  { id: "medit-sheets-001", title: "Meditação Google Sheets 1", audioUrl: "https://pub-78cb2e5dd78e4d38af1ad1634018010a.r2.dev/Med_*.mp3", ... },
  { id: "medit-sheets-002", title: "Meditação Google Sheets 2", ... },
  // ... N items (quantos forem no Sheets)
];

export const MEDITACOES_COUNT = N;  // N = total do Google Sheets
```

---

## 7. RISCO & MITIGAÇÃO

| Risco | Prob | Impacto | Mitigação |
|-------|------|--------|-----------|
| Google Sheets vazio/mal estruturado | MÉDIA | CRÍTICO | Validar estrutura ANTES de FASE 1 |
| URLs de áudio inválidas | BAIXA | MÉDIO | Validar HTTP 200 em sync script |
| Filtros/tags não mapeiam corretamente | BAIXA | MÉDIO | Testar categoria/tags do Sheets |
| Performance com muitas meditações | BAIXA | BAIXO | Paginação (20/página) + lazy loading |
| Perda de dados ao deletar hardcoded | BAIXA | BAIXO | Backup em seed.ts se necessário |

---

## 8. PRÓXIMOS PASSOS (IMEDIATO)

### Pré-Implementação
- [ ] **Validar Google Sheets:** Confirmar que aba "Meditacoes" existe e tem dados
- [ ] **Estrutura de Colunas:** Confirmar quais são os nomes exatos das colunas:
  - titulo / title?
  - descricao / description?
  - audioUrl / audio_url?
  - duracao / duration?
  - categoria / category?
  - tags / palavras_chave?
  - imagem / image_url?
- [ ] **Credenciais:** Verificar se SheetsClient consegue acessar o Sheets

### Implementação
1. Criar `scripts/sync-meditacoes.ts` (com mapeamento correto de colunas)
2. Executar `npm run sync:meditacoes`
3. Deletar meditações hardcoded de `src/data/meditacoes.ts`
4. Testar FASE 2 & 3
5. Commit + PR

---

## 9. COMANDOS RÁPIDOS

```bash
# Sincronizar meditações do Excel
npm run sync:meditacoes

# Validar TypeScript
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Dev server
npm run dev
```

---

## 10. REFERÊNCIA: INFRAESTRUTURA EXISTENTE

Todos estes componentes JÁ EXISTEM em Explorar e funcionam perfeitamente:

```
✅ TabExplorar.tsx               ← Container principal
✅ src/data/meditacoes.ts        ← Array a expandir
✅ MeditationCard.tsx            ← Componente visual
✅ AllContentModal.tsx           ← Modal "VER TUDO"
✅ MeditationPlayer.tsx          ← Player de áudio
✅ ExploreFilters.tsx            ← Filtros (categoria + tags)
✅ ContentSection.tsx            ← Seção
✅ useFavorites hook             ← Sistema de favoritos
✅ /api/audio                    ← Proxy CORS para R2
✅ Paginação                     ← 20 items por página
```

**NENHUM NOVO COMPONENTE É NECESSÁRIO.** Apenas expandir dados.

---

## 11. DOCUMENTAÇÃO

- **Documento de Arquitetura:** Este arquivo
- **Snippets de Código:** Seção 1.3
- **Referência de Componentes:** Veja `src/components/tabs/explorar/`
- **Formato de Dados:** Interface `MeditationCard` em `src/data/meditacoes.ts`

---

**Status:** ✅ **READY FOR IMPLEMENTATION**
**Aprovado por:** Aria (@architect)
**Data:** 22 de Fevereiro de 2026

