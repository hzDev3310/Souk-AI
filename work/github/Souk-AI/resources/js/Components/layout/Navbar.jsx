import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useLanguage } from '@/Contexts/LanguageProvider';

export const Navbar = ({ className, user }) => {
  const { toggleTheme, theme } = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 bg-white/70 dark:bg-brand-secondary/70 backdrop-blur-md border-b border-outline-variant/10 hidden md:block",
      className
    )}>
      <div className="flex justify-between items-center px-12 py-4 max-w-full mx-auto">
        <Link href="/" className="text-2xl font-bold font-headline text-brand-secondary dark:text-white group">
          SOUK<span className="text-brand-primary group-hover:animate-pulse">.AI</span>
        </Link>

        <div className="flex items-center space-x-12">
          <Link href="/catalog" className="text-sm font-bold font-headline text-brand-secondary dark:text-slate-300 hover:text-brand-primary transition-colors">
            Catalog
          </Link>
          <Link href="/dashboard" className="text-sm font-bold font-headline text-brand-secondary dark:text-slate-300 hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/design-system" className="text-sm font-bold font-headline text-brand-secondary dark:text-slate-300 hover:text-brand-primary transition-colors">
            Design System
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
          </Button>
          
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-0 text-sm font-bold text-brand-secondary dark:text-white focus:ring-0 cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="fr">FR</option>
          </select>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/10">
              <div className="text-right">
                <p className="text-xs font-bold text-secondary dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Curator</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full bg-surface-container/50">
                <Icon name="account_circle" className="text-brand-primary" />
              </Button>
            </div>
          ) : (
            <Link href={route('login')}>
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
