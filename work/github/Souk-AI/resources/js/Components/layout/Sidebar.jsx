import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Icon } from '@/Components/ui/Icon';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { useLanguage } from '@/Contexts/LanguageProvider';

const SidebarItem = ({ href, icon, children, active, badge, onClick, isOpen }) => {
  const { t } = useLanguage();
  const content = (
    <div className={cn(
      "flex items-center transition-all duration-300 group",
      isOpen ? "px-4 py-3 justify-between" : "p-3 justify-center",
      active
        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
        : "text-on-surface-variant dark:text-gray-400 hover:bg-brand-primary/10 hover:text-brand-primary"
    ) + " rounded-2xl"}>
      <div className="flex items-center gap-3">
        <Icon name={icon} className={cn("text-xl transition-transform", !active && "group-hover:scale-110")} />
        {isOpen && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{children}</span>}
      </div>
      {isOpen && badge && (
        <span className={cn(
          "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black",
          active ? "bg-white text-brand-primary" : "bg-brand-primary/20 text-brand-primary"
        )}>
          {badge}
        </span>
      )}
    </div>
  );

  return (
    <li className="list-none">
      {href ? (
        <Link href={href} className="block w-full">{content}</Link>
      ) : (
        <button onClick={onClick} className="w-full focus:outline-none">{content}</button>
      )}
    </li>
  );
};

export const Sidebar = ({ className, items = [], isOpen, onToggle }) => {
  const { auth, url } = usePage().props;
  const user = auth.user;
  const { t } = useLanguage();

  return (
    <aside className={cn(
      "fixed start-0 top-0 h-screen bg-white dark:bg-[#121212] flex flex-col transition-all duration-300 z-[60] border-e border-outline-variant/10",
      isOpen ? "w-64" : "w-20",
      className
    )}>
      {/* Header with Logo */}
      <div className={cn("p-6 flex flex-col", isOpen ? "items-start" : "items-center")}>
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-3 h-10 overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <img src="/storage/logo.png" alt="" className="h-6 w-auto" />
            </div>
            {isOpen && (
              <span className="text-xl font-black tracking-tighter text-brand-secondary dark:text-white whitespace-nowrap">
                SOUK<span className="text-brand-primary">.AI</span>
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "rounded-xl w-8 h-8 transition-all duration-300",
              !isOpen && "hidden"
            )}
          >
            <Icon name={isOpen ? "menu_open" : "menu"} className="opacity-60" />
          </Button>
        </div>

        {/* Search Area */}
        {isOpen ? (
          <div className="relative w-full group mb-4">
            <Input
              placeholder={t('nav.search')}
              className="ps-10 pe-4 h-10 bg-surface-container/30 dark:bg-white/5 border-0 rounded-xl text-xs font-medium"
            />
            <Icon name="search" className="absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm opacity-50" />
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={onToggle} className="mb-4 rounded-xl">
            <Icon name="search" className="text-xl opacity-60" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar no-scrollbar">
        <ul className="space-y-1.5 m-0 p-0">
          {items.map((item) => (
            <SidebarItem
              key={cn(item.label)}
              href={item.href}
              icon={item.icon}
              badge={item.badge}
              isOpen={isOpen}
              active={url === item.href || url?.startsWith(item.href + '/')}
            >
              {item.label}
            </SidebarItem>
          ))}
        </ul>
      </div>

      {/* Footer / User Profile */}
      <div className={cn("mt-auto border-t border-outline-variant/10", isOpen ? "p-4" : "p-2")}>
        <div className={cn("flex items-center group transition-all", isOpen ? "justify-between p-2" : "justify-center p-0")}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-brand-primary/10 border border-brand-primary/20 flex-shrink-0 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <Icon name="person" className="text-brand-primary text-xl" />
              )}
            </div>
            {isOpen && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-bold truncate text-brand-secondary dark:text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate font-medium uppercase tracking-widest">{user?.role}</p>
              </div>
            )}
          </div>
          {isOpen && (
            <Link href={route('logout')} method="post" as="button" className="text-on-surface-variant hover:text-brand-primary transition-colors focus:outline-none ms-2">
              <Icon name="logout" className="text-sm rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};