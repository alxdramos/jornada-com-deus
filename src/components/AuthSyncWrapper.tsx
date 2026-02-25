"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";

export function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  // Sync Supabase ↔ Zustand ↔ Dexie
  useAuthSync();
  // Sync progress + realtime multi-device
  useSupabaseSync();

  return <>{children}</>;
}