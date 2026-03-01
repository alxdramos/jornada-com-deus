"use client";

import { motion } from "framer-motion";
import { CheckCircle, Compass, BookOpen, Music, Bird, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTabStore, type TabId } from "@/stores/tabStore";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navItems: NavItem[] = [
  { id: "hoje", label: "Hoje", icon: CheckCircle },
  { id: "explorar", label: "Explorar", icon: Compass },
  { id: "biblia", label: "Bíblia", icon: BookOpen },
  { id: "meditacoes", label: "Meditação", icon: Music },
  { id: "oracoes", label: "Orações", icon: Bird },
  { id: "diario", label: "Diário", icon: PenLine },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl md:max-w-lg md:left-1/2 md:-translate-x-1/2 pointer-events-auto border-t"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        background: "var(--nav-glass-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTopColor: "var(--nav-glass-border)",
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center min-w-0 flex-1 cursor-pointer"
              whileTap={{ scale: 0.88 }}
            >
              {/* Pill / capsule — indicador de tab ativa */}
              <div className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl">
                {isActive && (
                  <motion.div
                    layoutId="bottomNavPill"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "var(--brand-muted, rgba(124, 58, 237, 0.12))",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <Icon
                  className={cn(
                    "relative w-5 h-5 transition-colors duration-200",
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                  aria-hidden="true"
                />

                <span
                  className={cn(
                    "relative text-[10px] font-semibold tracking-wide transition-colors duration-200 leading-none",
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
