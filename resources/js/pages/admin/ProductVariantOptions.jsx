import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import CardBox from '@/components/shared/CardBox';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/context/NotificationContext';
import { Layers, Plus, Loader2, Check } from 'lucide-react';
import VariantOptionCard from './VariantOptionCard';
import SwatchEditor from './VariantSwatch';

const emptyNode = () => ({
    attribute_name: '',
    attribute_value: '',
    option_value: '',
    sku: '',
    stock_quantity: 0,
});

const ProductVariantOptions = () => {
    const { id: productId, variantId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const { user } = useAuth();
    const apiBase = user?.role === 'STORE' ? '/store/products' : '/admin/products';
    const [product, setProduct] = useState(null);
    const [variant, setVariant] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newNode, setNewNode] = useState(emptyNode());
    const [creating, setCreating] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await api.get(`${apiBase}/variants/${variantId}/children`);
            setVariant(res.data.variant || null);
            setChildren(res.data.children || []);
        } catch (error) {
            console.error('Error fetching variant children:', error);
        }
    }, [variantId, apiBase]);

    useEffect(() => {
        const load = async () => {
            try {
                const [productRes, childrenRes] = await Promise.all([
                    api.get(`${apiBase}/${productId}`),
                    api.get(`${apiBase}/variants/${variantId}/children`),
                ]);
                setProduct(productRes.data);
                setVariant(childrenRes.data.variant || null);
                setChildren(childrenRes.data.children || []);
            } catch (error) {
                console.error('Error loading variant options page:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId, variantId, apiBase]);

    const openCreate = () => {
        setNewNode(emptyNode());
        setShowCreate(true);
    };

    const handleCreate = async () => {
        if (!newNode.attribute_name.trim() || !newNode.attribute_value.trim()) {
            showToast(t('admin.variants.messages.nameRequired'), 'error');
            return;
        }
        setCreating(true);
        try {
            const payload = {
                attribute_name: newNode.attribute_name.trim(),
                attribute_value: newNode.attribute_value.trim(),
                option_value: newNode.option_value || null,
                sku: newNode.sku.trim() || null,
                stock_quantity: newNode.stock_quantity === '' ? 0 : Number(newNode.stock_quantity),
                parent_ids: [variantId],
            };
            await api.post(`${apiBase}/${productId}/variants`, payload);
            setShowCreate(false);
            showToast(t('admin.variants.messages.created'), 'success');
            refresh();
        } catch (error) {
            const msg = error.response?.data?.errors?.sku?.[0] || error.response?.data?.message || t('admin.variants.messages.error');
            showToast(msg, 'error');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const label = variant
        ? `${variant.attribute_name || ''}: ${variant.attribute_value || ''}`
        : '';

    return (
        <AdminPageLayout
            title={label}
            subtitle={product?.name_fr || product?.name_en || ''}
            icon={Layers}
            onBack={() => navigate(`/dashboard/products/${productId}/variants`)}
            onAdd={openCreate}
            addLabel={t('admin.variants.addSubOption') || 'Add Sub-Option'}
        >
            <div className="space-y-6 text-start">
                {children.length === 0 ? (
                    <CardBox className="p-10 rounded-[32px]">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Layers className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-black text-foreground">{t('admin.variants.noChildren')}</h3>
                            <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">{t('admin.variants.noChildrenSubtitle')}</p>
                            <Button onClick={openCreate} className="mt-4 rounded-xl font-bold gap-2">
                                <Plus size={16} strokeWidth={3} />
                                {t('admin.variants.addSubOption')}
                            </Button>
                        </div>
                    </CardBox>
                ) : (
                    <div className="space-y-3">
                        {children.map(child => (
                            <VariantOptionCard
                                key={child.id}
                                node={child}
                                albums={product?.albums || []}
                                apiBase={apiBase}
                                onChanged={refresh}
                                onView={child.children_count > 0
                                    ? () => navigate(`/dashboard/products/${productId}/variants/${child.id}`)
                                    : undefined}
                                viewCount={child.children_count}
                            />
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={showCreate}
                    onClose={() => setShowCreate(false)}
                    title={t('admin.variants.createSubOption')}
                    subtitle={t('admin.variants.createSubtitle')}
                    icon={Layers}
                    maxWidth="max-w-2xl"
                    footer={
                        <div className="flex gap-3 p-6 pt-0">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setShowCreate(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button className="flex-1 h-12 rounded-xl font-bold gap-2" onClick={handleCreate} disabled={creating}>
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} strokeWidth={3} />}
                                {t('admin.variants.create')}
                            </Button>
                        </div>
                    }
                >
                    <div className="px-6 pb-6 space-y-4">
                        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-xs font-bold text-primary">
                            <Layers size={14} />
                            {t('admin.variants.underParent')}: {label}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.attributeName')}</label>
                                <Input
                                    value={newNode.attribute_name}
                                    onChange={e => setNewNode(p => ({ ...p, attribute_name: e.target.value }))}
                                    placeholder={t('admin.variants.attrNamePlaceholder')}
                                    className="h-11 bg-card rounded-xl font-bold border-border/60"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.attributeValue')}</label>
                                <Input
                                    value={newNode.attribute_value}
                                    onChange={e => setNewNode(p => ({ ...p, attribute_value: e.target.value }))}
                                    placeholder={t('admin.variants.attrValuePlaceholder')}
                                    className="h-11 bg-card rounded-xl font-bold border-border/60"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.sku')}</label>
                                <Input
                                    value={newNode.sku}
                                    onChange={e => setNewNode(p => ({ ...p, sku: e.target.value }))}
                                    placeholder="SKU-001"
                                    className="h-11 bg-card rounded-xl font-bold border-border/60"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.stock')}</label>
                                <Input
                                    type="number" min="0" step="1"
                                    value={newNode.stock_quantity}
                                    onChange={e => setNewNode(p => ({ ...p, stock_quantity: e.target.value }))}
                                    placeholder="0"
                                    className="h-11 bg-card rounded-xl font-bold border-border/60"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.optionValue')}</label>
                            <SwatchEditor value={newNode.option_value} onChange={v => setNewNode(p => ({ ...p, option_value: v }))} apiBase={apiBase} />
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default ProductVariantOptions;
