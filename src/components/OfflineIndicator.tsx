"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "sonner";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("Você está offline. Algumas funcionalidades podem não estar disponíveis.", {
        duration: 5000,
        style: {
          background: "#FEF2F2",
          border: "1px solid #FCA5A5",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      });
    } else if (wasOffline) {
      toast.success("Conexão restaurada! Todas as funcionalidades estão disponíveis.", {
        duration: 3000,
        style: {
          background: "#F0FDF4",
          border: "1px solid #86EFAC",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      });
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[1000] bg-red-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Você está offline</span>
          </div>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-0 left-0 right-0 z-[1000] bg-green-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Conexão restaurada</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}