import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ className, type, error, success, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-b-2 font-medium',
        error ? 'border-error ring-error/20' : 'border-outline-variant/20',
        success ? 'border-brand-primary ring-brand-primary/20' : '',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const FloatingLabelInput = forwardRef(({ label, error, success, className, id, ...props }, ref) => {
  return (
    <div className={cn("relative floating-label-input", className)}>
      <input
        id={id}
        className={cn(
          "peer w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-brand-primary focus:ring-0 px-0 py-2 transition-all duration-200 outline-none font-medium text-sm pt-4",
          error ? "border-error" : "",
          success ? "border-brand-primary" : ""
        )}
        placeholder=" "
        ref={ref}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-3 text-outline transition-all duration-200 pointer-events-none origin-left text-sm"
      >
        {label}
      </label>
      {error && <p className="text-[10px] text-error mt-1 font-bold">{error}</p>}
      {success && <p className="text-[10px] text-brand-primary mt-1 font-bold">{success}</p>}
    </div>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';

export { Input, FloatingLabelInput };
