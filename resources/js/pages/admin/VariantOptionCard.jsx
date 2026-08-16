import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import {
    Save, Trash2, Image as ImageIcon, Eye, Loader2, Check, ChevronRight, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SwatchEditor from './VariantSwatch';

const VariantOptionCard = ({ node, albums = [], apiBase = '/admin/products', onChanged, onView, viewCount = 0 }) => {
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const [edit, setEdit] = useState(() => ({
        attribute_name: node.attribute_name || '',
        attribute_value: node.attribute_value || '',
        option_value: node.option_value || '',
        sku: node.sku || '',
        stock_quantity: node.stock_quantity ?? 0,
    }));
    const [saving, setSaving] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [linkingMedia, setLinkingMedia] = useState(false);
    const [linkedImages, setLinkedImages] = useState(() => (node.albums || []).map(a => a.id));
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
            await api.put(`${apiBase}/variants/${node.id}`, {
                attribute_name: payload.attribute_name.trim(),
                attribute_value: payload.attribute_value.trim(),
                option_value: payload.option_value || null,
                sku: payload.sku.trim() || null,
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
            await api.delete(`${apiBase}/variants/${node.id}`);
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
            await api.post(`${apiBase}/variants/${node.id}/images`, { image_ids: next });
        } catch (error) {
            setLinkedImages(prev => prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]);
            showToast(t('admin.variants.messages.error'), 'error');
        } finally {
            setLinkingMedia(false);
        }
    };

    const swatchUrl = edit.option_value || '';
    const isColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(swatchUrl);
    const isImage = !!swatchUrl && !isColor;

    return (
        <div className="rounded-2xl border-2 border-border/50 bg-muted/20">
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-black inline-flex items-center gap-1.5">
                        <Layers size={12} />
                        {isColor && (
                            <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: swatchUrl }} />
                        )}
                        {isImage && (
                            <img src={swatchUrl} alt="" className="w-3 h-3 rounded object-cover border border-border/40" />
                        )}
                        {edit.attribute_name || '…'}: {edit.attribute_value || '…'}
                    </span>
                    {saving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.stock')}</label>
                        <Input type="number" min="0" step="1" value={edit.stock_quantity} onChange={handleField('stock_quantity')} placeholder="0" className="h-9 bg-card rounded-xl font-bold text-xs border-border/60" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.variants.optionValue')}</label>
                    <SwatchEditor value={edit.option_value} onChange={v => {
                        setEdit(p => ({ ...p, option_value: v }));
                        clearTimeout(timerRef.current);
                        setSaving(true);
                        timerRef.current = setTimeout(() => persist({ ...edit, option_value: v }), 500);
                    }} variantId={node.id} />
                </div>

                <div className="flex items-center flex-wrap gap-2 pt-1">
                    <Tooltip content={t('admin.variants.save')}>
                        <Button size="iconsm" variant="soft" rounded="xl" color="success" onClick={handleSaveNow} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
                        </Button>
                    </Tooltip>

                    {onView && (
                        <Tooltip content={t('admin.variants.viewSubOptions')}>
                            <Button size="iconsm" variant="soft" rounded="xl" onClick={onView} className="relative">
                                <ChevronRight size={18} strokeWidth={2.5} className="rtl:rotate-180" />
                                {viewCount > 0 && (
                                    <span className="absolute -top-1 -end-1 min-w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px] font-black px-1">{viewCount}</span>
                                )}
                            </Button>
                        </Tooltip>
                    )}

                    <Tooltip content={t('admin.variants.linkImages')}>
                        <Button size="iconsm" variant="soft" rounded="xl" color="info" onClick={() => setShowMedia(v => !v)} className="relative">
                            {linkingMedia ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon size={18} strokeWidth={2.5} />}
                            {linkedImages.length > 0 && (
                                <span className="absolute -top-1 -end-1 min-w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px] font-black px-1">{linkedImages.length}</span>
                            )}
                        </Button>
                    </Tooltip>

                    <Tooltip content={t('admin.variants.delete')}>
                        <Button size="iconsm" variant="soft" rounded="xl" color="error" onClick={handleDelete}>
                            <Trash2 size={18} strokeWidth={2.5} />
                        </Button>
                    </Tooltip>
                </div>

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
        </div>
    );
};

export default VariantOptionCard;
