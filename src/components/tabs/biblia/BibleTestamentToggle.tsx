import { TESTAMENTOS, Testamento } from "@/data/biblia";
import { cn } from "@/lib/utils";

interface BibleTestamentToggleProps {
  value: Testamento;
  onChange: (value: Testamento) => void;
}

export function BibleTestamentToggle({
  value,
  onChange,
}: BibleTestamentToggleProps) {
  return (
    <div className="flex rounded-xl overflow-hidden bg-white shadow-sm">
      {TESTAMENTOS.map((testamento) => (
        <button
          key={testamento.value}
          onClick={() => onChange(testamento.value)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            value === testamento.value
              ? "bg-[#1F2937] text-white"
              : "bg-white text-[#1F2937] hover:bg-gray-50"
          )}
        >
          {testamento.label}
        </button>
      ))}
    </div>
  );
}
