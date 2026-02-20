import { useState } from "react";
import { EtapaId } from "@/data/hojeSteps";
import { useProgressStore } from "@/stores/progressStore";
import { useToast } from "@/hooks/useToast";

export function useHojeSteps() {
  const [completados, setCompletados] = useState<Set<EtapaId>>(new Set());
  const [expandido, setExpandido] = useState<EtapaId | null>(null);
  const [playerAberto, setPlayerAberto] = useState(false);
  const [lerAberto, setLerAberto] = useState(false);

  const { completeDay } = useProgressStore();
  const { dayCompleted } = useToast();

  const toggleEtapa = (id: EtapaId) => {
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandido = (id: EtapaId) => {
    setExpandido((prev) => (prev === id ? null : id));
    // Marcar como lido automaticamente ao expandir
    if (!completados.has(id)) {
      toggleEtapa(id);
    }
  };

  const handleConcluirDia = () => {
    completeDay();
    dayCompleted();
  };

  return {
    completados,
    expandido,
    playerAberto,
    lerAberto,
    toggleEtapa,
    toggleExpandido,
    setPlayerAberto,
    setLerAberto,
    handleConcluirDia,
  };
}
