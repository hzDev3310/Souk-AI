import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

const GovernorateSelect = ({ value, onChange, hint = true }) => {
    const { t } = useTranslation();
    const [governorates, setGovernorates] = useState([]);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        let mounted = true;
        api.get('/zones/options')
            .then(res => {
                if (!mounted) return;
                setGovernorates(res.data.governorates || []);
                setZones(res.data.zones || []);
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    const zone = zones.find(z => (z.governorates || []).includes(value));

    return (
        <>
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-11 bg-muted/30 border border-border/60 rounded-2xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
            >
                <option value="">{t('common.select') || 'Select...'}</option>
                {governorates.map(g => (
                    <option key={g.code} value={g.code}>{g.label}</option>
                ))}
            </select>
            {hint && zone && (
                <p className="text-[10px] font-black uppercase tracking-widest text-primary pt-1">
                    {t('store.profile.form.zoneOfGovernorate') || 'Delivery zone'}: {zone.name}
                </p>
            )}
        </>
    );
};

export default GovernorateSelect;