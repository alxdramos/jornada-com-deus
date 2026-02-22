# 🎨 Design System - Guia Completo

## Status: v1.0.0 ✅

---

## 📑 Índice

1. [Filosofia](#filosofia)
2. [Design Tokens](#design-tokens)
3. [Componentes](#componentes)
4. [Uso em Desenvolvimento](#uso-em-desenvolvimento)
5. [Padrões](#padrões)

---

## Filosofia

O Design System do "Jornada com Deus" segue **Atomic Design**:

```
Atoms → Molecules → Organisms → Templates → Pages
```

### Princípios
- **DRY** (Don't Repeat Yourself) - Reutilização máxima
- **Consistência** - Mesma aparência em todo lugar
- **Acessibilidade** - WCAG AA em tudo
- **Performance** - Otimizado para velocidade
- **Manutenibilidade** - Fácil de atualizar

---

## Design Tokens

### Cores

#### Backgrounds
```
--color-bg-primary:   #F8F7F4 (light) / #0F172A (dark)
--color-bg-secondary: #FFFFFF (light) / #1E293B (dark)
--color-bg-tertiary:  #F3F4F6 (light) / #334155 (dark)
```

#### Text
```
--color-text-primary:     #1F2937 (light) / #F8F7F4 (dark)
--color-text-secondary:   #6B7280 (light) / #CBD5E1 (dark)
--color-text-tertiary:    #9CA3AF (light) / #94A3B8 (dark)
```

#### Semantic
```
--color-orange: #FB923C (primary action)
--color-purple: #8B5CF6 (secondary)
--color-green:  #10B981 (success)
--color-red:    #EF4444 (danger)
--color-blue:   #3B82F6 (info)
```

### Tipografia

```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Sizes:
  xs:  12px
  sm:  14px
  base: 16px
  lg:  18px
  xl:  20px
  2xl: 24px
  3xl: 28px
  4xl: 32px

Weights:
  normal: 400
  medium: 500
  bold:   700
```

### Spacing

```
Escala (em pixels):
1:  4px
2:  8px
3:  12px
4:  16px
5:  20px
6:  24px
8:  32px
10: 40px
12: 48px
```

### Border Radius

```
sm:  8px
md:  12px (default)
lg:  16px
xl:  20px
full: 9999px
```

### Shadows

```
sm: 0 1px 2px rgba(0, 0, 0, 0.05)
md: 0 1px 3px rgba(0, 0, 0, 0.1)
lg: 0 4px 12px rgba(0, 0, 0, 0.15)
xl: 0 8px 24px rgba(0, 0, 0, 0.2)
```

### Transitions

```
fast: 0.15s ease
base: 0.2s ease
slow: 0.3s ease
smooth: 0.35s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Componentes

### Atoms (Blocos Básicos)

#### Button
```tsx
import { Button } from '@/components/atoms/Button';

<Button variant="primary" size="md">
  Click me
</Button>

// Variantes: primary | secondary | ghost | danger | outline
// Tamanhos: sm | md | lg
// Props: fullWidth, isLoading, leftIcon, rightIcon
```

#### Input
```tsx
import { Input } from '@/components/atoms/Input';

<Input
  label="Email"
  type="email"
  error="Email inválido"
  helperText="Inserir email válido"
  leftIcon="✉️"
/>
```

#### Avatar
```tsx
import { Avatar } from '@/components/atoms/Avatar';

<Avatar
  src="/avatar.jpg"
  initials="AB"
  size="md"
  bgColor="orange"
  status="online"
/>
```

#### Badge
```tsx
import { Badge } from '@/components/atoms/Badge';

<Badge label="Premium" variant="success" size="md" icon="⭐" />
```

#### Chip
```tsx
import { Chip } from '@/components/atoms/Chip';

<Chip
  label="Meditação"
  selected={true}
  removable={true}
  onClick={() => {}}
  onRemove={() => {}}
/>
```

### Molecules (Combinações)

#### FormField
```tsx
import { FormField } from '@/components/molecules/FormField';

<FormField
  label="Nome"
  required
  hint="Use seu nome completo"
  error={error}
/>
```

#### SearchBar
```tsx
import { SearchBar } from '@/components/molecules/SearchBar';

<SearchBar
  placeholder="Buscar..."
  onSearch={(query) => {}}
  onClear={() => {}}
  fullWidth
/>
```

#### UserProfile
```tsx
import { UserProfile } from '@/components/molecules/UserProfile';

<UserProfile
  avatarProps={{ src: '/avatar.jpg', size: 'md' }}
  name="João Silva"
  email="joao@example.com"
  interactive
  onProfileClick={() => {}}
/>
```

#### Card
```tsx
import { Card } from '@/components/molecules/Card';

<Card
  title="Meditação"
  description="Relaxamento guiado"
  image="/meditation.jpg"
  interactive
  onClick={() => {}}
>
  Conteúdo adicional aqui
</Card>
```

---

## Uso em Desenvolvimento

### 1. Importar Componentes

```tsx
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { SearchBar } from '@/components/molecules/SearchBar';
```

### 2. Usar Design Tokens (CSS)

```css
.meu-componente {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}
```

### 3. Dark Mode

Dark mode funciona automaticamente via CSS variables:

```tsx
import { useDarkMode } from '@/hooks/useDarkMode';

const { isDark, toggle } = useDarkMode();
```

O CSS muda automaticamente quando `.dark` é adicionado ao `<html>`.

### 4. Tailwind + Design Tokens

```tsx
<div className="bg-bg-primary text-text-primary p-4 rounded-md shadow-md">
  Conteúdo com design tokens
</div>
```

---

## Padrões

### Padrão 1: Componentes Compostos

```tsx
// BONDO: Uma molécula = átomos + lógica

// FormField = Input (atom) + Label + Error
// SearchBar = Input (atom) + Icon + Clear button
// Card = Image + Title + Description + Content
```

### Padrão 2: Props Comuns

Todos os componentes seguem:
```tsx
interface ComponentProps {
  className?: string; // Para customização
  children?: ReactNode; // Conteúdo
  disabled?: boolean; // Estado
  aria-label?: string; // Acessibilidade
}
```

### Padrão 3: Accessibility

Todos têm:
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators (visíveis)
- ARIA labels onde necessário
- prefers-reduced-motion respected

### Padrão 4: Responsive

Mobile-first approach:
```css
/* Mobile (padrão) */
.componente {
  padding: var(--spacing-4);
}

/* Desktop */
@media (min-width: 768px) {
  .componente {
    padding: var(--spacing-6);
  }
}
```

---

## Exemplos de Uso

### Exemplo 1: Página com FormField

```tsx
'use client';

import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="bg-bg-primary p-6 space-y-4">
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
      />
      <Button variant="primary" fullWidth>
        Login
      </Button>
    </div>
  );
}
```

### Exemplo 2: Página com Cards e SearchBar

```tsx
'use client';

import { Card } from '@/components/molecules/Card';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useState } from 'react';

export function MeditationsPage() {
  const [search, setSearch] = useState('');

  const filtered = MEDITACOES.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-bg-primary p-6 space-y-6">
      <SearchBar
        placeholder="Buscar meditações..."
        onSearch={setSearch}
        fullWidth
      />

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(m => (
          <Card
            key={m.id}
            title={m.title}
            image={m.image}
            interactive
            onClick={() => handleSelect(m)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Adicionando Novos Componentes

### Passo 1: Criar Atom (se necessário)

```tsx
// src/components/atoms/NewComponent.tsx
'use client';

export interface NewComponentProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

export const NewComponent = ({
  label,
  variant = 'primary'
}: NewComponentProps) => {
  return <div className={`new-component new-component--${variant}`}>{label}</div>;
};
```

### Passo 2: Criar CSS

```css
/* src/components/atoms/NewComponent.css */
.new-component {
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.new-component--primary {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

### Passo 3: Exportar em index.ts

```ts
// src/components/atoms/index.ts
export { NewComponent, type NewComponentProps } from './NewComponent';
```

---

## Troubleshooting

### Design tokens não funcionam
```
Verificar: @import do tokens.css em globals.css
```

### Dark mode não funciona
```
Verificar: <html class="dark"> ou <html style="color-scheme: dark">
```

### Componentes não renderizam
```
Verificar: 'use client' no topo do arquivo
```

---

## Roadmap

- [ ] Storybook integration
- [ ] Component testing library
- [ ] Figma integration
- [ ] Component versioning
- [ ] Design token exporter (to JSON)

---

## Contato

Para mudanças no design system, abra uma issue ou discuta com o time.

---

**Last Updated:** 2026-02-22
**Version:** 1.0.0
**Status:** Production Ready ✅
