import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { GitBranch, Layers, Loader2, Package } from 'lucide-react';

const Swatch = ({ value }) => {
    if (!value) return null;
    const isColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
    return (
        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 inline-block">
            {isColor ? (
                <span className="w-full h-full rounded-full block" style={{ backgroundColor: value }} />
            ) : (
                <img src={value} alt="" className="w-full h-full rounded-full object-cover" />
            )}
        </span>
    );
};

const renderNode = (node, depth = 0) => (
    <div key={node.id} className={depth > 0 ? 'border-s-2 border-border/40 ps-3' : ''}>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 py-2">
            <span className="font-black text-sm text-foreground">
                {node.attribute_name}: {node.attribute_value}
            </span>
            {node.option_value && <Swatch value={node.option_value} />}
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {node.sku ? `SKU: ${node.sku}` : 'No SKU'}
            </span>
            <span className={`text-[10px] font-black uppercase ${Number(node.stock_quantity) > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {Number(node.stock_quantity)} in stock
            </span>
        </div>
        {Array.isArray(node.children) && node.children.length > 0 && (
            <div className="space-y-1">{node.children.map(child => renderNode(child, depth + 1))}</div>
        )}
    </div>
);

const VariantTreeView = ({ productId, apiBase = '/admin/products' }) => {
    const { t } = useTranslation();
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        api.get(`${apiBase}/${productId}/variants`)
            .then(res => { if (active) setTree(res.data || []); })
            .catch(err => { console.error('Error fetching variants:', err); if (active) setTree([]); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [productId, apiBase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                {t('admin.products.view.loadingVariants') || 'Loading variants...'}
            </div>
        );
    }

    if (!tree || tree.length === 0) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/30 text-muted-foreground font-medium text-sm">
                <Package size={16} className="opacity-60" />
                {t('admin.products.view.noVariants') || 'No variants configured for this product.'}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
                <GitBranch size={15} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {t('admin.products.view.variants') || 'Variants'}
                </span>
            </div>
            <div className="space-y-1">{tree.map(node => renderNode(node))}</div>
        </div>
    );
};

export default VariantTreeView;
