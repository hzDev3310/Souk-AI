import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex h-10 w-full border rounded-sm px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:rounded-sm file:text-sm file:font-medium file:text-primary file:mr-5 focus-visible:outline-0',
  {
    variants: {
      variant: {
        default:
          'border-ld bg-transparent text-ld placeholder:text-muted-foreground dark:placeholder:text-white/30 focus-visible:border-primary focus-visible:ring-0',
        gray: 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 focus-visible:ring',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Input = React.forwardRef(
  ({ className, type = 'text', variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
