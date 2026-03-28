import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useLanguage } from '@/Contexts/LanguageProvider';

export const Navbar = ({ className }) => {
  const { toggleTheme, theme } = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 bg-white/70 dark:bg-brand-secondary/70 backdrop-blur-md border-b border-outline-variant/10 hidden md:block",
      className
    )}>
      <div className="flex justify-between items-center px-12 py-4 max-w-full mx-auto">
        <Link href="/" className="text-2xl font-bold font-headline text-brand-secondary dark:text-white">
          Souk.AI
        </Link>

        <div className="flex items-center space-x-12">
          <Link href="/catalog" className="text-sm font-bold font-headline text-brand-secondary dark:text-slate-300 hover:text-brand-primary transition-colors">
            Catalog
          </Link>
          <Link href="/upload" className="text-sm font-bold font-headline text-brand-secondary dark:text-slate-300 hover:text-brand-primary transition-colors">
            Upload
          </Link>
          <Link href="/design-system" className="text-sm font-bold font-headline text-brand-primary border-b-2 border-brand-primary pb-1">
            Design System
          </Link>
        </div>

        <div className="flex items-center space-x-4">
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

          <Button variant="ghost" size="icon">
            <Icon name="account_circle" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
