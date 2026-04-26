import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import CardBox from '@/components/shared/CardBox';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, Users, MapPin, Activity, Filter, Download, Eye, ShoppingCart, Package, Calendar, DollarSign, Ban, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/shared/Modal';

const Clients = () => {
    const { t } = useTranslation();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [viewingClient, setViewingClient] = useState(null);
    const [clientOrders, setClientOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        address: '',
        city: '',
        codePostal: '',
    });

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users/clients');
            setClients(response.data.data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingClient) {
                await api.put(`/admin/users/clients/${editingClient.id}`, formData);
            } else {
                await api.post('/admin/users/clients', formData);
            }
            setIsDialogOpen(false);
            setEditingClient(null);
            resetForm();
            fetchClients();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error saving client');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.clients.messages.confirmDelete'))) return;
        try {
            await api.delete(`/admin/users/clients/${id}`);
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name || '',
            family_name: client.family_name || '',
            email: client.email || '',
            password: '',
            address: client.client?.address || '',
            city: client.client?.city || '',
            codePostal: client.client?.codePostal || '',
        });
        setIsDialogOpen(true);
    };

    const handleView = async (client) => {
        setViewingClient(client);
        setLoadingOrders(true);
        try {
            const response = await api.get(`/admin/orders/client/${client.client?.id || client.id}`);
            setClientOrders(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching client orders:', error);
            setClientOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleToggleBlock = async (client) => {
        const action = client.isBlocked ? 'unblock' : 'block';
        if (!confirm(`Are you sure you want to ${action} ${client.name} ${client.family_name || ''}?`)) return;

        try {
            await api.post(`/admin/users/${client.id}/${action}`);
            fetchClients();
        } catch (error) {
            console.error(`Error trying to ${action} client:`, error);
        }
    };

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'en_cours':
            case 'pending':
                return { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10' };
            case 'confirme':
            case 'confirmed':
                return { label: 'Confirmed', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            case 'annule':
            case 'cancelled':
                return { label: 'Cancelled', color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'shipped':
                return { label: 'Shipped', color: 'text-blue-500', bg: 'bg-blue-500/10' };
            case 'delivered':
                return { label: 'Delivered', color: 'text-green-500', bg: 'bg-green-500/10' };
            default:
                return { label: status || 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted/10' };
        }
    };

    const calculateOrderTotal = (order) => {
        if (!order.items) return 0;
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            family_name: '',
            email: '',
            password: '',
            address: '',
            city: '',
            codePostal: '',
        });
    };

    const handleAdd = () => {
        setEditingClient(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(search.toLowerCase()) ||
        client.email?.toLowerCase().includes(search.toLowerCase()) ||
        client.client?.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title="admin.clients.title"
            subtitle="admin.clients.subtitle"
            icon={Users}
            onAdd={handleAdd}
            addLabel="admin.clients.add"
        >
            <div className="space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.clients.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl focus:shadow-xl focus:shadow-primary/5 transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-12 px-5 rounded-2xl border-border/60 bg-card hover:bg-muted font-bold text-sm gap-2">
                            <Filter size={18} className="text-muted-foreground" />
                            {t('common.actions.filter') || 'Filter'}
                        </Button>
                        <Button variant="outline" className="h-12 px-5 rounded-2xl border-border/60 bg-card hover:bg-muted font-bold text-sm gap-2">
                            <Download size={18} className="text-muted-foreground" />
                            {t('common.actions.export') || 'Export'}
                        </Button>
                    </div>
                </div>

                {/* Clients Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.clients.table.name')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.clients.table.email')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.clients.table.city')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.clients.table.status')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-end">{t('admin.clients.table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                                <Activity className="w-5 h-5 animate-spin text-primary" />
                                                {t('admin.common.loading')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClients.map((client, idx) => (
                                    <motion.tr 
                                        key={client.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer"
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <p className="font-black text-foreground tracking-tight">{client.name} {client.family_name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-muted-foreground font-medium">{client.email}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <MapPin size={14} className="text-primary/50" />
                                                {client.client?.city || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${client.isBlocked ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                                {client.isBlocked ? t('admin.clients.status.blocked') : t('admin.clients.status.active')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleView(client)}
                                                    className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/20"
                                                    title="View Order History"
                                                >
                                                    <Eye size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(client)}
                                                    className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20"
                                                >
                                                    <Pencil size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleBlock(client)}
                                                    className={`h-9 w-9 rounded-xl ${client.isBlocked ? 'text-emerald-500 hover:bg-emerald-500/20' : 'text-amber-500 hover:bg-amber-500/20'}`}
                                                >
                                                    {client.isBlocked ? <ShieldCheck size={18} strokeWidth={2.5} /> : <Ban size={18} strokeWidth={2.5} />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(client.id)}
                                                    className="h-9 w-9 rounded-xl text-red-500 hover:bg-red-500/20"
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardBox>

                {/* Premium Modal for Add/Edit */}
                <Modal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title={editingClient ? t('admin.clients.form.editTitle') : t('admin.clients.form.addTitle')}
                    subtitle={editingClient ? `Editing ${editingClient.name}` : "Register a new platform user"}
                    icon={Users}
                    maxWidth="max-w-lg"
                    footer={
                        <>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 rounded-xl font-bold border border-border/50 hover:bg-muted transition-all">
                                {t('admin.clients.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                                {editingClient ? t('admin.clients.form.update') : t('admin.clients.form.create')}
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.firstName')} *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px) font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.lastName')}</label>
                                <Input
                                    value={formData.family_name}
                                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.email')} *</label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>
                        {!editingClient && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.password')} *</label>
                                <Input
                                    type="password"
                                    required={!editingClient}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.city')}</label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.clients.form.postalCode')}</label>
                                <Input
                                    value={formData.codePostal}
                                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>
                    </form>
                </Modal>

                {/* View Client Orders Modal */}
                <Modal
                    isOpen={!!viewingClient}
                    onClose={() => { setViewingClient(null); setClientOrders([]); }}
                    title={t('admin.clients.view.ordersTitle') || "Client Order History"}
                    subtitle={viewingClient ? `${viewingClient.name} ${viewingClient.family_name || ''}` : ''}
                    icon={ShoppingCart}
                    maxWidth="max-w-4xl"
                    footer={
                        <Button onClick={() => { setViewingClient(null); setClientOrders([]); }} className="h-12 px-6 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80">
                            {t('common.close') || "Close"}
                        </Button>
                    }
                >
                    {viewingClient && (
                        <div className="space-y-6 text-start">
                            {/* Client Info Summary */}
                            <div className="p-4 bg-muted/20 rounded-2xl border border-border/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-lg">
                                        {viewingClient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground">{viewingClient.name} {viewingClient.family_name}</p>
                                        <p className="text-sm text-muted-foreground">{viewingClient.email}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            <MapPin size={12} className="inline mr-1" />
                                            {viewingClient.client?.city || '-'}, {viewingClient.client?.codePostal || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            {loadingOrders ? (
                                <div className="flex items-center justify-center py-12">
                                    <Activity className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : clientOrders.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground font-bold">{t('admin.clients.view.noOrders') || "No orders found"}</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {clientOrders.map((order, idx) => {
                                        const status = getStatusConfig(order.status);
                                        const total = calculateOrderTotal(order);
                                        return (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-foreground">
                                                            {order.order_number || `#${order.id?.toString().slice(-8)}`}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${status.bg} ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        <Calendar size={12} className="inline mr-1" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Order Items */}
                                                <div className="space-y-2">
                                                    {order.items?.map((item, itemIdx) => (
                                                        <div key={itemIdx} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                                                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                                {item.product?.albums?.[0] ? (
                                                                    <img src={`/storage/${item.product.albums[0].file}`} className="w-full h-full object-cover" alt="" />
                                                                ) : (
                                                                    <img src="/storage/empty/empty.webp" className="w-full h-full object-cover" alt="" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-foreground truncate">{item.product?.name_fr || item.product?.name_en}</p>
                                                                <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                                                            </div>
                                                            <span className="font-black text-primary text-sm">
                                                                {(item.price * item.quantity).toFixed(2)} TND
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order Total */}
                                                <div className="flex justify-end pt-3 mt-3 border-t border-border/30">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase">{t('admin.orders.table.total') || "Total"}</p>
                                                        <p className="text-xl font-black text-primary">{total.toFixed(2)} TND</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default Clients;
