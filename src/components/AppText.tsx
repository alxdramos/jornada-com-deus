import { cn } from "@/lib/utils";
import { theme } from "@/constants/theme";

interface AppTextProps {
  variant?: "title" | "subtitle" | "body" | "caption" | "small";
  className?: string;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "muted" | "accent";
}

export function AppText({
  variant = "body",
  className,
  children,
  color = "primary"
}: AppTextProps) {
  const baseStyles = "font-medium leading-relaxed";

  const variants = {
    title: `text-3xl font-bold text-${color === "primary" ? "foreground" : color}`,
    subtitle: `text-xl font-semibold text-${color === "primary" ? "foreground" : color}`,
    body: `text-base text-${color === "primary" ? "foreground" : color}`,
    caption: `text-sm text-${color === "primary" ? "foreground" : color}`,
    small: `text-xs text-${color === "primary" ? "foreground" : color}`,
  };

  return (
    <p className={cn(baseStyles, variants[variant], className)}>
      {children}
    </p>
  );
}