import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import CardBox from '@/components/shared/CardBox';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Search, Sparkles, Activity, Filter, Download, Phone, Mail } from 'lucide-react';
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

    const handleToggleActive = async (influencer) => {
        const newValue = !(influencer.influencer?.isActive ?? true);
        setInfluencers((prev) => prev.map((inf) => inf.id === influencer.id ? { ...inf, influencer: { ...inf.influencer, isActive: newValue } } : inf));
        try {
            await api.put(`/admin/users/influencers/${influencer.id}`, { isActive: newValue });
        } catch (error) {
            console.error('Error toggling influencer status:', error);
            setInfluencers((prev) => prev.map((inf) => inf.id === influencer.id ? { ...inf, influencer: { ...inf.influencer, isActive: !newValue } } : inf));
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
                    ) : filteredInfluencers.length === 0 ? (
                        <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Sparkles size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.influencers.messages.noInfluencers')}</p>
                        </div>
                    ) : (
                        filteredInfluencers.map((influencer) => (
                            <div
                                key={influencer.id}
                                className="bg-card border border-border/60 rounded-[24px] p-5 space-y-4 shadow-sm active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl uppercase">
                                        {influencer.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{influencer.name} {influencer.family_name}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Mail size={10} className="text-muted-foreground" />
                                            <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[180px]">{influencer.email}</p>
                                        </div>
                                    </div>
                                    <Switch size="sm" color="success" checked={influencer.influencer?.isActive ?? true} onCheckedChange={() => handleToggleActive(influencer)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40">
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.influencers.table.commission')}</p>
                                        <p className="text-xs font-bold text-foreground">{influencer.influencer?.commissionRate || 5}% Per Sale</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.influencers.table.referralCode')}</p>
                                        <span className="px-2 py-0.5 bg-muted/50 border border-border/50 rounded-lg font-mono text-xs font-bold text-foreground tracking-wider">
                                            {influencer.influencer?.referralCode || '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Button
                                        size="iconsm" variant="soft" rounded="xl" color="warning"
                                        onClick={() => handleEdit(influencer)}
                                    >
                                        <Pencil size={18} strokeWidth={2.5} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View - Influencers Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
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
                                    <tr 
                                        key={influencer.id}
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
                                            <Switch size="sm" color="success" checked={influencer.influencer?.isActive ?? true} onCheckedChange={() => handleToggleActive(influencer)} />
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <Tooltip content={t('common.actions.edit')}>
                                                    <Button
                                                        variant="soft"
                                                        size="iconsm"
                                                        rounded="xl"
                                                        color="warning"
                                                        onClick={() => handleEdit(influencer)}
                                                    >
                                                        <Pencil size={18} strokeWidth={2.5} />
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
                    title={editingInfluencer ? t('admin.influencers.form.editTitle') : t('admin.influencers.form.addTitle')}
                    subtitle="Partnering with growth leaders"
                    icon={Sparkles}
                    maxWidth="max-w-2xl"
                    footer={
                        <>
                            <Button type="button" variant="outlinemuted" size="xl" padding="xl" rounded="xl" className="font-bold" onClick={() => setIsDialogOpen(false)}>
                                {t('admin.influencers.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} size="xl" padding="2xl" rounded="xl" className="font-black shadow-lg shadow-primary/20 transition-all">
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
