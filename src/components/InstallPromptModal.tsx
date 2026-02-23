'use client'

import { AnimatePresence } from 'framer-motion'
import { AndroidInstallFlow } from './AndroidInstallFlow'
import { IosInstallGuide } from './iOSInstallGuide'

type Platform = 'ios' | 'android' | 'desktop'

interface InstallPromptModalProps {
  isOpen: boolean
  platform: Platform
  onInstall: () => Promise<void>
  onDismiss: () => void
  isLoading?: boolean
}

export function InstallPromptModal({
  isOpen,
  platform,
  onInstall,
  onDismiss,
  isLoading = false,
}: InstallPromptModalProps) {
  if (!isOpen) return null

  const shouldShowAndroid = platform === 'android' || platform === 'desktop'
  const shouldShowiOS = platform === 'ios'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onDismiss}
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
          />

          {/* Modal Content */}
          {shouldShowAndroid && (
            <AndroidInstallFlow onInstall={onInstall} onDismiss={onDismiss} isLoading={isLoading} />
          )}

          {shouldShowiOS && <IosInstallGuide onClose={onDismiss} />}
        </>
      )}
    </AnimatePresence>
  )
}
