import { Heart, Quote, BookOpen } from "lucide-react";
import { DiaryEntry, ENTRY_TYPE_ICONS } from "@/data/diario";
import { cn } from "@/lib/utils";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onViewDetail: (entry: DiaryEntry) => void;
  onToggleFavorite: (id: string) => void;
}

export function DiaryEntryCard({
  entry,
  onViewDetail,
  onToggleFavorite,
}: DiaryEntryCardProps) {
  const getTypeColor = () => {
    switch (entry.type) {
      case "note": return "bg-blue-50 border-blue-200";
      case "highlight": return "bg-yellow-50 border-yellow-200";
      case "verse": return "bg-purple-50 border-purple-200";
      case "quote": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = () => {
    switch (entry.type) {
      case "note": return "Anotação";
      case "highlight": return "Destaque";
      case "verse": return "Versículo";
      case "quote": return "Citação";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div
      onClick={() => onViewDetail(entry)}
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
        getTypeColor()
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{ENTRY_TYPE_ICONS[entry.type]}</span>
          <span className="text-xs font-medium text-[#6B7280]">
            {getTypeLabel()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(entry.id);
          }}
          className="p-1 hover:bg-white/50 rounded transition-colors"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              entry.isFavorite
                ? "text-red-500 fill-current"
                : "text-[#6B7280]"
            )}
          />
        </button>
      </div>

      <h3 className="font-semibold text-[#1F2937] mb-1 line-clamp-2">
        {entry.title}
      </h3>

      <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
        {entry.content}
      </p>

      {entry.reference && (
        <p className="text-xs font-medium text-[#6B7280] mb-2">
          — {entry.reference}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9CA3AF]">
          {formatDate(entry.createdAt)}
        </span>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {entry.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/50 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
