"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, User, Mail, Calendar, Star, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserStore } from "@/stores/userStore";
import { useProgressStore } from "@/stores/progressStore";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AppButton } from "./AppButton";
import { Skeleton } from "@/components/ui/Skeleton";
import Image from "next/image";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user: authUser, loading, signOut } = useAuth();
  const { user, togglePlus } = useUserStore();
  const { progress } = useProgressStore();
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);

  const displayName = user?.name || authUser?.user_metadata?.full_name || "Usuário";
  const displayEmail = user?.email || authUser?.email;
  const avatarUrl = authUser?.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
    onClose();
    router.replace("/login");
  };

  if (!authUser && !user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-8 space-y-6"
            >
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white"
              >
                {loading ? (
                  <Skeleton className="w-full h-full rounded-full" />
                ) : avatarUrl && !avatarError ? (
                  <Image
                    src={avatarUrl}
                    alt={`Avatar de ${displayName}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FB923C] to-[#10B981] flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Nome, email e status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {loading ? <Skeleton className="h-8 w-32" /> : displayName}
                  </h2>
                  {user?.isPlus && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {displayEmail && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{loading ? <Skeleton className="h-4 w-48" /> : displayEmail}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Nível {progress.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {progress.currentStreak} dias
                  </span>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full grid grid-cols-3 gap-4"
              >
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <div className="text-lg font-bold text-primary">{progress.totalXp}</div>
                  <div className="text-xs text-muted-foreground">XP Total</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <div className="text-lg font-bold text-accent">{progress.maxStreak}</div>
                  <div className="text-xs text-muted-foreground">Melhor Streak</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">{progress.completedDays}</div>
                  <div className="text-xs text-muted-foreground">Dias Completos</div>
                </div>
              </motion.div>

              {/* Toggle Plus */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Jornada Plus</span>
                  </div>
                  <button
                    onClick={togglePlus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      user?.isPlus ? "bg-yellow-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user?.isPlus ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  {user?.isPlus
                    ? "Assinatura ativa — Aproveite todos os benefícios!"
                    : "Desbloqueie áudios e recursos premium"}
                </p>
              </motion.div>

              {/* Botão sair */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </motion.div>

              {/* Botão fechar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full"
              >
                <AppButton onClick={onClose} className="w-full">
                  Fechar
                </AppButton>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
