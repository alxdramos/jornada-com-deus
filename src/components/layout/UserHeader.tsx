"use client";

import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";
import { ProfileModal } from "@/components/ProfileModal";
import { Skeleton } from "@/components/ui/Skeleton";

interface UserHeaderProps {
  /** Título principal exibido ao lado do avatar (ex: "Bíblia", "Orações") */
  title: string;
  /** Elemento opcional abaixo do título (ex: link "VER CALENDÁRIO") */
  subtitleElement?: ReactNode;
  /** Elemento opcional no lado direito do header (ícones, botões, streak) */
  rightElement?: ReactNode;
}

/**
 * Cabeçalho reutilizável para todas as abas.
 * Exibe o avatar do usuário (foto Google com fallbacks) clicável para abrir o ProfileModal,
 * o título da tela e um slot opcional para ações no lado direito.
 */
export function UserHeader({ title, subtitleElement, rightElement }: UserHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = useUserStore((s) => s.user);

  const isLoading = status === "loading";
  const displayName = user?.name || session?.user?.name || "Visitante";

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Lado esquerdo: avatar + título */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            aria-label="Abrir perfil"
            className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:ring-offset-1"
          >
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : session?.user?.image ? (
              <img
                src={session.user.image}
                alt={`Avatar de ${displayName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback para inicial do nome se a imagem do Google falhar
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-[#FB923C] flex items-center justify-center text-white font-bold text-base">${displayName.charAt(0).toUpperCase()}</div>`;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#FB923C] flex items-center justify-center text-white font-bold text-base">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#1F2937]">{title}</h1>
            {subtitleElement && (
              <div className="mt-0.5">{subtitleElement}</div>
            )}
          </div>
        </div>

        {/* Lado direito: slot customizável por aba */}
        {rightElement && (
          <div className="flex items-center gap-2">{rightElement}</div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
