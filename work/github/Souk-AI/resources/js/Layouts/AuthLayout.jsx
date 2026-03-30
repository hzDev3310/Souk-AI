import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useLanguage } from '@/Contexts/LanguageProvider';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

const LanguageSelector = () => {
    const { lang, setLang } = useLanguage();
    return (
        <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-0 text-sm font-bold text-brand-secondary dark:text-white focus:ring-0 cursor-pointer"
        >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="fr">FR</option>
        </select>
    );
};

const ThemeToggleButton = () => {
    const { toggleTheme, theme } = useTheme();
    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
        </Button>
    );
};

export default function AuthLayout({ children, title, description }) {
    const { t, dir } = useLanguage();

    return (
        <div dir={dir} className="min-h-screen bg-surface dark:bg-[#121212] flex flex-col md:flex-row">
            <Head title={title} />

            {/* Left side: Branding & Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand-secondary dark:bg-[#1e1e1e] overflow-hidden items-center justify-center p-12">
                {/* Animated Background Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-primary/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
                
                <div className="relative z-10 max-w-lg text-white">
                    <Link href="/" className="inline-block mb-12">
                        <span className="text-4xl font-extrabold tracking-tighter text-white">SOUK<span className="text-brand-primary">.AI</span></span>
                    </Link>
                    <h1 className="text-5xl font-extrabold leading-tight mb-6 animate-in fade-in slide-in-from-left duration-700">
                        {t('auth.layout.hero_title')} <br/>
                        <span className="text-brand-primary decoration-brand-primary/30 underline-offset-8">{t('auth.layout.hero_subtitle')}</span>
                    </h1>
                    <p className="text-xl text-white/70 leading-relaxed max-w-md animate-in fade-in slide-in-from-left duration-1000 delay-200">
                        {t('auth.layout.hero_description')}
                    </p>
                </div>
            </div>

            {/* Right side: Form Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
                {/* Theme and Language Toggles Top Right */}
                <div className="absolute top-6 right-6 flex items-center space-x-6">
                    <LanguageSelector />
                    <ThemeToggleButton />
                </div>

                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center lg:hidden mb-8">
                        <Link href="/">
                            <span className="text-3xl font-extrabold tracking-tighter text-brand-secondary dark:text-white">SOUK<span className="text-brand-primary">.AI</span></span>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h2 className="text-3xl font-bold text-secondary dark:text-white">{title}</h2>
                        {description && <p className="text-on-surface-variant dark:text-[#b0b0b0] whitespace-pre-line">{description}</p>}
                    </div>

                    <main>
                        {children}
                    </main>

                    <footer className="pt-12 text-center text-sm text-outline-variant dark:text-[#7a7a7a]">
                        &copy; {new Date().getFullYear()} Souk.AI - {t('auth.layout.footer')}
                    </footer>
                </div>
            </div>
        </div>
    );
}
