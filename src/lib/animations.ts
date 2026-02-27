import { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Transições de aba — premium, nativo, 60fps
// ---------------------------------------------------------------------------
// Usa apenas `transform` (x) e `opacity` — propriedades GPU-aceleradas.
// Cubic-bezier [0.25, 0.46, 0.45, 0.94] = equivalente ao easeOut do iOS.
// Saída só com opacity (sem x) → evita conflito de layout com AnimatePresence.
// ---------------------------------------------------------------------------
export function createTabVariants(direction: number): Variants {
  return {
    initial: {
      opacity: 0,
      x: direction * 20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: "tween", duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.2, ease: "easeOut" },
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };
}

// Animações de entrada
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const slideInBottom: Variants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" }
};

// Animações de hover
export const hoverLift = {
  scale: 1.02,
  y: -2,
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(251, 146, 60, 0.3)",
  transition: { duration: 0.2 }
};

// Animações de lista
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// Animações de loading
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shimmer = {
  background: [
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
  ],
  backgroundSize: "200% 100%",
  backgroundPosition: ["-200% 0", "200% 0"],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Animações de sucesso/erro
export const successBounce = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3, ease: "easeOut" }
};

export const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5, ease: "easeInOut" }
};

// Configurações padrão
export const defaultTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothTransition = {
  duration: 0.3,
  ease: "easeInOut"
};