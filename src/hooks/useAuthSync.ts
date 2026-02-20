import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';
import { useProgressStore } from '@/stores/progressStore';
import { db } from '@/lib/db';
import type { User as DexieUser, Progress as DexieProgress } from '@/lib/db';

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { user: zustandUser, setUser, updateUser, clearUser } = useUserStore();
  const { progress: zustandProgress } = useProgressStore();

  useEffect(() => {
    const syncUserData = async () => {
      if (status === 'loading') return;

      if (session?.user && status === 'authenticated') {
        try {
          // Buscar usuário existente no Dexie pelo email
          const existingDexieUser = await db.users.where('email').equals(session.user.email!).first();

          if (existingDexieUser) {
            // Usuário existe - atualizar dados básicos e carregar progresso
            console.log('🔄 Usuário existente encontrado, sincronizando dados...');

            // Atualizar dados básicos no Dexie (preservando progresso)
            await db.users.update(existingDexieUser.id!, {
              name: session.user.name!,
              avatar: session.user.image || undefined,
            });

            // Buscar progresso associado ao usuário
            const userProgress = await db.progress.where('userId').equals(existingDexieUser.id!).first();

            // Atualizar Zustand com dados do Dexie
            setUser({
              id: existingDexieUser.id!,
              name: session.user.name!,
              email: session.user.email!,
              isPlus: existingDexieUser.isPlus,
              avatar: session.user.image || undefined,
              createdAt: existingDexieUser.createdAt,
            });

            // Se há progresso no Dexie, sincronizar com Zustand
            if (userProgress) {
              // Sincronizar progresso do Dexie com Zustand
              const progressStore = useProgressStore.getState();
              const syncedProgress = {
                currentStreak: userProgress.streak,
                maxStreak: Math.max(progressStore.progress.maxStreak, userProgress.streak),
                totalXp: userProgress.xp,
                level: userProgress.level,
                treeLevel: userProgress.treeLevel,
                lastCompletedDate: userProgress.lastCompletedDate || null,
                completedDays: Math.floor(userProgress.xp / 75), // Estimativa baseada no XP
                completedDates: [], // TODO: Implementar sync de datas específicas se necessário
              };

              // Atualizar Zustand com progresso sincronizado
              useProgressStore.setState({ progress: syncedProgress });
              console.log('📊 Progresso sincronizado para usuário:', syncedProgress);
            }

          } else {
            // Usuário não existe - criar novo perfil
            console.log('🆕 Criando novo perfil para usuário autenticado...');

            // Criar usuário no Dexie
            const newUserId = await db.users.add({
              name: session.user.name!,
              email: session.user.email!,
              isPlus: false, // Novos usuários começam como free
              avatar: session.user.image || undefined,
              createdAt: new Date(),
            });

            // Criar progresso inicial para o novo usuário
            await db.progress.add({
              streak: 0,
              xp: 0,
              level: 1,
              treeLevel: 0,
              userId: newUserId,
              lastCompletedDate: undefined,
            });

            // Atualizar Zustand com o novo usuário
            setUser({
              id: newUserId,
              name: session.user.name!,
              email: session.user.email!,
              isPlus: false,
              avatar: session.user.image || undefined,
              createdAt: new Date(),
            });

            console.log('✅ Novo perfil criado com sucesso!');
          }

        } catch (error) {
          console.error('❌ Erro ao sincronizar dados do usuário:', error);
        }

      } else if (status === 'unauthenticated') {
        // Usuário não está autenticado - limpar dados sensíveis do Zustand
        // mas manter dados locais no Dexie para uso offline
        console.log('🚪 Usuário deslogado, limpando sessão...');
        clearUser();
      }
    };

    syncUserData();
  }, [session, status, setUser, clearUser]);

  // Função auxiliar para obter dados do usuário atual (útil para outras partes do app)
  const getCurrentUserData = async () => {
    if (!zustandUser?.email) return null;

    try {
      const dexieUser = await db.users.where('email').equals(zustandUser.email).first();
      const userProgress = dexieUser ? await db.progress.where('userId').equals(dexieUser.id!).first() : null;

      return {
        user: dexieUser,
        progress: userProgress,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário atual:', error);
      return null;
    }
  };

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: zustandUser,
    getCurrentUserData,
  };
}