import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function PlusOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937] mb-2">
          Conteúdo Plus
        </h3>
        <p className="text-sm text-[#6B7280] mb-4">
          Esta meditação está disponível apenas para membros Plus
        </p>
        <button className="w-full py-3 px-4 bg-gradient-to-r from-[#FB923C] to-[#F97316] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity">
          Atualizar para Plus
        </button>
      </div>
    </motion.div>
  );
}
