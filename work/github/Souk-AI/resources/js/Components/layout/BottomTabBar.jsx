import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Icon } from '@/Components/ui/Icon';

export const BottomTabBar = ({ className }) => {
  const { auth } = usePage().props;
  const role = auth.user?.role;

  const getItemsByRole = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { href: '/dashboard', label: 'Home', icon: 'home' },
          { href: '/admin/users', label: 'Users', icon: 'people' },
          { href: '/admin/settings', label: 'Settings', icon: 'settings' },
          { href: '/profile', label: 'Profile', icon: 'person' },
        ];
      case 'STORE':
        return [
          { href: '/dashboard', label: 'Market', icon: 'store' },
          { href: '/store/products', label: 'Catalog', icon: 'inventory' },
          { href: '/store/sales', label: 'Sales', icon: 'payments' },
          { href: '/profile', label: 'Profile', icon: 'person' },
        ];
      default: // CLIENT
        return [
          { href: '/dashboard', label: 'Home', icon: 'home' },
          { href: '/marketplace', label: 'Explore', icon: 'explore' },
          { href: '/orders', label: 'Orders', icon: 'shopping_bag' },
          { href: '/profile', label: 'Profile', icon: 'person' },
        ];
    }
  };

  const navItems = getItemsByRole();

  return (
    <nav className={cn(
      "fixed bottom-0 w-full z-50 bg-white dark:bg-[#1e1e1e] shadow-2xl border-t border-outline-variant/10 md:hidden flex justify-around items-center px-4 py-3",
      className
    )}>
      {navItems.map((item, idx) => (
        <Link 
          key={idx}
          href={item.href} 
          className="flex flex-col items-center group transition-colors hover:text-brand-primary text-on-surface dark:text-gray-400"
        >
          <Icon name={item.icon} className="text-2xl" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
