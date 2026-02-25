'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const LS_KEY = 'meditation-favorites'

function getItemType(id: string): string {
  if (id.startsWith('est_')) return 'estudo'
  if (id.startsWith('med_') || id.startsWith('m_')) return 'meditation'
  return 'oracao'
}

/**
 * useFavorites — offline-first com sync Supabase
 *
 * - Monta: lê localStorage (funciona offline)
 * - Login: busca user_favorites do Supabase e mescla com local
 * - Toggle: atualiza localStorage + upsert/delete no Supabase (se online)
 */
export function useFavorites() {
  const { user: supabaseUser } = useAuth()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // ── Carregar do localStorage na montagem ─────────────────
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved) as string[]))
      } catch {
        // JSON corrompido — ignora
      }
    }
  }, [])

  // ── Hidratar do Supabase no login ────────────────────────
  useEffect(() => {
    if (!supabaseUser) return

    const hydrate = async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', supabaseUser.id)

      if (error) {
        console.error('[Favorites] Erro ao buscar do Supabase:', error.message)
        return
      }

      if (!data || data.length === 0) return

      setFavorites((prev) => {
        const merged = new Set([...prev, ...data.map((d) => d.item_id as string)])
        localStorage.setItem(LS_KEY, JSON.stringify([...merged]))
        return merged
      })
    }

    hydrate().catch(console.error)
  }, [supabaseUser])

  // ── Toggle com sync ──────────────────────────────────────
  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        const adding = !next.has(id)

        if (adding) {
          next.add(id)
        } else {
          next.delete(id)
        }

        // Offline-first: persiste local imediatamente
        localStorage.setItem(LS_KEY, JSON.stringify([...next]))

        // Sync Supabase em background (sem bloquear UI)
        if (supabaseUser) {
          if (adding) {
            supabase
              .from('user_favorites')
              .upsert(
                { user_id: supabaseUser.id, item_id: id, item_type: getItemType(id) },
                { onConflict: 'user_id,item_id' }
              )
              .then(({ error }) => {
                if (error) console.error('[Favorites] Upsert error:', error.message)
              })
          } else {
            supabase
              .from('user_favorites')
              .delete()
              .eq('user_id', supabaseUser.id)
              .eq('item_id', id)
              .then(({ error }) => {
                if (error) console.error('[Favorites] Delete error:', error.message)
              })
          }
        }

        return next
      })
    },
    [supabaseUser]
  )

  const isFavorite = (id: string) => favorites.has(id)

  return { favorites, toggleFavorite, isFavorite }
}
