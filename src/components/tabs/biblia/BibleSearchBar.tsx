import { Search, X, Loader2 } from "lucide-react";

interface BibleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  loading: boolean;
}

export function BibleSearchBar({
  value,
  onChange,
  onSearch,
  loading,
}: BibleSearchBarProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder='Buscar referência (ex: "João 3:16")'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onSearch(value);
              }
            }}
            disabled={loading}
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937] placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20 focus:border-[#FB923C] disabled:opacity-50"
          />
          {value && !loading && (
            <button
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#E5E7EB] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          )}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-[#FB923C] animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={() => onSearch(value)}
          disabled={loading || !value.trim()}
          className="px-4 py-3 rounded-xl bg-[#FB923C] text-white font-medium hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
