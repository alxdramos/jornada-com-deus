'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-redirect com countdown ao voltar online
  useEffect(() => {
    if (!isOnline) {
      setCountdown(null);
      return;
    }
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          window.location.href = '/';
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Status Icon */}
        <div className="flex justify-center">
          {isOnline ? (
            <div className="p-6 bg-green-500/20 rounded-full">
              <Wifi className="w-12 h-12 text-green-500" />
            </div>
          ) : (
            <div className="p-6 bg-red-500/20 rounded-full animate-pulse">
              <WifiOff className="w-12 h-12 text-red-500" />
            </div>
          )}
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            {isOnline ? 'Conexão Restaurada!' : 'Você está Offline'}
          </h1>
          <p className="text-slate-400">
            {isOnline
              ? countdown !== null
                ? `Redirecionando em ${countdown}...`
                : 'Redirecionando...'
              : 'Sem conexão com a internet. Você ainda pode acessar orações, meditações e o diário em cache.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            {isOnline ? 'Ir para Home agora' : 'Tentar novamente'}
          </button>
        </div>

        {/* Tips */}
        <div className="pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-3 font-semibold">DICAS:</p>
          <ul className="text-xs text-slate-400 space-y-2 text-left">
            <li>✓ Suas orações e meditações favoritas estão disponíveis offline</li>
            <li>✓ Leia a Bíblia sem conexão</li>
            <li>✓ Sua página de Hoje está em cache</li>
            <li>✓ Seu diário sincronizará quando voltar online</li>
          </ul>
        </div>

        {/* Status Indicator */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline
                ? 'bg-green-500 animate-none'
                : 'bg-red-500 animate-pulse'
            }`}
          />
          <span className="text-xs text-slate-400">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
}
