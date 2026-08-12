import React from 'react';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef(({
    checked = false,
    onCheckedChange,
    disabled = false,
    size = 'default',
    color = 'primary',
    className,
    id,
    ...props
}, ref) => {
    const colors = {
        primary: {
            track: 'bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_12px_rgba(var(--primary-rgb,99,102,241),0.4)]',
            glow: 'bg-primary/20',
            inner: 'bg-gradient-to-r from-primary/90 to-primary/70',
            dot: 'bg-primary/30',
        },
        success: {
            track: 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
            glow: 'bg-emerald-500/20',
            inner: 'bg-gradient-to-r from-emerald-500/90 to-emerald-400/80',
            dot: 'bg-emerald-500/30',
        },
    };

    const c = colors[color] || colors.primary;

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
                    ? c.track
                    : 'bg-muted/60 border border-border/60',
                disabled && 'opacity-40 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {/* Glow effect when active */}
            {checked && (
                <div className={`absolute inset-0 rounded-full blur-sm animate-in fade-in duration-200 ${c.glow}`} />
            )}

            {/* Track inner highlight */}
            <div className={cn(
                'absolute inset-[1px] rounded-full transition-all duration-300',
                checked ? c.inner : 'bg-muted/40'
            )} />

            {/* Thumb */}
            <div
                className={cn(
                    'relative z-10 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                    s.thumb,
                    checked
                        ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]'
                        : 'bg-white dark:bg-foreground/80 shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
                )}
                style={{
                    marginLeft: s.padding,
                    transform: `translateX(${checked ? s.translate : 0}px) scale(${checked ? 1 : 0.9})`,
                }}
            >
                {/* Inner dot indicator */}
                <div
                    className={cn(
                        'absolute inset-0 m-auto rounded-full transition-all duration-200',
                        checked ? c.dot : 'bg-muted-foreground/20'
                    )}
                    style={{
                        width: checked ? '40%' : '30%',
                        height: checked ? '40%' : '30%',
                    }}
                />
            </div>
        </button>
    );
});

Switch.displayName = 'Switch';

export { Switch };
