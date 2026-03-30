import { cn } from '@/lib/utils';

export const Spinner = ({ className, size = "md", color = "primary", ...props }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4"
  };

  const colors = {
    primary: "border-brand-primary",
    secondary: "border-brand-secondary",
    error: "border-error",
    success: "border-success",
  };

  return (
    <div className={cn("relative inline-flex", sizes[size], className)} {...props}>
      {/* Background ring */}
      <div className={cn("absolute inset-0 rounded-full opacity-20", colors[color])} style={{
        borderWidth: 'inherit'
      }}></div>
      {/* Spinning ring */}
      <div className={cn(
        "absolute inset-0 rounded-full animate-spin",
        colors[color]
      )} style={{
        borderWidth: 'inherit',
        borderTopColor: 'currentColor',
        borderRightColor: 'currentColor',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
      }}></div>
    </div>
  );
};
