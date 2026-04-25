import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { Save, RefreshCcw, Palette, Image as ImageIcon, Type, Settings as SettingsIcon, Upload, CheckCircle2 } from 'lucide-react';

const Parameters = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingStates, setSavingStates] = useState({});
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/settings');
            setSettings(response.data);
        } catch (error) {
            showNotification('error', 'Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (key, value) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const saveIndividual = async (id, key, value) => {
        setSavingStates(prev => ({ ...prev, [key]: 'saving' }));
        try {
            await api.put(`/admin/settings/${id}`, { value });
            showNotification('success', `${key.replace(/_/g, ' ')} updated`);
            setSavingStates(prev => ({ ...prev, [key]: 'saved' }));
            setTimeout(() => {
                setSavingStates(prev => ({ ...prev, [key]: null }));
            }, 2000);
        } catch (error) {
            showNotification('error', 'Update failed');
            setSavingStates(prev => ({ ...prev, [key]: null }));
        }
    };

const handleImageUpload = async (id, key, file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        setSavingStates(prev => ({ ...prev, [key]: 'uploading' }));
        try {
            const response = await api.post('/admin/settings/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newPath = response.data.path;
            
            // Save the path to the setting
            await api.put(`/admin/settings/${id}`, { value: newPath });
            
            handleUpdate(key, newPath);
            showNotification('success', 'Image uploaded successfully');
            setSavingStates(prev => ({ ...prev, [key]: 'saved' }));
            setTimeout(() => {
                setSavingStates(prev => ({ ...prev, [key]: null }));
            }, 2000);
        } catch (error) {
            showNotification('error', 'Upload failed');
            setSavingStates(prev => ({ ...prev, [key]: null }));
        }
    };

    const groups = {
        branding: { label: 'Branding', icon: <ImageIcon className="w-5 h-5" /> },
        hero: { label: 'Hero Section', icon: <ImageIcon className="w-5 h-5" /> },
        design: { label: 'Design System', icon: <Palette className="w-5 h-5" /> },
        general: { label: 'General Info', icon: <SettingsIcon className="w-5 h-5" /> },
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <RefreshCcw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">Platform Parameters</h1>
                <p className="text-muted-foreground font-medium">Customize your storefront. Use <span className="text-primary font-bold">*word*</span> to highlight text in titles.</p>
            </div>

            <div className="grid gap-8">
                {Object.entries(groups).map(([groupId, group]) => (
                    <div key={groupId} className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
                        <div className="flex items-center gap-3 border-b border-border/20 pb-6">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                {group.icon}
                            </div>
                            <h2 className="text-xl font-black text-foreground">{group.label}</h2>
                        </div>

                        <div className="grid gap-x-8 gap-y-10">
                            {settings.filter(s => s.group === groupId).map(setting => (
                                <div key={setting.id} className="space-y-3 p-6 bg-muted/10 rounded-[32px] border border-transparent hover:border-border/40 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                                            {setting.key.replace(/_/g, ' ')}
                                        </label>
                                        
                                        {/* Individual Save Button */}
                                        {setting.type !== 'image' && (
                                            <button
                                                onClick={() => saveIndividual(setting.id, setting.key, setting.value)}
                                                disabled={savingStates[setting.key] === 'saving'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    savingStates[setting.key] === 'saved' 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                {savingStates[setting.key] === 'saving' ? <RefreshCcw className="w-3 h-3 animate-spin" /> : 
                                                 savingStates[setting.key] === 'saved' ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                                                {savingStates[setting.key] === 'saved' ? 'Saved' : 'Save'}
                                            </button>
                                        )}
                                    </div>
                                    
                                    {setting.type === 'image' ? (
                                        <div className="space-y-4">
                                            <div className={`relative rounded-2xl overflow-hidden bg-muted/40 border-2 border-dashed border-border/60 group-hover:border-primary/40 transition-colors ${setting.key.includes('logo') ? 'aspect-square max-w-[200px] mx-auto' : 'aspect-video'}`}>
                                                {setting.value ? (
                                                    <img
                                                        src={setting.value.startsWith('http') ? setting.value : `/storage/${setting.value}`}
                                                        className={`w-full h-full ${setting.key.includes('logo') ? 'object-contain p-4' : 'object-cover'}`}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                                                        <ImageIcon className={`${setting.key.includes('logo') ? 'w-8 h-8' : 'w-12 h-12'}`} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                                        {savingStates[setting.key] === 'uploading' ? 'Uploading...' : (setting.key.includes('logo') ? 'Change Logo' : 'Choose Image')}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => e.target.files?.[0] && handleImageUpload(setting.id, setting.key, e.target.files[0])}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-medium text-muted-foreground text-center italic text-primary bg-primary/5 p-2 rounded-xl border border-primary/10 ">
                                               {setting.key.includes('logo') ? 'Recommended: 200x200px PNG/SVG with transparent background. Max 1MB.' : 'Recommended size: 1920x1080px. Max 2MB.'}
                                            </p>
                                        </div>
                                    ) : setting.type === 'color' ? (
                                        <div className="flex gap-4 items-center">
                                            <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                                                <input
                                                    type="color"
                                                    value={setting.value || '#000000'}
                                                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                                                    className="w-full h-full scale-150 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={setting.value || ''}
                                                onChange={(e) => handleUpdate(setting.key, e.target.value)}
                                                placeholder="#HEX"
                                                className="flex-1 bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                            />
                                        </div>
                                    ) : (
                                        <textarea
                                            value={setting.value || ''}
                                            onChange={(e) => handleUpdate(setting.key, e.target.value)}
                                            rows={setting.key.includes('subtitle') ? 3 : 1}
                                            placeholder={`Ex: ${setting.key.includes('title') ? 'Discover *Unique* Style' : 'Your text here...'}`}
                                            className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Parameters;
