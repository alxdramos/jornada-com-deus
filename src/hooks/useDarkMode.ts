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

    // Light é o padrão. Dark só ativa se o usuário explicitamente escolheu.
    const stored = localStorage.getItem('dark-mode');
    const isDarkMode = stored === 'true';
    setIsDark(isDarkMode);
    applyDarkMode(isDarkMode);
  }, []);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('dark-mode', newValue.toString());
    applyDarkMode(newValue);
  };

  return { isDark, toggle, mounted };
};
