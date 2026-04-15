import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef(({
    checked = false,
    onCheckedChange,
    disabled = false,
    size = 'default',
    className,
    id,
    ...props
}, ref) => {
    const sizes = {
        sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 16, padding: 3 },
        default: { track: 'w-12 h-7', thumb: 'w-5 h-5', translate: 20, padding: 4 },
        lg: { track: 'w-14 h-8', thumb: 'w-6 h-6', translate: 22, padding: 4 },
    };

    const s = sizes[size] || sizes.default;

    return (
        <button
            ref={ref}
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onCheckedChange?.(!checked)}
            className={cn(
                'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                s.track,
                checked
                    ? 'bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_12px_rgba(var(--primary-rgb,99,102,241),0.4)]'
                    : 'bg-muted/60 border border-border/60',
                disabled && 'opacity-40 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {/* Glow effect when active */}
            {checked && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}

            {/* Track inner highlight */}
            <div className={cn(
                'absolute inset-[1px] rounded-full transition-all duration-300',
                checked
                    ? 'bg-gradient-to-r from-primary/90 to-primary/70'
                    : 'bg-muted/40'
            )} />

            {/* Thumb */}
            <motion.div
                className={cn(
                    'relative z-10 rounded-full shadow-md',
                    s.thumb,
                    checked
                        ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]'
                        : 'bg-white dark:bg-foreground/80 shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
                )}
                animate={{
                    x: checked ? s.translate : 0,
                    scale: checked ? 1 : 0.9,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 0.8,
                }}
                style={{
                    marginLeft: s.padding,
                }}
            >
                {/* Inner dot indicator */}
                <motion.div
                    className={cn(
                        'absolute inset-0 m-auto rounded-full',
                        checked ? 'bg-primary/30' : 'bg-muted-foreground/20'
                    )}
                    animate={{
                        width: checked ? '40%' : '30%',
                        height: checked ? '40%' : '30%',
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </button>
    );
});

Switch.displayName = 'Switch';

export { Switch };
