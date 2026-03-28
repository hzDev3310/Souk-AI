import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-secondary text-white',
        secondary: 'border-transparent bg-secondary-container text-brand-secondary',
        success: 'border-transparent bg-primary-container text-white',
        destructive: 'border-transparent bg-error text-white',
        outline: 'text-secondary border-outline-variant',
        // State of Wear specifics
        new: 'bg-brand-primary text-white',
        good: 'bg-secondary-container text-brand-secondary',
        used: 'bg-surface-container-highest text-on-surface-variant',
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
