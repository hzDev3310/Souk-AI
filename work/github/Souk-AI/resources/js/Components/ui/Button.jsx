import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-brand-secondary text-white hover:bg-secondary/90 shadow-sm',
        success: 'hero-gradient text-white hover:opacity-90 shadow-md',
        outline: 'border-2 border-outline-variant bg-transparent text-secondary hover:bg-surface-container-low hover:border-brand-primary',
        ghost: 'text-secondary hover:bg-surface-container-low',
        danger: 'bg-error text-white hover:bg-error/90',
        link: 'text-brand-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-8 py-3',
        sm: 'h-9 px-4 rounded-lg',
        lg: 'h-14 px-10 rounded-2xl text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
  const Comp = asChild ? slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
