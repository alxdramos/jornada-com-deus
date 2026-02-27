"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Label exibido no fallback padrão quando não há fallback customizado */
  fallbackLabel?: string;
  /** Tag para identificar o contexto no Sentry (ex: "GamificationCard", "TabMeditacoes") */
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary reutilizável para envolver componentes críticos.
 * Captura erros de renderização e envia para o Sentry com contexto.
 *
 * Uso:
 *   <ErrorBoundary context="GamificationCard">
 *     <GamificationCard />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      tags: { context: this.props.context ?? "unknown" },
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-muted/30 border border-border text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm text-muted-foreground">
            {this.props.fallbackLabel ?? "Este bloco encontrou um problema."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
