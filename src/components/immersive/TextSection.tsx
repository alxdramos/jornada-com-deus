import { motion } from "framer-motion";

interface TextSectionProps {
  texto: string;
}

export function TextSection({ texto }: TextSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex-1 overflow-y-auto mb-8"
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="text-lg text-white/95 leading-relaxed whitespace-pre-wrap"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
        >
          {texto}
        </div>
      </div>
    </motion.div>
  );
}
