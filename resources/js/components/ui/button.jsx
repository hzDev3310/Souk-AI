import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primaryemphasis',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
        outlinesecondary:
          'border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-white',
        outlinemuted:
          'border border-border/60 bg-card text-foreground hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-white hover:bg-secondaryemphasis',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        ghostprimary: 'hover:bg-lightprimary hover:text-primary text-primary',
        soft: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
        link: 'text-primary underline-offset-4 hover:underline',
        lightprimary:
          'bg-lightprimary text-primary hover:bg-primary hover:text-white',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 px-5',
        xs: 'h-7',
        xxs: 'h-5',
        hero: 'h-14 w-full',
        icon: 'h-10 w-10',
        iconsm: 'h-9 w-9',
      },
      shape: {
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonRadii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

const buttonPaddings = {
  none: 'px-0',
  xs: 'px-1.5',
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
  xl: 'px-6',
  '2xl': 'px-8',
};

const buttonColors = {
  primary: {
    solid: 'bg-primary text-white hover:bg-primaryemphasis',
    outline: 'border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-lightprimary hover:text-primary',
    soft: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
    light: 'bg-lightprimary text-primary hover:bg-primary hover:text-white',
    link: 'text-primary hover:underline',
  },
  secondary: {
    solid: 'bg-secondary text-white hover:bg-secondaryemphasis',
    outline:
      'border-secondary text-secondary hover:bg-secondary hover:text-white',
    ghost: 'text-secondary hover:bg-secondary/10 hover:text-secondary',
    soft: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white',
    light: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white',
    link: 'text-secondary hover:underline',
  },
  success: {
    solid: 'bg-success text-white hover:bg-successemphasis',
    outline: 'border-success text-success hover:bg-success hover:text-white',
    ghost: 'text-success hover:bg-lightsuccess hover:text-success',
    soft: 'bg-success/10 text-success hover:bg-success hover:text-white',
    light: 'bg-lightsuccess text-success hover:bg-success hover:text-white',
    link: 'text-success hover:underline',
  },
  warning: {
    solid: 'bg-warning text-white hover:bg-warningemphasis',
    outline: 'border-warning text-warning hover:bg-warning hover:text-white',
    ghost: 'text-warning hover:bg-lightwarning hover:text-warning',
    soft: 'bg-warning/10 text-warning hover:bg-warning hover:text-white',
    light: 'bg-lightwarning text-warning hover:bg-warning hover:text-white',
    link: 'text-warning hover:underline',
  },
  error: {
    solid: 'bg-error text-white hover:bg-erroremphasis',
    outline: 'border-error text-error hover:bg-error hover:text-white',
    ghost: 'text-error hover:bg-lighterror hover:text-error',
    soft: 'bg-error/10 text-error hover:bg-error hover:text-white',
    light: 'bg-lighterror text-error hover:bg-error hover:text-white',
    link: 'text-error hover:underline',
  },
  info: {
    solid: 'bg-info text-white hover:bg-infoemphasis',
    outline: 'border-info text-info hover:bg-info hover:text-white',
    ghost: 'text-info hover:bg-lightinfo hover:text-info',
    soft: 'bg-info/10 text-info hover:bg-info hover:text-white',
    light: 'bg-lightinfo text-info hover:bg-info hover:text-white',
    link: 'text-info hover:underline',
  },
};

const variantStyleMap = {
  default: 'solid',
  secondary: 'solid',
  destructive: 'solid',
  outline: 'outline',
  outlinesecondary: 'outline',
  ghost: 'ghost',
  ghostprimary: 'ghost',
  soft: 'soft',
  lightprimary: 'light',
  link: 'link',
};

const Button = React.forwardRef(
  ({ className, variant, size, shape, color, rounded, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const colorClasses = color
      ? buttonColors[color]?.[variantStyleMap[variant] ?? 'solid']
      : '';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape }),
          colorClasses,
          buttonRadii[rounded],
          buttonPaddings[padding],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
