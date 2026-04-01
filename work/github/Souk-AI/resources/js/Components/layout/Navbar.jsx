import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { Input } from '@/Components/ui/Input';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useLanguage } from '@/Contexts/LanguageProvider';
import { useState } from 'react';

export const Navbar = ({ className, user, onToggleSidebar, showLogo = false }) => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-outline-variant/10 hidden md:block",
      className
    )}>
      <div className="flex justify-between items-center px-12 py-3 max-w-full mx-auto h-16">
        <div className="flex items-center gap-4">
          {showLogo ? (
            <Link href="/" className="flex items-center gap-3">
              <img src="/storage/logo.png" alt="SOUK.AI Logo" className="h-8 w-auto" />
              <span className="text-xl font-black tracking-tighter text-brand-secondary dark:text-white group">
                SOUK<span className="text-brand-primary">.AI</span>
              </span>
            </Link>
          ) : (
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleSidebar} 
                className="rounded-2xl w-10 h-10 hover:bg-brand-primary/10 hover:text-brand-primary group transition-all active:scale-95 border border-outline-variant/10 shadow-sm"
                title={t('nav.search')}
            >
               <Icon name="menu_open" className="text-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-container/30 dark:bg-white/5 rounded-2xl border border-outline-variant/10">
            <Icon name="language" className="text-sm opacity-50 transition-opacity group-hover:opacity-100" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border-0 text-xs font-bold text-brand-secondary dark:text-white focus:ring-0 cursor-pointer p-0 ps-1 pe-4"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-2xl hover:bg-brand-primary/10">
            <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
          </Button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="flex items-center gap-3 ps-4 border-s border-outline-variant/10 focus:outline-none group"
              >
                <div className="text-end">
                  <p className="text-xs font-bold text-secondary dark:text-white leading-none group-hover:text-brand-primary transition-colors">{user.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mt-1">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center overflow-hidden group-hover:border-brand-primary/50 transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="person" className="text-brand-primary" />
                  )}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-brand-secondary border border-outline-variant/10 rounded-[2rem] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-brand-primary/10 rounded-2xl transition-colors group w-full"
                  >
                    <Icon name="account_circle" className="text-brand-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold">View Profile</span>
                  </Link>
                  <div className="h-px bg-outline-variant/10 my-2 mx-4" />
                  <Link 
                    href="/logout" 
                    method="post" as="button" 
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition-colors group text-left"
                  >
                    <Icon name="logout" className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">{t('nav.logout')}</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link href={route('login')}>
              <Button className="rounded-2xl px-6 bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90">
                {t('auth.login.submit')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
