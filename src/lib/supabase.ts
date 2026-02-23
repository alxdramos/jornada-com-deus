/**
 * Supabase client configuration
 *
 * Usa createBrowserClient do @supabase/ssr para armazenar a sessão
 * em COOKIES (e não localStorage), permitindo que o middleware server-side
 * leia a sessão e proteja as rotas corretamente.
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias'
  )
}

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
