import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '@/Components/ui/Icon';

const alertVariants = cva(
  'relative w-full rounded-2xl border p-4 [&>span~div]:pl-9 [&>span]:absolute [&>span]:left-4 [&>span]:top-4 [&>span]:text-brand-primary [&>span+div]:translate-y-[-3px]',
  {
    variants: {
      variant: {
        default: 'bg-surface-container-low text-on-surface border-outline-variant/10',
        destructive: 'border-error/50 text-error bg-error/5 [&>span]:text-error dark:border-error [&>span]:text-error',
        success: 'border-brand-primary/50 text-brand-primary bg-brand-primary/5 [&>span]:text-brand-primary',
        info: 'border-secondary/50 text-secondary bg-secondary/5 [&>span]:text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-bold leading-none tracking-tight text-sm', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs opacity-90 [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
