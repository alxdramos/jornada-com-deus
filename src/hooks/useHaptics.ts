"use client";

/**
 * useHaptics — Feedback háptico nativo via Web Vibration API
 *
 * Suportado em Android Chrome/Firefox. iOS Safari não suporta.
 * Falha silenciosamente em dispositivos sem suporte.
 */

// Padrões de vibração: [duração_ms] ou [vibrar, pausa, vibrar, ...]
const HAPTIC_PATTERNS = {
  light: 10,
  medium: 25,
  stepComplete: [15, 30, 25],      // Etapa diária concluída
  dayComplete: [30, 20, 50, 20, 80], // Dia completo — sensação de conquista
  levelUp: [80, 40, 80, 40, 150],    // Evolução de nível — vibração grandiosa
  treeEvolve: [50, 30, 50, 30, 50, 80, 200], // Árvore evoluiu — celebração
  error: [40, 20, 40],
} as const;

function vibrate(pattern: number | readonly number[]) {
  if (typeof window === 'undefined') return;
  if (!('vibrate' in navigator)) return;
  try {
    navigator.vibrate(Array.isArray(pattern) ? [...pattern] : (pattern as number));
  } catch {
    // Silently ignore — vibração não crítica
  }
}

export function useHaptics() {
  return {
    vibrateLight: () => vibrate(HAPTIC_PATTERNS.light),
    vibrateMedium: () => vibrate(HAPTIC_PATTERNS.medium),
    vibrateStepComplete: () => vibrate(HAPTIC_PATTERNS.stepComplete),
    vibrateDayComplete: () => vibrate(HAPTIC_PATTERNS.dayComplete),
    vibrateLevelUp: () => vibrate(HAPTIC_PATTERNS.levelUp),
    vibrateTreeEvolve: () => vibrate(HAPTIC_PATTERNS.treeEvolve),
    vibrateError: () => vibrate(HAPTIC_PATTERNS.error),
  };
}
