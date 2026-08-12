import * as React from 'react';

import { cn } from '@/lib/utils';

const sideStyles = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
};

const Tooltip = React.forwardRef(
  ({ content, side = 'top', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className="relative inline-flex group/tooltip"
      {...props}
    >
      {children}
      <span
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background opacity-0 shadow-xl transition-opacity duration-200 group-hover/tooltip:opacity-100',
          sideStyles[side],
          className
        )}
      >
        {content}
      </span>
    </div>
  )
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
