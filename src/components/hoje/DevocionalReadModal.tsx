import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { DEVOCIONAL_FIXO } from "@/data/hojeSteps";

interface DevocionalReadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevocionalReadModal({
  isOpen,
  onClose
}: DevocionalReadModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#FB923C]">
                    Devocional
                  </span>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-0.5">
                    {DEVOCIONAL_FIXO.titulo}
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">{DEVOCIONAL_FIXO.refBiblica}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap text-base">
                {DEVOCIONAL_FIXO.texto}
              </p>
            </div>

            <div className="px-6 pb-8">
              <button
                onClick={onClose}
                className="w-full py-4 bg-[#1F2937] text-white font-semibold rounded-2xl hover:bg-[#374151] transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
