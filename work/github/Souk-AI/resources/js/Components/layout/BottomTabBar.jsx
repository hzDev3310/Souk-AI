import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Icon } from '@/Components/ui/Icon';

export const BottomTabBar = ({ className }) => {
  return (
    <nav className={cn(
      "fixed bottom-0 w-full z-50 bg-white shadow-2xl border-t border-outline-variant/10 md:hidden flex justify-around items-center px-4 py-3",
      className
    )}>
      <Link href="/" className="flex flex-col items-center group transition-colors hover:text-brand-primary">
        <Icon name="home" className="text-2xl" />
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
      </Link>
      
      <Link href="/catalog" className="flex flex-col items-center group transition-colors hover:text-brand-primary">
        <Icon name="explore" className="text-2xl" />
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Explore</span>
      </Link>

      <Link href="/upload" className="relative -top-6">
        <div className="w-16 h-16 hero-gradient text-white rounded-full flex items-center justify-center shadow-xl shadow-brand-primary/40 border-4 border-white active:scale-95 transition-transform">
          <Icon name="add" className="text-3xl" />
        </div>
      </Link>

      <Link href="/notifications" className="flex flex-col items-center group transition-colors hover:text-brand-primary">
        <Icon name="notifications" className="text-2xl" />
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Alerts</span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center group transition-colors hover:text-brand-primary">
        <Icon name="person" className="text-2xl" />
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
      </Link>
    </nav>
  );
};
