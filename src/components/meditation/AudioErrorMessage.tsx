import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface AudioErrorMessageProps {
  show: boolean;
}

export function AudioErrorMessage({ show }: AudioErrorMessageProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mt-4 px-4 py-2 bg-red-500/20 rounded-xl text-red-300 text-sm"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>Não foi possível carregar o áudio. Verifique sua conexão.</span>
    </motion.div>
  );
}
