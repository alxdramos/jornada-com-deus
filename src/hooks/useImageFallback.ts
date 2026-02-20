import { useState } from "react";

interface UseImageFallbackProps {
  filename?: string;
  category?: string;
}

// Mapeamento de categorias para imagens padrão
// Use imagens Unsplash como fallback (altamente disponíveis e de qualidade)
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Esperança": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop",
  "Paz": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1000&h=600&fit=crop",
  "Graças": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop",
  "Perdão": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop",
  "Força": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop",
  "Fé": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop",
};

export function useImageFallback({ filename, category }: UseImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  // Priority:
  // 1. Try local public folder (/images/{filename})
  // 2. Try category image from Unsplash fallback
  // 3. Fallback to gradient (handled by CSS)

  const getImageUrl = (): string | null => {
    if (!filename && !category) {
      return null;
    }

    if (filename && !hasError) {
      // Try local first
      return `/images/${filename}`;
    }

    if (category && CATEGORY_IMAGE_MAP[category]) {
      // Fallback to category image
      return CATEGORY_IMAGE_MAP[category];
    }

    return null;
  };

  const handleImageError = () => {
    setHasError(true);
  };

  return { imageUrl: getImageUrl(), onImageError: handleImageError };
}
