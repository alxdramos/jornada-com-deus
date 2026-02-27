"use client";

import { useState, useCallback } from "react";

interface ShareData {
  title: string;
  text: string;
  url?: string;
}

const APP_URL = "https://app.minhajornadadiaria.com.br";

export function useNativeShare() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    const { title, text, url = APP_URL } = data;

    if (typeof navigator === "undefined") return false;

    // Web Share API (mobile nativo — iOS Safari, Android Chrome)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (err) {
        // AbortError = usuário cancelou — não é erro real
        if ((err as Error).name === "AbortError") return false;
        // Outros erros: cai no fallback
      }
    }

    // Fallback: copiar para clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { share, copied };
}
