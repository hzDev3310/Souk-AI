import React, { useState } from 'react';
import { ShoppingCart, User, Globe, Menu, X, LogOut, Layout } from 'lucide-react';
import Button from '../UI/Button';

const Navbar = ({ user, locale, onLanguageSwitch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none transition-transform group-hover:scale-110">
                        <span className="text-white font-black text-xl">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">EcoMarket</span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    <a href="/" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">Marketplace</a>
                    <a href="#" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">Stores</a>
                    <a href="#" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">Influencers</a>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="hidden md:flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl gap-1">
                        {['en', 'fr', 'ar'].map((l) => (
                            <button
                                key={l}
                                onClick={() => onLanguageSwitch(l)}
                                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${locale === l ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' && (
                                <a href="/admin">
                                    <Button size="sm" variant="secondary" icon={Layout}>Dashboard</Button>
                                </a>
                            )}
                            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100 transition-all">
                                <User size={20} />
                            </div>
                        </div>
                    ) : (
                        <a href="/login">
                            <Button size="sm">Login</Button>
                        </a>
                    )}

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-500">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-300">
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col gap-4">
                            <a href="/" className="text-lg font-bold text-gray-800 dark:text-white">Marketplace</a>
                            <a href="#" className="text-lg font-bold text-gray-800 dark:text-white">Stores</a>
                            <a href="#" className="text-lg font-bold text-gray-800 dark:text-white">Influencers</a>
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            {!user && <a href="/login"><Button className="w-full">Get Started</Button></a>}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
