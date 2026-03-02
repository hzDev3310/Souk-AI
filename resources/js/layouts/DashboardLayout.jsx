import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { User, Bell, Search, Moon, Sun, Globe, LogOut, ChevronDown } from 'lucide-react';
import Dropdown, { DropdownItem, DropdownDivider } from '../components/UI/Dropdown';
import axios from 'axios';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const UserDropdownTrigger = (
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 dark:border-gray-900 cursor-pointer group">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">Admin User</p>
                <p className="text-xs font-medium text-emerald-600">Super Admin</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 dark:shadow-none group-hover:scale-105 transition-transform">
                    AD
                </div>
                <ChevronDown size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-80 overflow-y-auto">
                {/* Dashboard Header */}
                <header className="h-24 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-900">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-white capitalize">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="absolute left-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 transition-all w-64 dark:text-gray-100"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>

                        {/* Profile & Dropdown */}
                        <Dropdown trigger={UserDropdownTrigger} closeOnInnerClick={false}>
                            <div className="px-4 py-3 mb-2 border-b border-gray-100 dark:border-gray-800 sm:hidden">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">Admin User</p>
                                <p className="text-xs font-medium text-emerald-600">Super Admin</p>
                            </div>

                            <DropdownItem
                                icon={isDark ? Sun : Moon}
                                onClick={toggleTheme}
                                rightContent={
                                    <div className={`w-10 h-6 rounded-full relative transition-colors ${isDark ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isDark ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                }
                            >
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </DropdownItem>

                            <DropdownDivider />

                            <div className="px-4 py-2">
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Language</p>
                                <div className="flex gap-2">
                                    {['en', 'fr', 'ar'].map((l) => (
                                        <a
                                            key={l}
                                            href={`/lang/${l}`}
                                            className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${window.location.pathname.startsWith(`/${l}`) || (!window.location.pathname.startsWith('/fr') && !window.location.pathname.startsWith('/ar') && l === 'en') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        >
                                            {l.toUpperCase()}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <DropdownDivider />

                            <DropdownItem
                                icon={LogOut}
                                className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300"
                                onClick={() => axios.post('/logout').then(() => window.location.href = '/')}
                            >
                                Logout
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
