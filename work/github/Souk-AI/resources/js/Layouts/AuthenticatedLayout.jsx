import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/Components/layout/Navbar';
import { Sidebar } from '@/Components/layout/Sidebar';
import { BottomTabBar } from '@/Components/layout/BottomTabBar';
import { useLanguage } from '@/Contexts/LanguageProvider';
import { ToastContainer } from '@/Components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export default function AuthenticatedLayout({ user, header, children }) {
    const { toasts, removeToast } = useToast();
    const { dir, t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const sidebarItemsByRole = {
        ADMIN: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.users'), icon: 'people', href: '/admin/users' },
            { label: t('nav.stores'), icon: 'storefront', href: '/admin/stores' },
            { label: t('nav.settings'), icon: 'settings', href: '/admin/settings' },
        ],
        CLIENT: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.marketplace'), icon: 'shopping_bag', href: '/marketplace' },
            { label: t('nav.orders'), icon: 'shopping_cart', href: '/orders' },
            { label: t('nav.wishlist'), icon: 'favorite', href: '/wishlist' },
        ],
        STORE: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.products'), icon: 'inventory_2', href: '/store/products' },
            { label: t('nav.sales'), icon: 'payments', href: '/store/sales' },
            { label: t('nav.analytics'), icon: 'bar_chart', href: '/store/analytics' },
        ],
        INFLUENCER: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.campaigns'), icon: 'campaign', href: '/influencer/campaigns' },
            { label: t('nav.earnings'), icon: 'payments', href: '/influencer/earnings' },
            { label: t('nav.analytics'), icon: 'trending_up', href: '/influencer/analytics' },
        ],
        SHIPPING_COMPANY: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.fleet'), icon: 'local_shipping', href: '/shipping/fleet' },
            { label: t('nav.orders'), icon: 'inventory_2', href: '/shipping/orders' },
            { label: t('nav.users'), icon: 'groups', href: '/shipping/employees' },
        ],
        SHIPPING_EMP: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.routes'), icon: 'route', href: '/shipping/routes' },
            { label: t('nav.deliveries'), icon: 'package', href: '/shipping/deliveries' },
            { label: t('nav.history'), icon: 'history', href: '/shipping/history' },
        ],
        DEFAULT: [
            { label: t('nav.overview'), icon: 'grid_view', href: '/dashboard' },
            { label: t('nav.assets'), icon: 'layers', href: '/assets' },
            { label: t('nav.marketplace'), icon: 'shopping_bag', href: '/marketplace' },
            { label: t('nav.collections'), icon: 'folder', href: '/collections' },
            { label: t('nav.messages'), icon: 'chat', href: '/messages' },
            { label: t('nav.design_system'), icon: 'palette', href: '/design-system' },
        ]
    };

    const items = sidebarItemsByRole[user.role] || sidebarItemsByRole.DEFAULT;

    return (
        <div dir={dir} className="min-h-screen bg-surface dark:bg-[#121212] flex flex-col">
            <Head title="Souk.AI" />
            
            <Navbar user={user} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showLogo={false} />

            <div className="flex flex-1 pt-12 md:pt-16">
                {/* Fixed Desktop Sidebar */}
                <Sidebar 
                    items={items} 
                    isOpen={isSidebarOpen} 
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex" 
                />

                {/* Main Content Area - Adjusts based on sidebar state */}
                <div className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarOpen ? "md:ms-64" : "md:ms-20"
                )}>
                    <main className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
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
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <BottomTabBar />
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
