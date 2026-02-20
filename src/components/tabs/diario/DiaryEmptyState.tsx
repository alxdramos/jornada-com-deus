import { BookOpen, Plus } from "lucide-react";

interface DiaryEmptyStateProps {
  searchActive: boolean;
  onCreateNew: () => void;
}

export function DiaryEmptyState({
  searchActive,
  onCreateNew,
}: DiaryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4">
        <BookOpen className="w-16 h-16 text-[#E5E7EB] mx-auto" />
      </div>

      <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
        {searchActive
          ? "Nenhuma entrada encontrada"
          : "Seu diário está vazio"}
      </h3>

      <p className="text-[#6B7280] mb-6 max-w-sm">
        {searchActive
          ? "Tente ajustar sua busca ou criar uma nova entrada"
          : "Comece a compartilhar seus pensamentos, reflexões e momentos sagrados"}
      </p>

      {!searchActive && (
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FB923C] text-white font-medium hover:bg-[#EA580C] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Criar Primeira Entrada
        </button>
      )}
    </div>
  );
}
