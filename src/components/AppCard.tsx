import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme } from "@/constants/theme";

interface AppCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function AppCard({
  title,
  children,
  className,
  hover = true,
  onClick
}: AppCardProps) {
  return (
    <Card
      className={cn(
        "bg-card border-border rounded-xl shadow-card transition-all duration-200",
        hover && "hover:shadow-cardHover hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}