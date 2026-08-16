import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, CloudUpload, Loader2, X } from 'lucide-react';

const SwatchEditor = ({ value = '', onChange, variantId = null, apiBase = '/admin/products' }) => {
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    const isColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
    const isImage = !!value && !isColor;

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !variantId) return;
        const fd = new FormData();
        fd.append('image', file);
        setUploading(true);
        try {
            const res = await api.post(`${apiBase}/variants/${variantId}/icon`, fd);
            onChange(res.data.option_value || '');
        } catch {
            showToast(t('admin.variants.messages.uploadError'), 'error');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-lg border-2 border-border/50 flex items-center justify-center overflow-hidden shrink-0 bg-card">
                {isColor ? (
                    <div className="w-full h-full" style={{ backgroundColor: value }} />
                ) : isImage ? (
                    <img src={value} alt="" className="w-full h-full object-cover" />
                ) : (
                    <Palette size={14} className="text-muted-foreground/50" />
                )}
            </div>

            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={t('admin.variants.optionValuePlaceholder')}
                className="h-9 bg-card rounded-xl font-bold text-xs border-border/60"
            />

            <div className="relative shrink-0">
                <input
                    type="color"
                    value={isColor ? value : '#000000'}
                    onChange={e => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button size="iconsm" variant="outline" rounded="lg" type="button">
                    <Palette />
                </Button>
            </div>

            {variantId && (
                <>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <Button size="iconsm" variant="outline" type="button" onClick={() => fileRef.current?.click()} disabled={uploading} rounded="lg" className="shrink-0">
                        {uploading ? <Loader2 className="animate-spin" /> : <CloudUpload />}
                    </Button>
                </>
            )}

            {!!value && (
                <Button size="iconsm" variant="outline" rounded="lg" type="button" onClick={() => onChange('')}>
                    <X />
                </Button>
            )}
        </div>
    );
};

export default SwatchEditor;
