import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, Store as StoreIcon } from 'lucide-react';
import Button from '../../UI/Button';
import ConfirmDialog from '../../UI/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

const StoreList = ({ onEdit, onAdd }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get('/api/admin/stores');
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            addToast('Failed to fetch stores', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            await axios.delete(`/api/admin/stores/${deleteTarget.id}`);
            setStores(stores.filter(store => store.id !== deleteTarget.id));
            addToast('Store deleted successfully', 'success');
            setDeleteTarget(null);
        } catch (error) {
            console.error('Error deleting store:', error);
            addToast('Failed to delete store', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading stores...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">Active Stores</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage all registered marketplace vendors</p>
                </div>
                <Button onClick={onAdd} icon={Plus}>Add New Store</Button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Store</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Owner</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {stores.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300">
                                                <StoreIcon size={32} />
                                            </div>
                                            <span className="text-gray-400 font-bold">No stores found yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                stores.map((store) => (
                                    <tr key={store.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">
                                                    {store.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">{store.name}</span>
                                                    <span className="text-xs text-gray-400">ID: #{store.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{store.user?.name}</span>
                                                <span className="text-xs text-gray-500">{store.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Button size="icon" variant="secondary" onClick={() => onEdit(store)} icon={Edit} title="Edit Store" />
                                                <Button size="icon" variant="danger" onClick={() => setDeleteTarget(store)} icon={Trash2} title="Delete Store" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                type="danger"
                title="Delete Store?"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete Store"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default StoreList;
