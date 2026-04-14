import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { Plus, Pencil, Trash2, Search, ArrowLeft, User, Phone, Activity, Filter, Download, Mail, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/shared/Modal';

const ShippingEmployees = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('company');
    
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        Phone: '',
        address: '',
        cin: '',
        rib: '',
        company_id: '',
    });

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/admin/users/shipping-companies');
            const data = response.data.data || [];
            setCompanies(data);
            if (companyId) {
                const company = data.find(c => String(c.id) === String(companyId));
                setSelectedCompany(company);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users/shipping-emps');
            let data = response.data.data || [];
            if (companyId) {
                data = data.filter(emp => String(emp.shipping_emp?.company_id) === String(companyId) || String(emp.user_id) === String(companyId));
            }
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching shipping employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
        fetchEmployees();
    }, [companyId]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const submitData = {
                ...formData,
                company_id: companyId || formData.company_id,
            };
            
            if (editingEmployee) {
                await api.put(`/admin/users/shipping-emps/${editingEmployee.id}`, submitData);
            } else {
                await api.post('/admin/users/shipping-emps', submitData);
            }
            setIsDialogOpen(false);
            setEditingEmployee(null);
            resetForm();
            fetchEmployees();
        } catch (error) {
            console.error('Error saving shipping employee:', error);
            alert('Error saving employee');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.shippingEmployees.messages.confirmDelete'))) return;
        try {
            await api.delete(`/admin/users/shipping-emps/${id}`);
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name || '',
            family_name: employee.family_name || '',
            email: employee.email || '',
            password: '',
            Phone: employee.shipping_emp?.Phone || '',
            address: employee.shipping_emp?.address || '',
            cin: employee.shipping_emp?.cin || '',
            rib: employee.shipping_emp?.rib || '',
            company_id: String(employee.shipping_emp?.company_id || companyId || ''),
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            family_name: '',
            email: '',
            password: '',
            Phone: '',
            address: '',
            cin: '',
            rib: '',
            company_id: companyId || '',
        });
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const handleBack = () => {
        navigate('/dashboard/shipping-companies');
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name?.toLowerCase().includes(search.toLowerCase()) ||
        employee.email?.toLowerCase().includes(search.toLowerCase()) ||
        employee.shipping_emp?.Phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title="admin.shippingEmployees.title"
            subtitle={selectedCompany 
                ? t('admin.shippingEmployees.subtitleWithCompany', { companyName: selectedCompany.shipping_company?.name || selectedCompany.name })
                : "admin.shippingEmployees.subtitle"
            }
            icon={User}
            onAdd={handleAdd}
            addLabel="admin.shippingEmployees.add"
            onBack={companyId ? handleBack : null}
        >
            <div className="space-y-6 text-start">
                {/* Search & Global Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.shippingEmployees.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl focus:shadow-xl focus:shadow-primary/5 transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {!companyId && (
                            <select
                                className="h-12 px-4 rounded-xl bg-card border border-border/60 text-foreground font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        navigate(`/dashboard/shipping-employees?company=${e.target.value}`);
                                    }
                                }}
                            >
                                <option value="">{t('admin.shippingEmployees.filterByCompany')}</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.shipping_company?.name || company.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <Button variant="outline" className="h-12 px-5 rounded-2xl border-border/60 bg-card hover:bg-muted font-bold text-sm gap-2">
                            <Filter size={18} className="text-muted-foreground" />
                            {t('common.actions.filter') || 'Filter'}
                        </Button>
                    </div>
                </div>

                {/* Fleet Table Container */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingEmployees.table.name')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingEmployees.table.email')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingEmployees.table.cin')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.shippingEmployees.table.phone')}</TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-end">{t('admin.shippingEmployees.table.actions')}</TableHead>
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
                                ) : filteredEmployees.map((employee, idx) => (
                                    <motion.tr 
                                        key={employee.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-border/40 hover:bg-primary/5 transition-colors group cursor-pointer"
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-black uppercase">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground tracking-tight">{employee.name} {employee.family_name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{employee.shipping_emp?.address || 'Field Operator'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-muted-foreground font-medium">{employee.email}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-emerald-500" />
                                                <span className="font-mono text-xs font-bold text-foreground">{employee.shipping_emp?.cin || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 font-bold text-sm text-foreground">
                                            {employee.shipping_emp?.Phone || '-'}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(employee)}
                                                    className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20"
                                                >
                                                    <Pencil size={18} strokeWidth={2.5} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(employee.id)}
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

                {!loading && filteredEmployees.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="py-20 text-center space-y-4 bg-muted/20 rounded-[32px] border-2 border-dashed border-border/50"
                    >
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto shadow-xl text-muted-foreground">
                            <User size={40} strokeWidth={1} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-foreground font-black uppercase tracking-widest text-sm">{t('admin.shippingEmployees.messages.noEmployees')}</p>
                            {selectedCompany && (
                                <button 
                                    onClick={() => navigate('/dashboard/shipping-companies')}
                                    className="text-primary font-black text-xs uppercase hover:underline"
                                >
                                    {t('admin.shippingEmployees.messages.viewAllCompanies')}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Premium Modal for Add/Edit Courier */}
                <Modal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title={editingEmployee ? t('admin.shippingEmployees.form.editTitle') : t('admin.shippingEmployees.form.addTitle')}
                    subtitle="Managing the final-mile fleet"
                    icon={User}
                    maxWidth="max-w-lg"
                    footer={
                        <>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 rounded-xl font-bold border border-border/50 hover:bg-muted transition-all">
                                {t('admin.shippingEmployees.form.cancel')}
                            </Button>
                            <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                                {editingEmployee ? t('admin.shippingEmployees.form.update') : t('admin.shippingEmployees.form.create')}
                            </Button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.firstName')} *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.lastName')}</label>
                                <Input
                                    value={formData.family_name}
                                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.email')} *</label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>
                        {!editingEmployee && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.password')} *</label>
                                <Input
                                    type="password"
                                    required={!editingEmployee}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.phone')}</label>
                                <Input
                                    value={formData.Phone}
                                    onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.cin')}</label>
                                <Input
                                    value={formData.cin}
                                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>

                        {!companyId && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.shippingEmployees.form.company')} *</label>
                                <select
                                    required
                                    value={formData.company_id}
                                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 text-foreground font-bold text-sm"
                                >
                                    <option value="">{t('admin.shippingEmployees.form.selectCompany')}</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>
                                            {company.shipping_company?.name || company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </form>
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default ShippingEmployees;
