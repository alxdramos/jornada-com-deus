import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { theme } from "@/constants/theme";
import { LucideIcon } from "lucide-react";

interface AppButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export function AppButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled,
  loading,
  icon: Icon,
  fullWidth = false,
}: AppButtonProps) {
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-button",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    outline: "border-2 border-border hover:bg-muted/50 text-foreground",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Button
      className={cn(
        "rounded-xl font-semibold transition-all duration-200",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </div>
      )}
    </Button>
  );
}