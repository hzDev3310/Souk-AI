import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardBox = ({ children, className }) => {
  return (
    <Card className={cn(
        "card overflow-hidden bg-card/40 backdrop-blur-sm border border-border/60 shadow-sm transition-all duration-300",
        className
    )}>
      {children}
    </Card>
  );
};

export default CardBox;
