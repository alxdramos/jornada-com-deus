"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// error.tsx — captura erros em route segments (sem html/body, usa o layout pai)
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="text-5xl">😔</div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            Página com problema
          </h2>
          <p className="text-sm text-muted-foreground">
            Não conseguimos carregar este conteúdo. Já estamos investigando.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Ref: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar novamente
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}
