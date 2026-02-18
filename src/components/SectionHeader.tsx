import { cn } from "@/lib/utils";
import { AppText } from "./AppText";
import { theme } from "@/constants/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex-1">
        <AppText variant="title" className="mb-1">
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color="secondary">
            {subtitle}
          </AppText>
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}