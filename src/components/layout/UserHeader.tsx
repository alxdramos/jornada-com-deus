"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/stores/userStore";
import { ProfileModal } from "@/components/ProfileModal";
import { Skeleton } from "@/components/ui/Skeleton";

interface UserHeaderProps {
  title: string;
  subtitleElement?: ReactNode;
  rightElement?: ReactNode;
}

export function UserHeader({ title, subtitleElement, rightElement }: UserHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user: authUser, loading } = useAuth();
  const user = useUserStore((s) => s.user);

  const displayName = user?.name || authUser?.user_metadata?.full_name || "Visitante";
  const avatarUrl = authUser?.user_metadata?.avatar_url;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            aria-label="Abrir perfil"
            className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:ring-offset-1"
          >
            {loading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Avatar de ${displayName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
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

        {rightElement && (
          <div className="flex items-center gap-2">{rightElement}</div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
