"use client";

import { motion } from "framer-motion";
import { CheckCircle, Headphones, BookOpen, Bird, Music, PenLine, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTabStore, type TabId } from "@/stores/tabStore";

const ACTIVE_ORANGE = "#FB923C";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navItems: NavItem[] = [
  { id: "hoje", label: "Hoje", icon: CheckCircle },
  { id: "explorar", label: "Explorar", icon: Headphones },
  { id: "biblia", label: "Bíblia", icon: BookOpen },
  { id: "meditacoes", label: "Meditação", icon: Music },
  { id: "oracoes", label: "Orações", icon: Bird },
  { id: "jornada", label: "Jornada", icon: Trophy },
  { id: "diario", label: "Diário", icon: PenLine },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-2xl md:max-w-lg md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl pointer-events-auto"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 relative"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {/* Underline ativo (igual às fotos) */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
                  style={{
                    width: "24px",
                    x: "-50%",
                    backgroundColor: ACTIVE_ORANGE,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-500'}`}
              />
              <span
                className={`text-xs font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-gray-500'}`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
