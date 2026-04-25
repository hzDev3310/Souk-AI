import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, Box, Image as ImageIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductEdit = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [existingImages, setExistingImages] = useState([]);

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
    const [newPreviews, setNewPreviews] = useState([]);

    useEffect(() => {
        fetchStores();
        fetchCategories();
        fetchProduct();
    }, [id]);

    const fetchStores = async () => {
        try {
            const response = await api.get('/admin/users/stores');
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
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/admin/products/${id}`);
            const product = response.data?.data || response.data;
            if (product) {
                setFormData({
                    store_id: product.store_id || '',
                    name_fr: product.name_fr || '',
                    name_ar: product.name_ar || '',
                    name_en: product.name_en || '',
                    description_fr: product.description_fr || '',
                    description_ar: product.description_ar || '',
                    description_en: product.description_en || '',
                    price: product.price || '',
                    condition: product.condition || 'NEW',
                    stock: product.stock || '0',
                    promo: product.promo || '0',
                    categories: product.categories?.map(c => c.id) || []
                });
                setExistingImages(product.albums || []);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewPreviews(previews);
    };

    const handleCategoryToggle = (catId) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(id => id !== catId)
                : [...prev.categories, catId]
        }));
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'categories') {
                data.append('categories', JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });

        // Append new images
        imageFiles.forEach(file => {
            data.append('images[]', file);
        });

        // Append remaining existing image IDs
        if (existingImages.length > 0) {
            data.append('keep_images', JSON.stringify(existingImages.map(img => img.id)));
        }

        data.append('_method', 'PUT');

        try {
            await api.post(`/admin/products/${id}`, data);
            navigate('/dashboard/products');
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
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
                            {t('admin.products.edit.title') || 'Edit Product'}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {t('admin.products.edit.subtitle') || 'Update product details'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
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
                                required
                                className="w-full h-12 px-4 rounded-xl bg-card border border-border/60 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="">{t('admin.products.form.selectStore') || 'Select Store'}</option>
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>{store.store_name_fr || store.name}</option>
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
                                className="w-full h-12 px-4 rounded-xl bg-card border border-border/60 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="NEW">{t('admin.products.form.condNew') || 'New'}</option>
                                <option value="GOOD">{t('admin.products.form.condGood') || 'Good'}</option>
                                <option value="USED">{t('admin.products.form.condUsed') || 'Used'}</option>
                            </select>
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-bold"
                                    required
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-black text-right"
                                    required
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-bold"
                                    required
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">English</span>
                                {errors.name_en && <p className="text-red-500 text-xs">{errors.name_en[0]}</p>}
                            </div>
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-bold"
                                    required
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-bold"
                                    required
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
                                    className="h-12 bg-card border-border/60 rounded-xl font-bold"
                                />
                                <span className="text-[10px] text-muted-foreground ml-1">{t('admin.products.form.promo') || 'Promo %'}</span>
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

                    {/* Categories */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.categories') || 'Categories'}
                        </label>
                        <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-2xl border border-border/40">
                            {categories.map(cat => (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCategoryToggle(cat.id)}
                                    className={`cursor-pointer h-10 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                        formData.categories.includes(cat.id)
                                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                            : 'border-border/50 bg-card hover:bg-muted/50 hover:border-primary/50 text-foreground'
                                    }`}
                                >
                                    {cat.logo ? (
                                        <img src={`/storage/${cat.logo}`} alt="" className="w-5 h-5 rounded-[4px] object-cover" />
                                    ) : (
                                        <Box size={14} className="opacity-50" />
                                    )}
                                    <span className="text-[11px] font-black">{cat.name_fr}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {t('admin.products.form.existingImages') || 'Current Images'}
                            </label>
                            <div className="flex gap-4 flex-wrap">
                                {existingImages.map((img, idx) => (
                                    <div key={img.id} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border/50 group">
                                        <img src={`/storage/${img.file}`} className="w-full h-full object-cover" alt={`Product ${idx + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(idx)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t('admin.products.form.addImages') || 'Add New Images'}
                        </label>
                        <div className="relative border-2 border-dashed border-border/50 rounded-[24px] p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                            <ImageIcon className="text-muted-foreground mb-4" size={32} />
                            <span className="font-black text-sm">{t('admin.products.form.uploadImages') || 'Click to upload images'}</span>
                            <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (max 5MB each)</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>

                        {newPreviews.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto py-4">
                                {newPreviews.map((src, idx) => (
                                    <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border/50 flex-shrink-0">
                                        <img src={src} className="w-full h-full object-cover" alt={`New Preview ${idx + 1}`} />
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
                                t('admin.products.form.update') || 'Update Product'
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProductEdit;
