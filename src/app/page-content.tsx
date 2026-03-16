"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTabStore, type TabId } from "@/stores/tabStore";
import { createTabVariants } from "@/lib/animations";
import { TabLoadingSkeleton } from "@/components/ui/Skeleton";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InstallPromptModal } from "@/components/InstallPromptModal";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useSyncManager } from "@/hooks/useSyncManager";

const TabHoje      = dynamic(() => import("@/components/tabs/TabHoje").then(m => ({ default: m.TabHoje })),       { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabExplorar  = dynamic(() => import("@/components/tabs/TabExplorar").then(m => ({ default: m.TabExplorar })), { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabBiblia    = dynamic(() => import("@/components/tabs/TabBiblia").then(m => ({ default: m.TabBiblia })),    { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabOracoes   = dynamic(() => import("@/components/tabs/TabOracoes").then(m => ({ default: m.TabOracoes })),  { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabMeditacoes= dynamic(() => import("@/components/tabs/TabMeditacoes").then(m => ({ default: m.TabMeditacoes })), { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabEstudos   = dynamic(() => import("@/components/tabs/TabEstudos").then(m => ({ default: m.TabEstudos })),  { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabDiario    = dynamic(() => import("@/components/tabs/TabDiario").then(m => ({ default: m.TabDiario })),    { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabDevocional= dynamic(() => import("@/components/tabs/TabDevocional").then(m => ({ default: m.TabDevocional })), { loading: () => <TabLoadingSkeleton />, ssr: false });
const TabKids      = dynamic(() => import("@/components/tabs/TabKids").then(m => ({ default: m.TabKids })),        { loading: () => <TabLoadingSkeleton />, ssr: false });

function renderTab(tab: TabId) {
  switch (tab) {
    case "hoje":      return <TabHoje />;
    case "explorar":  return <TabExplorar />;
    case "biblia":    return <TabBiblia />;
    case "oracoes":   return <TabOracoes />;
    case "meditacoes":return <TabMeditacoes />;
    case "estudos":   return <TabEstudos />;
    case "diario":    return <TabDiario />;
    case "devocional":return <TabDevocional />;
    case "kids":      return <TabKids />;
    default:          return null;
  }
}

const VALID_TABS: TabId[] = ['hoje', 'explorar', 'biblia', 'meditacoes', 'oracoes', 'diario', 'estudos'];

function TabInitializer() {
  const searchParams = useSearchParams();
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabId | null;
    if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);

  return null;
}

export function HomeContent() {
  const activeTab = useTabStore((s) => s.activeTab);
  const tabDirection = useTabStore((s) => s.tabDirection);
  const [isLoadingInstall, setIsLoadingInstall] = useState(false);
  const { isOpen, platform, handleInstall, handleDismiss, closeModal } = useInstallPrompt();

  // Sincronização offline→online: envia dados pendentes do Dexie ao Supabase
  useSyncManager();

  const handleInstallClick = async () => {
    setIsLoadingInstall(true);
    try {
      await handleInstall();
    } finally {
      setIsLoadingInstall(false);
    }
  };

  return (
    <>
      {/* Lê ?tab= da URL para shortcuts do manifest PWA */}
      <Suspense fallback={null}>
        <TabInitializer />
      </Suspense>

      {/* Transição premium entre abas — AnimatePresence com slide direcional */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeTab}
          variants={createTabVariants(tabDirection)}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ willChange: "transform, opacity" }}
        >
          {/* key={activeTab} reseta o ErrorBoundary em cada troca de aba */}
          <ErrorBoundary key={activeTab} fallbackLabel={`Erro na aba ${activeTab}`}>
            {renderTab(activeTab)}
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>

      <BottomNav />

      {/* PWA Install Prompt */}
      <InstallPromptModal
        isOpen={isOpen}
        platform={platform}
        onInstall={handleInstallClick}
        onDismiss={handleDismiss}
        isLoading={isLoadingInstall}
      />
    </>
  );
}
