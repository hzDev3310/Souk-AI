import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import api from '@/lib/api';
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Building2, Upload, Loader, CheckCircle2, AlertCircle, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoreProfile = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuth();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const [formData, setFormData] = useState({
        name_fr: '',
        name_ar: '',
        name_en: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        storePhone: '',
        address: '',
        responsibleCin: '',
        matriculeFiscale: '',
        rib: '',
        promo: '0'
    });

    const storeId = user?.store?.id;

    // Check if profile is incomplete
    const isProfileIncomplete = !user?.store?.name_en || !user?.store?.name_fr || !user?.store?.name_ar || !user?.store?.matriculeFiscale || !user?.store?.storePhone;

    useEffect(() => {
        if (storeId) {
            fetchStoreData();
        }
    }, [storeId]);

    const fetchStoreData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/store/profile`);
            const storeData = response.data?.data || response.data;
            
            if (storeData) {
                setFormData({
                    name_fr: storeData.name_fr || '',
                    name_ar: storeData.name_ar || '',
                    name_en: storeData.name_en || '',
                    description_fr: storeData.description_fr || '',
                    description_ar: storeData.description_ar || '',
                    description_en: storeData.description_en || '',
                    storePhone: storeData.storePhone || '',
                    address: storeData.address || '',
                    responsibleCin: storeData.responsibleCin || '',
                    matriculeFiscale: storeData.matriculeFiscale || '',
                    rib: storeData.rib || '',
                    promo: storeData.promo || '0'
                });

                if (storeData.logo) {
                    setLogoPreview(`/storage/${storeData.logo}`);
                }
                if (storeData.cover) {
                    setCoverPreview(`/storage/${storeData.cover}`);
                }
            }
        } catch (error) {
            console.error('Error fetching store data:', error);
            addNotification('error', t('store.profile.messages.fetchError') || 'Failed to load store data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const preview = URL.createObjectURL(file);
            setLogoPreview(preview);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const preview = URL.createObjectURL(file);
            setCoverPreview(preview);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (logoFile) {
            data.append('logo', logoFile);
        }

        if (coverFile) {
            data.append('cover', coverFile);
        }

        try {
            setSaving(true);
            const response = await api.post(`/store/profile`, data);
            
            if (response.data?.data) {
                setUser(prev => ({
                    ...prev,
                    store: {
                        ...prev?.store,
                        ...response.data.data
                    }
                }));
            }

            setLogoFile(null);
            setCoverFile(null);
            addNotification('success', t('store.profile.messages.updateSuccess') || 'Store profile updated successfully');
        } catch (error) {
            console.error('Error updating store:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const messages = Object.values(errors).flat().join('\n');
                addNotification('error', `${t('store.profile.messages.validationError') || 'Validation Error'}:\n${messages}`);
            } else {
                addNotification('error', t('store.profile.messages.updateError') || 'Failed to update store profile');
            }
        } finally {
            setSaving(false);
        }
    };

    if (!storeId) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">{t('store.profile.messages.noStore') || 'No store associated with this account.'}</p>
            </div>
        );
    }

    return (
        <AdminPageLayout
            title={t('store.profile.title') || 'Store Profile'}
            subtitle={t('store.profile.subtitle') || 'Update your store information'}
            icon={Building2}
        >
            <div className="max-w-4xl mx-auto space-y-6 text-start">
                {/* Incomplete Profile Banner */}
                <AnimatePresence>
                    {isProfileIncomplete && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold text-yellow-900 dark:text-yellow-200 text-sm">
                                    {t('store.profile.messages.incompleteProfile') || 'Complete Your Store Profile'}
                                </p>
                                <p className="text-yellow-800 dark:text-yellow-300 text-xs mt-1">
                                    {t('store.profile.messages.completeToAccess') || 'Please complete all required fields to access the full dashboard.'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    {/* Cover Header with Logo */}
                    <div className="relative mb-8 rounded-2xl ">
                        {/* Cover Image */}
                        <div className="relative h-48 bg-linear-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden">
                            {coverPreview ? (
                                <img src={coverPreview} alt="Store cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to from-primary/30 to-secondary/20">
                                    <ImagePlus size={48} className="text-muted-foreground/40" />
                                </div>
                            )}
                            
                            {/* Cover Upload Overlay */}
                            <label className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center group">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                                    <Upload size={24} className="mx-auto mb-1" />
                                    <span className="text-xs font-medium">{t('store.profile.form.uploadCover') || 'Change Cover'}</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                        </div>

                        {/* Logo Overlay */}
                        <div className="absolute -bottom-12 left-8 w-28 h-28">
                            <div className="w-full h-full bg-card border-4 border-border rounded-2xl overflow-hidden shadow-lg">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Store logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/40">
                                        <Upload size={32} className="text-muted-foreground/40" />
                                    </div>
                                )}
                                
                                {/* Logo Upload Overlay */}
                                <label className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center group">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                                        <ImagePlus size={16} />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Data Section - starts below logo */}
                    <div className="pt-16 space-y-6">
                        {/* Store Information */}
                        <CardBox className="p-8">
                            <h3 className="text-lg font-semibold mb-6 text-foreground">
                                {t('store.profile.sections.storeInfo') || 'Store Information'}
                            </h3>

                            <div className="space-y-6">
                                {/* Store Names */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name_en">{t('store.profile.form.nameEn') || 'Store Name (English)'}</Label>
                                        <Input
                                            id="name_en"
                                            name="name_en"
                                            value={formData.name_en}
                                            onChange={handleInputChange}
                                            placeholder="Store name in English"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name_fr">{t('store.profile.form.nameFr') || 'Store Name (French)'}</Label>
                                        <Input
                                            id="name_fr"
                                            name="name_fr"
                                            value={formData.name_fr}
                                            onChange={handleInputChange}
                                            placeholder="Store name in French"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name_ar">{t('store.profile.form.nameAr') || 'Store Name (Arabic)'}</Label>
                                        <Input
                                            id="name_ar"
                                            name="name_ar"
                                            value={formData.name_ar}
                                            onChange={handleInputChange}
                                            placeholder="اسم المتجر بالعربية"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                {/* Store Descriptions */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description_en">{t('store.profile.form.descriptionEn') || 'Description (English)'}</Label>
                                        <Textarea
                                            id="description_en"
                                            name="description_en"
                                            value={formData.description_en}
                                            onChange={handleInputChange}
                                            placeholder="Store description in English"
                                            rows={3}
                                            className="bg-muted/30 border-border/60 rounded-2xl resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description_fr">{t('store.profile.form.descriptionFr') || 'Description (French)'}</Label>
                                        <Textarea
                                            id="description_fr"
                                            name="description_fr"
                                            value={formData.description_fr}
                                            onChange={handleInputChange}
                                            placeholder="Store description in French"
                                            rows={3}
                                            className="bg-muted/30 border-border/60 rounded-2xl resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description_ar">{t('store.profile.form.descriptionAr') || 'Description (Arabic)'}</Label>
                                        <Textarea
                                            id="description_ar"
                                            name="description_ar"
                                            value={formData.description_ar}
                                            onChange={handleInputChange}
                                            placeholder="وصف المتجر بالعربية"
                                            rows={3}
                                            className="bg-muted/30 border-border/60 rounded-2xl resize-none"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="storePhone">{t('store.profile.form.phone') || 'Store Phone'}</Label>
                                        <Input
                                            id="storePhone"
                                            name="storePhone"
                                            type="tel"
                                            value={formData.storePhone}
                                            onChange={handleInputChange}
                                            placeholder="+1 234 567 8900"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">{t('store.profile.form.address') || 'Address'}</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Street address"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardBox>

                        {/* Business Information */}
                        <CardBox className="p-8">
                            <h3 className="text-lg font-semibold mb-6 text-foreground">
                                {t('store.profile.sections.businessInfo') || 'Business Information'}
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="responsibleCin">{t('store.profile.form.cin') || 'Responsible CIN'}</Label>
                                        <Input
                                            id="responsibleCin"
                                            name="responsibleCin"
                                            value={formData.responsibleCin}
                                            onChange={handleInputChange}
                                            placeholder="CIN number"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="matriculeFiscale">{t('store.profile.form.matriculeFiscale') || 'Matricule Fiscale'}</Label>
                                        <Input
                                            id="matriculeFiscale"
                                            name="matriculeFiscale"
                                            value={formData.matriculeFiscale}
                                            onChange={handleInputChange}
                                            placeholder="Tax ID"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rib">{t('store.profile.form.rib') || 'RIB'}</Label>
                                        <Input
                                            id="rib"
                                            name="rib"
                                            value={formData.rib}
                                            onChange={handleInputChange}
                                            placeholder="Bank account RIB"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="promo">{t('store.profile.form.promo') || 'Promotion (%)'}</Label>
                                        <Input
                                            id="promo"
                                            name="promo"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.promo}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="bg-muted/30 border-border/60 rounded-2xl h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardBox>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => fetchStoreData()}
                                disabled={saving}
                                className="rounded-xl"
                            >
                                {t('store.profile.form.cancel') || 'Cancel'}
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={saving}
                                className="rounded-xl bg-primary hover:bg-primary/90 gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        {t('store.profile.form.saving') || 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        {t('store.profile.form.save') || 'Save Changes'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
};

export default StoreProfile;
