import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/stores/userStore';
import {
  useProgressStore,
  XP_PER_DAY,
  getLevelFromXp,
} from '@/stores/progressStore';
import { db } from '@/lib/db';

type StoreProgress = ReturnType<typeof useProgressStore.getState>['progress'];

// Normaliza uma data qualquer para 'YYYY-MM-DD' (timezone local)
// Trata o formato antigo bugado "Wed Feb 25" que vinha do String(Date).slice(0,10)
function normalizeDateStr(raw: string | null): string | null {
  if (!raw) return null;
  // Já está no formato correto
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return null; // formato inválido — melhor ignorar
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const normalizeStoreProgress = (progress: StoreProgress): StoreProgress => {
  const completedDaysFromXp = Math.floor(progress.totalXp / XP_PER_DAY);
  const normalizedCompletedDays = Math.max(progress.completedDays, completedDaysFromXp);
  const unifiedLevel = getLevelFromXp(progress.totalXp); // level === treeLevel (unified)
  return {
    ...progress,
    level: unifiedLevel,
    treeLevel: unifiedLevel,
    completedDays: normalizedCompletedDays,
    lastCompletedDate: normalizeDateStr(progress.lastCompletedDate),
  };
};

const mapDexieProgressToStore = (
  userProgress: { streak: number; xp: number; lastCompletedDate?: Date },
  localProgress: StoreProgress
): StoreProgress => {
  const totalXp = userProgress.xp ?? 0;
  const completedDays = Math.floor(totalXp / XP_PER_DAY);
  return {
    currentStreak: userProgress.streak ?? 0,
    maxStreak: Math.max(localProgress.maxStreak, userProgress.streak ?? 0),
    totalXp,
    level: getLevelFromXp(totalXp),
    treeLevel: getLevelFromXp(totalXp), // unified with level
    lastCompletedDate: userProgress.lastCompletedDate
      ? new Date(userProgress.lastCompletedDate).toISOString().slice(0, 10)
      : null,
    completedDays,
    completedDates: localProgress.completedDates ?? [],
  };
};

const persistProgressToDexie = async (userId: number, progress: StoreProgress, progressId?: number) => {
  const payload = {
    userId,
    streak: progress.currentStreak,
    xp: progress.totalXp,
    level: getLevelFromXp(progress.totalXp),
    treeLevel: getLevelFromXp(progress.totalXp), // unified with level
    lastCompletedDate: progress.lastCompletedDate ? new Date(progress.lastCompletedDate) : undefined,
  };

  if (progressId) {
    await db.progress.update(progressId, payload);
    return;
  }

  const existing = await db.progress.where('userId').equals(userId).first();
  if (existing?.id) {
    await db.progress.update(existing.id, payload);
  } else {
    await db.progress.add(payload);
  }
};

export function useAuthSync() {
  const { user: supabaseUser, loading } = useAuth();
  const { user: zustandUser, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const syncUserData = async () => {
      if (loading) return;

      if (supabaseUser) {
        try {
          const email = supabaseUser.email!;
          const name = supabaseUser.user_metadata?.full_name
            || supabaseUser.user_metadata?.name
            || email.split('@')[0];
          const avatar = supabaseUser.user_metadata?.avatar_url
            || supabaseUser.user_metadata?.picture
            || undefined;

          // Buscar usuário existente no Dexie pelo email
          const existingDexieUser = await db.users.where('email').equals(email).first();

          if (existingDexieUser) {
            await db.users.update(existingDexieUser.id!, { name, avatar });

            const userProgress = await db.progress
              .where('userId')
              .equals(existingDexieUser.id!)
              .first();

            const localProgress = useProgressStore.getState().progress;
            const normalizedLocal = normalizeStoreProgress(localProgress);

            setUser({
              id: existingDexieUser.id!,
              name,
              email,
              isPlus: existingDexieUser.isPlus,
              plan: existingDexieUser.isPlus ? 'plus' : 'free',
              subscriptionStatus: existingDexieUser.isPlus ? 'active' : null,
              subscriptionExpiresAt: null,
              avatar,
              createdAt: existingDexieUser.createdAt,
            });

            if (userProgress) {
              const dexieDate = userProgress.lastCompletedDate
                ? new Date(userProgress.lastCompletedDate).getTime()
                : 0;
              const localDate = normalizedLocal.lastCompletedDate
                ? new Date(normalizedLocal.lastCompletedDate).getTime()
                : 0;

              const isLocalNewer =
                localDate > dexieDate ||
                (localDate === dexieDate && normalizedLocal.totalXp > (userProgress.xp ?? 0));

              if (isLocalNewer) {
                await persistProgressToDexie(existingDexieUser.id!, normalizedLocal, userProgress.id);
                useProgressStore.setState({ progress: normalizedLocal });
              } else {
                const normalizedDexie = mapDexieProgressToStore(userProgress, normalizedLocal);
                useProgressStore.setState({ progress: normalizedDexie });
              }
            } else {
              await persistProgressToDexie(existingDexieUser.id!, normalizedLocal);
              useProgressStore.setState({ progress: normalizedLocal });
            }
          } else {
            // Novo usuário — criar perfil local
            const newUserId = await db.users.add({
              name,
              email,
              isPlus: false,
              avatar,
              createdAt: new Date(),
            });

            await db.progress.add({
              streak: 0,
              xp: 0,
              level: 1,
              treeLevel: 0,
              userId: newUserId,
              lastCompletedDate: undefined,
            });

            setUser({
              id: newUserId,
              name,
              email,
              isPlus: false,
              plan: 'free',
              subscriptionStatus: null,
              subscriptionExpiresAt: null,
              avatar,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error('[AuthSync] Erro ao sincronizar dados do usuário:', error);
        }
      } else {
        // Sem sessão Supabase — limpar estado Zustand (mantém Dexie para offline)
        clearUser();
      }
    };

    syncUserData();
  }, [supabaseUser, loading, setUser, clearUser]);

  useEffect(() => {
    if (!zustandUser?.id) return;

    const unsubscribe = useProgressStore.subscribe((state) => {
      try {
        const normalized = normalizeStoreProgress(state.progress);
        void persistProgressToDexie(zustandUser.id!, normalized);
      } catch (error) {
        console.error('[AuthSync] Erro ao persistir progresso:', error);
      }
    });

    return () => unsubscribe();
  }, [zustandUser?.id]);

  const getCurrentUserData = async () => {
    if (!zustandUser?.email) return null;
    try {
      const dexieUser = await db.users.where('email').equals(zustandUser.email).first();
      const userProgress = dexieUser
        ? await db.progress.where('userId').equals(dexieUser.id!).first()
        : null;
      return { user: dexieUser, progress: userProgress };
    } catch (error) {
      console.error('[AuthSync] Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  return {
    isAuthenticated: !!supabaseUser,
    isLoading: loading,
    user: zustandUser,
    getCurrentUserData,
  };
}