# Install Prompt UI/UX Spec
## Jornada com Deus PWA

---

## 📱 Overview

**Objetivo:** Mostrar modal bonito de instalação quando usuário atende triggers (2x acesso, 30s, ou 2 páginas navegadas).

**Plataformas:**
- Android: Modal + CTA nativa `beforeinstallprompt`
- iOS: Modal + Passo-a-passo manual
- Desktop: Ambas opções

---

## 🎯 Triggers de Exibição

| Trigger | Condição |
|---------|----------|
| **Visitas** | visitCount >= 2 |
| **Tempo** | timeSpent >= 30 segundos |
| **Páginas** | pagesVisited >= 2 |
| **Lógica** | Qualquer um desses (`OR`) |

**Supressão:**
- ❌ NÃO mostrar se `promptDismissed = true` (usuário rejeitou)
- ❌ NÃO mostrar se `promptInstalled = true` (já instalou)
- ✅ Mostrar UMA VEZ por sessão máximo

---

## 🎨 Componentes

### 1. **InstallPromptModal** (Wrapper Principal)
**Responsabilidades:**
- Detectar plataforma (iOS, Android, Desktop)
- Renderizar Android ou iOS flow baseado em device
- Controlar exibição/fechamento

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  beforeInstallPrompt?: BeforeInstallPromptEvent; // Android
  platform: "ios" | "android" | "desktop";
}
```

**Tailwind Structure:**
```
fixed inset-0 flex items-end z-50
├─ bg-black/50 (backdrop)
└─ rounded-t-2xl bg-white
   ├─ Header (imagem/ícone)
   ├─ Content (texto + CTA)
   └─ Footer (botões)
```

---

### 2. **AndroidInstallFlow**
**Componente para Android/Desktop com beforeinstallprompt nativo**

**Layout:**
```
┌─────────────────────────────┐
│ ✨ Jornada com Deus App    │ ← Ícone 32x32 + emoji
├─────────────────────────────┤
│ Instale o Jornada com Deus  │ ← Título (text-lg font-bold)
│                             │
│ Acesse como aplicativo,     │ ← Subtítulo (text-sm text-gray-600)
│ mais rápido e sem barra     │
│ do navegador.               │
├─────────────────────────────┤
│ [ Instalar agora ] [Depois] │ ← CTAs
└─────────────────────────────┘
```

**Tokens de Cor:**
- Background: `bg-white`
- Border: `border-t border-gray-200`
- Primary Button: `bg-purple-600 hover:bg-purple-700 text-white`
- Secondary Button: `bg-gray-100 hover:bg-gray-200 text-gray-900`
- Texto principal: `text-gray-900`
- Subtítulo: `text-gray-600`

**Tailwind Classes:**
```jsx
<div className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-lg border-t border-gray-200 p-6 animate-in slide-in-from-bottom z-50">
  {/* Header */}
  <div className="flex items-center gap-3 mb-4">
    <span className="text-4xl">✨</span>
    <h2 className="text-xl font-bold text-gray-900">Instale o Jornada com Deus</h2>
  </div>

  {/* Subtitle */}
  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
    Acesse como aplicativo, mais rápido e sem barra do navegador.
  </p>

  {/* CTAs */}
  <div className="flex gap-3">
    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
      Instalar agora
    </button>
    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition">
      Depois
    </button>
  </div>
</div>
```

---

### 3. **iOSInstallGuide**
**Componente para iPhone com passo-a-passo manual**

**Flow em Slides/Cards:**

```
Slide 1/3:
┌─────────────────────────────┐
│ ✨ Instale o App            │
│                             │
│ 1️⃣ Toque no botão           │
│ Compartilhar                │
│                             │
│ [→ Próximo]                 │
└─────────────────────────────┘

Slide 2/3:
┌─────────────────────────────┐
│                             │
│ 2️⃣ Selecione               │
│ "Adicionar à Tela de Início"│
│                             │
│ [← Voltar] [→ Próximo]     │
└─────────────────────────────┘

Slide 3/3:
┌─────────────────────────────┐
│                             │
│ 3️⃣ Confirme                │
│ Toque em "Adicionar"       │
│                             │
│ [← Voltar] [Pronto ✓]      │
└─────────────────────────────┘
```

**Indicadores de Progresso:**
```
●○○ (Slide 1)
○●○ (Slide 2)
○○● (Slide 3)
```

**Tailwind Structure:**
```jsx
<div className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6">
  {/* Progress Dots */}
  <div className="flex justify-center gap-2 mb-8">
    {[1,2,3].map(i => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition ${
          currentSlide === i ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      />
    ))}
  </div>

  {/* Content Carousel */}
  <div className="min-h-[200px] flex flex-col justify-center">
    {currentSlide === 1 && (
      <>
        <p className="text-5xl mb-4">👆</p>
        <h3 className="text-lg font-bold mb-2">Toque no botão Compartilhar</h3>
        <p className="text-sm text-gray-600">No topo da tela do navegador</p>
      </>
    )}
    {currentSlide === 2 && (
      <>
        <p className="text-5xl mb-4">📱</p>
        <h3 className="text-lg font-bold mb-2">Selecione "Adicionar à Tela de Início"</h3>
      </>
    )}
    {currentSlide === 3 && (
      <>
        <p className="text-5xl mb-4">✅</p>
        <h3 className="text-lg font-bold mb-2">Confirme tocando em "Adicionar"</h3>
      </>
    )}
  </div>

  {/* Navigation */}
  <div className="flex gap-3 mt-8">
    <button
      onClick={prev}
      disabled={currentSlide === 1}
      className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-900 disabled:opacity-50"
    >
      ← Voltar
    </button>
    <button
      onClick={next}
      className="flex-1 py-3 rounded-lg bg-purple-600 text-white font-semibold"
    >
      {currentSlide === 3 ? 'Pronto ✓' : 'Próximo →'}
    </button>
  </div>
</div>
```

---

## 🎯 Responsividade

- **Mobile (320px+):** Layout stack full-width
- **Tablet (768px+):** Modal centralizado (~90% width max 500px)
- **Desktop:** Modal centered no bottom-right corner (400px width)

---

## ⚡ Animações

- **Entrada:** `slide-in-from-bottom 300ms ease-out`
- **Saída:** `slide-out-to-bottom 200ms ease-in`
- **Transição entre slides iOS:** `fade 200ms ease-in-out`

---

## 🎨 Design Tokens (Jornada com Deus)

| Token | Valor |
|-------|-------|
| Primary Purple | `#8B5CF6` (purple-600) |
| Light Gray | `#F3F4F6` (gray-100) |
| Dark Gray | `#374151` (gray-700) |
| Border Gray | `#E5E7EB` (gray-200) |
| Text Primary | `#111827` (gray-900) |
| Text Secondary | `#6B7280` (gray-600) |

---

## 📋 Accessibility

- ✅ Botões com min 44px height (touch-friendly)
- ✅ Color contrast ratio >= 4.5:1 (WCAG AA)
- ✅ Keyboard navigation: Tab/Enter
- ✅ Screen reader labels: aria-label
- ✅ Focus indicators: `focus:ring-2 focus:ring-purple-600`

---

## 📝 Checklist Implementação

- [ ] InstallPromptModal detecta plataforma corretamente
- [ ] AndroidInstallFlow renderiza com beforeinstallprompt
- [ ] iOSInstallGuide carousel funciona (prev/next)
- [ ] Animações suaves (entrada/saída/transições)
- [ ] Responsivo em 320px, 768px, 1200px
- [ ] Acessibilidade verificada (keyboard, screen reader)
- [ ] Botões não trigger múltiplas vezes
- [ ] Fechar modal limpa localStorage corretamente
