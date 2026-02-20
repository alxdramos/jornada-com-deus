import { Heart } from "lucide-react";
import { FavoritoItem } from "@/data/calendario";
import { cn } from "@/lib/utils";

interface FavoritosListProps {
  favoritos: FavoritoItem[];
  tipoCor: (tipo: FavoritoItem["tipo"]) => string;
  tipoLabel: (tipo: FavoritoItem["tipo"]) => string;
}

export function FavoritosList({
  favoritos,
  tipoCor,
  tipoLabel
}: FavoritosListProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#6B7280] mb-4">
        {favoritos.length} {favoritos.length === 1 ? "item favoritado" : "itens favoritados"}
      </p>
      {favoritos.map(item => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm"
        >
          <Heart className="w-5 h-5 text-red-400 fill-current shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#1F2937] text-sm truncate">
              {item.titulo}
            </p>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
            tipoCor(item.tipo)
          )}>
            {tipoLabel(item.tipo)}
          </span>
        </div>
      ))}
    </div>
  );
}
