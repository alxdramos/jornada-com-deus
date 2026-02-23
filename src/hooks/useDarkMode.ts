import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyDarkMode = (isDarkMode: boolean) => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const stored = localStorage.getItem('dark-mode');
    if (stored !== null) {
      const isDarkMode = stored === 'true';
      setIsDark(isDarkMode);
      applyDarkMode(isDarkMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      applyDarkMode(prefersDark);
    }
  }, []);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('dark-mode', newValue.toString());
    applyDarkMode(newValue);
  };

  return { isDark, toggle, mounted };
};
