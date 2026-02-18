import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email?: string;
  isPlus: boolean;
  avatar?: string;
  createdAt: Date;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  togglePlus: () => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: {
        id: 1,
        name: 'Usuário',
        isPlus: false,
        createdAt: new Date(),
      },

      setUser: (user) => set({ user }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      togglePlus: () => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              isPlus: !currentUser.isPlus
            }
          });
        }
      },

      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user ? {
          ...state.user,
          // Don't persist sensitive data if needed
        } : null,
      }),
    }
  )
);