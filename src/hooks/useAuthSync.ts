import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/stores/userStore';
import {
  useProgressStore,
  getCompletedDaysFromXp,
  getLevelFromXp,
  getTreeLevelFromDays,
} from '@/stores/progressStore';
import { db } from '@/lib/db';

type StoreProgress = ReturnType<typeof useProgressStore.getState>['progress'];

const normalizeStoreProgress = (progress: StoreProgress): StoreProgress => {
  const completedDaysFromXp = getCompletedDaysFromXp(progress.totalXp);
  const normalizedCompletedDays = Math.max(progress.completedDays, completedDaysFromXp);
  return {
    ...progress,
    level: getLevelFromXp(progress.totalXp),
    completedDays: normalizedCompletedDays,
    treeLevel: getTreeLevelFromDays(normalizedCompletedDays),
  };
};

const mapDexieProgressToStore = (
  userProgress: { streak: number; xp: number; lastCompletedDate?: Date },
  localProgress: StoreProgress
): StoreProgress => {
  const totalXp = userProgress.xp ?? 0;
  const completedDays = getCompletedDaysFromXp(totalXp);
  return {
    currentStreak: userProgress.streak ?? 0,
    maxStreak: Math.max(localProgress.maxStreak, userProgress.streak ?? 0),
    totalXp,
    level: getLevelFromXp(totalXp),
    treeLevel: getTreeLevelFromDays(completedDays),
    lastCompletedDate: userProgress.lastCompletedDate
      ? String(userProgress.lastCompletedDate).slice(0, 10)
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
    treeLevel: getTreeLevelFromDays(progress.completedDays),
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

    const unsubscribe = useProgressStore.subscribe(
      (state) => state.progress,
      async (progress) => {
        try {
          const normalized = normalizeStoreProgress(progress);
          await persistProgressToDexie(zustandUser.id!, normalized);
        } catch (error) {
          console.error('[AuthSync] Erro ao persistir progresso:', error);
        }
      }
    );

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