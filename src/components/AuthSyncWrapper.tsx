"use client";

import { useAuthSync } from "@/hooks/useAuthSync";

export function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  // Este hook garante a sincronização automática entre Auth.js, Zustand e Dexie
  useAuthSync();

  return <>{children}</>;
}