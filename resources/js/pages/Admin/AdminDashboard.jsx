import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StoreList from '../../components/Admin/Stores/StoreList';
import StoreForm from '../../components/Admin/Stores/StoreForm';
import Card from '../../components/UI/Card';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [editingStore, setEditingStore] = useState(null);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setShowStoreForm(false);
        setEditingStore(null);
        setRefreshKey(prev => prev + 1);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Stores" value="12" sub="2 new this month" color="bg-blue-500" />
                        <StatCard title="Total Products" value="1,240" sub="+12% from last week" color="bg-emerald-500" />
                        <StatCard title="Influencers" value="48" sub="Active deals" color="bg-purple-500" />
                        <StatCard title="Total Sales" value="$45,200" sub="Verified revenue" color="bg-amber-500" />

                        <div className="md:col-span-2 lg:col-span-3">
                            <Card title="Recent Activity" description="Admin dashboard initialized. Ready for operations." className="h-full">
                                <p className="text-gray-500 dark:text-gray-400">Activity graph will appear here.</p>
                            </Card>
                        </div>

                        <div>
                            <Card title="Quick Actions" className="h-full">
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm">Add New Product</button>
                                    <button className="w-full py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-sm dark:text-white">Invite Influencer</button>
                                </div>
                            </Card>
                        </div>
                    </div>
                );
            case 'stores':
                return (
                    <div key={refreshKey}>
                        <StoreList
                            onAdd={() => { setEditingStore(null); setShowStoreForm(true); }}
                            onEdit={(store) => { setEditingStore(store); setShowStoreForm(true); }}
                        />
                        {showStoreForm && (
                            <StoreForm
                                store={editingStore}
                                onClose={() => setShowStoreForm(false)}
                                onSuccess={handleSuccess}
                            />
                        )}
                    </div>
                );
            case 'products':
                return <PlaceholderModule title="Inventory Management" />;
            case 'marketing':
                return <PlaceholderModule title="Marketing & Influencers" />;
            case 'logistics':
                return <PlaceholderModule title="Shipping & Logistics" />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </DashboardLayout>
    );
};

const StatCard = ({ title, value, sub, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
        </div>
    </div>
);

const PlaceholderModule = ({ title }) => (
    <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 font-bold text-2xl">
            ?
        </div>
        <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">Module implementation in progress. This section will handle CRUD operations for {title.toLowerCase()}.</p>
        </div>
        <button className="mt-4 px-8 py-3 bg-emerald-deep text-white rounded-xl font-bold">Initialize Module</button>
    </div>
);

export default AdminDashboard;
