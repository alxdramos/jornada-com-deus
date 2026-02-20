import { cn } from "@/lib/utils";
import { DIAS_SEMANA } from "@/data/calendario";
import { useProgressStore } from "@/stores/progressStore";

interface CalendarGridProps {
  mesSelecionado: Date;
}

interface DiaInfo {
  dia: number | null;
  concluido: boolean;
  ehHoje: boolean;
}

export function CalendarGrid({ mesSelecionado }: CalendarGridProps) {
  const { progress } = useProgressStore();

  const gerarDiasDoMes = (): DiaInfo[] => {
    const ano = mesSelecionado.getFullYear();
    const mes = mesSelecionado.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const completedSet = new Set(progress.completedDates ?? []);
    const hoje = new Date();

    const dias: DiaInfo[] = [];
    // Células vazias antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
      dias.push({ dia: null, concluido: false, ehHoje: false });
    }
    // Dias do mês
    for (let d = 1; d <= totalDias; d++) {
      const dateStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const ehHoje = hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;
      dias.push({ dia: d, concluido: completedSet.has(dateStr), ehHoje });
    }
    return dias;
  };

  const dias = gerarDiasDoMes();

  return (
    <>
      {/* Cabeçalho da semana */}
      <div className="grid grid-cols-7 mb-2">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="text-center text-xs font-medium text-[#9CA3AF] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((item, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {item.dia !== null && (
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  item.concluido
                    ? "bg-[#10B981] text-white"
                    : item.ehHoje
                    ? "border-2 border-[#FB923C] text-[#FB923C]"
                    : "text-[#6B7280] hover:bg-[#F9FAFB]"
                )}
              >
                {item.dia}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#10B981]" />
          <span className="text-xs text-[#6B7280]">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#FB923C]" />
          <span className="text-xs text-[#6B7280]">Hoje</span>
        </div>
      </div>
    </>
  );
}
