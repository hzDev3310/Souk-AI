import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex w-full px-3 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-0 resize-none',
  {
    variants: {
      variant: {
        default:
          'border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-foreground placeholder:text-muted-foreground/60 hover:border-primary/50 hover:bg-white/80 dark:hover:bg-gray-800/80 focus-visible:border-primary focus-visible:bg-white dark:focus-visible:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-lg rounded-xl backdrop-blur-sm',
        gray: 'border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 focus-visible:ring',
        outline: 'border-2 border-border bg-transparent hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl',
        filled: 'border-0 bg-primary/10 hover:bg-primary/15 focus-visible:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30 rounded-xl',
        error: 'border-2 border-red-500 bg-red-50/50 dark:bg-red-950/20 text-foreground placeholder:text-muted-foreground/60 hover:border-red-600 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 rounded-xl',
        success: 'border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20 text-foreground hover:border-green-600 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20 rounded-xl',
      },
      size: {
        default: 'px-3 py-2 text-sm min-h-[100px]',
        sm: 'px-2 py-1 text-xs min-h-[80px]',
        lg: 'px-4 py-3 text-base min-h-[120px]',
        xl: 'px-5 py-4 text-lg min-h-[140px]',
      },
      rounded: {
        default: 'rounded-xl',
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

const Textarea = React.forwardRef(
  ({ className, variant, size, rounded, rows = 4, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, rounded }), className)}
        ref={ref}
        rows={rows}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
