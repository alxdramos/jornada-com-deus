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
        // Get current values
        const visitCount = Number(localStorage.getItem(getStorageKey('visitCount')) || 0)
        const timeSpent = Number(localStorage.getItem(getStorageKey('timeSpent')) || 0)
        const pagesVisited = Number(localStorage.getItem(getStorageKey('pagesVisited')) || 0)
        const promptDismissed = localStorage.getItem(getStorageKey('promptDismissed')) === 'true'
        const promptInstalled = localStorage.getItem(getStorageKey('promptInstalled')) === 'true'
        const lastPromptTime = Number(localStorage.getItem(getStorageKey('lastPromptTime')) || 0)

        // Suppress conditions
        if (promptDismissed) {
          console.log('[INSTALL] Suppressed: promptDismissed = true')
          return
        }
        if (promptInstalled) {
          console.log('[INSTALL] Suppressed: promptInstalled = true')
          return
        }

        // Don't show more than once per hour
        if (lastPromptTime && Date.now() - lastPromptTime < 3600000) {
          return
        }

        // Check triggers
        const triggerMet = visitCount >= 2 || timeSpent >= 30 || pagesVisited >= 2

        if (triggerMet && !state.isOpen) {
          console.log(
            `[INSTALL] Trigger evaluated: TRUE (visitCount=${visitCount}, timeSpent=${timeSpent}, pagesVisited=${pagesVisited})`
          )
          console.log(`[INSTALL] Platform detected: ${state.platform}`)
          console.log('[INSTALL] Modal shown')

          // Update lastPromptTime
          localStorage.setItem(getStorageKey('lastPromptTime'), String(Date.now()))

          setState(prev => ({ ...prev, isOpen: true }))
        }
      } catch (e) {
        console.error('[INSTALL] Error checking triggers:', e)
      }
    }

    const interval = setInterval(checkTriggers, 5000)
    return () => clearInterval(interval)
  }, [state.isOpen, state.platform])

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(getStorageKey('promptDismissed'), 'true')
      localStorage.setItem(getStorageKey('lastPromptTime'), String(Date.now()))
      console.log('[INSTALL] User action: clicked_depois (dismissed)')
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
