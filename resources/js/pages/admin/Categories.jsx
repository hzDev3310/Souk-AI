import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
    Pencil, Trash2, Search, Layers, Image as ImageIcon,
    CheckCircle2, XCircle, ChevronRight, Activity, Eye
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const Categories = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            if (categoryId) {
                const response = await api.get(`/admin/categories/${categoryId}`);
                const category = response.data || null;
                setCurrentCategory(category);
                setCategories(category?.children || []);
            } else {
                const response = await api.get('/admin/categories');
                setCategories(response.data || []);
                setCurrentCategory(null);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            setCurrentCategory(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [categoryId]);

    const handleDelete = async (category) => {
        if (!confirm(t('admin.categories.messages.confirmDelete', { name: category.name_en }) || `Confirm deletion of ${category.name_en}?`)) return;
        try {
            await api.delete(`/admin/categories/${category.id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleAdd = () => {
        navigate('/dashboard/categories/create');
    };

    const handleEdit = (category) => {
        navigate(`/dashboard/categories/${category.id}/edit`);
    };

    const handleView = (category) => {
        navigate(`/dashboard/categories/${category.id}`);
    };

    const handleBack = () => {
        if (currentCategory?.parent?.id) {
            navigate(`/dashboard/categories/${currentCategory.parent.id}`);
            return;
        }

        navigate('/dashboard/categories');
    };

    const filteredCategories = categories.filter(cat =>
        cat.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        cat.name_fr?.toLowerCase().includes(search.toLowerCase())
    );

    const pageTitle = currentCategory ? (currentCategory.name_fr || currentCategory.name_en || 'Category') : (t('admin.categories.title') || 'Categories');
    const pageSubtitle = currentCategory ? (currentCategory.name_en || 'Subcategories') : (t('admin.categories.subtitle') || 'Manage product categories');

    return (
        <AdminPageLayout
            title={pageTitle}
            subtitle={pageSubtitle}
            icon={Layers}
            onAdd={handleAdd}
            addLabel={t('admin.categories.add') || 'Add Category'}
        >
            <div className="space-y-6 text-start">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.categories.search') || 'Search categories...'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl"
                        />
                    </div>
                </div>

                {currentCategory && (
                    <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-border/50 bg-card/70 p-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/categories')} className="rounded-xl">
                            {t('admin.categories.title') || 'Categories'}
                        </Button>
                        {currentCategory.parent && (
                            <>
                                <ChevronRight size={16} className="text-muted-foreground" />
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/categories/${currentCategory.parent.id}`)} className="rounded-xl">
                                    {currentCategory.parent.name_fr || currentCategory.parent.name_en}
                                </Button>
                            </>
                        )}
                        <ChevronRight size={16} className="text-muted-foreground" />
                        <span className="text-sm font-black text-foreground">{currentCategory.name_fr || currentCategory.name_en}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-card/50 rounded-[32px] border border-border/50">
                            <Activity className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground font-bold">{t('admin.common.loading')}</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="py-20 text-center space-y-3 bg-card/50 rounded-[32px] border border-border/50">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Layers size={32} />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.categories.messages.noCategories') || 'No categories found'}</p>
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div key={category.id} className="bg-card border border-border/60 rounded-[24px] p-5 space-y-4 shadow-sm active:scale-[0.98] transition-transform">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                                            {category.icon && LucideIcons[category.icon] ? (
                                                React.createElement(LucideIcons[category.icon], { size: 20, className: 'text-primary' })
                                            ) : (
                                                <ImageIcon size={20} className="text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-foreground tracking-tight leading-none mb-1">{category.name_fr}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{category.name_en}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${category.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {category.isActive ? (t('admin.categories.table.active') || 'Active') : (t('admin.categories.table.inactive') || 'Inactive')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40">
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.categories.table.slug') || 'Slug'}</p>
                                        <p className="text-xs font-bold text-foreground font-mono truncate">{category.slug}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{t('admin.categories.table.status') || 'Status'}</p>
                                        {category.isActive ? (
                                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs uppercase">
                                                <CheckCircle2 size={14} /> {t('admin.categories.table.active') || 'Active'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase">
                                                <XCircle size={14} /> {t('admin.categories.table.inactive') || 'Inactive'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleView(category)}
                                        className="h-10 w-10 rounded-2xl bg-secondary/5 text-secondary hover:bg-secondary/20"
                                    >
                                        <Eye size={18} strokeWidth={2.5} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                        className="h-10 w-10 rounded-2xl bg-primary/5 text-primary hover:bg-primary/20"
                                    >
                                        <Pencil size={18} strokeWidth={2.5} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category)}
                                        className="h-10 w-10 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500/20"
                                    >
                                        <Trash2 size={18} strokeWidth={2.5} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden md:block">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border/50">
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.name') || 'NAME'}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.slug') || 'SLUG'}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.status') || 'STATUS'}</TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.actions') || 'ACTIONS'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                            <Activity className="w-5 h-5 animate-spin text-primary" />
                                            {t('admin.common.loading')}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.map((category) => (
                                <tr key={category.id} className="group hover:bg-primary/5 border-border/40 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                                                {category.icon && LucideIcons[category.icon] ? (
                                                    React.createElement(LucideIcons[category.icon], { size: 20, className: 'text-primary' })
                                                ) : (
                                                    <ImageIcon className="text-muted-foreground" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground tracking-tight">{category.name_fr}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{category.name_en}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 font-mono text-[10px] text-muted-foreground">{category.slug}</TableCell>
                                    <TableCell className="py-4 px-6">
                                        {category.isActive ? (
                                            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
                                                <CheckCircle2 size={14} /> {t('admin.categories.table.active') || 'Active'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
                                                <XCircle size={14} /> {t('admin.categories.table.inactive') || 'Inactive'}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-end">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/20" onClick={() => handleView(category)}>
                                                <Eye size={18} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20" onClick={() => handleEdit(category)}>
                                                <Pencil size={18} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-red-500 hover:bg-red-500/20" onClick={() => handleDelete(category)}>
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </tr>
                            ))}
                            {!loading && filteredCategories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                                        {t('admin.categories.messages.noCategories') || 'No categories found'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBox>
            </div>
        </AdminPageLayout>
    );
};

export default Categories;
