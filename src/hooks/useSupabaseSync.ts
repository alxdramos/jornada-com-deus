'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProgressStore } from '@/stores/progressStore'
import { supabase } from '@/lib/supabase'

type Progress = ReturnType<typeof useProgressStore.getState>['progress']

function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

async function pushProgress(userId: string, progress: Progress) {
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id:             userId,
        current_streak:      progress.currentStreak,
        max_streak:          progress.maxStreak,
        total_xp:            progress.totalXp,
        level:               progress.level,
        tree_level:          progress.treeLevel,
        completed_days:      progress.completedDays,
        last_completed_date: progress.lastCompletedDate ?? null,
        completed_dates:     progress.completedDates,
      },
      { onConflict: 'user_id' }
    )
  if (error) console.error('[SupabaseSync] push progress error:', error.message)
}

/**
 * useSupabaseSync
 *
 * 1. No login — hidrata progressStore do Supabase (dados mais recentes vencen)
 * 2. Em mudanças do progressStore — push debounced (2s) para user_progress
 * 3. Realtime subscription — atualiza estado local se outro device avançar
 *
 * Montar uma vez por sessão (AuthSyncWrapper).
 */
export function useSupabaseSync() {
  const { user: supabaseUser } = useAuth()
  const hydratedRef = useRef(false)

  // ── 1. Hydrate on login ──────────────────────────────────
  useEffect(() => {
    if (!supabaseUser || hydratedRef.current) return
    hydratedRef.current = true

    const hydrate = async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single()

      if (!data) return

      const local = useProgressStore.getState().progress

      const remoteDate = data.last_completed_date
        ? new Date(data.last_completed_date).getTime()
        : 0
      const localDate = local.lastCompletedDate
        ? new Date(local.lastCompletedDate).getTime()
        : 0

      // Remote vence se tiver mais XP, ou mesma XP mas data mais recente
      const remoteIsNewer =
        data.total_xp > local.totalXp ||
        (data.total_xp === local.totalXp && remoteDate > localDate)

      if (remoteIsNewer) {
        useProgressStore.setState({
          progress: {
            currentStreak:      data.current_streak,
            maxStreak:          data.max_streak,
            totalXp:            data.total_xp,
            level:              data.level,
            treeLevel:          data.tree_level,
            completedDays:      data.completed_days,
            lastCompletedDate:  data.last_completed_date ?? null,
            completedDates:     data.completed_dates ?? [],
          },
        })
        console.log('[SupabaseSync] ✅ Progress hydrated from Supabase')
      } else {
        // Local é mais novo — push para Supabase sincronizar
        await pushProgress(supabaseUser.id, local)
        console.log('[SupabaseSync] ✅ Local progress pushed to Supabase')
      }
    }

    hydrate().catch(console.error)
  }, [supabaseUser])

  // ── 2. Push on changes (debounced 2s) ───────────────────
  useEffect(() => {
    if (!supabaseUser) return

    const debouncedPush = debounce((progress: Progress) => {
      pushProgress(supabaseUser.id, progress)
    }, 2000)

    const unsubscribe = useProgressStore.subscribe((state) => {
      debouncedPush(state.progress)
    })

    return () => unsubscribe()
  }, [supabaseUser])

  // ── 3. Realtime — sync multi-device ─────────────────────
  useEffect(() => {
    if (!supabaseUser) return

    const channel = supabase
      .channel(`progress-${supabaseUser.id}`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'user_progress',
          filter: `user_id=eq.${supabaseUser.id}`,
        },
        (payload) => {
          const d = payload.new as Record<string, unknown>
          const local = useProgressStore.getState().progress

          // Só aplica se o remote avançou mais (evita sobrescrever progresso local)
          if ((d.total_xp as number) > local.totalXp) {
            useProgressStore.setState({
              progress: {
                currentStreak:     d.current_streak as number,
                maxStreak:         d.max_streak as number,
                totalXp:           d.total_xp as number,
                level:             d.level as number,
                treeLevel:         d.tree_level as number,
                completedDays:     d.completed_days as number,
                lastCompletedDate: (d.last_completed_date as string) ?? null,
                completedDates:    (d.completed_dates as string[]) ?? [],
              },
            })
            console.log('[SupabaseSync] 🔄 Realtime update applied')
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabaseUser])
}
