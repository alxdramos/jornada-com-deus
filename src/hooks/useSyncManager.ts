import { useEffect, useRef, useState, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { useToast } from './useToast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

interface SyncResult {
  prayers: number;
  journalEntries: number;
}

/**
 * useSyncManager — sincronização offline-first
 *
 * Detecta quando o app volta online (useOnlineStatus.wasOffline → true)
 * e envia para o Supabase todos os registros do Dexie com syncStatus='pending'.
 *
 * Requer: tabelas `prayers` e `journal_entries` no Supabase
 * (rodar supabase/migrations/20260223_sync_offline_data.sql)
 */
export function useSyncManager() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { success, error: toastError } = useToast();
  const { user: supabaseUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const syncedOnMountRef = useRef(false);

  const syncPrayers = async (userId: string): Promise<number> => {
    const pending = await db.prayers
      .where('syncStatus')
      .equals('pending')
      .toArray();

    if (pending.length === 0) return 0;

    const rows = pending.map((p) => ({
      user_id: userId,
      title: p.title,
      content: p.text,
      category: null as string | null,
      local_id: p.localId ?? String(p.id),
      is_personal: p.isPersonal,
      answered: p.answered,
      date: p.createdAt?.toISOString() ?? new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('prayers')
      .upsert(rows, { onConflict: 'user_id,local_id' });

    if (upsertError) throw new Error(`prayers upsert: ${upsertError.message}`);

    await Promise.all(
      pending.map((p) => db.prayers.update(p.id!, { syncStatus: 'synced' }))
    );

    return pending.length;
  };

  const syncJournalEntries = async (userId: string): Promise<number> => {
    const pending = await db.journalEntries
      .where('syncStatus')
      .equals('pending')
      .toArray();

    if (pending.length === 0) return 0;

    const rows = pending.map((e) => ({
      user_id: userId,
      type: e.type,
      content: e.content,
      local_id: e.localId ?? String(e.id),
      favorite: e.favorite,
      date: e.date?.toISOString() ?? new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('journal_entries')
      .upsert(rows, { onConflict: 'user_id,local_id' });

    if (upsertError) throw new Error(`journal_entries upsert: ${upsertError.message}`);

    await Promise.all(
      pending.map((e) => db.journalEntries.update(e.id!, { syncStatus: 'synced' }))
    );

    return pending.length;
  };

  const syncOfflineData = useCallback(async (): Promise<void> => {
    if (!supabaseUser || isSyncing) return;

    setIsSyncing(true);
    try {
      const [prayerCount, journalCount] = await Promise.all([
        syncPrayers(supabaseUser.id),
        syncJournalEntries(supabaseUser.id),
      ]);

      const total = prayerCount + journalCount;
      if (total > 0) {
        success(`${total} item(s) sincronizado(s) com a nuvem! ☁️`, {
          description: `${prayerCount} oração(ões) e ${journalCount} nota(s) do diário`,
        });
        console.log(`[SyncManager] ✅ Sincronizado: ${prayerCount} orações + ${journalCount} entradas`);
      }

      setLastSync(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[SyncManager] ❌ Erro ao sincronizar:', message);
      toastError('Erro ao sincronizar dados offline', {
        description: 'Os dados continuam salvos localmente. Tentaremos novamente.',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [supabaseUser, isSyncing, success, toastError]);

  // Dispara sync quando o app volta online depois de ter ficado offline
  useEffect(() => {
    if (!wasOffline || !isOnline || !supabaseUser) return;
    syncOfflineData();
  }, [wasOffline]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dispara uma vez na montagem se houver itens pendentes e já estiver online
  useEffect(() => {
    if (!isOnline || !supabaseUser || syncedOnMountRef.current) return;
    syncedOnMountRef.current = true;
    syncOfflineData();
  }, [isOnline, supabaseUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isSyncing, lastSync, syncOfflineData };
}
