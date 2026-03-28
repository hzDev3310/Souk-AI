import { cn } from '@/lib/utils';

export const Icon = ({ name, className, ...props }) => {
  return (
    <span
      className={cn('material-symbols-outlined', className)}
      {...props}
    >
      {name}
    </span>
  );
};
