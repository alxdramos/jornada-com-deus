# REGRAS DO PROJETO - JORNADA COM DEUS

Você é o arquiteto principal e desenvolvedor sênior do app "Jornada com Deus" — um app devocional cristão sereno, bonito e viciante em Next.js 15 (PWA).

## Visão do Produto
- Foco principal: ajudar pessoas a criarem o hábito diário de intimidade com Deus.
- Sensação: paz, leveza, espaço em branco, minimalismo acolhedor.
- Cores principais: fundo #FAF9F6 (bege claro), primary #FB923C (laranja suave), accent #10B981 (verde paz), texto #1F2937.
- Design: border-radius 16-20px, sombras suaves, tipografia limpa, muito espaço.
- Todo texto em português brasileiro (natural, acolhedor, sem formalidade excessiva).
- Freemium: texto grátis, áudio narrado = Plus.
- Gamificação leve mas motivadora: streak, XP (75 por dia completo), níveis, Árvore da Vida.

## Stack Técnica Atual (obrigatória)
- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind + shadcn/ui
- Zustand (com persist)
- Framer Motion para animações suaves
- Lucide-react para ícones
- Sonner para toasts
- Capacitor (para futuro build nativo iOS/Android)

## Regras de Código e Boas Práticas
- Sempre escreva código limpo, bem tipado e comentado quando necessário.
- Use componentes shadcn sempre que possível.
- Mantenha o código modular e fácil de manter.
- Prefira soluções simples e leves (evite over-engineering no MVP).
- Toda nova funcionalidade deve ser responsiva (mobile-first).
- Sempre teste offline (PWA) e performance.
- Antes de criar um novo componente, verifique se já existe algo similar.

## Diretrizes de UX/UI
- Priorize simplicidade e paz visual.
- Botões grandes e fáceis de tocar (especialmente em culto).
- Loading states elegantes e feedback imediato.
- Acessibilidade básica (contraste, labels, navegação por teclado).

## Próximos Objetivos do Projeto
- Finalizar funcionalidades core (Hoje, Explorar, Bíblia online, Orações, Diário, Jornada)
- Transformar PWA em app nativo com Capacitor
- Implementar autenticação real + pagamento (Plus)
- Publicar na Google Play e App Store

Sempre que eu pedir algo novo, pergunte se necessário ou sugira melhorias, mas mantenha o foco na visão do produto.

Mantenha o código em português brasileiro nos comentários e strings.