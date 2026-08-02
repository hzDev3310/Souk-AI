import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Save, Upload, Trash2, Image, RefreshCcw } from 'lucide-react';
import api from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { validateImageFile } from '../../utils/imageUploadValidation';

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇹🇳' },
];

export default function PageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState('en');
  const [page, setPage] = useState(null);
  const [contact, setContact] = useState(null);
  const [isContact, setIsContact] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/pages/${slug}`);
      setPage(data.page);
      setContact(data.contact);
      setIsContact(slug === 'contact');
    } catch {
      showNotification('error', 'Failed to load page content');
    } finally {
      setLoading(false);
    }
  }, [slug, showNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title_en: page.title_en,
        title_fr: page.title_fr,
        title_ar: page.title_ar,
        subtitle_en: page.subtitle_en,
        subtitle_fr: page.subtitle_fr,
        subtitle_ar: page.subtitle_ar,
        content_en: page.content_en,
        content_fr: page.content_fr,
        content_ar: page.content_ar,
      };
      if (isContact && contact) {
        payload.email = contact.email;
        payload.phone = contact.phone;
        payload.address_en = contact.address_en;
        payload.address_fr = contact.address_fr;
        payload.address_ar = contact.address_ar;
        payload.map_embed_url = contact.map_embed_url;
      }
      await api.put(`/admin/pages/${slug}`, payload);
      showNotification('success', 'Page updated successfully');
    } catch {
      showNotification('error', 'Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const validation = validateImageFile(file, { maxSizeBytes: 4 * 1024 * 1024 });
      if (!validation.isValid) {
        showNotification('error', validation.error);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('imageable_type', 'App\\Models\\Page');
        formData.append('imageable_id', page.id);
        const { data } = await api.post('/admin/pages/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPage(prev => ({ ...prev, images: [...prev.images, data] }));
        showNotification('success', `Image uploaded`);
      } catch {
        showNotification('error', `Failed to upload ${file.name}`);
      }
    }
    e.target.value = '';
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/pages/images/${imageId}`);
      setPage(prev => ({ ...prev, images: prev.images.filter(i => i.id !== imageId) }));
      showNotification('success', 'Image deleted');
    } catch {
      showNotification('error', 'Failed to delete image');
    }
  };

  const updateField = (field, value) => {
    setPage(prev => ({ ...prev, [field]: value }));
  };

  const updateContact = (field, value) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <RefreshCcw className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground capitalize">{slug} Page</h1>
            <p className="text-sm text-muted-foreground">Manage content in all languages</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primaryemphasis transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Locale Tabs */}
      <div className="flex gap-2 p-1 bg-muted/20 rounded-2xl w-fit">
        {LOCALES.map(loc => (
          <button
            key={loc.code}
            onClick={() => setActiveLocale(loc.code)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
              activeLocale === loc.code
                ? 'bg-primary text-white shadow-lg'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <span>{loc.flag}</span>
            <span>{loc.label}</span>
          </button>
        ))}
      </div>

      {/* Title & Subtitle */}
      <div className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
        <div className="flex items-center gap-3 border-b border-border/20 pb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground">Page Content</h2>
            <p className="text-sm text-muted-foreground">
              Editing: <span className="font-bold text-primary">{LOCALES.find(l => l.code === activeLocale)?.label}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Title ({activeLocale.toUpperCase()})
            </label>
            <input
              type="text"
              dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
              value={page?.[`title_${activeLocale}`] || ''}
              onChange={(e) => updateField(`title_${activeLocale}`, e.target.value)}
              className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
              placeholder={`Page title in ${LOCALES.find(l => l.code === activeLocale)?.label}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Subtitle ({activeLocale.toUpperCase()})
            </label>
            <input
              type="text"
              dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
              value={page?.[`subtitle_${activeLocale}`] || ''}
              onChange={(e) => updateField(`subtitle_${activeLocale}`, e.target.value)}
              className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
              placeholder={`Page subtitle in ${LOCALES.find(l => l.code === activeLocale)?.label}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Content ({activeLocale.toUpperCase()})
            </label>
            <textarea
              dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
              rows={8}
              value={page?.[`content_${activeLocale}`] || ''}
              onChange={(e) => updateField(`content_${activeLocale}`, e.target.value)}
              className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all resize-y"
              placeholder={`Page content in ${LOCALES.find(l => l.code === activeLocale)?.label}`}
            />
          </div>
        </div>
      </div>

      {/* Contact Settings (only for contact page) */}
      {isContact && contact && (
        <div className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
          <div className="flex items-center gap-3 border-b border-border/20 pb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Contact Details</h2>
              <p className="text-sm text-muted-foreground">Email, phone, address, and map</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email</label>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                placeholder="support@soukai.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone</label>
              <input
                type="text"
                value={contact.phone || ''}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                placeholder="+216 00 000 000"
              />
            </div>
          </div>

          {LOCALES.map(loc => (
            <div className="space-y-2" key={loc.code}>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Address ({loc.label})
              </label>
              <input
                type="text"
                dir={loc.code === 'ar' ? 'rtl' : 'ltr'}
                value={contact[`address_${loc.code}`] || ''}
                onChange={(e) => updateContact(`address_${loc.code}`, e.target.value)}
                className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                placeholder={`Address in ${loc.label}`}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Google Maps Embed URL
            </label>
            <input
              type="url"
              value={contact.map_embed_url || ''}
              onChange={(e) => updateContact('map_embed_url', e.target.value)}
              className="w-full bg-white dark:bg-muted/20 border border-border/40 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {page && (
        <div className="glass p-8 rounded-[40px] border border-border/40 space-y-8">
          <div className="flex items-center justify-between border-b border-border/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">Images</h2>
                <p className="text-sm text-muted-foreground">Upload and manage page images</p>
              </div>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/20 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {page.images && page.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {page.images.sort((a, b) => a.sort_order - b.sort_order).map(img => (
                <div key={img.id} className="relative group">
                  <img
                    src={`/storage/${img.image_path}`}
                    alt=""
                    className="w-full h-32 object-cover rounded-2xl border border-border/40"
                    onError={(e) => { e.target.src = 'https://media.wallmantra.com/product/original/product_placeholder.webp'; }}
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No images uploaded yet</p>
          )}
        </div>
      )}
    </div>
  );
}
