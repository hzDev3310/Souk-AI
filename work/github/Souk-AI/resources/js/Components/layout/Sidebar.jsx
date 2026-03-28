import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Icon } from '@/Components/ui/Icon';

const SidebarItem = ({ href, icon, children, active }) => (
  <li>
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
        active
          ? "bg-brand-primary/10 text-brand-primary font-bold shadow-sm"
          : "text-brand-secondary dark:text-slate-400 hover:bg-surface-container-low hover:text-brand-primary"
      )}
    >
      <Icon name={icon} className="text-xl" />
      <span className="text-sm font-headline tracking-tight">{children}</span>
    </Link>
  </li>
);

export const Sidebar = ({ className, items = [], activePath }) => {
  return (
    <aside className={cn(
      "w-72 bg-surface-container-low dark:bg-brand-secondary/40 p-6 rounded-3xl h-fit sticky top-24 border border-outline-variant/10",
      className
    )}>
      <h3 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-outline mb-8 px-4">
        Admin Console
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={activePath === item.href}
          >
            {item.label}
          </SidebarItem>
        ))}
      </ul>
      
      <div className="mt-12 pt-8 border-t border-outline-variant/10">
        <h4 className="font-headline text-[10px] font-bold uppercase tracking-widest text-outline mb-4 px-4">
          Support & Policy
        </h4>
        <ul className="space-y-1">
          <SidebarItem href="/support" icon="support_agent">Support</SidebarItem>
          <SidebarItem href="/settings" icon="settings">Settings</SidebarItem>
        </ul>
      </div>
    </aside>
  );
};
