# Jornada com Deus 🌿🙏

> **Aplicação devocional cristã PWA** para criar hábitos diários com Deus através de meditações, orações, estudos bíblicos e reflexões espirituais.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)

## 📖 Sobre o Projeto

**Jornada com Deus** é uma aplicação web progressiva (PWA) desenvolvida especificamente para cristãos que desejam cultivar um relacionamento mais profundo com Deus através de práticas diárias espirituais. A app combina tecnologia moderna com conteúdo espiritual cuidadosamente preparado para criar uma experiência serena e viciante.

### ✨ Características Principais

- **🎵 Meditações Guiadas**: Áudios de meditação com paisagens sonoras relaxantes
- **📖 Exploração Bíblica**: Navegação completa pelos livros sagrados
- **🙏 Banco de Orações**: Orações pré-definidas e possibilidade de criar pessoais
- **📝 Diário Espiritual**: Registro de reflexões, destaques e citações
- **🎮 Gamificação**: Sistema de XP, níveis e "Árvore da Vida" (0-10)
- **🔒 Freemium**: Conteúdo gratuito + recursos premium (Plus)
- **📱 PWA**: Instalável como app nativa em dispositivos móveis
- **🌐 Offline**: Funcionalidades básicas disponíveis sem conexão

## 🚀 Tecnologias Utilizadas

### **Core Framework**
- **Next.js 16.1.6** - Framework React com App Router
- **React 19.2.3** - Biblioteca para construção de interfaces
- **TypeScript 5.0** - Superset JavaScript com tipagem estática

### **Styling & UI**
- **Tailwind CSS 4.0** - Framework CSS utilitário
- **Framer Motion 12.34.2** - Animações e transições suaves
- **Lucide React 0.574.0** - Ícones modernos e consistentes
- **Radix UI 1.4.3** - Componentes primitivos acessíveis
- **shadcn/ui** - Componentes UI reutilizáveis

### **Estado & Persistência**
- **Zustand 5.0.11** - Gerenciamento de estado leve
- **Dexie 4.3.0** - Wrapper IndexedDB para dados locais
- **localStorage** - Persistência adicional para preferências

### **PWA & Performance**
- **next-pwa 5.6.0** - Service Worker e manifest
- **Workbox 7.4.0** - Estratégias de cache offline

### **Utilitários**
- **Sonner 2.0.7** - Notificações toast elegantes
- **Class Variance Authority 0.7.1** - Gerenciamento de variants CSS
- **clsx 2.1.1** - Utilitário para classes condicionais
- **Tailwind Merge 3.4.1** - Fusão inteligente de classes Tailwind

### **APIs Externas**
- **bible-api.com** - Bíblia Almeida Corrigida Fiel (domínio público)
- **Cloudflare R2** - Hospedagem de arquivos de áudio

## 📁 Estrutura do Projeto

```
jornada-com-deus/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── layout.tsx            # Layout raiz da aplicação
│   │   ├── page.tsx              # Página inicial (Hoje)
│   │   ├── globals.css           # Estilos globais
│   │   └── explorar/
│   │       └── page.tsx          # Rota adicional (não utilizada)
│   ├── 📁 components/            # Componentes React
│   │   ├── 📁 tabs/              # Telas principais (tabs)
│   │   │   ├── TabHoje.tsx       # Tela inicial com devocional
│   │   │   ├── TabExplorar.tsx   # Meditações e conteúdos
│   │   │   ├── TabBiblia.tsx     # Navegação bíblica
│   │   │   ├── TabOracoes.tsx    # Banco de orações
│   │   │   └── TabDiario.tsx     # Diário espiritual
│   │   ├── 📁 ui/                # Componentes UI reutilizáveis
│   │   │   ├── Skeleton.tsx      # Loading states
│   │   │   ├── LoadingSpinner.tsx # Spinners de carregamento
│   │   │   ├── button.tsx        # Botão shadcn
│   │   │   ├── card.tsx          # Card shadcn
│   │   │   └── ...               # Outros componentes UI
│   │   ├── BottomNav.tsx         # Navegação inferior
│   │   ├── MeditationPlayer.tsx  # Player de meditações
│   │   ├── ImmersiveAudioPlayer.tsx # Player imersivo de orações
│   │   ├── PaywallModal.tsx      # Modal de upgrade Plus
│   │   ├── OfflineIndicator.tsx  # Indicador de conectividade
│   │   ├── ProfileModal.tsx      # Modal de perfil
│   │   ├── GamificationCard.tsx  # Card de gamificação
│   │   ├── HojeSteps.tsx         # Etapas do devocional diário
│   │   └── install-prompt.tsx    # Prompt de instalação PWA
│   ├── 📁 stores/                # Zustand stores
│   │   ├── userStore.ts          # Estado do usuário
│   │   ├── progressStore.ts      # Gamificação e progresso
│   │   └── tabStore.ts           # Navegação entre tabs
│   ├── 📁 hooks/                 # Custom hooks
│   │   ├── useFavorites.ts       # Gerenciamento de favoritos
│   │   ├── useToast.ts           # Sistema de notificações
│   │   ├── useOnlineStatus.ts    # Status de conectividade
│   │   ├── useDB.ts              # Hook para Dexie
│   │   └── use-pwa-install.ts    # Instalação PWA
│   ├── 📁 lib/                   # Utilitários e configurações
│   │   ├── db.ts                 # Configuração Dexie
│   │   ├── utils.ts              # Funções utilitárias
│   │   └── animations.ts         # Configurações de animação
│   ├── 📁 data/                  # Dados estáticos
│   │   └── seed.ts               # Dados iniciais (não implementado)
│   └── 📁 types/                 # Definições TypeScript (vazia)
├── 📁 public/                    # Assets estáticos
│   ├── manifest.json            # Configuração PWA
│   ├── favicon.ico              # Favicon
│   └── icon-*.png               # Ícones PWA
├── package.json                 # Dependências e scripts
├── tailwind.config.js          # Configuração Tailwind
├── next.config.ts              # Configuração Next.js
├── tsconfig.json               # Configuração TypeScript
└── README.md                   # Esta documentação
```

## 🎯 Funcionalidades Implementadas

### ✅ **AGENTE 1: Setup + PWA**
- ✅ Next.js 16 com App Router configurado
- ✅ PWA completamente funcional (manifest, service worker)
- ✅ Prompt de instalação elegante
- ✅ Tema e cores definidas (off-white, roxo suave, verde paz)

### ✅ **AGENTE 2: Design System**
- ✅ Componentes shadcn/ui implementados (Button, Card, etc.)
- ✅ Tema Tailwind consistente
- ✅ Design minimal com cards border-radius 16-20px
- ✅ Sombras suaves e espaço em branco abundante

### ✅ **AGENTE 3: Dexie DB**
- ✅ IndexedDB configurado com Dexie
- ✅ Tabelas: users, progress, devotionals, prayers, journal, favorites
- ✅ Seed automático na primeira execução
- ✅ Sincronização com Zustand stores

### ✅ **AGENTE 4: Zustand Stores**
- ✅ **userStore**: Perfil, status Plus, persistência
- ✅ **progressStore**: Gamificação completa (XP, níveis, streak, árvore)
- ✅ **tabStore**: Navegação entre telas
- ✅ Persistência automática com localStorage

### ✅ **AGENTE 5: Navegação Responsiva**
- ✅ Bottom Navigation para mobile
- ✅ 5 tabs: Hoje, Explorar, Bíblia, Orações, Diário
- ✅ Navegação fluida entre telas
- ✅ Estado ativo visual (underline animado)

### ✅ **AGENTE 6: Tela "Hoje" Completa**
- ✅ Checklist de 4 etapas diárias
- ✅ Botão "Concluir meu dia hoje"
- ✅ Gamificação integrada (XP +75/dia)
- ✅ Streak e árvore da vida

### ✅ **AGENTE 7: Tela Meditação/Explorar**
- ✅ 6 meditações com filtros (mente, corpo, espírito, música, estudos)
- ✅ Cards interativos com preview
- ✅ Sistema de favoritos persistente
- ✅ Modal Paywall para conteúdo Plus

### ✅ **AGENTE 8: Player de Áudio Imersivo**
- ✅ Player em tela cheia com background image
- ✅ Controles lindos (play/pause, skip, volume, repeat)
- ✅ Barra de progresso interativa
- ✅ Velocidades de reprodução (0.75x a 2x)
- ✅ Integração com áudio real (Cloudflare R2)

### ✅ **AGENTE 9: Telas Bíblia, Orações, Diário**
- ✅ **Bíblia Online-Only**: Navegação completa via API (bible-api.com)
- ✅ **Orações**: Banco com orações pré-definidas + criação pessoal
- ✅ **Diário**: 4 tipos de entrada (anotações, destaques, versículos, citações)

### ✅ **AGENTE 10: Polish Final**
- ✅ **Skeletons**: Estados de loading elegantes
- ✅ **Animações**: Framer Motion em todos os componentes
- ✅ **Offline**: Indicador de conectividade e funcionalidades básicas
- ✅ **Toasts**: Sistema de notificações inteligente e personalizável

## 🏃‍♂️ Como Executar

### **Pré-requisitos**
- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### **Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd jornada-com-deus

# Instale as dependências
npm install
```

### **Desenvolvimento**
```bash
# Execute o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### **Build de Produção**
```bash
# Build otimizado
npm run build

# Execute em produção
npm start
```

### **Linting**
```bash
npm run lint
```

## 📱 Funcionalidades por Tela

### **🏠 Hoje (TabHoje.tsx)**
- **Devocional diário** com 4 etapas obrigatórias
- **Gamificação**: XP (+75/dia), streak, níveis, árvore da vida
- **Perfil**: Avatar, calendário, favoritos
- **Conclusão**: Botão para marcar dia como completo

### **🎧 Explorar (TabExplorar.tsx)**
- **6 meditações reais** hospedadas no Cloudflare R2
- **Filtros**: 5 categorias + 7 chips de filtros
- **Cards interativos** com preview de imagem
- **Sistema de favoritos** persistente
- **Paywall elegante** para conteúdo Plus

### **📖 Bíblia (TabBiblia.tsx)**
- **100% Online-Only** usando bible-api.com (Almeida Corrigida Fiel)
- **66 livros** organizados em Antigo/Novo Testamento
- **Navegação hierárquica**: Livros → Capítulos → Versículos numerados
- **Busca online** por palavra/frase/referência (ex: "João 3:16")
- **Navegação anterior/próximo** capítulo com barra de progresso
- **Página /biblia/sobre** com aviso legal sobre domínio público
- **Cache inteligente** com sessionStorage para performance
- **Indicador offline** específico para Bíblia

### **🙏 Orações (TabOracoes.tsx)**
- **5 orações pré-definidas** categorizadas
- **Criação personalizada** com título, conteúdo, categoria
- **Sistema de tags** para organização
- **Favoritos** e gerenciamento de orações pessoais
- **Player imersivo** para áudios de oração

### **📝 Diário (TabDiario.tsx)**
- **4 tipos de entrada**: Anotações, Destaques, Versículos, Citações
- **Abas organizacionais**: Tudo, Destaques, Anotações, Citações
- **Busca avançada** por conteúdo, referência ou tags
- **Tags customizáveis** para categorização
- **Visualização detalhada** com formatação rica

## 🎨 Sistema de Cores

```css
/* Tema principal */
--background: #FAF9F6;    /* Off-white sereno */
--primary: #FB923C;       /* Laranja quente */
--accent: #10B981;        /* Verde paz */
--foreground: #1F2937;    /* Cinza escuro */
--muted: #6B7280;         /* Cinza médio */

/* Estados */
--success: #10B981;       /* Verde para sucesso */
--warning: #F59E0B;       /* Âmbar para avisos */
--error: #EF4444;         /* Vermelho para erros */
--info: #3B82F6;          /* Azul para informações */
```

## 🔧 Implementações Técnicas Recentes

### **📱 Bíblia Online-Only**
- **Hook `useBible.ts`**: Gerenciamento completo de API com cache sessionStorage
- **Componentes específicos**: `BibleOfflineMessage`, `BibleApiError` para UX aprimorada
- **Busca inteligente**: Parsing de referências bíblicas (João 3:16, Gn 1.1-5, etc.)
- **Navegação avançada**: Anterior/próximo capítulo + jump para versículo
- **Performance**: Cache limitado (20 entradas) + timeouts de 10s
- **Legal**: Página `/biblia/sobre` com informações sobre domínio público

### **🎵 Integração de Áudio**
- **Cloudflare R2**: URLs públicas para distribuição global
- **Player imersivo**: Tela cheia com background image + controles elegantes
- **Controles avançados**: Velocidade, repeat, volume, progresso interativo
- **Fallbacks**: Simulação offline + tratamento de erros robusto

### **🔄 Correções e Polish**
- **Modal "VER TUDO"**: Exploração completa de conteúdo por categoria
- **Debug Plus/Free**: Botão para testes de funcionalidades premium
- **BottomNav fixado**: z-index aumentado + pointer-events corrigidos
- **Toast system**: Hook `useToast` com mensagens pré-configuradas

## 🔧 Próximos Passos e Melhorias

### **🎯 Melhorias Prioritárias**
1. **📊 Dashboard de Progresso**: Gráficos detalhados de evolução espiritual
2. **👥 Sistema Social**: Compartilhamento de reflexões (com privacidade)
3. **📚 Planos de Leitura**: Leituras bíblicas estruturadas
4. **🎵 Playlist Personalizada**: Criação de playlists de meditações
5. **📅 Lembretes**: Notificações push para devocionais
6. **🌙 Modo Noturno**: Alternância automática dia/noite

### **🔧 Melhorias Técnicas**
1. **🧪 Testes**: Jest + React Testing Library
2. **📈 Analytics**: Google Analytics/Facebook Pixel
3. **🔍 SEO**: Meta tags dinâmicas para compartilhamento
4. **♿ Acessibilidade**: Conformidade WCAG 2.1 AA
5. **🌐 i18n**: Suporte multi-idioma (inglês, espanhol)
6. **📱 Performance**: Code splitting e lazy loading

### **🚀 Features Avançadas**
1. **🎤 Gravação de Orações**: Áudios pessoais
2. **📖 Anotações Bíblicas**: Destaques e comentários em versículos
3. **🤝 Grupos de Oração**: Compartilhamento em grupos
4. **📊 Estatísticas Detalhadas**: Métricas de crescimento espiritual
5. **🎯 Metas Personalizáveis**: Objetivos espirituais customizados

## 🤝 Como Contribuir

### **🚀 Para Desenvolvedores**

1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/seu-usuario/jornada-com-deus.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Instale** dependências: `npm install`
5. **Execute** desenvolvimento: `npm run dev`
6. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
7. **Push** para branch: `git push origin feature/nova-funcionalidade`
8. **Abra** um Pull Request

### **📝 Padrões de Código**

- **TypeScript** obrigatório em todos os arquivos
- **ESLint** configurado - execute `npm run lint` antes de commitar
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- **Componentes**: PascalCase, hooks: camelCase com prefixo `use`
- **Imports**: Agrupados por tipo (React, bibliotecas externas, internos)

### **🎨 Padrões de Design**

- **Cores**: Seguir paleta definida no tema
- **Espaçamento**: Múltiplos de 4px (4, 8, 16, 24, 32...)
- **Border-radius**: 16-20px para cards principais
- **Sombras**: Suaves e consistentes (`shadow-sm`, `shadow-md`)
- **Animações**: Framer Motion para transições suaves

## 📋 Estado Atual do Desenvolvimento

### **✅ Implementado (10/10 Agentes + Correções)**
- ✅ **Setup + PWA** (Manifest, Service Worker, Install Prompt)
- ✅ **Design System** (shadcn/ui, Tailwind, componentes)
- ✅ **IndexedDB** (Dexie configurado, tabelas criadas)
- ✅ **Zustand Stores** (user, progress, tab com persistência)
- ✅ **Navegação** (Bottom tabs mobile + sidebar desktop preparada)
- ✅ **Tela Hoje** (4 etapas + gamificação completa)
- ✅ **Tela Explorar** (Meditações reais + filtros + paywall)
- ✅ **Player Imersivo** (Tela cheia + controles lindos + Cloudflare R2)
- ✅ **Telas Secundárias** (Bíblia Online-Only, Orações, Diário completas)
- ✅ **Polish Final** (Animações, skeletons, offline, toasts)
- ✅ **Correções Pós-Agente 10** (Modal "VER TUDO", Plus debug, áudio fixado)

### **🎵 Conteúdo Real Integrado**
- **6 Meditações** com áudio hospedado no Cloudflare R2
- **Conteúdo limpo** (tags Eleven Labs removidas)
- **Player funcional** com controle de áudio real
- **URLs públicas** para distribuição
- **Modal "VER TUDO"** funcional para explorar conteúdo completo
- **Botão debug Plus/Free** para testes de funcionalidades premium
- **Links de áudio verificados** e corrigidos para reprodução perfeita

### **🚀 Pronto para Produção**
- Build funcionando sem erros
- TypeScript validado
- PWA configurada
- Offline básico implementado
- Performance otimizada

## 📞 Suporte e Contato

Para dúvidas, sugestões ou relatar bugs:

- **Issues**: Abra uma issue no GitHub
- **Discussions**: Use a aba Discussions para ideias
- **Email**: [contato@jornadacomdeus.com](mailto:contato@jornadacomdeus.com)

## 📄 Licença

Este projeto é **privado** e propriedade intelectual da Jornada com Deus. Todos os direitos reservados.

---

## 📅 Status do Desenvolvimento (18/02/2026)

**✅ PROJETO CONCLUÍDO E PRONTO PARA PRODUÇÃO**

- **10 Agentes implementados** com sucesso
- **Correções pós-agente aplicadas** (áudio, navegação, Plus mode)
- **Bíblia transformada** para versão 100% online-only
- **Build testado** sem erros TypeScript
- **PWA funcional** com service worker e manifest
- **Performance otimizada** com cache e lazy loading

**🎯 Pronto para deploy e testes em produção!**

---

**🌿 "Tudo posso naquele que me fortalece." - Filipenses 4:13**

*Desenvolvido com ❤️ para aproximar pessoas de Deus através da tecnologia.*
