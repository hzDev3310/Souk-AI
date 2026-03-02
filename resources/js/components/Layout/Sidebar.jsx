import React from 'react';
import { Layout, Store, Package, Users, Truck, Settings, ChevronRight, LogOut } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Layout },
        { id: 'stores', label: 'Stores', icon: Store },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'marketing', label: 'Marketing', icon: Users },
        { id: 'logistics', label: 'Logistics', icon: Truck },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-900 z-40 hidden lg:block">
            <div className="flex flex-col h-full p-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none">
                        <span className="text-white font-black text-xl">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">EcoMarket</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                                w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group
                                ${activeTab === item.id
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 dark:shadow-none'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-emerald-600'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-emerald-600 transition-colors'} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-900 space-y-2">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-emerald-600 transition-all group">
                        <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
                        <span className="font-bold text-sm">Settings</span>
                    </button>
                    <button
                        onClick={() => {
                            axios.post('/logout').then(() => window.location.href = '/');
                        }}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
