import { useState } from "react";
import { EtapaId } from "@/data/hojeSteps";
import { useProgressStore } from "@/stores/progressStore";
import { useToast } from "@/hooks/useToast";

const ALL_STEPS: EtapaId[] = ["versiculo", "passagem", "devocional", "oracao"];

export function useHojeSteps() {
  const { completeDay, isTodayCompleted } = useProgressStore();
  const { dayCompleted } = useToast();

  const todayDone = isTodayCompleted();

  // Se hoje já foi concluído, inicia com todas as etapas marcadas
  const [completados, setCompletados] = useState<Set<EtapaId>>(
    () => (todayDone ? new Set(ALL_STEPS) : new Set())
  );
  const [expandido, setExpandido] = useState<EtapaId | null>(null);
  const [playerAberto, setPlayerAberto] = useState(false);
  const [lerAberto, setLerAberto] = useState(false);

  const toggleEtapa = (id: EtapaId) => {
    // Não permite desmarcar se o dia já foi concluído
    if (todayDone) return;
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandido = (id: EtapaId) => {
    setExpandido((prev) => (prev === id ? null : id));
    if (!todayDone && !completados.has(id)) {
      toggleEtapa(id);
    }
  };

  const handleConcluirDia = () => {
    if (todayDone) return; // Idempotente no UI também
    completeDay();
    dayCompleted();
  };

  return {
    completados,
    expandido,
    playerAberto,
    lerAberto,
    todayDone,
    toggleEtapa,
    toggleExpandido,
    setPlayerAberto,
    setLerAberto,
    handleConcluirDia,
  };
}
