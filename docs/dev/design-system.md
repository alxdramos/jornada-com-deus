# 🎨 Design System — Jornada com Deus

**Versão:** 1.0.0
**Data:** 22/02/2026
**Orquestrado por:** Morgan (PM) + Uma (UX Expert) + Aria (Architect)
**Status:** Ready for Implementation

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Espaçamento & Layout](#espaçamento--layout)
5. [Componentes](#componentes)
6. [Hierarquia Atômica](#hierarquia-atômica)
7. [Estrutura de Pastas](#estrutura-de-pastas)
8. [Design Tokens](#design-tokens)
9. [Padrões de Implementação](#padrões-de-implementação)
10. [Roadmap de Migração](#roadmap-de-migração)
11. [Checklist de Implementação](#checklist-de-implementação)

---

## Visão Geral

**Princípios:**
- ✅ Clean & Modern (sem ser pesado)
- ✅ User-Centric (foco no usuário cristão)
- ✅ Acessível (WCAG AA mínimo)
- ✅ Escalável (suporta dark mode futuro)
- ✅ Consistente (todas as abas padronizadas)

**Fundação:**
- Fundo branco claro (#F8F7F4) — acolhedor, não cansativo
- Perfil do usuário no header — identidade visual
- Componentes reutilizáveis — máxima eficiência
- Design tokens CSS — manutenção centralizada

---

## Paleta de Cores

### Cores Base

```
FUNDO:
├─ Primário:        #F8F7F4  (off-white, warm)
├─ Secundário:      #FFFFFF  (puro white para cards)
└─ Terciário:       #F3F4F6  (light gray para elementos)

TEXTO:
├─ Primário:        #1F2937  (charcoal escuro)
├─ Secundário:      #6B7280  (gray médio)
└─ Terciário:       #9CA3AF  (gray claro)

BORDAS:
├─ Sutil:           #E5E7EB  (light gray)
└─ Normal:          #D1D5DB  (medium gray)
```

### Cores de Destaque

```
AÇÕES & CTAs:
├─ Orange:          #FB923C  (call-to-action, botões primários)
├─ Roxo:            #8B5CF6  (meditações, destaque secundário)
├─ Verde:           #10B981  (confirmação, sucesso)
├─ Vermelho:        #EF4444  (atenção, erro)
└─ Azul:            #3B82F6  (info, links)

CATEGORIAS (TabDescobrir):
├─ Devocional:      #FB923C  (orange gradient)
├─ Diário:          #14B8A6  (teal)
├─ Meditação:       #8B5CF6  (purple)
├─ Oração:          #0EA5E9  (sky blue)
├─ Bíblia:          #EF4444  (red)
├─ Espaço:          #64748B  (slate)
├─ Kids:            #EC4899  (pink)
└─ Outros:          #06B6D4  (cyan)
```

### Sombras

```
SHADOWS:
├─ Sutil:     0 1px 2px rgba(0,0,0,0.05)
├─ Normal:    0 1px 3px rgba(0,0,0,0.1)
├─ Médio:     0 4px 12px rgba(0,0,0,0.15)
└─ Forte:     0 8px 24px rgba(0,0,0,0.2)
```

---

## Tipografia

### Font Family
```
Base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Escala de Tamanhos

```
XS:   12px (metadados, labels pequenas)
SM:   14px (texto secundário, chips)
BASE: 16px (corpo de texto padrão)
LG:   18px (subtítulos, labels)
XL:   20px (títulos pequenos)
2XL:  24px (títulos médios)
3XL:  28px (títulos grandes, headers)
4XL:  32px (títulos extra grandes)
```

### Pesos

```
Normal:  400 (corpo de texto)
Medium:  500 (labels, botões)
Bold:    700 (títulos, destaques)
```

### Estilos de Texto

```
BODY:      16px, 400, line-height: 1.5
LABEL:     14px, 500, line-height: 1.4
TITLE SM:  18px, 700, line-height: 1.2
TITLE MD:  24px, 700, line-height: 1.2
TITLE LG:  32px, 700, line-height: 1.1
```

---

## Espaçamento & Layout

### Escala de Espaçamento

```
2:   8px   (micro spacing)
3:   12px  (tight spacing)
4:   16px  (standard padding)
5:   20px  (comfortable spacing)
6:   24px  (generous spacing)
8:   32px  (section spacing)
10:  40px  (large spacing)
12:  48px  (extra large spacing)
```

### Layout Grid

```
Mobile:   1 column, 16px padding
Tablet:   2 columns, 20px padding
Desktop:  3+ columns, 24px padding

Max-width: 1280px (4xl)
```

### Border Radius

```
SM:   8px   (inputs, small buttons)
MD:   12px  (cards, moderate elements)
LG:   16px  (category cards, large elements)
XL:   20px  (modals)
FULL: 9999px (pills, avatars)
```

---

## Componentes

### 1. HEADER (Organism)

**Estrutura:**
```
┌────────────────────────────────────────────────┐
│ [👤 Nome] | Logo/Título | ⚙️ 🔔 ⋯             │
│ (left)    | (center)    | (right)             │
└────────────────────────────────────────────────┘
```

**Propriedades:**
- Height: 64px (desktop) / 56px (mobile)
- Background: #FFFFFF
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Sticky: position: sticky; top: 0; z-index: 100
- Padding: 8px 16px (mobile) / 8px 24px (desktop)

**Componentes Internos:**
- **Avatar + Name** (esquerda)
  - Avatar: 40px, border-radius: full
  - Name: 14px, bold, #1F2937
  - Clicável: abre modal de perfil

- **Logo/Title** (centro)
  - Logo ou título do app
  - Responsivo (hide em mobile se necessário)

- **Actions** (direita)
  - Settings icon (⚙️)
  - Notifications icon (🔔)
  - More menu (⋯)

**CSS:**
```css
.header {
  height: 64px;
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: background 0.2s;
}

.header-profile:hover {
  background: #F3F4F6;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
}
```

### 2. CATEGORY CARD (Organism)

**Estrutura:**
```
┌─────────────────┐
│   [Image]       │
│   ▓▓▓▓▓▓▓▓▓▓   │ (overlay)
│ Category Name   │
└─────────────────┘
```

**Propriedades:**
- Aspect Ratio: 1:1 (square)
- Grid: 2 columns mobile, 3-4 desktop
- Border Radius: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: scale(0.98), shadow stronger
- Gap: 16px between cards

**CSS:**
```css
.category-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}

.category-text {
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}
```

### 3. BUTTON

**Variantes:**

**Primary (Orange)**
```
Background: #FB923C
Text: white
Padding: 12px 24px
Border Radius: 12px
Font Size: 16px, weight: 500
Hover: background: #EA8E2E
Active: background: #D97A1A
Disabled: background: #E5E7EB, text: #9CA3AF
```

**Secondary (Gray)**
```
Background: #F3F4F6
Text: #1F2937
Padding: 12px 24px
Border Radius: 12px
Font Size: 16px, weight: 500
Hover: background: #E5E7EB
Active: background: #D1D5DB
```

**CSS:**
```css
.btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #FB923C;
  color: white;
}

.btn-primary:hover {
  background: #EA8E2E;
}

.btn-primary:disabled {
  background: #E5E7EB;
  color: #9CA3AF;
  cursor: not-allowed;
}

.btn-secondary {
  background: #F3F4F6;
  color: #1F2937;
}

.btn-secondary:hover {
  background: #E5E7EB;
}
```

### 4. INPUT FIELD

**Propriedades:**
```
Padding: 10px 12px
Font Size: 16px
Border: 1px solid #E5E7EB
Border Radius: 8px
Background: #FFFFFF
Transition: border 0.2s
Height: 40px
```

**States:**
- Default: border #E5E7EB
- Focus: border #FB923C, outline: none, box-shadow: 0 0 0 3px rgba(251,146,60,0.1)
- Error: border #EF4444
- Disabled: background #F3F4F6, color #9CA3AF

**CSS:**
```css
.input {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #FFFFFF;
  height: 40px;
  transition: all 0.2s;
  font-family: inherit;
  color: #1F2937;
}

.input:focus {
  outline: none;
  border-color: #FB923C;
  box-shadow: 0 0 0 3px rgba(251,146,60,0.1);
}

.input:disabled {
  background: #F3F4F6;
  color: #9CA3AF;
  cursor: not-allowed;
}

.input::placeholder {
  color: #9CA3AF;
}
```

### 5. CHIP/TAG

**Ativo (Selected):**
```
Background: #8B5CF6
Text: white, 14px, 500
Padding: 8px 16px
Border Radius: 20px
```

**Inativo (Unselected):**
```
Background: #F3F4F6
Text: #6B7280, 14px, 500
Padding: 8px 16px
Border Radius: 20px
```

**CSS:**
```css
.chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #F3F4F6;
  color: #6B7280;
}

.chip.active {
  background: #8B5CF6;
  color: white;
}

.chip:hover {
  background: #E5E7EB;
}

.chip.active:hover {
  background: #7C3AED;
}
```

### 6. MODAL

**Propriedades:**
```
Overlay: rgba(0,0,0,0.5)
Background: #FFFFFF
Border Radius: 16px (top only for bottom sheet)
Width: 100% (mobile), max-width: 500px (desktop)
Animation: slide-up 0.3s ease-out
Z-index: 1001
Position: fixed / absolute
```

**CSS:**
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal {
  background: #FFFFFF;
  width: 100%;
  border-radius: 16px 16px 0 0;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

### 7. CARD (Container)

**Propriedades:**
```
Background: #FFFFFF
Border Radius: 12px
Padding: 16px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Transition: all 0.2s
Border: 1px solid #E5E7EB (optional)
```

**CSS:**
```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #E5E7EB;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

---

## Hierarquia Atômica

### ATOMS (Base Components)

```
src/components/atoms/
├─ Button.tsx          → CTA, actions
├─ Input.tsx           → Text input
├─ Label.tsx           → Form labels
├─ Avatar.tsx          → User avatar (40px)
├─ Icon.tsx            → Icon wrapper
├─ Chip.tsx            → Tags/filters
├─ Text.tsx            → Text variants
├─ Badge.tsx           → Status badges
└─ Divider.tsx         → Visual separator
```

### MOLECULES (Simple Combinations)

```
src/components/molecules/
├─ FormField.tsx       → Label + Input
├─ UserProfile.tsx     → Avatar + Name + Email
├─ SearchBar.tsx       → Icon + Input + Clear
├─ CardHeader.tsx      → Avatar + Title + Menu
└─ TextWithIcon.tsx    → Icon + Text combo
```

### ORGANISMS (Complex Sections)

```
src/components/organisms/
├─ Header.tsx          → Complete header with profile
├─ CategoryCard.tsx    → Image + overlay + text
├─ ModalWithPlayer.tsx → Header + content + player
├─ ContentGrid.tsx     → Grid of cards
├─ FilterBar.tsx       → Filter controls
└─ BottomNav.tsx       → Navigation footer
```

### TEMPLATES (Layouts)

```
src/components/templates/
├─ MainLayout.tsx      → Header + Content + BottomNav
├─ TabLayout.tsx       → Tab-specific layout
└─ ModalLayout.tsx     → Overlay + Modal
```

### PAGES (Tab-Specific)

```
src/components/tabs/
├─ TabHoje.tsx
├─ TabDescobrir.tsx    ← NOVO (refatorado de TabExplorar)
├─ TabBiblia.tsx
├─ TabMeditacoes.tsx
├─ TabOracoes.tsx
└─ TabDiario.tsx
```

---

## Estrutura de Pastas

```
src/
├─ components/
│  ├─ atoms/
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ Label.tsx
│  │  ├─ Avatar.tsx
│  │  ├─ Icon.tsx
│  │  ├─ Chip.tsx
│  │  ├─ Text.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Divider.tsx
│  │  └─ index.ts
│  │
│  ├─ molecules/
│  │  ├─ FormField.tsx
│  │  ├─ UserProfile.tsx
│  │  ├─ SearchBar.tsx
│  │  ├─ CardHeader.tsx
│  │  ├─ TextWithIcon.tsx
│  │  └─ index.ts
│  │
│  ├─ organisms/
│  │  ├─ Header.tsx
│  │  ├─ CategoryCard.tsx
│  │  ├─ ModalWithPlayer.tsx
│  │  ├─ ContentGrid.tsx
│  │  ├─ FilterBar.tsx
│  │  ├─ BottomNav.tsx
│  │  └─ index.ts
│  │
│  ├─ layout/
│  │  ├─ MainLayout.tsx
│  │  ├─ UserHeader.tsx
│  │  └─ index.ts
│  │
│  ├─ tabs/
│  │  ├─ TabHoje.tsx
│  │  ├─ TabDescobrir.tsx
│  │  ├─ TabBiblia.tsx
│  │  ├─ TabMeditacoes.tsx
│  │  ├─ TabOracoes.tsx
│  │  ├─ TabDiario.tsx
│  │  ├─ explorar/
│  │  │  ├─ CategoryGrid.tsx
│  │  │  └─ index.ts
│  │  └─ index.ts
│  │
│  ├─ ErrorBoundary.tsx
│  └─ BottomNav.tsx
│
├─ styles/
│  ├─ globals.css       → Global reset + body styles
│  ├─ tokens.css        → CSS Variables (design tokens)
│  ├─ animations.css    → Transitions + keyframes
│  └─ utils.css         → Helper classes
│
├─ config/
│  └─ tailwind.config.js
│
├─ app/
│  ├─ page.tsx
│  ├─ globals.css       → Import tokens.css + globals.css here
│  └─ layout.tsx
│
└─ README.md
```

---

## Design Tokens

### CSS Variables (src/styles/tokens.css)

```css
:root {
  /* ========== COLORS ========== */

  /* Backgrounds */
  --color-bg-primary: #F8F7F4;
  --color-bg-secondary: #FFFFFF;
  --color-bg-tertiary: #F3F4F6;
  --color-bg-inverse: #1F2937;

  /* Text */
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-text-inverse: #FFFFFF;

  /* Borders */
  --color-border-subtle: #E5E7EB;
  --color-border-normal: #D1D5DB;
  --color-border-strong: #9CA3AF;

  /* Semantic Colors */
  --color-orange: #FB923C;
  --color-purple: #8B5CF6;
  --color-green: #10B981;
  --color-red: #EF4444;
  --color-blue: #3B82F6;
  --color-yellow: #FBBF24;

  /* ========== TYPOGRAPHY ========== */

  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ========== SPACING ========== */

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;

  /* ========== BORDER RADIUS ========== */

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* ========== SHADOWS ========== */

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.2);

  /* ========== Z-INDEX ========== */

  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-header: 100;
  --z-modal-overlay: 1000;
  --z-modal: 1001;
  --z-tooltip: 1002;

  /* ========== TRANSITIONS ========== */

  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F8F7F4',
          secondary: '#FFFFFF',
          tertiary: '#F3F4F6',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        border: {
          subtle: '#E5E7EB',
          normal: '#D1D5DB',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      spacing: {
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 1px 3px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
```

---

## Padrões de Implementação

### 1. Aplicar Tokens Globalmente

**src/styles/globals.css:**
```css
@import './tokens.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

/* Typography presets */
.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.text-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

.text-title-sm {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.text-title-md {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.text-title-lg {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}
```

### 2. Estender Componentes

**src/components/atoms/Button.tsx:**
```tsx
'use client';

import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-fullwidth' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
```

**src/components/atoms/Button.css:**
```css
.btn {
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-family-base);
}

.btn-primary {
  background-color: var(--color-orange);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background-color: #EA8E2E;
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-subtle);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-border-subtle);
}

.btn-sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-lg);
}

.btn-fullwidth {
  width: 100%;
}
```

### 3. Criar Header com Perfil

**src/components/layout/Header.tsx:**
```tsx
'use client';

import { useUserStore } from '@/stores/userStore';
import { Avatar } from '@/components/atoms/Avatar';
import './Header.css';

export function Header() {
  const user = useUserStore((s) => s.user);

  const handleProfileClick = () => {
    // Abre modal de perfil
  };

  return (
    <header className="header">
      {/* Perfil (esquerda) */}
      <div className="header-profile" onClick={handleProfileClick}>
        <Avatar src={user?.image} alt={user?.name} size="40px" />
        <div className="header-profile-text">
          <span className="header-profile-name">{user?.name || 'Usuário'}</span>
        </div>
      </div>

      {/* Logo/Título (centro) */}
      <div className="header-title">
        <h1>Jornada com Deus</h1>
      </div>

      {/* Actions (direita) */}
      <div className="header-actions">
        <button className="header-action-btn">⚙️</button>
        <button className="header-action-btn">🔔</button>
        <button className="header-action-btn">⋯</button>
      </div>
    </header>
  );
}
```

**src/components/layout/Header.css:**
```css
.header {
  height: 64px;
  background-color: var(--color-bg-secondary);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  border-bottom: 1px solid var(--color-border-subtle);
}

.header-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  cursor: pointer;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
}

.header-profile:hover {
  background-color: var(--color-bg-tertiary);
}

.header-profile-text {
  display: flex;
  flex-direction: column;
}

.header-profile-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.header-title {
  text-align: center;
  flex: 1;
}

.header-title h1 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

.header-action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
}

.header-action-btn:hover {
  background-color: var(--color-bg-tertiary);
}

@media (max-width: 768px) {
  .header {
    height: 56px;
    padding: 0 var(--spacing-3);
  }

  .header-title h1 {
    font-size: var(--font-size-lg);
  }

  .header-profile-text {
    display: none;
  }
}
```

---

## Roadmap de Migração

### Phase 1: Foundation (Semana 1) ✅
**Objetivo:** Implementar design tokens e estrutura base

- [ ] Criar `src/styles/tokens.css` com CSS variables
- [ ] Criar `src/styles/globals.css` com reset e base
- [ ] Criar `src/styles/animations.css`
- [ ] Atualizar `tailwind.config.js` com design tokens
- [ ] Criar estrutura de pastas (atoms, molecules, organisms)
- [ ] Implementar novo Header com perfil do usuário
- [ ] Aplicar fundo branco (#F8F7F4) globalmente em `src/app/page.tsx`

**Abas Afetadas:** TODAS (mudança visual apenas, sem quebra funcional)

**Implementador:** @dev (Dex)

### Phase 2: Core Components (Semana 2)
**Objetivo:** Criar componentes reutilizáveis

- [ ] Criar átomo: `Button.tsx`
- [ ] Criar átomo: `Input.tsx`
- [ ] Criar átomo: `Avatar.tsx`
- [ ] Criar átomo: `Chip.tsx`
- [ ] Criar molécula: `FormField.tsx` (Label + Input)
- [ ] Criar organismo: `CategoryCard.tsx`
- [ ] Testar acessibilidade (WCAG AA)

**Abas Afetadas:** TabDescobrir, TabMeditacoes, TabOracoes

**Implementador:** @dev (Dex)

### Phase 3: Tab Migration (Semana 3)
**Objetivo:** Refatorar abas com novo design

- [ ] Refatorar `TabDescobrir.tsx` com novo Header + CategoryCard
- [ ] Refatorar `TabMeditacoes.tsx` com novo design
- [ ] Refatorar `TabOracoes.tsx` com novo design
- [ ] Refatorar `TabHoje.tsx` com novo design
- [ ] Testar navegação entre abas
- [ ] Testar responsividade

**Rollback:** Cada aba é independente — não há risco de quebra total

**Implementador:** @dev (Dex)

### Phase 4: Polish & Quality (Semana 4)
**Objetivo:** Refinamento e testes

- [ ] Refinamento de animações
- [ ] Testar em dispositivos reais (mobile, tablet, desktop)
- [ ] Testar acessibilidade completa (WCAG AA)
- [ ] Performance optimization
- [ ] Documentação visual (Storybook ou similar)
- [ ] Dark mode setup (opcional, future)

**Implementador:** @dev (Dex) + @qa (Quinn)

---

## Checklist de Implementação

### Pre-Implementation
- [ ] Ler este Design System Document completamente
- [ ] Verificar estrutura de pastas atual
- [ ] Backup da branch atual (git)
- [ ] Criar nova branch: `feature/design-system-v1`

### Phase 1: Tokens & Structure
- [ ] ✅ Criar `src/styles/tokens.css`
- [ ] ✅ Criar `src/styles/globals.css`
- [ ] ✅ Criar `src/styles/animations.css`
- [ ] ✅ Atualizar `tailwind.config.js`
- [ ] ✅ Criar pastas: atoms/, molecules/, organisms/
- [ ] ✅ Implementar novo Header
- [ ] ✅ Aplicar fundo branco globalmente

### Phase 2: Components
- [ ] Criar `Button.tsx` com variantes
- [ ] Criar `Input.tsx` com estados
- [ ] Criar `Avatar.tsx` com fallback
- [ ] Criar `Chip.tsx` ativo/inativo
- [ ] Criar `FormField.tsx` (reutilizável)
- [ ] Criar `CategoryCard.tsx` (com overlay)
- [ ] WCAG AA test (contrast, keyboard, screen readers)

### Phase 3: Migration
- [ ] Refatorar `TabDescobrir.tsx`
- [ ] Refatorar `TabMeditacoes.tsx`
- [ ] Refatorar `TabOracoes.tsx`
- [ ] Refatorar `TabHoje.tsx`
- [ ] Teste E2E: navegar entre abas
- [ ] Teste responsividade: 375px, 768px, 1920px

### Phase 4: Quality
- [ ] Refinamento visual
- [ ] Performance: Lighthouse score > 90
- [ ] Acessibilidade: WCAG AA certificado
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Documentação visual

### Post-Implementation
- [ ] Código review (CodeRabbit)
- [ ] Merge para main
- [ ] Deploy
- [ ] User testing feedback
- [ ] Iteração baseada em feedback

---

## Próximos Passos

### Para @dev (Dex)
1. Ler este documento completamente
2. Executar Phase 1 (Tokens & Structure) primeiro
3. Testar no localhost:3000 após cada mudança
4. Rodar `npm run build` para verificar erros TypeScript
5. Colocar em revisão com CodeRabbit antes de marcar como Done

### Para @qa (Quinn)
1. Executar testes de acessibilidade (WCAG AA)
2. Validar em múltiplos dispositivos
3. Testar performance (Lighthouse)
4. Verificar cross-browser compatibility

### Para @pm (Morgan)
1. Comunicar roadmap ao usuário
2. Monitorar progresso de Phase em Phase
3. Fazer ajustes conforme feedback do usuário
4. Coordenar releases

---

## Referências

- **Atomic Design:** https://bradfrost.com/blog/web/atomic-web-design/
- **WCAG AA Standard:** https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Variables Best Practices:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Tailwind CSS:** https://tailwindcss.com/

---

**Design System v1.0.0**
**Orquestrado por:** Morgan (PM)
**Revisado por:** Uma (UX Expert) + Aria (Architect)
**Data:** 22/02/2026
**Status:** Ready for Implementation
**Próxima Milestone:** Phase 1 Complete (1 semana)
