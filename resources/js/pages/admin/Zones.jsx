import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Map, Plus, Pencil, Trash2, Loader, CheckCircle2, X, AlertTriangle } from 'lucide-react';

const Zones = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_fr: '', name_ar: '', governorates: [], isActive: true });
  const [formError, setFormError] = useState('');

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/zones');
      setZones(response.data.data || []);
      setGovernorates(response.data.governorates || []);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const resetForm = () => {
    setForm({ name_en: '', name_fr: '', name_ar: '', governorates: [], isActive: true });
    setFormError('');
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (zone) => {
    setEditingId(zone.id);
    setForm({
      name_en: zone.name_en || '',
      name_fr: zone.name_fr || '',
      name_ar: zone.name_ar || '',
      governorates: zone.governorates || [],
      isActive: !!zone.isActive,
    });
    setFormError('');
    setShowForm(true);
  };

  const toggleGovernorate = (code) => {
    setForm(prev => ({
      ...prev,
      governorates: prev.governorates.includes(code)
        ? prev.governorates.filter(g => g !== code)
        : [...prev.governorates, code],
    }));
  };

  const handleToggleActive = async (zone) => {
    const next = !zone.isActive;
    setZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: next } : z));
    try {
      await api.put(`/admin/zones/${zone.id}`, {
        name_en: zone.name_en,
        name_fr: zone.name_fr,
        name_ar: zone.name_ar,
        governorates: zone.governorates,
        isActive: next,
      });
    } catch (error) {
      setZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: !next } : z));
    }
  };

  const handleSave = async () => {
    if (!form.name_en || !form.name_fr || !form.name_ar) {
      setFormError(t('admin.zones.mustSelectGovernorate'));
      return;
    }
    if (form.governorates.length === 0) {
      setFormError(t('admin.zones.mustSelectGovernorate'));
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/zones/${editingId}`, form);
      } else {
        await api.post('/admin/zones', form);
      }
      await fetchZones();
      resetForm();
    } catch (error) {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' • ')
        : t('admin.zones.saveError');
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (zone) => {
    if (!window.confirm(t('admin.zones.deleteConfirm'))) return;
    setDeletingId(zone.id);
    try {
      await api.delete(`/admin/zones/${zone.id}`);
      await fetchZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const usedGovernorates = zones.flatMap(z => z.governorates || []);

  return (
    <AdminPageLayout
      title="admin.zones.title"
      subtitle="admin.zones.subtitle"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-foreground">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Map size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{t('admin.zones.title')}</h1>
              <p className="text-xs text-muted-foreground font-medium">{zones.length} {t('admin.zones.title')}</p>
            </div>
          </div>
          {!showForm && (
            <Button onClick={startCreate} className="gap-2 rounded-xl">
              <Plus size={16} />
              {t('admin.zones.add')}
            </Button>
          )}
        </div>

        {showForm && (
          <CardBox className="p-6 rounded-[32px] border-border/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-foreground">{editingId ? t('admin.zones.edit') : t('admin.zones.add')}</h3>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.zones.nameEn')}</label>
                <Input
                  value={form.name_en}
                  onChange={(e) => setForm(prev => ({ ...prev, name_en: e.target.value }))}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.zones.nameFr')}</label>
                <Input
                  value={form.name_fr}
                  onChange={(e) => setForm(prev => ({ ...prev, name_fr: e.target.value }))}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('admin.zones.nameAr')}</label>
                <Input
                  value={form.name_ar}
                  onChange={(e) => setForm(prev => ({ ...prev, name_ar: e.target.value }))}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl text-end"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 block mb-2">{t('admin.zones.governorates')}</label>
              <p className="text-[11px] text-muted-foreground mb-3">{t('admin.zones.governoratesHint')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {governorates.map(g => {
                  const selected = form.governorates.includes(g.code);
                  const usedElsewhere = usedGovernorates.includes(g.code) && !selected;
                  return (
                    <button
                      key={g.code}
                      type="button"
                      onClick={() => toggleGovernorate(g.code)}
                      disabled={usedElsewhere}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        selected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                          : usedElsewhere
                            ? 'bg-muted/20 text-muted-foreground/50 border-border/40 cursor-not-allowed'
                            : 'bg-muted/30 text-foreground border-border/50 hover:border-primary/50'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Switch size="sm" color="success" checked={form.isActive} onCheckedChange={(v) => setForm(prev => ({ ...prev, isActive: v }))} />
              <span className="text-xs font-bold text-muted-foreground">{t('admin.zones.isActive')}</span>
            </div>

            {formError && (
              <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-500 flex items-center gap-2">
                <AlertTriangle size={14} />
                {formError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={resetForm} className="rounded-xl">{t('admin.zones.cancel')}</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-xl">
                {saving ? <Loader size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {t('admin.zones.save')}
              </Button>
            </div>
          </CardBox>
        )}

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : zones.length === 0 ? (
          <div className="py-20 text-center space-y-3 glass rounded-[32px] border border-border/40">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Map size={28} />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">{t('admin.zones.noZones')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {zones.map(zone => (
              <CardBox key={zone.id} className="p-6 rounded-[32px] border-border/50">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Map size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-foreground tracking-tight truncate">{zone.name_en}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground">{zone.name_fr} · {zone.name_ar}</p>
                    </div>
                  </div>
                  <Switch size="sm" color="success" checked={!!zone.isActive} onCheckedChange={() => handleToggleActive(zone)} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(zone.governorates || []).map(g => {
                    const gov = governorates.find(x => x.code === g);
                    return (
                      <span key={g} className="px-2.5 py-1 rounded-full bg-muted/30 border border-border/40 text-[10px] font-black uppercase tracking-wider text-foreground">
                        {gov ? gov.label : g}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="soft" size="sm" className="gap-1.5 rounded-xl" onClick={() => startEdit(zone)}>
                    <Pencil size={14} />
                    {t('admin.zones.edit')}
                  </Button>
                  <Button
                    variant="soft"
                    size="sm"
                    color="danger"
                    className="gap-1.5 rounded-xl"
                    onClick={() => handleDelete(zone)}
                    disabled={deletingId === zone.id}
                  >
                    {deletingId === zone.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    {t('admin.zones.delete')}
                  </Button>
                </div>
              </CardBox>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default Zones;