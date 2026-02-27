import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  selected: string[];
  onToggle: (interest: string) => void;
}

const INTERESTS = [
  { id: 'paz',        emoji: '🕊️', label: 'Paz Interior' },
  { id: 'fe',         emoji: '🙏', label: 'Fé e Oração' },
  { id: 'familia',    emoji: '👨‍👩‍👧', label: 'Família' },
  { id: 'biblia',     emoji: '📖', label: 'Bíblia' },
  { id: 'meditacao',  emoji: '🧘', label: 'Meditação' },
  { id: 'gratidao',   emoji: '✨', label: 'Gratidão' },
  { id: 'cura',       emoji: '💚', label: 'Cura e Saúde' },
  { id: 'proposito',  emoji: '🌟', label: 'Propósito' },
  { id: 'louvor',     emoji: '🎶', label: 'Louvor' },
];

export function SlideInterests({ selected, onToggle }: Props) {
  return (
    <div className="flex flex-col h-full px-6 pt-8 pb-4">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-3xl mb-2">🌱</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">O que move seu coração?</h2>
        <p className="text-sm text-muted-foreground">
          Escolha seus temas de interesse (selecione ao menos 1)
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2.5 flex-1 content-start">
        {INTERESTS.map((item, i) => {
          const isSelected = selected.includes(item.id);
          return (
            <motion.button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95
                ${isSelected
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-border bg-card'}
              `}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              <span className="text-xl">{item.emoji}</span>
              <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.p
          className="text-center text-xs text-amber-600 dark:text-amber-400 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selected.length} tema{selected.length > 1 ? 's' : ''} selecionado{selected.length > 1 ? 's' : ''}
        </motion.p>
      )}
    </div>
  );
}
