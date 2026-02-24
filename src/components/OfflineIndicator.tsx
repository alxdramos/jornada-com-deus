"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useToast } from "@/hooks/useToast";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    if (!isOnline) {
      showError(
        "Sem conexão com a internet. Conteúdo em cache disponível offline.",
        { duration: 6000 }
      );
    } else if (wasOffline) {
      showSuccess("Conexão restaurada! Tudo funcionando normalmente.", {
        duration: 4000,
      });
    }
  }, [isOnline, wasOffline, showError, showSuccess]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[1000] bg-red-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-between w-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Você está offline – conteúdo limitado</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 text-xs font-semibold bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar novamente
            </button>
          </div>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-0 left-0 right-0 z-[1000] bg-green-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Conexão restaurada – tudo disponível</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente específico para erros offline na Bíblia
export function BibleOfflineMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <WifiOff className="w-8 h-8 text-red-500" />
      </div>

      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
        Sem conexão com a internet
      </h3>

      <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
        A leitura da Bíblia requer conexão com a internet para buscar os textos da API.
        Verifique sua conexão e tente novamente.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-[#FB923C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Recarregar página
        </button>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-white border border-[#E5E7EB] text-[#1F2937] py-3 px-4 rounded-xl font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Componente para erros gerais da API
export function BibleApiError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  const isOfflineError = error.includes('Failed to fetch') ||
                        error.includes('Network') ||
                        error.includes('fetch');

  if (isOfflineError) {
    return <BibleOfflineMessage onRetry={onRetry} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-amber-500" />
      </div>

      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
        Erro ao carregar
      </h3>

      <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
        {error.includes('Referência inválida')
          ? "Verifique se a referência está correta. Use o formato 'Livro Capítulo:Versículo' (ex: 'João 3:16')."
          : "Ocorreu um erro ao buscar os dados. Tente novamente em alguns instantes."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full bg-[#FB923C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </motion.div>
  );
}