import { motion } from "framer-motion";
import { stripAudioMarkers } from "@/lib/stripAudioMarkers";

interface TextSectionProps {
  texto: string;
}

export function TextSection({ texto }: TextSectionProps) {
  const paragraphs = stripAudioMarkers(texto)
    .split('\n')
    .filter(p => p.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex-1 overflow-y-auto mb-8"
    >
      <div className="max-w-2xl mx-auto">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[16px] text-white/95 leading-[1.9] mb-6 last:mb-0"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
          >
            {p}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
