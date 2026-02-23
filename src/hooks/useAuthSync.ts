import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/stores/userStore';
import { useProgressStore } from '@/stores/progressStore';
import { db } from '@/lib/db';

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

            setUser({
              id: existingDexieUser.id!,
              name,
              email,
              isPlus: existingDexieUser.isPlus,
              avatar,
              createdAt: existingDexieUser.createdAt,
            });

            if (userProgress) {
              const progressStore = useProgressStore.getState();
              useProgressStore.setState({
                progress: {
                  currentStreak: userProgress.streak,
                  maxStreak: Math.max(progressStore.progress.maxStreak, userProgress.streak),
                  totalXp: userProgress.xp,
                  level: userProgress.level,
                  treeLevel: userProgress.treeLevel,
                  lastCompletedDate: userProgress.lastCompletedDate || null,
                  completedDays: Math.floor(userProgress.xp / 75),
                  completedDates: [],
                },
              });
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