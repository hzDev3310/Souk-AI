import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import CardBox from '@/components/shared/CardBox';
import Modal from '@/components/shared/Modal';
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
    Plus, Pencil, Trash2, Search, Box, Image as ImageIcon,
    CheckCircle2, XCircle, Activity, Eye, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);

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

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchStores();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            const productsData = response.data?.data || response.data || [];
            setProducts(Array.isArray(productsData) ? productsData : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
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

    const fetchStores = async () => {
        try {
            const response = await api.get('/admin/users/stores');
            // Support both { data: [...] } and direct array formats
            const storesData = response.data?.data || response.data || [];
            setStores(Array.isArray(storesData) ? storesData : []);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const resetForm = () => {
        setFormData({
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
        setImageFiles([]);
        setPreviews([]);
        setEditingProduct(null);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
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

        if (editingProduct) data.append('_method', 'PUT');

        try {
            if (editingProduct) {
                await api.post(`/admin/products/${editingProduct.id}`, data);
            } else {
                await api.post('/admin/products', data);
            }
            fetchProducts();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const messages = Object.values(errors).flat().join('\n');
                alert(`Validation Error:\n${messages}`);
            } else {
                alert("Error saving product. Check console.");
            }
        }
    };

    const handleEdit = (product) => {
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
            categories: product.categories || []
        });

        const albumPreviews = product.albums?.map(a => `/storage/${a.file}`) || [];
        setPreviews(albumPreviews);

        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (product) => {
        if (!confirm(t('admin.products.messages.confirmDelete', { name: product.name_en }) || `Confirm deletion?`)) return;
        try {
            await api.delete(`/admin/products/${product.id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products.filter(prod =>
        prod.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        prod.name_fr?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title={t('admin.products.title') || "Gestion des Produits"}
            subtitle={t('admin.products.subtitle') || "Manage all products"}
            icon={Box}
            onAdd={() => { resetForm(); setIsModalOpen(true); }}
            addLabel={t('admin.products.add') || "Ajouter un produit"}
        >
            <div className="space-y-6 text-start">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.products.search') || "Rechercher un produit..."}
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
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.nameInfo') || "PRODUCT / INFO"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.store') || "STORE"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.price') || "PRICE & STOCK"}</TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.actions') || "ACTIONS"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                            <Activity className="w-5 h-5 animate-spin text-primary" />
                                            {t('admin.products.messages.loading') || "Chargement..."}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group hover:bg-primary/5 border-border/40 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                                                {product.albums && product.albums.length > 0 ? (
                                                    <img src={`/storage/${product.albums[0].file}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src="/storage/empty/empty.webp" alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground tracking-tight">{product.name_fr}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{product.slug}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-bold text-muted-foreground">
                                        {product.store?.store_name_fr || "N/A"}
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-primary">${product.price}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{product.stock} {t('admin.products.table.inStock') || "in stock"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-end">
                                        <div className="flex justify-end gap-2 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/20" onClick={() => setViewingProduct(product)}>
                                                <Eye size={18} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20" onClick={() => handleEdit(product)}>
                                                <Pencil size={18} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-red-500 hover:bg-red-500/20 hover:text-red-600" onClick={() => handleDelete(product)}>
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                                        {t('admin.products.messages.noProducts') || "No products found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBox>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingProduct ? t('admin.products.form.editTitle') || "Edit Product" : t('admin.products.form.addTitle') || "New Product"}
                    subtitle={t('admin.products.form.addSubtitle') || "Fill in product details"}
                    icon={Package}
                    maxWidth="max-w-4xl"
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">
                                {t('admin.products.form.cancel') || "Cancel"}
                            </Button>
                            <Button className="bg-primary text-white rounded-xl font-black px-8" onClick={handleSubmit}>
                                {editingProduct ? t('admin.products.form.update') || "Update" : t('admin.products.form.create') || "Create"}
                            </Button>
                        </>
                    }
                >
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.store') || "Store"}</label>
                                <select
                                    className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.store_id}
                                    onChange={e => setFormData({ ...formData, store_id: e.target.value })}
                                    required
                                >
                                    <option value="">{t('admin.products.form.selectStore') || "Select Store"}</option>
                                    {stores && stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.store_name_fr}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.condition') || "Condition"}</label>
                                <select
                                    className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.condition}
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    <option value="NEW">{t('admin.products.form.condNew') || "New"}</option>
                                    <option value="GOOD">{t('admin.products.form.condGood') || "Good"}</option>
                                    <option value="USED">{t('admin.products.form.condUsed') || "Used"}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.nameFr') || "Name (FR)"}</label>
                                <Input required value={formData.name_fr} onChange={e => setFormData({ ...formData, name_fr: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">{t('admin.products.form.nameAr') || "Name (AR)"}</label>
                                <Input required dir="rtl" value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl text-right font-black" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.nameEn') || "Name (EN)"}</label>
                                <Input required value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.price') || "Price"}</label>
                                <Input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.stock') || "Stock Quantity"}</label>
                                <Input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.promo') || "Promo %"}</label>
                                <Input type="number" value={formData.promo} onChange={e => setFormData({ ...formData, promo: e.target.value })} className="h-12 bg-muted/30 border-border/50 rounded-xl font-bold" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.categories') || "Catégories"}</label>
                            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1">
                                <AnimatePresence>
                                    {categories.map(cat => (
                                        <motion.div
                                            key={cat.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleCategoryToggle(cat.id)}
                                            className={`cursor-pointer h-10 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.categories.includes(cat.id)
                                                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                    : 'border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/50 text-foreground'
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
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.products.form.images') || "Images (JPG/PNG)"}</label>
                            <div className="relative border-2 border-dashed border-border/50 rounded-[24px] p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                                <ImageIcon className="text-muted-foreground mb-4" size={32} />
                                <span className="font-black text-sm">{t('admin.products.form.uploadImages') || "Select Images"}</span>
                                <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                            </div>

                            {previews.length > 0 && (
                                <div className="flex gap-4 overflow-x-auto py-4">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border/50 flex-shrink-0">
                                            <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={!!viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    title={t('admin.products.view.title') || "Product Details"}
                    subtitle={viewingProduct?.name_fr || ""}
                    icon={Box}
                    maxWidth="max-w-3xl"
                    footer={
                        <Button variant="ghost" onClick={() => setViewingProduct(null)} className="rounded-xl font-bold bg-muted/30">
                            {t('admin.products.view.close') || "Close"}
                        </Button>
                    }
                >
                    {viewingProduct && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-black uppercase text-muted-foreground border-b border-border/50 pb-2">{t('admin.products.view.details') || "Details"}</h3>
                                    <div className="mt-4 space-y-4 font-bold">
                                        <p>Price: ${viewingProduct.price}</p>
                                        <p>Stock: {viewingProduct.stock}</p>
                                        <p>Condition: {viewingProduct.condition}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase text-muted-foreground border-b border-border/50 pb-2">{t('admin.products.view.images') || "Images"}</h3>
                                {viewingProduct.albums?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {viewingProduct.albums.map((a, idx) => (
                                            <div key={idx} className="w-full h-40 rounded-2xl overflow-hidden">
                                                <img src={`/storage/${a.file}`} alt="Album" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full h-40 rounded-2xl overflow-hidden">
                                        <img src="/storage/empty/empty.webp" alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default Products;
