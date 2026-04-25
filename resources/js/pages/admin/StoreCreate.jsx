import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    name_fr: '',
    name_ar: '',
    name_en: '',
    storePhone: '',
    address: '',
    matriculeFiscale: '',
    rib: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/users/stores', formData);
      navigate('/dashboard/stores');
    } catch (error) {
      console.error('Error saving store:', error);
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;
      if (errors) {
        const errorText = Object.entries(errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join('\n');
        alert(t('admin.stores.messages.validationError') + '\n\n' + errorText);
      } else if (message) {
        alert(message);
      } else {
        alert(t('admin.stores.messages.errorSaving'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/stores')}
          className="h-10 w-10 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{t('admin.stores.form.addTitle')}</h1>
          <p className="text-sm text-muted-foreground font-medium">Create a new partner store</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CardBox className="p-8 border-border/50 rounded-[32px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Owner Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                Owner Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.ownerFirstName')} *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.ownerLastName')}
                  </label>
                  <Input
                    value={formData.family_name}
                    onChange={(e) => handleChange('family_name', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.email')} *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.password')} *
                  </label>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                Store Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.storeNameFr')}
                  </label>
                  <Input
                    value={formData.name_fr}
                    onChange={(e) => handleChange('name_fr', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.storeNameAr')}
                  </label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => handleChange('name_ar', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl text-end"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.storeNameEn')}
                  </label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => handleChange('name_en', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.storePhone')}
                  </label>
                  <Input
                    value={formData.storePhone}
                    onChange={(e) => handleChange('storePhone', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  {t('admin.stores.form.address')}
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl"
                />
              </div>
            </div>

            {/* Legal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                Legal Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.matriculeFiscale')}
                  </label>
                  <Input
                    value={formData.matriculeFiscale}
                    onChange={(e) => handleChange('matriculeFiscale', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t('admin.stores.form.rib')}
                  </label>
                  <Input
                    value={formData.rib}
                    onChange={(e) => handleChange('rib', e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard/stores')}
                className="h-12 px-6 rounded-xl font-bold"
              >
                {t('admin.stores.form.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primaryemphasis transition-all"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⋯</span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    {t('admin.stores.form.create')}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardBox>
      </motion.div>
    </div>
  );
};

export default StoreCreate;
