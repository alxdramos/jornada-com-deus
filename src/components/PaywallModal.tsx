"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, X, Heart, BookOpen, Bell } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export function PaywallModal({ isOpen, onClose, onSubscribe }: PaywallModalProps) {
  const benefits = [
    {
      icon: BookOpen,
      title: "Áudio das leituras",
      description: "Ouça todas as meditações e devocionais",
    },
    {
      icon: Heart,
      title: "Funcionalidades Plus",
      description: "Acesso completo a todos os recursos premium",
    },
    {
      icon: Bell,
      title: "Lembretes personalizados",
      description: "Configure notificações para seus momentos devocionais",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-8 space-y-6"
            >
              {/* Ícone */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>

              {/* Título */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <AppText variant="title" className="text-2xl">
                  Jornada Plus
                </AppText>
                <AppText variant="body" color="secondary" className="leading-relaxed">
                  Desbloqueie todo o potencial da sua jornada espiritual
                </AppText>
              </motion.div>

              {/* Benefícios */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full space-y-4"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-border/50"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <AppText variant="subtitle" className="text-base mb-1">
                        {benefit.title}
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        {benefit.description}
                      </AppText>
                    </div>
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Preço */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 w-full"
              >
                <AppText variant="body" className="text-center">
                  <span className="text-2xl font-bold text-primary">R$ 9,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </AppText>
                <AppText variant="caption" color="secondary" className="text-center block mt-1">
                  Cancele a qualquer momento
                </AppText>
              </motion.div>

              {/* Botões */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-3 w-full"
              >
                <AppButton
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Depois
                </AppButton>
                <AppButton
                  onClick={onSubscribe}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Assinar Plus
                </AppButton>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}