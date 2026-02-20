"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePWAInstall } from "@/hooks/use-pwa-install";

export function InstallPrompt() {
  const { isInstallable, installPWA, dismissPrompt } = usePWAInstall();

  return (
    <AnimatePresence>
      {isInstallable && (
        <Dialog open={isInstallable} onOpenChange={dismissPrompt}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-8 space-y-6"
            >
              {/* Ícone animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>

              {/* Título */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Instale o Jornada com Deus
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tenha acesso offline aos seus momentos devocionais e receba lembretes diários
                </p>
              </motion.div>

              {/* Benefícios */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Acesso rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Sem distrações</span>
                </div>
              </motion.div>

              {/* Botões */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 w-full"
              >
                <Button
                  onClick={dismissPrompt}
                  variant="outline"
                  className="flex-1 rounded-xl border-2 hover:bg-muted/50 transition-colors"
                >
                  Agora não
                </Button>
                <Button
                  onClick={installPWA}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}