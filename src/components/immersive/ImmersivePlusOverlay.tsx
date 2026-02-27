import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

interface ImmersivePlusOverlayProps {
  show: boolean;
  onClose: () => void;
}

export function ImmersivePlusOverlay({
  show,
  onClose
}: ImmersivePlusOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">
              Conteúdo Premium
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Esta oração está disponível apenas para membros Premium
            </p>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-[#92400E] via-[#D97706] to-[#FB923C] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity">
                Ver Planos Premium
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 text-[#6B7280] font-medium"
              >
                Ouvir depois
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
