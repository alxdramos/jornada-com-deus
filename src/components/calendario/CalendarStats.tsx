import { Flame, Calendar } from "lucide-react";

interface CalendarStatsProps {
  currentStreak: number;
  completedDays: number;
  maxStreak: number;
}

export function CalendarStats({
  currentStreak,
  completedDays,
  maxStreak
}: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-[#FFF7ED] rounded-2xl p-3 text-center">
        <Flame className="w-5 h-5 text-[#FB923C] mx-auto mb-1" />
        <p className="text-xl font-bold text-[#1F2937]">{currentStreak}</p>
        <p className="text-xs text-[#6B7280]">Sequência</p>
      </div>
      <div className="bg-[#F0FDF4] rounded-2xl p-3 text-center">
        <Calendar className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
        <p className="text-xl font-bold text-[#1F2937]">{completedDays}</p>
        <p className="text-xs text-[#6B7280]">Total dias</p>
      </div>
      <div className="bg-[#F5F3FF] rounded-2xl p-3 text-center">
        <Flame className="w-5 h-5 text-[#8B5CF6] mx-auto mb-1" />
        <p className="text-xl font-bold text-[#1F2937]">{maxStreak}</p>
        <p className="text-xs text-[#6B7280]">Recorde</p>
      </div>
    </div>
  );
}
