import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { RefreshCcw, Image as ImageIcon, Key, Brain, Save, CheckCircle2 } from 'lucide-react';
import { validateImageFile } from '../../utils/imageUploadValidation';

const AI_MODEL_OPTIONS = [
    { value: 'models/gemini-embedding-001', label: 'Gemini Embedding 001 (Stable)' },
    { value: 'models/gemini-embedding-exp-03-07', label: 'Gemini Embedding Exp 03-07 (Deprecated)' },
];

const Parameters = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
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

    const saveSetting = async (id, key, value) => {
        setSavingStates(prev => ({ ...prev, [key]: 'saving' }));
        try {
            await api.put(`/admin/settings/${id}`, { value });
            showNotification('success', `${key.replace(/_/g, ' ')} updated`);
            setSavingStates(prev => ({ ...prev, [key]: 'saved' }));
            setTimeout(() => setSavingStates(prev => ({ ...prev, [key]: null })), 2000);
        } catch (error) {
            showNotification('error', 'Update failed');
            setSavingStates(prev => ({ ...prev, [key]: null }));
        }
    };

    const handleImageUpload = async (id, key, file) => {
        const validation = validateImageFile(file, { maxSizeBytes: 2 * 1024 * 1024 });
        if (!validation.isValid) {
            showNotification('error', validation.error);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await api.post('/admin/settings/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newPath = response.data.path;

            await api.put(`/admin/settings/${id}`, { value: newPath });
            handleUpdate(key, newPath);
            showNotification('success', 'Logo updated successfully');
        } catch (error) {
            showNotification('error', 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const getSetting = (key) => settings.find(s => s.key === key);

    const logoSetting = getSetting('website_logo');
    const geminiKey = getSetting('gemini_api_key');
    const geminiModel = getSetting('gemini_embedding_model');
    const grokKey = getSetting('grok_api_key');

    const renderSaveButton = (setting) => {
        if (!setting) return null;
        const state = savingStates[setting.key];
        return (
            <button
                onClick={() => saveSetting(setting.id, setting.key, setting.value)}
                disabled={state === 'saving'}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    state === 'saved'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
            >
                {state === 'saving' ? <RefreshCcw className="w-3 h-3 animate-spin" /> :
                 state === 'saved' ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {state === 'saved' ? 'Saved' : 'Save'}
            </button>
        );
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
                <p className="text-muted-foreground font-medium">Manage your website logo and AI configuration.</p>
            </div>

            {/* Logo Section */}
            {logoSetting && (
                <div className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
                    <div className="flex items-center gap-3 border-b border-border/20 pb-6">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground">Website Logo</h2>
                            <p className="text-sm text-muted-foreground">Upload the main logo used in the website header and footer.</p>
                        </div>
                    </div>

                    <div className="group rounded-[32px] border border-transparent bg-muted/10 p-6 hover:border-border/40 transition-all">
                        <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden bg-muted/40 border-2 border-dashed border-border/60 group-hover:border-primary/40 transition-colors aspect-square max-w-[200px] mx-auto">
                                {logoSetting.value ? (
                                    <img
                                        src={logoSetting.value.startsWith('http') ? logoSetting.value : `/storage/${logoSetting.value}`}
                                        className="w-full h-full object-contain p-4"
                                        alt="Website Logo"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                        {uploading ? 'Uploading...' : 'Change Logo'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                            onChange={(e) => e.target.files?.[0] && handleImageUpload(logoSetting.id, logoSetting.key, e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground text-center italic text-primary bg-primary/5 p-2 rounded-xl border border-primary/10">
                                Supported: JPG, PNG, WEBP, GIF, SVG. Max 2MB.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Settings Section */}
            <div className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
                <div className="flex items-center gap-3 border-b border-border/20 pb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground">AI Settings</h2>
                        <p className="text-sm text-muted-foreground">Configure API keys and AI model for semantic search and translations.</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Gemini API Key */}
                    {geminiKey && (
                        <div className="group space-y-3 p-6 bg-muted/10 rounded-[32px] border border-transparent hover:border-border/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-muted-foreground" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        Gemini API Key
                                    </label>
                                </div>
                                {renderSaveButton(geminiKey)}
                            </div>
                            <input
                                type="password"
                                value={geminiKey.value || ''}
                                onChange={(e) => handleUpdate(geminiKey.key, e.target.value)}
                                placeholder="Enter Gemini API key"
                                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    )}

                    {/* Gemini Embedding Model */}
                    {geminiModel && (
                        <div className="group space-y-3 p-6 bg-muted/10 rounded-[32px] border border-transparent hover:border-border/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-muted-foreground" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        Embedding Model
                                    </label>
                                </div>
                                {renderSaveButton(geminiModel)}
                            </div>
                            <select
                                value={geminiModel.value || ''}
                                onChange={(e) => handleUpdate(geminiModel.key, e.target.value)}
                                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                {AI_MODEL_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Grok API Key */}
                    {grokKey && (
                        <div className="group space-y-3 p-6 bg-muted/10 rounded-[32px] border border-transparent hover:border-border/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-muted-foreground" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        Grok API Key
                                    </label>
                                </div>
                                {renderSaveButton(grokKey)}
                            </div>
                            <input
                                type="password"
                                value={grokKey.value || ''}
                                onChange={(e) => handleUpdate(grokKey.key, e.target.value)}
                                placeholder="Enter Grok API key"
                                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Parameters;
