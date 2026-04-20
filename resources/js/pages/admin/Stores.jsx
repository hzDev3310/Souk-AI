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
import { Plus, Pencil, Trash2, Search, Store, Activity, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/shared/Modal';

const Stores = () => {
  const { t } = useTranslation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    name_fr: '',
    name_ar: '',
    name_en: '',
    storePhone: '',
    address: '',
    matriculeFiscale: '',
    rib: '',
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users/stores');
      setStores(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await api.put(`/admin/users/stores/${editingStore.id}`, formData);
      } else {
        await api.post('/admin/users/stores', formData);
      }
      setIsDialogOpen(false);
      setEditingStore(null);
      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;
      if (errors) {
        const errorText = Object.entries(errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join('\n');
        alert(t('admin.stores.messages.validationError') + '\n\n' + errorText);
      } else if (message) {
        alert(message);
      } else {
        alert(t('admin.stores.messages.errorSaving'));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.stores.messages.confirmDelete'))) return;
    try {
      await api.delete(`/admin/users/stores/${id}`);
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      family_name: store.family_name || '',
      email: store.email || '',
      password: '',
      name_fr: store.store?.name_fr || '',
      name_ar: store.store?.name_ar || '',
      name_en: store.store?.name_en || '',
      storePhone: store.store?.storePhone || '',
      address: store.store?.address || '',
      matriculeFiscale: store.store?.matriculeFiscale || '',
      rib: store.store?.rib || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      name_fr: '',
      name_ar: '',
      name_en: '',
      storePhone: '',
      address: '',
      matriculeFiscale: '',
      rib: '',
    });
  };

  const handleAdd = () => {
    setEditingStore(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(search.toLowerCase()) ||
    store.email?.toLowerCase().includes(search.toLowerCase()) ||
    store.store?.name_fr?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminPageLayout
        title="admin.stores.title"
        subtitle="admin.stores.subtitle"
        icon={Store}
        onAdd={handleAdd}
        addLabel="admin.stores.add"
    >
      <div className="space-y-6">
        {/* Filters & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                    placeholder={t('admin.stores.search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 bg-card border-border/60 rounded-2xl focus:shadow-xl focus:shadow-primary/5 transition-all"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="outline" className="h-12 px-5 rounded-2xl border-border/60 bg-card hover:bg-muted hover:text-foreground font-bold text-sm gap-2">
                    <Filter size={18} className="text-muted-foreground" />
                    {t('common.actions.filter') || 'Filter'}
                </Button>
                <Button variant="outline" className="h-12 px-5 rounded-2xl border-border/60 bg-card hover:bg-muted hover:text-foreground font-bold text-sm gap-2">
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
            ) : filteredStores.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <Store size={32} />
                    </div>
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.stores.messages.noStores')}</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {filteredStores.map((store, idx) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-card border border-border/60 rounded-[24px] p-5 space-y-4 shadow-sm active:scale-[0.98] transition-transform"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl uppercase">
                                        {(store.store?.name_fr || store.name).charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{store.store?.name_fr || store.name}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{store.store?.matriculeFiscale || 'No MAT'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${store.store?.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                    {store.store?.isActive ? t('admin.stores.status.active') : t('admin.stores.status.inactive')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40">
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.stores.table.owner')}</p>
                                    <p className="text-xs font-bold text-foreground truncate">{store.name} {store.family_name}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.stores.table.phone')}</p>
                                    <p className="text-xs font-bold text-foreground truncate">{store.store?.storePhone || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-0.5">{t('admin.stores.table.email')}</p>
                                    <p className="text-xs font-bold text-primary truncate max-w-[150px]">{store.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(store)}
                                        className="h-10 w-10 rounded-2xl bg-primary/5 text-primary hover:bg-primary/20"
                                    >
                                        <Pencil size={18} strokeWidth={2.5} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(store.id)}
                                        className="h-10 w-10 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500/20"
                                    >
                                        <Trash2 size={18} strokeWidth={2.5} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>

        {/* Desktop View - Table Container */}
        <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.stores.table.storeName')}</TableHead>
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.stores.table.owner')}</TableHead>
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.stores.table.email')}</TableHead>
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.stores.table.phone')}</TableHead>
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.stores.table.status')}</TableHead>
                            <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-end">{t('admin.stores.table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                        <Activity className="w-5 h-5 animate-spin text-primary" />
                                        {t('admin.common.loading')}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStores.map((store, idx) => (
                            <motion.tr 
                                key={store.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer"
                            >
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                                            {(store.store?.name_fr || store.name).charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground tracking-tight">{store.store?.name_fr || store.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{store.store?.matriculeFiscale || '-'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-6 font-bold text-sm text-foreground">
                                    {store.name} {store.family_name}
                                </TableCell>
                                <TableCell className="py-4 px-6 text-sm text-muted-foreground font-medium">{store.email}</TableCell>
                                <TableCell className="py-4 px-6 text-sm text-muted-foreground font-medium">{store.store?.storePhone || '-'}</TableCell>
                                <TableCell className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${store.store?.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {store.store?.isActive ? t('admin.stores.status.active') : t('admin.stores.status.inactive')}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 px-6 text-end">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(store)}
                                            className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20"
                                        >
                                            <Pencil size={18} strokeWidth={2.5} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(store.id)}
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
                {!loading && filteredStores.length === 0 && (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                            <Store size={32} />
                        </div>
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.stores.messages.noStores')}</p>
                    </div>
                )}
            </div>
        </CardBox>

        {/* Premium Modal for Add/Edit */}
        <Modal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title={editingStore ? t('admin.stores.form.editTitle') : t('admin.stores.form.addTitle')}
            subtitle={editingStore ? `Editing ${editingStore.email}` : "Create a new partner store"}
            icon={Store}
            maxWidth="max-w-2xl"
            footer={
                <>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 rounded-xl font-bold border border-border/50 hover:bg-muted hover:text-foreground transition-all">
                        {t('admin.stores.form.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                        {editingStore ? t('admin.stores.form.update') : t('admin.stores.form.create')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.ownerFirstName')} *</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.ownerLastName')}</label>
                        <Input
                            value={formData.family_name}
                            onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.email')} *</label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.storePhone')}</label>
                        <Input
                            value={formData.storePhone}
                            onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                </div>

                {!editingStore && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.password')} *</label>
                        <Input
                            type="password"
                            required={!editingStore}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.storeNameFr')}</label>
                        <Input
                            value={formData.name_fr}
                            onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.storeNameAr')}</label>
                        <Input
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl text-end"
                            dir="rtl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.matriculeFiscale')}</label>
                        <Input
                            value={formData.matriculeFiscale}
                            onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.stores.form.rib')}</label>
                        <Input
                            value={formData.rib}
                            onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                            className="h-12 bg-muted/30 border-border/50 rounded-xl"
                        />
                    </div>
                </div>
            </form>
        </Modal>
      </div>
    </AdminPageLayout>
  );
};

export default Stores;
