import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/Components/layout/Navbar';
import { Sidebar } from '@/Components/layout/Sidebar';
import { BottomTabBar } from '@/Components/layout/BottomTabBar';
import { useLanguage } from '@/Contexts/LanguageProvider';
import { ToastContainer } from '@/Components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

const sidebarItems = [
    { label: 'Overview', icon: 'grid_view', href: '/dashboard' },
    { label: 'Assets', icon: 'layers', href: '/assets' },
    { label: 'Marketplace', icon: 'shopping_bag', href: '/marketplace' },
    { label: 'Collections', icon: 'folder', href: '/collections' },
    { label: 'Messages', icon: 'chat', href: '/messages' },
    { label: 'Design System', icon: 'palette', href: '/design-system' },
];

export default function AuthenticatedLayout({ user, header, children }) {
    const { toasts, removeToast } = useToast();
    const { dir } = useLanguage();

    return (
        <div dir={dir} className="min-h-screen bg-surface dark:bg-[#121212] flex flex-col">
            <Head title="Souk.AI" />
            
            <Navbar user={user} />

            <div className="flex flex-1 pt-16 md:pt-20">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-72 bg-surface dark:bg-[#1e1e1e] border-r border-outline-variant/10 sticky top-20 h-[calc(100vh-5rem)] p-6 overflow-y-auto">
                    <Sidebar items={sidebarItems} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-6xl mx-auto w-full">
                    {header && (
                        <header className="mb-8">
                            {header}
                        </header>
                    )}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <BottomTabBar />
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
