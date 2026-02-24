"use client";

import { useState } from "react";
import { useTabStore } from "@/stores/tabStore";
import { Header } from "@/components/layout";
import { TabHoje } from "@/components/tabs/TabHoje";
import { TabExplorar } from "@/components/tabs/TabExplorar";
import { TabBiblia } from "@/components/tabs/TabBiblia";
import { TabOracoes } from "@/components/tabs/TabOracoes";
import { TabMeditacoes } from "@/components/tabs/TabMeditacoes";
import { TabEstudos } from "@/components/tabs/TabEstudos";
import { TabDiario } from "@/components/tabs/TabDiario";
import { TabDevocional } from "@/components/tabs/TabDevocional";
import { TabKids } from "@/components/tabs/TabKids";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InstallPromptModal } from "@/components/InstallPromptModal";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useSyncManager } from "@/hooks/useSyncManager";

export function HomeContent() {
  const activeTab = useTabStore((s) => s.activeTab);
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
      <Header />
      <ErrorBoundary fallbackLabel="Erro na aba Hoje">
        {activeTab === "hoje" && <TabHoje />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Explorar">
        {activeTab === "explorar" && <TabExplorar />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Bíblia">
        {activeTab === "biblia" && <TabBiblia />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Orações">
        {activeTab === "oracoes" && <TabOracoes />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Meditações">
        {activeTab === "meditacoes" && <TabMeditacoes />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Estudos Bíblicos">
        {activeTab === "estudos" && <TabEstudos />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Diário">
        {activeTab === "diario" && <TabDiario />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Devocional">
        {activeTab === "devocional" && <TabDevocional />}
      </ErrorBoundary>
      <ErrorBoundary fallbackLabel="Erro na aba Kids">
        {activeTab === "kids" && <TabKids />}
      </ErrorBoundary>
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
