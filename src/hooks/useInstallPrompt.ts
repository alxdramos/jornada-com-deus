'use client'

import { useState, useEffect, useCallback } from 'react'

type Platform = 'ios' | 'android' | 'desktop'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptState {
  isOpen: boolean
  platform: Platform
  deferredPrompt: BeforeInstallPromptEvent | null
  canInstall: boolean
}

interface UseInstallPromptReturn extends InstallPromptState {
  handleDismiss: () => void
  handleInstall: () => Promise<void>
  closeModal: () => void
}

const NAMESPACE = 'jornada-pwa-install'

const getStorageKey = (key: string) => `${NAMESPACE}:${key}`

const detectPlatform = (): Platform => {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)
  const isAndroid = /Android/.test(ua)

  if (isIOS) return 'ios'
  if (isAndroid) return 'android'
  return 'desktop'
}

export function useInstallPrompt(): UseInstallPromptReturn {
  const [state, setState] = useState<InstallPromptState>({
    isOpen: false,
    platform: 'desktop',
    deferredPrompt: null,
    canInstall: false,
  })

  // Initialize platform detection
  useEffect(() => {
    setState(prev => ({ ...prev, platform: detectPlatform() }))
  }, [])

  // Setup beforeinstallprompt listener (Android only)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        deferredPrompt: e as BeforeInstallPromptEvent,
        canInstall: true,
      }))
      console.log('[INSTALL] beforeinstallprompt captured (Android)')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Track visit count (1x on mount)
  useEffect(() => {
    try {
      const current = Number(localStorage.getItem(getStorageKey('visitCount')) || 0)
      localStorage.setItem(getStorageKey('visitCount'), String(current + 1))
      console.log(`[INSTALL] visitCount: ${current + 1}`)
    } catch (e) {
      console.error('[INSTALL] Failed to update visitCount:', e)
    }
  }, [])

  // Track time spent (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const current = Number(localStorage.getItem(getStorageKey('timeSpent')) || 0)
        localStorage.setItem(getStorageKey('timeSpent'), String(current + 1))
      } catch (e) {
        console.error('[INSTALL] Failed to update timeSpent:', e)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track page visits
  useEffect(() => {
    try {
      const current = Number(localStorage.getItem(getStorageKey('pagesVisited')) || 0)
      localStorage.setItem(getStorageKey('pagesVisited'), String(current + 1))
      console.log(`[INSTALL] pagesVisited: ${current + 1}`)
    } catch (e) {
      console.error('[INSTALL] Failed to update pagesVisited:', e)
    }
  }, [])

  // Check triggers every 5 seconds
  useEffect(() => {
    const checkTriggers = () => {
      try {
        // Don't show if already running as installed PWA
        if (
          window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as { standalone?: boolean }).standalone === true
        ) {
          return
        }

        const visitCount = Number(localStorage.getItem(getStorageKey('visitCount')) || 0)
        const timeSpent = Number(localStorage.getItem(getStorageKey('timeSpent')) || 0)
        const pagesVisited = Number(localStorage.getItem(getStorageKey('pagesVisited')) || 0)
        const promptInstalled = localStorage.getItem(getStorageKey('promptInstalled')) === 'true'
        const dismissedAt = Number(localStorage.getItem(getStorageKey('dismissedAt')) || 0)
        const lastPromptTime = Number(localStorage.getItem(getStorageKey('lastPromptTime')) || 0)

        if (promptInstalled) return

        // 7-day cooldown after dismiss
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
        if (dismissedAt && Date.now() - dismissedAt < SEVEN_DAYS) return

        // Don't show more than once per hour in same session
        if (lastPromptTime && Date.now() - lastPromptTime < 3600000) return

        const triggerMet = visitCount >= 2 || timeSpent >= 30 || pagesVisited >= 2

        // Android/Desktop: only show if browser supports installation
        // iOS: always show (no beforeinstallprompt support)
        const canShowForPlatform = state.platform === 'ios' || state.canInstall

        if (triggerMet && canShowForPlatform && !state.isOpen) {
          console.log(
            `[INSTALL] Trigger met (visitCount=${visitCount}, timeSpent=${timeSpent}s, pagesVisited=${pagesVisited})`
          )
          console.log(`[INSTALL] Platform: ${state.platform}`)
          localStorage.setItem(getStorageKey('lastPromptTime'), String(Date.now()))
          setState(prev => ({ ...prev, isOpen: true }))
        }
      } catch (e) {
        console.error('[INSTALL] Error checking triggers:', e)
      }
    }

    const interval = setInterval(checkTriggers, 5000)
    return () => clearInterval(interval)
  }, [state.isOpen, state.platform, state.canInstall])

  const handleDismiss = useCallback(() => {
    try {
      // Use timestamp instead of boolean — allows re-showing after 7 days
      localStorage.setItem(getStorageKey('dismissedAt'), String(Date.now()))
      localStorage.setItem(getStorageKey('lastPromptTime'), String(Date.now()))
      console.log('[INSTALL] Dismissed — will re-offer in 7 days')
      setState(prev => ({ ...prev, isOpen: false }))
    } catch (e) {
      console.error('[INSTALL] Failed to dismiss prompt:', e)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    try {
      if (!state.deferredPrompt) {
        console.log('[INSTALL] No deferredPrompt available')
        return
      }

      state.deferredPrompt.prompt()
      const { outcome } = await state.deferredPrompt.userChoice

      if (outcome === 'accepted') {
        localStorage.setItem(getStorageKey('promptInstalled'), 'true')
        console.log('[INSTALL] User action: clicked_install (accepted)')
      } else {
        localStorage.setItem(getStorageKey('promptDismissed'), 'true')
        console.log('[INSTALL] User action: clicked_install (dismissed by native dialog)')
      }

      setState(prev => ({ ...prev, isOpen: false, deferredPrompt: null }))
    } catch (e) {
      console.error('[INSTALL] Error during installation:', e)
    }
  }, [state.deferredPrompt])

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...state,
    handleDismiss,
    handleInstall,
    closeModal,
  }
}
