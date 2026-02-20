import { Search, X } from "lucide-react";
import { DIARY_TABS, DiaryTabType } from "@/data/diario";
import { cn } from "@/lib/utils";

interface DiaryFiltersProps {
  activeTab: DiaryTabType;
  onTabChange: (tab: DiaryTabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSearch: boolean;
  onToggleSearch: (show: boolean) => void;
}

export function DiaryFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  showSearch,
  onToggleSearch,
}: DiaryFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Abas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DIARY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab
                ? "bg-[#1F2937] text-white"
                : "bg-white text-[#1F2937] shadow-sm hover:bg-gray-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Busca */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Buscar entradas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FB923C]"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-3 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
