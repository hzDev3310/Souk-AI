import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, Box, Image as ImageIcon, Activity } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { validateImageFile } from '@/utils/imageUploadValidation';

const validateForm = (formData, imageFiles, fileErrors) => {
    const errs = {};

    if (fileErrors.length > 0) {
        errs.images = fileErrors;
    }

    if (!formData.store_id) {
        errs.store_id = ['Please select a store.'];
    }

    if (!formData.name_fr || !formData.name_fr.trim()) {
        errs.name_fr = ['Product name (French) is required.'];
    } else if (formData.name_fr.length > 255) {
        errs.name_fr = ['Product name (French) must not exceed 255 characters.'];
    }

    if (!formData.name_ar || !formData.name_ar.trim()) {
        errs.name_ar = ['Product name (Arabic) is required.'];
    } else if (formData.name_ar.length > 255) {
        errs.name_ar = ['Product name (Arabic) must not exceed 255 characters.'];
    }

    if (!formData.name_en || !formData.name_en.trim()) {
        errs.name_en = ['Product name (English) is required.'];
    } else if (formData.name_en.length > 255) {
        errs.name_en = ['Product name (English) must not exceed 255 characters.'];
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        errs.price = ['Please enter a valid price (0 or greater).'];
    }

    if (!['NEW', 'GOOD', 'USED'].includes(formData.condition)) {
        errs.condition = ['Please select a valid condition.'];
    }

    if (formData.stock === '' || formData.stock === null || isNaN(Number(formData.stock)) || !Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
        errs.stock = ['Please enter a valid stock quantity (non-negative integer).'];
    }

    if (formData.promo && (isNaN(Number(formData.promo)) || Number(formData.promo) < 0 || Number(formData.promo) > 100)) {
        errs.promo = ['Promo must be between 0 and 100.'];
    }

    return errs;
};

const ProductCreate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const [formData, setFormData] = useState({
        store_id: '',
        name_fr: '',
        name_ar: '',
        name_en: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        price: '',
        condition: 'NEW',
        stock: '0',
        promo: '0',
        categories: []
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);

    useEffect(() => {
        fetchStores();
        fetchCategories();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await api.get('/admin/users/stores/list');
            const storesData = response.data?.data || response.data || [];
            setStores(Array.isArray(storesData) ? storesData : []);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories/all');
            const categoriesData = response.data?.data || response.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        if (generalError) setGeneralError('');
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const validFiles = [];
        const errorsList = [];

        files.forEach((file) => {
            const validation = validateImageFile(file, { maxSizeBytes: 4 * 1024 * 1024 });
            if (!validation.isValid) {
                errorsList.push(validation.error);
            } else {
                validFiles.push(file);
            }
        });

        setFileErrors(errorsList);
        setImageFiles(validFiles);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        e.target.value = '';
    };

    const handleCategoryToggle = (catId) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(id => id !== catId)
                : [...prev.categories, catId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        const validationErrors = validateForm(formData, imageFiles, fileErrors);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'categories') {
                data.append('categories', JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });

        imageFiles.forEach(file => {
            data.append('images[]', file);
        });

        try {
            await api.post('/admin/products', data);
            navigate('/dashboard/products');
        } catch (error) {
            if (error.response?.status === 422) {
                const body = error.response.data || {};
                const errs = body.errors || {};
                setErrors(prev => ({ ...prev, ...errs }));
                if (Object.keys(errs).length > 0) {
                    const firstKey = Object.keys(errs)[0];
                    const el = document.querySelector(`[name="${firstKey}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (body.message) {
                    setGeneralError(body.message);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/products');
    };

    if (fetchingData) {
        return (
            <div className="flex items-center justify-center h-96">
                <Activity className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 text-start">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="h-10 w-10 rounded-xl"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <Package className="text-primary" size={28} />
                            {t('admin.products.create.title') || 'Add Product'}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {t('admin.products.create.subtitle') || 'Create a new product'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                    {generalError && (
                        <div className="p-4 bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-bold">{generalError}</p>
                        </div>
                    )}
                    {/* Store & Condition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {t('admin.products.form.store') || 'Store'} *
                            </label>

                            <select
                                name="store_id"
                                value={formData.store_id}
                                onChange={handleChange}
                                className={`w-full h-12 px-4 rounded-xl bg-card border font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.store_id ? 'border-red-400' : 'border-border/60'}`}
                            >
                                <option value="">{t('admin.products.form.selectStore') || 'Select Store'}</option>
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>
                                        {store.name_fr}
                                    </option>
                                ))}
                            </select>
                            {errors.store_id && <p className="text-red-500 text-xs">{errors.store_id[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {t('admin.products.form.condition') || 'Condition'}
                            </label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className={`w-full h-12 px-4 rounded-xl bg-card border font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.condition ? 'border-red-400' : 'border-border/60'}`}
                            >
                                <option value="NEW">{t('admin.products.form.condNew') || 'New'}</option>
                                <option value="GOOD">{t('admin.products.form.condGood') || 'Good'}</option>
                                <option value="USED">{t('admin.products.form.condUsed') || 'Used'}</option>
                            </select>
                            {errors.condition && <p className="text-red-500 text-xs">{errors.condition[0]}</p>}
                        </div>
                    </div>

                    {/* Product Names */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.productNames') || 'Product Names'} *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Input
                                    name="name_fr"
                                    value={formData.name_fr}
                                    onChange={handleChange}
                                    placeholder={t('admin.products.form.frenchPlaceholder') || 'Nom du produit'}
                                    className={`h-12 bg-card rounded-xl font-bold ${errors.name_fr ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">Français</span>
                                {errors.name_fr && <p className="text-red-500 text-xs">{errors.name_fr[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    name="name_ar"
                                    value={formData.name_ar}
                                    onChange={handleChange}
                                    placeholder="اسم المنتج"
                                    dir="rtl"
                                    className={`h-12 bg-card rounded-xl font-black text-right ${errors.name_ar ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1 block text-right mr-1">العربية</span>
                                {errors.name_ar && <p className="text-red-500 text-xs">{errors.name_ar[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    name="name_en"
                                    value={formData.name_en}
                                    onChange={handleChange}
                                    placeholder={t('admin.products.form.englishPlaceholder') || 'Product name'}
                                    className={`h-12 bg-card rounded-xl font-bold ${errors.name_en ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">English</span>
                                {errors.name_en && <p className="text-red-500 text-xs">{errors.name_en[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.descriptions') || 'Descriptions'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <textarea
                                name="description_fr"
                                value={formData.description_fr}
                                onChange={handleChange}
                                placeholder={t('admin.products.form.descFrPlaceholder') || 'Description en français...'}
                                className="w-full px-4 py-3 rounded-xl bg-card border border-border/60 min-h-[100px] resize-none text-sm"
                            />
                            <textarea
                                name="description_ar"
                                value={formData.description_ar}
                                onChange={handleChange}
                                placeholder="الوصف بالعربية..."
                                dir="rtl"
                                className="w-full px-4 py-3 rounded-xl bg-card border border-border/60 min-h-[100px] resize-none text-sm text-right"
                            />
                            <textarea
                                name="description_en"
                                value={formData.description_en}
                                onChange={handleChange}
                                placeholder={t('admin.products.form.descEnPlaceholder') || 'Description in English...'}
                                className="w-full px-4 py-3 rounded-xl bg-card border border-border/60 min-h-[100px] resize-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.pricing') || 'Pricing & Inventory'} *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`h-12 bg-card rounded-xl font-bold ${errors.price ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">{t('admin.products.form.price') || 'Price ($)'}</span>
                                {errors.price && <p className="text-red-500 text-xs">{errors.price[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={`h-12 bg-card rounded-xl font-bold ${errors.stock ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">{t('admin.products.form.stock') || 'Stock Quantity'}</span>
                                {errors.stock && <p className="text-red-500 text-xs">{errors.stock[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    name="promo"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.promo}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={`h-12 bg-card rounded-xl font-bold ${errors.promo ? 'border-red-400' : 'border-border/60'}`}
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">{t('admin.products.form.promo') || 'Promo %'}</span>
                                {errors.promo && <p className="text-red-500 text-xs">{errors.promo[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.categories') || 'Categories'}
                        </label>
                        <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-2xl border border-border/40">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleCategoryToggle(cat.id)}
                                    className={`cursor-pointer h-10 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.categories.includes(cat.id)
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                        : 'border-border/50 bg-card hover:bg-muted/50 hover:border-primary/50 text-foreground'
                                        }`}
                                >
                                    {cat.icon && LucideIcons[cat.icon] ? (
                                        React.createElement(LucideIcons[cat.icon], { size: 14, className: 'opacity-50' })
                                    ) : (
                                        <Box size={14} className="opacity-50" />
                                    )}
                                    <span className="text-[11px] font-black">{cat.name_fr}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.images') || 'Images'}
                        </label>
                        <div className="relative border-2 border-dashed border-border/50 rounded-[24px] p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                            <ImageIcon className="text-muted-foreground mb-4" size={32} />
                            <span className="font-black text-sm">{t('admin.products.form.uploadImages') || 'Click to upload images'}</span>
                            <span className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, WEBP, GIF, SVG. Max 4MB each</span>
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>

                        {fileErrors.length > 0 && (
                            <div className="space-y-1 mt-2">
                                {fileErrors.map((err, idx) => (
                                    <p key={idx} className="text-red-500 text-xs flex items-center gap-1">
                                        <span>•</span> {err}
                                    </p>
                                ))}
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto py-4">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border/50 flex-shrink-0">
                                        <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            className="h-12 px-6 rounded-xl font-bold"
                        >
                            {t('common.cancel') || 'Cancel'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-8 rounded-xl font-black bg-primary hover:bg-primary/90"
                        >
                            {loading ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : (
                                t('admin.products.form.create') || 'Create Product'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreate;
