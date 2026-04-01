import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { useTheme } from '@/Contexts/ThemeProvider';
import { Icon } from '@/Components/ui/Icon';

export default function PublicLayout({ children, title }) {
    const { toggleTheme, theme } = useTheme();

    return (
        <div className="min-h-screen bg-surface dark:bg-[#121212] flex flex-col text-on-surface dark:text-gray-100">
            <Head title={title} />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-surface/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-outline-variant/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center">
                                <span className="text-3xl font-black tracking-tighter text-brand-secondary dark:text-white">
                                    SOUK<span className="text-brand-primary">.AI</span>
                                </span>
                            </Link>
                            
                            <div className="hidden md:flex items-center gap-6">
                                <Link href="#" className="text-sm font-bold hover:text-brand-primary transition-colors">Marketplace</Link>
                                <Link href="#" className="text-sm font-bold hover:text-brand-primary transition-colors">Influencers</Link>
                                <Link href="#" className="text-sm font-bold hover:text-brand-primary transition-colors">How it Works</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
                            </Button>
                            
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href={route('login')}>
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-2xl shadow-lg shadow-brand-primary/20">
                                        Join Souk
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-surface-container dark:bg-[#1e1e1e] border-t border-outline-variant/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <span className="text-2xl font-black tracking-tighter">SOUK.AI</span>
                        <p className="text-sm text-on-surface-variant text-center md:text-left max-w-xs">
                            The intelligent marketplace for creators and forward-thinking brands.
                        </p>
                    </div>
                    
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-2">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Product</h4>
                            <Link href="#" className="text-sm hover:underline">Features</Link>
                            <Link href="#" className="text-sm hover:underline">API</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Compnay</h4>
                            <Link href="#" className="text-sm hover:underline">About</Link>
                            <Link href="#" className="text-sm hover:underline">Careers</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-on-surface-variant p-4">
                    &copy; {new Date().getFullYear()} Souk.AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
