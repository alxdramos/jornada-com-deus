import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiaryEntryType, ENTRY_TYPE_LABELS, ENTRY_TYPE_ICONS } from "@/data/diario";
import { cn } from "@/lib/utils";

interface DiaryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    type: DiaryEntryType;
    title: string;
    content: string;
    reference?: string;
    tags: string[];
  }) => void;
}

export function DiaryCreateModal({
  isOpen,
  onClose,
  onCreate,
}: DiaryCreateModalProps) {
  const [entryType, setEntryType] = useState<DiaryEntryType>("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    onCreate({
      type: entryType,
      title: title.trim(),
      content: content.trim(),
      reference: reference.trim() || undefined,
      tags,
    });

    setTitle("");
    setContent("");
    setReference("");
    setTags([]);
    setEntryType("note");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Nova Entrada
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tipo de entrada */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-3">
                  Tipo de Entrada
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["note", "highlight", "verse", "quote"] as DiaryEntryType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setEntryType(type)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-center",
                        entryType === type
                          ? "border-[#FB923C] bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="text-2xl mb-1">{ENTRY_TYPE_ICONS[type]}</div>
                      <div className="text-sm font-medium text-[#1F2937]">
                        {ENTRY_TYPE_LABELS[type]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título..."
                  className="w-full px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                />
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Conteúdo *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo..."
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FB923C] resize-none"
                />
              </div>

              {/* Referência */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Referência (opcional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: João 3:16 ou Martin Luther King Jr."
                  className="w-full px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Tags (opcional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Digite uma tag e pressione Enter..."
                    className="flex-1 px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg bg-[#FB923C] text-white font-medium hover:bg-[#EA580C] transition-colors"
                  >
                    + Adicionar
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-[#F3F4F6] text-[#1F2937] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-[#1F2937] font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim()}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#FB923C] text-white font-medium hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Entrada
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
