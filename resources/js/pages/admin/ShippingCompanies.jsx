import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
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
import { Plus, Pencil, Trash2, Search, Truck, Users, Activity, Filter, Download, Mail, Phone, MapPin } from 'lucide-react';
import Modal from '@/components/shared/Modal';

const ShippingCompanies = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        company_name: '',
        companyPhone: '',
        responsiblePhone: '',
        address: '',
        matriculeFiscale: '',
        rib: '',
    });

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users/shipping-companies');
            setCompanies(response.data.data || []);
        } catch (error) {
            console.error('Error fetching shipping companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingCompany) {
                await api.put(`/admin/users/shipping-companies/${editingCompany.id}`, formData);
            } else {
                await api.post('/admin/users/shipping-companies', formData);
            }
            setIsDialogOpen(false);
            setEditingCompany(null);
            resetForm();
            fetchCompanies();
        } catch (error) {
            console.error('Error saving shipping company:', error);
            alert('Error saving shipping company');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.shippingCompanies.messages.confirmDelete'))) return;
        try {
            await api.delete(`/admin/users/shipping-companies/${id}`);
            fetchCompanies();
        } catch (error) {
            console.error('Error deleting shipping company:', error);
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            family_name: company.family_name || '',
            email: company.email || '',
            password: '',
            company_name: company.shipping_company?.name || '',
            companyPhone: company.shipping_company?.companyPhone || '',
            responsiblePhone: company.shipping_company?.responsiblePhone || '',
            address: company.shipping_company?.address || '',
            matriculeFiscale: company.shipping_company?.matriculeFiscale || '',
            rib: company.shipping_company?.rib || '',
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            family_name: '',
            email: '',
            password: '',
            company_name: '',
            companyPhone: '',
            responsiblePhone: '',
            address: '',
            matriculeFiscale: '',
            rib: '',
        });
    };

    const handleAdd = () => {
        setEditingCompany(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const handleViewEmployees = (companyId) => {
        navigate(`/dashboard/shipping-employees?company=${companyId}`);
    };

    const filteredCompanies = companies.filter(company =>
        company.name?.toLowerCase().includes(search.toLowerCase()) ||
        company.email?.toLowerCase().includes(search.toLowerCase()) ||
        company.shipping_company?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title="admin.shippingCompanies.title"
            subtitle="admin.shippingCompanies.subtitle"
            icon={Truck}
            onAdd={handleAdd}
            addLabel="admin.shippingCompanies.add"
        >
            <div className="space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.shippingCompanies.search')}
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

                {/* Mobile View - Card List */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-card/50 rounded-[32px] border border-border/50">
                            <Activity className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground font-bold">{t('admin.common.loading')}</p>
                        </div>
                    ) : filteredCompanies.length === 0 ? (
                        <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Truck size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No shipping companies found</p>
                        </div>
                    ) : (
                        filteredCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-card border border-border/60 rounded-[24px] p-5 space-y-4 shadow-sm active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Truck size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{company.shipping_company?.name || company.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Mail size={10} className="text-muted-foreground" />
                                            <span className="text-[10px] font-bold text-muted-foreground">{company.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40">
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.shippingCompanies.table.responsible')}</p>
                                        <p className="text-xs font-bold text-foreground truncate">{company.name} {company.family_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.shippingCompanies.table.companyPhone')}</p>
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={10} className="text-primary/50" />
                                            <p className="text-xs font-bold text-foreground truncate">{company.shipping_company?.companyPhone || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-0.5">{t('admin.shippingCompanies.table.matricule')}</p>
                                        <span className="px-2.5 py-1 bg-muted/50 border border-border/50 rounded-lg font-mono text-[10px] font-bold text-foreground tracking-widest">
                                            {company.shipping_company?.matriculeFiscale || '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewEmployees(company.id)}
                                            className="h-10 w-10 rounded-2xl bg-blue-500/5 text-blue-500 hover:bg-blue-500/20"
                                        >
                                            <Users size={18} strokeWidth={2.5} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(company)}
                                            className="h-10 w-10 rounded-2xl bg-primary/5 text-primary hover:bg-primary/20"
                                        >
                                            <Pencil size={18} strokeWidth={2.5} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(company.id)}
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

                {/* Desktop View - Companies Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingCompanies.table.companyName')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingCompanies.table.responsible')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingCompanies.table.companyPhone')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingCompanies.table.matricule')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-end">{t('admin.shippingCompanies.table.actions')}</TableHead>
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
                                ) : filteredCompanies.map((company, idx) => (
                                    <tr 
                                        key={company.id}
                                        className="border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer"
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Truck size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground tracking-tight">{company.shipping_company?.name || company.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Mail size={10} className="text-muted-foreground" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">{company.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 font-bold text-sm text-foreground">
                                            {company.name} {company.family_name}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <Phone size={14} className="text-primary/50" />
                                                {company.shipping_company?.companyPhone || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="px-3 py-1 bg-muted/50 border border-border/50 rounded-lg font-mono text-xs font-bold text-foreground tracking-widest">
                                                {company.shipping_company?.matriculeFiscale || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewEmployees(company.id)}
                                                    className="h-9 w-9 rounded-xl text-blue-500 hover:bg-blue-500/10"
                                                    title="View Fleet"
                                                >
                                                    <Users size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(company)}
                                                    className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20"
                                                >
                                                    <Pencil size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(company.id)}
                                                    className="h-9 w-9 rounded-xl text-red-500 hover:bg-red-500/20"
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </Button>
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
                    title={editingCompany ? t('admin.shippingCompanies.form.editTitle') : t('admin.shippingCompanies.form.addTitle')}
                    subtitle="Onboarding strategic logistics partners"
                    icon={Truck}
                    maxWidth="max-w-2xl"
                    footer={
                        <>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 rounded-xl font-bold border border-border/50 hover:bg-muted transition-all">
                                {t('admin.shippingCompanies.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                                {editingCompany ? t('admin.shippingCompanies.form.update') : t('admin.shippingCompanies.form.create')}
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-6 text-start">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.responsibleFirstName')} *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.responsibleLastName')}</label>
                                <Input
                                    value={formData.family_name}
                                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.email')} *</label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.companyName')}</label>
                                <Input
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.companyPhone')}</label>
                                <Input
                                    value={formData.companyPhone}
                                    onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.matriculeFiscale')}</label>
                                <Input
                                    value={formData.matriculeFiscale}
                                    onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingCompanies.form.rib')}</label>
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

export default ShippingCompanies;
