import { Heart } from "lucide-react";

export function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-4">
        <Heart className="w-8 h-8 text-[#FB923C]" />
      </div>
      <h3 className="font-semibold text-[#1F2937] mb-1">
        Nenhum favorito ainda
      </h3>
      <p className="text-sm text-[#6B7280] max-w-xs">
        Adicione orações e entradas do diário aos favoritos para vê-las aqui.
      </p>
    </div>
  );
}
