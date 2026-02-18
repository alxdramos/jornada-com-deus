"use client";

import { useTabStore } from "@/stores/tabStore";
import { TabHoje } from "@/components/tabs/TabHoje";
import { TabExplorar } from "@/components/tabs/TabExplorar";
import { TabBiblia } from "@/components/tabs/TabBiblia";
import { TabOracoes } from "@/components/tabs/TabOracoes";
import { TabDiario } from "@/components/tabs/TabDiario";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  const activeTab = useTabStore((s) => s.activeTab);

  return (
    <>
      {activeTab === "hoje" && <TabHoje />}
      {activeTab === "explorar" && <TabExplorar />}
      {activeTab === "biblia" && <TabBiblia />}
      {activeTab === "oracoes" && <TabOracoes />}
      {activeTab === "diario" && <TabDiario />}
      <BottomNav />
    </>
  );
}
