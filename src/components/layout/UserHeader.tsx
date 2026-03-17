"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/stores/userStore";
import { ProfileModal } from "@/components/ProfileModal";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useSearchStore } from "@/hooks/useGlobalSearch";
import { Sun, Moon, Search } from "lucide-react";
import Image from "next/image";

interface UserHeaderProps {
  title: string;
  subtitleElement?: ReactNode;
  rightElement?: ReactNode;
}

export function UserHeader({ title, subtitleElement, rightElement }: UserHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user: authUser, loading } = useAuth();
  const user = useUserStore((s) => s.user);
  const { isDark, toggle, mounted } = useDarkMode();
  const openSearch = useSearchStore((s) => s.open);

  const displayName = user?.name || authUser?.user_metadata?.full_name || "Visitante";
  const avatarUrl = authUser?.user_metadata?.avatar_url;

  return (
    <>
      {/* Gradient aura — topo da página */}
      <div
        className="absolute -top-6 -left-6 -right-6 h-28 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(124, 58, 237, 0.07) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar com anel brand */}
          <button
            onClick={() => setProfileOpen(true)}
            aria-label="Abrir perfil"
            className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-violet-300/60 dark:border-violet-600/40 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 transition-all hover:border-violet-400/80"
          >
            {loading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : avatarUrl && !avatarError ? (
              <Image
                src={avatarUrl}
                alt={`Avatar de ${displayName}`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-base">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          <div>
            <h1 className="text-xl font-bold text-text-primary leading-tight">{title}</h1>
            {subtitleElement && (
              <div className="mt-0.5">{subtitleElement}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rightElement}

          {/* Global search button */}
          <button
            onClick={openSearch}
            aria-label="Abrir busca global (Cmd+K)"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/20 transition-colors text-text-secondary hover:text-violet-600 dark:hover:text-violet-400"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dark mode toggle — ícones Lucide, sem emojis */}
          {mounted && (
            <button
              onClick={toggle}
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/20 transition-colors text-text-secondary hover:text-violet-600 dark:hover:text-violet-400"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <GlobalSearchModal />
    </>
  );
}
