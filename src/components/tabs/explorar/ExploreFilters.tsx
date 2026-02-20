import { CATEGORIAS, CHIPS } from "@/data/meditacoes";
import { cn } from "@/lib/utils";

interface ExploreFiltersProps {
  categoryActive: string;
  chipActive: string;
  onCategoryChange: (category: string) => void;
  onChipChange: (chip: string) => void;
}

export function ExploreFilters({
  categoryActive,
  chipActive,
  onCategoryChange,
  onChipChange,
}: ExploreFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              categoryActive === c
                ? "bg-[#1F2937] text-white"
                : "bg-white text-[#1F2937] shadow-sm hover:bg-gray-50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => onChipChange(c)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              chipActive === c
                ? "bg-[#FB923C] text-white"
                : "bg-white/80 text-[#6B7280] hover:bg-white/100"
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
