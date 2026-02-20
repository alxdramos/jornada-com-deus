import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrayerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePrayer: (title: string, content: string, category: string) => void;
}

export function PrayerCreateModal({
  isOpen,
  onClose,
  onCreatePrayer
}: PrayerCreateModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Minhas");

  const handleCreate = () => {
    onCreatePrayer(title, content, category);
    setTitle("");
    setContent("");
    setCategory("Minhas");
    onClose();
  };

  const isValid = title.trim() && content.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1F2937]">Nova Oração</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Título da Oração
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Oração pela família"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937]"
                  >
                    {["Minhas", "Graças", "Paz", "Família", "Perdão", "Força"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Conteúdo da Oração
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escreva sua oração aqui..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] placeholder:text-[#9CA3AF] resize-none"
                  />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!isValid}
                  className="w-full py-4 bg-[#10B981] text-white font-semibold rounded-xl hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Criar Oração
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
