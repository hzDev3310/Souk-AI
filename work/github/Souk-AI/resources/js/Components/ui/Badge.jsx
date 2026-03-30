import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-secondary text-white',
        secondary: 'border-transparent bg-secondary-container text-brand-secondary',
        success: 'border-transparent bg-success text-white',
        destructive: 'border-transparent bg-error text-white',
        warning: 'border-transparent bg-warning text-white',
        info: 'border-transparent bg-info text-white',
        outline: 'text-secondary border-outline-variant',
        // State of Wear specifics
        new: 'bg-brand-primary text-white',
        good: 'bg-secondary-container text-brand-secondary',
        used: 'bg-surface-container-highest text-on-surface-variant',
        primary: 'bg-brand-primary text-white',
        // Neo badges - outline with colored text
        'neo-primary': 'border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary/10',
        'neo-success': 'border-success text-success bg-transparent hover:bg-success/10',
        'neo-error': 'border-error text-error bg-transparent hover:bg-error/10',
        'neo-warning': 'border-warning text-warning bg-transparent hover:bg-warning/10',
        'neo-info': 'border-info text-info bg-transparent hover:bg-info/10',
        'neo-secondary': 'border-brand-secondary text-brand-secondary bg-transparent hover:bg-brand-secondary/10',
        // Eco certified
        'eco': 'bg-brand-primary text-white animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
