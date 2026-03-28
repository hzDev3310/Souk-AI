import { cn } from '@/lib/utils';

export const Spinner = ({ className, size = "md", ...props }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className={cn("relative", sizes[size], className)} {...props}>
      <div className="absolute inset-0 border-brand-primary opacity-20 rounded-full"></div>
      <div className="absolute inset-0 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
