"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Category {
  id: string;
  label: string;
  image: string;
}

const CATEGORIAS: Category[] = [
  { id: "devocional", label: "Devocional", image: "/images/creation_2422201804.png" },
  { id: "diario", label: "Diário", image: "/images/creation_2422204530.png" },
  { id: "meditacao", label: "Meditação", image: "/images/creation_2422206392.png" },
  { id: "oracao", label: "Oração", image: "/images/creation_2422209737.png" },
  { id: "biblia", label: "Bíblia", image: "/images/creation_2422213052.png" },
  { id: "espaco", label: "Espaço", image: "/images/creation_2422201837.png" },
  { id: "kids", label: "Kids", image: "/images/creation_2422204559.png" },
  { id: "outros", label: "Outros", image: "/images/creation_2422209762.png" },
];

interface CategoryGridProps {
  onCategoryPress?: (categoryId: string) => void;
}

export function CategoryGrid({ onCategoryPress }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {CATEGORIAS.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => {
            console.log("Categoria clicada:", category.id);
            onCategoryPress?.(category.id);
          }}
          whileTap={{ scale: 0.95 }}
          className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Imagem de fundo */}
          <Image
            src={category.image}
            alt={category.label}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />

          {/* Overlay gradiente (preto no topo, transparente em baixo) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Texto - posicionado na parte inferior esquerda */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-lg">{category.label}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
