import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jd-reading-font-size';

/** Available font sizes in px (smallest → largest) */
const SIZES = [14, 16, 18, 20] as const;
type FontSizeValue = (typeof SIZES)[number];

/**
 * Hook that manages the user's preferred reading font size.
 * Persists selection to localStorage and is shared across all reading modals.
 */
export function useReadingFontSize() {
  const [sizeIndex, setSizeIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 1; // SSR safe
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 1; // default: 16px
    const num = Number(saved) as FontSizeValue;
    const idx = SIZES.indexOf(num);
    return idx !== -1 ? idx : 1;
  });

  const increase = useCallback(() => {
    setSizeIndex(prev => {
      const next = Math.min(prev + 1, SIZES.length - 1);
      localStorage.setItem(STORAGE_KEY, String(SIZES[next]));
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setSizeIndex(prev => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem(STORAGE_KEY, String(SIZES[next]));
      return next;
    });
  }, []);

  return {
    fontSize: SIZES[sizeIndex],
    canIncrease: sizeIndex < SIZES.length - 1,
    canDecrease: sizeIndex > 0,
    increase,
    decrease,
  };
}
