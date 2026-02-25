import { useState } from "react";
import { EtapaId } from "@/data/hojeSteps";
import { useProgressStore } from "@/stores/progressStore";
import { useToast } from "@/hooks/useToast";
import { useHaptics } from "@/hooks/useHaptics";

const ALL_STEPS: EtapaId[] = ["versiculo", "passagem", "devocional", "oracao"];

export function useHojeSteps() {
  const { completeDay, isTodayCompleted, progress } = useProgressStore();
  const { dayCompleted } = useToast();
  const { vibrateStepComplete, vibrateDayComplete, vibrateLevelUp, vibrateTreeEvolve } = useHaptics();

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
    const isAdding = !completados.has(id);
    if (isAdding) vibrateStepComplete();
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

    // Snapshot do estado anterior para detectar level-up
    const prevLevel = progress.level;
    const prevTreeLevel = progress.treeLevel;

    completeDay();

    // Detectar evoluções após completeDay() (Zustand é síncrono)
    const newProgress = useProgressStore.getState().progress;
    const leveledUp = newProgress.level > prevLevel;
    const treeEvolved = newProgress.treeLevel > prevTreeLevel;

    // Feedback háptico em cascata
    vibrateDayComplete();
    if (treeEvolved) setTimeout(() => vibrateTreeEvolve(), 400);
    else if (leveledUp) setTimeout(() => vibrateLevelUp(), 300);

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
