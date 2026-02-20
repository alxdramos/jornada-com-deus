import { ChevronLeft, ChevronRight } from "lucide-react";
import { MESES } from "@/data/calendario";

interface MonthNavigationProps {
  mesSelecionado: Date;
  onMesChange: (direction: -1 | 1) => void;
}

export function MonthNavigation({
  mesSelecionado,
  onMesChange
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => onMesChange(-1)}
        className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
      </button>
      <h3 className="font-semibold text-[#1F2937]">
        {MESES[mesSelecionado.getMonth()]} {mesSelecionado.getFullYear()}
      </h3>
      <button
        onClick={() => onMesChange(1)}
        className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-[#6B7280]" />
      </button>
    </div>
  );
}
