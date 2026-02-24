/**
 * Supabase client configuration
 *
 * Usa createBrowserClient do @supabase/ssr para armazenar a sessão
 * em COOKIES (e não localStorage), permitindo que o middleware server-side
 * leia a sessão e proteja as rotas corretamente.
 *
 * Os valores placeholder abaixo apenas evitam que o @supabase/ssr lance um
 * erro durante o build da Vercel (SSG sem env vars). Em produção, as variáveis
 * reais são injetadas pela Vercel e qualquer chamada auth usa os valores corretos.
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Cliente público — usa cookies para sessão (compatível com middleware SSR)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Cliente admin — server-side only, nunca expor ao browser
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
