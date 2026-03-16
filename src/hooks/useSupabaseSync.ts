'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProgressStore } from '@/stores/progressStore'
import { supabase } from '@/lib/supabase'

type Progress = ReturnType<typeof useProgressStore.getState>['progress']

/** Gera e persiste um device_id único por browser (localStorage). */
function getDeviceId(): string {
  const key = 'jornada_device_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

async function pushProgress(
  userId: string,
  progress: Progress,
  deviceId: string,
  version: number,
) {
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
        device_id:           deviceId,
        version:             version,
      },
      { onConflict: 'user_id' }
    )
  if (error) console.error('[SupabaseSync] push progress error:', error.message)
}

/**
 * useSupabaseSync
 *
 * 1. No login — hidrata progressStore do Supabase (dados mais recentes vencem)
 * 2. Em mudanças do progressStore — push debounced (2s) com device_id + version
 * 3. Realtime subscription — ignora echo (mesmo device_id), aplica só se XP maior
 *
 * A7: device_id evita echo no Realtime; version evita sobrescrever progresso mais recente.
 */
export function useSupabaseSync() {
  const { user: supabaseUser } = useAuth()
  const hydratedRef = useRef(false)
  const versionRef  = useRef(0)
  const deviceIdRef = useRef('')

  // Inicializa device_id no cliente (localStorage não disponível no SSR)
  useEffect(() => {
    deviceIdRef.current = getDeviceId()
  }, [])

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

      // Sincroniza version local com o DB (continua a partir do último valor)
      versionRef.current = (data.version ?? 0) + 1

      const local = useProgressStore.getState().progress

      const remoteDate = data.last_completed_date
        ? new Date(data.last_completed_date).getTime()
        : 0
      const localDate = local.lastCompletedDate
        ? new Date(local.lastCompletedDate).getTime()
        : 0

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
        await pushProgress(supabaseUser.id, local, deviceIdRef.current, versionRef.current++)
        console.log('[SupabaseSync] ✅ Local progress pushed to Supabase')
      }
    }

    hydrate().catch(console.error)
  }, [supabaseUser])

  // ── 2. Push on changes (debounced 2s) ───────────────────
  useEffect(() => {
    if (!supabaseUser) return

    const debouncedPush = debounce((progress: Progress) => {
      pushProgress(supabaseUser.id, progress, deviceIdRef.current, versionRef.current++)
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

          // Echo protection: ignora updates originados neste mesmo device
          if (d.device_id === deviceIdRef.current) return

          const local = useProgressStore.getState().progress

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
            // Sincroniza version para evitar writes obsoletos a seguir
            versionRef.current = ((d.version as number) ?? 0) + 1
            console.log('[SupabaseSync] 🔄 Realtime update applied from another device')
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabaseUser])
}
