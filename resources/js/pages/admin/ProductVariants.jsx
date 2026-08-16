import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import CardBox from '@/components/shared/CardBox';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/context/NotificationContext';
import {
    GitBranch, Plus, Search, Trash2, Image as ImageIcon, Save, Check,
    Loader2, Layers, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const emptyNode = () => ({
    attribute_name: '',
    attribute_value: '',
    sku: '',
    price_override: '',
    stock_quantity: 0,
    parent_ids: [],
});

const collectDescendantIds = (nodes, targetId, found = new Set()) => {
    for (const node of nodes) {
        if (targetId === null) {
            found.add(node.id);
            collectDescendantIds(node.children || [], null, found);
        } else if (node.id === targetId) {
            collectDescendantIds(node.children || [], null, found);
        } else {
            collectDescendantIds(node.children || [], targetId, found);
        }
    }
    return found;
};

const ParentPicker = ({ options, selected, onChange, excludeIds = [], t }) => {
    const [query, setQuery] = useState('');
    const filtered = options.filter(o =>
        !excludeIds.includes(o.id) &&
        (o.attribute_value || '').toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('admin.variants.searchParent')}
                    className="pl-9 h-10 bg-muted/30 rounded-xl font-bold text-xs border-border/60"
                />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {filtered.length === 0 && (
                    <p className="text-xs text-muted-foreground font-medium py-3 text-center">
                        {t('admin.variants.noParents')}
                    </p>
                )}
                {filtered.map(option => {
                    const active = selected.includes(option.id);
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onChange(option.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition-all text-start',
                                active ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/50'
                            )}
                        >
                            <span className={cn(
                                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                                active ? 'bg-primary border-primary text-white' : 'border-muted-foreground/40'
                            )}>
                                {active && <Check size={12} strokeWidth={4} />}
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs font-black text-foreground truncate">
                                    {option.attribute_name ? `${option.attribute_name}: ` : ''}{option.attribute_value}
                                </span>
                                {option.sku && (
                                    <span className="block text-[10px] font-bold text-muted-foreground truncate">SKU: {option.sku}</span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const TreeNode = ({ node, depth = 0, options, albums, onChanged, onAddChild }) => {
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const [edit, setEdit] = useState(() => ({
        attribute_name: node.attribute_name || '',
        attribute_value: node.attribute_value || '',
        sku: node.sku || '',
        price_override: node.price_override ?? '',
        stock_quantity: node.stock_quantity ?? 0,
    }));
    const [saving, setSaving] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [linkingMedia, setLinkingMedia] = useState(false);
    const [showParents, setShowParents] = useState(false);
    const [linkedImages, setLinkedImages] = useState(() => (node.albums || []).map(a => a.id));
    const [parentIds, setParentIds] = useState(() => (node.parent_ids || []));
    const timerRef = useRef(null);

    const handleField = (field) => (e) => {
        const value = e.target.value;
        setEdit(prev => ({ ...prev, [field]: value }));
        clearTimeout(timerRef.current);
        setSaving(true);
        timerRef.current = setTimeout(() => persist({ ...edit, [field]: value }), 500);
    };

    const persist = async (payload) => {
        try {
            await api.put(`/admin/products/variants/${node.id}`, {
                attribute_name: payload.attribute_name.trim(),
                attribute_value: payload.attribute_value.trim(),
                sku: payload.sku.trim() || null,
                price_override: payload.price_override === '' || payload.price_override === null ? null : Number(payload.price_override),
                stock_quantity: payload.stock_quantity === '' ? 0 : Number(payload.stock_quantity),
            });
            showToast(t('admin.variants.messages.saved'), 'success');
            onChanged();
        } catch (error) {
            const msg = error.response?.data?.errors?.sku?.[0]
                || error.response?.data?.message
                || t('admin.variants.messages.error');
            showToast(msg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNow = () => {
        clearTimeout(timerRef.current);
        persist(edit);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/products/variants/${node.id}`);
            showToast(t('admin.variants.messages.deleted'), 'success');
            onChanged();
        } catch (error) {
            showToast(t('admin.variants.messages.error'), 'error');
        }
    };

    const toggleImage = async (imageId) => {
        const next = linkedImages.includes(imageId)
            ? linkedImages.filter(id => id !== imageId)
            : [...linkedImages, imageId];
        setLinkedImages(next);
        setLinkingMedia(true);
        try {
            await api.post(`/admin/products/variants/${node.id}/images`, { image_ids: next });
        } catch (error) {
            setLinkedImages(prev => prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]);
            showToast(t('admin.variants.messages.error'), 'error');
        } finally {
            setLinkingMedia(false);
        }
    };

    const toggleParent = async (parentId) => {
        const next = parentIds.includes(parentId)
            ? parentIds.filter(id => id !== parentId)
            : [...parentIds, parentId];
        setParentIds(next);
        try {
            await api.put(`/admin/products/variants/${node.id}`, {
                attribute_name: edit.attribute_name.trim(),
                attribute_value: edit.attribute_value.trim(),
                sku: edit.sku.trim() || null,
                price_override: edit.price_override === '' ? null : Number(edit.price_override),
                stock_quantity: edit.stock_quantity === '' ? 0 : Number(edit.stock_quantity),
                parent_ids: next,
            });
            showToast(t('admin.variants.messages.linksUpdated'), 'success');
            onChanged();
        } catch (error) {
            setParentIds(prev => prev.includes(parentId) ? prev.filter(id => id !== parentId) : [...prev, parentId]);
            showToast(error.response?.data?.message || t('admin.variants.messages.error'), 'error');
        }
    };

    const children = node.children || [];
    const hasChildren = children.length > 0;

    return (
        <div className={cn('rounded-2xl border-2 transition-colors', hasChildren ? 'border-primary/20 bg-primary/[0.03]' : 'border-border/50 bg-muted/20')}>
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-black inline-flex items-center gap-1.5">
                            <Layers size={12} />
                            {edit.attribute_name || '…'}: {edit.attribute_value || '…'}
                        </span>
                        {(node.parent_ids || []).length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowParents(v => !v)}
                                className="px-2 py-1.5 bg-muted/40 text-muted-foreground rounded-lg text-[10px] font-black inline-flex items-center gap-1 hover:border-primary/50 border border-transparent transition-colors"
                            >
                                <GitBranch size={11} />
                                {t('admin.variants.parents')}: {(node.parent_ids || []).length}
                            </button>
                        )}
                        {saving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    </div>
                    <Button type="button" size="xxs" variant="soft" color="error" rounded="lg" onClick={handleDelete}>
                        <Trash2 size={13} />
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.attributeName')}</label>
                        <Input value={edit.attribute_name} onChange={handleField('attribute_name')} placeholder={t('admin.variants.attrNamePlaceholder')} className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.attributeValue')}</label>
                        <Input value={edit.attribute_value} onChange={handleField('attribute_value')} placeholder={t('admin.variants.attrValuePlaceholder')} className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.sku')}</label>
                        <Input value={edit.sku} onChange={handleField('sku')} placeholder="SKU-001" className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.price')}</label>
                        <Input type="number" min="0" step="0.01" value={edit.price_override} onChange={handleField('price_override')} placeholder="0.00" className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.stock')}</label>
                        <Input type="number" min="0" step="1" value={edit.stock_quantity} onChange={handleField('stock_quantity')} placeholder="0" className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 pt-1">
                    <Button type="button" size="xxs" variant="outline" onClick={handleSaveNow} disabled={saving} className="rounded-lg font-bold text-[10px] gap-1">
                        <Save size={11} />
                        {t('admin.variants.save')}
                    </Button>
                    <Button type="button" size="xxs" variant="outline" onClick={() => onAddChild(node)} className="rounded-lg font-bold text-[10px] gap-1">
                        <Plus size={11} strokeWidth={3} />
                        {t('admin.variants.addSubOption')}
                    </Button>
                    <Button type="button" size="xxs" variant="outline" onClick={() => setShowParents(v => !v)} className="rounded-lg font-bold text-[10px] gap-1">
                        <GitBranch size={11} />
                        {t('admin.variants.linkParents')}
                    </Button>
                    <Button type="button" size="xxs" variant="outline" onClick={() => setShowMedia(v => !v)} className="rounded-lg font-bold text-[10px] gap-1">
                        {linkingMedia ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon size={11} />}
                        {t('admin.variants.linkImages')}
                        {linkedImages.length > 0 && (
                            <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px] font-black">{linkedImages.length}</span>
                        )}
                    </Button>
                </div>

                {showParents && (
                    <div className="rounded-xl border-2 border-border/40 bg-card p-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {t('admin.variants.linkParents')}
                        </p>
                        <ParentPicker
                            options={options}
                            selected={parentIds}
                            onChange={toggleParent}
                            excludeIds={[node.id, ...Array.from(collectDescendantIds([node], node.id))]}
                            t={t}
                        />
                    </div>
                )}

                {showMedia && (
                    <div className="rounded-xl border-2 border-border/40 bg-card p-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {t('admin.variants.linkImages')}
                        </p>
                        {albums.length === 0 ? (
                            <p className="text-xs text-muted-foreground font-medium">{t('admin.variants.noImages')}</p>
                        ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {albums.map(album => {
                                    const active = linkedImages.includes(album.id);
                                    return (
                                        <button
                                            key={album.id}
                                            type="button"
                                            onClick={() => toggleImage(album.id)}
                                            className={cn(
                                                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                                                active ? 'border-primary ring-2 ring-primary/30' : 'border-border/40 hover:border-primary/50'
                                            )}
                                        >
                                            <img src={album.file} className="w-full h-full object-cover" alt="" />
                                            {active && (
                                                <span className="absolute top-0.5 end-0.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                                                    <Check size={10} strokeWidth={4} />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {hasChildren && (
                <div className="px-4 pb-4 space-y-3" style={{ marginInlineStart: depth === 0 ? 0 : 12 }}>
                    {children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            options={options}
                            albums={albums}
                            onChanged={onChanged}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductVariants = () => {
    const { id: productId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const [product, setProduct] = useState(null);
    const [tree, setTree] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [createParentId, setCreateParentId] = useState(null);
    const [newNode, setNewNode] = useState(emptyNode());
    const [creating, setCreating] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const [treeRes, optionsRes] = await Promise.all([
                api.get(`/admin/products/${productId}/variants`),
                api.get(`/admin/products/${productId}/variants/options`),
            ]);
            setTree(treeRes.data || []);
            setOptions(optionsRes.data || []);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    }, [productId]);

    useEffect(() => {
        const load = async () => {
            try {
                const [productRes, treeRes, optionsRes] = await Promise.all([
                    api.get(`/admin/products/${productId}`),
                    api.get(`/admin/products/${productId}/variants`),
                    api.get(`/admin/products/${productId}/variants/options`),
                ]);
                setProduct(productRes.data);
                setTree(treeRes.data || []);
                setOptions(optionsRes.data || []);
            } catch (error) {
                console.error('Error loading variants page:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId]);

    const openCreate = (parent = null) => {
        setNewNode(emptyNode());
        setCreateParentId(parent ? parent.id : null);
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
                sku: newNode.sku.trim() || null,
                price_override: newNode.price_override === '' ? null : Number(newNode.price_override),
                stock_quantity: newNode.stock_quantity === '' ? 0 : Number(newNode.stock_quantity),
                parent_ids: newNode.parent_ids,
            };
            await api.post(`/admin/products/${productId}/variants`, payload);
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

    const toggleCreateParent = (id) => {
        setNewNode(prev => ({
            ...prev,
            parent_ids: prev.parent_ids.includes(id)
                ? prev.parent_ids.filter(p => p !== id)
                : [...prev.parent_ids, id],
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AdminPageLayout
            title={t('admin.variants.title') || 'Variants'}
            subtitle={product?.name_fr || product?.name_en || ''}
            icon={GitBranch}
            onBack={() => navigate(`/dashboard/products/${productId}/edit`)}
            onAdd={() => openCreate()}
            addLabel={t('admin.variants.addVariant') || 'Add Variant'}
        >
            <div className="space-y-6 text-start">
                {tree.length === 0 ? (
                    <CardBox className="p-10 rounded-[32px]">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <GitBranch className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-black text-foreground">{t('admin.variants.empty')}</h3>
                            <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">{t('admin.variants.emptySubtitle')}</p>
                            <Button onClick={() => openCreate()} className="mt-4 rounded-xl font-bold gap-2">
                                <Plus size={16} strokeWidth={3} />
                                {t('admin.variants.addVariant')}
                            </Button>
                        </div>
                    </CardBox>
                ) : (
                    <div className="space-y-3">
                        {tree.map(node => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                depth={0}
                                options={options}
                                albums={product?.albums || []}
                                onChanged={refresh}
                                onAddChild={openCreate}
                            />
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={showCreate}
                    onClose={() => setShowCreate(false)}
                    title={createParentId
                        ? t('admin.variants.createSubOption')
                        : t('admin.variants.addVariant')}
                    subtitle={t('admin.variants.createSubtitle')}
                    icon={GitBranch}
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
                        {createParentId && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-xs font-bold text-primary">
                                <ChevronRight size={14} />
                                {t('admin.variants.underParent')}: {options.find(o => o.id === createParentId)?.attribute_value || ''}
                            </div>
                        )}
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.price')}</label>
                                <Input
                                    type="number" min="0" step="0.01"
                                    value={newNode.price_override}
                                    onChange={e => setNewNode(p => ({ ...p, price_override: e.target.value }))}
                                    placeholder="0.00"
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
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {t('admin.variants.selectParents')}
                            </p>
                            <ParentPicker
                                options={options}
                                selected={newNode.parent_ids}
                                onChange={toggleCreateParent}
                                excludeIds={createParentId ? [createParentId] : []}
                                t={t}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminPageLayout>
    );
};

export default ProductVariants;
