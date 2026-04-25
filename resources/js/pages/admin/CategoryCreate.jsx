import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layers, ArrowLeft, Save, ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { createFormData, prepareFormDataRequest } from '@/services/apiService';

const CategoryCreate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
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
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const response = await api.get('/admin/categories/all');
            setAllCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        const data = createFormData(formData, { logo: logoFile, cover: coverFile });
        const cleanup = prepareFormDataRequest();

        try {
            await api.post('/admin/categories', data);
            cleanup.restore();
            navigate('/dashboard/categories');
        } catch (error) {
            cleanup.restore();
            console.error('Error creating category:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.message || t('admin.categories.messages.errorCreating'));
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 4 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(t('admin.categories.messages.fileTooLarge', { size: maxSize / (1024 * 1024) }));
            return;
        }

        if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/categories')} className="h-10 w-10 rounded-xl">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">{t('admin.categories.form.addTitle') || 'Create Category'}</h1>
                    <p className="text-sm text-muted-foreground font-medium">Add a new product category</p>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <CardBox className="p-8 border-border/50 rounded-[32px]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                                Basic Information
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.form.nameFr')} *</Label>
                                    <Input required value={formData.name_fr} onChange={(e) => handleChange('name_fr', e.target.value)} className="h-12 bg-muted/30 border-border/50 rounded-xl" />
                                    {errors.name_fr && <p className="text-xs text-red-500">{errors.name_fr[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.form.nameAr')} *</Label>
                                    <Input required value={formData.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} className="h-12 bg-muted/30 border-border/50 rounded-xl text-end" dir="rtl" />
                                    {errors.name_ar && <p className="text-xs text-red-500">{errors.name_ar[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.categories.form.nameEn')} *</Label>
                                    <Input required value={formData.name_en} onChange={(e) => handleChange('name_en', e.target.value)} className="h-12 bg-muted/30 border-border/50 rounded-xl" />
                                    {errors.name_en && <p className="text-xs text-red-500">{errors.name_en[0]}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parent Category</Label>
                                    <select value={formData.parent_id} onChange={(e) => handleChange('parent_id', e.target.value)} className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl px-4">
                                        <option value="">{t('admin.categories.form.noParent') || 'No Parent (Root)'}</option>
                                        {allCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name_fr}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Icon</Label>
                                    <Input value={formData.icon} onChange={(e) => handleChange('icon', e.target.value)} placeholder="e.g. tag, box, etc." className="h-12 bg-muted/30 border-border/50 rounded-xl" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch checked={formData.isActive} onCheckedChange={(checked) => handleChange('isActive', checked)} />
                                <Label className="text-sm font-medium">{t('admin.categories.form.isActive') || 'Active'}</Label>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Images</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logo (max 2MB)</Label>
                                    <div className="relative border-2 border-dashed border-border/50 rounded-2xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                                        ) : (
                                            <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cover (max 4MB)</Label>
                                    <div className="relative border-2 border-dashed border-border/50 rounded-2xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer h-32">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mt-8" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
                            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/categories')} className="h-12 px-6 rounded-xl font-bold">
                                {t('common.cancel') || 'Cancel'}
                            </Button>
                            <Button type="submit" disabled={saving} className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all">
                                {saving ? 'Creating...' : <><Save size={18} className="mr-2" /> {t('common.create') || 'Create'}</>}
                            </Button>
                        </div>
                    </form>
                </CardBox>
            </motion.div>
        </div>
    );
};

export default CategoryCreate;
