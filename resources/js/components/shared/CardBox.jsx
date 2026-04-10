import { Card } from "@/components/ui/card";

const CardBox = ({ children, className }) => {
  return (
    <Card className={`card bg-background shadow-xs ${className}`}>
      {children}
    </Card>
  );
};

export default CardBox;
