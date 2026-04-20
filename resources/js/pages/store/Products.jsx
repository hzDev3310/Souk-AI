import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
    CheckCircle2, XCircle, Activity, Eye, Package, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoreProducts = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [quickEditData, setQuickEditData] = useState({});

    // Check if profile is incomplete
    const isProfileIncomplete = !user?.store?.name_en || !user?.store?.name_fr || !user?.store?.name_ar || !user?.store?.matriculeFiscale || !user?.store?.storePhone;

    // Redirect if profile incomplete
    useEffect(() => {
        if (isProfileIncomplete) {
            navigate('/dashboard/profile', { replace: true });
        }
    }, [isProfileIncomplete, navigate]);

    const [formData, setFormData] = useState({
        name_fr: '',
        name_ar: '',
        name_en: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        price: '',
        condition: 'NEW',
        stock: '0',
        promo: '0'
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // Get store ID from user data
    const storeId = user?.store?.id;

    useEffect(() => {
        if (storeId) {
            fetchProducts();
        }
    }, [storeId]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/store/products');
            const productsData = response.data?.data?.data || response.data?.data || response.data || [];
            setProducts(Array.isArray(productsData) ? productsData : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    const resetForm = () => {
        setFormData({
            name_fr: '',
            name_ar: '',
            name_en: '',
            description_fr: '',
            description_ar: '',
            description_en: '',
            price: '',
            condition: 'NEW',
            stock: '0',
            promo: '0'
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        imageFiles.forEach(file => {
            data.append('images[]', file);
        });

        if (editingProduct) data.append('_method', 'PUT');

        try {
            if (editingProduct) {
                await api.post(`/store/products/${editingProduct.id}`, data);
            } else {
                await api.post('/store/products', data);
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
            name_fr: product.name_fr || '',
            name_ar: product.name_ar || '',
            name_en: product.name_en || '',
            description_fr: product.description_fr || '',
            description_ar: product.description_ar || '',
            description_en: product.description_en || '',
            price: product.price || '',
            condition: product.condition || 'NEW',
            stock: product.stock || '0',
            promo: product.promo || '0'
        });

        const albumPreviews = product.albums?.map(a => `/storage/${a.file}`) || [];
        setPreviews(albumPreviews);

        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (product) => {
        if (!confirm(t('store.products.messages.confirmDelete', { name: product.name_en }) || `Confirm deletion?`)) return;
        try {
            await api.delete(`/store/products/${product.id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleQuickEdit = async (product) => {
        try {
            const data = new FormData();
            data.append('price', quickEditData[product.id]?.price || product.price);
            data.append('stock', quickEditData[product.id]?.stock || product.stock);
            data.append('_method', 'PUT');

            await api.post(`/store/products/${product.id}`, data);
            fetchProducts();
            setExpandedCardId(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (stock < 5) return { label: 'Low Stock', color: 'text-orange-500', bg: 'bg-orange-500/10' };
        return { label: `${stock} in stock`, color: 'text-green-500', bg: 'bg-green-500/10' };
    };

    const filteredProducts = products.filter(prod =>
        prod.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        prod.name_fr?.toLowerCase().includes(search.toLowerCase())
    );

    if (!storeId) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">No store associated with this account.</p>
            </div>
        );
    }

    return (
        <AdminPageLayout
            title={t('store.products.title') || "My Products"}
            subtitle={t('store.products.subtitle') || "Manage your store products"}
            icon={Box}
            onAdd={() => { 
                resetForm(); 
                setIsModalOpen(true); 
            }}
            addLabel={t('store.products.add') || "Add Product"}
        >
            <div className="space-y-6 text-start pb-24 xl:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('store.products.search') || "Search products..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-card border-border/60 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Mobile Inventory Cards View */}
                <div className="block xl:hidden space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Activity className="w-5 h-5 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-12 text-center">
                            <Box className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">{t('store.products.messages.noProducts') || "No products found"}</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredProducts.map((product, idx) => {
                                const stockStatus = getStockStatus(product.stock);
                                const isExpanded = expandedCardId === product.id;

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <div className="bg-white dark:bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            {/* Main Card Content */}
                                            <div
                                                onClick={() => setExpandedCardId(isExpanded ? null : product.id)}
                                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/40 transition-colors"
                                            >
                                                {/* Product Image */}
                                                <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                                                    {product.albums && product.albums.length > 0 ? (
                                                        <img src={`/storage/${product.albums[0].file}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src="/storage/empty/empty.webp" alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>

                                                {/* Product Info - Center */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground text-sm truncate">{product.name_fr}</p>
                                                    <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${stockStatus.bg} ${stockStatus.color}`}>
                                                        {stockStatus.label}
                                                    </div>
                                                </div>

                                                {/* Price - Right */}
                                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    <span className="font-black text-primary text-lg">${product.price}</span>
                                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Quick Edit Panel */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-t border-border/60 bg-muted/20 p-4 space-y-4"
                                                    >
                                                        {/* Quick Edit Fields */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Price</label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    defaultValue={product.price}
                                                                    onChange={(e) => setQuickEditData(prev => ({
                                                                        ...prev,
                                                                        [product.id]: { ...prev[product.id], price: e.target.value }
                                                                    }))}
                                                                    className="h-9 text-sm rounded-lg bg-card border-border/60"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Quantity</label>
                                                                <Input
                                                                    type="number"
                                                                    defaultValue={product.stock}
                                                                    onChange={(e) => setQuickEditData(prev => ({
                                                                        ...prev,
                                                                        [product.id]: { ...prev[product.id], stock: e.target.value }
                                                                    }))}
                                                                    className="h-9 text-sm rounded-lg bg-card border-border/60"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Status Toggle and Actions */}
                                                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                                                <span className="text-xs font-medium text-foreground">Published</span>
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEdit(product)}
                                                                    className="h-8 text-xs rounded-lg"
                                                                >
                                                                    <Pencil size={14} className="mr-1" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 text-xs rounded-lg bg-primary hover:bg-primary/90"
                                                                    onClick={() => handleQuickEdit(product)}
                                                                >
                                                                    <CheckCircle2 size={14} className="mr-1" />
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Desktop Table View */}
                <CardBox className="p-0 border-border/50 rounded-[32px] overflow-hidden hidden xl:block">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border/50">
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('store.products.table.nameInfo') || "PRODUCT"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('store.products.table.price') || "PRICE & STOCK"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('store.products.table.status') || "STATUS"}
                                </TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('store.products.table.actions') || "ACTIONS"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                            <Activity className="w-5 h-5 animate-spin text-primary" />
                                            {t('store.products.messages.loading') || "Loading..."}
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
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-primary">${product.price}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{product.stock} in stock</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
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
                                        {t('store.products.messages.noProducts') || "No products found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBox>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); resetForm(); }}
                    title={editingProduct ? t('store.products.edit') || "Edit Product" : t('store.products.add') || "Add Product"}
                >
                    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Product Names Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                <Package size={16} />
                                {t('store.products.form.basicInfo') || "Product Names"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/30 p-3.5 rounded-xl">
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Name (FR)</label>
                                    <Input
                                        value={formData.name_fr}
                                        onChange={(e) => setFormData({...formData, name_fr: e.target.value})}
                                        placeholder="Nom du produit"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Name (AR)</label>
                                    <Input
                                        value={formData.name_ar}
                                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                                        placeholder="اسم المنتج"
                                        dir="rtl"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Name (EN)</label>
                                    <Input
                                        value={formData.name_en}
                                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                                        placeholder="Product name"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Descriptions Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground/80">
                                {t('store.products.form.descriptions') || "Descriptions"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Description (FR)</label>
                                    <textarea
                                        value={formData.description_fr}
                                        onChange={(e) => setFormData({...formData, description_fr: e.target.value})}
                                        placeholder="Description..."
                                        className="w-full px-3 py-2 rounded-lg border border-border/60 bg-card min-h-[80px] resize-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Description (AR)</label>
                                    <textarea
                                        value={formData.description_ar}
                                        onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                                        placeholder="الوصف..."
                                        dir="rtl"
                                        className="w-full px-3 py-2 rounded-lg border border-border/60 bg-card min-h-[80px] resize-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Description (EN)</label>
                                    <textarea
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                                        placeholder="Description..."
                                        className="w-full px-3 py-2 rounded-lg border border-border/60 bg-card min-h-[80px] resize-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground/80">
                                {t('store.products.form.pricing') || "Pricing & Inventory"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/30 p-3.5 rounded-xl">
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Price</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="0.00"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Stock</label>
                                    <Input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                        placeholder="0"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Promo (%)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.promo}
                                        onChange={(e) => setFormData({...formData, promo: e.target.value})}
                                        placeholder="0"
                                        className="h-10 rounded-lg bg-card border-border/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Condition</label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                                        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-card text-sm"
                                    >
                                        <option value="NEW">New</option>
                                        <option value="USED">Used</option>
                                        <option value="REFURBISHED">Refurbished</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        {/* Images Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                <ImageIcon size={16} />
                                {t('store.products.form.images') || "Product Images"}
                            </h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-2 border-dashed border-border/60 rounded-lg cursor-pointer hover:border-primary/60 hover:bg-muted/60 transition-all">
                                    <ImageIcon size={20} className="text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-sm font-semibold text-foreground">{imageFiles.length === 0 ? 'Choose Images' : `${imageFiles.length} selected`}</span>
                                        <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {previews.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground font-semibold">Image Preview ({previews.length})</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                            {previews.map((preview, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img src={preview} alt="" className="w-full aspect-square rounded-lg object-cover border border-border/60" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFiles = imageFiles.filter((_, i) => i !== idx);
                                                            const newPreviews = previews.filter((_, i) => i !== idx);
                                                            setImageFiles(newFiles);
                                                            setPreviews(newPreviews);
                                                        }}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                            <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} className="rounded-lg">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-lg gap-2">
                                <CheckCircle2 size={18} />
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={!!viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    title={t('store.products.view') || "Product Details"}
                >
                    {viewingProduct && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden flex items-center justify-center border">
                                    {viewingProduct.albums && viewingProduct.albums.length > 0 ? (
                                        <img src={`/storage/${viewingProduct.albums[0].file}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src="/storage/empty/empty.webp" alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{viewingProduct.name_fr}</h3>
                                    <p className="text-sm text-muted-foreground">{viewingProduct.slug}</p>
                                    <p className="font-black text-primary text-xl mt-1">${viewingProduct.price}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Stock:</span>
                                    <span className="font-medium ml-2">{viewingProduct.stock}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Condition:</span>
                                    <span className="font-medium ml-2">{viewingProduct.condition}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Promo:</span>
                                    <span className="font-medium ml-2">{viewingProduct.promo}%</span>
                                </div>
                            </div>
                            {viewingProduct.description_fr && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Description:</span>
                                    <p className="text-sm mt-1">{viewingProduct.description_fr}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default StoreProducts;
