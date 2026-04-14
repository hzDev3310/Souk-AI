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
import { Plus, Pencil, Trash2, Search, Sparkles, Activity, Filter, Download, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/shared/Modal';

const Influencers = () => {
    const { t } = useTranslation();
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInfluencer, setEditingInfluencer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        cin: '',
        rib: '',
        commissionRate: 5,
        isActive: true,
    });

    const fetchInfluencers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users/influencers');
            setInfluencers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching influencers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfluencers();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingInfluencer) {
                await api.put(`/admin/users/influencers/${editingInfluencer.id}`, formData);
            } else {
                await api.post('/admin/users/influencers', formData);
            }
            setIsDialogOpen(false);
            setEditingInfluencer(null);
            resetForm();
            fetchInfluencers();
        } catch (error) {
            console.error('Error saving influencer:', error);
            alert('Error saving influencer');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.influencers.messages.confirmDelete'))) return;
        try {
            await api.delete(`/admin/users/influencers/${id}`);
            fetchInfluencers();
        } catch (error) {
            console.error('Error deleting influencer:', error);
        }
    };

    const handleEdit = (influencer) => {
        setEditingInfluencer(influencer);
        setFormData({
            name: influencer.name || '',
            family_name: influencer.family_name || '',
            email: influencer.email || '',
            password: '',
            phone: influencer.influencer?.phone || '',
            address: influencer.influencer?.address || '',
            city: influencer.influencer?.city || '',
            cin: influencer.influencer?.cin || '',
            rib: influencer.influencer?.rib || '',
            commissionRate: influencer.influencer?.commissionRate || 5,
            isActive: influencer.influencer?.isActive ?? true,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            family_name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            city: '',
            cin: '',
            rib: '',
            commissionRate: 5,
            isActive: true,
        });
    };

    const handleAdd = () => {
        setEditingInfluencer(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const filteredInfluencers = influencers.filter(influencer =>
        influencer.name?.toLowerCase().includes(search.toLowerCase()) ||
        influencer.email?.toLowerCase().includes(search.toLowerCase()) ||
        influencer.influencer?.phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title="admin.influencers.title"
            subtitle="admin.influencers.subtitle"
            icon={Sparkles}
            onAdd={handleAdd}
            addLabel="admin.influencers.add"
        >
            <div className="space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.influencers.search')}
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

                {/* Influencers Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.influencers.table.name')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.influencers.table.commission')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.influencers.table.referralCode')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.influencers.table.status')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-end">{t('admin.influencers.table.actions')}</TableHead>
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
                                ) : filteredInfluencers.map((influencer, idx) => (
                                    <motion.tr 
                                        key={influencer.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer"
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                                                    {influencer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground tracking-tight">{influencer.name} {influencer.family_name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Mail size={10} className="text-muted-foreground" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">{influencer.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs">
                                                    {influencer.influencer?.commissionRate || 5}%
                                                </div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Per Sale</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="px-3 py-1 bg-muted/50 border border-border/50 rounded-lg font-mono text-xs font-bold text-foreground tracking-wider">
                                                {influencer.influencer?.referralCode || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${influencer.influencer?.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                                {influencer.influencer?.isActive ? t('admin.influencers.status.active') : t('admin.influencers.status.inactive')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(influencer)}
                                                    className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20"
                                                >
                                                    <Pencil size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(influencer.id)}
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
                    title={editingInfluencer ? t('admin.influencers.form.editTitle') : t('admin.influencers.form.addTitle')}
                    subtitle="Partnering with growth leaders"
                    icon={Sparkles}
                    maxWidth="max-w-2xl"
                    footer={
                        <>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 rounded-xl font-bold border border-border/50 hover:bg-muted transition-all">
                                {t('admin.influencers.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                                {editingInfluencer ? t('admin.influencers.form.update') : t('admin.influencers.form.create')}
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.form.firstName')} *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.form.lastName')}</label>
                                <Input
                                    value={formData.family_name}
                                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.form.email')} *</label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.form.phone')}</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.form.commissionRate')} (%)</label>
                                <Input
                                    type="number"
                                    value={formData.commissionRate}
                                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.influencers.table.status')}</label>
                                <select
                                    value={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 text-foreground font-bold text-sm"
                                >
                                    <option value="true">{t('admin.influencers.status.active')}</option>
                                    <option value="false">{t('admin.influencers.status.inactive')}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default Influencers;
