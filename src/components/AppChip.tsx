import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { theme } from "@/constants/theme";
import { X } from "lucide-react";

interface AppChipProps {
  label: string;
  variant?: "default" | "selected" | "outline";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
}

export function AppChip({
  label,
  variant = "default",
  size = "md",
  className,
  onClick,
  onRemove,
  removable = false,
}: AppChipProps) {
  const variants = {
    default: "bg-muted text-muted-foreground hover:bg-muted/80",
    selected: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border-2 border-border text-foreground hover:bg-muted/50",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <Badge
      className={cn(
        "rounded-full font-medium transition-all duration-200 cursor-pointer flex items-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {label}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
}