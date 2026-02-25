/**
 * Supabase Server Client — factory para Server Components e Server Actions
 *
 * Cria um novo cliente por requisição (cookies variam por request).
 * NUNCA importar em Client Components — use @/lib/supabase para browser.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component read-only — set via middleware
          }
        },
      },
    }
  )
}
