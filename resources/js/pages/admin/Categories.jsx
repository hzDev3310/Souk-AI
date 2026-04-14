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
import {
    Plus, Pencil, Trash2, Search, Layers, Image as ImageIcon,
    CheckCircle2, XCircle, ChevronRight, LayoutGrid, Activity, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/shared/Modal';

const Categories = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [viewingCategory, setViewingCategory] = useState(null);

    const [formData, setFormData] = useState({
        parent_id: '',
        name_fr: '',
        name_ar: '',
        name_en: '',
        icon: '',
        isActive: true,
    });
    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [previews, setPreviews] = useState({ logo: null, cover: null });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data);
            const allResponse = await api.get('/admin/categories/all');
            setAllCategories(allResponse.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB for logo, 4MB for cover)
            const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 4 * 1024 * 1024;
            if (file.size > maxSize) {
                alert(`Le fichier est trop volumineux. La taille maximale est de ${maxSize / (1024 * 1024)}MB.`);
                return;
            }

            if (type === 'logo') setLogoFile(file);
            else setCoverFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            parent_id: '',
            name_fr: '',
            name_ar: '',
            name_en: '',
            icon: '',
            isActive: true,
        });
        setLogoFile(null);
        setCoverFile(null);
        setPreviews({ logo: null, cover: null });
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                // Handle parent_id specifically to avoid empty string being sent as empty string instead of null
                if (key === 'parent_id' && formData[key] === '') return;
                data.append(key, formData[key] === true ? 1 : (formData[key] === false ? 0 : formData[key]));
            }
        });

        if (logoFile) data.append('logo', logoFile);
        if (coverFile) data.append('cover', coverFile);

        if (editingCategory) {
            data.append('_method', 'PUT');
        }

        try {
            if (editingCategory) {
                await api.post(`/admin/categories/${editingCategory.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/categories', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            parent_id: category.parent_id || '',
            name_fr: category.name_fr || '',
            name_ar: category.name_ar || '',
            name_en: category.name_en || '',
            icon: category.icon || '',
            isActive: !!category.isActive,
        });
        setPreviews({
            logo: category.logo ? `/storage/${category.logo}` : null,
            cover: category.cover ? `/storage/${category.cover}` : null,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (category) => {
        if (!confirm(t('admin.categories.messages.confirmDelete', { name: category.name_en }) || `Confirm deletion of ${category.name_en}?`)) return;
        try {
            await api.delete(`/admin/categories/${category.id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        cat.name_fr?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title={t('admin.categories.title') || "Gestion des Catégories"}
            subtitle={t('admin.categories.subtitle') || "Organisez vos produits par catégories et sous-catégories"}
            icon={Layers}
            onAdd={() => { resetForm(); setIsModalOpen(true); }}
            addLabel={t('admin.categories.add') || "Ajouter une catégorie"}
        >
            <div className="space-y-6 text-start">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.categories.search') || "Rechercher une catégorie..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl"
                        />
                    </div>
                </div>

                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border/50">
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.nameInfo') || "NOM / INFO"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.slug') || "SLUG"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.parent') || "PARENT"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.status') || "STATUS"}</TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.table.actions') || "ACTIONS"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                            <Activity className="w-5 h-5 animate-spin text-primary" />
                                            {t('admin.categories.messages.loading') || "Chargement..."}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.map((category) => (
                                <React.Fragment key={category.id}>
                                    <TableRow className="group hover:bg-primary/5 border-border/40 transition-colors">
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                                                    {category.logo ? (
                                                        <img src={`/storage/${category.logo}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="text-muted-foreground" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground tracking-tight">{category.name_fr}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{category.name_ar}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 font-mono text-[10px] text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase text-muted-foreground">
                                                {t('admin.categories.table.main') || "Principal"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            {category.isActive ? (
                                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
                                                    <CheckCircle2 size={14} /> {t('admin.categories.table.active') || "Actif"}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
                                                    <XCircle size={14} /> {t('admin.categories.table.inactive') || "Inactif"}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex justify-end gap-2  transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/20" onClick={() => setViewingCategory(category)}>
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
                                    </TableRow>

                                    {category.children?.map(child => (
                                        <TableRow key={child.id} className="group hover:bg-primary/5 border-border/40 bg-muted/5">
                                            <TableCell className="py-3 px-6 pl-14">
                                                <div className="flex items-center gap-3">
                                                    <ChevronRight size={14} className="text-muted-foreground" />
                                                    <div className="w-8 h-8 rounded-lg bg-muted overflow-hidden border border-border/50">
                                                        {child.logo && <img src={`/storage/${child.logo}`} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <p className="font-bold text-sm text-foreground/80 tracking-tight">{child.name_fr}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-6 font-mono text-[10px] text-muted-foreground">{child.slug}</TableCell>
                                            <TableCell className="py-3 px-6">
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-black uppercase">
                                                    {category.name_fr}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3 px-6">
                                                {child.isActive ? (
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3 px-6 text-end">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-secondary hover:bg-secondary/20" onClick={() => setViewingCategory(child)}>
                                                        <Eye size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-primary hover:bg-primary/20" onClick={() => handleEdit(child)}>
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-red-500 hover:bg-red-500/20" onClick={() => handleDelete(child)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                            {!loading && filteredCategories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                                        {t('admin.categories.messages.noCategories') || "Aucune catégorie trouvée"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBox>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingCategory ? t('admin.categories.form.editTitle') || "Modifier la catégorie" : t('admin.categories.form.addTitle') || "Nouveauté"}
                    subtitle={t('admin.categories.form.addSubtitle') || "Détails de la catégorie et branding visuel"}
                    icon={LayoutGrid}
                    maxWidth="max-w-2xl"
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">
                                {t('admin.categories.form.cancel') || "Annuler"}
                            </Button>
                            <Button className="bg-primary text-white rounded-xl font-black px-8" onClick={handleSubmit}>
                                {editingCategory ? t('admin.categories.form.update') || "Mettre à jour" : t('admin.categories.form.create') || "Créer la catégorie"}
                            </Button>
                        </>
                    }
                >
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.parentCategory') || "Catégorie Parente"}</label>
                                <select
                                    className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.parent_id}
                                    onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                                >
                                    <option value="">{t('admin.categories.form.topLevel') || "Principal (Top Level)"}</option>
                                    {allCategories.filter(c => !c.parent_id && (!editingCategory || c.id !== editingCategory.id)).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name_fr}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.configuration') || "Configuration"}</label>
                                <div className="flex items-center gap-4 h-12 px-4 rounded-xl bg-muted/30 border border-border/50">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-md border-border/50 text-primary focus:ring-primary/20 accent-primary"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-foreground">{t('admin.categories.form.activateCategory') || "Activer la catégorie"}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.french') || "Français"}</label>
                                <Input value={formData.name_fr} onChange={e => setFormData({ ...formData, name_fr: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" placeholder={t('admin.categories.form.frenchPlaceholder') || "ex: Vêtements"} />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">{t('admin.categories.form.arabic') || "العربية"}</label>
                                <Input dir="rtl" value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl text-right font-black" placeholder={t('admin.categories.form.arabicPlaceholder') || "الملابس"} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.english') || "English"}</label>
                                <Input value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" placeholder={t('admin.categories.form.englishPlaceholder') || "ex: Clothing"} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.brandingLogo') || "Branding: Logo"}</label>
                                <div className="relative group w-32 h-32 rounded-[24px] border-2 border-dashed border-border/50 flex items-center justify-center overflow-hidden bg-muted/20 hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer">
                                    {previews.logo ? (
                                        <img src={previews.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="text-muted-foreground mx-auto mb-1" size={24} />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{t('admin.categories.form.upload') || "Upload"}</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'logo')} />
                                </div>
                                <div className="text-[10px] text-muted-foreground/80 space-y-1 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                                    <p>{t('admin.categories.form.logoHint') || 'Max 2MB. 512x512px recommandé.'}</p>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.categories.form.visionCover') || "Vision: Couverture"}</label>
                                <div className="relative group h-32 rounded-[24px] border-2 border-dashed border-border/50 flex items-center justify-center overflow-hidden bg-muted/20 hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer">
                                    {previews.cover ? (
                                        <img src={previews.cover} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <LayoutGrid className="text-muted-foreground mx-auto mb-1" size={24} />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{t('admin.categories.form.bannerText') || "Banner 1200x400"}</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'cover')} />
                                </div>
                                <div className="text-[10px] text-muted-foreground/80 space-y-1 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                                    <p>{t('admin.categories.form.coverHint') || 'Max 4MB. 1200x400px recommandé.'}</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={!!viewingCategory}
                    onClose={() => setViewingCategory(null)}
                    title={t('admin.categories.view.title') || "Détails Visuels"}
                    subtitle={viewingCategory?.name_fr || ""}
                    icon={ImageIcon}
                    maxWidth="max-w-3xl"
                    footer={
                        <Button variant="ghost" onClick={() => setViewingCategory(null)} className="rounded-xl font-bold bg-muted/30">
                            {t('admin.categories.view.close') || "Fermer"}
                        </Button>
                    }
                >
                    {viewingCategory && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">{t('admin.categories.view.logo') || "Logo"}</h3>
                                <div className="bg-muted/10 border-2 border-dashed border-border/50 rounded-[32px] p-8 flex items-center justify-center">
                                    {viewingCategory.logo ? (
                                        <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl">
                                            <img src={`/storage/${viewingCategory.logo}`} alt="Logo" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                                            <p className="font-bold">{t('admin.categories.table.noLogo') || "Aucun logo configuré"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">{t('admin.categories.view.cover') || "Couverture (Bannière)"}</h3>
                                <div className="bg-muted/10 border-2 border-dashed border-border/50 rounded-[32px] p-8 min-h-[250px] flex items-center justify-center">
                                    {viewingCategory.cover ? (
                                        <div className="w-full h-48 rounded-2xl overflow-hidden shadow-2xl">
                                            <img src={`/storage/${viewingCategory.cover}`} alt="Couverture" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                                            <p className="font-bold">{t('admin.categories.table.noCover') || "Aucune couverture configurée"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default Categories;
