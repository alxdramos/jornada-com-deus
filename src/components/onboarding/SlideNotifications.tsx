import { motion } from 'framer-motion';
import { Bell, Clock, Heart, X } from 'lucide-react';

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  isLoading: boolean;
  permission: string;
}

const BENEFITS = [
  { icon: Clock, text: 'Lembrete diário no horário que você preferir' },
  { icon: Heart,  text: 'Nunca perca um dia da sua jornada espiritual' },
];

export function SlideNotifications({ onEnable, onSkip, isLoading, permission }: Props) {
  const alreadyGranted = permission === 'granted';
  const denied = permission === 'denied';

  return (
    <div className="flex flex-col h-full px-6 pt-8 pb-4 items-center">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <Bell className="w-10 h-10 text-amber-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Nunca esqueça sua jornada</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {denied
            ? 'Você bloqueou as notificações. Ative nas configurações do celular quando quiser.'
            : alreadyGranted
            ? 'Notificações já estão ativas! Você receberá lembretes diários.'
            : 'Ative as notificações para receber um lembrete gentil para seu momento com Deus.'}
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 w-full mb-8">
        {BENEFITS.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-foreground">{text}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full mt-auto">
        {!denied && !alreadyGranted && (
          <button
            onClick={onEnable}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 transition-transform"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            Ativar notificações
          </button>
        )}
        {alreadyGranted && (
          <div className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2">
            <span>✓</span> Notificações ativas
          </div>
        )}
        <button
          onClick={onSkip}
          className="w-full py-2.5 text-sm text-muted-foreground flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          {denied ? 'Continuar sem notificações' : 'Agora não'}
        </button>
      </div>
    </div>
  );
}
