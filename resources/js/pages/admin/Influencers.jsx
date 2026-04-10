import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CardBox from '@/components/shared/CardBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, Sparkles } from 'lucide-react';

const Influencers = () => {
  const { t } = useTranslation();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    cin: '',
    rib: '',
    commissionRate: 5,
    isActive: true,
  });

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users/influencers');
      setInfluencers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInfluencer) {
        await axios.put(`/api/admin/users/influencers/${editingInfluencer.id}`, formData);
      } else {
        await axios.post('/api/admin/users/influencers', formData);
      }
      setIsDialogOpen(false);
      setEditingInfluencer(null);
      resetForm();
      fetchInfluencers();
    } catch (error) {
      console.error('Error saving influencer:', error);
      alert(error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : 'Error saving influencer');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.influencers.messages.confirmDelete'))) return;
    try {
      await axios.delete(`/api/admin/users/influencers/${id}`);
      fetchInfluencers();
    } catch (error) {
      console.error('Error deleting influencer:', error);
    }
  };

  const handleEdit = (influencer) => {
    setEditingInfluencer(influencer);
    setFormData({
      name: influencer.name || '',
      family_name: influencer.family_name || '',
      email: influencer.email || '',
      password: '',
      phone: influencer.influencer?.phone || '',
      address: influencer.influencer?.address || '',
      city: influencer.influencer?.city || '',
      cin: influencer.influencer?.cin || '',
      rib: influencer.influencer?.rib || '',
      commissionRate: influencer.influencer?.commissionRate || 5,
      isActive: influencer.influencer?.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      family_name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      cin: '',
      rib: '',
      commissionRate: 5,
      isActive: true,
    });
  };

  const handleAdd = () => {
    setEditingInfluencer(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.name?.toLowerCase().includes(search.toLowerCase()) ||
    influencer.email?.toLowerCase().includes(search.toLowerCase()) ||
    influencer.influencer?.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-link flex items-center gap-2">
            <Sparkles className="text-primary" />
            {t('admin.influencers.title')}
          </h1>
          <p className="text-darklink">{t('admin.influencers.subtitle')}</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primaryemphasis">
          <Plus size={18} className="mr-1" />
          {t('admin.influencers.add')}
        </Button>
      </div>

      {/* Search */}
      <CardBox className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darklink" size={18} />
            <Input
              placeholder={t('admin.influencers.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-dark border-darkborder text-link"
            />
          </div>
        </div>
      </CardBox>

      {/* Influencers Table */}
      <CardBox className="p-6">
        {loading ? (
          <div className="text-center py-8 text-darklink">{t('admin.common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-darkborder">
                  <TableHead className="text-darklink">{t('admin.influencers.table.name')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.influencers.table.email')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.influencers.table.phone')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.influencers.table.commission')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.influencers.table.referralCode')}</TableHead>
                  <TableHead className="text-darklink">{t('admin.influencers.table.status')}</TableHead>
                  <TableHead className="text-darklink text-right">{t('admin.influencers.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluencers.map((influencer) => (
                  <TableRow key={influencer.id} className="border-darkborder/50">
                    <TableCell className="text-link font-medium">
                      {influencer.name} {influencer.family_name}
                    </TableCell>
                    <TableCell className="text-darklink">{influencer.email}</TableCell>
                    <TableCell className="text-darklink">{influencer.influencer?.phone || '-'}</TableCell>
                    <TableCell className="text-darklink">{influencer.influencer?.commissionRate || 5}%</TableCell>
                    <TableCell className="text-darklink font-mono text-sm">
                      {influencer.influencer?.referralCode || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${influencer.influencer?.isActive ? 'bg-lightsuccess text-success' : 'bg-lighterror text-error'}`}>
                        {influencer.influencer?.isActive ? t('admin.influencers.status.active') : t('admin.influencers.status.inactive')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(influencer)}
                          className="text-primary hover:text-primaryemphasis hover:bg-lightprimary"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(influencer.id)}
                          className="text-error hover:text-erroremphasis hover:bg-lighterror"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredInfluencers.length === 0 && (
              <div className="text-center py-8 text-darklink">{t('admin.influencers.messages.noInfluencers')}</div>
            )}
          </div>
        )}
      </CardBox>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark border-darkborder max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-link">
              {editingInfluencer ? t('admin.influencers.form.editTitle') : t('admin.influencers.form.addTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.firstName')} *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.lastName')}</label>
                <Input
                  value={formData.family_name}
                  onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.influencers.form.email')} *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            {!editingInfluencer && (
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.password')} *</label>
                <Input
                  type="password"
                  required={!editingInfluencer}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.phone')}</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.city')}</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-darklink">{t('admin.influencers.form.address')}</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-dark border-darkborder text-link"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.cin')}</label>
                <Input
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.rib')}</label>
                <Input
                  value={formData.rib}
                  onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.form.commissionRate')}</label>
                <Input
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                  className="bg-dark border-darkborder text-link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-darklink">{t('admin.influencers.table.status')}</label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-3 py-2 rounded-md bg-dark border border-darkborder text-link"
                >
                  <option value="true">{t('admin.influencers.status.active')}</option>
                  <option value="false">{t('admin.influencers.status.inactive')}</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('admin.influencers.form.cancel')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primaryemphasis">
                {editingInfluencer ? t('admin.influencers.form.update') : t('admin.influencers.form.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Influencers;
