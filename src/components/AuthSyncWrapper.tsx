"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/stores/userStore";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { OnboardingGate } from "@/components/onboarding/OnboardingGate";

// Tempo máximo de espera pelo sync (fallback de segurança)
const SYNC_TIMEOUT_MS = 5000;

function AuthLoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Carregando sua jornada...</p>
    </div>
  );
}

export function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  const { loading: authLoading, user: supabaseUser } = useAuth();
  const zustandUser = useUserStore((s) => s.user);
  const [syncDone, setSyncDone] = useState(false);

  // Sync Supabase ↔ Zustand ↔ Dexie
  useAuthSync();
  // Sync progress + realtime multi-device
  useSupabaseSync();

  useEffect(() => {
    // Ainda carregando sessão Supabase — aguardar
    if (authLoading) return;

    // Sem usuário autenticado → renderizar imediatamente (irá para login)
    if (!supabaseUser) {
      setSyncDone(true);
      return;
    }

    // Usuário autenticado → aguardar Zustand sincronizar o email correto
    if (zustandUser?.email === supabaseUser.email) {
      setSyncDone(true);
      return;
    }

    // Segurança: não bloquear o app indefinidamente se o sync falhar
    const timeout = setTimeout(() => {
      console.warn("[AuthSyncWrapper] Sync timeout — renderizando mesmo assim");
      setSyncDone(true);
    }, SYNC_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [authLoading, supabaseUser, zustandUser]);

  if (!syncDone) {
    return <AuthLoadingScreen />;
  }

  return <OnboardingGate>{children}</OnboardingGate>;
}
