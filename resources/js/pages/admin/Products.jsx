import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
    Activity, Eye, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewingProduct, setViewingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
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

    const handleDelete = async (product) => {
        if (!confirm(t('admin.products.messages.confirmDelete', { name: product.name_en }) || `Confirm deletion?`)) return;
        try {
            await api.delete(`/admin/products/${product.id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleAdd = () => {
        navigate('/dashboard/products/create');
    };

    const handleEdit = (product) => {
        navigate(`/dashboard/products/${product.id}/edit`);
    };

    const filteredProducts = products.filter(prod =>
        prod.name_en?.toLowerCase().includes(search.toLowerCase()) ||
        prod.name_fr?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminPageLayout
            title={t('admin.products.title') || "Products"}
            subtitle={t('admin.products.subtitle') || "Manage all products"}
            icon={Box}
            onAdd={handleAdd}
            addLabel={t('admin.products.add') || "Add Product"}
        >
            <div className="space-y-6 text-start">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder={t('admin.products.search') || "Search products..."}
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
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.product') || "PRODUCT"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.store') || "STORE"}</TableHead>
                                <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.price') || "PRICE"}</TableHead>
                                <TableHead className="py-5 px-6 text-end text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.products.table.actions') || "ACTIONS"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                                                <Activity className="w-5 h-5 animate-spin text-primary" />
                                                {t('admin.common.loading')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredProducts.map((product) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group hover:bg-primary/5 border-border/40 transition-colors"
                                    >
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
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{product.stock} in stock</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-end">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
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

                {/* View Modal */}
                <Modal
                    isOpen={!!viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    title={t('admin.products.view.title') || "Product Details"}
                    subtitle={viewingProduct?.name_fr || ""}
                    icon={Package}
                    maxWidth="max-w-3xl"
                    footer={
                        <Button variant="ghost" onClick={() => setViewingProduct(null)} className="rounded-xl font-bold bg-muted/30">
                            {t('admin.products.view.close') || "Close"}
                        </Button>
                    }
                >
                    {viewingProduct && (
                        <div className="space-y-8 text-start">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-black uppercase text-muted-foreground border-b border-border/50 pb-2">{t('admin.products.view.details') || "Details"}</h3>
                                    <div className="mt-4 space-y-4 font-bold">
                                        <p>Price: ${viewingProduct.price}</p>
                                        <p>Stock: {viewingProduct.stock}</p>
                                        <p>Condition: {viewingProduct.condition}</p>
                                        <p>Store: {viewingProduct.store?.store_name_fr || 'N/A'}</p>
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
