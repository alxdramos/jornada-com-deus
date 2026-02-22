"use client";

import { useTabStore } from "@/stores/tabStore";
import { Header } from "@/components/layout";
import { TabHoje } from "@/components/tabs/TabHoje";
import { TabExplorar } from "@/components/tabs/TabExplorar";
import { TabBiblia } from "@/components/tabs/TabBiblia";
import { TabOracoes } from "@/components/tabs/TabOracoes";
import { TabMeditacoes } from "@/components/tabs/TabMeditacoes";
import { TabDiario } from "@/components/tabs/TabDiario";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function HomeContent() {
  const activeTab = useTabStore((s) => s.activeTab);

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
      <ErrorBoundary fallbackLabel="Erro na aba Diário">
        {activeTab === "diario" && <TabDiario />}
      </ErrorBoundary>
      <BottomNav />
    </>
  );
}
