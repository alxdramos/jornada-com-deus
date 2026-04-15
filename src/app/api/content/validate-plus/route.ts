/**
 * POST /api/content/validate-plus
 *
 * Valida server-side se o usuário autenticado tem plano Plus ativo.
 * Chamado pelos players de áudio antes de reproduzir conteúdo Plus,
 * adicionando uma camada de segurança além da validação client-side.
 *
 * Retorna:
 *   { allowed: true }  — usuário Plus com assinatura ativa
 *   { allowed: false } — usuário free ou sessão inválida
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createRateLimiter } from '@/lib/rate-limit'

const limiter = createRateLimiter(60, 60, '@jornada/validate-plus')

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = await limiter.check(ip)
  if (!rl.success) {
    return NextResponse.json({ allowed: false, error: 'rate_limit' }, { status: 429 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const response = NextResponse.json({ allowed: false })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ allowed: false, error: 'unauthenticated' }, { status: 401 })
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, expires_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!subscription) {
    return NextResponse.json({ allowed: false })
  }

  const isActive =
    subscription.status === 'active' &&
    subscription.plan === 'plus' &&
    (!subscription.expires_at || new Date(subscription.expires_at) > new Date())

  return NextResponse.json({ allowed: isActive })
}
