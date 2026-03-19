'use client';

import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSheet({ isOpen, onClose }: NotificationSheetProps) {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe, isSupported } =
    usePushNotifications();
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      if (isSubscribed) {
        const ok = await unsubscribe();
        if (ok) toast.success('Notificações desativadas');
        else toast.error('Erro ao desativar. Tente novamente.');
      } else {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const ok = await subscribe(authUser?.id);
        if (ok) {
          toast.success('Notificações ativadas! Você receberá lembretes diários às 7h 🌅');
        } else if (permission === 'denied') {
          toast.error('Permissão negada. Habilite nas configurações do navegador.');
        } else {
          toast.error('Erro ao ativar. Tente novamente.');
        }
      }
    } finally {
      setToggling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl p-6 shadow-2xl max-w-lg mx-auto">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔔</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Lembretes Diários
          </h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Receba uma mensagem de encorajamento espiritual todos os dias às{' '}
          <strong>7h da manhã</strong> para nunca perder sua jornada com Deus.
        </p>

        {/* Estado não suportado */}
        {!isSupported && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ Seu navegador não suporta notificações push. Tente no Chrome ou Edge.
            </p>
          </div>
        )}

        {/* Estado bloqueado */}
        {isSupported && permission === 'denied' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              🚫 Notificações bloqueadas. Para ativar, acesse as configurações do seu
              navegador e permita notificações para este site.
            </p>
          </div>
        )}

        {/* Toggle principal */}
        {isSupported && permission !== 'denied' && (
          <button
            onClick={handleToggle}
            disabled={isLoading || toggling}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              isSubscribed
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            } ${isLoading || toggling ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{isSubscribed ? '✅' : '🔕'}</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {isSubscribed ? 'Ativadas' : 'Desativadas'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isSubscribed
                    ? 'Você recebe lembretes às 7h'
                    : 'Toque para ativar lembretes'}
                </p>
              </div>
            </div>

            {/* Toggle switch visual */}
            <div
              className={`w-12 h-6 rounded-full transition-colors ${
                isSubscribed ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${
                  isSubscribed ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>
        )}

        {/* Preview da mensagem */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Exemplo de lembrete
          </p>
          <div className="flex items-start gap-2">
            <img src="/icon-192x192.png" alt="icon" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Bom dia! 🌅
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Comece sua jornada com Deus. Ele já está te esperando.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Fechar
        </button>
      </div>
    </>
  );
}
