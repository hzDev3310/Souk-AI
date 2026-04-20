import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    User, FolderOpen, Box, ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StoreBottomNav = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        {
            label: t('store.nav.profile') || 'Profile',
            path: '/dashboard/profile',
            icon: User,
        },

        {
            label: t('store.nav.products') || 'Products',
            path: '/dashboard/products',
            icon: Box,
        },
        {
            label: t('store.nav.orders') || 'Orders',
            path: '/dashboard/orders',
            icon: ShoppingCart,
        },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-md z-40 xl:hidden">
            <nav className="flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-4 py-3 min-h-[70px] transition-all duration-200 flex-1',
                                active
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className={cn(
                                'text-[10px] font-semibold',
                                active ? 'opacity-100' : 'opacity-75'
                            )}>
                                {item.label}
                            </span>
                            {active && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary -mb-1" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default StoreBottomNav;
