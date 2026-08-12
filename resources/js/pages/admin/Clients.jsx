import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import CardBox from '@/components/shared/CardBox';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
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
                        <Button variant="outlinemuted" size="xl" padding="lg" rounded="2xl" className="font-bold">
                            <Filter size={18} className="text-muted-foreground" />
                            {t('common.actions.filter') || 'Filter'}
                        </Button>
                        <Button variant="outlinemuted" size="xl" padding="lg" rounded="2xl" className="font-bold">
                            <Download size={18} className="text-muted-foreground" />
                            {t('common.actions.export') || 'Export'}
                        </Button>
                    </div>
                </div>

                {/* Mobile View - Card List */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-card/50 rounded-[32px] border border-border/50">
                            <Activity className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground font-bold">{t('admin.common.loading')}</p>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Users size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.clients.messages.noClients') || 'No clients found'}</p>
                        </div>
                    ) : (
                        filteredClients.map((client, idx) => (
                            <div
                                key={client.id}
                                className="bg-card border border-border/60 rounded-[24px] p-5 space-y-4 shadow-sm active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-xl uppercase">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{client.name} {client.family_name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{client.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${client.isBlocked ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                        {client.isBlocked ? t('admin.clients.status.blocked') : t('admin.clients.status.active')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium py-2 border-y border-border/40">
                                    <MapPin size={14} className="text-primary/50" />
                                    {client.client?.city || '-'}
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleView(client)}
                                        className="h-10 px-4 rounded-2xl bg-secondary/5 text-secondary hover:bg-secondary/20 text-xs font-bold gap-2"
                                    >
                                        <Eye size={16} strokeWidth={2.5} />
                                        {t('admin.clients.table.viewOrders') || 'View orders'}
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(client)}
                                            className="h-10 w-10 rounded-2xl bg-primary/5 text-primary hover:bg-primary/20"
                                        >
                                            <Pencil size={18} strokeWidth={2.5} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleBlock(client)}
                                            className={`h-10 w-10 rounded-2xl ${client.isBlocked ? 'bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/20' : 'bg-amber-500/5 text-amber-500 hover:bg-amber-500/20'}`}
                                        >
                                            {client.isBlocked ? <ShieldCheck size={18} strokeWidth={2.5} /> : <Ban size={18} strokeWidth={2.5} />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(client.id)}
                                            className="h-10 w-10 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500/20"
                                        >
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View - Clients Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
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
                                    <tr 
                                        key={client.id}
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Tooltip content={t('common.actions.view')}>
                                                    <Button
                                                        variant="soft"
                                                        size="iconsm"
                                                        rounded="xl"
                                                        color="secondary"
                                                        onClick={() => handleView(client)}
                                                    >
                                                        <Eye size={18} strokeWidth={2.5} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content={t('common.actions.edit')}>
                                                    <Button
                                                        variant="soft"
                                                        size="iconsm"
                                                        rounded="xl"
                                                        color="primary"
                                                        onClick={() => handleEdit(client)}
                                                    >
                                                        <Pencil size={18} strokeWidth={2.5} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content={client.isBlocked ? t('common.actions.unblock') : t('common.actions.block')}>
                                                    <Button
                                                        variant="soft"
                                                        size="iconsm"
                                                        rounded="xl"
                                                        color={client.isBlocked ? 'success' : 'warning'}
                                                        onClick={() => handleToggleBlock(client)}
                                                    >
                                                        {client.isBlocked ? <ShieldCheck size={18} strokeWidth={2.5} /> : <Ban size={18} strokeWidth={2.5} />}
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content={t('common.actions.delete')}>
                                                    <Button
                                                        variant="soft"
                                                        size="iconsm"
                                                        rounded="xl"
                                                        color="error"
                                                        onClick={() => handleDelete(client.id)}
                                                    >
                                                        <Trash2 size={18} strokeWidth={2.5} />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </tr>
                                ))}
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
                            <Button type="button" variant="outlinemuted" size="xl" padding="xl" rounded="xl" className="font-bold" onClick={() => setIsDialogOpen(false)}>
                                {t('admin.clients.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} size="xl" padding="2xl" rounded="xl" className="font-black shadow-lg shadow-primary/20 transition-all">
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
                        <Button onClick={() => { setViewingClient(null); setClientOrders([]); }} size="xl" padding="xl" rounded="xl" className="font-bold bg-muted text-foreground hover:bg-muted/80">
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
                                            <div
                                                key={order.id}
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
                                                                    <img src={item.product.albums[0].file} className="w-full h-full object-cover" alt="" />
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
                                            </div>
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
