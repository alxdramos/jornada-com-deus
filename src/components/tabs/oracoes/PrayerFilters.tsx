import { CATEGORIAS } from "@/data/oracoes";
import { cn } from "@/lib/utils";

interface PrayerFiltersProps {
  categoriaAtiva: string;
  onSelectCategory: (categoria: string) => void;
}

export function PrayerFilters({
  categoriaAtiva,
  onSelectCategory
}: PrayerFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIAS.map((categoria) => (
        <button
          key={categoria}
          onClick={() => onSelectCategory(categoria)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            categoriaAtiva === categoria
              ? "bg-[#10B981] text-white"
              : "bg-white text-[#1F2937] hover:bg-[#F9FAFB]"
          )}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
