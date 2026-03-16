'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface SubscriptionData {
  plan: 'free' | 'plus'
  status: 'active' | 'inactive' | 'canceled' | 'refunded' | 'expired' | 'chargeback' | null
  expiresAt: string | null
  hotmartSubscriptionId: string | null
}

const DEFAULT_SUBSCRIPTION: SubscriptionData = {
  plan: 'free',
  status: null,
  expiresAt: null,
  hotmartSubscriptionId: null,
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUBSCRIPTION)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, status, expires_at, hotmart_subscription_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        const isActive = data.status === 'active' && (!data.expires_at || new Date(data.expires_at) > new Date())
        setSubscription({
          plan: isActive ? (data.plan as 'free' | 'plus') : 'free',
          status: data.status,
          expiresAt: data.expires_at,
          hotmartSubscriptionId: data.hotmart_subscription_id,
        })
      } else {
        setSubscription(DEFAULT_SUBSCRIPTION)
      }
    } catch (err) {
      console.error('[useSubscription] Erro ao buscar subscription:', err)
      setSubscription(DEFAULT_SUBSCRIPTION)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Fetch inicial + Realtime subscription
  useEffect(() => {
    if (!user?.id) {
      setSubscription(DEFAULT_SUBSCRIPTION)
      setLoading(false)
      return
    }

    fetchSubscription()

    const channel = supabase
      .channel(`subscription-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchSubscription])

  // A8: Background Sync — re-fetch subscription ao reconectar (webhook Hotmart pode ter chegado offline)
  useEffect(() => {
    if (!user?.id || typeof window === 'undefined' || !navigator.serviceWorker) return

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BACKGROUND_SYNC' && event.data?.tag === 'sync-payment-status') {
        console.log('[useSubscription] 🔄 Background sync: re-fetching subscription')
        fetchSubscription()
      }
    }

    const handleOnline = async () => {
      try {
        const reg = await navigator.serviceWorker.ready
        if ('sync' in reg) {
          await (reg.sync as { register: (tag: string) => Promise<void> }).register('sync-payment-status')
          console.log('[useSubscription] 📡 Background sync registrado: sync-payment-status')
        } else {
          // Fallback para navegadores sem Background Sync API
          fetchSubscription()
        }
      } catch {
        fetchSubscription()
      }
    }

    navigator.serviceWorker.addEventListener('message', handleSWMessage)
    window.addEventListener('online', handleOnline)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage)
      window.removeEventListener('online', handleOnline)
    }
  }, [user?.id, fetchSubscription])

  const isPlusUser = subscription.plan === 'plus' && subscription.status === 'active'
  const isExpired = subscription.expiresAt ? new Date(subscription.expiresAt) < new Date() : false

  return {
    subscription,
    loading,
    isPlusUser,
    isExpired,
  }
}
