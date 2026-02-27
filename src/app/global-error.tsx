"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error.tsx substitui o root layout — DEVE incluir <html> e <body>
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F9F8F5] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="text-6xl">🙏</div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#1F2937]">
              Algo inesperado aconteceu
            </h1>
            <p className="text-sm text-[#6B7280]">
              Nossa equipe já foi notificada. Tente recarregar o app.
            </p>
            {error.digest && (
              <p className="text-xs text-[#9CA3AF] font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FB923C] text-white rounded-2xl font-semibold text-sm hover:bg-[#f97316] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
